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
  Warehouse,
  DollarSign,
  Briefcase,
  AlertTriangle,
  FileSpreadsheet,
  LifeBuoy,
  Lock,
  Users,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePricing } from '../../store/PricingContext';
import {
  SHIPPER_ROLE_DETAILS,
  SHIPPER_AVAILABLE_LOCATIONS,
  ShipperUserRole,
  getShipperRoleDetail,
} from '../../data/shipperRolesConfig';
import { ShipperDashboardView } from './ShipperDashboardView';
import { ShipperQuoteBookingView } from './ShipperQuoteBookingView';
import { ShipperShipmentsView } from './ShipperShipmentsView';
import { ShipperContractsView } from './ShipperContractsView';
import { ShipperBillingView } from './ShipperBillingView';
import { ShipperMasterDataView } from './ShipperMasterDataView';
import { ShipperAnalyticsView } from './ShipperAnalyticsView';
import { ShipperSettingsView } from './ShipperSettingsView';
import { ShipperRetailNotificationsView } from './ShipperRetailNotificationsView';
import { ShipperSupportIncidentsView } from './ShipperSupportIncidentsView';
import { ShipperBatchOrdersView } from './ShipperBatchOrdersView';
import { ShipperOrgProfileModal } from './ShipperOrgProfileModal';
import { AICoPilotDrawer } from '../common/AICoPilotDrawer';
import { RoleAccessGuard } from '../common/RoleAccessGuard';
import { ShipperActiveLoad } from '../../data/mockShipperData';
import { checkShipperProfileCompleteness } from '../../types/shipperLegal';

interface ShipperPortalLayoutProps {
  onLogout: () => void;
  onSwitchToCarrierPortal?: () => void;
}

export const ShipperPortalLayout: React.FC<ShipperPortalLayoutProps> = ({
  onLogout,
}) => {
  const {
    userName,
    setUserName,
    userOrgName,
    userEmail,
    setUserEmail,
    currentShipperOrg,
    shipperUserRole,
    setShipperUserRole,
    shipperLocationScope,
    setShipperLocationScope,
    shipperApprovalLimitToman,
    setShipperApprovalLimitToman,
    isShipperOrgModalOpen,
    setIsShipperOrgModalOpen,
    openShipperOrgModal,
  } = usePricing();

  const currentRoleDetail = getShipperRoleDetail(shipperUserRole);

  const isRetail =
    currentShipperOrg?.entityType === 'individual' ||
    userOrgName?.includes('شخصی') ||
    userOrgName?.includes('خرد') ||
    shipperUserRole === 'Individual Shipper / Personal';

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'quote' | 'batch_orders' | 'shipments' | 'support' | 'contracts' | 'billing' | 'master_data' | 'analytics' | 'settings' | 'notifications'
  >('dashboard');

  const [activeLoads, setActiveLoads] = useState<ShipperActiveLoad[]>(currentShipperOrg.activeLoads);

  // Sync active loads whenever active organization changes
  useEffect(() => {
    if (currentShipperOrg?.activeLoads) {
      setActiveLoads(currentShipperOrg.activeLoads);
    }
  }, [currentShipperOrg]);

  // Adjust active tab if switching between retail and corporate modes
  useEffect(() => {
    if (isRetail && activeTab === 'settings') {
      setActiveTab('notifications');
    } else if (!isRetail && activeTab === 'notifications') {
      setActiveTab('settings');
    }
  }, [isRetail, activeTab]);

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

  const handleRoleSwitch = (newRole: ShipperUserRole) => {
    const detail = getShipperRoleDetail(newRole);
    setShipperUserRole(newRole);
    setUserName(detail.defaultUserName);
    setUserEmail(detail.defaultUserEmail);
    if (detail.locationScoped) {
      setShipperLocationScope(detail.defaultLocation);
    } else {
      setShipperLocationScope('همه انبارها و کارخانجات');
    }
    if (detail.hasApprovalLimit) {
      setShipperApprovalLimitToman(detail.defaultApprovalLimitToman);
    } else {
      setShipperApprovalLimitToman(0);
    }

    // Auto navigate to a valid tab if current tab is not allowed for this role
    if (!detail.allowedTabs.includes(activeTab)) {
      setActiveTab(detail.allowedTabs[0] as any);
    }
  };

  const navigationItems = isRetail
    ? [
        { id: 'dashboard', label: 'داشبورد اصلی', icon: LayoutDashboard, badge: undefined },
        { id: 'quote', label: 'استعلام و ثبت سفارش', icon: Calculator, badge: 'نرخ آنی' },
        { id: 'batch_orders', label: 'ثبت دسته‌ای بار (اکسل)', icon: FileSpreadsheet, badge: 'جدید' },
        { id: 'shipments', label: 'مدیریت و رهگیری بارها', icon: Truck, badge: `${(activeLoads || []).length} بار` },
        { id: 'support', label: 'پشتیبانی و حوادث حین حمل', icon: LifeBuoy, badge: '۲ تیکت' },
        { id: 'contracts', label: 'قراردادها و تخفیف‌ها', icon: ShieldCheck, badge: 'پله طلایی' },
        { id: 'billing', label: 'امور مالی و صورتحساب‌ها', icon: Receipt, badge: undefined },
        { id: 'master_data', label: 'اطلاعات پایه و آدرس‌ها', icon: BookOpen, badge: undefined },
        { id: 'analytics', label: 'گزارش‌ها و تحلیل‌ها', icon: BarChart3, badge: undefined },
        { id: 'notifications', label: 'تنظیمات اطلاع‌رسانی پیامک / ایمیل', icon: Bell, badge: 'فعال' },
      ]
    : [
        { id: 'dashboard', label: 'داشبورد اصلی', icon: LayoutDashboard, badge: undefined },
        { id: 'quote', label: 'استعلام و ثبت سفارش', icon: Calculator, badge: 'نرخ آنی' },
        { id: 'batch_orders', label: 'ثبت دسته‌ای بار (اکسل)', icon: FileSpreadsheet, badge: 'جدید' },
        { id: 'shipments', label: 'مدیریت و رهگیری بارها', icon: Truck, badge: `${(activeLoads || []).length} بار` },
        { id: 'support', label: 'پشتیبانی و حوادث حین حمل', icon: LifeBuoy, badge: '۲ تیکت' },
        { id: 'contracts', label: 'قراردادها و تخفیف‌ها', icon: ShieldCheck, badge: 'پله طلایی' },
        { id: 'billing', label: 'امور مالی و صورتحساب‌ها', icon: Receipt, badge: undefined },
        { id: 'master_data', label: 'اطلاعات پایه و انبارها', icon: BookOpen, badge: undefined },
        { id: 'analytics', label: 'گزارش‌ها و تحلیل‌ها', icon: BarChart3, badge: undefined },
        { id: 'settings', label: 'تنظیمات و تیم سازمانی', icon: Settings, badge: undefined },
      ];

  // Allowed roles dictionary for each tab to inform users who can access locked tabs
  const tabAllowedRolesMap: Record<string, string[]> = {
    dashboard: ['مدیر ارشد زنجیره تامین و لجستیک', 'کارشناس لجستیک و هماهنگی بار', 'مدیر مالی و امور حسابداری', 'صاحب بار شخصی / حقیقی'],
    quote: ['مدیر ارشد زنجیره تامین و لجستیک', 'کارشناس لجستیک و هماهنگی بار', 'صاحب بار شخصی / حقیقی'],
    batch_orders: ['مدیر ارشد زنجیره تامین و لجستیک', 'کارشناس لجستیک و هماهنگی بار', 'صاحب بار شخصی / حقیقی'],
    shipments: ['مدیر ارشد زنجیره تامین و لجستیک', 'کارشناس لجستیک و هماهنگی بار', 'مسئول انبار / اپراتور اعزام بار', 'صاحب بار شخصی / حقیقی'],
    support: ['مدیر ارشد زنجیره تامین و لجستیک', 'کارشناس لجستیک و هماهنگی بار', 'مسئول انبار / اپراتور اعزام بار', 'صاحب بار شخصی / حقیقی'],
    contracts: ['مدیر ارشد زنجیره تامین و لجستیک', 'مدیر مالی و امور حسابداری', 'صاحب بار شخصی / حقیقی'],
    billing: ['مدیر ارشد زنجیره تامین و لجستیک', 'مدیر مالی و امور حسابداری', 'صاحب بار شخصی / حقیقی'],
    master_data: ['مدیر ارشد زنجیره تامین و لجستیک', 'کارشناس لجستیک و هماهنگی بار', 'مسئول انبار / اپراتور اعزام بار', 'صاحب بار شخصی / حقیقی'],
    analytics: ['مدیر ارشد زنجیره تامین و لجستیک', 'مدیر مالی و امور حسابداری', 'صاحب بار شخصی / حقیقی'],
    settings: ['مدیر ارشد زنجیره تامین و لجستیک', 'مدیر مالی و امور حسابداری'],
    notifications: ['صاحب بار شخصی / حقیقی', 'Individual Shipper / Personal'],
  };

  const isCurrentTabAllowed = currentRoleDetail.allowedTabs.includes(activeTab);
  const currentTabItem = navigationItems.find((item) => item.id === activeTab);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col antialiased selection:bg-sky-500/20 selection:text-sky-900">
      {/* 1. Shipper Minimal Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs">
        <div className="w-full max-w-[98%] 2xl:max-w-[1700px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Logo & Portal Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-600 to-teal-600 text-white flex items-center justify-center font-black text-base shadow-xs">
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
                {userOrgName || currentShipperOrg?.nameFa || 'شرکت صاحب بار'} • سامانه مدیریت لجستیک شرکتی
              </p>
            </div>
          </div>

          {/* Center: Org & Active Role Badge */}
          <div className="hidden md:flex items-center gap-3 bg-slate-50/90 px-3.5 py-1.5 rounded-2xl border border-sky-100/80">
            {/* Header Company/User Button */}
            {(() => {
              const isRetail = currentShipperOrg?.entityType === 'individual' || userOrgName?.includes('شخصی') || userOrgName?.includes('خرد');
              const profileCheck = checkShipperProfileCompleteness(currentShipperOrg);
              return (
                <button
                  type="button"
                  id="shipper-header-org-identity-btn"
                  onClick={() => openShipperOrgModal('basic')}
                  className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-sky-50 text-slate-800 hover:text-sky-900 text-xs font-bold rounded-xl border border-slate-200 hover:border-sky-300 transition-all cursor-pointer shadow-2xs group"
                  title={isRetail ? 'مشاهده و ویرایش مدارک احراز هویت فردی (شاهکار و ثبت احوال)' : 'مشاهده و ویرایش مشخصات، پرونده حقوقی و مدارک ثبتی شرکت'}
                >
                  {isRetail ? (
                    <User className="w-3.5 h-3.5 text-sky-600 group-hover:scale-110 transition-transform shrink-0" />
                  ) : (
                    <Building2 className="w-3.5 h-3.5 text-sky-600 group-hover:scale-110 transition-transform shrink-0" />
                  )}
                  <span className="truncate max-w-[180px]">{userOrgName || currentShipperOrg?.nameFa || 'شرکت صاحب بار'}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-medium ${
                      profileCheck.isComplete
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800 animate-pulse'
                    }`}
                  >
                    {profileCheck.isComplete ? 'تکمیل' : 'نقص مدارک'}
                  </span>
                </button>
              );
            })()}

            <span className="text-slate-300">|</span>

            {/* Active Role Indicator */}
            <div className="flex items-center gap-1.5 text-xs text-sky-900 bg-sky-50 px-2.5 py-1 rounded-xl border border-sky-200">
              <Briefcase className="w-3.5 h-3.5 text-sky-600" />
              <span className="font-bold">{currentRoleDetail.titleFa}</span>
            </div>

            {/* Location Scope Indicator for Warehouse Operator */}
            {currentRoleDetail.locationScoped && (
              <>
                <span className="text-slate-300">|</span>
                <div
                  title={shipperLocationScope}
                  className="flex items-center gap-1.5 text-[11px] text-amber-900 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 font-bold max-w-xs sm:max-w-sm md:max-w-md"
                >
                  <Warehouse className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="truncate">{shipperLocationScope}</span>
                </div>
              </>
            )}

            {/* Financial Approval Limit for Specialist */}
            {currentRoleDetail.hasApprovalLimit && (
              <>
                <span className="text-slate-300">|</span>
                <div className="flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 font-mono font-bold">
                  <DollarSign className="w-3 h-3 text-emerald-600" />
                  <span>سقف: {(shipperApprovalLimitToman / 1000000).toLocaleString('fa-IR')} م تومان</span>
                </div>
              </>
            )}
          </div>

          {/* Right Controls: Quick Quote + AI CoPilot Button + User Menu */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Price Inquiry Button */}
            {currentRoleDetail.canCreateOrders && (
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
            )}

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
            </div>

            <div className="h-5 w-px bg-slate-200" />

            {/* User Profile & Role Switcher Dropdown */}
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
                    {userName || currentRoleDetail.defaultUserName}
                  </div>
                  <div className="text-[10px] text-sky-800 font-medium leading-tight">
                    {currentRoleDetail.titleFa}
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
                    className="absolute left-0 mt-2.5 w-88 sm:w-96 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl shadow-2xl p-4 z-50 space-y-3.5 text-xs"
                  >
                    {/* User Identity Card */}
                    <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-sky-100 space-y-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-600 to-teal-600 text-white font-bold text-base flex items-center justify-center shrink-0 shadow-xs">
                          {userName ? userName.substring(0, 1) : 'ص'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate">
                            {userName || currentRoleDetail.defaultUserName}
                          </div>
                          <div className="text-[11px] text-sky-800 font-bold truncate mt-0.5">
                            {currentRoleDetail.titleFa}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono truncate mt-0.5 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{userEmail || currentRoleDetail.defaultUserEmail}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/70 text-[10px]">
                        <div className="bg-white p-2 rounded-xl border border-slate-100">
                          <span className="text-slate-400 block font-medium">سازمان:</span>
                          <span className="text-slate-800 font-bold block truncate">
                            {userOrgName || currentShipperOrg?.nameFa || 'شرکت صاحب بار'}
                          </span>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-slate-100">
                          <span className="text-slate-400 block font-medium">سطح دسترسی:</span>
                          <span className="text-sky-800 font-bold block truncate">
                            {currentRoleDetail.levelBadge}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Role Switcher (Persona Testing) */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-800 flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-sky-600" />
                          تغییر نقش کاربری جهت شبیه‌سازی دسترسی‌ها:
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-1.5">
                        {SHIPPER_ROLE_DETAILS.map((r) => {
                          const isCurrent = shipperUserRole === r.role;
                          return (
                            <button
                              key={r.id}
                              type="button"
                              onClick={() => handleRoleSwitch(r.role)}
                              className={`w-full p-2 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                                isCurrent
                                  ? 'bg-sky-50 border-sky-400 font-bold text-sky-950 shadow-2xs'
                                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    isCurrent ? 'bg-sky-600 ring-2 ring-sky-300' : 'bg-slate-300'
                                  }`}
                                />
                                <div>
                                  <div className="text-xs">{r.titleFa}</div>
                                  <div className="text-[10px] text-slate-400 font-mono">{r.titleEn}</div>
                                </div>
                              </div>
                              <span className="text-[9px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                                {r.levelBadge}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Navigation to Settings or Notifications */}
                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                      {isRetail ? (
                        <button
                          type="button"
                          id="btn-dropdown-retail-notifications"
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            setActiveTab('notifications');
                          }}
                          className="flex-1 py-2 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Bell className="w-3.5 h-3.5 text-sky-600" />
                          <span>تنظیمات اطلاع‌رسانی پیامک / ایمیل</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          id="btn-dropdown-corporate-settings"
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            setActiveTab('settings');
                          }}
                          className="flex-1 py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Settings className="w-3.5 h-3.5 text-slate-500" />
                          <span>مدیریت تیم و دسترسی‌ها</span>
                        </button>
                      )}

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

        {/* Top Role Governance Banner */}
        <div className="w-full bg-gradient-to-r from-sky-50 via-teal-50 to-sky-50 border-t border-b border-sky-100/80 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sky-950 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              نقش فعال: {currentRoleDetail.titleFa}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600 text-[11px]">{currentRoleDetail.accessScopeFa}</span>
          </div>

          {currentRoleDetail.locationScoped && (
            <div className="flex items-center gap-1.5 text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded-lg font-medium text-[11px]">
              <Warehouse className="w-3.5 h-3.5 text-amber-700" />
              <span>موقعیت تحت نظارت: <strong>{shipperLocationScope}</strong> (تنها بارهای این انبار فیلتر و نمایش داده می‌شوند)</span>
            </div>
          )}

          {currentRoleDetail.hasApprovalLimit && (
            <div className="flex items-center gap-1.5 text-emerald-900 bg-emerald-100/70 px-2 py-0.5 rounded-lg font-medium text-[11px]">
              <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
              <span>سقف تصویب مستقیم: <strong>{(shipperApprovalLimitToman / 1000000).toLocaleString('fa-IR')} میلیون تومان</strong> (مبالغ بالاتر نیازمند تایید مدیر است)</span>
            </div>
          )}
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
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-3 space-y-2 sticky top-28 backdrop-blur-xs">
            <div className="px-2 py-1.5 flex items-center justify-between border-b border-slate-100 mb-1">
              {!isSidebarCompact ? (
                <span className="text-[11px] font-bold text-sky-900/60 uppercase tracking-wider font-mono">
                  بخش‌های پورتال صاحب بار
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
                const isAllowed = currentRoleDetail.allowedTabs.includes(item.id);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id as any)}
                    title={
                      isSidebarCompact
                        ? isAllowed
                          ? item.label
                          : `${item.label} (قفل برای نقش ${currentRoleDetail.titleFa})`
                        : undefined
                    }
                    className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-xs font-bold transition-all duration-150 cursor-pointer text-right ${
                      isSelected
                        ? isAllowed
                          ? 'bg-gradient-to-r from-sky-600 to-teal-600 text-white shadow-xs'
                          : 'bg-slate-800 text-amber-300 shadow-xs border border-slate-700'
                        : isAllowed
                        ? 'text-slate-700 hover:bg-sky-50/60 hover:text-sky-950'
                        : 'text-slate-400 hover:bg-slate-100/80 hover:text-slate-600 opacity-75'
                    }`}
                  >
                    <div className={`flex items-center ${isSidebarCompact ? 'justify-center w-full' : 'gap-2.5'}`}>
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isSelected
                            ? isAllowed
                              ? 'text-white'
                              : 'text-amber-400'
                            : isAllowed
                            ? 'text-sky-700'
                            : 'text-slate-400'
                        }`}
                      />
                      {!isSidebarCompact && (
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="truncate">{item.label}</span>
                          {!isAllowed && (
                            <span
                              title={`دسترسی برای نقش ${currentRoleDetail.titleFa} قفل است`}
                              className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-700 border border-amber-500/20 font-normal shrink-0"
                            >
                              <Lock className="w-2.5 h-2.5" />
                              قفل
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {!isSidebarCompact && item.badge && isAllowed && (
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

            {/* Active User Persona Widget in Sidebar Bottom */}
            {!isSidebarCompact && (
              <div className="mt-4 pt-3 border-t border-slate-100 px-2 space-y-2">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center justify-between">
                  <span>نقش و اختیارات جاری</span>
                  <span className="text-sky-700 font-mono text-[9px] font-bold">
                    {currentRoleDetail.allowedTabs.length}/{navigationItems.length} بخش مجاز
                  </span>
                </div>
                <div className="p-2.5 bg-[#F8FAFC] border border-sky-100 rounded-2xl space-y-1 text-xs">
                  <div className="font-bold text-slate-800 truncate">{currentRoleDetail.titleFa}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{currentRoleDetail.titleEn}</div>
                  <div className="text-[10px] text-sky-800 font-medium mt-1">
                    {currentRoleDetail.departmentFa}
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Central View Switcher */}
        <main className="flex-1 min-w-0 w-full">
          {!isCurrentTabAllowed ? (
            <RoleAccessGuard
              sectionTitleFa={currentTabItem?.label || activeTab}
              currentRoleTitleFa={currentRoleDetail.titleFa}
              currentRoleTitleEn={currentRoleDetail.titleEn}
              departmentFa={currentRoleDetail.departmentFa}
              dutiesFa={currentRoleDetail.dutiesFa}
              allowedRolesForSection={tabAllowedRolesMap[activeTab] || []}
              onBackToAllowed={() => setActiveTab(currentRoleDetail.allowedTabs[0] as any)}
              onOpenRoleSwitcher={() => setIsUserDropdownOpen(true)}
              isShipper={true}
            />
          ) : (
            <>
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

              {activeTab === 'notifications' && <ShipperRetailNotificationsView />}
            </>
          )}
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

      {/* Shipper Organization Profile & Legal Dossier Modal */}
      <ShipperOrgProfileModal
        isOpen={isShipperOrgModalOpen}
        onClose={() => setIsShipperOrgModalOpen(false)}
      />
    </div>
  );
};
