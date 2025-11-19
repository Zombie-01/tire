// app/admin/settings/page.tsx
// This is a Server Component

import AdminSettingsClient from "@/components/sections/AdminSettingsClient";
import { fetchBanners, fetchSettings } from "@/lib/supabase-config";

export default async function AdminSettingsPageServer() {
  try {
    // Fetch both banners and settings concurrently on the server
    const [fetchedBanners, fetchedSettings] = await Promise.all([
      fetchBanners(),
      fetchSettings(),
    ]);

    // Pass the initial data to the Client Component
    return (
      <AdminSettingsClient
        initialBanners={fetchedBanners || []}
        initialSettings={fetchedSettings || []}
      />
    );
  } catch (error) {
    console.error("Error fetching admin settings data on server:", error);
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-red-500">Алдаа</h1>
        <p className="text-muted-foreground mt-2">
          Серверээс тохиргооны өгөгдлийг ачаалахад алдаа гарлаа.
        </p>
      </div>
    );
  }
}
