import React, { useState } from 'react';
import {
  X,
  Calculator,
  Truck,
  ArrowRight,
  Snowflake,
  Flame,
  Calendar,
  Building2,
  CheckCircle2,
  FileSearch,
  Sparkles,
  Zap,
  MapPin,
  Scale,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { usePricing } from '../../store/PricingContext';
import { ShipmentPricingContext } from '../../engine/pricingEngine';

export const QuickQuoteSandboxModal: React.FC = () => {
  const { isQuickQuoteOpen, setIsQuickQuoteOpen, calculatePrice, setSelectedTrace, contracts } = usePricing();

  const [originCity, setOriginCity] = useState('تهران');
  const [destinationCity, setDestinationCity] = useState('بندرعباس');
  const [vehicleType, setVehicleType] = useState('کشنده یخچال‌دار');
  const [cargoWeightTons, setCargoWeightTons] = useState(22);
  const [cargoType, setCargoType] = useState('مواد غذایی و فاسدشدنی');
  const [isColdChain, setIsColdChain] = useState(true);
  const [isHazardous, setIsHazardous] = useState(false);
  const [isPeakSeason, setIsPeakSeason] = useState(false);
  const [contractId, setContractId] = useState('');

  const [quoteResult, setQuoteResult] = useState<any | null>(null);

  if (!isQuickQuoteOpen) return null;

  const handleCalculate = () => {
    const ctx: ShipmentPricingContext = {
      originCity,
      destinationCity,
      vehicleType,
      cargoType,
      cargoWeightTons,
      isColdChain,
      isHazardous,
      isPeakSeason,
      customerContractId: contractId || undefined,
      channel: 'Web Portal Simulator',
    };

    const res = calculatePrice(ctx);
    setQuoteResult(res);
  };

  const handleOpenTrace = () => {
    if (quoteResult && quoteResult.trace) {
      setSelectedTrace(quoteResult.trace);
      setIsQuickQuoteOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div className="w-full max-w-2xl bg-white border border-amber-200/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header - Bright Light Theme with Amber Accent */}
        <div className="flex items-center justify-between p-5 border-b border-amber-200/80 bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 flex items-center justify-center shadow-2xs">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base font-display">
                  استعلام نرخ و شبیه‌ساز مهندسی باربری (پنل مدیریت)
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  تحلیلی
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                محاسبه بلادرنگ بر اساس پکیج فعال پروداکشن و اعتبارسنجی گاردریل‌ها
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsQuickQuoteOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            aria-label="بستن"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body - Clean Light Layout */}
        <div className="p-6 space-y-4 text-xs overflow-y-auto max-h-[75vh] bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Origin */}
            <div>
              <label className="block text-slate-700 mb-1.5 font-bold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                شهر مبدأ بارگیری:
              </label>
              <select
                value={originCity}
                onChange={(e) => setOriginCity(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-amber-200/80 rounded-xl p-2.5 text-slate-800 text-xs focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-medium"
              >
                <option value="تهران">تهران (پایانه جنوب / احمدآباد)</option>
                <option value="اصفهان">اصفهان (پایانه امیرکبیر)</option>
                <option value="مشهد">مشهد (پایانه بار شرق)</option>
                <option value="تبریز">تبریز (پایانه ترانزیت)</option>
                <option value="رشت">رشت (گیلان)</option>
                <option value="شیراز">شیراز (فارس)</option>
                <option value="اهواز">اهواز (خوزستان)</option>
                <option value="بندرعباس">بندرعباس (اسکله شهید رجایی)</option>
                <option value="بوشهر">بوشهر (گمرک منطقه ویژه)</option>
                <option value="چابهار">چابهار (بندر شهید بهشتی)</option>
                <option value="بازرگان">بازرگان (مرز ترکیه)</option>
              </select>
            </div>

            {/* Destination */}
            <div>
              <label className="block text-slate-700 mb-1.5 font-bold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                شهر مقصد تخلیه:
              </label>
              <select
                value={destinationCity}
                onChange={(e) => setDestinationCity(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-amber-200/80 rounded-xl p-2.5 text-slate-800 text-xs focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-medium"
              >
                <option value="بندرعباس">بندرعباس (اسکله شهید رجایی)</option>
                <option value="تهران">تهران (انبار مرکزی)</option>
                <option value="بوشهر">بوشهر (گمرک بنادر)</option>
                <option value="بازرگان">بازرگان (مرز ترانزیتی)</option>
                <option value="چابهار">چابهار (کریدور اقیانوسی)</option>
                <option value="اصفهان">اصفهان</option>
                <option value="مشهد">مشهد</option>
                <option value="تبریز">تبریز</option>
                <option value="شیراز">شیراز</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Vehicle Type */}
            <div>
              <label className="block text-slate-700 mb-1.5 font-bold flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-slate-500" />
                نوع ناوگان باربری:
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-amber-200/80 rounded-xl p-2.5 text-slate-800 text-xs focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-medium"
              >
                <option value="تریلی چادری">تریلی چادری ۲۴ تن (ترانزیت استاندارد)</option>
                <option value="تریلر کفی">تریلر کفی ۲۵ تن (صنعتی و کانتینری)</option>
                <option value="کشنده یخچال‌دار">کشنده یخچال‌دار ۲۰ تن (کنترل دما)</option>
                <option value="کامیون جفت ۱۵ تن">کامیون جفت ۶×۴ (۱۵ تن)</option>
                <option value="کامیون تک ۱۰ تن">کامیون تک ۴×۲ (۱۰ تن)</option>
                <option value="کمرشکن بوژی">کمرشکن بوژی ۶۰ تن (فوق سنگین)</option>
              </select>
            </div>

            {/* Cargo Weight */}
            <div>
              <label className="block text-slate-700 mb-1.5 font-bold flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-slate-500" />
                وزن خالص محموله (تن):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={cargoWeightTons}
                  onChange={(e) => setCargoWeightTons(Number(e.target.value))}
                  className="w-full bg-[#FAF8F5] border border-amber-200/80 rounded-xl p-2.5 text-slate-800 text-xs focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-mono font-bold"
                />
                <span className="text-slate-500 font-bold px-2">تن</span>
              </div>
            </div>
          </div>

          {/* Contract Selection */}
          <div>
            <label className="block text-slate-700 mb-1.5 font-bold flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              قرارداد صاحب‌کالا (اختیاری):
            </label>
            <select
              value={contractId}
              onChange={(e) => setContractId(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-amber-200/80 rounded-xl p-2.5 text-slate-800 text-xs focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-medium"
            >
              <option value="">(تعرفه عمومی استاندارد - بدون قرارداد اختصاصی)</option>
              {(contracts || []).map((cnt) => (
                <option key={cnt.contractId} value={cnt.contractId}>
                  {cnt.displayId} - {cnt.customerNameFa} ({cnt.tier})
                </option>
              ))}
            </select>
          </div>

          {/* Service Addon Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => setIsColdChain(!isColdChain)}
              className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                isColdChain
                  ? 'bg-teal-50 border-teal-400 text-teal-900 font-bold shadow-2xs'
                  : 'bg-[#FAF8F5] border-amber-200/70 text-slate-600 hover:bg-white'
              }`}
            >
              <Snowflake className="w-4 h-4 shrink-0 text-teal-600" />
              <span className="text-[11px]">زنجیره سرد (+۱۸٪)</span>
            </button>

            <button
              type="button"
              onClick={() => setIsHazardous(!isHazardous)}
              className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                isHazardous
                  ? 'bg-rose-50 border-rose-400 text-rose-900 font-bold shadow-2xs'
                  : 'bg-[#FAF8F5] border-amber-200/70 text-slate-600 hover:bg-white'
              }`}
            >
              <Flame className="w-4 h-4 shrink-0 text-rose-600" />
              <span className="text-[11px]">کالای خطرناک ADR (+۲۵٪)</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPeakSeason(!isPeakSeason)}
              className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                isPeakSeason
                  ? 'bg-amber-50 border-amber-400 text-amber-950 font-bold shadow-2xs'
                  : 'bg-[#FAF8F5] border-amber-200/70 text-slate-600 hover:bg-white'
              }`}
            >
              <Calendar className="w-4 h-4 shrink-0 text-amber-600" />
              <span className="text-[11px]">پیک بار پاییزه (+۱۵٪)</span>
            </button>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleCalculate}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              استعلام نرخ آنی و تولید ردگیری تصمیم
            </button>
          </div>

          {/* Results Area */}
          {quoteResult && (
            <div className="mt-4 p-4 bg-gradient-to-br from-[#FAF8F5] to-[#F5EFEB] border border-amber-300 rounded-2xl space-y-3 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
                <div>
                  <span className="text-slate-500 block text-[11px] font-medium">کرایه خالص پیشنهادی:</span>
                  <span className="text-xl font-black font-mono text-emerald-700">
                    {(quoteResult.finalPriceToman / 1000000).toLocaleString('fa-IR')} میلیون تومان
                  </span>
                </div>
                <div className="text-left">
                  <span className="text-slate-500 block text-[11px] font-medium">حاشیه سود عملیاتی:</span>
                  <span className="text-base font-bold font-mono text-teal-800">
                    {quoteResult.marginPercent.toLocaleString('fa-IR')}٪
                  </span>
                </div>
              </div>

              <p className="text-slate-700 text-xs leading-relaxed font-medium bg-white/80 p-2.5 rounded-xl border border-amber-100">
                {quoteResult.trace.explanationFa}
              </p>

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-500 text-[11px] font-mono">
                  ردگیری: {quoteResult.trace.traceId} (زمان: {quoteResult.trace.latencyMs}ms)
                </span>
                <button
                  type="button"
                  onClick={handleOpenTrace}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg flex items-center gap-1.5 font-bold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  <FileSearch className="w-3.5 h-3.5" />
                  مشاهده کامل ردگیری تصمیم (≤ ۳ کلیک)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
