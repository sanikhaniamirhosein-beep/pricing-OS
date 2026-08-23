import React from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Award,
  Clock,
  AlertCircle,
  FileCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowLeft,
  Percent,
} from 'lucide-react';
import { INITIAL_SHIPPER_TIER } from '../../data/mockShipperData';
import { usePricing } from '../../store/PricingContext';

export const ShipperContractsView: React.FC = () => {
  const { currentShipperOrg, userOrgName } = usePricing();
  const tierInfo = currentShipperOrg.tierInfo;

  const progressPercent = Math.min(
    100,
    Math.round((tierInfo.monthlyVolumeTons / tierInfo.targetVolumeTons) * 100)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs">
              سطح تجاری: {tierInfo.tierName}
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-slate-500 font-medium">قرارداد سالانه سازمانی</span>
          </div>
          <h2 className="text-base font-bold text-slate-800">
            مدیریت قراردادها، پله‌های تخفیف و توافقنامه سطح خدمات (SLA)
          </h2>
          <p className="text-xs text-slate-400">
            سازمان صاحب بار: <strong className="text-slate-700">{currentShipperOrg.nameFa || userOrgName}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-left bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <span className="text-slate-400 block text-[10px]">تخفیف فعال خودکار روی تمام فاکتورها:</span>
            <strong className="text-emerald-700 text-sm font-mono font-bold">
              %{tierInfo.currentDiscountPercent} تخفیف حجمی
            </strong>
          </div>
        </div>
      </div>

      {/* 2. Volume Tracker Progress Bar (نوار پیشرفت حجم بار) */}
      <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-6 rounded-2xl border border-amber-300 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">نوار پیشرفت حجم بار و رسیدن به پله بعدی (Volume Tracker)</h3>
              <p className="text-xs text-slate-500">
                حجم تناژ حمل‌شده در ماه جاری: <strong className="font-mono text-amber-950 font-bold">{tierInfo.monthlyVolumeTons} تن</strong>
              </p>
            </div>
          </div>

          <div className="text-xs font-bold text-amber-900 bg-white/80 px-3 py-1.5 rounded-xl border border-amber-200">
            {Math.max(0, tierInfo.targetVolumeTons - tierInfo.monthlyVolumeTons)} تن تا پله «{tierInfo.nextTierName}»
          </div>
        </div>

        {/* Big Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-600 font-medium">
            <span>سطح فعلی: <strong>{tierInfo.tierName}</strong> (%{tierInfo.currentDiscountPercent} تخفیف)</span>
            <span className="font-mono font-bold text-amber-900">{progressPercent}٪ تکمیل شده</span>
            <span>پله بعدی: <strong>{tierInfo.nextTierName}</strong> (%{tierInfo.nextTierDiscountPercent} تخفیف)</span>
          </div>

          <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-700 shadow-inner"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Tier Tiers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
          {[
            { name: 'برنزی', volume: 'تا ۵۰۰ تن', discount: '۳٪', active: false, passed: true },
            { name: 'نقره‌ای', volume: '۵۰۰ تا ۱۰۰۰ تن', discount: '۵.۵٪', active: false, passed: true },
            { name: 'طلایی (شما)', volume: '۱۰۰۰ تا ۲۰۰۰ تن', discount: '۸.۵٪', active: true, passed: false },
            { name: 'پلاتینیوم تجاری', volume: 'بالای ۲۰۰۰ تن', discount: '۱۲٪', active: false, passed: false },
          ].map((tier, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border text-xs text-right space-y-1 ${
                tier.active
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                  : tier.passed
                  ? 'bg-white/90 text-slate-700 border-slate-200'
                  : 'bg-white/50 text-slate-400 border-slate-200/60'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span>{tier.name}</span>
                {tier.passed && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                {tier.active && <Sparkles className="w-4 h-4 text-white" />}
              </div>
              <div className={tier.active ? 'text-amber-100 text-[11px]' : 'text-slate-500 text-[11px]'}>
                {tier.volume}
              </div>
              <div className="font-mono font-bold text-sm mt-1">
                تخفیف: {tier.discount}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. SLA Service Level Agreement (توافقنامه سطح خدمات) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SLA Commitment Indicator */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Clock className="w-4 h-4 text-amber-600" />
            <h3 className="font-bold text-slate-800 text-xs">شاخص تعهد زمان تحویل (SLA)</h3>
          </div>

          <div className="text-center py-4 space-y-2">
            <div className="text-4xl font-bold font-mono text-emerald-600">
              %{INITIAL_SHIPPER_TIER.slaCommitmentRate}
            </div>
            <p className="text-xs text-slate-500">
              نرخ موفقیت تحویل دقیق و سر موقع بر اساس قرارداد
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1.5 text-slate-600">
            <div className="flex justify-between">
              <span>تعهد زمان تخصیص کامیون:</span>
              <strong className="font-mono text-slate-800">حداکثر ۱۲۰ دقیقه</strong>
            </div>
            <div className="flex justify-between">
              <span>جریمه دیرکرد به ازای هر ساعت:</span>
              <strong className="font-mono text-rose-600">۱۵۰,۰۰۰ تومان</strong>
            </div>
          </div>
        </div>

        {/* Contract Clauses & Guarantees */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-amber-600" />
              <h3 className="font-bold text-slate-800 text-xs">بندهای طلایی قرارداد جاری و تعهدات حقوقی</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">شماره قرارداد: CTR-1403-MSC-08</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                تضمین کف ظرفیت ناوگان اختصاصی
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                تخصیص روزانه حداقل ۱۵ دستگاه تریلی کفی و چادری حتی در ایام اوج ترافیک بار و پیک فصلی.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                پوشش بیمه تمام‌خطر (All-Risk)
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                جبران آنی خسارت احتمالی تا سقف ۵ میلیارد تومان برای هر محموله با فرانشیز صفر درصد.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                تسویه اعتباری ۳۰ روزه (Credit Line)
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                امکان صدور بارنامه به صورت پس‌کرایه با سررسید صورتحساب ماهانه در انتهای دوره مالی.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                پشتیبانی اختصاصی مدیر حساب (KAM)
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                پاسخگویی مستقیم ۲۴/۷ توسط کارشناس ارشد لجستیک مستقر در دفتر مرکزی.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
