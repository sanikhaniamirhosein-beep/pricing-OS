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
        return { label: 'مشتری حقوقی / صاحب کالا و محموله', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'contractor':
        return { label: 'پیمانکار ترابری / ناوگان استیجاری', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'partner':
        return { label: 'شریک تجاری / کریدور مشترک', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'supplier':
        return { label: 'تأمین‌کننده تجهیزات و قطعات', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      default:
        return { label: role, color: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  const roleInfo = getRoleLabel(parties.counterpartyRole);

  return (
    <div className="space-y-6">
      {/* Role Badge Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-100 text-indigo-700">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500">نوع رابطه تجاری طرفین</div>
            <div className="text-sm font-bold text-slate-900">{counterparty.companyName}</div>
          </div>
        </div>
        <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${roleInfo.color}`}>
          {roleInfo.label}
        </span>
      </div>

      {/* Two Column Grid: Internal Party (طرف اول) vs Counterparty (طرف دوم) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* First Party (Our Organization) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              <h4 className="text-sm font-bold text-slate-900">طرف اول قرارداد (سازمان ما / متصدی حمل)</h4>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium border border-indigo-100">
              ارائه‌دهنده خدمات
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <Building2 className="w-5 h-5 text-indigo-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900">شرکت حمل و نقل سراسری خلیج فارس (سهامی عام)</div>
                <div className="text-[11px] text-slate-500 font-mono">شناسه ملی: ۱۰۱۰۱۲۹۴۸۱۱ | کد اقتصادی: ۴۱۱۴۹۲۸۳۷۴۶۱</div>
              </div>
            </div>

            <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
                <UserCheck className="w-4 h-4 text-indigo-600" />
                نماینده مجاز و امضاکننده رسمی سازمان:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500">نام و نام خانوادگی: </span>
                  <span className="font-semibold text-slate-800">{internalSignatory.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-500">سمت: </span>
                  <span className="font-semibold text-slate-800">{internalSignatory.position}</span>
                </div>
                <div>
                  <span className="text-slate-500">کد ملی: </span>
                  <span className="font-mono text-slate-800">{internalSignatory.nationalCode}</span>
                </div>
                <div>
                  <span className="text-slate-500">شماره تماس: </span>
                  <span className="font-mono text-slate-800">{internalSignatory.phone}</span>
                </div>
              </div>

              {internalSignatory.signatureStatus === 'signed' && (
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 mt-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  امضای دیجیتال احراز هویت شده (تاریخ: {internalSignatory.signedAt})
                </div>
              )}
            </div>

            <div className="text-xs text-slate-600 space-y-1.5 p-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>تهران، میدان ونک، خیابان ملاصدرا، پلاک ۹۲، برج حمل‌ونقل</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>واحد ناظر: {parties.internalDepartment || 'معاونت بازرگانی و هماهنگی شعب'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Second Party (Counterparty) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <h4 className="text-sm font-bold text-slate-900">طرف دوم قرارداد (شرکت طرف قرارداد)</h4>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium border border-emerald-100">
              طرف متعهد / کارفرما
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <Building2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900">{counterparty.companyName}</div>
                <div className="text-[11px] text-slate-500 font-mono">
                  شناسه ملی: {counterparty.nationalId} | کد اقتصادی: {counterparty.economicCode || '---'}
                </div>
              </div>
            </div>

            <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                نماینده امضاکننده مجاز طرف مقابل:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500">نام و نام خانوادگی: </span>
                  <span className="font-semibold text-slate-800">{counterpartySignatory.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-500">سمت: </span>
                  <span className="font-semibold text-slate-800">{counterpartySignatory.position}</span>
                </div>
                <div>
                  <span className="text-slate-500">کد ملی: </span>
                  <span className="font-mono text-slate-800">{counterpartySignatory.nationalCode}</span>
                </div>
                <div>
                  <span className="text-slate-500">شماره تماس: </span>
                  <span className="font-mono text-slate-800">{counterpartySignatory.phone}</span>
                </div>
              </div>

              {counterpartySignatory.signatureStatus === 'signed' ? (
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 mt-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  امضای رسمی با مهر شرکت (تاریخ: {counterpartySignatory.signedAt || '---'})
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 mt-2">
                  در انتظار دریافت نسخه امضاشده نهایی
                </div>
              )}
            </div>

            <div className="text-xs text-slate-600 space-y-1.5 p-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{counterparty.address}</span>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  تلفن: {counterparty.phone}
                </span>
                {counterparty.postalCode && (
                  <span className="flex items-center gap-1">
                    <Hash className="w-3 h-3 text-slate-400" />
                    کد پستی: {counterparty.postalCode}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
