'use client';

import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Plus,
  Trash2,
  Sparkles,
  DollarSign,
  Percent,
  ArrowRight,
  AlertTriangle,
  Layers,
  Archive,
  CheckCircle2,
  FileSpreadsheet,
  ShieldAlert,
  Lock,
} from 'lucide-react';
import { MOCK_PRODUCTS } from '@chenille/shared';
import { useSettingsStore, type WasteMaterialItem } from '@/stores/useSettingsStore';
import { showMagicToast } from '@/lib/magic-motion';
import { TableSortHeader, type SortDirection } from './TableSortHeader';

interface BomRow {
  id: string;
  material: string;
  qty: number;
  unit: string;
  pricePerUnit: number;
}

// Default recipes for bouquets
const PRODUCT_RECIPES: Record<string, BomRow[]> = {
  'prod-01': [
    { id: '1', material: 'Batang Kawat Bulu Burgundy (6mm)', qty: 36, unit: 'Batang', pricePerUnit: 350 },
    { id: '2', material: 'Batang Kawat Bulu Hijau Zaitun (6mm)', qty: 12, unit: 'Batang', pricePerUnit: 350 },
    { id: '3', material: 'Kawat Batang Penyangga Hijau No. 18', qty: 12, unit: 'Batang', pricePerUnit: 500 },
    { id: '4', material: 'Cellophane Korean Matte Maroon Gold', qty: 2, unit: 'Lembar', pricePerUnit: 4500 },
    { id: '5', material: 'Pita Satin Burgundy Mewah 2.5cm', qty: 1.5, unit: 'Meter', pricePerUnit: 2200 },
    { id: '6', material: 'Boneka Wisuda Ber-toga 10cm', qty: 1, unit: 'Pcs', pricePerUnit: 7400 },
  ],
  'prod-02': [
    { id: '1', material: 'Batang Kawat Bulu Pastel Pink (6mm)', qty: 28, unit: 'Batang', pricePerUnit: 350 },
    { id: '2', material: 'Batang Kawat Bulu Pastel Lilac (6mm)', qty: 16, unit: 'Batang', pricePerUnit: 350 },
    { id: '3', material: 'Kawat Batang Penyangga Hijau No. 18', qty: 10, unit: 'Batang', pricePerUnit: 500 },
    { id: '4', material: 'Cellophane Korean Pastel Frosted', qty: 2, unit: 'Lembar', pricePerUnit: 4500 },
    { id: '5', material: 'Pita Organza Korea Glossy', qty: 2, unit: 'Meter', pricePerUnit: 2500 },
  ],
  'prod-03': [
    { id: '1', material: 'Batang Kawat Bulu Kuning Sunflower (6mm)', qty: 32, unit: 'Batang', pricePerUnit: 350 },
    { id: '2', material: 'Batang Kawat Bulu Cokelat Pusat (6mm)', qty: 14, unit: 'Batang', pricePerUnit: 350 },
    { id: '3', material: 'Kawat Batang Penyangga Hijau No. 18', qty: 10, unit: 'Batang', pricePerUnit: 500 },
    { id: '4', material: 'Cellophane Kraft Yellow Gold', qty: 2, unit: 'Lembar', pricePerUnit: 4500 },
    { id: '5', material: 'Pita Satin Gold Premium', qty: 1.5, unit: 'Meter', pricePerUnit: 2200 },
  ],
};

export const BOMCalculatorModal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'RECIPES' | 'WASTE_LOSS'>('RECIPES');

  // Recipe Calculator State
  const [selectedProductId, setSelectedProductId] = useState<string>('prod-01');
  const [rows, setRows] = useState<BomRow[]>(PRODUCT_RECIPES['prod-01'] || []);
  const [sellingPrice, setSellingPrice] = useState(119000);

  // Waste / Scrap Store State
  const { wasteMaterials, addWasteMaterial, removeWasteMaterial, getTotalWasteLoss } = useSettingsStore();

  // Form for New Waste Material
  const [wasteName, setWasteName] = useState('');
  const [wasteCategory, setWasteCategory] = useState<WasteMaterialItem['category']>('KAWAT_BULU');
  const [wasteQty, setWasteQty] = useState('10');
  const [wasteUnit, setWasteUnit] = useState('Batang');
  const [wasteCost, setWasteCost] = useState('350');
  const [wasteReason, setWasteReason] = useState<WasteMaterialItem['reason']>('LEMBAP_BERKARAT');
  const [wasteMitigation, setWasteMitigation] = useState('');

  type BomSortField = 'material' | 'qty' | 'unit' | 'pricePerUnit' | 'subtotal';
  const [bomSortField, setBomSortField] = useState<BomSortField | null>(null);
  const [bomSortDirection, setBomSortDirection] = useState<SortDirection>(null);

  const handleBomSort = (field: BomSortField) => {
    if (bomSortField === field) {
      if (bomSortDirection === 'asc') setBomSortDirection('desc');
      else if (bomSortDirection === 'desc') {
        setBomSortField(null);
        setBomSortDirection(null);
      }
    } else {
      setBomSortField(field);
      setBomSortDirection('asc');
    }
  };

  const sortedRows = useMemo(() => {
    if (!bomSortField || !bomSortDirection) return rows;
    return [...rows].sort((a, b) => {
      let valA: any = a[bomSortField as keyof BomRow];
      let valB: any = b[bomSortField as keyof BomRow];

      if (bomSortField === 'subtotal') {
        valA = a.qty * a.pricePerUnit;
        valB = b.qty * b.pricePerUnit;
      }

      if (typeof valA === 'string' && typeof valB === 'string') {
        const c = valA.localeCompare(valB, 'id');
        return bomSortDirection === 'asc' ? c : -c;
      }
      return bomSortDirection === 'asc' ? valA - valB : valB - valA;
    });
  }, [rows, bomSortField, bomSortDirection]);

  type WasteSortField = 'materialName' | 'category' | 'qty' | 'reason' | 'totalLoss';
  const [wasteSortField, setWasteSortField] = useState<WasteSortField | null>(null);
  const [wasteSortDirection, setWasteSortDirection] = useState<SortDirection>(null);

  const handleWasteSort = (field: WasteSortField) => {
    if (wasteSortField === field) {
      if (wasteSortDirection === 'asc') setWasteSortDirection('desc');
      else if (wasteSortDirection === 'desc') {
        setWasteSortField(null);
        setWasteSortDirection(null);
      }
    } else {
      setWasteSortField(field);
      setWasteSortDirection('asc');
    }
  };

  const sortedWasteMaterials = useMemo(() => {
    if (!wasteSortField || !wasteSortDirection) return wasteMaterials;
    return [...wasteMaterials].sort((a, b) => {
      let valA: any = a[wasteSortField as keyof WasteMaterialItem];
      let valB: any = b[wasteSortField as keyof WasteMaterialItem];

      if (typeof valA === 'string' && typeof valB === 'string') {
        const c = valA.localeCompare(valB, 'id');
        return wasteSortDirection === 'asc' ? c : -c;
      }
      return wasteSortDirection === 'asc' ? valA - valB : valB - valA;
    });
  }, [wasteMaterials, wasteSortField, wasteSortDirection]);

  const totalHpp = rows.reduce((sum, r) => sum + r.qty * r.pricePerUnit, 0);
  const grossProfit = sellingPrice - totalHpp;
  const marginPercent = sellingPrice > 0 ? Math.round((grossProfit / sellingPrice) * 100) : 0;
  const isPriceBelowHpp = sellingPrice < totalHpp;

  // Handle Changing Product in Recipe
  const handleSelectProduct = (prodId: string) => {
    setSelectedProductId(prodId);
    const recipe = PRODUCT_RECIPES[prodId] || [
      { id: '1', material: 'Batang Kawat Bulu Utama', qty: 25, unit: 'Batang', pricePerUnit: 350 },
      { id: '2', material: 'Cellophane Korean Matte', qty: 2, unit: 'Lembar', pricePerUnit: 4500 },
      { id: '3', material: 'Pita Satin Mewah', qty: 1.5, unit: 'Meter', pricePerUnit: 2200 },
    ];
    setRows(recipe);
    const prod = MOCK_PRODUCTS.find((p) => p.id === prodId);
    if (prod) {
      setSellingPrice(prod.discountPrice ?? prod.price);
    }
  };

  const handleAddRow = () => {
    const newRow: BomRow = {
      id: `m-${Date.now()}`,
      material: 'Bahan Tambahan Kawat Bulu',
      qty: 1,
      unit: 'Pcs',
      pricePerUnit: 1000,
    };
    setRows([...rows, newRow]);
  };

  const handleRemoveRow = (id: string) => {
    setRows(rows.filter((r) => r.id !== id));
  };

  const handleUpdateRow = (id: string, field: keyof BomRow, value: any) => {
    setRows(
      rows.map((r) => {
        if (r.id === id) {
          return { ...r, [field]: value };
        }
        return r;
      })
    );
  };

  const handleAddWasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wasteName.trim()) return;

    addWasteMaterial({
      materialName: wasteName.trim(),
      category: wasteCategory,
      qty: parseFloat(wasteQty) || 1,
      unit: wasteUnit.trim() || 'Pcs',
      costPerUnit: parseFloat(wasteCost) || 0,
      reason: wasteReason,
      mitigationAction: wasteMitigation.trim() || undefined,
    });

    setWasteName('');
    setWasteQty('10');
    setWasteCost('350');
    setWasteMitigation('');
    showMagicToast('Bahan Rusak Dicatat ⚠️', 'Laporan kerugian bahan baku berhasil diperbarui untuk evaluasi finansial.', '📋');
  };

  const totalWasteLoss = getTotalWasteLoss();

  return (
    <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-sm space-y-6 mb-8 admin-view-fade">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-sm">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-stone-800 tracking-tight">
              Manajemen Bahan Baku, Resep BOM & Evaluasi Kerugian
            </h2>
            <p className="text-xs text-stone-500">
              Rincian bahan untuk 1 produk, validasi harga terhadap HPP, serta pencatatan bahan rusak/afkir gudang.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-stone-100 rounded-2xl border border-stone-200 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('RECIPES')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'RECIPES'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Resep BOM Produk</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('WASTE_LOSS')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'WASTE_LOSS'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Bahan Rusak / Afkir ({wasteMaterials.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: RESEP BOM PRODUK & STRICT VALIDASI HARGA */}
      {/* ========================================================================= */}
      {activeTab === 'RECIPES' && (
        <div className="space-y-6">
          {/* Product Selector Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-stone-700">Pilih Produk Buket untuk Resep BOM:</span>
              <select
                value={selectedProductId}
                onChange={(e) => handleSelectProduct(e.target.value)}
                className="text-xs font-bold p-2 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-stone-800"
              >
                {MOCK_PRODUCTS.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.name} (Harga: Rp {(prod.discountPrice ?? prod.price).toLocaleString('id-ID')})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAddRow}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Bahan Baku</span>
            </button>
          </div>

          {/* Validation Banner if Selling Price < HPP */}
          {isPriceBelowHpp && (
            <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl flex items-start gap-3 animate-in fade-in">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-black text-rose-800 uppercase tracking-wider">
                  ⚠️ Peringatan Validasi Margin: Harga Jual Kurang Dari HPP!
                </div>
                <p className="text-xs text-rose-700 mt-0.5">
                  Harga jual buket (Rp {sellingPrice.toLocaleString('id-ID')}) lebih rendah dari total biaya bahan baku
                  (Rp {totalHpp.toLocaleString('id-ID')}). Atelier akan merugi{' '}
                  <strong>Rp {(totalHpp - sellingPrice).toLocaleString('id-ID')}</strong> per buket yang dibuat. Harap
                  naikkan harga jual di atas HPP!
                </p>
              </div>
            </div>
          )}

          {/* Materials Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50 text-stone-700 font-extrabold uppercase text-[10px] tracking-wider border-b border-stone-200">
                <tr>
                  <TableSortHeader
                    label="Nama Bahan Baku"
                    field="material"
                    currentField={bomSortField}
                    direction={bomSortDirection}
                    onSort={(f) => handleBomSort(f as BomSortField)}
                  />
                  <TableSortHeader
                    label="Jumlah"
                    field="qty"
                    currentField={bomSortField}
                    direction={bomSortDirection}
                    onSort={(f) => handleBomSort(f as BomSortField)}
                    className="w-24"
                  />
                  <TableSortHeader
                    label="Satuan"
                    field="unit"
                    currentField={bomSortField}
                    direction={bomSortDirection}
                    onSort={(f) => handleBomSort(f as BomSortField)}
                    className="w-24"
                  />
                  <TableSortHeader
                    label="Harga Satuan (Terkunci)"
                    field="pricePerUnit"
                    currentField={bomSortField}
                    direction={bomSortDirection}
                    onSort={(f) => handleBomSort(f as BomSortField)}
                    className="w-36"
                  />
                  <TableSortHeader
                    label="Subtotal HPP"
                    field="subtotal"
                    currentField={bomSortField}
                    direction={bomSortDirection}
                    onSort={(f) => handleBomSort(f as BomSortField)}
                    className="w-32"
                  />
                  <th className="py-3 px-2 text-center w-12">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {sortedRows.map((row) => {
                  const subtotal = row.qty * row.pricePerUnit;
                  return (
                    <tr key={row.id} className="hover:bg-rose-50/20">
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={row.material}
                          onChange={(e) => handleUpdateRow(row.id, 'material', e.target.value)}
                          className="w-full text-xs font-semibold bg-transparent border-b border-transparent focus:border-rose-400 focus:outline-none"
                        />
                      </td>
                      <td className="py-2.5 px-3">
                        <input
                          type="number"
                          value={row.qty}
                          onChange={(e) => handleUpdateRow(row.id, 'qty', parseFloat(e.target.value) || 0)}
                          className="w-20 text-xs font-bold p-1 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-stone-500 font-medium">{row.unit}</td>
                      <td className="py-2.5 px-3">
                        <div
                          className="flex items-center gap-1.5 font-bold text-stone-600 bg-stone-100/80 px-2 py-1 rounded-lg border border-stone-200 w-fit cursor-not-allowed select-none"
                          title="Harga satuan di-set di data master Bahan Baku (Read-only)"
                        >
                          <Lock className="w-3 h-3 text-stone-400 shrink-0" />
                          <span className="text-stone-400 text-[10px]">Rp</span>
                          <span className="text-xs font-mono font-bold text-stone-700">
                            {row.pricePerUnit.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-black text-rose-600">
                        Rp {subtotal.toLocaleString('id-ID')}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <button
                          onClick={() => handleRemoveRow(row.id)}
                          className="text-stone-400 hover:text-rose-600 p-1 rounded-md cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Financial Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-5 rounded-3xl bg-stone-50 border border-stone-200">
            <div>
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                Total Biaya Pokok (HPP)
              </span>
              <div className="text-xl font-black text-rose-600 mt-1">
                Rp {totalHpp.toLocaleString('id-ID')}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                Harga Jual Buket (Validasi)
              </span>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs font-bold text-stone-500">Rp</span>
                <input
                  type="number"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                  className={`w-28 text-base font-black p-1 bg-white border rounded-lg focus:outline-none focus:ring-1 ${
                    isPriceBelowHpp
                      ? 'border-rose-500 text-rose-600 focus:ring-rose-500'
                      : 'border-stone-300 text-stone-800 focus:ring-rose-500'
                  }`}
                />
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                Laba Kotor Per Buket
              </span>
              <div
                className={`text-xl font-black mt-1 ${
                  grossProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {grossProfit >= 0 ? `Rp ${grossProfit.toLocaleString('id-ID')}` : `-Rp ${Math.abs(grossProfit).toLocaleString('id-ID')}`}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                Margin Keuntungan
              </span>
              <div
                className={`text-xl font-black mt-1 ${
                  marginPercent >= 0 ? 'text-purple-600' : 'text-rose-600'
                }`}
              >
                {marginPercent}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: BAHAN BAKU RUSAK / AFKIR (WASTE LOSS MANAGEMENT) */}
      {/* ========================================================================= */}
      {activeTab === 'WASTE_LOSS' && (
        <div className="space-y-6">
          {/* Top Waste Metrics Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl">
              <span className="text-[10px] font-black uppercase text-rose-600 tracking-wider block">
                Total Kerugian Bahan Rusak
              </span>
              <div className="text-xl font-black text-rose-700 mt-1">
                Rp {totalWasteLoss.toLocaleString('id-ID')}
              </div>
              <span className="text-[10px] text-rose-600 mt-0.5 block">
                Mengurangi margin laba kotor atelier
              </span>
            </div>

            <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl">
              <span className="text-[10px] font-black uppercase text-stone-500 tracking-wider block">
                Total Batch Teridentifikasi
              </span>
              <div className="text-xl font-black text-stone-800 mt-1">
                {wasteMaterials.length} Batch Bahan
              </div>
              <span className="text-[10px] text-stone-500 mt-0.5 block">
                Kawat bulu, cellophane & aksesoris
              </span>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider block">
                Status Evaluasi Spoilage
              </span>
              <div className="text-sm font-black text-emerald-800 mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{totalWasteLoss > 100000 ? 'Perlu Mitigasi Gudang' : 'Toleransi Terkendali'}</span>
              </div>
              <span className="text-[10px] text-emerald-700 mt-0.5 block">
                Di bawah batas toleransi scrap 3%
              </span>
            </div>
          </div>

          {/* Form to Log New Damaged Material */}
          <form
            onSubmit={handleAddWasteSubmit}
            className="p-4 sm:p-5 bg-stone-50/70 rounded-2xl border border-stone-200 space-y-3"
          >
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span className="text-xs font-black uppercase text-stone-800 tracking-wider">
                Catat Bahan Baku Rusak / Tidak Layak Pakai Baru:
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">
                  Nama Bahan Baku <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={wasteName}
                  onChange={(e) => setWasteName(e.target.value)}
                  placeholder="Contoh: Kawat Bulu Pastel Putih (Karat)"
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">Kategori</label>
                <select
                  value={wasteCategory}
                  onChange={(e) => setWasteCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="KAWAT_BULU">Kawat Bulu (Chenille)</option>
                  <option value="CELLOPHANE">Kertas Cellophane</option>
                  <option value="PITA">Pita Satin / Organza</option>
                  <option value="ACCESSORY">Aksesoris / Boneka / Lampu</option>
                  <option value="FLORAL_FOAM">Floral Foam / Oasis</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">
                  Penyebab Kerusakan / Afkir
                </label>
                <select
                  value={wasteReason}
                  onChange={(e) => setWasteReason(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="LEMBAP_BERKARAT">Lembap Udara & Kawat Berkarat</option>
                  <option value="KERTAS_LECEK_ROBEK">Kertas Cellophane Lecek / Robek</option>
                  <option value="CACAT_PRODUKSI">Cacat Pabrik Distributor</option>
                  <option value="KADALUARSA_SIMPAN">Terlalu Lama Simpan / Berdebu</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">Jumlah Rusak</label>
                <input
                  type="number"
                  required
                  value={wasteQty}
                  onChange={(e) => setWasteQty(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">Satuan</label>
                <input
                  type="text"
                  value={wasteUnit}
                  onChange={(e) => setWasteUnit(e.target.value)}
                  placeholder="Batang / Lembar / Pcs"
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">
                  Biaya Beli Satuan (Rp)
                </label>
                <input
                  type="number"
                  required
                  value={wasteCost}
                  onChange={(e) => setWasteCost(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer"
                >
                  + Simpan ke Laporan
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-700 block mb-1">
                Tindakan Evaluasi / Mitigasi Pencegahan:
              </label>
              <input
                type="text"
                value={wasteMitigation}
                onChange={(e) => setWasteMitigation(e.target.value)}
                placeholder="Contoh: Pindahkan ke container kedap udara ber-silika gel"
                className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </form>

          {/* Damaged Materials Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50 text-stone-700 font-extrabold uppercase text-[10px] tracking-wider border-b border-stone-200">
                <tr>
                  <TableSortHeader
                    label="Bahan Baku Rusak"
                    field="materialName"
                    currentField={wasteSortField}
                    direction={wasteSortDirection}
                    onSort={(f) => handleWasteSort(f as WasteSortField)}
                  />
                  <TableSortHeader
                    label="Kategori"
                    field="category"
                    currentField={wasteSortField}
                    direction={wasteSortDirection}
                    onSort={(f) => handleWasteSort(f as WasteSortField)}
                  />
                  <TableSortHeader
                    label="Qty & Unit"
                    field="qty"
                    currentField={wasteSortField}
                    direction={wasteSortDirection}
                    onSort={(f) => handleWasteSort(f as WasteSortField)}
                  />
                  <TableSortHeader
                    label="Penyebab Kerusakan"
                    field="reason"
                    currentField={wasteSortField}
                    direction={wasteSortDirection}
                    onSort={(f) => handleWasteSort(f as WasteSortField)}
                  />
                  <th className="py-3 px-3">Tindakan Mitigasi</th>
                  <TableSortHeader
                    label="Total Rugi"
                    field="totalLoss"
                    currentField={wasteSortField}
                    direction={wasteSortDirection}
                    onSort={(f) => handleWasteSort(f as WasteSortField)}
                  />
                  <th className="py-3 px-2 text-center w-12">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {sortedWasteMaterials.map((item) => {
                  const reasonLabel: Record<string, string> = {
                    LEMBAP_BERKARAT: 'Lembap & Berkarat',
                    KERTAS_LECEK_ROBEK: 'Kertas Lecek/Robek',
                    CACAT_PRODUKSI: 'Cacat Pabrik',
                    KADALUARSA_SIMPAN: 'Lama Simpan',
                  };

                  return (
                    <tr key={item.id} className="hover:bg-rose-50/20">
                      <td className="py-3 px-3 font-bold text-stone-800">{item.materialName}</td>
                      <td className="py-3 px-3">
                        <span className="bg-stone-100 text-stone-700 font-semibold px-2 py-0.5 rounded-full text-[10px]">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-stone-700">
                        {item.qty} {item.unit}
                      </td>
                      <td className="py-3 px-3">
                        <span className="bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-full text-[10px]">
                          {reasonLabel[item.reason] || item.reason}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-stone-500 max-w-xs text-[11px]">
                        {item.mitigationAction || '-'}
                      </td>
                      <td className="py-3 px-3 font-black text-rose-600">
                        Rp {item.totalLoss.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <button
                          onClick={() => {
                            removeWasteMaterial(item.id);
                            showMagicToast('Dihapus 🗑️', 'Item bahan rusak dikeluarkan dari pembukuan.', '🗑️');
                          }}
                          className="text-stone-400 hover:text-rose-600 p-1 rounded-md cursor-pointer"
                          title="Hapus baris"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
