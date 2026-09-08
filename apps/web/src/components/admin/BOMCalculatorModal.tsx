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
  Package,
  Truck,
  ExternalLink,
  Phone,
  Store,
  Clock,
  Check,
  Search,
  X,
  Edit2,
  Calendar,
  PackageCheck,
  AlertCircle,
  TrendingDown,
  ShoppingBag,
} from 'lucide-react';
import { MOCK_PRODUCTS } from '@chenille/shared';
import {
  useSettingsStore,
  type WasteMaterialItem,
  type RawMaterial,
  type ProcurementOrder,
} from '@/stores/useSettingsStore';
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

const COMMON_UNITS = ['Batang', 'Lembar', 'Meter', 'Pcs', 'Roll', 'Pack', 'Box', 'Bungkus'];

export const BOMCalculatorModal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'RAW_MATERIALS' | 'PROCUREMENT' | 'RECIPES' | 'WASTE_LOSS'>('RAW_MATERIALS');

  // Store hooks
  const {
    rawMaterials,
    addRawMaterial,
    updateRawMaterial,
    deleteRawMaterial,
    procurementOrders,
    addProcurementOrder,
    updateProcurementOrderStatus,
    deleteProcurementOrder,
    wasteMaterials,
    addWasteMaterial,
    removeWasteMaterial,
    getTotalWasteLoss,
  } = useSettingsStore();

  // ==========================================
  // TAB 1: RESEP BOM PRODUK & HPP
  // ==========================================
  const [selectedProductId, setSelectedProductId] = useState<string>('prod-01');
  const [rows, setRows] = useState<BomRow[]>(PRODUCT_RECIPES['prod-01'] || []);
  const [sellingPrice, setSellingPrice] = useState(119000);

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

  const totalHpp = rows.reduce((sum, r) => sum + r.qty * r.pricePerUnit, 0);
  const grossProfit = sellingPrice - totalHpp;
  const marginPercent = sellingPrice > 0 ? Math.round((grossProfit / sellingPrice) * 100) : 0;
  const isPriceBelowHpp = sellingPrice < totalHpp;

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

  const handlePickFromRawMaterials = (rowId: string, matId: string) => {
    const mat = rawMaterials.find((m) => m.id === matId);
    if (mat) {
      setRows(
        rows.map((r) =>
          r.id === rowId
            ? {
                ...r,
                material: mat.name,
                unit: mat.unit,
                pricePerUnit: mat.costPerUnit,
              }
            : r
        )
      );
    }
  };

  // ==========================================
  // TAB 2: MASTER BAHAN BAKU MENTAH & SUPPLIER
  // ==========================================
  const [matSearch, setMatSearch] = useState('');
  const [matCatFilter, setMatCatFilter] = useState('ALL');
  const [isAddMatModalOpen, setIsAddMatModalOpen] = useState(false);

  // New Raw Material Form State
  const [newMatName, setNewMatName] = useState('');
  const [newMatCategory, setNewMatCategory] = useState<RawMaterial['category']>('KAWAT_BULU');
  const [newMatStock, setNewMatStock] = useState('100');
  const [newMatMinStock, setNewMatMinStock] = useState('50');
  const [newMatUnit, setNewMatUnit] = useState('Batang');
  const [newMatCost, setNewMatCost] = useState('350');
  const [newMatSupplierName, setNewMatSupplierName] = useState('');
  const [newMatSupplierContact, setNewMatSupplierContact] = useState('');
  const [newMatSupplierLink, setNewMatSupplierLink] = useState('');
  const [newMatNotes, setNewMatNotes] = useState('');

  type MatSortField = 'name' | 'category' | 'stock' | 'unit' | 'costPerUnit' | 'supplierName';
  const [matSortField, setMatSortField] = useState<MatSortField | null>('name');
  const [matSortDirection, setMatSortDirection] = useState<SortDirection>('asc');

  const handleMatSort = (field: MatSortField) => {
    if (matSortField === field) {
      if (matSortDirection === 'asc') setMatSortDirection('desc');
      else if (matSortDirection === 'desc') {
        setMatSortField(null);
        setMatSortDirection(null);
      }
    } else {
      setMatSortField(field);
      setMatSortDirection('asc');
    }
  };

  const filteredRawMaterials = useMemo(() => {
    return rawMaterials.filter((m) => {
      const matchCat = matCatFilter === 'ALL' || m.category === matCatFilter;
      const matchSearch =
        m.name.toLowerCase().includes(matSearch.toLowerCase()) ||
        m.supplierName.toLowerCase().includes(matSearch.toLowerCase()) ||
        m.category.toLowerCase().includes(matSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [rawMaterials, matCatFilter, matSearch]);

  const sortedRawMaterials = useMemo(() => {
    if (!matSortField || !matSortDirection) return filteredRawMaterials;
    return [...filteredRawMaterials].sort((a, b) => {
      let valA: any = a[matSortField];
      let valB: any = b[matSortField];

      if (typeof valA === 'string' && typeof valB === 'string') {
        const c = valA.localeCompare(valB, 'id');
        return matSortDirection === 'asc' ? c : -c;
      }
      return matSortDirection === 'asc' ? valA - valB : valB - valA;
    });
  }, [filteredRawMaterials, matSortField, matSortDirection]);

  const handleAddRawMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatName.trim()) return;

    addRawMaterial({
      name: newMatName.trim(),
      category: newMatCategory,
      stock: parseFloat(newMatStock) || 0,
      minStock: parseFloat(newMatMinStock) || 10,
      unit: newMatUnit.trim() || 'Pcs',
      costPerUnit: parseFloat(newMatCost) || 0,
      supplierName: newMatSupplierName.trim() || 'Supplier Grosir',
      supplierContact: newMatSupplierContact.trim(),
      supplierLink: newMatSupplierLink.trim() || undefined,
      notes: newMatNotes.trim() || undefined,
    });

    // Reset Form
    setNewMatName('');
    setNewMatStock('100');
    setNewMatMinStock('50');
    setNewMatCost('350');
    setNewMatSupplierName('');
    setNewMatSupplierContact('');
    setNewMatSupplierLink('');
    setNewMatNotes('');
    setIsAddMatModalOpen(false);

    showMagicToast('Bahan Baku Tersimpan 🎉', 'Bahan baku mentah baru berhasil didaftarkan ke inventori studio.', '🌸');
  };

  // ==========================================
  // TAB 3: PEMESANAN RESTOCK & WAKTU TIBA (ETA)
  // ==========================================
  const [isAddPoModalOpen, setIsAddPoModalOpen] = useState(false);
  const [poSelectedMatId, setPoSelectedMatId] = useState('');
  const [poMaterialName, setPoMaterialName] = useState('');
  const [poSupplierName, setPoSupplierName] = useState('');
  const [poSupplierContact, setPoSupplierContact] = useState('');
  const [poSupplierLink, setPoSupplierLink] = useState('');
  const [poQty, setPoQty] = useState('100');
  const [poUnit, setPoUnit] = useState('Batang');
  const [poCostPerUnit, setPoCostPerUnit] = useState('350');
  const [poEta, setPoEta] = useState(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [poTracking, setPoTracking] = useState('');
  const [poNotes, setPoNotes] = useState('');

  const handleSelectMaterialForPo = (matId: string) => {
    setPoSelectedMatId(matId);
    const mat = rawMaterials.find((m) => m.id === matId);
    if (mat) {
      setPoMaterialName(mat.name);
      setPoSupplierName(mat.supplierName);
      setPoSupplierContact(mat.supplierContact);
      setPoSupplierLink(mat.supplierLink || '');
      setPoUnit(mat.unit);
      setPoCostPerUnit(mat.costPerUnit.toString());
    }
  };

  const handleAddPoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!poMaterialName.trim()) return;

    const qty = parseFloat(poQty) || 1;
    const cost = parseFloat(poCostPerUnit) || 0;

    addProcurementOrder({
      materialId: poSelectedMatId || `custom-${Date.now()}`,
      materialName: poMaterialName.trim(),
      supplierName: poSupplierName.trim() || 'Supplier Online',
      supplierContact: poSupplierContact.trim() || undefined,
      supplierLink: poSupplierLink.trim() || undefined,
      orderDate: new Date().toISOString(),
      estimatedArrival: poEta,
      qtyOrdered: qty,
      unit: poUnit.trim() || 'Pcs',
      costPerUnit: cost,
      totalCost: qty * cost,
      status: 'ORDERED',
      trackingNumber: poTracking.trim() || undefined,
      notes: poNotes.trim() || undefined,
    });

    setIsAddPoModalOpen(false);
    showMagicToast('Pesanan Bahan Dibuat 📦', 'Estimasi waktu tiba dan rincian supplier telah dicatat.', '🚚');
  };

  const handleMarkAsArrived = (order: ProcurementOrder) => {
    updateProcurementOrderStatus(order.id, 'ARRIVED');
    showMagicToast(
      'Bahan Baku Telah Tiba! 🎉',
      `Stok ${order.materialName} otomatis bertambah +${order.qtyOrdered} ${order.unit} ke inventori.`,
      '📦'
    );
  };

  // ==========================================
  // TAB 4: BAHAN RUSAK / SPOILAGE
  // ==========================================
  const [wasteName, setWasteName] = useState('');
  const [wasteCategory, setWasteCategory] = useState<WasteMaterialItem['category']>('KAWAT_BULU');
  const [wasteQty, setWasteQty] = useState('10');
  const [wasteUnit, setWasteUnit] = useState('Batang');
  const [wasteCost, setWasteCost] = useState('350');
  const [wasteReason, setWasteReason] = useState<WasteMaterialItem['reason']>('LEMBAP_BERKARAT');
  const [wasteMitigation, setWasteMitigation] = useState('');

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
  const pendingOrdersCount = procurementOrders.filter((o) => o.status !== 'ARRIVED' && o.status !== 'CANCELLED').length;
  const totalInventoryValue = rawMaterials.reduce((sum, m) => sum + m.stock * m.costPerUnit, 0);
  const lowStockCount = rawMaterials.filter((m) => m.stock <= m.minStock).length;

  return (
    <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-sm space-y-6 mb-8 admin-view-fade">
      {/* Header & Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-rose-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-sm shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-stone-800 tracking-tight">
              Manajemen Bahan Baku, Pengadaan & Resep BOM
            </h2>
            <p className="text-xs text-stone-500">
              Katalog stok bahan mentah, pesanan restock supplier (ETA), resep BOM buket, dan audit bahan afkir.
            </p>
          </div>
        </div>

        {/* 4-Tab Switcher */}
        <div className="flex flex-wrap p-1 bg-stone-100 rounded-2xl border border-stone-200 self-start lg:self-auto gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('RAW_MATERIALS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'RAW_MATERIALS'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Stok Bahan Mentah ({rawMaterials.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('PROCUREMENT')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'PROCUREMENT'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Order Restock / ETA</span>
            {pendingOrdersCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('RECIPES')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'RECIPES'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Resep BOM Produk</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('WASTE_LOSS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'WASTE_LOSS'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Bahan Rusak ({wasteMaterials.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: MASTER BAHAN BAKU MENTAH & SUPPLIER */}
      {/* ========================================================================= */}
      {activeTab === 'RAW_MATERIALS' && (
        <div className="space-y-6">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl">
              <span className="text-[10px] font-black uppercase text-stone-500 tracking-wider block">
                Total Macam Bahan
              </span>
              <div className="text-xl font-black text-stone-800 mt-1">{rawMaterials.length} Jenis</div>
              <span className="text-[10px] text-stone-500 mt-0.5 block">Kawat, kertas, pita & boneka</span>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider block">
                Total Nilai Inventori
              </span>
              <div className="text-xl font-black text-emerald-800 mt-1 font-mono">
                Rp {totalInventoryValue.toLocaleString('id-ID')}
              </div>
              <span className="text-[10px] text-emerald-700 mt-0.5 block">Aset bahan baku di studio</span>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
              <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider block">
                Stok Perlu Restock
              </span>
              <div className="text-xl font-black text-amber-800 mt-1">{lowStockCount} Bahan</div>
              <span className="text-[10px] text-amber-700 mt-0.5 block">Mendekati batas minimum</span>
            </div>

            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl">
              <span className="text-[10px] font-black uppercase text-rose-700 tracking-wider block">
                Pesanan Berjalan (PO)
              </span>
              <div className="text-xl font-black text-rose-800 mt-1">{pendingOrdersCount} Pengiriman</div>
              <span className="text-[10px] text-rose-700 mt-0.5 block">Menunggu tiba di studio</span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-1 items-center gap-2 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={matSearch}
                  onChange={(e) => setMatSearch(e.target.value)}
                  placeholder="Cari nama bahan, kategori, atau nama toko supplier..."
                  className="w-full pl-10 pr-8 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white focus:border-rose-400 transition-all"
                />
                {matSearch && (
                  <button
                    onClick={() => setMatSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddMatModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tambah Bahan Baku Mentah</span>
              </button>
            </div>
          </div>

          {/* Raw Materials Table */}
          <div className="overflow-x-auto border border-stone-200 rounded-2xl">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50 text-stone-700 font-extrabold uppercase text-[10px] tracking-wider border-b border-stone-200">
                <tr>
                  <TableSortHeader
                    label="Nama Bahan Baku"
                    field="name"
                    currentField={matSortField}
                    direction={matSortDirection}
                    onSort={(f) => handleMatSort(f as MatSortField)}
                    className="min-w-[240px]"
                  />
                  <TableSortHeader
                    label="Kategori"
                    field="category"
                    currentField={matSortField}
                    direction={matSortDirection}
                    onSort={(f) => handleMatSort(f as MatSortField)}
                    className="min-w-[120px]"
                    align="center"
                  />
                  <TableSortHeader
                    label="Stok Saat Ini"
                    field="stock"
                    currentField={matSortField}
                    direction={matSortDirection}
                    onSort={(f) => handleMatSort(f as MatSortField)}
                    className="min-w-[120px]"
                    align="center"
                  />
                  <TableSortHeader
                    label="Satuan"
                    field="unit"
                    currentField={matSortField}
                    direction={matSortDirection}
                    onSort={(f) => handleMatSort(f as MatSortField)}
                    className="min-w-[90px]"
                    align="center"
                  />
                  <TableSortHeader
                    label="Harga Beli (Rp)"
                    field="costPerUnit"
                    currentField={matSortField}
                    direction={matSortDirection}
                    onSort={(f) => handleMatSort(f as MatSortField)}
                    className="min-w-[120px]"
                    align="right"
                  />
                  <th className="py-3.5 px-4 text-left min-w-[220px]">Supplier & Toko Beli</th>
                  <th className="py-3.5 px-4 text-center min-w-[140px]">Aksi / Restock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {sortedRawMaterials.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-stone-400">
                      Tidak ada bahan baku yang sesuai dengan filter.
                    </td>
                  </tr>
                ) : (
                  sortedRawMaterials.map((mat) => {
                    const isLow = mat.stock <= mat.minStock;
                    const isOut = mat.stock === 0;

                    return (
                      <tr key={mat.id} className="hover:bg-rose-50/20 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-stone-800">
                          <div className="font-extrabold text-stone-800">{mat.name}</div>
                          {mat.notes && <div className="text-[10px] text-stone-400 font-normal mt-0.5">{mat.notes}</div>}
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <span className="bg-stone-100 text-stone-700 font-bold px-2.5 py-1 rounded-full text-[10px] border border-stone-200">
                            {mat.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5 font-bold font-mono">
                            <span className="text-sm font-black text-stone-800">{mat.stock}</span>
                            <span className="text-[10px] text-stone-400 font-sans">{mat.unit}</span>
                          </div>
                          <div>
                            {isOut ? (
                              <span className="bg-rose-100 text-rose-700 font-black text-[9px] px-1.5 py-0.5 rounded-md">
                                HABIS
                              </span>
                            ) : isLow ? (
                              <span className="bg-amber-100 text-amber-800 font-black text-[9px] px-1.5 py-0.5 rounded-md">
                                MENIPIS (&le; {mat.minStock})
                              </span>
                            ) : (
                              <span className="bg-emerald-50 text-emerald-700 font-black text-[9px] px-1.5 py-0.5 rounded-md">
                                AMAN
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-stone-600 whitespace-nowrap">
                          {mat.unit}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-stone-700 whitespace-nowrap">
                          Rp {mat.costPerUnit.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-stone-800 text-xs leading-tight">
                            {mat.supplierName}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {mat.supplierContact && (
                              <a
                                href={`https://wa.me/${mat.supplierContact.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                                title="Hubungi via WhatsApp"
                              >
                                <Phone className="w-3 h-3" />
                                <span>{mat.supplierContact}</span>
                              </a>
                            )}
                            {mat.supplierLink && (
                              <a
                                href={mat.supplierLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:underline"
                                title="Buka Link Toko / E-Commerce"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Toko Online</span>
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                handleSelectMaterialForPo(mat.id);
                                setIsAddPoModalOpen(true);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-[11px] border border-rose-200 inline-flex items-center gap-1 transition-all cursor-pointer"
                              title="Pesan restock bahan ini"
                            >
                              <Truck className="w-3 h-3" />
                              <span>+ Pesan</span>
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Hapus ${mat.name} dari database bahan?`)) {
                                  deleteRawMaterial(mat.id);
                                  showMagicToast('Dihapus 🗑️', `${mat.name} dihapus dari inventori.`, '🗑️');
                                }
                              }}
                              className="p-1.5 text-stone-400 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
                              title="Hapus bahan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ORDER PEMESANAN BAHAN (PROCUREMENT & WAKTU TIBA / ETA) */}
      {/* ========================================================================= */}
      {activeTab === 'PROCUREMENT' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-200">
            <div>
              <div className="text-xs font-black uppercase text-stone-800 tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4 text-rose-600" />
                <span>Pelacakan Pesanan Restock Bahan Baku Mentah</span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Catat tanggal pesan, estimasi waktu tiba (ETA), nomor resi, dan otomatis tambah stok saat bahan tiba di studio.
              </p>
            </div>

            <button
              onClick={() => setIsAddPoModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>+ Pesan Bahan Baku Baru</span>
            </button>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto border border-stone-200 rounded-2xl">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50 text-stone-700 font-extrabold uppercase text-[10px] tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3.5 px-4">No. PO & Tanggal</th>
                  <th className="py-3.5 px-4">Bahan Dipesan</th>
                  <th className="py-3.5 px-4 text-center">Jumlah</th>
                  <th className="py-3.5 px-4 text-right">Total Biaya</th>
                  <th className="py-3.5 px-4">Supplier & Resi</th>
                  <th className="py-3.5 px-4 text-center">Estimasi Tiba (ETA)</th>
                  <th className="py-3.5 px-4 text-center">Status Pesanan</th>
                  <th className="py-3.5 px-4 text-center">Aksi Kedatangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {procurementOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-stone-400">
                      Belum ada riwayat pesanan restock bahan baku.
                    </td>
                  </tr>
                ) : (
                  procurementOrders.map((order) => {
                    const isArrived = order.status === 'ARRIVED';

                    return (
                      <tr key={order.id} className="hover:bg-rose-50/20 transition-colors">
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-mono font-bold text-stone-800">{order.id}</div>
                          <div className="text-[10px] text-stone-400">
                            {new Date(order.orderDate).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-stone-800">
                          {order.materialName}
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <span className="font-black text-sm text-stone-800 font-mono">
                            {order.qtyOrdered}
                          </span>{' '}
                          <span className="text-[10px] text-stone-500 font-sans">{order.unit}</span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-stone-800 whitespace-nowrap">
                          Rp {order.totalCost.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-stone-800">{order.supplierName}</div>
                          {order.trackingNumber && (
                            <div className="text-[10px] text-stone-500 font-mono flex items-center gap-1 mt-0.5">
                              <Truck className="w-3 h-3 text-stone-400" />
                              <span>{order.trackingNumber}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            {order.supplierContact && (
                              <a
                                href={`https://wa.me/${order.supplierContact.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:underline"
                              >
                                <Phone className="w-3 h-3" />
                                <span>WA Supplier</span>
                              </a>
                            )}
                            {order.supplierLink && (
                              <a
                                href={order.supplierLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Cek Toko</span>
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="inline-flex items-center gap-1 font-bold text-stone-800 text-xs bg-stone-100 px-2.5 py-1 rounded-xl">
                            <Clock className="w-3 h-3 text-stone-500" />
                            <span>
                              {order.estimatedArrival
                                ? new Date(order.estimatedArrival).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })
                                : '-'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          {isArrived ? (
                            <span className="bg-emerald-100 text-emerald-800 font-black px-2.5 py-1 rounded-full text-[10px] border border-emerald-200 flex items-center justify-center gap-1 w-fit mx-auto">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Tiba di Studio (Stok +)</span>
                            </span>
                          ) : order.status === 'SHIPPED' ? (
                            <span className="bg-blue-100 text-blue-800 font-black px-2.5 py-1 rounded-full text-[10px] border border-blue-200 flex items-center justify-center gap-1 w-fit mx-auto">
                              <Truck className="w-3 h-3" />
                              <span>Dalam Pengiriman</span>
                            </span>
                          ) : (
                            <span className="bg-amber-100 text-amber-800 font-black px-2.5 py-1 rounded-full text-[10px] border border-amber-200 flex items-center justify-center gap-1 w-fit mx-auto">
                              <Clock className="w-3 h-3" />
                              <span>Dipesan Online</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          {!isArrived ? (
                            <button
                              onClick={() => handleMarkAsArrived(order)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] shadow-sm shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-1"
                            >
                              <PackageCheck className="w-3.5 h-3.5" />
                              <span>Terima & Tambah Stok</span>
                            </button>
                          ) : (
                            <span className="text-[11px] font-bold text-emerald-600 flex items-center justify-center gap-1">
                              <Check className="w-3.5 h-3.5" />
                              <span>Selesai Masuk Gudang</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: RESEP BOM PRODUK & STRICT VALIDASI HARGA */}
      {/* ========================================================================= */}
      {activeTab === 'RECIPES' && (
        <div className="space-y-6">
          {/* Product Selector Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
            <div className="flex items-center gap-2 flex-wrap">
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
              <span>+ Tambah Bahan Baku</span>
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
          <div className="overflow-x-auto border border-stone-200 rounded-2xl">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50 text-stone-700 font-extrabold uppercase text-[10px] tracking-wider border-b border-stone-200">
                <tr>
                  <TableSortHeader
                    label="Nama Bahan Baku"
                    field="material"
                    currentField={bomSortField}
                    direction={bomSortDirection}
                    onSort={(f) => handleBomSort(f as BomSortField)}
                    className="min-w-[260px]"
                  />
                  <TableSortHeader
                    label="Jumlah"
                    field="qty"
                    currentField={bomSortField}
                    direction={bomSortDirection}
                    onSort={(f) => handleBomSort(f as BomSortField)}
                    className="min-w-[90px]"
                    align="center"
                  />
                  <TableSortHeader
                    label="Satuan"
                    field="unit"
                    currentField={bomSortField}
                    direction={bomSortDirection}
                    onSort={(f) => handleBomSort(f as BomSortField)}
                    className="min-w-[110px]"
                    align="center"
                  />
                  <TableSortHeader
                    label="Harga Satuan (Rp)"
                    field="pricePerUnit"
                    currentField={bomSortField}
                    direction={bomSortDirection}
                    onSort={(f) => handleBomSort(f as BomSortField)}
                    className="min-w-[130px]"
                    align="right"
                  />
                  <TableSortHeader
                    label="Subtotal HPP"
                    field="subtotal"
                    currentField={bomSortField}
                    direction={bomSortDirection}
                    onSort={(f) => handleBomSort(f as BomSortField)}
                    className="min-w-[120px]"
                    align="right"
                  />
                  <th className="py-3.5 px-4 text-center w-14">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {sortedRows.map((row) => {
                  const subtotal = row.qty * row.pricePerUnit;
                  return (
                    <tr key={row.id} className="hover:bg-rose-50/20">
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <input
                            type="text"
                            value={row.material}
                            onChange={(e) => handleUpdateRow(row.id, 'material', e.target.value)}
                            placeholder="Ketik nama bahan..."
                            className="w-full text-xs font-bold text-stone-800 bg-transparent border-b border-stone-200 focus:border-rose-400 focus:outline-none py-1"
                          />
                          {rawMaterials.length > 0 && (
                            <select
                              onChange={(e) => {
                                if (e.target.value) handlePickFromRawMaterials(row.id, e.target.value);
                              }}
                              defaultValue=""
                              className="text-[10px] text-stone-500 bg-stone-50 border border-stone-200 rounded px-1.5 py-0.5 focus:outline-none"
                            >
                              <option value="" disabled>
                                &bull; Pilih dari Stok Bahan Mentah...
                              </option>
                              {rawMaterials.map((m) => (
                                <option key={m.id} value={m.id}>
                                  {m.name} ({m.unit} @ Rp {m.costPerUnit.toLocaleString('id-ID')})
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <input
                          type="number"
                          step="any"
                          value={row.qty}
                          onChange={(e) => handleUpdateRow(row.id, 'qty', parseFloat(e.target.value) || 0)}
                          className="w-18 text-xs font-bold text-center p-1 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <input
                          type="text"
                          value={row.unit}
                          onChange={(e) => handleUpdateRow(row.id, 'unit', e.target.value)}
                          placeholder="Satuan"
                          className="w-20 text-xs font-bold text-center p-1 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                        />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1 bg-stone-50 border border-stone-200 rounded-lg p-1 w-28 focus-within:ring-1 focus-within:ring-rose-500">
                          <span className="text-[10px] text-stone-400 font-bold">Rp</span>
                          <input
                            type="number"
                            value={row.pricePerUnit}
                            onChange={(e) => handleUpdateRow(row.id, 'pricePerUnit', parseFloat(e.target.value) || 0)}
                            className="w-full text-xs font-mono font-bold text-stone-800 bg-transparent focus:outline-none text-right"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-black text-rose-600">
                        Rp {subtotal.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleRemoveRow(row.id)}
                          className="text-stone-400 hover:text-rose-600 p-1 rounded-md cursor-pointer transition-colors"
                          title="Hapus baris resep"
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

          {/* Pricing Calculation Summary Box */}
          <div className="p-4 sm:p-5 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-stone-400 tracking-wider block">
                  Total Biaya Bahan (HPP)
                </span>
                <span className="text-base font-black text-stone-800 font-mono">
                  Rp {totalHpp.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="text-stone-300 font-black">/</div>
              <div>
                <span className="text-[10px] font-extrabold uppercase text-stone-400 tracking-wider block">
                  Harga Jual Buket
                </span>
                <span className="text-base font-black text-rose-600 font-mono">
                  Rp {sellingPrice.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="text-stone-300 font-black">/</div>
              <div>
                <span className="text-[10px] font-extrabold uppercase text-stone-400 tracking-wider block">
                  Laba Kotor / Margin
                </span>
                <span className="text-base font-black text-emerald-600 font-mono">
                  +{marginPercent}% (Rp {grossProfit.toLocaleString('id-ID')})
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                showMagicToast('Resep Tersimpan 🎉', `Resep BOM untuk ${selectedProductId} berhasil diperbarui.`, '✨');
              }}
              className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap self-end sm:self-auto"
            >
              Simpan Perubahan Resep
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: BAHAN RUSAK / AFKIR GUDANG */}
      {/* ========================================================================= */}
      {activeTab === 'WASTE_LOSS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl">
              <span className="text-[10px] font-black uppercase text-stone-500 tracking-wider block">
                Total Item Rusak / Scrap
              </span>
              <div className="text-xl font-black text-stone-800 mt-1">{wasteMaterials.length} Insiden</div>
              <span className="text-[10px] text-stone-500 mt-0.5 block">Tercatat di pembukuan loss atelier</span>
            </div>

            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl">
              <span className="text-[10px] font-black uppercase text-rose-700 tracking-wider block">
                Estimasi Total Kerugian
              </span>
              <div className="text-xl font-black text-rose-700 mt-1 font-mono">
                Rp {totalWasteLoss.toLocaleString('id-ID')}
              </div>
              <span className="text-[10px] text-rose-600 mt-0.5 block">Potongan nilai modal bahan mentah</span>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider block">
                Status Evaluasi Spoilage
              </span>
              <div className="text-sm font-black text-emerald-800 mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{totalWasteLoss > 100000 ? 'Perlu Mitigasi Gudang' : 'Toleransi Terkendali'}</span>
              </div>
              <span className="text-[10px] text-emerald-700 mt-0.5 block">Di bawah batas toleransi scrap 3%</span>
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
                <label className="text-[11px] font-bold text-stone-700 block mb-1">Penyebab Kerusakan / Afkir</label>
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
                <label className="text-[11px] font-bold text-stone-700 block mb-1">Biaya Beli Satuan (Rp)</label>
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
          <div className="overflow-x-auto border border-stone-200 rounded-2xl">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50 text-stone-700 font-extrabold uppercase text-[10px] tracking-wider border-b border-stone-200">
                <tr>
                  <TableSortHeader
                    label="Bahan Baku Rusak"
                    field="materialName"
                    currentField={wasteSortField}
                    direction={wasteSortDirection}
                    onSort={(f) => handleWasteSort(f as WasteSortField)}
                    className="min-w-[220px]"
                  />
                  <TableSortHeader
                    label="Kategori"
                    field="category"
                    currentField={wasteSortField}
                    direction={wasteSortDirection}
                    onSort={(f) => handleWasteSort(f as WasteSortField)}
                    className="min-w-[120px]"
                    align="center"
                  />
                  <TableSortHeader
                    label="Qty & Unit"
                    field="qty"
                    currentField={wasteSortField}
                    direction={wasteSortDirection}
                    onSort={(f) => handleWasteSort(f as WasteSortField)}
                    className="min-w-[110px]"
                    align="center"
                  />
                  <TableSortHeader
                    label="Penyebab Kerusakan"
                    field="reason"
                    currentField={wasteSortField}
                    direction={wasteSortDirection}
                    onSort={(f) => handleWasteSort(f as WasteSortField)}
                    className="min-w-[160px]"
                  />
                  <th className="py-3.5 px-4 min-w-[200px]">Tindakan Mitigasi</th>
                  <TableSortHeader
                    label="Total Rugi"
                    field="totalLoss"
                    currentField={wasteSortField}
                    direction={wasteSortDirection}
                    onSort={(f) => handleWasteSort(f as WasteSortField)}
                    className="min-w-[130px]"
                    align="right"
                  />
                  <th className="py-3.5 px-4 text-center w-12">Aksi</th>
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
                      <td className="py-3 px-4 font-bold text-stone-800">{item.materialName}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-stone-100 text-stone-700 font-semibold px-2 py-0.5 rounded-full text-[10px]">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-stone-700">
                        {item.qty} {item.unit}
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-full text-[10px]">
                          {reasonLabel[item.reason] || item.reason}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-stone-500 max-w-xs text-[11px]">
                        {item.mitigationAction || '-'}
                      </td>
                      <td className="py-3 px-4 text-right font-black text-rose-600 font-mono">
                        Rp {item.totalLoss.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4 text-center">
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

      {/* ========================================================================= */}
      {/* MODAL 1: TAMBAH BAHAN BAKU MENTAH BARU */}
      {/* ========================================================================= */}
      {isAddMatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-rose-600" />
                <h3 className="font-extrabold text-stone-800 text-sm">Tambah Bahan Baku Mentah Baru</h3>
              </div>
              <button
                onClick={() => setIsAddMatModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRawMaterialSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Nama Bahan Baku <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newMatName}
                  onChange={(e) => setNewMatName(e.target.value)}
                  placeholder="Contoh: Kawat Bulu Chenille Velvet Lilac (6mm)"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Kategori Bahan</label>
                  <select
                    value={newMatCategory}
                    onChange={(e) => setNewMatCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="KAWAT_BULU">Kawat Bulu (Chenille)</option>
                    <option value="BATANG_KAWAT">Batang Kawat Penyangga</option>
                    <option value="CELLOPHANE">Kertas Cellophane</option>
                    <option value="PITA">Pita Satin & Organza</option>
                    <option value="BONEKA_AKSESORIS">Boneka Wisuda / Aksesoris</option>
                    <option value="FLORAL_FOAM">Floral Foam / Oasis</option>
                    <option value="LAINNYA">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Satuan</label>
                  <input
                    type="text"
                    required
                    value={newMatUnit}
                    onChange={(e) => setNewMatUnit(e.target.value)}
                    placeholder="Batang, Lembar, Pcs..."
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Stok Awal</label>
                  <input
                    type="number"
                    required
                    value={newMatStock}
                    onChange={(e) => setNewMatStock(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Min. Stok (Alert)</label>
                  <input
                    type="number"
                    required
                    value={newMatMinStock}
                    onChange={(e) => setNewMatMinStock(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Harga Beli Satuan</label>
                  <input
                    type="number"
                    required
                    value={newMatCost}
                    onChange={(e) => setNewMatCost(e.target.value)}
                    placeholder="Rp"
                    className="w-full px-3 py-2 text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <div className="text-[11px] font-black uppercase text-stone-600 tracking-wider flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-rose-500" />
                  <span>Informasi Toko / Tempat Beli (Supplier)</span>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-0.5">Nama Toko / Supplier</label>
                  <input
                    type="text"
                    required
                    value={newMatSupplierName}
                    onChange={(e) => setNewMatSupplierName(e.target.value)}
                    placeholder="Contoh: Toko Chenille Jaya Bandung"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-0.5">No. WhatsApp Supplier</label>
                    <input
                      type="text"
                      value={newMatSupplierContact}
                      onChange={(e) => setNewMatSupplierContact(e.target.value)}
                      placeholder="081234567890"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-0.5">Link Toko / E-Commerce</label>
                    <input
                      type="url"
                      value={newMatSupplierLink}
                      onChange={(e) => setNewMatSupplierLink(e.target.value)}
                      placeholder="https://shopee.co.id/..."
                      className="w-full px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Catatan Tambahan</label>
                <input
                  type="text"
                  value={newMatNotes}
                  onChange={(e) => setNewMatNotes(e.target.value)}
                  placeholder="Kualitas bahan, nomor warna kain, dll."
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddMatModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 active:scale-95 transition-all"
                >
                  Simpan Bahan Baku
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: BUAT PESANAN RESTOCK BARU (PO SUPPLIER) */}
      {/* ========================================================================= */}
      {isAddPoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-rose-600" />
                <h3 className="font-extrabold text-stone-800 text-sm">Catat Pesanan Bahan Baku / Restock</h3>
              </div>
              <button
                onClick={() => setIsAddPoModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPoSubmit} className="space-y-3">
              {/* Material Selector */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Pilih Bahan dari Inventori <span className="text-stone-400">(Auto-fill info toko)</span>
                </label>
                <select
                  value={poSelectedMatId}
                  onChange={(e) => handleSelectMaterialForPo(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="">-- Ketik Nama Bahan Manual atau Pilih di Bawah --</option>
                  {rawMaterials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} (Stok: {m.stock} {m.unit} | Supplier: {m.supplierName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Nama Bahan Baku yang Dipesan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={poMaterialName}
                  onChange={(e) => setPoMaterialName(e.target.value)}
                  placeholder="Contoh: Kawat Bulu Burgundy 6mm (Pack 100)"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Jumlah Dipesan</label>
                  <input
                    type="number"
                    required
                    value={poQty}
                    onChange={(e) => setPoQty(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Satuan</label>
                  <input
                    type="text"
                    required
                    value={poUnit}
                    onChange={(e) => setPoUnit(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Harga Beli / Satuan</label>
                  <input
                    type="number"
                    required
                    value={poCostPerUnit}
                    onChange={(e) => setPoCostPerUnit(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <div className="text-[11px] font-black uppercase text-stone-600 tracking-wider flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-rose-500" />
                  <span>Info Toko Online / Supplier & Waktu Tiba</span>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-0.5">Nama Toko Tempat Pesan</label>
                  <input
                    type="text"
                    required
                    value={poSupplierName}
                    onChange={(e) => setPoSupplierName(e.target.value)}
                    placeholder="Contoh: Toko Chenille Jaya Shopee"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-0.5">WhatsApp Supplier</label>
                    <input
                      type="text"
                      value={poSupplierContact}
                      onChange={(e) => setPoSupplierContact(e.target.value)}
                      placeholder="081234567890"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-0.5">
                      Estimasi Waktu Tiba (ETA) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={poEta}
                      onChange={(e) => setPoEta(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-0.5">Nomor Resi Pengiriman</label>
                    <input
                      type="text"
                      value={poTracking}
                      onChange={(e) => setPoTracking(e.target.value)}
                      placeholder="JP192839219 (J&T)"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-0.5">Link Pesanan E-Commerce</label>
                    <input
                      type="url"
                      value={poSupplierLink}
                      onChange={(e) => setPoSupplierLink(e.target.value)}
                      placeholder="https://shopee.co.id/..."
                      className="w-full px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Catatan Pesanan</label>
                <input
                  type="text"
                  value={poNotes}
                  onChange={(e) => setPoNotes(e.target.value)}
                  placeholder="Nomor invoice belanja, keterangan paket, dll."
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-xs">
                <span className="font-bold text-rose-800">Estimasi Total Biaya:</span>
                <span className="font-black text-rose-700 font-mono text-sm">
                  Rp {((parseFloat(poQty) || 0) * (parseFloat(poCostPerUnit) || 0)).toLocaleString('id-ID')}
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddPoModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 active:scale-95 transition-all"
                >
                  Simpan Pesanan Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
