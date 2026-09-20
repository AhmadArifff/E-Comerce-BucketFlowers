import 'dotenv/config';
import { pool } from '../config/database.js';

/**
 * Chenille Flowers Atelier - Canonical Database Seed & Migration Script
 * Sesuai PRD Seksi 29 & RULES.md (Zero-Dummy, Idempotent, High-Fidelity Data)
 */
async function runSeed() {
  console.log('🌸 [Chenille Seed] Memulai inisialisasi Master Data Katalog & Atelier...');
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. STORE SETTINGS
    console.log('📦 1/10 Seeding store_settings...');
    await client.query(`
      INSERT INTO store_settings (
        id, store_name, tagline, official_whatsapp, studio_address,
        daily_po_limit, active_theme, is_maintenance_mode,
        latitude, longitude, maps_link, max_cod_radius_km
      )
      VALUES (
        'atelier_setting',
        'Chenille Atelier Depok',
        'Buket Bunga Kawat Bulu Chenille Premium & Graduation Florist',
        '+62 812-9831-7721',
        'Jl. Margonda Raya No. 120, Beji, Kota Depok, Jawa Barat 16424',
        25,
        'TEMA_A_KOREAN_PASTEL',
        false,
        '-6.3728',
        '106.8315',
        'https://maps.google.com/?q=-6.3728,106.8315',
        5.0
      )
      ON CONFLICT (id) DO UPDATE SET
        store_name = EXCLUDED.store_name,
        tagline = EXCLUDED.tagline,
        official_whatsapp = EXCLUDED.official_whatsapp,
        studio_address = EXCLUDED.studio_address,
        daily_po_limit = EXCLUDED.daily_po_limit,
        active_theme = EXCLUDED.active_theme,
        latitude = EXCLUDED.latitude,
        longitude = EXCLUDED.longitude,
        maps_link = EXCLUDED.maps_link,
        max_cod_radius_km = EXCLUDED.max_cod_radius_km;
    `);

    // 2. CATEGORIES
    console.log('🏷️  2/10 Seeding categories...');
    const categories = [
      { id: 'cat-wisuda', name: 'Buket Wisuda', slug: 'wisuda', description: 'Buket bunga kawat bulu graduation ber-toga', icon_name: 'GraduationCap' },
      { id: 'cat-pastel', name: 'Korean Pastel', slug: 'pastel', description: 'Kombinasi warna lembut khas florist Seoul', icon_name: 'Sparkles' },
      { id: 'cat-karakter', name: 'Karakter Lucu', slug: 'karakter', description: 'Buket ornamen boneka & ekspresi kawaii', icon_name: 'Smile' },
      { id: 'cat-romantis', name: 'Edisi Romantis', slug: 'romantis', description: 'Red velvet mawar untuk anniversary & kencan', icon_name: 'Heart' },
      { id: 'cat-minipot', name: 'Mini Pot Meja', slug: 'mini-pot', description: 'Bunga meja mini pot keramik belajar', icon_name: 'Coffee' },
    ];

    for (const cat of categories) {
      await client.query(`
        INSERT INTO categories (id, name, slug, description, icon_name)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          slug = EXCLUDED.slug,
          description = EXCLUDED.description,
          icon_name = EXCLUDED.icon_name;
      `, [cat.id, cat.name, cat.slug, cat.description, cat.icon_name]);
    }

    // 3. PRODUCTS (8 CANONICAL PRODUCTS)
    console.log('💐 3/10 Seeding 8 canonical products...');
    const products = [
      {
        id: 'prod-001',
        name: 'Buket Mawar Merah Velvet Wisuda',
        slug: 'buket-mawar-merah-velvet',
        category_id: 'cat-wisuda',
        price: 165000,
        discount_price: 149000,
        raw_cost_hpp: 48500,
        stock: 12,
        po_lead_days: 2,
        click_count: 1420,
        is_ready_stock: true,
        is_active: true,
        badge: 'Terlaris Wisuda',
        rating: 4.9,
        review_count: 184,
        description: 'Buket bunga mawar kawat bulu halus premium 12 tangkai berpadu dengan boneka wisuda toga mini, dibungkus cellophane Korea matte water-resistant.',
        image_url: '/images/products/buket-mawar-merah-velvet.jpg',
        theme_suitability: ['tema-a', 'tema-b'],
        colors: ['#E11D48', '#FDA4AF', '#FFE4E6'],
      },
      {
        id: 'prod-002',
        name: 'Buket Tulip Pastel Pink Korean Style',
        slug: 'buket-tulip-pastel-pink',
        category_id: 'cat-pastel',
        price: 145000,
        discount_price: null,
        raw_cost_hpp: 38000,
        stock: 8,
        po_lead_days: 1,
        click_count: 980,
        is_ready_stock: true,
        is_active: true,
        badge: 'Trending Korea',
        rating: 4.8,
        review_count: 96,
        description: 'Buket 7 tangkai tulip kawat bulu kelopak mekar lembut bernuansa baby pink dan sage green, sentuhan pita organza transparan mewah.',
        image_url: '/images/products/buket-tulip-pastel-pink.jpg',
        theme_suitability: ['tema-a', 'tema-b'],
        colors: ['#FBCFE8', '#BBF7D0'],
      },
      {
        id: 'prod-003',
        name: 'Buket Bunga Matahari Graduation Ceria',
        slug: 'buket-matahari-graduation',
        category_id: 'cat-wisuda',
        price: 135000,
        discount_price: null,
        raw_cost_hpp: 35500,
        stock: 10,
        po_lead_days: 2,
        click_count: 1120,
        is_ready_stock: true,
        is_active: true,
        badge: 'Wisuda Favorit',
        rating: 4.9,
        review_count: 112,
        description: 'Buket 5 tangkai bunga matahari kawat bulu ceria dengan kelopak kuning keemasan, dedaunan hijau ribbed, pita satin gold, dan kartu ucapan wisuda elegan.',
        image_url: '/images/products/buket-matahari-graduation.jpg',
        theme_suitability: ['tema-a', 'tema-c'],
        colors: ['#FACC15', '#EA580C', '#FEF08A'],
      },
      {
        id: 'prod-004',
        name: 'Buket Lavender Lilac Dream',
        slug: 'buket-lavender-lilac-dream',
        category_id: 'cat-pastel',
        price: 125000,
        discount_price: null,
        raw_cost_hpp: 32000,
        stock: 6,
        po_lead_days: 2,
        click_count: 890,
        is_ready_stock: true,
        is_active: true,
        badge: 'Wangi Estetik',
        rating: 4.9,
        review_count: 78,
        description: 'Buket paduan tangkai lavender kawat bulu ungu lilac harum berpadu pita satin mewah, cocok untuk hadiah sidang skripsi dan ulang tahun.',
        image_url: '/images/products/buket-lavender-lilac-dream.jpg',
        theme_suitability: ['tema-a', 'tema-b'],
        colors: ['#C084FC', '#E9D5FF', '#F5D0FE'],
      },
      {
        id: 'prod-005',
        name: 'Buket Karakter Wisuda Ber-toga',
        slug: 'buket-karakter-wisuda-toga',
        category_id: 'cat-karakter',
        price: 175000,
        discount_price: 159000,
        raw_cost_hpp: 54000,
        stock: 7,
        po_lead_days: 3,
        click_count: 1310,
        is_ready_stock: false,
        is_active: true,
        badge: 'Custom Nama & Gelar',
        rating: 5.0,
        review_count: 104,
        description: 'Buket bunga kawat bulu premium dengan boneka wisuda karakter ber-toga mini lengkap dengan selempang sablon nama wisudawan custom.',
        image_url: '/images/products/buket-karakter-wisuda-toga.jpg',
        theme_suitability: ['tema-c', 'tema-a'],
        colors: ['#38BDF8', '#FDE047', '#1E293B'],
      },
      {
        id: 'prod-006',
        name: 'Mini Pot Bunga Daisy Kawat Bulu Meja Belajar',
        slug: 'mini-pot-daisy-kawat-bulu',
        category_id: 'cat-minipot',
        price: 45000,
        discount_price: null,
        raw_cost_hpp: 14000,
        stock: 20,
        po_lead_days: 1,
        click_count: 650,
        is_ready_stock: true,
        is_active: true,
        badge: 'Best Budget',
        rating: 4.7,
        review_count: 54,
        description: 'Pot gerabah mini estetik dengan 5 tangkai bunga daisy kawat bulu warna pastel, cocok untuk penghias meja kerja atau kado sahabat.',
        image_url: '/images/products/mini-pot-daisy-kawat-bulu.jpg',
        theme_suitability: ['tema-a', 'tema-c'],
        colors: ['#FDE047', '#E0E7FF', '#FBCFE8'],
      },
      {
        id: 'prod-007',
        name: 'Midnight Rose & Velvet Romance Deluxe',
        slug: 'midnight-rose-velvet-romance',
        category_id: 'cat-romantis',
        price: 195000,
        discount_price: 175000,
        raw_cost_hpp: 58000,
        stock: 5,
        po_lead_days: 3,
        click_count: 1750,
        is_ready_stock: false,
        is_active: true,
        badge: 'Edisi Mewah',
        rating: 5.0,
        review_count: 62,
        description: 'Buket mawar merah maroon pekat berbahan kawat bulu bertekstur beludru mewah beraksen dedaunan emas, cellophane hitam doff & pita satin merah anggur.',
        image_url: '/images/products/midnight-rose-velvet-romance.jpg',
        theme_suitability: ['tema-b'],
        colors: ['#881337', '#B45309', '#1E293B'],
      },
      {
        id: 'prod-008',
        name: 'Buket Bunga Matahari Kawaii Smile Sunflower',
        slug: 'buket-matahari-kawaii-smile',
        category_id: 'cat-karakter',
        price: 85000,
        discount_price: null,
        raw_cost_hpp: 24500,
        stock: 15,
        po_lead_days: 1,
        click_count: 1120,
        is_ready_stock: true,
        is_active: true,
        badge: 'Mood Booster',
        rating: 4.9,
        review_count: 118,
        description: 'Buket 3 bunga matahari kawat bulu ceria dengan ekspresi wajah kawaii imut, ornamen pita kuning polkadot yang menggemaskan.',
        image_url: '/images/products/buket-matahari-kawaii-smile.jpg',
        theme_suitability: ['tema-c', 'tema-a'],
        colors: ['#FACC15', '#EA580C', '#4ADE80'],
      },
    ];

    for (const prod of products) {
      await client.query(`
        INSERT INTO products (
          id, name, slug, category_id, price, discount_price, raw_cost_hpp,
          stock, po_lead_days, click_count, is_ready_stock, is_active,
          badge, rating, review_count, description, image_url, theme_suitability, colors,
          updated_at
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10, $11, $12,
          $13, $14, $15, $16, $17, $18, $19,
          NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          slug = EXCLUDED.slug,
          category_id = EXCLUDED.category_id,
          price = EXCLUDED.price,
          discount_price = EXCLUDED.discount_price,
          raw_cost_hpp = EXCLUDED.raw_cost_hpp,
          stock = EXCLUDED.stock,
          po_lead_days = EXCLUDED.po_lead_days,
          is_ready_stock = EXCLUDED.is_ready_stock,
          is_active = EXCLUDED.is_active,
          badge = EXCLUDED.badge,
          rating = EXCLUDED.rating,
          review_count = EXCLUDED.review_count,
          description = EXCLUDED.description,
          image_url = EXCLUDED.image_url,
          theme_suitability = EXCLUDED.theme_suitability,
          colors = EXCLUDED.colors,
          updated_at = NOW();
      `, [
        prod.id, prod.name, prod.slug, prod.category_id, prod.price, prod.discount_price, prod.raw_cost_hpp,
        prod.stock, prod.po_lead_days, prod.click_count, prod.is_ready_stock, prod.is_active,
        prod.badge, prod.rating, prod.review_count, prod.description, prod.image_url, prod.theme_suitability, prod.colors
      ]);

      // 4. PRODUCT IMAGES (Primary)
      await client.query(`
        DELETE FROM product_images WHERE product_id = $1;
      `, [prod.id]);

      await client.query(`
        INSERT INTO product_images (id, product_id, image_url, is_primary, sort_order)
        VALUES (gen_random_uuid(), $1, $2, true, 0);
      `, [prod.id, prod.image_url]);
    }

    // 5. RAW MATERIALS & SUPPLIERS
    console.log('🧵 4/10 Seeding raw_materials...');
    const materials = [
      { id: 'mat-1', name: 'Batang Kawat Bulu Burgundy (6mm)', category: 'KAWAT_BULU', stock: 450, min_stock: 100, unit: 'Batang', cost_per_unit: 350, supplier_name: 'Toko Kawat Bulu Chenille Jaya Bandung', supplier_contact: '081234567890', supplier_link: 'https://shopee.co.id/chenille-jaya-bandung', notes: 'Kawat bulu velvet halus tidak mudah rontok' },
      { id: 'mat-2', name: 'Batang Kawat Bulu Hijau Zaitun (6mm)', category: 'KAWAT_BULU', stock: 280, min_stock: 80, unit: 'Batang', cost_per_unit: 350, supplier_name: 'Toko Kawat Bulu Chenille Jaya Bandung', supplier_contact: '081234567890', supplier_link: 'https://shopee.co.id/chenille-jaya-bandung', notes: 'Untuk daun dan tangkai buket bunga atelier' },
      { id: 'mat-3', name: 'Batang Kawat Bulu Pastel Pink (6mm)', category: 'KAWAT_BULU', stock: 520, min_stock: 150, unit: 'Batang', cost_per_unit: 350, supplier_name: 'Toko Kawat Bulu Chenille Jaya Bandung', supplier_contact: '081234567890', supplier_link: 'https://shopee.co.id/chenille-jaya-bandung', notes: 'Bahan utama buket mawar pastel sakura' },
      { id: 'mat-4', name: 'Kawat Batang Penyangga Hijau No. 18', category: 'OTHER_MATERIALS', stock: 600, min_stock: 150, unit: 'Batang', cost_per_unit: 500, supplier_name: 'Florist Hardware Jakarta Pasar Pagi', supplier_contact: '081987654321', supplier_link: 'https://tokopedia.com/floristhardware', notes: 'Batang kawat kokoh panjang 40cm' },
      { id: 'mat-5', name: 'Kertas Wrapping Cellophane Korean Matte Maroon Gold', category: 'CELLOPHANE_PAPER', stock: 85, min_stock: 25, unit: 'Lembar', cost_per_unit: 4500, supplier_name: 'Korean Wrapping Depok Grosir', supplier_contact: '082133445566', supplier_link: 'https://shopee.co.id/koreanwrapping', notes: 'Kertas tahan air dua sisi matte lis gold' },
      { id: 'mat-6', name: 'Pita Satin Premium Burgundy Lis Emas (2.5cm)', category: 'PITA_SATIN', stock: 95, min_stock: 20, unit: 'Meter', cost_per_unit: 2200, supplier_name: 'Toko Pita Cantik Mangga Dua', supplier_contact: '085711223344', supplier_link: 'https://tokopedia.com/pitacantik', notes: 'Pita satin mengkilap untuk ikatan buket' },
      { id: 'mat-7', name: 'Boneka Teddy Wisuda Ber-toga Mini (10cm)', category: 'AKSESORI_BONEKA', stock: 35, min_stock: 10, unit: 'Pcs', cost_per_unit: 7400, supplier_name: 'Souvenir Wisuda Depok Jaya', supplier_contact: '081399887766', supplier_link: 'https://shopee.co.id/souvenirwisuda', notes: 'Boneka wisuda ber-toga hitam & selempang' },
      { id: 'mat-8', name: 'Batang Kawat Bulu Kuning Emas Sunflower (6mm)', category: 'KAWAT_BULU', stock: 400, min_stock: 100, unit: 'Batang', cost_per_unit: 350, supplier_name: 'Toko Kawat Bulu Chenille Jaya Bandung', supplier_contact: '081234567890', supplier_link: 'https://shopee.co.id/chenille-jaya-bandung', notes: 'Kelopak ceria bunga matahari' },
      { id: 'mat-9', name: 'Batang Kawat Bulu Cokelat Gelap (6mm)', category: 'KAWAT_BULU', stock: 300, min_stock: 80, unit: 'Batang', cost_per_unit: 350, supplier_name: 'Toko Kawat Bulu Chenille Jaya Bandung', supplier_contact: '081234567890', supplier_link: 'https://shopee.co.id/chenille-jaya-bandung', notes: 'Pusat spiral bunga matahari' },
    ];

    for (const m of materials) {
      await client.query(`
        INSERT INTO raw_materials (id, name, category, stock, min_stock, unit, cost_per_unit, supplier_name, supplier_contact, supplier_link, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          category = EXCLUDED.category,
          stock = EXCLUDED.stock,
          min_stock = EXCLUDED.min_stock,
          unit = EXCLUDED.unit,
          cost_per_unit = EXCLUDED.cost_per_unit,
          supplier_name = EXCLUDED.supplier_name,
          supplier_contact = EXCLUDED.supplier_contact,
          supplier_link = EXCLUDED.supplier_link,
          notes = EXCLUDED.notes;
      `, [m.id, m.name, m.category, m.stock, m.min_stock, m.unit, m.cost_per_unit, m.supplier_name, m.supplier_contact, m.supplier_link, m.notes]);
    }

    // 6. BILL OF MATERIALS (BOM RECIPES)
    console.log('📐 5/10 Seeding bill_of_materials recipes...');
    const bomRecipes = [
      // prod-001: Buket Mawar Merah Velvet Wisuda (HPP ~48.500)
      { product_id: 'prod-001', raw_material_id: 'mat-1', quantity_needed: 60, subtotal_cost: 21000 },
      { product_id: 'prod-001', raw_material_id: 'mat-2', quantity_needed: 20, subtotal_cost: 7000 },
      { product_id: 'prod-001', raw_material_id: 'mat-4', quantity_needed: 12, subtotal_cost: 6000 },
      { product_id: 'prod-001', raw_material_id: 'mat-5', quantity_needed: 1, subtotal_cost: 4500 },
      { product_id: 'prod-001', raw_material_id: 'mat-6', quantity_needed: 1, subtotal_cost: 2200 },
      { product_id: 'prod-001', raw_material_id: 'mat-7', quantity_needed: 1, subtotal_cost: 7400 },

      // prod-003: Buket Bunga Matahari Graduation Ceria (HPP ~35.500)
      { product_id: 'prod-003', raw_material_id: 'mat-8', quantity_needed: 40, subtotal_cost: 14000 },
      { product_id: 'prod-003', raw_material_id: 'mat-9', quantity_needed: 15, subtotal_cost: 5250 },
      { product_id: 'prod-003', raw_material_id: 'mat-2', quantity_needed: 15, subtotal_cost: 5250 },
      { product_id: 'prod-003', raw_material_id: 'mat-4', quantity_needed: 5, subtotal_cost: 2500 },
      { product_id: 'prod-003', raw_material_id: 'mat-5', quantity_needed: 1, subtotal_cost: 4500 },
      { product_id: 'prod-003', raw_material_id: 'mat-6', quantity_needed: 1, subtotal_cost: 2200 },
    ];

    for (const b of bomRecipes) {
      await client.query(`
        DELETE FROM bill_of_materials WHERE product_id = $1 AND raw_material_id = $2;
      `, [b.product_id, b.raw_material_id]);

      await client.query(`
        INSERT INTO bill_of_materials (id, product_id, raw_material_id, quantity_needed, subtotal_cost)
        VALUES (gen_random_uuid(), $1, $2, $3, $4);
      `, [b.product_id, b.raw_material_id, b.quantity_needed, b.subtotal_cost]);
    }

    // 7. COD MEETUP POINTS (6 DEPOK CAMPUS / MALL LOCATIONS)
    console.log('📍 6/10 Seeding cod_meetup_points...');
    const codPoints = [
      { id: 'cod-001', name: 'Universitas Indonesia (Stasiun UI / Rotunda)', full_address: 'Stasiun Kereta UI, Pondok Cina, Beji, Kota Depok, Jawa Barat 16424', google_maps_url: 'https://maps.google.com/?q=-6.3628,106.8315', distance_km: 2.1, delivery_notes: 'Titik temu di Indomaret Point Stasiun UI / Halte Bikun Rektorat', latitude: -6.36280000, longitude: 106.83150000 },
      { id: 'cod-002', name: 'Universitas Gunadarma Kampus D Margonda', full_address: 'Jl. Margonda Raya No. 100, Pondok Cina, Beji, Kota Depok, Jawa Barat 16424', google_maps_url: 'https://maps.google.com/?q=-6.3692,106.8322', distance_km: 1.4, delivery_notes: 'Titik temu di lobi depan Gedung 1 Kampus D Margonda', latitude: -6.36920000, longitude: 106.83220000 },
      { id: 'cod-003', name: 'Margo City Mall Depok (Lobby Starbucks GF)', full_address: 'Jl. Margonda Raya No. 358, Kemiri Muka, Beji, Kota Depok, Jawa Barat 16423', google_maps_url: 'https://maps.google.com/?q=-6.3732,106.8345', distance_km: 1.8, delivery_notes: 'Lobby Utama depan Starbucks GF, dekat drop off mobil', latitude: -6.37320000, longitude: 106.83450000 },
      { id: 'cod-004', name: 'Politeknik Negeri Jakarta (PNJ - Lobi Utama)', full_address: 'Kukusan, Beji, Kota Depok, Jawa Barat 16425', google_maps_url: 'https://maps.google.com/?q=-6.3601,106.8272', distance_km: 2.8, delivery_notes: 'Titik temu di gerbang utama PNJ Kukusan', latitude: -6.36010000, longitude: 106.82720000 },
      { id: 'cod-005', name: 'Stasiun KRL Pondok Cina (Pintu Timur)', full_address: 'Pondok Cina, Kecamatan Beji, Kota Depok, Jawa Barat 16424', google_maps_url: 'https://maps.google.com/?q=-6.3688,106.8336', distance_km: 1.6, delivery_notes: 'Pintu keluar timur dekat jembatan penyeberangan Margo City', latitude: -6.36880000, longitude: 106.83360000 },
      { id: 'cod-006', name: 'D Mall Depok (Pintu Masuk Utama Depan)', full_address: 'Jl. Margonda Raya Kav. 88, Kemiri Muka, Beji, Kota Depok, Jawa Barat 16423', google_maps_url: 'https://maps.google.com/?q=-6.3862,106.8285', distance_km: 3.9, delivery_notes: 'Drop off depan lobby pintu masuk D Mall Margonda', latitude: -6.38620000, longitude: 106.82850000 },
    ];

    for (const cod of codPoints) {
      await client.query(`
        INSERT INTO cod_meetup_points (id, name, full_address, google_maps_url, distance_km, delivery_notes, latitude, longitude)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          full_address = EXCLUDED.full_address,
          google_maps_url = EXCLUDED.google_maps_url,
          distance_km = EXCLUDED.distance_km,
          delivery_notes = EXCLUDED.delivery_notes,
          latitude = EXCLUDED.latitude,
          longitude = EXCLUDED.longitude;
      `, [cod.id, cod.name, cod.full_address, cod.google_maps_url, cod.distance_km, cod.delivery_notes, cod.latitude, cod.longitude]);
    }

    // 8. CUSTOM STUDIO OPTIONS (7 CATEGORIES)
    console.log('🎨 7/10 Seeding custom_studio_options...');
    const studioOptions = [
      // FLOWER_TYPE
      { id: 'c-flw-tulip', category: 'FLOWER_TYPE', name: 'Tulip Cantik', description: 'Kelopak mekar anggun', price_modifier: 120000, emoji_or_icon: '🌷', hex_color: null, sort_order: 1 },
      { id: 'c-flw-rose', category: 'FLOWER_TYPE', name: 'Mawar Velvet', description: 'Tekstur beludru merah romantis', price_modifier: 130000, emoji_or_icon: '🌹', hex_color: null, sort_order: 2 },
      { id: 'c-flw-sun', category: 'FLOWER_TYPE', name: 'Bunga Matahari', description: 'Kelopak ceria graduation', price_modifier: 115000, emoji_or_icon: '🌻', hex_color: null, sort_order: 3 },
      { id: 'c-flw-lavender', category: 'FLOWER_TYPE', name: 'Lavender Harum', description: 'Kesan tenang elegan', price_modifier: 125000, emoji_or_icon: '🪻', hex_color: null, sort_order: 4 },
      // CHENILLE_COLOR
      { id: 'c-col-pink', category: 'CHENILLE_COLOR', name: 'Pastel Pink', description: 'Warna sakura lembut', price_modifier: 0, emoji_or_icon: null, hex_color: '#F4A7B9', sort_order: 1 },
      { id: 'c-col-lilac', category: 'CHENILLE_COLOR', name: 'Lavender Lilac', description: 'Ungu lembut estetik', price_modifier: 0, emoji_or_icon: null, hex_color: '#C4B5FD', sort_order: 2 },
      { id: 'c-col-blue', category: 'CHENILLE_COLOR', name: 'Sky Blue', description: 'Biru langit segar', price_modifier: 0, emoji_or_icon: null, hex_color: '#BAE6FD', sort_order: 3 },
      { id: 'c-col-sage', category: 'CHENILLE_COLOR', name: 'Matcha Sage', description: 'Hijau sage natural', price_modifier: 0, emoji_or_icon: null, hex_color: '#A8C3A0', sort_order: 4 },
      // WRAPPING_STYLE
      { id: 'c-wrp-korean', category: 'WRAPPING_STYLE', name: 'Korean Two-Tone Pink', description: 'Cellophane matte lembut dua sisi', price_modifier: 0, emoji_or_icon: '🎀', hex_color: null, sort_order: 1 },
      { id: 'c-wrp-velvet', category: 'WRAPPING_STYLE', name: 'Lilac & White Velvet', description: 'Aksen beludru elegan', price_modifier: 0, emoji_or_icon: '✨', hex_color: null, sort_order: 2 },
      { id: 'c-wrp-oat', category: 'WRAPPING_STYLE', name: 'Minimalist Clean Oat', description: 'Nuansa earth tone aesthetic', price_modifier: 0, emoji_or_icon: '🌿', hex_color: null, sort_order: 3 },
      // RIBBON_STYLE
      { id: 'c-rbn-satin', category: 'RIBBON_STYLE', name: 'Pita Satin Mengkilap', description: 'Klasik elegan berkilau', price_modifier: 0, emoji_or_icon: '🎀', hex_color: null, sort_order: 1 },
      { id: 'c-rbn-organza', category: 'RIBBON_STYLE', name: 'Pita Organza Transparan', description: 'Kesan dreamy & airy', price_modifier: 5000, emoji_or_icon: '🎗️', hex_color: null, sort_order: 2 },
      { id: 'c-rbn-chiffon', category: 'RIBBON_STYLE', name: 'Chiffon Ruffle Wave', description: 'Aksen gelombang Korea', price_modifier: 7500, emoji_or_icon: '🌸', hex_color: null, sort_order: 3 },
      { id: 'c-rbn-rustic', category: 'RIBBON_STYLE', name: 'Tali Rami Vintage', description: 'Nuansa rustic estetik', price_modifier: 3000, emoji_or_icon: '🧵', hex_color: null, sort_order: 4 },
      // PACKAGING_BOX
      { id: 'c-pkg-standard', category: 'PACKAGING_BOX', name: 'Standard Protective Sleeve', description: 'Plastik florist tebal bening', price_modifier: 0, emoji_or_icon: '📦', hex_color: null, sort_order: 1 },
      { id: 'c-pkg-mika', category: 'PACKAGING_BOX', name: 'Box Jendela Mika Eksklusif', description: 'Kotak kardus kaku mewah', price_modifier: 12000, emoji_or_icon: '🎁', hex_color: null, sort_order: 2 },
      { id: 'c-pkg-pvc', category: 'PACKAGING_BOX', name: 'Tas Jinjing PVC Bening', description: 'Tas aesthetic praktis wisuda', price_modifier: 8000, emoji_or_icon: '🛍️', hex_color: null, sort_order: 3 },
      { id: 'c-pkg-gold', category: 'PACKAGING_BOX', name: 'Paper Bag Mewah Lis Gold', description: 'Tas kertas tebal premium', price_modifier: 6000, emoji_or_icon: '👜', hex_color: null, sort_order: 4 },
      // GREETING_SEAL
      { id: 'c-grt-std', category: 'GREETING_SEAL', name: 'Kartu Standard Cetak', description: 'Art paper 260gsm cetak rapi', price_modifier: 0, emoji_or_icon: '✉️', hex_color: null, sort_order: 1 },
      { id: 'c-grt-foil', category: 'GREETING_SEAL', name: 'Kartu Hotprint Gold Foil', description: 'Tulisan emas berkilau mewah', price_modifier: 5000, emoji_or_icon: '✨', hex_color: null, sort_order: 2 },
      { id: 'c-grt-wax', category: 'GREETING_SEAL', name: 'Vintage Wax Seal Stamp', description: 'Amplop segel lilin stempel bunga', price_modifier: 8000, emoji_or_icon: '📜', hex_color: null, sort_order: 3 },
      // ACCESSORY_ADDON
      { id: 'c-adn-led', category: 'ACCESSORY_ADDON', name: 'Lampu LED Fairy Light (Warm Glow)', description: 'Kabel kawat fleksibel 1 meter', price_modifier: 10000, emoji_or_icon: '💡', hex_color: null, sort_order: 1 },
      { id: 'c-adn-bear', category: 'ACCESSORY_ADDON', name: 'Boneka Toga Wisuda Mini (10cm)', description: 'Teddy bear wisuda ber-toga', price_modifier: 15000, emoji_or_icon: '🧸', hex_color: null, sort_order: 2 },
      { id: 'c-adn-pin', category: 'ACCESSORY_ADDON', name: 'Pin Bros Kupu-kupu Kristal', description: 'Aksen bros pin berkilau', price_modifier: 5000, emoji_or_icon: '🦋', hex_color: null, sort_order: 3 },
    ];

    for (const opt of studioOptions) {
      await client.query(`
        INSERT INTO custom_studio_options (id, category, name, description, price_modifier, emoji_or_icon, hex_color, sort_order)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO UPDATE SET
          category = EXCLUDED.category,
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          price_modifier = EXCLUDED.price_modifier,
          emoji_or_icon = EXCLUDED.emoji_or_icon,
          hex_color = EXCLUDED.hex_color,
          sort_order = EXCLUDED.sort_order;
      `, [opt.id, opt.category, opt.name, opt.description, opt.price_modifier, opt.emoji_or_icon, opt.hex_color, opt.sort_order]);
    }

    // 9. COUPONS
    console.log('🎟️  8/10 Seeding coupons...');
    const coupons = [
      { id: 'cpn-wisuda', code: 'WISUDAHEMAT', discount_type: 'FIXED_AMOUNT', discount_value: 25000, min_order_amount: 150000, quota: 50, is_active: true },
      { id: 'cpn-love', code: 'LOVECHENILLE', discount_type: 'PERCENTAGE', discount_value: 10, min_order_amount: 100000, quota: 100, is_active: true },
      { id: 'cpn-ongkir', code: 'ONGKIRFREE', discount_type: 'FREE_SHIPPING', discount_value: 15000, min_order_amount: 120000, quota: 30, is_active: true },
    ];

    for (const cpn of coupons) {
      await client.query(`
        INSERT INTO coupons (id, code, discount_type, discount_value, min_order_amount, quota, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO UPDATE SET
          code = EXCLUDED.code,
          discount_type = EXCLUDED.discount_type,
          discount_value = EXCLUDED.discount_value,
          min_order_amount = EXCLUDED.min_order_amount,
          quota = EXCLUDED.quota,
          is_active = EXCLUDED.is_active;
      `, [cpn.id, cpn.code, cpn.discount_type, cpn.discount_value, cpn.min_order_amount, cpn.quota, cpn.is_active]);
    }

    // 10. FEATURE TOGGLES
    console.log('🎛️  9/10 Seeding feature_toggles...');
    const toggles = [
      { key: 'toggle_po_throttling', name: 'PO Capacity Throttling', description: 'Batasi penerimaan order harian jika workshop penuh', is_enabled: true },
      { key: 'toggle_free_cod_radius', name: 'Free Delivery Radius', description: 'Gratis ongkir untuk titik temu COD dalam radius 5 km', is_enabled: true },
      { key: 'toggle_midtrans_gateway', name: 'Midtrans Gateway Active', description: 'Aktifkan pembayaran QRIS, GoPay, ShopeePay via Midtrans', is_enabled: true },
      { key: 'toggle_web_chat_support', name: 'Internal Live Web Chat', description: 'Layanan chat konsultasi langsung di dalam web browser', is_enabled: true },
      { key: 'toggle_whatsapp_escalation', name: 'WhatsApp Order Escalation', description: 'Arahkan kustomisasi kompleks ke WhatsApp Pengrajin', is_enabled: true },
      { key: 'toggle_promo_banners', name: 'Promotional Banner Strip', description: 'Tampilkan pengumuman kupon diskon dan promo di header', is_enabled: true },
      { key: 'toggle_maintenance', name: 'Maintenance Mode', description: 'Kunci transaksi publik saat studio istirahat produksi', is_enabled: false },
    ];

    for (const tog of toggles) {
      await client.query(`
        INSERT INTO feature_toggles (key, name, description, is_enabled)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (key) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description;
      `, [tog.key, tog.name, tog.description, tog.is_enabled]);
    }

    // 11. CAMPAIGN SETTINGS
    console.log('🏆 10/10 Seeding campaign_settings...');
    await client.query(`
      INSERT INTO campaign_settings (
        id, attendance_enabled, daily_points_reward, streak_days_target,
        streak_reward_type, streak_reward_value, reset_streak_on_miss,
        stamp_card_enabled, stamp_target_count, min_spend_per_stamp,
        stamp_reward_type, stamp_reward_product_id, stamp_expiry_days,
        cod_promo_enabled, cod_max_radius_km, cod_subsidy_type,
        cod_subsidy_value, cod_min_spend, cod_promo_banner_text,
        updated_at
      )
      VALUES (
        'ATELIER_CAMPAIGN_DEFAULT', true, 10, 7,
        'VOUCHER_DISCOUNT', 15.00, true,
        true, 5, 50000.00,
        'FREE_PRODUCT', 'prod-006', 180,
        true, 5.00, 'FREE_100',
        100.00, 75000.00, '🎉 Promo Area: Gratis Ongkir COD Titik Temu hingga 5 KM!',
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        attendance_enabled = EXCLUDED.attendance_enabled,
        daily_points_reward = EXCLUDED.daily_points_reward,
        streak_days_target = EXCLUDED.streak_days_target,
        streak_reward_type = EXCLUDED.streak_reward_type,
        streak_reward_value = EXCLUDED.streak_reward_value,
        reset_streak_on_miss = EXCLUDED.reset_streak_on_miss,
        stamp_card_enabled = EXCLUDED.stamp_card_enabled,
        stamp_target_count = EXCLUDED.stamp_target_count,
        min_spend_per_stamp = EXCLUDED.min_spend_per_stamp,
        stamp_reward_type = EXCLUDED.stamp_reward_type,
        stamp_reward_product_id = EXCLUDED.stamp_reward_product_id,
        stamp_expiry_days = EXCLUDED.stamp_expiry_days,
        cod_promo_enabled = EXCLUDED.cod_promo_enabled,
        cod_max_radius_km = EXCLUDED.cod_max_radius_km,
        cod_subsidy_type = EXCLUDED.cod_subsidy_type,
        cod_subsidy_value = EXCLUDED.cod_subsidy_value,
        cod_min_spend = EXCLUDED.cod_min_spend,
        cod_promo_banner_text = EXCLUDED.cod_promo_banner_text,
        updated_at = NOW();
    `);

    await client.query('COMMIT');
    console.log('✅ [Chenille Seed] Seluruh Master Data Katalog & Pabrikasi Atelier BERHASIL Diinisialisasi!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ [Chenille Seed] Gagal menginisialisasi database:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runSeed();
