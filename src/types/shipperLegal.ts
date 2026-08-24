import { SavedLocation, SavedCommodity } from '../data/mockShipperData';

export type ShipperEntityType = 'corporate' | 'individual';

export interface ShipperHubLocation {
  id: string;
  name: string; // نام انبار یا کارخانه
  city: string; // شهر
  province: string; // استان
  address: string; // آدرس دقیق
  postalCode?: string; // کد پستی
  latitude?: number; // مختصات GPS
  longitude?: number; // مختصات GPS
  contactName: string; // نام مسئول انبار
  contactPhone: string; // شماره تماس مسئول انبار
  isDefaultOrigin?: boolean;
  isDefaultDest?: boolean;
}

export interface ShipperCreditTermsRequest {
  requestedType: 'prepaid' | 'credit_30' | 'credit_45' | 'credit_60' | 'promissory_check';
  requestedLimitToman: number; // سقف اعتبار درخواستی (تومان)
  settlementPeriodDays: number; // دوره تسویه (مثلا ۳۰ روزه)
  guaranteeType: 'promissory_note' | 'bank_guarantee' | 'corporate_check' | 'cash_deposit'; // نوع تضمین
  status: 'draft' | 'pending_review' | 'approved' | 'rejected';
  approvedLimitToman?: number;
  requestNotes?: string;
  requestedAt?: string;
  reviewNotes?: string;
}

export interface UploadedDocFile {
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  status: 'uploaded' | 'verified' | 'pending';
  previewUrl?: string;
}

/**
 * پرونده حقوقی شرکت‌ها و سازمان‌ها (اشخاص حقوقی)
 */
export interface ShipperLegalDossier {
  // ۱. اطلاعات حقوقی شرکت (طبق روزنامه رسمی)
  companyLegalName: string; // نام کامل شرکت (طبق روزنامه رسمی)
  nationalId: string; // شناسه ملی شرکت (۱۱ رقمی)
  economicCode: string; // کد اقتصادی (۱۲ رقمی)
  registrationNumber: string; // شماره ثبت شرکت
  registrationPlace?: string; // محل ثبت شرکت
  establishmentDate?: string; // تاریخ تاسیس

  // اطلاعات رابط / نماینده اصلی
  representativeName: string; // نام و نام خانوادگی مسئول ثبت سفارش یا مدیر لجستیک
  representativeRole?: string; // سمت نماینده
  representativeMobile: string; // شماره موبایل (جهت دریافت پیامک تایید و اعلانات بار)
  representativeEmail: string; // ایمیل سازمانی (جهت ارسال فاکتورها و کوتیشن‌ها)
  nationalCodeRepresentative?: string; // کد ملی نماینده

  // ۲. مدارک قانونی و مالی برای صدور فاکتور رسمی
  vatTaxCertificateNumber?: string; // شماره گواهی ثبت‌نام مالیات بر ارزش افزوده
  vatTaxExpiryDate?: string; // تاریخ اعتبار گواهی ارزش افزوده
  hasVatCertificate: boolean; // آیا گواهی ارزش افزوده دارد؟
  headquartersAddress: string; // آدرس دقیق دفتر مرکزی
  postalCode: string; // کد پستی ۱۰ رقمی
  phoneLandline: string; // شماره تلفن ثابت دفتر مرکزی (همراه با پیش‌شماره)
  bankShaba: string; // شماره شبای بانکی حقوقی (برای استرداد وجه و مبادلات مالی)
  bankName?: string; // نام بانک
  bankAccountNumber?: string; // شماره حساب

  // فایل‌ها و مدارک آپلود شده (تصویر / PDF)
  officialGazetteDoc?: UploadedDocFile; // تصویر روزنامه رسمی یا آگهی آخرین تغییرات
  ceoNationalCardDoc?: UploadedDocFile; // کارت ملی مدیرعامل یا نماینده معرفی‌شده
  vatDoc?: UploadedDocFile; // گواهی ارزش افزوده

  // ۳. تنظیمات عملیاتی و پروفایل لجستیکی (اختیاری جهت شخصی‌سازی دقیق‌تر نرخ‌ها)
  hubs: ShipperHubLocation[]; // مراکز و انبارهای اصلی با مختصات و مسئول
  commonProductTypes: string[]; // نوع محصولات تولیدی یا بارهای متداول (مواد شیمیایی، قطعات صنعتی، مواد غذایی و...)
  standardPackagingTypes: string[]; // نوع بسته‌بندی‌های استاندارد (پالت، بشکه، فله، کانتینر و...)
  creditTermsRequest?: ShipperCreditTermsRequest; // درخواست شرایط اعتباری و سقف اعتبار

  // متادیتا وضعیت تکمیل اطلاعات
  isProfileComplete: boolean; // آیا اطلاعات الزامی پایه و مالی تکمیل شده است؟
  lastUpdatedAt?: string;
  updatedBy?: string;
}

/**
 * پرونده احراز هویت اشخاص حقیقی (صاحبان بار شخصی و خرده‌بار)
 */
export interface ShipperIndividualProfile {
  // ۱. مدارک و اطلاعات ضروری احراز هویت (حداقلی)
  fullName: string; // نام و نام خانوادگی کامل شخص
  nationalCode: string; // کد ملی ۱۰ رقمی (تطبیق هویت و صدور بارنامه)
  mobileNumber: string; // شماره موبایل به نام شخص (استعلام تطبیق شاهکار)
  birthDate: string; // تاریخ تولد دقیق (روز/ماه/سال جهت استعلام ثبت احوال و شاهکار)
  nationalCardDoc?: UploadedDocFile; // تصویر روی کارت ملی هوشمند یا شناسنامه جدید

  // ۲. اطلاعات اختیاری یا تکمیلی (حسب نیاز بارهای با ارزش بالا، اعتباری یا فاکتور)
  selfieVerificationDoc?: UploadedDocFile; // تصویر سلفی همراه با کارت ملی (Liveness Detection برای بارهای با ارزش بالا)
  bankCardNumber?: string; // شماره کارت بانکی ۱۶ رقمی به نام شخص
  bankShaba?: string; // شماره شبای بانکی به نام شخص (IR...) برای استرداد وجه و کیف‌پول
  bankName?: string; // نام بانک عامل
  residentialAddress?: string; // آدرس دقیق محل سکونت / بارگیری شخصی
  postalCode?: string; // کد پستی ۱۰ رقمی
  hubs?: ShipperHubLocation[]; // مراکز و انبارهای بارگیری شخصی

  // وضعیت‌های استعلام قانونی سامانه‌های حاکمیتی
  shahkarVerified?: boolean; // تایید تطبیق کدملی با شماره موبایل در شاهکار
  sabtAhvalVerified?: boolean; // تایید اصالت کدملی و تاریخ تولد در ثبت احوال
  livenessVerified?: boolean; // تایید تطبیق چهره سلفی با کارت ملی

  // وضعیت تکمیل
  isComplete: boolean;
  lastUpdatedAt?: string;
}

/**
 * بررسی تکمیل بودن پرونده شخص حقیقی (بار شخصی)
 * موارد ضروری:
 * ۱. کد ملی (۱۰ رقم معتبر)
 * ۲. شماره موبایل (۱۱ رقم)
 * ۳. تاریخ تولد (معتبر)
 * ۴. آپلود تصویر کارت ملی
 */
export function checkIndividualProfileCompleteness(profile?: Partial<ShipperIndividualProfile>): {
  isComplete: boolean;
  missingFields: string[];
  completionPercentage: number;
} {
  if (!profile) {
    return {
      isComplete: false,
      missingFields: [
        'نام و نام خانوادگی',
        'کد ملی ۱۰ رقمی',
        'شماره موبایل به نام شخص (شاهکار)',
        'تاریخ تولد',
        'تصویر کارت ملی (یا شناسنامه جدید)',
      ],
      completionPercentage: 0,
    };
  }

  const checks: { key: string; label: string; valid: boolean; isOptional?: boolean }[] = [
    { key: 'fullName', label: 'نام و نام خانوادگی', valid: Boolean(profile.fullName && profile.fullName.trim().length >= 3) },
    { key: 'nationalCode', label: 'کد ملی ۱۰ رقمی معتبر', valid: Boolean(profile.nationalCode && profile.nationalCode.trim().length === 10) },
    { key: 'mobileNumber', label: 'شماره موبایل به نام شخص (تطبیق شاهکار)', valid: Boolean(profile.mobileNumber && profile.mobileNumber.trim().length >= 10) },
    { key: 'birthDate', label: 'تاریخ تولد (استعلام ثبت‌احوال)', valid: Boolean(profile.birthDate && profile.birthDate.trim().length >= 6) },
    { key: 'nationalCardDoc', label: 'تصویر کارت ملی هوشمند', valid: Boolean(profile.nationalCardDoc?.fileName) },
  ];

  const mandatoryMissing = checks.filter((c) => !c.valid).map((c) => c.label);
  const passedCount = checks.filter((c) => c.valid).length;
  const percentage = Math.round((passedCount / checks.length) * 100);

  return {
    isComplete: mandatoryMissing.length === 0,
    missingFields: mandatoryMissing,
    completionPercentage: percentage,
  };
}

/**
 * بررسی اینکه آیا پروفایل قانونی و مالی شرکت (حقوقی) برای ثبت بار تکمیل است یا خیر
 */
export function checkCorporateProfileCompleteness(dossier?: Partial<ShipperLegalDossier>): {
  isComplete: boolean;
  missingFields: string[];
  completionPercentage: number;
} {
  if (!dossier) {
    return {
      isComplete: false,
      missingFields: [
        'نام کامل شرکت (طبق روزنامه رسمی)',
        'شناسه ملی شرکت (۱۱ رقم)',
        'کد اقتصادی شرکت',
        'شماره ثبت شرکت',
        'نام رابط اصلی شرکت',
        'شماره موبایل رابط',
        'ایمیل سازمانی شرکت',
        'آدرس دفتر مرکزی',
        'کد پستی ۱۰ رقمی',
        'تلفن ثابت دفتر مرکزی',
        'شماره شبای حقوقی شرکت (IR)',
      ],
      completionPercentage: 0,
    };
  }

  const checks: { key: string; label: string; valid: boolean }[] = [
    { key: 'companyLegalName', label: 'نام کامل شرکت (روزنامه رسمی)', valid: Boolean(dossier.companyLegalName && dossier.companyLegalName.trim().length >= 3) },
    { key: 'nationalId', label: 'شناسه ملی شرکت (۱۱ رقمی)', valid: Boolean(dossier.nationalId && dossier.nationalId.trim().length >= 10) },
    { key: 'economicCode', label: 'کد اقتصادی شرکت', valid: Boolean(dossier.economicCode && dossier.economicCode.trim().length >= 8) },
    { key: 'registrationNumber', label: 'شماره ثبت شرکت', valid: Boolean(dossier.registrationNumber && dossier.registrationNumber.trim().length >= 2) },
    { key: 'representativeName', label: 'نام و نام خانوادگی رابط/نماینده', valid: Boolean(dossier.representativeName && dossier.representativeName.trim().length >= 3) },
    { key: 'representativeMobile', label: 'شماره موبایل رابط', valid: Boolean(dossier.representativeMobile && dossier.representativeMobile.trim().length >= 10) },
    { key: 'representativeEmail', label: 'ایمیل سازمانی', valid: Boolean(dossier.representativeEmail && dossier.representativeEmail.includes('@')) },
    { key: 'headquartersAddress', label: 'آدرس دقیق دفتر مرکزی', valid: Boolean(dossier.headquartersAddress && dossier.headquartersAddress.trim().length >= 10) },
    { key: 'postalCode', label: 'کد پستی ۱۰ رقمی', valid: Boolean(dossier.postalCode && dossier.postalCode.trim().length >= 10) },
    { key: 'phoneLandline', label: 'تلفن ثابت دفتر مرکزی', valid: Boolean(dossier.phoneLandline && dossier.phoneLandline.trim().length >= 7) },
    { key: 'bankShaba', label: 'شماره شبای بانکی حقوقی (IR)', valid: Boolean(dossier.bankShaba && dossier.bankShaba.trim().length >= 16) },
  ];

  const missing = checks.filter((c) => !c.valid).map((c) => c.label);
  const passedCount = checks.filter((c) => c.valid).length;
  const percentage = Math.round((passedCount / checks.length) * 100);

  return {
    isComplete: missing.length === 0,
    missingFields: missing,
    completionPercentage: percentage,
  };
}

/**
 * متد جامع بررسی وضعیت صاحب بار (اعم از حقیقی یا حقوقی)
 */
export function checkShipperProfileCompleteness(
  dossierOrProfile?: Partial<ShipperLegalDossier> | Partial<ShipperIndividualProfile>,
  entityType: ShipperEntityType = 'corporate'
): {
  isComplete: boolean;
  missingFields: string[];
  completionPercentage: number;
} {
  if (entityType === 'individual') {
    return checkIndividualProfileCompleteness(dossierOrProfile as Partial<ShipperIndividualProfile>);
  }
  return checkCorporateProfileCompleteness(dossierOrProfile as Partial<ShipperLegalDossier>);
}
