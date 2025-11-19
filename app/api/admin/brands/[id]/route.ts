import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const supabase = createSupabaseServer();

    const { data, error } = await supabase.from("brands").update(body).eq("id", id);

    if (error) {
      console.error("Error updating brand:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ brand: data?.[0] ?? null });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const supabase = createSupabaseServer();

    // Fetch brand to know logo path
    const { data: brandData, error: fetchError } = await supabase
      .from("brands")
      .select("id, logo")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error fetching brand before delete:", fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (brandData?.logo) {
      try {
        const filePath = brandData.logo.split("/storage/v1/object/public/brands/")[1];
        if (filePath) {
          const { error: storageError } = await supabase.storage.from("brands").remove([filePath]);
          if (storageError) console.error("Error deleting storage file:", storageError);
        }
      } catch (err) {
        console.error("Error removing brand logo:", err);
      }
    }

    const { error } = await supabase.from("brands").delete().eq("id", id);
    if (error) {
      console.error("Error deleting brand record:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
