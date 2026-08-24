import React from 'react';
import {
  X,
  Building2,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Star,
  Truck,
  CheckCircle2,
  FileText,
  ExternalLink,
  Award,
  CreditCard,
  User,
  Zap,
} from 'lucide-react';
import { CarrierOrgProfile } from '../../../data/mockOrganizationProfiles';

interface CarrierDetailModalProps {
  carrier: CarrierOrgProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectCarrier: (carrierId: string) => void;
  isSelected: boolean;
}

export const CarrierDetailModal: React.FC<CarrierDetailModalProps> = ({
  carrier,
  isOpen,
  onClose,
  onSelectCarrier,
  isSelected,
}) => {
  if (!isOpen || !carrier) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl ${carrier.logoBg} ${carrier.logoColor} flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs`}
            >
              {carrier.logoText}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-title">
                  {carrier.nameFa}
                </h3>
                <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  احراز هویت شده راهداری
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {carrier.nameEn} • کد شناسایی: {carrier.code}
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

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          {/* Key Advantages Summary Card */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 space-y-2.5">
            <h4 className="font-bold text-amber-950 flex items-center gap-1.5 text-xs font-title">
              <Award className="w-4 h-4 text-amber-600" />
              <span>مزیت‌های رقابتی و تعهدات سرویس (Carrier Advantages)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {carrier.strengths.map((st, i) => (
                <div
                  key={i}
                  className="bg-white/80 border border-amber-200 rounded-xl p-2.5 flex items-center gap-2 text-slate-800 font-medium"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{st}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Metrics 4-Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[11px] text-slate-400 block">امتیاز کیفیت:</span>
              <div className="flex items-center gap-1 font-bold text-slate-900 text-sm">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="font-mono">{carrier.rating}</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  ({carrier.ratingCount.toLocaleString('fa-IR')} نظر)
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[11px] text-slate-400 block">سقف بیمه مسئولیت:</span>
              <div className="flex items-center gap-1 font-bold text-teal-700 text-sm">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>{(carrier.insuranceCeilingToman / 1000000000).toLocaleString('fa-IR')} م.ت</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[11px] text-slate-400 block">تعداد ناوگان فعال:</span>
              <div className="flex items-center gap-1 font-bold text-slate-900 text-sm font-mono">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>{carrier.fleetCount.toLocaleString('fa-IR')} دستگاه</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[11px] text-slate-400 block">تخفیف قرارداد شرکتی:</span>
              <div className="flex items-center gap-1 font-bold text-emerald-700 text-sm font-mono">
                <Zap className="w-4 h-4 text-emerald-600" />
                <span>{carrier.discountPercent}٪ تخفیف</span>
              </div>
            </div>
          </div>

          {/* Legal & RMTO License Dossier */}
          <div className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-white">
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-600" />
              <span>مشخصات ثبتی و مجوزهای رسمی راهداری</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-400">شماره ثبت شرکت:</span>
                <span className="font-mono font-bold text-slate-800">{carrier.registrationNo}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-400">شناسه ملی:</span>
                <span className="font-mono font-bold text-slate-800">{carrier.nationalId}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-400">کد اقتصادی:</span>
                <span className="font-mono font-bold text-slate-800">{carrier.economicCode}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-400">شماره پروانه راهداری:</span>
                <span className="font-mono font-bold text-slate-800">{carrier.licenseNumber}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-400">مدیر ارشد / رابط دیسپچینگ:</span>
                <span className="font-bold text-slate-800">{carrier.managerName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-400">شماره تماس مستقیم:</span>
                <span className="font-mono font-bold text-slate-800">{carrier.phone}</span>
              </div>
            </div>
          </div>

          {/* Dedicated Corridors */}
          {carrier.dedicatedCorridors && carrier.dedicatedCorridors.length > 0 && (
            <div className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-white">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>کریدورهای تخصصی و ظرفیت حمل روزانه</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {carrier.dedicatedCorridors.map((corr, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between"
                  >
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span>{corr.origin}</span>
                      <span className="text-slate-400">➔</span>
                      <span>{corr.dest}</span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      ظرفیت {corr.dailyCapacityTons.toLocaleString('fa-IR')} تن/روز
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Direct Contact & Address */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-slate-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{carrier.address}</span>
            </div>
            <span className="font-mono font-bold text-slate-800 shrink-0">{carrier.phone}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl font-bold transition-colors cursor-pointer"
          >
            بستن
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectCarrier(carrier.id);
              onClose();
            }}
            className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
              isSelected
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-sm'
            }`}
          >
            {isSelected ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>شرکت منتخب فعلی است</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>انتخاب این شرکت برای دسته بار</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
