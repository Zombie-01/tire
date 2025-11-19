import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = createSupabaseServer();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching products:", error);
      return NextResponse.json([], { status: 500 });
    }
    return NextResponse.json(data || []);
  } catch (err) {
    console.error(err);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabase = createSupabaseServer();
    const { data, error } = await supabase
      .from("products")
      .insert([body])
      .select()
      .single();
    if (error) {
      console.error("Error creating product:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ product: data }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
