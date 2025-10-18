"use client";

import { useState, useEffect } from "react";
import { Search, Eye, X } from "lucide-react";
import { fetchOrders, fetchUsers } from "@/lib/supabase-config";
import { supabase } from "@/lib/supabase";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null); // Track which order is being updated

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [fetchedOrders, fetchedUsers] = await Promise.all([
          fetchOrders(),
          fetchUsers(),
        ]);
        setOrders(fetchedOrders || []);
        setUsers(fetchedUsers || []);
      } catch (error) {
        console.error("Error fetching orders or users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getUserById = (userId: string) =>
    users.find((user) => user.id === userId);

  const filteredOrders = orders.filter((order) => {
    const user = getUserById(order.user_id);
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false ||
      user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false;
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) {
        console.error("Error updating order status:", error);
        alert("Захиалгын төлөвийг шинэчлэхэд алдаа гарлаа.");
      } else {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Захиалгын төлөвийг шинэчлэхэд алдаа гарлаа.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleViewOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Захиалгыг ачааллаж байна...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Захиалгууд</h1>
        <p className="text-muted-foreground mt-2">Бүх захиалгуудын жагсаалт</p>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Захиалга хайх..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
            <option value="all">Бүх төлөв</option>
            <option value="pending">Хүлээгдэж буй</option>
            <option value="processing">Боловсруулж буй</option>
            <option value="shipped">Илгээсэн</option>
            <option value="delivered">Хүргэсэн</option>
            <option value="cancelled">Цуцалсан</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-semibold text-foreground">
                  Захиалгын дугаар
                </th>
                <th className="text-left p-4 font-semibold text-foreground">
                  Хэрэглэгч
                </th>
                <th className="text-left p-4 font-semibold text-foreground">
                  Барааны тоо
                </th>
                <th className="text-left p-4 font-semibold text-foreground">
                  Нийт дүн
                </th>
                <th className="text-left p-4 font-semibold text-foreground">
                  Төлөв
                </th>
                <th className="text-left p-4 font-semibold text-foreground">
                  Огноо
                </th>
                <th className="text-left p-4 font-semibold text-foreground">
                  Үйлдэл
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <tr
                  key={order.id}
                  className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                  <td className="p-4">
                    <p className="font-medium text-foreground">{order.id}</p>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-foreground">
                        {getUserById(order.user_id)?.name || "Unknown User"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {getUserById(order.user_id)?.email || "No email"}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground">
                        {order.items.reduce(
                          (sum: number, item: any) => sum + item.quantity,
                          0
                        )}{" "}
                        ширхэг
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-foreground">
                      ₮{order.total.toLocaleString()}
                    </p>
                  </td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      disabled={updatingOrderId === order.id}
                      className="px-2 py-1 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
                      <option value="pending">Хүлээгдэж буй</option>
                      <option value="processing">Боловсруулж буй</option>
                      <option value="shipped">Илгээсэн</option>
                      <option value="delivered">Хүргэсэн</option>
                      <option value="cancelled">Цуцалсан</option>
                    </select>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {order.created_at}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewOrder(order.id)}
                        className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors">
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Захиалга олдсонгүй</p>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Захиалгын дэлгэрэнгүй
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Захиалгын дугаар:
                </p>
                <p className="font-medium text-foreground">
                  {selectedOrder.id}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Хэрэглэгч:</p>
                <p className="font-medium text-foreground">
                  {getUserById(selectedOrder.user_id)?.name || "Unknown User"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {getUserById(selectedOrder.user_id)?.email || "No email"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Утасны дугаар:</p>
                <p className="font-medium text-foreground">
                  {selectedOrder.phone || "Байхгүй"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Хаяг:</p>
                <p className="font-medium text-foreground">
                  {selectedOrder.address || "Байхгүй"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Бараанууд:</p>
                <ul className="list-disc list-inside text-foreground">
                  {selectedOrder.items.map((item: any, index: number) => (
                    <li key={index}>
                      {item.name} - {item.quantity} ширхэг - ₮
                      {(item.price * item.quantity).toLocaleString()}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Нийт дүн:</p>
                <p className="font-bold text-foreground">
                  ₮{selectedOrder.total.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Төлөв:</p>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    selectedOrder.status
                  )}`}>
                  {getStatusText(selectedOrder.status)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
