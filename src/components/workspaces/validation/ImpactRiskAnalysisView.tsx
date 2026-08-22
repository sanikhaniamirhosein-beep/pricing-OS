import React, { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  Percent,
  Sliders,
  CheckCircle2,
  HelpCircle,
  Truck,
  Building,
  ArrowRight,
  Sparkles,
  Info,
} from 'lucide-react';
import { usePricing } from '../../../store/PricingContext';

export const ImpactRiskAnalysisView: React.FC = () => {
  const [baseRateAdjustmentPercent, setBaseRateAdjustmentPercent] = useState<number>(0);
  const [fuelMultiplierOverride, setFuelMultiplierOverride] = useState<number>(1.08);

  // Derived Sensitivity Calculations
  const calculatedCarrierMargin = (18.5 + baseRateAdjustmentPercent * 0.45).toFixed(1);
  const calculatedDriverPayoutToman = Math.round(28500000 * (1 + baseRateAdjustmentPercent * 0.008));
  const estimatedDriverAcceptanceRate = Math.min(
    99,
    Math.max(65, Math.round(88 + baseRateAdjustmentPercent * 0.85))
  );

  const outliersList = [
    {
      id: 'OUT-8891',
      corridor: 'چابهار به ارومیه',
      fleet: 'تریلی یخچالی',
      commodity: 'میگو صادراتی',
      actualMargin: '8.4%',
      status: 'حاشیه زیر کف گاردریل (<15%)',
      cause: 'مسافت طولانی بازگشت خالی بدون تخفیف Backhaul',
      recommendation: 'افزایش نرخ پایه یا اتصال به بار برگشت سیب ارومیه',
      severity: 'high',
    },
    {
      id: 'OUT-8892',
      corridor: 'عسلویه به تهران',
      fleet: 'تانکر گاز مایع',
      commodity: 'پروپان مایع',
      actualMargin: '31.2%',
      status: 'حاشیه بیش از حد نرمال (>30%)',
      cause: 'انباشت سورشارژ سختی و پیک همزمان',
      recommendation: 'اعمال سقف نرخ Ceiling جهت حفظ رقابت‌پذیری با رقبا',
      severity: 'medium',
    },
    {
      id: 'OUT-8893',
      corridor: 'یزد به شیراز',
      fleet: 'تک ۶ چرخ',
      commodity: 'کاشی و سرامیک',
      actualMargin: '13.1%',
      status: 'حاشیه مرزی',
      cause: 'افزایش حق توقف در بارگیری کارخانه',
      recommendation: 'محاسبه شفاف هزینه Detention در پیش‌فاکتور',
      severity: 'low',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 font-title">
                  ۳.۲ تحلیل حساسیت، درآمد راننده و کشف انحرافات (Impact & Sensitivity Lab)
                </h1>
                <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  تحلیل چندمتغیره
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                سنجش تعادل بین حاشیه سود شرکت، دریافتی رانندگان، کشش قیمتی تقاضا و شناسایی موارد پرت (Outlier Detection)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Sensitivity Workbench */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
        <div>
          <h2 className="text-base font-bold text-slate-900 font-title">
            شبیه‌ساز حساسیت پارامترهای تعرفه (Sensitivity Parameter Slider)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            با جابجایی اسلایدرها اثر تغییرات درصدی تعرفه پایه را روی خروجی‌های سیستم به صورت بلادرنگ مشاهده کنید.
          </p>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
          {/* Slider 1: Base rate delta */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                تغییر درصد نرخ پایه کریدورها:
              </span>
              <span
                className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                  baseRateAdjustmentPercent >= 0
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {baseRateAdjustmentPercent > 0 ? `+${baseRateAdjustmentPercent}%` : `${baseRateAdjustmentPercent}%`}
              </span>
            </div>
            <input
              type="range"
              min="-15"
              max="20"
              step="1"
              value={baseRateAdjustmentPercent}
              onChange={(e) => setBaseRateAdjustmentPercent(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>-15% (کاهش قیمت)</span>
              <span>0% (نرخ مبنا)</span>
              <span>+20% (افزایش قیمت)</span>
            </div>
          </div>

          {/* Slider 2: Fuel Index */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                شاخص شناور سوخت گازوئیل:
              </span>
              <span className="font-mono font-bold text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                ×{fuelMultiplierOverride.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="1.25"
              step="0.01"
              value={fuelMultiplierOverride}
              onChange={(e) => setFuelMultiplierOverride(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>×1.00 (حالت عادی)</span>
              <span>×1.25 (افزایش ۲۵٪ سوخت)</span>
            </div>
          </div>
        </div>

        {/* Live Dynamic Output Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              حاشیه سود شرکت (Company Margin)
            </span>
            <div className="text-xl font-bold font-mono text-slate-900">
              %{calculatedCarrierMargin}
            </div>
            <span className="text-[10px] text-slate-400">کف مجاز گاردریل: %۱۵.۰</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-slate-400" />
              میانگین سهم راننده (Driver Payout)
            </span>
            <div className="text-xl font-bold font-mono text-amber-900">
              {calculatedDriverPayoutToman.toLocaleString('fa-IR')} <span className="text-xs">تومان</span>
            </div>
            <span className="text-[10px] text-slate-400">به ازای هر بارنامه میانگین</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Percent className="w-3.5 h-3.5 text-slate-400" />
              پیش‌بینی نرخ پذیرش بار (Acceptance Rate)
            </span>
            <div className="text-xl font-bold font-mono text-emerald-700">
              %{estimatedDriverAcceptanceRate}
            </div>
            <span className="text-[10px] text-slate-400">احتمال پذیرش سریع توسط رانندگان ناوگان</span>
          </div>
        </div>
      </div>

      {/* Outlier & Edge Case Detection */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900 font-title">
              موتور کشف انحرافات و موارد پرت (Outlier & Edge Case Detection)
            </h2>
          </div>
          <span className="text-xs bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-0.5 rounded-full font-bold">
            {outliersList.length} مورد نیازمند بازنگری
          </span>
        </div>

        <div className="space-y-3">
          {outliersList.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                    {item.id}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900">
                    {item.corridor} ({item.fleet} - {item.commodity})
                  </h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      item.severity === 'high'
                        ? 'bg-rose-100 text-rose-800'
                        : item.severity === 'medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    حاشیه: {item.actualMargin}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  <span className="font-bold text-slate-700">علت مغایرت: </span>
                  {item.cause}
                </p>
                <p className="text-xs text-amber-900 font-medium">
                  <span className="font-bold">پیشنهاد سیستم: </span>
                  {item.recommendation}
                </p>
              </div>

              <button className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold shrink-0 transition-colors shadow-2xs">
                اصلاح قاعده تعرفه
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
