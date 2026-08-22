import React, { useState } from 'react';
import {
  LineChart,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Building2,
  DollarSign,
  Truck,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  PieChart,
} from 'lucide-react';
import { usePricing } from '../../../store/PricingContext';
import { AnomalyItem } from '../../../types/pricing';

interface IntelligenceHubViewProps {
  activeSubTab?: string;
  onSubTabChange?: (tab: 'kpis' | 'anomalies' | 'leakage' | 'contracts') => void;
}

export const IntelligenceHubView: React.FC<IntelligenceHubViewProps> = ({
  activeSubTab,
  onSubTabChange,
}) => {
  const { anomalies, resolveAnomaly, contracts } = usePricing();
  const [localActiveTab, setLocalActiveTab] = useState<'kpis' | 'anomalies' | 'leakage' | 'contracts'>('kpis');
  const activeTab = (activeSubTab as any) || localActiveTab;
  const setActiveTab = (tab: 'kpis' | 'anomalies' | 'leakage' | 'contracts') => {
    setLocalActiveTab(tab);
    if (onSubTabChange) onSubTabChange(tab);
  };
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyItem | null>(anomalies[0] || null);

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-bold text-slate-900 text-base font-display">مرکز هوشمندی، پایش و کشف ناهنجاری (Intelligence Hub)</h2>
            <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-lg font-mono text-xs font-bold">
              Pre-Settlement Anomaly & Leakage (BR-044)
            </span>
          </div>
          <p className="text-slate-500 mt-1 text-xs">
            ردگیری انحراف شبیه‌سازی از واقعیت (Simulation Drift)، نشت تخفیفات و هشدار پیش از تسویه مالی بارنامه‌ها
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('kpis')}
          className={`px-4 py-2.5 rounded-xl font-semibold transition-all cursor-pointer text-xs ${
            activeTab === 'kpis' ? 'bg-amber-500 text-white font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          شاخص‌های کلیدی عملکرد (Executive Dashboard)
        </button>
        <button
          onClick={() => setActiveTab('anomalies')}
          className={`px-4 py-2.5 rounded-xl font-semibold transition-all cursor-pointer text-xs ${
            activeTab === 'anomalies' ? 'bg-amber-500 text-white font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          مرکز ناهنجاری‌ها و مغایرت‌ها (Anomaly Center)
        </button>
        <button
          onClick={() => setActiveTab('leakage')}
          className={`px-4 py-2.5 rounded-xl font-semibold transition-all cursor-pointer text-xs ${
            activeTab === 'leakage' ? 'bg-amber-500 text-white font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          تحلیل نشت تخفیف (Discount Leakage)
        </button>
        <button
          onClick={() => setActiveTab('contracts')}
          className={`px-4 py-2.5 rounded-xl font-semibold transition-all cursor-pointer text-xs ${
            activeTab === 'contracts' ? 'bg-amber-500 text-white font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          عملکرد قراردادها و پله‌های تناژ (Contract Performance)
        </button>
      </div>

      {/* Tab 1: Executive Dashboard KPIs */}
      {activeTab === 'kpis' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 font-mono">
            <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs">
              <span className="text-slate-500 font-sans block text-xs font-medium">مجموع ارزش ناخالص بارنامه‌ها (GMV ماهانه)</span>
              <span className="text-xl font-bold text-slate-900 mt-2 block font-display">۴۸۲.۶ میلیارد تومان</span>
              <span className="text-xs text-emerald-700 flex items-center gap-1 mt-2 font-sans font-semibold">
                <TrendingUp className="w-4 h-4" />
                +۱۲.۴٪ نسبت به ماه گذشته
              </span>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs">
              <span className="text-slate-500 font-sans block text-xs font-medium">حاشیه سود محقق‌شده (Realized Margin)</span>
              <span className="text-xl font-bold text-sky-800 mt-2 block font-display">۱۸.۲٪</span>
              <span className="text-xs text-slate-500 mt-2 block font-sans">
                بالاتر از گاردریل کف ۱۵.۰٪
              </span>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs">
              <span className="text-slate-500 font-sans block text-xs font-medium">انحراف شبیه‌سازی از واقعیت (Drift)</span>
              <span className="text-xl font-bold text-emerald-700 mt-2 block font-display">۰.۴٪ ±</span>
              <span className="text-xs text-emerald-700 mt-2 block font-sans font-medium">
                دقت فوق‌العاده ۹۹.۶ درصدی مدل
              </span>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs">
              <span className="text-slate-500 font-sans block text-xs font-medium">ناوگان تحت پوشش روزانه</span>
              <span className="text-xl font-bold text-amber-900 mt-2 block font-display">۱,۴۲۰ دستگاه</span>
              <span className="text-xs text-slate-500 mt-2 block font-sans">
                کفی، یخچال‌دار، چادری
              </span>
            </div>
          </div>

          {/* Simulation vs Actuals Drift Graph Simulation */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base font-display">پایش انحراف درآمد شبیه‌سازی‌شده در برابر واقعیت مالی (Sim vs Actuals Drift):</h3>
                <p className="text-slate-500 text-xs mt-1">کریدورهای اصلی حمل جاده‌ای کشور طی ۳۰ روز گذشته</p>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full font-bold">
                انحراف در محدوده سبز (&lt; ۲٪)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-mono">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-slate-800 font-sans font-bold block text-sm">کریدور تهران ➔ بندرعباس</span>
                <div className="flex justify-between mt-3 text-xs">
                  <span className="text-slate-500 font-sans">پیش‌بینی شبیه‌ساز:</span>
                  <span className="text-amber-900 font-bold">۳۸.۵ م تومان</span>
                </div>
                <div className="flex justify-between mt-1 text-xs">
                  <span className="text-slate-500 font-sans">تحقق واقعی:</span>
                  <span className="text-emerald-700 font-bold">۳۸.۴ م تومان</span>
                </div>
                <div className="text-xs text-slate-500 mt-2 font-sans border-t border-slate-200/60 pt-1.5">انحراف ناچیز: -۰.۲٪</div>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-slate-800 font-sans font-bold block text-sm">کریدور اصفهان ➔ بوشهر</span>
                <div className="flex justify-between mt-3 text-xs">
                  <span className="text-slate-500 font-sans">پیش‌بینی شبیه‌ساز:</span>
                  <span className="text-amber-900 font-bold">۲۹.۰ م تومان</span>
                </div>
                <div className="flex justify-between mt-1 text-xs">
                  <span className="text-slate-500 font-sans">تحقق واقعی:</span>
                  <span className="text-emerald-700 font-bold">۲۹.۱ م تومان</span>
                </div>
                <div className="text-xs text-slate-500 mt-2 font-sans border-t border-slate-200/60 pt-1.5">انحراف ناچیز: +۰.۳٪</div>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-slate-800 font-sans font-bold block text-sm">کریدور مشهد ➔ بازرگان</span>
                <div className="flex justify-between mt-3 text-xs">
                  <span className="text-slate-500 font-sans">پیش‌بینی شبیه‌ساز:</span>
                  <span className="text-amber-900 font-bold">۵۴.۰ م تومان</span>
                </div>
                <div className="flex justify-between mt-1 text-xs">
                  <span className="text-slate-500 font-sans">تحقق واقعی:</span>
                  <span className="text-emerald-700 font-bold">۵۳.۸ م تومان</span>
                </div>
                <div className="text-xs text-slate-500 mt-2 font-sans border-t border-slate-200/60 pt-1.5">انحراف ناچیز: -۰.۳٪</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Anomaly Center (BR-044) */}
      {activeTab === 'anomalies' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Anomalies List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base font-display flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                ناهنجاری‌های مالی کشف‌شده پیش از تسویه بارنامه (Pre-Settlement):
              </h3>
              <span className="text-xs bg-amber-50 text-amber-900 px-3 py-1 rounded-full font-mono font-bold border border-amber-200">
                {anomalies.filter((a) => a.status === 'open').length} مورد باز
              </span>
            </div>

            <div className="space-y-3">
              {anomalies.map((anom) => {
                const isSelected = selectedAnomaly?.anomalyId === anom.anomalyId;
                const isHigh = anom.severity === 'high' || anom.severity === 'critical';

                return (
                  <div
                    key={anom.anomalyId}
                    onClick={() => setSelectedAnomaly(anom)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-xs ${
                      isSelected
                        ? 'bg-amber-50/50 border-amber-500 ring-2 ring-amber-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-semibold">
                          {anom.displayId}
                        </span>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                            isHigh
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          شدت: {anom.severity}
                        </span>
                        <span className="text-slate-600 text-xs font-medium">{anom.corridor}</span>
                      </div>
                      <span
                        className={`text-xs font-bold ${
                          anom.status === 'resolved' ? 'text-emerald-700' : 'text-amber-800'
                        }`}
                      >
                        {anom.status === 'resolved' ? 'رفع‌شده' : 'در انتظار بررسی'}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm mb-1 font-display">{anom.titleFa}</h4>
                    <p className="text-slate-600 text-xs leading-relaxed">{anom.descriptionFa}</p>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 mt-3 font-mono">
                      <span>اثر مالی زیان: <strong className="text-slate-800 font-semibold">{anom.impactToman.toLocaleString('fa-IR')} تومان</strong></span>
                      <span>ردگیری: {anom.traceRef}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Anomaly Inspector & Remediation */}
          {selectedAnomaly && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="font-bold text-slate-900 text-sm font-display flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    تحلیل ریشه‌ای ناهنجاری (Root Cause)
                  </span>
                  <span className="font-mono text-slate-500 text-xs font-semibold">{selectedAnomaly.displayId}</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">کریدور مربوطه:</span>
                    <span className="font-bold text-slate-900">{selectedAnomaly.corridor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">نوع ناوگان:</span>
                    <span className="font-bold text-slate-900">{selectedAnomaly.vehicleType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">میزان زیان شناسایی‌شده:</span>
                    <span className="font-mono font-bold text-rose-700">
                      {selectedAnomaly.impactToman.toLocaleString('fa-IR')} تومان
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-1.5 shadow-xs">
                  <span className="font-bold text-amber-950 block text-xs font-display">پیشنهاد اصلاحی سیستم:</span>
                  <p className="text-slate-700 text-xs leading-relaxed">
                    افزایش ضریب کرایه در این مسیر به مقدار +۸٪ یا فعال‌سازی اضافه کرایه گردنه کوهستانی زاگرس.
                  </p>
                </div>
              </div>

              {selectedAnomaly.status === 'open' && (
                <button
                  type="button"
                  onClick={() => {
                    resolveAnomaly(selectedAnomaly.anomalyId);
                    setSelectedAnomaly({ ...selectedAnomaly, status: 'resolved' });
                  }}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer text-xs shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  تایید بررسی و اعمال اصلاحیه در تعرفه
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Discount Leakage */}
      {activeTab === 'leakage' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base font-display">تحلیل نشت تخفیفات بر اساس حساب‌های سازمانی (Discount Leakage):</h3>
              <p className="text-slate-500 text-xs mt-1">مغایرت حجم تعهد شده در قرارداد با تخفیفات اعطا شده</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 text-xs font-bold">
                  <th className="p-4">صاحب‌کالا / مشتری</th>
                  <th className="p-4">حجم تعهد ماهانه</th>
                  <th className="p-4">حجم تحقق‌یافته واقعی</th>
                  <th className="p-4">تخفیف اعطایی</th>
                  <th className="p-4">وضعیت انطباق (Compliance)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-xs">
                <tr className="hover:bg-slate-50/80">
                  <td className="p-4 font-sans font-bold text-slate-900">پتروشیمی خلیج فارس (PGPC)</td>
                  <td className="p-4 text-slate-700">۲۵,۰۰۰ تن</td>
                  <td className="p-4 text-emerald-700 font-bold">۲۶,۴۰۰ تن</td>
                  <td className="p-4 text-sky-800 font-bold">۱۴.۰٪</td>
                  <td className="p-4 font-sans text-emerald-700 font-semibold">منطبق بر قرارداد (Compliant)</td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="p-4 font-sans font-bold text-slate-900">صنایع غذایی و لبنی میهن</td>
                  <td className="p-4 text-slate-700">۸,۰۰۰ تن</td>
                  <td className="p-4 text-amber-800 font-bold">۶,۸۰۰ تن</td>
                  <td className="p-4 text-sky-800 font-bold">۱۰.۰٪</td>
                  <td className="p-4 font-sans text-amber-800 font-semibold">کسری تناژ - نیازمند تعدیل تخفیف پله بعدی</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Contract Performance */}
      {activeTab === 'contracts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contracts.map((cnt) => (
            <div
              key={cnt.contractId}
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-bold text-slate-900 text-base font-display">{cnt.customerNameFa}</span>
                <span className="font-mono font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200 text-xs">{cnt.displayId}</span>
              </div>
              <p className="text-slate-600 text-xs font-medium">صنعت: {cnt.industry}</p>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-mono space-y-2 shadow-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">تخفیف پله فعلی:</span>
                  <span className="text-sky-800 font-bold">۱۰.۰٪</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">تعداد مسیرهای توافقی:</span>
                  <span className="text-slate-800 font-medium">
                    {Object.keys(cnt.negotiatedBaseOverrides).length} کریدور
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
