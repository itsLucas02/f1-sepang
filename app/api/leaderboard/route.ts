import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const admin = createAdminClient();
  const { data: submissions, error: submissionsError } = await admin
    .from("prediction_submissions")
    .select("user_id, score")
    .eq("status", "submitted")
    .order("submitted_at", { ascending: true });

  if (submissionsError) {
    return NextResponse.json({ error: "Unable to load participants." }, { status: 500 });
  }

  const userIds = submissions.map((submission) => submission.user_id);
  const { data: profiles, error: profilesError } = userIds.length
    ? await admin.from("profiles").select("id, display_name").in("id", userIds)
    : { data: [], error: null };

  if (profilesError) {
    return NextResponse.json({ error: "Unable to load participants." }, { status: 500 });
  }

  const names = new Map(profiles.map((profile) => [profile.id, profile.display_name]));
  const participants = submissions.map((submission) => ({
    displayName: names.get(submission.user_id) ?? "Racer",
    score: submission.score,
  }));

  return NextResponse.json({ participants });
}
