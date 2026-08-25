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
  Eye,
  FileCheck,
  Building2,
  Star,
  Scale,
  BadgeCheck,
  AlertTriangle,
  Lock,
  Users,
  Warehouse,
  AlertCircle,
} from 'lucide-react';
import { usePricing } from '../../store/PricingContext';
import { INITIAL_SAVED_LOCATIONS, INITIAL_SAVED_COMMODITIES, ShipperActiveLoad } from '../../data/mockShipperData';
import { getShipperRoleDetail } from '../../data/shipperRolesConfig';
import { checkShipperProfileCompleteness } from '../../types/shipperLegal';
import { CityPickerDropdown } from '../common/menus/CityPickerDropdown';
import { CommodityPickerDropdown } from '../common/menus/CommodityPickerDropdown';
import { ShipmentDocumentModal } from './ShipmentDocumentModal';
import { generateFullShipmentDocumentPackage } from '../../utils/shipmentDocumentGenerator';
import { FullShipmentDocumentPackage } from '../../types/shipmentDocuments';
import {
  CarrierSelectionMarketplace,
  CarrierQuoteOption,
} from './CarrierSelectionMarketplace';

interface ShipperQuoteBookingViewProps {
  onOrderCreated?: (newLoad: ShipperActiveLoad) => void;
  onNavigateTab?: (tabId: string) => void;
}

export const ShipperQuoteBookingView: React.FC<ShipperQuoteBookingViewProps> = ({
  onOrderCreated,
  onNavigateTab,
}) => {
  const {
    calculatePrice,
    calculatePriceForCarrier,
    carrierOrganizations,
    userName,
    userOrgName,
    shipperUserRole,
    shipperLocationScope,
    shipperApprovalLimitToman,
    currentShipperOrg,
    openShipperOrgModal,
  } = usePricing();

  const currentRoleDetail = getShipperRoleDetail(shipperUserRole);
  const isSeniorAdmin = shipperUserRole === 'Supply Chain Manager / Admin';
  const completeness = checkShipperProfileCompleteness(currentShipperOrg?.legalDossier || {
    companyLegalName: currentShipperOrg?.nameFa || userOrgName,
    nationalId: currentShipperOrg?.nationalId,
    economicCode: currentShipperOrg?.economicCode,
    registrationNumber: '14820',
    representativeName: currentShipperOrg?.contactPerson || userName,
    representativeMobile: '۰۹۱۲۳۴۵۶۷۸۹',
    representativeEmail: currentShipperOrg?.email,
    headquartersAddress: currentShipperOrg?.address,
    postalCode: '8488111111',
    phoneLandline: currentShipperOrg?.phone,
    bankShaba: 'IR820120000000001234567890',
  });

  // Route specs
  const [originCity, setOriginCity] = useState('اصفهان');
  const [destCity, setDestCity] = useState('تهران');
  const [originHub, setOriginHub] = useState('مجتمع فولاد مبارکه - انبار نورد');
  const [destHub, setDestHub] = useState('شهرک صنعتی شمس‌آباد - بلوار بهارستان');
  const [originPostalCode, setOriginPostalCode] = useState('8488111111');
  const [destPostalCode, setDestPostalCode] = useState('1834199999');

  // Cargo specs
  const [cargoType, setCargoType] = useState('صنعتی');
  const [cargoTitle, setCargoTitle] = useState('رول و کویل ورق فولادی گرم');
  const [weightTons, setWeightTons] = useState<number>(22.0);
  const [lengthM, setLengthM] = useState<number>(12.0);
  const [widthM, setWidthM] = useState<number>(2.4);
  const [heightM, setHeightM] = useState<number>(1.8);
  const [cargoValueToman, setCargoValueToman] = useState<number>(280000000); // 280 million toman

  // Selected Truck Type
  const [selectedTruck, setSelectedTruck] = useState('تریلر کفی ۱۳.۶ متری (۱۸ چرخ)');
  const [urgencyLevel, setUrgencyLevel] = useState<'standard' | 'express'>('standard');
  const [fleetFilterCategory, setFleetFilterCategory] = useState<'all' | 'heavy' | 'medium' | 'specialized'>('all');

  // Carrier Selection & Allocation Model State
  const [carrierSelectionMode, setCarrierSelectionMode] = useState<'marketplace' | 'managed'>('marketplace');
  const [selectedCarrier, setSelectedCarrier] = useState<CarrierQuoteOption | null>(null);

  // Fallback initial carrier from registered carrierOrganizations
  const firstCarrier = carrierOrganizations[0];
  const defaultCarrierOption: CarrierQuoteOption = {
    id: firstCarrier?.id || 'org-carrier-pg-freight',
    code: firstCarrier?.code || 'CAR-PGF-01',
    name: firstCarrier?.nameFa || 'شرکت حمل و نقل سراسری خلیج فارس',
    shortName: firstCarrier?.shortName || 'خلیج فارس',
    logoText: firstCarrier?.logoText || 'خلیج',
    logoBg: firstCarrier?.logoBg || 'bg-indigo-600',
    logoColor: firstCarrier?.logoColor || 'text-white',
    city: firstCarrier?.city || 'تهران',
    licenseNo: firstCarrier?.licenseNumber || 'LIC-RMTO-1405-9921',
    nationalId: firstCarrier?.nationalId || '10101345678',
    economicCode: firstCarrier?.economicCode || '411145678912',
    registrationNumber: firstCarrier?.registrationNo || '88921',
    phone: firstCarrier?.phone || '۰۲۱-۶۶۵۵۴۴۳۳',
    address: firstCarrier?.address || 'تهران، پایانه مرکزی',
    managerName: firstCarrier?.managerName || 'مدیر لجستیک',
    email: firstCarrier?.email || 'info@carrier.ir',
    rating: firstCarrier?.rating || 4.92,
    ratingCount: firstCarrier?.ratingCount || 1840,
    completedTrips: firstCarrier?.completedTrips || 28400,
    fleetCount: firstCarrier?.fleetCount || 1450,
    availableDriversNearby: 18,
    dispatchTimeMinutes: 25,
    estimatedTransitHours: 12,
    isSmartRecommended: true,
    isCheapest: false,
    isFastest: false,
    isTopRated: false,
    isDedicatedCorridor: false,
    priceMultiplier: firstCarrier?.priceMultiplier || 1.0,
    discountPercent: firstCarrier?.discountPercent || 8.5,
    strengths: firstCarrier?.strengths || ['پوشش بیمه ۱۰۰ میلیاردی', 'ردیابی برخط ناوگان'],
    insuranceCeilingToman: firstCarrier?.insuranceCeilingToman || 100000000000,
    badgeTitle: 'پیشنهاد هوشمند سیستم',
    badgeType: 'smart',
    carrierCommissionPercent: firstCarrier?.carrierCommissionPercent || 7.5,
    carrierCommissionToman: 0,
    fuelIndexMultiplier: 1.0,
    calculatedBaseRials: 0,
    calculatedBaseToman: 0,
    calculatedTaxRials: 0,
    calculatedDiscountRials: 0,
    calculatedTotalPayableRials: 0,
    calculatedTotalPayableToman: 0,
    rawCarrierProfile: firstCarrier,
  };

  // Loading/Unloading service addon
  const [includeLoadingService, setIncludeLoadingService] = useState(true);
  const [includeFullInsurance, setIncludeFullInsurance] = useState(true);

  // Booking Confirmation State
  const [bookedOrder, setBookedOrder] = useState<ShipperActiveLoad | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Proforma / Shipment Document Modal State
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docModalPackage, setDocModalPackage] = useState<FullShipmentDocumentPackage | null>(null);

  // Effective Carrier based on active mode
  const effectiveCarrier: CarrierQuoteOption = selectedCarrier || defaultCarrierOption;

  const handleOpenProformaInvoice = (targetLoad?: ShipperActiveLoad | null) => {
    const loadToUse: ShipperActiveLoad = targetLoad || {
      id: `QUO-${Math.floor(10000 + Math.random() * 90000)}`,
      trackingCode: `TRK-QUO-${Math.floor(100000 + Math.random() * 900000)}`,
      billOfLadingNo: `PRF-1403-${Math.floor(1000 + Math.random() * 9000)}`,
      originCity,
      originHub: originHub || 'انبار مرکزی مبدأ',
      destCity,
      destHub: destHub || 'انبار مقصد تحویل',
      cargoType: cargoTitle || cargoType,
      weightTons,
      truckType: selectedTruck,
      driverName: 'در انتظار تخصیص راننده پس از تایید پیش‌فاکتور',
      driverPhone: '۰۲۱-۸۸۹۹۰۰۱۱',
      truckPlate: 'ناوگان سراسری معتبر',
      status: 'pending_driver',
      statusLabelFa: 'پیش‌فاکتور آماده تایید',
      departureTime: '۱۴۰۳/۰۶/۰۲ - توافقی',
      estimatedArrival: '۱۴۰۳/۰۶/۰۲ - توافقی',
      progressPercent: 0,
      currentLocation: `مبدأ: ${originCity}`,
      totalCostRials: finalPayableRials,
      insuranceValuationRials: cargoValueToman * 10,
      podSigned: false,
      carrierId: effectiveCarrier.id,
      carrierName: effectiveCarrier.name,
      carrierLogo: effectiveCarrier.logoText,
      carrierRating: effectiveCarrier.rating,
      carrierPhone: effectiveCarrier.phone,
      carrierAddress: effectiveCarrier.address,
      carrierLicenseNo: effectiveCarrier.licenseNo,
      carrierNationalId: effectiveCarrier.nationalId,
      carrierEconomicCode: effectiveCarrier.economicCode,
      carrierRegistrationNo: effectiveCarrier.registrationNumber,
      carrierSelectionMode: carrierSelectionMode,
    };

    const pkg = generateFullShipmentDocumentPackage(loadToUse, currentShipperOrg);
    setDocModalPackage(pkg);
    setIsDocModalOpen(true);
  };

  // Comprehensive Fleet Database
  const AVAILABLE_FLEET_LIST = [
    {
      id: 'flatbed',
      name: 'تریلر کفی ۱۳.۶ متری (۱۸ چرخ)',
      category: 'heavy',
      maxTon: 25,
      axles: 5,
      desc: 'مناسب رول و کویل، شمش فولاد، میلگرد، پالت سنگین و کانتینر',
      loadingMethod: 'جرثقیل سقفی / مگنت از بالا یا لیفتراک',
      badge: 'صنعتی / سنگین',
      color: 'blue',
    },
    {
      id: 'tent',
      name: 'تریلی چادری ترانزیت (سقف کشویی)',
      category: 'heavy',
      maxTon: 24,
      axles: 5,
      desc: 'حفاظت ۱۰۰٪ در برابر بارش و گردوغبار، مناسب پتروشیمی، کارتن و صادرات',
      loadingMethod: 'لیفتراک از بغل و عقب با سقف کشویی',
      badge: 'ترانزیت / چادری',
      color: 'amber',
    },
    {
      id: 'reefer',
      name: 'تریلی یخچالی دماسنج‌دار (-۱۸°C تا +۴°C)',
      category: 'specialized',
      maxTon: 20,
      axles: 5,
      desc: 'کنترل فعال دما و ترموگراف آنلاین ویژه لبنیات، پروتئینی، دارو و بستنی',
      loadingMethod: 'داک بارگیری سردخانه و لیفتراک پالت‌بر',
      badge: 'زنجیره سرد',
      color: 'teal',
    },
    {
      id: 'tipper',
      name: 'تریلی کمپرسی / لبه‌دار ۲۴ تن',
      category: 'specialized',
      maxTon: 24,
      axles: 5,
      desc: 'تخلیه هیدرولیکی سریع ویژه سنگ معدن، کلینکر، سیمان فله، خاک و غلات',
      loadingMethod: 'لودر / هاپر و شوتینگ از بالا',
      badge: 'فله و معدنی',
      color: 'amber',
    },
    {
      id: 'tanker',
      name: 'تانکر مخصوص مایعات و شیمیایی ADR',
      category: 'specialized',
      maxTon: 24,
      axles: 5,
      desc: 'مخزن دوجداره ایزوله ویژه سوخت، قیر مذاب، حلال و مواد اولیه مایع پتروشیمی',
      loadingMethod: 'بازوهای بارگیری پالایشگاهی با پمپ ضدانفجار',
      badge: 'مایعات و سوخت',
      color: 'rose',
    },
    {
      id: 'bogie',
      name: 'کمرشکن بوژی فوق سنگین (ترافیکی)',
      category: 'specialized',
      maxTon: 60,
      axles: 11,
      desc: 'محموله‌های ترافیکی، توربین، ترانسفورماتور و ماشین‌آلات سنگین راه‌سازی',
      loadingMethod: 'جرثقیل بوم‌بلند موبایل و رمپ هیدرولیک',
      badge: 'ترافیکی / فوق‌سنگین',
      color: 'purple',
    },
    {
      id: 'pair_15t',
      name: 'کامیون جفت ۱۰ چرخ (۱۵ تن)',
      category: 'medium',
      maxTon: 15,
      axles: 3,
      desc: 'مناسب کاشی و سرامیک، سنگ اسلب، لوله و بارهای نیمه‌سنگین بین‌استانی',
      loadingMethod: 'لیفتراک از طرفین و جرثقیل کارگاهی',
      badge: '۱۰ چرخ (۶×۴)',
      color: 'slate',
    },
    {
      id: 'single_10t',
      name: 'کامیون تک ۶ چرخ (۱۰ تن)',
      category: 'medium',
      maxTon: 10,
      axles: 2,
      desc: 'توزیع سریع بین‌شهری، قطعات صنعتی و محموله‌های تا سقف ۱۰ تن',
      loadingMethod: 'لیفتراک و رمپ بارانداز شهری',
      badge: '۶ چرخ (۴×۲)',
      color: 'slate',
    },
    {
      id: 'khavar_5t',
      name: 'خاور مسقف / روباز ۵ تن (ایسوزو)',
      category: 'medium',
      maxTon: 5,
      axles: 2,
      desc: 'ایده‌آل برای محموله‌های سبک، خرده‌بار تجاری و مبادی فاقد رمپ تریلی',
      loadingMethod: 'کارگری دستی و جک‌پالت هیدرولیک',
      badge: 'کامیونت سبک',
      color: 'slate',
    },
  ];

  // Highly Accurate & Domain-Grounded Fleet Recommendation Engine
  const analyzeFleetRecommendation = () => {
    const text = `${cargoTitle} ${cargoType}`.toLowerCase();
    const isTrafficOversize = lengthM > 13.6 || widthM > 2.55 || heightM > 3.0 || weightTons > 25.0;

    // 1. Heavy / Oversized Traffic Check
    if (
      isTrafficOversize ||
      text.includes('ترافیک') ||
      text.includes('کمرشکن') ||
      text.includes('بوژی') ||
      text.includes('توربین') ||
      text.includes('ترانس') ||
      text.includes('بیل مکانیکی') ||
      text.includes('بولدوزر') ||
      text.includes('لودر سنگین') ||
      text.includes('سازه سنگین') ||
      text.includes('مخزن بزرگ') ||
      weightTons > 25.0
    ) {
      return {
        truck: AVAILABLE_FLEET_LIST.find((f) => f.id === 'bogie')!,
        reason: `ابعاد فیزیکی (طول ${lengthM}m یا عرض ${widthM}m) یا تناژ بار (${weightTons} تن) از سقف استاندارد تریلی‌های تجاری فراتر بوده و محموله بر اساس ضوابط راهداری نیازمند کمرشکن بوژی فوق سنگین و اسکورت ترافیکی است.`,
        isOversized: true,
        isOverweight: false,
      };
    }

    // 2. Cold Chain / Perishable Check
    if (
      cargoType === 'یخچالی' ||
      text.includes('یخچال') ||
      text.includes('سردخانه') ||
      text.includes('گوشت') ||
      text.includes('مرغ') ||
      text.includes('پروتئین') ||
      text.includes('لبنی') ||
      text.includes('شیر') ||
      text.includes('پنیر') ||
      text.includes('بستنی') ||
      text.includes('کره') ||
      text.includes('واکسن') ||
      text.includes('دارو') ||
      text.includes('میوه') ||
      text.includes('ماهی') ||
      text.includes('سوسیس') ||
      text.includes('منجمد')
    ) {
      if (weightTons <= 5) {
        return {
          truck: AVAILABLE_FLEET_LIST.find((f) => f.id === 'khavar_5t')!,
          reason: `محموله نیازمند اتاق عایق/یخچالی سبک برای حجم ${weightTons} تن است تا در حین توزیع سریع بین‌شهری زنجیره سرما بدون اضافه ظرفیت تضمین گردد.`,
          isOversized: false,
          isOverweight: false,
        };
      }
      return {
        truck: AVAILABLE_FLEET_LIST.find((f) => f.id === 'reefer')!,
        reason: `محموله دارای ماهیت فسادپذیر و حساس به دما بوده و مطابق استانداردهای زنجیره سرد راهداری نیازمند کشنده مجهز به یونیت خنک‌کننده فعال (-۱۸°C الی +۴°C) و ثبت آنلاین دماسنجی است.`,
        isOversized: false,
        isOverweight: weightTons > 20,
      };
    }

    // 3. Liquid / Chemical Fuel & Bitumen Tanker Check
    if (
      text.includes('تانکر') ||
      text.includes('مایع') ||
      text.includes('سوخت') ||
      text.includes('گازوئیل') ||
      text.includes('بنزین') ||
      text.includes('نفت') ||
      text.includes('قیر') ||
      text.includes('اسید') ||
      text.includes('حلال') ||
      text.includes('اتانول') ||
      text.includes('متانول') ||
      text.includes('روغن هیدرولیک') ||
      text.includes('روغن پایه')
    ) {
      return {
        truck: AVAILABLE_FLEET_LIST.find((f) => f.id === 'tanker')!,
        reason: `محموله از نوع مایعات صنعتی/شیمیایی/سوختی بوده و جهت پیشگیری از خطرات اشتعال و نشت محیط‌زیستی، منحصراً باید توسط تانکر دوجداره استاندارد ADR با شیرآلات ضدجرقه حمل گردد.`,
        isOversized: false,
        isOverweight: weightTons > 24,
      };
    }

    // 4. Bulk / Mineral / Grain Tipper Check
    if (
      cargoType === 'فله' ||
      text.includes('فله') ||
      text.includes('کمپرسی') ||
      text.includes('سنگ معدن') ||
      text.includes('کلینکر') ||
      text.includes('سیمان فله') ||
      text.includes('شن') ||
      text.includes('ماسه') ||
      text.includes('خاک نسوز') ||
      text.includes('گندم') ||
      text.includes('جو فله') ||
      text.includes('ذرت فله') ||
      text.includes('آهک') ||
      text.includes('سنگ لاشه')
    ) {
      if (weightTons <= 15 && weightTons > 10) {
        return {
          truck: AVAILABLE_FLEET_LIST.find((f) => f.id === 'pair_15t')!,
          reason: `محموله فله/معدنی با تناژ ${weightTons} تن در محدوده ظرفیت کامیون جفت کمپرسی ۱۵ تن است که امکان ورود به معابر سخت کارگاهی و تخلیه سریع را فراهم می‌سازد.`,
          isOversized: false,
          isOverweight: false,
        };
      }
      return {
        truck: AVAILABLE_FLEET_LIST.find((f) => f.id === 'tipper')!,
        reason: `ماهیت محموله دانه‌ای و فله‌ای بوده و بارگیری از هاپر و تخلیه نیازمند اتاق کمپرسی با جک هیدرولیکی یا لبه‌دار مقاوم در برابر سایش بار است.`,
        isOversized: false,
        isOverweight: weightTons > 24,
      };
    }

    // 5. Heavy Steel, Metal, Slabs & Coils (Flatbed Trailer)
    if (
      text.includes('فولاد') ||
      text.includes('میلگرد') ||
      text.includes('شمش') ||
      text.includes('کویل') ||
      text.includes('ورق') ||
      text.includes('تیرآهن') ||
      text.includes('پروفیل سنگین') ||
      text.includes('نبشی') ||
      text.includes('اسلب') ||
      text.includes('بلوم') ||
      text.includes('سنگ اسلب') ||
      text.includes('کانتینر') ||
      text.includes('لوله فلزی') ||
      (cargoType === 'صنعتی' && weightTons > 15)
    ) {
      if (weightTons > 15) {
        return {
          truck: AVAILABLE_FLEET_LIST.find((f) => f.id === 'flatbed')!,
          reason: `شکل هندسی و وزن سنگین محموله (${weightTons} تن) ایجاب می‌کند که بارگیری از بالا توسط جرثقیل سقفی/مگنت بر روی کفی تخت ۱۳.۶۰ متری دارای مهارهای رول‌گیر انجام پذیرد.`,
          isOversized: false,
          isOverweight: weightTons > 25,
        };
      }
      if (weightTons > 10) {
        return {
          truck: AVAILABLE_FLEET_LIST.find((f) => f.id === 'pair_15t')!,
          reason: `تناژ محموله آهن‌آلات (${weightTons} تن) در ظرفیت کامیون ۱۰ چرخ کفی/روباز است که امکان مهاربندی ایمن و تخلیه سریع در انبار را مهیا می‌سازد.`,
          isOversized: false,
          isOverweight: false,
        };
      }
      if (weightTons > 5) {
        return {
          truck: AVAILABLE_FLEET_LIST.find((f) => f.id === 'single_10t')!,
          reason: `محموله صنعتی با تناژ ${weightTons} تن مناسب حمل با کامیون تک روباز ۶ چرخ جهت صرفه‌جویی در هزینه کرایه است.`,
          isOversized: false,
          isOverweight: false,
        };
      }
      return {
        truck: AVAILABLE_FLEET_LIST.find((f) => f.id === 'khavar_5t')!,
        reason: `تناژ سبک محموله فلزی (${weightTons} تن) با خاور روباز ۵ تن به‌صرفه‌ترین و منعطف‌ترین انتخاب برای مبدأ و مقصد است.`,
        isOversized: false,
        isOverweight: false,
      };
    }

    // 6. Enclosed Cartons, Petrochemical Polymers, Jumbo Bags, Consumer Goods (Tent/Curtain Trailer)
    if (
      text.includes('کارتن') ||
      text.includes('پتروشیمی') ||
      text.includes('گرانول') ||
      text.includes('پلیمر') ||
      text.includes('جامبوبگ') ||
      text.includes('پالت شرینک') ||
      text.includes('لوازم خانگی') ||
      text.includes('پوشاک') ||
      text.includes('فرش') ||
      text.includes('مواد شوینده') ||
      text.includes('کاغذ') ||
      text.includes('سلولزی') ||
      text.includes('صادرات') ||
      text.includes('ترانزیت') ||
      text.includes('الکترونیک') ||
      text.includes('قطعات')
    ) {
      if (weightTons > 15) {
        return {
          truck: AVAILABLE_FLEET_LIST.find((f) => f.id === 'tent')!,
          reason: `بسته‌بندی کارتن و جامبوبگ در برابر رطوبت، باد و تابش آفتاب آسیب‌پذیر بوده و تریلی چادری ترانزیت با سقف کشویی و پلمپ استاندارد بالاترین سطح سلامت بار را تضمین می‌کند.`,
          isOversized: false,
          isOverweight: weightTons > 24,
        };
      }
      if (weightTons > 10) {
        return {
          truck: AVAILABLE_FLEET_LIST.find((f) => f.id === 'pair_15t')!,
          reason: `تناژ کالای تجاری/کارتنی (${weightTons} تن) در بازه بهینه کامیون جفت مسقف چادری قرار دارد.`,
          isOversized: false,
          isOverweight: false,
        };
      }
      if (weightTons > 5) {
        return {
          truck: AVAILABLE_FLEET_LIST.find((f) => f.id === 'single_10t')!,
          reason: `کالای بسته‌بندی با وزن ${weightTons} تن متناسب با ناوگان تک ۶ چرخ مسقف چادری است.`,
          isOversized: false,
          isOverweight: false,
        };
      }
      return {
        truck: AVAILABLE_FLEET_LIST.find((f) => f.id === 'khavar_5t')!,
        reason: `محموله تجاری سبک (${weightTons} تن) با خاور مسقف چادری به صورت دربستی و محافظت‌شده ارسال می‌گردد.`,
        isOversized: false,
        isOverweight: false,
      };
    }

    // 7. General Weight-Based Fallback
    if (weightTons > 15) {
      return {
        truck: AVAILABLE_FLEET_LIST.find((f) => f.id === 'tent')!,
        reason: `بر اساس وزن کل ${weightTons} تن، تریلی ترانزیت ۲۴ تن استانداردترین گزینه حمل سراسری برای این محموله است.`,
        isOversized: false,
        isOverweight: weightTons > 24,
      };
    }
    if (weightTons > 10) {
      return {
        truck: AVAILABLE_FLEET_LIST.find((f) => f.id === 'pair_15t')!,
        reason: `بر اساس وزن کل ${weightTons} تن، کامیون جفت ۱۰ چرخ با حداکثر ظرفیت ۱۵ تن مناسب‌ترین گزینه عملیاتی است.`,
        isOversized: false,
        isOverweight: false,
      };
    }
    if (weightTons > 5) {
      return {
        truck: AVAILABLE_FLEET_LIST.find((f) => f.id === 'single_10t')!,
        reason: `بر اساس وزن کل ${weightTons} تن، کامیون تک ۶ چرخ با حداکثر ظرفیت ۱۰ تن مناسب‌ترین گزینه با نرخ اقتصادی است.`,
        isOversized: false,
        isOverweight: false,
      };
    }

    return {
      truck: AVAILABLE_FLEET_LIST.find((f) => f.id === 'khavar_5t')!,
      reason: `بر اساس وزن کل ${weightTons} تن، خاور مسقف/روباز ۵ تن اقتصادی‌ترین و سریع‌ترین ناوگان بارگیری است.`,
      isOversized: false,
      isOverweight: false,
    };
  };

  const fleetRecommendation = analyzeFleetRecommendation();
  const recommendedTruckName = fleetRecommendation.truck.name;

  // Selected Truck Object for Capacity Warning Check
  const currentSelectedTruckObj =
    AVAILABLE_FLEET_LIST.find((f) => f.name === selectedTruck || selectedTruck.includes(f.name) || f.name.includes(selectedTruck)) ||
    AVAILABLE_FLEET_LIST[0];

  const isSelectedTruckOverweight = weightTons > currentSelectedTruckObj.maxTon;

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

  const rawBaseFreightRials = (engineResult?.finalPriceToman ? engineResult.finalPriceToman * 10 : 0) || (weightTons * 6500000 + 45000000);
  const basePriceRials = Math.round(rawBaseFreightRials * (effectiveCarrier?.priceMultiplier || 1.0));
  const insuranceRials = includeFullInsurance ? Math.round((cargoValueToman * 10) * 0.0015) : 15000000;
  const loadingFeeRials = includeLoadingService ? 18000000 : 0;
  const taxAndRoadTollRials = Math.round((basePriceRials + insuranceRials + loadingFeeRials) * 0.09);
  const tierDiscountRials = Math.round(basePriceRials * ((effectiveCarrier?.discountPercent || 8.5) / 100));
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

  // Financial Approval logic check
  const requiresApproval =
    currentRoleDetail.hasApprovalLimit &&
    shipperApprovalLimitToman > 0 &&
    finalPayableToman > shipperApprovalLimitToman;

  // Handle Book Now Finalization
  const handleFinalizeBooking = () => {
    if (!completeness.isComplete) {
      openShipperOrgModal('basic');
      return;
    }

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
        driverName: requiresApproval ? 'در انتظار تأیید مدیریت' : 'در حال تخصیص راننده خودکار',
        driverPhone: requiresApproval ? '-' : '۰۹۱۲۰۰۰۰۰۰۰',
        truckPlate: requiresApproval ? 'پس از تایید مالی' : 'پلاک در حال صدور',
        status: requiresApproval ? ('pending_approval' as any) : 'pending_driver',
        statusLabelFa: requiresApproval
          ? `نیازمند تایید مدیر ارشد (مبلغ > ${(shipperApprovalLimitToman / 1000000).toLocaleString('fa-IR')} م)`
          : 'سفارش قطعی ثبت شد (در صف تخصیص)',
        departureTime: '۱۴۰۳/۰۶/۰۲ - ۰۹:۰۰',
        estimatedArrival: '۱۴۰۳/۰۶/۰۲ - ۱۸:۰۰',
        progressPercent: 0,
        currentLocation: `مبدأ: ${originCity}`,
        totalCostRials: finalPayableRials,
        insuranceValuationRials: cargoValueToman * 10,
        podSigned: false,
        carrierId: effectiveCarrier.id,
        carrierName: effectiveCarrier.name,
        carrierLogo: effectiveCarrier.logoText,
        carrierRating: effectiveCarrier.rating,
        carrierPhone: effectiveCarrier.phone,
        carrierAddress: effectiveCarrier.address,
        carrierLicenseNo: effectiveCarrier.licenseNo,
        carrierNationalId: effectiveCarrier.nationalId,
        carrierEconomicCode: effectiveCarrier.economicCode,
        carrierRegistrationNo: effectiveCarrier.registrationNumber,
        carrierSelectionMode: carrierSelectionMode,
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
            نمونه کالاهای پرتکرار سازمانی:
          </span>
          {INITIAL_SAVED_COMMODITIES.slice(0, 5).map((com) => (
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

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                id="btn-booked-view-proforma"
                onClick={() => handleOpenProformaInvoice(bookedOrder)}
                className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 rounded-xl text-xs font-bold border border-emerald-300 flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-800" />
                <span>مشاهده و چاپ اسناد بارنامه</span>
              </button>
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

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-white/80 p-3.5 rounded-xl text-xs border border-emerald-200 text-emerald-950">
            <div>
              <span className="text-emerald-700 block text-[11px]">مبدأ و مقصد:</span>
              <strong className="font-bold">{bookedOrder.originCity} ➔ {bookedOrder.destCity}</strong>
            </div>
            <div>
              <span className="text-emerald-700 block text-[11px]">نوع ناوگان:</span>
              <strong className="font-bold font-mono">{bookedOrder.truckType}</strong>
            </div>
            <div>
              <span className="text-emerald-700 block text-[11px]">شرکت باربری منتخب:</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-bold text-slate-900 truncate">{bookedOrder.carrierName || 'خلیج فارس'}</span>
                {bookedOrder.carrierRating && (
                  <span className="text-[10px] text-amber-700 font-bold flex items-center">
                    ★ {bookedOrder.carrierRating}
                  </span>
                )}
              </div>
            </div>
            <div>
              <span className="text-emerald-700 block text-[11px]">مبلغ نهایی فاکتور:</span>
              <strong className="font-bold font-mono">{(bookedOrder.totalCostRials / 10).toLocaleString('fa-IR')} تومان</strong>
            </div>
            <div>
              <span className="text-emerald-700 block text-[11px]">مدل تخصیص / تسویه:</span>
              <span className="inline-block px-2 py-0.5 rounded bg-emerald-200 text-emerald-950 font-bold text-[10px]">
                {bookedOrder.carrierSelectionMode === 'managed' ? 'تخصیص هوشمند تک‌نرخی' : 'بازارگاه رقابتی'}
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
                <CityPickerDropdown
                  id="booking-origin-city"
                  value={originCity}
                  onChange={setOriginCity}
                  label="شهر و استان مبدأ:"
                  type="origin"
                />
                <input
                  type="text"
                  value={originHub}
                  onChange={(e) => setOriginHub(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-[11px] text-slate-700 focus:bg-white focus:border-amber-500 focus:outline-none"
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
                <CityPickerDropdown
                  id="booking-dest-city"
                  value={destCity}
                  onChange={setDestCity}
                  label="شهر و استان مقصد:"
                  type="destination"
                />
                <input
                  type="text"
                  value={destHub}
                  onChange={(e) => setDestHub(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-[11px] text-slate-700 focus:bg-white focus:border-amber-500 focus:outline-none"
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
                <label className="block text-slate-700 font-bold text-xs mb-1.5">شرح کالای ارسالی:</label>
                <input
                  type="text"
                  value={cargoTitle}
                  onChange={(e) => setCargoTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-xs text-slate-800 font-medium focus:bg-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <CommodityPickerDropdown
                  id="booking-cargo-type"
                  value={cargoType}
                  onChange={setCargoType}
                  label="دسته‌بندی و ماهیت کالا:"
                />
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
            <div className="bg-sky-50/70 p-4 rounded-2xl border border-sky-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-sky-950 block">ارزش اظهارشده کالا (مبنای محاسبه بیمه باربری):</span>
                <span className="text-[11px] text-slate-500">پوشش کامل خسارت ناشی از حوادث جاده‌ای و سرقت بر اساس سقف تعهد رسمی</span>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <div className="relative flex items-center">
                  <input
                    type="number"
                    step={1000000}
                    min={0}
                    value={cargoValueToman}
                    onChange={(e) => setCargoValueToman(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="w-48 bg-white border border-sky-300 rounded-xl py-2 px-3 pl-14 text-xs font-mono font-bold text-sky-950 text-left focus:outline-none focus:ring-2 focus:ring-sky-400/40"
                  />
                  <span className="absolute left-2.5 text-[11px] font-bold text-slate-500 pointer-events-none">تومان</span>
                </div>
                <div className="hidden sm:flex flex-col gap-0.5">
                  <button
                    type="button"
                    title="افزایش ۱۰ میلیون تومان"
                    onClick={() => setCargoValueToman((prev) => prev + 10000000)}
                    className="px-2 py-0.5 text-[10px] font-bold bg-sky-100 hover:bg-sky-200 text-sky-800 rounded-md transition-colors cursor-pointer"
                  >
                    +۱۰م
                  </button>
                  <button
                    type="button"
                    title="کاهش ۱۰ میلیون تومان"
                    onClick={() => setCargoValueToman((prev) => Math.max(0, prev - 10000000))}
                    className="px-2 py-0.5 text-[10px] font-bold bg-sky-100 hover:bg-sky-200 text-sky-800 rounded-md transition-colors cursor-pointer"
                  >
                    -۱۰م
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3. انتخاب شرکت حمل‌ونقل و مدل تخصیص (Marketplace vs Managed) */}
          <CarrierSelectionMarketplace
            basePriceRials={rawBaseFreightRials}
            insuranceRials={insuranceRials}
            loadingFeeRials={loadingFeeRials}
            selectedCarrierId={effectiveCarrier.id}
            selectionMode={carrierSelectionMode}
            onSelectCarrier={(carrier) => setSelectedCarrier(carrier)}
            onToggleSelectionMode={(mode) => setCarrierSelectionMode(mode)}
            originCity={originCity}
            destCity={destCity}
            weightTons={weightTons}
            selectedTruck={selectedTruck}
            cargoType={cargoType}
            cargoValueToman={cargoValueToman}
            urgencyLevel={urgencyLevel}
          />

          {/* 4. انتخاب نوع ناوگان بارگیر و خدمات تکمیلی */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-100 gap-3">
              <div className="space-y-0.5">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Truck className="w-4 h-4 text-sky-600" />
                  ۴. انتخاب نوع ناوگان بارگیر و خدمات تکمیلی
                </h3>
                <p className="text-xs text-slate-500">
                  پیشنهاد هوشمند بر اساس نوع بار ({cargoType})، وزن ({weightTons} تن) و ابعاد فیزیکی
                </p>
              </div>

              {/* Minimal Category Filter Pills */}
              <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold self-start sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setFleetFilterCategory('all')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    fleetFilterCategory === 'all'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  همه ({AVAILABLE_FLEET_LIST.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFleetFilterCategory('heavy')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    fleetFilterCategory === 'heavy'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  سنگین و تریلر
                </button>
                <button
                  type="button"
                  onClick={() => setFleetFilterCategory('medium')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    fleetFilterCategory === 'medium'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  تک، جفت و خاور
                </button>
                <button
                  type="button"
                  onClick={() => setFleetFilterCategory('specialized')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    fleetFilterCategory === 'specialized'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  تخصصی و خاص
                </button>
              </div>
            </div>

            {/* Smart Technical Recommendation Banner - Minimal & Clean */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200/90 p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md">
                        پیشنهاد فنی سامانه
                      </span>
                      <strong className="text-sm font-bold text-slate-900">{fleetRecommendation.truck.name}</strong>
                    </div>
                    <span className="text-xs text-slate-500 mt-0.5 block">
                      ظرفیت بارگیری مجاز: {fleetRecommendation.truck.maxTon} تن • شیوه بارگیری: {fleetRecommendation.truck.loadingMethod}
                    </span>
                  </div>
                </div>

                {selectedTruck !== fleetRecommendation.truck.name && (
                  <button
                    type="button"
                    onClick={() => setSelectedTruck(fleetRecommendation.truck.name)}
                    className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0"
                  >
                    <span>انتخاب ناوگان پیشنهادی</span>
                    <Check className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Justification Text */}
              <div className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200/70 leading-relaxed">
                <strong className="text-slate-900 font-bold ml-1">توجیه مهندسی حمل:</strong>
                {fleetRecommendation.reason}
              </div>
            </div>

            {/* Overweight Warning */}
            {isSelectedTruckOverweight && (
              <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl flex items-start justify-between gap-3 animate-in fade-in duration-200">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                  <div className="text-xs">
                    <strong className="text-rose-950 block font-bold">
                      هشدار اضافه بار و عدم انطباق با ظرفیت مجاز ناوگان!
                    </strong>
                    <p className="text-rose-800 text-[11px] mt-0.5 leading-relaxed">
                      وزن محموله ({weightTons} تن) از ظرفیت مجاز ناوگان انتخابی «{currentSelectedTruckObj.name}» ({currentSelectedTruckObj.maxTon} تن) بیشتر است.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTruck(fleetRecommendation.truck.name)}
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shrink-0 cursor-pointer shadow-xs"
                >
                  اصلاح به {fleetRecommendation.truck.name.split(' ')[0]}
                </button>
              </div>
            )}

            {/* Fleet Options Cards Grid - Minimal & Well-Spaced */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {AVAILABLE_FLEET_LIST.filter(
                (truck) => fleetFilterCategory === 'all' || truck.category === fleetFilterCategory
              ).map((truck) => {
                const isSelected = selectedTruck === truck.name;
                const isRec = fleetRecommendation.truck.id === truck.id;
                const isOverweightForThis = weightTons > truck.maxTon;

                return (
                  <div
                    key={truck.id}
                    id={`fleet-card-${truck.id}`}
                    onClick={() => setSelectedTruck(truck.name)}
                    className={`p-4 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between gap-3 text-xs ${
                      isSelected
                        ? 'bg-sky-50/40 border-sky-500 ring-2 ring-sky-500/20 shadow-xs'
                        : isRec
                        ? 'bg-white border-teal-300 hover:border-teal-400 hover:shadow-xs'
                        : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    {/* Header: Title, Category Badge & Radio */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'bg-sky-600 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            <Truck className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-xs">
                              {truck.name}
                            </h4>
                            <span className="text-[10px] text-slate-500 font-medium">
                              {truck.badge}
                            </span>
                          </div>
                        </div>

                        {/* Radio Check Circle */}
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                            isSelected
                              ? 'bg-sky-600 border-sky-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                      </div>

                      {/* Recommendation & Warning Badges */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {isRec && (
                          <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-bold flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5 text-teal-600" />
                            پیشنهاد هوشمند
                          </span>
                        )}
                        {isOverweightForThis && (
                          <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                            اضافه تناژ ⚠️
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Specs Box */}
                    <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-400 block text-[10px]">ظرفیت قانونی:</span>
                        <strong className="text-slate-800 font-mono font-bold">{truck.maxTon} تن</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">تعداد محور:</span>
                        <strong className="text-slate-800 font-mono font-bold">{truck.axles} محور</strong>
                      </div>
                    </div>

                    {/* Brief Description */}
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {truck.desc}
                    </p>

                    {/* Footer: Loading Method & Status */}
                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                      <span className="truncate max-w-[170px] text-slate-400" title={truck.loadingMethod}>
                        {truck.loadingMethod}
                      </span>
                      {isSelected ? (
                        <span className="text-sky-700 font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          انتخاب‌شده
                        </span>
                      ) : (
                        <span className="text-slate-400 group-hover:text-slate-600">
                          کلیک برای انتخاب
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Addon Services - Clean Checkboxes */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-3 p-3.5 bg-slate-50/80 border border-slate-200/90 rounded-2xl cursor-pointer hover:bg-slate-100/80 transition-all">
                <input
                  type="checkbox"
                  checked={includeLoadingService}
                  onChange={(e) => setIncludeLoadingService(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                />
                <div className="text-xs space-y-0.5">
                  <span className="font-bold text-slate-800 block">خدمات لیفتراک و کارگر تخلیه/بارگیری در محل</span>
                  <span className="text-[11px] text-slate-500">۱,۸۰۰,۰۰۰ تومان به ازای هر سرویس بارگیری رسمی</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 bg-slate-50/80 border border-slate-200/90 rounded-2xl cursor-pointer hover:bg-slate-100/80 transition-all">
                <input
                  type="checkbox"
                  checked={includeFullInsurance}
                  onChange={(e) => setIncludeFullInsurance(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                />
                <div className="text-xs space-y-0.5">
                  <span className="font-bold text-slate-800 block">بیمه تکمیلی All-Risk با فرانشیز صفر</span>
                  <span className="text-[11px] text-slate-500">پوشش ۱۰۰٪ ارزش محموله بدون اعمال استهلاک</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Transparent Quote Breakdown: 5 Columns - Deep Navy/Purple Price Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm sticky top-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-600" />
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
                <span className="font-bold text-sky-900">{userOrgName || 'فولاد مبارکه اصفهان'}</span>
              </div>
            </div>

            {/* Carrier Summary Box */}
            <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200/80 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-indigo-950 font-bold flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                  شرکت باربری مجری:
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-900 border border-indigo-200">
                  {carrierSelectionMode === 'managed' ? 'تخصیص هوشمند الگوریتمی' : 'انتخاب از بازارگاه'}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <div
                  className={`w-7 h-7 rounded-lg ${effectiveCarrier.logoBg} ${effectiveCarrier.logoColor} flex items-center justify-center font-bold text-[10px] shrink-0`}
                >
                  {effectiveCarrier.logoText}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-xs truncate">
                    {effectiveCarrier.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                    <span className="flex items-center gap-0.5 text-amber-700 font-bold">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {effectiveCarrier.rating}
                    </span>
                    <span>•</span>
                    <span className="text-slate-600 font-mono">
                      تحویل: ~{effectiveCarrier.estimatedTransitHours} ساعت
                    </span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold">
                      {effectiveCarrier.availableDriversNearby} راننده آماده
                    </span>
                  </div>
                </div>
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
                <span>تخفیف همکاری شرکتی ({effectiveCarrier.discountPercent}٪):</span>
                <span className="font-mono">
                  -{(tierDiscountRials / 10).toLocaleString('fa-IR')} تومان
                </span>
              </div>
            </div>

            {/* Total Payable Box - Deep Navy / Purple for High Financial Value */}
            <div className="p-4 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/60 rounded-2xl space-y-1 text-white shadow-xs">
              <div className="text-[11px] text-indigo-200 font-semibold">مبلغ کل قابل پرداخت بارنامه:</div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-teal-300">
                  {finalPayableToman.toLocaleString('fa-IR')}
                </span>
                <span className="text-xs font-bold text-indigo-200">تومان</span>
              </div>
              <div className="text-[10px] text-slate-400">
                قابل تسویه از کیف پول اعتباری یا درگاه بانکی شاپرک
              </div>
            </div>

            {/* Profile Completeness Guard Warning */}
            {!completeness.isComplete && (
              <div className="p-4 bg-red-50 rounded-2xl border border-red-300 text-red-950 space-y-2 text-xs animate-in fade-in">
                <div className="flex items-center gap-2 font-bold text-red-800">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>
                    ثبت بارنامه غیرفعال است (
                    {currentShipperOrg?.entityType === 'individual'
                      ? 'نقص احراز هویت فردی صاحب بار'
                      : 'نقص پرونده حقوقی شرکت'}
                    )
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-red-700">
                  {currentShipperOrg?.entityType === 'individual'
                    ? `تا زمانی که اطلاعات و مدارک هویتی (کد ملی، موبایل شاهکار، تصویر کارت ملی و تاریخ تولد) تکمیل نگردد، امکان صدور بارنامه وجود ندارد (${completeness.completionPercentage}٪ تکمیل شده).`
                    : `تا زمانی که اطلاعات و مدارک رسمی شرکت تکمیل نگردد، امکان ثبت سفارش حمل و صدور بارنامه رسمی وجود ندارد (${completeness.completionPercentage}٪ تکمیل شده).`}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-red-600 font-bold">
                    موارد ناقص: {completeness.missingFields.slice(0, 2).join('، ')}...
                  </span>
                  <button
                    type="button"
                    onClick={() => openShipperOrgModal('basic')}
                    className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[11px] font-bold cursor-pointer transition-colors"
                  >
                    {currentShipperOrg?.entityType === 'individual' ? 'تکمیل احراز هویت' : 'تکمیل مشخصات شرکت'}
                  </button>
                </div>
              </div>
            )}

            {/* Financial Approval Warning if exceeds limit */}
            {requiresApproval && (
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-300 text-amber-900 space-y-1 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-amber-950">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>نیازمند گردش‌کار تأیید مدیریت (Approval Workflow)</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-800">
                  مبلغ این استعلام بالاتر از سقف تایید مستقیم نقش شما ({(shipperApprovalLimitToman / 1000000).toLocaleString('fa-IR')} میلیون تومان) است. سفارش پس از ثبت به کارتابل مدیر ارشد لجستیک ارسال می‌گردد.
                </p>
              </div>
            )}

            {/* Action Buttons: Book Now */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleFinalizeBooking}
                disabled={isSubmitting || !completeness.isComplete}
                className={`w-full py-3.5 ${
                  !completeness.isComplete
                    ? 'bg-slate-400 cursor-not-allowed text-white shadow-none'
                    : requiresApproval
                    ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                } active:scale-[0.99] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer text-sm disabled:opacity-50`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>در حال پردازش سفارش...</span>
                  </>
                ) : !completeness.isComplete ? (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>ثبت بار غیرفعال (نیازمند تکمیل اطلاعات شرکت)</span>
                  </>
                ) : requiresApproval ? (
                  <>
                    <Send className="w-4 h-4" />
                    <span>ارسال جهت بررسی و تایید مدیر ارشد لجستیک</span>
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
                id="btn-view-proforma-invoice"
                onClick={() => handleOpenProformaInvoice()}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer text-xs border border-slate-300/80 shadow-2xs hover:shadow-xs"
              >
                <FileText className="w-4 h-4 text-amber-600" />
                <span>مشاهده و دانلود پیش‌فاکتور رسمی</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Official Proforma Invoice & Documents Modal */}
      {docModalPackage && (
        <ShipmentDocumentModal
          isOpen={isDocModalOpen}
          onClose={() => setIsDocModalOpen(false)}
          documentPackage={docModalPackage}
          initialDocType="proforma"
        />
      )}
    </div>
  );
};
