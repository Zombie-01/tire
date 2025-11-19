// app/admin/brands/page.tsx
// This is a Server Component

import AdminBrandsClient from "@/components/sections/AdminBrandsClient";
import { fetchBrands, fetchProducts } from "@/lib/supabase-config";

export default async function AdminBrandsPageServer() {
  try {
    // Fetch all necessary data on the server
    const [fetchedBrands, fetchedProducts] = await Promise.all([
      fetchBrands(),
      fetchProducts(),
    ]);

    // Pass the initial data to the Client Component
    return (
      <AdminBrandsClient
        initialBrands={fetchedBrands || []}
        initialProducts={fetchedProducts || []}
      />
    );
  } catch (error) {
    console.error("Error fetching admin brands data on server:", error);
    // Display an error message if fetching fails
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-red-500">Алдаа</h1>
        <p className="text-muted-foreground mt-2">
          Серверээс брэндүүдийг ачаалахад алдаа гарлаа.
        </p>
      </div>
    );
  }
}
