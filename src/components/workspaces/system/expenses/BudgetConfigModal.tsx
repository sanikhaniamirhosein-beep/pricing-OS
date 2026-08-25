import React, { useState, useEffect } from 'react';
import { X, Save, Sliders, DollarSign, CheckCircle2, Sparkles } from 'lucide-react';
import {
  MonthlyBudgetConfig,
  ExpenseCategory,
  EXPENSE_CATEGORIES_META,
} from '../../../../types/expense';

interface BudgetConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  budgets: Record<number, MonthlyBudgetConfig>;
  onSaveBudgets: (updated: Record<number, MonthlyBudgetConfig>) => void;
}

export const BudgetConfigModal: React.FC<BudgetConfigModalProps> = ({
  isOpen,
  onClose,
  budgets,
  onSaveBudgets,
}) => {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(7);
  const [localBudgets, setLocalBudgets] = useState<Record<number, MonthlyBudgetConfig>>(
    JSON.parse(JSON.stringify(budgets))
  );

  useEffect(() => {
    if (isOpen) {
      setLocalBudgets(JSON.parse(JSON.stringify(budgets)));
    }
  }, [isOpen, budgets]);

  const monthOptions = [
    { index: 1, name: 'فروردین ۱۴۰۵' },
    { index: 2, name: 'اردیبهشت ۱۴۰۵' },
    { index: 3, name: 'خرداد ۱۴۰۵' },
    { index: 4, name: 'تیر ۱۴۰۵' },
    { index: 5, name: 'مرداد ۱۴۰۵' },
    { index: 6, name: 'شهریور ۱۴۰۵' },
    { index: 7, name: 'مهر ۱۴۰۵' },
  ];

  const currentMonthBudget = localBudgets[selectedMonthIndex] || {
    yearFa: '۱۴۰۵',
    monthFa: monthOptions.find((m) => m.index === selectedMonthIndex)?.name || 'مهر',
    monthIndex: selectedMonthIndex,
    totalBudgetToman: 3000000000,
    categoryBudgets: {
      fuel: 900000000,
      fleet_maintenance: 600000000,
      driver_wages: 1200000000,
      insurance: 300000000,
      commission: 250000000,
      penalty: 60000000,
      other: 150000000,
    },
  };

  const handleCategoryBudgetChange = (cat: ExpenseCategory, val: number) => {
    const updatedMonth = {
      ...currentMonthBudget,
      categoryBudgets: {
        ...currentMonthBudget.categoryBudgets,
        [cat]: val,
      },
    };

    // Recalculate total
    const newTotal = Object.values(updatedMonth.categoryBudgets).reduce((a, b) => a + b, 0);
    updatedMonth.totalBudgetToman = newTotal;

    setLocalBudgets({
      ...localBudgets,
      [selectedMonthIndex]: updatedMonth,
    });
  };

  const handleSave = () => {
    onSaveBudgets(localBudgets);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-slate-50/80 border-b border-slate-100 px-6 sm:px-7 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base font-display">
                مدیریت و پیکربندی سقف بودجه مصوب (Budget Allocation)
              </h3>
              <p className="text-slate-500 text-xs mt-0.5">
                تخصیص بودجه ماهانه به تفکیک سرفصل‌های هزینه جهت محاسبه انحراف و سرریز مالی
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

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6 text-xs">
          {/* Month Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600">انتخاب ماه هدف برای بودجه‌بندی:</span>
              <select
                value={selectedMonthIndex}
                onChange={(e) => setSelectedMonthIndex(Number(e.target.value))}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-900 focus:outline-none focus:border-amber-500 cursor-pointer shadow-2xs"
              >
                {monthOptions.map((m) => (
                  <option key={m.index} value={m.index}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500">مجموع سقف بودجه ماه:</span>
              <span className="font-mono font-bold text-slate-950 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl text-sm shadow-2xs">
                {(currentMonthBudget.totalBudgetToman / 1000000000).toFixed(2)} میلیارد تومان
              </span>
            </div>
          </div>

          {/* Category Budget Inputs */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900">سقف بودجه به تفکیک سرفصل‌ها:</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {(Object.keys(EXPENSE_CATEGORIES_META) as ExpenseCategory[]).map((cat) => {
                const meta = EXPENSE_CATEGORIES_META[cat];
                const budgetVal = currentMonthBudget.categoryBudgets[cat] || 0;

                return (
                  <div
                    key={cat}
                    className="bg-slate-50/60 border border-slate-200/90 rounded-2xl p-3.5 space-y-2 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: meta.colorHex }}
                        />
                        <span className="font-bold text-slate-900">{meta.nameFa}</span>
                      </div>
                      <span className="font-mono text-xs text-slate-500">
                        {(budgetVal / 1000000).toLocaleString('fa-IR')} م تومان
                      </span>
                    </div>

                    <div className="relative">
                      <input
                        type="number"
                        step="10000000"
                        min="0"
                        value={budgetVal}
                        onChange={(e) => handleCategoryBudgetChange(cat, Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2 font-mono font-bold text-xs text-slate-900 focus:outline-none focus:border-amber-500 shadow-2xs"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
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
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              <Save className="w-4 h-4 text-slate-950" />
              <span>ذخیره بودجه مصوب</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
