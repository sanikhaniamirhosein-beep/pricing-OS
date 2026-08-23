import React, { useState, useRef, useEffect } from 'react';
import {
  Truck,
  Calculator,
  Bell,
  CheckCircle2,
  ChevronDown,
  User,
  ShieldCheck,
  Building,
  Sparkles,
  LogOut,
  Bot,
  Mail,
  FileCheck2,
  KeyRound,
  BadgePercent,
  Layers,
  Search,
  ExternalLink,
  Sliders,
  Check,
  Clock,
  AlertCircle,
  X,
  ChevronLeft,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePricing } from '../../store/PricingContext';
import { UserRole } from '../../types/pricing';

interface HeaderProps {
  onToggleAiCoPilot: () => void;
  activeWorkspaceId: string;
  onSelectWorkspace: (id: string) => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleAiCoPilot,
  activeWorkspaceId,
  onSelectWorkspace,
  onLogout,
}) => {
  const {
    environment,
    setEnvironment,
    userRole,
    setUserRole,
    userName,
    userOrgName,
    userEmail,
    strategyPackages,
    setIsQuickQuoteOpen,
    currentCarrierOrg,
  } = usePricing();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [roleSearch, setRoleSearch] = useState('');
  const [activeMenuTab, setActiveMenuTab] = useState<'roles' | 'profile'>('roles');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const pendingApprovalsCount = (strategyPackages || []).filter(
    (p) => p && ((p.status as string) === 'In Review' || (p.environment === 'staging' && (p.status as string) === 'In Review'))
  ).length;

  const envConfig = {
    draft: {
      labelFa: 'محیط پیش‌نویس (Draft)',
      style: { backgroundColor: '#334155', color: '#F8FAFC' },
      badgeBg: 'bg-slate-700 text-slate-100',
      descFa: 'تغییرات آزمایشی بدون تاثیر بر ناوگان زنده',
    },
    staging: {
      labelFa: 'محیط آزمایشی (Staging)',
      style: { backgroundColor: '#D97706', color: '#FFFBEB' },
      badgeBg: 'bg-amber-600 text-amber-50',
      descFa: 'محیط ارزیابی، صحت‌سنجی و اخذ تاییدیه‌های حاکمیتی',
    },
    production: {
      labelFa: 'محیط عملیاتی زنده (Production)',
      style: { backgroundColor: '#0F172A', color: '#F8FAFC' },
      badgeBg: 'bg-slate-900 text-slate-100',
      descFa: 'محیط زنده اعمال بلادرنگ بر کل بارنامه‌های کشور',
    },
  }[environment] || {
    labelFa: 'محیط عملیاتی',
    style: { backgroundColor: '#0F172A', color: '#F8FAFC' },
    badgeBg: 'bg-slate-900 text-slate-100',
    descFa: '',
  };

  const roleDetails: Record<
    UserRole,
    {
      titleFa: string;
      departmentFa: string;
      permissionLevelFa: string;
      accessBadge: string;
      governanceScope: string;
      levelBadge: string;
    }
  > = {
    'Pricing Strategist': {
      titleFa: 'مدیر ارشد قیمت‌گذاری و استراتژی تعرفه',
      departmentFa: 'معاونت بازرگانی و حمل‌ونقل',
      permissionLevelFa: 'دسترسی ایجاد، ویرایش و کالیبراسیون فرمول‌های تعرفه',
      accessBadge: 'طراح تعرفه (Maker)',
      governanceScope: 'طراحی بسته تعرفه، شبیه‌سازی ماتریس و ایجاد پیشنهاد',
      levelBadge: 'سطح ۴ ارشد',
    },
    'Commercial Manager': {
      titleFa: 'مدیر تجاری و قراردادهای لجستیک',
      departmentFa: 'واحد بازرگانی و فروش سازمانی',
      permissionLevelFa: 'تایید شرایط اختصاصی، پلن تخفیفات و قراردادهای حجمی',
      accessBadge: 'ناظر تجاری',
      governanceScope: 'تخفیف‌های مشتریان خاص و تایید سبد خدمات',
      levelBadge: 'سطح ۳ مدیر',
    },
    'Contract Manager': {
      titleFa: 'مدیر امور قراردادها و تعهدات تناژ',
      departmentFa: 'امور حقوقی و قراردادهای عمده',
      permissionLevelFa: 'تنظیم و نظارت بر تعهدات تناژ ماهانه مشتریان الماس و پلاتین',
      accessBadge: 'قراردادها',
      governanceScope: 'ثبت و پایش SLA و جرائم تاخیر بارگیری',
      levelBadge: 'سطح ۳ مدیر',
    },
    'Finance Controller': {
      titleFa: 'معاونت مالی و کنترل سود عملیاتی',
      departmentFa: 'معاونت مالی و کنترل ریسک سازمانی',
      permissionLevelFa: 'نظارت بر کف حاشیه سود ۱۵٪، ضریب گازوئیل و جلوگیری از زیان',
      accessBadge: 'کنترلر مالی',
      governanceScope: 'اعمال گاردریل حاشیه سود و بررسی نشت تخفیف',
      levelBadge: 'سطح ۵ ارشد مالی',
    },
    'Governance Approver': {
      titleFa: 'کمیته حاکمیت و تصویب نهایی استراتژی',
      departmentFa: 'هیئت‌مدیره و کمیته ریسک راهبردی',
      permissionLevelFa: 'تصویب دوطرفه و انتشار بسته تعرفه به پروداکشن (Checker)',
      accessBadge: 'تصویب‌کننده نهایی (Checker)',
      governanceScope: 'بررسی ایمپکت سیستمی، گیت ارزیابی و استقرار نهایی',
      levelBadge: 'سطح ۶ حاکمیتی',
    },
    'Key Account Manager': {
      titleFa: 'مدیر حساب مشتریان کلیدی و بنادر',
      departmentFa: 'واحد پشتیبانی و مدیریت مشتریان استراتژیک',
      permissionLevelFa: 'مدیریت سفارشات پتروشیمی، صنایع فولاد و بنادر اصلی',
      accessBadge: 'مشتریان عمده',
      governanceScope: 'ارائه نرخ‌های سفارشی و رزرواسیون ناوگان خطی',
      levelBadge: 'سطح ۲ کارشناس',
    },
    'System Admin': {
      titleFa: 'راهبر ارشد زیرساخت و امنیت سیستم',
      departmentFa: 'مدیریت فناوری اطلاعات و زیرساخت سرورها',
      permissionLevelFa: 'مدیریت کلیدهای API، کانکتورهای دولتی و استقرار بومی',
      accessBadge: 'ادمین سیستم (SysAdmin)',
      governanceScope: 'مدیریت کاربران، لاگ‌های تغییرات و دسترسی‌های امنیتی',
      levelBadge: 'سطح ۷ دسترسی کل',
    },
  };

  const rolesList: UserRole[] = [
    'Pricing Strategist',
    'Commercial Manager',
    'Contract Manager',
    'Finance Controller',
    'Governance Approver',
    'Key Account Manager',
    'System Admin',
  ];

  const filteredRoles = rolesList.filter((r) => {
    if (!roleSearch.trim()) return true;
    const query = roleSearch.toLowerCase();
    const info = roleDetails[r];
    return (
      r.toLowerCase().includes(query) ||
      info.titleFa.toLowerCase().includes(query) ||
      info.accessBadge.toLowerCase().includes(query)
    );
  });

  const currentRoleInfo = roleDetails[userRole];

  return (
    <header className="relative bg-white border-b border-slate-200 text-slate-800 z-40 shadow-xs">
      {/* 0. Dedicated Environment Top Bar */}
      <div
        style={envConfig.style}
        className="w-full px-4 py-1 flex items-center justify-between text-xs font-bold transition-colors duration-200"
      >
        <div className="flex items-center gap-2 max-w-[98%] 2xl:max-w-[1700px] mx-auto w-full">
          <span className="w-2 h-2 rounded-full bg-current animate-pulse shrink-0" />
          <span className="font-title">{envConfig.labelFa}</span>
          <span className="opacity-80 font-normal hidden sm:inline">— {envConfig.descFa}</span>
          <div className="mr-auto flex items-center gap-1">
            <span className="text-[10px] opacity-75 hidden md:inline">تغییر محیط:</span>
            <button
              type="button"
              onClick={() => setEnvironment('draft')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all ${
                environment === 'draft' ? 'bg-slate-900 text-white shadow-xs' : 'opacity-70 hover:opacity-100'
              }`}
            >
              Draft
            </button>
            <button
              type="button"
              onClick={() => setEnvironment('staging')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all ${
                environment === 'staging' ? 'bg-amber-900 text-white shadow-xs' : 'opacity-70 hover:opacity-100'
              }`}
            >
              Staging
            </button>
            <button
              type="button"
              onClick={() => setEnvironment('production')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all ${
                environment === 'production' ? 'bg-white text-slate-900 shadow-xs' : 'opacity-70 hover:opacity-100'
              }`}
            >
              Production
            </button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[98%] 2xl:max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-4">
          {/* 1. Brand Identity & Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 text-amber-400 flex items-center justify-center shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 font-display">
                  سامانه مدیریت تعرفه و قیمت‌گذاری
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
                  سازمانی v1.2
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-none mt-1 hidden sm:block">
                پلتفرم هوشمند حاکمیت سیاست‌های کرایه، بارنامه و ناوگان لجستیک صنعتی
              </p>
            </div>
          </div>

          {/* 2. Action Controls: Active Organization Badge, Quick Quote, AI Assistant, Notification Popover, Minimal Profile Menu */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Logged-in Organization Identity Badge (Static - Isolated Data) */}
            <div
              id="header-org-identity"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100/90 text-slate-800 text-xs font-bold rounded-xl border border-slate-300/80 shadow-2xs max-w-[220px]"
              title="سازمان فعال احراز هویت شده"
            >
              <Building className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <span className="truncate text-[11px]">{currentCarrierOrg?.nameFa || userOrgName || 'سازمان حمل‌ونقل'}</span>
            </div>

            {/* Quick Quote Button */}
            <button
              type="button"
              id="btn-header-quick-quote"
              onClick={() => setIsQuickQuoteOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl border border-slate-800 shadow-xs transition-all duration-150 cursor-pointer"
              title="استعلام سریع و محاسبه هوشمند کرایه حمل بار"
            >
              <Calculator className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">استعلام قیمت</span>
            </button>

            {/* AI Assistant Button */}
            <div className="relative group">
              <button
                type="button"
                id="btn-header-ai-copilot"
                onClick={onToggleAiCoPilot}
                aria-label="دستیار هوش مصنوعی"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-900 text-white flex items-center justify-center shadow-xs transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                <Bot className="w-4.5 h-4.5 text-slate-100" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
              </button>

              {/* Tooltip on hover */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:flex flex-col items-center z-50 pointer-events-none">
                <div className="bg-slate-900 text-white text-[11px] font-medium px-2.5 py-1 rounded-lg shadow-lg whitespace-nowrap">
                  دستیار هوشمند تحلیل تعرفه
                </div>
              </div>
            </div>

            {/* Notification & Approvals Menu Popover */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                id="btn-header-notifications"
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsRoleDropdownOpen(false);
                }}
                className={`relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer ${
                  isNotificationsOpen ? 'bg-slate-100 text-slate-900' : ''
                }`}
                title="اعلانات و کارتابل تاییدیه"
              >
                <Bell className="w-4.5 h-4.5" />
                {pendingApprovalsCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-amber-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs animate-pulse">
                    {pendingApprovalsCount}
                  </span>
                )}
              </button>

              {/* Smooth Animated Notification Menu */}
              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute left-0 mt-2.5 w-80 sm:w-88 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 space-y-3"
                  >
                    <div className="flex items-center justify-between px-1 pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 font-title">
                        <Bell className="w-4 h-4 text-slate-800" />
                        <span>کارتابل تاییدیه و اعلانات</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full">
                        {pendingApprovalsCount} بسته در انتظار
                      </span>
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {(strategyPackages || [])
                        .filter((p) => p && p.status === 'In Review')
                        .map((pkg) => (
                          <div
                            key={pkg.packageId || pkg.displayId}
                            className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-900 font-mono">
                                {pkg.displayId} ({pkg.titleFa || pkg.titleEn})
                              </span>
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold border border-amber-200">
                                نیاز به تایید Checker
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-600 line-clamp-2">
                              {pkg.changeSummaryFa || pkg.titleEn || 'بدون توضیحات تکمیلی'}
                            </p>
                            <div className="pt-1 flex items-center justify-between text-[10px]">
                              <span className="text-slate-400 font-mono">طراح: {pkg.authorName || 'سیستم'}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setIsNotificationsOpen(false);
                                  onSelectWorkspace('governance');
                                }}
                                className="text-slate-900 font-bold hover:underline cursor-pointer flex items-center gap-1"
                              >
                                <span>مشاهده در کارتابل</span>
                                <ChevronLeft className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}

                      {pendingApprovalsCount === 0 && (
                        <div className="py-6 text-center text-xs text-slate-400 space-y-1">
                          <CheckCircle2 className="w-6 h-6 text-emerald-700 mx-auto" />
                          <p className="font-bold text-slate-800">همه تاییدیه‌ها انجام شده است</p>
                          <p className="text-[11px]">مورد معلقی در کارتابل حاکمیتی وجود ندارد.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-5 w-px bg-slate-200" />

            {/* MINIMAL USER & ROLE PANEL MENU */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                id="btn-header-role-panel"
                onClick={() => {
                  setIsRoleDropdownOpen(!isRoleDropdownOpen);
                  setIsNotificationsOpen(false);
                }}
                className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs transition-all duration-150 cursor-pointer ${
                  isRoleDropdownOpen
                    ? 'bg-slate-100 border-slate-400 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  {userName ? userName.substring(0, 1) : 'س'}
                </div>
                <div className="text-right hidden sm:block">
                  <div className="font-bold text-slate-900 text-xs leading-tight">
                    {userName || 'کاربر سیستم'}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium leading-tight">
                    {currentRoleInfo?.accessBadge || 'دسترسی سازمانی'}
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: isRoleDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </motion.div>
              </button>

              {/* Minimal Animated Dropdown Menu with Tabs */}
              <AnimatePresence>
                {isRoleDropdownOpen && (
                  <motion.div
                    id="panel-header-role-dropdown"
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute left-0 mt-2.5 w-84 sm:w-92 bg-white border border-slate-200 rounded-2xl shadow-xl p-3.5 z-50 space-y-3"
                  >
                    {/* Compact User Header Profile */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-400 font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                          {userName ? userName.substring(0, 1) : 'س'}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate">
                            {userName || 'کاربر سیستم'}
                          </div>
                          <div className="text-[10px] text-slate-700 font-medium truncate">
                            {currentRoleInfo?.titleFa}
                          </div>
                        </div>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 font-bold shrink-0">
                        {currentRoleInfo?.levelBadge}
                      </span>
                    </div>

                    {/* Segmented Menu Switcher: Roles vs Profile Details */}
                    <div className="flex bg-slate-100 p-0.5 rounded-xl text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setActiveMenuTab('roles')}
                        className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                          activeMenuTab === 'roles'
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        تغییر نقش سازمانی
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveMenuTab('profile')}
                        className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                          activeMenuTab === 'profile'
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        اختیارات و پروفایل
                      </button>
                    </div>

                    {/* Tab 1: Roles List with Search */}
                    {activeMenuTab === 'roles' && (
                      <div className="space-y-2">
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            value={roleSearch}
                            onChange={(e) => setRoleSearch(e.target.value)}
                            placeholder="جستجوی نقش سازمانی..."
                            className="w-full pr-8 pl-3 py-1.5 bg-slate-50 text-xs text-slate-900 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-slate-400 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1 max-h-48 overflow-y-auto pr-0.5">
                          {filteredRoles.map((role) => {
                            const info = roleDetails[role];
                            const isSelected = userRole === role;
                            return (
                              <button
                                key={role}
                                type="button"
                                onClick={() => {
                                  setUserRole(role);
                                  setIsRoleDropdownOpen(false);
                                }}
                                className={`w-full text-right p-2 rounded-xl transition-all flex items-center justify-between cursor-pointer border ${
                                  isSelected
                                    ? 'bg-slate-900 text-white border-slate-800 font-bold shadow-xs'
                                    : 'bg-white text-slate-800 border-transparent hover:bg-slate-50 hover:border-slate-200'
                                }`}
                              >
                                <div className="space-y-0.5 min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold truncate">{info.titleFa}</span>
                                    <span
                                      className={`text-[9px] px-1.5 py-0.2 rounded font-medium shrink-0 ${
                                        isSelected ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-100 text-slate-600'
                                      }`}
                                    >
                                      {info.accessBadge}
                                    </span>
                                  </div>
                                  <span className={`text-[10px] block truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                                    {info.permissionLevelFa}
                                  </span>
                                </div>

                                {isSelected && (
                                  <Check className="w-4 h-4 text-amber-400 shrink-0 mr-1.5" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Tab 2: Profile & Governance Details */}
                    {activeMenuTab === 'profile' && (
                      <div className="space-y-2 text-[11px]">
                        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                          <div className="flex justify-between">
                            <span className="text-slate-500">سازمان و معاونت:</span>
                            <span className="text-slate-900 font-bold truncate max-w-[180px]">
                              {userOrgName || 'سازمان مرکزی حمل‌ونقل'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">ایمیل سازمانی:</span>
                            <span className="text-slate-900 font-mono">{userEmail || 'p.sharifi@iran-freight.ir'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">سطح احراز هویت:</span>
                            <span className="text-emerald-800 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                              تایید MFA سازمانی
                            </span>
                          </div>
                        </div>

                        <div className="p-2.5 bg-slate-100 rounded-xl border border-slate-200 space-y-1">
                          <span className="text-slate-900 font-bold block">قلمرو اختیارات در سامانه:</span>
                          <p className="text-slate-700 leading-relaxed text-[10px]">
                            {currentRoleInfo.governanceScope}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Footer Actions */}
                    {onLogout && (
                      <div className="pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          id="btn-header-logout"
                          onClick={() => {
                            setIsRoleDropdownOpen(false);
                            onLogout();
                          }}
                          className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 hover:border-rose-300 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>خروج از حساب کاربری</span>
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
