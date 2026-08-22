import React, { useState } from 'react';
import {
  FileText,
  Building2,
  Calendar,
  DollarSign,
  Plus,
  Edit2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Search,
  Sparkles,
  TrendingDown,
  Award,
  Clock,
  Layers,
} from 'lucide-react';
import { usePricing } from '../../../store/PricingContext';
import { LogisticsContract } from '../../../types/pricing';

export const EnterprisePriceBooksView: React.FC = () => {
  const { contracts } = usePricing();
  const [contractList, setContractList] = useState<LogisticsContract[]>(contracts || []);
  const [selectedContract, setSelectedContract] = useState<LogisticsContract | null>(contracts?.[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingContract, setIsAddingContract] = useState(false);

  const filteredContracts = (contractList || []).filter(
    (c) =>
      c?.customerNameFa?.includes(searchQuery) ||
      c?.customerCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c?.industry?.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 font-title">
                  ۲.۱ مدیریت دفترچه‌های قیمت شرکتی (Enterprise Price Books)
                </h1>
                <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {(contracts || []).length} قرارداد فعال
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                تعریف تعرفه‌های اختصاصی، ماتریس‌های توافقی با مشتریان کلیدی (هلدینگ‌های پتروشیمی، فولاد و مواد غذایی) و دوره‌های اعتبار ۶ ماهه و ۱ ساله
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddingContract(true)}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              افتتاح دفترچه قیمت جدید
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Contracts List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو بر اساس نام شرکت یا کد..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div className="space-y-2">
              {filteredContracts.map((contract) => {
                const isSelected = selectedContract?.contractId === contract.contractId;
                return (
                  <div
                    key={contract.contractId}
                    onClick={() => setSelectedContract(contract)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100/60 px-1.5 py-0.5 rounded">
                          {contract.customerCode}
                        </span>
                        <h3 className="text-xs font-bold text-slate-900 mt-1 leading-snug">
                          {contract.customerNameFa}
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">{contract.industry}</p>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          contract.tier === 'Diamond'
                            ? 'bg-blue-100 text-blue-800'
                            : contract.tier === 'Platinum'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {contract.tier}
                      </span>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        اعتبار تا: {contract.effectiveTo}
                      </span>
                      <span className="font-bold font-mono text-slate-700">
                        {contract.minimumCommitmentTons.toLocaleString('fa-IR')} تن/سال
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Selected Price Book Detail (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {selectedContract ? (
            <>
              {/* Contract Summary Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                        {selectedContract.displayId}
                      </span>
                      <h2 className="text-base font-bold text-slate-900 font-title">
                        {selectedContract.customerNameFa}
                      </h2>
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {selectedContract.customerNameEn}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-xl font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      قرارداد معتبر و جاری
                    </span>
                  </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">سطح مشتری (Tier):</span>
                    <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                      {selectedContract.tier}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">تعهد حداقل بارگیری:</span>
                    <span className="font-mono font-bold text-slate-800 text-sm mt-0.5 block">
                      {selectedContract.minimumCommitmentTons.toLocaleString('fa-IR')} تن
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">جریمه عدم ایفای تعهد:</span>
                    <span className="font-mono font-bold text-amber-800 text-sm mt-0.5 block">
                      {selectedContract.penaltyClausePerTonShortfallToman.toLocaleString('fa-IR')} ت/تن
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">پوشش شاخص سوخت:</span>
                    <span className="font-mono font-bold text-blue-700 text-sm mt-0.5 block">
                      %{selectedContract.fuelIndexAbsorptionPercent}
                    </span>
                  </div>
                </div>

                {/* Validity Period Banner */}
                <div className="flex items-center justify-between bg-amber-50/50 p-3.5 rounded-2xl border border-amber-100 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <span>دوره اعتبار تعرفه دفترچه:</span>
                    <span className="font-bold font-mono">
                      {selectedContract.effectiveFrom} تا {selectedContract.effectiveTo}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-amber-800">اعتبار ۱۲ ماهه</span>
                </div>
              </div>

              {/* Volume Discount Bands */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-amber-600" />
                    <h3 className="text-sm font-bold text-slate-900 font-title">
                      پله‌های تخفیف تناژ ماهانه (Volume-based Discount Bands)
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">تخفیف پله‌ای پلکانی</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">پله تناژ ماهانه (از - تا)</th>
                        <th className="py-3 px-4">درصد تخفیف</th>
                        <th className="py-3 px-4">کسر نرخ بر واحد تن-کیلومتر</th>
                        <th className="py-3 px-4">وضعیت شمول</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {(selectedContract?.volumeBands || []).map((band, bIdx) => (
                        <tr key={bIdx} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-mono font-bold">
                            {band.minTonsPerMonth.toLocaleString('fa-IR')} تا{' '}
                            {band.maxTonsPerMonth > 500000
                              ? 'بالای ۲۵,۰۰۰ تن'
                              : `${band.maxTonsPerMonth.toLocaleString('fa-IR')} تن`}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              %{band.discountPercent}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-700">
                            {band.unitRateDiscountTomanPerTonKm > 0
                              ? `-${band.unitRateDiscountTomanPerTonKm.toLocaleString('fa-IR')} تومان`
                              : 'نرخ استاندارد'}
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                              محاسبه خودکار در فاکتور
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Negotiated Base Corridor Overrides */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-600" />
                    <h3 className="text-sm font-bold text-slate-900 font-title">
                      نرخ‌های توافقی ویژه کریدورهای اختصاصی (Negotiated Base Overrides)
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(selectedContract?.negotiatedBaseOverrides || {}).map(([corridor, rate]) => (
                    <div
                      key={corridor}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{corridor}</span>
                        <span className="text-[11px] text-emerald-700 font-bold block mt-0.5">
                          تخفیف ویژه قرارداد کلان
                        </span>
                      </div>
                      <span className="font-mono font-bold text-sm text-slate-900 bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-2xs">
                        {Number(rate).toLocaleString('fa-IR')} تومان
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-400 text-xs">
              یک دفترچه قیمت را از لیست سمت راست انتخاب کنید.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
