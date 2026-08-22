import React from 'react';
import {
  Percent,
  Layers,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Sparkles,
  CheckCircle2,
  DollarSign,
  Tag,
} from 'lucide-react';
import { usePricing } from '../../../store/PricingContext';
import { DiscountPolicy } from '../../../types/pricing';

export const EligibilityDiscountView: React.FC = () => {
  const { discountPolicies } = usePricing();

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-bold text-slate-900 text-base font-display">استودیو تخفیفات و انحصار متقابل (Discount Studio)</h2>
            <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-lg font-mono text-xs font-bold">
              Stacking & Exclusivity (BR-027)
            </span>
          </div>
          <p className="text-slate-500 mt-1 text-xs">
            تنظیم تخفیفات تناژ، مشوق بار برگشت، گروه‌های عدم ترکیب همزمان، سقف ریالی و بودجه ماهانه مجاز
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {discountPolicies.map((disc) => (
          <div
            key={disc.discountId}
            className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono bg-sky-50 text-sky-900 px-2.5 py-0.5 rounded-lg border border-sky-200 font-bold">
                  {disc.displayId}@v{disc.version}
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                    disc.stackable
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-900 border-amber-200'
                  }`}
                >
                  {disc.stackable ? 'تخفیف تجمعی (Stackable)' : 'تخفیف انحصاری (Non-Stackable)'}
                </span>
              </div>

              <h4 className="font-bold text-slate-900 text-sm font-display">{disc.nameFa}</h4>
              <p className="text-slate-500 text-xs font-mono">{disc.nameEn}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600 font-sans">میزان تخفیف:</span>
                <span className="font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">{disc.valuePercent}٪</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-sans">سقف مجاز تخفیف (Cap):</span>
                <span className="font-bold text-slate-800">{disc.capPercentage}٪</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-sans">اولویت اعمال (Priority):</span>
                <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{disc.priority}</span>
              </div>
              {disc.mutualExclusivityGroup && (
                <div className="flex justify-between pt-2 border-t border-slate-200 text-xs">
                  <span className="text-slate-500 font-sans">گروه عدم انحصار:</span>
                  <span className="text-rose-700 font-medium bg-rose-50 px-2 py-0.5 rounded border border-rose-200">{disc.mutualExclusivityGroup}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
              <span>وضعیت: <strong className="text-slate-700">{disc.status}</strong></span>
              <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">کنترل گاردریل فعال</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
