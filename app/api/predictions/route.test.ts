import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const completeAnswers = {
  winner: "norris",
  second: "verstappen",
  third: "leclerc",
  p1StarterWins: false,
  fastestLap: "piastri",
  rain: false,
  safetyCar: true,
  firstRetirement: "stroll",
};

type Row = Record<string, unknown> | null;

// Minimal stand-in for the Supabase query builder: every chain method returns
// the builder, and awaiting it (or .maybeSingle/.single) resolves to the row
// queued for that table.
function fakeDb(rows: Record<string, Row[]>) {
  const writes: { table: string; op: string; payload: unknown }[] = [];
  const from = (table: string) => {
    const result = () => Promise.resolve({ data: rows[table]?.shift() ?? null, error: null });
    const builder: Record<string, unknown> = {
      then: (ok: (v: unknown) => unknown, fail: (e: unknown) => unknown) => result().then(ok, fail),
      maybeSingle: result,
      single: result,
    };
    for (const method of ["select", "eq"]) builder[method] = () => builder;
    for (const op of ["insert", "update", "upsert"]) {
      builder[op] = (payload: unknown) => {
        writes.push({ table, op, payload });
        return builder;
      };
    }
    return builder;
  };
  return { from, writes };
}

let user: { id: string; user_metadata?: Record<string, unknown> } | null;
let userDb: ReturnType<typeof fakeDb>;
let adminDb: ReturnType<typeof fakeDb>;

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    auth: { getUser: async () => ({ data: { user }, error: null }) },
    from: (table: string) => userDb.from(table),
  }),
}));
vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({ from: (table: string) => adminDb.from(table) }),
}));

// PREDICTION_DEADLINE is read from env when the module loads.
async function loadRoute(deadline: string | undefined) {
  vi.resetModules();
  if (deadline === undefined) vi.stubEnv("NEXT_PUBLIC_PREDICTION_DEADLINE", undefined as unknown as string);
  else vi.stubEnv("NEXT_PUBLIC_PREDICTION_DEADLINE", deadline);
  return import("@/app/api/predictions/route");
}

const future = "2999-01-01T00:00:00.000Z";
const post = (body: unknown) =>
  new Request("http://test/api/predictions", {
    method: "POST",
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

beforeEach(() => {
  user = { id: "user-1" };
  userDb = fakeDb({});
  adminDb = fakeDb({});
});
afterEach(() => vi.unstubAllEnvs());

describe("GET /api/predictions", () => {
  it("requires a signed-in user", async () => {
    user = null;
    const { GET } = await loadRoute(future);
    const res = await GET();
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ submission: null });
  });
});

describe("POST /api/predictions", () => {
  it("returns 503 when no deadline is configured", async () => {
    const { POST } = await loadRoute(undefined);
    expect((await POST(post({ answers: completeAnswers }))).status).toBe(503);
  });

  it("returns 423 once the deadline has passed", async () => {
    const { POST } = await loadRoute("2000-01-01T00:00:00.000Z");
    expect((await POST(post({ answers: completeAnswers }))).status).toBe(423);
  });

  it("returns 401 without a signed-in user", async () => {
    user = null;
    const { POST } = await loadRoute(future);
    expect((await POST(post({ answers: completeAnswers }))).status).toBe(401);
  });

  it("returns 400 for a body that is not JSON", async () => {
    const { POST } = await loadRoute(future);
    expect((await POST(post("{not json"))).status).toBe(400);
  });

  it("returns 400 and writes nothing when picks are incomplete", async () => {
    const { POST } = await loadRoute(future);
    const sevenPicks = { ...completeAnswers, winner: undefined };
    expect((await POST(post({ answers: sevenPicks }))).status).toBe(400);
    expect(adminDb.writes).toEqual([]);
  });

  it("asks for a display name before creating a new profile", async () => {
    adminDb = fakeDb({ profiles: [null] });
    const { POST } = await loadRoute(future);
    const res = await POST(post({ answers: completeAnswers }));
    expect(res.status).toBe(409);
    expect((await res.json()).requiresDisplayName).toBe(true);
    expect(adminDb.writes).toEqual([]);
  });

  it("keeps the original submitted_at when picks are edited", async () => {
    const firstSubmit = "2026-09-01T10:00:00.000Z";
    adminDb = fakeDb({
      profiles: [{ id: "user-1" }],
      prediction_submissions: [{ submitted_at: firstSubmit }, { answers: completeAnswers }],
    });
    const { POST } = await loadRoute(future);
    const res = await POST(post({ answers: completeAnswers }));
    expect(res.status).toBe(200);
    const upsert = adminDb.writes.find((w) => w.op === "upsert");
    expect(upsert?.payload).toMatchObject({
      user_id: "user-1",
      status: "submitted",
      score: null,
      submitted_at: firstSubmit,
    });
  });
});
