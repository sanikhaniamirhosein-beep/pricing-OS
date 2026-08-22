import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Code2,
  ShieldCheck,
  Fuel,
  TrendingUp,
  Clock,
  Wrench,
  ShieldAlert,
  Percent,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Info,
  Play,
  ArrowRight,
  Flame,
  Zap,
} from 'lucide-react';
import { usePricing } from '../../../store/PricingContext';
import { PricingRuleBlock } from '../../../types/pricing';

export const PricingRulesEngineView: React.FC = () => {
  const {
    pricingPolicy,
    updatePricingPolicyGuardrails,
    fuelIndexMultiplier,
    setFuelIndexMultiplier,
  } = usePricing();

  const [ruleBlocks, setRuleBlocks] = useState<PricingRuleBlock[]>(pricingPolicy.ruleBlocks);
  const [baseCalculationMethod, setBaseCalculationMethod] = useState<'matrix' | 'ton_km' | 'tiered'>('matrix');
  const [tonKmUnitRate, setTonKmUnitRate] = useState<number>(34000); // 34,000 Toman per ton-km
  const [minMargin, setMinMargin] = useState<number>(pricingPolicy.guardrails.minMarginPercent);
  const [maxDiscount, setMaxDiscount] = useState<number>(pricingPolicy.guardrails.maxDiscountCapPercent);
  const [guardrailAction, setGuardrailAction] = useState<'clamp' | 'reject'>(pricingPolicy.guardrails.mode);
  const [detentionHourRate, setDetentionHourRate] = useState<number>(350000);
  const [handlingBaseFee, setHandlingBaseFee] = useState<number>(800000);
  const [suppInsuranceRate, setSuppInsuranceRate] = useState<number>(0.001); // 0.1%

  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleRule = (ruleId: string) => {
    setRuleBlocks((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleSaveGuardrails = () => {
    updatePricingPolicyGuardrails(minMargin, maxDiscount, guardrailAction);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shrink-0">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 font-title">
                  ۱.۳ موتور قوانین قیمت‌گذاری و DSL (Pricing Rules & Guardrails Engine)
                </h1>
                <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {pricingPolicy.displayId}
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-medium">
                  نسخه {pricingPolicy.version}
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                تنظیم متدولوژی محاسبه کرایه پایه، سورشارژهای شناور و اعمال گاردریل کف حاشیه سود قطعی (Floor & Ceiling)
              </p>
            </div>
          </div>

          <button
            onClick={handleSaveGuardrails}
            className="px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all self-start md:self-auto cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            ذخیره و اعمال در خط لوله تعرفه
          </button>
        </div>

        {savedSuccess && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            تنظیمات گاردریل‌ها و قوانین قیمت‌گذاری با موفقیت در خط لوله فعال ذخیره شد.
          </div>
        )}
      </div>

      {/* Grid: 3 Pillars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pillar 1: Base Freight Method */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <h2 className="text-sm font-bold text-slate-900 font-title">۱. روش محاسبه کرایه پایه</h2>
          </div>

          <div className="space-y-2">
            <label
              onClick={() => setBaseCalculationMethod('matrix')}
              className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                baseCalculationMethod === 'matrix'
                  ? 'bg-amber-50/70 border-amber-300 shadow-2xs'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
              }`}
            >
              <input
                type="radio"
                name="base-method"
                checked={baseCalculationMethod === 'matrix'}
                onChange={() => setBaseCalculationMethod('matrix')}
                className="mt-1 text-amber-600 focus:ring-amber-500"
              />
              <div>
                <span className="font-bold text-xs text-slate-900 block">ماتریس مستقیم مبدأ-مقصد (Flat Route Matrix)</span>
                <span className="text-[11px] text-slate-500 leading-relaxed block mt-0.5">
                  استخراج نرخ از ماتریس جفتی شهرها با توجه به نوع ناوگان انتخابی
                </span>
              </div>
            </label>

            <label
              onClick={() => setBaseCalculationMethod('ton_km')}
              className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                baseCalculationMethod === 'ton_km'
                  ? 'bg-amber-50/70 border-amber-300 shadow-2xs'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
              }`}
            >
              <input
                type="radio"
                name="base-method"
                checked={baseCalculationMethod === 'ton_km'}
                onChange={() => setBaseCalculationMethod('ton_km')}
                className="mt-1 text-amber-600 focus:ring-amber-500"
              />
              <div>
                <span className="font-bold text-xs text-slate-900 block">فرمول تن-کیلومتر (Ton-Km Fallback Rate)</span>
                <span className="text-[11px] text-slate-500 leading-relaxed block mt-0.5">
                  فرمول: وزن (تن) × مسافت جاده‌ای (km) × ضریب نرخ واحد تن-کیلومتر
                </span>
              </div>
            </label>

            <label
              onClick={() => setBaseCalculationMethod('tiered')}
              className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                baseCalculationMethod === 'tiered'
                  ? 'bg-amber-50/70 border-amber-300 shadow-2xs'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
              }`}
            >
              <input
                type="radio"
                name="base-method"
                checked={baseCalculationMethod === 'tiered'}
                onChange={() => setBaseCalculationMethod('tiered')}
                className="mt-1 text-amber-600 focus:ring-amber-500"
              />
              <div>
                <span className="font-bold text-xs text-slate-900 block">نرخ پله‌ای مسافتی و وزنی (Tiered Distance/Weight)</span>
                <span className="text-[11px] text-slate-500 leading-relaxed block mt-0.5">
                  کاهش نرخ بر واحد با افزایش شعاع مسافت (مسافت بلند = نرخ رقابتی‌تر)
                </span>
              </div>
            </label>
          </div>

          {baseCalculationMethod === 'ton_km' && (
            <div className="bg-amber-50/50 p-3.5 rounded-2xl border border-amber-100 space-y-2 text-xs">
              <label className="block text-slate-700 font-bold">نرخ پایه هر تن-کیلومتر (تومان):</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="1000"
                  value={tonKmUnitRate}
                  onChange={(e) => setTonKmUnitRate(Number(e.target.value))}
                  className="w-full bg-white border border-amber-300 rounded-xl p-2 font-mono font-bold text-slate-900 text-sm focus:outline-none"
                />
                <span className="text-slate-500 text-xs shrink-0">تومان/تن‌کیلومتر</span>
              </div>
            </div>
          )}
        </div>

        {/* Pillar 2: Floating Surcharges & Hooks */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <h2 className="text-sm font-bold text-slate-900 font-title">۲. سورشارژها و تعدیلات سوخت</h2>
          </div>

          {/* Fuel Surcharge Hook Slider */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Fuel className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-slate-900">شاخص سوخت گازوئیل (Fuel Hook)</span>
              </div>
              <span className="font-mono font-bold text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                ×{fuelIndexMultiplier.toFixed(2)} (+{Math.round((fuelIndexMultiplier - 1) * 100)}%)
              </span>
            </div>

            <input
              type="range"
              min="1.0"
              max="1.30"
              step="0.01"
              value={fuelIndexMultiplier}
              onChange={(e) => setFuelIndexMultiplier(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              متصل به وب‌سرویس پایش قیمت لحظه‌ای فرآورده‌های نفتی و گازوئیل ناوگان
            </p>
          </div>

          {/* Detention & Handling */}
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                حق توقف ساعتی راننده (Detention/Demurrage):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="50000"
                  value={detentionHourRate}
                  onChange={(e) => setDetentionHourRate(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono font-bold text-slate-800"
                />
                <span className="text-slate-500 text-xs shrink-0">تومان/ساعت</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">
                هزینه پایه مهاربندی، لودینگ و باسکول:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="50000"
                  value={handlingBaseFee}
                  onChange={(e) => setHandlingBaseFee(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono font-bold text-slate-800"
                />
                <span className="text-slate-500 text-xs shrink-0">تومان/سرویس</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">
                نرخ بیمه تکمیلی بر اساس ارزش محموله:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.0005"
                  value={suppInsuranceRate}
                  onChange={(e) => setSuppInsuranceRate(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono font-bold text-slate-800"
                />
                <span className="text-slate-500 text-xs shrink-0">({(suppInsuranceRate * 100).toFixed(2)}٪ ارزش)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 3: Guardrails & Margin Floor */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
            <h2 className="text-sm font-bold text-slate-900 font-title">۳. گاردریل‌ها و حاشیه سود امن</h2>
          </div>

          <div className="bg-rose-50/60 border border-rose-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-rose-700" />
                کف حاشیه سود مجاز (Margin Floor)
              </span>
              <span className="font-mono font-bold text-rose-900 bg-rose-100 px-2 py-0.5 rounded text-xs">
                %{minMargin}
              </span>
            </div>

            <input
              type="range"
              min="10"
              max="30"
              step="0.5"
              value={minMargin}
              onChange={(e) => setMinMargin(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <p className="text-[11px] text-rose-800 leading-relaxed">
              هرگونه تخفیف، قرارداد سازمانی یا استراتژی که حاشیه سود را به زیر {minMargin}٪ برساند، بلافاصله توسط گاردریل مهار می‌شود.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                سقف تجمعی تخفیفات مجاز (Max Discount Cap):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="5"
                  max="50"
                  value={maxDiscount}
                  onChange={(e) => setMaxDiscount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono font-bold text-slate-800"
                />
                <span className="text-slate-500 font-bold">%</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                رفتار سیستم هنگام نقض کف حاشیه سود:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGuardrailAction('clamp')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    guardrailAction === 'clamp'
                      ? 'bg-amber-700 text-white border-amber-700 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  مهار خودکار (Clamp)
                </button>
                <button
                  type="button"
                  onClick={() => setGuardrailAction('reject')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    guardrailAction === 'reject'
                      ? 'bg-rose-700 text-white border-rose-700 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  رد استعلام (Reject)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rule Pipeline Execution Order */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-title">
              خط لوله اجرای قوانین و بلوک‌های تعرفه (Execution Pipeline Sequence)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              ترتیب تقدم و توالی اجرای بلوک‌های محاسباتی توسط موتور قطعی (Deterministic Pricing Pipeline)
            </p>
          </div>
          <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-xl">
            {ruleBlocks.filter((r) => r.enabled).length} از {ruleBlocks.length} فعال
          </span>
        </div>

        <div className="space-y-3">
          {ruleBlocks
            .sort((a, b) => a.priority - b.priority)
            .map((block, idx) => (
              <div
                key={block.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                  block.enabled
                    ? 'bg-slate-50/70 border-slate-200 hover:border-amber-300'
                    : 'bg-slate-100/50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-amber-100 text-amber-900 font-mono font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{block.nameFa}</h4>
                      <span className="text-[10px] font-mono text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {block.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">{block.nameEn}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-slate-400">
                    اولویت: {block.priority}
                  </span>
                  <button
                    onClick={() => toggleRule(block.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      block.enabled
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {block.enabled ? 'فعال در خط لوله' : 'غیرفعال'}
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
