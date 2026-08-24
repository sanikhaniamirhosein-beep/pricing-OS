import React from 'react';
import {
  X,
  Scale,
  ShieldCheck,
  Star,
  Truck,
  Zap,
  CheckCircle2,
  TrendingDown,
  Building2,
  FileCheck2,
  Clock,
  ExternalLink,
  Award,
} from 'lucide-react';
import { CarrierOrgProfile, CARRIER_ORGANIZATIONS } from '../../../data/mockOrganizationProfiles';

interface BatchCarrierCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCarrierId: string;
  onSelectCarrier: (carrierId: string) => void;
  baseEstimatedRials: number;
  totalWeightTons: number;
  totalLoadsCount: number;
}

export const BatchCarrierCompareModal: React.FC<BatchCarrierCompareModalProps> = ({
  isOpen,
  onClose,
  selectedCarrierId,
  onSelectCarrier,
  baseEstimatedRials,
  totalWeightTons,
  totalLoadsCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-6xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center font-bold shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-title">
                  جدول مقایسه سر به سر شرکت‌های حمل‌ونقل (Carrier Matrix Comparison)
                </h3>
                <span className="bg-amber-100 text-amber-900 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                  {CARRIER_ORGANIZATIONS.length} شرکت معتبر راهداری
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                مقایسه نرخ‌های محاسبه‌شده برای دسته جاری ({totalLoadsCount} بارنامه - {totalWeightTons} تن)، سقف پوشش بیمه، شاخص رضایت و مزایای رقابتی
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors border border-slate-200 cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Comparison Table */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                  <th className="p-3.5 min-w-[200px]">شرکت حمل‌ونقل و مجوز</th>
                  <th className="p-3.5 min-w-[140px] text-center">مبلغ کل دسته (تومان)</th>
                  <th className="p-3.5 min-w-[120px] text-center">تخفیف سازمانی</th>
                  <th className="p-3.5 min-w-[130px] text-center">سقف بیمه مسئولیت</th>
                  <th className="p-3.5 min-w-[120px] text-center">امتیاز و سابقه</th>
                  <th className="p-3.5 min-w-[130px] text-center">ظرفیت ناوگان</th>
                  <th className="p-3.5 min-w-[240px]">مزیت‌های کلیدی رقابتی</th>
                  <th className="p-3.5 min-w-[130px] text-center">اقدام</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {CARRIER_ORGANIZATIONS.map((carrier) => {
                  const isSelected = selectedCarrierId === carrier.id;
                  const discountPct = carrier.discountPercent || 7.0;
                  const mult = carrier.priceMultiplier || 1.0;
                  const adjustedBase = baseEstimatedRials * mult;
                  const discountVal = (adjustedBase * discountPct) / 100;
                  const finalVal = adjustedBase - discountVal;

                  return (
                    <tr
                      key={carrier.id}
                      className={`transition-colors ${
                        isSelected
                          ? 'bg-amber-50/70 font-semibold'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* Carrier Logo & Info */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl ${carrier.logoBg} ${carrier.logoColor} flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs`}
                          >
                            {carrier.logoText}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{carrier.nameFa}</span>
                              {isSelected && (
                                <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded font-bold">
                                  منتخب
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5 font-mono">
                              <span>کد: {carrier.code}</span>
                              <span>•</span>
                              <span>پروانه: {carrier.licenseNumber}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Calculated Final Price for Batch */}
                      <td className="p-3.5 text-center">
                        <div className="font-mono font-bold text-slate-900 text-sm">
                          {(finalVal / 10).toLocaleString('fa-IR')}
                        </div>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          ضریب پایه: {mult}x
                        </span>
                      </td>

                      {/* Corporate Discount */}
                      <td className="p-3.5 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold font-mono text-xs">
                          <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{discountPct}٪ تخفیف</span>
                        </span>
                        <div className="text-[10px] text-emerald-700 mt-0.5 font-mono">
                          -{(discountVal / 10).toLocaleString('fa-IR')} ت
                        </div>
                      </td>

                      {/* Insurance Coverage Ceiling */}
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1 text-slate-800 font-bold">
                          <ShieldCheck className="w-4 h-4 text-teal-600" />
                          <span>
                            {(carrier.insuranceCeilingToman / 1000000000).toLocaleString('fa-IR')} میلیارد تومان
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block">بدون فرانشیز باربری</span>
                      </td>

                      {/* Rating & Trips */}
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1 text-amber-600 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                          <span className="font-mono">{carrier.rating}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {carrier.completedTrips.toLocaleString('fa-IR')} سفر
                        </span>
                      </td>

                      {/* Fleet Size */}
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1 text-slate-800 font-bold font-mono">
                          <Truck className="w-3.5 h-3.5 text-blue-600" />
                          <span>{carrier.fleetCount.toLocaleString('fa-IR')} ناوگان</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {carrier.activeDriversCount.toLocaleString('fa-IR')} راننده فعال
                        </span>
                      </td>

                      {/* Key Strengths & Advantages */}
                      <td className="p-3.5">
                        <div className="space-y-1">
                          {carrier.strengths.slice(0, 2).map((st, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{st}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Action Button */}
                      <td className="p-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            onSelectCarrier(carrier.id);
                            onClose();
                          }}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 w-full ${
                            isSelected
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>انتخاب شده</span>
                            </>
                          ) : (
                            <>
                              <Zap className="w-3.5 h-3.5 text-amber-600" />
                              <span>انتخاب این شرکت</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Quick Guide Footer */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3 text-xs text-slate-600">
            <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
            <p className="leading-relaxed">
              <strong>تضمین اصالت و مجوز راهداری:</strong> تمامی شرکت‌های فوق دارای پروانه سراسری معتبر از سازمان راهداری و حمل‌ونقل جاده‌ای کشور بوده و تخصیص ناوگان، صدور بارنامه تمبردار دولتی و پوشش بیمه باربری از طریق وب‌سرویس مستقیم سامانه Pricing OS تضمین می‌گردد.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 font-mono">
            شرکت فعال کنونی: {CARRIER_ORGANIZATIONS.find((c) => c.id === selectedCarrierId)?.nameFa || 'نامشخص'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            بستن جدول مقایسه
          </button>
        </div>
      </div>
    </div>
  );
};
