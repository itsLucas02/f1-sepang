-- Phase 5: authentication + prediction persistence only.
-- League and race-result tables are added in the competition phase.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_url text,
  knowledge_level text check (knowledge_level in ('beginner', 'basics', 'fan')),
  completed_lessons text[] not null default '{}',
  visited_hotspots text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.prediction_submissions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  answers jsonb not null check (jsonb_typeof(answers) = 'object'),
  score integer check (score between 0 and 25),
  status text not null default 'submitted' check (status in ('draft', 'submitted')),
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.prediction_submissions enable row level security;

-- Profiles are user-owned. Creation is performed by the trusted server save path.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

-- Users may read their own official picks directly.
-- Writes intentionally have no authenticated RLS policy: the Next.js server endpoint
-- revalidates all eight answers and enforces the configured race deadline before
-- using the server-only Supabase secret key.
drop policy if exists "prediction_submissions_select_own" on public.prediction_submissions;
create policy "prediction_submissions_select_own"
on public.prediction_submissions
for select
to authenticated
using ((select auth.uid()) = user_id);

grant select, update on public.profiles to authenticated;
revoke insert, delete on public.profiles from authenticated;

grant select on public.prediction_submissions to authenticated;
revoke insert, update, delete on public.prediction_submissions from authenticated;
