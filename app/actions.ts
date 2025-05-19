"use server";

import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

// AUTHENTICATION ACTIONS
export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const fullName = formData.get("full_name")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required"
    );
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (authError) {
    console.error(authError.code + " " + authError.message);
    return encodedRedirect("error", "/sign-up", authError.message);
  }

  const userId = authData.user?.id;

  if (userId) {
    const { error: profileError } = await supabase.from("profiles").insert({
      id: userId,
      email: email,
      full_name: fullName ?? "",
      role: "admin",
      created_at: new Date().toISOString(),
    });

    if (profileError) {
      console.error("Profile creation error:", profileError.message);
    }
  }

  return encodedRedirect(
    "success",
    "/sign-up",
    "Thanks for signing up! Please check your email for verification link."
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  // Melakukan sign in dengan Supabase Auth
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  // Mendapatkan user ID dari hasil sign in
  const userId = authData.user?.id;

  if (userId) {
    // Mengambil data role dari tabel profiles
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (profileError) {
      console.error("Profile fetch error:", profileError.message);
      return encodedRedirect(
        "error",
        "/sign-in",
        "Error fetching user profile"
      );
    }

    // Pengecekan role dan redirect ke halaman yang sesuai
    if (profileData && profileData.role) {
      switch (profileData.role) {
        case "admin":
          return redirect("/protected");
        default:
          return redirect("/sign-in");
      }
    }
  }

  // Default redirect jika tidak ada kondisi khusus
  return redirect("/protected");
};

// SIGN IN WITH GOOGLE ACTION
export const signInWithGoogleAction = async () => {
  const supabase = await createClient();
  const origin =
    (await headers()).get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect(data.url);
};

// FORGOT PASSWORD ACTION
export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

// RESET PASSWORD ACTION
export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed"
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

// SIGN OUT ACTION
export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

// GET USER PROFILE BY AUTH
export async function getUserProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, role")
    .eq("id", user.id)
    .single();

  return profile;
}

// Kelas actions
export async function addKelas(formData: FormData) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Anda harus login sebagai admin" };
    }

    const nama_kelas = formData.get("nama_kelas") as string;

    if (!nama_kelas || nama_kelas.trim() === "") {
      return { error: "Nama kelas harus diisi" };
    }

    const { error } = await supabase.from("kelas").insert({
      kelas_id: uuidv4(),
      id_admin: user.id,
      nama_kelas,
    });

    if (error) throw error;

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Terjadi kesalahan saat menyimpan data" };
  }
}

// Pelajaran actions
export async function addPelajaran(formData: FormData) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Anda harus login sebagai admin" };
    }

    const nama_pelajaran = formData.get("nama_pelajaran") as string;

    if (!nama_pelajaran || nama_pelajaran.trim() === "") {
      return { error: "Nama pelajaran harus diisi" };
    }

    const { error } = await supabase.from("pelajaran").insert({
      id_admin: user.id,
      nama_pelajaran,
    });

    if (error) throw error;

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Terjadi kesalahan saat menyimpan data" };
  }
}

// Students actions
export async function getKelasList() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("kelas")
      .select("kelas_id, nama_kelas");

    if (error) throw error;

    return { data };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function addStudent(formData: FormData) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to add a student" };
  }

  // Get form data
  const nama_lengkap = formData.get("nama_lengkap") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const kelas = formData.get("kelas") as string;
  const kelas_id = formData.get("kelas_id") as string;

  // Validate form data
  if (!nama_lengkap || !username || !password || (!kelas && !kelas_id)) {
    return { error: "All fields are required" };
  }

  try {
    // Hash the password
    const password_hash = await bcrypt.hash(password, 10);

    // Insert the student data
    const { data, error } = await supabase
      .from("students")
      .insert({
        admin_id: user.id, // Menggunakan admin_id sesuai struktur tabel Anda
        nama_lengkap,
        username,
        password_hash, // Menggunakan password_hash sesuai struktur tabel Anda
        kelas: kelas || undefined,
        kelas_id: kelas_id || undefined,
      })
      .select();

    if (error) {
      if (error.code === "23505") {
        return { error: "Username already exists" };
      }
      return { error: error.message };
    }

    revalidatePath("/");
    return { success: true, data };
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred" };
  }
}

export async function checkUsernameAvailability(username: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("students")
    .select("username")
    .eq("username", username)
    .maybeSingle();

  if (error) {
    return { error: error.message };
  }

  return { available: !data };
}
