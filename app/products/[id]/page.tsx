import { supabase } from "@/lib/supabase";
import ProductDetail from "./product-detail";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: product, error } = await supabase
    .from("products")
    .select("*, brand:brands(*)")
    .eq("id", params.id)
    .single();

  if (error || !product) {
    console.error("Product fetch error:", error);
    notFound();
  }

  return <ProductDetail product={product} />;
}
