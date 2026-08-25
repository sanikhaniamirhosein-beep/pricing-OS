import React from 'react';
import {
  DollarSign,
  CreditCard,
  Percent,
  AlertTriangle,
  FileSpreadsheet,
  TrendingUp,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Wallet,
} from 'lucide-react';
import { EnterpriseCorporateContract, InstallmentItem } from '../../../../types/enterpriseContract';

interface Props {
  contract: EnterpriseCorporateContract;
}

export const ContractFinancialsTab: React.FC<Props> = ({ contract }) => {
  const { financialTerms } = contract;

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'installment':
        return 'اقساطی و دوره‌ای بر مبنای صورت‌وضعیت';
      case 'lump_sum':
        return 'پرداخت یکجا';
      case 'per_ton_km':
        return 'بر اساس تناژ / کیلومتر پیمایش واقعی';
      case 'percentage_cut':
        return 'درصدی از کل ارزش بارنامه';
      case 'monthly_fixed':
        return 'مبلغ ثابت ماهیانه اختصاص ناوگان';
      default:
        return method;
    }
  };

  const getCurrencyLabel = (cur: string) => {
    switch (cur) {
      case 'IRT':
        return 'تومان ایران';
      case 'IRR':
        return 'ریال ایران';
      case 'USD':
        return 'دلار آمریکا ($)';
      case 'EUR':
        return 'یورو (€)';
      case 'AED':
        return 'درهم امارات (AED)';
      default:
        return cur;
    }
  };

  const getInstallmentStatusBadge = (status: InstallmentItem['status']) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            پرداخت شده
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            در انتظار سررسید
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            معوقه / دارای تأخیر
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Financial Overview Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">مبلغ کل برآورد قرارداد</span>
            <Wallet className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">
            {(financialTerms.totalAmountToman / 1000000000).toLocaleString('fa-IR')} میلیارد تومان
          </div>
          <p className="text-[11px] text-slate-500">
            معادل {(financialTerms.totalAmountToman / 1000000).toLocaleString('fa-IR')} میلیون تومان
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">مبلغ پیش‌پرداخت نقدی</span>
            <CreditCard className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-800">
            {((financialTerms.advancePaymentToman || 0) / 1000000).toLocaleString('fa-IR')} م تومان
          </div>
          <p className="text-[11px] text-slate-500">
            معادل {financialTerms.advancePaymentToman ? ((financialTerms.advancePaymentToman / financialTerms.totalAmountToman) * 100).toFixed(0) : 0}٪ از مبلغ کل
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">سپرده حسن انجام تعهدات</span>
            <ShieldAlert className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-800">
            {((financialTerms.guaranteeDepositToman || 0) / 1000000).toLocaleString('fa-IR')} م تومان
          </div>
          <p className="text-[11px] text-slate-500">نوع وثیقه: ضمانت‌نامه بانکی معتبر</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">روش تسویه مالی</span>
            <DollarSign className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-xs font-bold text-slate-900 leading-snug">
            {getPaymentMethodLabel(financialTerms.paymentMethod)}
          </div>
          <p className="text-[11px] text-slate-500">ارز مبنا: {getCurrencyLabel(financialTerms.currency)}</p>
        </div>
      </div>

      {/* Installments Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-slate-700" />
            <h4 className="text-xs font-bold text-slate-900">جدول اقساط و مراحل پرداخت مالی (Milestones)</h4>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {financialTerms.installments.length.toLocaleString('fa-IR')} قسط ثبت‌شده
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600 font-bold bg-slate-50/80">
                <th className="p-3.5">عنوان قسط / مرحله</th>
                <th className="p-3.5">مبلغ مرحله (تومان)</th>
                <th className="p-3.5">تاریخ سررسید</th>
                <th className="p-3.5">وضعیت پرداخت</th>
                <th className="p-3.5">کد رهگیری / سند</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {financialTerms.installments.map((inst) => (
                <tr key={inst.id || inst.installmentNumber} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3.5 font-medium">{inst.titleFa}</td>
                  <td className="p-3.5 font-mono font-bold text-slate-900">
                    {(inst.amountToman / 1000000).toLocaleString('fa-IR')} میلیون تومان
                  </td>
                  <td className="p-3.5 font-mono text-slate-600">{inst.dueDate}</td>
                  <td className="p-3.5">{getInstallmentStatusBadge(inst.status)}</td>
                  <td className="p-3.5 font-mono text-slate-500">{inst.trackingNumber || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjustments & Clauses (شرایط تعدیل قیمت و جریمه تأخیر) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <TrendingUp className="w-4 h-4 text-slate-700" />
            <h4 className="text-xs font-bold text-slate-900">شرط تعدیل قیمت و نوسان شاخص حمل</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {financialTerms.priceAdjustmentClause || 'تعدیل قیمت بر اساس بخشنامه‌های رسمی سازمان راهداری و حمل‌ونقل جاده‌ای و نرخ رسمی سوخت محاسبه می‌گردد.'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Percent className="w-4 h-4 text-slate-700" />
            <h4 className="text-xs font-bold text-slate-900">جریمه دیرکرد و کمیسیون توافقی</h4>
          </div>
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <span>جریمه روزانه دیرکرد در پرداخت صورت‌وضعیت:</span>
              <span className="font-mono font-bold text-rose-800">
                {financialTerms.latePaymentPenaltyPercentPerDay}٪ در روز
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span>کمیسیون و تعرفه توافقی سازمان:</span>
              <span className="font-mono font-bold text-slate-900">
                {financialTerms.agreedCommissionPercent ? `${financialTerms.agreedCommissionPercent}٪` : 'طبق تعرفه رسمی'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
