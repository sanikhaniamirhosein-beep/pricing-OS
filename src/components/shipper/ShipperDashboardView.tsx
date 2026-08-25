import React from 'react';
import {
  Calculator,
  PlusCircle,
  Search,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  ArrowLeft,
  ChevronLeft,
  LifeBuoy,
  AlertTriangle,
  FileSpreadsheet,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { usePricing } from '../../store/PricingContext';
import { ShipperActiveLoad } from '../../data/mockShipperData';

interface ShipperDashboardViewProps {
  onNavigateTab: (tabId: string) => void;
  onSelectShipmentToTrack?: (shipment: ShipperActiveLoad) => void;
  activeLoads?: ShipperActiveLoad[];
}

export const ShipperDashboardView: React.FC<ShipperDashboardViewProps> = ({
  onNavigateTab,
  onSelectShipmentToTrack,
  activeLoads,
}) => {
  const { currentShipperOrg, userOrgName } = usePricing();
  const currentLoads = (activeLoads && activeLoads.length > 0) ? activeLoads : (currentShipperOrg?.activeLoads || []);
  const inTransitCount = (currentLoads || []).filter((l) => l?.status === 'in_transit').length;
  const loadingCount = (currentLoads || []).filter((l) => l && (l.status === 'loading' || l.status === 'pending_driver')).length;
  const deliveredCount = (currentLoads || []).filter((l) => l?.status === 'delivered').length;

  const tierInfo = currentShipperOrg.tierInfo;
  const spendData = currentShipperOrg.monthlySpendData || [
    { month: 'فروردین', amountMillionRials: 420 },
    { month: 'اردیبهشت', amountMillionRials: 560 },
    { month: 'خرداد', amountMillionRials: 680 },
    { month: 'تیر', amountMillionRials: 890 },
    { month: 'مرداد', amountMillionRials: 740 },
    { month: 'شهریور', amountMillionRials: 980 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Quick Actions Hero Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Quick Action 1: استعلام جدید - Dominant Ocean Blue / Teal */}
        <button
          type="button"
          onClick={() => onNavigateTab('quote')}
          className="p-5 bg-gradient-to-br from-sky-600 via-sky-700 to-teal-700 hover:from-sky-700 hover:to-teal-800 text-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 text-right group cursor-pointer flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-medium text-sky-100 uppercase tracking-wider block">
              موتور قیمت‌گذاری آنی
            </span>
            <h3 className="text-base font-bold flex items-center gap-2">
              <Calculator className="w-5 h-5 text-sky-200 group-hover:scale-110 transition-transform" />
              استعلام نرخ آنی
            </h3>
            <p className="text-xs text-sky-100/90 font-medium line-clamp-1">
              محاسبه و دریافت پیش‌فاکتور رسمی
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <ArrowLeft className="w-4 h-4 text-white" />
          </div>
        </button>

        {/* Quick Action 2: ثبت دسته‌ای بار (اکسل) - Emerald Green CTA */}
        <button
          type="button"
          onClick={() => onNavigateTab('batch_orders')}
          className="p-5 bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 text-right group cursor-pointer flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-medium text-emerald-100 uppercase tracking-wider block">
              سفارش همزمان شرکتی
            </span>
            <h3 className="text-base font-bold flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-100 group-hover:scale-110 transition-transform" />
              ثبت دسته‌ای (اکسل)
            </h3>
            <p className="text-xs text-emerald-100/90 font-medium line-clamp-1">
              آپلود فایل و اتصال مستقیم به ERP
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <ArrowLeft className="w-4 h-4 text-white" />
          </div>
        </button>

        {/* Quick Action 3: ثبت بار تک / درخواست ناوگان حمل - High-Contrast Bright Amber/Indigo Theme with Crystal-Clear Legibility */}
        <button
          type="button"
          onClick={() => onNavigateTab('quote')}
          className="p-5 bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 text-right group cursor-pointer flex items-center justify-between border border-amber-400/40"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-amber-100 uppercase tracking-wider block drop-shadow-xs">
              درخواست ناوگان حمل
            </span>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2 drop-shadow-xs">
              <PlusCircle className="w-5 h-5 text-amber-100 group-hover:scale-110 transition-transform" />
              ثبت سفارش تکی
            </h3>
            <p className="text-xs text-amber-50 font-bold line-clamp-1 drop-shadow-2xs">
              تخصیص فوری کامیون و صدور حواله
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-white/25 group-hover:bg-white/35 flex items-center justify-center shrink-0 transition-colors shadow-2xs">
            <ArrowLeft className="w-4 h-4 text-white" />
          </div>
        </button>

        {/* Quick Action 4: پیگیری و رهگیری بار - Soft Off-White Clean */}
        <button
          type="button"
          onClick={() => onNavigateTab('shipments')}
          className="p-5 bg-white hover:bg-sky-50/50 border border-sky-100 hover:border-sky-200 text-slate-800 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 text-right group cursor-pointer flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              ردیابی ماهواره‌ای GPS
            </span>
            <h3 className="text-base font-bold flex items-center gap-2 text-slate-900">
              <Search className="w-5 h-5 text-sky-600 group-hover:scale-110 transition-transform" />
              رهگیری زنده بارها
            </h3>
            <p className="text-xs text-slate-500 font-medium line-clamp-1">
              مشاهده موقعیت لحظه‌ای و ETA
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-sky-50 group-hover:bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </div>
        </button>
      </div>

      {/* In-Transit Support & Active Incident Alert Bar */}
      <div className="bg-gradient-to-r from-sky-50 via-white to-teal-50 p-3.5 sm:p-4 rounded-2xl border border-sky-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-600 to-teal-600 text-white flex items-center justify-center font-bold shrink-0 shadow-2xs">
            <LifeBuoy className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <span>پشتیبانی و رسیدگی به فوریت‌های حین حمل</span>
              <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-900 font-bold text-[10px] border border-sky-300">
                ۲ تیکت فعال دیسپچینگ
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              پیگیری تاخیرات جاده‌ای، نقض پلمپ، توقف فنی و خسارت مستقیم از صفحه هر بارنامه با پاسخگویی زیر ۵ دقیقه
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigateTab('support')}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer shadow-xs"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>ورود به مرکز پشتیبانی و تیکت‌ها</span>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Active Load Status Cards & Wallet Widget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: بارهای در حال حمل */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">بارهای در حال حمل</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-sky-600">{inTransitCount}</span>
              <span className="text-xs text-slate-400 font-medium">محموله جاده‌ای</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              در حال تردد آنلاین در شبکه
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200/60 text-sky-600 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2: آماده بارگیری */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">آماده بارگیری / اعزام</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-teal-600">{loadingCount}</span>
              <span className="text-xs text-slate-400 font-medium">سفارش فعال</span>
            </div>
            <span className="text-[11px] text-teal-600 font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              در انتظار بارگیری در انبار مبدا
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200/60 text-teal-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3: تحویل داده شده امروز */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">تحویل داده‌شده امروز</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-emerald-600">{deliveredCount}</span>
              <span className="text-xs text-slate-400 font-medium">بارنامه با امضای POD</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              تایید دیجیتال گیرنده ثبت شد
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4: وضعیت اعتبار و کیف پول شرکتی - Deep Purple / Navy Card */}
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 p-4.5 rounded-2xl text-white shadow-xs flex flex-col justify-between border border-indigo-900/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-indigo-200 flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-teal-400" />
              مانده اعتبار تجاری (Credit)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold border border-teal-400/30">
              سطح {tierInfo?.tierName || 'طلایی'}
            </span>
          </div>

          <div className="my-2">
            <div className="text-xl font-bold font-mono text-teal-300">
              {((tierInfo?.availableCreditRials || 0) / 10).toLocaleString('fa-IR')}{' '}
              <span className="text-xs font-normal text-slate-300">تومان</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              سقف کل اعتبار: {((tierInfo?.creditLimitRials || 0) / 10).toLocaleString('fa-IR')} تومان
            </div>
          </div>

          {/* CTA: Emerald Green button */}
          <button
            type="button"
            onClick={() => onNavigateTab('billing')}
            className="w-full py-1.5 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <span>مدیریت کیف پول و افزایش اعتبار</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Central Dual Panel: Monthly Spend Chart + Live Loads Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Monthly Logistics Spend Graph */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-sky-600" />
                روند هزینه‌های ماهانه حمل و نقل ({currentShipperOrg.nameFa})
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                بررسی مجموع صورتحساب‌ها و کرایه‌های پرداختی در ۶ ماه اخیر
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-sky-900 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                آخرین ماه: {(spendData[spendData.length - 1]?.amountMillionRials || 0) * 100000} تومان
              </span>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#94a3b8"
                  fontSize={11}
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
                  formatter={(value: any) => [`${value} میلیون تومان`, 'هزینه حمل']}
                  labelStyle={{ fontFamily: 'Vazirmatn', fontWeight: 'bold' }}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    color: '#fff',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amountMillionRials"
                  stroke="#0284c7"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#spendGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Live Shipments Snapshot & Tier Progress */}
        <div className="space-y-4">
          {/* Tier Progress Widget */}
          <div className="bg-gradient-to-br from-sky-50/90 to-teal-50/70 border border-sky-200/80 p-4.5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-600" />
                <span className="font-bold text-xs text-sky-950">پله وفاداری و تخفیف شرکتی</span>
              </div>
              <span className="text-[11px] font-bold text-teal-900 bg-teal-100 px-2 py-0.5 rounded-md font-mono border border-teal-200">
                {tierInfo.currentDiscountPercent}% تخفیف فعال
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-600">
                <span>حجم بار این ماه: <strong className="font-mono text-slate-800">{tierInfo.monthlyVolumeTons}</strong> تن</span>
                <span>هدف پله بعدی: <strong className="font-mono text-slate-800">{tierInfo.targetVolumeTons}</strong> تن</span>
              </div>
              <div className="w-full h-2.5 bg-sky-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-teal-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.round((tierInfo.monthlyVolumeTons / tierInfo.targetVolumeTons) * 100))}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-sky-950 font-medium">
                تنها <strong>{Math.max(0, tierInfo.targetVolumeTons - tierInfo.monthlyVolumeTons)} تن</strong> تا ارتقا به پله «{tierInfo.nextTierName}» و دریافت <strong>{tierInfo.nextTierDiscountPercent}% تخفیف</strong>.
              </p>
            </div>
          </div>

          {/* Quick Active Loads List */}
          <div className="bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-sky-600" />
                آخرین محموله‌های در حال حرکت
              </h4>
              <button
                type="button"
                onClick={() => onNavigateTab('shipments')}
                className="text-[11px] text-sky-700 hover:text-sky-950 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>مشاهده همه</span>
                <ChevronLeft className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2">
              {currentLoads.slice(0, 3).map((load) => (
                <div
                  key={load.id}
                  onClick={() => {
                    if (onSelectShipmentToTrack) onSelectShipmentToTrack(load);
                    onNavigateTab('shipments');
                  }}
                  className="p-3 bg-slate-50 hover:bg-sky-50/60 border border-slate-200/80 hover:border-sky-200 rounded-xl transition-all cursor-pointer text-xs space-y-1.5 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 group-hover:text-sky-950 font-mono">
                      {load.billOfLadingNo}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-sky-100 text-sky-900 font-bold">
                      {load.statusLabelFa}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>{load.originCity} ➔ {load.destCity}</span>
                    <span className="font-mono">{load.truckType}</span>
                  </div>

                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-sky-500 to-teal-500 h-full rounded-full"
                      style={{ width: `${load.progressPercent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
