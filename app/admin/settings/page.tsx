"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  CreditCard as Edit,
  Trash2,
  Eye,
  EyeOff,
  Settings as SettingsIcon,
  Image as ImageIcon,
} from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";
import { fetchBanners, fetchSettings } from "@/lib/supabase-config";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("banners");
  const [banners, setBanners] = useState<any[]>([]);
  const [settings, setSettings] = useState<any[]>([]);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [bannerForm, setBannerForm] = useState({
    title: "",
    subtitle: "",
    image: "",
    cta: "Худалдан авах",
  });
  const [uploadError, setUploadError] = useState("");

  const tabs = [
    { id: "banners", label: "Баннерууд", icon: ImageIcon },
    { id: "general", label: "Ерөнхий тохиргоо", icon: SettingsIcon },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedBanners, fetchedSettings] = await Promise.all([
          fetchBanners(),
          fetchSettings(),
        ]);
        setBanners(fetchedBanners || []);
        setSettings(fetchedSettings || []);
      } catch (error) {
        console.error("Error fetching banners or settings:", error);
      }
    };

    fetchData();
  }, []);

  const handleToggleBanner = async (bannerId: string) => {
    alert(`Баннер идэвхжүүлэх/идэвхгүй болгох: ${bannerId}`);
  };

  const handleEditBanner = async (bannerId: string) => {
    alert(`Баннер засах: ${bannerId}`);
  };

  const handleDeleteBanner = async (bannerId: string) => {
    if (confirm("Энэ баннерыг устгахдаа итгэлтэй байна уу?")) {
      alert(`Баннер устгах: ${bannerId}`);
    }
  };

  const handleUpdateSetting = async (settingId: string, newValue: string) => {
    alert(`Тохиргоо шинэчлэх: ${settingId} = ${newValue}`);
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
                      <img
                        src={banner.image}
                        alt={banner.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={() => handleToggleBanner(banner.id)}
                          className={`p-2 rounded-lg ${
                            banner.is_active
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                          }`}>
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
                            onClick={() => handleEditBanner(banner.id)}
                            className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors">
                            <Edit size={16} />
                          </button>
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
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
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
                          defaultValue={setting.value}
                          className="px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          onBlur={(e) => {
                            if (e.target.value !== setting.value) {
                              handleUpdateSetting(setting.id, e.target.value);
                            }
                          }}
                        />
                        <span className="text-xs text-muted-foreground">
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
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Худалдан авах"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  alert("Баннер нэмэх функц");
                  setShowBannerModal(false);
                }}
                className="flex-1 bg-yellow-500 text-black py-2 rounded-lg hover:bg-yellow-400 transition-colors font-medium">
                Нэмэх
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
