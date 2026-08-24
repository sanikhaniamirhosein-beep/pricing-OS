import React from 'react';
import {
  Scale,
  ShieldCheck,
  Building2,
  FileCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileBadge,
  Gavel,
} from 'lucide-react';
import { EnterpriseCorporateContract } from '../../../../types/enterpriseContract';

interface Props {
  contract: EnterpriseCorporateContract;
}

export const ContractLegalComplianceTab: React.FC<Props> = ({ contract }) => {
  const { legalCompliance } = contract;
  const { legalDepartmentApproval } = legalCompliance;

  const getApprovalBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            تایید شده توسط اداره حقوقی و قراردادها
          </span>
        );
      case 'conditional':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-4 h-4 text-amber-600" />
            تایید مشروط (نیازمند تکمیل ضمانت‌نامه)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            در حال بررسی کارشناسی
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Legal Status Banner */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">وضعیت بررسی و احراز انطباق حقوقی</h4>
              <p className="text-xs text-slate-500">نظارت بر صلاحیت قراردادها بر اساس قوانین حاکم بر حمل‌ونقل جاده‌ای</p>
            </div>
          </div>
          {getApprovalBadge(legalDepartmentApproval.status)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
            <div className="text-xs text-slate-500">کارشناس و مشاور حقوقی تاییدکننده:</div>
            <div className="text-xs font-bold text-slate-900">
              {legalDepartmentApproval.approvedByLegalOfficer || 'معاونت امور حقوقی و قراردادها'}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              تاریخ ثبت تاییدیه: {legalDepartmentApproval.approvalDate || '---'}
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
            <div className="text-xs text-slate-500">شماره ثبت رسمی سامانه دولتی / راهداری:</div>
            <div className="text-xs font-bold font-mono text-indigo-700">
              {legalCompliance.officialRegistrationNumber || 'ثبت داخلی در سامانه سازمانی'}
            </div>
            <div className="text-[11px] text-slate-500">دارای کد رهگیری و شناسه استعلام یکتای کشوری</div>
          </div>
        </div>

        {legalDepartmentApproval.notesFa && (
          <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-indigo-950 leading-relaxed">
            <span className="font-bold block mb-1">یادداشت اداره حقوقی:</span>
            {legalDepartmentApproval.notesFa}
          </div>
        )}
      </div>

      {/* Governing Law & Dispute Resolution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-100 pb-2.5">
            <FileBadge className="w-4 h-4 text-emerald-600" />
            قانون حاکم بر قرارداد و صلاحیت قضایی
          </div>
          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
            {legalCompliance.governingLaw}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-100 pb-2.5">
            <Gavel className="w-4 h-4 text-amber-600" />
            مرجع حل اختلاف و داوری مرضی‌الطرفین
          </div>
          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
            {legalCompliance.arbitrationCenterName}
          </p>
        </div>
      </div>
    </div>
  );
};
