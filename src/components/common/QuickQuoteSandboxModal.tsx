import React, { useState } from 'react';
import {
  X,
  Calculator,
  Truck,
  ArrowRight,
  Snowflake,
  Flame,
  Calendar,
  Building2,
  CheckCircle2,
  FileSearch,
  Sparkles,
  Zap,
  MapPin,
  Scale,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { usePricing } from '../../store/PricingContext';
import { ShipmentPricingContext } from '../../engine/pricingEngine';
import { CityPickerDropdown } from './menus/CityPickerDropdown';
import { VehiclePickerDropdown } from './menus/VehiclePickerDropdown';
import { ContractPickerDropdown } from './menus/ContractPickerDropdown';

export const QuickQuoteSandboxModal: React.FC = () => {
  const { isQuickQuoteOpen, setIsQuickQuoteOpen, calculatePrice, setSelectedTrace, contracts } = usePricing();

  const [originCity, setOriginCity] = useState('تهران');
  const [destinationCity, setDestinationCity] = useState('بندرعباس');
  const [vehicleType, setVehicleType] = useState('کشنده یخچال‌دار');
  const [cargoWeightTons, setCargoWeightTons] = useState(22);
  const [cargoType, setCargoType] = useState('مواد غذایی و فاسدشدنی');
  const [isColdChain, setIsColdChain] = useState(true);
  const [isHazardous, setIsHazardous] = useState(false);
  const [isPeakSeason, setIsPeakSeason] = useState(false);
  const [contractId, setContractId] = useState('');

  const [quoteResult, setQuoteResult] = useState<any | null>(null);

  if (!isQuickQuoteOpen) return null;

  const handleCalculate = () => {
    const ctx: ShipmentPricingContext = {
      originCity,
      destinationCity,
      vehicleType,
      cargoType,
      cargoWeightTons,
      isColdChain,
      isHazardous,
      isPeakSeason,
      customerContractId: contractId || undefined,
      channel: 'Web Portal Simulator',
    };

    const res = calculatePrice(ctx);
    setQuoteResult(res);
  };

  const handleOpenTrace = () => {
    if (quoteResult && quoteResult.trace) {
      setSelectedTrace(quoteResult.trace);
      setIsQuickQuoteOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div className="w-full max-w-2xl bg-white border border-[#D3D1C7] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#F1EFE8] bg-[#FAFAF8]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E1F5EE] text-[#085041] border border-[#9FE1CB] flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#2C2C2A] text-sm">
                  شبیه‌ساز و استعلام نرخ باربری
                </h3>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#E1F5EE] text-[#04342C] border border-[#9FE1CB]">
                  پنل مدیریت
                </span>
              </div>
              <p className="text-xs text-[#5F5E5A] mt-0.5">
                محاسبه بلادرنگ بر اساس پکیج تعرفه فعال و اعتبارسنجی قوانین
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsQuickQuoteOpen(false)}
            className="p-2 text-[#888780] hover:text-[#2C2C2A] hover:bg-[#F1EFE8] rounded-xl transition-colors cursor-pointer"
            aria-label="بستن"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-xs overflow-y-auto max-h-[75vh] bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Origin */}
            <CityPickerDropdown
              id="sandbox-origin-city"
              value={originCity}
              onChange={setOriginCity}
              label="شهر مبدأ:"
              type="origin"
            />

            {/* Destination */}
            <CityPickerDropdown
              id="sandbox-dest-city"
              value={destinationCity}
              onChange={setDestinationCity}
              label="شهر مقصد:"
              type="destination"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Vehicle Type */}
            <VehiclePickerDropdown
              id="sandbox-vehicle-type"
              value={vehicleType}
              onChange={setVehicleType}
              label="نوع ناوگان:"
            />

            {/* Cargo Weight */}
            <div>
              <label className="block text-[#2C2C2A] mb-1.5 font-bold flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-[#D85A30]" />
                  <span>وزن محموله (تن):</span>
                </span>
                <span className="text-[10px] text-[#888780] font-mono">حداکثر ۶۰ تن</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={cargoWeightTons}
                  onChange={(e) => setCargoWeightTons(Number(e.target.value))}
                  className="w-full bg-white border border-[#D3D1C7] rounded-2xl p-2.5 text-[#2C2C2A] text-xs focus:border-[#9FE1CB] focus:outline-none font-mono font-bold"
                />
                <span className="text-[#888780] text-xs font-medium px-1">تن</span>
              </div>
            </div>
          </div>

          {/* Contract Selection */}
          <ContractPickerDropdown
            id="sandbox-contract"
            value={contractId}
            contracts={contracts || []}
            onChange={setContractId}
            label="قرارداد صاحب کالا (اختیاری):"
          />

          {/* Service Addon Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsColdChain(!isColdChain)}
              className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                isColdChain
                  ? 'bg-[#E1F5EE] border-[#9FE1CB] text-[#04342C] font-bold'
                  : 'bg-[#FAFAF8] border-[#D3D1C7] text-[#5F5E5A] hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Snowflake className="w-3.5 h-3.5 text-[#0F6E56] shrink-0" />
                <span className="text-xs">زنجیره سرد (+۱۸٪)</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setIsHazardous(!isHazardous)}
              className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                isHazardous
                  ? 'bg-[#FAECE7] border-[#D85A30] text-[#D85A30] font-bold'
                  : 'bg-[#FAFAF8] border-[#D3D1C7] text-[#5F5E5A] hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#D85A30] shrink-0" />
                <span className="text-xs">کالای خطرناک ADR (+۲۵٪)</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setIsPeakSeason(!isPeakSeason)}
              className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                isPeakSeason
                  ? 'bg-[#E1F5EE] border-[#085041] text-[#04342C] font-bold'
                  : 'bg-[#FAFAF8] border-[#D3D1C7] text-[#5F5E5A] hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#085041] shrink-0" />
                <span className="text-xs">پیک بار فصلی (+۱۵٪)</span>
              </div>
            </button>
          </div>

          <div className="pt-1">
            <button
              type="button"
              onClick={handleCalculate}
              className="w-full py-2.5 bg-[#085041] hover:bg-[#04342C] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer text-xs"
            >
              <Zap className="w-4 h-4" />
              محاسبه نرخ و ثبت ردگیری تصمیم
            </button>
          </div>

          {/* Results Area */}
          {quoteResult && (
            <div className="mt-3 p-4 bg-[#FAFAF8] border border-[#9FE1CB] rounded-2xl space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-[#D3D1C7] pb-2.5">
                <div>
                  <span className="text-[#888780] block text-[11px]">کرایه خالص پیشنهادی:</span>
                  <span className="text-lg font-black font-mono text-[#085041]">
                    {(quoteResult.finalPriceToman / 1000000).toLocaleString('fa-IR')} میلیون تومان
                  </span>
                </div>
                <div className="text-left">
                  <span className="text-[#888780] block text-[11px]">حاشیه سود:</span>
                  <span className="text-sm font-bold font-mono text-[#2C2C2A]">
                    {quoteResult.marginPercent.toLocaleString('fa-IR')}٪
                  </span>
                </div>
              </div>

              <p className="text-[#5F5E5A] text-xs leading-relaxed bg-white p-2.5 rounded-xl border border-[#D3D1C7]">
                {quoteResult.trace.explanationFa}
              </p>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[#888780] text-[11px] font-mono">
                  شناسه ردگیری: {quoteResult.trace.traceId} ({quoteResult.trace.latencyMs}ms)
                </span>
                <button
                  type="button"
                  onClick={handleOpenTrace}
                  className="px-3 py-1.5 bg-[#085041] hover:bg-[#04342C] text-white rounded-lg flex items-center gap-1.5 font-bold text-xs transition-colors cursor-pointer"
                >
                  <FileSearch className="w-3.5 h-3.5" />
                  مشاهده ردگیری تصمیم
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
