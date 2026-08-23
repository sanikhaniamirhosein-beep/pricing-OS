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
    nameFa: '۱. استودیو طراحی تجاری',
    nameEn: 'Commercial Design Studio',
    icon: Layers,
    subItems: [
      { id: 'catalog', labelFa: 'کاتالوگ خدمات و محصولات', labelEn: 'Catalog Studio', icon: Database },
      { id: 'pricing', labelFa: 'استودیوی قیمت‌گذاری و بوم قانون', labelEn: 'Pricing Studio & Rules', icon: SlidersHorizontal },
      { id: 'matrix', labelFa: 'ماتریس چندبعدی و زون‌ها', labelEn: 'Multi-D Matrix & Zones', icon: Compass },
      { id: 'eligibility', labelFa: 'واجدشرایطی و محدودیت ناوگان', labelEn: 'Eligibility Studio', icon: ShieldCheck },
      { id: 'discounts', labelFa: 'استراتژی تخفیفات و بودجه', labelEn: 'Discount Studio', icon: Percent },
      { id: 'contracts', labelFa: 'قراردادهای سازمانی و مذاکره', labelEn: 'Contract Studio', icon: FileText },
    ],
  },
  {
    id: 'validation',
    nameFa: '۲. آزمایشگاه اعتبارسنجی',
    nameEn: 'Validation Lab',
    icon: FlaskConical,
    badge: '۱۰,۰۰۰ بارنامه',
    subItems: [
      { id: 'single_quote', labelFa: 'پیش‌نمایش و استعلام تک‌محموله', labelEn: 'Single Shipment Preview', icon: Code2 },
      { id: 'batch_sim', labelFa: 'شبیه‌سازی دسته‌ای ۱۰,۰۰۰ بارنامه', labelEn: 'Batch Simulation', icon: Activity },
      { id: 'historical_replay', labelFa: 'بازپخش تاریخی اثر مالی', labelEn: 'Historical Replay', icon: History },
      { id: 'feasibility', labelFa: 'امکان‌سنجی عملیاتی و ظرفیت ناوگان', labelEn: 'Operational Feasibility', icon: TrendingUp },
      { id: 'scenario_compare', labelFa: 'مقایسه سناریوهای تعرفه A/B', labelEn: 'Scenario Comparison', icon: Layers },
    ],
  },
  {
    id: 'governance',
    nameFa: '۳. برج مراقبت و حاکمیت',
    nameEn: 'Control Tower',
    icon: ShieldCheck,
    badge: 'BR-012',
    subItems: [
      { id: 'approval_inbox', labelFa: 'کارتابل تایید دوطرفه (Maker-Checker)', labelEn: 'Maker-Checker Queue', icon: ShieldCheck },
      { id: 'strategy_packages', labelFa: 'مدیریت بسته‌های استراتژی', labelEn: 'Strategy Packages', icon: Layers },
      { id: 'release_scheduler', labelFa: 'زمان‌بندی انتشار و توزیع قناری', labelEn: 'Canary Release Scheduler', icon: Radio },
      { id: 'rollback_breakglass', labelFa: 'کنسول بازگشت فوری و اضطراری', labelEn: 'Rollback & Break-Glass', icon: Sliders },
    ],
  },
  {
    id: 'intelligence',
    nameFa: '۴. مرکز هوشمندی و پایش',
    nameEn: 'Intelligence Hub',
    icon: TrendingUp,
    subItems: [
      { id: 'executive_kpis', labelFa: 'داشبورد مدیریتی و عملکرد شعب', labelEn: 'Executive KPIs', icon: Radio },
      { id: 'route_profitability', labelFa: 'تحلیل سودآوری مسیر و بازگشت خالی', labelEn: 'Route Profitability', icon: TrendingUp },
      { id: 'leakage_tracking', labelFa: 'ردیابی نشت تخفیف زیر کف ۱۵٪', labelEn: 'Discount Leakage', icon: Percent },
      { id: 'anomaly_alerts', labelFa: 'هشدار ناهنجاری سوخت و کریدورها', labelEn: 'Anomaly Alerts', icon: Activity },
      { id: 'ai_suggestions', labelFa: 'پیشنهادات بهینه‌سازی هوشمند', labelEn: 'AI Recommendations', icon: Sparkles },
    ],
  },
  {
    id: 'system',
    nameFa: '۵. کنسول سیستم و داده‌ها',
    nameEn: 'System Console',
    icon: Sliders,
    subItems: [
      { id: 'fleet_master', labelFa: 'داده‌های پایه ناوگان و ظرفیت‌ها', labelEn: 'Fleet Master Data', icon: Database },
      { id: 'zones_corridors', labelFa: 'مدیریت مناطق، فواصل و عوارض', labelEn: 'Zones, Corridors & Tolls', icon: Compass },
      { id: 'connectors', labelFa: 'هاب اتصالات (سوخت، GPS، TMS، گمرک)', labelEn: 'Connectors Hub', icon: PlugZap },
      { id: 'model_registry', labelFa: 'رجیستری مدل‌های خارجی و ML', labelEn: 'Model Registry', icon: Code2 },
      { id: 'rbac_access', labelFa: 'مدیریت کاربران و دسترسی‌ها (RBAC)', labelEn: 'Users & Roles', icon: Users },
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
              <span className="text-[11px] font-bold text-[#888780] uppercase tracking-wider font-mono">
                فضاهای کاری
              </span>
              <span className="text-[10px] font-bold text-[#04342C] bg-[#E1F5EE] px-2 py-0.5 rounded-full border border-[#9FE1CB]">
                ۵ فضای کاری
              </span>
            </div>
          ) : (
            <div className="w-full text-center">
              <span className="text-[10px] font-bold font-mono text-[#888780]">منو</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsCompact(!isCompact)}
            className="p-1 text-[#888780] hover:text-[#2C2C2A] hover:bg-[#F1EFE8] rounded-lg transition-colors cursor-pointer"
            title={isCompact ? 'گسترش منو' : 'حالت فشرده'}
          >
            {isCompact ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {/* Minimal Search Bar (when expanded) */}
        {!isCompact && (
          <div className="relative mb-2 px-1">
            <Search className="w-3.5 h-3.5 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#888780]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی فضا یا زیرمنو..."
              className="w-full pr-8 pl-3 py-1.5 bg-[#FAFAF8] hover:bg-[#F1EFE8] focus:bg-white text-xs text-[#2C2C2A] placeholder-[#888780] rounded-xl border border-[#D3D1C7] focus:border-[#9FE1CB] focus:outline-none transition-all"
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
                    ? 'bg-[#E1F5EE]/70 border border-[#9FE1CB] shadow-xs'
                    : 'hover:bg-[#FAFAF8] border border-transparent'
                }`}
              >
                {/* Main Workspace Item Button */}
                <button
                  type="button"
                  onClick={() => onSelectWorkspace(item.id)}
                  title={isCompact ? `${item.nameFa} - ${item.nameEn}` : undefined}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-right cursor-pointer transition-all duration-150 relative ${
                    isActive ? 'text-[#04342C] font-bold' : 'text-[#5F5E5A] font-medium hover:text-[#2C2C2A]'
                  }`}
                >
                  <div className={`flex items-center ${isCompact ? 'justify-center w-full' : 'gap-2.5'}`}>
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 ${
                        isActive
                          ? 'bg-[#085041] text-white shadow-xs scale-105'
                          : 'bg-[#F1EFE8] text-[#5F5E5A] group-hover:bg-[#D3D1C7]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    {!isCompact && (
                      <div className="min-w-0 flex-1">
                        <span className="text-xs block font-display leading-tight truncate">{item.nameFa}</span>
                        <span className="text-[10px] text-[#888780] font-mono block leading-tight truncate">{item.nameEn}</span>
                      </div>
                    )}
                  </div>

                  {!isCompact && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-medium truncate ${
                            isActive
                              ? 'bg-[#9FE1CB] text-[#04342C] font-bold'
                              : 'bg-[#F1EFE8] text-[#5F5E5A]'
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
                            isActive ? 'text-[#085041]' : 'text-[#888780] opacity-60'
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
                      <div className="px-2 pb-2 pt-1 space-y-1 border-t border-[#9FE1CB]/40 mt-1 mr-3 border-r-2 border-r-[#085041] pr-2">
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
                                  ? 'bg-[#085041] text-white font-bold shadow-xs'
                                  : 'text-[#5F5E5A] hover:text-[#2C2C2A] hover:bg-white'
                              }`}
                            >
                              {SubIcon && (
                                <SubIcon
                                  className={`w-3.5 h-3.5 shrink-0 ${
                                    isSubActive ? 'text-white' : 'text-[#888780]'
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
          <div className="p-2.5 bg-[#FAFAF8] rounded-2xl border border-[#D3D1C7] mt-2 text-[11px] text-[#5F5E5A] space-y-1">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#085041] animate-pulse" />
                موتور تعرفه:
              </span>
              <span className="font-mono font-bold text-[#085041]">قطعی v1.2</span>
            </div>
            <div className="flex justify-between items-center">
              <span>گاردریل کف سود:</span>
              <span className="font-mono font-bold text-[#2C2C2A]">۱۵.۰٪ فعال</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
