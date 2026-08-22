import React, { useState } from 'react';
import {
  Layers,
  RotateCcw,
  Rocket,
  CheckCircle2,
  Clock,
  AlertOctagon,
  History,
  Tag,
  Shield,
  FileCode,
  Sparkles,
  ArrowRight,
  Download,
} from 'lucide-react';
import { usePricing } from '../../../store/PricingContext';
import { StrategyPackage } from '../../../types/pricing';

export const StrategyPackagesDeploymentView: React.FC = () => {
  const { strategyPackages, rollbackPackage, deployPackage, triggerStepUpMFA } = usePricing();
  const [packagesList, setPackagesList] = useState<StrategyPackage[]>(strategyPackages || []);
  const [selectedPackage, setSelectedPackage] = useState<StrategyPackage | null>(
    strategyPackages?.find((p) => p.status === 'live') || strategyPackages?.[0] || null
  );
  const [isRollbacking, setIsRollbacking] = useState(false);
  const [canaryPercentage, setCanaryPercentage] = useState<number>(20);

  const handleRollback = (pkgId: string) => {
    triggerStepUpMFA('عملیات بازگشت اضطراری به نسخه پایدار قبلی (Emergency Rollback)', () => {
      setIsRollbacking(true);
      setTimeout(() => {
        rollbackPackage(pkgId);
        setIsRollbacking(false);
        alert('نسخه فعال با موفقیت به نسخه پایدار بازگردانده شد.');
      }, 1000);
    });
  };

  const handleDeployCanary = (pkgId: string) => {
    deployPackage(pkgId, 'canary');
    alert(`بسته ${pkgId} با موفقیت به صورت آزمایشی روی ${canaryPercentage}٪ درخواست‌ها منتشر شد.`);
  };

  const handleDeployProduction = (pkgId: string) => {
    triggerStepUpMFA('انتشار نهایی سراسری در محیط عملیاتی (Production Deployment)', () => {
      deployPackage(pkgId, 'live');
      alert(`بسته ${pkgId} با موفقیت به عنوان نسخه اصلی و ۱۰۰٪ فعال در پروداکشن قرار گرفت.`);
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 font-title">
                  ۴.۲ مدیریت بسته‌های استراتژی و انتشار (Strategy Packages & Deployment)
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  نسخه جاری: v2.4.0
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                بسته‌بندی یکپارچه قوانین، ماتریس‌ها و تخفیفات، انتشار تدریجی (Canary Rollout) و بازگشت سریع به نسخه قبلی (Rollback)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Packages Version History (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono px-2">
              تاریخچه بسته‌های استراتژی تعرفه
            </h2>

            <div className="space-y-2">
              {strategyPackages.map((pkg) => {
                const pkgKey = pkg.packageId || pkg.id || `pkg-${pkg.version}`;
                const isSelected = (selectedPackage?.packageId || selectedPackage?.id) === pkgKey;
                const pTitleFa = pkg.nameFa || pkg.titleFa || 'بسته استراتژی تعرفه';
                const pChangelog = pkg.changelogFa || pkg.changeSummaryFa || 'بروزرسانی استراتژی و ضرایب';
                const pAuthor = pkg.releasedBy || pkg.authorName || 'معاونت قیمت‌گذاری';
                const isLive = pkg.status === 'live' || pkg.status === 'Active';
                const isCanary = pkg.status === 'canary' || (pkg.environment === 'staging' && pkg.status === 'In Review');
                const isApproved = pkg.status === 'approved' || pkg.status === 'Approved';

                return (
                  <div
                    key={pkgKey}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-800">
                            v{pkg.version}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isLive
                                ? 'bg-emerald-100 text-emerald-800'
                                : isCanary
                                ? 'bg-cyan-100 text-cyan-800'
                                : isApproved
                                ? 'bg-blue-100 text-blue-800'
                                : pkg.status === 'deprecated'
                                ? 'bg-slate-100 text-slate-500'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {isLive
                              ? 'زنده در پروداکشن (۱۰۰٪)'
                              : isCanary
                              ? 'انتشار تدریجی آزمایشی'
                              : isApproved
                              ? 'آماده انتشار'
                              : pkg.status === 'deprecated'
                              ? 'منسوخ شده'
                              : 'پیش‌نویس'}
                          </span>
                        </div>
                        <h3 className="text-xs font-bold text-slate-900 mt-2">{pTitleFa}</h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">{pChangelog}</p>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>منتشرکننده: {pAuthor}</span>
                      <span className="font-mono">{pkg.effectiveFrom?.split('T')[0] || '-'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Selected Package Details & Deployment Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {selectedPackage && (
            <>
              {/* Actions & Status Header Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded">
                        v{selectedPackage.version}
                      </span>
                      <h2 className="text-base font-bold text-slate-900 font-title">
                        {selectedPackage.nameFa || selectedPackage.titleFa || 'بسته تعرفه'}
                      </h2>
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedPackage.nameEn || selectedPackage.titleEn}</p>
                  </div>

                  {/* Deployment Trigger Buttons */}
                  <div className="flex items-center gap-2">
                    {selectedPackage.status === 'live' || selectedPackage.status === 'Active' ? (
                      <button
                        onClick={() => handleRollback(selectedPackage.packageId || selectedPackage.id)}
                        disabled={isRollbacking}
                        className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <AlertOctagon className="w-4 h-4" />
                        بازگشت اضطراری (Rollback)
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleDeployCanary(selectedPackage.packageId || selectedPackage.id)}
                          className="px-3.5 py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                        >
                          <Rocket className="w-3.5 h-3.5" />
                          انتشار تدریجی ({canaryPercentage}٪)
                        </button>
                        <button
                          onClick={() => handleDeployProduction(selectedPackage.packageId || selectedPackage.id)}
                          className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          انتشار ۱۰۰٪ در پروداکشن
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Package Changelog & Specs */}
                <div className="space-y-3 text-xs">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-bold">خلاصه تغییرات (Changelog):</span>
                    <p className="text-slate-800 mt-1 leading-relaxed font-medium">
                      {selectedPackage.changelogFa || selectedPackage.changeSummaryFa || 'بدون توضیحات تکمیلی'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400">شناسه بسته سیستمی:</span>
                      <span className="font-mono font-bold text-slate-800 block">{selectedPackage.packageId || selectedPackage.id}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400">تاریخ فعال‌سازی:</span>
                      <span className="font-mono font-bold text-slate-800 block">
                        {selectedPackage.effectiveFrom || 'تعریف نشده'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Canary Traffic Allocation Settings */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-cyan-600" />
                    <h3 className="text-sm font-bold text-slate-900 font-title">
                      تنظیمات تخصیص ترافیک آزمایشی (Canary Traffic Distribution)
                    </h3>
                  </div>
                  <span className="font-mono font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded text-xs">
                    %{canaryPercentage} ترافیک فعال
                  </span>
                </div>

                <div className="space-y-2">
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={canaryPercentage}
                    onChange={(e) => setCanaryPercentage(Number(e.target.value))}
                    className="w-full accent-cyan-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>5% ترافیک آزمایشی (کمترین ریسک)</span>
                    <span>20% (پیشنهادی)</span>
                    <span>50% (نصف ترافیک سازمان)</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  در حالت Canary، تنها بخش مشخصی از استعلام‌های وب‌سرویس و پنل صاحبان بار به نسخه آزمایشی هدایت شده و در صورت عدم بروز خطا، به صورت خودکار به ۱۰۰٪ افزایش می‌یابد.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
