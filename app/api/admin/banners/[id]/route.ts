import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const supabase = createSupabaseServer();

    const { data, error } = await supabase.from("banners").update(body).eq("id", id);

    if (error) {
      console.error("Error updating banner:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ banner: data?.[0] ?? null });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const supabase = createSupabaseServer();

    // Fetch banner to know image path
    const { data: bannerData, error: fetchError } = await supabase
      .from("banners")
      .select("id, image")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error fetching banner before delete:", fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    // Delete storage image if exists
    if (bannerData?.image) {
      try {
        const filePath = bannerData.image.split("/storage/v1/object/public/banners/")[1];
        if (filePath) {
          const { error: storageError } = await supabase.storage.from("banners").remove([filePath]);
          if (storageError) console.error("Error deleting storage file:", storageError);
        }
      } catch (err) {
        console.error("Error removing banner image:", err);
      }
    }

    // Delete DB record
    const { error } = await supabase.from("banners").delete().eq("id", id);
    if (error) {
      console.error("Error deleting banner record:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
