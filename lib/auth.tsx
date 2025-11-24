"use server";

// Server-side helpers that call the internal auth API routes. These keep server
// code using a single API surface (`/api/auth/*`) while avoiding direct
// supabase client usage inside client bundles.

export async function loginAction(email: string, password: string) {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) return { success: false };
    const body = await res.json();
    return { success: true, session: body.session };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
}

export async function registerAction(
  name: string,
  email: string,
  password: string
) {
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { success: false, message: body?.error };
    }

    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, message: "Unexpected error" };
  }
}
