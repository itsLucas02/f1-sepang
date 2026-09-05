-- SEPANG 56 has one global leaderboard. Private-league infrastructure is retired.

drop table if exists public.league_members;
drop table if exists public.leagues;

drop policy if exists "profiles_insert_own" on public.profiles;
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

drop policy if exists "prediction_submissions_select_own" on public.prediction_submissions;
create policy "prediction_submissions_select_own"
on public.prediction_submissions
for select
to authenticated
using ((select auth.uid()) = user_id);

create index if not exists prediction_submissions_scored_ranking_idx
on public.prediction_submissions (score desc)
where score is not null;
