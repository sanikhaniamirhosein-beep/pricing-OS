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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>پرداخت‌شده</span>
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>معوق / گذشته</span>
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-800 border border-sky-200">
            <Clock className="w-3.5 h-3.5 text-sky-600" />
            <span>در حال بررسی</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>در انتظار پرداخت</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-[#D3D1C7] rounded-3xl p-6 shadow-xs space-y-5">
      {/* Top Header with Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D3D1C7] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-[#085041]" />
            <h2 className="font-bold text-[#2C2C2A] text-sm sm:text-base font-display">
              فهرست جامع اسناد و تراکنش‌های هزینه (Expense Records & Invoices)
            </h2>
          </div>
          <p className="text-[#5F5E5A] text-xs mt-0.5">
            ثبت، ویرایش، تایید مالی و بایگانی کلیه صورت‌حساب‌های سوخت، نگهداری، دستمزد و عوارض ناوگان
          </p>
        </div>

        {/* Action Buttons: Add, Excel Export, PDF Print */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            id="btn-export-excel"
            onClick={onExportExcel}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#FAFAF8] hover:bg-[#F1EFE8] text-[#2C2C2A] border border-[#D3D1C7] rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#085041]" />
            <span>خروجی اکسل (Excel)</span>
          </button>

          <button
            type="button"
            id="btn-export-pdf"
            onClick={onExportPDF}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#FAFAF8] hover:bg-[#F1EFE8] text-[#2C2C2A] border border-[#D3D1C7] rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <FileCheck className="w-3.5 h-3.5 text-[#085041]" />
            <span>گزارش PDF / پرینت</span>
          </button>

          <button
            type="button"
            id="btn-add-expense"
            onClick={onAddExpense}
            className="flex items-center gap-2 px-4 py-2 bg-[#085041] hover:bg-[#04342C] text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#9FE1CB]" />
            <span>ثبت هزینه جدید</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#FAFAF8] p-3.5 rounded-2xl border border-[#D3D1C7]">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#888780] absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="input-expense-search"
            placeholder="جستجو بر اساس عنوان، کد، راننده، پلاک..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white border border-[#D3D1C7] rounded-xl pr-9 pl-3 py-2 text-xs text-[#2C2C2A] placeholder-[#888780] focus:outline-none focus:border-[#085041]"
          />
        </div>

        {/* Category Filter */}
        <div>
          <select
            id="select-expense-category"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full bg-white border border-[#D3D1C7] rounded-xl px-3 py-2 text-xs font-medium text-[#2C2C2A] focus:outline-none focus:border-[#085041] cursor-pointer"
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
            className="w-full bg-white border border-[#D3D1C7] rounded-xl px-3 py-2 text-xs font-medium text-[#2C2C2A] focus:outline-none focus:border-[#085041] cursor-pointer"
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
            className="w-full bg-white border border-[#D3D1C7] rounded-xl px-3 py-2 text-xs font-medium text-[#2C2C2A] focus:outline-none focus:border-[#085041] cursor-pointer"
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
      <div className="border border-[#D3D1C7] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#FAFAF8] text-[#5F5E5A] border-b border-[#D3D1C7] font-semibold">
              <tr>
                <th className="p-3.5 text-center w-12">#</th>
                <th
                  className="p-3.5 cursor-pointer hover:text-[#2C2C2A]"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>تاریخ و شناسه سند</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-[#888780]" />
                  </div>
                </th>
                <th className="p-3.5">شرکت و قرارداد طرف حساب</th>
                <th className="p-3.5">سرفصل و شرح هزینه</th>
                <th
                  className="p-3.5 cursor-pointer hover:text-[#2C2C2A]"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>مبلغ (تومان)</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-[#888780]" />
                  </div>
                </th>
                <th
                  className="p-3.5 cursor-pointer hover:text-[#2C2C2A]"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>وضعیت پرداخت</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-[#888780]" />
                  </div>
                </th>
                <th className="p-3.5 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECEAE3] bg-white">
              {paginatedExpenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#5F5E5A]">
                    <div className="max-w-sm mx-auto space-y-2">
                      <Receipt className="w-8 h-8 text-[#888780] mx-auto opacity-50" />
                      <p className="font-semibold text-sm text-[#2C2C2A]">هیچ سندی با این فیلترها یافت نشد</p>
                      <p className="text-xs text-[#5F5E5A]">عبارت جستجو یا فیلترهای بالا را تغییر دهید.</p>
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
                      className="hover:bg-[#FAFAF8] transition-colors"
                    >
                      {/* Index */}
                      <td className="p-3.5 text-center font-mono text-[#888780]">
                        {rowIndex}
                      </td>

                      {/* Date & Expense Code */}
                      <td className="p-3.5">
                        <div className="space-y-1">
                          <span className="font-mono font-bold text-[#2C2C2A] block">
                            {exp.dateFa}
                          </span>
                          <div className="flex items-center gap-1.5 text-[11px] text-[#5F5E5A]">
                            <span className="font-mono bg-[#FAFAF8] px-1.5 py-0.5 rounded border border-[#D3D1C7]">
                              {exp.expenseCode}
                            </span>
                            <span>({exp.monthFa})</span>
                          </div>
                        </div>
                      </td>

                      {/* Company & Contract Link */}
                      <td className="p-3.5">
                        <div className="space-y-1 max-w-[220px]">
                          <span className="font-bold text-[#2C2C2A] block truncate">
                            {exp.companyNameFa}
                          </span>
                          {exp.contractId ? (
                            <button
                              type="button"
                              onClick={() => onNavigateToContracts(exp.contractId)}
                              className="inline-flex items-center gap-1 text-[11px] text-[#085041] hover:underline font-mono cursor-pointer"
                              title="مشاهده قرارداد در استودیو طراحی"
                            >
                              <span>{exp.contractDisplayId || exp.contractNumber || 'قرارداد'}</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          ) : (
                            <span className="text-[11px] text-[#888780]">سربار عمومی</span>
                          )}
                        </div>
                      </td>

                      {/* Category & Title */}
                      <td className="p-3.5">
                        <div className="space-y-1 max-w-[280px]">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: meta.colorHex }}
                            />
                            <span className="font-bold text-[#2C2C2A] text-xs">
                              {meta.nameFa}
                            </span>
                            {exp.subCategoryFa && (
                              <span className="text-[10px] text-[#5F5E5A] bg-[#FAFAF8] px-1.5 py-0.5 rounded border border-[#D3D1C7] truncate">
                                {exp.subCategoryFa}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#5F5E5A] line-clamp-1">
                            {exp.titleFa}
                          </p>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="p-3.5">
                        <div className="space-y-0.5">
                          <span className="font-mono font-bold text-sm text-[#085041] block">
                            {exp.amountToman.toLocaleString('fa-IR')}
                          </span>
                          <span className="text-[10px] text-[#5F5E5A] font-sans">
                            {(exp.amountToman / 1000000).toLocaleString('fa-IR')} میلیون تومان
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        {renderStatusBadge(exp.status)}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => onViewReceipt(exp)}
                            className="p-1.5 text-[#5F5E5A] hover:text-[#085041] hover:bg-white rounded-lg border border-transparent hover:border-[#D3D1C7] transition-colors cursor-pointer"
                            title="مشاهده سند و رسید پرداخت"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onEditExpense(exp)}
                            className="p-1.5 text-[#5F5E5A] hover:text-[#2563EB] hover:bg-white rounded-lg border border-transparent hover:border-[#D3D1C7] transition-colors cursor-pointer"
                            title="ویرایش رکورد"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onDeleteExpense(exp.id)}
                            className="p-1.5 text-[#5F5E5A] hover:text-rose-600 hover:bg-white rounded-lg border border-transparent hover:border-[#D3D1C7] transition-colors cursor-pointer"
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
        <div className="bg-[#FAFAF8] border-t border-[#D3D1C7] px-4 py-3 flex items-center justify-between text-xs text-[#5F5E5A]">
          <div>
            نمایش رکوردهای{' '}
            <strong className="font-mono text-[#2C2C2A]">
              {expenses.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
            </strong>{' '}
            تا{' '}
            <strong className="font-mono text-[#2C2C2A]">
              {Math.min(currentPage * itemsPerPage, expenses.length)}
            </strong>{' '}
            از مجموع <strong className="font-mono text-[#2C2C2A]">{expenses.length}</strong> سند
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="p-1.5 bg-white border border-[#D3D1C7] rounded-xl hover:bg-[#F1EFE8] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <span className="font-mono font-bold text-[#2C2C2A] px-2">
              صفحه {currentPage} از {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="p-1.5 bg-white border border-[#D3D1C7] rounded-xl hover:bg-[#F1EFE8] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
