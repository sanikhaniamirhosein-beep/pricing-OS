import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckSquare,
  AlertCircle,
  FileCheck,
  Scale,
  Building,
} from 'lucide-react';
import { EnterpriseCorporateContract } from '../../../../types/enterpriseContract';

interface Props {
  contract: EnterpriseCorporateContract;
}

export const ContractObligationsTab: React.FC<Props> = ({ contract }) => {
  const { obligations } = contract;
  const { liabilityInsurance } = obligations;

  return (
    <div className="space-y-6">
      {/* Insurance Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-950 text-white shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">بیمه‌نامه جامع مسئولیت مدنی متصدیان حمل کالا (All-Risk)</h4>
              <p className="text-xs text-emerald-300 font-mono">{liabilityInsurance.coverageTypeFa}</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
            بیمه‌نامه فعال و معتبر
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-800/60 space-y-1">
            <span className="text-emerald-300 text-[11px]">شرکت بیمه‌گر طرف قرارداد</span>
            <div className="font-bold text-white text-sm">{liabilityInsurance.insurerName}</div>
          </div>

          <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-800/60 space-y-1">
            <span className="text-emerald-300 text-[11px]">شماره بیمه‌نامه رسمی</span>
            <div className="font-mono font-bold text-white text-sm">{liabilityInsurance.policyNumber}</div>
          </div>

          <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-800/60 space-y-1">
            <span className="text-emerald-300 text-[11px]">سقف پوشش ریالی هر حادثه</span>
            <div className="font-mono font-bold text-emerald-300 text-sm">
              {(liabilityInsurance.coverageAmountToman / 1000000000).toLocaleString('fa-IR')} میلیارد تومان
            </div>
          </div>

          <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-800/60 space-y-1">
            <span className="text-emerald-300 text-[11px]">تاریخ انقضای بیمه‌نامه</span>
            <div className="font-mono font-bold text-white text-sm">{liabilityInsurance.expiryDate}</div>
          </div>
        </div>
      </div>

      {/* Obligations Grid: First Party vs Second Party */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* First Party Obligations */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
              <CheckSquare className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">تعهدات طرف اول (سازمان ما / متصدی حمل)</h4>
          </div>

          <ul className="space-y-2.5">
            {obligations.firstPartyObligations.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Second Party Obligations */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <CheckSquare className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">تعهدات طرف دوم (کارفرما / شرکت طرف قرارداد)</h4>
          </div>

          <ul className="space-y-2.5">
            {obligations.secondPartyObligations.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Indemnity and Liability Cap */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <Scale className="w-4 h-4 text-indigo-600" />
            شرایط جبران خسارت و نحوه تسویه (Indemnity Conditions)
          </div>
          <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
            {obligations.indemnityConditions}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            سقف محدودیت مسئولیت (Liability Cap)
          </div>
          <div className="text-lg font-bold font-mono text-slate-900 pt-1">
            {(obligations.liabilityCapToman / 1000000000).toLocaleString('fa-IR')} میلیارد تومان
          </div>
          <p className="text-[11px] text-slate-500">حداکثر سقف تعهد مدنی مطالبه خسارت در طول دوره قرارداد</p>
        </div>
      </div>
    </div>
  );
};
