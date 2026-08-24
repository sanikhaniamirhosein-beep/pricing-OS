import React from 'react';
import {
  AlertOctagon,
  Clock,
  DollarSign,
  FileWarning,
  CheckCircle2,
  XCircle,
  ShieldAlert,
} from 'lucide-react';
import { EnterpriseCorporateContract } from '../../../../types/enterpriseContract';

interface Props {
  contract: EnterpriseCorporateContract;
}

export const ContractTerminationTab: React.FC<Props> = ({ contract }) => {
  const { terminationClauses } = contract;

  return (
    <div className="space-y-6">
      {/* Termination Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>امکان فسخ یکطرفه (مشروط)</span>
            <AlertOctagon className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            {terminationClauses.unilateralTerminationAllowed ? (
              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                مجاز با اخطار کتبی
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                <XCircle className="w-3.5 h-3.5" />
                غیرمجاز / فقط با توافق کتبی
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500">منوط به رعایت مواعد مندرج در ماده فسخ</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>مهلت اخطار کتبی قبل از فسخ</span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-base font-bold font-mono text-slate-900">
            {terminationClauses.unilateralNoticePeriodDays} روز کاری
          </div>
          <p className="text-[11px] text-slate-500">ارسال اظهارنامه رسمی یا نامه با رسید دبیرخانه</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>جریمه فسخ زودهنگام و ناموجه</span>
            <DollarSign className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-base font-bold font-mono text-rose-600">
            {(terminationClauses.earlyTerminationPenaltyToman / 1000000000).toLocaleString('fa-IR')} میلیارد تومان
          </div>
          <p className="text-[11px] text-slate-500">کسر از محل ضمانت‌نامه یا مطالبات معوق</p>
        </div>
      </div>

      {/* Immediate Termination Triggers Box */}
      <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-rose-950 border-b border-rose-200 pb-3">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          موارد و شرایط فسخ فوری قرارداد (بدون نیاز به اخطار قبلی)
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {terminationClauses.immediateTerminationTriggers.map((trigger, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 p-3 rounded-xl bg-white text-xs text-rose-900 border border-rose-100 shadow-2xs leading-relaxed"
            >
              <FileWarning className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{trigger}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
