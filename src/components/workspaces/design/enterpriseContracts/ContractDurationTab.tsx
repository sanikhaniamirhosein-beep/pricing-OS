import React from 'react';
import {
  Calendar,
  Clock,
  RefreshCw,
  BellRing,
  AlertCircle,
  CalendarCheck2,
  Hourglass,
  CheckCircle2,
} from 'lucide-react';
import { EnterpriseCorporateContract } from '../../../../types/enterpriseContract';

interface Props {
  contract: EnterpriseCorporateContract;
}

export const ContractDurationTab: React.FC<Props> = ({ contract }) => {
  const { duration } = contract;

  return (
    <div className="space-y-5">
      {/* Duration Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">تاریخ آغاز تعهدات</span>
            <Calendar className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-base font-bold font-mono text-slate-900">{duration.startDate}</div>
          <p className="text-[11px] text-slate-500">مبنای صدور حواله و بارگیری ناوگان</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">تاریخ خاتمه اعتبار</span>
            <CalendarCheck2 className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-base font-bold font-mono text-slate-900">{duration.endDate}</div>
          <p className="text-[11px] text-slate-500">موعد تسویه حساب نهایی و استرداد تضامین</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">طول دوره اعتبار</span>
            <Hourglass className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-base font-bold text-slate-900">
            {duration.durationMonths.toLocaleString('fa-IR')} ماه شمسی
          </div>
          <p className="text-[11px] text-slate-500">معادل ۳۶۵ روز تقویمی کاری</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">تمدید خودکار</span>
            <RefreshCw className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-center gap-1.5">
            {duration.isAutoRenewable ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                دارای تمدید خودکار
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                فاقد تمدید خودکار
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500">تعداد تمدیدهای قبلی: {(duration.renewalCount || 0).toLocaleString('fa-IR')} دوره</p>
        </div>
      </div>

      {/* Notice & Expiry Notification Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-100 pb-3">
            <Clock className="w-4 h-4 text-slate-700" />
            <span>مهلت اعلام عدم تمایل به تمدید (Notice Period)</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-mono font-bold text-slate-900">
              {duration.nonRenewalNoticeDays.toLocaleString('fa-IR')}
            </span>
            <span className="text-xs text-slate-600">روز کاری قبل از تاریخ انقضا</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            ارسال اظهارنامه یا نامه رسمی کتبی با ثبت در دبیرخانه طرفین جهت جلوگیری از تمدید خودکار الزامی است.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-100 pb-3">
            <BellRing className="w-4 h-4 text-slate-700" />
            <span>ارسال هشدارهای سیستمی انقضا</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-mono font-bold text-slate-900">
              {duration.expirationAlertDays.toLocaleString('fa-IR')}
            </span>
            <span className="text-xs text-slate-600">روز قبل از سررسید</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            سیستم به صورت خودکار به مدیر بازرگانی و کارتابل حقوقی جهت بازنگری نرخ و انعقاد الحاقیه پیام ارسال می‌نماید.
          </p>
        </div>
      </div>
    </div>
  );
};
