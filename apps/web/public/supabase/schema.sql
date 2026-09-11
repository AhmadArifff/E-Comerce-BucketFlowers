-- ==============================================================================
-- CHENILLE ATELIER - SUPABASE POSTGRESQL MASTER SCHEMA & INITIAL SEEDING
-- Target Database: Supabase PostgreSQL (AWS ap-northeast-1 Tokyo)
-- Version: 2.1.0
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. ENUMS
-- ==============================================================================

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'FLORIST_STAFF', 'CUSTOMER_MEMBER');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE theme_key AS ENUM ('TEMA_A_KOREAN_PASTEL', 'TEMA_B_MODERN_ROMANTIC', 'TEMA_C_PLAYFUL_KAWAII');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE order_fulfillment AS ENUM ('COURIER_EXPEDITION', 'COD_MEETUP_POINT');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE order_status AS ENUM (
    'WAITING_PAYMENT',
    'PAYMENT_CONFIRMED',
    'CRAFTING_BOUQUET',
    'QUALITY_CHECK_PASSED',
    'READY_FOR_DISPATCH',
    'ON_DELIVERY_EXPEDITION',
    'WAITING_AT_MEETUP_POINT',
    'COMPLETED',
    'CANCELLED'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE payment_gateway_type AS ENUM ('MIDTRANS_SNAP_QRIS', 'MANUAL_BANK_BCA', 'COD_CASH_ON_DELIVERY');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('UNPAID', 'SETTLEMENT', 'EXPIRED', 'FAILED', 'REFUNDED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE warranty_status AS ENUM ('NONE', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED_REPLACEMENT', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE raw_category AS ENUM (
    'KAWAT_BULU',
    'CELLOPHANE_PAPER',
    'PITA_SATIN',
    'AKSESORI_BONEKA',
    'DRY_FOAM_FLORAL',
    'KARDUS_PACKAGING',
    'LEM_TEMBAK_GLUE',
    'OTHER_MATERIALS'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE procurement_status AS ENUM ('DRAFT', 'ORDERED', 'ON_SHIPPING', 'ARRIVED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE waste_reason AS ENUM (
    'DAMAGED_IN_STORAGE',
    'RUSTED_WIRE',
    'TORN_CELLOPHANE',
    'PRODUCTION_MISTAKE',
    'LOW_QUALITY_SUPPLIER',
    'SAMPLE_DISPLAY_EXPIRED'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE discount_type AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE custom_category AS ENUM (
    'FLOWER_TYPE',
    'CHENILLE_COLOR',
    'WRAPPING_STYLE',
    'RIBBON_STYLE',
    'PACKAGING_BOX',
    'GREETING_SEAL',
    'ACCESSORY_ADDON'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ==============================================================================
-- 2. MASTER TABLES
-- ==============================================================================

-- 1. USERS & PROFILES
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role user_role DEFAULT 'CUSTOMER_MEMBER',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(150) NOT NULL,
  avatar_url TEXT,
  preferred_theme theme_key DEFAULT 'TEMA_A_KOREAN_PASTEL',
  flower_points INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_name VARCHAR(150) NOT NULL,
  phone_number VARCHAR(50) NOT NULL,
  full_address TEXT NOT NULL,
  city VARCHAR(100) DEFAULT 'Depok',
  postal_code VARCHAR(10),
  is_default BOOLEAN DEFAULT false,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRODUCT CATALOG
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon_name VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  category_id VARCHAR(50) REFERENCES categories(id) ON DELETE SET NULL,
  price DECIMAL(12, 2) NOT NULL,
  discount_price DECIMAL(12, 2),
  raw_cost_hpp DECIMAL(12, 2) NOT NULL,
  stock INT DEFAULT 10,
  po_lead_days INT DEFAULT 0,
  click_count INT DEFAULT 0,
  is_ready_stock BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  badge VARCHAR(100),
  rating DECIMAL(3, 2) DEFAULT 5.0,
  review_count INT DEFAULT 0,
  description TEXT,
  image_url TEXT NOT NULL,
  theme_suitability TEXT[] DEFAULT ARRAY['tema-a'],
  colors TEXT[] DEFAULT ARRAY['#FCA5A5'],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id VARCHAR(50) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0
);

-- 3. RAW MATERIALS & BOM PROCUREMENT
CREATE TABLE IF NOT EXISTS supplier_directories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  pic_name VARCHAR(150),
  phone VARCHAR(50) NOT NULL,
  address TEXT,
  marketplace_link TEXT,
  terms_notes TEXT,
  rating DECIMAL(3, 2) DEFAULT 4.9,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS raw_materials (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  category raw_category NOT NULL,
  stock INT DEFAULT 100,
  min_stock INT DEFAULT 20,
  unit VARCHAR(50) NOT NULL,
  cost_per_unit DECIMAL(12, 2) NOT NULL,
  supplier_id UUID REFERENCES supplier_directories(id) ON DELETE SET NULL,
  supplier_name VARCHAR(200) NOT NULL,
  supplier_contact VARCHAR(100) NOT NULL,
  supplier_link TEXT,
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bill_of_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id VARCHAR(50) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  raw_material_id VARCHAR(50) NOT NULL REFERENCES raw_materials(id) ON DELETE RESTRICT,
  quantity_needed INT NOT NULL,
  subtotal_cost DECIMAL(12, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS procurement_orders (
  id VARCHAR(50) PRIMARY KEY,
  material_id VARCHAR(50) NOT NULL REFERENCES raw_materials(id) ON DELETE RESTRICT,
  material_name VARCHAR(200) NOT NULL,
  supplier_id UUID REFERENCES supplier_directories(id) ON DELETE SET NULL,
  supplier_name VARCHAR(200) NOT NULL,
  supplier_contact VARCHAR(100),
  supplier_link TEXT,
  order_date TIMESTAMPTZ DEFAULT NOW(),
  estimated_arrival TIMESTAMPTZ NOT NULL,
  actual_arrival TIMESTAMPTZ,
  qty_ordered INT NOT NULL,
  unit VARCHAR(50) NOT NULL,
  cost_per_unit DECIMAL(12, 2) NOT NULL,
  total_cost DECIMAL(14, 2) NOT NULL,
  status procurement_status DEFAULT 'ORDERED',
  tracking_number VARCHAR(100),
  is_stock_added BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS waste_material_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id VARCHAR(50) REFERENCES raw_materials(id) ON DELETE SET NULL,
  material_name VARCHAR(200) NOT NULL,
  category raw_category NOT NULL,
  qty INT NOT NULL,
  unit VARCHAR(50) NOT NULL,
  cost_per_unit DECIMAL(12, 2) NOT NULL,
  total_loss DECIMAL(14, 2) NOT NULL,
  reason waste_reason NOT NULL,
  mitigation_action TEXT,
  reported_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. GOOGLE MAPS COD POINTS & GEOFENCING
CREATE TABLE IF NOT EXISTS cod_meetup_points (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  full_address TEXT NOT NULL,
  google_maps_url TEXT NOT NULL,
  distance_km DECIMAL(4, 1) NOT NULL,
  delivery_notes TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  radius_meters INT DEFAULT 500,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CUSTOM STUDIO BUILDER
CREATE TABLE IF NOT EXISTS custom_studio_options (
  id VARCHAR(50) PRIMARY KEY,
  category custom_category NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price_modifier DECIMAL(12, 2) DEFAULT 0,
  emoji_or_icon VARCHAR(50),
  hex_color VARCHAR(20),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS saved_custom_designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  design_name VARCHAR(200) NOT NULL,
  flower_type_id VARCHAR(50) REFERENCES custom_studio_options(id),
  chenille_color_id VARCHAR(50) REFERENCES custom_studio_options(id),
  wrapping_style_id VARCHAR(50) REFERENCES custom_studio_options(id),
  ribbon_style_id VARCHAR(50) REFERENCES custom_studio_options(id),
  packaging_box_id VARCHAR(50) REFERENCES custom_studio_options(id),
  greeting_seal_id VARCHAR(50) REFERENCES custom_studio_options(id),
  addon_ids TEXT[] DEFAULT ARRAY[]::TEXT[],
  calculated_total DECIMAL(12, 2) NOT NULL,
  preview_snapshot_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ORDERS, TRANSACTIONS & FULFILLMENT
CREATE TABLE IF NOT EXISTS coupons (
  id VARCHAR(50) PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type discount_type NOT NULL,
  discount_value DECIMAL(12, 2) NOT NULL,
  min_order_amount DECIMAL(12, 2) DEFAULT 0,
  quota INT DEFAULT 100,
  used_count INT DEFAULT 0,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS flower_point_transactions (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  order_id VARCHAR(100),
  type VARCHAR(20) NOT NULL, -- 'EARN' | 'REDEEM' | 'WELCOME_BONUS' | 'ADJUSTMENT'
  points INT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(50) PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  customer_name VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_email VARCHAR(150) NOT NULL,
  recipient_name VARCHAR(150) NOT NULL,
  fulfillment_type order_fulfillment NOT NULL,
  shipping_address TEXT,
  cod_meetup_id VARCHAR(50) REFERENCES cod_meetup_points(id) ON DELETE SET NULL,
  cod_notes TEXT,
  total_amount DECIMAL(14, 2) NOT NULL,
  discount_amount DECIMAL(12, 2) DEFAULT 0,
  coupon_id VARCHAR(50) REFERENCES coupons(id) ON DELETE SET NULL,
  points_redeemed INT DEFAULT 0,
  points_earned INT DEFAULT 0,
  total_hpp_cost DECIMAL(14, 2) NOT NULL,
  payment_method payment_gateway_type NOT NULL,
  payment_status payment_status DEFAULT 'UNPAID',
  order_status order_status DEFAULT 'WAITING_PAYMENT',
  current_step INT DEFAULT 1,
  courier_name VARCHAR(100),
  tracking_number VARCHAR(100),
  warranty_status warranty_status DEFAULT 'NONE',
  warranty_claim_reason TEXT,
  warranty_evidence_url TEXT,
  theme_used theme_key DEFAULT 'TEMA_A_KOREAN_PASTEL',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(50) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id VARCHAR(50) REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(200) NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  raw_cost_hpp DECIMAL(12, 2) NOT NULL,
  quantity INT DEFAULT 1,
  subtotal DECIMAL(14, 2) NOT NULL,
  custom_specs_json JSONB
);

CREATE TABLE IF NOT EXISTS order_status_histories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(50) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  status_title VARCHAR(150) NOT NULL,
  status_desc TEXT NOT NULL,
  photo_proof_url TEXT,
  action_by VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_transactions (
  id VARCHAR(100) PRIMARY KEY,
  order_id VARCHAR(50) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  gateway_type payment_gateway_type NOT NULL,
  amount DECIMAL(14, 2) NOT NULL,
  status payment_status DEFAULT 'UNPAID',
  snap_token TEXT,
  payment_url TEXT,
  bca_va_number VARCHAR(50),
  qr_code_url TEXT,
  paid_at TIMESTAMPTZ,
  raw_webhook_payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
  product_id VARCHAR(50) REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  customer_name VARCHAR(150) NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  photo_url TEXT,
  is_verified_buyer BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. LIVE WEB CHAT & CUSTOMER SERVICE
CREATE TABLE IF NOT EXISTS chat_sessions (
  id VARCHAR(50) PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  guest_name VARCHAR(150) NOT NULL,
  guest_email VARCHAR(150),
  is_escalated_wa BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(50) NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  sender VARCHAR(50) NOT NULL,
  text TEXT NOT NULL,
  attachment_url TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS canned_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger_keyword VARCHAR(100) NOT NULL,
  title VARCHAR(150) NOT NULL,
  message_text TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'FAQ',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- 8. STORE SETTINGS & FEATURE TOGGLES
CREATE TABLE IF NOT EXISTS store_settings (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'atelier_setting',
  store_name VARCHAR(150) DEFAULT 'Chenille Atelier Depok',
  tagline TEXT DEFAULT 'Buket Bunga Kawat Bulu Chenille Premium & Graduation Florist',
  official_whatsapp VARCHAR(50) DEFAULT '+62 812-9831-7721',
  studio_address TEXT DEFAULT 'Jl. Margonda Raya No. 120, Beji, Kota Depok, Jawa Barat 16424',
  daily_po_limit INT DEFAULT 25,
  active_theme theme_key DEFAULT 'TEMA_A_KOREAN_PASTEL',
  is_maintenance_mode BOOLEAN DEFAULT false,
  maintenance_title TEXT DEFAULT 'Atelier Chenille Sedang Istirahat Produksi',
  maintenance_desc TEXT DEFAULT 'Kapasitas buket wisuda hari ini telah penuh.',
  latitude VARCHAR(50) DEFAULT '-6.3728',
  longitude VARCHAR(50) DEFAULT '106.8315',
  maps_link VARCHAR(255) DEFAULT 'https://maps.google.com/?q=-6.3728,106.8315',
  max_cod_radius_km DECIMAL(4, 1) DEFAULT 5.0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_gateway_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gateway_type payment_gateway_type UNIQUE NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  credentials_json JSONB,
  admin_fee DECIMAL(10, 2) DEFAULT 0,
  max_distance_km DECIMAL(4, 1),
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS feature_toggles (
  key VARCHAR(100) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  is_enabled BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. INDEXES FOR PERFORMANCE OPTIMIZATION
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_raw_materials_category ON raw_materials(category);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cod_meetup_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_studio_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Public can read active catalog items
DO $$ BEGIN
  CREATE POLICY "Public products are viewable by everyone" ON products FOR SELECT USING (is_active = true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Public categories are viewable by everyone" ON categories FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Public cod meetup points are viewable" ON cod_meetup_points FOR SELECT USING (is_active = true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Public custom studio options are viewable" ON custom_studio_options FOR SELECT USING (is_active = true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Published reviews are viewable" ON reviews FOR SELECT USING (is_published = true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Orders viewable by guest or owner
DO $$ BEGIN
  CREATE POLICY "Customers can view their orders" ON orders FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Customers can insert orders" ON orders FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Order items viewable with order" ON order_items FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Order items insertable" ON order_items FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ==============================================================================
-- 5. SUPABASE STORAGE BUCKETS
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('product-images', 'product-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('raw-material-images', 'raw-material-images', true, 3145728, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('lookbook-reviews', 'lookbook-reviews', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('chat-attachments', 'chat-attachments', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('payment-receipts', 'payment-receipts', false, 5242880, ARRAY['image/jpeg', 'image/png', 'application/pdf']),
  ('warranty-proofs', 'warranty-proofs', false, 31457280, ARRAY['image/jpeg', 'image/png', 'video/mp4'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ==============================================================================
-- 6. INITIAL SEED DATA
-- ==============================================================================

-- 1. Store Setting
INSERT INTO store_settings (id, store_name, tagline, official_whatsapp, studio_address, daily_po_limit, active_theme)
VALUES (
  'atelier_setting',
  'Chenille Atelier Depok',
  'Buket Bunga Kawat Bulu Chenille Premium & Graduation Florist',
  '+62 812-9831-7721',
  'Jl. Margonda Raya No. 120, Beji, Kota Depok, Jawa Barat 16424',
  25,
  'TEMA_A_KOREAN_PASTEL'
) ON CONFLICT (id) DO NOTHING;

-- 2. Categories
INSERT INTO categories (id, name, slug, description, icon_name)
VALUES
  ('cat-wisuda', 'Buket Wisuda', 'wisuda', 'Buket bunga kawat bulu graduation ber-toga', 'GraduationCap'),
  ('cat-pastel', 'Korean Pastel', 'pastel', 'Kombinasi warna lembut khas florist Seoul', 'Sparkles'),
  ('cat-karakter', 'Karakter Lucu', 'karakter', 'Buket ornamen boneka & ekspresi kawaii', 'Smile'),
  ('cat-romantis', 'Edisi Romantis', 'romantis', 'Red velvet mawar untuk anniversary & kencan', 'Heart'),
  ('cat-minipot', 'Mini Pot Meja', 'mini-pot', 'Bunga meja mini pot keramik belajar', 'Coffee')
ON CONFLICT (id) DO NOTHING;

-- 3. 8 Products
INSERT INTO products (id, name, slug, category_id, price, discount_price, raw_cost_hpp, stock, po_lead_days, click_count, is_ready_stock, is_active, badge, rating, review_count, description, image_url, theme_suitability, colors)
VALUES
  ('prod-001', 'Buket Mawar Merah Velvet Wisuda', 'buket-mawar-merah-velvet', 'cat-wisuda', 165000, 149000, 48500, 12, 2, 1420, true, true, 'Terlaris Wisuda', 4.9, 184, 'Buket bunga mawar kawat bulu halus premium 12 tangkai berpadu dengan boneka wisuda toga mini, dibungkus cellophane Korea matte water-resistant.', '/images/products/buket-mawar-merah-velvet.jpg', ARRAY['tema-a', 'tema-b'], ARRAY['#E11D48', '#FDA4AF', '#FFE4E6']),
  ('prod-002', 'Buket Tulip Pastel Pink Korean Style', 'buket-tulip-pastel-pink', 'cat-pastel', 145000, NULL, 38000, 8, 1, 980, true, true, 'Trending Korea', 4.8, 96, 'Buket 7 tangkai tulip kawat bulu kelopak mekar lembut bernuansa baby pink dan sage green, sentuhan pita organza transparan mewah.', '/images/products/buket-tulip-pastel-pink.jpg', ARRAY['tema-a', 'tema-b'], ARRAY['#FBCFE8', '#BBF7D0']),
  ('prod-003', 'Buket Bunga Matahari Graduation Ceria', 'buket-matahari-graduation', 'cat-wisuda', 135000, NULL, 35500, 10, 2, 1120, true, true, 'Wisuda Favorit', 4.9, 112, 'Buket 5 tangkai bunga matahari kawat bulu ceria dengan selempang wisuda kecil, pembungkus cellophane kuning doff elegan.', '/images/products/buket-matahari-graduation.jpg', ARRAY['tema-a', 'tema-c'], ARRAY['#FACC15', '#EA580C', '#FEF08A']),
  ('prod-004', 'Buket Lavender Lilac Dream', 'buket-lavender-lilac-dream', 'cat-pastel', 125000, NULL, 32000, 6, 2, 890, true, true, 'Wangi Estetik', 4.9, 78, 'Buket paduan tangkai lavender kawat bulu ungu lilac harum berpadu pita satin mewah, cocok untuk hadiah sidang skripsi dan ulang tahun.', '/images/products/buket-lavender-lilac-dream.jpg', ARRAY['tema-a', 'tema-b'], ARRAY['#C084FC', '#E9D5FF', '#F5D0FE']),
  ('prod-005', 'Buket Karakter Wisuda Ber-toga', 'buket-karakter-wisuda-toga', 'cat-karakter', 175000, 159000, 54000, 7, 3, 1310, false, true, 'Custom Nama & Gelar', 5.0, 104, 'Buket bunga kawat bulu premium dengan boneka wisuda karakter ber-toga mini lengkap dengan selempang sablon nama wisudawan custom.', '/images/products/buket-karakter-wisuda-toga.jpg', ARRAY['tema-c', 'tema-a'], ARRAY['#38BDF8', '#FDE047', '#1E293B']),
  ('prod-006', 'Mini Pot Bunga Daisy Kawat Bulu Meja Belajar', 'mini-pot-daisy-kawat-bulu', 'cat-minipot', 45000, NULL, 14000, 20, 1, 650, true, true, 'Best Budget', 4.7, 54, 'Pot gerabah mini estetik dengan 5 tangkai bunga daisy kawat bulu warna pastel, cocok untuk penghias meja kerja atau kado sahabat.', '/images/products/mini-pot-daisy-kawat-bulu.jpg', ARRAY['tema-a', 'tema-c'], ARRAY['#FDE047', '#E0E7FF', '#FBCFE8']),
  ('prod-007', 'Midnight Rose & Velvet Romance Deluxe', 'midnight-rose-velvet-romance', 'cat-romantis', 195000, 175000, 58000, 5, 3, 1750, false, true, 'Edisi Mewah', 5.0, 62, 'Buket mawar merah maroon pekat berbahan kawat bulu bertekstur beludru mewah beraksen dedaunan emas, cellophane hitam doff & pita satin merah anggur.', '/images/products/midnight-rose-velvet-romance.jpg', ARRAY['tema-b'], ARRAY['#881337', '#B45309', '#1E293B']),
  ('prod-008', 'Buket Bunga Matahari Kawaii Smile Sunflower', 'buket-matahari-kawaii-smile', 'cat-karakter', 85000, NULL, 24500, 15, 1, 1120, true, true, 'Mood Booster', 4.9, 118, 'Buket 3 bunga matahari kawat bulu ceria dengan ekspresi wajah kawaii imut, ornamen pita kuning polkadot yang menggemaskan.', '/images/products/buket-matahari-kawaii-smile.jpg', ARRAY['tema-c', 'tema-a'], ARRAY['#FACC15', '#EA580C', '#4ADE80'])
ON CONFLICT (id) DO NOTHING;

-- 4. Suppliers & Raw Materials
INSERT INTO raw_materials (id, name, category, stock, min_stock, unit, cost_per_unit, supplier_name, supplier_contact, supplier_link, notes)
VALUES
  ('mat-1', 'Batang Kawat Bulu Burgundy (6mm)', 'KAWAT_BULU', 450, 100, 'Batang', 350, 'Toko Kawat Bulu Chenille Jaya Bandung', '081234567890', 'https://shopee.co.id/chenille-jaya-bandung', 'Kawat bulu velvet halus tidak mudah rontok'),
  ('mat-2', 'Batang Kawat Bulu Hijau Zaitun (6mm)', 'KAWAT_BULU', 280, 80, 'Batang', 350, 'Toko Kawat Bulu Chenille Jaya Bandung', '081234567890', 'https://shopee.co.id/chenille-jaya-bandung', 'Untuk daun dan tangkai buket bunga atelier'),
  ('mat-3', 'Batang Kawat Bulu Pastel Pink (6mm)', 'KAWAT_BULU', 520, 150, 'Batang', 350, 'Toko Kawat Bulu Chenille Jaya Bandung', '081234567890', 'https://shopee.co.id/chenille-jaya-bandung', 'Bahan utama buket mawar pastel sakura'),
  ('mat-4', 'Kawat Batang Penyangga Hijau No. 18', 'OTHER_MATERIALS', 600, 150, 'Batang', 500, 'Florist Hardware Jakarta Pasar Pagi', '081987654321', 'https://tokopedia.com/floristhardware', 'Batang kawat kokoh panjang 40cm'),
  ('mat-5', 'Kertas Wrapping Cellophane Korean Matte Maroon Gold', 'CELLOPHANE_PAPER', 85, 25, 'Lembar', 4500, 'Korean Wrapping Depok Grosir', '082133445566', 'https://shopee.co.id/koreanwrapping', 'Kertas tahan air dua sisi matte lis gold'),
  ('mat-6', 'Pita Satin Premium Burgundy Lis Emas (2.5cm)', 'PITA_SATIN', 95, 20, 'Meter', 2200, 'Toko Pita Cantik Mangga Dua', '085711223344', 'https://tokopedia.com/pitacantik', 'Pita satin mengkilap untuk ikatan buket'),
  ('mat-7', 'Boneka Teddy Wisuda Ber-toga Mini (10cm)', 'AKSESORI_BONEKA', 35, 10, 'Pcs', 7400, 'Souvenir Wisuda Depok Jaya', '081399887766', 'https://shopee.co.id/souvenirwisuda', 'Boneka wisuda ber-toga hitam & selempang')
ON CONFLICT (id) DO NOTHING;

-- 5. 6 COD Points Depok
INSERT INTO cod_meetup_points (id, name, full_address, google_maps_url, distance_km, delivery_notes, latitude, longitude)
VALUES
  ('cod-001', 'Universitas Indonesia (Stasiun UI / Rotunda)', 'Stasiun Kereta UI, Pondok Cina, Beji, Kota Depok, Jawa Barat 16424', 'https://maps.google.com/?q=-6.3628,106.8315', 2.1, 'Titik temu di Indomaret Point Stasiun UI / Halte Bikun Rektorat', -6.36280000, 106.83150000),
  ('cod-002', 'Universitas Gunadarma Kampus D Margonda', 'Jl. Margonda Raya No. 100, Pondok Cina, Beji, Kota Depok, Jawa Barat 16424', 'https://maps.google.com/?q=-6.3692,106.8322', 1.4, 'Titik temu di lobi depan Gedung 1 Kampus D Margonda', -6.36920000, 106.83220000),
  ('cod-003', 'Margo City Mall Depok (Lobby Starbucks GF)', 'Jl. Margonda Raya No. 358, Kemiri Muka, Beji, Kota Depok, Jawa Barat 16423', 'https://maps.google.com/?q=-6.3732,106.8345', 1.8, 'Lobby Utama depan Starbucks GF, dekat drop off mobil', -6.37320000, 106.83450000),
  ('cod-004', 'Politeknik Negeri Jakarta (PNJ - Lobi Utama)', 'Kukusan, Beji, Kota Depok, Jawa Barat 16425', 'https://maps.google.com/?q=-6.3601,106.8272', 2.8, 'Titik temu di gerbang utama PNJ Kukusan', -6.36010000, 106.82720000),
  ('cod-005', 'Stasiun KRL Pondok Cina (Pintu Timur)', 'Pondok Cina, Kecamatan Beji, Kota Depok, Jawa Barat 16424', 'https://maps.google.com/?q=-6.3688,106.8336', 1.6, 'Pintu keluar timur dekat jembatan penyeberangan Margo City', -6.36880000, 106.83360000),
  ('cod-006', 'D Mall Depok (Pintu Masuk Utama Depan)', 'Jl. Margonda Raya Kav. 88, Kemiri Muka, Beji, Kota Depok, Jawa Barat 16423', 'https://maps.google.com/?q=-6.3862,106.8285', 3.9, 'Drop off depan lobby pintu masuk D Mall Margonda', -6.38620000, 106.82850000)
ON CONFLICT (id) DO NOTHING;

-- 6. Custom Studio Options (7 Categories)
INSERT INTO custom_studio_options (id, category, name, description, price_modifier, emoji_or_icon, hex_color, sort_order)
VALUES
  -- Bunga
  ('c-flw-tulip', 'FLOWER_TYPE', 'Tulip Cantik', 'Kelopak mekar anggun', 120000, '🌷', NULL, 1),
  ('c-flw-rose', 'FLOWER_TYPE', 'Mawar Velvet', 'Tekstur beludru merah romantis', 130000, '🌹', NULL, 2),
  ('c-flw-sun', 'FLOWER_TYPE', 'Bunga Matahari', 'Kelopak ceria graduation', 115000, '🌻', NULL, 3),
  ('c-flw-lavender', 'FLOWER_TYPE', 'Lavender Harum', 'Kesan tenang elegan', 125000, '🪻', NULL, 4),
  -- Warna Kawat
  ('c-col-pink', 'CHENILLE_COLOR', 'Pastel Pink', 'Warna sakura lembut', 0, NULL, '#F4A7B9', 1),
  ('c-col-lilac', 'CHENILLE_COLOR', 'Lavender Lilac', 'Ungu lembut estetik', 0, NULL, '#C4B5FD', 2),
  ('c-col-blue', 'CHENILLE_COLOR', 'Sky Blue', 'Biru langit segar', 0, NULL, '#BAE6FD', 3),
  ('c-col-sage', 'CHENILLE_COLOR', 'Matcha Sage', 'Hijau sage natural', 0, NULL, '#A8C3A0', 4),
  -- Wrapping
  ('c-wrp-korean', 'WRAPPING_STYLE', 'Korean Two-Tone Pink', 'Cellophane matte lembut dua sisi', 0, '🎀', NULL, 1),
  ('c-wrp-velvet', 'WRAPPING_STYLE', 'Lilac & White Velvet', 'Aksen beludru elegan', 0, '✨', NULL, 2),
  ('c-wrp-oat', 'WRAPPING_STYLE', 'Minimalist Clean Oat', 'Nuansa earth tone aesthetic', 0, '🌿', NULL, 3),
  -- Ribbon
  ('c-rbn-satin', 'RIBBON_STYLE', 'Pita Satin Mengkilap', 'Klasik elegan berkilau', 0, '🎀', NULL, 1),
  ('c-rbn-organza', 'RIBBON_STYLE', 'Pita Organza Transparan', 'Kesan dreamy & airy', 5000, '🎗️', NULL, 2),
  ('c-rbn-chiffon', 'RIBBON_STYLE', 'Chiffon Ruffle Wave', 'Aksen gelombang Korea', 7500, '🌸', NULL, 3),
  ('c-rbn-rustic', 'RIBBON_STYLE', 'Tali Rami Vintage', 'Nuansa rustic estetik', 3000, '🧵', NULL, 4),
  -- Packaging
  ('c-pkg-standard', 'PACKAGING_BOX', 'Standard Protective Sleeve', 'Plastik florist tebal bening', 0, '📦', NULL, 1),
  ('c-pkg-mika', 'PACKAGING_BOX', 'Box Jendela Mika Eksklusif', 'Kotak kardus kaku mewah', 12000, '🎁', NULL, 2),
  ('c-pkg-pvc', 'PACKAGING_BOX', 'Tas Jinjing PVC Bening', 'Tas aesthetic praktis wisuda', 8000, '🛍️', NULL, 3),
  ('c-pkg-gold', 'PACKAGING_BOX', 'Paper Bag Mewah Lis Gold', 'Tas kertas tebal premium', 6000, '👜', NULL, 4),
  -- Greeting Card
  ('c-grt-std', 'GREETING_SEAL', 'Kartu Standard Cetak', 'Art paper 260gsm cetak rapi', 0, '✉️', NULL, 1),
  ('c-grt-foil', 'GREETING_SEAL', 'Kartu Hotprint Gold Foil', 'Tulisan emas berkilau mewah', 5000, '✨', NULL, 2),
  ('c-grt-wax', 'GREETING_SEAL', 'Vintage Wax Seal Stamp', 'Amplop segel lilin stempel bunga', 8000, '📜', NULL, 3),
  -- Addons
  ('c-adn-led', 'ACCESSORY_ADDON', 'Lampu LED Fairy Light (Warm Glow)', 'Kabel kawat fleksibel 1 meter', 10000, '💡', NULL, 1),
  ('c-adn-bear', 'ACCESSORY_ADDON', 'Boneka Toga Wisuda Mini (10cm)', 'Teddy bear wisuda ber-toga', 15000, '🧸', NULL, 2),
  ('c-adn-pin', 'ACCESSORY_ADDON', 'Pin Bros Kupu-kupu Kristal', 'Aksen bros pin berkilau', 5000, '🦋', NULL, 3)
ON CONFLICT (id) DO NOTHING;

-- 7. Coupons
INSERT INTO coupons (id, code, discount_type, discount_value, min_order_amount, quota, is_active)
VALUES
  ('cpn-wisuda', 'WISUDAHEMAT', 'FIXED_AMOUNT', 25000, 150000, 50, true),
  ('cpn-love', 'LOVECHENILLE', 'PERCENTAGE', 10, 100000, 100, true),
  ('cpn-ongkir', 'ONGKIRFREE', 'FREE_SHIPPING', 15000, 120000, 30, true)
ON CONFLICT (id) DO NOTHING;

-- 8. Feature Toggles
INSERT INTO feature_toggles (key, name, description, is_enabled)
VALUES
  ('toggle_po_throttling', 'PO Capacity Throttling', 'Batasi penerimaan order harian jika workshop penuh', true),
  ('toggle_free_cod_radius', 'Free Delivery Radius', 'Gratis ongkir untuk titik temu COD dalam radius 5 km', true),
  ('toggle_midtrans_gateway', 'Midtrans Gateway Active', 'Aktifkan pembayaran QRIS, GoPay, ShopeePay via Midtrans', true),
  ('toggle_web_chat_support', 'Internal Live Web Chat', 'Layanan chat konsultasi langsung di dalam web browser', true),
  ('toggle_whatsapp_escalation', 'WhatsApp Order Escalation', 'Arahkan kustomisasi kompleks ke WhatsApp Pengrajin', true),
  ('toggle_promo_banners', 'Promotional Banner Strip', 'Tampilkan pengumuman kupon diskon dan promo di header', true),
  ('toggle_maintenance', 'Maintenance Mode', 'Kunci transaksi publik saat studio istirahat produksi', false)
ON CONFLICT (key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;
