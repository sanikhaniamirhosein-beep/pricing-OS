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
  { origin: 'تهران', dest: 'بندرعباس', distance: 1280, label: 'تهران — بندرعباس' },
  { origin: 'اصفهان', dest: 'بندر امام خمینی', distance: 540, label: 'اصفهان — بندر امام' },
  { origin: 'مشهد', dest: 'تهران', distance: 900, label: 'مشهد — تهران' },
  { origin: 'تبریز', dest: 'بوشهر', distance: 1310, label: 'تبریز — بوشهر' },
  { origin: 'یزد', dest: 'چابهار', distance: 1420, label: 'یزد — چابهار' },
  { origin: 'اهواز', dest: 'تهران', distance: 830, label: 'اهواز — تهران' },
];

const CARGO_COMMODITIES = [
  { id: 'general', name: 'کالای عمومی', icon: Boxes },
  { id: 'petro', name: 'پتروشیمی و پلیمر', icon: Sparkles },
  { id: 'steel', name: 'فولاد و آهن‌آلات', icon: Gauge },
  { id: 'food', name: 'مواد غذایی', icon: Snowflake },
  { id: 'bulk', name: 'مواد معدنی و فله', icon: Route },
  { id: 'appliances', name: 'لوازم خانگی', icon: Boxes },
];

const TONNAGE_PRESETS = [5, 10, 15, 22, 25];

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
  const [cargoType, setCargoType] = useState('کالای عمومی');
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
      setCalculatedDistance(res.distanceKm || 1000);

      setIsCalculating(false);
    }, 150);
  };

  const handleSwapCities = () => {
    const temp = originCity;
    setOriginCity(destinationCity);
    setDestinationCity(temp);
  };

  const handleCopyQuote = () => {
    if (!estimatedPrice) return;
    const text = `استعلام کرایه حمل بار:\nمسیر: ${originCity} به ${destinationCity}\nناوگان: ${vehicleType} | وزن: ${cargoWeightTons} تن\nکرایه تخمینی: ${estimatedPrice.toLocaleString('fa-IR')} تومان\nمسافت: ${calculatedDistance.toLocaleString('fa-IR')} کیلومتر\nسامانه هوشمند قیمت‌گذاری لجستیک`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const estimatedHours = Math.round(calculatedDistance / 65);
  const pricePerTon = estimatedPrice && cargoWeightTons > 0 ? Math.round(estimatedPrice / cargoWeightTons) : 0;
  const pricePerKm = estimatedPrice && calculatedDistance > 0 ? Math.round(estimatedPrice / calculatedDistance) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150 font-sans overflow-y-auto">
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[94vh] animate-in zoom-in-95 duration-150">
        {/* Header - Minimal & Clean */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600/10 text-teal-700 flex items-center justify-center shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                  استعلام آنلاین کرایه حمل بار
                </h2>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                  محاسبه هوشمند
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                برآورد برخط نرخ بر اساس مسافت، ناوگان و شرایط بارگیری
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleEstimate}
              title="محاسبه مجدد"
              className="p-2 text-slate-400 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-colors cursor-pointer"
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

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto max-h-[calc(94vh-80px)] bg-white space-y-5">
          {/* Quick Corridor Shortcuts */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 text-[11px] font-medium shrink-0">مسیرهای پرتردد:</span>
            <div className="flex items-center gap-1.5 flex-nowrap">
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
                    className={`px-3 py-1 rounded-xl text-xs transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 text-white font-bold shadow-2xs'
                        : 'bg-slate-100/80 hover:bg-slate-200/80 text-slate-700'
                    }`}
                  >
                    <span>{corridor.label}</span>
                    <span className="text-[10px] opacity-70 font-mono">({corridor.distance} کیلومتر)</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Right Column: Parameters (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* 1. Route Section */}
              <div className="p-4 bg-slate-50/60 border border-slate-200/70 rounded-2xl space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    <span>مسیر بارگیری و تخلیه</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleSwapCities}
                    className="flex items-center gap-1 text-[11px] font-medium text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <ArrowLeftRight className="w-3 h-3" />
                    <span>جابجایی</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <CityPickerDropdown
                    id="public-quote-origin"
                    value={originCity}
                    onChange={(val) => {
                      setOriginCity(val);
                      setTimeout(handleEstimate, 100);
                    }}
                    label="شهر مبدأ:"
                    type="origin"
                  />

                  <CityPickerDropdown
                    id="public-quote-dest"
                    value={destinationCity}
                    onChange={(val) => {
                      setDestinationCity(val);
                      setTimeout(handleEstimate, 100);
                    }}
                    label="شهر مقصد:"
                    type="destination"
                  />
                </div>

                {/* Distance & Transit info */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Route className="w-3.5 h-3.5 text-slate-400" />
                    <span>مسافت جاده‌ای:</span>
                    <strong className="font-mono text-slate-800 font-bold">{calculatedDistance.toLocaleString('fa-IR')} کیلومتر</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>زمان سیر:</span>
                    <strong className="font-mono text-slate-800 font-bold">~{estimatedHours} ساعت</strong>
                  </span>
                </div>
              </div>

              {/* 2. Vehicle & Weight Section */}
              <div className="p-4 bg-slate-50/60 border border-slate-200/70 rounded-2xl space-y-3">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-teal-600" />
                  <span>مشخصات ناوگان و بار</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <VehiclePickerDropdown
                    id="public-quote-vehicle"
                    value={vehicleType}
                    onChange={(val) => {
                      setVehicleType(val);
                      setTimeout(handleEstimate, 100);
                    }}
                    label="نوع ناوگان:"
                  />

                  <div>
                    <label className="block text-slate-700 mb-1.5 font-bold flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5 text-slate-500" />
                        <span>وزن خالص (تن):</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {cargoWeightTons} تن
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
                        className="w-full bg-white border border-slate-200 rounded-2xl p-2.5 text-slate-800 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono font-bold"
                      />
                      <span className="text-slate-400 text-xs font-medium px-1">تن</span>
                    </div>
                  </div>
                </div>

                {/* Tonnage presets */}
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-400 shrink-0">وزن متداول:</span>
                  <div className="flex items-center gap-1">
                    {TONNAGE_PRESETS.map((tons) => (
                      <button
                        key={tons}
                        type="button"
                        onClick={() => {
                          setCargoWeightTons(tons);
                          setTimeout(handleEstimate, 100);
                        }}
                        className={`px-2.5 py-0.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                          cargoWeightTons === tons
                            ? 'bg-slate-900 text-white font-bold'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {tons} تن
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Cargo Type Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">نوع کالا:</label>
                <div className="grid grid-cols-3 gap-2">
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
                        className={`p-2 rounded-xl border text-center transition-all flex items-center justify-center gap-1.5 text-xs cursor-pointer ${
                          isSelected
                            ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold'
                            : 'bg-slate-50/80 border-slate-200/80 text-slate-600 hover:bg-white'
                        }`}
                      >
                        <IconComp className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-teal-600' : 'text-slate-400'}`} />
                        <span className="truncate">{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Special Options */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">شرایط ویژه حمل:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsColdChain(!isColdChain);
                      setTimeout(handleEstimate, 100);
                    }}
                    className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                      isColdChain
                        ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold'
                        : 'bg-slate-50/80 border-slate-200/80 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Snowflake className={`w-3.5 h-3.5 ${isColdChain ? 'text-teal-600' : 'text-slate-400'}`} />
                      <span className="text-xs">زنجیره سرد (یخچالی)</span>
                    </div>
                    <span
                      className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                        isColdChain ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300'
                      }`}
                    >
                      {isColdChain && <Check className="w-2.5 h-2.5" />}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsHazardous(!isHazardous);
                      setTimeout(handleEstimate, 100);
                    }}
                    className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                      isHazardous
                        ? 'bg-amber-50 border-amber-500 text-amber-900 font-bold'
                        : 'bg-slate-50/80 border-slate-200/80 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Flame className={`w-3.5 h-3.5 ${isHazardous ? 'text-amber-600' : 'text-slate-400'}`} />
                      <span className="text-xs">کالای خطرناک (ADR)</span>
                    </div>
                    <span
                      className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                        isHazardous ? 'bg-amber-600 border-amber-600 text-white' : 'border-slate-300'
                      }`}
                    >
                      {isHazardous && <Check className="w-2.5 h-2.5" />}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsExpressDelivery(!isExpressDelivery);
                      setTimeout(handleEstimate, 100);
                    }}
                    className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                      isExpressDelivery
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold'
                        : 'bg-slate-50/80 border-slate-200/80 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Zap className={`w-3.5 h-3.5 ${isExpressDelivery ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span className="text-xs">اعزام فوری (اکسپرس)</span>
                    </div>
                    <span
                      className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                        isExpressDelivery ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'
                      }`}
                    >
                      {isExpressDelivery && <Check className="w-2.5 h-2.5" />}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsHighValueInsurance(!isHighValueInsurance);
                      setTimeout(handleEstimate, 100);
                    }}
                    className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                      isHighValueInsurance
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                        : 'bg-slate-50/80 border-slate-200/80 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className={`w-3.5 h-3.5 ${isHighValueInsurance ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span className="text-xs">بیمه تکمیلی ارزش بالا</span>
                    </div>
                    <span
                      className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                        isHighValueInsurance ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
                      }`}
                    >
                      {isHighValueInsurance && <Check className="w-2.5 h-2.5" />}
                    </span>
                  </button>
                </div>
              </div>

              {/* Calculate CTA Button */}
              <button
                type="button"
                onClick={handleEstimate}
                disabled={isCalculating}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md shadow-teal-600/20 transition-all cursor-pointer text-xs"
              >
                {isCalculating ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>در حال محاسبه نرخ...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-teal-200" />
                    <span>محاسبه و به‌روزرسانی کرایه</span>
                  </>
                )}
              </button>
            </div>

            {/* Left Column: Result Card & Breakdown (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              {estimatedPrice !== null ? (
                <div className="bg-slate-50/80 border border-teal-200 rounded-2xl p-5 space-y-4 flex-1 flex flex-col justify-between">
                  {/* Price Banner */}
                  <div className="text-center space-y-1.5 py-3 bg-white rounded-xl border border-teal-100 shadow-2xs">
                    <span className="text-xs text-slate-500 block">
                      کرایه تخمینی حمل ({originCity} به {destinationCity}):
                    </span>
                    <div className="text-3xl font-black font-mono text-teal-800 tracking-tight">
                      {(estimatedPrice / 1000000).toLocaleString('fa-IR')} میلیون تومان
                    </div>
                    <div className="text-xs text-slate-600 font-mono">
                      معادل <strong className="text-slate-900 font-bold">{estimatedPrice.toLocaleString('fa-IR')}</strong> تومان
                    </div>

                    {/* Unit Rates */}
                    <div className="flex items-center justify-center gap-3 pt-2 mt-1 border-t border-slate-100 text-[11px] text-slate-500">
                      <span>
                        هر تن: <strong className="font-mono text-slate-700 font-bold">{pricePerTon.toLocaleString('fa-IR')}</strong> ت
                      </span>
                      <span>•</span>
                      <span>
                        هر کیلومتر: <strong className="font-mono text-slate-700 font-bold">{pricePerKm.toLocaleString('fa-IR')}</strong> ت
                      </span>
                    </div>
                  </div>

                  {/* Clean Breakdown List */}
                  <div className="space-y-1.5 text-xs">
                    <span className="text-[11px] font-bold text-slate-700 block">تفکیک هزینه‌های حمل:</span>
                    <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200/80">
                      <div className="flex items-center justify-between text-slate-600">
                        <span>پایه مسافت ({calculatedDistance.toLocaleString('fa-IR')} کیلومتر):</span>
                        <span className="font-mono font-bold text-slate-800">
                          {Math.round((estimatedPrice * 0.72) / 1000).toLocaleString('fa-IR')} هزار تومان
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>ضریب ناوگان ({vehicleType}):</span>
                        <span className="font-mono font-bold text-slate-800">
                          {Math.round((estimatedPrice * 0.18) / 1000).toLocaleString('fa-IR')} هزار تومان
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>تعدیل سوخت و استهلاک:</span>
                        <span className="font-mono font-bold text-slate-800">
                          {Math.round((estimatedPrice * 0.06) / 1000).toLocaleString('fa-IR')} هزار تومان
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>عوارض و بیمه مسئولیت:</span>
                        <span className="font-mono font-bold text-slate-800">
                          {Math.round((estimatedPrice * 0.04) / 1000).toLocaleString('fa-IR')} هزار تومان
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Minimal Disclaimer */}
                  <div className="p-2.5 bg-amber-50/60 border border-amber-200/70 rounded-xl text-slate-600 text-[11px] leading-relaxed flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-slate-600">
                      نرخ اعلامی بر مبنای تعرفه روز است و با توجه به شرایط تخلیه و بارگیری نهایی خواهد شد.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopyQuote}
                        className="flex-1 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>کپی شد</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                            <span>کپی مشخصات استعلام</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer shadow-2xs"
                        title="چاپ"
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                    </div>

                    {onSelectShipperPortal && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onSelectShipperPortal();
                        }}
                        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        <span>ثبت بارنامه در پنل صاحبان کالا</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center text-slate-400 space-y-2 flex-1 flex flex-col items-center justify-center">
                  <Calculator className="w-8 h-8 text-slate-300" />
                  <p className="text-xs">مشخصات بار را مشخص کرده و دکمه محاسبه را بزنید.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
