"use server";

import { supabase } from "@/lib/supabase";

export async function loginAction(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { success: false, message: error.message };
  console.log("asd");
  return { success: true };
}

export async function registerAction(
  name: string,
  email: string,
  password: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });

  if (error) return { success: false, message: error.message };
  return { success: true };
}
