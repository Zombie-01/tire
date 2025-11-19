import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const bucket = (form.get("bucket") as string) || "images";

    if (!file)
      return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const supabase = createSupabaseServer();

    // Generate a unique filename
    const fileExt = (file.name?.split(".").pop() || "bin").replace(
      /[^a-zA-Z0-9]/g,
      ""
    );
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;
    const filePath = `${bucket}/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || "application/octet-stream",
      });

    if (error) {
      console.error("Upload error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { url, bucket = "images" } = body || {};
    if (!url)
      return NextResponse.json({ error: "No url provided" }, { status: 400 });

    const supabase = createSupabaseServer();

    // Try to extract path after /storage/v1/object/public/<bucket>/
    const marker = `/storage/v1/object/public/${bucket}/`;
    const filePath = url.split(marker)[1];
    if (!filePath)
      return NextResponse.json({ error: "Invalid url" }, { status: 400 });

    const { error } = await supabase.storage.from(bucket).remove([filePath]);
    if (error) {
      console.error("Delete error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
