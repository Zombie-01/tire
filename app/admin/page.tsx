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
  TrendingUp,
  Clock,
  CircleCheck as CheckCircle,
  CircleAlert as AlertCircle,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-500 bg-yellow-500/10";
      case "processing":
        return "text-blue-500 bg-blue-500/10";
      case "shipped":
        return "text-purple-500 bg-purple-500/10";
      case "delivered":
        return "text-green-500 bg-green-500/10";
      case "cancelled":
        return "text-red-500 bg-red-500/10";
      default:
        return "text-gray-500 bg-gray-500/10";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Хүлээгдэж буй";
      case "processing":
        return "Боловсруулж буй";
      case "shipped":
        return "Илгээсэн";
      case "delivered":
        return "Хүргэсэн";
      case "cancelled":
        return "Цуцалсан";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Хяналтын самбар</h1>
        <p className="text-muted-foreground mt-2">
          Дугуй дэлгүүрийн ерөнхий мэдээлэл
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Recent Orders */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Сүүлийн захиалгууд
        </h3>
        <div className="space-y-4">
          {orders.slice(0, 5).map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-3 bg-background rounded-lg">
              <div>
                <p className="font-medium text-foreground">{order.id}</p>
                <p className="text-sm text-muted-foreground">
                  {users.find((u) => u.id === order.user_id)?.name ||
                    "Unknown User"}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-foreground">
                  ₮{order.total.toLocaleString()}
                </p>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                    order.status
                  )}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
