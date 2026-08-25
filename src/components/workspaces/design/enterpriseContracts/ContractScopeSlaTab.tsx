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
    <div className="space-y-5">
      {/* Service Overview Description */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-100 pb-3">
          <Truck className="w-4 h-4 text-slate-700" />
          <span>شرح کلی دامنه خدمات و الزامات عملیاتی حمل</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          {scopeOfService.description}
        </p>
      </div>

      {/* SLA Metrics Dashboard Cards (Clean Light Theme) */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-slate-700" />
            <h4 className="text-xs font-bold text-slate-900">توافق‌نامه سطح خدمات (Service Level Agreement - SLA)</h4>
          </div>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
            استاندارد طلایی
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1.5">
            <span className="text-[11px] font-medium text-slate-500">تحویل به‌موقع (On-Time Delivery)</span>
            <div className="text-xl font-bold font-mono text-emerald-800">{sla.onTimeDeliveryPercent}٪</div>
            <p className="text-[10px] text-slate-500">حداقل تعهد حضور در مبدا و مقصد</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1.5">
            <span className="text-[11px] font-medium text-slate-500">سلامت محموله (Damage-Free)</span>
            <div className="text-xl font-bold font-mono text-teal-800">{sla.damageFreePercent}٪</div>
            <p className="text-[10px] text-slate-500">بدون کسری، خیس‌خوردگی یا آسیب</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1.5">
            <span className="text-[11px] font-medium text-slate-500">زمان اعزام ناوگان (Dispatch ETA)</span>
            <div className="text-xl font-bold font-mono text-amber-800">{sla.dispatchResponseTimeMinutes} دقیقه</div>
            <p className="text-[10px] text-slate-500">حداکثر مهلت صدور حواله بارگیری</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1.5">
            <span className="text-[11px] font-medium text-slate-500">سقف معطلی تخلیه قبل از دموراژ</span>
            <div className="text-xl font-bold font-mono text-slate-900">{sla.maxUnloadingDelayHours} ساعت</div>
            <p className="text-[10px] text-slate-500">مهلت استاندارد بارگیری و توزین باسکول</p>
          </div>
        </div>

        <div className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>پوشش رهگیری و موقعیت‌یاب دیتالاگر: <strong>{sla.trackingAvailability}</strong></span>
        </div>
      </div>

      {/* Routes & Fleet Allocation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Navigation className="w-4 h-4 text-slate-700" />
            <h4 className="text-xs font-bold text-slate-900">کریدورها و مناطق جغرافیایی تحت پوشش</h4>
          </div>

          <div className="space-y-2 text-xs">
            {scopeOfService.coveredRoutesOrZones.map((route, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60"
              >
                <div className="flex items-center gap-2 text-slate-800 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{route}</span>
                </div>
                <span className="text-slate-500 text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200">
                  تحت پوشش کامل
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Truck className="w-4 h-4 text-slate-700" />
            <h4 className="text-xs font-bold text-slate-900">تعهد ظرفیت ناوگان اختصاصی</h4>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">حداقل تعهد تناژ ماهانه:</span>
              <span className="font-mono font-bold text-slate-900">
                {allocatedFleetCapacity?.monthlyMinTonnage?.toLocaleString('fa-IR') || '-'} تن بار
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">تعداد کشنده‌های اختصاصی دپو شده:</span>
              <span className="font-mono font-bold text-slate-900">
                {allocatedFleetCapacity?.truckCount?.toLocaleString('fa-IR') || '-'} دستگاه تریلی
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">انواع بارگیرهای مجاز:</span>
              <div className="flex gap-1.5 flex-wrap">
                {(allocatedFleetCapacity?.vehicleTypes || ['تریلی چادری', 'تریلی کفی']).map((vt, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
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
