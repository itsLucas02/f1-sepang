# Parked Next.js backend integration

SEPANG 56 is temporarily deployed as a static GitHub Pages demo.

The server-only Phase 5 files are parked here so `next build` can use `output: "export"` without trying to include runtime-only routes or Proxy behavior.

When the app moves to the VPS-backed Next.js deployment, restore:

- `backend/next/proxy.ts` -> `/proxy.ts`
- `backend/next/app/auth/callback/route.ts` -> `/app/auth/callback/route.ts`
- `backend/next/app/api/predictions/route.ts` -> `/app/api/predictions/route.ts`

Then remove `output: "export"` / GitHub Pages `basePath` behavior from `next.config.ts` and configure the production environment variables documented in `.env.example`.

The Supabase project, migration, RLS policies, and supporting `lib/supabase/*` modules remain intact while the public demo is static.
