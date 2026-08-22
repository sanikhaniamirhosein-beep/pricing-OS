import React, { useState, useEffect } from 'react';
import {
  Activity,
  Zap,
  CheckCircle2,
  TrendingUp,
  Cpu,
  ArrowUpRight,
  Clock,
  MapPin,
  Server,
  Radio,
  BarChart2,
  Layers,
  Filter,
} from 'lucide-react';
import { usePricing } from '../../../store/PricingContext';

export const LiveOpsControlPanelView: React.FC = () => {
  const [quotesPerSecond, setQuotesPerSecond] = useState<number>(342);
  const [engineLatencyMs, setEngineLatencyMs] = useState<number>(14.2);
  const [conversionRatePercent, setConversionRatePercent] = useState<number>(68.4);
  const [activeNodesCount, setActiveNodesCount] = useState<number>(8);

  // Live Simulation ticker for real-time vibe
  useEffect(() => {
    const interval = setInterval(() => {
      setQuotesPerSecond((prev) => Math.min(480, Math.max(280, Math.round(prev + (Math.random() * 20 - 10)))));
      setEngineLatencyMs((prev) => +(Math.min(22, Math.max(9, prev + (Math.random() * 1 - 0.5)))).toFixed(1));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const liveCorridors = [
    { name: 'بندرعباس ➔ تهران', quotesMin: '۱,۲۴۰ استعلام/دقیقه', conversion: '۷۴.۲٪', latency: '۱۱.۴ms', status: 'عالی' },
    { name: 'اصفهان ➔ تبریز', quotesMin: '۸۹۰ استعلام/دقیقه', conversion: '۶۹.۰٪', latency: '۱۳.۲ms', status: 'عالی' },
    { name: 'بندر امام ➔ اراک', quotesMin: '۷۳۰ استعلام/دقیقه', conversion: '۷۱.۵٪', latency: '۱۲.۸ms', status: 'عالی' },
    { name: 'مشهد ➔ چابهار', quotesMin: '۴۱۰ استعلام/دقیقه', conversion: '۵۹.۸٪', latency: '۱۵.۱ms', status: 'نرمال' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shrink-0">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 font-title">
                  ۵.۱ داشبورد مانیتورینگ زنده عملیات (Live Operations & Telemetry)
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <Radio className="w-3 h-3 animate-pulse text-emerald-600" />
                  موتور زنده و آنلاین
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                پایش لحظه‌ای توان عملیاتی استعلام‌ها (Quotes/sec)، نرخ تبدیل به بارنامه و مانیتورینگ تأخیر زیر ۵۰ میلی‌ثانیه موتور
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200">
              {activeNodesCount} نود محاسباتی فعال در تهران و تبریز
            </span>
          </div>
        </div>
      </div>

      {/* 4 Telemetry Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">نرخ استعلام لحظه‌ای:</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900">
              {quotesPerSecond.toLocaleString('fa-IR')}
            </span>
            <span className="text-xs text-slate-400 font-mono">استعلام / ثانیه</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            +۱۴.۲٪ نسبت به ساعت قبل
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">تأخیر پاسخگویی موتور:</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-emerald-700">
              {engineLatencyMs}
            </span>
            <span className="text-xs text-slate-400 font-mono">میلی‌ثانیه (ms)</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-700 font-bold">
            هدف SLA زیر ۵۰ms (تضمین پایداری ۹۹.۹۹٪)
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">نرخ تبدیل (Quote-to-Book):</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900">
              %{conversionRatePercent}
            </span>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
              مطلوب
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            تبدیل استعلام قیمت به صدور قطعی بارنامه
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">انطباق گاردریل و امنیت:</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900">
              ۱۰۰.۰٪
            </span>
            <span className="text-xs text-emerald-700 font-bold">بدون نشت حاشیه</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            تضمین کف حاشیه سود ۱۵٪ در کلیه استعلام‌ها
          </div>
        </div>
      </div>

      {/* Real-time Corridors Traffic Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-title">
              وضعیت کریدورهای پرترافیک جاده‌ای لحظه‌ای (High-Traffic Corridors)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              ترافیک تقاضا، حجم استعلام‌ها و زمان پاسخگویی نودهای توزیع‌شده به تفکیک مسیرهای اصلی
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">کریدور حمل</th>
                <th className="py-3 px-4">حجم استعلام لحظه‌ای</th>
                <th className="py-3 px-4">نرخ تبدیل به بارنامه</th>
                <th className="py-3 px-4">تأخیر پاسخ نود</th>
                <th className="py-3 px-4">وضعیت پایداری</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {liveCorridors.map((c, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    {c.name}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                    {c.quotesMin}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                    {c.conversion}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {c.latency}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                      {c.status}
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
