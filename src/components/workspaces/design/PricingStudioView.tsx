import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  Settings,
  Sparkles,
  Play,
  ShieldCheck,
  Fuel,
  Mountain,
  Snowflake,
  Flame,
  Calendar,
  AlertTriangle,
  FileSearch,
  CheckCircle2,
  ArrowRight,
  Sliders,
  Scale,
} from 'lucide-react';
import { usePricing } from '../../../store/PricingContext';
import { ObjectHeader } from '../../layout/ObjectHeader';
import { RuleBlock, RuleBlockType } from '../../../types/pricing';
import { ShipmentPricingContext } from '../../../engine/pricingEngine';
import { CityPickerDropdown } from '../../common/menus/CityPickerDropdown';
import { VehiclePickerDropdown } from '../../common/menus/VehiclePickerDropdown';

export const PricingStudioView: React.FC<{ onNavigateToValidation?: () => void }> = ({ onNavigateToValidation }) => {
  const {
    pricingPolicy,
    routeMatrix,
    contracts,
    calculatePrice,
    updatePricingPolicyGuardrails,
    setSelectedTrace,
    userName,
  } = usePricing();

  const [activeTab, setActiveTab] = useState<'canvas' | 'guardrails' | 'preview'>('canvas');
  const [selectedBlockId, setSelectedBlockId] = useState<string>('blk-base-matrix');
  const [minMargin, setMinMargin] = useState(pricingPolicy.guardrails.minMarginPercent);
  const [maxDiscountCap, setMaxDiscountCap] = useState(pricingPolicy.guardrails.maxDiscountCapPercent);
  const [guardrailMode, setGuardrailMode] = useState<'clamp' | 'reject'>(pricingPolicy.guardrails.mode);

  // Live Test Context
  const [testOrigin, setTestOrigin] = useState('تهران');
  const [testDestination, setTestDestination] = useState('بندرعباس');
  const [testVehicle, setTestVehicle] = useState('کشنده یخچال‌دار');
  const [testWeight, setTestWeight] = useState(22);
  const [testColdChain, setTestColdChain] = useState(true);
  const [testHazardous, setTestHazardous] = useState(false);
  const [testPeakSeason, setTestPeakSeason] = useState(false);

  const testContext: ShipmentPricingContext = {
    originCity: testOrigin,
    destinationCity: testDestination,
    vehicleType: testVehicle,
    cargoType: 'کالای فاسدشدنی زنجیره سرد',
    cargoWeightTons: testWeight,
    isColdChain: testColdChain,
    isHazardous: testHazardous,
    isPeakSeason: testPeakSeason,
    channel: 'TMS API Portal',
  };

  const previewResult = calculatePrice(testContext);

  const handleSaveGuardrails = () => {
    updatePricingPolicyGuardrails(minMargin, maxDiscountCap, guardrailMode);
    alert('گاردریل‌های کف حاشیه سود و سقف تخفیف با موفقیت به‌روزرسانی و در لاگ حاکمیت ثبت گردید.');
  };

  const getBlockIcon = (type: RuleBlockType) => {
    switch (type) {
      case 'base_matrix':
        return Layers;
      case 'fuel_surcharge_hook':
        return Fuel;
      case 'mountainous_surcharge':
        return Mountain;
      case 'cold_chain_addon':
        return Snowflake;
      case 'hazardous_adr_addon':
        return Flame;
      case 'peak_season_multiplier':
        return Calendar;
      case 'margin_floor_guardrail':
        return ShieldCheck;
      default:
        return Sliders;
    }
  };

  return (
    <div className="space-y-6">
      {/* Object Header */}
      <ObjectHeader
        titleFa={pricingPolicy.nameFa}
        displayId={pricingPolicy.displayId}
        typeFa="سیاست جامع تعرفه و کرایه جاده‌ای (Pricing Policy)"
        version={pricingPolicy.version}
        status={pricingPolicy.status}
        riskClass="medium"
        ownerName={pricingPolicy.ownerName}
        onSendToSimulation={onNavigateToValidation}
      />

      {/* Sub navigation buttons */}
      <div className="flex gap-2 border-b border-slate-200 pb-4 text-xs">
        <button
          onClick={() => setActiveTab('canvas')}
          className={`px-4 py-2.5 rounded-xl font-semibold transition-all cursor-pointer ${
            activeTab === 'canvas' ? 'bg-amber-500 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          بوم بصری قواعد تعرفه (Pricing Canvas)
        </button>
        <button
          onClick={() => setActiveTab('guardrails')}
          className={`px-4 py-2.5 rounded-xl font-semibold transition-all cursor-pointer ${
            activeTab === 'guardrails' ? 'bg-amber-500 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          گاردریل‌های کف سود و سقف تخفیف (Guardrails)
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2.5 rounded-xl font-semibold transition-all cursor-pointer ${
            activeTab === 'preview' ? 'bg-amber-500 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          پیش‌نمایش زنده و تبارشناسی (Live Preview)
        </button>
      </div>

      {/* Tab 1: Visual Pricing Canvas */}
      {activeTab === 'canvas' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Blocks Pipeline */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base font-display">خط لوله محاسباتی کرایه (Deterministic Calculation Pipeline)</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  ترتیب اولویت اجرای بلوک‌ها، استعلام ضرایب خارجی و اعمال گاردریل‌ها (BR-028)
                </p>
              </div>
              <span className="text-xs bg-amber-50 text-amber-900 px-3 py-1 rounded-xl border border-amber-200 font-mono font-bold">
                {(pricingPolicy?.ruleBlocks || []).length} بلوک فعال
              </span>
            </div>

            <div className="space-y-3">
              {(pricingPolicy?.ruleBlocks || []).map((block, idx) => {
                const Icon = getBlockIcon(block.type);
                const isSelected = selectedBlockId === block.id;

                return (
                  <div
                    key={block.id}
                    onClick={() => setSelectedBlockId(block.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between shadow-xs ${
                      isSelected
                        ? 'bg-white border-amber-500 ring-2 ring-amber-500/20 shadow-md'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-bold flex items-center justify-center border border-slate-200">
                        {idx + 1}
                      </span>
                      <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 text-xs">{block.nameFa}</span>
                          <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                            {block.type}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500">{block.nameEn}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500 font-mono">اولویت: {block.priority}</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Block Inspector */}
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-bold text-slate-900 text-xs flex items-center gap-2">
                  <Settings className="w-4 h-4 text-amber-600" />
                  تنظیمات بلوک انتخابی (Inspector)
                </span>
                <span className="text-xs font-mono bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200 font-bold">
                  {selectedBlockId}
                </span>
              </div>

              {selectedBlockId === 'blk-base-matrix' && (
                <div className="space-y-3 text-xs text-slate-700">
                  <p className="leading-relaxed">
                    این بلوک کرایه پایه را بر اساس شهر مبدأ، مقصد و نوع تریلر از ماتریس کریدورها استخراج می‌نماید.
                  </p>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">تعداد سلول‌های تعریف‌شده:</span>
                      <span className="font-mono font-bold text-amber-700">{routeMatrix.length} مسیر</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">نرخ پشتیبان در غیاب سلول:</span>
                      <span className="font-mono text-slate-800 font-semibold">۳۲,۰۰۰ تومان به ازای تن/کیلومتر</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedBlockId === 'blk-fuel-surcharge' && (
                <div className="space-y-3 text-xs text-slate-700">
                  <p className="leading-relaxed">
                    اتصال آنلاین به سامانه پایش نرخ سوخت ناوگان کشور جهت اعمال لحظه‌ای تعدیل قیمت گازوئیل.
                  </p>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">آدرس وب‌سرویس (Hook):</span>
                      <span className="font-mono text-sky-700 text-xs font-semibold">/api/connectors/fuel-index</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">ضریب تعدیل فعلی:</span>
                      <span className="font-mono font-bold text-amber-700">1.04x (+۴٪)</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedBlockId === 'blk-mountainous-toll' && (
                <div className="space-y-3 text-xs text-slate-700">
                  <p className="leading-relaxed">
                    اعمال ۱۲٪ اضافه کرایه جهت جبران استهلاک لاستیک، لنت و سوخت در گردنه‌های صعب‌العبور رشته‌کوه‌های زاگرس و البرز.
                  </p>
                </div>
              )}

              {selectedBlockId === 'blk-margin-guardrail' && (
                <div className="space-y-3 text-xs text-slate-700">
                  <p className="leading-relaxed text-emerald-800 font-medium">
                    گاردریل کف حاشیه سود به صورت خودکار مانع از صدور بارنامه زیان‌ده (زیر ۱۵٪) می‌شود.
                  </p>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">حداقل حاشیه سود:</span>
                      <span className="font-mono font-bold text-emerald-700">۱۵.۰٪</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">رفتار در زمان نقض:</span>
                      <span className="font-mono text-amber-700 font-semibold">Clamp (تعدیل خودکار)</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Play className="w-4 h-4 text-amber-600" />
                  اجرای تست روی محموله نمونه
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Guardrails */}
      {activeTab === 'guardrails' && (
        <div className="max-w-2xl bg-white border border-slate-200 rounded-3xl p-7 shadow-xs space-y-6 text-xs">
          <div>
            <h3 className="font-bold text-slate-900 text-base font-display flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              تنظیمات گاردریل‌های مالی و ایمنی تجاری (Financial Guardrails)
            </h3>
            <p className="text-slate-500 mt-1">
              بر اساس قوانین BR-030 و BR-034، گاردریل‌های کف سود هرگز به صورت خاموش نقض نمی‌شوند.
            </p>
          </div>

          <div className="space-y-5">
            {/* Min Margin */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-center">
                <label className="font-bold text-slate-800">کف حاشیه سود عملیاتی مجاز (Margin Floor):</label>
                <span className="text-base font-mono font-bold text-emerald-700">{minMargin}٪</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                step="0.5"
                value={minMargin}
                onChange={(e) => setMinMargin(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-xs text-slate-500 block">
                هیچ بارنامه‌ای با سود کمتر از این مقدار صادر نخواهد شد و در صورت لزوم کرایه به این مقدار کلمپ می‌گردد.
              </span>
            </div>

            {/* Max Discount Cap */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-center">
                <label className="font-bold text-slate-800">سقف حداکثر تخفیف کل ترکیبی (Max Combined Discount Cap):</label>
                <span className="text-base font-mono font-bold text-sky-700">{maxDiscountCap}٪</span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                step="1"
                value={maxDiscountCap}
                onChange={(e) => setMaxDiscountCap(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-xs text-slate-500 block">
                جلوگیری از ترکیب مفرط تخفیف‌های تناژ، وفاداری و بار برگشت فراتر از این سقف.
              </span>
            </div>

            {/* Mode */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <label className="font-bold text-slate-800 block">رفتار سیستم در زمان نقض کف سود:</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setGuardrailMode('clamp')}
                  className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
                    guardrailMode === 'clamp'
                      ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className="block font-bold text-slate-900">حالت کلمپ خودکار (Clamp)</span>
                  <span className="text-xs text-slate-500 mt-1 block">
                    قیمت به حداقل کف سود مجاز افزایش یافته و در ردگیری تصمیم ثبت می‌شود.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setGuardrailMode('reject')}
                  className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
                    guardrailMode === 'reject'
                      ? 'bg-rose-50 border-rose-500 text-rose-950 font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className="block font-bold text-slate-900">حالت رد کامل (Reject)</span>
                  <span className="text-xs text-slate-500 mt-1 block">
                    استعلام قیمت لغو شده و خطای GUARDRAIL_REJECTED صادر می‌گردد.
                  </span>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveGuardrails}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold transition-all shadow-sm cursor-pointer text-sm"
            >
              ذخیره گاردریل‌ها و ثبت در دفترکل حاکمیت (Audit Log)
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Live Preview & Trace */}
      {activeTab === 'preview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
          {/* Controls */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base font-display">تنظیم پارامترهای محموله نمونه (Test Context):</h3>

            <div className="grid grid-cols-2 gap-4">
              <CityPickerDropdown
                id="studio-test-origin"
                value={testOrigin}
                onChange={setTestOrigin}
                label="مبدأ:"
                type="origin"
              />
              <CityPickerDropdown
                id="studio-test-dest"
                value={testDestination}
                onChange={setTestDestination}
                label="مقصد:"
                type="destination"
              />
            </div>

            <div>
              <VehiclePickerDropdown
                id="studio-test-vehicle"
                value={testVehicle}
                onChange={setTestVehicle}
                label="نوع ناوگان:"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setTestColdChain(!testColdChain)}
                className={`flex-1 p-3 rounded-xl border text-center transition-colors cursor-pointer font-medium ${
                  testColdChain ? 'bg-sky-50 border-sky-300 text-sky-800 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                زنجیره سرد (+۱۸٪)
              </button>
              <button
                type="button"
                onClick={() => setTestHazardous(!testHazardous)}
                className={`flex-1 p-3 rounded-xl border text-center transition-colors cursor-pointer font-medium ${
                  testHazardous ? 'bg-rose-50 border-rose-300 text-rose-800 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                کالای خطرناک ADR (+۲۵٪)
              </button>
            </div>
          </div>

          {/* Live Outcome Box */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-bold text-slate-900 text-base font-display">نتیجه اجرای بلادرنگ موتور تعرفه:</span>
                <span className="text-xs font-mono text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
                  پاسخ قطعی (Deterministic)
                </span>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 block text-xs mb-1">کرایه نهایی محاسبه‌شده:</span>
                  <span className="text-2xl font-bold font-mono text-emerald-700">
                    {(previewResult.finalPriceToman / 1000000).toLocaleString('fa-IR')} م تومان
                  </span>
                </div>
                <div className="text-left">
                  <span className="text-slate-500 block text-xs mb-1">حاشیه سود عملیاتی:</span>
                  <span className="text-xl font-bold font-mono text-sky-700">
                    {previewResult.marginPercent.toLocaleString('fa-IR')}٪
                  </span>
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                {previewResult.trace.explanationFa}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedTrace(previewResult.trace)}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs text-sm"
            >
              <FileSearch className="w-4 h-4" />
              مشاهده سند ردگیری تصمیم کامل (Decision Trace Modal)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
