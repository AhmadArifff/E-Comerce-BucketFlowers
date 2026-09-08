'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  ShoppingBag,
  FileSpreadsheet,
  Package,
  Layers,
  Tag,
  ShieldAlert,
  MessageCircle,
  MapPin,
  Palette,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  X,
} from 'lucide-react';

export type AdminTab =
  | 'DASHBOARD'
  | 'ORDERS'
  | 'REPORTS'
  | 'PRODUCTS'
  | 'BOM'
  | 'PROMOS'
  | 'COMPLAINTS'
  | 'WHATSAPP'
  | 'COD_MAPS'
  | 'MAINTENANCE'
  | 'SETTINGS';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

interface NavSection {
  title: string;
  items: {
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    badgeColor?: string;
  }[];
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const sections: NavSection[] = [
    {
      title: 'Menu Utama',
      items: [
        { id: 'DASHBOARD', label: 'Dashboard & Analitik', icon: LayoutDashboard },
        { id: 'ORDERS', label: 'Manajemen Pesanan', icon: ShoppingBag, badge: '4', badgeColor: 'bg-rose-500 text-white' },
        { id: 'REPORTS', label: 'Laporan & Ekspor Excel', icon: FileSpreadsheet },
        { id: 'PRODUCTS', label: 'Produk & Klik Pelanggan', icon: Package },
        { id: 'BOM', label: 'Bahan Baku & Resep BOM', icon: Layers },
        { id: 'PROMOS', label: 'Pemasaran & Kupon', icon: Tag },
      ],
    },
    {
      title: 'Pelayanan & Logistik',
      items: [
        { id: 'COMPLAINTS', label: 'Komplain & Rating', icon: ShieldAlert, badge: '1 Baru', badgeColor: 'bg-amber-500 text-white' },
        { id: 'WHATSAPP', label: 'CS WhatsApp Hub', icon: MessageCircle, badge: '3 Live', badgeColor: 'bg-emerald-500 text-white' },
        { id: 'COD_MAPS', label: 'Titik Temu COD Maps', icon: MapPin },
      ],
    },
    {
      title: 'Sistem & Toko',
      items: [
        { id: 'MAINTENANCE', label: 'Mode Pemeliharaan & Tema', icon: Palette },
        { id: 'SETTINGS', label: 'Pengaturan Toko', icon: Settings },
      ],
    },
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
                  Operations Suite v2.5
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

        {/* Navigation List Organized in 3 Sections */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {sections.map((sec, secIdx) => (
            <div key={secIdx} className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-stone-400">
                  {sec.title}
                </div>
              )}
              {sec.items.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/25'
                        : 'text-stone-600 hover:bg-rose-50 hover:text-rose-600'
                    } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!isCollapsed && item.badge && (
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                          isActive ? 'bg-white text-rose-600' : item.badgeColor || 'bg-rose-500 text-white'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer: Store Status & Return to Store */}
        <div className="p-3 border-t border-rose-100 space-y-2">
          {!isCollapsed && (
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between text-xs">
              <div>
                <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Status Toko</div>
                <div className="text-[11px] font-bold text-stone-700">Online & Buka Pesanan</div>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>AKTIF</span>
              </div>
            </div>
          )}

          <Link
            href="/"
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-colors ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title="Kembali ke Etalase Toko"
          >
            <ArrowLeft className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span>Kembali ke Toko</span>}
          </Link>
        </div>
      </aside>
    </>
  );
};

