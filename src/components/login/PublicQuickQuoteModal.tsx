import React, { useState } from 'react';
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
} from 'lucide-react';
import { usePricing } from '../../store/PricingContext';
import { ShipmentPricingContext } from '../../engine/pricingEngine';

interface PublicQuickQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PublicQuickQuoteModal: React.FC<PublicQuickQuoteModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { calculatePrice } = usePricing();

  const [originCity, setOriginCity] = useState('تهران');
  const [destinationCity, setDestinationCity] = useState('بندرعباس');
  const [vehicleType, setVehicleType] = useState('تریلی چادری');
  const [cargoWeightTons, setCargoWeightTons] = useState(20);
  const [cargoType, setCargoType] = useState('کالای تجاری استاندارد');
  const [isColdChain, setIsColdChain] = useState(false);
  const [isHazardous, setIsHazardous] = useState(false);

  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

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
        isPeakSeason: false,
        channel: 'Public Landing Estimation',
      };

      const res = calculatePrice(ctx);
      setEstimatedPrice(res.finalPriceToman);
      setIsCalculating(false);
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div className="w-full max-w-xl bg-white border border-amber-200/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header - Light & Elegant */}
        <div className="flex items-center justify-between p-5 border-b border-amber-100 bg-[#FBF9F6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-700 flex items-center justify-center shadow-2xs">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base font-display">
                  تخمین آنلاین و سریع کرایه حمل
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-900 border border-teal-200">
                  هوشمند
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                محاسبه تخمینی نرخ بر اساس مبدأ، مقصد و نوع ناوگان
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            aria-label="بستن"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body - Clean Light Theme */}
        <div className="p-6 space-y-5 text-xs overflow-y-auto max-h-[80vh] bg-white">
          {/* Origin & Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 mb-1.5 font-bold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                شهر مبدأ بارگیری:
              </label>
              <select
                value={originCity}
                onChange={(e) => setOriginCity(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-amber-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium transition-all"
              >
                <option value="تهران">تهران (پایانه جنوب / احمدآباد)</option>
                <option value="اصفهان">اصفهان (پایانه امیرکبیر)</option>
                <option value="مشهد">مشهد (پایانه بار شرق)</option>
                <option value="تبریز">تبریز (پایانه ترانزیت)</option>
                <option value="رشت">رشت (گیلان)</option>
                <option value="شیراز">شیراز (فارس)</option>
                <option value="اهواز">اهواز (خوزستان)</option>
                <option value="بندرعباس">بندرعباس (اسکله شهید رجایی)</option>
                <option value="بوشهر">بوشهر (گمرک منطقه ویژه)</option>
                <option value="چابهار">چابهار (بندر شهید بهشتی)</option>
                <option value="بازرگان">بازرگان (مرز ترکیه)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 mb-1.5 font-bold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                شهر مقصد تخلیه:
              </label>
              <select
                value={destinationCity}
                onChange={(e) => setDestinationCity(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-amber-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium transition-all"
              >
                <option value="بندرعباس">بندرعباس (اسکله شهید رجایی)</option>
                <option value="تهران">تهران (انبار مرکزی)</option>
                <option value="بوشهر">بوشهر (گمرک بنادر)</option>
                <option value="بازرگان">بازرگان (مرز ترانزیتی)</option>
                <option value="چابهار">چابهار (کریدور اقیانوسی)</option>
                <option value="اصفهان">اصفهان</option>
                <option value="مشهد">مشهد</option>
                <option value="تبریز">تبریز</option>
                <option value="شیراز">شیراز</option>
              </select>
            </div>
          </div>

          {/* Vehicle Type & Weight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 mb-1.5 font-bold flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-slate-500" />
                نوع ناوگان حمل:
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-amber-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium transition-all"
              >
                <option value="تریلی چادری">تریلی چادری ۲۴ تن (ترانزیت)</option>
                <option value="تریلر کفی">تریلر کفی ۲۵ تن (صنعتی/کانتینر)</option>
                <option value="کشنده یخچال‌دار">کشنده یخچال‌دار ۲۰ تن (یخچالی)</option>
                <option value="کامیون جفت ۱۵ تن">کامیون جفت ۶×۴ (۱۵ تن)</option>
                <option value="کامیون تک ۱۰ تن">کامیون تک ۴×۲ (۱۰ تن)</option>
                <option value="کمرشکن بوژی">کمرشکن بوژی ۶۰ تن (فوق سنگین)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 mb-1.5 font-bold flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-slate-500" />
                وزن تقریبی بار (تن):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={cargoWeightTons}
                  onChange={(e) => setCargoWeightTons(Number(e.target.value))}
                  className="w-full bg-[#FAF8F5] border border-amber-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-mono font-bold transition-all"
                />
                <span className="text-slate-500 font-bold px-2">تن</span>
              </div>
            </div>
          </div>

          {/* Quick options */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => setIsColdChain(!isColdChain)}
              className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                isColdChain
                  ? 'bg-teal-50 border-teal-400 text-teal-900 font-bold shadow-2xs'
                  : 'bg-[#FAF8F5] border-amber-200/70 text-slate-600 hover:bg-white'
              }`}
            >
              <span>نیاز به حمل یخچالی (زنجیره سرد)</span>
              <span className={`w-4 h-4 rounded-md border flex items-center justify-center ${isColdChain ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300'}`}>
                {isColdChain && <CheckCircle2 className="w-3 h-3" />}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsHazardous(!isHazardous)}
              className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                isHazardous
                  ? 'bg-amber-50 border-amber-400 text-amber-950 font-bold shadow-2xs'
                  : 'bg-[#FAF8F5] border-amber-200/70 text-slate-600 hover:bg-white'
              }`}
            >
              <span>محموله خطرناک یا اشتعال‌زا (ADR)</span>
              <span className={`w-4 h-4 rounded-md border flex items-center justify-center ${isHazardous ? 'bg-amber-600 border-amber-600 text-white' : 'border-slate-300'}`}>
                {isHazardous && <CheckCircle2 className="w-3 h-3" />}
              </span>
            </button>
          </div>

          {/* Calculate Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleEstimate}
              disabled={isCalculating}
              className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md shadow-teal-600/20 transition-all cursor-pointer text-sm"
            >
              {isCalculating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>در حال استعلام و برآورد هوشمند...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>محاسبه و استعلام قیمت نهایی</span>
                </>
              )}
            </button>
          </div>

          {/* Result Card: ONLY Final Price + Required Disclaimer */}
          {estimatedPrice !== null && (
            <div className="mt-5 p-6 bg-gradient-to-br from-[#F5FAF8] to-[#EEF7F4] border-2 border-teal-300 rounded-3xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
              {/* Price Header */}
              <div className="text-center space-y-2 py-2">
                <span className="text-xs font-bold text-slate-600 block">
                  مبلغ نهایی تخمینی کرایه حمل ({originCity} به {destinationCity}):
                </span>
                <div className="text-2xl sm:text-3xl font-black font-mono text-teal-800">
                  {(estimatedPrice / 1000000).toLocaleString('fa-IR')} میلیون تومان
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  معادل {estimatedPrice.toLocaleString('fa-IR')} تومان
                </div>
              </div>

              {/* Exact Mandated Disclaimer Message */}
              <div className="p-3.5 bg-white/90 border border-teal-200/80 rounded-2xl text-slate-700 text-xs leading-relaxed flex items-start gap-2.5 shadow-2xs">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="font-medium text-slate-700">
                  این محاسبه‌گر یک سرویس تخمین قیمت مبتنی بر هوش مصنوعی است و ارقام می‌توانند با توجه به شرایط راننده و صاحب بار متغیر باشند.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
