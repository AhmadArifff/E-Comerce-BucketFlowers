/**
 * Multi-Theme Copywriting & Tone of Voice Matrix
 * Rujukan Mutlak: PRD.md Seksi 20 (Seksi 20.1 - 20.8) & Seksi 21
 */

import { Sparkles, PackageCheck, MapPin, Award, ShieldCheck, Heart, Flower2, Smile, Clock, Truck, Music, CheckCircle2 } from 'lucide-react';
import type { ThemeId } from '@/stores/useThemeStore';

export interface ThemeCopy {
  // 20.1 Announcement Bar
  announcement: {
    quotaTemplate: (remaining: number) => string;
    specialPromo: string;
  };

  // 20.2 Hero Section
  hero: {
    topBadge: string;
    headlinePart1: string;
    headlineHighlight: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };

  // 20.3 Empat Kartu Nilai Jual Toko (Trust Cards)
  trustCards: Array<{
    id: string;
    title: string;
    desc: string;
    icon: any;
  }>;

  // 20.4 Modul Katalog Bunga
  catalog: {
    sectionEyebrow: string;
    sectionTitle: string;
    sectionSubtitle: string;
    filterLabels: Record<string, string>;
    buyButton: string;
  };

  // 20.5 Modul Custom Studio Interaktif
  customStudio: {
    title: string;
    subtitle: string;
    step1Label: string;
    step2Label: string;
    step3Label: string;
    step4Label: string;
    recommendationBtn: string;
    checkoutBtn: string;
  };

  // 20.6 Modul Lookbook & Cerita Pelanggan
  lookbook: {
    sectionTitle: string;
    sectionSubtitle: string;
    stories: Array<{
      quote: string;
      author: string;
      occasion: string;
      avatarBg: string;
    }>;
  };

  // 20.7 Modul Keranjang Belanja & Upsell (Drawer Cart)
  cart: {
    drawerTitle: (count: number) => string;
    upsellTitle: string;
    spotifyOption: string;
    checkoutBtn: string;
  };

  // 20.8 Modul Pengingat Hari Spesial (Portal Pelanggan)
  occasions: {
    featureTitle: string;
    featureDesc: string;
    waReminderTemplate: (days: number, recipient: string) => string;
  };
}

export const THEME_COPY_MATRIX: Record<ThemeId, ThemeCopy> = {
  // ==========================================
  // TEMA A: KOREAN PASTEL ATELIER
  // Karakter: Soft, mindful, comforting, aesthetic
  // ==========================================
  'tema-a': {
    announcement: {
      quotaTemplate: (remaining) => `🌸 Kapasitas perakitan hari ini tersisa ${remaining} buket. Amankan slot kirimmu dengan tenang.`,
      specialPromo: '🌸 Musim Wisuda 2026: Free Greeting Card & Selempang Custom PO H-3!',
    },
    hero: {
      topBadge: '100% Handcrafted Chenille Velvet',
      headlinePart1: 'Mekar Abadi dalam',
      headlineHighlight: 'Lembutnya Cerita Kita.',
      subheadline: 'Rangkaian buket kawat bulu bertekstur beludru lembut. Hadiah manis yang dirangkai teliti untuk momen wisuda dan hari istimewa.',
      ctaPrimary: 'Jelajahi Koleksi 🌸',
      ctaSecondary: 'Rangkai Sendiri ✨',
    },
    trustCards: [
      {
        id: 'quality',
        title: 'Awet Bertahun-tahun',
        desc: 'Bahan beludru chenille pilihan, tidak rontok dan bebas layu.',
        icon: Sparkles,
      },
      {
        id: 'packaging',
        title: 'Kardus Box Rapi & Tebal',
        desc: 'Dilindungi mika dan box kokoh agar bentuk buket tetap presisi.',
        icon: PackageCheck,
      },
      {
        id: 'cod',
        title: 'Titik Temu COD Kampus',
        desc: 'Bisa ambil langsung di sekitar gerbang kampus UI atau mall terdekat.',
        icon: MapPin,
      },
      {
        id: 'warranty',
        title: 'Garansi Rangkai Ulang',
        desc: 'Kami pastikan buket sesuai pesanan sebelum diserahkan ke kurir.',
        icon: Award,
      },
    ],
    catalog: {
      sectionEyebrow: 'Sentuhan Lembut Pastel Atelier',
      sectionTitle: 'Pilihan Buket Favorit',
      sectionSubtitle: 'Sentuhan warna pastel yang manis, cocok untuk wisuda, sidang, atau kado kecil.',
      filterLabels: {
        ALL: 'Semua Sentuhan',
        Wisuda: 'Momen Wisuda',
        Pastel: 'Pastel Korea',
        Romantis: 'Kisah Manis',
        Karakter: 'Mini & Karakter',
        'Mini Pot': 'Mini Pot Meja',
      },
      buyButton: 'Simpan ke Keranjang 🛒',
    },
    customStudio: {
      title: 'Atelier Rangkai Mandiri',
      subtitle: 'Padukan warna dan bunga kesukaanmu dalam 4 langkah santai.',
      step1Label: 'Pilih Bunga Utama',
      step2Label: 'Pilih Nuansa Kawat Beludru',
      step3Label: 'Pilih Kertas Pembungkus',
      step4Label: 'Sentuhan Pelengkap Manis',
      recommendationBtn: '🪄 Rekomendasi Warna Florist',
      checkoutBtn: 'Selesaikan Rangkaian Ini 🌸',
    },
    lookbook: {
      sectionTitle: 'Cerita Hangat dari Pelanggan',
      sectionSubtitle: 'Kisah manis di balik setiap buket kawat bulu yang tersimpan abadi di meja belajar dan kamar tidur.',
      stories: [
        {
          quote: 'Bunganya tetap cantik di meja belajar walau wisudanya sudah 6 bulan lalu. Lembut banget!',
          author: 'Siti Sarah, S.Hum',
          occasion: 'Wisuda FIB UI 2026',
          avatarBg: 'bg-rose-100 text-rose-700',
        },
        {
          quote: 'Detail bunganya rapi, packaging kardusnya tebal dan wangi. Sahabatku suka banget.',
          author: 'Alifia Rahman',
          occasion: 'Sidang Skripsi Vokasi UI',
          avatarBg: 'bg-pink-100 text-pink-700',
        },
        {
          quote: 'COD di gerbang UI langsung tepat waktu. Bunga kawat bulu ini recommended banget!',
          author: 'Nabila Azzahra',
          occasion: 'Hadiah Ulang Tahun Sahabat',
          avatarBg: 'bg-amber-100 text-amber-700',
        },
      ],
    },
    cart: {
      drawerTitle: (count) => `Pesanan Bunga Kamu (${count})`,
      upsellTitle: 'Lengkapi Momen Manismu:',
      spotifyOption: '🎵 Sisipkan Lagu Kenangan (Spotify QR)',
      checkoutBtn: 'Lanjut ke Pengiriman 🌸',
    },
    occasions: {
      featureTitle: 'Kalender Momen Berharga',
      featureDesc: 'Simpan tanggal wisuda atau ulang tahun orang terdekat. Kami ingatkan seminggu sebelumnya.',
      waReminderTemplate: (days, recipient) =>
        `Halo Kak, ${days} hari lagi tanggal hari spesial ${recipient}. Mau kami siapkan buketnya lebih awal agar tenang?`,
    },
  },

  // ==========================================
  // TEMA B: MODERN ROMANTIC & EDITORIAL
  // Karakter: Understated luxury, deep, poetic, timeless
  // ==========================================
  'tema-b': {
    announcement: {
      quotaTemplate: (remaining) => `🕯️ Slot perakitan terbatas (${remaining} slot) untuk menjaga kesempurnaan setiap tangkai bunga.`,
      specialPromo: '✦ Musim Wisuda 2026: Free Greeting Card Emas & Selempang Sutra Nama',
    },
    hero: {
      topBadge: 'Timeless Botanical Craftsmanship',
      headlinePart1: 'Apresiasi Tulus yang',
      headlineHighlight: 'Tak Pernah Pudar.',
      subheadline: 'Rangkaian estetika modern berbahan kawat bulu premium. Keindahan abadi yang mewakili rasa terima kasih dan cinta penuh makna.',
      ctaPrimary: 'Lihat Katalog Eksklusif 🌹',
      ctaSecondary: 'Desain Buket Kustom 🖋️',
    },
    trustCards: [
      {
        id: 'quality',
        title: 'Keindahan Abadi',
        desc: 'Simbol memori berharga yang tetap anggun tanpa perlu perawatan.',
        icon: Sparkles,
      },
      {
        id: 'packaging',
        title: 'Kemasan Eksklusif Aman',
        desc: 'Pengemasan struktural berlapis standar kurir jarak jauh anti-benturan.',
        icon: PackageCheck,
      },
      {
        id: 'cod',
        title: 'Layanan Titik Temu Presisi',
        desc: 'Serah terima tepat waktu di lokasi pertemuan VIP yang disepakati.',
        icon: MapPin,
      },
      {
        id: 'warranty',
        title: 'Jaminan Kepuasan Penuh',
        desc: 'Standar kurasi ketat pada setiap detail kelopak, helai beludru, dan pita.',
        icon: ShieldCheck,
      },
    ],
    catalog: {
      sectionEyebrow: 'Haute Couture Botanical Series',
      sectionTitle: 'Koleksi Rangkaian Terkurasi',
      sectionSubtitle: 'Paduan estetika tegas dan proporsi anggun untuk perayaan penting dan prestisius.',
      filterLabels: {
        ALL: 'Seluruh Koleksi',
        Wisuda: 'Graduation Honors',
        Pastel: 'Pastel Nuance',
        Romantis: 'Romance & Anniversary',
        Karakter: 'Artisan Sculpture',
        'Mini Pot': 'Architectural Pots',
      },
      buyButton: 'Pesan Rangkaian Ini 🛍️',
    },
    customStudio: {
      title: 'Bespoke Bouquet Studio',
      subtitle: 'Rancang buket personal dengan sentuhan material berkelas dan proporsi elegan.',
      step1Label: 'Tentukan Bentuk Kelopak',
      step2Label: 'Palet Warna Tangkai',
      step3Label: 'Material Wrapping Cellophane',
      step4Label: 'Finishing Detail & Kartu',
      recommendationBtn: '✨ Harmonikan Otomatis',
      checkoutBtn: 'Konfirmasi Desain Pesanan 🖋️',
    },
    lookbook: {
      sectionTitle: 'Momen yang Kami Rayakan',
      sectionSubtitle: 'Dokumentasi perayaan prestisius dan penghormatan tulus bersama mahakarya Atelier Privé.',
      stories: [
        {
          quote: 'Detail kawat bulunya rapi sekali, terasa sangat eksklusif saat diserahkan ke pasangan.',
          author: 'Dr. Raymond Hartono',
          occasion: 'Doktoral Inauguration UI',
          avatarBg: 'bg-amber-100 text-amber-900',
        },
        {
          quote: 'Kombinasi wine velvet dan champagne gold memberi aura mewah yang tak ada tandingannya.',
          author: 'Clarissa Maharani, B.A.',
          occasion: 'Magna Cum Laude Celebration',
          avatarBg: 'bg-rose-100 text-rose-900',
        },
        {
          quote: 'Kualitas pengemasan hardbox mewah. Bunga tetap tegak dan berkilau sempurna.',
          author: 'Dimas Wicaksono',
          occasion: 'Anniversary Gift',
          avatarBg: 'bg-stone-200 text-stone-800',
        },
      ],
    },
    cart: {
      drawerTitle: (count) => `Daftar Pesanan Atelier (${count})`,
      upsellTitle: 'Sempurnakan Hadiah Ini:',
      spotifyOption: '🎼 Tautkan Lagu Memorial (Spotify QR)',
      checkoutBtn: 'Lanjutkan Pembayaran 💳',
    },
    occasions: {
      featureTitle: 'Memorial Date Registry',
      featureDesc: 'Dokumentasikan momen penting. Kami pastikan hadiah Anda siap tepat waktu tanpa tergesa.',
      waReminderTemplate: (days, recipient) =>
        `Mengingatkan, momen penting Anda bersama ${recipient} tinggal ${days} hari lagi. Slot perakitan siap kami amankan untuk Anda.`,
    },
  },

  // ==========================================
  // TEMA C: PLAYFUL KAWAII & POP SUNSHINE
  // Karakter: Vibrant, joyful, energetic, friendly bestie
  // ==========================================
  'tema-c': {
    announcement: {
      quotaTemplate: (remaining) => `✨ Yeay! Kuota buket wisuda hari ini tersisa ${remaining} slot lagi! Yuk pesan sekarang!`,
      specialPromo: '🎉 Spesial Wisuda Depok: Free Kartu Ucapan & Pita Custom Lucu! 🎀',
    },
    hero: {
      topBadge: '100% Handmade Bikin Senyum',
      headlinePart1: 'Kirim Senyum Manis Lewat',
      headlineHighlight: 'Buket Bunga Lucu!',
      subheadline: 'Buket kawat bulu warna-warni berkarakter ceria. Bikin perayaan wisuda, ulang tahun, dan hari bahagiamu makin seru!',
      ctaPrimary: 'Pilih Bunga Favorit 🌻',
      ctaSecondary: 'Bikin Versi Kamu 🎨',
    },
    trustCards: [
      {
        id: 'quality',
        title: 'Anti Layu Selamanya',
        desc: 'Bisa dipajang di kamar terus tanpa takut rontok atau kering!',
        icon: Sparkles,
      },
      {
        id: 'packaging',
        title: 'Packing Super Aman',
        desc: 'Box tebal anti penyok, siap kirim sampai tujuan tanpa kusut!',
        icon: PackageCheck,
      },
      {
        id: 'cod',
        title: 'Ketemuan COD Dekat Sini',
        desc: 'Bisa janjian di kampus UI, Gundar, atau spot nongkrong favoritmu!',
        icon: MapPin,
      },
      {
        id: 'warranty',
        title: 'Garansi 100% Sesuai Foto',
        desc: 'Buket cantik persis seperti preview, dijamin suka dan bahagia!',
        icon: Award,
      },
    ],
    catalog: {
      sectionEyebrow: 'Buket Super Gemas & Ceria',
      sectionTitle: 'Koleksi Buket Paling Laris',
      sectionSubtitle: 'Warna cerah bikin mood booster, cocok banget buat sahabat tersayang dan bestie wisuda!',
      filterLabels: {
        ALL: 'Semua Buket',
        Wisuda: 'Spesial Wisuda & Sidang',
        Pastel: 'Pastel Pop',
        Romantis: 'Bikin Deg-degan',
        Karakter: 'Karakter Super Gemas',
        'Mini Pot': 'Pot Gemas Meja',
      },
      buyButton: 'Mau yang Ini! 💖',
    },
    customStudio: {
      title: 'Studio Rangkai Suka-Suka',
      subtitle: 'Rangkai buket impianmu sendiri, bebas pilih warna dan karakter sesukamu!',
      step1Label: 'Pilih Karakter Bunga',
      step2Label: 'Warna Kawat Paling Kece',
      step3Label: 'Kertas Bungkus Favorit',
      step4Label: 'Aksesori Tambahan Gemas',
      recommendationBtn: '🎨 Padukan Otomatis Dong!',
      checkoutBtn: 'Bungkus Desain Keren Ini! 🎉',
    },
    lookbook: {
      sectionTitle: 'Keseruan Bareng Sahabat',
      sectionSubtitle: 'Foto-foto gemas wisudawan dan bestie bareng buket kawat bulu Chenille!',
      stories: [
        {
          quote: 'Boneka toga dan bunganya lucu banget, teman sekelasku pada nanya beli di mana!',
          author: 'Kezia Putri & Squad',
          occasion: 'Wisuda Akbar UI 2026',
          avatarBg: 'bg-yellow-100 text-yellow-800',
        },
        {
          quote: 'Sunflower-nya gemoy pol! Difoto outdoor warnanya keluar banget dan gak layu kena panas.',
          author: 'Tiara Andini',
          occasion: 'Lulus Sidang Skripsi',
          avatarBg: 'bg-emerald-100 text-emerald-800',
        },
        {
          quote: 'Langsung COD di stasiun UI, gak pake ribet. Kawat bulunya tebel dan fluffy!',
          author: 'Reza Fahlevi',
          occasion: 'Kado Ulang Tahun Pacar',
          avatarBg: 'bg-sky-100 text-sky-800',
        },
      ],
    },
    cart: {
      drawerTitle: (count) => `Keranjang Belanjamu (${count})`,
      upsellTitle: 'Biar Makin Berkesan, Tambah Ini Yuk:',
      spotifyOption: '🎶 Kasih Lagu Favorit Kalian (Spotify QR)',
      checkoutBtn: 'Gas Checkout Sekarang! 🚀',
    },
    occasions: {
      featureTitle: 'Catatan Hari Spesial',
      featureDesc: 'Jangan sampai lupa ultah sahabat atau doi! Tulis tanggalnya di sini, nanti kami ingetin!',
      waReminderTemplate: (days, recipient) =>
        `Hai Kak! ${days} hari lagi wisuda/ultah ${recipient} nih! Yuk amanin buketnya sekarang sebelum antrean penuh!`,
    },
  },
};

export function getThemeCopy(theme: ThemeId): ThemeCopy {
  return THEME_COPY_MATRIX[theme] || THEME_COPY_MATRIX['tema-a'];
}
