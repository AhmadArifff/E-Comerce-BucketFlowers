'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, GraduationCap, Heart, Flower2, Smile, Coffee, Tag } from 'lucide-react';
import { useThemeStore } from '@/stores/useThemeStore';
import { getThemeCopy } from '@/lib/theme-copy';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  availableCategories?: string[];
}

const DEFAULT_CATEGORIES = [
  { id: 'ALL', name: 'Semua Produk', icon: Sparkles },
  { id: 'Wisuda', name: 'Buket Wisuda', icon: GraduationCap },
  { id: 'Pastel', name: 'Pastel Korea', icon: Flower2 },
  { id: 'Romantis', name: 'Romantis Velvet', icon: Heart },
  { id: 'Karakter', name: 'Karakter Kawaii', icon: Smile },
  { id: 'Mini Pot', name: 'Mini Pot Meja', icon: Coffee },
];

const getCategoryIcon = (id: string) => {
  const lower = id.toLowerCase();
  if (lower === 'all') return Sparkles;
  if (lower.includes('wisuda') || lower.includes('grad')) return GraduationCap;
  if (lower.includes('pastel') || lower.includes('bunga') || lower.includes('flower')) return Flower2;
  if (lower.includes('romantis') || lower.includes('love') || lower.includes('velvet')) return Heart;
  if (lower.includes('karakter') || lower.includes('kawaii') || lower.includes('boneka')) return Smile;
  if (lower.includes('pot') || lower.includes('meja') || lower.includes('vas')) return Coffee;
  return Tag;
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
      { id: 'ALL', name: 'Semua Produk', icon: Sparkles },
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
