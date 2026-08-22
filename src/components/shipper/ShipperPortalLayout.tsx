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
} from 'lucide-react';
import { usePricing } from '../../store/PricingContext';
import { ShipperDashboardView } from './ShipperDashboardView';
import { ShipperQuoteBookingView } from './ShipperQuoteBookingView';
import { ShipperShipmentsView } from './ShipperShipmentsView';
import { ShipperContractsView } from './ShipperContractsView';
import { ShipperBillingView } from './ShipperBillingView';
import { ShipperMasterDataView } from './ShipperMasterDataView';
import { ShipperAnalyticsView } from './ShipperAnalyticsView';
import { ShipperSettingsView } from './ShipperSettingsView';
import { AICoPilotDrawer } from '../common/AICoPilotDrawer';
import { INITIAL_SHIPPER_TIER, ShipperActiveLoad } from '../../data/mockShipperData';

interface ShipperPortalLayoutProps {
  onLogout: () => void;
  onSwitchToCarrierPortal?: () => void;
}

export const ShipperPortalLayout: React.FC<ShipperPortalLayoutProps> = ({
  onLogout,
}) => {
  const { userName, userOrgName, userEmail } = usePricing();
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'quote' | 'shipments' | 'contracts' | 'billing' | 'master_data' | 'analytics' | 'settings'
  >('dashboard');

  const [selectedShipmentForTracking, setSelectedShipmentForTracking] = useState<ShipperActiveLoad | null>(null);
  const [isAiCoPilotOpen, setIsAiCoPilotOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
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
    { id: 'shipments', label: 'مدیریت و رهگیری بارها', icon: Truck, badge: '۴ فعال' },
    { id: 'contracts', label: 'قراردادها و تخفیف‌ها', icon: ShieldCheck, badge: 'پله طلایی' },
    { id: 'billing', label: 'امور مالی و صورتحساب‌ها', icon: Receipt, badge: undefined },
    { id: 'master_data', label: 'اطلاعات پایه و انبارها', icon: BookOpen, badge: undefined },
    { id: 'analytics', label: 'گزارش‌ها و تحلیل‌ها', icon: BarChart3, badge: undefined },
    { id: 'settings', label: 'تنظیمات و کاربران', icon: Settings, badge: undefined },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col antialiased selection:bg-amber-500/20 selection:text-amber-900">
      {/* 1. Shipper Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="w-full max-w-[98%] 2xl:max-w-[1700px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Logo & Portal Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center font-black text-base shadow-sm">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm font-title">
                  پرتال اختصاصی صاحب بار
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[10px] border border-amber-300">
                  مشتری تجاری
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {userOrgName || 'شرکت فولاد مبارکه اصفهان'} • سامانه لجستیک شرکتی
              </p>
            </div>
          </div>

          {/* Center: Quick Credit Badge */}
          <div className="hidden md:flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Wallet className="w-4 h-4 text-amber-600" />
              <span>اعتبار فعال:</span>
              <strong className="font-mono text-slate-900 font-bold">
                {(INITIAL_SHIPPER_TIER.availableCreditRials / 10).toLocaleString('fa-IR')} تومان
              </strong>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>تخفیف طلایی ۸.۵٪</span>
            </div>
          </div>

          {/* Right Controls: Quick Quote + AI CoPilot Button + Rich User Profile Panel */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Price Inquiry Button */}
            <button
              type="button"
              id="btn-shipper-header-quote"
              onClick={() => setActiveTab('quote')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-xs ${
                activeTab === 'quote'
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                  : 'bg-white hover:bg-amber-50/70 text-slate-700 hover:text-amber-900 border-slate-200 hover:border-amber-300'
              }`}
              title="استعلام فوری نرخ کرایه و ثبت سفارش حمل بار"
            >
              <Calculator className={`w-4 h-4 ${activeTab === 'quote' ? 'text-white' : 'text-amber-600'}`} />
              <span>استعلام قیمت</span>
            </button>

            {/* AI Assistant Button (Identical to Carrier Panel) */}
            <div className="relative group">
              <button
                type="button"
                id="btn-shipper-ai-copilot"
                onClick={() => setIsAiCoPilotOpen(!isAiCoPilotOpen)}
                aria-label="دستیار هوش مصنوعی تحلیل تعرفه و بارنامه"
                className="w-9 h-9 rounded-xl bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center shadow-2xs hover:shadow-xs transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400/50"
              >
                <Bot className="w-4.5 h-4.5 text-white" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-white" />
              </button>

              {/* Tooltip on hover */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:flex flex-col items-center z-50 pointer-events-none">
                <div className="bg-slate-900 text-white text-[11px] font-medium px-2.5 py-1 rounded-lg shadow-lg whitespace-nowrap">
                  دستیار هوشمند تحلیل تعرفه و استعلام بار
                </div>
              </div>
            </div>

            <div className="h-5 w-px bg-slate-200" />

            {/* EXPANDED RICH USER PROFILE & ROLE DETAILS PANEL */}
            <div className="relative" ref={userDropdownRef}>
              <button
                type="button"
                id="btn-shipper-user-panel"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-xs transition-all cursor-pointer ${
                  isUserDropdownOpen
                    ? 'bg-amber-50/80 border-amber-300 shadow-xs'
                    : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {userName ? userName.substring(0, 1) : 'ص'}
                </div>
                <div className="text-right hidden sm:block">
                  <div className="font-bold text-slate-800 text-xs leading-tight">
                    {userName || 'مهندس اکبری'}
                  </div>
                  <div className="text-[10px] text-amber-800 font-medium leading-tight">
                    مدیر ارشد تدارکات و لجستیک
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Comprehensive Rich User Profile Dropdown */}
              {isUserDropdownOpen && (
                <div
                  id="panel-shipper-user-dropdown"
                  className="absolute left-0 mt-2.5 w-88 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 animate-in fade-in zoom-in-98 duration-150 space-y-3.5"
                >
                  {/* 1. Primary User Identity Card */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white font-bold text-base flex items-center justify-center shrink-0 shadow-xs">
                        {userName ? userName.substring(0, 1) : 'ص'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {userName || 'مهندس جواد اکبری'}
                        </div>
                        <div className="text-[11px] text-amber-800 font-semibold truncate mt-0.5">
                          مدیر ارشد تدارکات و لجستیک سازمانی
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono truncate mt-0.5 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{userEmail || 'j.akbari@steel-msc.ir'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Organization & Level Details */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/70 text-[10px]">
                      <div className="bg-white p-2 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block font-medium">سازمان صاحب بار:</span>
                        <span className="text-slate-800 font-bold block truncate">
                          {userOrgName || 'شرکت فولاد مبارکه اصفهان'}
                        </span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block font-medium">سطح اشتراک تجاری:</span>
                        <span className="text-amber-700 font-bold block truncate">
                          پله طلایی (تخفیف ۸.۵٪)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 2. Account Privileges and Status */}
                  <div className="space-y-2 text-xs">
                    <div className="text-[11px] font-bold text-slate-500 px-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                      <span>مشخصات و دسترسی‌های مجاز حساب:</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                        <span className="text-slate-400 block font-medium">نوع دسترسی پرتال:</span>
                        <div className="flex items-center gap-1 text-emerald-700 font-bold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>مدیر ارشد حساب (Full Access)</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                        <span className="text-slate-400 block font-medium">اعتبار تخصیص‌یافته:</span>
                        <div className="font-mono text-slate-800 font-bold">
                          {(INITIAL_SHIPPER_TIER.availableCreditRials / 10).toLocaleString('fa-IR')} تومان
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                        <span className="text-slate-400 block font-medium">پوشش بیمه تمام‌خطر:</span>
                        <div className="text-slate-700 font-bold">
                          پوشش کامل ۱۰۰٪ ارزش محموله
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                        <span className="text-slate-400 block font-medium">وضعیت احراز هویت:</span>
                        <div className="flex items-center gap-1 text-emerald-700 font-bold">
                          <FileCheck2 className="w-3 h-3 text-emerald-600" />
                          <span>تایید شرکتی با شناسه ملی</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. Navigation to Settings or Profile */}
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
                      <span>تنظیمات و کاربران سازمان</span>
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
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Body with Navigation Sidebar + Central Views */}
      <div className="w-full max-w-[98%] 2xl:max-w-[1700px] mx-auto px-2 sm:px-4 lg:px-6 py-6 flex flex-col lg:flex-row gap-5 flex-1 items-start">
        {/* Shipper Navigation Sidebar (Right Side in RTL) */}
        <aside className="w-full lg:w-64 shrink-0 bg-white rounded-2xl border border-slate-200 shadow-xs p-3 space-y-1.5 sticky top-20">
          <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            بخش‌های پرتال صاحب بار
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
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-right ${
                    isSelected
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${
                        isSelected
                          ? 'bg-white/20 text-white font-bold'
                          : 'bg-slate-100 text-slate-600'
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
          <div className="mt-6 pt-4 border-t border-slate-100 px-2 space-y-2">
            <div className="text-[11px] text-slate-500 font-medium">پشتیبانی اختصاصی سازمانی:</div>
            <a
              href="tel:02188000000"
              className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-950 border border-slate-200 text-xs font-bold transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span className="font-mono">۰۲۱-۸۸۰۰۰۰۰۰</span>
            </a>
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
            />
          )}

          {activeTab === 'quote' && (
            <ShipperQuoteBookingView
              onOrderCreated={(newLoad) => {
                setSelectedShipmentForTracking(newLoad);
              }}
              onNavigateTab={(tab) => setActiveTab(tab as any)}
            />
          )}

          {activeTab === 'shipments' && (
            <ShipperShipmentsView initialSelectedShipment={selectedShipmentForTracking} />
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

