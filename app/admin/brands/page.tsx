"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, Plus, Trash2, Building2 } from "lucide-react";
import { CreateBrandModal } from "@/components/ui/modals/create-brand-modal";
import { fetchBrands, fetchProducts } from "@/lib/supabase-config";
import { supabase } from "@/lib/supabase";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [fetchedBrands, fetchedProducts] = await Promise.all([
          fetchBrands(),
          fetchProducts(),
        ]);
        setBrands(fetchedBrands || []);
        setProducts(fetchedProducts || []);
      } catch (error) {
        console.error("Error fetching brands or products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBrandProductCount = (brandId: string) => {
    return products.filter((product) => product.brand_id === brandId).length;
  };

  const getBrandRevenue = (brandId: string) => {
    return products
      .filter((product) => product.brand_id === brandId)
      .reduce((sum, product) => sum + product.price, 0);
  };

  const deleteImage = async (logoUrl: string) => {
    try {
      const filePath = logoUrl.split("/storage/v1/object/public/brands/")[1];
      if (filePath) {
        const { error } = await supabase.storage
          .from("brands")
          .remove([filePath]);
        if (error) {
          console.error("Error deleting image:", error);
        }
      }
    } catch (error) {
      console.error("Error extracting file path or deleting image:", error);
    }
  };

  const handleDeleteBrand = async (brandId: string) => {
    if (!confirm("Энэ брэндийг устгахдаа итгэлтэй байна уу?")) return;

    try {
      const brand = brands.find((b) => b.id === brandId);
      if (brand?.logo) {
        await deleteImage(brand.logo);
      }

      const { error } = await supabase
        .from("brands")
        .delete()
        .eq("id", brandId);
      if (error) throw error;

      const updatedBrands = await fetchBrands();
      setBrands(updatedBrands || []);
    } catch (error) {
      console.error("Error deleting brand:", error);
      alert("Брэнд устгахад алдаа гарлаа.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Брэндүүдийг ачааллаж байна...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Брэндүүд</h1>
          <p className="text-muted-foreground mt-2">
            Дугуйн брэндүүдийн жагсаалт
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors font-medium">
          <Plus size={20} />
          Шинэ брэнд
        </button>
      </div>

      {/* Search */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="relative max-w-md">
          <Search
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Брэнд хайх..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBrands.map((brand) => {
          const productCount = getBrandProductCount(brand.id);
          const revenue = getBrandRevenue(brand.id);

          return (
            <div
              key={brand.id}
              className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="relative aspect-video bg-white">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  className="object-contain p-4"
                />
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-foreground">
                    {brand.name}
                  </h3>
                  <Building2 size={20} className="text-muted-foreground" />
                </div>

                <p className="text-sm text-muted-foreground">
                  {brand.description}
                </p>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      brand.is_active
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                    }`}>
                    {brand.is_active ? "Идэвхтэй" : "Идэвхгүй"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-500">
                      {productCount}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Бүтээгдэхүүн
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-500">
                      ₮{Math.round(revenue / 1000)}к
                    </p>
                    <p className="text-sm text-muted-foreground">Нийт үнэ</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => handleDeleteBrand(brand.id)}
                    className="flex-1 flex items-center justify-center gap-2 p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 size={16} />
                    <span className="text-sm">Устгах</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredBrands.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Брэнд олдсонгүй</p>
        </div>
      )}

      <CreateBrandModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}
