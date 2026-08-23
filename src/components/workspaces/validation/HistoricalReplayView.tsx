import React, { useState } from 'react';
import {
  History,
  Play,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Filter,
  BarChart3,
  Sparkles,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { usePricing } from '../../../store/PricingContext';
import { ModernSelect } from '../../common/menus/ModernSelect';

export const HistoricalReplayView: React.FC = () => {
  const [replayTimeframe, setReplayTimeframe] = useState<'3m' | '6m' | '12m'>('6m');
  const [industryFilter, setIndustryFilter] = useState<'all' | 'petrochemical' | 'steel' | 'food' | 'general'>('all');
  const [isRunningSimulation, setIsRunningSimulation] = useState(false);
  const [hasRun, setHasRun] = useState(true);

  // Simulation Metrics
  const sampleCount = replayTimeframe === '3m' ? 4250 : replayTimeframe === '6m' ? 10480 : 22150;
  const actualRevenueBillionToman = replayTimeframe === '3m' ? 148.5 : replayTimeframe === '6m' ? 362.8 : 790.2;
  const simulatedRevenueBillionToman = replayTimeframe === '3m' ? 159.2 : replayTimeframe === '6m' ? 391.4 : 851.6;
  const deltaPercent = ((simulatedRevenueBillionToman - actualRevenueBillionToman) / actualRevenueBillionToman) * 100;
  const actualMarginPercent = 16.4;
  const simulatedMarginPercent = 18.9;

  const handleRunReplay = () => {
    setIsRunningSimulation(true);
    setTimeout(() => {
      setIsRunningSimulation(false);
      setHasRun(true);
    }, 1200);
  };

  const industryImpact = [
    {
      name: 'صنایع پتروشیمی و گاز مایع',
      actualRev: 142.5,
      simRev: 154.2,
      delta: '+8.2%',
      margin: '21.4%',
      risk: 'کم‌ریسک',
      color: 'bg-blue-500',
    },
    {
      name: 'فولاد، میلگرد و فلزات سنگین',
      actualRev: 110.2,
      simRev: 121.8,
      delta: '+10.5%',
      margin: '18.2%',
      risk: 'متوسط',
      color: 'bg-amber-500',
    },
    {
      name: 'صنایع غذایی، لبنی و فاسدشدنی',
      actualRev: 68.4,
      simRev: 72.9,
      delta: '+6.5%',
      margin: '19.8%',
      risk: 'کم‌ریسک',
      color: 'bg-emerald-500',
    },
    {
      name: 'کالای تجاری، خرده‌بار و قطعات',
      actualRev: 41.7,
      simRev: 42.5,
      delta: '+1.9%',
      margin: '15.5%',
      risk: 'حساس به قیمت',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shrink-0">
              <History className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 font-title">
                  ۳.۱ شبیه‌سازی داده‌های تاریخی (Historical Replay Engine)
                </h1>
                <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {sampleCount.toLocaleString('fa-IR')} بارنامه نمونه
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                اجرای سناریوهای جدید تعرفه روی بارنامه‌های صادر شده ۳ تا ۱۲ ماه گذشته و سنجش اثرات مالی بر درآمد، سود ناخالص و نرخ پذیرش
              </p>
            </div>
          </div>

          <button
            onClick={handleRunReplay}
            disabled={isRunningSimulation}
            className="px-5 py-2.5 bg-amber-700 hover:bg-amber-800 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer self-start md:self-auto"
          >
            {isRunningSimulation ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                در حال پردازش بارنامه‌ها...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                اجرای شبیه‌سازی Replay
              </>
            )}
          </button>
        </div>

        {/* Filter Controls */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Calendar className="w-4 h-4 text-slate-400" />
              بازه زمانی بازپخش:
            </div>
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setReplayTimeframe('3m')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  replayTimeframe === '3m' ? 'bg-amber-700 text-white shadow-2xs' : 'text-slate-600'
                }`}
              >
                ۳ ماه گذشته
              </button>
              <button
                onClick={() => setReplayTimeframe('6m')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  replayTimeframe === '6m' ? 'bg-amber-700 text-white shadow-2xs' : 'text-slate-600'
                }`}
              >
                ۶ ماه گذشته (پیش‌فرض)
              </button>
              <button
                onClick={() => setReplayTimeframe('12m')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  replayTimeframe === '12m' ? 'bg-amber-700 text-white shadow-2xs' : 'text-slate-600'
                }`}
              >
                ۱۲ ماه (یک سال کامل)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 min-w-[220px]">
            <ModernSelect
              id="replay-industry-filter"
              value={industryFilter}
              onChange={(val) => setIndustryFilter(val as any)}
              icon={<Filter className="w-3.5 h-3.5 text-slate-400" />}
              options={[
                { value: 'all', label: 'همه صنایع و گروه‌های کالایی', badge: 'جامع' },
                { value: 'petrochemical', label: 'پتروشیمی و مواد شیمیایی', badge: 'صنعت' },
                { value: 'steel', label: 'فولاد و مصالح ساختمانی', badge: 'صنعت' },
                { value: 'food', label: 'صنایع غذایی و کشاورزی', badge: 'صنعت' },
              ]}
              className="w-56"
            />
          </div>
        </div>
      </div>

      {/* KPI Comparison Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
          <span className="text-xs text-slate-500 block">درآمد واقعی ثبت‌شده (Actual):</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-slate-900">
              {actualRevenueBillionToman.toLocaleString('fa-IR')} میلیارد
            </span>
            <span className="text-xs text-slate-400">تومان</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">بر اساس نرخ‌های گذشته</span>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
          <span className="text-xs text-slate-500 block">درآمد شبیه‌سازی‌شده (Simulated):</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-amber-900">
              {simulatedRevenueBillionToman.toLocaleString('fa-IR')} میلیارد
            </span>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +{deltaPercent.toFixed(1)}%
            </span>
          </div>
          <span className="text-[11px] text-emerald-700 font-bold mt-1 block">
            +{(simulatedRevenueBillionToman - actualRevenueBillionToman).toFixed(1)} میلیارد رشد ناخالص
          </span>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
          <span className="text-xs text-slate-500 block">حاشیه سود شرکت (Margin):</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-slate-900">
              %{simulatedMarginPercent}
            </span>
            <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              +{ (simulatedMarginPercent - actualMarginPercent).toFixed(1) }% رشد حاشیه
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">حاشیه قبلی: %{actualMarginPercent}</span>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
          <span className="text-xs text-slate-500 block">نرخ انطباق با گاردریل‌ها:</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-emerald-700">
              ۹۹.۲٪
            </span>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              امن
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">۸۲ بارنامه نیاز به مهار Clamp</span>
        </div>
      </div>

      {/* Breakdown by Industry */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-title">
              تفکیک اثر مالی سناریوی جدید بر صنایع و بخش‌های مختلف
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              مقایسه عملکرد درآمدی و حاشیه سود به تفکیک دسته‌های صنعتی در طول بازه شبیه‌سازی
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">گروه صنعتی</th>
                <th className="py-3 px-4">درآمد واقعی گذشته</th>
                <th className="py-3 px-4">درآمد سناریوی جدید</th>
                <th className="py-3 px-4">درصد تغییر درآمد</th>
                <th className="py-3 px-4">حاشیه سود ناخالص</th>
                <th className="py-3 px-4">ارزیابی ریسک پذیرش</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {industryImpact.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    {item.name}
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    {item.actualRev.toLocaleString('fa-IR')} میلیارد ت
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-900">
                    {item.simRev.toLocaleString('fa-IR')} میلیارد ت
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {item.delta}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {item.margin}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        item.risk === 'کم‌ریسک'
                          ? 'bg-emerald-50 text-emerald-700'
                          : item.risk === 'متوسط'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {item.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
