import { ProductList } from "./product-list";
import { fetchProducts, fetchBrands } from "@/lib/supabase-config";

export default async function ProductsPage() {
  // Fetch data directly inside the async component
  const [products, brands] = await Promise.all([
    fetchProducts(),
    fetchBrands(),
  ]);

  return <ProductList initialProducts={products} initialBrands={brands} />;
}
