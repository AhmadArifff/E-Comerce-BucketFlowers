'use client';

import React, { useState } from 'react';
import {
  SlidersHorizontal,
  ArrowUpDown,
  Zap,
  Tag,
  RotateCcw,
  Check,
  ChevronDown,
  X,
} from 'lucide-react';

export interface FilterState {
  sort: string;
  readyStockOnly: boolean;
  discountOnly: boolean;
  minPrice: number | null;
  maxPrice: number | null;
}

interface ProductFilterBarProps {
  filterState: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onResetAll: () => void;
  totalFiltered: number;
  selectedCategory: string;
  searchQuery: string;
}

const SORT_OPTIONS = [
  { id: 'newest', label: '🆕 Terbaru', desc: 'Produk buket rilis terbaru' },
  { id: 'popular', label: '🌟 Terpopuler', desc: 'Paling sering dilihat pembeli' },
  { id: 'price_asc', label: '🏷️ Harga Terendah', desc: 'Mulai dari yang paling hemat' },
  { id: 'price_desc', label: '💎 Harga Tertinggi', desc: 'Koleksi bouquet premium' },
];

const PRICE_PRESETS = [
  { label: 'Semua Harga', min: null, max: null },
  { label: '< Rp 100.000', min: 0, max: 100000 },
  { label: 'Rp 100.000 - 150.000', min: 100000, max: 150000 },
  { label: 'Rp 150.000 - 250.000', min: 150000, max: 250000 },
  { label: '> Rp 250.000', min: 250000, max: 1000000 },
];

export const ProductFilterBar: React.FC<ProductFilterBarProps> = ({
  filterState,
  onFilterChange,
  onResetAll,
  totalFiltered,
  selectedCategory,
  searchQuery,
}) => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);

  // Temporary local inputs for custom price range
  const [tempMin, setTempMin] = useState<string>(
    filterState.minPrice !== null ? String(filterState.minPrice) : ''
  );
  const [tempMax, setTempMax] = useState<string>(
    filterState.maxPrice !== null ? String(filterState.maxPrice) : ''
  );

  // Calculate active filter count
  const activeCount = [
    selectedCategory !== 'ALL',
    Boolean(searchQuery.trim()),
    filterState.readyStockOnly,
    filterState.discountOnly,
    filterState.minPrice !== null || filterState.maxPrice !== null,
    filterState.sort !== 'newest',
  ].filter(Boolean).length;

  const currentSortObj = SORT_OPTIONS.find((s) => s.id === filterState.sort) || SORT_OPTIONS[0];

  const handleApplyCustomPrice = () => {
    const min = tempMin.trim() ? Math.max(0, parseInt(tempMin, 10)) : null;
    const max = tempMax.trim() ? Math.max(0, parseInt(tempMax, 10)) : null;
    onFilterChange({ minPrice: min, maxPrice: max });
    setIsPriceOpen(false);
  };

  const hasPriceFilter = filterState.minPrice !== null || filterState.maxPrice !== null;

  return (
    <div className="bg-white rounded-2xl border border-theme-border p-3 sm:p-4 shadow-xs space-y-3">
      {/* Top row: Summary + Quick Toggles + Sort Dropdown */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Quick Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Ready Stock Only Toggle */}
          <button
            type="button"
            onClick={() => onFilterChange({ readyStockOnly: !filterState.readyStockOnly })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
              filterState.readyStockOnly
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${filterState.readyStockOnly ? 'fill-emerald-500 text-emerald-600' : 'text-stone-400'}`} />
            <span>Ready Stock</span>
            {filterState.readyStockOnly && <Check className="w-3 h-3 text-emerald-600" />}
          </button>

          {/* Discount Only Toggle */}
          <button
            type="button"
            onClick={() => onFilterChange({ discountOnly: !filterState.discountOnly })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
              filterState.discountOnly
                ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-2xs'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <Tag className={`w-3.5 h-3.5 ${filterState.discountOnly ? 'fill-rose-500 text-rose-600' : 'text-stone-400'}`} />
            <span>Sedang Diskon</span>
            {filterState.discountOnly && <Check className="w-3 h-3 text-rose-600" />}
          </button>

          {/* Price Filter Trigger Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsPriceOpen(!isPriceOpen);
                setIsSortOpen(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                hasPriceFilter
                  ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-2xs'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
              <span>
                {hasPriceFilter
                  ? filterState.minPrice && filterState.maxPrice
                    ? `Rp ${(filterState.minPrice / 1000).toFixed(0)}k - ${(filterState.maxPrice / 1000).toFixed(0)}k`
                    : filterState.minPrice
                    ? `> Rp ${(filterState.minPrice / 1000).toFixed(0)}k`
                    : `< Rp ${(filterState.maxPrice! / 1000).toFixed(0)}k`
                  : 'Rentang Harga'}
              </span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {/* Price Popover Modal */}
            {isPriceOpen && (
              <div className="absolute left-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-stone-200 p-4 z-40 animate-in fade-in-50 zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100 mb-3">
                  <span className="text-xs font-black text-stone-800 uppercase tracking-wider">Filter Rentang Harga</span>
                  <button
                    onClick={() => setIsPriceOpen(false)}
                    className="p-1 text-stone-400 hover:text-stone-600 rounded-full"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Price Presets */}
                <div className="space-y-1.5 mb-3">
                  <span className="text-[10px] font-bold text-stone-400 uppercase">Pilihan Cepat:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRICE_PRESETS.map((preset, idx) => {
                      const isPresetActive =
                        filterState.minPrice === preset.min && filterState.maxPrice === preset.max;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            onFilterChange({ minPrice: preset.min, maxPrice: preset.max });
                            setTempMin(preset.min !== null ? String(preset.min) : '');
                            setTempMax(preset.max !== null ? String(preset.max) : '');
                            setIsPriceOpen(false);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                            isPresetActive
                              ? 'bg-rose-50 text-rose-700 border-rose-300 font-bold'
                              : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Inputs */}
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <span className="text-[10px] font-bold text-stone-400 uppercase">Kustom Nominal (Rp):</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-stone-400 block mb-0.5">Minimum</label>
                      <input
                        type="number"
                        placeholder="Contoh: 50000"
                        value={tempMin}
                        onChange={(e) => setTempMin(e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-theme-primary"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-400 block mb-0.5">Maksimum</label>
                      <input
                        type="number"
                        placeholder="Contoh: 200000"
                        value={tempMax}
                        onChange={(e) => setTempMax(e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-theme-primary"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        onFilterChange({ minPrice: null, maxPrice: null });
                        setTempMin('');
                        setTempMax('');
                        setIsPriceOpen(false);
                      }}
                      className="flex-1 py-1.5 rounded-xl border border-stone-200 text-stone-600 text-xs font-bold hover:bg-stone-50 cursor-pointer"
                    >
                      Hapus
                    </button>
                    <button
                      type="button"
                      onClick={handleApplyCustomPrice}
                      className="flex-1 py-1.5 rounded-xl bg-theme-primary text-white text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                    >
                      Terapkan
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Sort dropdown & Reset */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Active Filter Count & Reset */}
          {activeCount > 0 && (
            <button
              type="button"
              onClick={onResetAll}
              className="flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-rose-600 px-2.5 py-1.5 rounded-full hover:bg-rose-50 transition-colors cursor-pointer"
              title="Reset semua filter ke awal"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset</span>
              <span className="bg-rose-100 text-rose-700 text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
                {activeCount}
              </span>
            </button>
          )}

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsSortOpen(!isSortOpen);
                setIsPriceOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white text-stone-700 border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer shadow-2xs"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <span>Urutkan: <strong className="text-theme-text-main">{currentSortObj.label.split(' ')[1]}</strong></span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {isSortOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden z-40 divide-y divide-stone-100 animate-in fade-in-50 zoom-in-95 duration-150">
                <div className="px-3.5 py-2 bg-stone-50/80 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  Opsi Pengurutan Katalog
                </div>
                {SORT_OPTIONS.map((opt) => {
                  const isSelected = filterState.sort === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        onFilterChange({ sort: opt.id });
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected ? 'bg-rose-50/80 text-theme-primary font-bold' : 'hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold">{opt.label}</div>
                        <div className="text-[10px] text-stone-400">{opt.desc}</div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-theme-primary flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Filter Badges Bar (Visible when filters are active) */}
      {activeCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-stone-100 text-xs text-stone-500">
          <span className="text-[11px] font-bold text-stone-400 mr-1">Filter Aktif:</span>

          {selectedCategory !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-bold border border-rose-200/60">
              Kategori: {selectedCategory}
            </span>
          )}

          {searchQuery.trim() && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-theme-surface-subtle text-theme-primary text-[11px] font-bold border border-theme-border">
              Cari: &ldquo;{searchQuery}&rdquo;
            </span>
          )}

          {filterState.readyStockOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
              ⚡ Ready Stock
              <button
                type="button"
                onClick={() => onFilterChange({ readyStockOnly: false })}
                className="hover:text-emerald-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filterState.discountOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-bold border border-rose-200">
              🏷️ Sedang Diskon
              <button
                type="button"
                onClick={() => onFilterChange({ discountOnly: false })}
                className="hover:text-rose-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {hasPriceFilter && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200">
              Harga: {filterState.minPrice ? `Rp ${filterState.minPrice.toLocaleString('id-ID')}` : 'Rp 0'} -{' '}
              {filterState.maxPrice ? `Rp ${filterState.maxPrice.toLocaleString('id-ID')}` : 'Tak Terbatas'}
              <button
                type="button"
                onClick={() => onFilterChange({ minPrice: null, maxPrice: null })}
                className="hover:text-amber-950"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <span className="ml-auto text-[11px] text-stone-400 font-medium">
            Ditemukan <strong>{totalFiltered}</strong> buket
          </span>
        </div>
      )}
    </div>
  );
};
