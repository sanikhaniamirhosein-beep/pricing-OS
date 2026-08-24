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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-[#D3D1C7] shadow-2xl w-full max-w-4xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Control Bar (Hidden on Print) */}
        <div className="bg-[#FAFAF8] border-b border-[#D3D1C7] px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E1F5EE] border border-[#9FE1CB] flex items-center justify-center text-[#085041]">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#2C2C2A] text-base font-display">
                پیش‌نمایش گزارش مدیریتی و حسابرسی هزینه‌ها (Executive Audit Report)
              </h3>
              <p className="text-[#5F5E5A] text-xs mt-0.5">
                گزارش رسمی تراز هزینه‌ها، سرفصل‌های عملیاتی و انحراف بودجه جهت ارائه به هیئت مدیره و حسابرس
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-[#085041] hover:bg-[#04342C] text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#9FE1CB]" />
              <span>چاپ / ذخیره PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-[#5F5E5A] hover:text-[#2C2C2A] hover:bg-[#ECEAE3] rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document */}
        <div className="p-8 space-y-6 text-xs text-[#2C2C2A] bg-white print:p-0">
          {/* Official Letterhead */}
          <div className="border-b-2 border-[#2C2C2A] pb-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-[#5F5E5A] font-semibold block">جمهوری اسلامی ایران</span>
              <h1 className="text-base font-bold text-[#2C2C2A] font-display">
                هلدینگ حمل‌ونقل و لجستیک خلیج فارس (سهامی عام)
              </h1>
              <p className="text-[11px] text-[#5F5E5A]">
                معاونت مالی، اداری و کنترل حاکمیت شرکتی — اداره حسابرسی و کنترل بودجه
              </p>
            </div>

            <div className="text-left space-y-1 font-mono text-[11px] text-[#5F5E5A]">
              <div>
                شماره گزارش: <strong className="text-[#2C2C2A]">RPT-EXP-1405/991</strong>
              </div>
              <div>
                تاریخ صدور: <strong className="text-[#2C2C2A]">۱۴۰۵/۰۷/۱۵</strong>
              </div>
              <div>
                پیوست: <strong className="text-[#2C2C2A]">دارد (ریز اسناد)</strong>
              </div>
              <div>
                طبقه‌بندی: <strong className="text-[#085041]">محرمانه مالی</strong>
              </div>
            </div>
          </div>

          {/* Report Meta Summary */}
          <div className="bg-[#FAFAF8] p-4 rounded-2xl border border-[#D3D1C7] grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="text-[#888780] block text-[11px]">بازه زمانی گزارش:</span>
              <span className="font-bold text-[#2C2C2A] text-xs mt-0.5 block">{periodLabel}</span>
            </div>
            <div>
              <span className="text-[#888780] block text-[11px]">شرکت‌های مشمول:</span>
              <span className="font-bold text-[#2C2C2A] text-xs mt-0.5 block">
                {selectedCompanyName || 'کلیه طرف‌های قرارداد و سربار ناوگان'}
              </span>
            </div>
            <div>
              <span className="text-[#888780] block text-[11px]">تعداد اسناد و فاکتورها:</span>
              <span className="font-mono font-bold text-[#085041] text-xs mt-0.5 block">
                {expenses.length} سند مالی
              </span>
            </div>
          </div>

          {/* Key Financial KPIs */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3.5 bg-[#FAFAF8] rounded-xl border border-[#D3D1C7] text-center space-y-1">
              <span className="text-[#888780] text-[11px]">مجموع کل هزینه‌ها</span>
              <div className="text-base font-mono font-bold text-[#2C2C2A]">
                {totalAmountToman.toLocaleString('fa-IR')} <span className="text-[11px] font-sans font-normal text-[#5F5E5A]">تومان</span>
              </div>
              <span className="text-[10px] font-mono text-[#085041] block">
                {(totalAmountToman / 1000000000).toFixed(2)} میلیارد تومان
              </span>
            </div>

            <div className="p-3.5 bg-[#FAFAF8] rounded-xl border border-[#D3D1C7] text-center space-y-1">
              <span className="text-[#888780] text-[11px]">مبالغ پرداخت‌شده قطعی</span>
              <div className="text-base font-mono font-bold text-emerald-800">
                {paidAmountToman.toLocaleString('fa-IR')} <span className="text-[11px] font-sans font-normal text-[#5F5E5A]">تومان</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 block">
                {totalAmountToman > 0 ? ((paidAmountToman / totalAmountToman) * 100).toFixed(1) : 0}٪ کل
              </span>
            </div>

            <div className="p-3.5 bg-[#FAFAF8] rounded-xl border border-[#D3D1C7] text-center space-y-1">
              <span className="text-[#888780] text-[11px]">مانده معوق و سررسید گذشته</span>
              <div className="text-base font-mono font-bold text-rose-800">
                {overdueAmountToman.toLocaleString('fa-IR')} <span className="text-[11px] font-sans font-normal text-[#5F5E5A]">تومان</span>
              </div>
              <span className="text-[10px] font-mono text-rose-700 block">نیاز به پیگیری خزانه</span>
            </div>
          </div>

          {/* Table: Category Breakdown */}
          <div className="space-y-2">
            <h3 className="font-bold text-[#2C2C2A] text-xs">
              ۱. تفکیک مصارف و هزینه‌ها بر اساس سرفصل‌های عملیاتی:
            </h3>

            <table className="w-full text-right text-xs border border-[#D3D1C7] rounded-xl overflow-hidden">
              <thead className="bg-[#FAFAF8] text-[#5F5E5A] font-semibold border-b border-[#D3D1C7]">
                <tr>
                  <th className="p-2.5">ردیف</th>
                  <th className="p-2.5">سرفصل هزینه</th>
                  <th className="p-2.5">مبلغ کل (تومان)</th>
                  <th className="p-2.5">معادل (میلیون تومان)</th>
                  <th className="p-2.5">درصد از کل هزینه</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECEAE3]">
                {(Object.keys(categoryTotals) as ExpenseCategory[]).map((cat, idx) => {
                  const meta = EXPENSE_CATEGORIES_META[cat];
                  const amount = categoryTotals[cat];
                  const percent = totalAmountToman > 0 ? ((amount / totalAmountToman) * 100).toFixed(1) : '0';

                  return (
                    <tr key={cat} className="hover:bg-[#FAFAF8]">
                      <td className="p-2.5 font-mono text-center text-[#888780]">{idx + 1}</td>
                      <td className="p-2.5 font-bold text-[#2C2C2A]">{meta.nameFa}</td>
                      <td className="p-2.5 font-mono text-[#085041] font-bold">
                        {amount.toLocaleString('fa-IR')}
                      </td>
                      <td className="p-2.5 font-mono">
                        {Math.round(amount / 1000000).toLocaleString('fa-IR')}
                      </td>
                      <td className="p-2.5 font-mono font-semibold">{percent}٪</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table: Top Significant Expense Records */}
          <div className="space-y-2">
            <h3 className="font-bold text-[#2C2C2A] text-xs">
              ۲. نمونه اسناد و فاکتورهای عمده ثبت‌شده:
            </h3>

            <table className="w-full text-right text-xs border border-[#D3D1C7] rounded-xl overflow-hidden">
              <thead className="bg-[#FAFAF8] text-[#5F5E5A] font-semibold border-b border-[#D3D1C7]">
                <tr>
                  <th className="p-2">کد سند</th>
                  <th className="p-2">تاریخ</th>
                  <th className="p-2">شرکت / قرارداد</th>
                  <th className="p-2">شرح هزینه</th>
                  <th className="p-2">مبلغ (تومان)</th>
                  <th className="p-2">وضعیت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECEAE3]">
                {expenses.slice(0, 6).map((e) => (
                  <tr key={e.id}>
                    <td className="p-2 font-mono text-[#888780]">{e.expenseCode}</td>
                    <td className="p-2 font-mono">{e.dateFa}</td>
                    <td className="p-2 font-semibold text-[#2C2C2A]">{e.companyNameFa}</td>
                    <td className="p-2 text-[#5F5E5A]">{e.titleFa}</td>
                    <td className="p-2 font-mono font-bold text-[#085041]">
                      {e.amountToman.toLocaleString('fa-IR')}
                    </td>
                    <td className="p-2">
                      {e.status === 'paid' ? 'پرداخت‌شده' : e.status === 'overdue' ? 'معوق' : 'بررسی'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Audit & Sign-off Box */}
          <div className="pt-8 border-t-2 border-[#2C2C2A] grid grid-cols-3 gap-8 text-center text-xs">
            <div className="space-y-8">
              <span className="font-bold text-[#2C2C2A] block">کارشناس حسابداری و صدور اسناد</span>
              <div className="text-[11px] text-[#888780] font-mono">امضا و تاریخ</div>
            </div>

            <div className="space-y-8">
              <span className="font-bold text-[#2C2C2A] block">مدیر امور مالی و بودجه</span>
              <div className="text-[11px] text-[#888780] font-mono">مهر و امضا</div>
            </div>

            <div className="space-y-8">
              <span className="font-bold text-[#2C2C2A] block">معاونت مالی و مدیرعامل</span>
              <div className="text-[11px] text-[#888780] font-mono">تایید نهایی هیئت مدیره</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
