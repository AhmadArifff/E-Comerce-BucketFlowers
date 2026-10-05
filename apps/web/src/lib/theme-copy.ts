/**
 * Multi-Theme Copywriting & Tone of Voice Matrix
 * Rujukan Mutlak: PRD.md Seksi 20 (Seksi 20.1 - 20.8) & Seksi 21
 */

import { PackageCheck, MapPin, Award, ShieldCheck, Heart, Flower2, Smile, Clock, Truck, Music, CheckCircle2 } from 'lucide-react';
import { KoreanTulipIcon } from '@/components/common/CraftIcons';
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
  // Karakter: Lembut, tulus seperti teman kos, estetik pastel Korea tanpa jaim
  // ==========================================
  'tema-a': {
    announcement: {
      quotaTemplate: (remaining) => `🌸 Slot perakitan hari ini sisa ${remaining} buket. Biar nggak panik H-1 wisuda, amankan sekarang ya!`,
      specialPromo: '🌸 Musim Wisuda Kampus Depok: Gratis Kartu Ucapan Tulis Tangan & Selempang Custom!',
    },
    hero: {
      topBadge: '🌸 Dirangkai Tangkai demi Tangkai di Depok',
      headlinePart1: 'Buket Lembut yang',
      headlineHighlight: 'Nggak Bakal Layu Pas Difoto Seharian.',
      subheadline: 'Kado wisuda dan sidang skripsi berbahan kawat beludru halus. Tetap mekar dan rapi dipajang di meja belajar, bahkan bertahun-tahun setelah toga dilepas.',
      ctaPrimary: 'Pilih Buket Favorit 🌸',
      ctaSecondary: 'Rangkai Versimu ✨',
    },
    trustCards: [
      {
        id: 'quality',
        title: 'Anti-Layu di Bawah Terik Matahari',
        desc: 'Mau foto 200 kali di taman kampus UI atau Margo, kelopak beludru tetap fluffy dan tegak sempurna.',
        icon: KoreanTulipIcon,
      },
      {
        id: 'packaging',
        title: 'Box Tebal Anti-Penyok',
        desc: 'Aman dibawa naik motor atau KRL tanpa takut bentuk buket gepeng atau kertas kusut.',
        icon: PackageCheck,
      },
      {
        id: 'cod',
        title: 'COD Gratis Tanpa Ribet',
        desc: 'Bisa janjian langsung di Stasiun UI, Barel, Kutek, Gundar Margonda, atau PNJ.',
        icon: MapPin,
      },
      {
        id: 'warranty',
        title: 'Garansi Rangkai Ulang 100%',
        desc: 'Buket kami cek teliti sebelum diserahkan. Kalau ada tangkai longgar, langsung kami rapikan.',
        icon: Award,
      },
    ],
    catalog: {
      sectionEyebrow: 'Koleksi Lembut Kawat Bulu Depok',
      sectionTitle: 'Pilihan Buket Favorit Sidang & Wisuda',
      sectionSubtitle: 'Sentuhan warna pastel lembut yang manis di kamera, pas untuk kado sidang skripsi, wisuda, atau kejutan ulang tahun.',
      filterLabels: {
        ALL: 'Semua Koleksi',
        Wisuda: 'Spesial Wisuda',
        Pastel: 'Pastel Korea',
        Romantis: 'Kisah Manis',
        Karakter: 'Karakter Lucu',
        'Mini Pot': 'Mini Pot Meja',
      },
      buyButton: 'Masukkan ke Keranjang 🌸',
    },
    customStudio: {
      title: 'Studio Rangkai Bunga Mandiri',
      subtitle: 'Bebas padukan warna kawat beludru dan pembungkus kesukaanmu dalam 4 langkah santai.',
      step1Label: 'Pilih Bunga Utama',
      step2Label: 'Pilih Nuansa Kawat Beludru',
      step3Label: 'Pilih Kertas Wrapping',
      step4Label: 'Pita & Sentuhan Akhir',
      recommendationBtn: '🪄 Rekomendasi Paduan Florist',
      checkoutBtn: 'Selesaikan Rangkaian Ini 🌸',
    },
    lookbook: {
      sectionTitle: 'Cerita Nyata dari Alumni & Mahasiswa',
      sectionSubtitle: 'Buket kawat bulu yang tersimpan rapi di meja belajar kamar kosan, menemani dari masa bimbingan skripsi sampai wisuda beneran.',
      stories: [
        {
          quote: 'Pas wisudaan panas banget di Balairung UI, bunga asli temen seangkatan udah pada lemas letoy. Punya aku tetep gemes fluffy sampai sesi foto keluarga sore!',
          author: 'Siti Sarah, S.Hum',
          occasion: 'Alumni FIB UI',
          avatarBg: 'bg-rose-100 text-rose-700',
        },
        {
          quote: 'Penyelamat H-1 sidang skripsi! Kardus packaging-nya kokoh banget, ada tali jinjing jadi gak ribet pas naik KRL dari Stasiun Pondok Cina.',
          author: 'Alifia Rahman',
          occasion: 'Sidang Vokasi UI',
          avatarBg: 'bg-pink-100 text-pink-700',
        },
        {
          quote: 'Janjian COD di gerbang UI langsung tepat waktu. Bunga kawat bulunya tebel dan warnanya pastel manis banget di kamera.',
          author: 'Nabila Azzahra',
          occasion: 'Kado Wisuda Sahabat',
          avatarBg: 'bg-amber-100 text-amber-700',
        },
      ],
    },
    cart: {
      drawerTitle: (count) => `Keranjang Bunga Kamu (${count})`,
      upsellTitle: 'Lengkapi Momen Bahagiamu:',
      spotifyOption: '🎵 Sisipkan Barcode Lagu Spotify Favorit',
      checkoutBtn: 'Lanjut ke Pengiriman 🌸',
    },
    occasions: {
      featureTitle: 'Pengingat Momen Wisuda & Sidang',
      featureDesc: 'Catat tanggal sidang atau wisuda orang tersayang. Kami ingatkan seminggu sebelumnya biar nggak kelabakan.',
      waReminderTemplate: (days, recipient) =>
        `Halo Kak, ${days} hari lagi hari spesial ${recipient} nih. Mau kami amankan slot buketnya lebih awal biar tenang?`,
    },
  },

  // ==========================================
  // TEMA B: MODERN ROMANTIC & EDITORIAL
  // Karakter: Artisan berkelas, berbobot, menghargai jerih payah perjuangan
  // ==========================================
  'tema-b': {
    announcement: {
      quotaTemplate: (remaining) => `🕯️ Kuota perakitan presisi hari ini: sisa ${remaining} slot. Standar kurasi ketat setiap tangkai.`,
      specialPromo: '✦ Edisi Wisuda Cumlaude: Termasuk Kartu Ucapan Eksklusif & Selempang Sutra Nama',
    },
    hero: {
      topBadge: '✦ Mahakarya Chenille Velvet Beludru Halus',
      headlinePart1: 'Penghormatan Layak untuk',
      headlineHighlight: 'Setiap Perjuangan Hebat.',
      subheadline: 'Rangkaian botanikal presisi tinggi untuk perayaan wisuda cumlaude dan selebrasi prestisius. Diciptakan bertahan abadi, bukan untuk berakhir di tempat sampah tiga hari kemudian.',
      ctaPrimary: 'Lihat Koleksi Prestisius 🌹',
      ctaSecondary: 'Konsultasi Buket Kustom 🖋️',
    },
    trustCards: [
      {
        id: 'quality',
        title: 'Investasi Memori Sejati',
        desc: 'Bukan sekadar kado sesaat. Mahakarya yang tetap tegak megah di ruang kerja bertahun-tahun kemudian.',
        icon: KoreanTulipIcon,
      },
      {
        id: 'packaging',
        title: 'Hardbox Struktural Anti-Benturan',
        desc: 'Pengemasan berlapis standar kurir eksekutif untuk pengiriman jarak jauh tanpa risiko perubahan bentuk.',
        icon: PackageCheck,
      },
      {
        id: 'cod',
        title: 'Layanan Titik Temu Presisi',
        desc: 'Serah terima tepat waktu di lokasi VIP kampus atau penyerahan terjadwal langsung.',
        icon: MapPin,
      },
      {
        id: 'warranty',
        title: 'Standar Kurasi Tanpa Kompromi',
        desc: 'Setiap lekuk kelopak dan lilitan batang kawat bulu diinspeksi secara manual oleh artisan senior.',
        icon: ShieldCheck,
      },
    ],
    catalog: {
      sectionEyebrow: 'Artisan Botanical Portfolio',
      sectionTitle: 'Koleksi Rangkaian Berwibawa',
      sectionSubtitle: 'Paduan estetika tegas dan proporsi anggun untuk menghormati pencapaian gelar dan komitmen sejati.',
      filterLabels: {
        ALL: 'Seluruh Portofolio',
        Wisuda: 'Graduation Honors',
        Pastel: 'Soft Palette',
        Romantis: 'Romance & Anniversary',
        Karakter: 'Bespoke Sculpture',
        'Mini Pot': 'Architectural Pots',
      },
      buyButton: 'Pesan Mahakarya Ini 🛍️',
    },
    customStudio: {
      title: 'Bespoke Bouquet Studio',
      subtitle: 'Rancang komposisi buket personal dengan kurasi material beludru kelas atas dan proporsi seimbang.',
      step1Label: 'Bentuk Kelopak Utama',
      step2Label: 'Palet Warna Batang Beludru',
      step3Label: 'Material Wrapping Cellophane',
      step4Label: 'Detail Pita Sutra & Kartu',
      recommendationBtn: '✨ Harmonisasi Warna Otomatis',
      checkoutBtn: 'Konfirmasi Desain Pesanan 🖋️',
    },
    lookbook: {
      sectionTitle: 'Momen Prestisius yang Kami Rayakan',
      sectionSubtitle: 'Dokumentasi perayaan kelulusan terhormat dan ungkapan terima kasih mendalam bersama mahakarya Chenille Atelier.',
      stories: [
        {
          quote: 'Istri saya terharu sekali saat inagurasi. Proporsi warna wine velvet dan lis emasnya sangat berwibawa di podium kehormatan tanpa aroma menyengat.',
          author: 'Dr. Raymond Hartono',
          occasion: 'Inagurasi Doktoral FT UI',
          avatarBg: 'bg-amber-100 text-amber-900',
        },
        {
          quote: 'Bunganya tidak rontok dan aman untuk penderita alergi serbuk sari. Finishing pita sutra dan kartu ucapan cetak lilinnya luar biasa rapi.',
          author: 'Clarissa Maharani, S.Ked',
          occasion: 'Wisuda Magna Cum Laude FK UI',
          avatarBg: 'bg-rose-100 text-rose-900',
        },
        {
          quote: 'Hardbox-nya sangat kokoh, buket tetap tegak sempurna meski dibawa perjalanan darat antarkota. Kualitas pengerjaan yang sepadan.',
          author: 'Dimas Wicaksono, M.M.',
          occasion: 'Kado Hari Jadi Pernikahan',
          avatarBg: 'bg-stone-200 text-stone-800',
        },
      ],
    },
    cart: {
      drawerTitle: (count) => `Daftar Rangkaian Terpilih (${count})`,
      upsellTitle: 'Sempurnakan Persembahan Ini:',
      spotifyOption: '🎼 Sematkan Barcode Lagu Memorial (Spotify QR)',
      checkoutBtn: 'Lanjutkan Pembayaran Aman 💳',
    },
    occasions: {
      featureTitle: 'Agenda Momen Penting',
      featureDesc: 'Jadwalkan tanggal selebrasi berharga Anda. Kami pastikan slot perakitan selesai tanpa tergesa-gesa.',
      waReminderTemplate: (days, recipient) =>
        `Mengingatkan kembali, momen berharga Anda bersama ${recipient} tiba dalam ${days} hari. Slot perakitan siap kami amankan untuk Anda.`,
    },
  },

  // ==========================================
  // TEMA C: PLAYFUL KAWAII & POP SUNSHINE
  // Karakter: Bestie heboh yang bangga temannya lulus skripsi, kocak, anti-panik
  // ==========================================
  'tema-c': {
    announcement: {
      quotaTemplate: (remaining) => `🎉 Yeay! Kuota buket anti-layu hari ini sisa ${remaining} slot! Jangan sampai keabisan ya!`,
      specialPromo: '🎀 Spesial Wisuda Depok: Gratis Boneka Toga Mini, Pita Lucu & Kartu Ucapan Kocak!',
    },
    hero: {
      topBadge: '🎉 Sahabat Resmi Pejuang Skripsi Depok',
      headlinePart1: 'Bunga Asli Layu Besok Lusa,',
      headlineHighlight: 'Buket Ini Awet Sampai Dapet Kerja!',
      subheadline: 'Buket kawat bulu super gemoy buat ngerayain bestie kamu yang akhirnya kelar revisi bab 4 dan 5! Lucu pol, anti rontok, dan langsung bikin mood auto naik.',
      ctaPrimary: 'Bungkus Bunga Gemoy 🌻',
      ctaSecondary: 'Bikin Sendiri Yuk! 🎨',
    },
    trustCards: [
      {
        id: 'quality',
        title: 'Garansi Nggak Bakal Letoy',
        desc: 'Tahan banting diajak lari-lari pas ngejar dosen pembimbing atau hunting spot foto di Margonda.',
        icon: KoreanTulipIcon,
      },
      {
        id: 'packaging',
        title: 'Packing Super Aman Anti-Penyok',
        desc: 'Kardus tebal anti gepeng, aman diajak naik ojol motor ngebut ke kampus!',
        icon: PackageCheck,
      },
      {
        id: 'cod',
        title: 'Ketemuan COD Dekat Kampus',
        desc: 'Bisa janjian di Gerbang UI, Gundar Margonda, Kober, stasiun KRL, atau spot nongkrong favorit.',
        icon: MapPin,
      },
      {
        id: 'warranty',
        title: '100% Sesuai Foto Preview',
        desc: 'Bunganya fluffy dan gembul persis seperti di foto, dijamin bestie kamu langsung teriak heboh!',
        icon: Award,
      },
    ],
    catalog: {
      sectionEyebrow: 'Buket Super Gemas Anti-Stress',
      sectionTitle: 'Koleksi Paling Laris Buat Bestie',
      sectionSubtitle: 'Warna cerah ceria yang bikin mood booster seketika, cocok banget buat kado sidang skripsi dan wisuda akbar!',
      filterLabels: {
        ALL: 'Semua Buket',
        Wisuda: 'Spesial Wisuda & Sidang',
        Pastel: 'Pastel Pop',
        Romantis: 'Bikin Salting',
        Karakter: 'Karakter Gemoy',
        'Mini Pot': 'Pot Gemas Meja',
      },
      buyButton: 'Mau yang Ini Dong! 💖',
    },
    customStudio: {
      title: 'Studio Rangkai Suka-Suka',
      subtitle: 'Rangkai buket impianmu sendiri, bebas campur warna kawat bulu dan karakter sesukamu tanpa batasan!',
      step1Label: 'Pilih Karakter Bunga',
      step2Label: 'Warna Kawat Paling Kece',
      step3Label: 'Kertas Bungkus Favorit',
      step4Label: 'Aksesori Tambahan Gemoy',
      recommendationBtn: '🎨 Padukan Otomatis Dong!',
      checkoutBtn: 'Bungkus Desain Keren Ini! 🎉',
    },
    lookbook: {
      sectionTitle: 'Keseruan Bareng Bestie & Sahabat',
      sectionSubtitle: 'Momen heboh para pejuang wisuda bareng buket kawat bulu Chenille yang tahan banting!',
      stories: [
        {
          quote: 'Pas temen selesai sidang langsung kita todong buket daisy kawat bulu ini! Mukanya yang tadinya tegang langsung ngakak semringah. Fix langganan buat wisuda nanti!',
          author: 'Kezia Putri & Squad',
          occasion: 'Gundar Margonda 2026',
          avatarBg: 'bg-yellow-100 text-yellow-800',
        },
        {
          quote: 'Buket sunflower-nya gemoy parah! Difoto outdoor bawah matahari Depok yang terik tetep tegak gak layu. Masuk kamar kos langsung dipajang di samping laptop.',
          author: 'Tiara Andini',
          occasion: 'Lulus Sidang PNJ',
          avatarBg: 'bg-emerald-100 text-emerald-800',
        },
        {
          quote: 'Langsung janjian COD di Stasiun Pondok Cina pas jam pulang kerja. Kawat bulunya empuk fluffy, pacar gue girang banget dapet kado ultah ini!',
          author: 'Reza Fahlevi',
          occasion: 'Kejutan Ulang Tahun Pacar',
          avatarBg: 'bg-sky-100 text-sky-800',
        },
      ],
    },
    cart: {
      drawerTitle: (count) => `Keranjang Belanjaanmu (${count})`,
      upsellTitle: 'Biar Makin Seru, Tambah Ini Yuk:',
      spotifyOption: '🎶 Pasang Lagu Kebangsaan Bestie (Spotify QR)',
      checkoutBtn: 'Amankan Buket Sebelum Kuota Ludes! 🚀',
    },
    occasions: {
      featureTitle: 'Catatan Momen Spesial Bestie',
      featureDesc: 'Jangan sampai lupa tanggal sidang atau ultah sahabat! Tulis tanggalnya di sini, nanti kami ingetin biar nggak dicoret dari kartu keluarga.',
      waReminderTemplate: (days, recipient) =>
        `Hai Kak! ${days} hari lagi hari spesialnya ${recipient} nih! Yuk amanin buketnya sekarang sebelum antrean penuh!`,
    },
  },
};

export function getThemeCopy(theme: ThemeId): ThemeCopy {
  return THEME_COPY_MATRIX[theme] || THEME_COPY_MATRIX['tema-a'];
}
