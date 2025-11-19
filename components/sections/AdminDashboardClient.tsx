// app/admin/AdminDashboardClient.tsx
"use client";

import { Users, ShoppingBag, Building2, Package } from "lucide-react";
import { useAuth } from "@/lib/auth-context"; // Assuming this hook provides client-side context
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Define the shape of the props this component expects
interface AdminDashboardClientProps {
  initialOrders: any[];
  initialUsers: any[];
  initialProducts: any[];
  initialBrands: any[];
}

export default function AdminDashboardClient({
  initialOrders,
  initialUsers,
  initialProducts,
  initialBrands,
}: AdminDashboardClientProps) {
  const { user,profile } = useAuth();
  const router = useRouter();

  // Authentication and Redirection Logic (Client-side)
  useEffect(() => {
    // This check is essential for client-side routing protection
    if (!user || profile?.role !== "admin") {
      router.push("/");
    }
  }, [user, router]);

  // If the user is not authenticated or not an admin, we return null immediately
  // while the client-side useEffect handles the actual redirection.
  if (!user || profile?.role !== "admin") {
    return null; // Or a loading spinner
  }

  // Use the initial data passed from the Server Component
  const usersLength = initialUsers.length;
  const productsLength = initialProducts.length;
  const brandsLength = initialBrands.length;
  const ordersLength = initialOrders.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Хяналтын самбар</h1>
        <p className="text-muted-foreground mt-2">
          Дугуй дэлгүүрийн ерөнхий мэдээлэл
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Users Card */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Хэрэглэгчид</p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {usersLength}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/10">
              <Users size={24} className="text-blue-500" />
            </div>
          </div>
        </div>

        {/* Products Card */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Бүтээгдэхүүн</p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {productsLength}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-500/10">
              <ShoppingBag size={24} className="text-green-500" />
            </div>
          </div>
        </div>

        {/* Brands Card */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Брэндүүд</p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {brandsLength}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500/10">
              <Building2 size={24} className="text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Захиалгууд</p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {ordersLength}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500/10">
              <Package size={24} className="text-purple-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
