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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            تایید شده توسط اداره حقوقی و قراردادها
          </span>
        );
      case 'conditional':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            تایید مشروط (نیازمند تکمیل مدارک)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            در حال بررسی کارشناسی
          </span>
        );
    }
  };

  const getDisputeForumLabel = (forum: string) => {
    switch (forum) {
      case 'arbitration':
        return 'مرکز داوری و حل اختلاف تخصصی';
      case 'court':
        return 'محاکم صالحه دادگستری تهران';
      case 'expert_panel':
        return 'هیات کارشناسان مرضی‌الطرفین';
      default:
        return forum;
    }
  };

  return (
    <div className="space-y-5">
      {/* Legal Status Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">وضعیت بررسی و احراز انطباق حقوقی</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">نظارت بر صلاحیت قراردادها بر اساس قوانین تجارت و حمل‌ونقل جاده‌ای</p>
            </div>
          </div>
          <div>{getApprovalBadge(legalDepartmentApproval.status)}</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1">
            <span className="text-slate-500">کارشناس حقوقی ناظر:</span>
            <div className="font-bold text-slate-900">{legalDepartmentApproval.approvedByLegalOfficer || 'اداره دعاوی و قراردادها'}</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1">
            <span className="text-slate-500">تاریخ تایید و بررسی:</span>
            <div className="font-mono font-bold text-slate-900">{legalDepartmentApproval.approvalDate || '-'}</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1">
            <span className="text-slate-500">شماره ثبت رسمی در سامانه راهداری:</span>
            <div className="font-mono font-bold text-slate-900">{legalCompliance.officialRegistrationNumber || 'RMTO-۱۴۰۵/۸۸۴۲'}</div>
          </div>
        </div>

        {legalDepartmentApproval.notesFa && (
          <div className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 leading-relaxed">
            <strong>نظریه مشورتی و حاشیه‌نویسی حقوقی:</strong> {legalDepartmentApproval.notesFa}
          </div>
        )}
      </div>

      {/* Governing Law & Dispute Resolution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Gavel className="w-4 h-4 text-slate-700" />
            <h4 className="text-xs font-bold text-slate-900">قانون حاکم و مرجع حل اختلاف و داوری</h4>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">قانون حاکم بر تفسیر قرارداد:</span>
              <span className="font-bold text-slate-900">{legalCompliance.governingLaw}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">نوع مرجع حل اختلاف:</span>
              <span className="font-medium text-slate-800">{getDisputeForumLabel(legalCompliance.disputeResolutionForum)}</span>
            </div>
            <div className="space-y-1 py-1">
              <span className="text-slate-500 block">نام مرکز داوری صالحه:</span>
              <span className="font-bold text-slate-900 block leading-snug">
                {legalCompliance.arbitrationCenterName}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileBadge className="w-4 h-4 text-slate-700" />
            <h4 className="text-xs font-bold text-slate-900">تضامین و اعتبارسنجی حقوقی</h4>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">سقف مسئولیت خسارت:</span>
              <span className="font-mono font-bold text-emerald-800">
                {(contract.obligations.liabilityCapToman / 1000000000).toLocaleString('fa-IR')} میلیارد تومان
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">شماره ثبت سند:</span>
              <span className="font-mono text-slate-800">{legalCompliance.officialRegistrationNumber || 'ثبت شده در دبیرخانه'}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">بیمه‌نامه معتبر:</span>
              <span className="font-medium text-teal-700">{contract.obligations.liabilityInsurance.insurerName} ({contract.obligations.liabilityInsurance.coverageTypeFa})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
