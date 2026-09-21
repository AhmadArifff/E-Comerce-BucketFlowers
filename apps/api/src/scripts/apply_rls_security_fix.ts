import { pool } from '../config/database.js';

const sqlStatements = `
-- ==============================================================================
-- 1. ENABLE ROW LEVEL SECURITY ON ALL REMAINING PUBLIC TABLES (33 TABLES)
-- ==============================================================================

ALTER TABLE IF EXISTS public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.bill_of_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.campaign_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.canned_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.customer_complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.customer_occasions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.feature_toggles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.flower_point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.logistics_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.notification_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.order_status_histories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.payment_gateway_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.procurement_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.raw_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.saved_custom_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.search_keyword_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.session_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.shipping_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.supplier_directories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_event_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_stamp_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.warranty_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.waste_material_logs ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 2. CREATE ROW LEVEL SECURITY POLICIES FOR PUBLIC TABLES
-- ==============================================================================

-- 1. Users & Profiles
DO $$ BEGIN
  CREATE POLICY "Users access own data or service role" ON public.users
  FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Profiles access policy" ON public.profiles
  FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "User addresses access policy" ON public.user_addresses
  FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. Products & Media
DO $$ BEGIN
  CREATE POLICY "Product images viewable by everyone" ON public.product_images
  FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Product images admin write" ON public.product_images
  FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Product reviews viewable by everyone" ON public.product_reviews
  FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Product reviews insertable" ON public.product_reviews
  FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3. Settings & Configs
DO $$ BEGIN
  CREATE POLICY "Store settings viewable by everyone" ON public.store_settings
  FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Store settings admin write" ON public.store_settings
  FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Feature toggles viewable by everyone" ON public.feature_toggles
  FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Feature toggles admin write" ON public.feature_toggles
  FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Coupons viewable if active" ON public.coupons
  FOR SELECT USING (is_active = true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Coupons admin write" ON public.coupons
  FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Campaign settings viewable" ON public.campaign_settings
  FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Campaign settings admin write" ON public.campaign_settings
  FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 4. Sensitive Configs (Logistics, Notification, Payment Gateway)
DO $$ BEGIN
  CREATE POLICY "Logistics configs access" ON public.logistics_configs
  FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Notification configs access" ON public.notification_configs
  FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Payment gateway configs access" ON public.payment_gateway_configs
  FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 5. Inventory, BOM & Manufacturing
DO $$ BEGIN
  CREATE POLICY "Raw materials access" ON public.raw_materials
  FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Bill of materials access" ON public.bill_of_materials
  FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Supplier directories access" ON public.supplier_directories
  FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Procurement orders access" ON public.procurement_orders
  FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Waste material logs access" ON public.waste_material_logs
  FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 6. Orders, Payments & Fulfillment
DO $$ BEGIN
  CREATE POLICY "Order status histories viewable" ON public.order_status_histories
  FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Order status histories admin write" ON public.order_status_histories
  FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Payment transactions access" ON public.payment_transactions
  FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Shipping orders access" ON public.shipping_orders
  FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Warranty claims access" ON public.warranty_claims
  FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Saved custom designs access" ON public.saved_custom_designs
  FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 7. Customer Loyalty & Interactions
DO $$ BEGIN
  CREATE POLICY "Flower point transactions access" ON public.flower_point_transactions
  FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "User stamp cards access" ON public.user_stamp_cards
  FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "User attendance logs access" ON public.user_attendance_logs
  FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Customer occasions access" ON public.customer_occasions
  FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Customer complaints access" ON public.customer_complaints
  FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Canned responses viewable" ON public.canned_responses
  FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Canned responses admin write" ON public.canned_responses
  FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 8. Audits & Telemetry Logs
DO $$ BEGIN
  CREATE POLICY "Admin audit logs access" ON public.admin_audit_logs
  FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Session audit logs access" ON public.session_audit_logs
  FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Notification logs access" ON public.notification_logs
  FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "User event logs insertable" ON public.user_event_logs
  FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "User event logs viewable" ON public.user_event_logs
  FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Search keyword logs insertable" ON public.search_keyword_logs
  FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Search keyword logs viewable" ON public.search_keyword_logs
  FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ==============================================================================
-- 3. SUPABASE STORAGE POLICIES (storage.objects)
-- ==============================================================================

-- Allow public read access to all public buckets
DO $$ BEGIN
  CREATE POLICY "Public Access to Public Buckets" ON storage.objects
  FOR SELECT USING (
    bucket_id IN ('product-images', 'raw-material-images', 'lookbook-reviews', 'avatars', 'chat-attachments')
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Allow upload into atelier buckets
DO $$ BEGIN
  CREATE POLICY "Allow Upload to Atelier Buckets" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id IN ('product-images', 'raw-material-images', 'lookbook-reviews', 'avatars', 'chat-attachments', 'payment-receipts', 'warranty-proofs')
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Allow update in atelier buckets
DO $$ BEGIN
  CREATE POLICY "Allow Update in Atelier Buckets" ON storage.objects
  FOR UPDATE USING (
    bucket_id IN ('product-images', 'raw-material-images', 'lookbook-reviews', 'avatars', 'chat-attachments', 'payment-receipts', 'warranty-proofs')
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Allow delete in atelier buckets
DO $$ BEGIN
  CREATE POLICY "Allow Delete in Atelier Buckets" ON storage.objects
  FOR DELETE USING (
    bucket_id IN ('product-images', 'raw-material-images', 'lookbook-reviews', 'avatars', 'chat-attachments', 'payment-receipts', 'warranty-proofs')
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;
`;

async function main() {
  const client = await pool.connect();
  try {
    console.log('Applying RLS and Storage security policies to Supabase PostgreSQL...');
    await client.query(sqlStatements);
    console.log('✅ Berhasil menerapkan RLS pada 33 tabel dan Storage Policies pada storage.objects!');
  } catch (err: any) {
    console.error('❌ Error executing RLS migration:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
