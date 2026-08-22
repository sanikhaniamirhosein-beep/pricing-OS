export interface ShipperActiveLoad {
  id: string;
  trackingCode: string;
  billOfLadingNo: string;
  originCity: string;
  originHub: string;
  destCity: string;
  destHub: string;
  cargoType: string;
  weightTons: number;
  truckType: string;
  driverName: string;
  driverPhone: string;
  truckPlate: string;
  status: 'pending_driver' | 'loading' | 'in_transit' | 'delivered';
  statusLabelFa: string;
  departureTime: string;
  estimatedArrival: string;
  progressPercent: number;
  currentLocation: string;
  totalCostRials: number;
  insuranceValuationRials: number;
  podSigned?: boolean;
}

export interface ShipperInvoice {
  id: string;
  invoiceNo: string;
  date: string;
  dueDate: string;
  amountRials: number;
  status: 'paid' | 'due' | 'overdue';
  statusLabelFa: string;
  shipmentCount: number;
  relatedBillOfLadings: string[];
  pdfUrl?: string;
}

export interface ShipperTransaction {
  id: string;
  date: string;
  description: string;
  type: 'debit' | 'credit';
  amountRials: number;
  balanceAfterRials: number;
  referenceNo: string;
}

export interface SavedLocation {
  id: string;
  title: string;
  category: 'origin' | 'destination' | 'both';
  province: string;
  city: string;
  address: string;
  postalCode: string;
  contactPerson: string;
  contactPhone: string;
  isDefault?: boolean;
}

export interface SavedCommodity {
  id: string;
  title: string;
  category: 'عادی' | 'صنعتی' | 'خطرناک' | 'یخچالی' | 'فله';
  unitWeightKg: number;
  standardDimensions: { lengthM: number; widthM: number; heightM: number };
  defaultTruckType: string;
  packagingType: string;
  declaredValueRials: number;
}

export interface ShipperTeamMember {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'مدیر ارشد تدارکات' | 'کارشناس بارنامه' | 'مسئول انبار' | 'مدیر مالی و حسابداری' | 'مدیر بازرگانی';
  accessLevel: 'مدیر کل' | 'ثبت و رهگیری' | 'صرفاً مشاهده و گزارش' | 'امور مالی';
  lastActive: string;
  status: 'active' | 'suspended';
}

export interface ShipperTierInfo {
  tierName: 'برنزی' | 'نقره‌ای' | 'طلایی' | 'پلاتینیوم تجاری';
  monthlyVolumeTons: number;
  targetVolumeTons: number;
  currentDiscountPercent: number;
  nextTierDiscountPercent: number;
  nextTierName: string;
  creditLimitRials: number;
  availableCreditRials: number;
  slaCommitmentRate: number; // e.g. 98.8%
  delayPenaltyPerHourRials: number;
}

export const INITIAL_SHIPPER_TIER: ShipperTierInfo = {
  tierName: 'طلایی',
  monthlyVolumeTons: 1450,
  targetVolumeTons: 2000,
  currentDiscountPercent: 8.5,
  nextTierDiscountPercent: 12.0,
  nextTierName: 'پلاتینیوم تجاری',
  creditLimitRials: 5000000000, // 5 billion rials
  availableCreditRials: 3420000000,
  slaCommitmentRate: 98.8,
  delayPenaltyPerHourRials: 1500000,
};

export const INITIAL_ACTIVE_LOADS: ShipperActiveLoad[] = [
  {
    id: 'SHP-10491',
    trackingCode: 'TRK-882194',
    billOfLadingNo: 'BL-1403-9941',
    originCity: 'اصفهان',
    originHub: 'مجتمع فولاد مبارکه - انبار نورد گرم',
    destCity: 'تهران',
    destHub: 'شهرک صنعتی شمس‌آباد - بلوار بهارستان',
    cargoType: 'شمش و رول فولادی صنعتی',
    weightTons: 22.5,
    truckType: 'تریلی کفی ۱۸ چرخ',
    driverName: 'رسول اکبریان',
    driverPhone: '۰۹۱۲۴۴۵۸۹۱۲',
    truckPlate: '۶۸ ع ۹۴۱ ایران ۴۳',
    status: 'in_transit',
    statusLabelFa: 'در مسیر به سمت مقصد',
    departureTime: '۱۴۰۳/۰۶/۰۱ - ۰۷:۳۰',
    estimatedArrival: '۱۴۰۳/۰۶/۰۱ - ۱۶:۴۵',
    progressPercent: 68,
    currentLocation: 'کیلومتر ۴۵ اتوبان کاشان - قم (سرعت ۷۸ کیلومتر)',
    totalCostRials: 148500000,
    insuranceValuationRials: 2800000000,
    podSigned: false,
  },
  {
    id: 'SHP-10492',
    trackingCode: 'TRK-882195',
    billOfLadingNo: 'BL-1403-9942',
    originCity: 'بندرعباس',
    originHub: 'اسکله شهید رجایی - پایانه لجستیک',
    destCity: 'اصفهان',
    destHub: 'کارخانه صنایع شیمیایی آپادانا',
    cargoType: 'بشکه پلی‌اتیلن پتروشیمی',
    weightTons: 16.0,
    truckType: 'تریلی چادری ترانزیت',
    driverName: 'منصور شریفی',
    driverPhone: '۰۹۱۳۲۲۱۸۷۴۴',
    truckPlate: '۵۴ ب ۳۱۲ ایران ۷۲',
    status: 'loading',
    statusLabelFa: 'در حال بارگیری و صدور بارنامه',
    departureTime: '۱۴۰۳/۰۶/۰۱ - ۱۱:۰۰',
    estimatedArrival: '۱۴۰۳/۰۶/۰۲ - ۱۴:۰۰',
    progressPercent: 15,
    currentLocation: 'پایانه شهید رجایی بندرعباس',
    totalCostRials: 265000000,
    insuranceValuationRials: 4200000000,
    podSigned: false,
  },
  {
    id: 'SHP-10488',
    trackingCode: 'TRK-882180',
    billOfLadingNo: 'BL-1403-9930',
    originCity: 'تبریز',
    originHub: 'شهرک صنعتی رجایی تبریز',
    destCity: 'مشهد',
    destHub: 'انبار مرکزی پخش خاوران مشهد',
    cargoType: 'قطعات و یراق‌آلات ساختمانی',
    weightTons: 4.8,
    truckType: 'خاور روباز ۵ تن',
    driverName: 'قاسم حیدری',
    driverPhone: '۰۹۱۴۷۸۵۹۶۳۲',
    truckPlate: '۱۸ د ۶۴۵ ایران ۱۵',
    status: 'delivered',
    statusLabelFa: 'تحویل داده شد (تایید POD)',
    departureTime: '۱۴۰۳/۰۵/۳۰ - ۱۰:۰۰',
    estimatedArrival: '۱۴۰۳/۰۵/۳۱ - ۲۰:۰۰',
    progressPercent: 100,
    currentLocation: 'مقصد - مشهد مقدس',
    totalCostRials: 98000000,
    insuranceValuationRials: 950000000,
    podSigned: true,
  },
  {
    id: 'SHP-10495',
    trackingCode: 'TRK-882200',
    billOfLadingNo: 'BL-1403-9950',
    originCity: 'قزوین',
    originHub: 'شهرک صنعتی کاسپین',
    destCity: 'شیراز',
    destHub: 'منطقه ویژه اقتصادی شیراز',
    cargoType: 'پالت کاشی و سرامیک درجه یک',
    weightTons: 14.5,
    truckType: 'کامیون جفت (۱۰ چرخ)',
    driverName: 'حمید کمالی',
    driverPhone: '۰۹۱۷۶۵۴۳۲۱۰',
    truckPlate: '۲۴ ص ۸۱۱ ایران ۶۳',
    status: 'pending_driver',
    statusLabelFa: 'در انتظار اعزام راننده',
    departureTime: '۱۴۰۳/۰۶/۰۲ - ۰۸:۰۰',
    estimatedArrival: '۱۴۰۳/۰۶/۰۳ - ۱۰:۰۰',
    progressPercent: 0,
    currentLocation: 'مبدأ - قزوین',
    totalCostRials: 182000000,
    insuranceValuationRials: 1900000000,
    podSigned: false,
  },
];

export const INITIAL_SAVED_LOCATIONS: SavedLocation[] = [
  {
    id: 'LOC-1',
    title: 'کارخانه اصلی فولاد مبارکه (انبار نورد ۳)',
    category: 'origin',
    province: 'اصفهان',
    city: 'اصفهان',
    address: 'کیلومتر ۶۵ جاده اصفهان - مبارکه، درب شرقی پایانه اختصاصی بارگیر',
    postalCode: '8488111111',
    contactPerson: 'مهندس اکبری',
    contactPhone: '۰۳۱۳۷۶۵۴۳۲۱',
    isDefault: true,
  },
  {
    id: 'LOC-2',
    title: 'انبار مرکزی تهران (شمس‌آباد)',
    category: 'destination',
    province: 'تهران',
    city: 'تهران',
    address: 'اتوبان تهران - قم، شهرک صنعتی شمس‌آباد، بلوار سروستان، نبش گلستان ۵',
    postalCode: '1834199999',
    contactPerson: 'آقای شایسته',
    contactPhone: '۰۲۱۵۶۲۳۴۰۰۱',
    isDefault: false,
  },
  {
    id: 'LOC-3',
    title: 'سایت بندرعباس (پایانه اسکله رجایی)',
    category: 'both',
    province: 'هرمزگان',
    city: 'بندرعباس',
    address: 'مجتمع بندری شهید رجایی، زون لجستیک C، انبار مسقف ۸',
    postalCode: '7917712345',
    contactPerson: 'مهندس رضوی',
    contactPhone: '۰۷۶۳۲۲۲۱۱۰۰',
    isDefault: false,
  },
  {
    id: 'LOC-4',
    title: 'پایانه پخش مشهد (طرق)',
    category: 'destination',
    province: 'خراسان رضوی',
    city: 'مشهد',
    address: 'بزرگراه شهید کلانتری، پایانه بار مشهد، سالن ۴، غرفه ۱۲',
    postalCode: '9166688888',
    contactPerson: 'حاج احمدی',
    contactPhone: '۰۵۱۳۳۹۹۸۸۷۷',
  },
];

export const INITIAL_SAVED_COMMODITIES: SavedCommodity[] = [
  {
    id: 'COM-1',
    title: 'رول و کویل ورق فولادی گرم (۲۲ تن)',
    category: 'صنعتی',
    unitWeightKg: 22000,
    standardDimensions: { lengthM: 12.0, widthM: 2.4, heightM: 1.8 },
    defaultTruckType: 'تریلی کفی ۱۸ چرخ',
    packagingType: 'بسته‌بندی متال‌استریپ فولادی',
    declaredValueRials: 2800000000,
  },
  {
    id: 'COM-2',
    title: 'پالت سرامیک پرسلانی صادراتی (۱۴ تن)',
    category: 'عادی',
    unitWeightKg: 14000,
    standardDimensions: { lengthM: 7.2, widthM: 2.3, heightM: 1.5 },
    defaultTruckType: 'کامیون جفت (۱۰ چرخ)',
    packagingType: 'پالت شرینک‌شده و کارتن تقویت‌شده',
    declaredValueRials: 1900000000,
  },
  {
    id: 'COM-3',
    title: 'گرانول پتروشیمی PE100 در جامبوبگ',
    category: 'صنعتی',
    unitWeightKg: 18000,
    standardDimensions: { lengthM: 13.6, widthM: 2.45, heightM: 2.6 },
    defaultTruckType: 'تریلی چادری ترانزیت',
    packagingType: 'جامبوبگ ۱ تنی ضد رطوبت',
    declaredValueRials: 3500000000,
  },
  {
    id: 'COM-4',
    title: 'قطعات ریخته‌گری ماشین‌آلات صنعتی',
    category: 'صنعتی',
    unitWeightKg: 4500,
    standardDimensions: { lengthM: 5.0, widthM: 2.1, heightM: 1.2 },
    defaultTruckType: 'خاور روباز ۵ تن',
    packagingType: 'پالت چوبی مهاربندی‌شده',
    declaredValueRials: 850000000,
  },
];

export const INITIAL_SHIPPER_INVOICES: ShipperInvoice[] = [
  {
    id: 'INV-1403-088',
    invoiceNo: 'INV-88421',
    date: '۱۴۰۳/۰۵/۲۵',
    dueDate: '۱۴۰۳/۰۶/۲۵',
    amountRials: 624000000,
    status: 'paid',
    statusLabelFa: 'تسویه‌شده از کیف پول اعتباری',
    shipmentCount: 4,
    relatedBillOfLadings: ['BL-9910', 'BL-9912', 'BL-9915', 'BL-9918'],
  },
  {
    id: 'INV-1403-091',
    invoiceNo: 'INV-88490',
    date: '۱۴۰۳/۰۵/۳۰',
    dueDate: '۱۴۰۳/۰۶/۳۰',
    amountRials: 413500000,
    status: 'due',
    statusLabelFa: 'در انتظار پرداخت سررسید',
    shipmentCount: 3,
    relatedBillOfLadings: ['BL-9930', 'BL-9935', 'BL-9938'],
  },
  {
    id: 'INV-1403-079',
    invoiceNo: 'INV-88310',
    date: '۱۴۰۳/۰۵/۱۰',
    dueDate: '۱۴۰۳/۰۵/۲۰',
    amountRials: 185000000,
    status: 'paid',
    statusLabelFa: 'پرداخت آنلاین بانکی',
    shipmentCount: 1,
    relatedBillOfLadings: ['BL-9890'],
  },
];

export const INITIAL_SHIPPER_TRANSACTIONS: ShipperTransaction[] = [
  {
    id: 'TRX-901',
    date: '۱۴۰۳/۰۶/۰۱ - ۰۹:۱۵',
    description: 'کسر هزینه بارنامه BL-1403-9941 (مسیر اصفهان به تهران)',
    type: 'debit',
    amountRials: 148500000,
    balanceAfterRials: 3420000000,
    referenceNo: 'REF-8891024',
  },
  {
    id: 'TRX-900',
    date: '۱۴۰۳/۰۵/۲۸ - ۱۴:۰۰',
    description: 'افزایش سقف اعتبار تجاری بر اساس تاییدیه مدیریت ریسک',
    type: 'credit',
    amountRials: 1500000000,
    balanceAfterRials: 3568500000,
    referenceNo: 'CREDIT-INC-1403',
  },
  {
    id: 'TRX-899',
    date: '۱۴۰۳/۰۵/۲۵ - ۱۱:۳۰',
    description: 'تسویه صورتحساب ماهانه دوره مرداد (INV-88421)',
    type: 'debit',
    amountRials: 624000000,
    balanceAfterRials: 2068500000,
    referenceNo: 'PAY-AUTO-88421',
  },
];

export const INITIAL_SHIPPER_TEAM: ShipperTeamMember[] = [
  {
    id: 'USR-1',
    fullName: 'مهندس جواد اکبری',
    email: 'j.akbari@steel-msc.ir',
    phone: '۰۹۱۲۳۴۵۶۷۸۹',
    role: 'مدیر ارشد تدارکات',
    accessLevel: 'مدیر کل',
    lastActive: 'همین الان آنلاین',
    status: 'active',
  },
  {
    id: 'USR-2',
    fullName: 'دکتر فریبرز نادری',
    email: 'f.naderi@steel-msc.ir',
    phone: '۰۹۱۲۹۸۷۶۵۴۳',
    role: 'مدیر بازرگانی',
    accessLevel: 'مدیر کل',
    lastActive: '۲ ساعت پیش',
    status: 'active',
  },
  {
    id: 'USR-3',
    fullName: 'سعید کمالی',
    email: 's.kamali@steel-msc.ir',
    phone: '۰۹۱۳۱۱۱۲۲۳۳',
    role: 'کارشناس بارنامه',
    accessLevel: 'ثبت و رهگیری',
    lastActive: '۱۰ دقیقه پیش',
    status: 'active',
  },
  {
    id: 'USR-4',
    fullName: 'مریم حسینی',
    email: 'm.hosseini@steel-msc.ir',
    phone: '۰۹۱۹۴۴۴۵۵۶۶',
    role: 'مدیر مالی و حسابداری',
    accessLevel: 'امور مالی',
    lastActive: 'دیروز',
    status: 'active',
  },
];

export const MONTHLY_SPEND_DATA = [
  { month: 'فروردین', amountMillionRials: 380, shipmentCount: 14 },
  { month: 'اردیبهشت', amountMillionRials: 520, shipmentCount: 21 },
  { month: 'خرداد', amountMillionRials: 690, shipmentCount: 26 },
  { month: 'تیر', amountMillionRials: 840, shipmentCount: 32 },
  { month: 'مرداد', amountMillionRials: 1120, shipmentCount: 44 },
  { month: 'شهریور (جاری)', amountMillionRials: 413, shipmentCount: 18 },
];

export const ROUTE_ANALYTICS_DATA = [
  { route: 'اصفهان ➔ تهران', spendMillionRials: 480, sharePercent: 38, count: 28 },
  { route: 'بندرعباس ➔ اصفهان', spendMillionRials: 340, sharePercent: 27, count: 16 },
  { route: 'قزوین ➔ شیراز', spendMillionRials: 230, sharePercent: 18, count: 14 },
  { route: 'تبریز ➔ مشهد', spendMillionRials: 140, sharePercent: 11, count: 9 },
  { route: 'سایر مسیرها', spendMillionRials: 80, sharePercent: 6, count: 7 },
];

export const FLEET_USAGE_DATA = [
  { truck: 'تریلی کفی ۱۸ چرخ', count: 42, percentage: 52 },
  { truck: 'تریلی چادری ترانزیت', count: 20, percentage: 25 },
  { truck: 'کامیون جفت (۱۰ چرخ)', count: 12, percentage: 15 },
  { truck: 'خاور و کامیونت', count: 7, percentage: 8 },
];
