import React, { useState } from 'react';
import {
  Layers,
  FlaskConical,
  ShieldCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Percent,
  Activity,
  History,
  TrendingUp,
  Code2,
  PlugZap,
  Building2,
  CreditCard,
  DollarSign,
  Compass,
  Database,
  Users,
  Radio,
  SlidersHorizontal,
  Sliders,
  Search,
  CheckCircle2,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface WorkspaceItem {
  id: string;
  nameFa: string;
  nameEn: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
  subItems?: {
    id: string;
    labelFa: string;
    labelEn?: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

export const WORKSPACE_NAV_ITEMS: WorkspaceItem[] = [
  {
    id: 'design',
    nameFa: 'استودیو طراحی تعرفه',
    nameEn: 'Pricing Studio',
    icon: Layers,
    subItems: [
      { id: 'schema', labelFa: 'سازنده اسکیما و فیلدها', labelEn: 'Schema Builder', icon: Database },
      { id: 'geomapping', labelFa: 'ماتریس و زون‌بندی جغرافیایی', labelEn: 'Geo Zones Matrix', icon: Compass },
      { id: 'rules_dsl', labelFa: 'موتور قوانین و فرمول‌ها (DSL)', labelEn: 'Pricing Rules Engine', icon: SlidersHorizontal },
    ],
  },
  {
    id: 'contracts',
    nameFa: 'تخفیف‌ها و قراردادها',
    nameEn: 'Contracts & Discounts',
    icon: Building2,
    subItems: [
      { id: 'price_books', labelFa: 'دفترچه‌های قیمت سازمانی', labelEn: 'Price Books', icon: FileText },
      { id: 'discount_strategies', labelFa: 'استراتژی تخفیفات و بار برگشت', labelEn: 'Discount Strategies', icon: Percent },
    ],
  },
  {
    id: 'validation',
    nameFa: 'آزمایشگاه شبیه‌سازی',
    nameEn: 'Simulation Lab',
    icon: FlaskConical,
    subItems: [
      { id: 'historical_replay', labelFa: 'شبیه‌سازی داده‌های تاریخی (Replay)', labelEn: 'Historical Replay', icon: History },
      { id: 'sensitivity', labelFa: 'تحلیل حساسیت و درآمد راننده', labelEn: 'Sensitivity & Risk', icon: TrendingUp },
    ],
  },
  {
    id: 'governance',
    nameFa: 'برج مراقبت و حاکمیت',
    nameEn: 'Governance & Approval',
    icon: ShieldCheck,
    subItems: [
      { id: 'maker_checker', labelFa: 'کارتابل تایید دوطرفه (Maker-Checker)', labelEn: 'Maker-Checker Queue', icon: ShieldCheck },
      { id: 'packages_release', labelFa: 'بسته‌های استراتژی و انتشار', labelEn: 'Strategy Releases', icon: Layers },
    ],
  },
  {
    id: 'operations',
    nameFa: 'عملیات و پایش زنده',
    nameEn: 'Live Operations',
    icon: Activity,
    subItems: [
      { id: 'live_dashboard', labelFa: 'داشبورد عملیات و ترافیک لحظه‌ای', labelEn: 'Live Ops Dashboard', icon: Radio },
      { id: 'price_debugger', labelFa: 'ردیابی و شفافیت محاسبات قیمت', labelEn: 'Price Trace Debugger', icon: Code2 },
    ],
  },
  {
    id: 'financials',
    nameFa: 'امور مالی و تسویه',
    nameEn: 'Financials & Settlement',
    icon: DollarSign,
    subItems: [
      { id: 'commission_splits', labelFa: 'مدیریت تسهیم کمیسیون ذینفعان', labelEn: 'Commission Splits', icon: DollarSign },
      { id: 'credit_settlement', labelFa: 'تسویه حساب و کنترل اعتبار', labelEn: 'Credit & Settlement', icon: CreditCard },
    ],
  },
  {
    id: 'system',
    nameFa: 'تنظیمات و دسترسی‌ها',
    nameEn: 'Settings & Security',
    icon: Sliders,
    subItems: [
      { id: 'rbac_access', labelFa: 'مدیریت کاربران و دسترسی‌ها (RBAC)', labelEn: 'Users & Roles', icon: Users },
      { id: 'integrations_hub', labelFa: 'هاب اتصالات و وب‌سرویس‌ها', labelEn: 'Integrations Hub', icon: PlugZap },
    ],
  },
];

interface AppSidebarProps {
  activeWorkspaceId: string;
  onSelectWorkspace: (id: string) => void;
  activeSubTab?: string;
  onSelectSubTab?: (workspaceId: string, subTabId: string) => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activeWorkspaceId,
  onSelectWorkspace,
  activeSubTab,
  onSelectSubTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCompact, setIsCompact] = useState(false);

  const filteredItems = WORKSPACE_NAV_ITEMS.filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const matchesMain = item.nameFa.toLowerCase().includes(query) || item.nameEn.toLowerCase().includes(query);
    const matchesSub = item.subItems?.some((sub) => sub.labelFa.toLowerCase().includes(query));
    return matchesMain || matchesSub;
  });

  return (
    <aside
      className={`shrink-0 select-none transition-all duration-300 ${
        isCompact ? 'w-full lg:w-20' : 'w-full lg:w-72 xl:w-80'
      }`}
    >
      <div className="bg-white border border-slate-200/90 rounded-3xl p-3 shadow-xs sticky top-24 space-y-2 backdrop-blur-xs">
        {/* Minimal Header with Toggle */}
        <div className="px-2 py-1.5 flex items-center justify-between border-b border-slate-100 mb-1">
          {!isCompact ? (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                فضاهای کاری
              </span>
              <span className="text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/70">
                ۷ بخش
              </span>
            </div>
          ) : (
            <div className="w-full text-center">
              <span className="text-[10px] font-bold font-mono text-slate-400">منو</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsCompact(!isCompact)}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title={isCompact ? 'گسترش منو' : 'حالت فشرده'}
          >
            {isCompact ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {/* Minimal Search Bar (when expanded) */}
        {!isCompact && (
          <div className="relative mb-2 px-1">
            <Search className="w-3.5 h-3.5 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی فضا یا زیرمنو..."
              className="w-full pr-8 pl-3 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200/80 focus:border-amber-500 focus:outline-none transition-all"
            />
          </div>
        )}

        {/* Workspaces Navigation List */}
        <div className="space-y-1.5">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeWorkspaceId === item.id;

            return (
              <div
                key={item.id}
                className={`rounded-2xl transition-all duration-200 overflow-hidden ${
                  isActive
                    ? 'bg-amber-50/70 border border-amber-200/90 shadow-2xs'
                    : 'hover:bg-slate-50/80 border border-transparent'
                }`}
              >
                {/* Main Workspace Item Button */}
                <button
                  type="button"
                  onClick={() => onSelectWorkspace(item.id)}
                  title={isCompact ? `${item.nameFa} - ${item.nameEn}` : undefined}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-right cursor-pointer transition-all duration-150 relative ${
                    isActive ? 'text-amber-950 font-bold' : 'text-slate-700 font-medium hover:text-slate-900'
                  }`}
                >
                  <div className={`flex items-center ${isCompact ? 'justify-center w-full' : 'gap-2.5'}`}>
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 ${
                        isActive
                          ? 'bg-amber-500 text-white shadow-xs scale-105'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    {!isCompact && (
                      <div className="min-w-0 flex-1">
                        <span className="text-xs block font-display leading-tight truncate">{item.nameFa}</span>
                        <span className="text-[10px] text-slate-400 font-mono block leading-tight truncate">{item.nameEn}</span>
                      </div>
                    )}
                  </div>

                  {!isCompact && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-medium truncate ${
                            isActive
                              ? 'bg-amber-200/80 text-amber-950 font-bold'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      <motion.div
                        animate={{ rotate: isActive ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown
                          className={`w-3.5 h-3.5 ${
                            isActive ? 'text-amber-700' : 'text-slate-400 opacity-60'
                          }`}
                        />
                      </motion.div>
                    </div>
                  )}
                </button>

                {/* Smooth Animated Minimal Sub-items Accordion */}
                <AnimatePresence initial={false}>
                  {isActive && item.subItems && item.subItems.length > 0 && !isCompact && (
                    <motion.div
                      key={`subitems-${item.id}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22, ease: [0.04, 0.62, 0.23, 0.98] }}
                      className="overflow-hidden"
                    >
                      <div className="px-2 pb-2 pt-1 space-y-1 border-t border-amber-200/40 mt-1 mr-3 border-r-2 border-r-amber-400/80 pr-2">
                        {item.subItems.map((sub) => {
                          const SubIcon = sub.icon;
                          const isSubActive = activeSubTab === sub.id;

                          return (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => {
                                if (onSelectSubTab) {
                                  onSelectSubTab(item.id, sub.id);
                                }
                              }}
                              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-right text-xs transition-all duration-150 cursor-pointer ${
                                isSubActive
                                  ? 'bg-amber-500 text-white font-bold shadow-2xs'
                                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/90'
                              }`}
                            >
                              {SubIcon && (
                                <SubIcon
                                  className={`w-3.5 h-3.5 shrink-0 ${
                                    isSubActive ? 'text-white' : 'text-slate-400'
                                  }`}
                                />
                              )}
                              <span className="truncate text-[11px] leading-tight">{sub.labelFa}</span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Minimal Sidebar Footer Status */}
        {!isCompact && (
          <div className="p-2.5 bg-slate-50/80 rounded-2xl border border-slate-100 mt-2 text-[11px] text-slate-500 space-y-1">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                موتور تعرفه:
              </span>
              <span className="font-mono font-bold text-emerald-700">قطعی v1.2</span>
            </div>
            <div className="flex justify-between items-center">
              <span>گاردریل کف سود:</span>
              <span className="font-mono font-bold text-slate-800">۱۵.۰٪ فعال</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
