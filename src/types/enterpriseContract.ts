/**
 * Enterprise Corporate Contract Management Types
 * Comprehensive 11-Section Schema for Freight & Logistics Organizations
 */

import { LifecycleStatus, VolumeBand } from './pricing';

// ================= 1. General Info (اطلاعات پایه قرارداد) =================
export type ContractType =
  | 'freight_transport'        // حمل‌ونقل باری
  | 'fleet_contracting'        // پیمانکاری ناوگان
  | 'vehicle_lease'            // اجاره وسیله نقلیه
  | 'logistics_services'       // خدمات لجستیک و انبارداری
  | 'intercompany_cooperation' // همکاری بین‌شرکتی
  | 'distribution_retail'      // توزیع مویرگی و پخش
  | 'transit_crossborder'      // ترانزیت بین‌المللی و کارنه تیر
  | 'bulk_hazardous_transport'; // حمل فله و مواد ویژه / خطرناک

export type EnterpriseContractStatus =
  | 'draft'          // پیش‌نویس
  | 'pending_sign'   // در انتظار امضا
  | 'active'         // فعال
  | 'expired'        // منقضی‌شده
  | 'terminated'     // فسخ‌شده
  | 'renewing';      // در حال تمدید

export type ContractCategory = 'domestic' | 'intercompany' | 'international';

export interface ContractGeneralInfo {
  contractId: string;         // یکتا و خودکار تولید شده (e.g. CNT-1405-PGPC-8801)
  contractNumber: string;     // شماره ثبت رسمی سازمانی (e.g. 1405/PG/992)
  title: string;              // عنوان قرارداد
  contractType: ContractType;
  status: EnterpriseContractStatus;
  category: ContractCategory;
  tags?: string[];
  summaryFa: string;
  departmentScope?: string;   // واحد سازمانی متولی
}

// ================= 2. Parties (طرفین قرارداد) =================
export type CounterpartyRole = 'contractor' | 'partner' | 'supplier' | 'enterprise_customer';

export interface PartyCompanyDetails {
  companyName: string;
  companyCode?: string;
  nationalId: string;         // شناسه ملی ۱۰ رقمی یا شماره ثبت
  economicCode?: string;      // کد اقتصادی ۱۲ رقمی
  address: string;
  phone: string;
  email?: string;
  postalCode?: string;
  provinceCity?: string;
  registrationNumber?: string;
}

export interface SignatoryRepresentative {
  fullName: string;
  position: string;           // سمت سازمانی (مدیرعامل، معاون بازرگانی، مدیر لجستیک)
  nationalCode: string;
  phone: string;
  email?: string;
  signatureStatus: 'signed' | 'pending' | 'rejected';
  signedAt?: string;
  digitalCertificateSerial?: string;
}

export interface ContractParties {
  counterparty: PartyCompanyDetails;
  counterpartySignatory: SignatoryRepresentative;
  internalSignatory: SignatoryRepresentative;
  counterpartyRole: CounterpartyRole;
  internalDepartment: string;
}

// ================= 3. Duration (بازه زمانی) =================
export interface ContractDuration {
  startDate: string;             // تاریخ شروع شمسی (e.g. ۱۴۰۵/۰۱/۰۱)
  endDate: string;               // تاریخ پایان شمسی (e.g. ۱۴۰۵/۱۲/۲۹)
  durationMonths: number;        // مدت اعتبار ماهانه (محاسبه خودکار)
  isAutoRenewable: boolean;      // قابلیت تمدید خودکار (بله/خیر)
  nonRenewalNoticeDays: number;  // مهلت اعلام عدم تمدید به روز (e.g. ۳۰ روز)
  expirationAlertDays: number;   // یادآور انقضا (چند روز قبل هشدار)
  lastRenewedDate?: string;
  renewalCount: number;
}

// ================= 4. Financial Terms (شرایط مالی) =================
export type PaymentMethod =
  | 'lump_sum'        // یکجا
  | 'installment'     // اقساطی
  | 'per_ton_km'      // بر اساس تناژ یا کیلومتر
  | 'percentage_cut'  // درصدی از تراکنش
  | 'monthly_fixed';  // ماهانه ثابت

export type ContractCurrency = 'IRT' | 'IRR' | 'USD' | 'EUR' | 'AED';

export interface InstallmentItem {
  id: string;
  installmentNumber: number;
  titleFa: string;
  amountToman: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: string;
  trackingNumber?: string;
  notes?: string;
}

export interface FinancialTerms {
  totalAmountToman: number;
  currency: ContractCurrency;
  paymentMethod: PaymentMethod;
  installments: InstallmentItem[];
  agreedCommissionPercent?: number;       // کمیسیون یا تعرفه توافقی
  latePaymentPenaltyPercentPerDay: number; // جریمه تأخیر در پرداخت (درصد روزانه)
  priceAdjustmentClause: string;          // شرایط تعدیل قیمت (سوخت، تورم، شاخص حمل)
  advancePaymentToman?: number;           // پیش‌پرداخت اولیه
  guaranteeDepositToman?: number;         // سپرده حسن انجام تعهدات
  guaranteeType?: 'bank_guarantee' | 'promissory_note' | 'cheque' | 'cash';
  guaranteeDocNumber?: string;
}

// ================= 5. Scope of Service (محدوده خدمات) =================
export interface ServiceSLA {
  onTimeDeliveryPercent: number;        // درصد تحویل به‌موقع SLA (e.g. 98.5%)
  damageFreePercent: number;            // درصد مرسولات سالم و بدون کسری (e.g. 99.8%)
  dispatchResponseTimeMinutes: number;  // زمان پاسخگویی دیسپاچینگ و اعزام (دقیقه)
  maxUnloadingDelayHours: number;       // حداکثر زمان مجاز تخلیه/بارگیری قبل از دموراژ
  trackingAvailability: string;         // پوشش ردگیری آنلاین و دیتالاگر
}

export interface ScopeOfService {
  description: string;                  // شرح کامل خدمات و تعهدات هر طرف
  coveredRoutesOrZones: string[];       // مسیرها یا مناطق تحت پوشش جغرافیایی
  allowedCommodityTypes: string[];      // نوع بار و محموله مجاز
  allocatedFleetCapacity: {             // ظرفیت یا تعداد ناوگان اختصاص‌یافته
    truckCount: number;
    vehicleTypes: string[];
    monthlyMinTonnage: number;
  };
  sla: ServiceSLA;
}

// ================= 6. Obligations & Liability (تعهدات و مسئولیت‌ها) =================
export interface LiabilityInsuranceInfo {
  policyNumber: string;
  insurerName: string;
  coverageAmountToman: number;
  expiryDate: string;
  status: 'active' | 'expired' | 'pending';
  coverageTypeFa: string;
}

export interface ContractObligations {
  firstPartyObligations: string[];     // تعهدات طرف اول (سازمان ما / کارفرما)
  secondPartyObligations: string[];    // تعهدات طرف دوم (پیمانکار / مشتری)
  liabilityInsurance: LiabilityInsuranceInfo;
  indemnityConditions: string;         // شرایط جبران خسارت
  liabilityCapToman: number;           // سقف مسئولیت و حداکثر خسارت قابل مطالبه
}

// ================= 7. Termination Clauses (شرایط فسخ) =================
export interface TerminationClauses {
  unilateralTerminationAllowed: boolean; // شرایط فسخ یکطرفه
  unilateralNoticePeriodDays: number;    // مهلت اطلاع کتبی قبل از فسخ
  earlyTerminationPenaltyToman: number;  // جریمه فسخ زودهنگام
  immediateTerminationTriggers: string[]; // دلایل فسخ فوری (نقض تعهد، ورشکستگی و...)
}

// ================= 8. Documents & Attachments (اسناد و پیوست‌ها) =================
export interface ContractDocumentAttachment {
  id: string;
  title: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'image' | 'xlsx';
  fileSizeMb: number;
  uploadDate: string;
  isMainContract: boolean;
  uploadedBy: string;
  downloadUrl?: string;
  signatureVerified: boolean;
}

export interface ContractVersionHistory {
  version: number;
  date: string;
  modifiedBy: string;
  changeSummaryFa: string;
  documentRefId?: string;
}

export interface ContractAmendment {
  id: string;
  amendmentNumber: string;
  title: string;
  approvalDate: string;
  effectiveDate: string;
  summaryFa: string;
  financialImpactToman?: number;
  status: 'approved' | 'in_review' | 'draft';
  fileRef?: string;
}

export interface ContractDocuments {
  mainContractFile?: ContractDocumentAttachment;
  technicalAttachments: ContractDocumentAttachment[];
  versionHistory: ContractVersionHistory[];
  amendments: ContractAmendment[];
}

// ================= 9. Legal & Compliance (وضعیت حقوقی و انطباق) =================
export interface LegalDepartmentApproval {
  status: 'approved' | 'conditional' | 'pending' | 'rejected';
  approvedByLegalOfficer?: string;
  approvalDate?: string;
  notesFa?: string;
}

export interface LegalCompliance {
  governingLaw: string;                  // قانون حاکم بر قرارداد (صلاحیت قضایی)
  disputeResolutionForum: 'arbitration' | 'court' | 'expert_panel'; // مرجع حل اختلاف
  arbitrationCenterName: string;         // مرکز داوری اتاق بازرگانی / شورای حل اختلاف
  legalDepartmentApproval: LegalDepartmentApproval;
  officialRegistrationNumber?: string;   // شماره ثبت رسمی در سامانه دولتی / راهداری
}

// ================= 10. System Relations (ارتباط با سایر بخش‌ها) =================
export interface LinkedFleetDriver {
  driverId: string;
  driverName: string;
  plateNumber: string;
  vehicleType: string;
  smartCardNo: string;
  assignedDate: string;
  status: 'active' | 'standby' | 'released';
}

export interface LinkedInvoiceTransaction {
  invoiceId: string;
  invoiceNumber: string;
  amountToman: number;
  issueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  descriptionFa: string;
}

export interface PerformanceKpiReport {
  totalShipmentsCompleted: number;
  onTimeDeliveryRate: number;      // e.g. 98.2%
  damageClaimsCount: number;
  customerSatisfactionScore: number; // e.g. 4.9 out of 5.0
  activeDisputesCount: number;
  totalTonnageHauled: number;
}

export interface ActivityNote {
  id: string;
  authorName: string;
  authorRole: string;
  date: string;
  contentFa: string;
  category: 'operational' | 'financial' | 'legal' | 'general';
}

export interface SystemRelations {
  linkedFleetDrivers: LinkedFleetDriver[];
  linkedInvoices: LinkedInvoiceTransaction[];
  performanceReport: PerformanceKpiReport;
  activityNotes: ActivityNote[];
}

// ================= 11. Management & Audit Fields (متادیتای مدیریتی) =================
export type ConfidentialityLevel = 'internal_public' | 'confidential' | 'top_secret_c_level';

export interface AuditTrailLog {
  timestamp: string;
  user: string;
  action: string;
  detailsFa: string;
}

export interface ContractAuditFields {
  createdBy: string;
  createdAt: string;
  lastModifiedBy: string;
  lastModifiedAt: string;
  confidentialityLevel: ConfidentialityLevel;
  auditTrail: AuditTrailLog[];
}

// ================= Complete Enterprise Corporate Contract Master Record =================
export interface EnterpriseCorporateContract {
  id: string;                               // Unique ID for state
  contractId: string;                       // Primary unique business code
  displayId: string;                        // Short badge code (e.g. CT-330)
  
  // Section 1: General Info
  generalInfo: ContractGeneralInfo;
  
  // Section 2: Parties
  parties: ContractParties;
  
  // Section 3: Duration
  duration: ContractDuration;
  
  // Section 4: Financial Terms
  financialTerms: FinancialTerms;
  
  // Section 5: Scope of Service
  scopeOfService: ScopeOfService;
  
  // Section 6: Obligations & Liability
  obligations: ContractObligations;
  
  // Section 7: Termination Clauses
  terminationClauses: TerminationClauses;
  
  // Section 8: Documents & Attachments
  documents: ContractDocuments;
  
  // Section 9: Legal & Compliance
  legalCompliance: LegalCompliance;
  
  // Section 10: System Relations
  systemRelations: SystemRelations;
  
  // Section 11: Management & Audit Fields
  auditFields: ContractAuditFields;

  // Compatibility with Pricing OS Volume Bands & Overrides
  volumeBands?: VolumeBand[];
  negotiatedBaseOverrides?: Record<string, number>;
  fuelIndexAbsorptionPercent?: number;
  minimumCommitmentTons?: number;
  penaltyClausePerTonShortfallToman?: number;
  customerNameFa?: string;
  customerNameEn?: string;
  customerCode?: string;
  industry?: string;
  tier?: 'Platinum' | 'Gold' | 'Silver' | 'Standard' | 'Diamond';
  effectiveFrom?: string;
  effectiveTo?: string;
  status?: string;
  version?: number;
}
