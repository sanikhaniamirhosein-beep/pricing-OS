import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import {
  DollarSign,
  Plus,
  Download,
  FileCheck,
  Filter,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Sliders,
  Receipt,
  TrendingDown,
  Building2,
  Calendar,
} from 'lucide-react';
import {
  ExpenseRecord,
  ExpenseCategory,
  ExpensePaymentStatus,
  MonthlyBudgetConfig,
  EXPENSE_CATEGORIES_META,
} from '../../../../types/expense';
import {
  INITIAL_EXPENSE_RECORDS,
  INITIAL_MONTHLY_BUDGETS_1405,
  PRIOR_YEAR_1404_TOTALS,
} from '../../../../data/mockExpenseData';
import { INITIAL_ENTERPRISE_CONTRACTS } from '../../../../data/mockEnterpriseContracts';
import { ExpenseKPISection } from './ExpenseKPISection';
import { ExpenseChartsSection } from './ExpenseChartsSection';
import { ContractExpensesSection } from './ContractExpensesSection';
import { ExpenseTableSection } from './ExpenseTableSection';
import { AddEditExpenseModal } from './AddEditExpenseModal';
import { BudgetConfigModal } from './BudgetConfigModal';
import { ExpenseReceiptModal } from './ExpenseReceiptModal';
import { ExpenseReportPrintModal } from './ExpenseReportPrintModal';

interface ExpenseManagementViewProps {
  onNavigateToContracts?: (contractId?: string) => void;
}

export const ExpenseManagementView: React.FC<ExpenseManagementViewProps> = ({
  onNavigateToContracts = () => {},
}) => {
  // 1. Core State
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    const saved = localStorage.getItem('logistic_system_expenses_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved expenses', e);
      }
    }
    return INITIAL_EXPENSE_RECORDS;
  });

  const [budgets, setBudgets] = useState<Record<number, MonthlyBudgetConfig>>(() => {
    const saved = localStorage.getItem('logistic_system_budgets_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved budgets', e);
      }
    }
    return INITIAL_MONTHLY_BUDGETS_1405;
  });

  // 2. Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [periodPreset, setPeriodPreset] = useState<string>('all');

  // 3. Modal States
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseRecord | null>(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [viewingReceiptExpense, setViewingReceiptExpense] = useState<ExpenseRecord | null>(null);
  const [isReportPrintModalOpen, setIsReportPrintModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Contracts list mapped for selectors
  const contractsList = useMemo(() => {
    return INITIAL_ENTERPRISE_CONTRACTS.map((c) => ({
      id: c.id,
      displayId: c.displayId || c.contractId,
      number: c.generalInfo.contractNumber || c.contractId,
      title: c.generalInfo.title,
      company: c.parties.counterparty.companyName,
      companyCode: c.parties.counterparty.companyCode || c.id.replace('cnt-', '').toUpperCase(),
    }));
  }, []);

  const companiesList = useMemo(() => {
    const list: { code: string; nameFa: string }[] = [];
    contractsList.forEach((c) => {
      if (!list.some((l) => l.code === c.companyCode)) {
        list.push({ code: c.companyCode, nameFa: c.company });
      }
    });
    return list;
  }, [contractsList]);

  // Filtered Expenses Computation
  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = exp.titleFa.toLowerCase().includes(q);
        const matchCode = exp.expenseCode.toLowerCase().includes(q);
        const matchCompany = exp.companyNameFa.toLowerCase().includes(q);
        const matchDriver = exp.driverName?.toLowerCase().includes(q) || false;
        const matchPlate = exp.vehiclePlate?.toLowerCase().includes(q) || false;
        const matchInvoice = exp.invoiceNumber?.toLowerCase().includes(q) || false;
        const matchSub = exp.subCategoryFa?.toLowerCase().includes(q) || false;

        if (
          !matchTitle &&
          !matchCode &&
          !matchCompany &&
          !matchDriver &&
          !matchPlate &&
          !matchInvoice &&
          !matchSub
        ) {
          return false;
        }
      }

      // 2. Category Filter
      if (selectedCategory !== 'all' && exp.category !== selectedCategory) {
        return false;
      }

      // 3. Status Filter
      if (selectedStatus !== 'all' && exp.status !== selectedStatus) {
        return false;
      }

      // 4. Company Filter
      if (selectedCompany !== 'all' && exp.companyCode !== selectedCompany) {
        return false;
      }

      // 5. Period Preset
      if (periodPreset === 'q1_spring') {
        if (exp.monthIndex < 1 || exp.monthIndex > 3) return false;
      } else if (periodPreset === 'q2_summer') {
        if (exp.monthIndex < 4 || exp.monthIndex > 6) return false;
      } else if (periodPreset === 'h1_first_half') {
        if (exp.monthIndex < 1 || exp.monthIndex > 6) return false;
      } else if (periodPreset === 'year_1404') {
        if (exp.yearFa !== '۱۴۰۴') return false;
      }

      return true;
    });
  }, [expenses, searchQuery, selectedCategory, selectedStatus, selectedCompany, periodPreset]);

  // Handlers
  const handleSaveExpense = (record: ExpenseRecord) => {
    let updated: ExpenseRecord[];
    const exists = expenses.some((e) => e.id === record.id);
    if (exists) {
      updated = expenses.map((e) => (e.id === record.id ? record : e));
      showToast(`سند هزینه «${record.expenseCode}» با موفقیت ویرایش شد.`);
    } else {
      updated = [record, ...expenses];
      showToast(`سند هزینه جدید «${record.expenseCode}» با موفقیت ثبت شد.`);
    }
    setExpenses(updated);
    localStorage.setItem('logistic_system_expenses_v1', JSON.stringify(updated));
  };

  const handleDeleteExpense = (id: string) => {
    const target = expenses.find((e) => e.id === id);
    const confirmed = window.confirm(`آیا از حذف سند هزینه «${target?.expenseCode || id}» اطمینان دارید؟`);
    if (confirmed) {
      const updated = expenses.filter((e) => e.id !== id);
      setExpenses(updated);
      localStorage.setItem('logistic_system_expenses_v1', JSON.stringify(updated));
      showToast('سند هزینه با موفقیت حذف گردید.');
    }
  };

  const handleSaveBudgets = (updatedBudgets: Record<number, MonthlyBudgetConfig>) => {
    setBudgets(updatedBudgets);
    localStorage.setItem('logistic_system_budgets_v1', JSON.stringify(updatedBudgets));
    showToast('سقف‌های بودجه مصوب با موفقیت به‌روزرسانی شد.');
  };

  // Excel Export Handler using SheetJS (xlsx)
  const handleExportExcel = () => {
    try {
      const exportData = filteredExpenses.map((e, index) => ({
        ردیف: index + 1,
        'کد سند': e.expenseCode,
        'تاریخ ثبت': e.dateFa,
        'ماه مالی': e.monthFa,
        'شرکت طرف حساب': e.companyNameFa,
        'شناسه قرارداد': e.contractDisplayId || 'سربار عمومی',
        'سرفصل اصلی': EXPENSE_CATEGORIES_META[e.category]?.nameFa || e.category,
        'زیردسته / عنوان فرعی': e.subCategoryFa || '-',
        'شرح سند هزینه': e.titleFa,
        'مبلغ (تومان)': e.amountToman,
        'معادل میلیون تومان': Math.round(e.amountToman / 1000000),
        'وضعیت پرداخت':
          e.status === 'paid'
            ? 'پرداخت‌شده'
            : e.status === 'overdue'
            ? 'معوق'
            : e.status === 'under_review'
            ? 'در حال بررسی'
            : 'در انتظار',
        'شماره فاکتور': e.invoiceNumber || '-',
        'پلاک ناوگان': e.vehiclePlate || '-',
        'نام راننده': e.driverName || '-',
        'کد پیگیری بانکی': e.bankTrackingCode || '-',
        'تاییدکننده مالی': e.approvedBy || '-',
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'گزارش هزینه‌ها');

      // Generate buffer and trigger download
      XLSX.writeFile(workbook, `گزارش_جامع_هزینه_های_لجستیک_۱۴۰۵.xlsx`);
      showToast('فایل اکسل گزارش هزینه‌ها با موفقیت دانلود شد.');
    } catch (error) {
      console.error('Export Excel failed:', error);
      showToast('خطا در تولید فایل اکسل.');
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSelectedCompany('all');
    setPeriodPreset('all');
  };

  const getPeriodLabel = () => {
    switch (periodPreset) {
      case 'q1_spring':
        return 'سه‌ماهه نخست (بهار ۱۴۰۵)';
      case 'q2_summer':
        return 'سه‌ماهه دوم (تابستان ۱۴۰۵)';
      case 'h1_first_half':
        return 'شش‌ماهه نخست سال ۱۴۰۵';
      case 'year_1404':
        return 'عملکرد سال گذشته (۱۴۰۴)';
      default:
        return 'کل دوره عملکردی سال ۱۴۰۵';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#1E293B] text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 text-xs font-semibold animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-[#5DCAA5]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Banner (Redesigned with High Contrast & Clean Aesthetics) */}
      <div className="bg-white border border-[#D3D1C7] rounded-3xl p-6 sm:p-7 shadow-xs relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E1F5EE] border border-[#9FE1CB] flex items-center justify-center text-[#085041] shrink-0 mt-1 shadow-2xs">
            <DollarSign className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-[#E1F5EE] text-[#085041] border border-[#9FE1CB] px-3 py-0.5 rounded-full text-xs font-mono font-bold">
                <Receipt className="w-3.5 h-3.5 text-[#0F6E56]" />
                <span>کنسول مدیریت هزینه‌ها و بودجه (Cost Control Console)</span>
              </span>
              <span className="bg-[#F4F3EF] text-[#5F5E5A] border border-[#D3D1C7] px-2.5 py-0.5 rounded-full text-xs font-medium">
                سال مالی ۱۴۰۵ (واحد: تومان)
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-[#1E293B] font-display">
              مدیریت هوشمند هزینه‌ها، سرفصل‌ها و سقف بودجه قراردادها
            </h1>

            <p className="text-[#475569] text-xs sm:text-sm max-w-3xl leading-relaxed">
              پایش لحظه‌ای مصرف سوخت، نگهداری ناوگان، حقوق رانندگان، بیمه و جریمه‌ها به تفکیک قراردادهای تجاری طرف حساب و تطبیق مستمر با سقف بودجه مصوب سازمانی.
            </p>
          </div>
        </div>

        {/* Top Actions */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#E2E8F0]">
          <button
            type="button"
            onClick={() => setIsBudgetModalOpen(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-[#F8F9FA] text-[#2C2C2A] rounded-2xl text-xs font-bold border border-[#D3D1C7] shadow-2xs hover:border-[#B4B2A9] transition-all cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-[#0F6E56]" />
            <span>تنظیم بودجه مصوب</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingExpense(null);
              setIsAddEditModalOpen(true);
            }}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-[#085041] hover:bg-[#04342C] text-white rounded-2xl text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#9FE1CB]" />
            <span>ثبت هزینه جدید</span>
          </button>
        </div>
      </div>

      {/* 1. KPI Analytical Cards Section */}
      <ExpenseKPISection
        expenses={filteredExpenses}
        allExpenses={expenses}
        budgets={budgets}
        priorYearTotals={PRIOR_YEAR_1404_TOTALS}
        onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
      />

      {/* 2. Visual Trends & Charts Section */}
      <ExpenseChartsSection
        expenses={filteredExpenses}
        allExpenses={expenses}
        budgets={budgets}
        priorYearTotals={PRIOR_YEAR_1404_TOTALS}
        selectedCompany={selectedCompany}
        onCompanyChange={setSelectedCompany}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        companiesList={companiesList}
      />

      {/* 3. Contract Linkage & Cap Utilization Section */}
      <ContractExpensesSection
        expenses={filteredExpenses}
        onNavigateToContracts={onNavigateToContracts}
      />

      {/* 4. Comprehensive Expense Records Table Section */}
      <ExpenseTableSection
        expenses={filteredExpenses}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        periodPreset={periodPreset}
        onPeriodPresetChange={setPeriodPreset}
        onAddExpense={() => {
          setEditingExpense(null);
          setIsAddEditModalOpen(true);
        }}
        onEditExpense={(record) => {
          setEditingExpense(record);
          setIsAddEditModalOpen(true);
        }}
        onDeleteExpense={handleDeleteExpense}
        onViewReceipt={(record) => {
          setViewingReceiptExpense(record);
          setIsReceiptModalOpen(true);
        }}
        onNavigateToContracts={onNavigateToContracts}
        onExportExcel={handleExportExcel}
        onExportPDF={() => setIsReportPrintModalOpen(true)}
      />

      {/* Modals */}
      <AddEditExpenseModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        onSave={handleSaveExpense}
        editingExpense={editingExpense}
        contractsList={contractsList}
      />

      <BudgetConfigModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        budgets={budgets}
        onSaveBudgets={handleSaveBudgets}
      />

      <ExpenseReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        expense={viewingReceiptExpense}
        onNavigateToContracts={onNavigateToContracts}
      />

      <ExpenseReportPrintModal
        isOpen={isReportPrintModalOpen}
        onClose={() => setIsReportPrintModalOpen(false)}
        expenses={filteredExpenses}
        budgets={budgets}
        periodLabel={getPeriodLabel()}
        selectedCompanyName={
          selectedCompany !== 'all'
            ? companiesList.find((c) => c.code === selectedCompany)?.nameFa
            : undefined
        }
      />
    </div>
  );
};
