// app/admin/products/page.tsx
// This is a Server Component

import AdminProductsClient from "@/components/sections/AdminProductsClient";
import { fetchProducts, fetchBrands } from "@/lib/supabase-config";

export default async function AdminProductsPageServer() {
  // Fetch initial data on the server
  try {
    const [fetchedProducts, fetchedBrands] = await Promise.all([
      fetchProducts(),
      fetchBrands(),
    ]);

    // Pass the initial data to the Client Component
    return (
      <AdminProductsClient
        initialProducts={fetchedProducts || []}
        initialBrands={fetchedBrands || []}
      />
    );
  } catch (error) {
    console.error("Error fetching admin products data on server:", error);
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-red-500">Алдаа</h1>
        <p className="text-muted-foreground mt-2">
          Серверээс бүтээгдэхүүнүүдийг ачаалахад алдаа гарлаа.
        </p>
      </div>
    );
  }
}
