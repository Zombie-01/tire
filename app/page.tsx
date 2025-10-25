import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ui/product-card";
import {
  fetchBanners,
  fetchBrands,
  fetchProducts,
} from "@/lib/supabase-config";

export default async function Home() {
  const banners = await fetchBanners();
  const brands = await fetchBrands();
  const products = await fetchProducts();

  console.log(banners);

  // Get top 5 products by popularity
  const topProducts = (products ?? [])
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Banner Section */}
      {(banners?.length ?? 0) > 0 && (
        <section className="p-4">
          <div className="relative rounded-lg overflow-hidden bg-gradient-to-r from-black via-yellow-600 to-black text-white">
            <div className="absolute inset-0">
              <Image
                src={banners?.[0]?.image ?? ""}
                alt={banners?.[0]?.title ?? ""}
                fill
                className="object-cover opacity-30"
              />
            </div>
            <div className="relative z-10 p-6">
              <h2 className="text-2xl font-bold mb-2">{banners?.[0]?.title}</h2>
              <p className="text-lg mb-4 text-yellow-200">
                {banners?.[0]?.subtitle}
              </p>
              <Link
                href="/products"
                className="inline-block bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
                {banners?.[0]?.cta}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Top 5 Products */}
      <section className="p-4">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Шилдэг 5 дугуй
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {topProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Brands Section */}
      <section className="p-4">
        <h2 className="text-2xl font-bold text-foreground mb-4">Брэндүүд</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {(brands ?? []).map((brand) => (
            <Link
              key={brand.id}
              href={`/products?brand=${brand.name}`}
              className="bg-card rounded-lg border border-border hover:border-yellow-500/50 transition-all duration-300 p-6 text-center group">
              <div className="relative aspect-square mb-3 bg-white rounded-lg overflow-hidden">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-semibold text-foreground group-hover:text-yellow-500 transition-colors">
                {brand.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
