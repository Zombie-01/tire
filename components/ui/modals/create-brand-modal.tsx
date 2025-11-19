"use client";

import { useState } from "react";
import { X } from "lucide-react";
// Uses server API at /api/admin/brands
import { ImageUpload } from "@/components/ui/image-upload";

interface CreateBrandModalProps {
  isOpen: boolean;
  onBrandCreated: any;
  onClose: () => void;
}

export function CreateBrandModal({
  isOpen,
  onClose,
  onBrandCreated,
}: CreateBrandModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    description: "",
    is_active: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "same-origin",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to create brand");
      }

      const payload = await res.json();
      setFormData({ name: "", logo: "", description: "", is_active: true });
      onClose();
      onBrandCreated(payload.brand);
    } catch (err: any) {
      setError(err.message || "Алдаа гарлаа");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg border border-border p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Шинэ брэнд нэмэх
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
              Брэндийн нэр *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Michelin"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Лого
            </label>
            <ImageUpload
              value={formData.logo}
              onChange={(url) => setFormData({ ...formData, logo: url })}
              onError={setUploadError}
              bucket="brands"
              placeholder="Брэндийн лого оруулах"
            />
            {uploadError && (
              <p className="text-sm text-red-500 mt-1">{uploadError}</p>
            )}
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
              placeholder="Брэндийн тухай тайлбар"
            />
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
