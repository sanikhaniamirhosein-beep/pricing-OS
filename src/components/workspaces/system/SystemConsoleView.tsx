import React, { useState } from 'react';
import {
  Sliders,
  Server,
  Code2,
  Cpu,
  Activity,
  Globe2,
  Lock,
  Fuel,
  CreditCard,
  CheckCircle2,
  Copy,
  Zap,
  Truck,
  Compass,
  PlugZap,
  Users,
  Database,
  Plus,
  Edit2,
  Trash2,
  Shield,
  ShieldCheck,
  Check,
  DollarSign,
} from 'lucide-react';
import { usePricing } from '../../../store/PricingContext';
import { RBACUsersView } from './RBACUsersView';
import { ExpenseManagementView } from './expenses/ExpenseManagementView';

interface SystemConsoleViewProps {
  activeSubTab?: string;
  onSubTabChange?: (tab: string) => void;
  onNavigateToContracts?: (contractId?: string) => void;
}

export const SystemConsoleView: React.FC<SystemConsoleViewProps> = ({
  activeSubTab = 'fleet_master',
  onSubTabChange,
  onNavigateToContracts,
}) => {
  const {
    isSovereignMode,
    setIsSovereignMode,
    fleetCategories,
    geoZones,
    connectors,
    rbacRoles,
    openTransportOrgModal,
  } = usePricing();

  const [localTab, setLocalTab] = useState<string>('fleet_master');
  const currentTab = activeSubTab || localTab;

  const handleTabSelect = (tab: string) => {
    setLocalTab(tab);
    if (onSubTabChange) onSubTabChange(tab);
  };

  const [apiRequestBody, setApiRequestBody] = useState(
    JSON.stringify(
      {
        originCity: 'تهران',
        destinationCity: 'بندرعباس',
        vehicleType: 'کشنده یخچال‌دار',
        cargoWeightTons: 22,
        isColdChain: true,
        isHazardous: false,
        isPeakSeason: false,
      },
      null,
      2
    )
  );
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isCallingApi, setIsCallingApi] = useState(false);

  const handleTestApi = async () => {
    setIsCallingApi(true);
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: apiRequestBody,
      });
      const data = await res.json();
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (e: any) {
      setApiResponse(JSON.stringify({ error: e.message }, null, 2));
    } finally {
      setIsCallingApi(false);
    }
  };

  const tabs = [
    { id: 'fleet_master', labelFa: 'داده‌های پایه ناوگان و ظرفیت‌ها', labelEn: 'Fleet Master Data', icon: Database },
    { id: 'expenses', labelFa: 'مدیریت هزینه‌ها و سقف بودجه', labelEn: 'Expense & Budget Control', icon: DollarSign },
    { id: 'zones_corridors', labelFa: 'مدیریت مناطق، فواصل و عوارض', labelEn: 'Zones & Corridors', icon: Compass },
    { id: 'connectors', labelFa: 'هاب اتصالات (سوخت، GPS، TMS، گمرک)', labelEn: 'Connectors Hub', icon: PlugZap },
    { id: 'model_registry', labelFa: 'رجیستری مدل‌های خارجی و ML', labelEn: 'Model Registry', icon: Code2 },
    { id: 'rbac_access', labelFa: 'مدیریت کاربران و دسترسی‌ها (RBAC)', labelEn: 'Users & Roles', icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#D3D1C7] p-6 rounded-3xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E1F5EE] border border-[#9FE1CB] flex items-center justify-center text-[#085041]">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-[#2C2C2A] text-lg font-display">
                  کنسول سیستم و داده‌های پایه (System Console)
                </h1>
                <span className="bg-[#E1F5EE] text-[#04342C] border border-[#9FE1CB] px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">
                  APIs, Connectors & Fleet Master
                </span>
              </div>
              <p className="text-[#5F5E5A] mt-0.5 text-xs">
                مدیریت انواع ناوگان جاده‌ای، مناطق و کریدورها، اتصالات آنلاین (سوخت/ETC/GPS)، مدل‌های ML و دسترسی‌های کاربران
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#D3D1C7] pb-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabSelect(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#085041] text-white shadow-xs font-bold'
                  : 'text-[#5F5E5A] bg-[#FAFAF8] hover:bg-[#F1EFE8] hover:text-[#2C2C2A] border border-[#D3D1C7]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#9FE1CB]' : 'text-[#888780]'}`} />
              <span>{tab.labelFa}</span>
            </button>
          );
        })}
      </div>

      {/* Subtab 1: Fleet Master Data */}
      {currentTab === 'fleet_master' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#D3D1C7] p-6 rounded-3xl shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D3D1C7] pb-4">
              <div>
                <h3 className="font-bold text-[#2C2C2A] text-base font-display">
                  دسته‌بندی و مشخصات فنی ناوگان حمل‌ونقل (Fleet Master Data)
                </h3>
                <p className="text-[#5F5E5A] text-xs mt-1">
                  مشخصات ظرفیت وزنی، حجم محفظه، تعداد محور و ضرایب پایه استهلاک انواع کشنده و تریلر
                </p>
              </div>
              <button
                type="button"
                onClick={() => openTransportOrgModal('drivers')}
                className="flex items-center gap-2 px-4 py-2 bg-[#085041] hover:bg-[#04342C] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
              >
                <Truck className="w-4 h-4 text-[#9FE1CB]" />
                <span>پرونده مدارک رانندگان و ناوگان</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 font-mono text-xs">
              {(fleetCategories || []).map((fleet, idx) => (
                <div
                  key={idx}
                  className="bg-[#FAFAF8] border border-[#D3D1C7] p-5 rounded-2xl space-y-3 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#2C2C2A] font-sans text-sm">{fleet.nameFa}</span>
                      <span className="bg-[#E1F5EE] text-[#04342C] px-2 py-0.5 rounded border border-[#9FE1CB] font-mono font-bold text-[11px]">
                        {fleet.code}
                      </span>
                    </div>
                    <p className="text-[#888780] font-sans text-xs">{fleet.nameEn}</p>
                  </div>

                    <div className="bg-white p-3 rounded-xl border border-[#D3D1C7] space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-[#5F5E5A] font-sans">ظرفیت ناخالص مجاز:</span>
                        <span className="font-bold text-[#2C2C2A]">{fleet.maxWeightTons || fleet.capacityTons || 22} تن</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5F5E5A] font-sans">تعداد محور و کلاس عوارض:</span>
                        <span className="font-bold text-[#085041]">{fleet.axleCount || 4} محور</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5F5E5A] font-sans">مصرف گازوئیل در ۱۰۰ کیلومتر:</span>
                        <span className="font-bold text-[#2C2C2A]">{fleet.fuelConsumptionLitersPer100Km || 32} لیتر</span>
                      </div>
                    </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subtab: Expense & Budget Management */}
      {currentTab === 'expenses' && (
        <ExpenseManagementView onNavigateToContracts={onNavigateToContracts} />
      )}

      {/* Subtab 2: Zones & Corridors */}
      {currentTab === 'zones_corridors' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#D3D1C7] p-6 rounded-3xl shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#D3D1C7] pb-4">
              <div>
                <h3 className="font-bold text-[#2C2C2A] text-base font-display">
                  مدیریت زون‌ها، ماتریس فواصل و عوارض آزادراهی (Zones & Corridors)
                </h3>
                <p className="text-[#5F5E5A] text-xs mt-1">
                  پیکربندی پهنه‌های ترانزیتی، بنادر اصلی، قطب‌های صنعتی و عوارض ETC
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 font-mono text-xs">
              {(geoZones || []).map((zone, idx) => (
                <div
                  key={idx}
                  className="bg-[#FAFAF8] border border-[#D3D1C7] p-5 rounded-2xl space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#2C2C2A] font-sans text-sm">{zone.nameFa || zone.provinceFa}</span>
                    <span className="bg-[#E1F5EE] text-[#04342C] px-2 py-0.5 rounded border border-[#9FE1CB] font-mono font-bold text-[11px]">
                      {zone.zoneCode || zone.code || zone.id}
                    </span>
                  </div>
                  <p className="text-[#5F5E5A] font-sans text-xs">{zone.descriptionFa || zone.nameEn || zone.provinceFa}</p>
                  <div className="bg-white p-3 rounded-xl border border-[#D3D1C7] space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#5F5E5A] font-sans">استان و مرکز زون:</span>
                      <span className="font-bold text-[#2C2C2A]">{zone.provinceFa} {zone.cityFa ? `(${zone.cityFa})` : ''}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5F5E5A] font-sans">ضریب سختی کوهستانی:</span>
                      <span className="font-bold text-[#085041]">{zone.difficultyMultiplier ? `${zone.difficultyMultiplier}x` : '1.0x'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 3: Connectors Hub */}
      {currentTab === 'connectors' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#D3D1C7] rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-[#E1F5EE] text-[#085041] border border-[#9FE1CB]">
                  <Fuel className="w-6 h-6" />
                </div>
                <span className="text-xs text-[#04342C] font-bold bg-[#E1F5EE] px-3 py-1 rounded-full border border-[#9FE1CB]">
                  متصل (Online)
                </span>
              </div>
              <h4 className="font-bold text-[#2C2C2A] text-base font-display">فید نرخ سوخت و گازوئیل ناوگان</h4>
              <p className="text-[#5F5E5A] text-xs leading-relaxed">
                استعلام آنلاین ضریب تعدیل سوخت از سامانه شرکت ملی پخش با مکانیزم خودکار Fallback.
              </p>
              <div className="bg-[#FAFAF8] p-4 rounded-2xl border border-[#D3D1C7] text-xs font-mono space-y-2 shadow-xs">
                <div className="flex justify-between">
                  <span className="text-[#5F5E5A] font-sans">ضریب جاری سوخت:</span>
                  <span className="text-[#04342C] font-bold">1.04x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5F5E5A] font-sans">آخرین پایش:</span>
                  <span className="text-[#2C2C2A] font-medium">۵ دقیقه قبل</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#D3D1C7] rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-[#E1F5EE] text-[#085041] border border-[#9FE1CB]">
                  <CreditCard className="w-6 h-6" />
                </div>
                <span className="text-xs text-[#04342C] font-bold bg-[#E1F5EE] px-3 py-1 rounded-full border border-[#9FE1CB]">
                  متصل (Online)
                </span>
              </div>
              <h4 className="font-bold text-[#2C2C2A] text-base font-display">عوارض الکترونیکی آزادراه‌ها (ETC)</h4>
              <p className="text-[#5F5E5A] text-xs leading-relaxed">
                محاسبه اتوماتیک عوارض مسیر بر اساس دسته‌بندی اکسل و کلاس خودروهای سنگین.
              </p>
              <div className="bg-[#FAFAF8] p-4 rounded-2xl border border-[#D3D1C7] text-xs font-mono space-y-2 shadow-xs">
                <div className="flex justify-between">
                  <span className="text-[#5F5E5A] font-sans">تعرفه عوارض:</span>
                  <span className="text-[#085041] font-bold">مصوب سازمان راهداری</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5F5E5A] font-sans">نرخ موفقیت فراخوانی:</span>
                  <span className="text-[#085041] font-bold">۹۹.۹۸٪</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#D3D1C7] rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-[#E1F5EE] text-[#085041] border border-[#9FE1CB]">
                  <Server className="w-6 h-6" />
                </div>
                <span className="text-xs text-[#04342C] font-bold bg-[#E1F5EE] px-3 py-1 rounded-full border border-[#9FE1CB]">
                  متصل (Online)
                </span>
              </div>
              <h4 className="font-bold text-[#2C2C2A] text-base font-display">سامانه تله‌ماتیک و ردیابی GPS</h4>
              <p className="text-[#5F5E5A] text-xs leading-relaxed">
                دریافت موقعیت مکانی ناوگان جهت تخمین دقیق زمان انتظار در بارگیری و تخلیه.
              </p>
              <div className="bg-[#FAFAF8] p-4 rounded-2xl border border-[#D3D1C7] text-xs font-mono space-y-2 shadow-xs">
                <div className="flex justify-between">
                  <span className="text-[#5F5E5A] font-sans">نودهای فعال:</span>
                  <span className="text-[#085041] font-bold">۱,۴۲۰ کشنده</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5F5E5A] font-sans">تاخیر داده:</span>
                  <span className="text-[#2C2C2A] font-medium">&lt; ۲ ثانیه</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 4: Model Registry */}
      {currentTab === 'model_registry' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#D3D1C7] p-6 rounded-3xl shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#D3D1C7] pb-4">
              <div>
                <h3 className="font-bold text-[#2C2C2A] text-base font-display">
                  رجیستری مدل‌های هوشمند و پیش‌بینی تقاضا (External Model Registry)
                </h3>
                <p className="text-[#5F5E5A] text-xs mt-1">
                  مدل‌های هوش مصنوعی پیش‌بینی تقاضای فصلی و بهینه‌سازی بار برگشت با سوئیچ ایمن قطعی (Deterministic Fallback)
                </p>
              </div>
              <span className="text-xs bg-[#E1F5EE] text-[#04342C] px-3 py-1 rounded-full border border-[#9FE1CB] font-mono font-bold">
                حاکمیت کامل حاشیه سود فعال
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-[#FAFAF8] border border-[#D3D1C7] rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-[#2C2C2A] text-xs">مدل ML پیش‌بینی تقاضای کریدور جنوب:</h4>
                  <span className="bg-[#E1F5EE] text-[#04342C] px-2 py-0.5 rounded text-[10px] font-mono font-bold">Active v2.4</span>
                </div>
                <p className="text-[#5F5E5A] text-xs">
                  تنظیم خودکار ضریب تقاضا در زمان ورود کشتی‌های فله به بنادر شهید رجایی و امام خمینی.
                </p>
                <div className="p-3 bg-white border border-[#D3D1C7] rounded-xl text-xs space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#5F5E5A] font-sans">وضعیت Fallback:</span>
                    <span className="text-[#085041] font-bold">سیاست تعرفه مصوب (Base Matrix)</span>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-[#FAFAF8] border border-[#D3D1C7] rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-[#2C2C2A] text-xs">مدل هوشمند تخمین زمان معطلی گمرک:</h4>
                  <span className="bg-[#E1F5EE] text-[#04342C] px-2 py-0.5 rounded text-[10px] font-mono font-bold">Active v1.8</span>
                </div>
                <p className="text-[#5F5E5A] text-xs">
                  محاسبه حق توقف (Demurrage) پیش از ارسال بارنامه بر اساس ترافیک گمرکات مرزی.
                </p>
                <div className="p-3 bg-white border border-[#D3D1C7] rounded-xl text-xs space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#5F5E5A] font-sans">دقت پیش‌بینی:</span>
                    <span className="text-[#085041] font-bold">۹۴.۲٪</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 5: RBAC & Permissions */}
      {currentTab === 'rbac_access' && <RBACUsersView />}
    </div>
  );
};
