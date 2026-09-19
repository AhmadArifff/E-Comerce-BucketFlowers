'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, GraduationCap, Heart, Flower2, Smile, Coffee } from 'lucide-react';
import { useThemeStore } from '@/stores/useThemeStore';
import { getThemeCopy } from '@/lib/theme-copy';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CATEGORIES = [
  { id: 'ALL', name: 'Semua Produk', icon: Sparkles },
  { id: 'Wisuda', name: 'Buket Wisuda', icon: GraduationCap },
  { id: 'Pastel', name: 'Pastel Korea', icon: Flower2 },
  { id: 'Romantis', name: 'Romantis Velvet', icon: Heart },
  { id: 'Karakter', name: 'Karakter Kawaii', icon: Smile },
  { id: 'Mini Pot', name: 'Mini Pot Meja', icon: Coffee },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onSelectCategory }) => {
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = mounted ? theme : 'tema-a';
  const copy = getThemeCopy(activeTheme);

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none touch-pan-x overscroll-x-contain max-w-full w-full">
      {CATEGORIES.map((cat) => {
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
