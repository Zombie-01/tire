import { supabase } from "./supabase";

// Database structure
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "user";
  status: "active" | "inactive";
  createdAt: string;
  lastLogin: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  brandId: string;
  size: string;
  price: number;
  condition: "new" | "used";
  description: string;
  image: string;
  popularity: number;
  stock: number;
  isActive: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  phone: string;
  address: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
  isActive: boolean;
  order: number;
  createdAt: string;
}

export interface Settings {
  id: string;
  key: string;
  value: string;
  description: string;
  updatedAt: string;
}

// Helper functions to get related data
export const getBrandById = async (id: string) => {
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("id", id)
    .single();
  if (error) console.error("Error fetching brand:", error);
  return data;
};

export const getUserById = async (id: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();
  if (error) console.error("Error fetching user:", error);
  return data;
};

export const getProductsByBrandId = async (brandId: string) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("brand_id", brandId);
  if (error) console.error("Error fetching products:", error);
  return data;
};

export const getActiveBanners = async () => {
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .eq("is_active", true)
    .order("order_index");
  if (error) console.error("Error fetching banners:", error);
  return data;
};

export const getSettings = async () => {
  const { data, error } = await supabase.from("settings").select("*");
  if (error) console.error("Error fetching settings:", error);
  return data;
};
