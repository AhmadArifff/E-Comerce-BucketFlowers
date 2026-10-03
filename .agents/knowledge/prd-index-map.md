# PRD Index Map: Pemetaan 42 Seksi PRD.md ke Database & Kode

Dokumen ini adalah kompas utama untuk agent AI agar dapat langsung melompat ke file kode dan tabel database yang tepat sesuai seksi [PRD.md](../../PRD.md) yang diminta oleh pengguna:

---

| Seksi | Judul Fitur di PRD | Tabel Database Supabase | Route Backend (apps/api) | Komponen & Store Frontend (apps/web) |
| :---: | :--- | :--- | :--- | :--- |
| **1** | Etalase Katalog Produk & Diskon | `products`, `product_images`, `categories` | `GET /api/v1/products` | `ProductGrid.tsx`, `ProductCard.tsx` |
| **2** | Studio Kustomisasi Buket Interaktif | `custom_studio_options`, `saved_custom_designs` | `GET /api/v1/custom-studio` | `CustomStudioSection.tsx`, `useCartStore.ts` |
| **3** | Keranjang Belanja & WA Order | Local Storage (`useCartStore`) | - | `CartDrawer.tsx`, `useCartStore.ts` |
| **4** | Checkout Dinamis & Pengambilan | `orders`, `order_items` | `POST /api/v1/orders` | `CheckoutModal.tsx` |
| **5** | Ekspor Laporan Excel & CSV UTF-8 BOM | `orders`, `order_items`, `bill_of_materials` | `GET /api/v1/orders/reports` | `export-excel.ts`, `AdminViews.tsx` (ReportsView) |
| **6** | Payment Gateway Triple Split | `payment_gateway_configs`, `payment_transactions` | `/api/v1/payment/*` | `CheckoutModal.tsx`, `useSettingsStore.ts` |
| **7** | COD 6 Titik Margonda & Kampus | `cod_meetup_points` | `GET /api/v1/cod-points` | `CodMeetupSelector.tsx` |
| **8** | Biteship Kurir Logistik & Ongkir | `logistics_configs`, `shipping_orders` | `/api/v1/shipping/*` | `CheckoutModal.tsx`, `useSettingsStore.ts` |
| **9** | Live Chat Interaktif & Balasan Cepat | `chat_sessions`, `chat_messages`, `canned_responses` | `/api/v1/chat/*` | `FloatingChat.tsx`, `useChatStore.ts` |
| **10** | Garansi 100% Anti-Patah & Klaim Foto | `warranty_claims` | `/api/v1/warranty/*` | `WarrantyClaimModal.tsx` |
| **11** | Kupon Diskon & Gratis Ongkir | `coupons` | `/api/v1/coupons/*` | `CheckoutModal.tsx`, `useSettingsStore.ts` |
| **12** | Ulasan Foto Pembeli & Bintang | `reviews`, `product_reviews` | `/api/v1/reviews/*` | `ProductReviewSection.tsx` |
| **13** | Akun Pembeli, Login & Profil | `users`, `profiles`, `user_addresses` | `/api/v1/auth/*`, `/api/v1/users/*` | `useAuthStore.ts`, `MemberProfileModal.tsx` |
| **14** | Gamifikasi Bunga (Stamp Card) | `user_stamp_cards`, `flower_point_transactions` | `/api/v1/loyalty/*` | `FlowerStampCard.tsx` |
| **15** | Admin Studio Opsi Kustomisasi | `custom_studio_options` | `/api/v1/custom-studio/admin/*` | `CustomStudioManagementView.tsx` |
| **16** | Admin Tiket Komplain Pelanggan | `customer_complaints` | `/api/v1/complaints/*` | `ComplaintsManagementView.tsx` |
| **17** | Kalender Pengingat Momen Spesial | `customer_occasions` | `/api/v1/occasions/*` | `OccasionReminderModal.tsx` |
| **18** | Absensi & Reward Kunjungan Harian | `user_attendance_logs` | `/api/v1/attendance/*` | `DailyCheckInWidget.tsx` |
| **19** | Analisis Minat & Dual CTR Klik | `products (click_count, view_count)` | `POST /api/v1/products/:id/click` | `ProductCtrAnalyticsCard.tsx` |
| **20** | Admin Banner Promo & Kampanye | `campaign_settings` | `/api/v1/campaigns/*` | `CampaignBannerModal.tsx` |
| **21** | Mode Maintenance Toko Istirahat | `store_settings` | `PATCH /api/v1/admin/settings` | `StoreSettingsView.tsx`, `useSettingsStore.ts` |
| **22** | Audit Trail Log Admin Sesi | `admin_audit_logs`, `session_audit_logs` | `/api/v1/audit/*` | `AdminViews.tsx` (AuditLogTab) |
| **23** | Notifikasi WhatsApp Otomatis | `notification_configs`, `notification_logs` | `/api/v1/notifications/*`| `NotificationSettingsModal.tsx` |
| **24** | Multi-Tema Estetika (Tema A/B/C) | Local Storage + Zustand | - | `useThemeStore.ts`, `theme-copy.ts` |
| **25** | Ringkasan Finansial & HPP Dashboard | `orders`, `bill_of_materials` | `GET /api/v1/admin/dashboard` | `AdminViews.tsx` (FinancialChartCard) |
| **26** | Filter & Pencarian Cepat Produk | `search_keyword_logs` | `GET /api/v1/products?search=` | `SearchBar.tsx` |
| **27** | Manajemen Stok & Lead Time PO | `products (stock, po_lead_days)` | `PATCH /api/v1/products/:id` | `AdminViews.tsx` (ProductStockModal) |
| **28** | Direktori Supplier Grosir Bahan | `supplier_directories` | `/api/v1/suppliers/*` | `BOMCalculatorModal.tsx` (Tab 2) |
| **29** | Komposisi Bahan Baku (BOM) & HPP | `bill_of_materials`, `raw_materials` | `PUT /api/v1/products/:id/bom` | `BOMCalculatorModal.tsx` (Tab 1) |
| **30** | Order Restock Supplier & Waktu Tiba | `procurement_orders` | `/api/v1/procurement/*` | `BOMCalculatorModal.tsx` (Tab 3) |
| **31** | Pelacak Bahan Rusak / Spoilage | `waste_material_logs` | `/api/v1/raw-materials/waste` | `BOMCalculatorModal.tsx` (Tab 4) |
| **32** | Feature Toggle On/Off Modul | `feature_toggles` | `/api/v1/features/*` | `StoreSettingsView.tsx` |
| **33** | Balasan Cepat Live Chat (Canned) | `canned_responses` | `/api/v1/chat/canned/*` | `CannedResponseSelector.tsx` |
| **34** | Tracking Pesanan Pelanggan Publik | `orders`, `order_status_histories` | `GET /api/v1/orders/track/:invoice` | `/lacak-pesanan/page.tsx` |
| **35** | Timeline Status Pengerjaan Florist | `order_status_histories` | `POST /api/v1/orders/:id/status`| `OrderWorkflowModal.tsx` |
| **36** | Cetak Label Pengiriman & Struk | Print Window Layout | - | `shipping-label-printer.ts` |
| **37** | Keamanan RLS & Kebijakan DB | 42 Tabel PostgreSQL RLS | - | `apply_rls_security_fix.ts` |
| **38** | Anti-Spam & Rate Limiter Express | Memory Cache Rate Limiter | `rateLimiter` Middleware | `apps/api/src/middleware/rate-limiter.ts` |
| **39** | Pemulihan Kredensial & Password | `users` | `/api/v1/users/reset-credentials`| `AdminViews.tsx` (UsersTab) |
| **40** | Optimasi Multi-Gambar Galeri | `product_images`, Supabase Storage | `POST /api/v1/products/:id/images`| `AdminViews.tsx` (ProductGalleryModal) |
| **41** | Aksesibilitas WCAG AA & Keyboard | Focus Rings, Aria Labels | - | Seluruh file di `apps/web/src/` |
| **42** | Otomasi Pengujian E2E Playwright | Browser Test Runner | - | `apps/web/e2e/`, Playwright MCP |
| **43** | CS WhatsApp Hub Gemini AI Copilot | `chat_sessions`, `chat_messages`, `orders`, `products`, `cod_meetup_points` | `POST /api/v1/chat/sessions/:id/ai-draft` | `CSHubModal.tsx` |
