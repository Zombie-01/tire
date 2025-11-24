import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = createSupabaseServer();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ session: null, profile: null });
    }

    const { data: profile } = await supabase
      .from("users")
      .select("id, name, email, role")
      .eq("id", session.user.id)
      .single();

    return NextResponse.json({ session, profile });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ session: null, profile: null }, { status: 500 });
  }
}
