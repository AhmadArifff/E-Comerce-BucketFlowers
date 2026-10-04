'use client';

import React from 'react';
import { useThemeStore } from '@/stores/useThemeStore';
import { useSettingsStore } from '@/stores/useSettingsStore';

interface ChenilleBrandEmblemProps {
  className?: string;
  size?: number | string;
  variant?: 'emblem-only' | 'full';
  customLogoUrl?: string | null;
}

export const ChenilleBrandEmblem: React.FC<ChenilleBrandEmblemProps> = ({
  className = 'w-10 h-10',
  size,
  variant = 'emblem-only',
  customLogoUrl,
}) => {
  const { theme } = useThemeStore();
  const { logoUrl, brandMarkType, storeName, tagline } = useSettingsStore();

  const activeLogo = customLogoUrl !== undefined ? customLogoUrl : logoUrl;
  const isCustomImage = Boolean(activeLogo && (brandMarkType === 'CUSTOM_UPLOAD' || customLogoUrl));

  // If Admin uploaded a custom logo image, render it crisp and clear
  if (isCustomImage && activeLogo) {
    return (
      <div className={`relative flex items-center justify-center overflow-hidden rounded-xl ${className}`}>
        <img
          src={activeLogo}
          alt={storeName || 'Chenille Atelier Florist'}
          className="w-full h-full object-contain filter drop-shadow-xs"
          onError={(e) => {
            // Fallback if image fails to load
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
    );
  }

  // Bespoke Vector Craft Emblem adapted to the 3 distinct Themes
  return (
    <div
      className={`relative flex items-center justify-center select-none transition-all duration-300 ${className}`}
      title={storeName || 'Chenille Atelier Florist'}
    >
      {theme === 'tema-b' ? (
        /* TEMA B: MODERN ROMANTIC & EDITORIAL LUXURY (Royal Gold & Deep Wine Crest) */
        <svg
          viewBox="0 0 40 40"
          className="w-full h-full drop-shadow-xs"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Octagonal Luxury Seal Frame */}
          <polygon
            points="12,2 28,2 38,12 38,28 28,38 12,38 2,28 2,12"
            fill="#3B122D"
            stroke="#D4AF37"
            strokeWidth="1.6"
          />
          <polygon
            points="13,4.5 27,4.5 35.5,13 35.5,27 27,35.5 13,35.5 4.5,27 4.5,13"
            stroke="#D4AF37"
            strokeWidth="0.8"
            strokeDasharray="2 1.5"
            opacity="0.8"
          />
          {/* Interlocking Monogram CA (Chenille Atelier) & Velvet Wire Rose */}
          <path
            d="M24 13C22 11 18.5 11 16.5 13C14 15.5 14 24.5 16.5 27C18.5 29 22 29 24 27"
            stroke="#D4AF37"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M20 16L24.5 27M24.5 27L29 16M22 23H27"
            stroke="#FDF9F0"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Delicate Top Rosebud Wire Terminal */}
          <circle cx="20" cy="9" r="2.2" fill="#D4AF37" />
          <path d="M19 9C19 8.2 19.5 7.8 20 7.8C20.5 7.8 21 8.2 21 9" stroke="#3B122D" strokeWidth="0.8" />
        </svg>
      ) : theme === 'tema-c' ? (
        /* TEMA C: KAWAII POP & CHEERFUL CRAFT (Bubbly Fluffy Daisy Mascot) */
        <svg
          viewBox="0 0 40 40"
          className="w-full h-full drop-shadow-xs"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Fluffy Cloud Badge Background */}
          <rect
            x="2"
            y="2"
            width="36"
            height="36"
            rx="12"
            fill="url(#kawaiiBg)"
            stroke="#FFAAA6"
            strokeWidth="1.8"
          />
          <defs>
            <linearGradient id="kawaiiBg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFEAA7" />
              <stop offset="1" stopColor="#FFB7B2" />
            </linearGradient>
          </defs>
          {/* Bubbly 5-Petal Fuzzy Daisy */}
          <circle cx="20" cy="12" r="4.2" fill="#FFFFFF" stroke="#FF7675" strokeWidth="1.2" />
          <circle cx="27" cy="18" r="4.2" fill="#FFFFFF" stroke="#FF7675" strokeWidth="1.2" />
          <circle cx="24" cy="26" r="4.2" fill="#FFFFFF" stroke="#FF7675" strokeWidth="1.2" />
          <circle cx="16" cy="26" r="4.2" fill="#FFFFFF" stroke="#FF7675" strokeWidth="1.2" />
          <circle cx="13" cy="18" r="4.2" fill="#FFFFFF" stroke="#FF7675" strokeWidth="1.2" />
          {/* Center Smiling Heart / Core */}
          <circle cx="20" cy="20" r="5" fill="#FFEAA7" stroke="#E17055" strokeWidth="1.2" />
          {/* Smiling Eyes & Mouth */}
          <circle cx="18" cy="19.5" r="0.8" fill="#2D3436" />
          <circle cx="22" cy="19.5" r="0.8" fill="#2D3436" />
          <path d="M19 22C19.5 22.8 20.5 22.8 21 22" stroke="#2D3436" strokeWidth="1" strokeLinecap="round" />
        </svg>
      ) : (
        /* TEMA A: KOREAN PASTEL ATELIER (Clean Minimalist Wire Tulip Seal) */
        <svg
          viewBox="0 0 40 40"
          className="w-full h-full drop-shadow-xs"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Soft Squircle Base */}
          <rect
            x="2"
            y="2"
            width="36"
            height="36"
            rx="11"
            fill="#FDF2F4"
            stroke="#F7D1D9"
            strokeWidth="1.6"
          />
          {/* Single-Line Korean Tulip Wire Craft */}
          {/* Tulip Left & Right Petals */}
          <path
            d="M13 17C13 11 17 8 20 12C23 8 27 11 27 17C27 22.5 20 25.5 20 25.5C20 25.5 13 22.5 13 17Z"
            fill="#F8BBD0"
            fillOpacity="0.4"
            stroke="#9C3D52"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* Center Petal Line */}
          <path d="M20 12V25" stroke="#9C3D52" strokeWidth="1.4" strokeLinecap="round" />
          {/* Stem & Sage Leaves */}
          <path d="M20 25.5V33" stroke="#81C784" strokeWidth="1.8" strokeLinecap="round" />
          <path
            d="M20 28C17 27 15 24 15 22"
            stroke="#81C784"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M20 29.5C23 28.5 25 25.5 25 23.5"
            stroke="#81C784"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          {/* Satin Bow Tie */}
          <path
            d="M17.5 26C16.5 26 15.5 27 16 28C16.5 29 19 27.5 20 27C21 27.5 23.5 29 24 28C24.5 27 23.5 26 22.5 26"
            stroke="#9C3D52"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      )}
    </div>
  );
};
