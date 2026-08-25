import React from 'react';
import {
  Building2,
  UserCheck,
  Phone,
  Mail,
  MapPin,
  FileBadge,
  ShieldCheck,
  Briefcase,
  Hash,
  Award,
} from 'lucide-react';
import { EnterpriseCorporateContract } from '../../../../types/enterpriseContract';

interface Props {
  contract: EnterpriseCorporateContract;
}

export const ContractPartiesTab: React.FC<Props> = ({ contract }) => {
  const { parties } = contract;
  const { counterparty, counterpartySignatory, internalSignatory } = parties;

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'enterprise_customer':
        return { label: 'مشتری حقوقی / صاحب کالا و محموله', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'contractor':
        return { label: 'پیمانکار ترابری / ناوگان استیجاری', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' };
      case 'partner':
        return { label: 'شریک تجاری / کریدور مشترک', color: 'bg-slate-100 text-slate-800 border-slate-300' };
      case 'supplier':
        return { label: 'تأمین‌کننده تجهیزات و قطعات', color: 'bg-amber-50 text-amber-800 border-amber-200' };
      default:
        return { label: role, color: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  const roleInfo = getRoleLabel(parties.counterpartyRole);

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">نوع رابطه تجاری طرفین توافق‌نامه</span>
            <div className="text-sm font-bold text-slate-900 mt-0.5">{counterparty.companyName}</div>
          </div>
        </div>
        <span className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border ${roleInfo.color}`}>
          {roleInfo.label}
        </span>
      </div>

      {/* Two Column Grid: Internal Party (طرف اول) vs Counterparty (طرف دوم) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* First Party (Our Organization) */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-900"></span>
              <h4 className="text-xs font-bold text-slate-900">طرف اول قرارداد (سازمان ما / متصدی حمل)</h4>
            </div>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200">
              ارائه‌دهنده خدمات
            </span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Company Info Box */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1.5">
              <div className="font-bold text-slate-900 text-sm">
                شرکت حمل و نقل سراسری خلیج فارس (سهامی عام)
              </div>
              <div className="text-slate-500 font-mono flex items-center gap-3 flex-wrap">
                <span>شناسه ملی: ۱۰۱۰۱۲۹۴۸۱۱</span>
                <span>کد اقتصادی: ۴۱۱۴۹۲۸۳۷۴۶۱</span>
              </div>
            </div>

            {/* Signatory Box */}
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <UserCheck className="w-4 h-4 text-slate-700" />
                <span>نماینده مجاز و امضاکننده رسمی سازمان:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block mb-0.5">نام و سمت:</span>
                  <span className="font-bold text-slate-900">{internalSignatory.fullName} ({internalSignatory.position})</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">کد ملی:</span>
                  <span className="font-mono font-bold text-slate-900">{internalSignatory.nationalCode}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">شماره تماس:</span>
                  <span className="font-mono text-slate-800">{internalSignatory.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">پست الکترونیک:</span>
                  <span className="font-mono text-slate-800">{internalSignatory.email}</span>
                </div>
              </div>
            </div>

            {/* Address & Legal Headquarters */}
            <div className="space-y-2 pt-2">
              <div className="flex items-start gap-2 text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>نشانی اقامتگاه قانونی: تهران، بزرگراه فتح، کیلومتر ۷، مجتمع مرکزی لجستیک سراسری</span>
              </div>
            </div>
          </div>
        </div>

        {/* Second Party (Counterparty) */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-900"></span>
              <h4 className="text-xs font-bold text-slate-900">طرف دوم قرارداد (مشتری حقوقی / کارفرما)</h4>
            </div>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200">
              صاحب محموله
            </span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Company Info Box */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1.5">
              <div className="font-bold text-slate-900 text-sm">
                {counterparty.companyName}
              </div>
              <div className="text-slate-500 font-mono flex items-center gap-3 flex-wrap">
                <span>شناسه ملی: {counterparty.nationalId}</span>
                <span>شماره ثبت: {counterparty.registrationNumber}</span>
                <span>کد اقتصادی: {counterparty.economicCode}</span>
              </div>
            </div>

            {/* Signatory Box */}
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <UserCheck className="w-4 h-4 text-slate-700" />
                <span>نماینده تام‌الاختیار و صاحب امضای مجاز:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block mb-0.5">نام و سمت:</span>
                  <span className="font-bold text-slate-900">{counterpartySignatory.fullName} ({counterpartySignatory.position})</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">کد ملی:</span>
                  <span className="font-mono font-bold text-slate-900">{counterpartySignatory.nationalCode}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">شماره همراه:</span>
                  <span className="font-mono text-slate-800">{counterpartySignatory.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">پست الکترونیک:</span>
                  <span className="font-mono text-slate-800">{counterpartySignatory.email}</span>
                </div>
              </div>
            </div>

            {/* Address & Legal Headquarters */}
            <div className="space-y-2 pt-2">
              <div className="flex items-start gap-2 text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>نشانی مرکز اصلی: {counterparty.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
