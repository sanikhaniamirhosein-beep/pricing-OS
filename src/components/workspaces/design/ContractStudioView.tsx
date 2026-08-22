import React, { useState } from 'react';
import {
  FileText,
  Building2,
  TrendingDown,
  Calculator,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  Percent,
  Sliders,
  DollarSign,
} from 'lucide-react';
import { usePricing } from '../../../store/PricingContext';
import { LogisticsContract } from '../../../types/pricing';

export const ContractStudioView: React.FC = () => {
  const { contracts, routeMatrix } = usePricing();
  const [selectedContractId, setSelectedContractId] = useState<string>(contracts[0]?.contractId || '');

  // What-If Negotiation Simulator State (BR-023)
  const [targetCompetitorRate, setTargetCompetitorRate] = useState<number>(33000000); // 33M vs standard 38.5M
  const [selectedRoute, setSelectedRoute] = useState('تهران-بندرعباس:تریلی چادری');
  const [currentMonthlyVolumeTons, setCurrentMonthlyVolumeTons] = useState(5000);

  const activeContract = contracts.find((c) => c.contractId === selectedContractId) || contracts[0];

  // Standard rate for corridor
  const standardRateToman = 38500000;
  const estimatedCostBasisToman = 29260000; // 76% cost basis
  const minRequiredMarginPercent = 15.0; // 15% floor

  // Minimum Viable Price (MVP) calculation based on 15% margin floor
  const minimumViablePriceToman = Math.round(estimatedCostBasisToman / (1 - minRequiredMarginPercent / 100));

  // Required volume increase to maintain same total margin dollars if rate drops to competitor target
  const standardMarginDollars = standardRateToman - estimatedCostBasisToman; // 9.24M
  const targetMarginDollars = targetCompetitorRate - estimatedCostBasisToman; // 3.74M
  const isTargetBelowMvp = targetCompetitorRate < minimumViablePriceToman;

  const requiredVolumeTons =
    targetMarginDollars > 0 ? Math.round((currentMonthlyVolumeTons * standardMarginDollars) / targetMarginDollars) : 0;
  const volumeGrowthRequiredPercent =
    targetMarginDollars > 0
      ? (((requiredVolumeTons - currentMonthlyVolumeTons) / currentMonthlyVolumeTons) * 100).toFixed(0)
      : 'ناممکن';

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-bold text-slate-900 text-base font-display">استودیو قراردادها و شبیه‌ساز مذاکره سازمانی</h2>
            <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-lg font-mono text-xs font-bold">
              Contract Studio & What-If MVP
            </span>
          </div>
          <p className="text-slate-500 mt-1 text-xs">
            دفترچه نرخ‌های توافقی (Price Book)، پله‌های حجم ماهانه و شبیه‌ساز کف نرخ قابل مذاکره (BR-023)
          </p>
        </div>

        {/* Contract Selector */}
        <div className="flex items-center gap-3">
          <Building2 className="w-5 h-5 text-amber-600" />
          <select
            value={selectedContractId}
            onChange={(e) => setSelectedContractId(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-xs font-medium focus:bg-white focus:border-amber-500 focus:outline-none"
          >
            {contracts.map((cnt) => (
              <option key={cnt.contractId} value={cnt.contractId}>
                {cnt.displayId} - {cnt.customerNameFa} ({cnt.tier})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Contract Details & Volume Bands */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="font-bold text-slate-900 text-base font-display">{activeContract.customerNameFa}</h3>
                  <span className="text-xs font-mono bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200 font-bold">
                    {activeContract.customerCode}
                  </span>
                  <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold">
                    رده مشتری: {activeContract.tier}
                  </span>
                </div>
                <span className="text-slate-500 text-xs block mt-1.5">
                  حوزه صنعت: <strong className="text-slate-700 font-medium">{activeContract.industry}</strong> | اعتبار تا:{' '}
                  <strong className="text-slate-700 font-medium">{activeContract.effectiveTo.substring(0, 10)}</strong>
                </span>
              </div>
            </div>

            {/* Volume Tiers Table (BR-026: contiguous, non-overlapping) */}
            <div className="space-y-3">
              <span className="font-bold text-slate-900 text-sm block flex items-center gap-2 font-display">
                <Layers className="w-4 h-4 text-amber-600" />
                جدول تخفیف پله‌ای حجم تناژ ماهانه (Volume Bands - BR-026):
              </span>
              <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <table className="w-full text-right">
                  <thead>
                    <tr className="bg-slate-100/80 text-slate-700 border-b border-slate-200 text-xs font-bold">
                      <th className="p-3.5">بازه تناژ بارگیری در ماه</th>
                      <th className="p-3.5">درصد تخفیف کل کرایه</th>
                      <th className="p-3.5">تخفیف به ازای تن/کیلومتر</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono text-xs">
                    {activeContract.volumeBands.map((band, idx) => (
                      <tr key={idx} className="hover:bg-slate-100/60">
                        <td className="p-3.5 text-slate-800">
                          {band.minTonsPerMonth.toLocaleString('fa-IR')} الی{' '}
                          {band.maxTonsPerMonth > 100000 ? 'نامحدود' : band.maxTonsPerMonth.toLocaleString('fa-IR')}{' '}
                          تن
                        </td>
                        <td className="p-3.5 text-sky-700 font-bold bg-sky-50 px-2.5 py-0.5 rounded">{band.discountPercent}٪</td>
                        <td className="p-3.5 text-slate-600">
                          {band.unitRateDiscountTomanPerTonKm.toLocaleString('fa-IR')} تومان
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Negotiated Route Overrides */}
            <div className="space-y-3">
              <span className="font-bold text-slate-900 text-sm block font-display">
                نرخ‌های پایه توافقی ثبت‌شده در قرارداد (Price Book Overrides):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(activeContract.negotiatedBaseOverrides).map(([route, rate]) => (
                  <div
                    key={route}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between shadow-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block text-xs">{route.split(':')[0]}</span>
                      <span className="text-slate-500 text-xs">{route.split(':')[1]}</span>
                    </div>
                    <span className="font-mono font-bold text-amber-700 text-xs bg-amber-50 px-2 py-1 rounded border border-amber-200">
                      {(Number(rate) / 1000000).toLocaleString('fa-IR')} م تومان
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: What-If Negotiation Simulator (BR-023) */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm font-display">شبیه‌ساز مذاکره و کف نرخ (What-If Simulator)</h3>
                <p className="text-xs text-slate-500 mt-0.5">محاسبه Minimum Viable Price بر اساس کشش تقاضا (BR-023)</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-slate-700 font-medium block mb-1.5 text-xs">کریدور هدف مذاکره:</label>
                <select
                  value={selectedRoute}
                  onChange={(e) => setSelectedRoute(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs focus:bg-white focus:outline-none focus:border-amber-500"
                >
                  <option value="تهران-بندرعباس:تریلی چادری">تهران به بندرعباس (تریلی چادری ۲۴ تن)</option>
                  <option value="اصفهان-بوشهر:تریلر کفی">اصفهان به بوشهر (تریلر کفی ۲۵ تن)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 font-medium mb-1.5 text-xs">
                  <span>نرخ پیشنهادی رقیب / هدف مشتری:</span>
                  <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {(targetCompetitorRate / 1000000).toFixed(1)} م تومان
                  </span>
                </div>
                <input
                  type="range"
                  min="28000000"
                  max="42000000"
                  step="500000"
                  value={targetCompetitorRate}
                  onChange={(e) => setTargetCompetitorRate(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-slate-700 font-medium block mb-1.5 text-xs">حجم ماهانه فعلی مشتری (تن):</label>
                <input
                  type="number"
                  value={currentMonthlyVolumeTons}
                  onChange={(e) => setCurrentMonthlyVolumeTons(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-mono text-xs focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Simulation Findings Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 text-xs">
                <span className="text-slate-600">کف نرخ مجاز شرکت (MVP):</span>
                <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {(minimumViablePriceToman / 1000000).toLocaleString('fa-IR')} م تومان
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">حاشیه سود با نرخ هدف:</span>
                <span
                  className={`font-mono font-bold px-2 py-0.5 rounded ${
                    isTargetBelowMvp ? 'text-rose-700 bg-rose-50 border border-rose-200' : 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                  }`}
                >
                  {targetMarginDollars > 0
                    ? (((targetMarginDollars / targetCompetitorRate) * 100).toFixed(1))
                    : 'زیان‌ده'}
                  ٪
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">حجم تعهد موردنیاز برای حفظ سود:</span>
                <span className="font-mono font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  {requiredVolumeTons.toLocaleString('fa-IR')} تن ({volumeGrowthRequiredPercent}٪+)
                </span>
              </div>

              {isTargetBelowMvp && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs leading-relaxed flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <span>
                    هشدار گاردریل: نرخ پیشنهادی زیر کف حاشیه سود ۱۵٪ است. تایید این تخفیف نیازمند موافقت کتبی معاونت مالی و کنترل حاکمیت است.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
