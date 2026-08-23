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
  role: string;
  accessLevel: string;
  lastActive: string;
  status: 'active' | 'suspended';
  locationScope?: string;
  approvalLimitToman?: number;
}

export interface ShipperTierInfo {
  tierName: string;
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
    defaultTruckType: 'تریلر کفی ۱۳.۶ متری (۱۸ چرخ)',
    packagingType: 'بسته‌بندی متال‌استریپ فولادی مهارشده',
    declaredValueRials: 2800000000,
  },
  {
    id: 'COM-2',
    title: 'فرآورده‌های لبنی و بستنی منجمد (-۱۸°C)',
    category: 'یخچالی',
    unitWeightKg: 18000,
    standardDimensions: { lengthM: 13.4, widthM: 2.45, heightM: 2.4 },
    defaultTruckType: 'تریلی یخچالی دماسنج‌دار (-۱۸°C تا +۴°C)',
    packagingType: 'کارتن پالت‌شده با سلفون حرارتی',
    declaredValueRials: 3200000000,
  },
  {
    id: 'COM-3',
    title: 'گرانول پتروشیمی PE100 در جامبوبگ',
    category: 'صنعتی',
    unitWeightKg: 19500,
    standardDimensions: { lengthM: 13.6, widthM: 2.45, heightM: 2.6 },
    defaultTruckType: 'تریلی چادری ترانزیت (سقف کشویی)',
    packagingType: 'جامبوبگ ۱ تنی ضد رطوبت',
    declaredValueRials: 3500000000,
  },
  {
    id: 'COM-4',
    title: 'ترانسفورماتور قدرت نیروگاهی (محموله ترافیکی)',
    category: 'صنعتی',
    unitWeightKg: 38000,
    standardDimensions: { lengthM: 14.8, widthM: 3.2, heightM: 3.4 },
    defaultTruckType: 'کمرشکن بوژی فوق سنگین (ترافیکی)',
    packagingType: 'مهاربندی زنجیری گرید ۸۰ با استراکچر حمال',
    declaredValueRials: 18000000000,
  },
  {
    id: 'COM-5',
    title: 'قیر مذاب و نفت کوره صنعتی (تانکری)',
    category: 'خطرناک',
    unitWeightKg: 23000,
    standardDimensions: { lengthM: 12.5, widthM: 2.4, heightM: 2.5 },
    defaultTruckType: 'تانکر مخصوص مایعات و شیمیایی ADR',
    packagingType: 'مخزن دوجداره ایزوله با عایق حرارتی',
    declaredValueRials: 2100000000,
  },
  {
    id: 'COM-6',
    title: 'پالت سرامیک پرسلانی ساختمانی (۱۴ تن)',
    category: 'عادی',
    unitWeightKg: 14000,
    standardDimensions: { lengthM: 7.2, widthM: 2.3, heightM: 1.5 },
    defaultTruckType: 'کامیون جفت ۱۰ چرخ (۱۵ تن)',
    packagingType: 'پالت شرینک‌شده و کارتن تقویت‌شده',
    declaredValueRials: 1900000000,
  },
  {
    id: 'COM-7',
    title: 'قطعات و لوازم یدکی خودرو سبک (۴ تن)',
    category: 'صنعتی',
    unitWeightKg: 4200,
    standardDimensions: { lengthM: 4.8, widthM: 2.1, heightM: 1.6 },
    defaultTruckType: 'خاور مسقف / روباز ۵ تن (ایسوزو)',
    packagingType: 'باکس پالت چوبی پلمپ‌شده',
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

export interface ShipperTicketMessage {
  id: string;
  sender: 'shipper' | 'support' | 'driver' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  attachments?: string[];
  isSystemAction?: boolean;
}

export interface ShipperSupportTicket {
  id: string;
  loadId: string;
  billOfLadingNo: string;
  trackingCode: string;
  originCity: string;
  destCity: string;
  cargoType: string;
  driverName: string;
  driverPhone: string;
  truckPlate: string;
  category: 'delay' | 'damage' | 'breakdown' | 'route_deviation' | 'driver_issue' | 'pricing_dispute' | 'other';
  categoryLabelFa: string;
  priority: 'urgent' | 'high' | 'normal';
  priorityLabelFa: string;
  status: 'open' | 'in_progress' | 'resolved';
  statusLabelFa: string;
  subject: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  assignedAgent: string;
  locationAtReport: string;
  estimatedResolutionTime?: string;
  resolutionNotes?: string;
  messages: ShipperTicketMessage[];
}

export const FLEET_USAGE_DATA = [
  { truck: 'تریلی کفی ۱۸ چرخ', count: 42, percentage: 52 },
  { truck: 'تریلی چادری ترانزیت', count: 20, percentage: 25 },
  { truck: 'کامیون جفت (۱۰ چرخ)', count: 12, percentage: 15 },
  { truck: 'خاور و کامیونت', count: 7, percentage: 8 },
];

export const INITIAL_SUPPORT_TICKETS: ShipperSupportTicket[] = [
  {
    id: 'INC-1403-902',
    loadId: 'SHP-10491',
    billOfLadingNo: 'BL-1403-9941',
    trackingCode: 'TRK-882194',
    originCity: 'اصفهان',
    destCity: 'تهران',
    cargoType: 'شمش و رول فولادی صنعتی (۲۲.۵ تن)',
    driverName: 'رسول اکبریان',
    driverPhone: '۰۹۱۲۴۴۵۸۹۱۲',
    truckPlate: '۶۸ ع ۹۴۱ ایران ۴۳',
    category: 'delay',
    categoryLabelFa: 'تاخیر در رسیدن به انبار مقصد',
    priority: 'high',
    priorityLabelFa: 'اولویت بالا (ترافیک شدید)',
    status: 'in_progress',
    statusLabelFa: 'در حال پیگیری تیم دیسپچینگ',
    subject: 'تاخیر در ورود به مقصد به دلیل انسداد مقطعی محور کاشان-قم',
    description: 'طبق برنامه زمان‌بندی ورود بار باید ساعت ۱۶:۴۵ می‌بود اما به دلیل تعمیرات راه و ترافیک سنگین، راننده با تاخیر مواجه است. نیاز به هماهنگی با انبار شمس‌آباد برای نوبت تخلیه شیفت شب.',
    createdAt: '۱۴۰۳/۰۶/۰۱ - ۱۱:۳۰',
    updatedAt: '۱۴۰۳/۰۶/۰۱ - ۱۲:۴۰',
    assignedAgent: 'مهندس حسینی (دیسپچینگ ۲۴ ساعته)',
    locationAtReport: 'کیلومتر ۴۵ اتوبان کاشان - قم',
    estimatedResolutionTime: '۱۴۰۳/۰۶/۰۱ - ۱۸:۰۰',
    messages: [
      {
        id: 'msg-1',
        sender: 'shipper',
        senderName: 'مهندس اکبری (صاحب بار)',
        text: 'سلام و احترام، با توجه به حساسیت زمان‌بندی خط تولید کارخانه شمس‌آباد، راننده اعلام کرد به دلیل ترافیک تاخیر دارد. لطفاً با مسئول نوبت‌دهی انبار هماهنگ فرمایید تا پس از ساعت اداری نیز پذیرش انجام شود.',
        timestamp: '۱۱:۳۰',
      },
      {
        id: 'msg-2',
        sender: 'system',
        senderName: 'سامانه هوشمند دیسپچینگ',
        text: 'تیکت فوریت حمل به شماره INC-1403-902 ثبت و به کارشناس شیفت دیسپچینگ (مهندس حسینی) ارجاع گردید.',
        timestamp: '۱۱:۳۲',
        isSystemAction: true,
      },
      {
        id: 'msg-3',
        sender: 'support',
        senderName: 'مهندس حسینی (پشتیبانی عملیات)',
        text: 'سلام جناب مهندس اکبری. با راننده آقای اکبریان تماس گرفته شد؛ موقعیت GPS ایشان تایید شد. هم‌اکنون با سرپرست انبار مقصد (آقای مهندس کمالی) تماس گرفتیم و تاییدیه تخلیه تا ساعت ۱۹:۳۰ بدون جریمه توقف اخذ گردید.',
        timestamp: '۱۲:۱۵',
      },
      {
        id: 'msg-4',
        sender: 'driver',
        senderName: 'رسول اکبریان (راننده ناوگان)',
        text: 'سلام خدمت صاحب بار محترم. ترافیک در حال باز شدن است و تا حدود ساعت ۱۸ وارد شهرک صنعتی شمس‌آباد می‌شوم. پلمپ و برزنت کاملاً سالم است.',
        timestamp: '۱۲:۴۰',
      },
    ],
  },
  {
    id: 'INC-1403-903',
    loadId: 'SHP-10492',
    billOfLadingNo: 'BL-1403-9942',
    trackingCode: 'TRK-882195',
    originCity: 'بندرعباس',
    destCity: 'اصفهان',
    cargoType: 'بشکه پلی‌اتیلن پتروشیمی (۱۶ تن)',
    driverName: 'منصور شریفی',
    driverPhone: '۰۹۱۳۲۲۱۸۷۴۴',
    truckPlate: '۵۴ ب ۳۱۲ ایران ۷۲',
    category: 'damage',
    categoryLabelFa: 'بررسی پلمپ گمرکی و سلامت بشکه‌ها',
    priority: 'urgent',
    priorityLabelFa: 'فوری / اضطراری',
    status: 'open',
    statusLabelFa: 'باز (در صف بررسی کارشناس)',
    subject: 'درخواست بازبینی پلمپ قبل از خروج از محوطه اسکله شهید رجایی',
    description: 'هنگام بارگیری ۲ عدد بشکه پلی‌اتیلن دارای خراشیدگی سطحی روی پالت مشاهده شده است. نیاز به ثبت صورتجلسه بارگیری جهت عدم تداخل با بیمه مسئولیت حمل‌ونقل.',
    createdAt: '۱۴۰۳/۰۶/۰۱ - ۱۲:۱۰',
    updatedAt: '۱۴۰۳/۰۶/۰۱ - ۱۲:۱۵',
    assignedAgent: 'واحد خسارت و ارزیابی بیمه باربری',
    locationAtReport: 'اسکله شهید رجایی - پایانه لجستیک بندرعباس',
    estimatedResolutionTime: '۱۴۰۳/۰۶/۰۱ - ۱۴:۰۰',
    messages: [
      {
        id: 'msg-201',
        sender: 'shipper',
        senderName: 'مهندس اکبری (صاحب بار)',
        text: 'با سلام، لطفا پیش از حرکت تریلی از بندرعباس، عکس‌های بارگیری و سلامت پلمپ‌ها در سامانه ضمیمه شود تا در زمان تحویل در اصفهان مغایرتی پیش نیاید.',
        timestamp: '۱۲:۱۰',
      },
      {
        id: 'msg-202',
        sender: 'system',
        senderName: 'سامانه ثبت خسارت',
        text: 'درخواست ثبت صورتجلسه سلامت بار به نمایندگی بندرعباس ارسال شد. مامور ارزیابی در محل اسکله حاضر خواهد شد.',
        timestamp: '۱۲:۱۵',
        isSystemAction: true,
      },
    ],
  },
  {
    id: 'INC-1403-889',
    loadId: 'SHP-10488',
    billOfLadingNo: 'BL-1403-9930',
    trackingCode: 'TRK-882180',
    originCity: 'تبریز',
    destCity: 'مشهد',
    cargoType: 'قطعات و یراق‌آلات ساختمانی (۴.۸ تن)',
    driverName: 'قاسم حیدری',
    driverPhone: '۰۹۱۴۷۸۵۹۶۳۲',
    truckPlate: '۱۸ د ۶۴۵ ایران ۱۵',
    category: 'pricing_dispute',
    categoryLabelFa: 'توقفگاه و هزینه دیرکرد تخلیه',
    priority: 'normal',
    priorityLabelFa: 'عادی',
    status: 'resolved',
    statusLabelFa: 'حل‌شده و مختومه',
    subject: 'محاسبه هزینه حق توقف ۲ ساعته در انبار خاوران مشهد',
    description: 'به علت قطعی موقت سامانه انبارداری در مقصد، تخلیه ۲ ساعت با تاخیر مواجه گردید. هزینه توقف بر اساس تعرفه مصوب راهداری محاسبه و در فاکتور نهایی منظور شد.',
    createdAt: '۱۴۰۳/۰۵/۳۱ - ۱۵:۰۰',
    updatedAt: '۱۴۰۳/۰۵/۳۱ - ۱۸:۳۰',
    assignedAgent: 'امور قراردادها و مالی لجستیک',
    locationAtReport: 'انبار مرکزی پخش خاوران مشهد',
    resolutionNotes: 'مبلغ ۲۴۰,۰۰۰ تومان به عنوان هزینه توقف مجاز طبق آیین‌نامه راهداری برای راننده واریز شد و رسید POD با امضای انباردار ثبت گردید.',
    messages: [
      {
        id: 'msg-301',
        sender: 'driver',
        senderName: 'قاسم حیدری (راننده)',
        text: 'سلام، در انبار مشهد اعلام کردند به دلیل ارتقای نرم‌افزار، تخلیه ۲ ساعت طول می‌کشد.',
        timestamp: '۱۵:۰۰',
      },
      {
        id: 'msg-302',
        sender: 'support',
        senderName: 'کارشناس حل اختلاف (مهندس راد)',
        text: 'سلام. توقف ثبت گردید و با انبار مقصد هماهنگ شد. ساعت ۱۷:۰۰ تخلیه با موفقیت تکمیل شد و فرم تسویه امضا شد.',
        timestamp: '۱۷:۱۵',
      },
      {
        id: 'msg-303',
        sender: 'system',
        senderName: 'سیستم تسویه مالی',
        text: 'تیکت با تایید طرفین و ثبت سند POD مختومه اعلام گردید.',
        timestamp: '۱۸:۳۰',
        isSystemAction: true,
      },
    ],
  },
  {
    id: 'INC-1403-880',
    loadId: 'SHP-10495',
    billOfLadingNo: 'BL-1403-9950',
    trackingCode: 'TRK-882200',
    originCity: 'قزوین',
    destCity: 'شیراز',
    cargoType: 'پالت کاشی و سرامیک درجه یک (۱۴.۵ تن)',
    driverName: 'حمید کمالی',
    driverPhone: '۰۹۱۷۶۵۴۳۲۱۰',
    truckPlate: '۲۴ ص ۸۱۱ ایران ۶۳',
    category: 'route_deviation',
    categoryLabelFa: 'هماهنگی مسیر جایگزین به دلیل شرایط جوی',
    priority: 'high',
    priorityLabelFa: 'اولویت بالا',
    status: 'resolved',
    statusLabelFa: 'حل‌شده و مختومه',
    subject: 'تغییر مسیر حرکت از گردنه به دلیل بارش و اعلام راهداری',
    description: 'با هماهنگی مرکز مدیریت راه‌های کشور، ناوگان از مسیر اتوبان اصفهان-شیراز عبور نموده و هزینه مازاد عوارض توسط سیستم تعدیل شد.',
    createdAt: '۱۴۰۳/۰۵/۲۸ - ۰۹:۰۰',
    updatedAt: '۱۴۰3/05/29 - 10:00',
    assignedAgent: 'مرکز مانیتورینگ مسیر',
    locationAtReport: 'محور قزوین - سلفچگان',
    resolutionNotes: 'مسیر جایگزین با موفقیت طی شد و بار سالم تحویل گردید.',
    messages: [
      {
        id: 'msg-401',
        sender: 'support',
        senderName: 'مرکز مانیتورینگ',
        text: 'اطلاعیه راهداری: انسداد موقت گردنه به دلیل عملیات عمرانی. مسیر جایگزین به راننده ابلاغ شد.',
        timestamp: '۰۹:۰۰',
      },
      {
        id: 'msg-402',
        sender: 'shipper',
        senderName: 'مهندس اکبری (صاحب بار)',
        text: 'متشکرم، مسیر جایگزین مورد تایید است.',
        timestamp: '۰۹:۳۰',
      },
    ],
  },
];

export interface BatchShipmentRow {
  id: string;
  rowNumber: number;
  originCity: string;
  destCity: string;
  originHub?: string;
  destHub?: string;
  cargoType: string;
  cargoTitle: string;
  weightTons: number;
  truckType: string;
  cargoValueToman: number;
  estimatedPriceRials: number;
  discountRials: number;
  finalPriceRials: number;
  loadingDate: string;
  status: 'valid' | 'warning' | 'error';
  validationMessage?: string;
  senderName?: string;
  receiverName?: string;
  notes?: string;
}

export interface BatchUploadHistory {
  id: string;
  fileName: string;
  fileSizeKb: number;
  uploadDate: string;
  totalRows: number;
  validRows: number;
  totalPriceRials: number;
  status: 'draft' | 'submitted' | 'processing' | 'completed';
  batchCode: string;
}

export const SAMPLE_BATCH_SHIPMENTS: BatchShipmentRow[] = [
  {
    id: 'row-1',
    rowNumber: 1,
    originCity: 'اصفهان',
    destCity: 'تهران',
    originHub: 'مجتمع فولاد مبارکه - انبار نورد',
    destHub: 'شهرک صنعتی شمس‌آباد - فاز ۳',
    cargoType: 'صنعتی و فلزی',
    cargoTitle: 'کویل ورق فولادی ST37 (۲۲ تن)',
    weightTons: 22.0,
    truckType: 'تریلر کفی ۱۸ چرخ',
    cargoValueToman: 350000000,
    estimatedPriceRials: 145000000,
    discountRials: 12000000,
    finalPriceRials: 133000000,
    loadingDate: '۱۴۰۳/۰۶/۰۵',
    status: 'valid',
    validationMessage: 'اطلاعات کامل و آماده تخصیص ناوگان',
    senderName: 'فولاد مبارکه',
    receiverName: 'ایران خودرو دیزل',
  },
  {
    id: 'row-2',
    rowNumber: 2,
    originCity: 'بندرعباس',
    destCity: 'اصفهان',
    originHub: 'اسکله شهید رجایی - پایانه ۲',
    destHub: 'انبار مرکزی ذوب‌آهن',
    cargoType: 'مواد اولیه پتروشیمی',
    cargoTitle: 'پالت مواد پلی‌اتیلن سنگین (۱۸ تن)',
    weightTons: 18.0,
    truckType: 'تریلی چادری ترانزیت',
    cargoValueToman: 280000000,
    estimatedPriceRials: 198000000,
    discountRials: 16000000,
    finalPriceRials: 182000000,
    loadingDate: '۱۴۰۳/۰۶/۰۶',
    status: 'valid',
    validationMessage: 'مجوز ترانزیت و پلمپ تایید شد',
    senderName: 'پتروشیمی خلیج فارس',
    receiverName: 'صنایع پلاستیک اصفهان',
  },
  {
    id: 'row-3',
    rowNumber: 3,
    originCity: 'تبریز',
    destCity: 'مشهد',
    originHub: 'شهرک صنعتی رجایی تبریز',
    destHub: 'انبار پخش خاوران مشهد',
    cargoType: 'قطعات و لوازم صنعتی',
    cargoTitle: 'جعبه قطعات یدکی پمپ و اتصالات (۱۲ تن)',
    weightTons: 12.0,
    truckType: 'کامیون جفت ۱۰ چرخ',
    cargoValueToman: 190000000,
    estimatedPriceRials: 135000000,
    discountRials: 10000000,
    finalPriceRials: 125000000,
    loadingDate: '۱۴۰۳/۰۶/۰۷',
    status: 'valid',
    validationMessage: 'آماده بارگیری طبق نوبت',
    senderName: 'موتوژن تبریز',
    receiverName: 'پارس پمپ مشهد',
  },
  {
    id: 'row-4',
    rowNumber: 4,
    originCity: 'قزوین',
    destCity: 'شیراز',
    originHub: 'شهرک صنعتی کاسپین',
    destHub: 'منطقه ویژه اقتصادی شیراز',
    cargoType: 'کاشی و سرامیک',
    cargoTitle: 'پالت سرامیک پرسلان صادراتی (۱۵ تن)',
    weightTons: 15.0,
    truckType: 'کامیون تک ۶ چرخ',
    cargoValueToman: 160000000,
    estimatedPriceRials: 110000000,
    discountRials: 8000000,
    finalPriceRials: 102000000,
    loadingDate: '۱۴۰۳/۰۶/۰۸',
    status: 'warning',
    validationMessage: 'وزن نزدیک سقف مجاز کارت ماشین است (بررسی مجدد)',
    senderName: 'سرامیک البرز',
    receiverName: 'بازرگانی فارس',
  },
  {
    id: 'row-5',
    rowNumber: 5,
    originCity: 'اهواز',
    destCity: 'تهران',
    originHub: 'لوله و نورد اهواز',
    destHub: 'انبار آهن مکان شادآباد',
    cargoType: 'لوله فولادی',
    cargoTitle: 'شاخه لوله بدون درز مانیسمان (۲۴ تن)',
    weightTons: 24.0,
    truckType: 'تریلر کفی ۱۸ چرخ',
    cargoValueToman: 420000000,
    estimatedPriceRials: 175000000,
    discountRials: 15000000,
    finalPriceRials: 160000000,
    loadingDate: '۱۴۰۳/۰۶/۰۸',
    status: 'valid',
    validationMessage: 'تاییدیه ابعاد ترافیکی و مهار بار دریافت شد',
    senderName: 'لوله اهواز',
    receiverName: 'تهران پایپ',
  },
];

export const INITIAL_BATCH_HISTORIES: BatchUploadHistory[] = [
  {
    id: 'batch-1403-101',
    fileName: 'MSC_Orders_Week36_Production.xlsx',
    fileSizeKb: 148,
    uploadDate: '۱۴۰۳/۰۶/۰۱ - ۱۰:۱۵',
    totalRows: 5,
    validRows: 5,
    totalPriceRials: 702000000,
    status: 'draft',
    batchCode: 'BAT-1403-0991',
  },
  {
    id: 'batch-1403-100',
    fileName: 'Dispatch_August_Consignments.csv',
    fileSizeKb: 92,
    uploadDate: '۱۴۰۳/۰۵/۲۵ - ۱۶:۴۰',
    totalRows: 12,
    validRows: 12,
    totalPriceRials: 1540000000,
    status: 'completed',
    batchCode: 'BAT-1403-0870',
  },
  {
    id: 'batch-1403-099',
    fileName: 'Esfahan_Tehran_SteelRolls_Daily.xlsx',
    fileSizeKb: 110,
    uploadDate: '۱۴۰۳/۰۵/۱۸ - ۰۸:۲۰',
    totalRows: 8,
    validRows: 8,
    totalPriceRials: 1080000000,
    status: 'completed',
    batchCode: 'BAT-1403-0742',
  },
];

