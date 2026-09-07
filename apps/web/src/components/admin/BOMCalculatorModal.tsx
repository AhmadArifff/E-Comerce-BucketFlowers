'use client';

import React, { useState } from 'react';
import { Calculator, Plus, Trash2, Sparkles, DollarSign, Percent, ArrowRight } from 'lucide-react';
import { MOCK_PRODUCTS } from '@chenille/shared';

interface BomRow {
  id: string;
  material: string;
  qty: number;
  unit: string;
  pricePerUnit: number;
}

const DEFAULT_ROWS: BomRow[] = [
  { id: '1', material: 'Batang Kawat Bulu Pastel Pink (6mm)', qty: 36, unit: 'Batang', pricePerUnit: 350 },
  { id: '2', material: 'Batang Kawat Bulu Hijau Daun (6mm)', qty: 12, unit: 'Batang', pricePerUnit: 350 },
  { id: '3', material: 'Kawat Batang Penyangga Hijau No. 18', qty: 12, unit: 'Batang', pricePerUnit: 500 },
  { id: '4', material: 'Cellophane Korean Waterproof Matte', qty: 2, unit: 'Lembar', pricePerUnit: 4500 },
  { id: '5', material: 'Pita Satin Mewah 2.5cm Burgundy', qty: 1.5, unit: 'Meter', pricePerUnit: 2200 },
  { id: '6', material: 'Boneka Wisuda Ber-toga 10cm', qty: 1, unit: 'Pcs', pricePerUnit: 7400 },
];

export const BOMCalculatorModal: React.FC = () => {
  const [rows, setRows] = useState<BomRow[]>(DEFAULT_ROWS);
  const [sellingPrice, setSellingPrice] = useState(119000);

  const totalHpp = rows.reduce((sum, r) => sum + r.qty * r.pricePerUnit, 0);
  const grossProfit = sellingPrice - totalHpp;
  const marginPercent = sellingPrice > 0 ? Math.round((grossProfit / sellingPrice) * 100) : 0;

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

  return (
    <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-sm space-y-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-sm">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-stone-800 tracking-tight">
              Kalkulator Bill of Materials (BOM) & HPP Presisi
            </h2>
            <p className="text-xs text-stone-500">
              Menghitung biaya bahan baku kawat bulu hingga rupiah terkecil untuk menjamin margin keuntungan sehat.
            </p>
          </div>
        </div>

        <button
          onClick={handleAddRow}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Bahan Baku</span>
        </button>
      </div>

      {/* Materials Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-stone-600">
          <thead className="bg-stone-50 text-stone-700 font-extrabold uppercase text-[10px] tracking-wider border-b border-stone-200">
            <tr>
              <th className="py-3 px-3">Nama Bahan Baku</th>
              <th className="py-3 px-3 w-24">Jumlah</th>
              <th className="py-3 px-3 w-24">Satuan</th>
              <th className="py-3 px-3 w-32">Harga Satuan</th>
              <th className="py-3 px-3 w-32">Subtotal HPP</th>
              <th className="py-3 px-2 text-center w-12">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {rows.map((row) => {
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
                  <td className="py-2.5 px-3 text-stone-500 font-medium">
                    {row.unit}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1 font-bold">
                      <span className="text-stone-400 text-[10px]">Rp</span>
                      <input
                        type="number"
                        value={row.pricePerUnit}
                        onChange={(e) => handleUpdateRow(row.id, 'pricePerUnit', parseFloat(e.target.value) || 0)}
                        className="w-24 text-xs font-bold p-1 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                      />
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-black text-rose-600">
                    Rp {subtotal.toLocaleString('id-ID')}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <button
                      onClick={() => handleRemoveRow(row.id)}
                      className="text-stone-400 hover:text-rose-600 p-1 rounded-md"
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
            Harga Jual Buket
          </span>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs font-bold text-stone-500">Rp</span>
            <input
              type="number"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
              className="w-28 text-base font-black text-stone-800 p-1 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>
        </div>

        <div>
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
            Laba Kotor Per Buket
          </span>
          <div className="text-xl font-black text-emerald-600 mt-1">
            Rp {grossProfit.toLocaleString('id-ID')}
          </div>
        </div>

        <div>
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
            Margin Keuntungan
          </span>
          <div className="text-xl font-black text-purple-600 mt-1">
            {marginPercent}%
          </div>
        </div>
      </div>
    </div>
  );
};
