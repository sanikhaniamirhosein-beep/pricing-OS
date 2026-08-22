import React, { useState } from 'react';
import {
  Code2,
  Play,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Fuel,
  Sparkles,
  Layers,
  Search,
  RotateCcw,
  Copy,
  Check,
} from 'lucide-react';
import { usePricing } from '../../../store/PricingContext';

export const PriceTraceDebuggerView: React.FC = () => {
  const { commodities, fleetCategories, geoZones, fuelIndexMultiplier } = usePricing();

  const [origin, setOrigin] = useState('تهران');
  const [destination, setDestination] = useState('بندرعباس');
  const [vehicle, setVehicle] = useState('تریلی کفی ۱۳.۶ متری');
  const [commodity, setCommodity] = useState('گرانول پتروشیمی');
  const [weightTons, setWeightTons] = useState(22);
  const [cargoValueMillion, setCargoValueMillion] = useState(850); // 850 million toman

  const [isCopied, setIsCopied] = useState(false);

  // Dynamic Trace Calculations
  const baseRateToman = 38500000;
  const fuelMultiplier = fuelIndexMultiplier;
  const fuelSurchargeToman = Math.round(baseRateToman * (fuelMultiplier - 1));
  const difficultySurchargeToman = Math.round(baseRateToman * 0.08); // 8% mountainous
  const commodityRiskMultiplier = 1.05;
  const commoditySurchargeToman = Math.round(baseRateToman * (commodityRiskMultiplier - 1));
  const subtotalBeforeDiscounts = baseRateToman + fuelSurchargeToman + difficultySurchargeToman + commoditySurchargeToman;
  
  const discountToman = Math.round(subtotalBeforeDiscounts * 0.05); // 5% volume rebate
  const totalCarrierFreight = subtotalBeforeDiscounts - discountToman;
  
  const rahdariTaxToman = Math.round(totalCarrierFreight * 0.04); // 4% Rahdari
  const insuranceToman = Math.round(cargoValueMillion * 1000000 * 0.001); // 0.1% of value
  const finalInvoiceTotal = totalCarrierFreight + rahdariTaxToman + insuranceToman;

  const idempotencyKey = 'IDEM-99482-A7B8C9';

  const handleCopyJsonTrace = () => {
    const traceJson = JSON.stringify(
      {
        idempotencyKey,
        timestamp: new Date().toISOString(),
        input: { origin, destination, vehicle, commodity, weightTons, cargoValueMillionToman: cargoValueMillion },
        trace: {
          baseFreight: baseRateToman,
          fuelSurcharge: fuelSurchargeToman,
          difficultySurcharge: difficultySurchargeToman,
          commodityRiskSurcharge: commoditySurchargeToman,
          subtotal: subtotalBeforeDiscounts,
          appliedDiscounts: discountToman,
          netCarrierFreight: totalCarrierFreight,
          statutoryFees: { rahdariTax: rahdariTaxToman, insurance: insuranceToman },
          finalPrice: finalInvoiceTotal,
        },
      },
      null,
      2
    );
    navigator.clipboard?.writeText(traceJson);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shrink-0">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 font-title">
                  ۵.۲ دیباگر شفافیت قیمت و ردپای محاسباتی (Price Explainability Trace)
                </h1>
                <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  درخت تفصیلی ردپا
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                مشاهده گام‌به‌گام نحوه استخراج نرخ، اعمال ضرایب سوخت و سختی، تخفیفات سازمانی و ممیزی کلید خطاناپذیری (Idempotency)
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyJsonTrace}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer self-start md:self-auto"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {isCopied ? 'JSON کپی شد' : 'کپی خروجی ساختاریافته (JSON)'}
          </button>
        </div>
      </div>

      {/* Simulator Inputs & Dynamic Trace Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Sandbox Form (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 font-title">
              ورودی‌های استعلام آزمایشی
            </h2>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">مبدأ بارگیری</label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">مقصد تخلیه</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">نوع ناوگان بارگیر</label>
                <select
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                >
                  <option value="تریلی کفی ۱۳.۶ متری">تریلی کفی ۱۳.۶ متری</option>
                  <option value="تریلی چادری ترانزیت">تریلی چادری ترانزیت</option>
                  <option value="تریلی یخچالی">تریلی یخچالی</option>
                  <option value="جفت ۱۰ چرخ">جفت ۱۰ چرخ</option>
                  <option value="خاور مسقف">خاور مسقف</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">نوع و ماهیت کالا</label>
                <select
                  value={commodity}
                  onChange={(e) => setCommodity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                >
                  <option value="گرانول پتروشیمی">گرانول پتروشیمی</option>
                  <option value="میلگرد و فولاد">میلگرد و فولاد</option>
                  <option value="فرآورده‌های لبنی">فرآورده‌های لبنی (زنجیره سرد)</option>
                  <option value="کالای عمومی تجاری">کالای عمومی تجاری</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">وزن بار (تن)</label>
                  <input
                    type="number"
                    value={weightTons}
                    onChange={(e) => setWeightTons(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">ارزش کل بار (میلیون تومان)</label>
                  <input
                    type="number"
                    value={cargoValueMillion}
                    onChange={(e) => setCargoValueMillion(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-mono">
              Idempotency Key: <span className="font-bold text-slate-800">{idempotencyKey}</span>
            </div>
          </div>
        </div>

        {/* Right: Step-by-Step Price Explainability Tree (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-title">
                  درخت تفصیلی ردپای محاسباتی (Explainability Breakdown Tree)
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Engine: Deterministic Rust Core • Execution: 12.4ms
                </p>
              </div>

              <span className="text-sm font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-xl">
                مجموع پیش‌فاکتور: {finalInvoiceTotal.toLocaleString('fa-IR')} تومان
              </span>
            </div>

            {/* Tree Steps */}
            <div className="space-y-3 text-xs">
              {/* Step 1: Base */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 font-mono font-bold text-[11px] flex items-center justify-center">
                    1
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 block">کرایه پایه مصوب کریدور (Base Freight)</span>
                    <span className="text-[11px] text-slate-500 font-mono">{origin} ➔ {destination} ({vehicle})</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  +{baseRateToman.toLocaleString('fa-IR')} تومان
                </span>
              </div>

              {/* Step 2: Fuel Surcharge */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 font-mono font-bold text-[11px] flex items-center justify-center">
                    2
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 block">سورشارژ شناور سوخت گازوئیل (Fuel Hook)</span>
                    <span className="text-[11px] text-slate-500 font-mono">ضریب شاخص سوخت: ×{fuelMultiplier.toFixed(2)}</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-amber-900 text-sm">
                  +{fuelSurchargeToman.toLocaleString('fa-IR')} تومان
                </span>
              </div>

              {/* Step 3: Route Difficulty */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-800 font-mono font-bold text-[11px] flex items-center justify-center">
                    3
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 block">ضریب سختی مسیر و عبور از گردنه کوهستانی</span>
                    <span className="text-[11px] text-slate-500 font-mono">سورشارژ کوهستانی: +۸٪</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  +{difficultySurchargeToman.toLocaleString('fa-IR')} تومان
                </span>
              </div>

              {/* Step 4: Commodity Risk */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-800 font-mono font-bold text-[11px] flex items-center justify-center">
                    4
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 block">ضریب حساسیت و ریسک کالا ({commodity})</span>
                    <span className="text-[11px] text-slate-500 font-mono">ضریب کالای صنعتی: ×{commodityRiskMultiplier}</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  +{commoditySurchargeToman.toLocaleString('fa-IR')} تومان
                </span>
              </div>

              {/* Step 5: Discounts */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-emerald-200 text-emerald-900 font-mono font-bold text-[11px] flex items-center justify-center">
                    5
                  </span>
                  <div>
                    <span className="font-bold text-emerald-950 block">تخفیف پله‌ای حجم و قرارداد سازمانی (-۵٪)</span>
                    <span className="text-[11px] text-emerald-700 font-mono">Volume Tiers Rebate Applied</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-emerald-800 text-sm">
                  -{discountToman.toLocaleString('fa-IR')} تومان
                </span>
              </div>

              {/* Step 6: Statutory Fees (Tax & Insurance) */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-slate-200 text-slate-800 font-mono font-bold text-[11px] flex items-center justify-center">
                    6
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 block">عوارض قانونی راهداری (۴٪) + بیمه مسئولیت مدنی</span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      راهداری: {rahdariTaxToman.toLocaleString('fa-IR')} ت | بیمه: {insuranceToman.toLocaleString('fa-IR')} ت
                    </span>
                  </div>
                </div>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  +{(rahdariTaxToman + insuranceToman).toLocaleString('fa-IR')} تومان
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
