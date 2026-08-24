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
  ArrowLeftRight,
  Sliders,
  Scale,
  Power,
  Code2,
  Check,
  Percent,
  Calculator,
  SlidersHorizontal,
  X,
  Building2,
  Compass,
  Truck,
  TrendingUp,
  Package,
  RotateCcw,
  Boxes,
} from 'lucide-react';
import { usePricing } from '../../../store/PricingContext';
import { ObjectHeader } from '../../layout/ObjectHeader';
import { RuleBlock, RuleBlockType } from '../../../types/pricing';
import { ShipmentPricingContext } from '../../../engine/pricingEngine';
import { CityPickerDropdown } from '../../common/menus/CityPickerDropdown';
import { VehiclePickerDropdown } from '../../common/menus/VehiclePickerDropdown';
import { ContractPickerDropdown } from '../../common/menus/ContractPickerDropdown';
import { CommodityPickerDropdown } from '../../common/menus/CommodityPickerDropdown';
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
  } = usePricing();

  const [activeTab, setActiveTab] = useState<'canvas' | 'guardrails' | 'preview'>('canvas');
  const [selectedBlockId, setSelectedBlockId] = useState<string>('blk-base-matrix');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Surface mode hooks
  const surfaceModeState = useSurfaceMode(selectedBlockId, 'simple');
  const guardrailsSurfaceMode = useSurfaceMode('guardrails', 'simple');

  // Guardrails State
  const [minMargin, setMinMargin] = useState(pricingPolicy.guardrails.minMarginPercent);
  const [maxDiscountCap, setMaxDiscountCap] = useState(pricingPolicy.guardrails.maxDiscountCapPercent);
  const [guardrailMode, setGuardrailMode] = useState<'clamp' | 'reject'>(pricingPolicy.guardrails.mode);
  const [minAbsolutePrice, setMinAbsolutePrice] = useState(pricingPolicy.guardrails.minAbsolutePriceToman || 10000000);

  // Selected Block Form State
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
  const [testCommodity, setTestCommodity] = useState('مواد غذایی و فاسدشدنی');
  const [testWeight, setTestWeight] = useState(22);
  const [testColdChain, setTestColdChain] = useState(false);
  const [testHazardous, setTestHazardous] = useState(false);
  const [testPeakSeason, setTestPeakSeason] = useState(false);
  const [testContractId, setTestContractId] = useState<string>('');

  const routePresets = [
    { origin: 'تهران', dest: 'بندرعباس', label: 'تهران ➔ بندرعباس (کریدور کانتینری)' },
    { origin: 'اصفهان', dest: 'چابهار', label: 'اصفهان ➔ چابهار (ترانزیت شرق)' },
    { origin: 'مشهد', dest: 'بوشهر', label: 'مشهد ➔ بوشهر (انرژی و خلیج‌فارس)' },
    { origin: 'تبریز', dest: 'اهواز', label: 'تبریز ➔ اهواز (صنایع و پتروشیمی)' },
  ];

  const handleSwapRoute = () => {
    const temp = testOrigin;
    setTestOrigin(testDestination);
    setTestDestination(temp);
  };

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
    cargoType:
      testCommodity ||
      (testColdChain
        ? 'کالای فاسدشدنی زنجیره سرد'
        : testHazardous
        ? 'مواد شیمیایی خطرناک ADR'
        : 'کالای عمومی تجاری'),
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

    showToast(`قاعده «${selectedBlock.nameFa}» ذخیره شد.`);
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

    showToast(`پیکربندی پیشرفته قاعده «${selectedBlock.nameFa}» اعمال گردید.`);
  };

  const handleSaveGuardrails = () => {
    updatePricingPolicyGuardrails(minMargin, maxDiscountCap, guardrailMode);
    showToast('تنظیمات گاردریل‌های مالی ذخیره شد.');
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
    showToast(`بلوک قاعده «${newBlock.nameFa}» اضافه شد.`);
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
    <div className="space-y-5 text-xs antialiased text-slate-800">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-lg border border-emerald-500/30 flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
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

      {/* Minimal Sub-Navigation Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-2.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setActiveTab('canvas')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs transition-colors cursor-pointer shrink-0 ${
              activeTab === 'canvas'
                ? 'bg-amber-500 text-slate-950 font-black shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>بوم خط‌لوله قواعد تعرفه</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono font-bold ${
              activeTab === 'canvas' ? 'bg-amber-600/30 text-slate-950' : 'bg-slate-100 text-slate-500'
            }`}>
              {(pricingPolicy?.ruleBlocks || []).length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guardrails')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs transition-colors cursor-pointer shrink-0 ${
              activeTab === 'guardrails'
                ? 'bg-amber-500 text-slate-950 font-black shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>گاردریل‌های مالی و حاشیه سود</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs transition-colors cursor-pointer shrink-0 ${
              activeTab === 'preview'
                ? 'bg-amber-500 text-slate-950 font-black shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>ماشین‌حساب و آزمایشگاه زنده</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>افزودن قاعده جدید</span>
        </button>
      </div>

      {/* TAB 1: VISUAL PRICING CANVAS */}
      {activeTab === 'canvas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Computational Pipeline (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div>
                  <h3 className="font-bold text-slate-900 text-xs">ترتیب اجرای خط‌لوله کرایه</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">اعمال متوالی روی نرخ پایه کرایه بر حسب اولویت</p>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono font-bold">
                  {(pricingPolicy?.ruleBlocks || []).length} بلوک
                </span>
              </div>

              <div className="space-y-2">
                {(pricingPolicy?.ruleBlocks || []).map((block, idx) => {
                  const Icon = getBlockIcon(block.type);
                  const isSelected = selectedBlockId === block.id;

                  return (
                    <div
                      key={block.id}
                      onClick={() => setSelectedBlockId(block.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-amber-50/70 border-amber-400 ring-1 ring-amber-400/40 shadow-2xs'
                          : block.enabled
                          ? 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/60'
                          : 'bg-slate-50 border-slate-200/60 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <span className="w-5 h-5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 border border-slate-200/60">
                          {idx + 1}
                        </span>
                        <div
                          className={`p-1.5 rounded-lg shrink-0 ${
                            block.enabled
                              ? 'bg-amber-50 text-amber-800 border border-amber-200/80'
                              : 'bg-slate-100 text-slate-400 border border-slate-200'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 text-xs truncate">{block.nameFa}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] font-mono text-slate-500">
                              {block.type}
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono">
                              اولویت: {block.priority}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => toggleRuleBlock(block.id)}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            block.enabled
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
                          }`}
                          title={block.enabled ? 'غیرفعال‌سازی' : 'فعال‌سازی'}
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

          {/* Right Column: Selected Rule Inspector & Live Mini-Calculator (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {selectedBlock ? (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
                {/* Surface Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-700 shrink-0">
                      {React.createElement(getBlockIcon(selectedBlock.type), { className: 'w-4 h-4' })}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-xs">{selectedBlock.nameFa}</h4>
                        <span className="text-[9px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded border border-slate-200">
                          {selectedBlock.id}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">{selectedBlock.nameEn}</p>
                    </div>
                  </div>

                  {/* Surface Mode Toggle */}
                  <SurfaceModeToggle
                    surfaceId={selectedBlock.id}
                    surfaceTitleFa={selectedBlock.nameFa}
                    mode={surfaceModeState.mode}
                    onToggle={surfaceModeState.toggleMode}
                    onSetMode={surfaceModeState.setMode}
                  />
                </div>

                {/* Read-Only Advanced Summary Card if in Simple Mode */}
                {!isSelectedBlockAdvanced &&
                  (selectedBlock.config?.formula ||
                    selectedBlock.config?.hookEndpoint ||
                    (selectedBlock.config?.mountainousRoutes && selectedBlock.config.mountainousRoutes.length > 0)) && (
                    <AdvancedConfigSummaryCard
                      surfaceTitleFa={selectedBlock.nameFa}
                      onSwitchToAdvanced={() => surfaceModeState.setMode('advanced')}
                      summaryItems={[
                        ...(selectedBlock.config?.formula
                          ? [{ label: 'فرمول AST', value: selectedBlock.config.formula, isCode: true }]
                          : []),
                        ...(selectedBlock.config?.hookEndpoint
                          ? [{ label: 'وب‌سرویس تعدیل', value: selectedBlock.config.hookEndpoint, isCode: true }]
                          : []),
                        ...(selectedBlock.config?.mountainousRoutes && selectedBlock.config.mountainousRoutes.length > 0
                          ? [{ label: 'کریدورهای مشمول', value: selectedBlock.config.mountainousRoutes.join('، ') }]
                          : []),
                        { label: 'اولویت اجرای خط‌لوله', value: `سطح ${selectedBlock.priority}` },
                      ]}
                    />
                  )}

                {/* SIMPLE MODE CONTROLS */}
                {!isSelectedBlockAdvanced && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-slate-700 font-bold text-xs">عنوان قاعده:</label>
                        <input
                          type="text"
                          value={blockNameFa}
                          onChange={(e) => setBlockNameFa(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-700 font-bold text-xs">وضعیت اعمال در خط‌لوله:</label>
                        <button
                          type="button"
                          onClick={() => setBlockEnabled(!blockEnabled)}
                          className={`w-full py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                            blockEnabled
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-rose-50 text-rose-800 border-rose-300'
                          }`}
                        >
                          <Power className="w-3.5 h-3.5" />
                          <span>{blockEnabled ? 'فعال در خط‌لوله' : 'غیرفعال (عدم اعمال)'}</span>
                        </button>
                      </div>
                    </div>

                    {selectedBlock.type === 'base_matrix' ? (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-800 font-bold text-xs">ماتریس تعرفه پایه مبدأ-مقصد و ناوگان:</span>
                          <span className="font-mono text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 text-xs">
                            {routeMatrix.length} کریدور فعال
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          نرخ‌های پایه به ازای هر کیلومتر یا تن از ماتریس جغرافیایی استخراج می‌گردد. جهت ویرایش تفکیکی کریدورها به تب ماتریس چندبعدی مراجعه فرمایید.
                        </p>
                      </div>
                    ) : (
                      <div className="bg-amber-50/40 p-4 rounded-xl border border-amber-200/70 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                            <Percent className="w-3.5 h-3.5 text-amber-600" />
                            <span>
                              {selectedBlock.type === 'fuel_surcharge_hook'
                                ? 'درصد اضافه کرایه تعدیل سوخت:'
                                : selectedBlock.type === 'mountainous_surcharge'
                                ? 'درصد اضافه کرایه صعوبت مسیر کوهستانی:'
                                : selectedBlock.type === 'cold_chain_addon'
                                ? 'درصد حق‌الزحمه کمپرسور زنجیره سرد:'
                                : selectedBlock.type === 'hazardous_adr_addon'
                                ? 'درصد حق بار و تجهیزات ایمنی ADR:'
                                : selectedBlock.type === 'peak_season_multiplier'
                                ? 'درصد اضافه کرایه پیک فصلی:'
                                : 'درصد اضافه کرایه:'}
                            </span>
                          </label>
                          <span className="text-sm font-black text-amber-800 font-mono">+{blockPercent}٪</span>
                        </div>

                        <input
                          type="range"
                          min={0}
                          max={50}
                          step={1}
                          value={blockPercent}
                          onChange={(e) => setBlockPercent(Number(e.target.value))}
                          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                        />

                        {/* Quick Presets */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] text-slate-400">پیش‌تنظیم‌های متداول:</span>
                          {[5, 10, 12, 15, 18, 20, 25, 30].map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => setBlockPercent(preset)}
                              className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                                blockPercent === preset
                                  ? 'bg-amber-600 text-white'
                                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              +{preset}٪
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleSaveSimpleBlock}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>ذخیره تغییرات قاعده</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ADVANCED MODE CONTROLS */}
                {isSelectedBlockAdvanced && (
                  <div className="space-y-3 bg-slate-900 text-slate-200 p-4 rounded-xl border border-slate-700">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                      <div className="flex items-center gap-1.5 text-amber-400 font-mono font-bold text-xs">
                        <Code2 className="w-3.5 h-3.5" />
                        <span>پیکربندی مهندسی و فرمول AST (Advanced Mode)</span>
                      </div>
                      <span className="text-[9px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded border border-slate-700">
                        Rule AST v2.4
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="space-y-1">
                        <label className="text-slate-400 text-[10px]">عنوان فارسی:</label>
                        <input
                          type="text"
                          value={blockNameFa}
                          onChange={(e) => setBlockNameFa(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-200 text-[10px] font-medium">اولویت خط‌لوله (Priority):</label>
                        <input
                          type="number"
                          value={blockPriority}
                          onChange={(e) => setBlockPriority(Number(e.target.value))}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-200 text-[10px] font-medium">درصد اضافه کرایه:</label>
                        <input
                          type="number"
                          value={blockPercent}
                          onChange={(e) => setBlockPercent(Number(e.target.value))}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-200 text-[10px] font-medium flex items-center justify-between">
                        <span>عبارت محاسباتی (AST Expression):</span>
                        <span className="text-[9px] text-amber-400 font-mono font-bold">متغیرها: base, distance, weight, fuel_index</span>
                      </label>
                      <textarea
                        rows={2}
                        value={blockFormula}
                        onChange={(e) => setBlockFormula(e.target.value)}
                        className="w-full bg-slate-950 font-mono text-amber-300 border border-slate-700 rounded-lg p-2.5 text-xs leading-relaxed focus:outline-none focus:border-amber-400"
                        placeholder="baseRate * (1 + (fuelMultiplier - 1))"
                      />
                    </div>

                    {selectedBlock.type === 'fuel_surcharge_hook' && (
                      <div className="space-y-1">
                        <label className="text-slate-200 text-[10px] font-medium">آدرس وب‌سرویس نرخ سوخت (Webhook Endpoint):</label>
                        <input
                          type="text"
                          value={blockHookUrl}
                          onChange={(e) => setBlockHookUrl(e.target.value)}
                          className="w-full bg-slate-800 font-mono text-sky-300 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-amber-400"
                          placeholder="/api/connectors/fuel-index"
                        />
                      </div>
                    )}

                    {selectedBlock.type === 'mountainous_surcharge' && (
                      <div className="space-y-1.5">
                        <label className="text-slate-200 text-[10px] font-medium">کریدورهای مشمول اضافه کرایه کوهستانی:</label>
                        <div className="flex flex-wrap gap-1">
                          {blockRoutes.map((route, i) => (
                            <span
                              key={i}
                              className="bg-slate-800 text-amber-300 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1"
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
                            className="bg-slate-800 text-slate-100 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-amber-400 flex-1"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (newRouteInput.trim()) {
                                setBlockRoutes([...blockRoutes, newRouteInput.trim()]);
                                setNewRouteInput('');
                              }
                            }}
                            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-amber-300 rounded-lg text-xs font-bold cursor-pointer shrink-0"
                          >
                            + افزودن کریدور
                          </button>
                        </div>
                      </div>
                    )}

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
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>حذف این بلوک سفارشی</span>
                        </button>
                      )}
                      <div className="flex-1" />
                      <button
                        type="button"
                        onClick={handleSaveAdvancedBlock}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>ذخیره پیکربندی مهندسی</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            {/* LIVE CALCULATION SANDBOX */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
              {/* Header with Title & Real-Time Status */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 flex items-center justify-center shadow-2xs">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">شبیه‌ساز و آزمایشگاه قیمت‌گذاری آنی</h4>
                    <p className="text-[10px] text-slate-500">ارزیابی بلادرنگ اثر تغییر قواعد، ماتریس‌ها و گاردریل‌ها بر کرایه بارنامه</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-bold flex items-center gap-1.5 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>محاسبه زنده Real-Time</span>
                  </span>
                </div>
              </div>

              {/* Quick Route Presets */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
                <span className="text-[10px] text-slate-400 font-bold shrink-0 ml-1">کریدورهای متداول:</span>
                {routePresets.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTestOrigin(p.origin);
                      setTestDestination(p.dest);
                    }}
                    className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold transition-all shrink-0 cursor-pointer ${
                      testOrigin === p.origin && testDestination === p.dest
                        ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-2xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Section 1: Route Details (Spacious 2 columns with Swap button) */}
              <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/90 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-amber-600" />
                    <span>۱. مبدأ بارگیری و مقصد تخلیه کالا</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    فاصله برآوردی: {previewResult.distanceKm} کیلومتر
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-11 gap-2.5 items-end">
                  <div className="sm:col-span-5">
                    <CityPickerDropdown
                      id="sandbox-origin"
                      value={testOrigin}
                      onChange={setTestOrigin}
                      label="مبدأ بارگیری"
                      type="origin"
                    />
                  </div>

                  <div className="sm:col-span-1 flex justify-center pb-1">
                    <button
                      type="button"
                      onClick={handleSwapRoute}
                      className="p-2.5 rounded-xl bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-slate-600 hover:text-amber-700 transition-colors shadow-2xs flex items-center justify-center gap-1 w-full text-xs font-bold cursor-pointer"
                      title="جابجایی مبدأ و مقصد"
                    >
                      <ArrowLeftRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="sm:col-span-5">
                    <CityPickerDropdown
                      id="sandbox-destination"
                      value={testDestination}
                      onChange={setTestDestination}
                      label="مقصد تخلیه"
                      type="destination"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Fleet, Weight & Commodity */}
              <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/90 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-amber-600" />
                    <span>۲. تیپ ناوگان، تناژ بار و دسته‌بندی کالا</span>
                  </span>
                  <span className="text-[10px] text-slate-400">تنظیم مشخصات فیزیکی</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Vehicle Picker */}
                  <div>
                    <VehiclePickerDropdown
                      id="sandbox-vehicle"
                      value={testVehicle}
                      onChange={setTestVehicle}
                      label="نوع ناوگان باربری"
                    />
                  </div>

                  {/* Cargo Weight with Stepper & Quick presets */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-slate-700 font-bold text-xs flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5 text-amber-600" />
                        <span>وزن محموله (تناژ خالص):</span>
                      </label>
                      <div className="flex items-center gap-1 text-[10px]">
                        {[5, 10, 15, 22, 25].map((w) => (
                          <button
                            key={w}
                            type="button"
                            onClick={() => setTestWeight(w)}
                            className={`px-1.5 py-0.5 rounded transition-colors font-mono cursor-pointer ${
                              testWeight === w
                                ? 'bg-amber-500 text-white font-bold'
                                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                            }`}
                          >
                            {w}ت
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setTestWeight(Math.max(1, testWeight - 1))}
                        className="w-9 h-9 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm cursor-pointer shadow-2xs"
                      >
                        -
                      </button>
                      <div className="relative flex-1">
                        <input
                          type="number"
                          min={1}
                          max={60}
                          value={testWeight}
                          onChange={(e) => setTestWeight(Number(e.target.value))}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-center text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500 shadow-2xs"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">تن</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setTestWeight(Math.min(60, testWeight + 1))}
                        className="w-9 h-9 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm cursor-pointer shadow-2xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Commodity & Contract Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <CommodityPickerDropdown
                      id="sandbox-commodity"
                      value={testCommodity}
                      onChange={setTestCommodity}
                      label="نوع کالا و شرایط بسته‌بندی"
                    />
                  </div>

                  <div>
                    <ContractPickerDropdown
                      id="sandbox-contract"
                      contracts={contracts}
                      value={testContractId}
                      onChange={setTestContractId}
                      label="قرارداد سازمانی و تخفیف"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Special Multipliers & Surcharges (Interactive Cards) */}
              <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/90 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>۳. شرایط ویژه و ضرایب عملیاتی افزایشی</span>
                  </span>
                  <span className="text-[10px] text-slate-400">تأثیرگذاری آنی بر محاسبات</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <label
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      testColdChain
                        ? 'bg-teal-50/90 border-teal-300 ring-1 ring-teal-400/30'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={testColdChain}
                        onChange={(e) => setTestColdChain(e.target.checked)}
                        className="rounded text-teal-600 accent-teal-600 cursor-pointer"
                      />
                      <div className="flex items-center gap-1.5">
                        <Snowflake className={`w-3.5 h-3.5 ${testColdChain ? 'text-teal-600' : 'text-slate-400'}`} />
                        <span className="text-xs font-bold text-slate-800">زنجیره سرد</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-100/80 px-1.5 py-0.2 rounded">
                      +۱۸٪
                    </span>
                  </label>

                  <label
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      testHazardous
                        ? 'bg-rose-50/90 border-rose-300 ring-1 ring-rose-400/30'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={testHazardous}
                        onChange={(e) => setTestHazardous(e.target.checked)}
                        className="rounded text-rose-600 accent-rose-600 cursor-pointer"
                      />
                      <div className="flex items-center gap-1.5">
                        <Flame className={`w-3.5 h-3.5 ${testHazardous ? 'text-rose-600' : 'text-slate-400'}`} />
                        <span className="text-xs font-bold text-slate-800">کالای خطرناک ADR</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-100/80 px-1.5 py-0.2 rounded">
                      +۲۵٪
                    </span>
                  </label>

                  <label
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      testPeakSeason
                        ? 'bg-amber-50/90 border-amber-300 ring-1 ring-amber-400/30'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={testPeakSeason}
                        onChange={(e) => setTestPeakSeason(e.target.checked)}
                        className="rounded text-amber-600 accent-amber-600 cursor-pointer"
                      />
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className={`w-3.5 h-3.5 ${testPeakSeason ? 'text-amber-600' : 'text-slate-400'}`} />
                        <span className="text-xs font-bold text-slate-800">پیک فصلی تقاضا</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100/80 px-1.5 py-0.2 rounded">
                      +۱۵٪
                    </span>
                  </label>
                </div>
              </div>

              {/* Section 4: Live Price Result & Executive Metrics */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3.5 shadow-md border border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs">کرایه نهایی برآورد شده موتور قواعد:</span>
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Passed Guardrails</span>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedTrace(previewResult.trace)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <FileSearch className="w-3.5 h-3.5" />
                    <span>مشاهده ردگیری کامل (Trace)</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-amber-400 font-mono tracking-tight">
                        {previewResult.finalPriceToman.toLocaleString('fa-IR')}
                      </span>
                      <span className="text-xs text-slate-300 font-bold">تومان</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      مبلغ خالص کرایه بارنامه به تومان
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 w-full sm:w-auto text-xs">
                    <div className="p-2 rounded-xl bg-slate-800/90 border border-slate-700/70 text-center min-w-[90px]">
                      <span className="text-slate-400 block text-[10px]">پیمایش مسیر</span>
                      <span className="font-mono text-slate-100 font-bold mt-0.5 block text-xs">
                        {previewResult.distanceKm} km
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-800/90 border border-slate-700/70 text-center min-w-[90px]">
                      <span className="text-slate-400 block text-[10px]">حاشیه سود</span>
                      <span className="font-mono text-emerald-400 font-bold mt-0.5 block text-xs">
                        {previewResult.marginPercent.toFixed(1)}٪
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-800/90 border border-slate-700/70 text-center min-w-[90px]">
                      <span className="text-slate-400 block text-[10px]">نرخ هر تن</span>
                      <span className="font-mono text-amber-300 font-bold mt-0.5 block text-xs">
                        {Math.round(previewResult.pricePerTonToman).toLocaleString('fa-IR')} ت
                      </span>
                    </div>
                  </div>
                </div>

                {/* Transparent Applied Rule Steps */}
                <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-300 block">گام‌های محاسباتی و افزودنی‌های اعمال‌شده:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {previewResult.trace.appliedRules.map((rule, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between text-xs"
                      >
                        <div className="min-w-0 flex-1 pl-2">
                          <span className="text-slate-200 font-bold block truncate text-[11px]">{rule.nameFa}</span>
                          <span className="text-[10px] text-slate-300 block truncate">{rule.note}</span>
                        </div>
                        <span className="font-mono font-bold text-amber-400 shrink-0 text-xs">
                          +{rule.valueToman.toLocaleString('fa-IR')} ت
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GUARDRAILS */}
      {activeTab === 'guardrails' && (
        <div className="max-w-3xl bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                تنظیمات گاردریل‌های مالی و ایمنی تجاری (Financial Guardrails)
              </h3>
              <p className="text-slate-500 mt-0.5 text-xs">
                بر اساس ضوابط BR-030 و BR-034، گاردریل‌های کف سود هرگز به صورت خاموش نقض نمی‌شوند.
              </p>
            </div>

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
            <div className="space-y-5">
              {/* Min Margin Slider */}
              <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-2.5">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-800 text-xs">حداقل کف حاشیه سود (Margin Floor):</label>
                  <span className="font-mono font-bold text-amber-800 text-xs bg-amber-100/80 px-2 py-0.5 rounded">
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
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
                <p className="text-[10px] text-slate-500">
                  اگر سود بارنامه‌ای کمتر از این درصد شود، قیمت خودکار به کف سود کلمپ شده یا استعلام رد می‌شود.
                </p>
              </div>

              {/* Max Discount Slider */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-800 text-xs">سقف کل تخفیف‌های تجمیعی (Max Discount Cap):</label>
                  <span className="font-mono font-bold text-slate-800 text-xs bg-slate-200 px-2 py-0.5 rounded">
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
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
              </div>

              {/* Mode Selection */}
              <div className="space-y-2">
                <label className="font-bold text-slate-800 text-xs">رفتار سیستم در زمان نقض کف سود:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGuardrailMode('clamp')}
                    className={`p-3.5 rounded-xl border text-right transition-colors cursor-pointer ${
                      guardrailMode === 'clamp'
                        ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500/30'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="font-bold text-emerald-900 block text-xs mb-0.5">تعدیل خودکار به کف سود (Clamp)</span>
                    <span className="text-[10px] text-emerald-700">قیمت به کف مجاز بالا کشیده می‌شود.</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGuardrailMode('reject')}
                    className={`p-3.5 rounded-xl border text-right transition-colors cursor-pointer ${
                      guardrailMode === 'reject'
                        ? 'bg-rose-50 border-rose-500 ring-1 ring-rose-500/30'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="font-bold text-rose-900 block text-xs mb-0.5">رد کامل استعلام (Reject)</span>
                    <span className="text-[10px] text-rose-700">استعلام به کمیته تعرفه و قیمت‌گذاری ارجاع می‌گردد.</span>
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveGuardrails}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-2xs transition-colors cursor-pointer"
              >
                ثبت و ذخیره گاردریل‌های مالی
              </button>
            </div>
          )}

          {/* Advanced Mode Guardrails */}
          {guardrailsSurfaceMode.isAdvanced && (
            <div className="space-y-3 bg-slate-900 text-slate-200 p-5 rounded-2xl border border-slate-700">
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <span className="text-amber-400 font-mono font-bold text-xs">پیکربندی پیشرفته گاردریل‌های حاکمیت مالی</span>
                <span className="text-[9px] font-mono bg-slate-800 text-amber-300 px-1.5 py-0.2 rounded">MFA Required</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-200 text-[10px] font-medium">کف حاشیه سود برای ناوگان سنگین (٪):</label>
                  <input
                    type="number"
                    value={minMargin}
                    onChange={(e) => setMinMargin(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-amber-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-200 text-[10px] font-medium">حداقل مبلغ مطلق صدور بارنامه (تومان):</label>
                  <input
                    type="number"
                    value={minAbsolutePrice}
                    onChange={(e) => setMinAbsolutePrice(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-amber-300"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSaveGuardrails}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-2xs cursor-pointer"
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
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 flex items-center justify-center shadow-2xs">
                <Play className="w-5 h-5 fill-emerald-600/20" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span>محیط آزمایشگاهی و شبیه‌ساز زنده قیمت‌گذاری بارنامه</span>
                </h3>
                <p className="text-slate-500 mt-0.5 text-xs">
                  تغییرات تمامی قوانین، ماتریس‌های مبدأ/مقصد و گاردریل‌ها به صورت بلادرنگ در این آزمایشگاه محاسبه و آزمون می‌گردند.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-bold flex items-center gap-2 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>موتور شبیه‌سازی فعال (Real-Time Sandbox)</span>
              </span>
            </div>
          </div>

          {/* Quick Route Presets */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 shrink-0 ml-1">
              <Compass className="w-4 h-4 text-amber-600" />
              <span>کریدورهای پیش‌فرض شبیه‌سازی:</span>
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {routePresets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTestOrigin(p.origin);
                    setTestDestination(p.dest);
                  }}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                    testOrigin === p.origin && testDestination === p.dest
                      ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-2xs'
                      : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Input Parameters & Surcharges (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              {/* Section 1: Route */}
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-amber-600" />
                    <span>۱. مبدأ بارگیری و مقصد تحویل</span>
                  </span>
                  <span className="text-xs font-mono text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-bold">
                    فاصله زمینی: {previewResult.distanceKm} کیلومتر
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-11 gap-2.5 items-end">
                  <div className="sm:col-span-5">
                    <CityPickerDropdown
                      id="lab-origin"
                      value={testOrigin}
                      onChange={setTestOrigin}
                      label="مبدأ بارگیری"
                      type="origin"
                    />
                  </div>

                  <div className="sm:col-span-1 flex justify-center pb-1">
                    <button
                      type="button"
                      onClick={handleSwapRoute}
                      className="p-2.5 rounded-xl bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-slate-600 hover:text-amber-700 transition-colors shadow-2xs flex items-center justify-center gap-1 w-full text-xs font-bold cursor-pointer"
                      title="جابجایی مبدأ و مقصد"
                    >
                      <ArrowLeftRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="sm:col-span-5">
                    <CityPickerDropdown
                      id="lab-destination"
                      value={testDestination}
                      onChange={setTestDestination}
                      label="مقصد تخلیه"
                      type="destination"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Vehicle, Weight, Commodity & Contract */}
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-amber-600" />
                    <span>۲. مشخصات فیزیکی بار و نوع ناوگان</span>
                  </span>
                  <span className="text-[11px] text-slate-400">تنظیم پارامترهای بار</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <VehiclePickerDropdown
                      id="lab-vehicle"
                      value={testVehicle}
                      onChange={setTestVehicle}
                      label="نوع ناوگان باربری"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-slate-700 font-bold text-xs flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5 text-amber-600" />
                        <span>وزن محموله (تن):</span>
                      </label>
                      <div className="flex items-center gap-1 text-[10px]">
                        {[5, 10, 15, 22, 25].map((w) => (
                          <button
                            key={w}
                            type="button"
                            onClick={() => setTestWeight(w)}
                            className={`px-1.5 py-0.5 rounded transition-colors font-mono cursor-pointer ${
                              testWeight === w
                                ? 'bg-amber-500 text-white font-bold'
                                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                            }`}
                          >
                            {w}ت
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setTestWeight(Math.max(1, testWeight - 1))}
                        className="w-9 h-9 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm cursor-pointer shadow-2xs"
                      >
                        -
                      </button>
                      <div className="relative flex-1">
                        <input
                          type="number"
                          min={1}
                          max={60}
                          value={testWeight}
                          onChange={(e) => setTestWeight(Number(e.target.value))}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-center text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500 shadow-2xs"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">تن</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setTestWeight(Math.min(60, testWeight + 1))}
                        className="w-9 h-9 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm cursor-pointer shadow-2xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <CommodityPickerDropdown
                      id="lab-commodity"
                      value={testCommodity}
                      onChange={setTestCommodity}
                      label="نوع کالا و دسته‌بندی ریسک"
                    />
                  </div>

                  <div>
                    <ContractPickerDropdown
                      id="lab-contract"
                      contracts={contracts}
                      value={testContractId}
                      onChange={setTestContractId}
                      label="قرارداد سازمانی (تخفیف پله‌ای)"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Surcharges & Modifiers */}
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>۳. شرایط ویژه و ضرایب عملیاتی افزایشی</span>
                  </span>
                  <span className="text-[11px] text-slate-400">تأثیرگذاری آنی بر محاسبات</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <label
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      testColdChain
                        ? 'bg-teal-50 border-teal-300 ring-1 ring-teal-400/30'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={testColdChain}
                        onChange={(e) => setTestColdChain(e.target.checked)}
                        className="rounded text-teal-600 accent-teal-600 cursor-pointer"
                      />
                      <div className="flex items-center gap-1.5">
                        <Snowflake className={`w-4 h-4 ${testColdChain ? 'text-teal-600' : 'text-slate-400'}`} />
                        <span className="text-xs font-bold text-slate-800">زنجیره سرد</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-100/80 px-1.5 py-0.5 rounded">
                      +۱۸٪
                    </span>
                  </label>

                  <label
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      testHazardous
                        ? 'bg-rose-50 border-rose-300 ring-1 ring-rose-400/30'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={testHazardous}
                        onChange={(e) => setTestHazardous(e.target.checked)}
                        className="rounded text-rose-600 accent-rose-600 cursor-pointer"
                      />
                      <div className="flex items-center gap-1.5">
                        <Flame className={`w-4 h-4 ${testHazardous ? 'text-rose-600' : 'text-slate-400'}`} />
                        <span className="text-xs font-bold text-slate-800">کالای خطرناک ADR</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-100/80 px-1.5 py-0.5 rounded">
                      +۲۵٪
                    </span>
                  </label>

                  <label
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      testPeakSeason
                        ? 'bg-amber-50 border-amber-300 ring-1 ring-amber-400/30'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={testPeakSeason}
                        onChange={(e) => setTestPeakSeason(e.target.checked)}
                        className="rounded text-amber-600 accent-amber-600 cursor-pointer"
                      />
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className={`w-4 h-4 ${testPeakSeason ? 'text-amber-600' : 'text-slate-400'}`} />
                        <span className="text-xs font-bold text-slate-800">پیک فصلی تقاضا</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded">
                      +۱۵٪
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Execution Output, Financial Metrics & Step Breakdown (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              {/* Executive Price Card */}
              <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md border border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs">نتیجه محاسبات کرایه موتور قوانین:</span>
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Passed Guardrails</span>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedTrace(previewResult.trace)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <FileSearch className="w-3.5 h-3.5" />
                    <span>مشاهده ردگیری کامل (Trace)</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono tracking-tight">
                        {previewResult.finalPriceToman.toLocaleString('fa-IR')}
                      </span>
                      <span className="text-sm text-slate-300 font-bold">تومان</span>
                    </div>
                    <span className="text-xs text-slate-400 block mt-1">
                      مبلغ خالص کرایه بارنامه به تومان
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 w-full sm:w-auto text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-800/90 border border-slate-700/70 text-center min-w-[95px]">
                      <span className="text-slate-400 block text-[10px]">پیمایش مسیر</span>
                      <span className="font-mono text-slate-100 font-bold mt-0.5 block text-xs">
                        {previewResult.distanceKm} km
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-800/90 border border-slate-700/70 text-center min-w-[95px]">
                      <span className="text-slate-400 block text-[10px]">حاشیه سود</span>
                      <span className="font-mono text-emerald-400 font-bold mt-0.5 block text-xs">
                        {previewResult.marginPercent.toFixed(1)}٪
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-800/90 border border-slate-700/70 text-center min-w-[95px]">
                      <span className="text-slate-400 block text-[10px]">نرخ هر تن</span>
                      <span className="font-mono text-amber-300 font-bold mt-0.5 block text-xs">
                        {Math.round(previewResult.pricePerTonToman).toLocaleString('fa-IR')} ت
                      </span>
                    </div>
                  </div>
                </div>

                {/* Profit Margin Gauge */}
                <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 text-[11px]">وضعیت کف حاشیه سود حاکمیتی:</span>
                    <span className="text-emerald-400 font-mono font-bold text-xs">
                      {previewResult.marginPercent.toFixed(1)}٪ (تارگت حداقل {pricingPolicy.guardrails.minMarginPercent}٪)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (previewResult.marginPercent / 30) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Rule Pipeline Execution Breakdown */}
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-amber-600" />
                    <span>گام‌های محاسباتی و افزودنی‌های اعمال‌شده در خط‌لوله:</span>
                  </h5>
                  <span className="text-[10px] font-mono text-slate-500">
                    {previewResult.trace.appliedRules.length} قانون فعال
                  </span>
                </div>

                <div className="space-y-2">
                  {previewResult.trace.appliedRules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white border border-slate-200/90 flex items-center justify-between shadow-2xs hover:border-amber-200 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-1">
                        <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-slate-800 block text-xs truncate">{rule.nameFa}</span>
                          <span className="text-[10px] text-slate-400 block truncate">{rule.note}</span>
                        </div>
                      </div>

                      <span className="font-mono font-bold text-amber-900 text-xs bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/70 shrink-0">
                        +{rule.valueToman.toLocaleString('fa-IR')} ت
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
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-emerald-600" />
                تعریف بلوک قاعده جدید تعرفه
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold text-xs">درصد اضافه کرایه (+٪):</label>
                <input
                  type="number"
                  value={newBlockPercent}
                  onChange={(e) => setNewBlockPercent(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleCreateNewBlock}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-2xs cursor-pointer"
              >
                ایجاد و فعال‌سازی
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
