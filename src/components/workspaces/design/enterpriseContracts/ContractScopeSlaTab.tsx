import React from 'react';
import {
  Truck,
  MapPin,
  Package,
  Activity,
  Gauge,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Navigation,
} from 'lucide-react';
import { EnterpriseCorporateContract } from '../../../../types/enterpriseContract';

interface Props {
  contract: EnterpriseCorporateContract;
}

export const ContractScopeSlaTab: React.FC<Props> = ({ contract }) => {
  const { scopeOfService } = contract;
  const { sla, allocatedFleetCapacity } = scopeOfService;

  return (
    <div className="space-y-6">
      {/* Service Overview Description */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
          <Truck className="w-4 h-4 text-indigo-600" />
          شرح کلی خدمات و دامنه عملیاتی توافق‌شده
        </div>
        <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
          {scopeOfService.description}
        </p>
      </div>

      {/* SLA Metrics Dashboard Cards */}
      <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-emerald-400" />
            <h4 className="text-sm font-bold text-white">توافق‌نامه سطح خدمات (Service Level Agreement - SLA)</h4>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            استاندارد کلاس طلایی
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1.5">
            <div className="text-[11px] text-slate-400">تحویل به‌موقع (On-Time Delivery)</div>
            <div className="text-xl font-bold font-mono text-emerald-400">{sla.onTimeDeliveryPercent}٪</div>
            <p className="text-[10px] text-slate-400">حداقل تعهد حضور در مبدا و مقصد</p>
          </div>

          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1.5">
            <div className="text-[11px] text-slate-400">سلامت محموله (Damage-Free)</div>
            <div className="text-xl font-bold font-mono text-cyan-400">{sla.damageFreePercent}٪</div>
            <p className="text-[10px] text-slate-400">بدون کسری، خیس‌خوردگی یا آسیب فیزیکی</p>
          </div>

          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1.5">
            <div className="text-[11px] text-slate-400">زمان اعزام دیسپاچینگ (Dispatch ETA)</div>
            <div className="text-xl font-bold font-mono text-amber-400">{sla.dispatchResponseTimeMinutes} دقیقه</div>
            <p className="text-[10px] text-slate-400">حداکثر زمان صدور حواله بارگیری</p>
          </div>

          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1.5">
            <div className="text-[11px] text-slate-400">سقف معطلی تخلیه قبل از دموراژ</div>
            <div className="text-xl font-bold font-mono text-indigo-300">{sla.maxUnloadingDelayHours} ساعت</div>
            <p className="text-[10px] text-slate-400">مهلت استاندارد بارگیری و توزین باسکول</p>
          </div>
        </div>

        <div className="text-xs text-slate-300 bg-slate-800/50 p-3 rounded-xl border border-slate-700/60 flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{sla.trackingAvailability}</span>
        </div>
      </div>

      {/* Routes & Cargo Types & Fleet Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Covered Routes */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-100 pb-2.5">
            <MapPin className="w-4 h-4 text-rose-600" />
            مسیرها و کریدورهای تحت پوشش
          </div>
          <div className="space-y-2">
            {scopeOfService.coveredRoutesOrZones.map((route, idx) => (
              <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 text-xs text-slate-700">
                <Navigation className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <span>{route}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Allowed Cargo Types */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-100 pb-2.5">
            <Package className="w-4 h-4 text-amber-600" />
            نوع بار و محموله‌های مجاز
          </div>
          <div className="space-y-2">
            {scopeOfService.allowedCommodityTypes.map((cargo, idx) => (
              <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 text-xs text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{cargo}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fleet Allocation */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-100 pb-2.5">
            <Truck className="w-4 h-4 text-indigo-600" />
            ظرفیت و ناوگان اختصاص‌یافته
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-100">
              <span className="text-slate-600">تعداد ناوگان ثابت اختصاصی:</span>
              <span className="font-bold font-mono text-indigo-700">
                {allocatedFleetCapacity.truckCount} دستگاه کشنده
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-100">
              <span className="text-slate-600">حداقل تعهد تناژ ماهانه:</span>
              <span className="font-bold font-mono text-indigo-700">
                {allocatedFleetCapacity.monthlyMinTonnage.toLocaleString('fa-IR')} تن
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl text-slate-600 space-y-1">
              <span className="font-semibold block text-[11px]">تیپ خودروهای مجاز:</span>
              <div className="flex flex-wrap gap-1 text-[11px]">
                {allocatedFleetCapacity.vehicleTypes.map((vt, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-white rounded border border-slate-200 text-slate-700">
                    {vt}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
