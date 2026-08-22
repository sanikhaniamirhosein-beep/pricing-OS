import React, { useState } from 'react';
import {
  CreditCard,
  Building,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Search,
  Plus,
  Edit2,
  Calendar,
  CheckCircle2,
  XCircle,
  FileCheck,
  DollarSign,
  Ban,
  RotateCcw,
} from 'lucide-react';
import { usePricing } from '../../../store/PricingContext';
import { CorporateCreditAccount } from '../../../types/pricing';

export const CreditSettlementView: React.FC = () => {
  const { creditAccounts, updateCreditAccount, toggleBlacklistAccount } = usePricing();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'good' | 'warning' | 'blacklisted'>('all');
  const [selectedAccount, setSelectedAccount] = useState<CorporateCreditAccount | null>(null);

  const filteredAccounts = creditAccounts.filter((acc) => {
    const matchSearch =
      acc.companyNameFa.includes(searchQuery) ||
      acc.companyCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.nationalId.includes(searchQuery);

    const matchFilter =
      filterStatus === 'all' ||
      (filterStatus === 'blacklisted' && acc.isBlacklisted) ||
      (filterStatus === 'warning' && !acc.isBlacklisted && acc.overdueDays > 0) ||
      (filterStatus === 'good' && !acc.isBlacklisted && acc.overdueDays === 0);

    return matchSearch && matchFilter;
  });

  const totalCreditLimitBillion = creditAccounts.reduce((sum, a) => sum + a.creditLimitToman, 0) / 1000000000;
  const totalOutstandingBillion = creditAccounts.reduce((sum, a) => sum + a.currentOutstandingToman, 0) / 1000000000;
  const blacklistedCount = creditAccounts.filter((a) => a.isBlacklisted).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 font-title">
                  ۶.۲ تسویه حساب و سقف اعتبار مشتریان (Corporate Credit & Blacklist Engine)
                </h1>
                <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {creditAccounts.length} حساب شرکتی
                </span>
                {blacklistedCount > 0 && (
                  <span className="bg-rose-100 text-rose-800 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <Ban className="w-3 h-3" />
                    {blacklistedCount} حساب در بلک‌لیست
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 mt-1">
                مدیریت سقف اعتبار ریالی، مهلت‌های پرداخت ۳۰ تا ۴۵ روزه، چک‌های صیادی و مسدودسازی خودکار صدور بارنامه (Auto-Blacklist)
              </p>
            </div>
          </div>
        </div>

        {/* 3 Summary KPIs */}
        <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-[11px] text-slate-400 block">مجموع سقف اعتبار تخصیص‌یافته:</span>
            <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">
              {totalCreditLimitBillion.toFixed(1)} میلیارد تومان
            </span>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-[11px] text-slate-400 block">مانده بدهی جاری (Outstanding):</span>
            <span className="text-base font-bold font-mono text-amber-900 mt-0.5 block">
              {totalOutstandingBillion.toFixed(1)} میلیارد تومان
            </span>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-[11px] text-slate-400 block">ضمانت‌نامه‌ها و چک‌های صیادی:</span>
            <span className="text-base font-bold font-mono text-emerald-700 mt-0.5 block">
              ۱۰۰٪ ثبت در سامانه پیچک
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی نام شرکت یا شناسه ملی..."
            className="w-full bg-white border border-slate-200 rounded-xl pr-9 pl-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              filterStatus === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
            }`}
          >
            همه حساب‌ها
          </button>
          <button
            onClick={() => setFilterStatus('good')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              filterStatus === 'good' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
            }`}
          >
            خوش‌حساب
          </button>
          <button
            onClick={() => setFilterStatus('warning')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              filterStatus === 'warning' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
            }`}
          >
            دارای معوقه
          </button>
          <button
            onClick={() => setFilterStatus('blacklisted')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              filterStatus === 'blacklisted' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
            }`}
          >
            مسدود / بلک‌لیست
          </button>
        </div>
      </div>

      {/* Credit Accounts Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">نام مشتری سازمانی</th>
                <th className="py-3.5 px-4">شناسه ملی</th>
                <th className="py-3.5 px-4">سقف اعتبار ریالی</th>
                <th className="py-3.5 px-4">مانده بدهی جاری</th>
                <th className="py-3.5 px-4">مهلت تسویه</th>
                <th className="py-3.5 px-4">روز معوقه</th>
                <th className="py-3.5 px-4">وضعیت حساب</th>
                <th className="py-3.5 px-4 text-center">عملیات بلک‌لیست</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredAccounts.map((account) => (
                <tr
                  key={account.id}
                  className={`hover:bg-slate-50 transition-colors ${
                    account.isBlacklisted ? 'bg-rose-50/40' : ''
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{account.companyNameFa}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{account.companyCode}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {account.nationalId}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {account.creditLimitToman.toLocaleString('fa-IR')} تومان
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-900">
                    {account.currentOutstandingToman.toLocaleString('fa-IR')} تومان
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">
                    {account.paymentTermsDays} روزه
                  </td>
                  <td className="py-3.5 px-4">
                    {account.overdueDays > 0 ? (
                      <span className="font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        {account.overdueDays} روز تأخیر
                      </span>
                    ) : (
                      <span className="text-emerald-700 text-[11px] font-bold">تسویه به‌موقع</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {account.isBlacklisted ? (
                      <span className="bg-rose-100 text-rose-800 font-bold px-2.5 py-0.5 rounded-full text-[10px] inline-flex items-center gap-1">
                        <Ban className="w-3 h-3" />
                        مسدود / بلک‌لیست
                      </span>
                    ) : (
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full text-[10px] inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        مجاز به صدور بارنامه
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() =>
                        toggleBlacklistAccount(
                          account.id,
                          account.isBlacklisted ? undefined : 'تأخیر در وصول فاکتورهای معوقه'
                        )
                      }
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        account.isBlacklisted
                          ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {account.isBlacklisted ? 'رفع مسدودی' : 'انتقال به بلک‌لیست'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
