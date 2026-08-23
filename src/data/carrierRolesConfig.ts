import { UserRole, RBACRoleDefinition } from '../types/pricing';

export interface CarrierRoleDetail {
  id: string;
  role: UserRole;
  titleFa: string;
  titleEn: string;
  category: 'primary' | 'secondary';
  isMandatory: boolean;
  accessScopeFa: string;
  dutiesFa: string[];
  departmentFa: string;
  levelBadge: string;
  defaultUserName: string;
  defaultUserEmail: string;
  defaultPassword?: string;
  allowedModules: string[];
  canApproveDeployment: boolean;
  canEditRules: boolean;
  canManageFleet: boolean;
  canManageFinance: boolean;
  canIssueQuotes: boolean;
  isReadOnly: boolean;
  descriptionFa: string;
}

export const CARRIER_ROLE_DETAILS: CarrierRoleDetail[] = [
  // ===================== ۱. نقش‌های اصلی (Primary Roles) =====================
  {
    id: 'role-system-admin',
    role: 'System Admin / Fleet Director',
    titleFa: 'مدیر ارشد / مدیر سیستم',
    titleEn: 'System Admin / Fleet Director',
    category: 'primary',
    isMandatory: true,
    accessScopeFa: 'کامل به تمام بخش‌ها (Full Access)',
    dutiesFa: [
      'تعریف کاربران جدید و مدیریت سطوح دسترسی',
      'تنظیمات ساختاری و پیکربندی جامع سیستم',
      'مشاهده گزارش‌های کلان مالی، تحلیلی و مدیریتی',
      'تایید نهایی قراردادها و تغییر قوانین کلیدی قیمت‌گذاری',
    ],
    departmentFa: 'مدیریت ارشد و راهبری زیرساخت',
    levelBadge: 'سطح ۱ - دسترسی کامل',
    defaultUserName: 'مهندس محمدرضا شایگان (مدیر ارشد سیستم)',
    defaultUserEmail: 'admin@carrier-logistics.ir',
    defaultPassword: 'admin@pass123',
    allowedModules: [
      'schema_builder',
      'geo_matrix',
      'rules_engine',
      'contracts_discounts',
      'validation_lab',
      'control_tower',
      'live_ops',
      'financials',
      'system_settings',
    ],
    canApproveDeployment: true,
    canEditRules: true,
    canManageFleet: true,
    canManageFinance: true,
    canIssueQuotes: true,
    isReadOnly: false,
    descriptionFa: 'دسترسی کامل به تمام بخش‌ها، تعریف کاربران جدید، تنظیمات ساختاری، تایید نهایی قراردادها و قوانین قیمت‌گذاری.',
  },
  {
    id: 'role-pricing-yield-manager',
    role: 'Pricing & Yield Manager',
    titleFa: 'مدیر / کارشناس قیمت‌گذاری',
    titleEn: 'Pricing & Yield Manager',
    category: 'primary',
    isMandatory: true,
    accessScopeFa: 'بخش قواعد قیمت‌گذاری، ماتریس‌های هزینه، نرخ‌های پایه و تخفیف‌ها',
    dutiesFa: [
      'به‌روزرسانی ماتریس قیمت‌ها بر اساس روش حمل (جاده‌ای، ریلی و...)',
      'تنظیم نرخ سوخت، عوارض و جریمه‌های تاخیر بارگیری',
      'تعریف فرمول‌های تخفیف یا استراتژی‌های فصلی و بازگشت بار',
    ],
    departmentFa: 'معاونت بازرگانی و مدیریت درآمد (Yield Management)',
    levelBadge: 'سطح ۲ - تخصصی تعرفه',
    defaultUserName: 'سارا رضایی (مدیر ارشد قیمت‌گذاری)',
    defaultUserEmail: 'pricing@carrier-logistics.ir',
    defaultPassword: 'pricing@pass123',
    allowedModules: [
      'schema_builder',
      'geo_matrix',
      'rules_engine',
      'contracts_discounts',
      'validation_lab',
      'control_tower',
    ],
    canApproveDeployment: false, // Maker
    canEditRules: true,
    canManageFleet: false,
    canManageFinance: false,
    canIssueQuotes: true,
    isReadOnly: false,
    descriptionFa: 'دسترسی به بخش قواعد قیمت‌گذاری، ماتریس‌های هزینه، نرخ‌های پایه و تخفیف‌ها جهت به‌روزرسانی و تدوین استراتژی‌ها.',
  },
  {
    id: 'role-dispatcher-operations',
    role: 'Dispatcher / Operations Specialist',
    titleFa: 'متصدی عملیات / دیسپچر',
    titleEn: 'Dispatcher / Operations Specialist',
    category: 'primary',
    isMandatory: true,
    accessScopeFa: 'مدیریت بارها، ناوگان، رانندگان و نقشه زنده',
    dutiesFa: [
      'تخصیص ناوگان و راننده به بارهای ثبت‌شده در سیستم',
      'مدیریت زمان‌بندی حرکت و رهگیری لحظه‌ای محموله‌ها',
      'حل چالش‌های عملیاتی مسیر و به‌روزرسانی وضعیت بارنامه‌ها',
    ],
    departmentFa: 'واحد عملیات و دیسپچینگ ناوگان',
    levelBadge: 'سطح ۳ - عملیات و ناوبری',
    defaultUserName: 'مهندس بهزاد صادقی (سرپرست دیسپچینگ و ناوگان)',
    defaultUserEmail: 'dispatch@carrier-logistics.ir',
    defaultPassword: 'dispatch@pass123',
    allowedModules: [
      'geo_matrix',
      'live_ops',
      'validation_lab',
    ],
    canApproveDeployment: false,
    canEditRules: false,
    canManageFleet: true,
    canManageFinance: false,
    canIssueQuotes: false,
    isReadOnly: false,
    descriptionFa: 'دسترسی به مدیریت بارها، ناوگان، رانندگان و نقشه زنده جهت تخصیص خودرو، زمان‌بندی و پایش بارها.',
  },
  {
    id: 'role-sales-customer-support',
    role: 'Sales & Customer Support',
    titleFa: 'کارشناس فروش / امور مشتریان',
    titleEn: 'Sales & Customer Support',
    category: 'primary',
    isMandatory: true,
    accessScopeFa: 'ثبت استعلام، صدور پیش‌فاکتور، استثنائات قیمت‌گذاری و تیکت‌ها',
    dutiesFa: [
      'ثبت بارهای دستی برای مشتریان تلفنی و حضوری',
      'صدور کوتیشن (Quote) سفارشی و پیش‌فاکتور رسمی',
      'پاسخگویی به پیگیری‌های صاحبان بار و حل مغایرت‌های استعلام',
    ],
    departmentFa: 'مدیریت فروش، بازاریابی و امور مشتریان',
    levelBadge: 'سطح ۴ - فروش و پشتیبانی',
    defaultUserName: 'مریم عباسی (کارشناس ارشد فروش و امور مشتریان)',
    defaultUserEmail: 'sales@carrier-logistics.ir',
    defaultPassword: 'sales@pass123',
    allowedModules: [
      'contracts_discounts',
      'validation_lab',
      'system_settings',
    ],
    canApproveDeployment: false,
    canEditRules: false,
    canManageFleet: false,
    canManageFinance: false,
    canIssueQuotes: true,
    isReadOnly: false,
    descriptionFa: 'دسترسی به ثبت استعلام، صدور پیش‌فاکتور، استثنائات قیمت‌گذاری و تیکت‌های پشتیبانی صاحبان کالا.',
  },
  {
    id: 'role-finance-billing',
    role: 'Finance & Billing Specialist',
    titleFa: 'کارشناس مالی و حسابداری',
    titleEn: 'Finance & Billing Specialist',
    category: 'primary',
    isMandatory: true,
    accessScopeFa: 'صورتحساب‌ها، صورت‌وضعیت مالی رانندگان، درگاه پرداخت و تسویه‌ها',
    dutiesFa: [
      'صدور فاکتورهای رسمی و صورتحساب‌های الکترونیکی سامانه مودیان',
      'بررسی و تطبیق پرداخت‌های صاحبان بار و وصول مطالبات',
      'ثبت هزینه‌های عملیاتی و مدیریت تسویه‌حساب با رانندگان یا پیمانکاران حمل',
    ],
    departmentFa: 'معاونت مالی، حسابداری و خزانه‌داری',
    levelBadge: 'سطح ۵ - مالی و حسابداری',
    defaultUserName: 'دکتر علی بهرامی (معاونت مالی و حسابداری)',
    defaultUserEmail: 'finance@carrier-logistics.ir',
    defaultPassword: 'finance@pass123',
    allowedModules: [
      'financials',
      'contracts_discounts',
      'control_tower',
      'validation_lab',
    ],
    canApproveDeployment: true, // Approver for financial impact
    canEditRules: false,
    canManageFleet: false,
    canManageFinance: true,
    canIssueQuotes: false,
    isReadOnly: false,
    descriptionFa: 'دسترسی به صورتحساب‌ها، صورت‌وضعیت مالی رانندگان، درگاه پرداخت و تسویه‌ها جهت مدیریت اسناد مالی.',
  },

  // ===================== ۲. نقش‌های خاص یا ثانویه (اختیاری بر اساس اندازه شرکت) =====================
  {
    id: 'role-fleet-safety-manager',
    role: 'Fleet & Safety Manager',
    titleFa: 'مدیر ناوگان و ایمنی',
    titleEn: 'Fleet & Safety Manager',
    category: 'secondary',
    isMandatory: false,
    accessScopeFa: 'کنترل مدارک رانندگان، معاینه فنی، بیمه‌نامه‌ها و استهلاک خودروها',
    dutiesFa: [
      'کنترل مدارک و گواهینامه‌های رانندگان و کارت هوشمند ناوگان',
      'پایش معاینه فنی، تاریخ انقضای بیمه‌نامه‌های شخص ثالث و باربری',
      'ثبت سوابق تعمیرات، نگهداری دوره‌ای و استهلاک انواع خودروها',
    ],
    departmentFa: 'واحد ایمنی، ترابری و نگهداری ناوگان (اختیاری)',
    levelBadge: 'نقش ثانویه - ایمنی و ناوگان',
    defaultUserName: 'مهندس کامران رستمی (مدیر ایمنی و ناوگان)',
    defaultUserEmail: 'safety@carrier-logistics.ir',
    defaultPassword: 'safety@pass123',
    allowedModules: [
      'geo_matrix',
      'live_ops',
      'system_settings',
    ],
    canApproveDeployment: false,
    canEditRules: false,
    canManageFleet: true,
    canManageFinance: false,
    canIssueQuotes: false,
    isReadOnly: false,
    descriptionFa: 'نقش ثانویه و اختیاری جهت کنترل مدارک رانندگان، معاینه فنی، بیمه‌نامه‌ها، ایمنی و استهلاک خودروها.',
  },
  {
    id: 'role-auditor-readonly',
    role: 'Auditor / Read-Only',
    titleFa: 'بازرس کیفیت / حسابرس',
    titleEn: 'Auditor / Read-Only',
    category: 'secondary',
    isMandatory: false,
    accessScopeFa: 'دسترسی فقط‌خواندنی به گزارش‌ها و تراکنش‌ها جهت نظارت‌های قانونی یا ممیزی‌های داخلی بدون امکان تغییر داده',
    dutiesFa: [
      'دسترسی فقط‌خواندنی به کلیه گزارش‌ها، لاگ‌های سیستمی و تراکنش‌ها',
      'انجام نظارت‌های قانونی، بازرسی تطبیق مقررات و ممیزی‌های داخلی',
      'تضمین سلامت داده‌ها بدون داشتن امکان دستکاری یا تغییر اطلاعات',
    ],
    departmentFa: 'کمیته بازرسی، ممیزی و حسابرسی داخلی (اختیاری)',
    levelBadge: 'نقش ثانویه - فقط خواندنی (Read-Only)',
    defaultUserName: 'امیرحسین ثانی‌خانی (حسابرس مستقل کیفیت و داده)',
    defaultUserEmail: 'auditor@carrier-logistics.ir',
    defaultPassword: 'auditor@pass123',
    allowedModules: [
      'schema_builder',
      'geo_matrix',
      'rules_engine',
      'contracts_discounts',
      'validation_lab',
      'control_tower',
      'live_ops',
      'financials',
      'system_settings',
    ],
    canApproveDeployment: false,
    canEditRules: false,
    canManageFleet: false,
    canManageFinance: false,
    canIssueQuotes: false,
    isReadOnly: true,
    descriptionFa: 'نقش ثانویه و اختیاری با دسترسی فقط‌خواندنی به گزارش‌ها و تراکنش‌ها برای نظارت‌های قانونی و ممیزی‌های داخلی.',
  },
];

/**
 * Helper to convert details into RBACRoleDefinition items
 */
export const CONVERTED_RBAC_ROLES: RBACRoleDefinition[] = CARRIER_ROLE_DETAILS.map((r) => ({
  id: r.id,
  role: r.role,
  roleNameFa: r.titleFa,
  roleNameEn: r.titleEn,
  titleFa: r.titleFa,
  titleEn: r.titleEn,
  departmentFa: r.departmentFa,
  levelBadge: r.levelBadge,
  userCount: r.category === 'primary' ? 3 : 1,
  allowedModules: r.allowedModules,
  canApproveDeployment: r.canApproveDeployment,
  descriptionFa: r.descriptionFa,
  category: r.category,
  isMandatory: r.isMandatory,
  accessScopeFa: r.accessScopeFa,
  dutiesFa: r.dutiesFa,
  permissions: [
    {
      module: 'pricing_studio',
      moduleNameFa: 'استودیو طراحی تعرفه و قوانین',
      canRead: true,
      canWrite: r.canEditRules,
      canApprove: r.canApproveDeployment,
      canPublish: r.canApproveDeployment,
      canRollback: r.canApproveDeployment,
    },
    {
      module: 'contract_studio',
      moduleNameFa: 'دفترچه‌های قیمت و قراردادها',
      canRead: true,
      canWrite: r.canEditRules || r.canIssueQuotes,
      canApprove: r.canApproveDeployment,
      canPublish: false,
      canRollback: false,
    },
    {
      module: 'validation_lab',
      moduleNameFa: 'آزمایشگاه شبیه‌سازی و استعلام',
      canRead: true,
      canWrite: !r.isReadOnly,
      canApprove: false,
      canPublish: false,
      canRollback: false,
    },
    {
      module: 'control_tower',
      moduleNameFa: 'برج مراقبت و حاکمیت سازمانی',
      canRead: true,
      canWrite: r.canApproveDeployment,
      canApprove: r.canApproveDeployment,
      canPublish: r.canApproveDeployment,
      canRollback: r.canApproveDeployment,
    },
    {
      module: 'live_ops',
      moduleNameFa: 'دیسپچینگ، رانندگان و نقشه زنده',
      canRead: true,
      canWrite: r.canManageFleet,
      canApprove: false,
      canPublish: false,
      canRollback: false,
    },
    {
      module: 'financials',
      moduleNameFa: 'امور مالی، صورتحساب و تسویه رانندگان',
      canRead: true,
      canWrite: r.canManageFinance,
      canApprove: r.canManageFinance,
      canPublish: false,
      canRollback: false,
    },
    {
      module: 'system_settings',
      moduleNameFa: 'تنظیمات ساختاری و کاربران',
      canRead: true,
      canWrite: r.role === 'System Admin / Fleet Director',
      canApprove: r.role === 'System Admin / Fleet Director',
      canPublish: r.role === 'System Admin / Fleet Director',
      canRollback: r.role === 'System Admin / Fleet Director',
    },
  ],
}));

export const getRoleDetail = (role: UserRole | string): CarrierRoleDetail => {
  const found = CARRIER_ROLE_DETAILS.find((r) => r.role === role || r.titleEn === role || r.titleFa === role);
  if (found) return found;

  // Aliases for legacy strings
  if (role === 'Pricing Strategist') return CARRIER_ROLE_DETAILS[1];
  if (role === 'Finance Controller' || role === 'Governance Approver') return CARRIER_ROLE_DETAILS[4];
  if (role === 'Commercial Manager' || role === 'Contract Manager') return CARRIER_ROLE_DETAILS[1];
  if (role === 'Key Account Manager') return CARRIER_ROLE_DETAILS[3];
  if (role === 'System Admin') return CARRIER_ROLE_DETAILS[0];

  return CARRIER_ROLE_DETAILS[0];
};
