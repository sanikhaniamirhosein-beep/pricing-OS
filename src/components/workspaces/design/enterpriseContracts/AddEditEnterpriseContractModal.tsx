import React, { useState } from 'react';
import {
  X,
  Plus,
  Save,
  CheckCircle2,
  Building2,
  FileText,
  Calendar,
  DollarSign,
  Truck,
  ShieldCheck,
  AlertOctagon,
  Paperclip,
  Scale,
  Activity,
  Lock,
  Sparkles,
  Trash2,
  Hash,
} from 'lucide-react';
import {
  EnterpriseCorporateContract,
  ContractType,
  EnterpriseContractStatus,
  ContractCategory,
  CounterpartyRole,
  PaymentMethod,
  ContractCurrency,
  ConfidentialityLevel,
} from '../../../../types/enterpriseContract';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contract: EnterpriseCorporateContract) => void;
  existingContract?: EnterpriseCorporateContract | null;
}

export const AddEditEnterpriseContractModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  existingContract,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  // 1. General Info
  const [title, setTitle] = useState(existingContract?.generalInfo.title || '');
  const [contractNumber, setContractNumber] = useState(
    existingContract?.generalInfo.contractNumber || `1405/PG/${Math.floor(100 + Math.random() * 900)}`
  );
  const [contractType, setContractType] = useState<ContractType>(
    existingContract?.generalInfo.contractType || 'freight_transport'
  );
  const [status, setStatus] = useState<EnterpriseContractStatus>(
    existingContract?.generalInfo.status || 'active'
  );
  const [category, setCategory] = useState<ContractCategory>(
    existingContract?.generalInfo.category || 'domestic'
  );
  const [summaryFa, setSummaryFa] = useState(
    existingContract?.generalInfo.summaryFa ||
      'حمل سالانه محمولات و فرآورده‌های صنعتی با ناوگان اختصاصی و صدور آنلاین بارنامه.'
  );

  // 2. Parties
  const [companyName, setCompanyName] = useState(
    existingContract?.parties.counterparty.companyName || ''
  );
  const [nationalId, setNationalId] = useState(
    existingContract?.parties.counterparty.nationalId || '10103892104'
  );
  const [economicCode, setEconomicCode] = useState(
    existingContract?.parties.counterparty.economicCode || '411289104712'
  );
  const [companyPhone, setCompanyPhone] = useState(
    existingContract?.parties.counterparty.phone || '021-88990000'
  );
  const [companyAddress, setCompanyAddress] = useState(
    existingContract?.parties.counterparty.address || 'تهران، خیابان ولیعصر، برج بازرگانی'
  );
  const [counterpartyRole, setCounterpartyRole] = useState<CounterpartyRole>(
    existingContract?.parties.counterpartyRole || 'enterprise_customer'
  );

  // Signatories
  const [counterpartySignatoryName, setCounterpartySignatoryName] = useState(
    existingContract?.parties.counterpartySignatory.fullName || 'مهندس کامران رستمی'
  );
  const [counterpartySignatoryPosition, setCounterpartySignatoryPosition] = useState(
    existingContract?.parties.counterpartySignatory.position || 'معاونت بازرگانی و زنجیره تأمین'
  );
  const [counterpartySignatoryPhone, setCounterpartySignatoryPhone] = useState(
    existingContract?.parties.counterpartySignatory.phone || '09121112233'
  );
  const [counterpartySignatoryNationalCode, setCounterpartySignatoryNationalCode] = useState(
    existingContract?.parties.counterpartySignatory.nationalCode || '0071892011'
  );

  const [internalSignatoryName, setInternalSignatoryName] = useState(
    existingContract?.parties.internalSignatory.fullName || 'مهندس محمدرضا شایگان'
  );
  const [internalSignatoryPosition, setInternalSignatoryPosition] = useState(
    existingContract?.parties.internalSignatory.position || 'مدیرعامل شرکت حمل و نقل سراسری'
  );

  // 3. Duration
  const [startDate, setStartDate] = useState(existingContract?.duration.startDate || '۱۴۰۵/۰۱/۰۱');
  const [endDate, setEndDate] = useState(existingContract?.duration.endDate || '۱۴۰۵/۱۲/۲۹');
  const [durationMonths, setDurationMonths] = useState<number>(
    existingContract?.duration.durationMonths || 12
  );
  const [isAutoRenewable, setIsAutoRenewable] = useState<boolean>(
    existingContract?.duration.isAutoRenewable ?? true
  );
  const [nonRenewalNoticeDays, setNonRenewalNoticeDays] = useState<number>(
    existingContract?.duration.nonRenewalNoticeDays || 30
  );
  const [expirationAlertDays, setExpirationAlertDays] = useState<number>(
    existingContract?.duration.expirationAlertDays || 45
  );

  // 4. Financial Terms
  const [totalAmountToman, setTotalAmountToman] = useState<number>(
    existingContract?.financialTerms.totalAmountToman || 35000000000
  );
  const [currency, setCurrency] = useState<ContractCurrency>(
    existingContract?.financialTerms.currency || 'IRT'
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    existingContract?.financialTerms.paymentMethod || 'installment'
  );
  const [agreedCommissionPercent, setAgreedCommissionPercent] = useState<number>(
    existingContract?.financialTerms.agreedCommissionPercent || 4.5
  );
  const [latePaymentPenaltyPercentPerDay, setLatePaymentPenaltyPercentPerDay] = useState<number>(
    existingContract?.financialTerms.latePaymentPenaltyPercentPerDay || 0.15
  );
  const [priceAdjustmentClause, setPriceAdjustmentClause] = useState(
    existingContract?.financialTerms.priceAdjustmentClause ||
      'تعدیل هر سه ماه یک‌بار بر مبنای نرخ تورم بانک مرکزی و نوسانات بهای سوخت گازوئیل.'
  );

  // 5. Scope of Service & SLA
  const [serviceDescription, setServiceDescription] = useState(
    existingContract?.scopeOfService.description ||
      'تأمین ناوگان سنگین و تریلر جهت حمل بار از مبادی کارخانجات به بنادر و انبارهای مرکزی.'
  );
  const [coveredRoutes, setCoveredRoutes] = useState<string>(
    existingContract?.scopeOfService.coveredRoutesOrZones.join('، ') ||
      'تهران به بندرعباس، اصفهان به بوشهر، تبریز به مرز بازرگان'
  );
  const [allowedCargoTypes, setAllowedCargoTypes] = useState<string>(
    existingContract?.scopeOfService.allowedCommodityTypes.join('، ') ||
      'فرآورده‌های پلیمری، کلاف فولادی، قطعات صنعتی، مواد بسته‌بندی'
  );
  const [truckCount, setTruckCount] = useState<number>(
    existingContract?.scopeOfService.allocatedFleetCapacity.truckCount || 40
  );
  const [monthlyMinTonnage, setMonthlyMinTonnage] = useState<number>(
    existingContract?.scopeOfService.allocatedFleetCapacity.monthlyMinTonnage || 6000
  );
  const [onTimeDeliveryPercent, setOnTimeDeliveryPercent] = useState<number>(
    existingContract?.scopeOfService.sla.onTimeDeliveryPercent || 98.5
  );
  const [damageFreePercent, setDamageFreePercent] = useState<number>(
    existingContract?.scopeOfService.sla.damageFreePercent || 99.8
  );

  // 6. Obligations & Liability
  const [insurerName, setInsurerName] = useState(
    existingContract?.obligations.liabilityInsurance.insurerName || 'بیمه ایران'
  );
  const [insurancePolicyNumber, setInsurancePolicyNumber] = useState(
    existingContract?.obligations.liabilityInsurance.policyNumber || 'INS-IRAN-1405-TRN-9981'
  );
  const [insuranceCoverageToman, setInsuranceCoverageToman] = useState<number>(
    existingContract?.obligations.liabilityInsurance.coverageAmountToman || 12000000000
  );
  const [liabilityCapToman, setLiabilityCapToman] = useState<number>(
    existingContract?.obligations.liabilityCapToman || 12000000000
  );

  // 7. Termination Clauses
  const [earlyTerminationPenaltyToman, setEarlyTerminationPenaltyToman] = useState<number>(
    existingContract?.terminationClauses.earlyTerminationPenaltyToman || 2000000000
  );
  const [unilateralNoticePeriodDays, setUnilateralNoticePeriodDays] = useState<number>(
    existingContract?.terminationClauses.unilateralNoticePeriodDays || 30
  );

  // 9. Legal & Compliance
  const [governingLaw, setGoverningLaw] = useState(
    existingContract?.legalCompliance.governingLaw ||
      'قوانین و مقررات جمهوری اسلامی ایران و قانون تجارت'
  );
  const [arbitrationCenterName, setArbitrationCenterName] = useState(
    existingContract?.legalCompliance.arbitrationCenterName ||
      'مرکز داوری اتاق بازرگانی، صنایع، معادن و کشاورزی ایران'
  );
  const [officialRegistrationNumber, setOfficialRegistrationNumber] = useState(
    existingContract?.legalCompliance.officialRegistrationNumber || 'RMTO-REG-1405-PG-889'
  );

  // 11. Audit Fields
  const [confidentialityLevel, setConfidentialityLevel] = useState<ConfidentialityLevel>(
    existingContract?.auditFields.confidentialityLevel || 'confidential'
  );

  if (!isOpen) return null;

  const handleGenerateContractId = () => {
    const prefix = companyName
      ? companyName.substring(0, 4).toUpperCase().replace(/\s+/g, '')
      : 'CORP';
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `CNT-1405-${prefix}-${rand}`;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !companyName.trim()) {
      alert('لطفاً عنوان قرارداد و نام شرکت طرف قرارداد را تکمیل فرمایید.');
      return;
    }

    const contractId = existingContract?.contractId || handleGenerateContractId();
    const displayId = existingContract?.displayId || `CT-${Math.floor(300 + Math.random() * 600)}`;

    const newContract: EnterpriseCorporateContract = {
      id: existingContract?.id || `cnt-${Date.now()}`,
      contractId,
      displayId,

      // 1. General Info
      generalInfo: {
        contractId,
        contractNumber,
        title,
        contractType,
        status,
        category,
        tags: [
          contractType === 'freight_transport'
            ? 'حمل‌ونقل'
            : contractType === 'fleet_contracting'
            ? 'پیمانکاری ناوگان'
            : 'لجستیک',
          category === 'domestic' ? 'سراسری' : 'بین‌المللی',
        ],
        summaryFa,
        departmentScope: 'معاونت بازرگانی و قراردادهای سازمانی',
      },

      // 2. Parties
      parties: {
        counterparty: {
          companyName,
          nationalId,
          economicCode,
          phone: companyPhone,
          address: companyAddress,
        },
        counterpartySignatory: {
          fullName: counterpartySignatoryName,
          position: counterpartySignatoryPosition,
          nationalCode: counterpartySignatoryNationalCode,
          phone: counterpartySignatoryPhone,
          signatureStatus: 'signed',
          signedAt: '۱۴۰۵/۰۱/۰۲',
        },
        internalSignatory: {
          fullName: internalSignatoryName,
          position: internalSignatoryPosition,
          nationalCode: '0047219803',
          phone: '09122334455',
          signatureStatus: 'signed',
          signedAt: '۱۴۰۵/۰۱/۰۲',
        },
        counterpartyRole,
        internalDepartment: 'مدیریت مشتریان راهبردی و حمل‌ونقل سازمانی',
      },

      // 3. Duration
      duration: {
        startDate,
        endDate,
        durationMonths,
        isAutoRenewable,
        nonRenewalNoticeDays,
        expirationAlertDays,
        renewalCount: existingContract?.duration.renewalCount || 1,
      },

      // 4. Financial Terms
      financialTerms: {
        totalAmountToman,
        currency,
        paymentMethod,
        agreedCommissionPercent,
        latePaymentPenaltyPercentPerDay,
        priceAdjustmentClause,
        advancePaymentToman: totalAmountToman * 0.1,
        guaranteeDepositToman: totalAmountToman * 0.1,
        guaranteeType: 'bank_guarantee',
        installments: existingContract?.financialTerms.installments || [
          {
            id: 'inst-1',
            installmentNumber: 1,
            titleFa: 'پیش‌پرداخت اولیه تجهیز ناوگان',
            amountToman: totalAmountToman * 0.2,
            dueDate: '۱۴۰۵/۰۱/۱۰',
            status: 'paid',
          },
          {
            id: 'inst-2',
            installmentNumber: 2,
            titleFa: 'صورت‌وضعیت سه‌ماهه اول',
            amountToman: totalAmountToman * 0.4,
            dueDate: '۱۴۰۵/۰۴/۱۵',
            status: 'pending',
          },
          {
            id: 'inst-3',
            installmentNumber: 3,
            titleFa: 'تسویه نهایی دوره قرارداد',
            amountToman: totalAmountToman * 0.4,
            dueDate: '۱۴۰۵/۱۲/۲۵',
            status: 'pending',
          },
        ],
      },

      // 5. Scope of Service
      scopeOfService: {
        description: serviceDescription,
        coveredRoutesOrZones: coveredRoutes.split('،').map((s) => s.trim()),
        allowedCommodityTypes: allowedCargoTypes.split('،').map((s) => s.trim()),
        allocatedFleetCapacity: {
          truckCount,
          vehicleTypes: ['تریلر کفی ۲۵ تن', 'تریلی چادری ترانزیت'],
          monthlyMinTonnage,
        },
        sla: {
          onTimeDeliveryPercent,
          damageFreePercent,
          dispatchResponseTimeMinutes: 30,
          maxUnloadingDelayHours: 6,
          trackingAvailability: 'پایش ماهواره‌ای GPS آنلاین',
        },
      },

      // 6. Obligations & Liability
      obligations: {
        firstPartyObligations: [
          'تأمین ناوگان دارای معاینه فنی و رانندگان مجرب با کارت هوشمند.',
          'صدور بارنامه دولتی و بیمه‌نامه تمام‌خطر قبل از خروج.',
        ],
        secondPartyObligations: [
          'بارگیری استاندارد و تحویل به موقع محموله در مبدا.',
          'تسویه صورت‌حساب‌های ماهانه در موعد مقرر.',
        ],
        liabilityInsurance: {
          policyNumber: insurancePolicyNumber,
          insurerName,
          coverageAmountToman: insuranceCoverageToman,
          expiryDate: endDate,
          status: 'active',
          coverageTypeFa: 'بیمه جامع مسئولیت مدنی متصدیان حمل کالا (All-Risk)',
        },
        indemnityConditions: 'جبران خسارت بر مبنای ارزش واقعی بارنامه تا سقف بیمه‌نامه.',
        liabilityCapToman,
      },

      // 7. Termination Clauses
      terminationClauses: {
        unilateralTerminationAllowed: true,
        unilateralNoticePeriodDays,
        earlyTerminationPenaltyToman,
        immediateTerminationTriggers: [
          'نقض مکرر تعهدات حمل برای ۳ روز متوالی.',
          'ورشکستگی یا انحلال هر یک از طرفین.',
        ],
      },

      // 8. Documents & Attachments
      documents: existingContract?.documents || {
        mainContractFile: {
          id: 'doc-new-main',
          title: 'نسخه نهایی قرارداد رسمی امضا شده (PDF)',
          fileName: `${contractId}_Signed_Official.pdf`,
          fileType: 'pdf',
          fileSizeMb: 3.5,
          uploadDate: '۱۴۰۵/۰۱/۰۱',
          isMainContract: true,
          uploadedBy: 'کارشناس امور حقوقی',
          signatureVerified: true,
        },
        technicalAttachments: [],
        versionHistory: [
          {
            version: 1,
            date: '۱۴۰۵/۰۱/۰۱',
            modifiedBy: 'کاربر جاری سیستم',
            changeSummaryFa: 'ثبت و صدور اولیه قرارداد سازمانی.',
          },
        ],
        amendments: [],
      },

      // 9. Legal & Compliance
      legalCompliance: {
        governingLaw,
        disputeResolutionForum: 'arbitration',
        arbitrationCenterName,
        legalDepartmentApproval: {
          status: 'approved',
          approvedByLegalOfficer: 'مشاور حقوقی ارشد شرکت',
          approvalDate: '۱۴۰۵/۰۱/۰۱',
          notesFa: 'تایید کامل بندهای تضامین و صلاحیت قضایی.',
        },
        officialRegistrationNumber,
      },

      // 10. System Relations
      systemRelations: existingContract?.systemRelations || {
        linkedFleetDrivers: [],
        linkedInvoices: [],
        performanceReport: {
          totalShipmentsCompleted: 0,
          onTimeDeliveryRate: onTimeDeliveryPercent,
          damageClaimsCount: 0,
          customerSatisfactionScore: 5.0,
          activeDisputesCount: 0,
          totalTonnageHauled: 0,
        },
        activityNotes: [
          {
            id: 'note-init',
            authorName: 'سیستم هوشمند قراردادها',
            authorRole: 'سیستم',
            date: '۱۴۰۵/۰۱/۰۱',
            contentFa: 'قرارداد جدید با موفقیت ثبت گردید.',
            category: 'general',
          },
        ],
      },

      // 11. Audit Fields
      auditFields: {
        createdBy: existingContract?.auditFields.createdBy || 'مهندس شایگان (مدیر ارشد سیستم)',
        createdAt: existingContract?.auditFields.createdAt || '۱۴۰۵/۰۱/۰۱ ۱۰:۰۰',
        lastModifiedBy: 'کاربر جاری سیستم',
        lastModifiedAt: '۱۴۰۵/۰۱/۰۱ ۱۱:۰۰',
        confidentialityLevel,
        auditTrail: [
          ...(existingContract?.auditFields.auditTrail || []),
          {
            timestamp: '۱۴۰۵/۰۱/۰۱ ۱۱:۰۰',
            user: 'کاربر جاری',
            action: existingContract ? 'UPDATE_CONTRACT' : 'CREATE_CONTRACT',
            detailsFa: existingContract ? 'ویرایش اطلاعات و تمدید قرارداد' : 'ثبت قرارداد سازمانی جدید',
          },
        ],
      },

      // Compatibility fields
      customerNameFa: companyName,
      customerNameEn: companyName,
      customerCode: nationalId,
      industry: 'صنایع تولیدی و تجاری',
      tier: 'Diamond',
      volumeBands: existingContract?.volumeBands || [
        { minTonsPerMonth: 0, maxTonsPerMonth: 2000, discountPercent: 0, unitRateDiscountTomanPerTonKm: 0 },
        { minTonsPerMonth: 2001, maxTonsPerMonth: 8000, discountPercent: 7.5, unitRateDiscountTomanPerTonKm: 2400 },
        { minTonsPerMonth: 8001, maxTonsPerMonth: 999999, discountPercent: 14.0, unitRateDiscountTomanPerTonKm: 4500 },
      ],
      minimumCommitmentTons: monthlyMinTonnage * 12,
      penaltyClausePerTonShortfallToman: 45000,
      fuelIndexAbsorptionPercent: 50,
      effectiveFrom: startDate,
      effectiveTo: endDate,
      status: 'Active',
      version: existingContract && existingContract.version ? existingContract.version + 1 : 1,
    };

    onSave(newContract);
    onClose();
  };

  const steps = [
    { id: 1, title: '۱. اطلاعات پایه', icon: FileText },
    { id: 2, title: '۲. طرفین و نمایندگان', icon: Building2 },
    { id: 3, title: '۳. بازه زمانی', icon: Calendar },
    { id: 4, title: '۴. شرایط مالی', icon: DollarSign },
    { id: 5, title: '۵. محدوده خدمات و SLA', icon: Truck },
    { id: 6, title: '۶. تعهدات و بیمه', icon: ShieldCheck },
    { id: 7, title: '۷. فسخ و حقوقی', icon: Scale },
    { id: 8, title: '۸. امنیت و حسابرسی', icon: Lock },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-amber-50/80 via-white to-slate-50 border-b border-slate-200 text-slate-900 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-900 font-mono text-xs font-bold border border-amber-300">
                فرم استاندارد ۱۱ گانه قرارداد سازمانی
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {existingContract ? 'ویرایش پرونده قرارداد' : 'ثبت قرارداد جدید شرکت'}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              {title || 'ثبت قرارداد سازمانی و حمل‌ونقل اختصاصی'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Navigation Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
          {steps.map((s) => {
            const Icon = s.icon;
            const isActive = activeStep === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveStep(s.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs border border-amber-400'
                    : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{s.title}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* STEP 1: General Info */}
          {activeStep === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                <FileText className="w-4 h-4 text-amber-700" />
                بخش ۱: اطلاعات پایه و مشخصات سیستمی قرارداد (General Info)
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">عنوان کامل قرارداد:</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثال: قرارداد جامع ترانزیت جاده‌ای و حمل فرآورده‌های پلیمری"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">نوع قرارداد:</label>
                  <select
                    value={contractType}
                    onChange={(e) => setContractType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white"
                  >
                    <option value="freight_transport">حمل‌ونقل باری و ترانزیت جاده‌ای</option>
                    <option value="fleet_contracting">پیمانکاری و اختصاص ناوگان سنگین</option>
                    <option value="vehicle_lease">اجاره وسیله نقلیه و کشنده لجستیکی</option>
                    <option value="logistics_services">خدمات جامع لجستیک و انبارداری</option>
                    <option value="intercompany_cooperation">همکاری بین‌شرکتی و هلدینگی</option>
                    <option value="distribution_retail">توزیع مویرگی و پخش سراسری</option>
                    <option value="transit_crossborder">ترانزیت بین‌المللی و گمرک (TIR)</option>
                    <option value="bulk_hazardous_transport">حمل مواد فله و ویژه خطرناک (ADR)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">دسته‌بندی قلمرو قرارداد:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white"
                  >
                    <option value="domestic">داخلی (سراسری کشور)</option>
                    <option value="intercompany">بین‌شرکتی و درون هلدینگ</option>
                    <option value="international">بین‌المللی و ترانزیت خارجی</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">وضعیت قرارداد:</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white"
                  >
                    <option value="active">فعال و لازم‌الاجرا</option>
                    <option value="pending_sign">در انتظار امضا و تشریفات</option>
                    <option value="draft">پیش‌نویس اولیه</option>
                    <option value="renewing">در حال تمدید</option>
                    <option value="expired">منقضی‌شده</option>
                    <option value="terminated">فسخ‌شده</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">شماره ثبت رسمی دبیرخانه:</label>
                  <input
                    type="text"
                    value={contractNumber}
                    onChange={(e) => setContractNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">خلاصه موضوع و هدف قرارداد:</label>
                  <textarea
                    value={summaryFa}
                    onChange={(e) => setSummaryFa(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 h-20"
                    placeholder="شرح کوتاه تعهدات و ماهیت خدمات..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Parties */}
          {activeStep === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                بخش ۲: طرفین قرارداد و نمایندگان امضاکننده (Parties)
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">نام شرکت طرف قرارداد (طرف دوم):</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="مثال: شرکت صنایع پتروشیمی خلیج فارس"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">شناسه ملی / شماره ثبت:</label>
                  <input
                    type="text"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">کد اقتصادی:</label>
                  <input
                    type="text"
                    value={economicCode}
                    onChange={(e) => setEconomicCode(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">نوع نقش طرف مقابل:</label>
                  <select
                    value={counterpartyRole}
                    onChange={(e) => setCounterpartyRole(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  >
                    <option value="enterprise_customer">مشتری سازمانی / صاحب کالا</option>
                    <option value="contractor">پیمانکار ناوگان / حمل‌ونقل</option>
                    <option value="partner">همکار تجاری / کنسرسیوم</option>
                    <option value="supplier">تأمین‌کننده تجهیزات</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">شماره تماس شرکت:</label>
                  <input
                    type="text"
                    value={companyPhone}
                    onChange={(e) => setCompanyPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">آدرس پستی طرف قرارداد:</label>
                  <input
                    type="text"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>
              </div>

              {/* Signatory Reps */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="font-bold text-slate-900 text-xs">مشخصات نماینده امضاکننده طرف دوم:</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1">نام نماینده:</label>
                    <input
                      type="text"
                      value={counterpartySignatoryName}
                      onChange={(e) => setCounterpartySignatoryName(e.target.value)}
                      className="w-full p-2 rounded-lg bg-white border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">سمت سازمانی:</label>
                    <input
                      type="text"
                      value={counterpartySignatoryPosition}
                      onChange={(e) => setCounterpartySignatoryPosition(e.target.value)}
                      className="w-full p-2 rounded-lg bg-white border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">شماره تماس مستقیم:</label>
                    <input
                      type="text"
                      value={counterpartySignatoryPhone}
                      onChange={(e) => setCounterpartySignatoryPhone(e.target.value)}
                      className="w-full p-2 rounded-lg bg-white border border-slate-200 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Duration */}
          {activeStep === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                <Calendar className="w-4 h-4 text-amber-700" />
                بخش ۳: بازه زمانی و ضوابط تمدید (Duration)
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">تاریخ شروع قرارداد (شمسی):</label>
                  <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">تاریخ پایان قرارداد (شمسی):</label>
                  <input
                    type="text"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">مدت اعتبار (ماه):</label>
                  <input
                    type="number"
                    value={durationMonths}
                    onChange={(e) => setDurationMonths(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">قابلیت تمدید خودکار:</label>
                  <div className="flex items-center gap-4 pt-2">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={isAutoRenewable}
                        onChange={() => setIsAutoRenewable(true)}
                        name="autorenew"
                      />
                      <span>دارد (تمدید خودکار سالانه)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={!isAutoRenewable}
                        onChange={() => setIsAutoRenewable(false)}
                        name="autorenew"
                      />
                      <span>ندارد</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">مهلت اعلام عدم تمدید (روز):</label>
                  <input
                    type="number"
                    value={nonRenewalNoticeDays}
                    onChange={(e) => setNonRenewalNoticeDays(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">یادآور انقضا (چند روز قبل هشدار داده شود):</label>
                  <input
                    type="number"
                    value={expirationAlertDays}
                    onChange={(e) => setExpirationAlertDays(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Financials */}
          {activeStep === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                بخش ۴: شرایط مالی و تعدیل قیمت (Financial Terms)
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">مبلغ کل برآورد قرارداد (تومان):</label>
                  <input
                    type="number"
                    value={totalAmountToman}
                    onChange={(e) => setTotalAmountToman(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">واحد پول:</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  >
                    <option value="IRT">تومان ایران (IRT)</option>
                    <option value="IRR">ریال ایران (IRR)</option>
                    <option value="USD">دلار آمریکا (USD)</option>
                    <option value="EUR">یورو (EUR)</option>
                    <option value="AED">درهم امارات (AED)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">شیوه پرداخت:</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  >
                    <option value="installment">اقساطی و دوره‌ای بر مبنای صورت‌وضعیت</option>
                    <option value="lump_sum">پرداخت یکجا</option>
                    <option value="per_ton_km">بر اساس تناژ یا کیلومتر واقعی</option>
                    <option value="percentage_cut">درصدی از کل کرایه بارنامه</option>
                    <option value="monthly_fixed">ماهانه ثابت</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">کمیسیون یا تعرفه توافقی (٪):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={agreedCommissionPercent}
                    onChange={(e) => setAgreedCommissionPercent(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">جریمه تأخیر پرداخت (درصد روزانه):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={latePaymentPenaltyPercentPerDay}
                    onChange={(e) => setLatePaymentPenaltyPercentPerDay(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">شرایط تعدیل قیمت و نوسان تورم / سوخت:</label>
                  <textarea
                    value={priceAdjustmentClause}
                    onChange={(e) => setPriceAdjustmentClause(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 h-20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Scope & SLA */}
          {activeStep === 5 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                <Truck className="w-4 h-4 text-amber-700" />
                بخش ۵: محدوده خدمات، مسیرها و SLA (Scope & SLA)
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">شرح کامل خدمات و تعهدات عملیاتی:</label>
                  <textarea
                    value={serviceDescription}
                    onChange={(e) => setServiceDescription(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 h-20"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">مسیرها یا مناطق تحت پوشش (با کاما جدا کنید):</label>
                    <input
                      type="text"
                      value={coveredRoutes}
                      onChange={(e) => setCoveredRoutes(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">نوع بار و محموله‌های مجاز (با کاما جدا کنید):</label>
                    <input
                      type="text"
                      value={allowedCargoTypes}
                      onChange={(e) => setAllowedCargoTypes(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">تعداد ناوگان ثابت اختصاصی (دستگاه):</label>
                    <input
                      type="number"
                      value={truckCount}
                      onChange={(e) => setTruckCount(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">حداقل تعهد تناژ ماهانه (تن):</label>
                    <input
                      type="number"
                      value={monthlyMinTonnage}
                      onChange={(e) => setMonthlyMinTonnage(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">تعهد تحویل به‌موقع SLA (٪):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={onTimeDeliveryPercent}
                      onChange={(e) => setOnTimeDeliveryPercent(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">تعهد سلامت محموله (٪):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={damageFreePercent}
                      onChange={(e) => setDamageFreePercent(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Obligations & Insurance */}
          {activeStep === 6 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                بخش ۶: تعهدات، بیمه مسئولیت و سقف خسارت (Obligations & Insurance)
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">شرکت بیمه‌گر طرف قرارداد:</label>
                  <input
                    type="text"
                    value={insurerName}
                    onChange={(e) => setInsurerName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">شماره بیمه‌نامه رسمی:</label>
                  <input
                    type="text"
                    value={insurancePolicyNumber}
                    onChange={(e) => setInsurancePolicyNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">سقف پوشش ریالی بیمه‌نامه (تومان):</label>
                  <input
                    type="number"
                    value={insuranceCoverageToman}
                    onChange={(e) => setInsuranceCoverageToman(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">سقف محدودیت مسئولیت (Liability Cap):</label>
                  <input
                    type="number"
                    value={liabilityCapToman}
                    onChange={(e) => setLiabilityCapToman(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Termination & Legal */}
          {activeStep === 7 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                <Scale className="w-4 h-4 text-amber-600" />
                بخش‌های ۷ و ۹: شرایط فسخ، قانون حاکم و مراجع داوری (Termination & Legal)
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">مهلت اخطار قبل از فسخ (روز):</label>
                  <input
                    type="number"
                    value={unilateralNoticePeriodDays}
                    onChange={(e) => setUnilateralNoticePeriodDays(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">جریمه فسخ زودهنگام ناموجه (تومان):</label>
                  <input
                    type="number"
                    value={earlyTerminationPenaltyToman}
                    onChange={(e) => setEarlyTerminationPenaltyToman(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">قانون حاکم بر قرارداد:</label>
                  <input
                    type="text"
                    value={governingLaw}
                    onChange={(e) => setGoverningLaw(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">مرجع حل اختلاف و داوری مرضی‌الطرفین:</label>
                  <input
                    type="text"
                    value={arbitrationCenterName}
                    onChange={(e) => setArbitrationCenterName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">شماره ثبت رسمی در سامانه دولتی / راهداری:</label>
                  <input
                    type="text"
                    value={officialRegistrationNumber}
                    onChange={(e) => setOfficialRegistrationNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: Audit & Security */}
          {activeStep === 8 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                <Lock className="w-4 h-4 text-amber-700" />
                بخش ۱۱: سطح محرمانگی و دسترسی‌های امنیتی (Audit & RBAC)
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-2">سطح دسترسی و طبقه‌بندی محرمانگی سند:</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                    <input
                      type="radio"
                      checked={confidentialityLevel === 'confidential'}
                      onChange={() => setConfidentialityLevel('confidential')}
                      name="confidentiality"
                    />
                    <div>
                      <div className="font-bold text-slate-900">محرمانه سازمانی (پیش‌فرض)</div>
                      <div className="text-slate-500 text-[11px]">قابل مشاهده برای معاونت بازرگانی، امور مالی و کارشناسان مسئول</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                    <input
                      type="radio"
                      checked={confidentialityLevel === 'top_secret_c_level'}
                      onChange={() => setConfidentialityLevel('top_secret_c_level')}
                      name="confidentiality"
                    />
                    <div>
                      <div className="font-bold text-rose-700">فوق‌محرمانه - فقط مدیران ارشد (C-Level & Board)</div>
                      <div className="text-slate-500 text-[11px]">مخصوص قراردادهای راهبردی کلان و کنسرسیوم‌ها</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                    <input
                      type="radio"
                      checked={confidentialityLevel === 'internal_public'}
                      onChange={() => setConfidentialityLevel('internal_public')}
                      name="confidentiality"
                    />
                    <div>
                      <div className="font-bold text-slate-700">عمومی داخلی سازمان</div>
                      <div className="text-slate-500 text-[11px]">قابل دسترسی برای تمامی پرسنل عملیات و دیسپاچینگ</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Footer Form Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 shrink-0">
            <div className="flex items-center gap-2">
              {activeStep > 1 && (
                <button
                  type="button"
                  onClick={() => setActiveStep((prev) => prev - 1)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 cursor-pointer"
                >
                  مرحله قبلی
                </button>
              )}
              {activeStep < 8 && (
                <button
                  type="button"
                  onClick={() => setActiveStep((prev) => prev + 1)}
                  className="px-4 py-2 rounded-xl bg-amber-100 text-amber-950 font-bold hover:bg-amber-200 cursor-pointer transition-colors"
                >
                  مرحله بعدی
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 cursor-pointer transition-colors"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition-colors shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {existingContract ? 'ذخیره تغییرات قرارداد' : 'ثبت نهایی و ایجاد پرونده'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
