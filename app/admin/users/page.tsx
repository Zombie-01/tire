"use server";
import AdminUsersClient from "@/components/sections/AdminUsersClient";
import { fetchUsers } from "@/lib/supabase-config";

export default async function AdminUsersPageServer() {
  // Fetch initial data on the Server
  const fetchedUsers = await fetchUsers();

  // Pass the initial data to the Client Component. Client will call API routes for CUD.
  return <AdminUsersClient initialUsers={fetchedUsers || []} />;
}
