"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import * as bcrypt from "bcrypt";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
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
      full_name: "",
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

// SIGN IN ACTION
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
          return redirect("/protected/admin/dashboard");
        default:
          return redirect("/sign-in");
      }
    }
  }

  // Default redirect jika tidak ada kondisi khusus
  return redirect("/protected/admin/dashboard");
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

// ADD STUDENT ACTION
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

  // Validate form data
  if (!nama_lengkap || !username || !password || !kelas) {
    return { error: "All fields are required" };
  }

  try {
    // Hash the password
    const password_hash = await bcrypt.hash(password, 10);

    // Insert the student data
    const { data, error } = await supabase
      .from("students")
      .insert({
        admin_id: user.id,
        nama_lengkap,
        username,
        password_hash,
        kelas,
      })
      .select();

    if (error) {
      if (error.code === "23505") {
        return { error: "Username already exists" };
      }
      return { error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { error: "An unexpected error occurred" };
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
