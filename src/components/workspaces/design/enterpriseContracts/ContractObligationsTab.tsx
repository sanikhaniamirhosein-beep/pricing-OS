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
    <div className="space-y-5">
      {/* Insurance Policy Dossier Card (Clean Light Neutral Design) */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">بیمه‌نامه جامع مسئولیت مدنی متصدیان حمل کالا (All-Risk)</h4>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">{liabilityInsurance.coverageTypeFa}</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200/80">
            بیمه‌نامه فعال و معتبر
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1">
            <span className="text-slate-500 text-[11px]">شرکت بیمه‌گر طرف قرارداد</span>
            <div className="font-bold text-slate-900">{liabilityInsurance.insurerName}</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1">
            <span className="text-slate-500 text-[11px]">شماره بیمه‌نامه رسمی</span>
            <div className="font-mono font-bold text-slate-900">{liabilityInsurance.policyNumber}</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1">
            <span className="text-slate-500 text-[11px]">سقف پوشش ریالی هر حادثه</span>
            <div className="font-mono font-bold text-teal-800">
              {(liabilityInsurance.coverageAmountToman / 1000000000).toLocaleString('fa-IR')} میلیارد تومان
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1">
            <span className="text-slate-500 text-[11px]">تاریخ انقضای بیمه‌نامه</span>
            <div className="font-mono font-bold text-slate-900">{liabilityInsurance.expiryDate}</div>
          </div>
        </div>
      </div>

      {/* Obligations Grid: First Party vs Second Party */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* First Party Obligations */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <CheckSquare className="w-4 h-4 text-slate-700" />
            <h4 className="text-xs font-bold text-slate-900">تعهدات طرف اول (سازمان ما / متصدی حمل)</h4>
          </div>

          <ul className="space-y-3">
            {obligations.firstPartyObligations.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs text-slate-700 leading-relaxed">
                <span className="w-5 h-5 rounded-lg bg-slate-100 text-slate-700 font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 border border-slate-200/80">
                  {idx + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Second Party Obligations */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <CheckSquare className="w-4 h-4 text-slate-700" />
            <h4 className="text-xs font-bold text-slate-900">تعهدات طرف دوم (مشتری حقوقی / صاحب کالا)</h4>
          </div>

          <ul className="space-y-3">
            {obligations.secondPartyObligations.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs text-slate-700 leading-relaxed">
                <span className="w-5 h-5 rounded-lg bg-slate-100 text-slate-700 font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 border border-slate-200/80">
                  {idx + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
