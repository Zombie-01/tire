import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = createSupabaseServer();
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      console.error("Error fetching banners:", error);
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

    const { data, error } = await supabase.from("banners").insert({
      title: body.title,
      subtitle: body.subtitle,
      image: body.image,
      cta: body.cta,
      is_active: body.is_active ?? true,
      order_index: body.order_index ?? 0,
    });

    if (error) {
      console.error("Error creating banner:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ banner: data?.[0] ?? null }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
