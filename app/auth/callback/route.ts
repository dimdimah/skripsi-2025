import { createClient } from "@/utils/supabase/server";
import { ensureUserProfile } from "@/lib/userProfile";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Exchange error:", error.message);
      return NextResponse.redirect(`${origin}/sign-in?error=auth_failed`);
    }

    // Dapatkan user setelah sesi ditukar
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Pastikan data user tersimpan di tabel profiles
      await ensureUserProfile({
        id: user.id,
        email: user.email ?? "",
        full_name:
          user.user_metadata.full_name || user.user_metadata.name || "",
      });
    }
  }

  return NextResponse.redirect(`${origin}${redirectTo || "/protected"}`);
}
