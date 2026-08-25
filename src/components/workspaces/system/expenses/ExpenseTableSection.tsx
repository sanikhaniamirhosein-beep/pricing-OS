import React, { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  Edit2,
  Trash2,
  ExternalLink,
  Receipt,
  FileCheck,
  Clock,
  AlertCircle,
  CheckCircle2,
  Download,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';
import {
  ExpenseRecord,
  ExpenseCategory,
  ExpensePaymentStatus,
  EXPENSE_CATEGORIES_META,
} from '../../../../types/expense';

interface ExpenseTableSectionProps {
  expenses: ExpenseRecord[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  periodPreset: string;
  onPeriodPresetChange: (preset: any) => void;
  onAddExpense: () => void;
  onEditExpense: (expense: ExpenseRecord) => void;
  onDeleteExpense: (id: string) => void;
  onViewReceipt: (expense: ExpenseRecord) => void;
  onNavigateToContracts: (contractId?: string) => void;
  onExportExcel: () => void;
  onExportPDF: () => void;
}

export const ExpenseTableSection: React.FC<ExpenseTableSectionProps> = ({
  expenses,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  periodPreset,
  onPeriodPresetChange,
  onAddExpense,
  onEditExpense,
  onDeleteExpense,
  onViewReceipt,
  onNavigateToContracts,
  onExportExcel,
  onExportPDF,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'date' | 'amount' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const itemsPerPage = 8;

  // Sorting
  const sortedExpenses = [...expenses].sort((a, b) => {
    if (sortField === 'amount') {
      return sortOrder === 'asc' ? a.amountToman - b.amountToman : b.amountToman - a.amountToman;
    }
    if (sortField === 'date') {
      return sortOrder === 'asc' ? a.dateFa.localeCompare(b.dateFa) : b.dateFa.localeCompare(a.dateFa);
    }
    return sortOrder === 'asc' ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status);
  });

  // Pagination
  const totalPages = Math.ceil(sortedExpenses.length / itemsPerPage) || 1;
  const paginatedExpenses = sortedExpenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: 'date' | 'amount' | 'status') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const renderStatusBadge = (status: ExpensePaymentStatus) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>پرداخت‌شده</span>
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span>معوق / گذشته</span>
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200">
            <Clock className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span>در حال بررسی</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>در انتظار پرداخت</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
      {/* Top Header with Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/70 flex items-center justify-center text-amber-700 shrink-0">
              <Receipt className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-slate-900 text-sm sm:text-base font-display">
              فهرست جامع اسناد و تراکنش‌های هزینه (Expense Records & Invoices)
            </h2>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            ثبت، ویرایش، تایید مالی و بایگانی کلیه صورت‌حساب‌های سوخت، نگهداری، دستمزد و عوارض ناوگان
          </p>
        </div>

        {/* Action Buttons: Add, Excel Export, PDF Print */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            id="btn-export-excel"
            onClick={onExportExcel}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-2xs hover:border-slate-300 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>خروجی اکسل</span>
          </button>

          <button
            type="button"
            id="btn-export-pdf"
            onClick={onExportPDF}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-2xs hover:border-slate-300 transition-all cursor-pointer"
          >
            <FileCheck className="w-4 h-4 text-slate-500" />
            <span>گزارش چاپی / PDF</span>
          </button>

          <button
            type="button"
            id="btn-add-expense"
            onClick={onAddExpense}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>ثبت هزینه جدید</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="input-expense-search"
            placeholder="جستجو در عنوان، کد، راننده، پلاک..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pr-10 pl-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-2xs"
          />
        </div>

        {/* Category Filter */}
        <div>
          <select
            id="select-expense-category"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer shadow-2xs"
          >
            <option value="all">همه دسته‌بندی‌های هزینه</option>
            {(Object.keys(EXPENSE_CATEGORIES_META) as ExpenseCategory[]).map((cat) => (
              <option key={cat} value={cat}>
                {EXPENSE_CATEGORIES_META[cat].nameFa}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Status Filter */}
        <div>
          <select
            id="select-expense-status"
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer shadow-2xs"
          >
            <option value="all">همه وضعیت‌های پرداخت</option>
            <option value="paid">پرداخت‌شده (Paid)</option>
            <option value="overdue">معوق / سررسید گذشته (Overdue)</option>
            <option value="under_review">در حال بررسی (Under Review)</option>
            <option value="pending">در انتظار پرداخت (Pending)</option>
          </select>
        </div>

        {/* Period Preset Filter */}
        <div>
          <select
            id="select-expense-period"
            value={periodPreset}
            onChange={(e) => onPeriodPresetChange(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer shadow-2xs"
          >
            <option value="all">همه دوره‌ها (سال ۱۴۰۵ کامل)</option>
            <option value="q1_spring">سه‌ماهه اول (بهار ۱۴۰۵)</option>
            <option value="q2_summer">سه‌ماهه دوم (تابستان ۱۴۰۵)</option>
            <option value="h1_first_half">شش‌ماهه اول سال (نیمه نخست)</option>
            <option value="year_1405">کل سال ۱۴۰۵</option>
            <option value="year_1404">سال گذشته (۱۴۰۴)</option>
          </select>
        </div>
      </div>

      {/* Table Records */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="p-4 text-center w-12">#</th>
                <th
                  className="p-4 cursor-pointer hover:text-slate-900 transition-colors"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>تاریخ و شناسه سند</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>
                <th className="p-4">شرکت و قرارداد طرف حساب</th>
                <th className="p-4">سرفصل و شرح هزینه</th>
                <th
                  className="p-4 cursor-pointer hover:text-slate-900 transition-colors"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>مبلغ (تومان)</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>
                <th
                  className="p-4 cursor-pointer hover:text-slate-900 transition-colors"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>وضعیت پرداخت</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>
                <th className="p-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {paginatedExpenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-slate-500">
                    <div className="max-w-sm mx-auto space-y-2.5">
                      <Receipt className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="font-semibold text-sm text-slate-800">هیچ سندی با این فیلترها یافت نشد</p>
                      <p className="text-xs text-slate-500">عبارت جستجو یا فیلترهای بالا را تغییر دهید.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedExpenses.map((exp, idx) => {
                  const meta = EXPENSE_CATEGORIES_META[exp.category];
                  const rowIndex = (currentPage - 1) * itemsPerPage + idx + 1;

                  return (
                    <tr
                      key={exp.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      {/* Index */}
                      <td className="p-4 text-center font-mono text-slate-400">
                        {rowIndex}
                      </td>

                      {/* Date & Expense Code */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <span className="font-mono font-bold text-slate-900 block">
                            {exp.dateFa}
                          </span>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <span className="font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                              {exp.expenseCode}
                            </span>
                            <span>({exp.monthFa})</span>
                          </div>
                        </div>
                      </td>

                      {/* Company & Contract Link */}
                      <td className="p-4">
                        <div className="space-y-1 max-w-[220px]">
                          <span className="font-bold text-slate-900 block truncate">
                            {exp.companyNameFa}
                          </span>
                          {exp.contractId ? (
                            <button
                              type="button"
                              onClick={() => onNavigateToContracts(exp.contractId)}
                              className="inline-flex items-center gap-1.5 text-xs text-amber-700 hover:text-amber-800 hover:underline font-mono cursor-pointer"
                              title="مشاهده قرارداد در استودیو طراحی"
                            >
                              <span>{exp.contractDisplayId || exp.contractNumber || 'قرارداد'}</span>
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400">سربار عمومی ناوگان</span>
                          )}
                        </div>
                      </td>

                      {/* Category & Title */}
                      <td className="p-4">
                        <div className="space-y-1 max-w-[280px]">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: meta.colorHex }}
                            />
                            <span className="font-bold text-slate-900 text-xs">
                              {meta.nameFa}
                            </span>
                            {exp.subCategoryFa && (
                              <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 truncate">
                                {exp.subCategoryFa}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1">
                            {exp.titleFa}
                          </p>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <span className="font-mono font-bold text-sm text-slate-900 block">
                            {exp.amountToman.toLocaleString('fa-IR')}
                          </span>
                          <span className="text-xs text-slate-500 font-sans">
                            {(exp.amountToman / 1000000).toLocaleString('fa-IR')} میلیون تومان
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        {renderStatusBadge(exp.status)}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onViewReceipt(exp)}
                            className="p-2 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-xl border border-transparent hover:border-amber-200 transition-all cursor-pointer"
                            title="مشاهده سند و رسید پرداخت"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onEditExpense(exp)}
                            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl border border-transparent hover:border-blue-200 transition-all cursor-pointer"
                            title="ویرایش رکورد"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onDeleteExpense(exp.id)}
                            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-200 transition-all cursor-pointer"
                            title="حذف سند"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="bg-slate-50/80 border-t border-slate-200 px-5 py-3.5 flex items-center justify-between text-xs text-slate-600">
          <div>
            نمایش رکوردهای{' '}
            <strong className="font-mono text-slate-900">
              {expenses.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
            </strong>{' '}
            تا{' '}
            <strong className="font-mono text-slate-900">
              {Math.min(currentPage * itemsPerPage, expenses.length)}
            </strong>{' '}
            از مجموع <strong className="font-mono text-slate-900">{expenses.length}</strong> سند
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="p-1.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <span className="font-mono font-bold text-slate-900 px-2.5">
              صفحه {currentPage} از {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="p-1.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
