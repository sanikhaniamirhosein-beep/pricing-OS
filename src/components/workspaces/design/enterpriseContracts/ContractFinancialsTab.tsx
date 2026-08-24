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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            پرداخت شده
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            در انتظار سررسید
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5" />
            معوقه / دارای تأخیر
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Financial Overview Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-900 to-indigo-950 text-white shadow-xs space-y-2">
          <div className="flex items-center justify-between text-indigo-200 text-xs">
            <span>مبلغ کل برآورد قرارداد</span>
            <Wallet className="w-4 h-4 text-indigo-300" />
          </div>
          <div className="text-lg font-bold font-mono text-white">
            {(financialTerms.totalAmountToman / 1000000).toLocaleString('fa-IR')} م تومان
          </div>
          <p className="text-[11px] text-indigo-300">
            معادل {(financialTerms.totalAmountToman / 1000000000).toLocaleString('fa-IR')} میلیارد تومان ({getCurrencyLabel(financialTerms.currency)})
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>شیوه و شرایط پرداخت</span>
            <CreditCard className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xs font-bold text-slate-900 leading-snug">
            {getPaymentMethodLabel(financialTerms.paymentMethod)}
          </div>
          <p className="text-[11px] text-slate-500">
            {financialTerms.advancePaymentToman
              ? `پیش‌پرداخت: ${(financialTerms.advancePaymentToman / 1000000000).toLocaleString('fa-IR')} میلیارد تومان`
              : 'بدون پیش‌پرداخت نقدی'}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>تعرفه و کمیسیون توافقی</span>
            <Percent className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-base font-bold font-mono text-slate-900">
            {financialTerms.agreedCommissionPercent ? `${financialTerms.agreedCommissionPercent}٪` : 'بر مبنای تن/کیلومتر'}
          </div>
          <p className="text-[11px] text-slate-500">نرخ پورسانت متصدی از هر بارنامه رسمی</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>جریمه تأخیر پرداخت روزانه</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-base font-bold font-mono text-rose-600">
            {financialTerms.latePaymentPenaltyPercentPerDay}٪ روزانه
          </div>
          <p className="text-[11px] text-slate-500">محاسبه از تاریخ صدور صورت‌حساب قطعی</p>
        </div>
      </div>

      {/* Guarantee & Adjustment Clauses Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Guarantee Deposit */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-indigo-600" />
              ضمانت‌نامه حسن انجام تعهدات (Guarantee Deposit)
            </h4>
            <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
              ضمانت‌نامه بانکی
            </span>
          </div>
          <div className="text-xs text-slate-700 space-y-1.5 leading-relaxed">
            <div className="flex items-center justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">مبلغ ضمانت‌نامه:</span>
              <span className="font-mono font-bold text-slate-900">
                {financialTerms.guaranteeDepositToman
                  ? `${(financialTerms.guaranteeDepositToman / 1000000000).toLocaleString('fa-IR')} میلیارد تومان (۱۰٪ کل قرارداد)`
                  : 'فاقد تضمین بانکی'}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">شناسه سند ضمانت:</span>
              <span className="font-mono text-slate-800 font-medium">
                {financialTerms.guaranteeDocNumber || '---'}
              </span>
            </div>
          </div>
        </div>

        {/* Price Adjustment Clause */}
        <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
          <h4 className="text-xs font-bold text-amber-950 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-700" />
            بند شرایط تعدیل قیمت و نوسانات تورمی (Price Adjustment)
          </h4>
          <p className="text-xs text-amber-900 leading-relaxed bg-white/80 p-3 rounded-xl border border-amber-200/60">
            {financialTerms.priceAdjustmentClause}
          </p>
        </div>
      </div>

      {/* Installments & Due Dates Schedule Table */}
      {financialTerms.installments && financialTerms.installments.length > 0 && (
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
              <h4 className="text-sm font-bold text-slate-900">جدول اقساط و برنامه زمانی سررسیدها</h4>
            </div>
            <span className="text-xs text-slate-500">
              تعداد اقساط: {financialTerms.installments.length} مرحله
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="p-3 font-semibold">ردیف</th>
                  <th className="p-3 font-semibold">عنوان مرحله / صورت‌وضعیت</th>
                  <th className="p-3 font-semibold">مبلغ قسط (تومان)</th>
                  <th className="p-3 font-semibold">تاریخ سررسید</th>
                  <th className="p-3 font-semibold">وضعیت تسویه</th>
                  <th className="p-3 font-semibold">کد رهگیری / توضیحات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {financialTerms.installments.map((inst) => (
                  <tr key={inst.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-500">{inst.installmentNumber}</td>
                    <td className="p-3 font-medium text-slate-900">{inst.titleFa}</td>
                    <td className="p-3 font-mono font-bold text-slate-900">
                      {(inst.amountToman / 1000000).toLocaleString('fa-IR')} م
                    </td>
                    <td className="p-3 font-mono text-slate-700">{inst.dueDate}</td>
                    <td className="p-3">{getInstallmentStatusBadge(inst.status)}</td>
                    <td className="p-3 text-[11px] text-slate-500">
                      {inst.trackingNumber && (
                        <div className="font-mono text-indigo-600 font-medium mb-0.5">
                          {inst.trackingNumber}
                        </div>
                      )}
                      {inst.notes || '---'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
