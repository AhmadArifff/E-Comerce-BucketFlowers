'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  ArrowUpDown,
  RefreshCw,
  Layers,
  Palette,
  Check,
  X,
  Sliders,
  HelpCircle,
} from 'lucide-react';
import { getApiUrl } from '@/lib/api-client';
import { showMagicToast } from '@/lib/magic-motion';

export type CustomStudioCategory =
  | 'FLOWER_TYPE'
  | 'CHENILLE_COLOR'
  | 'WRAPPING_STYLE'
  | 'RIBBON_STYLE'
  | 'PACKAGING_BOX'
  | 'GREETING_SEAL'
  | 'ACCESSORY_ADDON';

export interface StudioOptionItem {
  id: string;
  category: CustomStudioCategory;
  name: string;
  description: string | null;
  price_modifier: number;
  emoji_or_icon: string | null;
  hex_color: string | null;
  sort_order: number;
  is_active: boolean;
}

const CATEGORY_CONFIG: Record<
  CustomStudioCategory,
  { label: string; icon: string; badgeColor: string; description: string }
> = {
  FLOWER_TYPE: {
    label: 'Bunga Utama',
    icon: '🌷',
    badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
    description: 'Jenis bunga kawat bulu utama yang membentuk struktur buket.',
  },
  CHENILLE_COLOR: {
    label: 'Warna Kawat',
    icon: '🎨',
    badgeColor: 'bg-pink-100 text-pink-700 border-pink-200',
    description: 'Pilihan palet warna kawat bulu beludru (chenille stem).',
  },
  WRAPPING_STYLE: {
    label: 'Kertas Buket',
    icon: '🎀',
    badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
    description: 'Model dan tekstur kertas wrapping cellophane / velvet.',
  },
  RIBBON_STYLE: {
    label: 'Pilihan Pita',
    icon: '🎗️',
    badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
    description: 'Aksen pita satin, organza, atau rami pengikat buket.',
  },
  PACKAGING_BOX: {
    label: 'Packaging Box',
    icon: '📦',
    badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
    description: 'Opsi kotak jendela mika, tas PVC, atau paper bag pelindung.',
  },
  GREETING_SEAL: {
    label: 'Kartu & Segel',
    icon: '✉️',
    badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    description: 'Format kartu ucapan standard, gold foil, atau wax seal stamp.',
  },
  ACCESSORY_ADDON: {
    label: 'Aksesoris',
    icon: '✨',
    badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    description: 'Elemen tambahan seperti lampu LED peri, boneka toga, dan pin.',
  },
};

const EMOJI_PALETTE = [
  '🌷', '🌹', '🌻', '🪻', '🌸', '🌺', '💐', '🎀', '🎗️', '📦', '🎁', '🛍️', '👜',
  '✉️', '📜', '✨', '💡', '🧸', '🦋', '🧵', '🌿', '💎', '🎉', '🎓', '👑'
];

const PRESET_COLORS = [
  '#F4A7B9', '#C4B5FD', '#BAE6FD', '#A8C3A0', '#FDE047',
  '#FDBA74', '#F43F5E', '#8B5CF6', '#3B82F6', '#10B981',
  '#FFFFFF', '#E2E8F0', '#64748B', '#0F172A'
];

export const CustomStudioManagementView: React.FC = () => {
  const [options, setOptions] = useState<StudioOptionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | CustomStudioCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StudioOptionItem | null>(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<StudioOptionItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    id: '',
    category: 'FLOWER_TYPE' as CustomStudioCategory,
    name: '',
    description: '',
    price_modifier: 0,
    emoji_or_icon: '🌷',
    hex_color: '#F4A7B9',
    sort_order: 1,
    is_active: true,
  });

  const fetchOptions = async () => {
    try {
      setLoading(true);
      const res = await fetch(getApiUrl('/api/v1/custom-studio/admin/all'));
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setOptions(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch custom studio options:', err);
      showMagicToast('Gagal Memuat Data', 'Tidak dapat mengambil opsi custom studio dari server.', '⚠️');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  const filteredOptions = useMemo(() => {
    return options.filter((item) => {
      const matchCat = selectedCategory === 'ALL' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        item.id.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [options, selectedCategory, searchQuery]);

  const stats = useMemo(() => {
    const total = options.length;
    const active = options.filter((o) => o.is_active).length;
    const inactive = total - active;
    return { total, active, inactive };
  }, [options]);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    const cat = selectedCategory === 'ALL' ? 'FLOWER_TYPE' : selectedCategory;
    setFormData({
      id: '',
      category: cat,
      name: '',
      description: '',
      price_modifier: 0,
      emoji_or_icon: CATEGORY_CONFIG[cat].icon,
      hex_color: '#F4A7B9',
      sort_order: options.filter((o) => o.category === cat).length + 1,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: StudioOptionItem) => {
    setEditingItem(item);
    setFormData({
      id: item.id,
      category: item.category,
      name: item.name,
      description: item.description || '',
      price_modifier: item.price_modifier,
      emoji_or_icon: item.emoji_or_icon || '',
      hex_color: item.hex_color || '#F4A7B9',
      sort_order: item.sort_order,
      is_active: item.is_active,
    });
    setIsModalOpen(true);
  };

  const handleToggleActive = async (item: StudioOptionItem) => {
    try {
      // Optimistic update
      setOptions((prev) =>
        prev.map((o) => (o.id === item.id ? { ...o, is_active: !o.is_active } : o))
      );

      const res = await fetch(getApiUrl(`/api/v1/custom-studio/admin/${item.id}/toggle`), {
        method: 'PATCH',
      });
      const json = await res.json();

      if (!json.success) {
        // Rollback
        setOptions((prev) =>
          prev.map((o) => (o.id === item.id ? { ...o, is_active: item.is_active } : o))
        );
        showMagicToast('Gagal Mengubah Status', json.error || 'Terjadi kesalahan.', '❌');
      } else {
        const statusText = !item.is_active ? 'diaktifkan' : 'dinonaktifkan';
        showMagicToast(
          'Status Diperbarui',
          `Opsi "${item.name}" berhasil ${statusText}.`,
          !item.is_active ? '✅' : '⏸️'
        );
      }
    } catch (err: any) {
      console.error('Error toggling status:', err);
      // Rollback
      setOptions((prev) =>
        prev.map((o) => (o.id === item.id ? { ...o, is_active: item.is_active } : o))
      );
      showMagicToast('Gagal Mengubah Status', 'Terjadi kesalahan jaringan.', '❌');
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showMagicToast('Validasi Gagal', 'Nama opsi wajib diisi.', '⚠️');
      return;
    }

    try {
      setSubmitting(true);
      const isEdit = Boolean(editingItem);
      const url = isEdit
        ? getApiUrl(`/api/v1/custom-studio/admin/${editingItem!.id}`)
        : getApiUrl('/api/v1/custom-studio/admin');
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!json.success) {
        showMagicToast('Gagal Menyimpan', json.error || 'Gagal menyimpan opsi.', '❌');
      } else {
        showMagicToast(
          isEdit ? 'Opsi Diperbarui! ✨' : 'Opsi Ditambahkan! 🎉',
          json.message || `Opsi "${formData.name}" berhasil disimpan.`,
          '🌸'
        );
        setIsModalOpen(false);
        fetchOptions();
      }
    } catch (err: any) {
      console.error('Error saving option:', err);
      showMagicToast('Gagal Menyimpan', 'Terjadi kesalahan saat menyimpan opsi.', '❌');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmItem) return;
    try {
      setSubmitting(true);
      const res = await fetch(getApiUrl(`/api/v1/custom-studio/admin/${deleteConfirmItem.id}`), {
        method: 'DELETE',
      });
      const json = await res.json();

      if (!json.success) {
        showMagicToast('Tidak Dapat Menghapus', json.error || 'Gagal menghapus opsi.', '⚠️');
      } else {
        showMagicToast('Opsi Dihapus', json.message || 'Opsi berhasil dihapus.', '🗑️');
        setOptions((prev) => prev.filter((o) => o.id !== deleteConfirmItem.id));
        setDeleteConfirmItem(null);
      }
    } catch (err: any) {
      console.error('Error deleting option:', err);
      showMagicToast('Gagal Menghapus', 'Terjadi kesalahan sistem.', '❌');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dynamic Custom Studio Suite</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-800 tracking-tight">
            Custom Studio Builder & Opsi Dinamis
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
            Kelola seluruh komponen kustomisasi buket (Bunga, Warna, Wrapping, Pita, Box, Kartu & Aksesoris).
            Semua perubahan langsung live secara real-time di landing page & portal pelanggan tanpa hardcode.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={fetchOptions}
            className="p-2.5 rounded-2xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors flex items-center gap-1.5 text-xs font-bold"
            title="Muat Ulang Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-rose-600' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-500 text-white text-xs font-black flex items-center gap-2 shadow-md shadow-rose-600/20 hover:opacity-95 transition-opacity cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Opsi Baru</span>
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Total Opsi Studio</div>
          <div className="text-2xl font-black text-stone-800 mt-1">{stats.total}</div>
          <div className="text-[10px] text-stone-400 mt-0.5">Semua kategori terdaftar</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-xs">
          <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Aktif di Toko</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{stats.active}</div>
          <div className="text-[10px] text-emerald-500 mt-0.5">Tampil untuk pelanggan</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Nonaktif (Draft)</div>
          <div className="text-2xl font-black text-stone-400 mt-1">{stats.inactive}</div>
          <div className="text-[10px] text-stone-400 mt-0.5">Disembunyikan sementara</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-rose-100 shadow-xs">
          <div className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Kategori Aktif</div>
          <div className="text-2xl font-black text-rose-600 mt-1">7 Kategori</div>
          <div className="text-[10px] text-rose-500 mt-0.5">Full custom stack</div>
        </div>
      </div>

      {/* CATEGORY TABS & FILTER */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-sm space-y-4">
        {/* Category Pill Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Semua Opsi ({options.length})
          </button>

          {(Object.keys(CATEGORY_CONFIG) as CustomStudioCategory[]).map((cat) => {
            const isSel = selectedCategory === cat;
            const count = options.filter((o) => o.category === cat).length;
            const conf = CATEGORY_CONFIG[cat];
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSel
                    ? 'bg-rose-600 text-white shadow-xs shadow-rose-600/20'
                    : 'bg-stone-50 border border-stone-200/80 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <span>{conf.icon}</span>
                <span>{conf.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    isSel ? 'bg-white text-rose-600' : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 border-t border-stone-100">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari opsi (nama, ID, deskripsi)..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-stone-50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="text-xs text-stone-500 font-medium">
            Menampilkan <span className="font-black text-stone-800">{filteredOptions.length}</span> dari {options.length} opsi
          </div>
        </div>
      </div>

      {/* OPTIONS TABLE / LIST */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-rose-500 animate-spin mx-auto" />
            <p className="text-xs font-bold text-stone-500">Memuat opsi Custom Studio dari database...</p>
          </div>
        ) : filteredOptions.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto text-xl">
              🔍
            </div>
            <h3 className="text-sm font-extrabold text-stone-800">Tidak ada opsi ditemukan</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Tidak ada opsi yang cocok dengan filter kategori & pencarian saat ini.
            </p>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Opsi Ini Sekarang</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/70 text-[11px] font-black text-stone-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Preview</th>
                  <th className="py-3.5 px-4">Nama & ID Opsi</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4">Deskripsi</th>
                  <th className="py-3.5 px-4">Harga Tambahan</th>
                  <th className="py-3.5 px-3 text-center">Urutan</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                {filteredOptions.map((item) => {
                  const catConf = CATEGORY_CONFIG[item.category];
                  const hasColor = Boolean(item.hex_color);
                  const hasEmoji = Boolean(item.emoji_or_icon);

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-rose-50/30 transition-colors ${
                        !item.is_active ? 'opacity-60 bg-stone-50/50' : ''
                      }`}
                    >
                      {/* Visual Preview */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {hasColor && (
                            <div
                              className="w-7 h-7 rounded-xl border border-stone-300 shadow-2xs flex-shrink-0 flex items-center justify-center text-[10px] font-mono font-black"
                              style={{ backgroundColor: item.hex_color || '#fff' }}
                              title={`Hex: ${item.hex_color}`}
                            />
                          )}
                          {hasEmoji && (
                            <span className="text-xl flex-shrink-0" title={`Emoji: ${item.emoji_or_icon}`}>
                              {item.emoji_or_icon}
                            </span>
                          )}
                          {!hasColor && !hasEmoji && (
                            <div className="w-7 h-7 rounded-xl bg-stone-100 text-stone-400 flex items-center justify-center text-xs">
                              -
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Name & ID */}
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-stone-800 text-xs">{item.name}</div>
                        <div className="font-mono text-[10px] text-stone-400 mt-0.5">{item.id}</div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-extrabold ${catConf.badgeColor}`}
                        >
                          <span>{catConf.icon}</span>
                          <span>{catConf.label}</span>
                        </span>
                      </td>

                      {/* Description */}
                      <td className="py-3 px-4 max-w-xs">
                        <span className="text-stone-600 line-clamp-2 text-[11px]">
                          {item.description || <span className="text-stone-300 italic">Tanpa keterangan</span>}
                        </span>
                      </td>

                      {/* Price Modifier */}
                      <td className="py-3 px-4">
                        {item.price_modifier > 0 ? (
                          <span className="font-black text-rose-600 text-xs">
                            +Rp {item.price_modifier.toLocaleString('id-ID')}
                          </span>
                        ) : (
                          <span className="font-bold text-emerald-600 text-[11px] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            Gratis / Base
                          </span>
                        )}
                      </td>

                      {/* Sort Order */}
                      <td className="py-3 px-3 text-center">
                        <span className="font-mono font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md text-[11px]">
                          #{item.sort_order}
                        </span>
                      </td>

                      {/* Active Status Switch */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(item)}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            item.is_active ? 'bg-emerald-500' : 'bg-stone-300'
                          }`}
                          title={item.is_active ? 'Klik untuk nonaktifkan' : 'Klik untuk aktifkan'}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              item.is_active ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Edit Opsi"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteConfirmItem(item)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Hapus Opsi"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-stone-100 my-8 space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-800">
                    {editingItem ? 'Edit Opsi Custom Studio' : 'Tambah Opsi Custom Baru'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Data akan langsung tersimpan di database dan tampil di studio buket.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitForm} className="space-y-4">
              {/* Category Selection */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Kategori Komponen Buket <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => {
                    const cat = e.target.value as CustomStudioCategory;
                    setFormData((prev) => ({
                      ...prev,
                      category: cat,
                      emoji_or_icon: prev.emoji_or_icon || CATEGORY_CONFIG[cat].icon,
                    }));
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-stone-50 font-semibold"
                >
                  {(Object.keys(CATEGORY_CONFIG) as CustomStudioCategory[]).map((cat) => (
                    <option key={cat} value={cat}>
                      {CATEGORY_CONFIG[cat].icon} {CATEGORY_CONFIG[cat].label} ({cat})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-stone-400 mt-1">
                  {CATEGORY_CONFIG[formData.category].description}
                </p>
              </div>

              {/* Name & ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Nama Opsi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Mawar Merah Velvet"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    ID Kode Unik (Opsional)
                  </label>
                  <input
                    type="text"
                    disabled={Boolean(editingItem)}
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    placeholder="Auto-generate jika kosong"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-mono disabled:bg-stone-100 text-stone-600"
                  />
                </div>
              </div>

              {/* Price Modifier & Sort Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Harga Tambahan / Base (Rp)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={formData.price_modifier}
                    onChange={(e) => setFormData({ ...formData, price_modifier: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-mono"
                  />
                  <p className="text-[10px] text-stone-400 mt-1">
                    Isi 0 jika sudah termasuk paket gratis (Rp 0).
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Nomor Urut Tampilan (Sort Order)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-mono"
                  />
                </div>
              </div>

              {/* Emoji or Icon Picker */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-stone-700">
                    Emoji / Ikon Representasi
                  </label>
                  <span className="text-[10px] text-stone-400">Pilih cepat atau ketik simbol</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={formData.emoji_or_icon}
                    onChange={(e) => setFormData({ ...formData, emoji_or_icon: e.target.value })}
                    placeholder="Contoh: 🌷 atau 🎀"
                    className="w-24 text-center px-3 py-2 text-base rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                  <div className="flex-1 flex flex-wrap gap-1 bg-stone-50 p-2 rounded-xl border border-stone-200/80 max-h-24 overflow-y-auto">
                    {EMOJI_PALETTE.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setFormData({ ...formData, emoji_or_icon: emoji })}
                        className={`w-7 h-7 text-sm rounded-lg hover:bg-white hover:shadow-xs transition-all flex items-center justify-center cursor-pointer ${
                          formData.emoji_or_icon === emoji ? 'bg-rose-100 ring-1 ring-rose-400' : ''
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hex Color Picker (especially for CHENILLE_COLOR) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-stone-700">
                    Hex Color Code (Pilihan Warna)
                  </label>
                  <span className="text-[10px] text-stone-400">Untuk warna kawat bulu atau aksen</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="color"
                    value={formData.hex_color || '#F4A7B9'}
                    onChange={(e) => setFormData({ ...formData, hex_color: e.target.value })}
                    className="w-10 h-10 rounded-xl border border-stone-200 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={formData.hex_color}
                    onChange={(e) => setFormData({ ...formData, hex_color: e.target.value })}
                    placeholder="#F4A7B9"
                    className="w-28 px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-mono"
                  />
                  <div className="flex-1 flex flex-wrap gap-1 bg-stone-50 p-2 rounded-xl border border-stone-200/80">
                    {PRESET_COLORS.map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => setFormData({ ...formData, hex_color: hex })}
                        style={{ backgroundColor: hex }}
                        className={`w-6 h-6 rounded-lg border border-stone-300 shadow-2xs hover:scale-110 transition-transform cursor-pointer ${
                          formData.hex_color === hex ? 'ring-2 ring-rose-600' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Deskripsi / Keterangan Tampilan
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Keterangan singkat yang tampil saat pelanggan memilih opsi ini..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              {/* Active Switch */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200">
                <div>
                  <div className="text-xs font-bold text-stone-800">Status Aktif di Toko</div>
                  <div className="text-[10px] text-stone-500">
                    Jika aktif, opsi akan langsung muncul di halaman custom builder.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    formData.is_active ? 'bg-emerald-500' : 'bg-stone-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      formData.is_active ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Live Card Preview */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-50/50 to-pink-50/50 border border-rose-100 space-y-1.5">
                <div className="text-[10px] font-black uppercase tracking-wider text-rose-600 flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>Preview Tampilan di Studio Pelanggan:</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-rose-200/70 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {formData.hex_color && (
                      <div
                        className="w-6 h-6 rounded-lg border border-stone-200 shadow-2xs"
                        style={{ backgroundColor: formData.hex_color }}
                      />
                    )}
                    {formData.emoji_or_icon && (
                      <span className="text-lg">{formData.emoji_or_icon}</span>
                    )}
                    <div>
                      <div className="text-xs font-bold text-stone-800">
                        {formData.name || 'Nama Opsi'}
                      </div>
                      <div className="text-[10px] text-stone-500">
                        {formData.description || 'Deskripsi opsi...'}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-black text-rose-600">
                    {formData.price_modifier > 0
                      ? `+Rp ${formData.price_modifier.toLocaleString('id-ID')}`
                      : 'Gratis'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 text-xs font-bold hover:bg-stone-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-500 text-white text-xs font-black shadow-md shadow-rose-600/20 hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center gap-1.5"
                >
                  {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingItem ? 'Simpan Perubahan' : 'Tambahkan Opsi'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-2xl mx-auto">
              ⚠️
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-stone-800">
                Hapus Opsi &quot;{deleteConfirmItem.name}&quot;?
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Tindakan ini akan menghapus opsi secara permanen dari database. Jika opsi pernah digunakan dalam
                desain pelanggan tersimpan, sistem akan memblokir penghapusan dan menyarankan untuk
                menonaktifkannya saja.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmItem(null)}
                className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 text-xs font-bold hover:bg-stone-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-black shadow-md shadow-red-600/20 hover:bg-red-700 transition-colors flex items-center gap-1.5"
              >
                {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Ya, Hapus Opsi</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
