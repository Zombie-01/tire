import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = createSupabaseServer();
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching brands:", error);
      return NextResponse.json([], { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error(error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabase = createSupabaseServer();

    const { data, error } = await supabase.from("brands").insert({
      name: body.name,
      description: body.description,
      logo: body.logo,
      is_active: body.is_active ?? true,
    });

    if (error) {
      console.error("Error creating brand:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ brand: data?.[0] ?? null }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
