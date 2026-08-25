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
    <div className="space-y-5">
      {/* Termination Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">امکان فسخ یکطرفه (مشروط)</span>
            <AlertOctagon className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            {terminationClauses.unilateralTerminationAllowed ? (
              <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                مجاز با اخطار کتبی
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-rose-800 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                <XCircle className="w-3.5 h-3.5" />
                غیرمجاز / فقط با توافق کتبی
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500">منوط به رعایت مواعد مندرج در ماده فسخ</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">مهلت اخطار کتبی قبل از فسخ</span>
            <Clock className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-base font-bold font-mono text-slate-900">
            {terminationClauses.unilateralNoticePeriodDays.toLocaleString('fa-IR')} روز کاری
          </div>
          <p className="text-[11px] text-slate-500">ارسال اظهارنامه رسمی با رسید دبیرخانه</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">جریمه فسخ زودهنگام و ناموجه</span>
            <DollarSign className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-base font-bold font-mono text-rose-800">
            {(terminationClauses.earlyTerminationPenaltyToman / 1000000).toLocaleString('fa-IR')} م تومان
          </div>
          <p className="text-[11px] text-slate-500">جبران خسارت عدم‌النفع و توقف ناوگان</p>
        </div>
      </div>

      {/* Immediate Termination Causes (علل فسخ فوری) */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <FileWarning className="w-4 h-4 text-rose-600" />
          <h4 className="text-xs font-bold text-slate-900">موارد و مصادیق فسخ فوری و بدون اخطار قبلی</h4>
        </div>

        <ul className="space-y-3">
          {terminationClauses.immediateTerminationTriggers.map((cause, idx) => (
            <li key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-800 leading-relaxed">
              <span className="w-5 h-5 rounded-lg bg-rose-50 text-rose-800 font-mono text-[11px] font-bold flex items-center justify-center shrink-0 border border-rose-200">
                {idx + 1}
              </span>
              <span>{cause}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
