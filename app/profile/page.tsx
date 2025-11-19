"use server";

import ProfileClient from "@/components/sections/ProfileClient";
import { createSupabaseServer } from "@/lib/supabase-server";

export default async function ProfilePage() {
  const supabase = createSupabaseServer(); // ✔ server-safe supabase

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return <ProfileClient profile={null} orders={[]} />;
  }

  const userId = session.user.id;

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return <ProfileClient profile={profile} orders={orders || []} />;
}
