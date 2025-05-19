import { createClient } from "@/utils/supabase/server";

export async function ensureUserProfile(user: {
  id: string;
  email: string;
  full_name?: string | null;
}) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!data) {
    await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      full_name: user.full_name ?? "",
      role: "admin", // atau default role lainnya
      created_at: new Date().toISOString(),
    });
  }
}
