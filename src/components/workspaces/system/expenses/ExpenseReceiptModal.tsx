import React from 'react';
import {
  X,
  Receipt,
  Printer,
  Download,
  Building2,
  Calendar,
  CreditCard,
  Truck,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { ExpenseRecord, EXPENSE_CATEGORIES_META } from '../../../../types/expense';

interface ExpenseReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: ExpenseRecord | null;
  onNavigateToContracts: (contractId?: string) => void;
}

export const ExpenseReceiptModal: React.FC<ExpenseReceiptModalProps> = ({
  isOpen,
  onClose,
  expense,
  onNavigateToContracts,
}) => {
  if (!isOpen || !expense) return null;

  const meta = EXPENSE_CATEGORIES_META[expense.category];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-slate-50/80 border-b border-slate-100 px-6 sm:px-7 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base font-display">
                سند مالی و رسید پرداخت هزینه
              </h3>
              <p className="text-slate-500 text-xs font-mono mt-0.5">
                کد سند: {expense.expenseCode} | شماره فاکتور: {expense.invoiceNumber || '---'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Official Voucher Area */}
        <div className="p-6 sm:p-7 space-y-5 text-xs">
          {/* Main Amount Card */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 text-center space-y-1 shadow-2xs">
            <span className="text-slate-500 text-xs font-semibold">مبلغ قطعی سند:</span>
            <div className="text-2xl font-bold font-mono text-slate-900">
              {expense.amountToman.toLocaleString('fa-IR')} <span className="text-sm font-sans font-normal text-slate-500">تومان</span>
            </div>
            <p className="text-xs text-amber-700 font-semibold">
              ({(expense.amountToman / 1000000).toLocaleString('fa-IR')} میلیون تومان)
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3.5 bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div>
              <span className="text-slate-400 block text-xs">سرفصل هزینه:</span>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: meta.colorHex }}
                />
                <span className="font-bold text-slate-900 text-xs">{meta.nameFa}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block text-xs">زیردسته:</span>
              <span className="font-semibold text-slate-800 mt-1 block">
                {expense.subCategoryFa || 'عملیات عمومی'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-xs">تاریخ ثبت / پرداخت:</span>
              <span className="font-mono font-bold text-slate-900 mt-1 block">
                {expense.dateFa} ({expense.monthFa})
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-xs">وضعیت تسویه:</span>
              <span className="font-bold text-emerald-700 mt-1 block">
                {expense.status === 'paid'
                  ? 'پرداخت‌شده و تایید نهایی'
                  : expense.status === 'overdue'
                  ? 'معوق و سررسید گذشته'
                  : 'در حال بررسی مالی'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-xs">شرکت طرف حساب:</span>
              <span className="font-bold text-slate-900 mt-1 block">
                {expense.companyNameFa}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-xs">قرارداد متصل:</span>
              {expense.contractId ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToContracts(expense.contractId);
                  }}
                  className="inline-flex items-center gap-1.5 font-mono font-bold text-amber-700 hover:text-amber-800 hover:underline mt-1 cursor-pointer"
                >
                  <span>{expense.contractDisplayId || expense.contractNumber}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </button>
              ) : (
                <span className="text-slate-400">سربار عمومی ناوگان</span>
              )}
            </div>

            {expense.bankTrackingCode && (
              <div className="col-span-2 pt-2 border-t border-slate-100">
                <span className="text-slate-400 block text-xs">کد پیگیری تراکنش بانکی:</span>
                <span className="font-mono font-bold text-slate-900 mt-1 block bg-slate-50 p-2 rounded-xl border border-slate-200">
                  {expense.bankTrackingCode}
                </span>
              </div>
            )}
          </div>

          {/* Description & Approver */}
          <div className="space-y-2.5 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
            <div>
              <span className="text-slate-400 text-xs block">شرح تفصیلی سند:</span>
              <p className="text-slate-900 font-semibold mt-1 leading-relaxed">{expense.titleFa}</p>
              {expense.descriptionFa && (
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">{expense.descriptionFa}</p>
              )}
            </div>

            <div className="pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
              <span>تاییدکننده مالی: <strong className="text-slate-800">{expense.approvedBy || 'مدیر مالی هلدینگ'}</strong></span>
              <span className="font-mono text-slate-400">SEC-IR-{expense.id.slice(-6).toUpperCase()}</span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-semibold transition-all cursor-pointer shadow-2xs hover:border-slate-300"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>چاپ سند</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl font-bold transition-all cursor-pointer shadow-xs"
            >
              بستن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
