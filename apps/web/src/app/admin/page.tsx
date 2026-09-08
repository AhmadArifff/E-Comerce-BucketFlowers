'use client';

import React, { useState } from 'react';
import { AdminSidebar, type AdminTab } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { KpiCards } from '@/components/admin/KpiCards';
import { OrdersTable } from '@/components/admin/OrdersTable';
import { BOMCalculatorModal } from '@/components/admin/BOMCalculatorModal';
import { CODMapModal } from '@/components/admin/CODMapModal';
import { CSHubModal } from '@/components/admin/CSHubModal';
import { WarrantyClaimsTable } from '@/components/admin/WarrantyClaimsTable';
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

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('DASHBOARD');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

          {/* 7. COMPLAINTS & WARRANTY CLAIMS TAB */}
          {activeTab === 'COMPLAINTS' && (
            <div className="admin-view-fade">
              <WarrantyClaimsTable />
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

          {/* 10. STORE MAINTENANCE & THEMES TAB */}
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
