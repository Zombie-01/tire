import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    const supabase = createSupabaseServer();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    if (data.user) {
      await supabase
        .from("users")
        .insert([{ id: data.user.id, name, email, role: "user" }]);
    }

    return NextResponse.json({ user: data.user });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
