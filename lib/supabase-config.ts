import { supabase } from "./supabase";

// Supabase configuration - ready for tomorrow's integration
// This file contains the structure and setup needed for Supabase integration

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

// Environment variables that will be needed for Supabase
export const supabaseConfig: SupabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
};

// Database table names for Supabase
export const TABLES = {
  USERS: "users",
  BRANDS: "brands",
  PRODUCTS: "products",
  ORDERS: "orders",
  BANNERS: "banners",
  SETTINGS: "settings",
} as const;

// SQL schema for Supabase tables (for tomorrow's setup)
export const SUPABASE_SCHEMA = `
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT CHECK (role IN ('admin', 'user')) DEFAULT 'user',
  status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- Brands table
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  logo TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand_id UUID REFERENCES brands(id),
  size TEXT NOT NULL,
  price INTEGER NOT NULL,
  condition TEXT CHECK (condition IN ('new', 'used')) DEFAULT 'new',
  description TEXT,
  image TEXT,
  popularity INTEGER DEFAULT 0,
  stock INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  phone TEXT,
  address TEXT,
  items JSONB NOT NULL,
  total INTEGER NOT NULL,
  status TEXT CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Banners table
CREATE TABLE banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image TEXT,
  cta TEXT,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings table
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies (basic examples)
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Public can read active brands" ON brands FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Users can read own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public can read active banners" ON banners FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read settings" ON settings FOR SELECT TO authenticated;
`;

// Migration helper for tomorrow
export const migrationNotes = `
SUPABASE INTEGRATION STEPS FOR TOMORROW:

1. Create Supabase project at https://supabase.com
2. Run the SQL schema above in the Supabase SQL editor
3. Get your project URL and anon key from Settings > API
4. Create .env.local file with:
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
5. Replace static data imports in components with Supabase client calls
6. Update authentication to use Supabase Auth
7. Test all CRUD operations

Current static data will be preserved until migration is complete.
`;

// Fetch all users
export const fetchUsers = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }
  return data;
};

// Fetch all brands
export const fetchBrands = async () => {
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
  return data;
};

// Fetch all products
export const fetchProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return data;
};

// Fetch all orders
export const fetchOrders = async () => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
  return data;
};

// Fetch all banners
export const fetchBanners = async () => {
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .order("order_index", { ascending: true });
  if (error) {
    console.error("Error fetching banners:", error);
    return [];
  }
  return data;
};

// Fetch all settings
export const fetchSettings = async () => {
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) {
    console.error("Error fetching settings:", error);
    return [];
  }
  return data;
};
