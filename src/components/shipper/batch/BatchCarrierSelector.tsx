import React, { useState, useMemo } from 'react';
import {
  Building2,
  Scale,
  Sparkles,
  TrendingDown,
  ShieldCheck,
  Star,
  Truck,
  Zap,
  CheckCircle2,
  Check,
  ChevronDown,
  ChevronUp,
  Info,
  SlidersHorizontal,
  Award,
  BadgeCheck,
  ExternalLink,
  MapPin,
  Phone,
  Clock,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { CarrierOrgProfile, CARRIER_ORGANIZATIONS } from '../../../data/mockOrganizationProfiles';
import { BatchShipmentRow } from '../../../data/mockShipperData';
import { BatchCarrierCompareModal } from './BatchCarrierCompareModal';
import { CarrierDetailModal } from './CarrierDetailModal';

interface BatchCarrierSelectorProps {
  selectedCarrierId: string;
  onSelectCarrier: (carrierId: string) => void;
  allocationMode: 'single' | 'smart_corridor';
  onToggleAllocationMode: (mode: 'single' | 'smart_corridor') => void;
  baseEstimatedRials: number;
  totalWeightTons: number;
  totalLoadsCount: number;
  batchRows: BatchShipmentRow[];
}

type FilterCategory = 'all' | 'cheapest' | 'top_rated' | 'insurance' | 'transit' | 'cold_chain';

export const BatchCarrierSelector: React.FC<BatchCarrierSelectorProps> = ({
  selectedCarrierId,
  onSelectCarrier,
  allocationMode,
  onToggleAllocationMode,
  baseEstimatedRials,
  totalWeightTons,
  totalLoadsCount,
  batchRows,
}) => {
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [inspectingCarrier, setInspectingCarrier] = useState<CarrierOrgProfile | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  // Filter carriers based on active category
  const filteredCarriers = useMemo(() => {
    return CARRIER_ORGANIZATIONS.filter((carrier) => {
      if (filterCategory === 'all') return true;
      if (filterCategory === 'cheapest') return (carrier.discountPercent || 0) >= 8.0 || (carrier.priceMultiplier || 1.0) < 1.0;
      if (filterCategory === 'top_rated') return (carrier.rating || 0) >= 4.85;
      if (filterCategory === 'insurance') return (carrier.insuranceCeilingToman || 0) >= 80000000000;
      if (filterCategory === 'transit') {
        return carrier.strengths.some((s) => s.includes('ترانزیت') || s.includes('ترافیکی') || s.includes('سنگین'));
      }
      if (filterCategory === 'cold_chain') {
        return carrier.nameFa.includes('سرد') || carrier.strengths.some((s) => s.includes('دما') || s.includes('یخچال') || s.includes('فاسد'));
      }
      return true;
    });
  }, [filterCategory]);

  const activeCarrier = useMemo(() => {
    return CARRIER_ORGANIZATIONS.find((c) => c.id === selectedCarrierId) || CARRIER_ORGANIZATIONS[0];
  }, [selectedCarrierId]);

  // Calculate carrier specific savings and price
  const calculateCarrierBatchPrice = (carrier: CarrierOrgProfile) => {
    const mult = carrier.priceMultiplier || 1.0;
    const discPct = carrier.discountPercent || 7.0;
    const adjustedBase = baseEstimatedRials * mult;
    const discountVal = (adjustedBase * discPct) / 100;
    const finalPrice = adjustedBase - discountVal;
    return {
      finalPriceToman: Math.round(finalPrice / 10),
      discountToman: Math.round(discountVal / 10),
      discountPct: discPct,
    };
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-amber-50/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-md shadow-amber-500/20 mt-0.5">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 font-title">
                  انتخاب شرکت حمل‌ونقل و متصدی صدور بارنامه (Carrier Selection)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold font-mono">
                  {CARRIER_ORGANIZATIONS.length} شرکت معتبر راهداری
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
                بررسی و مقایسه مزیت‌های رقابتی، سقف بیمه مسئولیت، نرخ تخفیف سازمانی و ناوگان فعال شرکت‌های حمل‌ونقل طرف قرارداد جهت تخصیص به دسته بار
              </p>
            </div>
          </div>

          {/* Quick Actions in Header */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsCompareModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 shadow-2xs hover:border-amber-400 transition-all cursor-pointer"
            >
              <Scale className="w-4 h-4 text-amber-600" />
              <span>جدول مقایسه سر به سر</span>
            </button>

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <span>{isExpanded ? 'جمع کردن' : 'مشاهده شرکت‌ها'}</span>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Selected Carrier Status Bar */}
        <div className="mt-4 pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50/60 rounded-2xl p-3.5 border border-amber-200/70">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl ${activeCarrier.logoBg} ${activeCarrier.logoColor} flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs`}
            >
              {activeCarrier.logoText}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-amber-900 font-bold">متصدی منتخب کنونی دسته:</span>
                <strong className="text-xs font-bold text-slate-900">{activeCarrier.nameFa}</strong>
                <span className="text-[10px] bg-white text-emerald-800 px-2 py-0.2 rounded-full border border-emerald-200 font-bold font-mono">
                  {activeCarrier.discountPercent}٪ تخفیف
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                مزیت کلیدی: {activeCarrier.strengths[0]} • سقف بیمه: {(activeCarrier.insuranceCeilingToman / 1000000000).toLocaleString('fa-IR')} میلیارد تومان
              </p>
            </div>
          </div>

          {/* Allocation Mode Toggle */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-amber-200 text-xs shrink-0 font-bold">
            <button
              type="button"
              onClick={() => onToggleAllocationMode('single')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                allocationMode === 'single'
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>تخصیص کل دسته به این شرکت</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleAllocationMode('smart_corridor')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                allocationMode === 'smart_corridor'
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>تطبیق هوشمند بر اساس کریدورها</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Expanded Content */}
      {isExpanded && (
        <div className="p-5 sm:p-6 space-y-6">
          {/* Advantage / Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1 ml-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span>فیلتر بر اساس مزیت:</span>
            </span>

            <button
              type="button"
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              همه شرکت‌ها ({CARRIER_ORGANIZATIONS.length})
            </button>

            <button
              type="button"
              onClick={() => setFilterCategory('cheapest')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterCategory === 'cheapest'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <TrendingDown className="w-3.5 h-3.5" />
              <span>اقتصادی‌ترین و بالاترین تخفیف</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterCategory('top_rated')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterCategory === 'top_rated'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              <span>بالاترین امتیاز رضایت مشتریان</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterCategory('insurance')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterCategory === 'insurance'
                  ? 'bg-teal-700 text-white shadow-2xs'
                  : 'bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>حداکثر پوشش بیمه مسئولیت</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterCategory('transit')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterCategory === 'transit'
                  ? 'bg-blue-700 text-white shadow-2xs'
                  : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>ترانزیت و بارهای فوق‌سنگین</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterCategory('cold_chain')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterCategory === 'cold_chain'
                  ? 'bg-cyan-700 text-white shadow-2xs'
                  : 'bg-cyan-50 text-cyan-800 hover:bg-cyan-100 border border-cyan-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>زنجیره سرد و بار یخچالی</span>
            </button>
          </div>

          {/* Carriers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredCarriers.map((carrier) => {
              const isSelected = selectedCarrierId === carrier.id;
              const pricing = calculateCarrierBatchPrice(carrier);

              return (
                <div
                  key={carrier.id}
                  className={`rounded-3xl border transition-all relative flex flex-col justify-between p-5 ${
                    isSelected
                      ? 'border-amber-500 bg-gradient-to-b from-amber-50/50 to-white shadow-md ring-2 ring-amber-400/30'
                      : 'border-slate-200 hover:border-amber-300 bg-white hover:shadow-sm'
                  }`}
                >
                  {/* Top Badge: Selected Indicator */}
                  {isSelected && (
                    <div className="absolute -top-3 left-6 bg-amber-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>متصدی انتخابی</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Carrier Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-2xl ${carrier.logoBg} ${carrier.logoColor} flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs`}
                        >
                          {carrier.logoText}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-xs sm:text-sm font-title flex items-center gap-1.5">
                            <span>{carrier.nameFa}</span>
                          </h3>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5 font-mono">
                            <span>{carrier.city}</span>
                            <span>•</span>
                            <span>پروانه راهداری: {carrier.licenseNumber}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setInspectingCarrier(carrier)}
                        className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        title="مشاهده مدارک و جزئیات کامل"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Key Strengths & Advantages (بخش مزیت‌های برجسته) */}
                    <div className="bg-slate-50 rounded-2xl p-3 space-y-2 border border-slate-100">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                        <Award className="w-3.5 h-3.5 text-amber-600" />
                        <span>مزیت‌های شاخص این شرکت:</span>
                      </div>
                      <div className="space-y-1.5">
                        {carrier.strengths.map((strength, sIdx) => (
                          <div key={sIdx} className="flex items-start gap-1.5 text-[11px] text-slate-700 leading-tight">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{strength}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Key Metrics Strip (سقف بیمه، تخفیف، ناوگان، امتیاز) */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 space-y-0.5">
                        <span className="text-[10px] text-slate-400 block">پوشش بیمه مسئولیت:</span>
                        <div className="font-bold text-teal-800 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                          <span>{(carrier.insuranceCeilingToman / 1000000000).toLocaleString('fa-IR')} میلیارد ت</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 space-y-0.5">
                        <span className="text-[10px] text-slate-400 block">تخفیف قرارداد سازمانی:</span>
                        <div className="font-bold text-emerald-700 flex items-center gap-1 font-mono">
                          <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{carrier.discountPercent}٪ تخفیف</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 space-y-0.5">
                        <span className="text-[10px] text-slate-400 block">ناوگان ملکی و رانندگان:</span>
                        <div className="font-bold text-slate-800 flex items-center gap-1 font-mono">
                          <Truck className="w-3.5 h-3.5 text-blue-600" />
                          <span>{carrier.fleetCount.toLocaleString('fa-IR')} دستگاه</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 space-y-0.5">
                        <span className="text-[10px] text-slate-400 block">رضایت و سفرها:</span>
                        <div className="font-bold text-amber-700 flex items-center gap-1 font-mono">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>{carrier.rating}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            ({carrier.completedTrips.toLocaleString('fa-IR')})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Dedicated Corridors Preview */}
                    {carrier.dedicatedCorridors && carrier.dedicatedCorridors.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 block">کریدورهای با ظرفیت روزانه بالا:</span>
                        <div className="flex flex-wrap gap-1">
                          {carrier.dedicatedCorridors.slice(0, 3).map((cor, cIdx) => (
                            <span
                              key={cIdx}
                              className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-mono"
                            >
                              {cor.origin} ➔ {cor.dest}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Calculated Batch Impact and Action Button */}
                  <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">مبلغ کل برآورد دسته:</span>
                        <strong className="font-mono text-slate-900 font-bold text-sm">
                          {pricing.finalPriceToman.toLocaleString('fa-IR')} تومان
                        </strong>
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] text-emerald-600 font-bold block">مجموع سود/تخفیف:</span>
                        <span className="font-mono text-emerald-700 font-bold text-xs">
                          {pricing.discountToman.toLocaleString('fa-IR')} تومان
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setInspectingCarrier(carrier)}
                        className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>پرونده و مجوز</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onSelectCarrier(carrier.id)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-2xs hover:shadow-xs'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>انتخاب شد</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 text-white" />
                            <span>انتخاب این شرکت</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Side-by-Side Compare Modal */}
      <BatchCarrierCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        selectedCarrierId={selectedCarrierId}
        onSelectCarrier={onSelectCarrier}
        baseEstimatedRials={baseEstimatedRials}
        totalWeightTons={totalWeightTons}
        totalLoadsCount={totalLoadsCount}
      />

      {/* Carrier Detail Dossier Modal */}
      <CarrierDetailModal
        carrier={inspectingCarrier}
        isOpen={Boolean(inspectingCarrier)}
        onClose={() => setInspectingCarrier(null)}
        onSelectCarrier={onSelectCarrier}
        isSelected={inspectingCarrier?.id === selectedCarrierId}
      />
    </div>
  );
};
