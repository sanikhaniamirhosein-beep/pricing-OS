import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  Calculator,
  Truck,
  ShieldCheck,
  Receipt,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  Building2,
  Bell,
  Sparkles,
  ChevronDown,
  Bot,
  Search,
  Wallet,
  Phone,
  User,
  Building,
  Mail,
  CheckCircle2,
  FileCheck2,
  Clock,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePricing } from '../../store/PricingContext';
import { ShipperDashboardView } from './ShipperDashboardView';
import { ShipperQuoteBookingView } from './ShipperQuoteBookingView';
import { ShipperShipmentsView } from './ShipperShipmentsView';
import { ShipperContractsView } from './ShipperContractsView';
import { ShipperBillingView } from './ShipperBillingView';
import { ShipperMasterDataView } from './ShipperMasterDataView';
import { ShipperAnalyticsView } from './ShipperAnalyticsView';
import { ShipperSettingsView } from './ShipperSettingsView';
import { ShipperSupportIncidentsView } from './ShipperSupportIncidentsView';
import { ShipperBatchOrdersView } from './ShipperBatchOrdersView';
import { AICoPilotDrawer } from '../common/AICoPilotDrawer';
import { ShipperActiveLoad } from '../../data/mockShipperData';
import { LifeBuoy, FileSpreadsheet } from 'lucide-react';

interface ShipperPortalLayoutProps {
  onLogout: () => void;
  onSwitchToCarrierPortal?: () => void;
}

export const ShipperPortalLayout: React.FC<ShipperPortalLayoutProps> = ({
  onLogout,
}) => {
  const {
    userName,
    userOrgName,
    userEmail,
    currentShipperOrg,
  } = usePricing();
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'quote' | 'batch_orders' | 'shipments' | 'support' | 'contracts' | 'billing' | 'master_data' | 'analytics' | 'settings'
  >('dashboard');

  const [activeLoads, setActiveLoads] = useState<ShipperActiveLoad[]>(currentShipperOrg.activeLoads);

  // Sync active loads whenever active organization changes
  useEffect(() => {
    if (currentShipperOrg?.activeLoads) {
      setActiveLoads(currentShipperOrg.activeLoads);
    }
  }, [currentShipperOrg]);
  const [selectedShipmentForTracking, setSelectedShipmentForTracking] = useState<ShipperActiveLoad | null>(null);
  const [selectedLoadForSupport, setSelectedLoadForSupport] = useState<string | null>(null);
  const [selectedTicketForSupport, setSelectedTicketForSupport] = useState<string | null>(null);
  const [isAiCoPilotOpen, setIsAiCoPilotOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSidebarCompact, setIsSidebarCompact] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigationItems = [
    { id: 'dashboard', label: 'داشبورد اصلی', icon: LayoutDashboard, badge: undefined },
    { id: 'quote', label: 'استعلام و ثبت سفارش', icon: Calculator, badge: 'نرخ آنی' },
    { id: 'batch_orders', label: 'ثبت دسته‌ای بار (اکسل)', icon: FileSpreadsheet, badge: 'جدید' },
    { id: 'shipments', label: 'مدیریت و رهگیری بارها', icon: Truck, badge: `${activeLoads.length} بار` },
    { id: 'support', label: 'پشتیبانی و حوادث حین حمل', icon: LifeBuoy, badge: '۲ تیکت' },
    { id: 'contracts', label: 'قراردادها و تخفیف‌ها', icon: ShieldCheck, badge: 'پله طلایی' },
    { id: 'billing', label: 'امور مالی و صورتحساب‌ها', icon: Receipt, badge: undefined },
    { id: 'master_data', label: 'اطلاعات پایه و انبارها', icon: BookOpen, badge: undefined },
    { id: 'analytics', label: 'گزارش‌ها و تحلیل‌ها', icon: BarChart3, badge: undefined },
    { id: 'settings', label: 'تنظیمات و کاربران', icon: Settings, badge: undefined },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col antialiased selection:bg-teal-500/20 selection:text-teal-900">
      {/* 1. Shipper Minimal Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs">
        <div className="w-full max-w-[98%] 2xl:max-w-[1700px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Logo & Portal Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500 to-teal-600 text-white flex items-center justify-center font-black text-base shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm font-title">
                  پرتال اختصاصی صاحب بار
                </span>
                <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 font-bold text-[10px] border border-sky-200">
                  سطح {currentShipperOrg?.tier || 'طلایی'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {currentShipperOrg?.nameFa || userOrgName || 'شرکت فولاد مبارکه اصفهان'} • سامانه لجستیک شرکتی
              </p>
            </div>
          </div>

          {/* Center: Quick Credit Badge & Org Identity Badge (Static - Isolated Data) */}
          <div className="hidden md:flex items-center gap-3 bg-slate-50/80 px-3 py-1.5 rounded-xl border border-sky-100">
            <div
              id="shipper-header-org-identity"
              className="flex items-center gap-1.5 px-2.5 py-1 bg-white text-slate-800 text-xs font-bold rounded-lg border border-slate-200"
              title="شرکت صاحب بار فعال احراز هویت شده"
            >
              <Building2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span className="truncate max-w-[160px]">{currentShipperOrg?.nameFa || userOrgName || 'شرکت صاحب بار'}</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Wallet className="w-4 h-4 text-sky-600" />
              <span>اعتبار فعال:</span>
              <strong className="font-mono text-slate-900 font-bold">
                {((currentShipperOrg?.tierInfo?.availableCreditRials || 0) / 10).toLocaleString('fa-IR')} تومان
              </strong>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>تخفیف {currentShipperOrg?.tierInfo?.currentDiscountPercent || 8.5}٪</span>
            </div>
          </div>

          {/* Right Controls: Quick Quote + AI CoPilot Button + Minimal User Menu */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Price Inquiry Button - Emerald Green CTA */}
            <button
              type="button"
              id="btn-shipper-header-quote"
              onClick={() => setActiveTab('quote')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-xs ${
                activeTab === 'quote'
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                  : 'bg-white hover:bg-emerald-50/70 text-slate-700 hover:text-emerald-900 border-slate-200 hover:border-emerald-300'
              }`}
              title="استعلام فوری نرخ کرایه و ثبت سفارش حمل بار"
            >
              <Calculator className={`w-4 h-4 ${activeTab === 'quote' ? 'text-white' : 'text-emerald-600'}`} />
              <span className="hidden sm:inline">استعلام قیمت</span>
            </button>

            {/* AI Assistant Button */}
            <div className="relative group">
              <button
                type="button"
                id="btn-shipper-ai-copilot"
                onClick={() => setIsAiCoPilotOpen(!isAiCoPilotOpen)}
                aria-label="دستیار هوش مصنوعی تحلیل تعرفه و بارنامه"
                className="w-9 h-9 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white flex items-center justify-center shadow-2xs hover:shadow-xs transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-400/50"
              >
                <Bot className="w-4.5 h-4.5 text-white" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-white" />
              </button>

              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:flex flex-col items-center z-50 pointer-events-none">
                <div className="bg-slate-900 text-white text-[11px] font-medium px-2.5 py-1 rounded-lg shadow-lg whitespace-nowrap">
                  دستیار هوشمند استعلام بار
                </div>
              </div>
            </div>

            <div className="h-5 w-px bg-slate-200" />

            {/* Minimal User Profile Dropdown */}
            <div className="relative" ref={userDropdownRef}>
              <button
                type="button"
                id="btn-shipper-user-panel"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-xs transition-all cursor-pointer ${
                  isUserDropdownOpen
                    ? 'bg-sky-50/80 border-sky-300 shadow-xs'
                    : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-sky-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {userName ? userName.substring(0, 1) : 'ص'}
                </div>
                <div className="text-right hidden sm:block">
                  <div className="font-bold text-slate-800 text-xs leading-tight">
                    {userName || 'مهندس اکبری'}
                  </div>
                  <div className="text-[10px] text-sky-800 font-medium leading-tight">
                    مدیر ارشد تدارکات
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: isUserDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </motion.div>
              </button>

              {/* Animated Profile Dropdown Menu */}
              <AnimatePresence>
                {isUserDropdownOpen && (
                  <motion.div
                    id="panel-shipper-user-dropdown"
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute left-0 mt-2.5 w-84 sm:w-92 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-xl p-3.5 z-50 space-y-3"
                  >
                    {/* User Identity Card */}
                    <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-200/80 space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-teal-600 text-white font-bold text-base flex items-center justify-center shrink-0 shadow-xs">
                          {userName ? userName.substring(0, 1) : 'ص'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate">
                            {userName || 'مهندس جواد اکبری'}
                          </div>
                          <div className="text-[11px] text-sky-800 font-medium truncate mt-0.5">
                            مدیر ارشد تدارکات و لجستیک سازمانی
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono truncate mt-0.5 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{userEmail || 'j.akbari@steel-msc.ir'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/70 text-[10px]">
                        <div className="bg-white p-2 rounded-lg border border-slate-100">
                          <span className="text-slate-400 block font-medium">سازمان:</span>
                          <span className="text-slate-800 font-bold block truncate">
                            {userOrgName || 'فولاد مبارکه اصفهان'}
                          </span>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-100">
                          <span className="text-slate-400 block font-medium">رده تخفیف:</span>
                          <span className="text-emerald-700 font-bold block truncate">
                            پله طلایی (۸.۵٪)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Navigation to Settings or Profile */}
                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          setActiveTab('settings');
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-500" />
                        <span>تنظیمات حساب</span>
                      </button>

                      <button
                        type="button"
                        id="btn-shipper-logout"
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          onLogout();
                        }}
                        className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        title="خروج از حساب کاربری"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>خروج</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Body with Navigation Sidebar + Central Views */}
      <div className="w-full max-w-[98%] 2xl:max-w-[1700px] mx-auto px-2 sm:px-4 lg:px-6 py-6 flex flex-col lg:flex-row gap-5 flex-1 items-start">
        {/* Shipper Navigation Sidebar */}
        <aside
          className={`shrink-0 transition-all duration-300 ${
            isSidebarCompact ? 'w-full lg:w-20' : 'w-full lg:w-68'
          }`}
        >
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-3 space-y-2 sticky top-20 backdrop-blur-xs">
            <div className="px-2 py-1.5 flex items-center justify-between border-b border-slate-100 mb-1">
              {!isSidebarCompact ? (
                <span className="text-[11px] font-bold text-sky-900/60 uppercase tracking-wider font-mono">
                  بخش‌های پرتال صاحب بار
                </span>
              ) : (
                <span className="text-[10px] font-bold font-mono text-slate-400 mx-auto">منو</span>
              )}
              <button
                type="button"
                onClick={() => setIsSidebarCompact(!isSidebarCompact)}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title={isSidebarCompact ? 'گسترش منو' : 'حالت فشرده'}
              >
                {isSidebarCompact ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
              </button>
            </div>

            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id as any)}
                    title={isSidebarCompact ? item.label : undefined}
                    className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-xs font-bold transition-all duration-150 cursor-pointer text-right ${
                      isSelected
                        ? 'bg-gradient-to-r from-sky-600 to-teal-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-sky-50/60 hover:text-sky-950'
                    }`}
                  >
                    <div className={`flex items-center ${isSidebarCompact ? 'justify-center w-full' : 'gap-2.5'}`}>
                      <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-sky-700'}`} />
                      {!isSidebarCompact && <span>{item.label}</span>}
                    </div>
                    {!isSidebarCompact && item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                          isSelected
                            ? 'bg-white/20 text-white font-bold'
                            : 'bg-sky-50 text-sky-800 border border-sky-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Quick Support Call Box */}
            {!isSidebarCompact && (
              <div className="mt-4 pt-3 border-t border-slate-100 px-1 space-y-1.5">
                <div className="text-[11px] text-slate-400 font-medium">پشتیبانی اختصاصی لجستیک:</div>
                <a
                  href="tel:02188000000"
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-950 border border-slate-200/80 text-xs font-bold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-sky-600" />
                  <span className="font-mono">۰۲۱-۸۸۰۰۰۰۰۰</span>
                </a>
              </div>
            )}
          </div>
        </aside>

        {/* Central View Switcher */}
        <main className="flex-1 min-w-0 w-full">
          {activeTab === 'dashboard' && (
            <ShipperDashboardView
              onNavigateTab={(tab) => setActiveTab(tab as any)}
              onSelectShipmentToTrack={(shipment) => {
                setSelectedShipmentForTracking(shipment);
                setActiveTab('shipments');
              }}
              activeLoads={activeLoads}
            />
          )}

          {activeTab === 'quote' && (
            <ShipperQuoteBookingView
              onOrderCreated={(newLoad) => {
                if (newLoad) {
                  setActiveLoads((prev) => [newLoad, ...prev]);
                  setSelectedShipmentForTracking(newLoad);
                }
              }}
              onNavigateTab={(tab) => setActiveTab(tab as any)}
            />
          )}

          {activeTab === 'batch_orders' && (
            <ShipperBatchOrdersView
              onNavigateTab={(tab) => setActiveTab(tab as any)}
              onBatchSubmitted={(count, createdLoads) => {
                if (createdLoads && createdLoads.length > 0) {
                  setActiveLoads((prev) => [...createdLoads, ...prev]);
                  setSelectedShipmentForTracking(createdLoads[0]);
                }
              }}
            />
          )}

          {activeTab === 'shipments' && (
            <ShipperShipmentsView
              initialSelectedShipment={selectedShipmentForTracking}
              loads={activeLoads}
              onNavigateTab={(tab) => setActiveTab(tab as any)}
              onNavigateToSupport={(loadId, ticketId) => {
                setSelectedLoadForSupport(loadId);
                setSelectedTicketForSupport(ticketId || null);
                setActiveTab('support');
              }}
            />
          )}

          {activeTab === 'support' && (
            <ShipperSupportIncidentsView
              initialPreselectedLoadId={selectedLoadForSupport}
              initialSelectedTicketId={selectedTicketForSupport}
              onNavigateToTracking={(load) => {
                setSelectedShipmentForTracking(load);
                setActiveTab('shipments');
              }}
            />
          )}

          {activeTab === 'contracts' && <ShipperContractsView />}

          {activeTab === 'billing' && <ShipperBillingView />}

          {activeTab === 'master_data' && <ShipperMasterDataView />}

          {activeTab === 'analytics' && <ShipperAnalyticsView />}

          {activeTab === 'settings' && <ShipperSettingsView />}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 text-slate-500 text-xs py-5 mt-12">
        <div className="w-full max-w-[98%] 2xl:max-w-[1700px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">پرتال مدیریت و سفارش باربری سازمانی (Shipper Portal)</span>
            <span>•</span>
            <span className="text-slate-400">اتصال آنلاین به سیستم عامل قیمت‌گذاری لجستیک</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span>تضمین نرخ مصوب راهداری</span>
            <span>•</span>
            <span>بارنامه رسمی الکترونیک تمبردار</span>
            <span>•</span>
            <span>پوشش بیمه تمام‌خطر</span>
          </div>
        </div>
      </footer>

      {/* AI Assistant Drawer Component */}
      <AICoPilotDrawer isOpen={isAiCoPilotOpen} onClose={() => setIsAiCoPilotOpen(false)} />
    </div>
  );
};
