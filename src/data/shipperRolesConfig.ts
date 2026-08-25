/**
 * Shipper (Cargo Owner) Roles & Permissions Configuration
 * Canonical Role Definitions & Granular Scopes for Shipper Organizations
 */

export type ShipperUserRole =
  | 'Supply Chain Manager / Admin'
  | 'Logistics Specialist / Coordinator'
  | 'Warehouse / Dispatch Operator'
  | 'Finance Manager / Billing Specialist'
  | 'Individual Shipper / Personal';

export interface ShipperRoleDetail {
  id: string;
  role: ShipperUserRole;
  titleFa: string;
  titleEn: string;
  accessScopeFa: string;
  dutiesFa: string[];
  allowedTabs: string[];
  levelBadge: string;
  departmentFa: string;
  defaultUserName: string;
  defaultUserEmail: string;
  defaultPassword?: string;
  descriptionFa: string;
  // Governance & Scope Flags
  hasApprovalLimit: boolean;
  defaultApprovalLimitToman: number; // 100 million toman limit for specialists
  locationScoped: boolean; // True for warehouse operators
  defaultLocation: string;
  canManageUsers: boolean;
  canApproveContracts: boolean;
  canCreateOrders: boolean;
  canApproveHighValueOrders: boolean;
  canUploadPOD: boolean;
  canConfirmDispatch: boolean;
  canPayInvoices: boolean;
  canExportERP: boolean;
}

export const SHIPPER_AVAILABLE_LOCATIONS = [
  'انبار مرکزی (اصفهان - مجتمع فولاد مبارکه)',
  'کارخانه شماره ۲ (شمس‌آباد تهران)',
  'انبار لجستیک بندر شهید رجایی (بندرعباس)',
  'مرکز توزیع منطقه‌ای شرق (مشهد)',
  'انبار گمرک و بارانداز غرب تهران',
  'پایانه انبارداری منطقه ویژه اقتصادی عسلویه',
];

export const SHIPPER_ROLE_DETAILS: ShipperRoleDetail[] = [
  {
    id: 'shp-role-scm-admin',
    role: 'Supply Chain Manager / Admin',
    titleFa: 'مدیر ارشد لجستیک / زنجیره تأمین',
    titleEn: 'Supply Chain Manager / Admin',
    accessScopeFa: 'دسترسی کامل به تمامی بخش‌های پورتال مشتری و تنظیمات راهبردی',
    dutiesFa: [
      'تعریف سایر پرسنل شرکت و تخصیص نقش‌ها و انبارهای مجاز',
      'مشاهده داشبورد گزارش‌های کلی، شاخص‌های کلیدی (KPI) و هزینه‌های لجستیک',
      'تایید نهایی قراردادها، تخفیفات پله‌ای و افزایش سقف اعتباری شرکت',
      'تصویب نهایی سفارش‌های با ارزش بالا (فراتر از سقف کارشناسان)',
    ],
    allowedTabs: [
      'dashboard',
      'quote',
      'batch_orders',
      'shipments',
      'support',
      'contracts',
      'billing',
      'master_data',
      'analytics',
      'settings',
    ],
    levelBadge: 'سطح ۱ (مدیر ارشد)',
    departmentFa: 'مدیریت زنجیره تامین و لجستیک سازمانی',
    defaultUserName: 'مهندس جواد اکبری',
    defaultUserEmail: 'j.akbari@steel-msc.ir',
    defaultPassword: 'admin@shipper123',
    descriptionFa: 'مدیر ارشد زنجیره تامین با اختیار تام در مدیریت سفارشات، اعتبارات، پرسنل و قراردادهای عمده.',
    hasApprovalLimit: false,
    defaultApprovalLimitToman: 0, // No limit
    locationScoped: false,
    defaultLocation: 'همه انبارها و کارخانجات',
    canManageUsers: true,
    canApproveContracts: true,
    canCreateOrders: true,
    canApproveHighValueOrders: true,
    canUploadPOD: true,
    canConfirmDispatch: true,
    canPayInvoices: true,
    canExportERP: true,
  },
  {
    id: 'shp-role-logistics-spec',
    role: 'Logistics Specialist / Coordinator',
    titleFa: 'کارشناس ثبت سفارش / لجستیک',
    titleEn: 'Logistics Specialist / Coordinator',
    accessScopeFa: 'ثبت استعلام قیمت، ثبت درخواست بارگیری، پیگیری محموله‌ها و ارتباط با ناوگان',
    dutiesFa: [
      'وارد کردن اطلاعات محموله‌ها (وزن، حجم، مبدأ، مقصد و نوع ناوگان)',
      'ثبت مستقیم سفارش‌های زیر سقف ۱۰۰ میلیون تومان و ارسال سفارش‌های سنگین به صف تایید',
      'پیگیری لحظه‌ای بارها روی نقشه و مدیریت زمان‌بندی‌های تحویل',
      'ثبت تیکت‌های پشتیبانی و اعلام حوادث یا تاخیرات به دیسپچینگ ناوگان',
    ],
    allowedTabs: [
      'dashboard',
      'quote',
      'batch_orders',
      'shipments',
      'support',
      'master_data',
    ],
    levelBadge: 'سطح ۲ (کارشناس عملیات)',
    departmentFa: 'واحد سفارشات و ترابری بار',
    defaultUserName: 'مریم سهرابی',
    defaultUserEmail: 'm.sohrabi@steel-msc.ir',
    defaultPassword: 'logistics@shipper123',
    descriptionFa: 'مسئول ثبت سفارشات روزانه، استعلام نرخ کرایه و رهگیری لحظه‌ای ناوگان تا مقصد.',
    hasApprovalLimit: true,
    defaultApprovalLimitToman: 100000000, // 100 million toman approval limit
    locationScoped: false,
    defaultLocation: 'همه انبارها و کارخانجات',
    canManageUsers: false,
    canApproveContracts: false,
    canCreateOrders: true,
    canApproveHighValueOrders: false,
    canUploadPOD: false,
    canConfirmDispatch: false,
    canPayInvoices: false,
    canExportERP: false,
  },
  {
    id: 'shp-role-warehouse-op',
    role: 'Warehouse / Dispatch Operator',
    titleFa: 'مسئول انبار / تحویل‌گیرنده',
    titleEn: 'Warehouse / Dispatch Operator',
    accessScopeFa: 'مشاهده لیست بارهای ورودی/خروجی مربوط به انبار تخصیص‌یافته و آپلود مدارک تحویل (POD)',
    dutiesFa: [
      'تایید بارگیری محموله در مبدأ و تطبیق با برگ خروج و توزین باسکول',
      'ثبت وضعیت ظاهری بار، سلامت پلمپ و شماره بارنامه',
      'آپلود رسیدها، قبض باسکول و بارنامه‌های امضاشده (POD الکترونیک)',
      'تایید تحویل نهایی و تخلیه کالا در انبار مقصد',
    ],
    allowedTabs: [
      'shipments',
      'support',
      'master_data',
    ],
    levelBadge: 'سطح ۲ (انبار و دیسپچ)',
    departmentFa: 'واحد انبارداری و تحویل کالا',
    defaultUserName: 'رضا حسینی',
    defaultUserEmail: 'r.hosseini@steel-msc.ir',
    defaultPassword: 'warehouse@shipper123',
    descriptionFa: 'مسئول انبار مرکزی با دسترسی مقید به موقعیت جغرافیایی و بارانداز اختصاصی جهت تایید بارگیری و آپلود مدارک تحویل.',
    hasApprovalLimit: false,
    defaultApprovalLimitToman: 0,
    locationScoped: true,
    defaultLocation: 'انبار مرکزی (اصفهان - مجتمع فولاد مبارکه)',
    canManageUsers: false,
    canApproveContracts: false,
    canCreateOrders: false,
    canApproveHighValueOrders: false,
    canUploadPOD: true,
    canConfirmDispatch: true,
    canPayInvoices: false,
    canExportERP: false,
  },
  {
    id: 'shp-role-finance-manager',
    role: 'Finance Manager / Billing Specialist',
    titleFa: 'مدیر / کارشناس مالی مشتری',
    titleEn: 'Finance Manager / Billing Specialist',
    accessScopeFa: 'صورتحساب‌ها، پیش‌فاکتورها، تاریخچه پرداخت‌ها، مدیریت اعتبار و خروجی‌های ERP',
    dutiesFa: [
      'بررسی و تایید پیش‌فاکتورهای صادرشده توسط سامانه Pricing OS',
      'پرداخت آنلاین، ثبت اسناد واریز بانکی و پایش مانده اعتبار سازمانی',
      'تایید مالی سفارش‌های بالای ۱۰۰ میلیون تومان ثبت‌شده توسط کارشناسان لجستیک',
      'دریافت گزارش‌ها و خروجی‌های استاندارد مالی جهت ثبت در سامانه ERP / راهکاران پویا',
    ],
    allowedTabs: [
      'dashboard',
      'billing',
      'contracts',
      'analytics',
      'settings',
    ],
    levelBadge: 'سطح ۳ (مدیریت مالی)',
    departmentFa: 'معاونت مالی و حسابداری صنعتی',
    defaultUserName: 'سعید محمدی',
    defaultUserEmail: 's.mohammadi@steel-msc.ir',
    defaultPassword: 'finance@shipper123',
    descriptionFa: 'مدیر مالی سازمان با اختیار تایید صورتحساب‌ها، افزایش اعتبار و صدور تاییدیه‌های سفارشات با ارزش بالا.',
    hasApprovalLimit: false,
    defaultApprovalLimitToman: 0,
    locationScoped: false,
    defaultLocation: 'همه انبارها و کارخانجات',
    canManageUsers: false,
    canApproveContracts: true,
    canCreateOrders: false,
    canApproveHighValueOrders: true,
    canUploadPOD: false,
    canConfirmDispatch: false,
    canPayInvoices: true,
    canExportERP: true,
  },
  {
    id: 'shp-role-individual',
    role: 'Individual Shipper / Personal',
    titleFa: 'صاحب بار شخصی / حقیقی',
    titleEn: 'Individual Shipper / Personal',
    accessScopeFa: 'دسترسی کامل شخصی به ثبت سفارش، استعلام نرخ، قراردادها و تخفیف‌ها، امور مالی و تنظیمات اطلاع‌رسانی پیامک/ایمیل',
    dutiesFa: [
      'ثبت سفارش و استعلام فوری نرخ بارهای خرد و اثاثیه',
      'مشاهده قراردادها، تخفیف‌های وفاداری و باشگاه مشتریان خرد',
      'مشاهده صورتحساب‌ها، افزایش موجودی کیف‌پول و پرداخت آنلاین',
      'رهگیری لحظه‌ای محموله‌ها روی نقشه و دریافت مدارک تحویل',
      'تنظیمات پیشرفته اطلاع‌رسانی پیامک، ایمیل، کدهای رمز تحویل بار و هشدارهای راننده',
      'مشاهده گزارش‌ها، نمودارها و تحلیل مسیرهای ارسال بار',
    ],
    allowedTabs: [
      'dashboard',
      'quote',
      'batch_orders',
      'shipments',
      'support',
      'contracts',
      'billing',
      'master_data',
      'analytics',
      'notifications',
    ],
    levelBadge: 'صاحب بار حقیقی',
    departmentFa: 'پنل خدمات شخصی و بار خرد',
    defaultUserName: 'علی مرادی',
    defaultUserEmail: 'ali.moradi@gmail.com',
    defaultPassword: 'user@shipper123',
    descriptionFa: 'کاربر شخصی با دسترسی کامل به تمامی بخش‌های استعلام، ثبت سفارش، تخفیف‌ها، صورتحساب‌ها و گزارش‌های شخصی.',
    hasApprovalLimit: false,
    defaultApprovalLimitToman: 0,
    locationScoped: false,
    defaultLocation: 'آدرس‌های منتخب شخصی',
    canManageUsers: false,
    canApproveContracts: true,
    canCreateOrders: true,
    canApproveHighValueOrders: true,
    canUploadPOD: true,
    canConfirmDispatch: true,
    canPayInvoices: true,
    canExportERP: false,
  },
];

export function getShipperRoleDetail(role: string): ShipperRoleDetail {
  if (role?.includes('شخصی') || role?.includes('خرد') || role?.includes('حقیقی') || role === 'Individual Shipper / Personal') {
    const individualRole = SHIPPER_ROLE_DETAILS.find((r) => r.id === 'shp-role-individual');
    if (individualRole) return individualRole;
  }
  const found = SHIPPER_ROLE_DETAILS.find((r) => r.role === role || r.titleFa === role || r.titleEn === role);
  return found || SHIPPER_ROLE_DETAILS[0];
}

export function getShipperRoleById(id: string): ShipperRoleDetail {
  const found = SHIPPER_ROLE_DETAILS.find((r) => r.id === id);
  return found || SHIPPER_ROLE_DETAILS[0];
}
