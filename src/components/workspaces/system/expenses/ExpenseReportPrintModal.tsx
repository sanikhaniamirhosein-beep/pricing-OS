import React from 'react';
import {
  X,
  Printer,
  FileCheck,
  Building2,
  Calendar,
  Layers,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import {
  ExpenseRecord,
  ExpenseCategory,
  EXPENSE_CATEGORIES_META,
  MonthlyBudgetConfig,
} from '../../../../types/expense';

interface ExpenseReportPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: ExpenseRecord[];
  budgets: Record<number, MonthlyBudgetConfig>;
  periodLabel: string;
  selectedCompanyName?: string;
}

export const ExpenseReportPrintModal: React.FC<ExpenseReportPrintModalProps> = ({
  isOpen,
  onClose,
  expenses,
  budgets,
  periodLabel,
  selectedCompanyName,
}) => {
  if (!isOpen) return null;

  const totalAmountToman = expenses.reduce((acc, curr) => acc + curr.amountToman, 0);
  const paidAmountToman = expenses
    .filter((e) => e.status === 'paid')
    .reduce((acc, curr) => acc + curr.amountToman, 0);
  const overdueAmountToman = expenses
    .filter((e) => e.status === 'overdue')
    .reduce((acc, curr) => acc + curr.amountToman, 0);

  // Category totals
  const categoryTotals: Record<ExpenseCategory, number> = {
    fuel: 0,
    fleet_maintenance: 0,
    driver_wages: 0,
    insurance: 0,
    commission: 0,
    penalty: 0,
    other: 0,
  };

  expenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amountToman;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Control Bar (Hidden on Print) */}
        <div className="bg-slate-50/80 border-b border-slate-100 px-6 sm:px-7 py-5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base font-display">
                پیش‌نمایش گزارش مدیریتی و حسابرسی هزینه‌ها (Executive Audit Report)
              </h3>
              <p className="text-slate-500 text-xs mt-0.5">
                گزارش رسمی تراز هزینه‌ها، سرفصل‌های عملیاتی و انحراف بودجه جهت ارائه به هیئت مدیره و حسابرس
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-950" />
              <span>چاپ / ذخیره PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document */}
        <div className="p-8 sm:p-10 space-y-7 text-xs text-slate-900 bg-white print:p-0">
          {/* Official Letterhead */}
          <div className="border-b-2 border-slate-900 pb-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-semibold block">جمهوری اسلامی ایران</span>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                هلدینگ حمل‌ونقل و لجستیک خلیج فارس (سهامی عام)
              </h1>
              <p className="text-xs text-slate-600">
                معاونت مالی، اداری و کنترل حاکمیت شرکتی — اداره حسابرسی و کنترل بودجه
              </p>
            </div>

            <div className="text-left space-y-1 font-mono text-xs text-slate-600">
              <div>
                شماره گزارش: <strong className="text-slate-900">RPT-EXP-1405/991</strong>
              </div>
              <div>
                تاریخ صدور: <strong className="text-slate-900">۱۴۰۵/۰۷/۱۵</strong>
              </div>
              <div>
                پیوست: <strong className="text-slate-900">دارد (ریز اسناد)</strong>
              </div>
              <div>
                طبقه‌بندی: <strong className="text-amber-800">محرمانه مالی</strong>
              </div>
            </div>
          </div>

          {/* Report Meta Summary */}
          <div className="bg-slate-50/70 p-4.5 rounded-2xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="text-slate-400 block text-xs">بازه زمانی گزارش:</span>
              <span className="font-bold text-slate-900 text-xs mt-1 block">{periodLabel}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs">شرکت‌های مشمول:</span>
              <span className="font-bold text-slate-900 text-xs mt-1 block">
                {selectedCompanyName || 'کلیه طرف‌های قرارداد و سربار ناوگان'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs">تعداد اسناد و فاکتورها:</span>
              <span className="font-mono font-bold text-amber-800 text-xs mt-1 block">
                {expenses.length} سند مالی
              </span>
            </div>
          </div>

          {/* Key Financial KPIs */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80 text-center space-y-1 shadow-2xs">
              <span className="text-slate-500 text-xs">مجموع کل هزینه‌ها</span>
              <div className="text-base font-mono font-bold text-slate-900">
                {totalAmountToman.toLocaleString('fa-IR')} <span className="text-xs font-sans font-normal text-slate-500">تومان</span>
              </div>
              <span className="text-xs font-mono text-amber-700 font-semibold block">
                {(totalAmountToman / 1000000000).toFixed(2)} میلیارد تومان
              </span>
            </div>

            <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80 text-center space-y-1 shadow-2xs">
              <span className="text-slate-500 text-xs">مبالغ پرداخت‌شده قطعی</span>
              <div className="text-base font-mono font-bold text-emerald-700">
                {paidAmountToman.toLocaleString('fa-IR')} <span className="text-xs font-sans font-normal text-slate-500">تومان</span>
              </div>
              <span className="text-xs font-mono text-emerald-700 block">
                {totalAmountToman > 0 ? ((paidAmountToman / totalAmountToman) * 100).toFixed(1) : 0}٪ کل
              </span>
            </div>

            <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80 text-center space-y-1 shadow-2xs">
              <span className="text-slate-500 text-xs">مانده معوق و سررسید گذشته</span>
              <div className="text-base font-mono font-bold text-rose-700">
                {overdueAmountToman.toLocaleString('fa-IR')} <span className="text-xs font-sans font-normal text-slate-500">تومان</span>
              </div>
              <span className="text-xs font-mono text-rose-700 block">نیاز به پیگیری خزانه</span>
            </div>
          </div>

          {/* Table: Category Breakdown */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-slate-900 text-xs">
              ۱. تفکیک مصارف و هزینه‌ها بر اساس سرفصل‌های عملیاتی:
            </h3>

            <table className="w-full text-right text-xs border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">ردیف</th>
                  <th className="p-3">سرفصل هزینه</th>
                  <th className="p-3">مبلغ کل (تومان)</th>
                  <th className="p-3">معادل (میلیون تومان)</th>
                  <th className="p-3">درصد از کل هزینه</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(Object.keys(categoryTotals) as ExpenseCategory[]).map((cat, idx) => {
                  const meta = EXPENSE_CATEGORIES_META[cat];
                  const amount = categoryTotals[cat];
                  const percent = totalAmountToman > 0 ? ((amount / totalAmountToman) * 100).toFixed(1) : '0';

                  return (
                    <tr key={cat} className="hover:bg-slate-50/50">
                      <td className="p-3 font-mono text-center text-slate-400">{idx + 1}</td>
                      <td className="p-3 font-bold text-slate-900">{meta.nameFa}</td>
                      <td className="p-3 font-mono text-slate-900 font-bold">
                        {amount.toLocaleString('fa-IR')}
                      </td>
                      <td className="p-3 font-mono text-slate-600">
                        {Math.round(amount / 1000000).toLocaleString('fa-IR')}
                      </td>
                      <td className="p-3 font-mono font-semibold text-slate-800">{percent}٪</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table: Top Significant Expense Records */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-slate-900 text-xs">
              ۲. نمونه اسناد و فاکتورهای عمده ثبت‌شده:
            </h3>

            <table className="w-full text-right text-xs border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">کد سند</th>
                  <th className="p-2.5">تاریخ</th>
                  <th className="p-2.5">شرکت / قرارداد</th>
                  <th className="p-2.5">شرح هزینه</th>
                  <th className="p-2.5">مبلغ (تومان)</th>
                  <th className="p-2.5">وضعیت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.slice(0, 6).map((e) => (
                  <tr key={e.id}>
                    <td className="p-2.5 font-mono text-slate-400">{e.expenseCode}</td>
                    <td className="p-2.5 font-mono">{e.dateFa}</td>
                    <td className="p-2.5 font-semibold text-slate-900">{e.companyNameFa}</td>
                    <td className="p-2.5 text-slate-600">{e.titleFa}</td>
                    <td className="p-2.5 font-mono font-bold text-slate-900">
                      {e.amountToman.toLocaleString('fa-IR')}
                    </td>
                    <td className="p-2.5">
                      {e.status === 'paid' ? 'پرداخت‌شده' : e.status === 'overdue' ? 'معوق' : 'بررسی'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Audit & Sign-off Box */}
          <div className="pt-8 border-t-2 border-slate-900 grid grid-cols-3 gap-8 text-center text-xs">
            <div className="space-y-8">
              <span className="font-bold text-slate-900 block">کارشناس حسابداری و صدور اسناد</span>
              <div className="text-xs text-slate-400 font-mono">امضا و تاریخ</div>
            </div>

            <div className="space-y-8">
              <span className="font-bold text-slate-900 block">مدیر امور مالی و بودجه</span>
              <div className="text-xs text-slate-400 font-mono">مهر و امضا</div>
            </div>

            <div className="space-y-8">
              <span className="font-bold text-slate-900 block">معاونت مالی و مدیرعامل</span>
              <div className="text-xs text-slate-400 font-mono">تایید نهایی هیئت مدیره</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
