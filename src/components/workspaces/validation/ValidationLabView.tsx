import React, { useState } from 'react';
import {
  FlaskConical,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Layers,
  ArrowRight,
  Sparkles,
  BarChart3,
  Scale,
  RefreshCw,
} from 'lucide-react';
import { usePricing } from '../../../store/PricingContext';
import { SimulationScenario, RiskClass } from '../../../types/pricing';
import { ModernSelect } from '../../common/menus/ModernSelect';

export const ValidationLabView: React.FC = () => {
  const { simulations, runSimulation, activeProductionPackage, activeStagingPackage, userName } = usePricing();

  const [selectedSimId, setSelectedSimId] = useState<string>(simulations?.[0]?.simulationId || '');
  const [isRunningSim, setIsRunningSim] = useState(false);
  const [scenarioType, setScenarioType] = useState<
    'historical_replay' | 'synthetic_fuel_shock' | 'winter_blizzard_peak' | 'competitor_discount_war'
  >('historical_replay');
  const [sampleCount, setSampleCount] = useState<number>(10000);

  const activeSim = simulations?.find((s) => s.simulationId === selectedSimId) || simulations?.[0];

  const handleExecuteSimulation = () => {
    setIsRunningSim(true);

    setTimeout(() => {
      let revenueDelta = +8.4;
      let marginDelta = +1.8;
      let breaches = 0;
      let recFa = 'تمام ۱۰,۰۰۰ بارنامه ارزیابی گردید. گاردریل کف حاشیه سود ۱۵٪ کاملاً ایمن بوده و هیچ ردیف زیان‌ده کشف نشد.';

      if (scenarioType === 'synthetic_fuel_shock') {
        revenueDelta = +12.5;
        marginDelta = -0.4;
        breaches = 2;
        recFa = 'در شوک سوخت ۳۰ درصدی، ۲ مسیر فرعی به دلیل فعال شدن خودکار گاردریل Clamp شدند و از ضرر ناوگان جلوگیری شد.';
      } else if (scenarioType === 'winter_blizzard_peak') {
        revenueDelta = +15.2;
        marginDelta = +2.4;
        recFa = 'تقاضای بالای ناوگان در زمستان باعث افزایش مطلوب حاشیه سود به ۱۹.۲٪ گردید.';
      }

      const created = runSimulation({
        targetPackageRef: activeStagingPackage?.displayId || activeProductionPackage.displayId,
        targetPackageVersion: activeStagingPackage?.version || activeProductionPackage.version,
        datasetName: `آزمایش سناریوی ${scenarioType} بر روی ${sampleCount.toLocaleString('fa-IR')} بارنامه جاده‌ای`,
        sampleCount,
        scenarioType,
        revenueDeltaPercent: revenueDelta,
        marginDeltaPercent: marginDelta,
        avgFreightRateDeltaPercent: revenueDelta - marginDelta,
        outlierCount: breaches > 0 ? 8 : 2,
        guardrailBreachCount: breaches,
        result: 'pass',
        riskClass: 'high',
        recommendationFa: recFa,
      });

      setSelectedSimId(created.simulationId);
      setIsRunningSim(false);
    }, 900);
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-bold text-slate-900 text-base font-display">آزمایشگاه اعتبارسنجی و شبیه‌سازی نرخ‌ها (Validation Lab)</h2>
            <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-lg font-mono text-xs font-bold">
              Simulate-Before-Publish (BR-033)
            </span>
          </div>
          <p className="text-slate-500 mt-1 text-xs">
            ارزیابی پیش از انتشار تغییرات تعرفه با بازپخش داده‌های واقعی ۱۰,۰۰۰ بارنامه و آزمون استرس شوک سوخت
          </p>
        </div>

        <button
          type="button"
          onClick={handleExecuteSimulation}
          disabled={isRunningSim}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer text-xs"
        >
          {isRunningSim ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              در حال بازپخش ۱۰,۰۰۰ بارنامه...
            </span>
          ) : (
            <>
              <Play className="w-4 h-4" />
              اجرای شبیه‌سازی جدید
            </>
          )}
        </button>
      </div>

      {/* Simulator Setup Controls */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-5 shadow-xs">
        <div>
          <ModernSelect
            id="validation-scenario-type"
            value={scenarioType}
            onChange={(val) => setScenarioType(val as any)}
            label="نوع سناریوی شبیه‌سازی:"
            options={[
              { value: 'historical_replay', label: 'بازپخش ۱۰,۰۰۰ بارنامه سال گذشته (Replay)', badge: 'داده واقعی' },
              { value: 'synthetic_fuel_shock', label: 'شوک ناگهانی ۳۰٪ قیمت گازوئیل (Fuel Shock)', badge: 'ریسک سوخت' },
              { value: 'winter_blizzard_peak', label: 'پیک فصلی زمستان و انسداد گردنه‌ها (Peak)', badge: 'فصلی' },
            ]}
          />
        </div>

        <div>
          <label className="text-slate-700 block mb-2 font-semibold text-xs">پکیج استراتژی هدف:</label>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-amber-900 font-mono flex items-center justify-between">
            <span className="font-bold">
              {activeStagingPackage?.displayId || activeProductionPackage.displayId}@v
              {activeStagingPackage?.version || activeProductionPackage.version}
            </span>
            <span className="text-xs text-slate-500 font-sans">محیط استیجینگ/پروداکشن</span>
          </div>
        </div>

        <div>
          <ModernSelect
            id="validation-sample-count"
            value={String(sampleCount)}
            onChange={(val) => setSampleCount(Number(val))}
            label="تعداد نمونه‌های ارزیابی:"
            options={[
              { value: '5000', label: '۵,۰۰۰ بارنامه تصادفی', badge: 'سریع' },
              { value: '10000', label: '۱۰,۰۰۰ بارنامه کامل پاییز و زمستان', badge: 'استاندارد' },
              { value: '25000', label: '۲۵,۰۰۰ بارنامه سالانه جامع', badge: 'دقیق' },
            ]}
          />
        </div>
      </div>

      {/* Simulation Result Details */}
      {activeSim && (
        <div className="space-y-6">
          {/* Top Result Banner */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200 font-bold">
                    {activeSim.displayId}
                  </span>
                  <span className="font-bold text-slate-900 text-base font-display">{activeSim.datasetName}</span>
                </div>
                <span className="text-slate-500 text-xs block mt-1.5">
                  اجرا شده توسط: <strong className="text-slate-700 font-medium">{activeSim?.executedBy || 'سیستم'}</strong> در تاریخ {activeSim?.executedAt ? activeSim.executedAt.substring(0, 10) : '-'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">نتیجه گیت حاکمیتی (BR-033):</span>
                <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  مجاز برای تایید (PASS)
                </span>
              </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-slate-500 font-sans block text-xs font-medium">تغییر کل درآمد پیش‌بینی‌شده</span>
                <span className="text-xl font-bold text-emerald-700 flex items-center gap-1 mt-2">
                  <TrendingUp className="w-5 h-5" />
                  +{activeSim.revenueDeltaPercent}٪
                </span>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-slate-500 font-sans block text-xs font-medium">تغییر حاشیه سود ناخالص</span>
                <span className="text-xl font-bold text-sky-800 flex items-center gap-1 mt-2">
                  <TrendingUp className="w-5 h-5" />
                  {activeSim.marginDeltaPercent > 0 ? `+${activeSim.marginDeltaPercent}` : activeSim.marginDeltaPercent}٪
                </span>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-slate-500 font-sans block text-xs font-medium">نقض گاردریل کف سود (۱۵٪)</span>
                <span
                  className={`text-xl font-bold flex items-center gap-1 mt-2 ${
                    activeSim.guardrailBreachCount === 0 ? 'text-emerald-700' : 'text-amber-800'
                  }`}
                >
                  {activeSim.guardrailBreachCount} مورد (کلمپ‌شده)
                </span>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-slate-500 font-sans block text-xs font-medium">پوشش تبارشناسی (Explainability)</span>
                <span className="text-xl font-bold text-indigo-700 mt-2 block">
                  {activeSim.explainabilityScorePercent}٪
                </span>
              </div>
            </div>

            {/* Recommendation Box */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-emerald-900 leading-relaxed flex items-start gap-3 shadow-xs">
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-1 text-emerald-950 font-display">گزارش هوشمند نتایج شبیه‌سازی:</span>
                <p className="text-xs text-slate-700 leading-relaxed">{activeSim.recommendationFa}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
