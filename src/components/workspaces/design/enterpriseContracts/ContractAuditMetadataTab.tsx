import React from 'react';
import {
  ShieldAlert,
  User,
  Calendar,
  Lock,
  History,
  CheckCircle2,
  FileKey,
  Layers,
} from 'lucide-react';
import { EnterpriseCorporateContract } from '../../../../types/enterpriseContract';

interface Props {
  contract: EnterpriseCorporateContract;
}

export const ContractAuditMetadataTab: React.FC<Props> = ({ contract }) => {
  const { auditFields } = contract;

  const getConfidentialityBadge = (level: string) => {
    switch (level) {
      case 'top_secret_c_level':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            <Lock className="w-3.5 h-3.5 text-rose-600" />
            فوق‌محرمانه - فقط هیئت مدیره و مدیران ارشد (C-Level)
          </span>
        );
      case 'confidential':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            محرمانه سازمانی - معاونت بازرگانی و مالی
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            عمومی داخلی پرسنل دیسپاچینگ
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Confidentiality & Ownership Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">ایجادکننده رکورد قرارداد</span>
            <User className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-sm font-bold text-slate-900">{auditFields.createdBy}</div>
          <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{auditFields.createdAt}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">آخرین ویرایش‌کننده</span>
            <History className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-sm font-bold text-slate-900">{auditFields.lastModifiedBy}</div>
          <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{auditFields.lastModifiedAt}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">کد اصالت و شناسه یکتا</span>
            <FileKey className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xs font-mono font-bold text-slate-800 truncate">
            {contract.contractId}
          </div>
          <p className="text-[11px] text-emerald-700 font-medium">سند غیرقابل انکار و معتبر</p>
        </div>
      </div>

      {/* Security Level Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500">طبقه‌بندی امنیتی سند و کنترل دسترسی</span>
            <div className="text-sm font-bold text-slate-900">سیاست افشای اطلاعات و محرمانگی تجاری (NDA)</div>
          </div>
          <div>{getConfidentialityBadge(auditFields.confidentialityLevel)}</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-700 space-y-2">
          <div className="font-bold text-slate-900">الزامات نگهداری و بایگانی اسناد مالی:</div>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            بر اساس ماده ۱۸ قانون تجارت و آیین‌نامه امحای اسناد مالیاتی، اصل پرونده فیزیکی و امضاهای الکترونیکی این قرارداد به مدت ۱۰ سال شمسی در بایگانی راکد اسناد رسمی شرکت نگهداری می‌گردد.
          </p>
        </div>
      </div>
    </div>
  );
};
