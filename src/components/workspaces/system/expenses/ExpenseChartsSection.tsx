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
        <div className="bg-white/95 backdrop-blur-xs border border-[#D3D1C7] p-3 rounded-2xl shadow-lg text-xs space-y-2 min-w-[200px]">
          <div className="font-bold text-[#2C2C2A] border-b border-[#ECEAE3] pb-1.5 flex items-center justify-between">
            <span>{label} ۱۴۰۵</span>
            <span className="text-[#085041] font-mono font-bold">
              {totalInMillion.toLocaleString('fa-IR')} م تومان
            </span>
          </div>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => {
              if (!entry.value) return null;
              return (
                <div key={`item-${index}`} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-[#5F5E5A]">{entry.name}:</span>
                  </div>
                  <span className="font-mono font-bold text-[#2C2C2A]">
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
    <div className="bg-white border border-[#D3D1C7] rounded-3xl p-6 shadow-xs space-y-5">
      {/* Top Header & Chart View Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#D3D1C7] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#085041]" />
            <h2 className="font-bold text-[#2C2C2A] text-sm sm:text-base font-display">
              تحلیل و روند هزینه‌ها به تفکیک ماه‌های سال (Expense Trend & Breakdown)
            </h2>
          </div>
          <p className="text-[#5F5E5A] text-xs mt-0.5">
            پایش ماهانه، سهم سرفصل‌های هزینه، انحراف از بودجه و مقایسه دوره‌ای امسال در برابر سال گذشته
          </p>
        </div>

        {/* Chart View Modes */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#FAFAF8] p-1.5 rounded-2xl border border-[#D3D1C7] self-start lg:self-auto">
          <button
            type="button"
            onClick={() => setChartMode('stacked_bar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              chartMode === 'stacked_bar'
                ? 'bg-[#085041] text-white shadow-xs'
                : 'text-[#5F5E5A] hover:bg-[#F1EFE8] hover:text-[#2C2C2A]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>تفکیک سرفصل‌ها (میله‌ای)</span>
          </button>

          <button
            type="button"
            onClick={() => setChartMode('trend_line')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              chartMode === 'trend_line'
                ? 'bg-[#085041] text-white shadow-xs'
                : 'text-[#5F5E5A] hover:bg-[#F1EFE8] hover:text-[#2C2C2A]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>روند کل و بودجه (خطی)</span>
          </button>

          <button
            type="button"
            onClick={() => setChartMode('yoy_compare')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              chartMode === 'yoy_compare'
                ? 'bg-[#085041] text-white shadow-xs'
                : 'text-[#5F5E5A] hover:bg-[#F1EFE8] hover:text-[#2C2C2A]'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>مقایسه سالانه (۱۴۰۵ vs ۱۴۰۴)</span>
          </button>

          <button
            type="button"
            onClick={() => setChartMode('pie_distribution')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              chartMode === 'pie_distribution'
                ? 'bg-[#085041] text-white shadow-xs'
                : 'text-[#5F5E5A] hover:bg-[#F1EFE8] hover:text-[#2C2C2A]'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>سهم و ترکیب هزینه‌ها</span>
          </button>
        </div>
      </div>

      {/* Quick In-Chart Filters (Company & Category) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FAFAF8] p-3 rounded-2xl border border-[#D3D1C7] text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Filter by Company */}
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#5F5E5A]" />
            <span className="text-[#5F5E5A] font-medium">شرکت طرف قرارداد:</span>
            <select
              value={selectedCompany}
              onChange={(e) => onCompanyChange(e.target.value)}
              className="bg-white border border-[#D3D1C7] rounded-xl px-2.5 py-1 text-xs font-semibold text-[#2C2C2A] focus:outline-none focus:border-[#085041] cursor-pointer"
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
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[#5F5E5A]" />
            <span className="text-[#5F5E5A] font-medium">دسته‌بندی:</span>
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="bg-white border border-[#D3D1C7] rounded-xl px-2.5 py-1 text-xs font-semibold text-[#2C2C2A] focus:outline-none focus:border-[#085041] cursor-pointer"
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
        <div className="text-[11px] text-[#5F5E5A] font-mono flex items-center gap-2">
          <span>واحد ارقام نمودار:</span>
          <span className="bg-[#E1F5EE] text-[#04342C] px-2 py-0.5 rounded border border-[#9FE1CB] font-bold">
            میلیون تومان
          </span>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="w-full h-[340px] pt-2">
        {chartMode === 'stacked_bar' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ECEAE3" />
              <XAxis dataKey="monthName" tick={{ fill: '#5F5E5A', fontSize: 11 }} />
              <YAxis
                tick={{ fill: '#5F5E5A', fontSize: 11 }}
                tickFormatter={(val) => val.toLocaleString('fa-IR')}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '15px', fontSize: '11px', fontFamily: 'inherit' }}
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
                  <stop offset="5%" stopColor="#085041" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#085041" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="budgetColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ECEAE3" />
              <XAxis dataKey="monthName" tick={{ fill: '#5F5E5A', fontSize: 11 }} />
              <YAxis
                tick={{ fill: '#5F5E5A', fontSize: 11 }}
                tickFormatter={(val) => val.toLocaleString('fa-IR')}
              />
              <Tooltip
                formatter={(val: any, name: any) => [
                  `${Number(val).toLocaleString('fa-IR')} م تومان`,
                  name === 'totalMillion' ? 'هزینه واقعی ۱۴۰۵' : 'بودجه مصوب',
                ]}
                labelFormatter={(label) => `ماه ${label} ۱۴۰۵`}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '16px',
                  border: '1px solid #D3D1C7',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '15px', fontSize: '11px' }} />
              <Area
                type="monotone"
                dataKey="totalMillion"
                name="هزینه واقعی ۱۴۰۵"
                stroke="#085041"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#expenseColor)"
              />
              <Line
                type="monotone"
                dataKey="budgetMillion"
                name="سقف بودجه پیش‌بینی‌شده"
                stroke="#2563EB"
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
              <CartesianGrid strokeDasharray="3 3" stroke="#ECEAE3" />
              <XAxis dataKey="monthName" tick={{ fill: '#5F5E5A', fontSize: 11 }} />
              <YAxis
                tick={{ fill: '#5F5E5A', fontSize: 11 }}
                tickFormatter={(val) => val.toLocaleString('fa-IR')}
              />
              <Tooltip
                formatter={(val: any, name: any) => [
                  `${Number(val).toLocaleString('fa-IR')} م تومان`,
                  name === 'totalMillion' ? 'عملکرد سال جاری ۱۴۰۵' : 'عملکرد سال گذشته ۱۴۰۴',
                ]}
                labelFormatter={(label) => `ماه ${label}`}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '16px',
                  border: '1px solid #D3D1C7',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '15px', fontSize: '11px' }} />
              <Bar dataKey="totalMillion" name="عملکرد سال جاری ۱۴۰۵" fill="#085041" radius={[6, 6, 0, 0]} />
              <Bar dataKey="priorYearMillion" name="عملکرد سال گذشته ۱۴۰۴" fill="#94A3B8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {chartMode === 'pie_distribution' && (
          <div className="grid grid-cols-1 md:grid-cols-2 items-center h-full gap-4">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
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
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '16px',
                    border: '1px solid #D3D1C7',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Detailed Pie Legend & Percentage list */}
            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-2">
              {pieData.map((item) => (
                <div
                  key={item.category}
                  className="flex items-center justify-between text-xs bg-[#FAFAF8] p-2.5 rounded-xl border border-[#D3D1C7]"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-bold text-[#2C2C2A]">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[#5F5E5A]">
                      {item.value.toLocaleString('fa-IR')} م تومان
                    </span>
                    <span
                      className="font-mono font-bold px-2 py-0.5 rounded text-[11px]"
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
