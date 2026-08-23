import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Calculator,
  Truck,
  Sparkles,
  MapPin,
  Scale,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Zap,
  ArrowRight,
  ArrowLeftRight,
  Clock,
  ShieldCheck,
  Snowflake,
  Flame,
  RefreshCw,
  Copy,
  Check,
  Printer,
  FileText,
  Sliders,
  TrendingUp,
  Route,
  Gauge,
  Boxes,
  ShieldAlert,
  Building2,
} from 'lucide-react';
import { usePricing } from '../../store/PricingContext';
import { ShipmentPricingContext } from '../../engine/pricingEngine';
import { CityPickerDropdown } from '../common/menus/CityPickerDropdown';
import { VehiclePickerDropdown } from '../common/menus/VehiclePickerDropdown';

interface PublicQuickQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectShipperPortal?: () => void;
}

// Popular national corridors for quick 1-click selection
const POPULAR_CORRIDORS = [
  { origin: 'تهران', dest: 'بندرعباس', distance: 1280, label: 'تهران ⇄ بندرعباس' },
  { origin: 'اصفهان', dest: 'بندر امام خمینی', distance: 540, label: 'اصفهان ⇄ بندر امام' },
  { origin: 'مشهد', dest: 'تهران', distance: 900, label: 'مشهد ⇄ تهران' },
  { origin: 'تبریز', dest: 'بوشهر', distance: 1310, label: 'تبریز ⇄ بوشهر' },
  { origin: 'یزد', dest: 'چابهار', distance: 1420, label: 'یزد ⇄ چابهار' },
  { origin: 'اهواز', dest: 'تهران', distance: 830, label: 'اهواز ⇄ تهران' },
];

const CARGO_COMMODITIES = [
  { id: 'general', name: 'کالای تجاری استاندارد', icon: Boxes },
  { id: 'petro', name: 'محصولات پتروشیمی و پلیمر', icon: Sparkles },
  { id: 'steel', name: 'فولاد، میلگرد و آهن‌آلات', icon: Gauge },
  { id: 'food', name: 'مواد غذایی و کشاورزی', icon: Snowflake },
  { id: 'bulk', name: 'مواد معدنی و فله', icon: Route },
  { id: 'appliances', name: 'لوازم خانگی و بسته‌بندی', icon: Boxes },
];

const TONNAGE_PRESETS = [4, 10, 15, 22, 25];

export const PublicQuickQuoteModal: React.FC<PublicQuickQuoteModalProps> = ({
  isOpen,
  onClose,
  onSelectShipperPortal,
}) => {
  const { calculatePrice } = usePricing();

  const [originCity, setOriginCity] = useState('تهران');
  const [destinationCity, setDestinationCity] = useState('بندرعباس');
  const [vehicleType, setVehicleType] = useState('تریلی چادری');
  const [cargoWeightTons, setCargoWeightTons] = useState(22);
  const [cargoType, setCargoType] = useState('کالای تجاری استاندارد');
  const [isColdChain, setIsColdChain] = useState(false);
  const [isHazardous, setIsHazardous] = useState(false);
  const [isExpressDelivery, setIsExpressDelivery] = useState(false);
  const [isHighValueInsurance, setIsHighValueInsurance] = useState(false);

  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [costBasis, setCostBasis] = useState<number | null>(null);
  const [calculatedDistance, setCalculatedDistance] = useState<number>(1280);
  const [isCalculating, setIsCalculating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Auto-calculate on open or initial mount
  useEffect(() => {
    if (isOpen) {
      handleEstimate();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleEstimate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const ctx: ShipmentPricingContext = {
        originCity,
        destinationCity,
        vehicleType,
        cargoType,
        cargoWeightTons,
        isColdChain,
        isHazardous,
        isPeakSeason: isExpressDelivery,
        channel: 'Public Landing Estimation',
      };

      const res = calculatePrice(ctx);
      setEstimatedPrice(res.finalPriceToman);
      setCostBasis(res.costBasisToman);

      // Estimate distance from applied rules or corridor lookup
      const foundCorridor = POPULAR_CORRIDORS.find(
        (c) =>
          (c.origin === originCity && c.dest === destinationCity) ||
          (c.origin === destinationCity && c.dest === originCity)
      );
      if (foundCorridor) {
        setCalculatedDistance(foundCorridor.distance);
      } else {
        setCalculatedDistance(950);
      }

      setIsCalculating(false);
    }, 200);
  };

  const handleSwapCities = () => {
    const temp = originCity;
    setOriginCity(destinationCity);
    setDestinationCity(temp);
  };

  const handleCopyQuote = () => {
    if (!estimatedPrice) return;
    const text = `استعلام آنلاین کرایه حمل بار:\nمبدأ: ${originCity} | مقصد: ${destinationCity}\nناوگان: ${vehicleType} | تناژ: ${cargoWeightTons} تن\nمبلغ تخمینی: ${(estimatedPrice / 1000000).toLocaleString('fa-IR')} میلیون تومان (${estimatedPrice.toLocaleString('fa-IR')} تومان)\nمسافت تقریبی: ${calculatedDistance.toLocaleString('fa-IR')} کیلومتر\nسامانه هوشمند قیمت‌گذاری لجستیک کشور`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const estimatedHours = Math.round(calculatedDistance / 65);
  const pricePerTon = estimatedPrice && cargoWeightTons > 0 ? Math.round(estimatedPrice / cargoWeightTons) : 0;
  const pricePerKm = estimatedPrice && calculatedDistance > 0 ? Math.round(estimatedPrice / calculatedDistance) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200 font-sans overflow-y-auto">
      <div className="w-full max-w-5xl bg-white border border-amber-200/90 rounded-3xl sm:rounded-4xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[94vh] animate-in zoom-in-95 duration-200">
        {/* Header - Spacious & Elegant */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-amber-100 bg-[#FBF9F6] shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-700 flex items-center justify-center shadow-xs shrink-0">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-slate-900 text-base sm:text-lg font-display">
                  استعلام آنلاین و جامع کرایه حمل بار جاده‌ای
                </h2>
                <span className="text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 border border-teal-200">
                  محاسبه‌گر پیشرفته هوش مصنوعی
                </span>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md hidden sm:inline-block">
                  پکیج فعال SP-2026
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                محاسبه بلادرنگ تعرفه و پیش‌بینی کرایه بر اساس کریدورهای سراسری، نوع ناوگان و ضرایب استاندارد لجستیک
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleEstimate}
              title="محاسبه مجدد"
              className="p-2 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isCalculating ? 'animate-spin text-teal-600' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              aria-label="بستن"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body - Expanded 2-Column Responsive Layout */}
        <div className="p-5 sm:p-7 overflow-y-auto max-h-[calc(94vh-90px)] bg-white">
          {/* Quick Corridor Shortcuts Bar */}
          <div className="mb-6 p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="text-xs font-bold text-amber-950">مسیرهای پرتردد و بارنامه‌های پرتکرار کشوری:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_CORRIDORS.map((corridor, idx) => {
                const isActive =
                  (originCity === corridor.origin && destinationCity === corridor.dest) ||
                  (originCity === corridor.dest && destinationCity === corridor.origin);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setOriginCity(corridor.origin);
                      setDestinationCity(corridor.dest);
                      setCalculatedDistance(corridor.distance);
                      setTimeout(handleEstimate, 50);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-amber-200/80 hover:bg-amber-100/60'
                    }`}
                  >
                    <span>{corridor.label}</span>
                    <span className="text-[10px] opacity-75 font-mono">({corridor.distance} km)</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
            {/* Right Column: Parameters & Logistic Settings (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* 1. Route Matrix Section */}
              <div className="p-4 sm:p-5 bg-slate-50/90 border border-slate-200/90 rounded-2xl sm:rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-teal-600" />
                    <span>مبدأ بارگیری و مقصد نهایی تخلیه:</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleSwapCities}
                    className="flex items-center gap-1 text-[11px] font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-xl transition-all cursor-pointer border border-teal-200/70"
                  >
                    <ArrowLeftRight className="w-3 h-3" />
                    <span>جابجایی مبدأ و مقصد</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CityPickerDropdown
                    id="public-quote-origin"
                    value={originCity}
                    onChange={(val) => {
                      setOriginCity(val);
                      setTimeout(handleEstimate, 100);
                    }}
                    label="شهر مبدأ بارگیری:"
                    type="origin"
                  />

                  <CityPickerDropdown
                    id="public-quote-dest"
                    value={destinationCity}
                    onChange={(val) => {
                      setDestinationCity(val);
                      setTimeout(handleEstimate, 100);
                    }}
                    label="شهر مقصد تخلیه:"
                    type="destination"
                  />
                </div>

                {/* Route Distance & Transit Info Pill */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 text-xs text-slate-600">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 font-bold text-slate-700">
                      <Route className="w-3.5 h-3.5 text-slate-500" />
                      <span>مسافت تخمینی:</span>
                      <strong className="font-mono text-teal-800 font-bold">{calculatedDistance.toLocaleString('fa-IR')} کیلومتر</strong>
                    </span>
                    <span className="flex items-center gap-1.5 font-bold text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>مدت سیر ناوگان:</span>
                      <strong className="font-mono text-slate-800">~{estimatedHours} ساعت</strong>
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                    کریدور ترانزیت جاده‌ای درجه ۱
                  </span>
                </div>
              </div>

              {/* 2. Vehicle & Capacity Section */}
              <div className="p-4 sm:p-5 bg-slate-50/90 border border-slate-200/90 rounded-2xl sm:rounded-3xl space-y-4">
                <span className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-teal-600" />
                  <span>نوع ناوگان و ظرفیت تناژ محموله:</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <VehiclePickerDropdown
                    id="public-quote-vehicle"
                    value={vehicleType}
                    onChange={(val) => {
                      setVehicleType(val);
                      setTimeout(handleEstimate, 100);
                    }}
                    label="نوع ناوگان حمل:"
                  />

                  <div>
                    <label className="block text-slate-700 mb-1.5 font-bold flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5 text-slate-500" />
                        <span>وزن تقریبی بار (تن):</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono font-bold">
                        {cargoWeightTons} تن خالص
                      </span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={cargoWeightTons}
                        onChange={(e) => {
                          setCargoWeightTons(Math.max(1, Number(e.target.value)));
                          setTimeout(handleEstimate, 100);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-2xl p-2.5 text-slate-800 text-xs focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-mono font-bold transition-all shadow-xs"
                      />
                      <span className="text-slate-500 font-bold px-2">تن</span>
                    </div>
                  </div>
                </div>

                {/* Quick Tonnage Presets */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] text-slate-500 font-medium shrink-0">تناژهای استاندارد:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {TONNAGE_PRESETS.map((tons) => (
                      <button
                        key={tons}
                        type="button"
                        onClick={() => {
                          setCargoWeightTons(tons);
                          setTimeout(handleEstimate, 100);
                        }}
                        className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                          cargoWeightTons === tons
                            ? 'bg-teal-700 text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {tons} تن
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Commodity Category Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">دسته‌بندی ماهیت کالا:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CARGO_COMMODITIES.map((c) => {
                    const isSelected = cargoType === c.name;
                    const IconComp = c.icon;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setCargoType(c.name);
                          setTimeout(handleEstimate, 100);
                        }}
                        className={`p-2.5 rounded-xl border text-right transition-all flex items-center gap-2 text-xs cursor-pointer ${
                          isSelected
                            ? 'bg-teal-50 border-teal-500 text-teal-950 font-bold shadow-xs'
                            : 'bg-slate-50/60 border-slate-200 text-slate-600 hover:bg-white'
                        }`}
                      >
                        <IconComp className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-teal-700' : 'text-slate-400'}`} />
                        <span className="truncate">{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Special Cargo Options & Surcharges (4 Options Grid) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">ویژگی‌ها و شرایط اختصاصی حمل:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsColdChain(!isColdChain);
                      setTimeout(handleEstimate, 100);
                    }}
                    className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                      isColdChain
                        ? 'bg-teal-50 border-teal-500 text-teal-950 font-bold shadow-xs'
                        : 'bg-[#FAF8F5] border-amber-200/70 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Snowflake className={`w-4 h-4 ${isColdChain ? 'text-teal-600' : 'text-slate-400'}`} />
                      <span className="text-xs">زنجیره سرد یخچالی (-۱۸°C)</span>
                    </div>
                    <span
                      className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                        isColdChain ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300'
                      }`}
                    >
                      {isColdChain && <Check className="w-3 h-3" />}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsHazardous(!isHazardous);
                      setTimeout(handleEstimate, 100);
                    }}
                    className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                      isHazardous
                        ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold shadow-xs'
                        : 'bg-[#FAF8F5] border-amber-200/70 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Flame className={`w-4 h-4 ${isHazardous ? 'text-amber-600' : 'text-slate-400'}`} />
                      <span className="text-xs">بار اشتعال‌زا / خطرناک (ADR)</span>
                    </div>
                    <span
                      className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                        isHazardous ? 'bg-amber-600 border-amber-600 text-white' : 'border-slate-300'
                      }`}
                    >
                      {isHazardous && <Check className="w-3 h-3" />}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsExpressDelivery(!isExpressDelivery);
                      setTimeout(handleEstimate, 100);
                    }}
                    className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                      isExpressDelivery
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-950 font-bold shadow-xs'
                        : 'bg-[#FAF8F5] border-amber-200/70 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Zap className={`w-4 h-4 ${isExpressDelivery ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span className="text-xs">اعزام اکسپرس و بارگیری فوری</span>
                    </div>
                    <span
                      className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                        isExpressDelivery ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'
                      }`}
                    >
                      {isExpressDelivery && <Check className="w-3 h-3" />}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsHighValueInsurance(!isHighValueInsurance);
                      setTimeout(handleEstimate, 100);
                    }}
                    className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                      isHighValueInsurance
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs'
                        : 'bg-[#FAF8F5] border-amber-200/70 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className={`w-4 h-4 ${isHighValueInsurance ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span className="text-xs">بیمه تکمیلی ارزش بالا تا ۵ میلیارد</span>
                    </div>
                    <span
                      className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                        isHighValueInsurance ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
                      }`}
                    >
                      {isHighValueInsurance && <Check className="w-3 h-3" />}
                    </span>
                  </button>
                </div>
              </div>

              {/* Calculate Trigger Button */}
              <button
                type="button"
                onClick={handleEstimate}
                disabled={isCalculating}
                className="w-full py-4 bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white rounded-2xl font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-teal-600/25 transition-all cursor-pointer text-sm"
              >
                {isCalculating ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>در حال استعلام و برآورد هوشمند کرایه...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-teal-200" />
                    <span>محاسبه و استعلام قیمت نهایی</span>
                  </>
                )}
              </button>
            </div>

            {/* Left Column: Result Card, Breakdown, and Next Step CTA (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
              {estimatedPrice !== null ? (
                <div className="bg-gradient-to-br from-[#F5FAF8] via-[#EEF7F4] to-[#E5F3EF] border-2 border-teal-300/90 rounded-3xl p-6 shadow-md space-y-5 flex-1 flex flex-col justify-between">
                  {/* Price Banner */}
                  <div className="text-center space-y-2 py-3 bg-white/90 rounded-2xl border border-teal-200/80 shadow-xs">
                    <span className="text-xs font-bold text-slate-600 block">
                      مبلغ نهایی تخمینی کرایه حمل ({originCity} به {destinationCity}):
                    </span>
                    <div className="text-3xl sm:text-4xl font-black font-mono text-teal-800 tracking-tight">
                      {(estimatedPrice / 1000000).toLocaleString('fa-IR')} میلیون تومان
                    </div>
                    <div className="text-xs text-slate-500 font-mono font-medium">
                      معادل <strong className="text-slate-800">{estimatedPrice.toLocaleString('fa-IR')}</strong> تومان
                    </div>

                    {/* Secondary Unit Metrics */}
                    <div className="flex items-center justify-center gap-4 pt-2 mt-2 border-t border-slate-100 text-[11px] text-slate-600">
                      <span>
                        هر تن بار: <strong className="font-mono text-slate-800">{pricePerTon.toLocaleString('fa-IR')}</strong> ت
                      </span>
                      <span>•</span>
                      <span>
                        هر کیلومتر: <strong className="font-mono text-slate-800">{pricePerKm.toLocaleString('fa-IR')}</strong> ت
                      </span>
                    </div>
                  </div>

                  {/* Summary Breakdown Elements */}
                  <div className="space-y-2 text-xs">
                    <span className="text-[11px] font-bold text-teal-950 block">خلاصه عوامل موثر در محاسبه:</span>
                    <div className="space-y-1.5 bg-white/70 p-3 rounded-2xl border border-teal-200/60">
                      <div className="flex items-center justify-between text-slate-700">
                        <span>پایه مسافت ({calculatedDistance} کیلومتر جاده‌ای):</span>
                        <span className="font-mono font-bold text-slate-800">
                          {Math.round((estimatedPrice * 0.72) / 1000).toLocaleString('fa-IR')} هزار تومان
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700">
                        <span>ضریب ناوگان ({vehicleType}):</span>
                        <span className="font-mono font-bold text-slate-800">
                          {Math.round((estimatedPrice * 0.18) / 1000).toLocaleString('fa-IR')} هزار تومان
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700">
                        <span>تعدیل سوخت گازوئیل و استهلاک مسیر:</span>
                        <span className="font-mono font-bold text-slate-800">
                          {Math.round((estimatedPrice * 0.06) / 1000).toLocaleString('fa-IR')} هزار تومان
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700">
                        <span>عوارض جاده‌ای و بیمه مسئولیت:</span>
                        <span className="font-mono font-bold text-slate-800">
                          {Math.round((estimatedPrice * 0.04) / 1000).toLocaleString('fa-IR')} هزار تومان
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Exact Mandated Disclaimer Box */}
                  <div className="p-4 bg-white border border-teal-200/90 rounded-2xl text-slate-700 text-xs leading-relaxed flex items-start gap-3 shadow-xs">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="font-medium text-slate-700 leading-relaxed">
                      این محاسبه‌گر یک سرویس تخمین قیمت مبتنی بر هوش مصنوعی است و ارقام می‌توانند با توجه به شرایط راننده و صاحب بار متغیر باشند.
                    </p>
                  </div>

                  {/* Quick Share / Copy & Booking CTA */}
                  <div className="space-y-2.5 pt-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopyQuote}
                        className="flex-1 py-2.5 bg-white hover:bg-slate-50 border border-teal-300 text-teal-900 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-600" />
                            <span>کپی شد!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-teal-700" />
                            <span>کپی مشخصات استعلام</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-3.5 py-2.5 bg-white hover:bg-slate-50 border border-teal-300 text-teal-900 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                        title="چاپ پیش‌فاکتور استعلام"
                      >
                        <Printer className="w-4 h-4 text-teal-700" />
                      </button>
                    </div>

                    {onSelectShipperPortal && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onSelectShipperPortal();
                        }}
                        className="w-full py-3 bg-gradient-to-r from-teal-700 to-teal-600 hover:from-teal-800 hover:to-teal-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md shadow-teal-700/20 transition-all cursor-pointer"
                      >
                        <Building2 className="w-4 h-4" />
                        <span>ورود صاحبان بار جهت ثبت بارنامه رسمی</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center text-slate-400 space-y-3 flex-1 flex flex-col items-center justify-center">
                  <Calculator className="w-12 h-12 text-slate-300 animate-bounce" />
                  <p className="text-xs">لطفاً مشخصات بار را تکمیل کرده و دکمه محاسبه را فشار دهید.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
