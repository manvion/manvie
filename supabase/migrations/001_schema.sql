-- ─────────────────────────────────────────────────────────────────────────────
-- Manvié — Production Database Schema
-- Run this in your Supabase SQL editor before going live.
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Supplier Profiles ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS supplier_profiles (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  company_name    TEXT NOT NULL,
  contact_name    TEXT NOT NULL,
  email           TEXT NOT NULL UNIQUE,
  phone           TEXT,
  location        TEXT,
  country         TEXT,
  specialty       TEXT,
  description     TEXT,
  annual_capacity INTEGER,
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'active', 'denied')),
  products_count  INTEGER DEFAULT 0,
  total_revenue   DECIMAL(12,2) DEFAULT 0,
  rating          DECIMAL(3,1),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  approved_at     TIMESTAMPTZ,
  approved_by     TEXT
);

-- ── Products ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         TEXT NOT NULL,
  name_fr      TEXT,
  category     TEXT NOT NULL,
  subcategory  TEXT,
  gender       TEXT CHECK (gender IN ('femme', 'homme', 'enfant', 'unisex')),
  price        DECIMAL(10,2) NOT NULL,
  base_cost    DECIMAL(10,2),
  stock        INTEGER DEFAULT 0,
  status       TEXT NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'active', 'denied')),
  badge        TEXT,
  supplier_id  UUID REFERENCES supplier_profiles(id) ON DELETE SET NULL,
  supplier_name TEXT,
  image_url    TEXT,
  description  TEXT,
  description_fr TEXT,
  sizes        TEXT[],
  sku          TEXT UNIQUE,
  sales_count  INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── Orders ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number     TEXT UNIQUE NOT NULL,
  customer_id      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_email   TEXT NOT NULL,
  customer_name    TEXT,
  total            DECIMAL(10,2) NOT NULL,
  currency         TEXT DEFAULT 'CAD',
  status           TEXT NOT NULL DEFAULT 'processing'
                   CHECK (status IN ('processing', 'shipped', 'delivered', 'cancelled')),
  stripe_session_id TEXT UNIQUE,
  shipping_address JSONB,
  items            JSONB,
  supplier_id      UUID REFERENCES supplier_profiles(id) ON DELETE SET NULL,
  supplier_name    TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'ORD-' || LPAD((FLOOR(RANDOM() * 90000) + 10000)::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql;

-- ── Customer Profiles ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS customer_profiles (
  id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name        TEXT,
  phone            TEXT,
  preferred_gender TEXT,
  preferred_size   TEXT,
  avatar_url       TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create customer profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO customer_profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── Row Level Security ────────────────────────────────────────────────────────

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;

-- Public can view active products
CREATE POLICY "Public read active products"
  ON products FOR SELECT USING (status = 'active');

-- Service role can do everything (used by API routes with service key)
CREATE POLICY "Service role full access products"
  ON products USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access orders"
  ON orders USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access suppliers"
  ON supplier_profiles USING (auth.role() = 'service_role');

-- Customers can view their own orders
CREATE POLICY "Customers view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = customer_id);

-- Customers can view/update their own profile
CREATE POLICY "Customers manage own profile"
  ON customer_profiles
  USING (auth.uid() = id);

-- ── Seed Data ─────────────────────────────────────────────────────────────────

-- Seed supplier profiles
INSERT INTO supplier_profiles (company_name, contact_name, email, location, country, specialty, status, products_count, total_revenue, rating)
VALUES
  ('Atelier Blanc',  'Sophie Tremblay', 'atelier.blanc@example.com',  'Montréal', 'CA', 'Outerwear & Coats',     'active', 4, 68400,  4.9),
  ('Maison Rouge',   'Marco Rossi',     'maison.rouge@example.com',   'Milan',    'IT', 'Dresses & Gowns',       'active', 3, 41200,  4.8),
  ('Studio Noir',    'James Harlow',    'studio.noir@example.com',    'London',   'GB', 'Accessories & Leather', 'active', 3, 18800,  4.7)
ON CONFLICT DO NOTHING;

-- Seed products (references supplier by company name for seed convenience)
INSERT INTO products (name, category, gender, price, base_cost, stock, status, badge, supplier_name, image_url, sku, sales_count, sizes)
VALUES
  ('Signature Cashmere Coat',  'La Femme',  'femme',  2400, 450, 12, 'active', 'Bestseller', 'Atelier Blanc', 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800&auto=format&fit=crop', 'MB-001', 48, ARRAY['XS','S','M','L','XL']),
  ('Atelier Silk Dress',       'La Femme',  'femme',  1850, 320,  8, 'active', 'New',        'Maison Rouge',  'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop', 'MB-002', 31, ARRAY['XS','S','M','L']),
  ('Noir Evening Gown',        'La Femme',  'femme',  4200, 680,  4, 'active', 'Limited',    'Studio Noir',   'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop', 'MB-003', 17, ARRAY['XS','S','M']),
  ('Ivory Wrap Dress',         'La Femme',  'femme',  1650, 300, 15, 'active', null,         'Maison Rouge',  'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&auto=format&fit=crop', 'MB-004', 22, ARRAY['XS','S','M','L','XL']),
  ('Organza Blouse',           'La Femme',  'femme',   890, 180, 20, 'active', 'New',        'Maison Rouge',  'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=800&auto=format&fit=crop', 'MB-005',  9, ARRAY['XS','S','M','L']),
  ('Classic Wool Blazer',      'L''Homme',  'homme',  1500, 280, 10, 'active', 'Bestseller', 'Atelier Blanc', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop', 'MB-006', 45, ARRAY['S','M','L','XL','XXL']),
  ('Heritage Trench Coat',     'L''Homme',  'homme',  2800, 520,  6, 'active', 'New',        'Atelier Blanc', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop', 'MB-007', 19, ARRAY['S','M','L','XL']),
  ('Velvet Smoking Jacket',    'L''Homme',  'homme',  1950, 380,  8, 'active', 'Limited',    'Studio Noir',   'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop', 'MB-008', 12, ARRAY['S','M','L','XL']),
  ('Tailored Suit',            'L''Homme',  'homme',  3400, 680,  5, 'active', 'New',        'Atelier Blanc', 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=800&auto=format&fit=crop', 'MB-009',  8, ARRAY['S','M','L','XL','XXL']),
  ('Merino Wool Coat',         'L''Homme',  'homme',  2100, 400,  9, 'active', null,         'Atelier Blanc', 'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=800&auto=format&fit=crop', 'MB-010', 14, ARRAY['S','M','L','XL']),
  ('Miniature Cashmere Wrap',  'L''Enfant', 'enfant',  650, 120, 20, 'active', 'New',        'Maison Rouge',  'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop', 'MB-011', 15, ARRAY['2Y','4Y','6Y','8Y']),
  ('Petit Wool Pea Coat',      'L''Enfant', 'enfant',  890, 180, 12, 'active', null,         'Atelier Blanc', 'https://images.unsplash.com/photo-1522771930-78848d92871d?q=80&w=800&auto=format&fit=crop', 'MB-012',  9, ARRAY['4Y','6Y','8Y','10Y','12Y']),
  ('Silk Party Dress',         'L''Enfant', 'enfant',  580, 110,  8, 'active', 'Limited',    'Maison Rouge',  'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=800&auto=format&fit=crop', 'MB-013',  6, ARRAY['2Y','4Y','6Y','8Y']),
  ('Italian Leather Handbag',  'L''Atelier','unisex', 3200, 680,  6, 'active', 'Bestseller', 'Maison Rouge',  'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800&auto=format&fit=crop', 'MB-014', 22, null),
  ('18k Gold Chain Necklace',  'L''Atelier','unisex',  850, 200, 15, 'active', 'New',        'Studio Noir',   'https://images.unsplash.com/photo-1515562141589-67f0d727b750?q=80&w=800&auto=format&fit=crop', 'MB-015', 18, null),
  ('Signature Silk Scarf',     'L''Atelier','unisex',  420,  80, 30, 'active', null,         'Maison Rouge',  'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=800&auto=format&fit=crop', 'MB-016', 34, null),
  ('Suede Belt',               'L''Atelier','unisex',  490, 100, 22, 'active', null,         'Studio Noir',   'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop', 'MB-017', 11, null),
  ('Diamond Stud Earrings',    'L''Atelier','unisex', 2200, 600,  8, 'active', 'Limited',    'Studio Noir',   'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop', 'MB-018',  7, null)
ON CONFLICT (sku) DO NOTHING;
