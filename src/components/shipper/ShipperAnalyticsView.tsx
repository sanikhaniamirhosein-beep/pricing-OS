import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  PieChart as PieChartIcon,
  Download,
  Calendar,
} from 'lucide-react';
import {
  ROUTE_ANALYTICS_DATA,
  FLEET_USAGE_DATA,
  MONTHLY_SPEND_DATA,
} from '../../data/mockShipperData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const ShipperAnalyticsView: React.FC = () => {
  const COLORS = ['#f59e0b', '#0d9488', '#3b82f6', '#8b5cf6', '#64748b'];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Analytics KPI Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* KPI 1: On-Time Delivery Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              شاخص تحویل به‌موقع (On-Time Delivery)
            </span>
            <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
              عالی
            </span>
          </div>
          <div className="text-3xl font-bold font-mono text-emerald-600">
            ۹۸.۴٪
          </div>
          <p className="text-[11px] text-slate-500">
            از مجموع ۱۲۴ محموله گذشته، تنها ۲ مورد تاخیر ناشی از شرایط جوی ثبت شده است.
          </p>
        </div>

        {/* KPI 2: Average Transit Duration */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="flex items-center gap-1.5 font-bold">
              <Clock className="w-4 h-4 text-blue-600" />
              میانگین زمان بارگیری تا تخلیه
            </span>
            <span className="text-[10px] bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full font-bold">
              مسیرهای بین‌استانی
            </span>
          </div>
          <div className="text-3xl font-bold font-mono text-blue-600">
            ۱۴.۲ <span className="text-xs font-normal text-slate-400">ساعت</span>
          </div>
          <p className="text-[11px] text-slate-500">
            بهبود ۲.۵ ساعته به دلیل هماهنگی الکترونیک و تخصیص هوشمند ناوگان.
          </p>
        </div>

        {/* KPI 3: Fleet Efficiency Index */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="flex items-center gap-1.5 font-bold">
              <Truck className="w-4 h-4 text-amber-600" />
              ضریب بهره‌وری تناژ (Load Factor)
            </span>
            <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
              بهینه‌شده
            </span>
          </div>
          <div className="text-3xl font-bold font-mono text-amber-600">
            ۹۳.۸٪
          </div>
          <p className="text-[11px] text-slate-500">
            استفاده حداکثری از ظرفیت بارگیری و کاهش هزینه‌های مازاد تن‌کیلومتر.
          </p>
        </div>
      </div>

      {/* 2. Charts Row: Cost by Route + Fleet Usage Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Spend by Route (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-xs flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-600" />
                تحلیل هزینه‌ها بر اساس مسیرهای تجاری پرتردد
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">پرهزینه‌ترین کریدورهای حمل و نقل شرکت در ۶ ماه اخیر</p>
            </div>

            <button
              type="button"
              onClick={() => alert('دانلود گزارش تحلیلی مسیرها')}
              className="p-2 text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ROUTE_ANALYTICS_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="route"
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickFormatter={(val) => `${val} م`}
                />
                <Tooltip
                  formatter={(val: any) => [`${val} میلیون تومان`, 'مجموع هزینه']}
                  labelStyle={{ fontFamily: 'Vazirmatn', fontWeight: 'bold' }}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    color: '#fff',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="spendMillionRials" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            {ROUTE_ANALYTICS_DATA.slice(0, 3).map((r, i) => (
              <div key={i} className="flex justify-between items-center text-xs">
                <span className="text-slate-700 font-bold">{r.route}</span>
                <span className="font-mono text-slate-500">
                  {r.count} سرویس • {r.sharePercent}٪ از کل بودجه
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Fleet Usage Breakdown (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-xs flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-teal-600" />
              سهم انواع ناوگان حمل و نقل
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">تعداد کل: ۸۱ سرویس</span>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={FLEET_USAGE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {FLEET_USAGE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any, item: any) => [
                    `${val ?? 0} بارنامه (${item?.payload?.percentage ?? 0}٪)`,
                    item?.payload?.truck || name || '',
                  ]}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    color: '#fff',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            {FLEET_USAGE_DATA.map((fleet, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  <span className="text-slate-700 font-medium">{fleet.truck}</span>
                </div>
                <span className="font-mono font-bold text-slate-800">
                  {fleet.percentage}٪ ({fleet.count} بار)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
