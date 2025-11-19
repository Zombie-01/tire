export const revalidate = 0; // disable Next.js caching

import {
  fetchBanners,
  fetchBrands,
  fetchProducts,
} from "@/lib/supabase-config";
import HomePage from "@/components/sections/home.page";

export default async function Home() {
  const banners = await fetchBanners();
  const brands = await fetchBrands();
  const products = await fetchProducts();

  // Get top 5 products by popularity
  const topProducts = (products ?? [])
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 5);

  return (
    <HomePage banners={banners} brands={brands} topProducts={topProducts} />
  );
}
