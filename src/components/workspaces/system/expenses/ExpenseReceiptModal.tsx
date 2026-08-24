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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-[#D3D1C7] shadow-2xl w-full max-w-xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-[#FAFAF8] border-b border-[#D3D1C7] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E1F5EE] border border-[#9FE1CB] flex items-center justify-center text-[#085041]">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#2C2C2A] text-base font-display">
                سند مالی و رسید پرداخت هزینه
              </h3>
              <p className="text-[#5F5E5A] text-xs font-mono mt-0.5">
                کد سند: {expense.expenseCode} | شماره فاکتور: {expense.invoiceNumber || '---'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#5F5E5A] hover:text-[#2C2C2A] hover:bg-[#ECEAE3] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Official Voucher Area */}
        <div className="p-6 space-y-5 text-xs">
          {/* Main Amount Card */}
          <div className="bg-[#FAFAF8] border border-[#D3D1C7] rounded-2xl p-4 text-center space-y-1">
            <span className="text-[#5F5E5A] text-[11px] font-semibold">مبلغ قطعی سند:</span>
            <div className="text-2xl font-bold font-mono text-[#085041]">
              {expense.amountToman.toLocaleString('fa-IR')} <span className="text-sm font-sans font-normal text-[#5F5E5A]">تومان</span>
            </div>
            <p className="text-[11px] text-[#5F5E5A]">
              ({(expense.amountToman / 1000000).toLocaleString('fa-IR')} میلیون تومان)
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 bg-white p-4 rounded-2xl border border-[#D3D1C7]">
            <div>
              <span className="text-[#888780] block text-[11px]">سرفصل هزینه:</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: meta.colorHex }}
                />
                <span className="font-bold text-[#2C2C2A]">{meta.nameFa}</span>
              </div>
            </div>

            <div>
              <span className="text-[#888780] block text-[11px]">زیردسته:</span>
              <span className="font-semibold text-[#2C2C2A] mt-0.5 block">
                {expense.subCategoryFa || 'عملیات عمومی'}
              </span>
            </div>

            <div>
              <span className="text-[#888780] block text-[11px]">تاریخ ثبت / پرداخت:</span>
              <span className="font-mono font-bold text-[#2C2C2A] mt-0.5 block">
                {expense.dateFa} ({expense.monthFa})
              </span>
            </div>

            <div>
              <span className="text-[#888780] block text-[11px]">وضعیت تسویه:</span>
              <span className="font-bold text-emerald-800 mt-0.5 block">
                {expense.status === 'paid'
                  ? 'پرداخت‌شده و تایید نهایی'
                  : expense.status === 'overdue'
                  ? 'معوق و سررسید گذشته'
                  : 'در حال بررسی مالی'}
              </span>
            </div>

            <div>
              <span className="text-[#888780] block text-[11px]">شرکت طرف حساب:</span>
              <span className="font-bold text-[#2C2C2A] mt-0.5 block">
                {expense.companyNameFa}
              </span>
            </div>

            <div>
              <span className="text-[#888780] block text-[11px]">قرارداد متصل:</span>
              {expense.contractId ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToContracts(expense.contractId);
                  }}
                  className="inline-flex items-center gap-1 font-mono font-bold text-[#085041] hover:underline mt-0.5 cursor-pointer"
                >
                  <span>{expense.contractDisplayId || expense.contractNumber}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              ) : (
                <span className="text-[#888780]">---</span>
              )}
            </div>

            {expense.bankTrackingCode && (
              <div className="col-span-2">
                <span className="text-[#888780] block text-[11px]">کد پیگیری تراکنش بانکی:</span>
                <span className="font-mono font-bold text-[#2C2C2A] mt-0.5 block bg-[#FAFAF8] p-1.5 rounded-lg border border-[#D3D1C7]">
                  {expense.bankTrackingCode}
                </span>
              </div>
            )}
          </div>

          {/* Description & Approver */}
          <div className="space-y-2 bg-[#FAFAF8] p-3.5 rounded-2xl border border-[#D3D1C7]">
            <div>
              <span className="text-[#888780] text-[11px] block">شرح تفصیلی سند:</span>
              <p className="text-[#2C2C2A] font-semibold mt-0.5 leading-relaxed">{expense.titleFa}</p>
              {expense.descriptionFa && (
                <p className="text-[#5F5E5A] text-[11px] mt-1 leading-relaxed">{expense.descriptionFa}</p>
              )}
            </div>

            <div className="pt-2 border-t border-[#ECEAE3] flex items-center justify-between text-[11px] text-[#5F5E5A]">
              <span>تاییدکننده مالی: <strong className="text-[#2C2C2A]">{expense.approvedBy || 'مدیر مالی هلدینگ'}</strong></span>
              <span className="font-mono">کد اصالت: SEC-IR-{expense.id.slice(-6).toUpperCase()}</span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-[#D3D1C7] flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#FAFAF8] hover:bg-[#ECEAE3] text-[#2C2C2A] border border-[#D3D1C7] rounded-xl font-semibold transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#085041]" />
              <span>چاپ سند</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-[#085041] hover:bg-[#04342C] text-white rounded-xl font-bold transition-colors cursor-pointer"
            >
              بستن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
