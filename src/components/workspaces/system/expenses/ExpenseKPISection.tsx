import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Zap,
} from 'lucide-react';
import { ExpenseRecord, MonthlyBudgetConfig } from '../../../../types/expense';

interface ExpenseKPISectionProps {
  expenses: ExpenseRecord[];
  allExpenses: ExpenseRecord[];
  budgets: Record<number, MonthlyBudgetConfig>;
  selectedMonthIndex?: number; // if filtering to specific month
  priorYearTotals?: Record<number, number>;
  onOpenBudgetModal: () => void;
}

export const ExpenseKPISection: React.FC<ExpenseKPISectionProps> = ({
  expenses,
  allExpenses,
  budgets,
  selectedMonthIndex,
  priorYearTotals,
  onOpenBudgetModal,
}) => {
  // 1. Total Filtered Expenses
  const totalAmountToman = expenses.reduce((acc, curr) => acc + curr.amountToman, 0);

  // 2. Total Paid vs Pending vs Overdue
  const paidAmountToman = expenses
    .filter((e) => e.status === 'paid')
    .reduce((acc, curr) => acc + curr.amountToman, 0);

  const overdueAmountToman = expenses
    .filter((e) => e.status === 'overdue')
    .reduce((acc, curr) => acc + curr.amountToman, 0);

  const underReviewAmountToman = expenses
    .filter((e) => e.status === 'under_review' || e.status === 'pending')
    .reduce((acc, curr) => acc + curr.amountToman, 0);

  // 3. Monthly breakdown to find months count and averages
  const monthlyTotals: Record<number, number> = {};
  expenses.forEach((e) => {
    monthlyTotals[e.monthIndex] = (monthlyTotals[e.monthIndex] || 0) + e.amountToman;
  });

  const activeMonths = Object.keys(monthlyTotals).map(Number);
  const activeMonthsCount = activeMonths.length || 1;

  // Monthly Average Expense
  const monthlyAverageToman = Math.round(totalAmountToman / activeMonthsCount);

  // Peak and Trough Months
  let peakMonthIndex = 1;
  let peakAmountToman = 0;
  let troughMonthIndex = 1;
  let troughAmountToman = Infinity;

  const monthNamesFa: Record<number, string> = {
    1: 'فروردین',
    2: 'اردیبهشت',
    3: 'خرداد',
    4: 'تیر',
    5: 'مرداد',
    6: 'شهریور',
    7: 'مهر',
    8: 'آبان',
    9: 'آذر',
    10: 'دی',
    11: 'بهمن',
    12: 'اسفند',
  };

  if (activeMonths.length > 0) {
    activeMonths.forEach((m) => {
      const amount = monthlyTotals[m];
      if (amount > peakAmountToman) {
        peakAmountToman = amount;
        peakMonthIndex = m;
      }
      if (amount < troughAmountToman) {
        troughAmountToman = amount;
        troughMonthIndex = m;
      }
    });
  } else {
    troughAmountToman = 0;
  }

  // 4. Growth Rate (MoM or Period over Period)
  // Let's calculate latest month vs prior month in active dataset
  const latestMonthIndex = activeMonths.length > 0 ? Math.max(...activeMonths) : 7;
  const currentMonthExp = monthlyTotals[latestMonthIndex] || 0;
  const priorMonthIndex = latestMonthIndex > 1 ? latestMonthIndex - 1 : 1;
  const priorMonthExp = monthlyTotals[priorMonthIndex] || 0;

  let growthRatePercent = 0;
  if (priorMonthExp > 0) {
    growthRatePercent = Number((((currentMonthExp - priorMonthExp) / priorMonthExp) * 100).toFixed(1));
  }

  // 5. Total Budget for active months & Variance
  let totalBudgetToman = 0;
  activeMonths.forEach((m) => {
    totalBudgetToman += budgets[m]?.totalBudgetToman || 0;
  });

  // If no specific budget found, estimate based on average
  if (totalBudgetToman === 0) {
    totalBudgetToman = totalAmountToman * 1.05;
  }

  const budgetVarianceToman = totalBudgetToman - totalAmountToman;
  const budgetUtilizationPercent = totalBudgetToman > 0
    ? Number(((totalAmountToman / totalBudgetToman) * 100).toFixed(1))
    : 100;
  const isBudgetExceeded = totalAmountToman > totalBudgetToman;

  // Format Helper
  const formatBillionOrMillion = (toman: number) => {
    if (toman >= 1000000000) {
      return {
        val: (toman / 1000000000).toFixed(2),
        unit: 'میلیارد تومان',
      };
    }
    return {
      val: (toman / 1000000).toLocaleString('fa-IR'),
      unit: 'میلیون تومان',
    };
  };

  const totalFmt = formatBillionOrMillion(totalAmountToman);
  const avgFmt = formatBillionOrMillion(monthlyAverageToman);
  const peakFmt = formatBillionOrMillion(peakAmountToman);
  const troughFmt = formatBillionOrMillion(troughAmountToman === Infinity ? 0 : troughAmountToman);
  const varianceFmt = formatBillionOrMillion(Math.abs(budgetVarianceToman));

  return (
    <div className="space-y-4">
      {/* Top Main 4 Analytical KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total & Average Monthly Expense */}
        <div
          id="kpi-card-total-expense"
          className="bg-white border border-[#D3D1C7] rounded-2xl p-4 shadow-xs relative overflow-hidden flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-[#5F5E5A] block">مجموع هزینه‌های دوره</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl font-bold font-mono text-[#2C2C2A]">{totalFmt.val}</span>
                <span className="text-[11px] text-[#5F5E5A] font-medium">{totalFmt.unit}</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#E1F5EE] border border-[#9FE1CB] flex items-center justify-center text-[#085041] shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#ECEAE3] flex items-center justify-between text-xs text-[#5F5E5A]">
            <span>میانگین ماهانه:</span>
            <span className="font-bold text-[#085041] font-mono">
              {avgFmt.val} {avgFmt.unit}
            </span>
          </div>
        </div>

        {/* Card 2: Growth Rate MoM */}
        <div
          id="kpi-card-growth-rate"
          className="bg-white border border-[#D3D1C7] rounded-2xl p-4 shadow-xs relative overflow-hidden flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-[#5F5E5A] block">نرخ رشد ماه جاری (MoM)</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span
                  className={`text-2xl font-bold font-mono ${
                    growthRatePercent > 0 ? 'text-amber-700' : 'text-emerald-700'
                  }`}
                >
                  {growthRatePercent > 0 ? `+${growthRatePercent}` : growthRatePercent}٪
                </span>
                <span className="text-[11px] text-[#5F5E5A] font-medium">نسبت به {monthNamesFa[priorMonthIndex]}</span>
              </div>
            </div>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                growthRatePercent > 0
                  ? 'bg-amber-50 border-amber-200 text-amber-700'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}
            >
              {growthRatePercent > 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#ECEAE3] flex items-center justify-between text-xs text-[#5F5E5A]">
            <span>تغییر هزینه ماهانه:</span>
            <span className="font-mono font-semibold text-[#2C2C2A]">
              {Math.abs(Math.round((currentMonthExp - priorMonthExp) / 1000000)).toLocaleString('fa-IR')} م تومان
            </span>
          </div>
        </div>

        {/* Card 3: Peak & Trough Months */}
        <div
          id="kpi-card-peak-trough"
          className="bg-white border border-[#D3D1C7] rounded-2xl p-4 shadow-xs relative overflow-hidden flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-[#5F5E5A] block">بیشترین هزینه ماهانه (Peak)</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl font-bold font-mono text-[#2C2C2A]">{peakFmt.val}</span>
                <span className="text-[11px] text-[#5F5E5A] font-medium">({monthNamesFa[peakMonthIndex]})</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#ECEAE3] flex items-center justify-between text-xs text-[#5F5E5A]">
            <span>کمترین هزینه:</span>
            <span className="font-mono text-[#5F5E5A] font-semibold">
              {monthNamesFa[troughMonthIndex]} ({troughFmt.val} {troughFmt.unit})
            </span>
          </div>
        </div>

        {/* Card 4: Budget Variance */}
        <div
          id="kpi-card-budget-variance"
          className="bg-white border border-[#D3D1C7] rounded-2xl p-4 shadow-xs relative overflow-hidden flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-[#5F5E5A] block">انحراف از بودجه مصوب</span>
                <button
                  type="button"
                  onClick={onOpenBudgetModal}
                  className="text-[10px] text-[#085041] hover:underline font-semibold cursor-pointer"
                >
                  (تنظیم بودجه)
                </button>
              </div>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span
                  className={`text-2xl font-bold font-mono ${
                    isBudgetExceeded ? 'text-rose-700' : 'text-emerald-700'
                  }`}
                >
                  {isBudgetExceeded ? '+' : '-'}
                  {varianceFmt.val}
                </span>
                <span className="text-[11px] text-[#5F5E5A] font-medium">{varianceFmt.unit}</span>
              </div>
            </div>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                isBudgetExceeded
                  ? 'bg-rose-50 border-rose-200 text-rose-700'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}
            >
              {isBudgetExceeded ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#ECEAE3] flex items-center justify-between text-xs text-[#5F5E5A]">
            <span>تحقق بودجه:</span>
            <div className="flex items-center gap-1.5">
              <div className="w-16 h-1.5 bg-[#EAE8E1] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    budgetUtilizationPercent > 100
                      ? 'bg-rose-500'
                      : budgetUtilizationPercent > 85
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(budgetUtilizationPercent, 100)}%` }}
                />
              </div>
              <span className="font-mono font-bold text-[#2C2C2A]">{budgetUtilizationPercent}٪</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Status Quick Bar */}
      <div className="bg-[#FAFAF8] border border-[#D3D1C7] rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#5F5E5A]">
          <Layers className="w-4 h-4 text-[#085041]" />
          <span className="font-bold text-[#2C2C2A]">وضعیت تسویه هزینه‌ها:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Paid */}
          <div className="flex items-center gap-1.5 bg-white border border-emerald-200 px-3 py-1.5 rounded-xl shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-[#5F5E5A]">پرداخت‌شده:</span>
            <span className="font-mono font-bold text-emerald-800">
              {(paidAmountToman / 1000000000).toFixed(2)} م.م تومان
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              ({totalAmountToman > 0 ? ((paidAmountToman / totalAmountToman) * 100).toFixed(0) : 0}٪)
            </span>
          </div>

          {/* Under Review */}
          <div className="flex items-center gap-1.5 bg-white border border-sky-200 px-3 py-1.5 rounded-xl shadow-xs">
            <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
            <span className="text-[#5F5E5A]">در حال بررسی/انتظار:</span>
            <span className="font-mono font-bold text-sky-800">
              {(underReviewAmountToman / 1000000).toLocaleString('fa-IR')} م تومان
            </span>
          </div>

          {/* Overdue */}
          <div className="flex items-center gap-1.5 bg-white border border-rose-200 px-3 py-1.5 rounded-xl shadow-xs">
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 animate-pulse" />
            <span className="text-[#5F5E5A]">معوق / سررسید گذشته:</span>
            <span className="font-mono font-bold text-rose-800">
              {(overdueAmountToman / 1000000).toLocaleString('fa-IR')} م تومان
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
