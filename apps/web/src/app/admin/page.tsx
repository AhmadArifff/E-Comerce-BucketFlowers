'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { AdminSidebar, type AdminTab } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { KpiCards } from '@/components/admin/KpiCards';
import { OrdersTable } from '@/components/admin/OrdersTable';
import { BOMCalculatorModal } from '@/components/admin/BOMCalculatorModal';
import { CODMapModal } from '@/components/admin/CODMapModal';
import { CSHubModal } from '@/components/admin/CSHubModal';
import { WarrantyClaimsTable } from '@/components/admin/WarrantyClaimsTable';
import { CustomerComplaintsManager } from '@/components/admin/CustomerComplaintsManager';
import { useOrderStore, type Order } from '@/stores/useOrderStore';
import {
  FinancialChartCard,
  ProductionCalendarCard,
  ReportsView,
  ProductsClicksView,
  PromosView,
  MaintenanceThemeView,
  StoreSettingsView,
  ShippingLabelModal,
  AdminProfileModal,
  ChangePasswordModal,
  AddProductModal,
} from '@/components/admin/AdminViews';
import { ProductCtrAnalyticsCard } from '@/components/admin/ProductCtrAnalyticsCard';
import { UsersManagementView } from '@/components/admin/UsersManagementView';
import { CampaignsView } from '@/components/admin/CampaignsView';
import { CustomStudioManagementView } from '@/components/admin/CustomStudioManagementView';

const VALID_TABS: AdminTab[] = [
  'DASHBOARD',
  'ORDERS',
  'REPORTS',
  'PRODUCTS',
  'STUDIO',
  'BOM',
  'PROMOS',
  'CAMPAIGNS',
  'COMPLAINTS',
  'WHATSAPP',
  'COD_MAPS',
  'USERS',
  'MAINTENANCE',
  'SETTINGS',
];

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Check authentication and authorize SUPER_ADMIN or FLORIST_STAFF
    const timer = setTimeout(() => {
      setAuthChecked(true);
      if (!isAuthenticated || !user || (user.role !== 'SUPER_ADMIN' && user.role !== 'FLORIST_STAFF')) {
        router.push('/login?redirect=/admin');
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [isAuthenticated, user, router]);

  const [activeTab, setActiveTabState] = useState<AdminTab>('DASHBOARD');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Persist & Restore active admin menu on page reload/refresh
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Check URL query param (?tab=SETTINGS) or hash (#SETTINGS)
    const params = new URLSearchParams(window.location.search);
    const queryTab = params.get('tab')?.toUpperCase() as AdminTab | undefined;
    const hashTab = window.location.hash.replace('#', '').toUpperCase() as AdminTab | undefined;

    // 2. Check localStorage
    const storedTab = localStorage.getItem('chenille_admin_active_tab')?.toUpperCase() as AdminTab | undefined;

    const candidate = queryTab || hashTab || storedTab;
    if (candidate && VALID_TABS.includes(candidate)) {
      setActiveTabState(candidate);
      const newUrl = new URL(window.location.href);
      if (newUrl.searchParams.get('tab') !== candidate) {
        newUrl.searchParams.set('tab', candidate);
        window.history.replaceState(null, '', newUrl.toString());
      }
    }

    // Handle browser Back/Forward navigation between tabs
    const handlePopState = () => {
      const currentParams = new URLSearchParams(window.location.search);
      const popTab = currentParams.get('tab')?.toUpperCase() as AdminTab | undefined;
      if (popTab && VALID_TABS.includes(popTab)) {
        setActiveTabState(popTab);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const setActiveTab = (tab: AdminTab) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('chenille_admin_active_tab', tab);
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('tab', tab);
        window.history.replaceState(null, '', newUrl.toString());
      } catch (e) {
        console.warn('Failed to persist admin tab:', e);
      }
    }
  };

  // Modals state
  const { orders } = useOrderStore();
  const [isShippingLabelOpen, setIsShippingLabelOpen] = useState(false);
  const [selectedOrderForLabel, setSelectedOrderForLabel] = useState<Order | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  const handlePrintResi = (order: Order) => {
    setSelectedOrderForLabel(order);
    setIsShippingLabelOpen(true);
  };

  if (!authChecked || !isAuthenticated || !user || (user.role !== 'SUPER_ADMIN' && user.role !== 'FLORIST_STAFF')) {
    return (
      <div className="min-h-screen bg-stone-900 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-2xl mb-4 animate-pulse">
          🔒
        </div>
        <h2 className="text-base font-extrabold tracking-tight">Memverifikasi Sesi Akses Atelier...</h2>
        <p className="text-xs text-stone-400 mt-1 max-w-sm">
          Mengamankan panel operasional buket kawat bulu. Mengarahkan Anda ke halaman login...
        </p>
      </div>
    );
  }

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
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenChangePassword={() => setIsChangePasswordOpen(true)}
          onSelectTab={setActiveTab}
        />

        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full">
          {/* 1. DASHBOARD TAB */}
          {activeTab === 'DASHBOARD' && (
            <div className="space-y-6 admin-view-fade">
              <KpiCards />
              <ProductCtrAnalyticsCard />
              <FinancialChartCard />
              <ProductionCalendarCard />
              <OrdersTable searchQuery={searchQuery} onPrintResi={handlePrintResi} />
            </div>
          )}

          {/* 2. ORDERS TAB */}
          {activeTab === 'ORDERS' && (
            <div className="admin-view-fade">
              <OrdersTable searchQuery={searchQuery} onPrintResi={handlePrintResi} />
            </div>
          )}

          {/* 3. REPORTS TAB */}
          {activeTab === 'REPORTS' && (
            <div className="admin-view-fade">
              <ReportsView />
            </div>
          )}

          {/* 4. PRODUCTS & CTR CLICKS TAB */}
          {activeTab === 'PRODUCTS' && (
            <div className="admin-view-fade">
              <ProductsClicksView onOpenAddModal={() => setIsAddProductOpen(true)} />
            </div>
          )}

          {/* 4.5. CUSTOM STUDIO BUILDER & OPTIONS TAB */}
          {activeTab === 'STUDIO' && (
            <div className="admin-view-fade">
              <CustomStudioManagementView />
            </div>
          )}

          {/* 5. BOM RECIPES CALCULATOR TAB */}
          {activeTab === 'BOM' && (
            <div className="admin-view-fade">
              <BOMCalculatorModal />
            </div>
          )}

          {/* 6. PROMOS & COUPONS TAB */}
          {activeTab === 'PROMOS' && (
            <div className="admin-view-fade">
              <PromosView />
            </div>
          )}

          {/* 6.5. CAMPAIGNS & GAMIFICATION TAB */}
          {activeTab === 'CAMPAIGNS' && (
            <div className="admin-view-fade">
              <CampaignsView />
            </div>
          )}

          {/* 7. COMPLAINTS & WARRANTY CLAIMS TAB */}
          {activeTab === 'COMPLAINTS' && (
            <div className="admin-view-fade">
              <CustomerComplaintsManager />
            </div>
          )}

          {/* 8. WHATSAPP & LIVE CHAT CS HUB TAB */}
          {activeTab === 'WHATSAPP' && (
            <div className="admin-view-fade">
              <CSHubModal />
            </div>
          )}

          {/* 9. COD RADAR MAPS TAB */}
          {activeTab === 'COD_MAPS' && (
            <div className="admin-view-fade">
              <CODMapModal />
            </div>
          )}

          {/* 10. USERS & SESSION AUDIT TAB */}
          {activeTab === 'USERS' && (
            <div className="admin-view-fade">
              <UsersManagementView />
            </div>
          )}

          {/* 11. STORE MAINTENANCE & THEMES TAB */}
          {activeTab === 'MAINTENANCE' && (
            <div className="admin-view-fade">
              <MaintenanceThemeView />
            </div>
          )}

          {/* 11. STORE & ACCOUNT SETTINGS TAB */}
          {activeTab === 'SETTINGS' && (
            <div className="admin-view-fade">
              <StoreSettingsView />
            </div>
          )}
        </main>
      </div>

      {/* MODALS */}
      <ShippingLabelModal
        order={selectedOrderForLabel || orders[0] || null}
        isOpen={isShippingLabelOpen}
        onClose={() => setIsShippingLabelOpen(false)}
      />

      <AdminProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />

      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
      />
    </div>
  );
}
