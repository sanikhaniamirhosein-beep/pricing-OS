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
  CloudRain,
  CreditCard,
  CheckCircle2,
  Copy,
  Zap,
} from 'lucide-react';
import { usePricing } from '../../../store/PricingContext';

interface SystemConsoleViewProps {
  activeSubTab?: string;
  onSubTabChange?: (tab: 'connectors' | 'api' | 'residency' | 'nodes') => void;
}

export const SystemConsoleView: React.FC<SystemConsoleViewProps> = ({
  activeSubTab,
  onSubTabChange,
}) => {
  const { isSovereignMode, setIsSovereignMode, environment } = usePricing();
  const [localActiveTab, setLocalActiveTab] = useState<'connectors' | 'api' | 'residency' | 'nodes'>('connectors');
  const activeTab = (activeSubTab as any) || localActiveTab;
  const setActiveTab = (tab: 'connectors' | 'api' | 'residency' | 'nodes') => {
    setLocalActiveTab(tab);
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

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-bold text-slate-900 text-base font-display">کنسول زیرساخت، اتصالات و پورتال توسعه‌دهندگان (System Console)</h2>
            <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-lg font-mono text-xs font-bold">
              APIs, Connectors & Sovereign Hosting
            </span>
          </div>
          <p className="text-slate-500 mt-1 text-xs">
            مدیریت کانکتورهای نرخ سوخت و عوارض آزادراهی، حاکمیت داده درون‌مرزی (OQ-02) و مستندات زنده API
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('connectors')}
          className={`px-4 py-2.5 rounded-xl font-semibold transition-all cursor-pointer text-xs ${
            activeTab === 'connectors' ? 'bg-amber-500 text-white font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          کانکتورهای خارجی (Connectors)
        </button>
        <button
          onClick={() => setActiveTab('api')}
          className={`px-4 py-2.5 rounded-xl font-semibold transition-all cursor-pointer text-xs ${
            activeTab === 'api' ? 'bg-amber-500 text-white font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          تست زنده API و Swagger (Developer Portal)
        </button>
        <button
          onClick={() => setActiveTab('residency')}
          className={`px-4 py-2.5 rounded-xl font-semibold transition-all cursor-pointer text-xs ${
            activeTab === 'residency' ? 'bg-amber-500 text-white font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          حاکمیت داده و استقرار محلی (Sovereign Mode)
        </button>
        <button
          onClick={() => setActiveTab('nodes')}
          className={`px-4 py-2.5 rounded-xl font-semibold transition-all cursor-pointer text-xs ${
            activeTab === 'nodes' ? 'bg-amber-500 text-white font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          وضعیت نودهای محاسباتی (Runtime Health)
        </button>
      </div>

      {/* Tab 1: Connectors */}
      {activeTab === 'connectors' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-amber-50 text-amber-900 border border-amber-200">
                <Fuel className="w-6 h-6" />
              </div>
              <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                متصل (Online)
              </span>
            </div>
            <h4 className="font-bold text-slate-900 text-base font-display">شاخص سوخت گازوئیل ناوگان</h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              استعلام آنلاین ضریب تعدیل سوخت از سامانه شرکت ملی پخش فرآورده‌های نفتی.
            </p>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-mono space-y-2 shadow-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">ضریب اعمالی:</span>
                <span className="text-amber-900 font-bold">1.04x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">آخرین پایش:</span>
                <span className="text-slate-700 font-medium">۵ دقیقه قبل</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-sky-50 text-sky-800 border border-sky-200">
                <CreditCard className="w-6 h-6" />
              </div>
              <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                متصل (Online)
              </span>
            </div>
            <h4 className="font-bold text-slate-900 text-base font-display">عوارض الکترونیکی آزادراه‌ها (ETC)</h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              محاسبه اتوماتیک عوارض مسیر بر اساس دسته‌بندی اکسل و کلاس خودروهای سنگین.
            </p>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-mono space-y-2 shadow-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">تعرفه عوارض:</span>
                <span className="text-sky-800 font-bold">نسخه ۱۴۰۵ مصوب</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">نرخ موفقیت فراخوانی:</span>
                <span className="text-emerald-700 font-bold">۹۹.۹۸٪</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200">
                <CloudRain className="w-6 h-6" />
              </div>
              <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                متصل (Online)
              </span>
            </div>
            <h4 className="font-bold text-slate-900 text-base font-display">راهداری و وضعیت جوی گردنه‌ها</h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              پایش برخط وضعیت راه‌های کوهستانی و فعال‌سازی خودکار ضریب برف‌گیر.
            </p>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-mono space-y-2 shadow-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">گردنه‌های بحرانی:</span>
                <span className="text-indigo-800 font-bold">گردنه اسدآباد، حیران، زاغه</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Live API Tester */}
      {activeTab === 'api' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-bold text-slate-900 font-display text-sm flex items-center gap-2">
                <Code2 className="w-5 h-5 text-amber-600" />
                درخواست استعلام قیمت (POST /api/quote)
              </span>
              <span className="text-emerald-700 font-mono text-xs font-bold bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">REST JSON</span>
            </div>

            <textarea
              rows={12}
              value={apiRequestBody}
              onChange={(e) => setApiRequestBody(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-amber-500"
            />

            <button
              type="button"
              onClick={handleTestApi}
              disabled={isCallingApi}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer text-xs shadow-sm"
            >
              {isCallingApi ? 'در حال ارسال درخواست...' : 'ارسال درخواست به موتور قیمت‌گذاری'}
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-bold text-slate-900 font-display text-sm">پاسخ سرور و ردگیری تصمیم (Response & Trace):</span>
              <span className="text-sky-800 font-mono text-xs font-bold bg-sky-50 px-2.5 py-0.5 rounded border border-sky-200">200 OK</span>
            </div>

            <pre className="bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono text-xs text-slate-800 overflow-y-auto max-h-[300px] leading-relaxed">
              {apiResponse || '// برای مشاهده خروجی قطعی، دکمه ارسال را کلیک کنید.'}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: Sovereign Mode (OQ-02) */}
      {activeTab === 'residency' && (
        <div className="max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 text-indigo-800 font-bold text-base font-display">
            <Cpu className="w-5 h-5" />
            <span>حاکمیت داده و استقرار تمام‌محلی درون‌مرزی (Sovereign Residency - OQ-02)</span>
          </div>

          <p className="text-slate-600 text-xs leading-relaxed">
            بر اساس الزامات پدافند غیرعامل و قوانین داده‌های لجستیک کشوری، کلیه محاسبات نرخ، پایگاه‌های داده و مدل‌های هوش مصنوعی
            می‌توانند در حالت کاملاً ایزوله (Air-gapped) روی زیرساخت محلی مراکز داده داخلی اجرا گردند.
          </p>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-bold text-slate-900 block text-xs font-display">وضعیت حالت حاکمیت داده (Sovereign Mode):</span>
              <span className="text-slate-500 text-xs mt-1 block">
                {isSovereignMode
                  ? 'فعال: تمامی ترافیک و مدل‌ها روی سرورهای داخلی مسیریابی می‌شوند.'
                  : 'غیرفعال: حالت ابری هیبرید با همگام‌سازی توزیع‌شده.'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsSovereignMode(!isSovereignMode)}
              className={`px-5 py-2.5 rounded-xl font-bold transition-all cursor-pointer text-xs shrink-0 ${
                isSovereignMode
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {isSovereignMode ? 'فعال (Sovereign)' : 'غیرفعال (Hybrid)'}
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Nodes Health */}
      {activeTab === 'nodes' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono">
          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs">
            <span className="text-slate-500 font-sans block text-xs font-medium">تاخیر پاسخگویی موتور (Latency P99)</span>
            <span className="text-xl font-bold text-emerald-700 mt-2 block font-display">۲۸ میلی‌ثانیه</span>
            <span className="text-xs text-slate-500 font-sans mt-1 block">هدف SLA: کمتر از ۸۰ms</span>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs">
            <span className="text-slate-500 font-sans block text-xs font-medium">نرخ موفقیت کش توزیع‌شده</span>
            <span className="text-xl font-bold text-sky-800 mt-2 block font-display">۹۸.۶٪</span>
            <span className="text-xs text-slate-500 font-sans mt-1 block">تخلیه آنی در زمان انتشار پکیج</span>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs">
            <span className="text-slate-500 font-sans block text-xs font-medium">پایداری سرویس (Uptime)</span>
            <span className="text-xl font-bold text-emerald-700 mt-2 block font-display">۹۹.۹۹٪</span>
            <span className="text-xs text-slate-500 font-sans mt-1 block">بدون وقفه عملیاتی</span>
          </div>
        </div>
      )}
    </div>
  );
};
