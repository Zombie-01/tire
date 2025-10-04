/*
  # Improved Database Schema for Түмэн-Дугуй Tire Shop

  Changes:
  - Normalized `orders` table by creating `order_items` table.
  - Added indexes for better query performance.
  - Improved constraints and naming conventions.
  - Added comments for clarity.
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
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
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  logo TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price > 0),
  condition TEXT CHECK (condition IN ('new', 'used')) DEFAULT 'new',
  description TEXT,
  image TEXT,
  popularity INTEGER DEFAULT 0 CHECK (popularity >= 0),
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  total INTEGER NOT NULL CHECK (total >= 0),
  status TEXT CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items table (normalized from orders.items)
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price INTEGER NOT NULL CHECK (price > 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Banners table
CREATE TABLE IF NOT EXISTS banners (
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
CREATE TABLE IF NOT EXISTS settings (
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
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Admins can read all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert users" ON users
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update users" ON users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete users" ON users
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text AND role = 'admin'
    )
  );

-- Brands policies
CREATE POLICY "Anyone can read active brands" ON brands
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage brands" ON brands
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text AND role = 'admin'
    )
  );

-- Products policies
CREATE POLICY "Anyone can read active products" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text AND role = 'admin'
    )
  );

-- Orders policies
CREATE POLICY "Users can read own orders" ON orders
  FOR SELECT USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Admins can read all orders" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update orders" ON orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text AND role = 'admin'
    )
  );

-- Banners policies
CREATE POLICY "Anyone can read active banners" ON banners
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage banners" ON banners
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text AND role = 'admin'
    )
  );

-- Settings policies
CREATE POLICY "Anyone can read settings" ON settings
  FOR SELECT TO authenticated;

CREATE POLICY "Admins can manage settings" ON settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text AND role = 'admin'
    )
  );

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Insert sample data

-- Insert brands
INSERT INTO brands (id, name, logo, description, is_active, created_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Michelin', 'https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&w=200', 'Дэлхийн тэргүүлэгч дугуйн брэнд', true, NOW()),
  ('550e8400-e29b-41d4-a716-446655440002', 'Bridgestone', 'https://images.pexels.com/photos/1007410/pexels-photo-1007410.jpeg?auto=compress&cs=tinysrgb&w=200', 'Япон улсын алдартай дугуйн брэнд', true, NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', 'Goodyear', 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=200', 'Америкийн чанартай дугуйн брэнд', true, NOW()),
  ('550e8400-e29b-41d4-a716-446655440004', 'Continental', 'https://images.pexels.com/photos/2244746/pexels-photo-2244746.jpeg?auto=compress&cs=tinysrgb&w=200', 'Германы дээд зэргийн дугуйн брэнд', true, NOW()),
  ('550e8400-e29b-41d4-a716-446655440005', 'Pirelli', 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=200', 'Италийн спорт дугуйн брэнд', true, NOW());

-- Insert products
INSERT INTO products (id, name, brand_id, size, price, condition, description, image, popularity, stock, is_active, created_at) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'Pilot Sport 4', '550e8400-e29b-41d4-a716-446655440001', '225/45R17', 350000, 'new', 'Өндөр чанартай спорт дугуй, маш сайн зөөлрүүлэлттэй.', 'https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&w=400', 95, 10, true, NOW()),
  ('660e8400-e29b-41d4-a716-446655440002', 'Turanza T005', '550e8400-e29b-41d4-a716-446655440002', '205/55R16', 280000, 'new', 'Тогтвортой жолоодлого, бага дуу чимээтэй.', 'https://images.pexels.com/photos/1007410/pexels-photo-1007410.jpeg?auto=compress&cs=tinysrgb&w=400', 88, 15, true, NOW()),
  ('660e8400-e29b-41d4-a716-446655440003', 'Eagle F1 Asymmetric', '550e8400-e29b-41d4-a716-446655440003', '245/40R18', 420000, 'new', 'Өндөр хурдны спорт дугуй, маш сайн барилттай.', 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=400', 92, 8, true, NOW()),
  ('660e8400-e29b-41d4-a716-446655440004', 'PremiumContact 6', '550e8400-e29b-41d4-a716-446655440004', '195/65R15', 250000, 'new', 'Эдийн засгийн хувилбар, урт наслалттай.', 'https://images.pexels.com/photos/2244746/pexels-photo-2244746.jpeg?auto=compress&cs=tinysrgb&w=400', 85, 20, true, NOW()),
  ('660e8400-e29b-41d4-a716-446655440005', 'P Zero', '550e8400-e29b-41d4-a716-446655440005', '275/35R19', 550000, 'new', 'Дээд зэргийн спорт дугуй, F1-д ашигладаг.', 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=400', 98, 5, true, NOW()),
  ('660e8400-e29b-41d4-a716-446655440006', 'Energy Saver+', '550e8400-e29b-41d4-a716-446655440001', '185/60R14', 180000, 'used', 'Түлшний хэмнэлттэй, хотын жолоодлогод тохиромжтой.', 'https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&w=400', 75, 12, true, NOW()),
  ('660e8400-e29b-41d4-a716-446655440007', 'Ecopia EP300', '550e8400-e29b-41d4-a716-446655440002', '215/60R16', 220000, 'used', 'Байгаль орчинд ээлтэй, бага эсэргүүцэлтэй.', 'https://images.pexels.com/photos/1007410/pexels-photo-1007410.jpeg?auto=compress&cs=tinysrgb&w=400', 80, 18, true, NOW()),
  ('660e8400-e29b-41d4-a716-446655440008', 'Wrangler HP', '550e8400-e29b-41d4-a716-446655440003', '235/65R17', 320000, 'new', 'SUV болон жийпэнд зориулсан дугуй.', 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=400', 87, 14, true, NOW());

-- Insert sample users
INSERT INTO users (id, name, email, phone, role, status, created_at, last_login) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', 'Батбаяр', 'batbayar@email.com', '99001122', 'user', 'active', NOW(), NOW()),
  ('770e8400-e29b-41d4-a716-446655440002', 'Болдбаяр', 'bold@email.com', '99112233', 'user', 'active', NOW(), NOW()),
  ('770e8400-e29b-41d4-a716-446655440003', 'Админ', 'admin@email.com', '99223344', 'admin', 'active', NOW(), NOW());

-- Insert sample orders
INSERT INTO orders (id, user_id, total, status, created_at, updated_at) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 700000, 'delivered', NOW(), NOW()),
  ('770e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', 1120000, 'processing', NOW(), NOW());

-- Insert order items
INSERT INTO order_items (id, order_id, product_id, quantity, price, created_at) VALUES
  ('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 2, 350000, NOW()),
  ('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 4, 280000, NOW());

-- Insert banners
INSERT INTO banners (id, title, subtitle, image, cta, is_active, order_index, created_at) VALUES
  ('880e8400-e29b-41d4-a716-446655440001', 'Шинэ дугуйн урамшуулал', '20% хөнгөлөлттэй', 'https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&w=800', 'Худалдан авах', true, 1, NOW());

-- Insert settings
INSERT INTO settings (id, key, value, description, updated_at) VALUES
  ('990e8400-e29b-41d4-a716-446655440001', 'shop_name', 'Түмэн-Дугуй', 'Дэлгүүрийн нэр', NOW());