// app/admin/users/AdminUsersClient.tsx
"use client";

import { useState } from "react";
import { Search, UserPlus, CreditCard as Edit, Trash2 } from "lucide-react";
import { CreateUserModal } from "@/components/ui/modals/create-user-modal";
import { EditUserModal } from "@/components/ui/modals/edit-user-modal";

interface AdminUsersClientProps {
  initialUsers: any[];
}

export default function AdminUsersClient({
  initialUsers,
}: AdminUsersClientProps) {
  // Initialize state with data passed from the Server Component
  const [users, setUsers] = useState<any[]>(initialUsers);

  // State for interactive features
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const filteredUsers = users.filter((user) => {
    // Safely check if properties exist before calling toLowerCase()
    const name = user.name ? user.name.toLowerCase() : "";
    const email = user.email ? user.email.toLowerCase() : "";

    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleEdit = (userId: string) => {
    setEditingUserId(userId);
    setShowEditModal(true);
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Энэ хэрэглэгчийг устгахдаа итгэлтэй байна уу?")) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        credentials: "same-origin",
      });

      if (!res.ok) throw new Error("Failed to delete user");

      // Optimistically remove from UI
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Хэрэглэгч устгахад алдаа гарлаа.");
    }
  };

  // Function to refetch and update local state after CUD operations
  const refreshUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const updatedUsers = await res.json();
      setUsers(updatedUsers || []);
    } catch (err) {
      console.error("Error refreshing users:", err);
    }
  };

  const handleCreateUser = () => {
    setShowCreateModal(false);
    refreshUsers();
  };

  const handleEditUser = () => {
    setShowEditModal(false);
    setEditingUserId(null);
    refreshUsers();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Хэрэглэгчид</h1>
          <p className="text-muted-foreground mt-2">
            Бүх хэрэглэгчдийн жагсаалт
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors font-medium">
          <UserPlus size={20} />
          Шинэ хэрэглэгч
        </button>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Хэрэглэгч хайх..."
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
            <option value="active">Идэвхтэй</option>
            <option value="inactive">Идэвхгүй</option>
          </select>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
            <option value="all">Бүх эрх</option>
            <option value="admin">Админ</option>
            <option value="user">Хэрэглэгч</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-semibold text-foreground">
                  Нэр
                </th>
                <th className="text-left p-4 font-semibold text-foreground">
                  И-мэйл
                </th>
                <th className="text-left p-4 font-semibold text-foreground">
                  Утас
                </th>
                <th className="text-left p-4 font-semibold text-foreground">
                  Эрх
                </th>
                <th className="text-left p-4 font-semibold text-foreground">
                  Төлөв
                </th>
                <th className="text-left p-4 font-semibold text-foreground">
                  Бүртгүүлсэн
                </th>
                <th className="text-left p-4 font-semibold text-foreground">
                  Үйлдэл
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ID: {user.id}
                      </p>
                    </div>
                  </td>
                  <td className="p-4 text-foreground">{user.email}</td>
                  <td className="p-4 text-foreground">{user.phone}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-purple-500/10 text-purple-500"
                          : "bg-blue-500/10 text-blue-500"
                      }`}>
                      {user.role === "admin" ? "Админ" : "Хэрэглэгч"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === "active"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                      }`}>
                      {user.status === "active" ? "Идэвхтэй" : "Идэвхгүй"}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {user.createdAt}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(user.id)}
                        className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors">
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Хэрэглэгч олдсонгүй</p>
        </div>
      )}

      {/* Modals */}
      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateUser}
      />

      <EditUserModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingUserId(null);
        }}
        onSubmit={handleEditUser}
        userId={editingUserId}
      />
    </div>
  );
}
