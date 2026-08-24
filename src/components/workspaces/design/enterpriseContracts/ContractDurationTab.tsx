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
    <div className="space-y-6">
      {/* Duration Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">تاریخ شروع قرارداد</span>
            <Calendar className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-base font-bold text-slate-900">{duration.startDate}</div>
          <p className="text-[11px] text-slate-500">مبنای آغاز تعهدات و بارگیری ناوگان</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">تاریخ پایان قرارداد</span>
            <CalendarCheck2 className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-base font-bold text-slate-900">{duration.endDate}</div>
          <p className="text-[11px] text-slate-500">موعد خاتمه اعتبار اسناد و بیمه</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">مدت اعتبار کل</span>
            <Hourglass className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-base font-bold text-indigo-600">
            {duration.durationMonths} ماه شمسی
          </div>
          <p className="text-[11px] text-slate-500">محاسبه خودکار ۳۶۵ روز کاری</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">وضعیت تمدید خودکار</span>
            <RefreshCw className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-center gap-1.5">
            {duration.isAutoRenewable ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                دارای تمدید خودکار
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700">
                فاقد تمدید خودکار
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500">تعداد تمدیدهای قبلی: {duration.renewalCount || 0} دوره</p>
        </div>
      </div>

      {/* Notice & Expiry Notification Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-900">
            <Clock className="w-4 h-4 text-amber-700" />
            مهلت اعلام عدم تمدید (Non-Renewal Notice)
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            هر یک از طرفین در صورت تمایل به عدم تمدید قرارداد، موظف است مراتب را حداقل{' '}
            <strong className="text-amber-900 font-bold bg-amber-100/80 px-2 py-0.5 rounded border border-amber-200">
              {duration.nonRenewalNoticeDays} روز
            </strong>{' '}
            قبل از انقضای مدت قرارداد به صورت کتبی و از طریق نامه رسمی به طرف مقابل اعلام نماید.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-sky-50/50 border border-sky-200/80 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-sky-900">
            <BellRing className="w-4 h-4 text-sky-700" />
            سیستم هشدار و یادآور هوشمند انقضا (Expiry Alerts)
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            سیستم هشدار خودکار پورتال لجستیک از{' '}
            <strong className="text-sky-900 font-bold bg-sky-100/80 px-2 py-0.5 rounded border border-sky-200">
              {duration.expirationAlertDays} روز قبل
            </strong>{' '}
            از سررسید، اعلان تمدید و بازنگری نرخ را برای معاونت بازرگانی و مدیران هر دو شرکت ارسال خواهد نمود.
          </p>
        </div>
      </div>
    </div>
  );
};
