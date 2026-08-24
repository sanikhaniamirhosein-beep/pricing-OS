import React, { useState } from 'react';
import {
  X,
  User,
  Truck,
  CreditCard,
  FileCheck2,
  Award,
  ShieldCheck,
  FileText,
  Clock,
  Flame,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Phone,
  Hash,
  Info,
  Calendar,
  Building2,
  ShieldAlert,
  Car,
  UserCheck,
  FileSignature,
  Activity,
  Layers,
  ChevronDown,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CarrierDriver, DriverIdentityDocuments, VehicleFleetDocuments } from '../../../types/pricing';
import { InsuranceCompanyPickerDropdown } from '../menus/InsuranceCompanyPickerDropdown';
import { VehiclePickerDropdown } from '../menus/VehiclePickerDropdown';
import { ModernSelect, ModernSelectOption } from '../menus/ModernSelect';

interface AddDriverFleetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (driver: CarrierDriver) => void;
  currentOrgId?: string;
}

export const AddDriverFleetModal: React.FC<AddDriverFleetModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentOrgId,
}) => {
  const [driverFormStep, setDriverFormStep] = useState<'identity' | 'vehicle'>('identity');
  const [driverFullName, setDriverFullName] = useState('');
  const [isSimulatingInquiry, setIsSimulatingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  const initialDriverIdentity: DriverIdentityDocuments = {
    nationalIdNumber: '',
    birthCertificateNo: '',
    birthDate: '',
    mobilePhone: '',
    nationalCardUploaded: true,
    birthCertificateUploaded: true,
    smartCardNumber: '',
    smartCardIssueDate: '',
    smartCardExpiryDate: '',
    smartCardStatus: 'valid',
    licenseType: 'grade1',
    licenseNumber: '',
    licenseExpiryDate: '',
    healthCardNumber: '',
    healthCardExpiryDate: '',
    healthCardValid: true,
    noCriminalRecordNumber: '',
    noCriminalRecordIssueDate: '',
    drugTestPassed: true,
    drugTestDate: '',
    hasLogbook: false,
    logbookNumber: '',
    logbookLastCheckDate: '',
  };

  const initialVehicleDocs: VehicleFleetDocuments = {
    vehicleType: 'تریلر کفی',
    plateNumber: '۶۲ ع ۸۹۱ - ایران ۱۳',
    vinCode: '',
    greenSheetDocNo: '',
    ownerName: '',
    ownershipType: 'self',
    fleetSmartCardNumber: '',
    fleetSmartCardExpiryDate: '',
    maxAllowedCapacityTons: 24,
    technicalInspectionDocNo: '',
    technicalInspectionCenterName: '',
    technicalInspectionExpiryDate: '',
    thirdPartyInsuranceProvider: 'بیمه ایران',
    thirdPartyPolicyNumber: '',
    thirdPartyExpiryDate: '',
    bodyInsurancePolicyNumber: '',
    bodyInsuranceExpiryDate: '',
    hasTankInspectionPermit: false,
    tankType: 'cng',
    tankInspectionPermitNo: '',
    tankPermitExpiryDate: '',
  };

  const [driverIdentity, setDriverIdentity] = useState<DriverIdentityDocuments>(initialDriverIdentity);
  const [vehicleDocs, setVehicleDocs] = useState<VehicleFleetDocuments>(initialVehicleDocs);

  // License plate segments for authentic Iranian commercial format
  const [platePart1, setPlatePart1] = useState('۶۲');
  const [plateLetter, setPlateLetter] = useState('ع');
  const [platePart2, setPlatePart2] = useState('۸۹۱');
  const [plateIranCode, setPlateIranCode] = useState('۱۳');
  const [isPlateLetterOpen, setIsPlateLetterOpen] = useState(false);

  const updateCombinedPlate = (p1: string, pl: string, p2: string, ic: string) => {
    setVehicleDocs((prev) => ({
      ...prev,
      plateNumber: `${p1} ${pl} ${p2} - ایران ${ic}`,
    }));
  };

  const handleSimulateRMTOInquiry = () => {
    if (!driverIdentity.nationalIdNumber && !driverIdentity.smartCardNumber) {
      alert('لطفاً ابتدا کد ملی یا شماره کارت هوشمند راننده را وارد فرمایید.');
      return;
    }
    setIsSimulatingInquiry(true);
    setTimeout(() => {
      setIsSimulatingInquiry(false);
      setInquirySuccess(true);
      if (!driverIdentity.licenseNumber) {
        setDriverIdentity((prev) => ({
          ...prev,
          licenseNumber: 'LIC-' + Math.floor(10000000 + Math.random() * 90000000),
          licenseExpiryDate: '۱۴۰۸/۰۴/۱۵',
          smartCardExpiryDate: '۱۴۰۷/۱۱/۲۰',
          healthCardNumber: 'HLT-1405-9921',
          healthCardExpiryDate: '۱۴۰۶/۰۸/۱۰',
        }));
      }
    }, 900);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverFullName.trim()) {
      alert('لطفاً نام و نام خانوادگی راننده را وارد کنید.');
      return;
    }

    const newDriver: CarrierDriver = {
      id: `drv-pg-${Date.now()}`,
      orgId: currentOrgId || 'org-carrier-pg-freight',
      fullName: driverFullName,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      rating: 5.0,
      totalTrips: 0,
      status: 'active',
      joinedDate: new Date().toLocaleDateString('fa-IR'),
      identityDocs: {
        ...driverIdentity,
        smartCardStatus: 'valid',
        healthCardValid: true,
      },
      vehicleDocs: {
        ...vehicleDocs,
      },
    };

    onSave(newDriver);
    onClose();
  };

  // License Type Options
  const licenseTypeOptions: ModernSelectOption[] = [
    {
      value: 'grade1',
      label: 'پایه یک (تریلر، کشنده سنگین و کامیون جفت)',
      subLabel: 'مجاز برای رانندگی کلیه وسایل نقلیه باربری سنگین و ترانزیت',
      badge: 'پایه ۱ تجاری',
      icon: <Award className="w-4 h-4 text-sky-600" />,
    },
    {
      value: 'grade2',
      label: 'پایه دو (نیمه‌سنگین، خاور ۶ تن و کامیونت)',
      subLabel: 'حداکثر ظرفیت بارگیری تا ۶ تن درون و برون‌شهری',
      badge: 'پایه ۲ نیمه‌سنگین',
      icon: <Truck className="w-4 h-4 text-emerald-600" />,
    },
    {
      value: 'special',
      label: 'ویژه (جرثقیل، بوژی، کمرشکن سنگین)',
      subLabel: 'هدایت محمولات فوق‌سنگین، ترافیکی و ماشین‌آلات راه‌سازی',
      badge: 'ویژه ترافیکی',
      icon: <Layers className="w-4 h-4 text-amber-600" />,
    },
  ];

  // Ownership Type Options
  const ownershipTypeOptions: ModernSelectOption[] = [
    {
      value: 'self',
      label: 'خودمالک (تحت پیمان با راننده)',
      subLabel: 'مالکیت رسمی سند به نام راننده طرف قرارداد دیسپاچینگ',
      badge: 'پیمانی',
      icon: <UserCheck className="w-4 h-4 text-amber-600" />,
    },
    {
      value: 'company',
      label: 'ملکی مستقیم سازمان حمل‌ونقل',
      subLabel: 'سند به نام شرکت حمل‌ونقل ثبت و صادر شده است',
      badge: 'ملکی شرکتی',
      icon: <Building2 className="w-4 h-4 text-emerald-600" />,
    },
    {
      value: 'leased',
      label: 'استیجاری / قرارداد شرکتی بلندمدت',
      subLabel: 'اجاره به شرط تملیک یا قرارداد اجاره معتبر شرکتی',
      badge: 'استیجاری',
      icon: <FileSignature className="w-4 h-4 text-sky-600" />,
    },
  ];

  // Drug Test Options
  const drugTestOptions: ModernSelectOption[] = [
    {
      value: 'yes',
      label: 'منفی (مورد تأیید آزمایشگاه مرجع و طب کار راهداری)',
      subLabel: 'گواهی عدم اعتیاد ۱۰ گانه با تأییدیه سیستمی معتبر',
      badge: 'تأیید شده',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
    },
    {
      value: 'no',
      label: 'در انتظار نتیجه آزمایشگاه / نامعتبر',
      subLabel: 'پرونده تا ثبت تاییدیه آزمایشگاه معلق خواهد ماند',
      badge: 'در انتظار',
      icon: <ShieldAlert className="w-4 h-4 text-amber-600" />,
    },
  ];

  // Tank / ADR Permit Options
  const tankTypeOptions: ModernSelectOption[] = [
    {
      value: 'cng',
      label: 'مخزن گازسوز CNG استاندارد',
      subLabel: 'دارای تاییدیه بازرسی چشمی و هیدروستاتیک ادواری',
      badge: 'دوگانه‌سوز',
      icon: <Flame className="w-4 h-4 text-sky-600" />,
    },
    {
      value: 'hazardous_adr',
      label: 'تانکر حمل مواد شیمیایی خطرناک (ADR)',
      subLabel: 'شامل کلاس‌های ۹ گانه کالای خطرناک با گواهی بازرسی فنی',
      badge: 'ADR شیمیایی',
      icon: <ShieldAlert className="w-4 h-4 text-rose-600" />,
    },
    {
      value: 'chemical_liquid',
      label: 'تانکر حمل مایعات نفتی و سوخت',
      subLabel: 'مخزن حمل بنزین، گازوئیل، مازوت و هیدروکربن‌های نفتی',
      badge: 'مواد سوختی',
      icon: <Flame className="w-4 h-4 text-amber-600" />,
    },
  ];

  const commercialPlateLetters = [
    { code: 'ع', label: 'ع (عمومی جاده‌ای - ناوگان باربری تجاری)', desc: 'کامیون، تریلر و کشنده‌های عمومی' },
    { code: 'ت', label: 'ت (ترانزیت بین‌المللی - CMR / TIR)', desc: 'حمل بار بین‌المللی و کارنه تیر' },
    { code: 'ک', label: 'ک (ادوات و ماشین‌آلات کشاورزی)', desc: 'ماشین‌آلات ترابری کشاورزی' },
    { code: 'پ', label: 'پ (پلیس و ناوگان انتظامی پشتیبانی)', desc: 'ناوگان لجستیک انتظامی' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto"
      >
        {/* Header with modern gradient accent */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-emerald-50 via-slate-50 to-white text-slate-900 flex items-center justify-between shrink-0 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center font-bold shadow-md ring-4 ring-emerald-500/10">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base text-slate-950 font-title">
                  افزودن و ثبت جامع پرونده راننده و ناوگان
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                  سامانه راهداری (RMTO)
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                تکمیل ۱۱ مدرک قانونی الزامی جهت احراز هویت، صدور بارنامه برخط و پوشش بیمه‌ای
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Navigation Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setDriverFormStep('identity')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                driverFormStep === 'identity'
                  ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900/20'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                driverFormStep === 'identity' ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'
              }`}>
                ۱
              </div>
              <FileCheck2 className="w-3.5 h-3.5 text-amber-400" />
              <span>مدارک هویت، سلامت و صلاحیت راننده</span>
            </button>

            <ChevronLeft className="w-4 h-4 text-slate-400 hidden sm:block" />

            <button
              type="button"
              onClick={() => setDriverFormStep('vehicle')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                driverFormStep === 'vehicle'
                  ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900/20'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                driverFormStep === 'vehicle' ? 'bg-emerald-400 text-slate-950' : 'bg-slate-200 text-slate-700'
              }`}>
                ۲
              </div>
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              <span>مدارک فنی، مالکیتی و بیمه‌ای ناوگان</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSimulateRMTOInquiry}
              disabled={isSimulatingInquiry}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isSimulatingInquiry ? 'در حال استعلام برخط...' : 'استعلام خودکار راهداری (RMTO)'}</span>
            </button>
          </div>
        </div>

        {/* Inquiry feedback notification */}
        {inquirySuccess && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between text-xs text-emerald-950 shadow-2xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>استعلام آنلاین با موفقیت انجام شد: کارت هوشمند، سلامت و صلاحیت رانندگی در سامانه راهداری معتبر شناخته شد.</span>
            </div>
            <button
              type="button"
              onClick={() => setInquirySuccess(false)}
              className="text-emerald-700 hover:text-emerald-900 text-[11px] font-bold"
            >
              بستن
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          {driverFormStep === 'identity' ? (
            /* ================= STEP 1: DRIVER IDENTITY & QUALIFICATIONS ================= */
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* 1. Basic Personal Information */}
              <div className="p-4.5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <User className="w-4 h-4 text-amber-600" />
                    <span>۱. مشخصات فردی و هویتی راننده</span>
                  </div>
                  <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full font-bold border border-amber-200">
                    الزامی جهت صدور حواله
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-bold text-slate-700">نام و نام خانوادگی راننده: <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: علیرضا قربانی دلاور"
                      value={driverFullName}
                      onChange={(e) => setDriverFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900 font-bold outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">شماره همراه (OTP بارنامه): <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="0912xxxxxxx"
                      value={driverIdentity.mobilePhone}
                      onChange={(e) => setDriverIdentity({ ...driverIdentity, mobilePhone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900 font-mono outline-none"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">تاریخ تولد راننده:</label>
                    <input
                      type="text"
                      placeholder="۱۳۶۲/۰۷/۱۵"
                      value={driverIdentity.birthDate}
                      onChange={(e) => setDriverIdentity({ ...driverIdentity, birthDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">کد ملی راننده (۱۰ رقم): <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      maxLength={10}
                      placeholder="0078945612"
                      value={driverIdentity.nationalIdNumber}
                      onChange={(e) => setDriverIdentity({ ...driverIdentity, nationalIdNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900 font-mono outline-none"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">شماره شناسنامه:</label>
                    <input
                      type="text"
                      placeholder="۴۸۲۹۱"
                      value={driverIdentity.birthCertificateNo}
                      onChange={(e) => setDriverIdentity({ ...driverIdentity, birthCertificateNo: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900 font-mono outline-none"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Driver RMTO Smart Card */}
              <div className="p-4.5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>۲. کارت هوشمند رانندگی حرفه‌ای (سازمان راهداری)</span>
                  </div>
                  <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                    استعلام برخط فعال
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">شماره کارت هوشمند (۷ رقم): <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="۲۴۹۸۱۰۰"
                      value={driverIdentity.smartCardNumber}
                      onChange={(e) => setDriverIdentity({ ...driverIdentity, smartCardNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 font-mono font-bold outline-none"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">تاریخ صدور کارت هوشمند:</label>
                    <input
                      type="text"
                      placeholder="۱۴۰۱/۰۴/۱۵"
                      value={driverIdentity.smartCardIssueDate}
                      onChange={(e) => setDriverIdentity({ ...driverIdentity, smartCardIssueDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">تاریخ پایان اعتبار کارت هوشمند: <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="۱۴۰۶/۰۴/۱۵"
                      value={driverIdentity.smartCardExpiryDate}
                      onChange={(e) => setDriverIdentity({ ...driverIdentity, smartCardExpiryDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Driver's License & Health Card */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Driver License */}
                <div className="p-4.5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2 text-slate-900 font-bold">
                      <Award className="w-4 h-4 text-sky-600" />
                      <span>۳. گواهینامه رانندگی معتبر</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Modern License Type Selector */}
                    <ModernSelect
                      label="نوع گواهینامه رانندگی:"
                      value={driverIdentity.licenseType}
                      onChange={(val) => setDriverIdentity({ ...driverIdentity, licenseType: val as any })}
                      options={licenseTypeOptions}
                      placeholder="انتخاب رده گواهینامه..."
                    />

                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700">شماره سریال گواهینامه:</label>
                        <input
                          type="text"
                          placeholder="۹۹۰۱۴۴۲۱"
                          value={driverIdentity.licenseNumber}
                          onChange={(e) => setDriverIdentity({ ...driverIdentity, licenseNumber: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 outline-none"
                          dir="ltr"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700">تاریخ انقضای گواهینامه:</label>
                        <input
                          type="text"
                          placeholder="۱۴۰۸/۰۶/۲۰"
                          value={driverIdentity.licenseExpiryDate}
                          onChange={(e) => setDriverIdentity({ ...driverIdentity, licenseExpiryDate: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Health Card */}
                <div className="p-4.5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2 text-slate-900 font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>۴. کارت سلامت طب کار راهداری</span>
                    </div>
                    <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                      معاینات ادواری
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">شماره پرونده کارت سلامت:</label>
                      <input
                        type="text"
                        placeholder="HLT-1405-9921"
                        value={driverIdentity.healthCardNumber}
                        onChange={(e) => setDriverIdentity({ ...driverIdentity, healthCardNumber: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 outline-none"
                        dir="ltr"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">تاریخ پایان اعتبار کارت سلامت:</label>
                      <input
                        type="text"
                        placeholder="۱۴۰۶/۰۸/۱۰"
                        value={driverIdentity.healthCardExpiryDate}
                        onChange={(e) => setDriverIdentity({ ...driverIdentity, healthCardExpiryDate: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Criminal Record, Drug Test & Logbook */}
              <div className="p-4.5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <FileText className="w-4 h-4 text-slate-700" />
                    <span>۵. گواهی عدم سوءپیشینه، آزمایش عدم اعتیاد و دفترچه ثبت ساعت</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">شماره عدم سوءپیشینه:</label>
                    <input
                      type="text"
                      placeholder="CLR-1405-8821"
                      value={driverIdentity.noCriminalRecordNumber}
                      onChange={(e) => setDriverIdentity({ ...driverIdentity, noCriminalRecordNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 outline-none"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">تاریخ صدور عدم سوءپیشینه:</label>
                    <input
                      type="text"
                      placeholder="۱۴۰۴/۱۱/۲۰"
                      value={driverIdentity.noCriminalRecordIssueDate}
                      onChange={(e) => setDriverIdentity({ ...driverIdentity, noCriminalRecordIssueDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 outline-none"
                    />
                  </div>

                  {/* Modern Drug Test Result Selector */}
                  <ModernSelect
                    label="نتیجه آزمایش عدم اعتیاد:"
                    value={driverIdentity.drugTestPassed ? 'yes' : 'no'}
                    onChange={(val) => setDriverIdentity({ ...driverIdentity, drugTestPassed: val === 'yes' })}
                    options={drugTestOptions}
                    placeholder="وضعیت آزمایش..."
                  />
                </div>

                {/* Logbook Toggle */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mt-2 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-600" />
                      <span className="font-bold text-slate-800">دفترچه ثبت ساعت پلیس‌راه</span>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={driverIdentity.hasLogbook}
                        onChange={(e) => setDriverIdentity({ ...driverIdentity, hasLogbook: e.target.checked })}
                        className="rounded text-slate-900 focus:ring-slate-900"
                      />
                      <span className="text-[11px] font-bold text-slate-700">راننده مشمول دفترچه ثبت ساعت است</span>
                    </label>
                  </div>

                  {driverIdentity.hasLogbook && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="space-y-1">
                        <label className="text-slate-600 font-bold">شماره سریال دفترچه ثبت ساعت:</label>
                        <input
                          type="text"
                          placeholder="LOG-POL-55019"
                          value={driverIdentity.logbookNumber}
                          onChange={(e) => setDriverIdentity({ ...driverIdentity, logbookNumber: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-slate-900 outline-none"
                          dir="ltr"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-600 font-bold">تاریخ آخرین مهر کنترل پلیس‌راه:</label>
                        <input
                          type="text"
                          placeholder="۱۴۰۵/۰۵/۱۰"
                          value={driverIdentity.logbookLastCheckDate}
                          onChange={(e) => setDriverIdentity({ ...driverIdentity, logbookLastCheckDate: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Step Navigation to Step 2 */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="button"
                  onClick={() => setDriverFormStep('vehicle')}
                  className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <span>مرحله ۲: مدارک فنی و قانونی وسیله نقلیه (ناوگان)</span>
                  <ChevronLeft className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </div>
          ) : (
            /* ================= STEP 2: VEHICLE FLEET SPECIFICATIONS ================= */
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* 1. Vehicle Type & License Plate */}
              <div className="p-4.5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span>۱. مشخصات فنی، کلاس خودرو و پلاک انتظامی</span>
                  </div>
                  <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                    شناسنامه ناوگان
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    {/* Modern Vehicle Class Picker */}
                    <VehiclePickerDropdown
                      value={vehicleDocs.vehicleType}
                      onChange={(vehName) => setVehicleDocs({ ...vehicleDocs, vehicleType: vehName })}
                      label="نوع و کلاس ناوگان باربری:"
                    />

                    {/* Modern Ownership Type Picker */}
                    <ModernSelect
                      label="نوع مالکیت ناوگان:"
                      value={vehicleDocs.ownershipType}
                      onChange={(val) => setVehicleDocs({ ...vehicleDocs, ownershipType: val as any })}
                      options={ownershipTypeOptions}
                      placeholder="انتخاب نوع مالکیت..."
                    />
                  </div>

                  {/* Authentic Iranian Commercial License Plate Designer */}
                  <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 block text-xs">طراحی و ثبت پلاک انتظامی تجاری ایران:</span>
                      <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                        پلاک زرد عمومی
                      </span>
                    </div>
                    
                    {/* Visual Plate Display */}
                    <div className="bg-amber-400 border-2 border-slate-950 rounded-xl p-2 flex items-center justify-between shadow-md max-w-sm mx-auto w-full transition-transform hover:scale-[1.01]" dir="ltr">
                      {/* Left: Iran Flag & Blue Strip */}
                      <div className="bg-blue-800 text-white rounded px-2 py-1 flex flex-col items-center justify-center text-[9px] font-black shrink-0">
                        <span className="text-[8px]">I.R.</span>
                        <span>IRAN</span>
                      </div>

                      {/* Middle: 2 Digits + Letter 'ع' + 3 Digits */}
                      <div className="flex items-center gap-2 text-slate-950 font-black text-lg sm:text-xl font-mono tracking-wider">
                        <span>{platePart1}</span>
                        <span className="font-sans text-xl px-1.5 py-0.5 bg-amber-500 rounded text-slate-950 font-bold">{plateLetter}</span>
                        <span>{platePart2}</span>
                      </div>

                      {/* Right: Iran Code Box */}
                      <div className="border-l-2 border-slate-950 pl-2 text-center text-slate-950">
                        <span className="text-[9px] block font-bold font-sans">ایران</span>
                        <span className="font-mono font-black text-base">{plateIranCode}</span>
                      </div>
                    </div>

                    {/* Quick Input Fields for Plate */}
                    <div className="grid grid-cols-4 gap-2" dir="rtl">
                      <div>
                        <label className="text-[10px] text-slate-500 font-bold block mb-1">دو رقم اول:</label>
                        <input
                          type="text"
                          maxLength={2}
                          value={platePart1}
                          onChange={(e) => {
                            setPlatePart1(e.target.value);
                            updateCombinedPlate(e.target.value, plateLetter, platePart2, plateIranCode);
                          }}
                          className="w-full text-center py-1.5 bg-white border border-slate-300 rounded-xl font-mono font-bold text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>

                      {/* Modern Plate Letter Dropdown */}
                      <div className="relative">
                        <label className="text-[10px] text-slate-500 font-bold block mb-1">حرف پلاک:</label>
                        <button
                          type="button"
                          onClick={() => setIsPlateLetterOpen(!isPlateLetterOpen)}
                          className="w-full text-center py-1.5 px-1 bg-white border border-slate-300 hover:border-amber-400 rounded-xl font-bold text-xs flex items-center justify-between cursor-pointer"
                        >
                          <span className="flex-1 font-bold text-amber-800">{plateLetter}</span>
                          <ChevronDown className="w-3 h-3 text-slate-400" />
                        </button>

                        <AnimatePresence>
                          {isPlateLetterOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 4 }}
                              className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-1 divide-y divide-slate-100 text-right"
                            >
                              {commercialPlateLetters.map((pl) => (
                                <button
                                  key={pl.code}
                                  type="button"
                                  onClick={() => {
                                    setPlateLetter(pl.code);
                                    updateCombinedPlate(platePart1, pl.code, platePart2, plateIranCode);
                                    setIsPlateLetterOpen(false);
                                  }}
                                  className={`w-full p-2 text-right rounded-lg text-xs flex items-start gap-2 hover:bg-slate-50 cursor-pointer ${
                                    plateLetter === pl.code ? 'bg-amber-50 font-bold text-amber-950' : 'text-slate-700'
                                  }`}
                                >
                                  <span className="w-5 h-5 rounded bg-amber-400 text-slate-950 font-bold flex items-center justify-center shrink-0">
                                    {pl.code}
                                  </span>
                                  <div>
                                    <span className="block font-bold text-[11px]">{pl.label}</span>
                                    <span className="text-[9px] text-slate-400 block">{pl.desc}</span>
                                  </div>
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-500 font-bold block mb-1">سه رقم:</label>
                        <input
                          type="text"
                          maxLength={3}
                          value={platePart2}
                          onChange={(e) => {
                            setPlatePart2(e.target.value);
                            updateCombinedPlate(platePart1, plateLetter, e.target.value, plateIranCode);
                          }}
                          className="w-full text-center py-1.5 bg-white border border-slate-300 rounded-xl font-mono font-bold text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 font-bold block mb-1">کد شهر ایران:</label>
                        <input
                          type="text"
                          maxLength={2}
                          value={plateIranCode}
                          onChange={(e) => {
                            setPlateIranCode(e.target.value);
                            updateCombinedPlate(platePart1, plateLetter, platePart2, e.target.value);
                          }}
                          className="w-full text-center py-1.5 bg-white border border-slate-300 rounded-xl font-mono font-bold text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Registration & Smart Card */}
              <div className="p-4.5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <CreditCard className="w-4 h-4 text-sky-600" />
                    <span>۲. کارت هوشمند ناوگان و اسناد مالکیتی (برگ سبز)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">شماره کارت هوشمند ناوگان:</label>
                    <input
                      type="text"
                      placeholder="۳۳۹۱۰۸۴"
                      value={vehicleDocs.fleetSmartCardNumber}
                      onChange={(e) => setVehicleDocs({ ...vehicleDocs, fleetSmartCardNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 outline-none"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">تاریخ انقضای هوشمند ناوگان:</label>
                    <input
                      type="text"
                      placeholder="۱۴۰۶/۰۸/۰۱"
                      value={vehicleDocs.fleetSmartCardExpiryDate}
                      onChange={(e) => setVehicleDocs({ ...vehicleDocs, fleetSmartCardExpiryDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">ظرفیت ناخالص مجاز (تن):</label>
                    <input
                      type="number"
                      placeholder="24"
                      value={vehicleDocs.maxAllowedCapacityTons}
                      onChange={(e) => setVehicleDocs({ ...vehicleDocs, maxAllowedCapacityTons: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">شماره شاسی / VIN (۱۷ رقم):</label>
                    <input
                      type="text"
                      maxLength={17}
                      placeholder="NAAB22EX8LP449012"
                      value={vehicleDocs.vinCode}
                      onChange={(e) => setVehicleDocs({ ...vehicleDocs, vinCode: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 outline-none"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">سریال سند مالکیت (برگ سبز):</label>
                    <input
                      type="text"
                      placeholder="GS-882190-IR"
                      value={vehicleDocs.greenSheetDocNo}
                      onChange={(e) => setVehicleDocs({ ...vehicleDocs, greenSheetDocNo: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 outline-none"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">نام مالک طبق سند رسمی:</label>
                    <input
                      type="text"
                      placeholder="نام مالک خودرو"
                      value={vehicleDocs.ownerName}
                      onChange={(e) => setVehicleDocs({ ...vehicleDocs, ownerName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Technical Inspection & Insurance */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Inspection */}
                <div className="p-4.5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2 text-slate-900 font-bold">
                      <FileCheck2 className="w-4 h-4 text-emerald-600" />
                      <span>۳. کارت معاینه فنی مکانیزه خودرو سنگین</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">شماره گواهی معاینه فنی:</label>
                      <input
                        type="text"
                        placeholder="TC-1405-77189"
                        value={vehicleDocs.technicalInspectionDocNo}
                        onChange={(e) => setVehicleDocs({ ...vehicleDocs, technicalInspectionDocNo: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 outline-none"
                        dir="ltr"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">نام مرکز معاینه فنی سنگین:</label>
                      <input
                        type="text"
                        placeholder="مرکز آزمون مکانیزه سنگین شاهپور اصفهان"
                        value={vehicleDocs.technicalInspectionCenterName}
                        onChange={(e) => setVehicleDocs({ ...vehicleDocs, technicalInspectionCenterName: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">تاریخ پایان اعتبار معاینه فنی:</label>
                      <input
                        type="text"
                        placeholder="۱۴۰۶/۰۲/۱۵"
                        value={vehicleDocs.technicalInspectionExpiryDate}
                        onChange={(e) => setVehicleDocs({ ...vehicleDocs, technicalInspectionExpiryDate: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Modern Insurance Section with Dedicated Insurance Dropdown */}
                <div className="p-4.5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2 text-slate-900 font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>۴. بیمه‌نامه شخص ثالث و بدنه</span>
                    </div>
                    <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                      بیمه مرکزی
                    </span>
                  </div>

                  <div className="space-y-3">
                    {/* Dedicated Modern Insurance Company Picker */}
                    <InsuranceCompanyPickerDropdown
                      value={vehicleDocs.thirdPartyInsuranceProvider}
                      onChange={(insName) => setVehicleDocs({ ...vehicleDocs, thirdPartyInsuranceProvider: insName })}
                      label="شرکت بیمه‌گر صادرکننده بیمه‌نامه ثالث:"
                    />

                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700">شماره بیمه‌نامه ثالث:</label>
                        <input
                          type="text"
                          placeholder="INS-IR-1405-99881"
                          value={vehicleDocs.thirdPartyPolicyNumber}
                          onChange={(e) => setVehicleDocs({ ...vehicleDocs, thirdPartyPolicyNumber: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 outline-none"
                          dir="ltr"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700">تاریخ انقضای بیمه ثالث:</label>
                        <input
                          type="text"
                          placeholder="۱۴۰۶/۰۶/۳۰"
                          value={vehicleDocs.thirdPartyExpiryDate}
                          onChange={(e) => setVehicleDocs({ ...vehicleDocs, thirdPartyExpiryDate: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Specialized Tank Inspection (CNG / ADR) */}
              <div className="p-4.5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <Flame className="w-4 h-4 text-amber-600" />
                    <span>۵. مجوز معاینه مخزن (دوگانه‌سوز CNG یا تانکرهای حمل مواد خطرناک ADR)</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={vehicleDocs.hasTankInspectionPermit}
                      onChange={(e) => setVehicleDocs({ ...vehicleDocs, hasTankInspectionPermit: e.target.checked })}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-[11px] font-bold text-slate-700">مشمول آزمون مخزن CNG / تانکر ADR</span>
                  </label>
                </div>

                {vehicleDocs.hasTankInspectionPermit && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                    {/* Modern Tank / Hazard Class Selector */}
                    <ModernSelect
                      label="نوع مخزن / کاربری تخصصی:"
                      value={vehicleDocs.tankType}
                      onChange={(val) => setVehicleDocs({ ...vehicleDocs, tankType: val as any })}
                      options={tankTypeOptions}
                      placeholder="انتخاب نوع مخزن..."
                    />

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">شماره تاییدیه تست هیدروستاتیک:</label>
                      <input
                        type="text"
                        placeholder="TANK-ADR-1405-9912"
                        value={vehicleDocs.tankInspectionPermitNo}
                        onChange={(e) => setVehicleDocs({ ...vehicleDocs, tankInspectionPermitNo: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 outline-none"
                        dir="ltr"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">تاریخ پایان اعتبار تست مخزن:</label>
                      <input
                        type="text"
                        placeholder="۱۴۰۷/۰۱/۲۰"
                        value={vehicleDocs.tankPermitExpiryDate}
                        onChange={(e) => setVehicleDocs({ ...vehicleDocs, tankPermitExpiryDate: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setDriverFormStep('identity')}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>بازگشت به مدارک راننده</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer hover:shadow-lg"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>ثبت نهایی راننده و صدور پرونده ناوگان</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </motion.div>
    </div>
  );
};
