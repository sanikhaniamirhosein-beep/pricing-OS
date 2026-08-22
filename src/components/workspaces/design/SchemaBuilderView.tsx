import React, { useState } from 'react';
import {
  Layers,
  Database,
  Plus,
  Trash2,
  Edit2,
  Shield,
  Truck,
  Package,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Snowflake,
  Scale,
  Box,
  Search,
  Check,
  X,
  Sliders,
  Info,
} from 'lucide-react';
import { usePricing } from '../../../store/PricingContext';
import { SchemaAttribute, CommodityCategory, FleetCategory } from '../../../types/pricing';

export const SchemaBuilderView: React.FC = () => {
  const {
    schema,
    addSchemaAttribute,
    updateSchemaAttribute,
    deleteSchemaAttribute,
    commodities,
    updateCommodity,
    addCommodity,
    fleetCategories,
    updateFleetCategory,
    addFleetCategory,
  } = usePricing();

  const [activeTab, setActiveTab] = useState<'attributes' | 'commodities' | 'fleet'>('attributes');
  const [searchQuery, setSearchQuery] = useState('');

  // Attribute Modal / Form State
  const [isAddingAttr, setIsAddingAttr] = useState(false);
  const [newAttr, setNewAttr] = useState<SchemaAttribute>({
    name: '',
    labelFa: '',
    labelEn: '',
    dataType: 'number',
    required: true,
    unit: '',
    description: '',
  });

  // Commodity Modal / Form State
  const [isAddingCommodity, setIsAddingCommodity] = useState(false);
  const [newCommodity, setNewCommodity] = useState<Partial<CommodityCategory>>({
    code: '',
    nameFa: '',
    nameEn: '',
    riskClass: 'medium',
    riskMultiplier: 1.1,
    insuranceRiskPercent: 0.2,
    isColdChainRequired: false,
    isFragile: false,
    isLiquidBulk: false,
    sealRequired: true,
    descriptionFa: '',
  });

  // Fleet Category Modal / Form State
  const [isAddingFleet, setIsAddingFleet] = useState(false);
  const [newFleet, setNewFleet] = useState<Partial<FleetCategory>>({
    code: '',
    nameFa: '',
    nameEn: '',
    categoryType: 'heavy',
    minWeightTons: 10,
    maxWeightTons: 24,
    volumeCbm: 80,
    dimensionsMeters: '13.6 × 2.5 × 2.6',
    axleCount: 5,
    fuelConsumptionLitersPer100Km: 34,
    baseKmRateToman: 42000,
    descriptionFa: '',
  });

  const handleSaveAttribute = () => {
    if (!newAttr.name || !newAttr.labelFa) return;
    addSchemaAttribute(newAttr);
    setIsAddingAttr(false);
    setNewAttr({
      name: '',
      labelFa: '',
      labelEn: '',
      dataType: 'number',
      required: true,
      unit: '',
      description: '',
    });
  };

  const handleSaveCommodity = () => {
    if (!newCommodity.code || !newCommodity.nameFa) return;
    addCommodity({
      id: `cmd-${Date.now()}`,
      code: newCommodity.code || 'CMD-NEW',
      nameFa: newCommodity.nameFa || '',
      nameEn: newCommodity.nameEn || '',
      riskClass: newCommodity.riskClass || 'medium',
      riskMultiplier: Number(newCommodity.riskMultiplier) || 1.0,
      insuranceRiskPercent: Number(newCommodity.insuranceRiskPercent) || 0.1,
      hazmatAdrCode: newCommodity.hazmatAdrCode,
      isColdChainRequired: !!newCommodity.isColdChainRequired,
      isFragile: !!newCommodity.isFragile,
      isLiquidBulk: !!newCommodity.isLiquidBulk,
      sealRequired: !!newCommodity.sealRequired,
      descriptionFa: newCommodity.descriptionFa || '',
    });
    setIsAddingCommodity(false);
  };

  const handleSaveFleet = () => {
    if (!newFleet.code || !newFleet.nameFa) return;
    addFleetCategory({
      id: `flt-${Date.now()}`,
      code: newFleet.code || 'FLT-NEW',
      nameFa: newFleet.nameFa || '',
      nameEn: newFleet.nameEn || '',
      categoryType: newFleet.categoryType || 'heavy',
      minWeightTons: Number(newFleet.minWeightTons) || 1,
      maxWeightTons: Number(newFleet.maxWeightTons) || 20,
      volumeCbm: Number(newFleet.volumeCbm) || 50,
      dimensionsMeters: newFleet.dimensionsMeters || '10 × 2.4 × 2.4',
      axleCount: Number(newFleet.axleCount) || 3,
      fuelConsumptionLitersPer100Km: Number(newFleet.fuelConsumptionLitersPer100Km) || 30,
      baseKmRateToman: Number(newFleet.baseKmRateToman) || 35000,
      descriptionFa: newFleet.descriptionFa || '',
    });
    setIsAddingFleet(false);
  };

  const filteredAttributes = schema.attributes.filter(
    (a) =>
      a.labelFa.includes(searchQuery) ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.description && a.description.includes(searchQuery))
  );

  const filteredCommodities = commodities.filter(
    (c) =>
      c.nameFa.includes(searchQuery) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.descriptionFa.includes(searchQuery)
  );

  const filteredFleet = fleetCategories.filter(
    (f) =>
      f.nameFa.includes(searchQuery) ||
      f.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.descriptionFa.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 font-title">
                  ۱.۱ سازنده اسکیما و موجودیت‌های پایه (Schema & Entity Builder)
                </h1>
                <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  نسخه {schema.version}
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-medium">
                  {schema.status}
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                تعریف پارامترهای باربری، دسته‌بندی ریسک کالاها و مشخصات فنی ناوگان حمل جاده‌ای جهت تغذیه موتور تعرفه‌گذاری
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('attributes')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'attributes'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-4 h-4" />
              ویژگی‌های بار ({schema.attributes.length})
            </button>
            <button
              onClick={() => setActiveTab('commodities')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'commodities'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-4 h-4" />
              انواع کالا و ضرایب ریسک ({commodities.length})
            </button>
            <button
              onClick={() => setActiveTab('fleet')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'fleet'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Truck className="w-4 h-4" />
              دسته‌بندی ناوگان ({fleetCategories.length})
            </button>
          </div>
        </div>

        {/* Search & Actions Bar */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در نام، کد یا توضیحات..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {activeTab === 'attributes' && (
              <button
                onClick={() => setIsAddingAttr(true)}
                className="w-full sm:w-auto px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                تعریف ویژگی جدید بار
              </button>
            )}
            {activeTab === 'commodities' && (
              <button
                onClick={() => setIsAddingCommodity(true)}
                className="w-full sm:w-auto px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                افزودن دسته‌بندی کالا
              </button>
            )}
            {activeTab === 'fleet' && (
              <button
                onClick={() => setIsAddingFleet(true)}
                className="w-full sm:w-auto px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                افزودن تیپ ناوگان جدید
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TAB 1: Load Attributes */}
      {activeTab === 'attributes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAttributes.map((attr) => (
            <div
              key={attr.name}
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-amber-300 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <h3 className="text-sm font-bold text-slate-900 font-title">{attr.labelFa}</h3>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      attr.required ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {attr.required ? 'اجباری' : 'اختیاری'}
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-2 text-xs font-mono text-slate-500">
                  <span>{attr.name}</span>
                  <span>•</span>
                  <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px] text-slate-700">
                    {attr.dataType}
                  </span>
                  {attr.unit && (
                    <span className="bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded text-[11px] font-bold">
                      واحد: {attr.unit}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {attr.description || 'بدون توضیحات تکمیلی'}
                </p>

                {attr.enumValues && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {attr.enumValues.map((val) => (
                      <span
                        key={val}
                        className="text-[10px] bg-slate-50 border border-slate-200 text-slate-700 px-2 py-0.5 rounded-lg"
                      >
                        {val}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-mono">
                  Schema: {schema.entityType}
                </span>
                <button
                  onClick={() => deleteSchemaAttribute(attr.name)}
                  className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                  title="حذف ویژگی"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: Commodity Categories with Risk Multipliers */}
      {activeTab === 'commodities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCommodities.map((cmd) => (
            <div
              key={cmd.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-amber-300 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {cmd.code}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 font-title mt-1.5">{cmd.nameFa}</h3>
                    <p className="text-[11px] text-slate-400 font-mono">{cmd.nameEn}</p>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      cmd.riskClass === 'high'
                        ? 'bg-rose-100 text-rose-800'
                        : cmd.riskClass === 'medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    ریسک {cmd.riskClass === 'high' ? 'بالا' : cmd.riskClass === 'medium' ? 'متوسط' : 'پایین'}
                  </span>
                </div>

                {/* Multiplier Metrics */}
                <div className="mt-4 grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-500 block">ضریب کرایه (Risk)</span>
                    <span className="text-sm font-bold font-mono text-slate-900">
                      ×{cmd.riskMultiplier.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">حق بیمه ریسک</span>
                    <span className="text-sm font-bold font-mono text-amber-800">
                      +{cmd.insuranceRiskPercent}%
                    </span>
                  </div>
                </div>

                {/* Feature Tags */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {cmd.isColdChainRequired && (
                    <span className="inline-flex items-center gap-1 text-[10px] bg-cyan-50 text-cyan-800 border border-cyan-200 px-2 py-0.5 rounded-md font-medium">
                      <Snowflake className="w-3 h-3" />
                      زنجیره سرد
                    </span>
                  )}
                  {cmd.hazmatAdrCode && (
                    <span className="inline-flex items-center gap-1 text-[10px] bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-md font-medium">
                      <Flame className="w-3 h-3" />
                      {cmd.hazmatAdrCode}
                    </span>
                  )}
                  {cmd.isFragile && (
                    <span className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md font-medium">
                      شکستنی / حساس
                    </span>
                  )}
                  {cmd.sealRequired && (
                    <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md font-medium">
                      پلمپ گمرکی
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {cmd.descriptionFa}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">شناسه: {cmd.id}</span>
                <button
                  onClick={() => {
                    const newMultiplier = Number(prompt('ضریب ریسک جدید را وارد کنید:', String(cmd.riskMultiplier)));
                    if (newMultiplier && !isNaN(newMultiplier)) {
                      updateCommodity({ ...cmd, riskMultiplier: newMultiplier });
                    }
                  }}
                  className="text-amber-800 hover:text-amber-900 font-medium flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  ویرایش ضریب
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Fleet Categories with Payload & Volume */}
      {activeTab === 'fleet' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFleet.map((fleet) => (
            <div
              key={fleet.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-amber-300 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {fleet.code}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 font-title mt-1.5">{fleet.nameFa}</h3>
                    <p className="text-[11px] text-slate-400 font-mono">{fleet.nameEn}</p>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                    {fleet.categoryType === 'light'
                      ? 'سبک'
                      : fleet.categoryType === 'medium'
                      ? 'نیمه‌سنگین'
                      : fleet.categoryType === 'heavy'
                      ? 'سنگین'
                      : fleet.categoryType === 'specialized'
                      ? 'تخصصی'
                      : 'فوق‌سنگین'}
                  </span>
                </div>

                {/* Specs Grid */}
                <div className="mt-4 grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400">ظرفیت بارگیری:</span>
                    <span className="font-bold font-mono text-slate-800 block">
                      {fleet.minWeightTons} تا {fleet.maxWeightTons} تن
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">حجم محفظه:</span>
                    <span className="font-bold font-mono text-slate-800 block">
                      {fleet.volumeCbm} مترمکعب (CBM)
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">تعداد محور:</span>
                    <span className="font-bold font-mono text-slate-800 block">
                      {fleet.axleCount} محور
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">مصرف سوخت گازوئیل:</span>
                    <span className="font-bold font-mono text-amber-800 block">
                      {fleet.fuelConsumptionLitersPer100Km}L / 100km
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
                  <span className="text-slate-600 text-[11px]">نرخ مبنای هر کیلومتر:</span>
                  <span className="font-bold font-mono text-amber-900">
                    {fleet.baseKmRateToman.toLocaleString('fa-IR')} تومان/km
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {fleet.descriptionFa}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-mono">{fleet.dimensionsMeters}</span>
                <button
                  onClick={() => {
                    const newRate = Number(prompt('نرخ کیلومتری جدید را وارد کنید (تومان):', String(fleet.baseKmRateToman)));
                    if (newRate && !isNaN(newRate)) {
                      updateFleetCategory({ ...fleet, baseKmRateToman: newRate });
                    }
                  }}
                  className="text-amber-800 hover:text-amber-900 font-medium flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  اصلاح نرخ مبنا
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add Attribute */}
      {isAddingAttr && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 font-title">تعریف ویژگی جدید بار در اسکیما</h3>
              <button onClick={() => setIsAddingAttr(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">نام فیلد در سیستم (انگلیسی بدون فاصله)</label>
                <input
                  type="text"
                  value={newAttr.name}
                  onChange={(e) => setNewAttr({ ...newAttr, name: e.target.value })}
                  placeholder="e.g. hazardousClassCode"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">عنوان فارسی</label>
                  <input
                    type="text"
                    value={newAttr.labelFa}
                    onChange={(e) => setNewAttr({ ...newAttr, labelFa: e.target.value })}
                    placeholder="کلاس خطر کالای ADR"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">نوع داده</label>
                  <select
                    value={newAttr.dataType}
                    onChange={(e) => setNewAttr({ ...newAttr, dataType: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="number">عدد (Number)</option>
                    <option value="string">متن (String)</option>
                    <option value="boolean">شرطی (Boolean)</option>
                    <option value="enum">انتخابی (Enum)</option>
                    <option value="geo_location">مختصات جغرافیایی (Geo)</option>
                    <option value="date">تاریخ (Date)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">واحد اندازه‌گیری (اختیاری)</label>
                  <input
                    type="text"
                    value={newAttr.unit || ''}
                    onChange={(e) => setNewAttr({ ...newAttr, unit: e.target.value })}
                    placeholder="تن / کیلومتر / درجه"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="req-checkbox"
                    checked={newAttr.required}
                    onChange={(e) => setNewAttr({ ...newAttr, required: e.target.checked })}
                    className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="req-checkbox" className="font-medium text-slate-700 cursor-pointer">
                    فیلد الزامی برای صدور بارنامه
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">توضیحات تکمیلی و راهنمای اپراتور</label>
                <textarea
                  value={newAttr.description || ''}
                  onChange={(e) => setNewAttr({ ...newAttr, description: e.target.value })}
                  placeholder="راهنمای نحوه محاسبه یا ثبت مقدار..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none focus:border-amber-500 h-20"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                onClick={() => setIsAddingAttr(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                انصراف
              </button>
              <button
                onClick={handleSaveAttribute}
                className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                ذخیره در اسکیما
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Commodity */}
      {isAddingCommodity && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 font-title">افزودن دسته‌بندی جدید کالا</h3>
              <button onClick={() => setIsAddingCommodity(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">کد کالا</label>
                  <input
                    type="text"
                    value={newCommodity.code}
                    onChange={(e) => setNewCommodity({ ...newCommodity, code: e.target.value })}
                    placeholder="e.g. CMD-PETRO"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">نام فارسی</label>
                  <input
                    type="text"
                    value={newCommodity.nameFa}
                    onChange={(e) => setNewCommodity({ ...newCommodity, nameFa: e.target.value })}
                    placeholder="گرانول پتروشیمی کیسه‌ای"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">ضریب نرخ کرایه (Multiplier)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={newCommodity.riskMultiplier}
                    onChange={(e) => setNewCommodity({ ...newCommodity, riskMultiplier: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">اضافه حق بیمه ریسک (%)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={newCommodity.insuranceRiskPercent}
                    onChange={(e) => setNewCommodity({ ...newCommodity, insuranceRiskPercent: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newCommodity.isColdChainRequired}
                    onChange={(e) => setNewCommodity({ ...newCommodity, isColdChainRequired: e.target.checked })}
                    className="rounded text-amber-600"
                  />
                  <span>نیاز به یخچال</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newCommodity.isFragile}
                    onChange={(e) => setNewCommodity({ ...newCommodity, isFragile: e.target.checked })}
                    className="rounded text-amber-600"
                  />
                  <span>کالای شکستنی/حساس</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newCommodity.sealRequired}
                    onChange={(e) => setNewCommodity({ ...newCommodity, sealRequired: e.target.checked })}
                    className="rounded text-amber-600"
                  />
                  <span>الزام پلمپ امنیتی</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newCommodity.isLiquidBulk}
                    onChange={(e) => setNewCommodity({ ...newCommodity, isLiquidBulk: e.target.checked })}
                    className="rounded text-amber-600"
                  />
                  <span>مایع فله تانکری</span>
                </label>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">توضیحات و دستورالعمل حمل</label>
                <textarea
                  value={newCommodity.descriptionFa}
                  onChange={(e) => setNewCommodity({ ...newCommodity, descriptionFa: e.target.value })}
                  placeholder="ملاحظات بارگیری، مهاربندی و الزامات راننده..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none focus:border-amber-500 h-20"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                onClick={() => setIsAddingCommodity(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                انصراف
              </button>
              <button
                onClick={handleSaveCommodity}
                className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                افزودن کالا
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Fleet */}
      {isAddingFleet && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 font-title">افزودن تیپ ناوگان جدید</h3>
              <button onClick={() => setIsAddingFleet(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">کد ناوگان</label>
                  <input
                    type="text"
                    value={newFleet.code}
                    onChange={(e) => setNewFleet({ ...newFleet, code: e.target.value })}
                    placeholder="FLT-BOOGIE-60T"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">نام فارسی ناوگان</label>
                  <input
                    type="text"
                    value={newFleet.nameFa}
                    onChange={(e) => setNewFleet({ ...newFleet, nameFa: e.target.value })}
                    placeholder="کمرشکن بوژی ۷ محور"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">حداکثر وزن (تن)</label>
                  <input
                    type="number"
                    value={newFleet.maxWeightTons}
                    onChange={(e) => setNewFleet({ ...newFleet, maxWeightTons: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">حجم بارگیر (CBM)</label>
                  <input
                    type="number"
                    value={newFleet.volumeCbm}
                    onChange={(e) => setNewFleet({ ...newFleet, volumeCbm: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">تعداد محور</label>
                  <input
                    type="number"
                    value={newFleet.axleCount}
                    onChange={(e) => setNewFleet({ ...newFleet, axleCount: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">نرخ پایه هر کیلومتر (تومان)</label>
                  <input
                    type="number"
                    value={newFleet.baseKmRateToman}
                    onChange={(e) => setNewFleet({ ...newFleet, baseKmRateToman: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">ابعاد محفظه (طول×عرض×ارتفاع)</label>
                  <input
                    type="text"
                    value={newFleet.dimensionsMeters}
                    onChange={(e) => setNewFleet({ ...newFleet, dimensionsMeters: e.target.value })}
                    placeholder="13.6 × 2.5 × 2.6"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">توضیحات و کاربرد اصلی ناوگان</label>
                <textarea
                  value={newFleet.descriptionFa}
                  onChange={(e) => setNewFleet({ ...newFleet, descriptionFa: e.target.value })}
                  placeholder="مناسب محموله‌های فوق‌سنگین، توربین، ترانس و..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none focus:border-amber-500 h-20"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                onClick={() => setIsAddingFleet(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                انصراف
              </button>
              <button
                onClick={handleSaveFleet}
                className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                افزودن ناوگان
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
