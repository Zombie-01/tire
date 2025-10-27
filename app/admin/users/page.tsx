"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  UserPlus,
  CreditCard as Edit,
  Trash2,
} from "lucide-react";
import { CreateUserModal } from "@/components/ui/modals/create-user-modal";
import { EditUserModal } from "@/components/ui/modals/edit-user-modal";
import { fetchUsers } from "@/lib/supabase-config";
import { supabase } from "@/lib/supabase";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      const fetchedUsers = await fetchUsers().finally(() => {
        setIsLoading(false);
      });
      setUsers(fetchedUsers);
    };

    loadUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
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
    if (confirm("Энэ хэрэглэгчийг устгахдаа итгэлтэй байна уу?")) {
      const { error } = await supabase.from("users").delete().eq("id", userId);
      if (!error) {
        setUsers(users.filter((user) => user.id !== userId));
      }
    }
  };

  const handleCreateUser = (data: any) => {
    // Refresh users list
    fetchUsers();
  };

  const handleEditUser = (data: any) => {
    // Refresh users list
    fetchUsers();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Хэрэглэгчдийг ачааллаж байна...
          </p>
        </div>
      </div>
    );
  }

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
