import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const supabase = createSupabaseServer();

    const { data, error } = await supabase
      .from("settings")
      .update({ value: body.value, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("Error updating setting:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ setting: data?.[0] ?? null });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
