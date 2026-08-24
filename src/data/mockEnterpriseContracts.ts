/**
 * Mock Enterprise Corporate Contracts Data
 * Authentic Iranian Commercial Freight Contracts with full 11-section specifications
 */

import { EnterpriseCorporateContract } from '../types/enterpriseContract';

export const INITIAL_ENTERPRISE_CONTRACTS: EnterpriseCorporateContract[] = [
  {
    id: 'cnt-pgpc-2026',
    contractId: 'CNT-1405-PGPC-8801',
    displayId: 'CT-330',

    // 1. General Info
    generalInfo: {
      contractId: 'CNT-1405-PGPC-8801',
      contractNumber: '1405/PG/992-B',
      title: 'قرارداد جامع ترانزیت جاده‌ای و حمل فرآورده‌های پلیمری و پتروشیمی',
      contractType: 'freight_transport',
      status: 'active',
      category: 'domestic',
      tags: ['پتروشیمی', 'کالای حساس', 'ترانزیت کفی', 'سهمیه عسلویه'],
      summaryFa: 'حمل سالانه ۱۰۰٬۰۰۰ تن محصولات پلیمری، گرانول و پت از مبدا مجتمع‌های پتروشیمی عسلویه و ماهشهر به کلیه مقاصد صنعتی کشور با تضمین ناوگان اختصاصی و پایش برخط.',
      departmentScope: 'معاونت بازرگانی و قراردادهای لجستیک هلدینگ',
    },

    // 2. Parties
    parties: {
      counterparty: {
        companyName: 'شرکت صنایع پتروشیمی خلیج فارس (هلدینگ PGPC)',
        companyCode: 'PGPC-9941',
        nationalId: '10103429810',
        economicCode: '411389561234',
        registrationNumber: '298104',
        address: 'تهران، میدان هفت تیر، خیابان کریمخان زند، پلاک ۳۸، برج خلیج فارس',
        phone: '021-88329000',
        email: 'logistics@pgpic.ir',
        postalCode: '15875-4391',
        provinceCity: 'تهران / تهران',
      },
      counterpartySignatory: {
        fullName: 'دکتر مهدی صادقی‌نیا',
        position: 'عضو هیئت مدیره و معاون بازرگانی و زنجیره تأمین',
        nationalCode: '0058912341',
        phone: '09121118942',
        email: 'm.sadeghi@pgpic.ir',
        signatureStatus: 'signed',
        signedAt: '۱۴۰۴/۱۲/۱۵',
        digitalCertificateSerial: 'CSR-IR-99214-G1',
      },
      internalSignatory: {
        fullName: 'مهندس محمدرضا شایگان',
        position: 'مدیرعامل و عضو موظف هیئت مدیره',
        nationalCode: '0047219803',
        phone: '09122334455',
        email: 'shayegan@pg-logistics.ir',
        signatureStatus: 'signed',
        signedAt: '۱۴۰۴/۱۲/۱۸',
        digitalCertificateSerial: 'CSR-IR-10492-ADM',
      },
      counterpartyRole: 'enterprise_customer',
      internalDepartment: 'مدیریت مشتریان کلیدی و قراردادهای استراتژیک',
    },

    // 3. Duration
    duration: {
      startDate: '۱۴۰۵/۰۱/۰۱',
      endDate: '۱۴۰۵/۱۲/۲۹',
      durationMonths: 12,
      isAutoRenewable: true,
      nonRenewalNoticeDays: 30,
      expirationAlertDays: 45,
      lastRenewedDate: '۱۴۰۴/۱۲/۲۰',
      renewalCount: 2,
    },

    // 4. Financial Terms
    financialTerms: {
      totalAmountToman: 42000000000, // 42 Billion Toman
      currency: 'IRT',
      paymentMethod: 'installment',
      agreedCommissionPercent: 4.5,
      latePaymentPenaltyPercentPerDay: 0.15, // 0.15% per day
      priceAdjustmentClause: 'تعدیل هر سه ماه یک‌بار بر مبنای نرخ تورم اعلامی بانک مرکزی، نرخ رسمی گازوئیل دولتی و میانگین استعلام تن/کیلومتر کانون رانندگان.',
      advancePaymentToman: 5000000000,
      guaranteeDepositToman: 4200000000, // 10% guarantee
      guaranteeType: 'bank_guarantee',
      guaranteeDocNumber: 'BG-TEH-MELLI-992144',
      installments: [
        {
          id: 'inst-1',
          installmentNumber: 1,
          titleFa: 'پیش‌پرداخت اولیه و تجهیز ناوگان خطوط عسلویه',
          amountToman: 5000000000,
          dueDate: '۱۴۰۵/۰۱/۰۵',
          status: 'paid',
          paidDate: '۱۴۰۵/۰۱/۰۴',
          trackingNumber: 'TRX-BANK-14050104-991',
          notes: 'پرداخت شده از محل حساب متمرکز بانک تجارت',
        },
        {
          id: 'inst-2',
          installmentNumber: 2,
          titleFa: 'صورت‌وضعیت عملکرد سه‌ماهه اول (بهار ۱۴۰۵)',
          amountToman: 9250000000,
          dueDate: '۱۴۰۵/۰۴/۱۰',
          status: 'paid',
          paidDate: '۱۴۰۵/۰۴/۰۸',
          trackingNumber: 'TRX-BANK-14050408-332',
          notes: 'تسویه کامل صورت‌حساب قطعی بارنامه‌های بهار',
        },
        {
          id: 'inst-3',
          installmentNumber: 3,
          titleFa: 'صورت‌وضعیت عملکرد سه‌ماهه دوم (تابستان ۱۴۰۵)',
          amountToman: 9250000000,
          dueDate: '۱۴۰۵/۰۷/۱۰',
          status: 'paid',
          paidDate: '۱۴۰۵/۰۷/۰۶',
          trackingNumber: 'TRX-BANK-14050706-441',
          notes: 'پرداخت موفق پایا به همراه تاییدیه باسکول مبدا',
        },
        {
          id: 'inst-4',
          installmentNumber: 4,
          titleFa: 'صورت‌وضعیت عملکرد سه‌ماهه سوم (پاییز ۱۴۰۵)',
          amountToman: 9250000000,
          dueDate: '۱۴۰۵/۱۰/۱۰',
          status: 'pending',
          notes: 'در حال تطبیق با گزارشات تحویل انبار بندرعباس و تهران',
        },
        {
          id: 'inst-5',
          installmentNumber: 5,
          titleFa: 'تسویه نهایی و آزادسازی ضمانت‌نامه حسن انجام کار (زمستان ۱۴۰۵)',
          amountToman: 9250000000,
          dueDate: '۱۴۰۵/۱۲/۲۵',
          status: 'pending',
          notes: 'مشروط به دریافت مفاصاحساب تامین اجتماعی و گواهی عدم بدهی',
        },
      ],
    },

    // 5. Scope of Service
    scopeOfService: {
      description: 'تأمین روزانه حداقل ۴۵ دستگاه کشنده کفی و چادری جهت بارگیری و حمل محمولات پتروشیمی از پایانه اختصاصی عسلویه و ماهشهر به انبارهای مرکزی تهران، مشهد، تبریز، اصفهان و خروجی‌های گمرکی بازرگان و آستارا.',
      coveredRoutesOrZones: [
        'عسلویه به تهران (کریدور الف)',
        'ماهشهر به تبریز (کریدور شمال‌غرب)',
        'عسلویه به بندرعباس و چابهار (ترانزیت جنوب)',
        'بندر امام به اصفهان (کریدور صنعتی مرکزی)',
      ],
      allowedCommodityTypes: [
        'پلی‌اتیلن سنگین و سبک خطی (HDPE/LDPE)',
        'پلی‌پروپیلن نساجی و شیمیایی (PP)',
        'گرانول پلاستیک، بطری پت (PET)',
        'پالت‌های بسته‌بندی شده با شرینک حرارتی',
      ],
      allocatedFleetCapacity: {
        truckCount: 65,
        vehicleTypes: ['تریلر کفی ۲۵ تن', 'تریلی چادری ترانزیت ۲۴ تن', 'کامیون جفت ۱۰ چرخ'],
        monthlyMinTonnage: 8500,
      },
      sla: {
        onTimeDeliveryPercent: 98.8,
        damageFreePercent: 99.9,
        dispatchResponseTimeMinutes: 30,
        maxUnloadingDelayHours: 6,
        trackingAvailability: 'پایش ماهواره‌ای GPS با دیتالاگر آنلاین هر ۳ دقیقه',
      },
    },

    // 6. Obligations & Liability
    obligations: {
      firstPartyObligations: [
        'تأمین ناوگان دارای کارت هوشمند معتبر، معاینه فنی و رانندگان احراز صلاحیت شده.',
        'صدور بارنامه رسمی دولتی آنلاین (RMTO) قبل از خروج کامیون از گیت پایانه بارگیری.',
        'ارائه گزارش رهگیری موقعیت جغرافیایی و زمان تخمینی رسیدن (ETA) به صورت وب‌سرویس و داشبورد.',
        'مسئولیت کامل حفاظت از کالا در برابر سرقت، خیس‌خوردگی، تصادف و آتش‌سوزی تا زمان امضای رسید تحویلگیرنده.',
      ],
      secondPartyObligations: [
        'آماده‌سازی محموله، باربندی و بارگیری کامیون‌ها ظرف مدت استاندارد حداکثر ۴ ساعت از زمان اعلام ورود.',
        'پرداخت به موقع صورت‌حساب‌های ماهانه مطابق جدول سررسید و عدم ایجاد تاخیر نامتعارف.',
        'ارائه اطلاعات دقیق مشخصات بار، وزن باسکول، نوع بسته‌بندی و اطلاعات گیرنده در مقصد.',
        'تأمین مجوزهای قانونی تردد برای بارهای خارج از ابعاد استاندارد یا پتروشیمی‌های تحریمی.',
      ],
      liabilityInsurance: {
        policyNumber: 'INS-IRAN-1405-TRN-99014',
        insurerName: 'بیمه ایران',
        coverageAmountToman: 15000000000,
        expiryDate: '۱۴۰۵/۱۲/۲۹',
        status: 'active',
        coverageTypeFa: 'بیمه تمام خطر مسئولیت مدنی متصدیان حمل‌ونقل کالا (All-Risk CMR)',
      },
      indemnityConditions: 'در صورت بروز هرگونه کسر، کسری بار، خسارت ناشی از تصادف یا واژگونی، متصدی حمل مکلف است ظرف حداکثر ۱۰ روز کاری نسبت به جبران خسارت بر مبنای فاکتور رسمی بورس کالا یا گزارش کارشناس رسمی بیمه اقدام نماید.',
      liabilityCapToman: 15000000000,
    },

    // 7. Termination Clauses
    terminationClauses: {
      unilateralTerminationAllowed: true,
      unilateralNoticePeriodDays: 30,
      earlyTerminationPenaltyToman: 2000000000,
      immediateTerminationTriggers: [
        'نقض مکرر تعهدات حمل و عدم تامین ناوگان برای ۳ روز متوالی بدون دلیل موجه.',
        'ابطال پروانه فعالیت شرکت حمل‌ونقل یا محرومیت از صدور بارنامه توسط سازمان راهداری.',
        'ورشکستگی، توقیف اموال یا انحلال هر یک از طرفین قرارداد.',
        'بروز حوادث فورس‌ماژور و بلایای طبیعی غیرقابل پیش‌بینی که بیش از ۴۵ روز استمرار یابد.',
      ],
    },

    // 8. Documents & Attachments
    documents: {
      mainContractFile: {
        id: 'doc-main-pgpc',
        title: 'نسخه اصلی قرارداد رسمی امضا شده با مهر طرفین (PDF)',
        fileName: 'Contract_PGPC_PG_Logistics_1405_Signed.pdf',
        fileType: 'pdf',
        fileSizeMb: 4.8,
        uploadDate: '۱۴۰۴/۱۲/۲۰',
        isMainContract: true,
        uploadedBy: 'دفتر حقوقی هلدینگ',
        signatureVerified: true,
        downloadUrl: '#',
      },
      technicalAttachments: [
        {
          id: 'doc-att-1',
          title: 'پیوست ۱: مشخصات فنی ناوگان و استانداردهای بسته‌بندی پتروشیمی',
          fileName: 'Annex1_Technical_Fleet_Packaging_Specs.pdf',
          fileType: 'pdf',
          fileSizeMb: 2.1,
          uploadDate: '۱۴۰۴/۱۲/۱۸',
          isMainContract: false,
          uploadedBy: 'واحد عملیات ناوگان',
          signatureVerified: true,
        },
        {
          id: 'doc-att-2',
          title: 'پیوست ۲: جدول ضوابط ایمنی، چک‌لیست بارگیری و الزامات HSE',
          fileName: 'Annex2_HSE_Safety_Checklist.pdf',
          fileType: 'pdf',
          fileSizeMb: 1.4,
          uploadDate: '۱۴۰۴/۱۲/۱۸',
          isMainContract: false,
          uploadedBy: 'مدیریت ایمنی و بهداشت',
          signatureVerified: true,
        },
        {
          id: 'doc-att-3',
          title: 'پیوست ۳: فرمول شاخص تعدیل نرخ کرایه بر مبنای تن/کیلومتر',
          fileName: 'Annex3_Tariff_Adjustment_Formulas.xlsx',
          fileType: 'xlsx',
          fileSizeMb: 0.9,
          uploadDate: '۱۴۰۴/۱۲/۱۸',
          isMainContract: false,
          uploadedBy: 'مدیریت مهندسی قیمت',
          signatureVerified: true,
        },
      ],
      versionHistory: [
        {
          version: 1,
          date: '۱۴۰۴/۱۱/۲۰',
          modifiedBy: 'کارشناس امور حقوقی (خانم رادمهر)',
          changeSummaryFa: 'تدوین پیش‌نویس اولیه قرارداد بر اساس استعلام قیمت سالانه و الحاقیه بیمه تمام خطر.',
        },
        {
          version: 2,
          date: '۱۴۰۴/۱۲/۱۵',
          modifiedBy: 'معاون بازرگانی و قراردادها (دکتر صادقی‌نیا)',
          changeSummaryFa: 'تصویب نهایی در کمیسیون معاملات، امضای الکترونیک طرفین و ابلاغ جهت اجرا از ابتدای سال ۱۴۰۵.',
        },
      ],
      amendments: [
        {
          id: 'amd-1',
          amendmentNumber: 'الحاقیه شماره ۱/۱۴۰۵',
          title: 'افزایش ۱۰ درصدی ظرفیت تخصیص ناوگان خط ماهشهر-تبریز',
          approvalDate: '۱۴۰۵/۰۳/۱۵',
          effectiveDate: '۱۴۰۵/۰۴/۰۱',
          summaryFa: 'با توجه به افزایش ظرفیت تولید خط پلی‌پروپیلن پتروشیمی مارون، تعداد کشنده‌های اختصاصی این کریدور از ۱۰ به ۱۵ دستگاه افزایش یافت.',
          financialImpactToman: 3500000000,
          status: 'approved',
        },
      ],
    },

    // 9. Legal & Compliance
    legalCompliance: {
      governingLaw: 'قوانین و مقررات جمهوری اسلامی ایران، قانون تجارت و آیین‌نامه‌های سازمان راهداری و حمل‌ونقل جاده‌ای کشور',
      disputeResolutionForum: 'arbitration',
      arbitrationCenterName: 'مرکز داوری اتاق بازرگانی، صنایع، معادن و کشاورزی ایران (مرضی‌الطرفین)',
      legalDepartmentApproval: {
        status: 'approved',
        approvedByLegalOfficer: 'مشاور حقوقی ارشد - وکیل پایه‌یک دادگستری (دکتر محمودی)',
        approvalDate: '۱۴۰۴/۱۲/۱۴',
        notesFa: 'کلیه بندهای عدم تعهد، سقف مسئولیت و تضمین‌های بانکی با قوانین بالادستی تطبیق داده شد و بلامانع است.',
      },
      officialRegistrationNumber: 'RMTO-REG-1405-PGPC-3309',
    },

    // 10. System Relations
    systemRelations: {
      linkedFleetDrivers: [
        {
          driverId: 'drv-pg-01',
          driverName: 'علیرضا قربانی دلاور',
          plateNumber: '۶۲ ع ۸۹۱ - ایران ۱۳',
          vehicleType: 'تریلر کفی ۲۵ تن',
          smartCardNo: '۲۴۹۸۱۰۰',
          assignedDate: '۱۴۰۵/۰۱/۰۵',
          status: 'active',
        },
        {
          driverId: 'drv-pg-02',
          driverName: 'حمیدرضا سلطانی',
          plateNumber: '۳۴ ع ۵۵۲ - ایران ۷۲',
          vehicleType: 'تریلی چادری ترانزیت',
          smartCardNo: '۳۳۰۹۱۴۴',
          assignedDate: '۱۴۰۵/۰۱/۰۵',
          status: 'active',
        },
        {
          driverId: 'drv-pg-03',
          driverName: 'مسعود اکبریان',
          plateNumber: '۸۸ ع ۲۱۴ - ایران ۲۲',
          vehicleType: 'تریلر کفی ۲۵ تن',
          smartCardNo: '۴۴۱۸۹۰۲',
          assignedDate: '۱۴۰۵/۰۲/۱۰',
          status: 'active',
        },
      ],
      linkedInvoices: [
        {
          invoiceId: 'inv-1405-01',
          invoiceNumber: 'INV-PGPC-140501-88',
          amountToman: 3450000000,
          issueDate: '۱۴۰۵/۰۱/۳۱',
          status: 'paid',
          descriptionFa: 'صورت‌حساب حمل فروردین ۱۴۰۵ - ۹۸ سرویس بارگیری عسلویه به تهران',
        },
        {
          invoiceId: 'inv-1405-02',
          invoiceNumber: 'INV-PGPC-140502-91',
          amountToman: 4120000000,
          issueDate: '۱۴۰۵/۰۲/۳۱',
          status: 'paid',
          descriptionFa: 'صورت‌حساب حمل اردیبهشت ۱۴۰۵ - ۱۱۸ سرویس بارگیری',
        },
        {
          invoiceId: 'inv-1405-03',
          invoiceNumber: 'INV-PGPC-140503-104',
          amountToman: 3880000000,
          issueDate: '۱۴۰۵/۰۳/۳۱',
          status: 'pending',
          descriptionFa: 'صورت‌حساب حمل خرداد ۱۴۰۵ - ۱۰۴ سرویس بارگیری',
        },
      ],
      performanceReport: {
        totalShipmentsCompleted: 486,
        onTimeDeliveryRate: 99.2,
        damageClaimsCount: 0,
        customerSatisfactionScore: 4.9,
        activeDisputesCount: 0,
        totalTonnageHauled: 12450,
      },
      activityNotes: [
        {
          id: 'note-1',
          authorName: 'دیسپچر کشیک پایانه عسلویه (آقای مرادی)',
          authorRole: 'مدیریت عملیات',
          date: '۱۴۰۵/۰۵/۱۰',
          contentFa: 'با هماهنگی نماینده پتروشیمی، فرآیند لودینگ تریلی‌های چادری به شیفت شبانه منتقل شد تا از گرمای شدید ظهر جلوگیری گردد.',
          category: 'operational',
        },
        {
          id: 'note-2',
          authorName: 'کارشناس حسابداری فروش (خانم کاظمی)',
          authorRole: 'امور مالی',
          date: '۱۴۰۵/۰۶/۰۲',
          contentFa: 'صورت‌وضعیت عملکرد ماه مرداد با موفقیت در کارتابل مودیان و سامانه هلدینگ ثبت شد.',
          category: 'financial',
        },
      ],
    },

    // 11. Audit Fields
    auditFields: {
      createdBy: 'مهندس محمدرضا شایگان (مدیرعامل)',
      createdAt: '۱۴۰۴/۱۲/۱۵ ۱۱:۳۰',
      lastModifiedBy: 'دکتر صادقی‌نیا (معاونت بازرگانی)',
      lastModifiedAt: '۱۴۰۵/۰۳/۱۵ ۰۹:۴۵',
      confidentialityLevel: 'confidential',
      auditTrail: [
        {
          timestamp: '۱۴۰۴/۱۲/۱۵ ۱۱:۳۰',
          user: 'محمدرضا شایگان',
          action: 'CREATE_CONTRACT',
          detailsFa: 'ایجاد و ثبت اولیه پیش‌نویس قرارداد سازمانی در استودیوی طراحی تجاری.',
        },
        {
          timestamp: '۱۴۰۴/۱۲/۱۸ ۱۶:۲۰',
          user: 'دکتر محمودی (حقوقی)',
          action: 'LEGAL_APPROVE',
          detailsFa: 'تایید حقوقی بندهای مسئولیت، شرایط بیمه و داوری مرضی‌الطرفین.',
        },
        {
          timestamp: '۱۴۰۵/۰۳/۱۵ ۰۹:۴۵',
          user: 'محمدرضا شایگان',
          action: 'ADD_AMENDMENT',
          detailsFa: 'ثبت و الحاق رسمی الحاقیه شماره ۱ جهت افزایش ۵ دستگاه ناوگان ماهشهر.',
        },
      ],
    },

    // Legacy volume bands for Simulator
    minimumCommitmentTons: 100000,
    penaltyClausePerTonShortfallToman: 45000,
    fuelIndexAbsorptionPercent: 50,
    volumeBands: [
      { minTonsPerMonth: 0, maxTonsPerMonth: 2000, discountPercent: 0, unitRateDiscountTomanPerTonKm: 0 },
      { minTonsPerMonth: 2001, maxTonsPerMonth: 8000, discountPercent: 7.5, unitRateDiscountTomanPerTonKm: 2400 },
      { minTonsPerMonth: 8001, maxTonsPerMonth: 25000, discountPercent: 12.0, unitRateDiscountTomanPerTonKm: 3800 },
      { minTonsPerMonth: 25001, maxTonsPerMonth: 999999, discountPercent: 16.0, unitRateDiscountTomanPerTonKm: 5100 },
    ],
    negotiatedBaseOverrides: {
      'تهران-بندرعباس:تریلی چادری': 34500000,
      'اصفهان-بوشهر:تریلر کفی': 22000000,
    },
    effectiveFrom: '2026-01-01',
    effectiveTo: '2026-12-29',
    status: 'Active',
    version: 2,
    customerNameFa: 'شرکت پتروشیمی خلیج فارس (هلدینگ PGPC)',
    customerNameEn: 'Persian Gulf Petrochemical Industries Co.',
    customerCode: 'PGPC-9941',
    industry: 'پتروشیمی و پلیمر',
    tier: 'Diamond',
  },

  {
    id: 'cnt-mihan-dairy',
    contractId: 'CNT-1405-MHN-4102',
    displayId: 'CT-412',

    // 1. General Info
    generalInfo: {
      contractId: 'CNT-1405-MHN-4102',
      contractNumber: 'MHN-LOG-1405/77',
      title: 'قرارداد زنجیره سرد، توزیع کشوری فرآورده‌های لبنی و بستنی و نگهداری دمایی',
      contractType: 'logistics_services',
      status: 'active',
      category: 'domestic',
      tags: ['زنجیره سرد', 'یخچال‌دار', 'مواد غذایی', 'توزیع مویرگی'],
      summaryFa: 'حمل کشوری فرآورده‌های لبنی، بستنی و مواد فاسدشدنی با ناوگان اختصاصی یخچال‌دار مجهز به سنسور دمایی آنلاین منفی ۲۵ الی مثبت ۴ درجه.',
      departmentScope: 'مدیریت توزیع سراسری و لجستیک زنجیره سرد',
    },

    // 2. Parties
    parties: {
      counterparty: {
        companyName: 'گروه صنایع غذایی و لبنیات میهن',
        companyCode: 'MHN-8802',
        nationalId: '10101982341',
        economicCode: '411192837465',
        registrationNumber: '198234',
        address: 'تهران، کیلومتر ۲۲ جاده مخصوص کرج، روبروی پالایشگاه نفت، مجتمع میهن',
        phone: '021-44980000',
        email: 'supplychain@mihan-dairy.com',
        postalCode: '13998-11223',
        provinceCity: 'تهران / اسلامشهر',
      },
      counterpartySignatory: {
        fullName: 'مهندس بهزاد پایداری',
        position: 'قائم‌مقام مدیرعامل و مدیر ارشد زنجیره تأمین',
        nationalCode: '0071298451',
        phone: '09121984421',
        email: 'b.paydari@mihan-dairy.com',
        signatureStatus: 'signed',
        signedAt: '۱۴۰۴/۱۲/۲۸',
      },
      internalSignatory: {
        fullName: 'مهندس محمدرضا شایگان',
        position: 'مدیرعامل',
        nationalCode: '0047219803',
        phone: '09122334455',
        email: 'shayegan@pg-logistics.ir',
        signatureStatus: 'signed',
        signedAt: '۱۴۰۴/۱۲/۲۹',
      },
      counterpartyRole: 'enterprise_customer',
      internalDepartment: 'واحد تخصصی لجستیک زنجیره سرد و دارویی',
    },

    // 3. Duration
    duration: {
      startDate: '۱۴۰۵/۰۱/۰۱',
      endDate: '۱۴۰۶/۰۱/۰۱',
      durationMonths: 12,
      isAutoRenewable: true,
      nonRenewalNoticeDays: 45,
      expirationAlertDays: 60,
      renewalCount: 3,
    },

    // 4. Financial Terms
    financialTerms: {
      totalAmountToman: 28500000000,
      currency: 'IRT',
      paymentMethod: 'per_ton_km',
      agreedCommissionPercent: 5.0,
      latePaymentPenaltyPercentPerDay: 0.12,
      priceAdjustmentClause: 'تعدیل فصلی بر اساس نوسان قیمت سوخت دیزل و نرخ قطعات یدکی ترموکینگ (یونیت سرمایشی).',
      advancePaymentToman: 3000000000,
      guaranteeDepositToman: 2850000000,
      guaranteeType: 'bank_guarantee',
      guaranteeDocNumber: 'BG-PAS-881920-MHN',
      installments: [
        {
          id: 'inst-m-1',
          installmentNumber: 1,
          titleFa: 'پیش‌پرداخت استقرار ۵۰ دستگاه کشنده یخچال‌دار',
          amountToman: 3000000000,
          dueDate: '۱۴۰۵/۰۱/۱۰',
          status: 'paid',
          paidDate: '۱۴۰۵/۰۱/۰۸',
        },
        {
          id: 'inst-m-2',
          installmentNumber: 2,
          titleFa: 'تسویه صورت‌وضعیت سه‌ماهه اول فصل گرما (بهار ۱۴۰۵)',
          amountToman: 6500000000,
          dueDate: '۱۴۰۵/۰۴/۱۵',
          status: 'paid',
          paidDate: '۱۴۰۵/۰۴/۱۲',
        },
        {
          id: 'inst-m-3',
          installmentNumber: 3,
          titleFa: 'تسویه صورت‌وضعیت اوج مصرف بستنی (تابستان ۱۴۰۵)',
          amountToman: 8500000000,
          dueDate: '۱۴۰۵/۰۷/۱۵',
          status: 'paid',
          paidDate: '۱۴۰۵/۰۷/۱۰',
        },
      ],
    },

    // 5. Scope of Service
    scopeOfService: {
      description: 'حمل روزانه محصولات لبنیاتی و بستنی از کارخانجات اسلامشهر به کلیه هاب‌های توزیع استانی (شیراز، تبریز، مشهد، اهواز، زاهدان، کرمانشاه) با تضمین حفظ دمای منفی ۱۸ درجه.',
      coveredRoutesOrZones: [
        'اسلامشهر به شیراز و بوشهر',
        'اسلامشهر به مشهد و بیرجند',
        'اسلامشهر به تبریز و اردبیل',
        'اسلامشهر به اهواز و آبادان',
      ],
      allowedCommodityTypes: [
        'بستنی صنعتی و مغزدار (-۱۸ الی -۲۵ درجه)',
        'کره گیاهی و حیوانی (-۱۲ الی -۱۸ درجه)',
        'شیر پاستوریزه، ماست و پنیر سنتی (+۲ الی +۴ درجه)',
        'دسرهای لبنی و خامه‌های فرآوری شده',
      ],
      allocatedFleetCapacity: {
        truckCount: 48,
        vehicleTypes: ['کشنده یخچال‌دار ۲۴ تن', 'کامیون یخچال‌دار ۱۰ چرخ'],
        monthlyMinTonnage: 5000,
      },
      sla: {
        onTimeDeliveryPercent: 99.4,
        damageFreePercent: 99.95,
        dispatchResponseTimeMinutes: 20,
        maxUnloadingDelayHours: 3,
        trackingAvailability: 'مانیتورینگ سنسورهای IoT دیتالاگر دما هر ۶۰ ثانیه به صورت خودکار',
      },
    },

    // 6. Obligations & Liability
    obligations: {
      firstPartyObligations: [
        'کالیبراسیون منظم یونیت‌های سرمایشی و ارائه برگه سلامت فنی ترموکینگ قبل از هر اعزام.',
        'ثبت پیوسته دمای کابین حمل و اعلام آلارم فوری در صورت انحراف بیش از ۲ درجه سانتی‌گراد.',
        'رانندگان آموزش‌دیده در پروتکل‌های بهداشتی و دارای کارت سلامت و کارت اصناف مواد غذایی.',
      ],
      secondPartyObligations: [
        'تثبیت دمای محصول قبل از بارگیری به میزان استاندارد موردنیاز.',
        'تخلیه بار در مقصد بدون ایجاد توقف طولانی و اتصال به برق پشتیبان در صورت توقف.',
      ],
      liabilityInsurance: {
        policyNumber: 'INS-ASIA-1405-COLD-88219',
        insurerName: 'بیمه آسیا',
        coverageAmountToman: 10000000000,
        expiryDate: '۱۴۰۶/۰۱/۰۱',
        status: 'active',
        coverageTypeFa: 'بیمه تخصصی فساد کالا و نقص یونیت سرمایشی در حمل‌ونقل',
      },
      indemnityConditions: 'در صورت از کار افتادن سیستم سرمایشی و افت کیفیت محموله، جبران ۱۰۰ درصد ارزش محموله بر عهده شرکت حمل‌ونقل و بیمه‌گر خواهد بود.',
      liabilityCapToman: 10000000000,
    },

    // 7. Termination Clauses
    terminationClauses: {
      unilateralTerminationAllowed: true,
      unilateralNoticePeriodDays: 45,
      earlyTerminationPenaltyToman: 1500000000,
      immediateTerminationTriggers: [
        'فساد بیش از ۲ پارت محموله متوالی به دلیل نقص موتور سرمایشی یا سهل‌انگاری راننده.',
        'تاخیر بیش از ۱۲ ساعت در تحویل محمولات با تاریخ انقضای کوتاه.',
      ],
    },

    // 8. Documents & Attachments
    documents: {
      mainContractFile: {
        id: 'doc-main-mhn',
        title: 'قرارداد رسمی زنجیره سرد و توزیع لبنیات میهن (امضا شده)',
        fileName: 'Contract_Mihan_ColdChain_1405.pdf',
        fileType: 'pdf',
        fileSizeMb: 3.9,
        uploadDate: '۱۴۰۴/۱۲/۲۹',
        isMainContract: true,
        uploadedBy: 'مدیریت قراردادهای تجاری',
        signatureVerified: true,
      },
      technicalAttachments: [
        {
          id: 'doc-mhn-att1',
          title: 'پیوست فنی: جدول تلورانس دمایی انواع محصولات لبنی و بستنی',
          fileName: 'Mihan_Temperature_Tolerance_Specs.pdf',
          fileType: 'pdf',
          fileSizeMb: 1.2,
          uploadDate: '۱۴۰۴/۱۲/۲۸',
          isMainContract: false,
          uploadedBy: 'واحد تضمین کیفیت',
          signatureVerified: true,
        },
      ],
      versionHistory: [
        {
          version: 1,
          date: '۱۴۰۴/۱۲/۲۵',
          modifiedBy: 'کارشناس لجستیک زنجیره سرد',
          changeSummaryFa: 'تنظیم پیش‌نویس با لحاظ بندهای سنسور آنلاین IoT و پروتکل‌های بهداشتی.',
        },
      ],
      amendments: [],
    },

    // 9. Legal & Compliance
    legalCompliance: {
      governingLaw: 'قوانین عمومی تجارت ایران و ضوابط بهداشتی سازمان غذا و دارو',
      disputeResolutionForum: 'arbitration',
      arbitrationCenterName: 'هیئت داوری تخصصی انجمن صنایع فرآورده‌های لبنی ایران',
      legalDepartmentApproval: {
        status: 'approved',
        approvedByLegalOfficer: 'وکیل حقوقی شرکت (آقای دکتر حسینی)',
        approvalDate: '۱۴۰۴/۱۲/۲۸',
        notesFa: 'بندهای بیمه فساد کالا و حدود مسئولیت تایید گردید.',
      },
      officialRegistrationNumber: 'RMTO-COLD-MHN-8802',
    },

    // 10. System Relations
    systemRelations: {
      linkedFleetDrivers: [
        {
          driverId: 'drv-mhn-01',
          driverName: 'سید رضا حسینی‌پور',
          plateNumber: '۲۱ ع ۷۸۹ - ایران ۲۱',
          vehicleType: 'کشنده یخچال‌دار',
          smartCardNo: '۳۴۱۱۰۹۸',
          assignedDate: '۱۴۰۵/۰۱/۰۲',
          status: 'active',
        },
      ],
      linkedInvoices: [
        {
          invoiceId: 'inv-mhn-01',
          invoiceNumber: 'INV-MHN-140501-12',
          amountToman: 2350000000,
          issueDate: '۱۴۰۵/۰۱/۳۱',
          status: 'paid',
          descriptionFa: 'صورت‌حساب سرویس‌های یخچال‌دار فروردین ۱۴۰۵',
        },
      ],
      performanceReport: {
        totalShipmentsCompleted: 310,
        onTimeDeliveryRate: 99.6,
        damageClaimsCount: 0,
        customerSatisfactionScore: 4.95,
        activeDisputesCount: 0,
        totalTonnageHauled: 7200,
      },
      activityNotes: [
        {
          id: 'note-mhn-1',
          authorName: 'مسئول شیفت زنجیره سرد',
          authorRole: 'پایش IoT',
          date: '۱۴۰۵/۰۴/۱۵',
          contentFa: 'تمام داده‌های دمایی لاگ شده ماه خرداد با انحراف زیر ۰.۳ درجه ثبت گردید.',
          category: 'operational',
        },
      ],
    },

    // 11. Audit Fields
    auditFields: {
      createdBy: 'مهندس شایگان',
      createdAt: '۱۴۰۴/۱۲/۲۸ ۱۰:۰۰',
      lastModifiedBy: 'مهندس بهزاد پایداری',
      lastModifiedAt: '۱۴۰۴/۱۲/۲۹ ۱۷:۴۰',
      confidentialityLevel: 'confidential',
      auditTrail: [
        {
          timestamp: '۱۴۰۴/۱۲/۲۸ ۱۰:۰۰',
          user: 'محمدرضا شایگان',
          action: 'CREATE_CONTRACT',
          detailsFa: 'ثبت قرارداد جدید لجستیک زنجیره سرد میهن.',
        },
      ],
    },

    // Legacy volume bands for Simulator
    minimumCommitmentTons: 60000,
    penaltyClausePerTonShortfallToman: 38000,
    fuelIndexAbsorptionPercent: 40,
    volumeBands: [
      { minTonsPerMonth: 0, maxTonsPerMonth: 1500, discountPercent: 0, unitRateDiscountTomanPerTonKm: 0 },
      { minTonsPerMonth: 1501, maxTonsPerMonth: 6000, discountPercent: 6.0, unitRateDiscountTomanPerTonKm: 2000 },
      { minTonsPerMonth: 6001, maxTonsPerMonth: 20000, discountPercent: 10.5, unitRateDiscountTomanPerTonKm: 3400 },
    ],
    negotiatedBaseOverrides: {
      'تهران-بندرعباس:کشنده یخچال‌دار': 46000000,
      'رشت-بندرعباس:کشنده یخچال‌دار': 53500000,
    },
    effectiveFrom: '2026-03-21',
    effectiveTo: '2027-03-20',
    status: 'Active',
    version: 1,
    customerNameFa: 'گروه صنایع غذایی و لبنیات میهن',
    customerNameEn: 'Mihan Food & Dairy Industries Group',
    customerCode: 'MHN-8802',
    industry: 'صنایع غذایی و زنجیره سرد',
    tier: 'Platinum',
  },

  {
    id: 'cnt-mobarakeh-steel',
    contractId: 'CNT-1405-MSC-5050',
    displayId: 'CT-505',

    // 1. General Info
    generalInfo: {
      contractId: 'CNT-1405-MSC-5050',
      contractNumber: 'MSC-TRN-1405/901',
      title: 'قرارداد پیمانکاری و لجستیک سنگین اسلب، کلاف گرم و محصولات فولادی',
      contractType: 'fleet_contracting',
      status: 'active',
      category: 'domestic',
      tags: ['فولاد', 'کلاف گرم', 'تریلر کفی سنگین', 'کمرشکن'],
      summaryFa: 'پیمانکاری بارگیری و حمل سالانه ۱۵۰٬۰۰۰ تن اسلب، ورق و کلاف فولادی از خطوط نورد مبارکه به بنادر جنوبی، کارخانجات خودروسازی و قطب‌های صنعتی کشور.',
      departmentScope: 'معاونت خرید و حمل مواد و محصولات مجتمع فولاد مبارکه',
    },

    // 2. Parties
    parties: {
      counterparty: {
        companyName: 'شرکت فولاد مبارکه اصفهان',
        companyCode: 'MSC-7714',
        nationalId: '10260289410',
        economicCode: '411234981726',
        registrationNumber: '28941',
        address: 'اصفهان، میدان آزادی، خیابان سعادت‌آباد، ساختمان مرکزی فولاد مبارکه',
        phone: '031-52732222',
        email: 'sales-transport@msc.ir',
        postalCode: '81648-11111',
        provinceCity: 'اصفهان / مبارکه',
      },
      counterpartySignatory: {
        fullName: 'دکتر علیرضا فولادگر',
        position: 'معاونت فروش و بازاریابی مجتمع',
        nationalCode: '1289123456',
        phone: '09131119022',
        email: 'a.fouladgar@msc.ir',
        signatureStatus: 'signed',
        signedAt: '۱۴۰۴/۱۲/۲۰',
      },
      internalSignatory: {
        fullName: 'مهندس محمدرضا شایگان',
        position: 'مدیرعامل',
        nationalCode: '0047219803',
        phone: '09122334455',
        email: 'shayegan@pg-logistics.ir',
        signatureStatus: 'signed',
        signedAt: '۱۴۰۴/۱۲/۲۲',
      },
      counterpartyRole: 'enterprise_customer',
      internalDepartment: 'مدیریت ناوگان سنگین و محمولات ترافیکی',
    },

    // 3. Duration
    duration: {
      startDate: '۱۴۰۵/۰۱/۰۱',
      endDate: '۱۴۰۶/۰۱/۰۱',
      durationMonths: 12,
      isAutoRenewable: true,
      nonRenewalNoticeDays: 60,
      expirationAlertDays: 60,
      renewalCount: 4,
    },

    // 4. Financial Terms
    financialTerms: {
      totalAmountToman: 68000000000, // 68 Billion Toman
      currency: 'IRT',
      paymentMethod: 'per_ton_km',
      agreedCommissionPercent: 3.8,
      latePaymentPenaltyPercentPerDay: 0.15,
      priceAdjustmentClause: 'تعدیل مستقیم بر اساس قیمت پایه بیلت در بورس کالا، میانگین شاخص کرایه انجمن شرکت‌های حمل‌ونقل و تورم گازوئیل.',
      advancePaymentToman: 8000000000,
      guaranteeDepositToman: 6800000000,
      guaranteeType: 'bank_guarantee',
      guaranteeDocNumber: 'BG-SEP-1405-MSC-889',
      installments: [
        {
          id: 'inst-msc-1',
          installmentNumber: 1,
          titleFa: 'پیش‌پرداخت تجهیز ۱۰۰ دستگاه تریلر کفی اختصاصی',
          amountToman: 8000000000,
          dueDate: '۱۴۰۵/۰۱/۱۵',
          status: 'paid',
          paidDate: '۱۴۰۵/۰۱/۱۴',
        },
      ],
    },

    // 5. Scope of Service
    scopeOfService: {
      description: 'اختصاص حداقل ۸۰ دستگاه تریلر کفی استاندارد مجهز به رول‌گیر و قفل کانتینر جهت حمل کلاف و اسلب به مقاصد بنادر بوشهر، بندرعباس، امام خمینی، تبریز و ساوه.',
      coveredRoutesOrZones: [
        'مبارکه اصفهان به بندر امام خمینی (صادرات اسلب)',
        'مبارکه اصفهان به بندرعباس (صادرات ورق)',
        'مبارکه اصفهان به تهران و ساوه (صنایع خودروسازی)',
        'مبارکه اصفهان به تبریز (لوله و پروفیل)',
      ],
      allowedCommodityTypes: [
        'کلاف نورد گرم و سرد (Coil)',
        'اسلب فولادی سنگین (Slab)',
        'ورق‌های گالوانیزه و رنگی بسته‌بندی شده',
        'تیرآهن، میلگرد و شمش فولادی',
      ],
      allocatedFleetCapacity: {
        truckCount: 95,
        vehicleTypes: ['تریلر کفی مجهز به رول‌گیر ۲۶ تن', 'کمرشکن ۵ تا ۷ محور ترافیکی', 'تریلی لبه‌دار صنعتی'],
        monthlyMinTonnage: 12500,
      },
      sla: {
        onTimeDeliveryPercent: 98.5,
        damageFreePercent: 99.85,
        dispatchResponseTimeMinutes: 45,
        maxUnloadingDelayHours: 8,
        trackingAvailability: 'سامانه مدیریت ناوگان هوشمند FMS متصل به گیت‌های باسکول فولاد',
      },
    },

    // 6. Obligations & Liability
    obligations: {
      firstPartyObligations: [
        'استفاده از زنجیرها و جغجغه‌های استاندارد گرید ۸۰ جهت مهاربندی ایمن کلاف‌ها.',
        'رعایت تناژ مجاز محورها و استانداردهای راهداری جهت عدم آسیب به زیرساخت‌ها.',
      ],
      secondPartyObligations: [
        'بارگیری صحیح و تراز بر روی محورهای تریلر توسط جرثقیل‌های سقفی مجهز به مگنت و C-Hook.',
        'ارائه گواهی تایید بارگیری ایمن و پلمپ الکترونیک قبل از خروج.',
      ],
      liabilityInsurance: {
        policyNumber: 'INS-ALB-1405-STL-77140',
        insurerName: 'بیمه البرز',
        coverageAmountToman: 25000000000,
        expiryDate: '۱۴۰۶/۰۱/۰۱',
        status: 'active',
        coverageTypeFa: 'بیمه تمام‌خطر حمل محمولات سنگین، سقوط کلاف و حوادث جاده‌ای',
      },
      indemnityConditions: 'خسارات وارده به محمولات ناشی از واژگونی یا پارگی زنجیر مهاربندی طبق نرخ روز بورس کالا تا سقف بیمه‌نامه جبران می‌گردد.',
      liabilityCapToman: 25000000000,
    },

    // 7. Termination Clauses
    terminationClauses: {
      unilateralTerminationAllowed: true,
      unilateralNoticePeriodDays: 60,
      earlyTerminationPenaltyToman: 3500000000,
      immediateTerminationTriggers: [
        'بروز تصادف منجر به مسدودی جاده به علت نقص مهاربندی کلاف‌ها بیش از ۲ بار.',
        'عدم ارائه ضمانت‌نامه معتبر در موعد مقرر.',
      ],
    },

    // 8. Documents & Attachments
    documents: {
      mainContractFile: {
        id: 'doc-msc-main',
        title: 'قرارداد رسمی پیمانکاری حمل فولاد مبارکه ۱۴۰۵ (PDF)',
        fileName: 'Contract_Mobarakeh_Steel_1405_Signed.pdf',
        fileType: 'pdf',
        fileSizeMb: 5.4,
        uploadDate: '۱۴۰۴/۱۲/۲۲',
        isMainContract: true,
        uploadedBy: 'معاونت امور حقوقی',
        signatureVerified: true,
      },
      technicalAttachments: [],
      versionHistory: [
        {
          version: 1,
          date: '۱۴۰۴/۱۲/۲۰',
          modifiedBy: 'مدیر امور قراردادها',
          changeSummaryFa: 'ثبت و تصویب نهایی مناقصه سراسری شماره ۱۴۰۴/MSC/108.',
        },
      ],
      amendments: [],
    },

    // 9. Legal & Compliance
    legalCompliance: {
      governingLaw: 'قوانین مدنی و تجارت جمهوری اسلامی ایران',
      disputeResolutionForum: 'arbitration',
      arbitrationCenterName: 'مرکز داوری کانون وکلای دادگستری اصفهان',
      legalDepartmentApproval: {
        status: 'approved',
        approvedByLegalOfficer: 'مشاور حقوقی فولاد مبارکه',
        approvalDate: '۱۴۰۴/۱۲/۲۱',
      },
      officialRegistrationNumber: 'RMTO-MSC-STEEL-5050',
    },

    // 10. System Relations
    systemRelations: {
      linkedFleetDrivers: [],
      linkedInvoices: [],
      performanceReport: {
        totalShipmentsCompleted: 620,
        onTimeDeliveryRate: 98.9,
        damageClaimsCount: 0,
        customerSatisfactionScore: 4.88,
        activeDisputesCount: 0,
        totalTonnageHauled: 15800,
      },
      activityNotes: [],
    },

    // 11. Audit Fields
    auditFields: {
      createdBy: 'مهندس شایگان',
      createdAt: '۱۴۰۴/۱۲/۲۲ ۰۸:۰۰',
      lastModifiedBy: 'دکتر فولادگر',
      lastModifiedAt: '۱۴۰۴/۱۲/۲۲ ۱۴:۰۰',
      confidentialityLevel: 'top_secret_c_level',
      auditTrail: [
        {
          timestamp: '۱۴۰۴/۱۲/۲۲ ۰۸:۰۰',
          user: 'محمدرضا شایگان',
          action: 'CREATE_CONTRACT',
          detailsFa: 'ثبت قرارداد برنده مناقصه حمل فولاد مبارکه.',
        },
      ],
    },

    minimumCommitmentTons: 150000,
    penaltyClausePerTonShortfallToman: 50000,
    fuelIndexAbsorptionPercent: 60,
    volumeBands: [
      { minTonsPerMonth: 0, maxTonsPerMonth: 5000, discountPercent: 0, unitRateDiscountTomanPerTonKm: 0 },
      { minTonsPerMonth: 5001, maxTonsPerMonth: 15000, discountPercent: 8.0, unitRateDiscountTomanPerTonKm: 2600 },
      { minTonsPerMonth: 15001, maxTonsPerMonth: 50000, discountPercent: 14.0, unitRateDiscountTomanPerTonKm: 4500 },
    ],
    negotiatedBaseOverrides: {
      'اصفهان-بوشهر:تریلر کفی': 21800000,
      'تبریز-چابهار:تریلر کفی': 54500000,
    },
    effectiveFrom: '2026-04-01',
    effectiveTo: '2027-03-29',
    status: 'Active',
    version: 3,
    customerNameFa: 'شرکت فولاد مبارکه اصفهان',
    customerNameEn: 'Mobarakeh Steel Company',
    customerCode: 'MSC-7714',
    industry: 'فولاد و متالورژی سنگین',
    tier: 'Diamond',
  },
];
