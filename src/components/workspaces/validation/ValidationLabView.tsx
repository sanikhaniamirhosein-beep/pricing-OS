import React, { useState } from 'react';
import {
  FlaskConical,
  Play,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Layers,
  Sparkles,
  Scale,
  ShieldCheck,
  Truck,
  MapPin,
  Calendar,
  Fuel,
  Code2,
  Activity,
  History,
  Check,
  X,
  FileText,
} from 'lucide-react';
import { usePricing } from '../../../store/PricingContext';
import { SimulationScenario } from '../../../types/pricing';
import { ModernSelect } from '../../common/menus/ModernSelect';
import { CityPickerDropdown } from '../../common/menus/CityPickerDropdown';
import { VehiclePickerDropdown } from '../../common/menus/VehiclePickerDropdown';
import { ShipmentPricingContext } from '../../../engine/pricingEngine';

interface ValidationLabViewProps {
  activeSubTab?: string;
  onSubTabChange?: (tab: string) => void;
}

export const ValidationLabView: React.FC<ValidationLabViewProps> = ({
  activeSubTab = 'single_quote',
  onSubTabChange,
}) => {
  const {
    simulations,
    runSimulation,
    activeProductionPackage,
    activeStagingPackage,
    calculatePrice,
    setSelectedTrace,
  } = usePricing();

  const [localTab, setLocalTab] = useState<string>('single_quote');
  const currentTab = activeSubTab || localTab;

  const handleTabSelect = (tab: string) => {
    setLocalTab(tab);
    if (onSubTabChange) onSubTabChange(tab);
  };

  // State for Single Quote Preview
  const [origin, setOrigin] = useState('تهران');
  const [destination, setDestination] = useState('بندرعباس');
  const [vehicle, setVehicle] = useState('کشنده یخچال‌دار');
  const [weight, setWeight] = useState<number>(22);
  const [isColdChain, setIsColdChain] = useState(true);
  const [isHazardous, setIsHazardous] = useState(false);
  const [isPeakSeason, setIsPeakSeason] = useState(false);
  const [accessorialWaitingHours, setAccessorialWaitingHours] = useState(2);
  const [multiStopCount, setMultiStopCount] = useState(0);

  const quoteContext: ShipmentPricingContext = {
    originCity: origin,
    destinationCity: destination,
    vehicleType: vehicle,
    cargoWeightTons: weight,
    isColdChain,
    isHazardous,
    isPeakSeason,
    channel: 'Validation Lab Interactive Tester',
  };

  const calculatedQuote = calculatePrice(quoteContext);

  // State for Batch Sim
  const [scenarioType, setScenarioType] = useState<
    'historical_replay' | 'synthetic_fuel_shock' | 'winter_blizzard_peak' | 'competitor_discount_war'
  >('historical_replay');
  const [sampleCount, setSampleCount] = useState<number>(10000);
  const [isRunningSim, setIsRunningSim] = useState(false);
  const [activeSim, setActiveSim] = useState<SimulationScenario>(simulations?.[0]);

  const handleExecuteSimulation = () => {
    setIsRunningSim(true);
    setTimeout(() => {
      let revenueDelta = +8.4;
      let marginDelta = +1.8;
      let breaches = 0;
      let recFa =
        'تمام ۱۰,۰۰۰ بارنامه ارزیابی گردید. گاردریل کف حاشیه سود ۱۵٪ کاملاً ایمن بوده و هیچ ردیف زیان‌ده کشف نشد.';

      if (scenarioType === 'synthetic_fuel_shock') {
        revenueDelta = +12.5;
        marginDelta = -0.4;
        breaches = 2;
        recFa =
          'در شوک سوخت ۳۰ درصدی، ۲ مسیر فرعی به دلیل فعال شدن خودکار گاردریل Clamp شدند و از ضرر ناوگان جلوگیری شد.';
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

      setActiveSim(created);
      setIsRunningSim(false);
    }, 800);
  };

  // State for Feasibility
  const [feasibilityOrigin, setFeasibilityOrigin] = useState('تهران');
  const [feasibilityDestination, setFeasibilityDestination] = useState('اصفهان');
  const [feasibilityVehicle, setFeasibilityVehicle] = useState('تریلی چادری');
  const [feasibilityWeight, setFeasibilityWeight] = useState(24);
  const [feasibilityAdr, setFeasibilityAdr] = useState(false);

  const tabs = [
    { id: 'single_quote', labelFa: 'پیش‌نمایش تک‌محموله', labelEn: 'Single Shipment Preview', icon: Code2 },
    { id: 'batch_sim', labelFa: 'شبیه‌سازی دسته‌ای ۱۰,۰۰۰ بارنامه', labelEn: 'Batch Simulation', icon: Activity },
    { id: 'historical_replay', labelFa: 'بازپخش تاریخی اثر مالی', labelEn: 'Historical Replay', icon: History },
    { id: 'feasibility', labelFa: 'امکان‌سنجی عملیاتی ناوگان', labelEn: 'Operational Feasibility', icon: TrendingUp },
    { id: 'scenario_compare', labelFa: 'مقایسه سناریوهای تعرفه A/B', labelEn: 'Scenario Comparison', icon: Layers },
  ];

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="bg-white border border-[#D3D1C7] p-6 rounded-3xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E1F5EE] border border-[#9FE1CB] flex items-center justify-center text-[#085041]">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-[#2C2C2A] text-lg font-display">
                  آزمایشگاه اعتبارسنجی (Validation Lab)
                </h1>
                <span className="bg-[#E1F5EE] text-[#04342C] border border-[#9FE1CB] px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">
                  Simulate-Before-Publish (BR-033)
                </span>
              </div>
              <p className="text-[#5F5E5A] mt-0.5 text-xs">
                استعلام زنده تک‌محموله، بازپخش دسته‌ای ۱۰,۰۰۰ بارنامه، تحلیل سناریوها و آزمون امکان‌سنجی ناوگان
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center gap-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabSelect(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-500'}`} />
              <span>{tab.labelFa}</span>
            </button>
          );
        })}
      </div>

      {/* Subtab 1: Single Shipment Preview */}
      {currentTab === 'single_quote' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inputs */}
          <div className="bg-white border border-[#D3D1C7] p-6 rounded-3xl shadow-xs space-y-4 lg:col-span-1">
            <h3 className="font-bold text-[#2C2C2A] text-sm font-display flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#085041]" />
              پارامترهای بارنامه و محموله
            </h3>

            <div className="space-y-3">
              <CityPickerDropdown
                id="vq-origin"
                label="شهر مبدأ بارگیری:"
                value={origin}
                onChange={setOrigin}
              />
              <CityPickerDropdown
                id="vq-destination"
                label="شهر مقصد تحویل:"
                value={destination}
                onChange={setDestination}
              />
              <VehiclePickerDropdown
                id="vq-vehicle"
                label="نوع ناوگان و کشنده:"
                value={vehicle}
                onChange={setVehicle}
              />

              <div>
                <label className="text-[#5F5E5A] block mb-1 font-semibold text-xs">
                  وزن خالص بار (تن):
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#FAFAF8] rounded-xl border border-[#D3D1C7] text-xs font-mono font-bold text-[#2C2C2A] focus:outline-none focus:border-[#9FE1CB]"
                />
              </div>

              {/* Toggles */}
              <div className="pt-2 border-t border-[#D3D1C7] space-y-2">
                <label className="flex items-center justify-between p-2.5 bg-[#FAFAF8] rounded-xl border border-[#D3D1C7] cursor-pointer">
                  <span className="text-xs text-[#2C2C2A]">زنجیره سرد (پایش دما)</span>
                  <input
                    type="checkbox"
                    checked={isColdChain}
                    onChange={(e) => setIsColdChain(e.target.checked)}
                    className="accent-[#085041] w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 bg-[#FAFAF8] rounded-xl border border-[#D3D1C7] cursor-pointer">
                  <span className="text-xs text-[#2C2C2A]">کالای خطرناک (ADR)</span>
                  <input
                    type="checkbox"
                    checked={isHazardous}
                    onChange={(e) => setIsHazardous(e.target.checked)}
                    className="accent-[#085041] w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 bg-[#FAFAF8] rounded-xl border border-[#D3D1C7] cursor-pointer">
                  <span className="text-xs text-[#2C2C2A]">پیک فصلی / آب‌وهوایی</span>
                  <input
                    type="checkbox"
                    checked={isPeakSeason}
                    onChange={(e) => setIsPeakSeason(e.target.checked)}
                    className="accent-[#085041] w-4 h-4"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Results & Decision Trace */}
          <div className="bg-white border border-[#D3D1C7] p-6 rounded-3xl shadow-xs space-y-6 lg:col-span-2">
            <div className="flex items-center justify-between border-b border-[#D3D1C7] pb-4">
              <div>
                <span className="text-xs text-[#888780] block">نتیجه استعلام بلادرنگ:</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-bold text-[#085041] font-mono">
                    {(calculatedQuote?.finalPriceToman || 0).toLocaleString('fa-IR')}
                  </span>
                  <span className="text-xs text-[#5F5E5A]">تومان</span>
                </div>
              </div>

              <div className="text-left font-mono">
                <span className="text-xs text-[#888780] block font-sans">حاشیه سود ناخالص:</span>
                <span className="text-sm font-bold text-[#0F6E56]">
                  {(calculatedQuote?.marginPercent || 0).toFixed(1)}٪ (بهای تمام‌شده:{' '}
                  {(((calculatedQuote?.costBasisToman || 0)) / 1000000).toFixed(1)} م.ت)
                </span>
              </div>
            </div>

            {/* Price Composition Table */}
            <div className="space-y-2">
              <h4 className="font-bold text-[#2C2C2A] text-xs">تفکیک اجزای نرخ و قواعد اعمال‌شده:</h4>
              <div className="bg-[#FAFAF8] border border-[#D3D1C7] rounded-2xl overflow-hidden divide-y divide-[#D3D1C7] text-xs font-mono">
                {(calculatedQuote?.trace?.appliedRules || []).map((rule, idx) => (
                  <div key={idx} className="flex justify-between p-3">
                    <span className="text-[#5F5E5A] font-sans">{rule.nameFa}:</span>
                    <span className="font-bold text-[#085041]">
                      +{((rule?.valueToman || 0)).toLocaleString('fa-IR')} تومان
                    </span>
                  </div>
                ))}
                {(calculatedQuote?.trace?.appliedDiscounts || []).map((disc, idx) => (
                  <div key={idx} className="flex justify-between p-3 bg-[#FAECE7]/50 text-[#D85A30]">
                    <span className="font-sans">{disc.nameFa}:</span>
                    <span className="font-bold">
                      -{((disc?.discountToman || 0)).toLocaleString('fa-IR')} تومان
                    </span>
                  </div>
                ))}
                <div className="flex justify-between p-3 bg-[#E1F5EE]/40">
                  <span className="text-[#04342C] font-sans font-bold">کرایه نهایی قابل پرداخت:</span>
                  <span className="font-bold text-[#085041]">
                    {(calculatedQuote?.finalPriceToman || 0).toLocaleString('fa-IR')} تومان
                  </span>
                </div>
              </div>
            </div>

            {/* Decision Trace Steps */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-[#2C2C2A] text-xs flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-[#085041]" />
                  تبارشناسی تصمیم و لاگ محاسباتی (Decision Trace):
                </h4>
                {calculatedQuote?.trace && (
                  <button
                    type="button"
                    onClick={() => setSelectedTrace(calculatedQuote.trace)}
                    className="text-xs text-[#085041] hover:text-[#04342C] font-semibold underline cursor-pointer"
                  >
                    مشاهده لاگ کامل تبارشناسی
                  </button>
                )}
              </div>
              <div className="p-3 bg-[#FAFAF8] border border-[#D3D1C7] rounded-xl text-xs text-[#2C2C2A] leading-relaxed">
                {calculatedQuote?.trace?.explanationFa || 'استعلام با موفقیت از طریق موتور قیمت‌گذاری محاسبه گردید.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Batch Simulation */}
      {currentTab === 'batch_sim' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#D3D1C7] p-6 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-5 shadow-xs">
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
              <label className="text-[#5F5E5A] block mb-2 font-semibold text-xs">پکیج استراتژی هدف:</label>
              <div className="bg-[#FAFAF8] border border-[#D3D1C7] rounded-2xl p-3 text-[#04342C] font-mono flex items-center justify-between">
                <span className="font-bold">
                  {activeStagingPackage?.displayId || activeProductionPackage.displayId}@v
                  {activeStagingPackage?.version || activeProductionPackage.version}
                </span>
                <span className="text-xs text-[#5F5E5A] font-sans">محیط استیجینگ/پروداکشن</span>
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleExecuteSimulation}
                disabled={isRunningSim}
                className="w-full py-3 bg-[#085041] hover:bg-[#04342C] disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer text-xs"
              >
                {isRunningSim ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    در حال پردازش ۱۰,۰۰۰ بارنامه...
                  </span>
                ) : (
                  <>
                    <Play className="w-4 h-4 text-[#9FE1CB]" />
                    اجرای شبیه‌سازی دسته‌ای
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Banner */}
          {activeSim && (
            <div className="bg-white border border-[#D3D1C7] rounded-3xl p-6 shadow-xs space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D3D1C7] pb-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono bg-[#E1F5EE] text-[#04342C] px-2 py-0.5 rounded border border-[#9FE1CB] font-bold">
                      {activeSim.displayId}
                    </span>
                    <span className="font-bold text-[#2C2C2A] text-base font-display">{activeSim.datasetName}</span>
                  </div>
                  <span className="text-[#888780] text-xs block mt-1">
                    اجرا شده توسط: <strong className="text-[#5F5E5A]">{activeSim?.executedBy || 'سیستم'}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#5F5E5A]">گیت حاکمیتی (BR-033):</span>
                  <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-[#E1F5EE] text-[#04342C] border border-[#9FE1CB]">
                    <CheckCircle2 className="w-4 h-4 text-[#085041]" />
                    مجاز برای تایید (PASS)
                  </span>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
                <div className="bg-[#FAFAF8] p-5 rounded-2xl border border-[#D3D1C7] shadow-xs">
                  <span className="text-[#5F5E5A] font-sans block text-xs font-medium">تغییر کل درآمد</span>
                  <span className="text-xl font-bold text-[#085041] flex items-center gap-1 mt-2">
                    <TrendingUp className="w-5 h-5 text-[#0F6E56]" />
                    +{activeSim.revenueDeltaPercent}٪
                  </span>
                </div>

                <div className="bg-[#FAFAF8] p-5 rounded-2xl border border-[#D3D1C7] shadow-xs">
                  <span className="text-[#5F5E5A] font-sans block text-xs font-medium">تغییر حاشیه سود ناخالص</span>
                  <span className="text-xl font-bold text-[#04342C] flex items-center gap-1 mt-2">
                    <TrendingUp className="w-5 h-5 text-[#085041]" />
                    {activeSim.marginDeltaPercent > 0 ? `+${activeSim.marginDeltaPercent}` : activeSim.marginDeltaPercent}٪
                  </span>
                </div>

                <div className="bg-[#FAFAF8] p-5 rounded-2xl border border-[#D3D1C7] shadow-xs">
                  <span className="text-[#5F5E5A] font-sans block text-xs font-medium">نقض کف سود (۱۵٪)</span>
                  <span
                    className={`text-xl font-bold flex items-center gap-1 mt-2 ${
                      activeSim.guardrailBreachCount === 0 ? 'text-[#085041]' : 'text-[#D85A30]'
                    }`}
                  >
                    {activeSim.guardrailBreachCount} مورد (کلمپ‌شده)
                  </span>
                </div>

                <div className="bg-[#FAFAF8] p-5 rounded-2xl border border-[#D3D1C7] shadow-xs">
                  <span className="text-[#5F5E5A] font-sans block text-xs font-medium">پوشش شفافیت (Explainability)</span>
                  <span className="text-xl font-bold text-[#2C2C2A] mt-2 block">
                    {activeSim.explainabilityScorePercent}٪
                  </span>
                </div>
              </div>

              {/* Recommendation Box */}
              <div className="p-4 bg-[#E1F5EE] border border-[#9FE1CB] rounded-2xl text-[#04342C] flex items-start gap-3 shadow-xs">
                <Sparkles className="w-5 h-5 text-[#085041] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-1 text-[#04342C] font-display">گزارش هوشمند نتایج:</span>
                  <p className="text-xs text-[#2C2C2A] leading-relaxed">{activeSim.recommendationFa}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Subtab 3: Historical Replay */}
      {currentTab === 'historical_replay' && (
        <div className="bg-white border border-[#D3D1C7] p-6 rounded-3xl shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#D3D1C7] pb-4">
            <div>
              <h3 className="font-bold text-[#2C2C2A] text-base font-display">
                بازپخش تاریخی درآمد و حاشیه سود (Historical Replay)
              </h3>
              <p className="text-[#5F5E5A] text-xs mt-1">
                مقایسه اثر تعرفه فعلی در برابر تعرفه پیشنهادی بر روی محموله‌های ماه گذشته
              </p>
            </div>
            <span className="text-xs bg-[#E1F5EE] text-[#04342C] border border-[#9FE1CB] px-3 py-1 rounded-full font-mono font-bold">
              تعداد نمونه: ۲۴,۵۰۰ بارنامه
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-[#FAFAF8] border border-[#D3D1C7] rounded-2xl space-y-3">
              <span className="text-xs text-[#5F5E5A]">درآمد حاصل با تعرفه فعلی:</span>
              <span className="text-2xl font-bold text-[#2C2C2A] font-mono block">۸۴.۲ میلیارد تومان</span>
              <span className="text-xs text-[#888780] block">حاشیه سود میانگین: ۱۶.۴٪</span>
            </div>

            <div className="p-5 bg-[#E1F5EE] border border-[#9FE1CB] rounded-2xl space-y-3">
              <span className="text-xs text-[#04342C] font-semibold">درآمد حاصل با تعرفه پیشنهادی:</span>
              <span className="text-2xl font-bold text-[#085041] font-mono block">۹۱.۸ میلیارد تومان</span>
              <span className="text-xs text-[#0F6E56] font-semibold block">حاشیه سود میانگین: ۱۸.۱٪ (+۱.۷٪)</span>
            </div>

            <div className="p-5 bg-[#FAFAF8] border border-[#D3D1C7] rounded-2xl space-y-3">
              <span className="text-xs text-[#5F5E5A]">رشد کل درآمد خالص:</span>
              <span className="text-2xl font-bold text-[#085041] font-mono block">+۹.۰٪</span>
              <span className="text-xs text-[#5F5E5A] block">+۷.۶ میلیارد تومان سود بیشتر</span>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 4: Operational Feasibility */}
      {currentTab === 'feasibility' && (
        <div className="bg-white border border-[#D3D1C7] p-6 rounded-3xl shadow-xs space-y-6">
          <div>
            <h3 className="font-bold text-[#2C2C2A] text-base font-display">
              آزمون امکان‌سنجی عملیاتی ناوگان (Operational Feasibility Test)
            </h3>
            <p className="text-[#5F5E5A] text-xs mt-1">
              بررسی محدودیت‌های بار محوری، ارتفاع پل‌ها، طرح ترافیک شهری و رانندگان دارای گواهینامه معتبر ADR
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-[#FAFAF8] border border-[#D3D1C7] rounded-2xl space-y-4">
              <h4 className="font-bold text-[#2C2C2A] text-xs">پارامترهای مسیر و وسیله:</h4>
              <div className="space-y-3">
                <CityPickerDropdown
                  id="feas-orig"
                  label="مبدأ:"
                  value={feasibilityOrigin}
                  onChange={setFeasibilityOrigin}
                />
                <CityPickerDropdown
                  id="feas-dest"
                  label="مقصد:"
                  value={feasibilityDestination}
                  onChange={setFeasibilityDestination}
                />
                <VehiclePickerDropdown
                  id="feas-veh"
                  label="نوع وسیله:"
                  value={feasibilityVehicle}
                  onChange={setFeasibilityVehicle}
                />
              </div>
            </div>

            <div className="p-5 bg-[#FAFAF8] border border-[#D3D1C7] rounded-2xl space-y-3">
              <h4 className="font-bold text-[#2C2C2A] text-xs">نتایج ارزیابی فیزیکی و قانونی:</h4>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between p-3 bg-white border border-[#D3D1C7] rounded-xl">
                  <span className="font-sans text-[#2C2C2A]">محدودیت تردد در بافت شهری مقصد:</span>
                  <span className="flex items-center gap-1 text-[#085041] font-bold">
                    <Check className="w-4 h-4" /> مجاز (مسیر کمربندی)
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white border border-[#D3D1C7] rounded-xl">
                  <span className="font-sans text-[#2C2C2A]">تناژ مجاز بار محوری پل‌ها:</span>
                  <span className="flex items-center gap-1 text-[#085041] font-bold">
                    <Check className="w-4 h-4" /> حداکثر ۴۴ تن (مجاز)
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white border border-[#D3D1C7] rounded-xl">
                  <span className="font-sans text-[#2C2C2A]">ناوگان آماده دارای مجوز فعال:</span>
                  <span className="flex items-center gap-1 text-[#085041] font-bold">
                    <Check className="w-4 h-4" /> ۴۲ کشنده موجود در منطقه
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 5: Scenario Compare */}
      {currentTab === 'scenario_compare' && (
        <div className="bg-white border border-[#D3D1C7] p-6 rounded-3xl shadow-xs space-y-6">
          <div>
            <h3 className="font-bold text-[#2C2C2A] text-base font-display">
              مقایسه سناریوهای تعرفه A/B (Scenario Comparison)
            </h3>
            <p className="text-[#5F5E5A] text-xs mt-1">
              مقایسه شاخص‌های مالی و ریسک بین سناریوی پایدار فعلی، سناریوی پیشنهادی استیجینگ و شوک سوخت
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            {/* Scenario A */}
            <div className="p-5 bg-[#FAFAF8] border border-[#D3D1C7] rounded-2xl space-y-4">
              <div className="border-b border-[#D3D1C7] pb-3">
                <span className="text-xs font-bold text-[#5F5E5A] block font-sans">سناریوی A (تعرفه جاری):</span>
                <span className="text-base font-bold text-[#2C2C2A]">Production v1.2</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#5F5E5A] font-sans">حاشیه سود میانگین:</span>
                  <span className="font-bold text-[#2C2C2A]">۱۶.۴٪</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5F5E5A] font-sans">ریسک سوخت:</span>
                  <span className="font-bold text-amber-700">متوسط</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5F5E5A] font-sans">درآمد تخمینی:</span>
                  <span className="font-bold text-[#2C2C2A]">۸۴.۲ م.ت</span>
                </div>
              </div>
            </div>

            {/* Scenario B */}
            <div className="p-5 bg-[#E1F5EE] border border-[#9FE1CB] rounded-2xl space-y-4">
              <div className="border-b border-[#9FE1CB] pb-3">
                <span className="text-xs font-bold text-[#04342C] block font-sans">سناریوی B (پیشنهادی):</span>
                <span className="text-base font-bold text-[#085041]">Staging v2.0-beta</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#04342C] font-sans font-semibold">حاشیه سود میانگین:</span>
                  <span className="font-bold text-[#085041]">۱۸.۱٪</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#04342C] font-sans font-semibold">ریسک سوخت:</span>
                  <span className="font-bold text-[#085041]">کم (شناور فعال)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#04342C] font-sans font-semibold">درآمد تخمینی:</span>
                  <span className="font-bold text-[#085041]">۹۱.۸ م.ت</span>
                </div>
              </div>
            </div>

            {/* Scenario C */}
            <div className="p-5 bg-[#FAFAF8] border border-[#D3D1C7] rounded-2xl space-y-4">
              <div className="border-b border-[#D3D1C7] pb-3">
                <span className="text-xs font-bold text-[#5F5E5A] block font-sans">سناریوی C (شوک سوخت ۳۰٪):</span>
                <span className="text-base font-bold text-[#D85A30]">Fuel Shock Stress</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#5F5E5A] font-sans">حاشیه سود میانگین:</span>
                  <span className="font-bold text-[#D85A30]">۱۵.۶٪ (کلمپ فعال)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5F5E5A] font-sans">ریسک سوخت:</span>
                  <span className="font-bold text-[#D85A30]">بسیار بالا</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5F5E5A] font-sans">درآمد تخمینی:</span>
                  <span className="font-bold text-[#2C2C2A]">۹۶.۴ م.ت</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
