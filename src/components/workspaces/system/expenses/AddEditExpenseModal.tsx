import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Save,
  DollarSign,
  Calendar,
  Building2,
  FileText,
  Truck,
  User,
  Shield,
  CreditCard,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import {
  ExpenseRecord,
  ExpenseCategory,
  ExpensePaymentStatus,
  EXPENSE_CATEGORIES_META,
} from '../../../../types/expense';

interface AddEditExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: ExpenseRecord) => void;
  editingExpense?: ExpenseRecord | null;
  contractsList: { id: string; displayId: string; number: string; title: string; company: string; companyCode: string }[];
}

export const AddEditExpenseModal: React.FC<AddEditExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingExpense,
  contractsList,
}) => {
  const [dateFa, setDateFa] = useState('۱۴۰۵/۰۷/۱۵');
  const [monthFa, setMonthFa] = useState('مهر ۱۴۰۵');
  const [monthIndex, setMonthIndex] = useState<number>(7);
  const [contractId, setContractId] = useState<string>(contractsList[0]?.id || 'cnt-pgpc-2026');
  const [category, setCategory] = useState<ExpenseCategory>('fuel');
  const [subCategoryFa, setSubCategoryFa] = useState('');
  const [titleFa, setTitleFa] = useState('');
  const [descriptionFa, setDescriptionFa] = useState('');
  const [amountToman, setAmountToman] = useState<number>(500000000);
  const [status, setStatus] = useState<ExpensePaymentStatus>('paid');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [bankTrackingCode, setBankTrackingCode] = useState('');
  const [approvedBy, setApprovedBy] = useState('مدیر امور مالی');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [driverName, setDriverName] = useState('');
  const [paymentDueDateFa, setPaymentDueDateFa] = useState('');

  useEffect(() => {
    if (editingExpense) {
      setDateFa(editingExpense.dateFa);
      setMonthFa(editingExpense.monthFa);
      setMonthIndex(editingExpense.monthIndex);
      setContractId(editingExpense.contractId);
      setCategory(editingExpense.category);
      setSubCategoryFa(editingExpense.subCategoryFa || '');
      setTitleFa(editingExpense.titleFa);
      setDescriptionFa(editingExpense.descriptionFa || '');
      setAmountToman(editingExpense.amountToman);
      setStatus(editingExpense.status);
      setInvoiceNumber(editingExpense.invoiceNumber || '');
      setBankTrackingCode(editingExpense.bankTrackingCode || '');
      setApprovedBy(editingExpense.approvedBy || 'مدیر امور مالی');
      setVehiclePlate(editingExpense.vehiclePlate || '');
      setDriverName(editingExpense.driverName || '');
      setPaymentDueDateFa(editingExpense.paymentDueDateFa || '');
    } else {
      // Default new
      setDateFa('۱۴۰۵/۰۷/۱۵');
      setMonthFa('مهر ۱۴۰۵');
      setMonthIndex(7);
      setContractId(contractsList[0]?.id || 'cnt-pgpc-2026');
      setCategory('fuel');
      setSubCategoryFa('گازوئیل سهمیه‌ای ناوگان');
      setTitleFa('');
      setDescriptionFa('');
      setAmountToman(350000000);
      setStatus('paid');
      setInvoiceNumber(`INV-${Date.now().toString().slice(-6)}`);
      setBankTrackingCode('');
      setApprovedBy('مدیر امور مالی');
      setVehiclePlate('');
      setDriverName('');
      setPaymentDueDateFa('');
    }
  }, [editingExpense, contractsList]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleFa) return;

    const selectedContract = contractsList.find((c) => c.id === contractId);

    const record: ExpenseRecord = {
      id: editingExpense ? editingExpense.id : `exp-${Date.now()}`,
      expenseCode: editingExpense
        ? editingExpense.expenseCode
        : `EXP-1405-${Math.floor(1000 + Math.random() * 9000)}`,
      dateFa,
      monthFa,
      yearFa: '۱۴۰۵',
      monthIndex,
      contractId,
      contractDisplayId: selectedContract?.displayId,
      contractNumber: selectedContract?.number,
      contractTitle: selectedContract?.title,
      companyNameFa: selectedContract?.company || 'سربار عمومی',
      companyCode: selectedContract?.companyCode || 'GEN',
      category,
      subCategoryFa,
      titleFa,
      descriptionFa,
      amountToman: Number(amountToman),
      status,
      invoiceNumber,
      paymentDueDateFa: status !== 'paid' ? paymentDueDateFa : undefined,
      paidDateFa: status === 'paid' ? dateFa : undefined,
      bankTrackingCode,
      approvedBy,
      vehiclePlate,
      driverName,
      createdAt: editingExpense ? editingExpense.createdAt : dateFa,
      updatedAt: '۱۴۰۵/۰۷/۱۵',
    };

    onSave(record);
    onClose();
  };

  const monthOptions = [
    { index: 1, name: 'فروردین ۱۴۰۵' },
    { index: 2, name: 'اردیبهشت ۱۴۰۵' },
    { index: 3, name: 'خرداد ۱۴۰۵' },
    { index: 4, name: 'تیر ۱۴۰۵' },
    { index: 5, name: 'مرداد ۱۴۰۵' },
    { index: 6, name: 'شهریور ۱۴۰۵' },
    { index: 7, name: 'مهر ۱۴۰۵' },
    { index: 8, name: 'آبان ۱۴۰۵' },
    { index: 9, name: 'آذر ۱۴۰۵' },
    { index: 10, name: 'دی ۱۴۰۵' },
    { index: 11, name: 'بهمن ۱۴۰۵' },
    { index: 12, name: 'اسفند ۱۴۰۵' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-slate-50/80 border-b border-slate-100 px-6 sm:px-7 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base font-display">
                {editingExpense ? 'ویرایش سند هزینه' : 'ثبت سند هزینه جدید لجستیک'}
              </h3>
              <p className="text-slate-500 text-xs mt-0.5">
                تکمیل مشخصات مالی، طرف قرارداد، دسته‌بندی و کد پیگیری حسابداری
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-4 text-xs">
          {/* Row 1: Contract & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 font-semibold mb-1.5">
                شرکت و قرارداد طرف حساب:
              </label>
              <select
                value={contractId}
                onChange={(e) => setContractId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-amber-500 shadow-2xs"
              >
                {contractsList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company} ({c.displayId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1.5">
                دسته‌بندی هزینه:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-amber-500 shadow-2xs"
              >
                {(Object.keys(EXPENSE_CATEGORIES_META) as ExpenseCategory[]).map((cat) => (
                  <option key={cat} value={cat}>
                    {EXPENSE_CATEGORIES_META[cat].nameFa}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Title & Subcategory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 font-semibold mb-1.5">
                عنوان سند هزینه: <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="مثلاً: تأمین سوخت ناوگان خط عسلویه..."
                value={titleFa}
                onChange={(e) => setTitleFa(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1.5">
                زیردسته / سرفصل فرعی:
              </label>
              <input
                type="text"
                placeholder="مثلاً: گازوئیل آزاد، تعویض لاستیک، عوارض..."
                value={subCategoryFa}
                onChange={(e) => setSubCategoryFa(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 shadow-2xs"
              />
            </div>
          </div>

          {/* Row 3: Amount & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-slate-600 font-semibold">مبلغ (تومان):</label>
                <span className="text-xs font-mono text-amber-700 font-bold">
                  {(amountToman / 1000000).toLocaleString('fa-IR')} میلیون تومان
                </span>
              </div>
              <input
                type="number"
                step="1000000"
                min="0"
                required
                value={amountToman}
                onChange={(e) => setAmountToman(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono font-bold focus:bg-white focus:outline-none focus:border-amber-500 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1.5">
                وضعیت پرداخت:
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ExpensePaymentStatus)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-amber-500 shadow-2xs"
              >
                <option value="paid">پرداخت‌شده (Paid)</option>
                <option value="pending">در انتظار پرداخت (Pending)</option>
                <option value="under_review">در حال بررسی و تطبیق (Under Review)</option>
                <option value="overdue">معوق / سررسید گذشته (Overdue)</option>
              </select>
            </div>
          </div>

          {/* Row 4: Dates & Month */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-600 font-semibold mb-1.5">ماه مالی:</label>
              <select
                value={monthIndex}
                onChange={(e) => {
                  const idx = Number(e.target.value);
                  setMonthIndex(idx);
                  const found = monthOptions.find((m) => m.index === idx);
                  if (found) setMonthFa(found.name);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 shadow-2xs"
              >
                {monthOptions.map((m) => (
                  <option key={m.index} value={m.index}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1.5">تاریخ ثبت / پرداخت:</label>
              <input
                type="text"
                value={dateFa}
                onChange={(e) => setDateFa(e.target.value)}
                placeholder="۱۴۰۵/۰۷/۱۵"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-amber-500 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1.5">شماره فاکتور / سند:</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="INV-1405-099"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-amber-500 shadow-2xs"
              />
            </div>
          </div>

          {/* Row 5: Operational Meta (Vehicle plate, Driver, Bank Code) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-600 font-semibold mb-1.5">پلاک ناوگان متصل:</label>
              <input
                type="text"
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value)}
                placeholder="ایران ۱۱ - ۴۸۲ ع ۲۲"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1.5">نام راننده / ذینفع:</label>
              <input
                type="text"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="نام راننده..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1.5">کد پیگیری بانکی:</label>
              <input
                type="text"
                value={bankTrackingCode}
                onChange={(e) => setBankTrackingCode(e.target.value)}
                placeholder="TRX-MELLAT-..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-amber-500 shadow-2xs"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-600 font-semibold mb-1.5">
              توضیحات و یادداشت‌های حسابداری:
            </label>
            <textarea
              rows={2}
              value={descriptionFa}
              onChange={(e) => setDescriptionFa(e.target.value)}
              placeholder="توضیحات تکمیلی عملیاتی یا شرایط تسویه..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 shadow-2xs"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors cursor-pointer"
            >
              انصراف
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              <Save className="w-4 h-4 text-slate-950" />
              <span>{editingExpense ? 'ذخیره تغییرات سند' : 'ثبت و تایید سند هزینه'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
