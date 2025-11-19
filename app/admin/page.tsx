import AdminDashboardClient from "@/components/sections/AdminDashboardClient";
import {
  fetchOrders,
  fetchUsers,
  fetchProducts,
  fetchBrands,
} from "@/lib/supabase-config";

export default async function AdminDashboardPage() {
  try {
    const [orders, users, products, brands] = await Promise.all([
      fetchOrders(),
      fetchUsers(),
      fetchProducts(),
      fetchBrands(),
    ]);

    // 2. Pass the fetched data as props to the Client Component
    return (
      <AdminDashboardClient
        initialOrders={orders || []}
        initialUsers={users || []}
        initialProducts={products || []}
        initialBrands={brands || []}
      />
    );
  } catch (error) {
    console.error("Error fetching admin dashboard data on server:", error);
    // You might want a more sophisticated error boundary or message here
    return <div>Ачаалах үед алдаа гарлаа.</div>;
  }
}
