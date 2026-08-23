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
  Wrench,
  X,
  SlidersHorizontal,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { usePricing } from '../../../store/PricingContext';

interface OutlierItem {
  id: string;
  corridor: string;
  fleet: string;
  commodity: string;
  actualMargin: string;
  numericMargin: number;
  status: string;
  cause: string;
  recommendation: string;
  severity: 'high' | 'medium' | 'low';
  resolved?: boolean;
  resolvedMargin?: string;
  baseRateToman?: number;
  backhaulDiscountPercent?: number;
  detentionFeeToman?: number;
  marginFloor?: number;
  marginCeiling?: number;
}

export const ImpactRiskAnalysisView: React.FC = () => {
  const { addAuditLog, userName, userRole } = usePricing();
  const [baseRateAdjustmentPercent, setBaseRateAdjustmentPercent] = useState<number>(0);
  const [fuelMultiplierOverride, setFuelMultiplierOverride] = useState<number>(1.08);

  // Outliers list state
  const [outliersList, setOutliersList] = useState<OutlierItem[]>([
    {
      id: 'OUT-8891',
      corridor: 'چابهار به ارومیه',
      fleet: 'تریلی یخچالی',
      commodity: 'میگو صادراتی',
      actualMargin: '8.4%',
      numericMargin: 8.4,
      status: 'حاشیه زیر کف گاردریل (<15%)',
      cause: 'مسافت طولانی بازگشت خالی بدون تخفیف Backhaul',
      recommendation: 'افزایش نرخ پایه یا اتصال به بار برگشت سیب ارومیه',
      severity: 'high',
      baseRateToman: 42000000,
      backhaulDiscountPercent: 12,
      detentionFeeToman: 400000,
      marginFloor: 15,
      marginCeiling: 28,
      resolved: false,
    },
    {
      id: 'OUT-8892',
      corridor: 'عسلویه به تهران',
      fleet: 'تانکر گاز مایع',
      commodity: 'پروپان مایع',
      actualMargin: '31.2%',
      numericMargin: 31.2,
      status: 'حاشیه بیش از حد نرمال (>30%)',
      cause: 'انباشت سورشارژ سختی و پیک همزمان',
      recommendation: 'اعمال سقف نرخ Ceiling جهت حفظ رقابت‌پذیری با رقبا',
      severity: 'medium',
      baseRateToman: 38000000,
      backhaulDiscountPercent: 0,
      detentionFeeToman: 350000,
      marginFloor: 15,
      marginCeiling: 25,
      resolved: false,
    },
    {
      id: 'OUT-8893',
      corridor: 'یزد به شیراز',
      fleet: 'تک ۶ چرخ',
      commodity: 'کاشی و سرامیک',
      actualMargin: '13.1%',
      numericMargin: 13.1,
      status: 'حاشیه مرزی',
      cause: 'افزایش حق توقف در بارگیری کارخانه',
      recommendation: 'محاسبه شفاف هزینه Detention در پیش‌فاکتور',
      severity: 'low',
      baseRateToman: 18500000,
      backhaulDiscountPercent: 5,
      detentionFeeToman: 600000,
      marginFloor: 15,
      marginCeiling: 26,
      resolved: false,
    },
  ]);

  // Modal State for Rule Modification
  const [selectedOutlierToFix, setSelectedOutlierToFix] = useState<OutlierItem | null>(null);
  const [modalBaseRateDelta, setModalBaseRateDelta] = useState<number>(10);
  const [modalBackhaulDiscount, setModalBackhaulDiscount] = useState<number>(8);
  const [modalDetentionFee, setModalDetentionFee] = useState<number>(450000);
  const [modalMarginFloor, setModalMarginFloor] = useState<number>(15);
  const [modalMarginCeiling, setModalMarginCeiling] = useState<number>(28);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Derived Sensitivity Calculations for main workbench
  const calculatedCarrierMargin = (18.5 + baseRateAdjustmentPercent * 0.45).toFixed(1);
  const calculatedDriverPayoutToman = Math.round(28500000 * (1 + baseRateAdjustmentPercent * 0.008));
  const estimatedDriverAcceptanceRate = Math.min(
    99,
    Math.max(65, Math.round(88 + baseRateAdjustmentPercent * 0.85))
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenRuleFixModal = (item: OutlierItem) => {
    setSelectedOutlierToFix(item);
    if (item.id === 'OUT-8891') {
      setModalBaseRateDelta(12);
      setModalBackhaulDiscount(15);
      setModalDetentionFee(450000);
      setModalMarginFloor(15);
      setModalMarginCeiling(28);
    } else if (item.id === 'OUT-8892') {
      setModalBaseRateDelta(-6);
      setModalBackhaulDiscount(0);
      setModalDetentionFee(350000);
      setModalMarginFloor(15);
      setModalMarginCeiling(24);
    } else {
      setModalBaseRateDelta(5);
      setModalBackhaulDiscount(5);
      setModalDetentionFee(650000);
      setModalMarginFloor(15);
      setModalMarginCeiling(26);
    }
  };

  // Recalculate preview in modal
  const modalCalculatedMargin = selectedOutlierToFix
    ? selectedOutlierToFix.id === 'OUT-8892'
      ? Math.max(modalMarginFloor, Math.min(modalMarginCeiling, selectedOutlierToFix.numericMargin + modalBaseRateDelta * 0.8)).toFixed(1)
      : Math.max(modalMarginFloor, (selectedOutlierToFix.numericMargin + modalBaseRateDelta * 0.65 + modalBackhaulDiscount * 0.25)).toFixed(1)
    : '17.5';

  const modalCalculatedDriverPayout = selectedOutlierToFix
    ? Math.round((selectedOutlierToFix.baseRateToman || 25000000) * (1 + (modalBaseRateDelta * 0.007)) + modalDetentionFee)
    : 30000000;

  const modalCalculatedAcceptance = selectedOutlierToFix
    ? Math.min(98, Math.max(70, Math.round(75 + modalBaseRateDelta * 1.2 + (modalBackhaulDiscount > 0 ? 6 : 0))))
    : 92;

  const handleApplyRuleCorrection = () => {
    if (!selectedOutlierToFix) return;

    setOutliersList((prev) =>
      prev.map((item) =>
        item.id === selectedOutlierToFix.id
          ? {
              ...item,
              resolved: true,
              resolvedMargin: `${modalCalculatedMargin}%`,
              status: `اصلاح شده (حاشیه کالیبره: ${modalCalculatedMargin}%)`,
              severity: 'low',
            }
          : item
      )
    );

    addAuditLog({
      eventType: 'rule.modified',
      objectRef: `Rule[${selectedOutlierToFix.id} - ${selectedOutlierToFix.corridor}]`,
      actorName: userName,
      actorRole: userRole,
      details: {
        corridor: selectedOutlierToFix.corridor,
        fleet: selectedOutlierToFix.fleet,
        oldMargin: selectedOutlierToFix.actualMargin,
        newMargin: `${modalCalculatedMargin}%`,
        baseRateAdjustment: `${modalBaseRateDelta > 0 ? `+${modalBaseRateDelta}` : modalBaseRateDelta}%`,
        backhaulDiscount: `${modalBackhaulDiscount}%`,
        detentionFee: modalDetentionFee,
      },
    });

    showToast(`قاعده تعرفه کریدور "${selectedOutlierToFix.corridor}" با موفقیت کالیبره شد و به وضعیت ایمن تغییر یافت.`);
    setSelectedOutlierToFix(null);
  };

  const unresolvedCount = outliersList.filter((o) => !o.resolved).length;

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 bg-emerald-500 text-white rounded-2xl shadow-lg flex items-center justify-between text-xs font-bold animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
              unresolvedCount > 0
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            {unresolvedCount > 0 ? `${unresolvedCount} مورد نیازمند بازنگری` : 'تمامی موارد کالیبره و اصلاح شدند'}
          </span>
        </div>

        <div className="space-y-3">
          {outliersList.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                item.resolved
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                    {item.id}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900">
                    {item.corridor} ({item.fleet} - {item.commodity})
                  </h4>
                  {item.resolved ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      اصلاح شد ({item.resolvedMargin})
                    </span>
                  ) : (
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
                  )}
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

              <div className="flex items-center gap-2 shrink-0">
                <button
                  id={`fix-rule-btn-${item.id}`}
                  onClick={() => handleOpenRuleFixModal(item)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer ${
                    item.resolved
                      ? 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300'
                      : 'bg-amber-700 hover:bg-amber-800 text-white'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  {item.resolved ? 'بازنگری مجدد قاعده' : 'اصلاح قاعده تعرفه'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Fixing and Calibrating Tariff Rule */}
      {selectedOutlierToFix && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold font-title">
                      اصلاح و کالیبراسیون قاعده تعرفه
                    </h2>
                    <span className="text-[11px] font-mono font-bold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded">
                      {selectedOutlierToFix.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedOutlierToFix.corridor} ({selectedOutlierToFix.fleet} - {selectedOutlierToFix.commodity})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOutlierToFix(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Problem Diagnostic Card */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    تشخیص انحراف: {selectedOutlierToFix.status}
                  </span>
                  <span className="font-mono font-bold text-rose-700 bg-white px-2 py-0.5 rounded border border-amber-200">
                    حاشیه فعلی: {selectedOutlierToFix.actualMargin}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  <span className="font-bold">علت ریشه‌ای: </span>
                  {selectedOutlierToFix.cause}
                </p>
                <p className="text-amber-950 font-medium">
                  <span className="font-bold">راهکار پیشنهادی الگوریتم: </span>
                  {selectedOutlierToFix.recommendation}
                </p>
              </div>

              {/* Interactive Calibration Controls */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <SlidersHorizontal className="w-4 h-4 text-amber-600" />
                  <h3 className="text-xs font-bold text-slate-900">
                    پارامترهای تنظیم و اصلاح قاعده در خط لوله
                  </h3>
                </div>

                {/* Control 1: Base rate delta adjustment */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800">
                      تعدیل نرخ پایه کریدور (%):
                    </label>
                    <span className="font-mono font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {modalBaseRateDelta > 0 ? `+${modalBaseRateDelta}%` : `${modalBaseRateDelta}%`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-15"
                    max="30"
                    step="1"
                    value={modalBaseRateDelta}
                    onChange={(e) => setModalBaseRateDelta(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>-15% (کاهش نرخ)</span>
                    <span>0% (بدون تغییر)</span>
                    <span>+30% (افزایش نرخ)</span>
                  </div>
                </div>

                {/* Control 2: Backhaul Incentive */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800">
                      مشوق بار بازگشت و تخفیف مسیر دوطرفه (Backhaul Incentive):
                    </label>
                    <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      %{modalBackhaulDiscount}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    step="1"
                    value={modalBackhaulDiscount}
                    onChange={(e) => setModalBackhaulDiscount(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>0% (مسیر یک‌طرفه)</span>
                    <span>10% (همپوشانی میانگین)</span>
                    <span>25% (بار بازگشت تضمینی)</span>
                  </div>
                </div>

                {/* Control 3: Detention & Handling compensation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      حق توقف جبرانی راننده (تومان):
                    </label>
                    <input
                      type="number"
                      step="50000"
                      value={modalDetentionFee}
                      onChange={(e) => setModalDetentionFee(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono font-bold text-slate-900 focus:bg-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      کف گاردریل حاشیه سود مجاز (%):
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="25"
                      value={modalMarginFloor}
                      onChange={(e) => setModalMarginFloor(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono font-bold text-slate-900 focus:bg-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Real-time Recalculated Impact Preview */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <Sparkles className="w-4 h-4" />
                  <span>پیش‌نمایش زنده پس از اعمال اصلاحیه:</span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                    <span className="text-[10px] text-slate-400 block">حاشیه سود جدید:</span>
                    <span className="text-base font-bold font-mono text-emerald-400 block mt-0.5">
                      %{modalCalculatedMargin}
                    </span>
                    <span className="text-[9px] text-emerald-300 font-bold block mt-0.5">
                      وضعیت ایمن
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                    <span className="text-[10px] text-slate-400 block">دریافتی راننده:</span>
                    <span className="text-sm font-bold font-mono text-amber-300 block mt-0.5">
                      {modalCalculatedDriverPayout.toLocaleString('fa-IR')} <span className="text-[9px]">تومان</span>
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">
                      با احتساب توقف
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                    <span className="text-[10px] text-slate-400 block">نرخ پذیرش ناوگان:</span>
                    <span className="text-base font-bold font-mono text-blue-400 block mt-0.5">
                      %{modalCalculatedAcceptance}
                    </span>
                    <span className="text-[9px] text-blue-300 block mt-0.5">
                      پذیرش سریع
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedOutlierToFix(null)}
                  className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="button"
                  id="submit-rule-fix-btn"
                  onClick={handleApplyRuleCorrection}
                  className="px-6 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  اعمال و ثبت اصلاحیه در خط لوله تعرفه
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
