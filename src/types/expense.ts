/**
 * Enterprise Expense Management Types
 * Comprehensive data schema for Fleet, Operations & Contract Expense Tracking
 */

export type ExpenseCategory =
  | 'fuel'
  | 'fleet_maintenance'
  | 'driver_wages'
  | 'insurance'
  | 'commission'
  | 'penalty'
  | 'other';

export type ExpensePaymentStatus = 'paid' | 'overdue' | 'under_review' | 'pending';

export interface ExpenseCategoryMeta {
  id: ExpenseCategory;
  nameFa: string;
  nameEn: string;
  colorHex: string;
  bgHex: string;
  borderHex: string;
  descriptionFa: string;
}

export const EXPENSE_CATEGORIES_META: Record<ExpenseCategory, ExpenseCategoryMeta> = {
  fuel: {
    id: 'fuel',
    nameFa: 'سوخت و انرژی',
    nameEn: 'Fuel & Energy',
    colorHex: '#D97706', // amber-600
    bgHex: '#FEF3C7',
    borderHex: '#FDE68A',
    descriptionFa: 'گازوئیل یارانه‌ای و آزاد، روغن سوخت، هزینه شارژ ناوگان و مکمل‌ها',
  },
  fleet_maintenance: {
    id: 'fleet_maintenance',
    nameFa: 'نگهداری و تعمیرات ناوگان',
    nameEn: 'Fleet Maintenance',
    colorHex: '#2563EB', // blue-600
    bgHex: '#DBEAFE',
    borderHex: '#BFDBFE',
    descriptionFa: 'سرویس دوره‌ای، لاستیک، تعویض روغن، تعمیرات موتور و گیربکس',
  },
  driver_wages: {
    id: 'driver_wages',
    nameFa: 'حقوق و دستمزد راننده',
    nameEn: 'Driver Wages & Allowances',
    colorHex: '#059669', // emerald-600
    bgHex: '#D1FAE5',
    borderHex: '#A7F3D0',
    descriptionFa: 'حق‌الزحمه راننده، حق ماموریت، پاداش عملکرد و اضافه کاری بارگیری',
  },
  insurance: {
    id: 'insurance',
    nameFa: 'بیمه و مسئولیت مدنی کالا',
    nameEn: 'Insurance & Liability',
    colorHex: '#7C3AED', // purple-600
    bgHex: '#EDE9FE',
    borderHex: '#DDD6FE',
    descriptionFa: 'بیمه شخص ثالث و بدنه، بیمه تمام‌خطر مسئولیت متصدیان CMR و تامین اجتماعی',
  },
  commission: {
    id: 'commission',
    nameFa: 'کمیسیون و عوارض دولتی',
    nameEn: 'Commission & Tolls',
    colorHex: '#0891B2', // cyan-600
    bgHex: '#CFFAFE',
    borderHex: '#A5F3FC',
    descriptionFa: 'کارمزد پایانه، عوارض سازمان راهداری، سبا و کمیسیون‌های قانونی',
  },
  penalty: {
    id: 'penalty',
    nameFa: 'جرایم و خسارات',
    nameEn: 'Penalties & Fines',
    colorHex: '#DC2626', // red-600
    bgHex: '#FEE2E2',
    borderHex: '#FECACA',
    descriptionFa: 'خسارت تاخیر تخلیه/دموراژ، جریمه راهنمایی و رانندگی، کسر باسکول و جرایم قراردادی',
  },
  other: {
    id: 'other',
    nameFa: 'سایر هزینه‌های عملیاتی',
    nameEn: 'Other Overheads',
    colorHex: '#4B5563', // gray-600
    bgHex: '#F3F4F6',
    borderHex: '#E5E7EB',
    descriptionFa: 'عوارض آزادراهی الکترونیک ETC، هزینه باسکول، پذیرایی، اقامت راننده و اداری',
  },
};

export interface ExpenseRecord {
  id: string;
  expenseCode: string; // e.g. 'EXP-1405-0891'
  dateFa: string; // e.g. '۱۴۰۵/۰۵/۱۸'
  monthFa: string; // e.g. 'مرداد ۱۴۰۵'
  yearFa: string; // e.g. '۱۴۰۵'
  monthIndex: number; // 1 to 12
  contractId: string;
  contractDisplayId?: string; // e.g. 'CT-330'
  contractNumber?: string; // e.g. '1405/PG/992-B'
  contractTitle?: string;
  companyNameFa: string;
  companyCode: string;
  category: ExpenseCategory;
  subCategoryFa?: string;
  titleFa: string;
  descriptionFa?: string;
  amountToman: number;
  status: ExpensePaymentStatus;
  invoiceNumber?: string;
  paymentDueDateFa?: string;
  paidDateFa?: string;
  bankTrackingCode?: string;
  approvedBy?: string;
  vehiclePlate?: string;
  driverName?: string;
  attachmentFileName?: string;
  routeTitleFa?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CategoryBudget {
  category: ExpenseCategory;
  budgetToman: number;
  allocatedToman?: number;
}

export interface MonthlyBudgetConfig {
  yearFa: string;
  monthFa: string;
  monthIndex: number;
  totalBudgetToman: number;
  categoryBudgets: Record<ExpenseCategory, number>;
}

export interface ContractExpenseSummary {
  contractId: string;
  contractDisplayId: string;
  contractNumber: string;
  contractTitle: string;
  companyNameFa: string;
  companyCode: string;
  contractCeilingToman: number;
  totalExpensesToman: number;
  paidExpensesToman: number;
  pendingExpensesToman: number;
  overdueExpensesToman: number;
  expenseRecordCount: number;
  utilizationPercent: number;
  isBreached: boolean;
  isNearCap: boolean; // > 85%
  breachAmountToman: number;
  categoriesBreakdown: Record<ExpenseCategory, number>;
}

export interface ExpenseFilterState {
  searchQuery: string;
  contractId: string; // 'all' or specific contractId
  companyName: string; // 'all' or specific company
  category: string; // 'all' or specific ExpenseCategory
  status: string; // 'all' or specific ExpensePaymentStatus
  periodPreset: 'all' | 'q1_spring' | 'q2_summer' | 'q3_autumn' | 'q4_winter' | 'h1_first_half' | 'year_1405' | 'year_1404';
  selectedYear: string; // '1405' | '1404'
  minAmount?: number;
  maxAmount?: number;
}

export interface MonthlyExpenseAggregate {
  monthFa: string;
  monthShort: string;
  monthIndex: number;
  yearFa: string;
  totalAmountToman: number;
  budgetAmountToman: number;
  varianceAmountToman: number;
  variancePercent: number;
  priorYearAmountToman?: number;
  growthRateMoM?: number;
  categoryBreakdown: Record<ExpenseCategory, number>;
  fuel: number;
  fleet_maintenance: number;
  driver_wages: number;
  insurance: number;
  commission: number;
  penalty: number;
  other: number;
  paidAmountToman: number;
  pendingAmountToman: number;
  overdueAmountToman: number;
  recordCount: number;
}
