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
      .from("products")
      .update(body)
      .eq("id", id)
      .select()
      .single();
    if (error) {
      console.error("Error updating product:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ product: data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const supabase = createSupabaseServer();

    // fetch product to get image
    const { data: productData, error: fetchError } = await supabase
      .from("products")
      .select("id, image")
      .eq("id", id)
      .single();
    if (fetchError) {
      console.error("Error fetching product before delete:", fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (productData?.image) {
      try {
        const filePath = productData.image.split(
          `/storage/v1/object/public/products/`
        )[1];
        if (filePath) {
          const { error: storageError } = await supabase.storage
            .from("products")
            .remove([filePath]);
          if (storageError)
            console.error("Error deleting storage file:", storageError);
        }
      } catch (err) {
        console.error("Error removing product image:", err);
      }
    }

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      console.error("Error deleting product record:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
