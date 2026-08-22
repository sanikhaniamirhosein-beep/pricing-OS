import React from 'react';
import {
  Layers,
  FlaskConical,
  ShieldCheck,
  LineChart,
  Sliders,
  ChevronDown,
  ChevronLeft,
  FileSpreadsheet,
  SlidersHorizontal,
  FolderKanban,
  FileText,
  Percent,
  Activity,
  AlertTriangle,
  History,
  TrendingUp,
  Cpu,
  Code2,
  PlugZap,
  CheckCircle2,
  ShieldAlert,
  GitCompare,
  Building2,
  CreditCard,
  DollarSign,
  Compass,
  Database,
  Users,
  Radio,
} from 'lucide-react';

export interface WorkspaceItem {
  id: string;
  nameFa: string;
  nameEn: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
  subItems?: {
    id: string;
    labelFa: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

export const WORKSPACE_NAV_ITEMS: WorkspaceItem[] = [
  {
    id: 'design',
    nameFa: '۱. استودیو و طراحی تعرفه',
    nameEn: 'Commercial & Pricing Studio',
    badge: 'اسکیما و قوانین',
    icon: Layers,
    subItems: [
      { id: 'schema', labelFa: 'سازنده اسکیما و موجودیت‌ها', icon: Database },
      { id: 'geomapping', labelFa: 'ماتریس جغرافیایی و زون‌بندی', icon: Compass },
      { id: 'rules_dsl', labelFa: 'موتور قوانین قیمت‌گذاری و DSL', icon: SlidersHorizontal },
    ],
  },
  {
    id: 'contracts',
    nameFa: '۲. تخفیف‌ها و قراردادها',
    nameEn: 'Discounts & Contract Studio',
    badge: 'دفترچه‌ها و بار برگشت',
    icon: Building2,
    subItems: [
      { id: 'price_books', labelFa: 'دفترچه‌های قیمت شرکتی', icon: FileText },
      { id: 'discount_strategies', labelFa: 'استراتژی‌های تخفیف و بار برگشت', icon: Percent },
    ],
  },
  {
    id: 'validation',
    nameFa: '۳. آزمایشگاه شبیه‌سازی',
    nameEn: 'Validation Lab & Simulation',
    badge: 'Replay و حساسیت',
    icon: FlaskConical,
    subItems: [
      { id: 'historical_replay', labelFa: 'شبیه‌سازی داده‌های تاریخی (Replay)', icon: History },
      { id: 'sensitivity', labelFa: 'تحلیل حساسیت، دریافتی راننده و ریسک', icon: TrendingUp },
    ],
  },
  {
    id: 'governance',
    nameFa: '۴. برج مراقبت و انتشار',
    nameEn: 'Control Tower & Deployment',
    badge: 'تایید دوطرفه و Diff',
    icon: ShieldCheck,
    subItems: [
      { id: 'maker_checker', labelFa: 'کارتابل تایید دوطرفه و Diff Viewer', icon: ShieldCheck },
      { id: 'packages_release', labelFa: 'بسته‌های استراتژی و انتشار Canary', icon: Layers },
    ],
  },
  {
    id: 'operations',
    nameFa: '۵. مانیتورینگ زنده و پایش',
    nameEn: 'Live Operations & Observability',
    badge: 'زیر ۵۰ms و تله‌متری',
    icon: Activity,
    subItems: [
      { id: 'live_dashboard', labelFa: 'داشبورد عملیات زنده و ترافیک', icon: Radio },
      { id: 'price_debugger', labelFa: 'دیباگر و ردیابی شفافیت قیمت', icon: Code2 },
    ],
  },
  {
    id: 'financials',
    nameFa: '۶. امور مالی و تسویه',
    nameEn: 'Financials & Settlement',
    badge: 'کمیسیون و اعتبار',
    icon: DollarSign,
    subItems: [
      { id: 'commission_splits', labelFa: 'مدیریت کمیسیون و سهم ذینفعان', icon: DollarSign },
      { id: 'credit_settlement', labelFa: 'تسویه حساب و موتور بلک‌لیست', icon: CreditCard },
    ],
  },
  {
    id: 'system',
    nameFa: '۷. تنظیمات و اتصال‌ها',
    nameEn: 'System Settings & Integrations',
    badge: 'RBAC و راهداری',
    icon: Sliders,
    subItems: [
      { id: 'rbac_access', labelFa: 'مدیریت کاربران و دسترسی‌ها (RBAC)', icon: Users },
      { id: 'integrations_hub', labelFa: 'هاب کانکتورها و وب‌سرویس‌ها', icon: PlugZap },
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
  return (
    <aside className="w-full lg:w-68 xl:w-72 shrink-0 select-none">
      <div className="bg-white border border-slate-200 rounded-3xl p-3 shadow-xs sticky top-24 space-y-2">
        {/* Sidebar Header Title */}
        <div className="px-3 py-2 flex items-center justify-between border-b border-slate-100 mb-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            فضاهای کاری و تنظیمات تعرفه
          </span>
          <span className="text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            ۷ فضای اصلی سیستم‌عامل
          </span>
        </div>

        {/* 7 Workspaces Navigation List */}
        <div className="space-y-1.5">
          {WORKSPACE_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeWorkspaceId === item.id;

            return (
              <div
                key={item.id}
                className={`rounded-2xl transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-50/60 border border-amber-200/90 shadow-2xs'
                    : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                {/* Main Workspace Item Button */}
                <button
                  type="button"
                  onClick={() => onSelectWorkspace(item.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-right cursor-pointer transition-colors ${
                    isActive ? 'text-amber-950 font-bold' : 'text-slate-700 font-semibold hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                        isActive
                          ? 'bg-amber-500 text-white shadow-xs scale-105'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs block font-display">{item.nameFa}</span>
                      <span className="text-[10px] text-slate-400 font-mono block">{item.nameEn}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-medium ${
                          isActive
                            ? 'bg-amber-200/80 text-amber-950'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive ? (
                      <ChevronDown className="w-3.5 h-3.5 text-amber-700" />
                    ) : (
                      <ChevronLeft className="w-3.5 h-3.5 text-slate-400 opacity-60" />
                    )}
                  </div>
                </button>

                {/* Sub-items (List from Top to Bottom) */}
                {isActive && item.subItems && item.subItems.length > 0 && (
                  <div className="px-2 pb-2 pt-1 space-y-1 border-t border-amber-200/50 mt-1 mr-3 border-r-2 border-r-amber-400/80 pr-2">
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
                          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-right text-xs transition-all cursor-pointer ${
                            isSubActive
                              ? 'bg-amber-500 text-white font-bold shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
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
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer Info */}
        <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100 mt-2 text-[11px] text-slate-500 space-y-1">
          <div className="flex justify-between items-center">
            <span>موتور قیمت‌گذاری:</span>
            <span className="font-mono font-bold text-emerald-700">قطعی (نسخه ۱.۱)</span>
          </div>
          <div className="flex justify-between items-center">
            <span>گاردریل حاشیه سود:</span>
            <span className="font-mono font-bold text-slate-800">کف ۱۵.۰٪ فعال</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
