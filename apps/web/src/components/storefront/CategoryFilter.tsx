'use client';

import React from 'react';
import { Sparkles, GraduationCap, Heart, Flower2, Smile, Coffee } from 'lucide-react';

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
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none">
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        const Icon = cat.icon;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
              isSelected
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20 scale-105'
                : 'bg-white text-stone-600 border border-stone-200 hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50/50'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
};
