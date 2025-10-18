"use client";

import {
  fetchOrders,
  fetchUsers,
  fetchProducts,
  fetchBrands,
} from "@/lib/supabase-config";
import {
  Users,
  ShoppingBag,
  Package,
  Building2,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const { state: authState } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);

  // Redirect non-admin users
  useEffect(() => {
    if (!authState.isAuthenticated || authState.user?.role !== "admin") {
      router.push("/");
    }
  }, [authState, router]);

  // Fetch data for the dashboard
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedOrders, fetchedUsers, fetchedProducts, fetchedBrands] =
          await Promise.all([
            fetchOrders(),
            fetchUsers(),
            fetchProducts(),
            fetchBrands(),
          ]);

        setOrders(fetchedOrders || []);
        setUsers(fetchedUsers || []);
        setProducts(fetchedProducts || []);
        setBrands(fetchedBrands || []);
      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  if (!authState.isAuthenticated || authState.user?.role !== "admin") {
    return null;
  }

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
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Хэрэглэгчид</p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {users.length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/10">
              <Users size={24} className="text-blue-500" />
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Бүтээгдэхүүн</p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {products.length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-500/10">
              <ShoppingBag size={24} className="text-green-500" />
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Брэндүүд</p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {brands.length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500/10">
              <Building2 size={24} className="text-yellow-500" />
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Захиалгууд</p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {orders.length}
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
