-- BitNexus Supabase Setup Script
-- Run these queries in your Supabase SQL Editor to set up the database schema.

-- 1. Profiles Table (User Data)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  company_name TEXT,
  role TEXT DEFAULT 'user',
  trial_start_date TIMESTAMPTZ DEFAULT NOW(),
  subscription_expiry TIMESTAMPTZ,
  is_subscribed BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  parent_id UUID REFERENCES profiles(id),
  plan TEXT
);

-- 2. Settings Table
CREATE TABLE IF NOT EXISTS settings (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  config JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Products Table (Inventory)
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT,
  category TEXT,
  price NUMERIC DEFAULT 0,
  cost_price NUMERIC DEFAULT 0,
  quantity INT DEFAULT 0,
  min_threshold INT DEFAULT 5,
  supplier_id UUID,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  batch_number TEXT,
  expiry_date DATE,
  location TEXT,
  sustainability_score INT DEFAULT 0
);

-- 4. Sales Table (POS)
CREATE TABLE IF NOT EXISTS sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  items JSONB DEFAULT '[]'::jsonb,
  total_price NUMERIC DEFAULT 0,
  total_cost NUMERIC DEFAULT 0,
  tax_amount NUMERIC DEFAULT 0,
  date TIMESTAMPTZ DEFAULT NOW(),
  customer_name TEXT,
  location TEXT,
  payment_method TEXT DEFAULT 'cash',
  is_checked BOOLEAN DEFAULT TRUE,
  is_archived BOOLEAN DEFAULT FALSE
);

-- 5. Service Tickets Table (BitNexus Core)
CREATE TABLE IF NOT EXISTS service_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE, -- Business Owner
  customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE, -- Customer
  customer_name TEXT,
  category TEXT,
  description TEXT,
  media_url TEXT,
  preferred_date TIMESTAMPTZ,
  status TEXT DEFAULT 'pending', -- pending, assigned, in_progress, completed, cancelled
  priority TEXT DEFAULT 'medium', -- low, medium, high, emergency
  technician_id UUID,
  address TEXT,
  live_video_enabled BOOLEAN DEFAULT FALSE,
  is_emergency BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  invoice_url TEXT,
  warranty_expiry TIMESTAMPTZ,
  total_cost NUMERIC DEFAULT 0
);

-- 6. Technicians Table
CREATE TABLE IF NOT EXISTS technicians (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE, -- Business Owner
  name TEXT NOT NULL,
  rating NUMERIC DEFAULT 5.0,
  completed_jobs INT DEFAULT 0,
  earnings NUMERIC DEFAULT 0,
  zone TEXT,
  status TEXT DEFAULT 'available' -- available, busy, offline
);

-- 7. Pricing Rules Table
CREATE TABLE IF NOT EXISTS pricing_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  base_fee NUMERIC DEFAULT 0,
  emergency_multiplier NUMERIC DEFAULT 1.5,
  parts_markup_percent NUMERIC DEFAULT 20
);

-- 8. Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  category TEXT
);

-- 9. Returns Table
CREATE TABLE IF NOT EXISTS returns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  sale_id UUID,
  product_id UUID,
  product_name TEXT,
  quantity INT DEFAULT 1,
  reason TEXT,
  date TIMESTAMPTZ DEFAULT NOW(),
  refunded BOOLEAN DEFAULT FALSE,
  location TEXT
);

-- 10. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT,
  message TEXT,
  type TEXT, -- low_stock, sale, system, return
  date TIMESTAMPTZ DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create Policies (Basic Example: Users can only see their own data)
-- Note: You may need more complex policies for staff/customer access.

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own settings" ON settings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own products" ON products FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own sales" ON sales FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own tickets" ON service_tickets FOR ALL USING (auth.uid() = user_id OR auth.uid() = customer_id);
CREATE POLICY "Users can manage own technicians" ON technicians FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own pricing" ON pricing_rules FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own suppliers" ON suppliers FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own returns" ON returns FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);
