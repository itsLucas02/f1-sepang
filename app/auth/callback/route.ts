import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

function getSafeNext(requestedNext: string | null) {
  if (!requestedNext || !requestedNext.startsWith("/") || requestedNext.startsWith("//")) {
    return "/";
  }

  return requestedNext;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = getSafeNext(requestUrl.searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";
      const origin = forwardedHost
        ? `${forwardedProto}://${forwardedHost}`
        : requestUrl.origin;

      return NextResponse.redirect(new URL(next, origin));
    }
  }

  const errorUrl = new URL("/predict/summary", requestUrl.origin);
  errorUrl.searchParams.set("auth", "error");
  return NextResponse.redirect(errorUrl);
}
