import { NextResponse } from "next/server";

import {
  PREDICTION_DEADLINE,
  isPredictionLocked,
  isValidPredictionSubmission,
  parsePredictionAnswers,
} from "@/lib/predictions";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function getDisplayName(user: {
  email?: string;
  user_metadata?: Record<string, unknown>;
}) {
  const metadata = user.user_metadata ?? {};
  const fullName = metadata.full_name;
  const name = metadata.name;

  if (typeof fullName === "string" && fullName.trim()) {
    return fullName.trim();
  }

  if (typeof name === "string" && name.trim()) {
    return name.trim();
  }

  return user.email?.split("@")[0] ?? "Racer";
}

function getAvatarUrl(user: { user_metadata?: Record<string, unknown> }) {
  const metadata = user.user_metadata ?? {};
  const avatar = metadata.avatar_url ?? metadata.picture;
  return typeof avatar === "string" && avatar ? avatar : null;
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ submission: null }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("prediction_submissions")
    .select("answers, score, status, submitted_at, updated_at")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: "Unable to load prediction submission." },
      { status: 500 },
    );
  }

  return NextResponse.json({ submission: data ?? null });
}

export async function POST(request: Request) {
  if (!PREDICTION_DEADLINE) {
    return NextResponse.json(
      { error: "Prediction deadline is not configured." },
      { status: 503 },
    );
  }

  if (isPredictionLocked(PREDICTION_DEADLINE)) {
    return NextResponse.json(
      { error: "Predictions are locked for this race." },
      { status: 423 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: "Authentication is required to save picks." },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const bodyRecord =
    body && typeof body === "object" && !Array.isArray(body)
      ? (body as Record<string, unknown>)
      : {};
  const answers = parsePredictionAnswers(bodyRecord.answers);

  if (!isValidPredictionSubmission(answers)) {
    return NextResponse.json(
      { error: "All eight valid picks are required before saving." },
      { status: 400 },
    );
  }

  const admin = createAdminClient();
  const now = new Date().toISOString();

  const { error: profileError } = await admin.from("profiles").upsert(
    {
      id: user.id,
      display_name: getDisplayName(user),
      avatar_url: getAvatarUrl(user),
    },
    { onConflict: "id" },
  );

  if (profileError) {
    return NextResponse.json(
      { error: "Unable to prepare your profile." },
      { status: 500 },
    );
  }

  const { data: existing, error: existingError } = await admin
    .from("prediction_submissions")
    .select("submitted_at")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingError) {
    return NextResponse.json(
      { error: "Unable to read your existing submission." },
      { status: 500 },
    );
  }

  const { data: submission, error: saveError } = await admin
    .from("prediction_submissions")
    .upsert(
      {
        user_id: user.id,
        answers,
        score: null,
        status: "submitted",
        submitted_at: existing?.submitted_at ?? now,
        updated_at: now,
      },
      { onConflict: "user_id" },
    )
    .select("answers, score, status, submitted_at, updated_at")
    .single();

  if (saveError) {
    return NextResponse.json(
      { error: "Unable to save your picks." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    submission,
    deadlineAt: PREDICTION_DEADLINE,
  });
}
