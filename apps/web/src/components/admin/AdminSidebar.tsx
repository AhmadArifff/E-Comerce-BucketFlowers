'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  ShieldCheck,
  Calculator,
  MapPin,
  MessageSquare,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  X,
} from 'lucide-react';

export type AdminTab =
  | 'OVERVIEW'
  | 'ORDERS'
  | 'PRODUCTS'
  | 'CLAIMS'
  | 'BOM_CALCULATOR'
  | 'COD_MAPS'
  | 'CS_HUB'
  | 'FEATURE_TOGGLES';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const navItems = [
    { id: 'OVERVIEW', label: 'Ringkasan & KPI', icon: LayoutDashboard },
    { id: 'ORDERS', label: 'Manajemen Pesanan', icon: ShoppingBag },
    { id: 'PRODUCTS', label: 'Katalog & Stok', icon: Package },
    { id: 'CLAIMS', label: 'Komplain & Garansi 100%', icon: ShieldCheck },
    { id: 'BOM_CALCULATOR', label: 'Kalkulator BOM (HPP)', icon: Calculator },
    { id: 'COD_MAPS', label: 'Geofencing COD Maps', icon: MapPin },
    { id: 'CS_HUB', label: 'CS Webchat Hub', icon: MessageSquare },
    { id: 'FEATURE_TOGGLES', label: 'Feature Toggles', icon: Sliders },
  ];

  const handleSelectTab = (id: AdminTab) => {
    setActiveTab(id);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-stone-900/60 backdrop-blur-sm lg:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-white border-r border-rose-100 flex flex-col transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-4 border-b border-rose-100 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-500 text-white flex items-center justify-center shadow-md shadow-rose-600/20 flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <span className="font-extrabold text-sm text-stone-800 tracking-tight truncate block">
                  Chenille Atelier
                </span>
                <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider block">
                  Admin Hub 2026
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-rose-50 transition-colors"
            title={isCollapsed ? 'Perluas Menu' : 'Perkecil Menu'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 text-stone-400 hover:text-stone-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id as AdminTab)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
                    : 'text-stone-600 hover:bg-rose-50 hover:text-rose-600'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </div>

        {/* Bottom Back to Store link */}
        <div className="p-3 border-t border-rose-100">
          <Link
            href="/"
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-2xl text-xs font-semibold text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-colors ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <ArrowLeft className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span>Kembali ke Toko</span>}
          </Link>
        </div>
      </aside>
    </>
  );
};
