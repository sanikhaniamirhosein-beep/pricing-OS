import React, { useState } from 'react';
import {
  Calculator,
  MapPin,
  Package,
  Truck,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Building,
  Sparkles,
  ArrowRight,
  Info,
  Layers,
  Clock,
  Send,
  Download,
  Check,
} from 'lucide-react';
import { usePricing } from '../../store/PricingContext';
import { INITIAL_SAVED_LOCATIONS, INITIAL_SAVED_COMMODITIES, ShipperActiveLoad } from '../../data/mockShipperData';

interface ShipperQuoteBookingViewProps {
  onOrderCreated?: (newLoad: ShipperActiveLoad) => void;
  onNavigateTab?: (tabId: string) => void;
}

export const ShipperQuoteBookingView: React.FC<ShipperQuoteBookingViewProps> = ({
  onOrderCreated,
  onNavigateTab,
}) => {
  const { calculatePrice, userName, userOrgName } = usePricing();

  // Route specs
  const [originCity, setOriginCity] = useState('اصفهان');
  const [destCity, setDestCity] = useState('تهران');
  const [originHub, setOriginHub] = useState('مجتمع فولاد مبارکه - انبار نورد');
  const [destHub, setDestHub] = useState('شهرک صنعتی شمس‌آباد - بلوار بهارستان');
  const [originPostalCode, setOriginPostalCode] = useState('8488111111');
  const [destPostalCode, setDestPostalCode] = useState('1834199999');

  // Cargo specs
  const [cargoType, setCargoType] = useState('عادی');
  const [cargoTitle, setCargoTitle] = useState('رول و کویل ورق فولادی گرم');
  const [weightTons, setWeightTons] = useState<number>(22.0);
  const [lengthM, setLengthM] = useState<number>(12.0);
  const [widthM, setWidthM] = useState<number>(2.4);
  const [heightM, setHeightM] = useState<number>(1.8);
  const [cargoValueToman, setCargoValueToman] = useState<number>(280000000); // 280 million toman

  // Selected Truck Type
  const [selectedTruck, setSelectedTruck] = useState('تریلی کفی ۱۸ چرخ');
  const [urgencyLevel, setUrgencyLevel] = useState<'standard' | 'express'>('standard');

  // Loading/Unloading service addon
  const [includeLoadingService, setIncludeLoadingService] = useState(true);
  const [includeFullInsurance, setIncludeFullInsurance] = useState(true);

  // Booking Confirmation State
  const [bookedOrder, setBookedOrder] = useState<ShipperActiveLoad | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Intelligent Fleet Recommendation based on weight & dimensions
  const getRecommendedTruck = () => {
    if (cargoType === 'یخچالی') return 'تریلی یخچالی دماسنج‌دار';
    if (cargoType === 'خطرناک' || cargoType === 'فله') return 'تریلی لبه‌دار / تانکر';
    if (weightTons > 15) return 'تریلی کفی ۱۸ چرخ';
    if (weightTons > 10) return 'کامیون جفت (۱۰ چرخ)';
    if (weightTons > 4) return 'کامیون تک (۶ چرخ)';
    return 'خاور مسقف / روباز ۵ تن';
  };

  const recommendedTruck = getRecommendedTruck();

  // Price Calculation through runtime pricing logic
  const engineResult = calculatePrice({
    originCity,
    destCity,
    vehicleType: selectedTruck,
    cargoCategory: cargoType,
    weightTons,
    declaredValueRials: cargoValueToman * 10,
    shipperTier: 'Gold',
    slaSpeed: urgencyLevel,
  });

  const basePriceRials = engineResult.totalPriceRials || (weightTons * 6500000 + 45000000);
  const insuranceRials = includeFullInsurance ? Math.round((cargoValueToman * 10) * 0.0015) : 15000000;
  const loadingFeeRials = includeLoadingService ? 18000000 : 0;
  const taxAndRoadTollRials = Math.round((basePriceRials + insuranceRials + loadingFeeRials) * 0.09);
  const tierDiscountRials = Math.round(basePriceRials * 0.085); // 8.5% Gold Tier
  const finalPayableRials = basePriceRials + insuranceRials + loadingFeeRials + taxAndRoadTollRials - tierDiscountRials;
  const finalPayableToman = Math.round(finalPayableRials / 10);

  // Quick Preset Helper for Saved Commodity
  const handleSelectSavedCommodity = (com: typeof INITIAL_SAVED_COMMODITIES[0]) => {
    setCargoTitle(com.title);
    setCargoType(com.category);
    setWeightTons(com.unitWeightKg / 1000);
    setLengthM(com.standardDimensions.lengthM);
    setWidthM(com.standardDimensions.widthM);
    setHeightM(com.standardDimensions.heightM);
    setSelectedTruck(com.defaultTruckType);
    setCargoValueToman(com.declaredValueRials / 10);
  };

  // Quick Preset Helper for Saved Location
  const handleSelectSavedOrigin = (loc: typeof INITIAL_SAVED_LOCATIONS[0]) => {
    setOriginCity(loc.city);
    setOriginHub(loc.title);
    setOriginPostalCode(loc.postalCode);
  };

  const handleSelectSavedDest = (loc: typeof INITIAL_SAVED_LOCATIONS[0]) => {
    setDestCity(loc.city);
    setDestHub(loc.title);
    setDestPostalCode(loc.postalCode);
  };

  // Handle Book Now Finalization
  const handleFinalizeBooking = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newTracking = `TRK-${Math.floor(100000 + Math.random() * 900000)}`;
      const newBL = `BL-1403-${Math.floor(1000 + Math.random() * 9000)}`;
      const newLoad: ShipperActiveLoad = {
        id: `SHP-${Math.floor(10000 + Math.random() * 90000)}`,
        trackingCode: newTracking,
        billOfLadingNo: newBL,
        originCity,
        originHub,
        destCity,
        destHub,
        cargoType: cargoTitle,
        weightTons,
        truckType: selectedTruck,
        driverName: 'در حال تخصیص راننده خودکار',
        driverPhone: '۰۹۱۲۰۰۰۰۰۰۰',
        truckPlate: 'پلاک در حال صدور',
        status: 'pending_driver',
        statusLabelFa: 'سفارش قطعی ثبت شد (در صف تخصیص)',
        departureTime: '۱۴۰۳/۰۶/۰۲ - ۰۹:۰۰',
        estimatedArrival: '۱۴۰۳/۰۶/۰۲ - ۱۸:۰۰',
        progressPercent: 0,
        currentLocation: `مبدأ: ${originCity}`,
        totalCostRials: finalPayableRials,
        insuranceValuationRials: cargoValueToman * 10,
        podSigned: false,
      };

      setBookedOrder(newLoad);
      setIsSubmitting(false);
      if (onOrderCreated) {
        onOrderCreated(newLoad);
      }
    }, 900);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-600" />
            استعلام هوشمند قیمت و ثبت سفارش حمل بارنامه
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            محاسبه شفاف کرایه بر اساس نرخ رسمی و مصوب، وزن، مسافت و ضرایب تخفیف شرکتی
          </p>
        </div>

        {/* Saved Commodity Quick Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            کالاهای پرتکرار سازمانی:
          </span>
          {INITIAL_SAVED_COMMODITIES.slice(0, 3).map((com) => (
            <button
              key={com.id}
              type="button"
              onClick={() => handleSelectSavedCommodity(com)}
              className="text-[11px] px-2.5 py-1 bg-amber-50/70 hover:bg-amber-100/90 text-amber-900 border border-amber-200/80 rounded-lg font-medium transition-all cursor-pointer"
            >
              {com.title}
            </button>
          ))}
        </div>
      </div>

      {/* Booking Success Modal / Alert */}
      {bookedOrder && (
        <div className="bg-emerald-50 border border-emerald-300 p-6 rounded-2xl shadow-sm space-y-4 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xl">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-emerald-950 text-base">
                  سفارش بارنامه با موفقیت نهایی و ثبت شد!
                </h3>
                <p className="text-xs text-emerald-800">
                  شماره رهگیری سیستمی: <strong className="font-mono text-emerald-950 font-bold">{bookedOrder.trackingCode}</strong> | کد بارنامه: <strong className="font-mono text-emerald-950 font-bold">{bookedOrder.billOfLadingNo}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setBookedOrder(null)}
                className="px-3 py-1.5 bg-white text-emerald-800 hover:bg-emerald-100 rounded-xl text-xs font-bold border border-emerald-300 cursor-pointer"
              >
                ثبت استعلام جدید دیگر
              </button>
              {onNavigateTab && (
                <button
                  type="button"
                  onClick={() => onNavigateTab('shipments')}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>مشاهده در کارتابل بارها</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/80 p-3.5 rounded-xl text-xs border border-emerald-200 text-emerald-950">
            <div>
              <span className="text-emerald-700 block text-[11px]">مبدأ و مقصد:</span>
              <strong className="font-bold">{bookedOrder.originCity} ➔ {bookedOrder.destCity}</strong>
            </div>
            <div>
              <span className="text-emerald-700 block text-[11px]">نوع ناوگان:</span>
              <strong className="font-bold font-mono">{bookedOrder.truckType}</strong>
            </div>
            <div>
              <span className="text-emerald-700 block text-[11px]">مبلغ نهایی فاکتور:</span>
              <strong className="font-bold font-mono">{(bookedOrder.totalCostRials / 10).toLocaleString('fa-IR')} تومان</strong>
            </div>
            <div>
              <span className="text-emerald-700 block text-[11px]">وضعیت تسویه:</span>
              <span className="inline-block px-2 py-0.5 rounded bg-emerald-200 text-emerald-950 font-bold text-[10px]">
                کسر از اعتبار حساب طلایی
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Quote Interface: Left Form + Right Transparent Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: 7 Columns */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. مشخصات مسیر */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-xs flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-600" />
                ۱. مشخصات مبدأ و مقصد بارگیری
              </h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => INITIAL_SAVED_LOCATIONS?.[0] && handleSelectSavedOrigin(INITIAL_SAVED_LOCATIONS[0])}
                  className="text-[10px] text-amber-800 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded-md font-bold cursor-pointer"
                >
                  انبار مبارکه (مبدأ پیش‌فرض)
                </button>
                <button
                  type="button"
                  onClick={() => INITIAL_SAVED_LOCATIONS?.[1] && handleSelectSavedDest(INITIAL_SAVED_LOCATIONS[1])}
                  className="text-[10px] text-teal-800 bg-teal-50 hover:bg-teal-100 px-2 py-1 rounded-md font-bold cursor-pointer"
                >
                  انبار شمس‌آباد (مقصد)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Origin */}
              <div className="space-y-2">
                <label className="block text-slate-700 font-bold text-xs">شهر و استان مبدأ:</label>
                <input
                  type="text"
                  value={originCity}
                  onChange={(e) => setOriginCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-medium focus:bg-white focus:border-amber-500 focus:outline-none"
                  placeholder="مثلاً: اصفهان"
                />
                <input
                  type="text"
                  value={originHub}
                  onChange={(e) => setOriginHub(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-[11px] text-slate-700"
                  placeholder="نام انبار یا کارخانه مبدأ"
                />
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <span>کد پستی مبدأ:</span>
                  <input
                    type="text"
                    value={originPostalCode}
                    onChange={(e) => setOriginPostalCode(e.target.value)}
                    className="font-mono bg-transparent border-b border-slate-200 w-24 text-slate-700"
                  />
                </div>
              </div>

              {/* Destination */}
              <div className="space-y-2">
                <label className="block text-slate-700 font-bold text-xs">شهر و استان مقصد:</label>
                <input
                  type="text"
                  value={destCity}
                  onChange={(e) => setDestCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-medium focus:bg-white focus:border-amber-500 focus:outline-none"
                  placeholder="مثلاً: تهران"
                />
                <input
                  type="text"
                  value={destHub}
                  onChange={(e) => setDestHub(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-[11px] text-slate-700"
                  placeholder="نام انبار یا کارخانه تحویل‌گیرنده"
                />
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <span>کد پستی مقصد:</span>
                  <input
                    type="text"
                    value={destPostalCode}
                    onChange={(e) => setDestPostalCode(e.target.value)}
                    className="font-mono bg-transparent border-b border-slate-200 w-24 text-slate-700"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. مشخصات فیزیکی و ارزش کالا */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 text-xs flex items-center gap-2 pb-2 border-b border-slate-100">
              <Package className="w-4 h-4 text-amber-600" />
              ۲. مشخصات محموله و ارزش بیمه
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">شرح کالای ارسالی:</label>
                <input
                  type="text"
                  value={cargoTitle}
                  onChange={(e) => setCargoTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">دسته‌بندی و ماهیت کالا:</label>
                <select
                  value={cargoType}
                  onChange={(e) => setCargoType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-medium"
                >
                  <option value="عادی">عادی و صنعتی استاندارد</option>
                  <option value="صنعتی">تجهیزات و متریال سنگین صنعتی</option>
                  <option value="خطرناک">مواد خطرناک و شیمیایی (ADR)</option>
                  <option value="یخچالی">فاسدشدنی و مواد غذایی (یخچالی)</option>
                  <option value="فله">کالای فله و معدنی</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-500 text-[11px] mb-1 font-medium">وزن کل (تن):</label>
                <input
                  type="number"
                  step="0.1"
                  value={weightTons}
                  onChange={(e) => setWeightTons(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-500 text-[11px] mb-1 font-medium">طول (متر):</label>
                <input
                  type="number"
                  step="0.1"
                  value={lengthM}
                  onChange={(e) => setLengthM(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-500 text-[11px] mb-1 font-medium">عرض (متر):</label>
                <input
                  type="number"
                  step="0.1"
                  value={widthM}
                  onChange={(e) => setWidthM(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-500 text-[11px] mb-1 font-medium">ارتفاع (متر):</label>
                <input
                  type="number"
                  step="0.1"
                  value={heightM}
                  onChange={(e) => setHeightM(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono text-slate-800"
                />
              </div>
            </div>

            {/* Declared Value for Insurance */}
            <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-200/60 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-amber-950 block">ارزش ریالی اظهارشده کالا (محاسبه بیمه باربری):</span>
                <span className="text-[11px] text-slate-500">پوشش کامل خسارت ناشی از حوادث جاده‌ای و سرقت</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={cargoValueToman}
                  onChange={(e) => setCargoValueToman(parseInt(e.target.value, 10) || 0)}
                  className="w-36 bg-white border border-amber-300 rounded-xl p-2 text-xs font-mono font-bold text-amber-950 text-left"
                />
                <span className="text-xs font-bold text-slate-600">تومان</span>
              </div>
            </div>
          </div>

          {/* 3. انتخاب هوشمند ناوگان و خدمات تکمیلی */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-xs flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-600" />
                ۳. انتخاب نوع ناوگان و خدمات اضافه
              </h3>
              <span className="text-[10px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-teal-600" />
                پیشنهاد هوشمند سیستم: {recommendedTruck}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { name: 'تریلی کفی ۱۸ چرخ', maxTon: 24, desc: 'مناسب شمش، رول، پالت سنگین' },
                { name: 'تریلی چادری ترانزیت', maxTon: 22, desc: 'حفاظت کامل در برابر باران و گردوغبار' },
                { name: 'کامیون جفت (۱۰ چرخ)', maxTon: 15, desc: 'مناسب سرامیک، کاشی، لوله' },
                { name: 'کامیون تک (۶ چرخ)', maxTon: 10, desc: 'توزیع نیمه‌سنگین بین‌استانی' },
                { name: 'خاور روباز ۵ تن', maxTon: 5, desc: 'بارگیری سریع و تناژ سبک' },
                { name: 'تریلی یخچالی دماسنج‌دار', maxTon: 20, desc: 'حمل در دمای منفی ۱۸ تا مثبت ۴' },
              ].map((truck) => {
                const isSelected = selectedTruck === truck.name;
                const isRec = recommendedTruck === truck.name;
                return (
                  <button
                    key={truck.name}
                    type="button"
                    onClick={() => setSelectedTruck(truck.name)}
                    className={`p-3 rounded-xl border text-right transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-amber-50 border-amber-400 text-amber-950 ring-1 ring-amber-400/30'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {isRec && (
                      <span className="absolute -top-2 left-2 px-1.5 py-0.2 rounded bg-teal-600 text-white font-bold text-[9px]">
                        پیشنهاد
                      </span>
                    )}
                    <div className="font-bold text-xs">{truck.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-mono">ظرفیت مجاز: {truck.maxTon} تن</div>
                    <div className="text-[9px] text-slate-500 mt-1 line-clamp-1">{truck.desc}</div>
                  </button>
                );
              })}
            </div>

            {/* Addons Switches */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={includeLoadingService}
                  onChange={(e) => setIncludeLoadingService(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-800 block">خدمات لیفتراک و کارگر تخلیه/بارگیری</span>
                  <span className="text-[10px] text-slate-500">۱,۸۰۰,۰۰۰ تومان به ازای هر سرویس</span>
                </div>
              </label>

              <label className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={includeFullInsurance}
                  onChange={(e) => setIncludeFullInsurance(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-800 block">بیمه تکمیلی All-Risk با فرانشیز صفر</span>
                  <span className="text-[10px] text-slate-500">پوشش کامل بدون اعمال استهلاک</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Transparent Quote Breakdown: 5 Columns */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm sticky top-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-sm">پیش‌فاکتور شفاف و رسمی</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md">
                معتبر تا ۴۸ ساعت
              </span>
            </div>

            {/* Route Summary */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-700">
                <span className="text-slate-400">مسیر تردد:</span>
                <span className="font-bold">{originCity} ➔ {destCity}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span className="text-slate-400">ناوگان و محموله:</span>
                <span className="font-medium font-mono">{selectedTruck} ({weightTons} تن)</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span className="text-slate-400">شرکت صاحب بار:</span>
                <span className="font-bold text-amber-900">{userOrgName || 'فولاد مبارکه اصفهان'}</span>
              </div>
            </div>

            {/* Itemized Cost Breakdown */}
            <div className="space-y-2.5 text-xs text-slate-700 divide-y divide-slate-100">
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-500">کرایه پایه مصوب تن‌کیلومتر:</span>
                <span className="font-mono font-bold text-slate-800">
                  {(basePriceRials / 10).toLocaleString('fa-IR')} تومان
                </span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-500">حق بیمه باربری رسمی (بیمه دانا/ایران):</span>
                <span className="font-mono font-bold text-slate-800">
                  {(insuranceRials / 10).toLocaleString('fa-IR')} تومان
                </span>
              </div>

              {includeLoadingService && (
                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-500">هزینه خدمات انبارداری و لیفتراک:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {(loadingFeeRials / 10).toLocaleString('fa-IR')} تومان
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-500">عوارض جاده‌ای و مالیات بر ارزش افزوده (۹٪):</span>
                <span className="font-mono font-bold text-slate-800">
                  {(taxAndRoadTollRials / 10).toLocaleString('fa-IR')} تومان
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 text-emerald-700 font-bold">
                <span>تخفیف مشتری طلایی (۸.۵٪ Volume Tier):</span>
                <span className="font-mono">
                  -{(tierDiscountRials / 10).toLocaleString('fa-IR')} تومان
                </span>
              </div>
            </div>

            {/* Total Payable Box */}
            <div className="p-4 bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-300 rounded-2xl space-y-1">
              <div className="text-[11px] text-amber-900 font-semibold">مبلغ کل قابل پرداخت بارنامه:</div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-amber-950">
                  {finalPayableToman.toLocaleString('fa-IR')}
                </span>
                <span className="text-xs font-bold text-amber-900">تومان</span>
              </div>
              <div className="text-[10px] text-slate-500">
                قابل تسویه از کیف پول اعتباری یا درگاه بانکی شاپرک
              </div>
            </div>

            {/* Action Buttons: Book Now */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleFinalizeBooking}
                disabled={isSubmitting}
                className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md shadow-teal-600/20 transition-all cursor-pointer text-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>در حال صدور بارنامه الکترونیک...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>نهایی‌سازی و ثبت قطعی بارنامه (Book Now)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => alert('پیش‌فاکتور رسمی به صورت PDF صادر شد و برای ایمیل سازمانی شما ارسال گردید.')}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>دریافت پیش‌فاکتور رسمی PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
