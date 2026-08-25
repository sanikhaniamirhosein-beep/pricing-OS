import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  GitCompare,
  Layers,
  Filter,
  Check,
  Calendar,
  Building2,
  Info,
} from 'lucide-react';
import {
  ExpenseRecord,
  ExpenseCategory,
  EXPENSE_CATEGORIES_META,
  MonthlyBudgetConfig,
} from '../../../../types/expense';

interface ExpenseChartsSectionProps {
  expenses: ExpenseRecord[];
  allExpenses: ExpenseRecord[];
  budgets: Record<number, MonthlyBudgetConfig>;
  priorYearTotals: Record<number, number>;
  selectedCompany: string;
  onCompanyChange: (company: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  companiesList: { code: string; nameFa: string }[];
}

type ChartViewMode = 'stacked_bar' | 'trend_line' | 'yoy_compare' | 'pie_distribution';

export const ExpenseChartsSection: React.FC<ExpenseChartsSectionProps> = ({
  expenses,
  allExpenses,
  budgets,
  priorYearTotals,
  selectedCompany,
  onCompanyChange,
  selectedCategory,
  onCategoryChange,
  companiesList,
}) => {
  const [chartMode, setChartMode] = useState<ChartViewMode>('stacked_bar');

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

  // Group by month for year 1405 (months 1 to 7 active in current dataset)
  const monthlyData = [1, 2, 3, 4, 5, 6, 7].map((m) => {
    const monthExpenses = expenses.filter((e) => e.monthIndex === m);

    const fuel = monthExpenses
      .filter((e) => e.category === 'fuel')
      .reduce((s, e) => s + e.amountToman, 0);

    const maintenance = monthExpenses
      .filter((e) => e.category === 'fleet_maintenance')
      .reduce((s, e) => s + e.amountToman, 0);

    const driverWages = monthExpenses
      .filter((e) => e.category === 'driver_wages')
      .reduce((s, e) => s + e.amountToman, 0);

    const insurance = monthExpenses
      .filter((e) => e.category === 'insurance')
      .reduce((s, e) => s + e.amountToman, 0);

    const commission = monthExpenses
      .filter((e) => e.category === 'commission')
      .reduce((s, e) => s + e.amountToman, 0);

    const penalty = monthExpenses
      .filter((e) => e.category === 'penalty')
      .reduce((s, e) => s + e.amountToman, 0);

    const other = monthExpenses
      .filter((e) => e.category === 'other')
      .reduce((s, e) => s + e.amountToman, 0);

    const total1405 = fuel + maintenance + driverWages + insurance + commission + penalty + other;
    const budget1405 = budgets[m]?.totalBudgetToman || 0;
    const priorYear1404 = priorYearTotals[m] || 0;

    return {
      monthIndex: m,
      monthName: monthNamesFa[m],
      fuelMillion: Math.round(fuel / 1000000),
      maintenanceMillion: Math.round(maintenance / 1000000),
      driverWagesMillion: Math.round(driverWages / 1000000),
      insuranceMillion: Math.round(insurance / 1000000),
      commissionMillion: Math.round(commission / 1000000),
      penaltyMillion: Math.round(penalty / 1000000),
      otherMillion: Math.round(other / 1000000),
      totalMillion: Math.round(total1405 / 1000000),
      budgetMillion: Math.round(budget1405 / 1000000),
      priorYearMillion: Math.round(priorYear1404 / 1000000),
      fuelRaw: fuel,
      maintenanceRaw: maintenance,
      driverWagesRaw: driverWages,
      insuranceRaw: insurance,
      commissionRaw: commission,
      penaltyRaw: penalty,
      otherRaw: other,
      totalRaw: total1405,
    };
  });

  // Category totals for Pie Chart
  const categoryTotals: Record<ExpenseCategory, number> = {
    fuel: 0,
    fleet_maintenance: 0,
    driver_wages: 0,
    insurance: 0,
    commission: 0,
    penalty: 0,
    other: 0,
  };

  expenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amountToman;
  });

  const totalAllCategories = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

  const pieData = (Object.keys(categoryTotals) as ExpenseCategory[])
    .map((cat) => {
      const amount = categoryTotals[cat];
      const meta = EXPENSE_CATEGORIES_META[cat];
      return {
        name: meta.nameFa,
        category: cat,
        value: Math.round(amount / 1000000), // in Millions
        rawAmount: amount,
        color: meta.colorHex,
        percent: totalAllCategories > 0 ? Number(((amount / totalAllCategories) * 100).toFixed(1)) : 0,
      };
    })
    .filter((d) => d.value > 0);

  // Custom Tooltip for Stacked Bar and Trend
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const totalInMillion = payload.reduce((sum: number, entry: any) => sum + (entry.value || 0), 0);
      return (
        <div className="bg-white/95 backdrop-blur-xs border border-slate-200 p-3.5 rounded-2xl shadow-xl text-xs space-y-2.5 min-w-[220px]">
          <div className="font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
            <span>{label} ۱۴۰۵</span>
            <span className="text-amber-700 font-mono font-bold">
              {totalInMillion.toLocaleString('fa-IR')} م تومان
            </span>
          </div>
          <div className="space-y-1.5">
            {payload.map((entry: any, index: number) => {
              if (!entry.value) return null;
              return (
                <div key={`item-${index}`} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-slate-600">{entry.name}:</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    {entry.value.toLocaleString('fa-IR')} م تومان
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
      {/* Top Header & Chart View Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/70 flex items-center justify-center text-amber-700 shrink-0">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-slate-900 text-sm sm:text-base font-display">
              تحلیل و روند هزینه‌ها به تفکیک ماه‌های سال (Expense Trend & Breakdown)
            </h2>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            پایش ماهانه، سهم سرفصل‌های هزینه، انحراف از بودجه و مقایسه دوره‌ای امسال در برابر سال گذشته
          </p>
        </div>

        {/* Chart View Modes */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/70 self-start lg:self-auto">
          <button
            type="button"
            onClick={() => setChartMode('stacked_bar')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              chartMode === 'stacked_bar'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-amber-600" />
            <span>تفکیک سرفصل‌ها</span>
          </button>

          <button
            type="button"
            onClick={() => setChartMode('trend_line')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              chartMode === 'trend_line'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>روند کل و بودجه</span>
          </button>

          <button
            type="button"
            onClick={() => setChartMode('yoy_compare')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              chartMode === 'yoy_compare'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5 text-purple-600" />
            <span>مقایسه سالانه</span>
          </button>

          <button
            type="button"
            onClick={() => setChartMode('pie_distribution')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              chartMode === 'pie_distribution'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5 text-indigo-600" />
            <span>ترکیب هزینه‌ها</span>
          </button>
        </div>
      </div>

      {/* Quick In-Chart Filters (Company & Category) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/70 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          {/* Filter by Company */}
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-600 font-medium">شرکت طرف قرارداد:</span>
            <select
              value={selectedCompany}
              onChange={(e) => onCompanyChange(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer shadow-2xs"
            >
              <option value="all">همه شرکت‌ها و قراردادها ({companiesList.length})</option>
              {companiesList.map((comp) => (
                <option key={comp.code} value={comp.code}>
                  {comp.nameFa}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Category */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-600 font-medium">سرفصل هزینه:</span>
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer shadow-2xs"
            >
              <option value="all">همه سرفصل‌ها</option>
              {(Object.keys(EXPENSE_CATEGORIES_META) as ExpenseCategory[]).map((cat) => (
                <option key={cat} value={cat}>
                  {EXPENSE_CATEGORIES_META[cat].nameFa}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Legend Hint */}
        <div className="text-xs text-slate-500 font-mono flex items-center gap-2">
          <span>واحد ارقام نمودار:</span>
          <span className="bg-amber-50 text-amber-900 px-2.5 py-0.5 rounded-lg border border-amber-200 font-bold">
            میلیون تومان
          </span>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="w-full h-[350px] pt-2">
        {chartMode === 'stacked_bar' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="monthName" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickFormatter={(val) => val.toLocaleString('fa-IR')}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '16px', fontSize: '11px', fontFamily: 'inherit' }}
              />
              <Bar dataKey="fuelMillion" name="سوخت" stackId="a" fill={EXPENSE_CATEGORIES_META.fuel.colorHex} />
              <Bar dataKey="maintenanceMillion" name="نگهداری ناوگان" stackId="a" fill={EXPENSE_CATEGORIES_META.fleet_maintenance.colorHex} />
              <Bar dataKey="driverWagesMillion" name="حقوق راننده" stackId="a" fill={EXPENSE_CATEGORIES_META.driver_wages.colorHex} />
              <Bar dataKey="insuranceMillion" name="بیمه" stackId="a" fill={EXPENSE_CATEGORIES_META.insurance.colorHex} />
              <Bar dataKey="commissionMillion" name="کمیسیون و عوارض" stackId="a" fill={EXPENSE_CATEGORIES_META.commission.colorHex} />
              <Bar dataKey="penaltyMillion" name="جریمه و خسارات" stackId="a" fill={EXPENSE_CATEGORIES_META.penalty.colorHex} />
              <Bar dataKey="otherMillion" name="سایر هزینه‌ها" stackId="a" fill={EXPENSE_CATEGORIES_META.other.colorHex} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {chartMode === 'trend_line' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <defs>
                <linearGradient id="expenseColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="budgetColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="monthName" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickFormatter={(val) => val.toLocaleString('fa-IR')}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(val: any, name: any) => [
                  `${Number(val).toLocaleString('fa-IR')} م تومان`,
                  name === 'totalMillion' ? 'هزینه واقعی ۱۴۰۵' : 'بودجه مصوب',
                ]}
                labelFormatter={(label) => `ماه ${label} ۱۴۰۵`}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.98)',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '16px', fontSize: '11px' }} />
              <Area
                type="monotone"
                dataKey="totalMillion"
                name="هزینه واقعی ۱۴۰۵"
                stroke="#d97706"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#expenseColor)"
              />
              <Line
                type="monotone"
                dataKey="budgetMillion"
                name="سقف بودجه پیش‌بینی‌شده"
                stroke="#3b82f6"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {chartMode === 'yoy_compare' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="monthName" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickFormatter={(val) => val.toLocaleString('fa-IR')}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(val: any, name: any) => [
                  `${Number(val).toLocaleString('fa-IR')} م تومان`,
                  name === 'totalMillion' ? 'عملکرد سال جاری ۱۴۰۵' : 'عملکرد سال گذشته ۱۴۰۴',
                ]}
                labelFormatter={(label) => `ماه ${label}`}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.98)',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '16px', fontSize: '11px' }} />
              <Bar dataKey="totalMillion" name="عملکرد سال جاری ۱۴۰۵" fill="#d97706" radius={[6, 6, 0, 0]} />
              <Bar dataKey="priorYearMillion" name="عملکرد سال گذشته ۱۴۰۴" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {chartMode === 'pie_distribution' && (
          <div className="grid grid-cols-1 md:grid-cols-2 items-center h-full gap-6">
            <ResponsiveContainer width="100%" height={270}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [
                    `${Number(val).toLocaleString('fa-IR')} م تومان`,
                    name,
                  ]}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Detailed Pie Legend & Percentage list */}
            <div className="space-y-2.5 max-h-[270px] overflow-y-auto pr-1">
              {pieData.map((item) => (
                <div
                  key={item.category}
                  className="flex items-center justify-between text-xs bg-slate-50/70 p-3 rounded-2xl border border-slate-200/80 hover:bg-slate-50 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-bold text-slate-800">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-500 font-medium">
                      {item.value.toLocaleString('fa-IR')} م تومان
                    </span>
                    <span
                      className="font-mono font-bold px-2 py-0.5 rounded-lg text-[11px]"
                      style={{
                        backgroundColor: `${item.color}18`,
                        color: item.color,
                      }}
                    >
                      {item.percent}٪
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
