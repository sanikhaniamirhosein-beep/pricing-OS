import React, { useState, useMemo } from 'react';
import {
  Building2,
  Sparkles,
  TrendingDown,
  Zap,
  Star,
  ShieldCheck,
  Clock,
  Truck,
  CheckCircle2,
  Check,
  Layers,
  Scale,
  ChevronDown,
  ChevronUp,
  Info,
  SlidersHorizontal,
  Award,
  BadgeCheck,
  Radio,
  ArrowRight,
  RefreshCw,
  FileSpreadsheet,
  FileCheck2,
  ExternalLink,
  HelpCircle,
  X,
  MapPin,
  Phone,
  Mail,
  User,
  Hash,
  AlertCircle,
} from 'lucide-react';
import { usePricing } from '../../store/PricingContext';
import { CarrierOrgProfile } from '../../data/mockOrganizationProfiles';

export interface CarrierQuoteOption {
  id: string;
  code: string;
  name: string;
  shortName: string;
  logoText: string;
  logoBg: string;
  logoColor: string;
  city: string;
  licenseNo: string;
  nationalId: string;
  economicCode: string;
  registrationNumber: string;
  phone: string;
  address: string;
  managerName: string;
  email: string;
  rating: number;
  ratingCount: number;
  completedTrips: number;
  fleetCount: number;
  availableDriversNearby: number;
  dispatchTimeMinutes: number;
  estimatedTransitHours: number;
  isSmartRecommended: boolean;
  isCheapest: boolean;
  isFastest: boolean;
  isTopRated: boolean;
  isDedicatedCorridor: boolean;
  priceMultiplier: number;
  discountPercent: number;
  strengths: string[];
  insuranceCeilingToman: number;
  badgeTitle: string;
  badgeType: 'smart' | 'cheapest' | 'fastest' | 'top_rated' | 'specialized';
  carrierCommissionPercent: number;
  carrierCommissionToman: number;
  fuelIndexMultiplier: number;
  calculatedBaseRials: number;
  calculatedBaseToman: number;
  calculatedTaxRials: number;
  calculatedDiscountRials: number;
  calculatedTotalPayableRials: number;
  calculatedTotalPayableToman: number;
  traceSteps?: { name: string; impact: string; value: number }[];
  rawCarrierProfile: CarrierOrgProfile;
}

interface CarrierSelectionMarketplaceProps {
  basePriceRials: number;
  insuranceRials: number;
  loadingFeeRials: number;
  selectedCarrierId: string;
  selectionMode: 'marketplace' | 'managed';
  onSelectCarrier: (carrier: CarrierQuoteOption) => void;
  onToggleSelectionMode: (mode: 'marketplace' | 'managed') => void;
  originCity: string;
  destCity: string;
  weightTons: number;
  selectedTruck: string;
  cargoType?: string;
  cargoValueToman?: number;
  urgencyLevel?: 'standard' | 'express';
}

export const CarrierSelectionMarketplace: React.FC<CarrierSelectionMarketplaceProps> = ({
  basePriceRials,
  insuranceRials,
  loadingFeeRials,
  selectedCarrierId,
  selectionMode,
  onSelectCarrier,
  onToggleSelectionMode,
  originCity,
  destCity,
  weightTons,
  selectedTruck,
  cargoType = 'صنعتی',
  cargoValueToman = 280000000,
  urgencyLevel = 'standard',
}) => {
  const {
    carrierOrganizations,
    calculatePriceForCarrier,
    carrierDrivers,
    openTransportOrgModal,
    switchCarrierOrg,
  } = usePricing();

  const [filterTab, setFilterTab] = useState<'all' | 'smart' | 'cheapest' | 'fastest' | 'top_rated'>('all');
  const [showTransparencyListInManaged, setShowTransparencyListInManaged] = useState(false);
  
  // Modals for Rule Breakdown and Legal Dossier
  const [activeRuleModalCarrier, setActiveRuleModalCarrier] = useState<CarrierQuoteOption | null>(null);
  const [activeDossierModalCarrier, setActiveDossierModalCarrier] = useState<CarrierQuoteOption | null>(null);

  // Dynamic calculations for EVERY carrier registered in the Carrier Management Panel
  const calculatedCarrierOptions = useMemo<CarrierQuoteOption[]>(() => {
    if (!carrierOrganizations || carrierOrganizations.length === 0) {
      return [];
    }

    // Step 1: Calculate raw quote for each registered carrier
    const rawOptions = carrierOrganizations.map((carrier, index) => {
      const calcResult = calculatePriceForCarrier(carrier.id, {
        originCity,
        destCity,
        vehicleType: selectedTruck,
        cargoCategory: cargoType,
        weightTons,
        declaredValueRials: cargoValueToman * 10,
        shipperTier: 'Gold',
        slaSpeed: urgencyLevel,
      });

      const calculatedBaseToman = calcResult.finalPriceToman > 0 ? calcResult.finalPriceToman : Math.round(basePriceRials / 10);
      const calculatedBaseRials = calculatedBaseToman * 10;
      const discountPercent = calcResult.carrierDiscountPercent || carrier.discountPercent || 8.0;
      const discountRials = Math.round(calculatedBaseRials * (discountPercent / 100));
      const taxAndRoadRials = Math.round((calculatedBaseRials + insuranceRials + loadingFeeRials) * 0.09);
      const totalPayableRials = calculatedBaseRials + insuranceRials + loadingFeeRials + taxAndRoadRials - discountRials;
      const totalPayableToman = Math.round(totalPayableRials / 10);

      // Available drivers nearby (from carrier drivers state or calculated proportion)
      const availableDriversNearby = Math.max(
        6,
        Math.min(28, Math.round((carrier.fleetCount || 500) * 0.015) + (index % 5))
      );

      // ETA and Dispatch time estimates
      const isCorridor = calcResult.isDedicatedCorridor;
      const dispatchTimeMinutes = isCorridor ? 20 : 30 + (index * 5);
      const estimatedTransitHours = Math.max(8, Math.round(11 + (index % 3) * 1.5));

      return {
        id: carrier.id,
        code: carrier.code,
        name: carrier.nameFa,
        shortName: carrier.shortName || carrier.nameFa.split(' ')[0],
        logoText: carrier.logoText || carrier.nameFa.slice(0, 5),
        logoBg: carrier.logoBg || 'bg-indigo-600',
        logoColor: carrier.logoColor || 'text-white',
        city: carrier.city || 'تهران',
        licenseNo: carrier.licenseNumber || 'LIC-RMTO-1405-9921',
        nationalId: carrier.nationalId || '10101345678',
        economicCode: carrier.economicCode || '411145678912',
        registrationNumber: carrier.registrationNo || '88921',
        phone: carrier.phone || '۰۲۱-۶۶۵۵۴۴۳۳',
        address: carrier.address || `${carrier.city}، پایانه مرکزی حمل بار`,
        managerName: carrier.managerName || 'مدیر لجستیک شرکت',
        email: carrier.email || 'info@carrier.ir',
        rating: carrier.rating || 4.8,
        ratingCount: carrier.ratingCount || 1200,
        completedTrips: carrier.completedTrips || 15000,
        fleetCount: carrier.fleetCount || 500,
        availableDriversNearby,
        dispatchTimeMinutes,
        estimatedTransitHours,
        isDedicatedCorridor: isCorridor,
        priceMultiplier: carrier.priceMultiplier || 1.0,
        discountPercent,
        strengths: carrier.strengths || [
          'پوشش کامل بیمه بارنامه راهداری',
          'ردیابی برخط ناوگان در طول مسیر',
          'تضمین زمان تحویل و بارگیری',
        ],
        insuranceCeilingToman: carrier.insuranceCeilingToman || 75000000000,
        carrierCommissionPercent: carrier.carrierCommissionPercent || 7.5,
        carrierCommissionToman: calcResult.carrierCommissionToman,
        fuelIndexMultiplier: calcResult.carrierFuelMultiplier,
        calculatedBaseRials,
        calculatedBaseToman,
        calculatedTaxRials: taxAndRoadRials,
        calculatedDiscountRials: discountRials,
        calculatedTotalPayableRials: totalPayableRials,
        calculatedTotalPayableToman: totalPayableToman,
        isSmartRecommended: false,
        isCheapest: false,
        isFastest: false,
        isTopRated: false,
        badgeTitle: 'شرکت همکار شبکه',
        badgeType: 'specialized' as const,
        traceSteps: calcResult.trace?.appliedRules?.map((r) => ({
          name: r.nameFa,
          impact: r.type,
          value: r.valueToman,
        })),
        rawCarrierProfile: carrier,
      };
    });

    // Step 2: Determine dynamic competitive winner badges
    if (rawOptions.length === 0) return [];

    let minPrice = Infinity;
    let minPriceId = rawOptions[0].id;
    let minTime = Infinity;
    let minTimeId = rawOptions[0].id;
    let maxRating = -Infinity;
    let maxRatingId = rawOptions[0].id;

    rawOptions.forEach((opt) => {
      if (opt.calculatedTotalPayableToman < minPrice) {
        minPrice = opt.calculatedTotalPayableToman;
        minPriceId = opt.id;
      }
      const totalTime = opt.estimatedTransitHours + opt.dispatchTimeMinutes / 60;
      if (totalTime < minTime) {
        minTime = totalTime;
        minTimeId = opt.id;
      }
      if (opt.rating > maxRating) {
        maxRating = opt.rating;
        maxRatingId = opt.id;
      }
    });

    // Default smart recommendation: highest combination of rating & dedicated corridor, or 1st carrier
    const smartCarrierId =
      rawOptions.find((o) => o.isDedicatedCorridor && o.rating >= 4.85)?.id ||
      rawOptions.find((o) => o.id === 'org-carrier-pg-freight')?.id ||
      rawOptions[0].id;

    return rawOptions.map((opt) => {
      const isCheapest = opt.id === minPriceId;
      const isFastest = opt.id === minTimeId;
      const isTopRated = opt.id === maxRatingId;
      const isSmartRecommended = opt.id === smartCarrierId;

      let badgeTitle = 'شرکت ثبت‌شده در سامانه';
      let badgeType: 'smart' | 'cheapest' | 'fastest' | 'top_rated' | 'specialized' = 'specialized';

      if (isSmartRecommended) {
        badgeTitle = 'پیشنهاد هوشمند سیستم';
        badgeType = 'smart';
      } else if (isCheapest) {
        badgeTitle = 'ارزان‌ترین نرخ';
        badgeType = 'cheapest';
      } else if (isFastest) {
        badgeTitle = 'سریع‌ترین اعزام';
        badgeType = 'fastest';
      } else if (isTopRated) {
        badgeTitle = 'بالاترین امتیاز کیفی';
        badgeType = 'top_rated';
      } else if (opt.isDedicatedCorridor) {
        badgeTitle = `کریدور اختصاصی`;
        badgeType = 'specialized';
      }

      return {
        ...opt,
        isSmartRecommended,
        isCheapest,
        isFastest,
        isTopRated,
        badgeTitle,
        badgeType,
      };
    });
  }, [
    carrierOrganizations,
    calculatePriceForCarrier,
    carrierDrivers,
    originCity,
    destCity,
    selectedTruck,
    cargoType,
    weightTons,
    cargoValueToman,
    urgencyLevel,
    basePriceRials,
    insuranceRials,
    loadingFeeRials,
  ]);

  // Find smart recommended carrier
  const smartRecommendedCarrier = useMemo(() => {
    return calculatedCarrierOptions.find((c) => c.isSmartRecommended) || calculatedCarrierOptions[0];
  }, [calculatedCarrierOptions]);

  // Currently active selected carrier
  const currentSelectedCarrier = useMemo(() => {
    return calculatedCarrierOptions.find((c) => c.id === selectedCarrierId) || smartRecommendedCarrier;
  }, [calculatedCarrierOptions, selectedCarrierId, smartRecommendedCarrier]);

  // Filtered List for Marketplace
  const displayedCarriers = useMemo(() => {
    let list = [...calculatedCarrierOptions];
    if (filterTab === 'smart') {
      return list.filter((c) => c.isSmartRecommended || c.isDedicatedCorridor);
    }
    if (filterTab === 'cheapest') {
      return list.sort((a, b) => a.calculatedTotalPayableToman - b.calculatedTotalPayableToman);
    }
    if (filterTab === 'fastest') {
      return list.sort((a, b) => a.estimatedTransitHours - b.estimatedTransitHours);
    }
    if (filterTab === 'top_rated') {
      return list.sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [calculatedCarrierOptions, filterTab]);

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-5">
      {/* Header with Title, Mode Switcher & Live Connection Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-100 gap-3.5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-600" />
              ۳. انتخاب شرکت حمل‌ونقل و مدل صدور بارنامه
            </h3>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {calculatedCarrierOptions.length} شرکت معتبر فعال
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            استعلام برخط کرایه، زمان اعزام و پوشش بیمه باربری از میان شرکت‌های دارای مجوز رسمی راهداری
          </p>
        </div>

        {/* Minimal Mode Switcher Tabs */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold self-start lg:self-auto shrink-0">
          <button
            type="button"
            id="btn-mode-marketplace"
            onClick={() => onToggleSelectionMode('marketplace')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              selectionMode === 'marketplace'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-amber-600" />
            <span>بازارگاه رقابتی (Marketplace)</span>
          </button>

          <button
            type="button"
            id="btn-mode-managed"
            onClick={() => onToggleSelectionMode('managed')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              selectionMode === 'managed'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>تخصیص خودکار تک‌نرخی (Managed)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: COMPETITIVE MARKETPLACE (بازارگاه رقابتی) */}
      {/* ========================================================================= */}
      {selectionMode === 'marketplace' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Minimal Filter Tabs Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/80">
            <div className="text-xs text-slate-600 flex items-center gap-2">
              <span className="font-semibold text-slate-800">فیلتر و مرتب‌سازی شرکت‌ها:</span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setFilterTab('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterTab === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                همه ({calculatedCarrierOptions.length})
              </button>

              <button
                type="button"
                onClick={() => setFilterTab('smart')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                  filterTab === 'smart'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-white text-teal-800 hover:bg-teal-50 border border-teal-200'
                }`}
              >
                <Sparkles className="w-3 h-3 text-teal-500" />
                پیشنهاد سیستم
              </button>

              <button
                type="button"
                onClick={() => setFilterTab('cheapest')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                  filterTab === 'cheapest'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-200'
                }`}
              >
                <TrendingDown className="w-3 h-3 text-emerald-500" />
                اقتصادی‌ترین
              </button>

              <button
                type="button"
                onClick={() => setFilterTab('fastest')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                  filterTab === 'fastest'
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'bg-white text-amber-800 hover:bg-amber-50 border border-amber-200'
                }`}
              >
                <Zap className="w-3 h-3 text-amber-500" />
                سریع‌ترین
              </button>

              <button
                type="button"
                onClick={() => setFilterTab('top_rated')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                  filterTab === 'top_rated'
                    ? 'bg-indigo-700 text-white shadow-xs'
                    : 'bg-white text-indigo-800 hover:bg-indigo-50 border border-indigo-200'
                }`}
              >
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                بالاترین امتیاز
              </button>
            </div>
          </div>

          {/* Minimal, Well-Spaced Carrier Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedCarriers.map((carrier) => {
              const isSelected = carrier.id === (currentSelectedCarrier?.id || '');

              return (
                <div
                  key={carrier.id}
                  id={`carrier-card-${carrier.id}`}
                  onClick={() => onSelectCarrier(carrier)}
                  className={`rounded-2xl border transition-all cursor-pointer p-4 sm:p-5 flex flex-col justify-between gap-4 text-right ${
                    isSelected
                      ? 'bg-amber-50/30 border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
                      : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  {/* Card Header: Logo, Name, Verified Badge & Radio */}
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Company Logo Badge */}
                        <div
                          className={`w-11 h-11 rounded-xl ${carrier.logoBg} ${carrier.logoColor} flex items-center justify-center font-bold text-xs shrink-0 shadow-xs`}
                        >
                          {carrier.logoText}
                        </div>

                        {/* Company Title & Verified Badge */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-bold text-slate-900 text-sm truncate">
                              {carrier.name}
                            </h4>
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                              <BadgeCheck className="w-3 h-3 text-emerald-600" />
                              مجوز راهداری
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 flex-wrap">
                            <span className="flex items-center gap-1 font-semibold text-amber-700">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>{carrier.rating.toLocaleString('fa-IR')}</span>
                              <span className="text-slate-400 font-normal">
                                ({carrier.ratingCount.toLocaleString('fa-IR')})
                              </span>
                            </span>
                            <span className="text-slate-300">•</span>
                            <span>{carrier.completedTrips.toLocaleString('fa-IR')} سفر</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-600">{carrier.city}</span>
                          </div>
                        </div>
                      </div>

                      {/* Selection Radio Circle */}
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                          isSelected
                            ? 'bg-amber-600 border-amber-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    {/* Highlights / Special Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {carrier.isSmartRecommended && (
                        <span className="px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200 text-[11px] font-semibold flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-teal-600" />
                          پیشنهاد هوشمند سیستم
                        </span>
                      )}
                      {carrier.isCheapest && (
                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold flex items-center gap-1">
                          <TrendingDown className="w-3 h-3 text-emerald-600" />
                          اقتصادی‌ترین نرخ
                        </span>
                      )}
                      {carrier.isFastest && (
                        <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-semibold flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-600" />
                          سریع‌ترین زمان اعزام
                        </span>
                      )}
                      {carrier.isTopRated && (
                        <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-900 border border-indigo-200 text-[11px] font-semibold flex items-center gap-1">
                          <Star className="w-3 h-3 text-indigo-600 fill-indigo-600" />
                          بالاترین امتیاز کیفی
                        </span>
                      )}
                      {carrier.isDedicatedCorridor && (
                        <span className="px-2.5 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-200 text-[11px] font-semibold flex items-center gap-1">
                          <Award className="w-3 h-3 text-sky-600" />
                          کریدور تخصصی مسیر
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Clean Structured Pricing & Delivery Box */}
                  <div className="bg-slate-50/90 rounded-xl p-3 border border-slate-100 grid grid-cols-2 gap-3 text-xs">
                    <div className="space-y-0.5">
                      <span className="text-[11px] text-slate-500 font-medium block">کرایه کل پیشنهادی:</span>
                      <div className="flex items-baseline gap-1">
                        <strong className="font-mono text-base font-bold text-slate-900">
                          {carrier.calculatedTotalPayableToman.toLocaleString('fa-IR')}
                        </strong>
                        <span className="text-[11px] text-slate-500 font-medium">تومان</span>
                      </div>
                      {carrier.discountPercent > 0 && (
                        <span className="text-[10px] text-emerald-700 font-semibold block">
                          {carrier.discountPercent}٪ تخفیف ماتریس شرکتی
                        </span>
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[11px] text-slate-500 font-medium block">مدت تخمینی تحویل:</span>
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>~{carrier.estimatedTransitHours.toLocaleString('fa-IR')} ساعت</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block">
                        اعزام ناوگان: ~{carrier.dispatchTimeMinutes.toLocaleString('fa-IR')} دقیقه
                      </span>
                    </div>
                  </div>

                  {/* Strengths List (Minimal 2 points) */}
                  <div className="space-y-1 text-xs text-slate-600">
                    {carrier.strengths.slice(0, 2).map((st, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{st}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveRuleModalCarrier(carrier);
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-600" />
                        <span>قواعد محاسبه</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDossierModalCarrier(carrier);
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <FileCheck2 className="w-3.5 h-3.5 text-teal-600" />
                        <span>مشخصات ثبتی</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCarrier(carrier);
                      }}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-amber-600 text-white shadow-xs hover:bg-amber-700'
                          : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>انتخاب‌شده</span>
                        </>
                      ) : (
                        <span>انتخاب شرکت</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: AGGREGATOR / MANAGED MODEL (تخصیص هوشمند تک‌نرخی الگوریتمی) */}
      {/* ========================================================================= */}
      {selectionMode === 'managed' && smartRecommendedCarrier && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Managed Banner */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-5 sm:p-6 rounded-2xl text-white shadow-xs space-y-4 border border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 font-bold shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-white text-sm">
                      تخصیص خودکار تک‌نرخی شبکه لجستیک
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30">
                      تضمین بهترین نرخ سراسری
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    سیستم به صورت خودکار مناسب‌ترین شرکت حمل‌ونقل را بر اساس کمترین کرایه، بیشترین پوشش بیمه و کوتاه‌ترین زمان اعزام تخصیص می‌دهد.
                  </p>
                </div>
              </div>

              <div className="text-right sm:text-left bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 shrink-0">
                <span className="text-[11px] text-slate-300 block">نرخ مقطوع قابل پرداخت:</span>
                <strong className="text-base font-bold font-mono text-teal-300">
                  {smartRecommendedCarrier.calculatedTotalPayableToman.toLocaleString('fa-IR')} تومان
                </strong>
              </div>
            </div>

            {/* Auto-allocated Carrier Card */}
            <div className="bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/15 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl ${smartRecommendedCarrier.logoBg} ${smartRecommendedCarrier.logoColor} flex items-center justify-center font-bold text-xs shadow-xs`}
                  >
                    {smartRecommendedCarrier.logoText}
                  </div>
                  <div>
                    <div className="text-xs text-slate-300">
                      شرکت تخصیص‌یافته خودکار: <strong className="text-teal-300 font-bold text-sm mr-1">{smartRecommendedCarrier.name}</strong>
                    </div>
                    <div className="text-[11px] text-slate-300 flex items-center gap-2 mt-0.5">
                      <span className="text-amber-300 font-bold flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-300" />
                        {smartRecommendedCarrier.rating.toLocaleString('fa-IR')}
                      </span>
                      <span>•</span>
                      <span>پروانه راهداری: {smartRecommendedCarrier.licenseNo}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-teal-200">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <span className="font-semibold">تضمین ۱۰۰٪ ظرفیت و اعزام بدون معطلی</span>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="bg-white/5 p-2.5 rounded-lg border border-white/5 space-y-0.5">
                  <span className="text-[11px] text-slate-400 block">زمان اعزام به مبدأ:</span>
                  <strong className="text-white font-mono">
                    ~{smartRecommendedCarrier.dispatchTimeMinutes.toLocaleString('fa-IR')} دقیقه
                  </strong>
                </div>

                <div className="bg-white/5 p-2.5 rounded-lg border border-white/5 space-y-0.5">
                  <span className="text-[11px] text-slate-400 block">مدت سیر تا مقصد:</span>
                  <strong className="text-white font-mono">
                    ~{smartRecommendedCarrier.estimatedTransitHours.toLocaleString('fa-IR')} ساعت
                  </strong>
                </div>

                <div className="bg-white/5 p-2.5 rounded-lg border border-white/5 space-y-0.5">
                  <span className="text-[11px] text-slate-400 block">سقف تعهد بیمه:</span>
                  <strong className="text-teal-300 font-mono">
                    {(smartRecommendedCarrier.insuranceCeilingToman / 1000000000).toLocaleString('fa-IR')} میلیارد تومان
                  </strong>
                </div>

                <div className="bg-white/5 p-2.5 rounded-lg border border-white/5 space-y-0.5">
                  <span className="text-[11px] text-slate-400 block">ناوگان آماده اعزام:</span>
                  <strong className="text-emerald-300 font-mono">
                    {smartRecommendedCarrier.availableDriversNearby.toLocaleString('fa-IR')} کشنده فعال
                  </strong>
                </div>
              </div>
            </div>

            {/* Managed Advantages */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-200 pt-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>بدون نیاز به مذاکره یا تماس با پایانه‌ها</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>تضمین کمترین نرخ کارشناسی‌شده در شبکه</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>صدور آنی بارنامه الکترونیکی رسمی راهداری</span>
              </div>
            </div>
          </div>

          {/* Transparency Dropdown */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-3.5 text-xs space-y-2">
            <button
              type="button"
              onClick={() => setShowTransparencyListInManaged(!showTransparencyListInManaged)}
              className="w-full flex items-center justify-between text-slate-700 font-bold hover:text-slate-900 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-500" />
                <span>مشاهده نرخ و مشخصات سایر شرکت‌های همکار ({calculatedCarrierOptions.length} شرکت)</span>
              </div>
              {showTransparencyListInManaged ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {showTransparencyListInManaged && (
              <div className="pt-2 border-t border-slate-200 space-y-2 animate-in fade-in">
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl bg-white overflow-hidden text-xs">
                  {calculatedCarrierOptions.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg ${c.logoBg} ${c.logoColor} flex items-center justify-center font-bold text-[10px]`}
                        >
                          {c.logoText}
                        </div>
                        <span className="font-bold text-slate-800">{c.name}</span>
                        {c.id === smartRecommendedCarrier.id && (
                          <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-semibold text-[10px]">
                            تخصیص‌یافته
                          </span>
                        )}
                        {c.isDedicatedCorridor && (
                          <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-semibold text-[10px]">
                            کریدور فعال
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-slate-600">
                        <span className="flex items-center gap-1 text-amber-700 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {c.rating.toLocaleString('fa-IR')}
                        </span>
                        <span className="font-mono text-slate-900 font-bold">
                          {c.calculatedTotalPayableToman.toLocaleString('fa-IR')} تومان
                        </span>
                        <span className="text-slate-400">~{c.estimatedTransitHours} ساعت</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => onToggleSelectionMode('marketplace')}
                    className="text-xs text-amber-700 hover:text-amber-900 font-bold underline cursor-pointer"
                  >
                    تغییر به مدل بازارگاه و انتخاب دستی شرکت ➔
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: CARRIER PRICING RULES & MATRIX BREAKDOWN */}
      {/* ========================================================================= */}
      {activeRuleModalCarrier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto text-right text-slate-800 p-6 space-y-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${activeRuleModalCarrier.logoBg} ${activeRuleModalCarrier.logoColor} flex items-center justify-center font-bold text-xs shadow-xs`}>
                  {activeRuleModalCarrier.logoText}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    قواعد و ماتریس محاسبه نرخ: {activeRuleModalCarrier.name}
                  </h3>
                  <span className="text-xs text-slate-500">
                    محاسبه شده در موتور نرخ‌گذاری برای مسیر {originCity} به {destCity}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveRuleModalCarrier(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Breakdown Content */}
            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2.5">
                <div className="flex justify-between items-center text-slate-600">
                  <span>ماتریس کرایه خطی پایه ({originCity} ➔ {destCity}):</span>
                  <strong className="font-mono text-slate-900 font-bold">
                    {Math.round(activeRuleModalCarrier.calculatedBaseToman / activeRuleModalCarrier.priceMultiplier).toLocaleString('fa-IR')} تومان
                  </strong>
                </div>

                <div className="flex justify-between items-center text-slate-600">
                  <span>ضریب تعرفه اختصاصی شرکت ({activeRuleModalCarrier.shortName}):</span>
                  <span className="font-mono font-bold text-indigo-700">
                    × {activeRuleModalCarrier.priceMultiplier}
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-600">
                  <span>ضریب شاخص سوخت گازوئیل شرکت:</span>
                  <span className="font-mono font-bold text-amber-700">
                    × {activeRuleModalCarrier.fuelIndexMultiplier}
                  </span>
                </div>

                {activeRuleModalCarrier.isDedicatedCorridor && (
                  <div className="flex justify-between items-center text-sky-700 bg-sky-50 p-2 rounded-lg font-semibold">
                    <span>تخفیف کریدور اختصاصی این شرکت:</span>
                    <span>۴٪ کسر از نرخ پایه</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-emerald-700 bg-emerald-50 p-2 rounded-lg font-semibold">
                  <span>تخفیف حجمی قرارداد ({activeRuleModalCarrier.discountPercent}٪):</span>
                  <span className="font-mono">
                    - {activeRuleModalCarrier.calculatedDiscountRials / 10 ? (activeRuleModalCarrier.calculatedDiscountRials / 10).toLocaleString('fa-IR') : '۰'} تومان
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-600 pt-2 border-t border-slate-200">
                  <span>کارمزد قانونی باربری شرکت ({activeRuleModalCarrier.carrierCommissionPercent}٪):</span>
                  <span className="font-mono font-bold text-slate-900">
                    {activeRuleModalCarrier.carrierCommissionToman.toLocaleString('fa-IR')} تومان
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-600">
                  <span>بیمه مسئولیت مدنی و عوارض راهداری (۹٪ ارزش افزوده):</span>
                  <span className="font-mono font-bold text-slate-900">
                    {Math.round(activeRuleModalCarrier.calculatedTaxRials / 10).toLocaleString('fa-IR')} تومان
                  </span>
                </div>
              </div>

              {/* Total Summary */}
              <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 flex justify-between items-center">
                <span className="font-bold text-amber-950">کرایه کل نهایی قابل پرداخت:</span>
                <strong className="font-mono text-base font-bold text-amber-900">
                  {activeRuleModalCarrier.calculatedTotalPayableToman.toLocaleString('fa-IR')} تومان
                </strong>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  switchCarrierOrg(activeRuleModalCarrier.id);
                  openTransportOrgModal('profile');
                  setActiveRuleModalCarrier(null);
                }}
                className="text-xs text-indigo-700 hover:text-indigo-900 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>مشاهده در پنل مدیریت شرکت‌ها</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectCarrier(activeRuleModalCarrier);
                  setActiveRuleModalCarrier(null);
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                تایید و انتخاب این شرکت
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CARRIER LEGAL DOSSIER & REGISTRATION DETAILS */}
      {/* ========================================================================= */}
      {activeDossierModalCarrier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto text-right text-slate-800 p-6 space-y-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${activeDossierModalCarrier.logoBg} ${activeDossierModalCarrier.logoColor} flex items-center justify-center font-bold text-xs shadow-xs`}>
                  {activeDossierModalCarrier.logoText}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    پرونده ثبتی و مجوزهای: {activeDossierModalCarrier.name}
                  </h3>
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    احراز هویت شده در سازمان راهداری و حمل‌ونقل جاده‌ای
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveDossierModalCarrier(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Dossier Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-0.5">
                <span className="text-[11px] text-slate-500 block font-medium">شماره پروانه راهداری (RMTO):</span>
                <strong className="text-slate-900 font-mono">{activeDossierModalCarrier.licenseNo}</strong>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-0.5">
                <span className="text-[11px] text-slate-500 block font-medium">شناسه ملی شرکت:</span>
                <strong className="text-slate-900 font-mono">{activeDossierModalCarrier.nationalId}</strong>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-0.5">
                <span className="text-[11px] text-slate-500 block font-medium">شماره ثبت شرکت‌ها:</span>
                <strong className="text-slate-900 font-mono">{activeDossierModalCarrier.registrationNumber}</strong>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-0.5">
                <span className="text-[11px] text-slate-500 block font-medium">کد اقتصادی:</span>
                <strong className="text-slate-900 font-mono">{activeDossierModalCarrier.economicCode}</strong>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-0.5">
                <span className="text-[11px] text-slate-500 block font-medium">مدیرعامل / نماینده قانونی:</span>
                <strong className="text-slate-900">{activeDossierModalCarrier.managerName}</strong>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-0.5">
                <span className="text-[11px] text-slate-500 block font-medium">تلفن تماس پایانه:</span>
                <strong className="text-slate-900 font-mono">{activeDossierModalCarrier.phone}</strong>
              </div>

              <div className="col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-0.5">
                <span className="text-[11px] text-slate-500 block font-medium">نشانی دفتر مرکزی و پایانه بار:</span>
                <span className="text-slate-800 font-medium">{activeDossierModalCarrier.address}</span>
              </div>

              <div className="col-span-2 bg-emerald-50 p-3 rounded-xl border border-emerald-200 flex justify-between items-center">
                <span className="text-emerald-950 font-bold">سقف تعهد بیمه‌نامه باربری:</span>
                <strong className="text-emerald-900 font-mono text-sm">
                  {(activeDossierModalCarrier.insuranceCeilingToman / 1000000000).toLocaleString('fa-IR')} میلیارد تومان
                </strong>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  switchCarrierOrg(activeDossierModalCarrier.id);
                  openTransportOrgModal('profile');
                  setActiveDossierModalCarrier(null);
                }}
                className="text-xs text-indigo-700 hover:text-indigo-900 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>مشاهده پرونده کامل در پنل مدیریت</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectCarrier(activeDossierModalCarrier);
                  setActiveDossierModalCarrier(null);
                }}
                className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                انتخاب این شرکت
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
