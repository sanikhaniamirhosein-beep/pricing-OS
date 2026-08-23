import React, { useState, useEffect } from 'react';
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
  Cpu,
  Power,
  Edit3,
  Code2,
  RefreshCw,
  Info,
  Check,
  TrendingUp,
  Percent,
  Calculator,
  Compass,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { usePricing } from '../../../store/PricingContext';
import { ObjectHeader } from '../../layout/ObjectHeader';
import { RuleBlock, RuleBlockType } from '../../../types/pricing';
import { ShipmentPricingContext } from '../../../engine/pricingEngine';
import { CityPickerDropdown } from '../../common/menus/CityPickerDropdown';
import { VehiclePickerDropdown } from '../../common/menus/VehiclePickerDropdown';
import { ModernSelect } from '../../common/menus/ModernSelect';
import { SurfaceModeToggle, AdvancedConfigSummaryCard } from '../../common/SurfaceModeToggle';
import { useSurfaceMode } from '../../../hooks/useSurfaceMode';

export const PricingStudioView: React.FC<{ onNavigateToValidation?: () => void }> = ({
  onNavigateToValidation,
}) => {
  const {
    pricingPolicy,
    routeMatrix,
    contracts,
    calculatePrice,
    updatePricingPolicyGuardrails,
    updateRuleBlock,
    addRuleBlock,
    deleteRuleBlock,
    toggleRuleBlock,
    setSelectedTrace,
    userName,
    userRole,
  } = usePricing();

  const [activeTab, setActiveTab] = useState<'canvas' | 'guardrails' | 'preview'>('canvas');
  const [selectedBlockId, setSelectedBlockId] = useState<string>('blk-base-matrix');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Per-Surface mode hook for the currently selected block
  const surfaceModeState = useSurfaceMode(selectedBlockId, 'simple');

  // Per-Surface mode hook for Guardrails tab
  const guardrailsSurfaceMode = useSurfaceMode('guardrails', 'simple');

  // Guardrails State
  const [minMargin, setMinMargin] = useState(pricingPolicy.guardrails.minMarginPercent);
  const [maxDiscountCap, setMaxDiscountCap] = useState(pricingPolicy.guardrails.maxDiscountCapPercent);
  const [guardrailMode, setGuardrailMode] = useState<'clamp' | 'reject'>(pricingPolicy.guardrails.mode);
  const [minAbsolutePrice, setMinAbsolutePrice] = useState(pricingPolicy.guardrails.minAbsolutePriceToman || 10000000);

  // Selected Block Local Form State (synchronized with active policy rule block)
  const selectedBlock = pricingPolicy?.ruleBlocks?.find((b) => b.id === selectedBlockId) || pricingPolicy?.ruleBlocks?.[0];

  const [blockNameFa, setBlockNameFa] = useState('');
  const [blockEnabled, setBlockEnabled] = useState(true);
  const [blockPriority, setBlockPriority] = useState(10);
  const [blockPercent, setBlockPercent] = useState<number>(10);
  const [blockBaseMultiplier, setBlockBaseMultiplier] = useState<number>(1.04);
  const [blockHookUrl, setBlockHookUrl] = useState('');
  const [blockFormula, setBlockFormula] = useState('');
  const [blockRoutes, setBlockRoutes] = useState<string[]>([]);
  const [newRouteInput, setNewRouteInput] = useState('');
  const [customFixedFee, setCustomFixedFee] = useState<number>(0);

  // Add Block Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBlockType, setNewBlockType] = useState<RuleBlockType>('custom_formula');
  const [newBlockNameFa, setNewBlockNameFa] = useState('');
  const [newBlockPercent, setNewBlockPercent] = useState(10);
  const [newBlockFormula, setNewBlockFormula] = useState('base * 0.10');

  // Live Test Calculator Context
  const [testOrigin, setTestOrigin] = useState('تهران');
  const [testDestination, setTestDestination] = useState('بندرعباس');
  const [testVehicle, setTestVehicle] = useState('تریلی چادری');
  const [testWeight, setTestWeight] = useState(22);
  const [testColdChain, setTestColdChain] = useState(false);
  const [testHazardous, setTestHazardous] = useState(false);
  const [testPeakSeason, setTestPeakSeason] = useState(false);
  const [testContractId, setTestContractId] = useState<string>('');

  // Sync form when selected block changes
  useEffect(() => {
    if (selectedBlock) {
      setBlockNameFa(selectedBlock.nameFa || '');
      setBlockEnabled(selectedBlock.enabled);
      setBlockPriority(selectedBlock.priority || 10);
      setBlockHookUrl(selectedBlock.config?.hookEndpoint || '');
      setBlockFormula(
        selectedBlock.config?.formula ||
          `base * (${(selectedBlock.config?.surchargePercent || selectedBlock.config?.addonPercent || selectedBlock.config?.surgePercent || 10) / 100})`
      );
      setBlockRoutes(selectedBlock.config?.mountainousRoutes || []);
      setCustomFixedFee(selectedBlock.config?.fixedFeeToman || 0);

      if (selectedBlock.type === 'fuel_surcharge_hook') {
        const mult = selectedBlock.config?.baseMultiplier ?? 1.04;
        setBlockBaseMultiplier(mult);
        setBlockPercent(Math.round((mult - 1) * 100));
      } else if (selectedBlock.type === 'mountainous_surcharge') {
        setBlockPercent(selectedBlock.config?.surchargePercent ?? 12.0);
      } else if (selectedBlock.type === 'cold_chain_addon') {
        setBlockPercent(selectedBlock.config?.addonPercent ?? 18.0);
      } else if (selectedBlock.type === 'hazardous_adr_addon') {
        setBlockPercent(selectedBlock.config?.addonPercent ?? 25.0);
      } else if (selectedBlock.type === 'peak_season_multiplier') {
        setBlockPercent(selectedBlock.config?.surgePercent ?? 15.0);
      } else {
        setBlockPercent(selectedBlock.config?.percentFee ?? 10.0);
      }
    }
  }, [selectedBlockId, selectedBlock]);

  // Live calculation
  const testContext: ShipmentPricingContext = {
    originCity: testOrigin,
    destinationCity: testDestination,
    vehicleType: testVehicle,
    cargoType: testColdChain
      ? 'کالای فاسدشدنی زنجیره سرد'
      : testHazardous
      ? 'مواد شیمیایی خطرناک ADR'
      : 'کالای عمومی تجاری',
    cargoWeightTons: testWeight,
    isColdChain: testColdChain,
    isHazardous: testHazardous,
    isPeakSeason: testPeakSeason,
    customerContractId: testContractId || undefined,
    channel: 'TMS API Portal',
  };

  const previewResult = calculatePrice(testContext);

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3500);
  };

  const handleSaveSimpleBlock = () => {
    if (!selectedBlock) return;

    let updatedConfig = { ...selectedBlock.config };

    if (selectedBlock.type === 'fuel_surcharge_hook') {
      const mult = 1 + blockPercent / 100;
      updatedConfig.baseMultiplier = Number(mult.toFixed(3));
    } else if (selectedBlock.type === 'mountainous_surcharge') {
      updatedConfig.surchargePercent = blockPercent;
      updatedConfig.mountainousRoutes = blockRoutes;
    } else if (selectedBlock.type === 'cold_chain_addon') {
      updatedConfig.addonPercent = blockPercent;
    } else if (selectedBlock.type === 'hazardous_adr_addon') {
      updatedConfig.addonPercent = blockPercent;
    } else if (selectedBlock.type === 'peak_season_multiplier') {
      updatedConfig.surgePercent = blockPercent;
    } else {
      updatedConfig.percentFee = blockPercent;
      updatedConfig.fixedFeeToman = customFixedFee;
    }

    updateRuleBlock(selectedBlock.id, {
      nameFa: blockNameFa,
      enabled: blockEnabled,
      config: updatedConfig,
    });

    showToast(`تغییرات بلوک «${selectedBlock.nameFa}» با موفقیت ذخیره و اعمال شد.`);
  };

  const handleSaveAdvancedBlock = () => {
    if (!selectedBlock) return;

    let updatedConfig: Record<string, any> = {
      ...selectedBlock.config,
      formula: blockFormula,
      hookEndpoint: blockHookUrl,
      mountainousRoutes: blockRoutes,
      fixedFeeToman: customFixedFee,
    };

    if (selectedBlock.type === 'fuel_surcharge_hook') {
      updatedConfig.baseMultiplier = Number(blockBaseMultiplier);
    } else if (selectedBlock.type === 'mountainous_surcharge') {
      updatedConfig.surchargePercent = blockPercent;
    } else if (selectedBlock.type === 'cold_chain_addon') {
      updatedConfig.addonPercent = blockPercent;
    } else if (selectedBlock.type === 'hazardous_adr_addon') {
      updatedConfig.addonPercent = blockPercent;
    } else if (selectedBlock.type === 'peak_season_multiplier') {
      updatedConfig.surgePercent = blockPercent;
    } else {
      updatedConfig.percentFee = blockPercent;
    }

    updateRuleBlock(selectedBlock.id, {
      nameFa: blockNameFa,
      enabled: blockEnabled,
      priority: Number(blockPriority),
      config: updatedConfig,
    });

    showToast(`پیکربندی پیشرفته بلوک «${selectedBlock.nameFa}» ذخیره شد.`);
  };

  const handleSaveGuardrails = () => {
    updatePricingPolicyGuardrails(minMargin, maxDiscountCap, guardrailMode);
    showToast('گاردریل‌های کف حاشیه سود و سقف تخفیف با موفقیت به‌روزرسانی شد.');
  };

  const handleCreateNewBlock = () => {
    if (!newBlockNameFa.trim()) return;

    const newId = `blk-custom-${Date.now()}`;
    const newBlock: RuleBlock = {
      id: newId,
      type: newBlockType,
      nameFa: newBlockNameFa.trim(),
      nameEn: 'Custom Commercial Surcharge',
      enabled: true,
      priority: 70,
      config: {
        percentFee: newBlockPercent,
        formula: newBlockFormula,
      },
    };

    addRuleBlock(newBlock);
    setSelectedBlockId(newId);
    setIsAddModalOpen(false);
    setNewBlockNameFa('');
    showToast(`بلوک قاعده جدید «${newBlock.nameFa}» ایجاد و فعال گردید.`);
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

  const isSelectedBlockAdvanced = surfaceModeState.isAdvanced;

  return (
    <div className="space-y-6 text-xs antialiased">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-emerald-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-medium text-xs text-slate-100">{saveToast}</span>
        </div>
      )}

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

      {/* Sleek Sub-navigation Tabs & Actions Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tab Switcher */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('canvas')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all duration-200 cursor-pointer ${
              activeTab === 'canvas'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>بوم بصری قواعد تعرفه</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
              activeTab === 'canvas' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {(pricingPolicy?.ruleBlocks || []).length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guardrails')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all duration-200 cursor-pointer ${
              activeTab === 'guardrails'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>گاردریل‌های سود و تخفیف</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all duration-200 cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>ماشین‌حساب و آزمایشگاه زنده</span>
          </button>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن بلوک قاعده جدید</span>
        </button>
      </div>

      {/* TAB 1: VISUAL PRICING CANVAS */}
      {activeTab === 'canvas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Rule Blocks Pipeline (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm font-display">
                    خط لوله محاسباتی کرایه
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    بلوک‌ها به ترتیب اولویت روی نرخ پایه اعمال می‌شوند.
                  </p>
                </div>
                <span className="text-[11px] bg-amber-50 text-amber-800 px-2.5 py-1 rounded-xl border border-amber-200 font-mono font-bold">
                  {(pricingPolicy?.ruleBlocks || []).length} بلوک
                </span>
              </div>

              <div className="space-y-2.5">
                {(pricingPolicy?.ruleBlocks || []).map((block, idx) => {
                  const Icon = getBlockIcon(block.type);
                  const isSelected = selectedBlockId === block.id;

                  return (
                    <div
                      key={block.id}
                      onClick={() => setSelectedBlockId(block.id)}
                      className={`p-3.5 rounded-2xl border transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 shadow-2xs ${
                        isSelected
                          ? 'bg-amber-50/50 border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
                          : block.enabled
                          ? 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                          : 'bg-slate-50 border-slate-200/80 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-[11px] font-mono font-bold flex items-center justify-center border border-slate-200 shrink-0">
                          {idx + 1}
                        </span>
                        <div
                          className={`p-2 rounded-xl shrink-0 ${
                            block.enabled
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-400 border border-slate-200'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-xs truncate">{block.nameFa}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded border border-slate-200 shrink-0">
                              {block.type}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              اولویت: {block.priority}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => toggleRuleBlock(block.id)}
                          className={`p-2 rounded-xl border transition-all cursor-pointer ${
                            block.enabled
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-400 border-slate-300 hover:bg-slate-200'
                          }`}
                          title={block.enabled ? 'غیرفعال‌سازی این بلوک' : 'فعال‌سازی این بلوک'}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Selected Block Inspector & Live Sandbox (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {selectedBlock ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
                {/* Surface Header & Independent Toggle */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 shrink-0">
                      {React.createElement(getBlockIcon(selectedBlock.type), { className: 'w-5 h-5' })}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{selectedBlock.nameFa}</h4>
                        <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">
                          {selectedBlock.id}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{selectedBlock.nameEn}</p>
                    </div>
                  </div>

                  {/* Surface Mode Toggle (Per-Surface) */}
                  <SurfaceModeToggle
                    surfaceId={selectedBlock.id}
                    surfaceTitleFa={selectedBlock.nameFa}
                    mode={surfaceModeState.mode}
                    onToggle={surfaceModeState.toggleMode}
                    onSetMode={surfaceModeState.setMode}
                  />
                </div>

                {/* READ-ONLY ADVANCED SUMMARY (Lossless guarantee: shown in Simple Mode if advanced formulas/routes configured) */}
                {!isSelectedBlockAdvanced &&
                  (selectedBlock.config?.formula ||
                    selectedBlock.config?.hookEndpoint ||
                    (selectedBlock.config?.mountainousRoutes && selectedBlock.config.mountainousRoutes.length > 0)) && (
                    <AdvancedConfigSummaryCard
                      surfaceTitleFa={selectedBlock.nameFa}
                      onSwitchToAdvanced={() => surfaceModeState.setMode('advanced')}
                      summaryItems={[
                        ...(selectedBlock.config?.formula
                          ? [{ label: 'فرمول محاسباتی AST', value: selectedBlock.config.formula, isCode: true }]
                          : []),
                        ...(selectedBlock.config?.hookEndpoint
                          ? [{ label: 'آدرس وب‌سرویس تعدیل', value: selectedBlock.config.hookEndpoint, isCode: true }]
                          : []),
                        ...(selectedBlock.config?.mountainousRoutes && selectedBlock.config.mountainousRoutes.length > 0
                          ? [{ label: 'کریدورهای مشمول', value: selectedBlock.config.mountainousRoutes.join('، ') }]
                          : []),
                        { label: 'اولویت خط لوله', value: `سطح ${selectedBlock.priority}` },
                      ]}
                    />
                  )}

                {/* BLOCK CONTROLS: SIMPLE MODE */}
                {!isSelectedBlockAdvanced && (
                  <div className="space-y-4">
                    {/* Status Toggle & Title */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-slate-700 font-bold text-xs">عنوان نمایشی قانون:</label>
                        <input
                          type="text"
                          value={blockNameFa}
                          onChange={(e) => setBlockNameFa(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-slate-700 font-bold text-xs">وضعیت اعمال قانون:</label>
                        <button
                          type="button"
                          onClick={() => setBlockEnabled(!blockEnabled)}
                          className={`w-full py-2.5 px-3.5 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                            blockEnabled
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-rose-50 text-rose-800 border-rose-300'
                          }`}
                        >
                          <Power className="w-4 h-4" />
                          <span>{blockEnabled ? 'فعال در خط لوله محاسبات' : 'غیرفعال (عدم اعمال)'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Specific Simple Controls per type */}
                    {selectedBlock.type === 'base_matrix' ? (
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-800 font-bold">ماتریس تعرفه مبدأ-مقصد و ناوگان:</span>
                          <span className="font-mono text-amber-800 font-bold bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                            {routeMatrix.length} کریدور فعال
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          نرخ‌های پایه از ماتریس جغرافیایی استخراج می‌شوند. برای ویرایش مستقیم کریدورها می‌توانید به تب «ماتریس چندبعدی و زون‌ها» مراجعه کنید.
                        </p>
                      </div>
                    ) : (
                      <div className="bg-amber-50/40 p-5 rounded-2xl border border-amber-200/80 space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                            <Percent className="w-4 h-4 text-amber-600" />
                            <span>
                              {selectedBlock.type === 'fuel_surcharge_hook'
                                ? 'درصد اضافه کرایه تعدیل سوخت:'
                                : selectedBlock.type === 'mountainous_surcharge'
                                ? 'درصد اضافه کرایه صعوبت مسیر کوهستانی:'
                                : selectedBlock.type === 'cold_chain_addon'
                                ? 'درصد حق‌الزحمه کمپرسور و پایش زنجیره سرد:'
                                : selectedBlock.type === 'hazardous_adr_addon'
                                ? 'درصد حق بار و تجهیزات ایمنی کالای خطرناک ADR:'
                                : selectedBlock.type === 'peak_season_multiplier'
                                ? 'درصد اضافه کرایه پیک تقاضای فصلی:'
                                : 'درصد اضافه کرایه این قانون:'}
                            </span>
                          </label>
                          <div className="flex items-center gap-1.5">
                            <span className="text-base font-black text-amber-700 font-mono">+{blockPercent}٪</span>
                          </div>
                        </div>

                        {/* Interactive Slider */}
                        <input
                          type="range"
                          min={0}
                          max={50}
                          step={1}
                          value={blockPercent}
                          onChange={(e) => setBlockPercent(Number(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                        />

                        {/* Quick Presets */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="text-[11px] text-slate-500">پیش‌تنظیم‌های سریع:</span>
                          {[5, 10, 12, 15, 18, 20, 25, 30].map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => setBlockPercent(preset)}
                              className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold transition-all cursor-pointer ${
                                blockPercent === preset
                                  ? 'bg-amber-600 text-white shadow-2xs'
                                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              +{preset}٪
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Save Button for Simple Mode */}
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={handleSaveSimpleBlock}
                        className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>ثبت و ذخیره تغییرات</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* BLOCK CONTROLS: ADVANCED MODE (PRO) */}
                {isSelectedBlockAdvanced && (
                  <div className="space-y-4 bg-slate-900 text-slate-200 p-5 rounded-2xl border border-slate-700">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                      <div className="flex items-center gap-2 text-amber-400 font-mono font-bold">
                        <Code2 className="w-4 h-4" />
                        <span>ویرایشگر مهندسی تعرفه و AST Formula (Advanced Mode)</span>
                      </div>
                      <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                        Rule Engine v2.4
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-slate-400 text-[11px]">عنوان فارسی قانون:</label>
                        <input
                          type="text"
                          value={blockNameFa}
                          onChange={(e) => setBlockNameFa(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400 text-[11px]">اولویت اجرای خط لوله (Priority):</label>
                        <input
                          type="number"
                          value={blockPriority}
                          onChange={(e) => setBlockPriority(Number(e.target.value))}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400 text-[11px]">درصد اضافه کرایه:</label>
                        <input
                          type="number"
                          value={blockPercent}
                          onChange={(e) => setBlockPercent(Number(e.target.value))}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    {/* Formula Editor Box */}
                    <div className="space-y-1.5">
                      <label className="text-slate-400 text-[11px] flex items-center justify-between">
                        <span>فرمول محاسباتی کرایه (AST Formula Expression):</span>
                        <span className="text-[10px] text-amber-400 font-mono">متغیرها: base, distance, weight, fuel_index</span>
                      </label>
                      <textarea
                        rows={2}
                        value={blockFormula}
                        onChange={(e) => setBlockFormula(e.target.value)}
                        className="w-full bg-slate-950 font-mono text-amber-300 border border-slate-700 rounded-xl p-3 text-xs leading-relaxed focus:outline-none focus:border-amber-400"
                        placeholder="مثال: baseRate * (1 + (fuelMultiplier - 1))"
                      />
                    </div>

                    {/* API Hook Endpoint for Fuel */}
                    {selectedBlock.type === 'fuel_surcharge_hook' && (
                      <div className="space-y-1.5">
                        <label className="text-slate-400 text-[11px]">آدرس وب‌سرویس نرخ سوخت (Webhook Endpoint):</label>
                        <input
                          type="text"
                          value={blockHookUrl}
                          onChange={(e) => setBlockHookUrl(e.target.value)}
                          className="w-full bg-slate-800 font-mono text-sky-300 border border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-400"
                          placeholder="/api/connectors/fuel-index"
                        />
                      </div>
                    )}

                    {/* Mountainous Route List in Advanced */}
                    {selectedBlock.type === 'mountainous_surcharge' && (
                      <div className="space-y-2">
                        <label className="text-slate-400 text-[11px]">کریدورهای مشمول اضافه کرایه کوهستانی:</label>
                        <div className="flex flex-wrap gap-1.5">
                          {blockRoutes.map((route, i) => (
                            <span
                              key={i}
                              className="bg-slate-800 text-amber-300 border border-slate-700 px-2.5 py-1 rounded-lg text-[11px] font-mono flex items-center gap-1.5"
                            >
                              <span>{route}</span>
                              <button
                                type="button"
                                onClick={() => setBlockRoutes(blockRoutes.filter((_, idx) => idx !== i))}
                                className="text-rose-400 hover:text-rose-300 cursor-pointer"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newRouteInput}
                            onChange={(e) => setNewRouteInput(e.target.value)}
                            placeholder="مثال: رشت-تهران"
                            className="bg-slate-800 text-slate-100 border border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-400"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (newRouteInput.trim()) {
                                setBlockRoutes([...blockRoutes, newRouteInput.trim()]);
                                setNewRouteInput('');
                              }
                            }}
                            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-amber-300 rounded-xl text-xs font-bold cursor-pointer"
                          >
                            + افزودن کریدور
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Advanced Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                      {selectedBlock.id.startsWith('blk-custom') && (
                        <button
                          type="button"
                          onClick={() => {
                            deleteRuleBlock(selectedBlock.id);
                            setSelectedBlockId('blk-base-matrix');
                            showToast(`بلوک «${selectedBlock.nameFa}» حذف شد.`);
                          }}
                          className="text-rose-400 hover:text-rose-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>حذف این بلوک سفارشی</span>
                        </button>
                      )}
                      <div className="flex-1" />
                      <button
                        type="button"
                        onClick={handleSaveAdvancedBlock}
                        className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>ذخیره پیکربندی مهندسی</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-slate-400">
                لطفاً یک بلوک را از خط لوله سمت راست انتخاب نمایید.
              </div>
            )}

            {/* LIVE CALCULATION SANDBOX & DECISION TRACE */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm font-display">
                      شبیه‌ساز و آزمایشگاه قیمت‌گذاری آنی
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Live Calculation Sandbox & Price Trace</p>
                  </div>
                </div>
                <span className="text-[11px] text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-bold">
                  محاسبه زنده Real-Time
                </span>
              </div>

              {/* Sandbox Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <CityPickerDropdown value={testOrigin} onChange={setTestOrigin} label="مبدأ" />
                </div>

                <div className="space-y-1">
                  <CityPickerDropdown value={testDestination} onChange={setTestDestination} label="مقصد" />
                </div>

                <div className="space-y-1">
                  <VehiclePickerDropdown value={testVehicle} onChange={setTestVehicle} />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-700 font-bold block mb-1">وزن بار (تن):</label>
                  <input
                    type="number"
                    min={1}
                    max={40}
                    value={testWeight}
                    onChange={(e) => setTestWeight(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              {/* Checkbox Options */}
              <div className="flex flex-wrap gap-4 pt-1 text-xs">
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100/80 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={testColdChain}
                    onChange={(e) => setTestColdChain(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-slate-800 font-medium">زنجیره سرد (یخچالی)</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100/80 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={testHazardous}
                    onChange={(e) => setTestHazardous(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-slate-800 font-medium">کالای خطرناک ADR</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100/80 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={testPeakSeason}
                    onChange={(e) => setTestPeakSeason(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-slate-800 font-medium">پیک فصلی تقاضا</span>
                </label>
              </div>

              {/* Calculated Price Result Banner */}
              <div className="p-5 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800 shadow-sm">
                <div>
                  <span className="text-slate-400 text-[11px] block font-medium">کرایه نهایی برآورد شده:</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-amber-400 font-mono">
                      {previewResult.finalPriceToman.toLocaleString('fa-IR')}
                    </span>
                    <span className="text-xs text-slate-300 font-medium">تومان</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1.5 font-mono">
                    <span>مسافت: {previewResult.distanceKm} کیلومتر</span>
                    <span>•</span>
                    <span>حاشیه سود: {previewResult.marginPercent.toFixed(1)}٪</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTrace(previewResult.trace)}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-xs cursor-pointer"
                  >
                    <FileSearch className="w-4 h-4" />
                    <span>مشاهده ردگیری تصمیم (Trace)</span>
                  </button>
                </div>
              </div>

              {/* Breakdown of Applied Rules */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold text-slate-700 block">تفکیک اقلام و ضرایب اعمال‌شده:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {previewResult.trace.appliedRules.map((rule, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <span className="text-slate-800 font-semibold">{rule.nameFa}</span>
                      <span className="font-mono font-bold text-amber-900">
                        {rule.valueToman.toLocaleString('fa-IR')} ت
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GUARDRAILS */}
      {activeTab === 'guardrails' && (
        <div className="max-w-3xl bg-white border border-slate-200 rounded-3xl p-7 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base font-display flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                تنظیمات گاردریل‌های مالی و ایمنی تجاری (Financial Guardrails)
              </h3>
              <p className="text-slate-500 mt-1 text-xs">
                بر اساس قوانین BR-030 و BR-034، گاردریل‌های کف سود هرگز به صورت خاموش نقض نمی‌شوند.
              </p>
            </div>

            {/* Per-Surface Toggle for Guardrails */}
            <SurfaceModeToggle
              surfaceId="guardrails"
              surfaceTitleFa="گاردریل‌های مالی"
              mode={guardrailsSurfaceMode.mode}
              onToggle={guardrailsSurfaceMode.toggleMode}
              onSetMode={guardrailsSurfaceMode.setMode}
            />
          </div>

          {/* Simple Mode Guardrails */}
          {!guardrailsSurfaceMode.isAdvanced && (
            <div className="space-y-6">
              {/* Min Margin Slider */}
              <div className="p-5 rounded-3xl bg-amber-50/50 border border-amber-200/80 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-800 text-xs">حداقل کف حاشیه سود (Margin Floor):</label>
                  <span className="font-mono font-bold text-amber-800 text-sm bg-amber-100/80 px-2.5 py-0.5 rounded-lg">
                    {minMargin}٪
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={35}
                  step={0.5}
                  value={minMargin}
                  onChange={(e) => setMinMargin(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
                <p className="text-[11px] text-slate-500">
                  اگر سود بارنامه‌ای به زیر این مقدار برسد، سیستم مانع از صدور شده یا قیمت را به کف سود کلمپ می‌کند.
                </p>
              </div>

              {/* Max Discount Slider */}
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-800 text-xs">سقف کل تخفیف‌های تجمیعی (Max Discount Cap):</label>
                  <span className="font-mono font-bold text-slate-800 text-sm bg-slate-200 px-2.5 py-0.5 rounded-lg">
                    {maxDiscountCap}٪
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={45}
                  step={1}
                  value={maxDiscountCap}
                  onChange={(e) => setMaxDiscountCap(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
              </div>

              {/* Mode Selection */}
              <div className="space-y-2.5">
                <label className="font-bold text-slate-800 text-xs">رفتار سیستم در زمان نقض کف سود:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGuardrailMode('clamp')}
                    className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
                      guardrailMode === 'clamp'
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="font-bold text-emerald-900 block mb-1">تعدیل خودکار به کف سود (Clamp)</span>
                    <span className="text-[11px] text-emerald-700">قیمت به کف مجاز بالا کشیده می‌شود.</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGuardrailMode('reject')}
                    className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
                      guardrailMode === 'reject'
                        ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="font-bold text-rose-900 block mb-1">رد کامل استعلام (Reject)</span>
                    <span className="text-[11px] text-rose-700">استعلام به کمیته قیمت‌گذاری ارجاع می‌شود.</span>
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveGuardrails}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl text-xs shadow-xs transition-all cursor-pointer"
              >
                ثبت و ذخیره گاردریل‌های مالی
              </button>
            </div>
          )}

          {/* Advanced Mode Guardrails */}
          {guardrailsSurfaceMode.isAdvanced && (
            <div className="space-y-4 bg-slate-900 text-slate-200 p-6 rounded-3xl border border-slate-700">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <span className="text-amber-400 font-mono font-bold">پیکربندی پیشرفته گاردریل‌های حاکمیت مالی</span>
                <span className="text-[10px] font-mono bg-slate-800 text-amber-300 px-2 py-0.5 rounded">MFA Required</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 text-[11px]">کف حاشیه سود برای ناوگان سنگین:</label>
                  <input
                    type="number"
                    value={minMargin}
                    onChange={(e) => setMinMargin(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-amber-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 text-[11px]">حداقل مبلغ مطلق صدور بارنامه (تومان):</label>
                  <input
                    type="number"
                    value={minAbsolutePrice}
                    onChange={(e) => setMinAbsolutePrice(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-amber-300"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSaveGuardrails}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-2xl text-xs shadow-xs cursor-pointer"
                >
                  ذخیره گاردریل‌های پیشرفته با امضای حاکمیتی
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: LIVE PREVIEW & SANDBOX */}
      {activeTab === 'preview' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-7 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base font-display flex items-center gap-2">
                <Play className="w-5 h-5 text-emerald-700" />
                محیط اجرای زنده و آزمایشگاه ارزیابی تعرفه
              </h3>
              <p className="text-slate-500 mt-1 text-xs">
                تغییرات شما در تمامی قوانین به صورت آنی در این ماشین‌حساب محاسبه و قابل مقایسه است.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4 bg-slate-50 p-5 rounded-3xl border border-slate-200">
              <h4 className="font-bold text-slate-800 text-xs">پارامترهای بار نمونه:</h4>

              <div className="space-y-1">
                <CityPickerDropdown value={testOrigin} onChange={setTestOrigin} label="مبدأ" />
              </div>

              <div className="space-y-1">
                <CityPickerDropdown value={testDestination} onChange={setTestDestination} label="مقصد" />
              </div>

              <div className="space-y-1">
                <VehiclePickerDropdown value={testVehicle} onChange={setTestVehicle} />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-700 font-bold block mb-1">وزن بار (تن):</label>
                <input
                  type="number"
                  min={1}
                  max={40}
                  value={testWeight}
                  onChange={(e) => setTestWeight(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-mono font-bold"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer text-xs p-2 rounded-xl hover:bg-white transition-colors">
                  <input
                    type="checkbox"
                    checked={testColdChain}
                    onChange={(e) => setTestColdChain(e.target.checked)}
                    className="rounded text-amber-600"
                  />
                  <span>زنجیره سرد</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs p-2 rounded-xl hover:bg-white transition-colors">
                  <input
                    type="checkbox"
                    checked={testHazardous}
                    onChange={(e) => setTestHazardous(e.target.checked)}
                    className="rounded text-amber-600"
                  />
                  <span>کالای خطرناک ADR</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs p-2 rounded-xl hover:bg-white transition-colors">
                  <input
                    type="checkbox"
                    checked={testPeakSeason}
                    onChange={(e) => setTestPeakSeason(e.target.checked)}
                    className="rounded text-amber-600"
                  />
                  <span>پیک فصلی تره‌بار</span>
                </label>
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 shadow-sm border border-slate-800">
                <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                  <span className="text-slate-400 text-xs">نتیجه محاسبات کرایه موتور قوانین:</span>
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-0.5 rounded-full text-xs font-mono font-bold">
                    Passed Guardrails
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-amber-400 font-mono">
                    {previewResult.finalPriceToman.toLocaleString('fa-IR')}
                  </span>
                  <span className="text-sm text-slate-300">تومان</span>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700">
                    <span className="text-slate-400 block text-[11px]">پیمایش مسیر:</span>
                    <span className="font-mono text-slate-100 font-bold mt-0.5 block">{previewResult.distanceKm} کیلومتر</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700">
                    <span className="text-slate-400 block text-[11px]">حاشیه سود:</span>
                    <span className="font-mono text-emerald-400 font-bold mt-0.5 block">{previewResult.marginPercent.toFixed(1)}٪</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700">
                    <span className="text-slate-400 block text-[11px]">نرخ هر تن:</span>
                    <span className="font-mono text-amber-300 font-bold mt-0.5 block">
                      {Math.round(previewResult.pricePerTonToman).toLocaleString('fa-IR')} ت
                    </span>
                  </div>
                </div>
              </div>

              {/* Applied Rules Detail */}
              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
                <h5 className="font-bold text-slate-800 text-xs">گام‌های محاسباتی و افزودنی‌های اعمال‌شده:</h5>
                <div className="space-y-2">
                  {previewResult.trace.appliedRules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-2xs"
                    >
                      <div>
                        <span className="font-bold text-slate-800 block text-xs">{rule.nameFa}</span>
                        <span className="text-[11px] text-slate-400">{rule.note}</span>
                      </div>
                      <span className="font-mono font-bold text-amber-900 text-xs">
                        +{rule.valueToman.toLocaleString('fa-IR')} تومان
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW RULE BLOCK MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 font-display">
                <Plus className="w-4 h-4 text-emerald-600" />
                تعریف بلوک قاعده جدید تعرفه
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <ModernSelect
                  id="new-block-type-select"
                  value={newBlockType}
                  onChange={(val) => setNewBlockType(val as RuleBlockType)}
                  label="نوع قاعده تعرفه"
                  options={[
                    { value: 'custom_formula', label: 'اضافه کرایه سفارشی درصدی', badge: 'درصدی' },
                    { value: 'peak_season_multiplier', label: 'ضریب پیک فصلی تقاضا', badge: 'فصلی' },
                    { value: 'distance_rate', label: 'اضافه کرایه بر مبنای پیمایش مسافت', badge: 'پیمایشی' },
                  ]}
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold text-xs">عنوان فارسی قانون:</label>
                <input
                  type="text"
                  placeholder="مثال: عوارض شبانه تردد کلانشهرها"
                  value={newBlockNameFa}
                  onChange={(e) => setNewBlockNameFa(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold text-xs">درصد اضافه کرایه (+٪):</label>
                <input
                  type="number"
                  value={newBlockPercent}
                  onChange={(e) => setNewBlockPercent(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold cursor-pointer"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleCreateNewBlock}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-bold shadow-xs cursor-pointer"
              >
                ایجاد و فعال‌سازی بلوک
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
