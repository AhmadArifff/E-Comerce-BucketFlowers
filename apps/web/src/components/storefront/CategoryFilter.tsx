'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  BouquetAllIcon,
  GraduationBouquetIcon,
  KoreanTulipIcon,
  VelvetRoseIcon,
  KawaiiCharacterIcon,
  MiniPotPlantIcon,
} from '@/components/common/CraftIcons';
import { Flower2 } from 'lucide-react';
import { useThemeStore } from '@/stores/useThemeStore';
import { getThemeCopy } from '@/lib/theme-copy';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  availableCategories?: string[];
}

const DEFAULT_CATEGORIES = [
  { id: 'ALL', name: 'Semua Produk', icon: BouquetAllIcon },
  { id: 'Wisuda', name: 'Buket Wisuda', icon: GraduationBouquetIcon },
  { id: 'Pastel', name: 'Pastel Korea', icon: KoreanTulipIcon },
  { id: 'Romantis', name: 'Romantis Velvet', icon: VelvetRoseIcon },
  { id: 'Karakter', name: 'Karakter Kawaii', icon: KawaiiCharacterIcon },
  { id: 'Mini Pot', name: 'Mini Pot Meja', icon: MiniPotPlantIcon },
];

const getCategoryIcon = (id: string) => {
  const lower = id.toLowerCase();
  if (lower === 'all') return BouquetAllIcon;
  if (lower.includes('wisuda') || lower.includes('grad')) return GraduationBouquetIcon;
  if (lower.includes('pastel') || lower.includes('bunga') || lower.includes('flower') || lower.includes('tulip')) return KoreanTulipIcon;
  if (lower.includes('romantis') || lower.includes('love') || lower.includes('velvet') || lower.includes('rose') || lower.includes('mawar')) return VelvetRoseIcon;
  if (lower.includes('karakter') || lower.includes('kawaii') || lower.includes('boneka') || lower.includes('bear')) return KawaiiCharacterIcon;
  if (lower.includes('pot') || lower.includes('meja') || lower.includes('vas') || lower.includes('tanaman')) return MiniPotPlantIcon;
  return Flower2;
};

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  availableCategories,
}) => {
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = mounted ? theme : 'tema-a';
  const copy = getThemeCopy(activeTheme);

  const categories = useMemo(() => {
    if (!availableCategories || availableCategories.length === 0) {
      return DEFAULT_CATEGORIES;
    }
    const unique = Array.from(new Set(availableCategories.filter(Boolean)));
    const items = [
      { id: 'ALL', name: 'Semua Produk', icon: BouquetAllIcon },
      ...unique.map((cat) => ({
        id: cat,
        name: cat,
        icon: getCategoryIcon(cat),
      })),
    ];
    return items;
  }, [availableCategories]);

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none touch-pan-x overscroll-x-contain max-w-full w-full">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        const Icon = cat.icon;
        const displayName = copy.catalog.filterLabels[cat.id] || cat.name;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`filter-btn-atelier flex items-center gap-2 flex-shrink-0 ${
              isSelected ? 'active scale-105' : ''
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{displayName}</span>
          </button>
        );
      })}
    </div>
  );
};
