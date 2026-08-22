import React, { useState } from 'react';
import {
  Percent,
  TrendingDown,
  RotateCcw,
  Wallet,
  ShieldCheck,
  Plus,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { usePricing } from '../../../store/PricingContext';
import { DiscountRule } from '../../../types/pricing';

interface ExtendedDiscountRule extends DiscountRule {
  nameEn?: string;
  ruleType?: 'volume_tier' | 'backhaul_match' | 'prompt_payment' | 'off_peak';
  active?: boolean;
}

const DEFAULT_DISCOUNT_RULES: ExtendedDiscountRule[] = [
  {
    id: 'disc-vol-1',
    code: 'VOL-TIER-01',
    nameFa: 'تخفیف تناژ ماهانه (بیش از ۵,۰۰۰ تن)',
    nameEn: 'Monthly Tonnage Tier 1 (>5k Tons)',
    ruleType: 'volume_tier',
    descriptionFa: 'اعمال تخفیف پلکانی ۵٪ به صاحبان کالا در صورت تحقق سقف تناژ ماهانه ۵ هزار تن',
    discountType: 'percentage',
    discountValue: 5,
    isStackable: true,
    priority: 1,
    monthlyBudgetCapToman: 200000000,
    currentBudgetUsedToman: 85000000,
    status: 'active',
    active: true,
  },
  {
    id: 'disc-backhaul-1',
    code: 'BKH-SOUTH-02',
    nameFa: 'تخفیف جذب بار برگشت کریدورهای جنوبی (Backhaul Match)',
    nameEn: 'Southern Corridor Empty Return Incentive',
    ruleType: 'backhaul_match',
    descriptionFa: 'تخفیف ویژه ۱۲٪ در مبادی برگشتی (تهران، اصفهان، یزد به بندرعباس و عسلویه) جهت حذف تردد خالی ناوگان',
    discountType: 'percentage',
    discountValue: 12,
    isStackable: false,
    priority: 2,
    monthlyBudgetCapToman: 500000000,
    currentBudgetUsedToman: 310000000,
    status: 'active',
    active: true,
  },
  {
    id: 'disc-prepay-1',
    code: 'PAY-WALLET-03',
    nameFa: 'تخفیف تسویه آنی از کیف پول اعتباری (Prompt Payment)',
    nameEn: 'Instant Wallet Settlement Rebate',
    ruleType: 'prompt_payment',
    descriptionFa: 'کسر ۳.۵٪ از کل کرایه در صورت پرداخت نقدی یا تسویه قبل از صدور بارنامه الکترونیک',
    discountType: 'percentage',
    discountValue: 3.5,
    isStackable: true,
    priority: 3,
    monthlyBudgetCapToman: 150000000,
    currentBudgetUsedToman: 42000000,
    status: 'active',
    active: true,
  },
  {
    id: 'disc-offpeak-1',
    code: 'OFF-MIDWEEK-04',
    nameFa: 'تخفیف بارگیری ایام وسط هفته (Mid-week Off-Peak)',
    nameEn: 'Mid-week Off-Peak Incentive',
    ruleType: 'off_peak',
    descriptionFa: 'تخفیف ۴٪ برای ترخیص و بارگیری در روزهای دوشنبه و سه‌شنبه برای متعادل‌سازی تقاضای پایانه',
    discountType: 'percentage',
    discountValue: 4,
    isStackable: false,
    priority: 4,
    monthlyBudgetCapToman: 100000000,
    currentBudgetUsedToman: 18000000,
    status: 'active',
    active: true,
  },
];

export const DiscountStrategiesView: React.FC = () => {
  const { discountPolicies } = usePricing();
  const [discountList, setDiscountList] = useState<ExtendedDiscountRule[]>(DEFAULT_DISCOUNT_RULES);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'volume' | 'backhaul' | 'prepay'>('all');
  const [maxStackingPercent, setMaxStackingPercent] = useState<number>(25);

  const toggleDiscountActive = (id: string, currentStatus?: boolean) => {
    setDiscountList((prev) =>
      (prev || []).map((d) => (d.id === id ? { ...d, active: !currentStatus, status: !currentStatus ? 'active' : 'paused' } : d))
    );
  };

  const filteredDiscounts = (discountList || []).filter((d) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'volume') return d?.ruleType === 'volume_tier';
    if (selectedCategory === 'backhaul') return d?.ruleType === 'backhaul_match';
    if (selectedCategory === 'prepay') return d?.ruleType === 'prompt_payment' || d?.ruleType === 'off_peak';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shrink-0">
              <Percent className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 font-title">
                  ۲.۲ استراتژی‌های تخفیف و انحصار متقابل (Discount Engine & Stacking Rules)
                </h1>
                <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {(discountList || []).filter((d) => d?.active).length} تخفیف فعال
                </span>
                <span className="bg-rose-100 text-rose-800 text-xs px-2.5 py-0.5 rounded-full font-medium">
                  سقف تجمعی: {maxStackingPercent}٪
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                تنظیم تخفیف‌های حجم ماهانه، تخفیف جذب بار برگشت (Backhaul)، تخفیف تسویه نقدی و تعریف ماتریس انحصار متقابل (Mutual Exclusivity)
              </p>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start md:self-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              همه ({(discountList || []).length})
            </button>
            <button
              onClick={() => setSelectedCategory('volume')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'volume'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              حجم ماهانه
            </button>
            <button
              onClick={() => setSelectedCategory('backhaul')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'backhaul'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              بار برگشت
            </button>
            <button
              onClick={() => setSelectedCategory('prepay')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'prepay'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              پیش‌پرداخت / کیف پول
            </button>
          </div>
        </div>
      </div>

      {/* 3 Strategy Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Pillar 1: Backhaul Match */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700">
            <RotateCcw className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 font-title">تخفیف هوشمند بار برگشت (Backhaul)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            کاهش تا ۱۵٪ نرخ در مسیرهای بازگشتی از مراکز مصرفی (تهران، اصفهان، مشهد) به سمت بنادر و قطب‌های تولیدی جهت جلوگیری از بازگشت بدون بار ناوگان.
          </p>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">میانگین افزایش ضریب بارگیری:</span>
            <span className="font-bold font-mono text-emerald-700">+۲۲.۴٪</span>
          </div>
        </div>

        {/* Pillar 2: Volume Tiers */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
            <TrendingDown className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 font-title">تخفیف پله‌ای تناژ تجمعی ماهانه</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            اعمال تخفیفات پلکانی خودکار در انتهای ماه برای مشتریانی که به تارگت‌های ۵,۰۰۰، ۱۰,۰۰۰ و ۲۰,۰۰۰ تن بارنامه در ماه دست یافته‌اند.
          </p>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">بازه تخفیف مجاز:</span>
            <span className="font-bold font-mono text-amber-800">۳٪ تا ۱۲٪</span>
          </div>
        </div>

        {/* Pillar 3: Prepayment & Instant Settlement */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <Wallet className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 font-title">تخفیف پیش‌پرداخت و تسویه نقدی</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            تخفیف ۳.۵٪ به صاحبان باری که کرایه را از محل موجودی شارژ شده کیف پول اعتباری خود قبل از صدور بارنامه به صورت آنی تسویه نمایند.
          </p>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">بهبود جریان نقدی شرکت:</span>
            <span className="font-bold font-mono text-emerald-700">تسویه زیر ۲۴ ساعت</span>
          </div>
        </div>
      </div>

      {/* Discounts Grid */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-title">قوانین و کمپین‌های فعال تخفیف</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              مدیریت و اعمال ضرایب تخفیف، محدودیت‌های انحصار متقابل و سقف‌های تجمعی
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">سقف مجاز کل تخفیفات:</span>
            <input
              type="number"
              min="10"
              max="40"
              value={maxStackingPercent}
              onChange={(e) => setMaxStackingPercent(Number(e.target.value))}
              className="w-16 bg-slate-50 border border-slate-200 rounded-xl p-1 text-center font-mono font-bold text-xs"
            />
            <span className="text-xs font-bold">%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDiscounts.map((discount) => (
            <div
              key={discount.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                discount.active
                  ? 'bg-slate-50/70 border-slate-200 hover:border-amber-300'
                  : 'bg-slate-100/40 border-slate-200 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {discount.code}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1.5">{discount.nameFa}</h3>
                    <p className="text-[11px] text-slate-400 font-mono">{discount.nameEn}</p>
                  </div>

                  <span className="text-base font-bold font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
                    {discount.discountValue > 100
                      ? `${discount.discountValue.toLocaleString('fa-IR')} ت`
                      : `%${discount.discountValue}`}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {discount.descriptionFa}
                </p>

                {/* Stacking Rule Tag */}
                <div className="mt-3 flex items-center gap-2 text-[11px]">
                  <span className="text-slate-400">سیاست تجمیع:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded ${
                      discount.isStackable
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : 'bg-purple-50 text-purple-800 border border-purple-200'
                    }`}
                  >
                    {discount.isStackable ? 'قابل تجمیع با سایر تخفیف‌ها' : 'انحصار متقابل (عدم تجمیع)'}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">اولویت اعمال: {discount.priority}</span>
                <button
                  onClick={() => toggleDiscountActive(discount.id, discount.active)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    discount.active
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {discount.active ? 'فعال در سیستم' : 'غیرفعال'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
