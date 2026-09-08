'use client';

import React, { useState } from 'react';
import { AdminSidebar, type AdminTab } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { KpiCards } from '@/components/admin/KpiCards';
import { OrdersTable } from '@/components/admin/OrdersTable';
import { BOMCalculatorModal } from '@/components/admin/BOMCalculatorModal';
import { CODMapModal } from '@/components/admin/CODMapModal';
import { CSHubModal } from '@/components/admin/CSHubModal';
import { FeatureToggles } from '@/components/admin/FeatureToggles';
import { WarrantyClaimsTable } from '@/components/admin/WarrantyClaimsTable';
import { MOCK_PRODUCTS } from '@chenille/shared';
import { Package, Plus, Sparkles, Check, Clock } from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('OVERVIEW');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-stone-50/60 flex text-stone-800">
      {/* Collapsible Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileNavOpen}
        setIsMobileOpen={setIsMobileNavOpen}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <AdminHeader
          activeTab={activeTab}
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
        />

        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full">
          {/* OVERVIEW TAB */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-6 admin-view-fade">
              <KpiCards />
              <OrdersTable />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BOMCalculatorModal />
                <FeatureToggles />
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'ORDERS' && (
            <div className="admin-view-fade">
              <OrdersTable />
            </div>
          )}

          {/* PRODUCTS & INVENTORY TAB */}
          {activeTab === 'PRODUCTS' && (
            <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-sm space-y-6 admin-view-fade">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-sm">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-stone-800 tracking-tight">
                      Katalog Produk Buket & Inventaris HPP
                    </h2>
                    <p className="text-xs text-stone-500">
                      Kelola daftar buket bunga kawat bulu, harga jual, HPP bahan baku, dan status kuota PO.
                    </p>
                  </div>
                </div>

                <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 active:scale-95 transition-all self-start sm:self-auto">
                  <Plus className="w-4 h-4" />
                  <span>Tambah Buket Baru</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-600">
                  <thead className="bg-stone-50 text-stone-700 font-extrabold uppercase text-[10px] tracking-wider border-b border-stone-200">
                    <tr>
                      <th className="py-3 px-4">Buket Produk</th>
                      <th className="py-3 px-4">Kategori</th>
                      <th className="py-3 px-4">Biaya Pokok (HPP)</th>
                      <th className="py-3 px-4">Harga Jual</th>
                      <th className="py-3 px-4">Margin Laba</th>
                      <th className="py-3 px-4">Status Produksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {MOCK_PRODUCTS.map((prod) => {
                      const price = prod.discountPrice ?? prod.price;
                      const profit = price - prod.rawCostHpp;
                      const margin = Math.round((profit / price) * 100);

                      return (
                        <tr key={prod.id} className="hover:bg-rose-50/20 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-11 h-11 rounded-xl object-cover border border-rose-100"
                              />
                              <div>
                                <div className="font-extrabold text-stone-800">{prod.name}</div>
                                <span className="text-[10px] text-stone-400">ID: {prod.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-full text-[10px]">
                              {prod.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-stone-600">
                            Rp {prod.rawCostHpp.toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-4 font-black text-rose-600">
                            Rp {price.toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-4">
                            <span className="bg-emerald-50 text-emerald-700 font-black px-2 py-0.5 rounded-full text-[10px]">
                              +{margin}% (Rp {profit.toLocaleString('id-ID')})
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {prod.isReadyStock ? (
                              <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-[10px]">
                                Ready Stock ({prod.stock})
                              </span>
                            ) : (
                              <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full text-[10px]">
                                PO {prod.poLeadDays} Hari
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CLAIMS & WARRANTY TAB */}
          {activeTab === 'CLAIMS' && (
            <div className="admin-view-fade">
              <WarrantyClaimsTable />
            </div>
          )}

          {/* BOM CALCULATOR TAB */}
          {activeTab === 'BOM_CALCULATOR' && (
            <div className="admin-view-fade">
              <BOMCalculatorModal />
            </div>
          )}

          {/* COD MAPS TAB */}
          {activeTab === 'COD_MAPS' && (
            <div className="admin-view-fade">
              <CODMapModal />
            </div>
          )}

          {/* CS WEBCHAT HUB TAB */}
          {activeTab === 'CS_HUB' && (
            <div className="admin-view-fade">
              <CSHubModal />
            </div>
          )}

          {/* FEATURE TOGGLES TAB */}
          {activeTab === 'FEATURE_TOGGLES' && (
            <div className="admin-view-fade">
              <FeatureToggles />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
