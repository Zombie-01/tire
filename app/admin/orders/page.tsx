// app/admin/orders/page.tsx
// This is a Server Component

import AdminOrdersClient from "@/components/sections/AdminOrdersClient";
import { fetchOrders, fetchUsers } from "@/lib/supabase-config";

export default async function AdminOrdersPageServer() {
  try {
    // 1. Fetch data on the Server
    const [fetchedOrders, fetchedUsers] = await Promise.all([
      fetchOrders(),
      fetchUsers(),
    ]);

    // 2. Pass the initial data as props to the Client Component
    return (
      <AdminOrdersClient
        initialOrders={fetchedOrders || []}
        initialUsers={fetchedUsers || []}
      />
    );
  } catch (error) {
    console.error("Error fetching admin orders data on server:", error);
    // Display an error message if fetching fails
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-red-500">Алдаа</h1>
        <p className="text-muted-foreground mt-2">
          Серверээс захиалга, хэрэглэгчдийг ачаалахад алдаа гарлаа.
        </p>
      </div>
    );
  }
}
