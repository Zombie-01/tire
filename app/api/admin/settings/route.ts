import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = createSupabaseServer();
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) {
      console.error("Error fetching settings:", error);
      return NextResponse.json([], { status: 500 });
    }
    return NextResponse.json(data || []);
  } catch (error) {
    console.error(error);
    return NextResponse.json([], { status: 500 });
  }
}
