"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
// Uses server API at /api/admin
import { ImageUpload } from "@/components/ui/image-upload";

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

interface Brand {
  id: string;
  name: string;
}

export function CreateProductModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    brand_id: "",
    size: "",
    price: 0,
    condition: "new" as "new" | "used",
    description: "",
    image:
      "https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&w=400",
    popularity: 0,
    stock: 0,
    is_active: true,
  });
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchBrands();
    }
  }, [isOpen]);

  const fetchBrands = async () => {
    try {
      const res = await fetch("/api/admin/brands");
      if (!res.ok) throw new Error("Failed to fetch brands");
      const data = await res.json();
      // data is an array of brands
      setBrands((data || []).map((b: any) => ({ id: b.id, name: b.name })));
    } catch (err) {
      console.error("Error fetching brands:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "same-origin",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to create product");
      }

      const payload = await res.json();
      onSubmit(payload.product);
      setFormData({
        name: "",
        brand_id: "",
        size: "",
        price: 0,
        condition: "new",
        description: "",
        image:
          "https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&w=400",
        popularity: 0,
        stock: 0,
        is_active: true,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Алдаа гарлаа");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg border border-border p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Шинэ бүтээгдэхүүн нэмэх
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Нэр *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Pilot Sport 4"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Брэнд *
            </label>
            <select
              required
              value={formData.brand_id}
              onChange={(e) =>
                setFormData({ ...formData, brand_id: e.target.value })
              }
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500">
              <option value="">Брэнд сонгох</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Хэмжээ *
            </label>
            <input
              type="text"
              required
              value={formData.size}
              onChange={(e) =>
                setFormData({ ...formData, size: e.target.value })
              }
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="225/45R17"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Үнэ (₮) *
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="350000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Байдал
            </label>
            <select
              value={formData.condition}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  condition: e.target.value as "new" | "used",
                })
              }
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500">
              <option value="new">Шинэ</option>
              <option value="used">Хэрэглэсэн</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Тайлбар *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 h-20 resize-none"
              placeholder="Бүтээгдэхүүний тайлбар"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Зураг
            </label>
            <ImageUpload
              value={formData.image}
              onChange={(url) => setFormData({ ...formData, image: url })}
              onError={setUploadError}
              bucket="products"
              placeholder="Бүтээгдэхүүний зураг оруулах"
            />
            {uploadError && (
              <p className="text-sm text-red-500 mt-1">{uploadError}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Алдартай байдал (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.popularity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    popularity: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="85"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Нөөц
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stock: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="10"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.checked })
              }
              className="w-4 h-4 text-yellow-500 bg-background border-border rounded focus:ring-yellow-500"
            />
            <label htmlFor="is_active" className="text-sm text-foreground">
              Идэвхтэй
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-yellow-500 text-black py-2 rounded-lg hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium">
              {isLoading ? "Нэмж байна..." : "Нэмэх"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-muted text-foreground py-2 rounded-lg hover:bg-muted/80 transition-colors">
              Цуцлах
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
