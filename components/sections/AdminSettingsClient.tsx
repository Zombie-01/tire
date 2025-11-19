// app/admin/settings/AdminSettingsClient.tsx
"use client";
import { useState } from "react";
import {
  Plus,
  CreditCard as Edit,
  Trash2,
  Eye,
  EyeOff,
  Settings as SettingsIcon,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";

interface AdminSettingsClientProps {
  initialBanners: any[];
  initialSettings: any[];
}

export default function AdminSettingsClient({
  initialBanners,
  initialSettings,
}: AdminSettingsClientProps) {
  // State initialized with server-fetched data
  const [banners, setBanners] = useState<any[]>(initialBanners);
  const [settings, setSettings] = useState<any[]>(initialSettings);

  // UI and Form state
  const [activeTab, setActiveTab] = useState("banners");
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [bannerForm, setBannerForm] = useState({
    title: "",
    subtitle: "",
    image: "",
    cta: "Худалдан авах",
  });
  const [uploadError, setUploadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tabs = [
    { id: "banners", label: "Баннерууд", icon: ImageIcon },
    { id: "general", label: "Ерөнхий тохиргоо", icon: SettingsIcon },
  ];

  // image deletion is handled server-side in the API route

  // Refetch functions to update state after mutation
  const refetchBanners = async () => {
    try {
      const res = await fetch("/api/admin/banners");
      const updatedBanners = await res.json();
      setBanners(updatedBanners || []);
    } catch (err) {
      console.error("Error refetching banners:", err);
    }
  };

  const refetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const updatedSettings = await res.json();
      setSettings(updatedSettings || []);
    } catch (err) {
      console.error("Error refetching settings:", err);
    }
  };

  // --- Banner Handlers ---

  const handleCreateBanner = async () => {
    if (!bannerForm.title || !bannerForm.image) {
      alert("Гарчиг болон зураг заавал шаардлагатай.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: bannerForm.title,
          subtitle: bannerForm.subtitle,
          image: bannerForm.image,
          cta: bannerForm.cta,
          is_active: true,
          order_index: banners.length,
        }),
        credentials: "same-origin",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to create banner");
      }

      await refetchBanners();

      // Reset form state
      setShowBannerModal(false);
      setBannerForm({
        title: "",
        subtitle: "",
        image: "",
        cta: "Худалдан авах",
      });
    } catch (error) {
      console.error("Error creating banner:", error);
      alert("Баннер нэмэхэд алдаа гарлаа.");
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log(bannerForm);

  const handleToggleBanner = async (bannerId: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/banners/${bannerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !isActive }),
        credentials: "same-origin",
      });

      if (!res.ok) throw new Error("Failed to toggle banner");

      await refetchBanners();
    } catch (error) {
      console.error("Error toggling banner:", error);
      alert("Баннер идэвхжүүлэх/идэвхгүй болгоход алдаа гарлаа.");
    }
  };

  const handleDeleteBanner = async (bannerId: string) => {
    if (!confirm("Энэ баннерыг устгахдаа итгэлтэй байна уу?")) return;
    try {
      const res = await fetch(`/api/admin/banners/${bannerId}`, {
        method: "DELETE",
        credentials: "same-origin",
      });

      if (!res.ok) throw new Error("Failed to delete banner");

      await refetchBanners();
    } catch (error) {
      console.error("Error deleting banner:", error);
      alert("Баннер устгахад алдаа гарлаа.");
    }
  };

  // --- General Settings Handler ---

  const handleUpdateSetting = async (settingId: string, newValue: string) => {
    // Prevent empty updates
    if (!newValue.trim()) {
      alert("Тохиргооны утга хоосон байж болохгүй.");
      return;
    }

    try {
      const res = await fetch(`/api/admin/settings/${settingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: newValue }),
        credentials: "same-origin",
      });

      if (!res.ok) throw new Error("Failed to update setting");

      await refetchSettings();
    } catch (error) {
      console.error("Error updating setting:", error);
      alert("Тохиргоо шинэчлэхэд алдаа гарлаа.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Тохиргоо</h1>
        <p className="text-muted-foreground mt-2">
          Дэлгүүрийн тохиргоо удирдах
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-card rounded-lg border border-border">
        <div className="flex border-b border-border">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-yellow-500 border-b-2 border-yellow-500"
                    : "text-muted-foreground hover:text-foreground"
                }`}>
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {activeTab === "banners" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-foreground">
                  Баннерууд
                </h2>
                <button
                  onClick={() => setShowBannerModal(true)}
                  className="flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors font-medium">
                  <Plus size={20} />
                  Шинэ баннер
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {banners.map((banner) => (
                  <div
                    key={banner.id}
                    className="bg-background rounded-lg border border-border overflow-hidden">
                    <div className="relative aspect-video">
                      {/* Using <img> tag as next/image is not imported */}
                      <img
                        src={banner.image}
                        alt={banner.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={() =>
                            handleToggleBanner(banner.id, banner.is_active)
                          }
                          className={`p-2 rounded-lg ${
                            banner.is_active
                              ? "bg-green-500 text-white hover:bg-green-600"
                              : "bg-red-500 text-white hover:bg-red-600"
                          } transition-colors`}>
                          {banner.is_active ? (
                            <Eye size={16} />
                          ) : (
                            <EyeOff size={16} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {banner.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {banner.subtitle}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              banner.is_active
                                ? "bg-green-500/10 text-green-500"
                                : "bg-red-500/10 text-red-500"
                            }`}>
                            {banner.is_active ? "Идэвхтэй" : "Идэвхгүй"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Эрэмбэ: {banner.order_index}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDeleteBanner(banner.id)}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "general" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">
                Ерөнхий тохиргоо
              </h2>

              <div className="space-y-4">
                {settings.map((setting) => (
                  <div
                    key={setting.id}
                    className="bg-background rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex-1 min-w-[200px]">
                        <h3 className="font-medium text-foreground">
                          {setting.description}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Түлхүүр: {setting.key}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          // Use defaultValue for uncontrolled component pattern which is better with onBlur
                          defaultValue={setting.value}
                          className="px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent min-w-[150px]"
                          onBlur={(e) => {
                            if (e.target.value !== setting.value) {
                              handleUpdateSetting(setting.id, e.target.value);
                            }
                          }}
                        />
                        <span className="text-xs text-muted-foreground hidden sm:block">
                          {/* You might need a utility to format setting.updated_at if it's a raw timestamp */}
                          {setting.updated_at}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Banner Modal */}
      {showBannerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg border border-border p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Шинэ баннер нэмэх
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Гарчиг
                </label>
                <input
                  type="text"
                  value={bannerForm.title}
                  onChange={(e) =>
                    setBannerForm({ ...bannerForm, title: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Баннерын гарчиг"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Дэд гарчиг
                </label>
                <input
                  type="text"
                  value={bannerForm.subtitle}
                  onChange={(e) =>
                    setBannerForm({ ...bannerForm, subtitle: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Дэд гарчиг"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Баннерын зураг
                </label>
                <ImageUpload
                  value={bannerForm.image}
                  onChange={(url) =>
                    setBannerForm({ ...bannerForm, image: url })
                  }
                  onError={setUploadError}
                  bucket="banners"
                  placeholder="Баннерын зураг оруулах"
                />
                {uploadError && (
                  <p className="text-sm text-red-500 mt-1">{uploadError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Товчны текст
                </label>
                <input
                  type="text"
                  value={bannerForm.cta}
                  onChange={(e) =>
                    setBannerForm({ ...bannerForm, cta: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Худалдан авах"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreateBanner}
                disabled={
                  isSubmitting || !bannerForm.image || !bannerForm.title
                }
                className="flex-1 bg-yellow-500 text-black py-2 rounded-lg hover:bg-yellow-400 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Нэмэж байна...
                  </>
                ) : (
                  "Нэмэх"
                )}
              </button>
              <button
                onClick={() => setShowBannerModal(false)}
                className="flex-1 bg-muted text-foreground py-2 rounded-lg hover:bg-muted/80 transition-colors">
                Цуцлах
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
