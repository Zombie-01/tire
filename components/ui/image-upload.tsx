"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
// Uploads are handled via server API at /api/admin/upload

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onError?: (error: string) => void;
  bucket?: string;
  className?: string;
  placeholder?: string;
}

export function ImageUpload({
  value,
  onChange,
  onError,
  bucket = "images",
  className = "",
  placeholder = "Зураг оруулах",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string>(value || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Upload via server API
      const fd = new FormData();
      fd.append("file", file);
      fd.append("bucket", bucket);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
        credentials: "same-origin",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        onError?.(err?.error || "Файл хуулахад алдаа гарлаа");
        setPreview(value || "");
      } else {
        const payload = await res.json();
        if (payload?.url) {
          onChange(payload.url);
          setPreview(payload.url);
          URL.revokeObjectURL(previewUrl);
        } else {
          onError?.("Файл хуулахад алдаа гарлаа");
          setPreview(value || "");
        }
      }
    } catch (error) {
      onError?.("Файл хуулахад алдаа гарлаа");
      setPreview(value || "");
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = async () => {
    setIsUploading(true);
    try {
      if (value) {
        const res = await fetch("/api/admin/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: value, bucket }),
          credentials: "same-origin",
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          onError?.(err?.error || "Зураг устгахад алдаа гарлаа");
        }
      }

      onChange("");
      setPreview("");
    } catch (err) {
      onError?.("Зураг устгахад алдаа гарлаа");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />

      {preview ? (
        <div className="relative group">
          <div className="relative aspect-video w-full bg-gray-100 rounded-lg overflow-hidden">
            <Image src={preview} alt="Preview" fill className="object-cover" />
          </div>
          {isUploading && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-lg">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-500" />
            </div>
          )}
          <button
            type="button"
            onClick={handleRemove}
            disabled={isUploading}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100">
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={isUploading}
          className="w-full aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-yellow-500 hover:bg-yellow-50 transition-colors disabled:opacity-50">
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
              <span className="text-sm text-gray-600">Хуулж байна...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-gray-100 rounded-full">
                <Upload size={24} className="text-gray-600" />
              </div>
              <span className="text-sm text-gray-600">{placeholder}</span>
              <span className="text-xs text-gray-400">
                PNG, JPG, GIF (max 5MB)
              </span>
            </div>
          )}
        </button>
      )}
    </div>
  );
}
