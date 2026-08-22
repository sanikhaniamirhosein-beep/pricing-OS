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
} from 'lucide-react';
import {
  INITIAL_ACTIVE_LOADS,
  INITIAL_SHIPPER_TIER,
  MONTHLY_SPEND_DATA,
  ShipperActiveLoad,
} from '../../data/mockShipperData';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ShipperDashboardViewProps {
  onNavigateTab: (tabId: string) => void;
  onSelectShipmentToTrack?: (shipment: ShipperActiveLoad) => void;
}

export const ShipperDashboardView: React.FC<ShipperDashboardViewProps> = ({
  onNavigateTab,
  onSelectShipmentToTrack,
}) => {
  const inTransitCount = INITIAL_ACTIVE_LOADS.filter((l) => l.status === 'in_transit').length;
  const loadingCount = INITIAL_ACTIVE_LOADS.filter((l) => l.status === 'loading' || l.status === 'pending_driver').length;
  const deliveredCount = INITIAL_ACTIVE_LOADS.filter((l) => l.status === 'delivered').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Quick Actions Hero Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Quick Action 1: استعلام جدید */}
        <button
          type="button"
          onClick={() => onNavigateTab('quote')}
          className="p-5 bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 text-right group cursor-pointer flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-medium text-amber-100 uppercase tracking-wider block">
              موتور قیمت‌گذاری آنی
            </span>
            <h3 className="text-base font-bold flex items-center gap-2">
              <Calculator className="w-5 h-5 text-amber-100 group-hover:scale-110 transition-transform" />
              استعلام جدید کرایه
            </h3>
            <p className="text-xs text-amber-100/90 font-medium">
              محاسبه شفاف و دریافت پیش‌فاکتور رسمی در چند ثانیه
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <ArrowLeft className="w-5 h-5 text-white" />
          </div>
        </button>

        {/* Quick Action 2: ثبت بار جدید */}
        <button
          type="button"
          onClick={() => onNavigateTab('quote')}
          className="p-5 bg-gradient-to-br from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 text-right group cursor-pointer flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-medium text-teal-100 uppercase tracking-wider block">
              درخواست ناوگان حمل
            </span>
            <h3 className="text-base font-bold flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-teal-100 group-hover:scale-110 transition-transform" />
              ثبت سفارش بار
            </h3>
            <p className="text-xs text-teal-100/90 font-medium">
              تخصیص فوری کامیون و صدور حواله الکترونیک
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <ArrowLeft className="w-5 h-5 text-white" />
          </div>
        </button>

        {/* Quick Action 3: پیگیری و رهگیری بار */}
        <button
          type="button"
          onClick={() => onNavigateTab('shipments')}
          className="p-5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 text-right group cursor-pointer flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              ردیابی ماهواره‌ای GPS
            </span>
            <h3 className="text-base font-bold flex items-center gap-2 text-slate-900">
              <Search className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform" />
              رهگیری زنده بارها
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              مشاهده موقعیت لحظه‌ای کامیون و تخمین زمان رسیدن (ETA)
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-amber-100 text-slate-600 group-hover:text-amber-900 flex items-center justify-center shrink-0 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </div>
        </button>
      </div>

      {/* 2. Active Load Status Cards & Wallet Widget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: بارهای در حال حمل */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">بارهای در حال حمل</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-amber-600">{inTransitCount}</span>
              <span className="text-xs text-slate-400 font-medium">محموله جاده‌ای</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              در حال تردد آنلاین در شبکه
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-600 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2: آماده بارگیری */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">آماده بارگیری / اعزام</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-blue-600">{loadingCount}</span>
              <span className="text-xs text-slate-400 font-medium">سفارش فعال</span>
            </div>
            <span className="text-[11px] text-blue-600 font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              در انتظار بارگیری در انبار مبدا
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200/60 text-blue-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3: تحویل داده شده امروز */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
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

        {/* Metric 4: وضعیت اعتبار و کیف پول شرکتی */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-4.5 rounded-2xl text-white shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-amber-400" />
              مانده اعتبار تجاری (Credit)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
              سطح {INITIAL_SHIPPER_TIER.tierName}
            </span>
          </div>

          <div className="my-2">
            <div className="text-xl font-bold font-mono text-amber-300">
              {(INITIAL_SHIPPER_TIER.availableCreditRials / 10).toLocaleString('fa-IR')}{' '}
              <span className="text-xs font-normal text-slate-300">تومان</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              سقف کل اعتبار: {(INITIAL_SHIPPER_TIER.creditLimitRials / 10).toLocaleString('fa-IR')} تومان
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('billing')}
            className="w-full py-1.5 px-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>مدیریت کیف پول و افزایش اعتبار</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Central Dual Panel: Monthly Spend Chart + Live Loads Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Monthly Logistics Spend Graph */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                روند هزینه‌های ماهانه حمل و نقل (۶ ماه گذشته)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                بررسی مجموع صورتحساب‌ها و کرایه‌های پرداختی شرکت
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                مجموع شهریور: ۴۱,۳۰۰,۰۰۰ تومان
              </span>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_SPEND_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
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
                  formatter={(value: any) => [`${value} میلیون ریال`, 'هزینه حمل']}
                  labelStyle={{ fontFamily: 'Vazirmatn', fontWeight: 'bold' }}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    color: '#fff',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amountMillionRials"
                  stroke="#f59e0b"
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
          <div className="bg-amber-50/70 border border-amber-200/80 p-4.5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                <span className="font-bold text-xs text-amber-950">پله وفاداری و تخفیف شرکتی</span>
              </div>
              <span className="text-[11px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md font-mono">
                {INITIAL_SHIPPER_TIER.currentDiscountPercent}% تخفیف فعال
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-600">
                <span>حجم بار این ماه: <strong className="font-mono">{INITIAL_SHIPPER_TIER.monthlyVolumeTons}</strong> تن</span>
                <span>هدف پله بعدی: <strong className="font-mono">{INITIAL_SHIPPER_TIER.targetVolumeTons}</strong> تن</span>
              </div>
              <div className="w-full h-2.5 bg-amber-200/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${(INITIAL_SHIPPER_TIER.monthlyVolumeTons / INITIAL_SHIPPER_TIER.targetVolumeTons) * 100}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-amber-900 font-medium">
                تنها <strong>{INITIAL_SHIPPER_TIER.targetVolumeTons - INITIAL_SHIPPER_TIER.monthlyVolumeTons} تن</strong> تا ارتقا به پله «{INITIAL_SHIPPER_TIER.nextTierName}» و دریافت <strong>{INITIAL_SHIPPER_TIER.nextTierDiscountPercent}% تخفیف</strong>.
              </p>
            </div>
          </div>

          {/* Quick Active Loads List */}
          <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-600" />
                آخرین محموله‌های در حال حرکت
              </h4>
              <button
                type="button"
                onClick={() => onNavigateTab('shipments')}
                className="text-[11px] text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>مشاهده همه</span>
                <ChevronLeft className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2">
              {INITIAL_ACTIVE_LOADS.slice(0, 2).map((load) => (
                <div
                  key={load.id}
                  onClick={() => {
                    if (onSelectShipmentToTrack) onSelectShipmentToTrack(load);
                    onNavigateTab('shipments');
                  }}
                  className="p-3 bg-slate-50 hover:bg-amber-50/60 border border-slate-200/80 hover:border-amber-200 rounded-xl transition-all cursor-pointer text-xs space-y-1.5 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 group-hover:text-amber-950 font-mono">
                      {load.billOfLadingNo}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold">
                      {load.statusLabelFa}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>{load.originCity} ➔ {load.destCity}</span>
                    <span className="font-mono">{load.truckType}</span>
                  </div>

                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full"
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
