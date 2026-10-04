'use client';

import React from 'react';

export interface CraftIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
}

/**
 * 💐 Semua Koleksi (Artisan Chenille Bouquet)
 * Tiga kelopak kawat bulu berpilin yang diikat rapi dengan simpul pita atelier.
 * Menggantikan Sparkles AI yang malas.
 */
export const BouquetAllIcon: React.FC<CraftIconProps> = ({ className = 'w-4 h-4', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    {/* Left petal loop */}
    <path d="M8.5 11C6.5 9 5.5 6.5 7 4.5C8.5 2.5 11 3.5 12 5.5" />
    {/* Right petal loop */}
    <path d="M15.5 11C17.5 9 18.5 6.5 17 4.5C15.5 2.5 13 3.5 12 5.5" />
    {/* Center top bud */}
    <path d="M12 5.5C11 3 13 2 14 3.5" />
    {/* Stem bundle */}
    <path d="M12 11V21" />
    <path d="M10 12.5L8.5 18" />
    <path d="M14 12.5L15.5 18" />
    {/* Satin ribbon tie */}
    <path d="M9.5 13C8.5 13 7.5 14 8 15C8.5 16 11 14.5 12 14C13 14.5 15.5 16 16 15C16.5 14 15.5 13 14.5 13" />
  </svg>
);

/**
 * 🎓 Buket Wisuda (Graduation Wire Bouquet)
 * Topi toga sarjana dengan lilitan pita satin dan medali kado wisuda.
 */
export const GraduationBouquetIcon: React.FC<CraftIconProps> = ({ className = 'w-4 h-4', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    {/* Mortarboard rhomb */}
    <polygon points="12 3 22 8 12 13 2 8 12 3" />
    {/* Skull cap */}
    <path d="M6 10.5V16C6 17.5 8.7 19 12 19C15.3 19 18 17.5 18 16V10.5" />
    {/* Tassel ribbon */}
    <path d="M22 8V15C22 16 21 17 20 17" />
    <circle cx="20" cy="17.5" r="1" fill="currentColor" />
  </svg>
);

/**
 * 🌷 Korean Pastel (3-Loop Tulip Wire Craft)
 * Kuncup tulip kawat bulu khas teknik florist Korea.
 */
export const KoreanTulipIcon: React.FC<CraftIconProps> = ({ className = 'w-4 h-4', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    {/* Left curved petal */}
    <path d="M6.5 9.5C6.5 5 10 3 12 7C14 3 17.5 5 17.5 9.5C17.5 14 12 16.5 12 16.5C12 16.5 6.5 14 6.5 9.5Z" />
    {/* Center petal vein */}
    <path d="M12 7V16" />
    {/* Stem & Leaves */}
    <path d="M12 16.5V22" />
    <path d="M12 19C9 18.5 7.5 16 7.5 14.5" />
    <path d="M12 18C15 17.5 16.5 15.5 16.5 14" />
  </svg>
);

/**
 * 🧸 Karakter Lucu (Fuzzy Chenille Character / Bear Doll)
 * Karakter boneka kawat bulu berbulu lembut dengan telinga melengkung.
 */
export const KawaiiCharacterIcon: React.FC<CraftIconProps> = ({ className = 'w-4 h-4', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    {/* Left round ear */}
    <circle cx="6.5" cy="7" r="3" />
    {/* Right round ear */}
    <circle cx="17.5" cy="7" r="3" />
    {/* Head body */}
    <circle cx="12" cy="13.5" r="7" />
    {/* Eyes */}
    <circle cx="9.5" cy="12.5" r="0.9" fill="currentColor" />
    <circle cx="14.5" cy="12.5" r="0.9" fill="currentColor" />
    {/* Cute nose & smile */}
    <path d="M11 14.5C11.5 15 12.5 15 13 14.5" />
    <path d="M12 14.5V16" />
  </svg>
);

/**
 * 🌹 Edisi Romantis (Velvet Spiral Rose)
 * Kelopak mawar beludru berpilin spiral khas teknik pengerjaan florist kawat bulu.
 */
export const VelvetRoseIcon: React.FC<CraftIconProps> = ({ className = 'w-4 h-4', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    {/* Center spiral */}
    <path d="M12 11C13 11 13.5 10 13 9C12.5 8 11 8.5 10.5 10C10 12 13 13 14 11.5C14.8 10.2 13.5 7 11.5 6.5C9 6 7 8.5 7.5 11.5C8 15 14 16 16 13" />
    {/* Outer rose calyx */}
    <path d="M6 13C6 17 9 19 12 19C15 19 18 17 18 13" />
    {/* Stem */}
    <path d="M12 19V22" />
    {/* Leaf */}
    <path d="M12 20.5C14 20.5 16 19.5 16.5 18" />
  </svg>
);

/**
 * 🪴 Mini Pot Meja (Potted Tabletop Chenille Flower)
 * Pot vas keramik estetik dengan tanaman kawat bulu mekar.
 * MENGGANTIKAN CANGKIR KOPI (COFFEE)!
 */
export const MiniPotPlantIcon: React.FC<CraftIconProps> = ({ className = 'w-4 h-4', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    {/* Flower blooming on top */}
    <circle cx="12" cy="6.5" r="2.5" />
    <path d="M12 4V2.5" />
    <path d="M12 9V10.5" />
    <path d="M9.5 6.5H8" />
    <path d="M16 6.5H14.5" />
    {/* Stem */}
    <path d="M12 10.5V14" />
    {/* Side leaves */}
    <path d="M12 12C9.5 11 8.5 9 8.5 9" />
    <path d="M12 12C14.5 11 15.5 9 15.5 9" />
    {/* Pot rim */}
    <rect x="6" y="14" width="12" height="2.5" rx="1" />
    {/* Pot trapezoid base */}
    <path d="M7 16.5L8.5 21.5H15.5L17 16.5" />
  </svg>
);

/**
 * 🎁 Ready Stock (Buket Siap di Etalase Toko)
 * Buket kado mekar di etalase atelier siap diambil langsung tanpa PO.
 * MENGGANTIKAN ICON PETIR (ZAP)!
 */
export const ReadyStockAtelierIcon: React.FC<CraftIconProps> = ({ className = 'w-4 h-4', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    {/* Top flower burst emerging from box */}
    <path d="M9 7C8 5 9 3 10.5 4C11.5 4.7 11.5 6 12 7C12.5 6 12.5 4.7 13.5 4C15 3 16 5 15 7" />
    {/* Box top open flaps */}
    <path d="M4 10L12 7L20 10" />
    {/* Front box body */}
    <path d="M5 10.5V18.5C5 19.3 5.7 20 6.5 20H17.5C18.3 20 19 19.3 19 18.5V10.5" />
    {/* Central satin ribbon stripe */}
    <path d="M12 7V20" />
    {/* Ready check tick */}
    <path d="M9.5 14L11 15.5L15 11.5" />
  </svg>
);

/**
 * 🎀 Sedang Diskon (Pita Hadiah Promo Florist)
 * Simpul pita kado sutra mewah dengan potongan promo spesial.
 * Menggantikan tag harga minimarket yang kaku.
 */
export const DiscountRibbonIcon: React.FC<CraftIconProps> = ({ className = 'w-4 h-4', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    {/* Left ribbon loop */}
    <path d="M12 9C9.5 6 6 6 5.5 8C5 10 8 11.5 12 11" />
    {/* Right ribbon loop */}
    <path d="M12 9C14.5 6 18 6 18.5 8C19 10 16 11.5 12 11" />
    {/* Center knot */}
    <circle cx="12" cy="10" r="1.8" fill="currentColor" />
    {/* Left tail */}
    <path d="M10.5 11.5L7 19L9.5 18L11 20L11.8 11.8" />
    {/* Right tail */}
    <path d="M13.5 11.5L17 19L14.5 18L13 20L12.2 11.8" />
  </svg>
);

/**
 * 🧭 Rentang Harga (Budget Florist Compass)
 * Simbol kompas penyesuai budget ramah mahasiswa/pelanggan.
 */
export const PriceCompassIcon: React.FC<CraftIconProps> = ({ className = 'w-4 h-4', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    {/* Outer soft ring */}
    <circle cx="12" cy="12" r="9" />
    {/* Horizontal balance slider line */}
    <line x1="7" y1="12" x2="17" y2="12" />
    {/* Left node */}
    <circle cx="9" cy="12" r="2" fill="currentColor" />
    {/* Right node */}
    <circle cx="15" cy="12" r="2" />
    {/* Rupiah / floral petal indicator */}
    <path d="M12 7V9" />
    <path d="M12 15V17" />
  </svg>
);
