import React, { useState } from 'react';
import {
  FileText,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  Building2,
  PieChart as PieIcon,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { ExpenseRecord, EXPENSE_CATEGORIES_META, ExpenseCategory } from '../../../../types/expense';

interface ContractExpenseLinkProps {
  expenses: ExpenseRecord[];
  onNavigateToContracts: (contractId?: string) => void;
}

interface ContractSummaryItem {
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
  recordCount: number;
  utilizationPercent: number;
  isBreached: boolean;
  isNearCap: boolean; // > 85%
  breachAmountToman: number;
  categories: Record<ExpenseCategory, number>;
}

// Known ceilings from mockEnterpriseContracts
const CONTRACT_CEILINGS: Record<string, { ceilingToman: number; number: string; displayId: string; title: string; company: string }> = {
  'cnt-pgpc-2026': {
    ceilingToman: 42000000000, // 42 Billion Toman
    number: '1405/PG/992-B',
    displayId: 'CT-330',
    title: 'قرارداد جامع ترانزیت جاده‌ای و حمل فرآورده‌های پلیمری و پتروشیمی',
    company: 'شرکت صنایع پتروشیمی خلیج فارس (هلدینگ PGPC)',
  },
  'cnt-mihan-dairy': {
    ceilingToman: 28000000000, // 28 Billion Toman
    number: 'MHN-LOG-1405/77',
    displayId: 'CT-412',
    title: 'قرارداد تخصصی لجستیک زنجیره سرد، لبنیات، بستنی و مواد فاسدشدنی',
    company: 'گروه صنایع غذایی و لبنیات میهن',
  },
  'cnt-mobarakeh-steel': {
    ceilingToman: 58000000000, // 58 Billion Toman
    number: 'MSC-TRN-1405/901',
    displayId: 'CT-505',
    title: 'قرارداد پیمانکاری و لجستیک سنگین اسلب، کلاف گرم و محصولات فولادی',
    company: 'شرکت فولاد مبارکه اصفهان',
  },
  'cnt-digikala-logistics': {
    ceilingToman: 19500000000, // 19.5 Billion Toman
    number: 'DK-EXP-1405/33',
    displayId: 'CT-210',
    title: 'قرارداد توزیع بین‌شهری و هاب‌به‌هاب بسته و مرسولات تجارت الکترونیک',
    company: 'دیجی‌کالا اکسپرس (نوآوران فن‌آوازه)',
  },
  'cnt-zar-macaron': {
    ceilingToman: 24000000000, // 24 Billion Toman
    number: 'ZAR-IND-1405/55',
    displayId: 'CT-180',
    title: 'قرارداد حمل آرد، گلوکز صنعتی، سس و ماکارونی از شهرک صنعتی هشتگرد',
    company: 'گروه صنعتی و پالایشگاه غلات زر',
  },
};

export const ContractExpensesSection: React.FC<ContractExpenseLinkProps> = ({
  expenses,
  onNavigateToContracts,
}) => {
  const [expandedContractId, setExpandedContractId] = useState<string | null>(null);

  // Group all expenses by contractId
  const contractsMap: Record<string, ContractSummaryItem> = {};

  // Initialize known contracts
  Object.keys(CONTRACT_CEILINGS).forEach((cid) => {
    const meta = CONTRACT_CEILINGS[cid];
    contractsMap[cid] = {
      contractId: cid,
      contractDisplayId: meta.displayId,
      contractNumber: meta.number,
      contractTitle: meta.title,
      companyNameFa: meta.company,
      companyCode: cid.replace('cnt-', '').toUpperCase(),
      contractCeilingToman: meta.ceilingToman,
      totalExpensesToman: 0,
      paidExpensesToman: 0,
      pendingExpensesToman: 0,
      overdueExpensesToman: 0,
      recordCount: 0,
      utilizationPercent: 0,
      isBreached: false,
      isNearCap: false,
      breachAmountToman: 0,
      categories: {
        fuel: 0,
        fleet_maintenance: 0,
        driver_wages: 0,
        insurance: 0,
        commission: 0,
        penalty: 0,
        other: 0,
      },
    };
  });

  // Aggregate expenses
  expenses.forEach((e) => {
    const cid = e.contractId || 'other';
    if (!contractsMap[cid]) {
      contractsMap[cid] = {
        contractId: cid,
        contractDisplayId: e.contractDisplayId || 'CT-GEN',
        contractNumber: e.contractNumber || 'GEN-1405',
        contractTitle: e.contractTitle || 'قرارداد جاری لجستیک',
        companyNameFa: e.companyNameFa || 'سربار عمومی',
        companyCode: e.companyCode || 'GEN',
        contractCeilingToman: 15000000000,
        totalExpensesToman: 0,
        paidExpensesToman: 0,
        pendingExpensesToman: 0,
        overdueExpensesToman: 0,
        recordCount: 0,
        utilizationPercent: 0,
        isBreached: false,
        isNearCap: false,
        breachAmountToman: 0,
        categories: {
          fuel: 0,
          fleet_maintenance: 0,
          driver_wages: 0,
          insurance: 0,
          commission: 0,
          penalty: 0,
          other: 0,
        },
      };
    }

    const item = contractsMap[cid];
    item.totalExpensesToman += e.amountToman;
    item.recordCount += 1;
    item.categories[e.category] = (item.categories[e.category] || 0) + e.amountToman;

    if (e.status === 'paid') item.paidExpensesToman += e.amountToman;
    else if (e.status === 'overdue') item.overdueExpensesToman += e.amountToman;
    else item.pendingExpensesToman += e.amountToman;
  });

  // Calculate percentages and breach flags
  const contractSummaries = Object.values(contractsMap)
    .filter((c) => c.recordCount > 0)
    .map((c) => {
      const util = c.contractCeilingToman > 0
        ? Number(((c.totalExpensesToman / c.contractCeilingToman) * 100).toFixed(1))
        : 0;
      const isBreached = c.totalExpensesToman > c.contractCeilingToman;
      const isNearCap = util >= 85 && !isBreached;
      const breachAmount = isBreached ? c.totalExpensesToman - c.contractCeilingToman : 0;

      return {
        ...c,
        utilizationPercent: util,
        isBreached,
        isNearCap,
        breachAmountToman: breachAmount,
      };
    })
    .sort((a, b) => b.totalExpensesToman - a.totalExpensesToman);

  const breachedContracts = contractSummaries.filter((c) => c.isBreached);
  const nearCapContracts = contractSummaries.filter((c) => c.isNearCap);

  return (
    <div className="bg-white border border-[#D3D1C7] rounded-3xl p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D3D1C7] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#085041]" />
            <h2 className="font-bold text-[#2C2C2A] text-sm sm:text-base font-display">
              ارتباط هزینه‌ها با قراردادهای سازمانی و پایش سقف مبلغ (Contract Linkage & Cap Tracking)
            </h2>
          </div>
          <p className="text-[#5F5E5A] text-xs mt-0.5">
            تطبیق هزینه‌های تحقق‌یافته هر شرکت با سقف مصوب قرارداد، هشدار سرریز بودجه و پیوند مستقیم به پرونده قراردادها
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigateToContracts()}
          className="flex items-center gap-2 px-4 py-2 bg-[#FAFAF8] hover:bg-[#F1EFE8] text-[#085041] border border-[#D3D1C7] text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <span>مشاهده کلیه قراردادها در استودیو</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Contract Cap Breach / Warning Alerts */}
      {breachedContracts.length > 0 && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 space-y-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
            <span className="font-bold text-sm">
              هشدار بحرانی: عبور مجموع هزینه‌ها از سقف مبلغ قرارداد (Contract Cap Breach)
            </span>
          </div>
          <p className="text-xs leading-relaxed text-rose-800">
            مجموع هزینه‌های ثبت‌شده برای {breachedContracts.length} قرارداد از سقف مصوب اولیه عبور کرده است. مطابق با گاردریل‌های مالی، لازم است الحاقیه افزایش مبلغ یا متمم بودجه صادر گردد:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {breachedContracts.map((bc) => (
              <span
                key={bc.contractId}
                className="inline-flex items-center gap-1.5 bg-white border border-rose-300 text-rose-800 px-3 py-1 rounded-xl text-xs font-semibold shadow-xs"
              >
                <span>{bc.companyNameFa}</span>
                <span className="font-mono text-rose-600 font-bold">({bc.utilizationPercent}٪ سقف)</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {nearCapContracts.length > 0 && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 flex items-start gap-2 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">هشدار نزدیک به سقف مجاز: </span>
            <span>
              قراردادهای زیر بیش از ۸۵٪ از سقف مصوب خود را مصرف کرده‌اند:
            </span>
            <span className="font-semibold mr-1">
              {nearCapContracts.map((c) => `${c.companyNameFa} (${c.utilizationPercent}٪)`).join('، ')}
            </span>
          </div>
        </div>
      )}

      {/* Contract Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {contractSummaries.map((c) => {
          const isExpanded = expandedContractId === c.contractId;
          const ceilingInBillion = (c.contractCeilingToman / 1000000000).toFixed(1);
          const totalInBillion = (c.totalExpensesToman / 1000000000).toFixed(2);

          return (
            <div
              key={c.contractId}
              className={`bg-[#FAFAF8] border rounded-2xl p-4.5 space-y-4 transition-all shadow-xs ${
                c.isBreached
                  ? 'border-rose-300 bg-rose-50/30'
                  : c.isNearCap
                  ? 'border-amber-300 bg-amber-50/20'
                  : 'border-[#D3D1C7]'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#E1F5EE] text-[#04342C] px-2.5 py-0.5 rounded-full border border-[#9FE1CB] font-mono font-bold text-[11px]">
                      {c.contractDisplayId}
                    </span>
                    <span className="font-mono text-xs text-[#5F5E5A]">{c.contractNumber}</span>
                  </div>
                  <h3 className="font-bold text-[#2C2C2A] text-sm">{c.companyNameFa}</h3>
                  <p className="text-xs text-[#5F5E5A] line-clamp-1">{c.contractTitle}</p>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigateToContracts(c.contractId)}
                  className="p-2 bg-white hover:bg-[#F1EFE8] text-[#085041] border border-[#D3D1C7] rounded-xl transition-colors cursor-pointer shrink-0"
                  title="مشاهده و ویرایش در بخش قراردادها"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              {/* Progress & Cap Utilization */}
              <div className="bg-white p-3.5 rounded-xl border border-[#D3D1C7] space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#5F5E5A]">
                  <span>مصرف سقف مبلغ قرارداد:</span>
                  <div className="flex items-center gap-1 font-mono">
                    <span className="font-bold text-[#2C2C2A]">{totalInBillion}</span>
                    <span>از</span>
                    <span className="font-bold text-[#085041]">{ceilingInBillion} میلیارد تومان</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-[#EAE8E1] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      c.isBreached
                        ? 'bg-rose-500'
                        : c.isNearCap
                        ? 'bg-amber-500'
                        : 'bg-[#085041]'
                    }`}
                    style={{ width: `${Math.min(c.utilizationPercent, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-[#5F5E5A]">
                    تعداد رکوردهای هزینه: <strong className="text-[#2C2C2A] font-mono">{c.recordCount}</strong> سند
                  </span>
                  <span
                    className={`font-mono font-bold text-xs px-2 py-0.5 rounded border ${
                      c.isBreached
                        ? 'bg-rose-50 border-rose-200 text-rose-700'
                        : c.isNearCap
                        ? 'bg-amber-50 border-amber-200 text-amber-700'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    }`}
                  >
                    {c.utilizationPercent}٪ مصرف سقف
                  </span>
                </div>
              </div>

              {/* Accordion Toggle for Category Breakdown */}
              <div>
                <button
                  type="button"
                  onClick={() => setExpandedContractId(isExpanded ? null : c.contractId)}
                  className="w-full flex items-center justify-between text-xs text-[#5F5E5A] hover:text-[#2C2C2A] py-1 transition-colors cursor-pointer"
                >
                  <span className="font-semibold">
                    {isExpanded ? 'بستن تفکیک سرفصل‌ها' : 'مشاهده سهم سرفصل‌های هزینه این قرارداد'}
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-[#D3D1C7] grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {(Object.keys(c.categories) as ExpenseCategory[]).map((cat) => {
                      const amount = c.categories[cat];
                      if (amount === 0) return null;
                      const meta = EXPENSE_CATEGORIES_META[cat];
                      return (
                        <div
                          key={cat}
                          className="bg-white p-2 rounded-xl border border-[#ECEAE3] flex flex-col justify-between space-y-1"
                        >
                          <div className="flex items-center gap-1.5 text-[11px] text-[#5F5E5A]">
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: meta.colorHex }}
                            />
                            <span className="truncate">{meta.nameFa}</span>
                          </div>
                          <span className="font-mono font-bold text-[#2C2C2A] text-xs">
                            {Math.round(amount / 1000000).toLocaleString('fa-IR')} م تومان
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
