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
} from 'lucide-react';
import { usePricing } from '../../store/PricingContext';
import { UserRole } from '../../types/pricing';

interface HeaderProps {
  onToggleAiCoPilot: () => void;
  activeWorkspaceId: string;
  onSelectWorkspace: (id: string) => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleAiCoPilot, activeWorkspaceId, onSelectWorkspace, onLogout }) => {
  const {
    userRole,
    setUserRole,
    userName,
    userOrgName,
    userEmail,
    strategyPackages,
    setIsQuickQuoteOpen,
  } = usePricing();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const pendingApprovalsCount = (strategyPackages || []).filter(
    (p) => p && (p.status === 'In Review' || (p.environment === 'staging' && p.status === 'In Review'))
  ).length;

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

  const currentRoleInfo = roleDetails[userRole];

  return (
    <header className="relative bg-white/95 backdrop-blur-md border-b border-slate-200/80 text-slate-800 z-40">
      <div className="w-full max-w-[98%] 2xl:max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-6">
          {/* 1. Brand Identity & Logo */}
          <div className="flex items-center gap-3.5 shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 font-display">
                  سامانه مدیریت تعرفه و قیمت‌گذاری
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  نسخه ۱.۲
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-none mt-1">
                پلتفرم هوشمند مدیریت سیاست‌های کرایه و بارنامه جاده‌ای
              </p>
            </div>
          </div>

          {/* 2. Action Controls: Minimal Quick Quote, AI Robot Button, Bell, Redesigned Role Panel */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Redesigned Minimal Quick Quote Button */}
            <button
              type="button"
              id="btn-header-quick-quote"
              onClick={() => setIsQuickQuoteOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-amber-50/60 text-slate-700 hover:text-amber-900 text-xs font-semibold rounded-xl border border-slate-200 hover:border-amber-300 shadow-2xs hover:shadow-xs transition-all duration-150 cursor-pointer"
              title="استعلام سریع و محاسبه هوشمند کرایه حمل بار"
            >
              <Calculator className="w-4 h-4 text-amber-600" />
              <span>استعلام قیمت</span>
            </button>

            {/* AI Assistant Button */}
            <div className="relative group">
              <button
                type="button"
                id="btn-header-ai-copilot"
                onClick={onToggleAiCoPilot}
                aria-label="دستیار هوش مصنوعی"
                className="w-9 h-9 rounded-xl bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center shadow-2xs hover:shadow-xs transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400/50"
              >
                <Bot className="w-4.5 h-4.5 text-white" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-white" />
              </button>

              {/* Tooltip on hover */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:flex flex-col items-center z-50 pointer-events-none">
                <div className="bg-slate-900 text-white text-[11px] font-medium px-2.5 py-1 rounded-lg shadow-lg whitespace-nowrap">
                  دستیار هوشمند تحلیل تعرفه
                </div>
              </div>
            </div>

            {/* Approval Inbox Notification Bell */}
            <button
              type="button"
              id="btn-header-notifications"
              onClick={() => onSelectWorkspace('governance')}
              className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="کارتابل تاییدیه و حاکمیت سازمانی"
            >
              <Bell className="w-4.5 h-4.5" />
              {pendingApprovalsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs animate-bounce">
                  {pendingApprovalsCount}
                </span>
              )}
            </button>

            <div className="h-5 w-px bg-slate-200" />

            {/* REDESIGNED ROLE MANAGEMENT & USER PANEL */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                id="btn-header-role-panel"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-xs transition-all cursor-pointer ${
                  isRoleDropdownOpen
                    ? 'bg-amber-50/80 border-amber-300 shadow-xs'
                    : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {userName ? userName.substring(0, 1) : 'س'}
                </div>
                <div className="text-right hidden sm:block">
                  <div className="font-bold text-slate-800 text-xs leading-tight">
                    {userName || 'کاربر سیستم'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium leading-tight">
                    {currentRoleInfo?.accessBadge || 'دسترسی سازمانی'}
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Redesigned Spacious & Clean Role Management Dropdown */}
              {isRoleDropdownOpen && (
                <div
                  id="panel-header-role-dropdown"
                  className="absolute left-0 mt-2.5 w-88 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 animate-in fade-in zoom-in-98 duration-150 space-y-4"
                >
                  {/* Current Active User Information Card */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-amber-500 text-white font-bold text-base flex items-center justify-center shrink-0 shadow-xs">
                        {userName ? userName.substring(0, 1) : 'س'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-slate-900 truncate">{userName || 'کاربر سیستم'}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-950 font-bold">
                            {currentRoleInfo?.levelBadge || 'سطح دسترسی'}
                          </span>
                        </div>
                        <div className="text-[11px] text-amber-800 font-semibold truncate mt-0.5">{currentRoleInfo?.titleFa || 'نقش کاربری'}</div>
                        <div className="text-[10px] text-slate-500 font-mono truncate mt-0.5 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{userEmail || 'p.sharifi@iran-freight.ir'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/70 text-[10px]">
                      <div className="bg-white p-2 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block font-medium">سازمان و واحد:</span>
                        <span className="text-slate-800 font-bold block truncate">
                          {userOrgName || 'سازمان مرکزی حمل‌ونقل'} ({currentRoleInfo.departmentFa})
                        </span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block font-medium">نشان دسترسی:</span>
                        <span className="text-emerald-700 font-bold block truncate">{currentRoleInfo.accessBadge}</span>
                      </div>
                    </div>

                    {/* Scope and Governance Badge */}
                    <div className="bg-amber-50/70 p-2 rounded-lg border border-amber-200/60 text-[10px]">
                      <span className="text-amber-900 block font-medium">قلمرو اختیارات سازمانی:</span>
                      <span className="text-amber-950 font-bold block mt-0.5">
                        {currentRoleInfo.governanceScope}
                      </span>
                    </div>
                  </div>

                  {/* Role Selector Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1 text-slate-500 text-[11px] font-bold">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                        مدیریت و تغییر نقش فعال در سامانه:
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">۷ نقش سازمانی</span>
                    </div>

                    <div className="space-y-1.5 max-h-56 overflow-y-auto pr-0.5">
                      {rolesList.map((role) => {
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
                            className={`w-full text-right p-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer border ${
                              isSelected
                                ? 'bg-amber-50/80 text-amber-950 border-amber-300 font-bold'
                                : 'bg-white text-slate-700 border-slate-100 hover:bg-slate-50 hover:border-slate-200'
                            }`}
                          >
                            <div className="space-y-0.5 min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold truncate">{info.titleFa}</span>
                                <span
                                  className={`text-[9px] px-1.5 py-0.2 rounded font-medium shrink-0 ${
                                    isSelected ? 'bg-amber-200 text-amber-950 font-bold' : 'bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  {info.accessBadge}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 block truncate">
                                {info.permissionLevelFa}
                              </span>
                            </div>

                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mr-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Return to Portal / Logout Action */}
                  {onLogout && (
                    <div className="pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        id="btn-header-logout"
                        onClick={() => {
                          setIsRoleDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 hover:border-rose-200 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>خروج از پنل و بازگشت به صفحه درگاه</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

