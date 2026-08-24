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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            فعال و لازم‌الاجرا
          </span>
        );
      case 'pending_sign':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" />
            در انتظار امضا و تشریفات
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-600 border border-slate-500/20">
            <FileText className="w-3.5 h-3.5" />
            پیش‌نویس اولیه
          </span>
        );
      case 'renewing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-600 border border-sky-500/20">
            در حال تمدید توافقی
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 border border-rose-500/20">
            منقضی شده
          </span>
        );
      case 'terminated':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-950/10 text-rose-800 border border-rose-950/20">
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
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-l from-slate-900 via-slate-800 to-indigo-950 text-white shadow-md relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-radial from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-mono text-xs font-bold">
                {generalInfo.contractId}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-white/10 text-slate-200 text-xs">
                شماره ثبت: {generalInfo.contractNumber}
              </span>
              {getStatusBadge(generalInfo.status)}
            </div>
            <h3 className="text-lg font-bold text-white leading-snug">
              {generalInfo.title}
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {generalInfo.summaryFa}
            </p>
          </div>

          <div className="flex md:flex-col items-end justify-between gap-2 border-t md:border-t-0 md:border-r border-white/10 pt-3 md:pt-0 md:pr-5 shrink-0">
            <div className="text-right">
              <div className="text-[11px] text-slate-400">دسته‌بندی حقوقی</div>
              <div className="text-xs font-semibold text-emerald-400">
                {getCategoryFa(generalInfo.category)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-slate-400">نوع قرارداد</div>
              <div className="text-xs font-semibold text-amber-300">
                {getContractTypeFa(generalInfo.contractType)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Key Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">شناسه یکتای سیستمی (Contract ID)</span>
            <Hash className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-sm font-mono font-bold text-slate-900 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
            {generalInfo.contractId}
          </div>
          <p className="text-[11px] text-slate-500">تولید شده خودکار توسط هسته شماره‌گذاری اسناد حقوقی</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">شماره ثبت رسمی و بایگانی</span>
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-sm font-mono font-bold text-slate-900 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
            {generalInfo.contractNumber}
          </div>
          <p className="text-[11px] text-slate-500">شماره مصوب در دبیرخانه مرکزی و سامانه حسابرسی</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">واحد سازمانی متولی</span>
            <Building className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-sm font-semibold text-slate-900 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 truncate">
            {generalInfo.departmentScope || 'معاونت بازرگانی و قراردادها'}
          </div>
          <p className="text-[11px] text-slate-500">پاسخگوی نظارت بر حسن اجرای تعهدات و تضامین</p>
        </div>
      </div>

      {/* Contract Tags & Classifications */}
      <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Tag className="w-4 h-4 text-indigo-600" />
          برچسب‌ها و ویژگی‌های کلیدی قرارداد
        </div>
        <div className="flex flex-wrap gap-2">
          {generalInfo.tags && generalInfo.tags.length > 0 ? (
            generalInfo.tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-white text-slate-700 border border-slate-200 shadow-2xs"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                {tag}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400">برچسبی تعریف نشده است</span>
          )}
        </div>
      </div>
    </div>
  );
};
