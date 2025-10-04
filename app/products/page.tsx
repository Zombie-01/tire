"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ui/product-card";
import { Check, ArrowUpDown } from "lucide-react";
import { fetchProducts, fetchBrands } from "@/lib/supabase-config";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [selectedBrand, setSelectedBrand] = useState(
    searchParams.get("brand") || ""
  );
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [sortBy, setSortBy] = useState("popularity");
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  // Fetch products and brands on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedProducts, fetchedBrands] = await Promise.all([
          fetchProducts(),
          fetchBrands(),
        ]);
        setProducts(fetchedProducts || []);
        setBrands(fetchedBrands || []);
        setFilteredProducts(fetchedProducts || []); // Initialize filtered products
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Filter products based on selected filters
  useEffect(() => {
    let filtered = products;

    if (selectedBrand) {
      filtered = filtered.filter(
        (product) => product.brand_id === selectedBrand
      );
    }

    if (selectedSize) {
      filtered = filtered.filter((product) => product.size === selectedSize);
    }

    if (selectedCondition) {
      filtered = filtered.filter(
        (product) => product.condition === selectedCondition
      );
    }

    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        case "popularity":
        default:
          return b.popularity - a.popularity;
      }
    });

    setFilteredProducts(filtered);
  }, [
    products,
    selectedBrand,
    selectedSize,
    selectedCondition,
    priceRange,
    sortBy,
  ]);

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Бүх дугуй</h1>

        {/* Sort Button */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none bg-card border border-border rounded-lg px-4 py-2 pr-8 text-foreground focus:outline-none focus:ring-2 focus:ring-yellow-500">
            <option value="popularity">Алдартай</option>
            <option value="price-low">Үнэ: Бага → Өндөр</option>
            <option value="price-high">Үнэ: Өндөр → Бага</option>
            <option value="name">Нэрээр</option>
          </select>
          <ArrowUpDown
            size={16}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg border border-border p-6 space-y-6">
        <h2 className="text-lg font-semibold text-foreground">Шүүлтүүр</h2>

        {/* Brand Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Брэнд
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              onClick={() => setSelectedBrand("")}
              className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                selectedBrand === ""
                  ? "border-yellow-500 bg-yellow-500/10 text-yellow-500"
                  : "border-border hover:border-yellow-500/50 text-foreground"
              }`}>
              <div className="flex items-center justify-between">
                <span className="font-medium">Бүх брэнд</span>
                <span className="text-xs text-muted-foreground">
                  {products.length}
                </span>
              </div>
            </button>
            {brands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => setSelectedBrand(brand.id)}
                className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                  selectedBrand === brand.id
                    ? "border-yellow-500 bg-yellow-500/10 text-yellow-500"
                    : "border-border hover:border-yellow-500/50 text-foreground"
                }`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{brand.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Size Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Хэмжээ
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              onClick={() => setSelectedSize("")}
              className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                selectedSize === ""
                  ? "border-yellow-500 bg-yellow-500/10 text-yellow-500"
                  : "border-border hover:border-yellow-500/50 text-foreground"
              }`}>
              <div className="flex items-center justify-between">
                <span className="font-medium">Бүх хэмжээ</span>
              </div>
            </button>
            {[...new Set(products.map((p) => p.size))].map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                  selectedSize === size
                    ? "border-yellow-500 bg-yellow-500/10 text-yellow-500"
                    : "border-border hover:border-yellow-500/50 text-foreground"
                }`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{size}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Condition Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Байдал
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setSelectedCondition("")}
              className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                selectedCondition === ""
                  ? "border-yellow-500 bg-yellow-500/10 text-yellow-500"
                  : "border-border hover:border-yellow-500/50 text-foreground"
              }`}>
              <div className="flex items-center justify-between">
                <span className="font-medium">Бүх төрөл</span>
              </div>
            </button>
            {["new", "used"].map((condition) => (
              <button
                key={condition}
                onClick={() => setSelectedCondition(condition)}
                className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                  selectedCondition === condition
                    ? "border-yellow-500 bg-yellow-500/10 text-yellow-500"
                    : "border-border hover:border-yellow-500/50 text-foreground"
                }`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {condition === "new" ? "Шинэ" : "Хэрэглэсэн"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div>
        <p className="text-muted-foreground mb-4">
          {filteredProducts.length} дугуй олдлоо
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Хайлтын үр дүн олдсонгүй
            </p>
            <p className="text-muted-foreground/70 mt-2">
              Шүүлтүүрээ өөрчилж үзнэ үү
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
