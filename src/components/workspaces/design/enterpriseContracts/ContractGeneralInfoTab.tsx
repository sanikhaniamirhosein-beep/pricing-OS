import React from 'react';
import {
  FileText,
  Hash,
  Layers,
  ShieldCheck,
  Tag,
  Building,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck2,
  Calendar,
} from 'lucide-react';
import { EnterpriseCorporateContract } from '../../../../types/enterpriseContract';

interface Props {
  contract: EnterpriseCorporateContract;
  onUpdate?: (updated: Partial<EnterpriseCorporateContract>) => void;
}

export const ContractGeneralInfoTab: React.FC<Props> = ({ contract }) => {
  const { generalInfo } = contract;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            فعال و لازم‌الاجرا
          </span>
        );
      case 'pending_sign':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            در انتظار امضا و تشریفات
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <FileText className="w-3.5 h-3.5" />
            پیش‌نویس اولیه
          </span>
        );
      case 'renewing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200">
            در حال تمدید توافقی
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            منقضی شده
          </span>
        );
      case 'terminated':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-900 border border-rose-300">
            فسخ‌شده
          </span>
        );
      default:
        return null;
    }
  };

  const getContractTypeFa = (type: string) => {
    const map: Record<string, string> = {
      freight_transport: 'حمل‌ونقل باری و ترانزیت جاده‌ای',
      fleet_contracting: 'پیمانکاری و اختصاص ناوگان سنگین',
      vehicle_lease: 'اجاره وسیله نقلیه و کشنده لجستیکی',
      logistics_services: 'خدمات جامع لجستیک، توزیع و انبارداری',
      intercompany_cooperation: 'همکاری راهبردی بین‌شرکتی و کنسرسیوم',
      distribution_retail: 'توزیع مویرگی و پخش سراسری',
      transit_crossborder: 'ترانزیت بین‌المللی و گمرکی (TIR)',
      bulk_hazardous_transport: 'حمل فله صنعتی و مواد ویژه / خطرناک (ADR)',
    };
    return map[type] || type;
  };

  const getCategoryFa = (cat: string) => {
    switch (cat) {
      case 'domestic':
        return 'داخلی (سراسری کشور)';
      case 'intercompany':
        return 'بین‌شرکتی و هلدینگی';
      case 'international':
        return 'بین‌المللی و ترانزیت مرزی';
      default:
        return cat;
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Overview Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-slate-500">عنوان کامل موضوع قرارداد</span>
            <h2 className="text-base font-bold text-slate-900 leading-snug">
              {generalInfo.title}
            </h2>
          </div>
          <div>{getStatusBadge(generalInfo.status)}</div>
        </div>

        {/* 4-Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
            <span className="text-xs font-medium text-slate-500">شماره ثبت قرارداد</span>
            <div className="text-sm font-mono font-bold text-slate-900">
              {generalInfo.contractNumber}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
            <span className="text-xs font-medium text-slate-500">نوع قالب توافق‌نامه</span>
            <div className="text-xs font-bold text-slate-900 leading-snug">
              {getContractTypeFa(generalInfo.contractType)}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
            <span className="text-xs font-medium text-slate-500">دسته‌بندی قلمرو</span>
            <div className="text-xs font-bold text-slate-900">
              {getCategoryFa(generalInfo.category)}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
            <span className="text-xs font-medium text-slate-500">واحد متولی سازمانی</span>
            <div className="text-xs font-bold text-slate-900">
              {generalInfo.departmentScope || 'معاونت بازرگانی و قراردادها'}
            </div>
          </div>
        </div>

        {/* Summary Narrative */}
        {generalInfo.summaryFa && (
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-900">خلاصه اجرایی و شرح اهداف تجاری</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              {generalInfo.summaryFa}
            </p>
          </div>
        )}
      </div>

      {/* Specifications & Parameters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Layers className="w-4 h-4 text-slate-700" />
            <h4 className="text-xs font-bold text-slate-900">مشخصات ساختاری و قلمرو بارگیری</h4>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">شناسه یکتای سیستمی:</span>
              <span className="font-mono font-bold text-slate-900">{contract.contractId}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">قالب استاندارد حقوقی:</span>
              <span className="font-medium text-slate-800">الحاق به شرایط عمومی پیمان حمل</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">نوع بارگیرهای مجاز:</span>
              <span className="font-medium text-slate-800">تریلی چادری، کفی، ترانزیت، بونکر</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">سامانه متصل بارنامه:</span>
              <span className="font-medium text-emerald-700">اتصال آنلاین به سامانه راهداری (RMTO)</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Tag className="w-4 h-4 text-slate-700" />
            <h4 className="text-xs font-bold text-slate-900">برچسب‌ها و طبقه‌بندی راهبردی</h4>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {(generalInfo.tags || ['پتروشیمی', 'صادراتی', 'قرارداد کلان', 'ترانزیت']).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/70"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs space-y-1.5">
              <div className="font-bold text-slate-800">سطح اهمیت سازمانی (Tier):</div>
              <p className="text-slate-500 leading-relaxed">
                مشتری کلیدی درجه یک (Tier 1 Enterprise) با اولویت اول در تامین ناوگان دیسپاچینگ کشوری.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
