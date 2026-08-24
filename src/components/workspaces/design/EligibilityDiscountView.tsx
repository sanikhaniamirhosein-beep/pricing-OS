import React, { useState } from 'react';
import {
  Percent,
  Layers,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Sparkles,
  CheckCircle2,
  DollarSign,
  Tag,
  Plus,
  Trash2,
  X,
  Sliders,
  FileCheck2,
  ShieldAlert,
  Flame,
  Truck,
} from 'lucide-react';
import { usePricing } from '../../../store/PricingContext';
import { DiscountPolicy, EligibilityPolicy } from '../../../types/pricing';

interface EligibilityDiscountViewProps {
  initialTab?: 'eligibility' | 'discounts';
}

export const EligibilityDiscountView: React.FC<EligibilityDiscountViewProps> = ({
  initialTab = 'discounts',
}) => {
  const {
    discountPolicies,
    addDiscountPolicy,
    deleteDiscountPolicy,
    eligibilityPolicies,
    addEligibilityPolicy,
    deleteEligibilityPolicy,
    fleetCategories,
  } = usePricing();

  const [activeSection, setActiveSection] = useState<'eligibility' | 'discounts'>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveSection(initialTab);
    }
  }, [initialTab]);

  // Modals
  const [isCreateDiscountOpen, setIsCreateDiscountOpen] = useState(false);
  const [isCreateEligibilityOpen, setIsCreateEligibilityOpen] = useState(false);

  // Discount Form State
  const [discountForm, setDiscountForm] = useState({
    displayId: '',
    nameFa: '',
    nameEn: '',
    type: 'volume_tonnage' as DiscountPolicy['type'],
    valuePercent: 5,
    capPercentage: 12,
    stackable: false,
    mutualExclusivityGroup: 'G1_VOLUME_OR_PROMO',
    priority: 1,
  });

  // Eligibility Form State
  const [eligibilityForm, setEligibilityForm] = useState({
    displayId: '',
    nameFa: '',
    nameEn: '',
    minTonnage: 5,
    allowedVehicles: ['تریلی چادری', 'تریلر کفی'],
    allowedShipperTiers: ['Gold', 'Platinum', 'Diamond'],
    hazardousCertifiedOnly: false,
    coldChainCertifiedOnly: false,
    activeContractRequired: false,
  });

  const handleCreateDiscountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discountForm.nameFa.trim()) return;
    const generatedDisplayId = discountForm.displayId.trim() || `DSC-${Math.floor(100 + Math.random() * 900)}`;
    const newDiscount: DiscountPolicy = {
      discountId: `disc-${Date.now()}`,
      displayId: generatedDisplayId,
      nameFa: discountForm.nameFa,
      nameEn: discountForm.nameEn || generatedDisplayId,
      type: discountForm.type,
      valuePercent: Number(discountForm.valuePercent),
      capPercentage: Number(discountForm.capPercentage),
      stackable: discountForm.stackable,
      mutualExclusivityGroup: discountForm.stackable ? undefined : discountForm.mutualExclusivityGroup,
      priority: Number(discountForm.priority),
      version: 1,
      status: 'Approved',
    };
    addDiscountPolicy(newDiscount);
    setIsCreateDiscountOpen(false);
    setDiscountForm({
      displayId: '',
      nameFa: '',
      nameEn: '',
      type: 'volume_tonnage',
      valuePercent: 5,
      capPercentage: 12,
      stackable: false,
      mutualExclusivityGroup: 'G1_VOLUME_OR_PROMO',
      priority: 1,
    });
  };

  const handleCreateEligibilitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eligibilityForm.nameFa.trim()) return;
    const generatedDisplayId = eligibilityForm.displayId.trim() || `ELG-${Math.floor(100 + Math.random() * 900)}`;
    const newPolicy: EligibilityPolicy = {
      eligibilityId: `elg-${Date.now()}`,
      displayId: generatedDisplayId,
      nameFa: eligibilityForm.nameFa,
      nameEn: eligibilityForm.nameEn || generatedDisplayId,
      version: 1,
      conditions: {
        minTonnage: Number(eligibilityForm.minTonnage),
        allowedVehicles: eligibilityForm.allowedVehicles,
        allowedShipperTiers: eligibilityForm.allowedShipperTiers,
        hazardousCertifiedOnly: eligibilityForm.hazardousCertifiedOnly,
        coldChainCertifiedOnly: eligibilityForm.coldChainCertifiedOnly,
        activeContractRequired: eligibilityForm.activeContractRequired,
      },
      status: 'Approved',
    };
    addEligibilityPolicy(newPolicy);
    setIsCreateEligibilityOpen(false);
    setEligibilityForm({
      displayId: '',
      nameFa: '',
      nameEn: '',
      minTonnage: 5,
      allowedVehicles: ['تریلی چادری', 'تریلر کفی'],
      allowedShipperTiers: ['Gold', 'Platinum', 'Diamond'],
      hazardousCertifiedOnly: false,
      coldChainCertifiedOnly: false,
      activeContractRequired: false,
    });
  };

  const toggleVehicle = (vName: string) => {
    setEligibilityForm((prev) => {
      const exists = prev.allowedVehicles.includes(vName);
      return {
        ...prev,
        allowedVehicles: exists
          ? prev.allowedVehicles.filter((v) => v !== vName)
          : [...prev.allowedVehicles, vName],
      };
    });
  };

  const toggleTier = (tier: string) => {
    setEligibilityForm((prev) => {
      const exists = prev.allowedShipperTiers.includes(tier);
      return {
        ...prev,
        allowedShipperTiers: exists
          ? prev.allowedShipperTiers.filter((t) => t !== tier)
          : [...prev.allowedShipperTiers, tier],
      };
    });
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Navigation Switcher / Header Bar */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-bold text-slate-900 text-base font-display">
              استودیو واجدشرایطی، محدودیت‌های ناوگان و استراتژی تخفیفات
            </h2>
            <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-lg font-mono text-xs font-bold">
              Eligibility & Discount Strategies
            </span>
          </div>
          <p className="text-slate-500 mt-1 text-xs">
            تنظیم قوانین پذیرش ناوگان، مجوزهای بار خاص، تخفیفات حجمی و انحصار متقابل تخفیف‌ها (BR-027)
          </p>
        </div>

        {/* Section Tabs & Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveSection('discounts')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeSection === 'discounts'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Percent className="w-3.5 h-3.5" />
              <span>استراتژی تخفیفات ({discountPolicies.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('eligibility')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeSection === 'eligibility'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>واجدشرایطی و محدودیت ناوگان ({eligibilityPolicies.length})</span>
            </button>
          </div>

          {activeSection === 'discounts' ? (
            <button
              type="button"
              onClick={() => setIsCreateDiscountOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>ایجاد استراتژی تخفیف جدید</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsCreateEligibilityOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>ایجاد قانون واجدشرایطی ناوگان</span>
            </button>
          )}
        </div>
      </div>

      {/* ======================================================= */}
      {/* SECTION 1: DISCOUNT STRATEGY STUDIO */}
      {/* ======================================================= */}
      {activeSection === 'discounts' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {discountPolicies.map((disc) => (
              <div
                key={disc.discountId}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono bg-sky-50 text-sky-900 px-2.5 py-0.5 rounded-lg border border-sky-200 font-bold">
                      {disc.displayId}@v{disc.version}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                          disc.stackable
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-900 border-amber-200'
                        }`}
                      >
                        {disc.stackable ? 'تخفیف تجمعی (Stackable)' : 'تخفیف انحصاری (Non-Stackable)'}
                      </span>
                      {deleteDiscountPolicy && (
                        <button
                          type="button"
                          onClick={() => deleteDiscountPolicy(disc.discountId)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="حذف تخفیف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm font-display">{disc.nameFa}</h4>
                  <p className="text-slate-500 text-xs font-mono">{disc.nameEn}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-sans">نوع تخفیف:</span>
                    <span className="font-bold text-slate-800 font-sans">
                      {disc.type === 'volume_tonnage'
                        ? 'تخفیف پلکانی تناژ'
                        : disc.type === 'backhaul_match'
                        ? 'مشوق بار برگشت'
                        : disc.type === 'multi_trip_monthly'
                        ? 'تخفیف چندسفره ماهانه'
                        : disc.type === 'contract_negotiated'
                        ? 'تخفیف مذاکره‌شده قرارداد'
                        : disc.type === 'partner_loyalty'
                        ? 'تخفیف وفاداری شرکا'
                        : 'تخفیف فصلی و پروموشن'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-sans">میزان تخفیف:</span>
                    <span className="font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">{disc.valuePercent}٪</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-sans">سقف مجاز تخفیف (Cap):</span>
                    <span className="font-bold text-slate-800">{disc.capPercentage}٪</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-sans">اولویت اعمال (Priority):</span>
                    <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{disc.priority}</span>
                  </div>
                  {disc.mutualExclusivityGroup && (
                    <div className="flex justify-between pt-2 border-t border-slate-200 text-xs">
                      <span className="text-slate-500 font-sans">گروه انحصار:</span>
                      <span className="text-rose-700 font-medium bg-rose-50 px-2 py-0.5 rounded border border-rose-200">{disc.mutualExclusivityGroup}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
                  <span>وضعیت: <strong className="text-slate-700">{disc.status}</strong></span>
                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">کنترل گاردریل فعال</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* SECTION 2: FLEET ELIGIBILITY & CONSTRAINTS STUDIO */}
      {/* ======================================================= */}
      {activeSection === 'eligibility' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {eligibilityPolicies.map((elg) => (
              <div
                key={elg.eligibilityId}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono bg-emerald-50 text-emerald-900 px-2.5 py-0.5 rounded-lg border border-emerald-200 font-bold">
                      {elg.displayId}@v{elg.version}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {elg.status}
                      </span>
                      {deleteEligibilityPolicy && (
                        <button
                          type="button"
                          onClick={() => deleteEligibilityPolicy(elg.eligibilityId)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="حذف سیاست واجدشرایطی"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm font-display">{elg.nameFa}</h4>
                  <p className="text-slate-500 text-xs font-mono">{elg.nameEn}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">حداقل تناژ پذیرش:</span>
                    <span className="font-bold font-mono text-slate-800">
                      {elg.conditions.minTonnage ? `${elg.conditions.minTonnage} تن` : 'بدون کف'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-600 block">کلاس‌های ناوگان مجاز:</span>
                    <div className="flex flex-wrap gap-1">
                      {elg.conditions.allowedVehicles?.map((v, i) => (
                        <span key={i} className="px-2 py-0.5 bg-white text-slate-800 rounded border border-slate-200 text-[10px] font-medium">
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>

                  {elg.conditions.allowedShipperTiers && (
                    <div className="flex justify-between pt-1 border-t border-slate-200/60">
                      <span className="text-slate-600">سطوح مجاز صاحبان کالا:</span>
                      <span className="font-bold text-sky-800 font-mono">
                        {elg.conditions.allowedShipperTiers.join(', ')}
                      </span>
                    </div>
                  )}

                  <div className="space-y-1.5 pt-2 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">الزام گواهی ADR خطرناک:</span>
                      <span className={`font-bold ${elg.conditions.hazardousCertifiedOnly ? 'text-amber-700' : 'text-slate-500'}`}>
                        {elg.conditions.hazardousCertifiedOnly ? 'الزامی است ⚠️' : 'اختیاری'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">الزام سنسور دما و سرما:</span>
                      <span className={`font-bold ${elg.conditions.coldChainCertifiedOnly ? 'text-sky-700' : 'text-slate-500'}`}>
                        {elg.conditions.coldChainCertifiedOnly ? 'الزامی است ❄️' : 'اختیاری'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">الزام قرارداد فعال سازمانی:</span>
                      <span className={`font-bold ${elg.conditions.activeContractRequired ? 'text-emerald-700' : 'text-slate-500'}`}>
                        {elg.conditions.activeContractRequired ? 'الزامی است 📜' : 'اختیاری'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
                  <span>اعتبارسنجی خودکار بارنامه:</span>
                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">فعال در موتور تصمیم</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* MODAL 1: CREATE NEW DISCOUNT POLICY */}
      {/* ======================================================= */}
      {isCreateDiscountOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-5 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm font-display">
                <Percent className="w-5 h-5 text-amber-600" />
                <span>تعریف و ایجاد استراتژی تخفیف جدید (Create Discount Policy)</span>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateDiscountOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDiscountSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-bold text-slate-700">عنوان استراتژی تخفیف (فارسی) *:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: تخفیف ویژه تناژ ماهانه بالای ۵۰۰ تن"
                    value={discountForm.nameFa}
                    onChange={(e) => setDiscountForm({ ...discountForm, nameFa: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900 font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">کد شناسه تخفیف:</label>
                  <input
                    type="text"
                    placeholder="مثال: DSC-TIER-VOL500"
                    value={discountForm.displayId}
                    onChange={(e) => setDiscountForm({ ...discountForm, displayId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900 font-mono"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">نوع مدل تخفیف:</label>
                  <select
                    value={discountForm.type}
                    onChange={(e) =>
                      setDiscountForm({
                        ...discountForm,
                        type: e.target.value as DiscountPolicy['type'],
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900 font-bold"
                  >
                    <option value="volume_tonnage">تخفیف پلکانی تناژ (Volume Tonnage)</option>
                    <option value="backhaul_match">مشوق بار برگشت (Backhaul Incentive)</option>
                    <option value="multi_trip_monthly">تخفیف چندسفره ماهانه (Multi-Trip Monthly)</option>
                    <option value="contract_negotiated">مذاکره‌شده قرارداد سازمانی (Contract Negotiated)</option>
                    <option value="partner_loyalty">وفاداری شرکای تجاری (Partner Loyalty)</option>
                    <option value="seasonal_early_booking">تخفیف فصلی و رزرو زودهنگام (Seasonal Early)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">درصد اعمال تخفیف (%):</label>
                  <input
                    type="number"
                    min="0.1"
                    max="50"
                    step="0.5"
                    required
                    value={discountForm.valuePercent}
                    onChange={(e) => setDiscountForm({ ...discountForm, valuePercent: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900 font-mono font-bold"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">سقف مجاز اعمال تخفیف (Cap %):</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    step="0.5"
                    required
                    value={discountForm.capPercentage}
                    onChange={(e) => setDiscountForm({ ...discountForm, capPercentage: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900 font-mono"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">اولویت اعمال در پایپ‌لاین (1 تا 10):</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={discountForm.priority}
                    onChange={(e) => setDiscountForm({ ...discountForm, priority: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900 font-mono"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">قابلیت ترکیب با سایر تخفیف‌ها:</label>
                  <div className="flex items-center gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={discountForm.stackable}
                        onChange={() => setDiscountForm({ ...discountForm, stackable: true })}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span>تجمعی (Stackable)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={!discountForm.stackable}
                        onChange={() => setDiscountForm({ ...discountForm, stackable: false })}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span>انحصاری (Exclusive)</span>
                    </label>
                  </div>
                </div>

                {!discountForm.stackable && (
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-bold text-slate-700">شناسه گروه عدم ترکیب همزمان (Exclusivity Group):</label>
                    <input
                      type="text"
                      value={discountForm.mutualExclusivityGroup}
                      onChange={(e) => setDiscountForm({ ...discountForm, mutualExclusivityGroup: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900 font-mono"
                      dir="ltr"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateDiscountOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold shadow-xs transition-colors cursor-pointer"
                >
                  ثبت استراتژی تخفیف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* MODAL 2: CREATE NEW ELIGIBILITY POLICY */}
      {/* ======================================================= */}
      {isCreateEligibilityOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-5 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm font-display">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>تعریف و ایجاد قانون واجدشرایطی و محدودیت ناوگان (Create Eligibility Policy)</span>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateEligibilityOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEligibilitySubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-bold text-slate-700">عنوان قانون واجدشرایطی (فارسی) *:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: شرایط اختصاصی حمل سیمان و فرآورده‌های معدنی سنگین"
                    value={eligibilityForm.nameFa}
                    onChange={(e) => setEligibilityForm({ ...eligibilityForm, nameFa: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">کد شناسه قانون:</label>
                  <input
                    type="text"
                    placeholder="مثال: ELG-MINERAL-BULK"
                    value={eligibilityForm.displayId}
                    onChange={(e) => setEligibilityForm({ ...eligibilityForm, displayId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 font-mono"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">حداقل تناژ پذیرش (تن):</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={eligibilityForm.minTonnage}
                    onChange={(e) => setEligibilityForm({ ...eligibilityForm, minTonnage: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 font-mono font-bold"
                    dir="ltr"
                  />
                </div>

                {/* Allowed Vehicles Selection */}
                <div className="space-y-2 sm:col-span-2">
                  <label className="font-bold text-slate-700 block">کلاس‌های ناوگان مجاز جهت پذیرش بار:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    {[
                      'تریلی چادری',
                      'تریلر کفی',
                      'کشنده یخچال‌دار',
                      'تانکر استیل',
                      'کمرشکن بوژی',
                      'کامیون جفت ۱۵ تن',
                      'کامیون تک ۱۰ تن',
                    ].map((v) => {
                      const isChecked = eligibilityForm.allowedVehicles.includes(v);
                      return (
                        <label
                          key={v}
                          className={`flex items-center gap-2 p-2 rounded-xl border transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                              : 'bg-white border-slate-200 text-slate-600'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleVehicle(v)}
                            className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          />
                          <span className="text-[11px]">{v}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Allowed Shipper Tiers */}
                <div className="space-y-2 sm:col-span-2">
                  <label className="font-bold text-slate-700 block">سطوح مجاز صاحبان کالا (Shipper Tiers):</label>
                  <div className="flex flex-wrap gap-2">
                    {['Diamond', 'Platinum', 'Gold', 'Silver', 'Bronze'].map((tier) => {
                      const isChecked = eligibilityForm.allowedShipperTiers.includes(tier);
                      return (
                        <button
                          key={tier}
                          type="button"
                          onClick={() => toggleTier(tier)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-sky-500 text-white border-sky-600 shadow-2xs'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {tier}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Mandatory Certifications & Constraints */}
                <div className="space-y-2.5 sm:col-span-2 pt-2 border-t border-slate-100">
                  <label className="font-bold text-slate-700 block">الزامات و تاییدیه‌های اجباری ناوگان:</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2.5 p-2.5 bg-amber-50/60 rounded-xl border border-amber-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={eligibilityForm.hazardousCertifiedOnly}
                        onChange={(e) => setEligibilityForm({ ...eligibilityForm, hazardousCertifiedOnly: e.target.checked })}
                        className="rounded text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-amber-950 font-bold">
                        الزام مجوز حمل مواد خطرناک (ADR Hazardous Materials Certified)
                      </span>
                    </label>

                    <label className="flex items-center gap-2.5 p-2.5 bg-sky-50/60 rounded-xl border border-sky-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={eligibilityForm.coldChainCertifiedOnly}
                        onChange={(e) => setEligibilityForm({ ...eligibilityForm, coldChainCertifiedOnly: e.target.checked })}
                        className="rounded text-sky-600 focus:ring-sky-500"
                      />
                      <span className="text-sky-950 font-bold">
                        الزام سنسور تله‌متری و گواهی زنجیره سرد (Cold-Chain Telemetry Required)
                      </span>
                    </label>

                    <label className="flex items-center gap-2.5 p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={eligibilityForm.activeContractRequired}
                        onChange={(e) => setEligibilityForm({ ...eligibilityForm, activeContractRequired: e.target.checked })}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-emerald-950 font-bold">
                        الزام قرارداد معتبر فعال شرکتی برای صدور بارنامه (Active Corporate Contract Required)
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateEligibilityOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs transition-colors cursor-pointer"
                >
                  ثبت قانون واجدشرایطی
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
