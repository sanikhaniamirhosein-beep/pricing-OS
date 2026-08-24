import React, { useState, useEffect } from 'react';
import {
  Building2,
  Building,
  User,
  Users,
  Truck,
  FileCheck2,
  ShieldCheck,
  CreditCard,
  Edit2,
  Plus,
  Trash2,
  X,
  CheckCircle2,
  AlertTriangle,
  Search,
  FileText,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Flame,
  Award,
  ChevronRight,
  ChevronLeft,
  Upload,
  Check,
  Info,
  Clock,
  Shield,
  Eye,
  Hash,
  FileSpreadsheet,
  Lock,
  FileBadge2,
  Sparkles,
  Brain,
  Bot,
  Zap,
  RefreshCw,
  Sliders,
  Wand2,
  TrendingUp,
  LineChart,
  Target,
  Send,
  SlidersHorizontal,
} from 'lucide-react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { usePricing } from '../../store/PricingContext';
import { CarrierDriver, CarrierTeamMember, DriverIdentityDocuments, VehicleFleetDocuments, CompanyLegalDossier, CompanyUploadedDoc } from '../../types/pricing';
import { CompanyDocumentsDossier } from './CompanyDocumentsDossier';

const createDefaultLegalDossier = (org?: any): CompanyLegalDossier => {
  return {
    officialGazetteNo: org?.registrationNo ? `${org.registrationNo} / ۱۴۰۴-۱۱-۱۵` : '۲۲۹۸۴ / ۱۴۰۴-۱۱-۱۵',
    ceoNationalId: '۰۰۷۶۵۴۳۲۱۱',
    economicCode: org?.economicCode || '۴۱۱۱۴۵۶۷۸۹۱۲',
    officialGazetteDoc: {
      id: 'doc-gazette-def',
      docKey: 'official_gazette',
      titleFa: 'آگهی تأسیس و آخرین آگهی تغییرات روزنامه رسمی',
      category: 'legal',
      required: true,
      fileName: `${org?.nameEn ? org.nameEn.replace(/[^a-zA-Z0-9]/g, '_') : 'Company'}_Official_Gazette.pdf`,
      fileSize: '۲.۴ مگابایت',
      uploadedAt: '۱۴۰۴/۱۱/۲۰',
      status: 'verified',
      documentNumber: '۲۲۹۸۴-الف',
      issueDate: '۱۴۰۴/۱۱/۱۵',
      notes: 'دارندگان حق امضای مجاز طبق آخرین روزنامه رسمی با مهر رسمی شرکت',
    },
    nationalIdAndEconomicCodeDoc: {
      id: 'doc-natid-def',
      docKey: 'national_id_eco',
      titleFa: 'گواهی شناسه ملی و کد اقتصادی شرکت',
      category: 'legal',
      required: true,
      fileName: 'NationalID_EconomicCode_Certificate.pdf',
      fileSize: '۱.۱ مگابایت',
      uploadedAt: '۱۴۰۴/۱۰/۰۵',
      status: 'verified',
      documentNumber: org?.nationalId || '۱۰۱۰۱۳۴۵۶۷۸',
      issueDate: '۱۴۰۰/۰۳/۱۴',
      notes: 'استعلام ثبت شرکت‌ها و سازمان امور مالیاتی تأیید شد.',
    },
    ceoIdentityDoc: {
      id: 'doc-ceo-def',
      docKey: 'ceo_identity',
      titleFa: 'کارت ملی و شناسنامه مدیرعامل / نماینده قانونی',
      category: 'legal',
      required: true,
      fileName: 'CEO_NationalCard_BirthCertificate.pdf',
      fileSize: '۱.۸ مگابایت',
      uploadedAt: '۱۴۰۴/۱۰/۰۸',
      status: 'verified',
      documentNumber: '۰۰۷۶۵۴۳۲۱۱',
      issueDate: '۱۴۰۱/۰۵/۲۰',
      notes: 'احراز هویت برخط سامانه شاهکار و ثبت احوال با موفقیت انجام شد.',
    },
    rmtoPermitDoc: {
      id: 'doc-rmto-def',
      docKey: 'rmto_permit',
      titleFa: 'پروانه فعالیت معتبر از سازمان راهداری و حمل‌ونقل جاده‌ای',
      category: 'logistics',
      required: true,
      fileName: 'RMTO_Carrier_License_1405.pdf',
      fileSize: '۳.۲ مگابایت',
      uploadedAt: '۱۴۰۴/۱۲/۰۱',
      status: 'verified',
      documentNumber: org?.licenseNumber || 'LIC-RMTO-1405-9921',
      issueDate: '۱۴۰۴/۰۱/۱۵',
      expiryDate: '۱۴۰۷/۰۱/۱۵',
      authorityName: 'سازمان راهداری و حمل‌ونقل جاده‌ای کشور',
      notes: 'پروانه سراسری حمل‌ونقل کالا با پوشش کلیه استان‌های کشور',
    },
    specializedCargoPermitDoc: {
      id: 'doc-spec-def',
      docKey: 'specialized_cargo_permit',
      titleFa: 'مجوزهای حمل تخصصی (مواد سوختی، ترافیکی، فاسدشدنی، CMR)',
      category: 'logistics',
      required: true,
      fileName: 'Specialized_Cargo_CMR_ADR_Permits.pdf',
      fileSize: '۴.۱ مگابایت',
      uploadedAt: '۱۴۰۴/۱۲/۱۵',
      status: 'verified',
      documentNumber: 'SPEC-ADR-CMR-8820',
      issueDate: '۱۴۰۴/۰۲/۰۱',
      expiryDate: '۱۴۰۶/۰۲/۰۱',
      notes: 'شامل مجوز حمل مواد پتروشیمی (ADR)، بوژی کشی سنگین ترافیکی و کارنه تیر (TIR/CMR)',
    },
    logisticsAuthority: 'RMTO',
    specializedServices: [
      'مواد سوختی، نفتی و شیمیایی (خطرناک ADR)',
      'محمولات فوق سنگین و ترافیکی (بوژی و کمرشکن)',
      'کالاهای فاسدشدنی و زنجیره سرد (یخچالی)',
      'ترانزیت بین‌المللی و کارنه تیر (CMR / TIR)',
    ],
    vatRegistrationDoc: {
      id: 'doc-vat-def',
      docKey: 'vat_registration',
      titleFa: 'گواهی ثبت‌نام مالیات بر ارزش افزوده (VAT)',
      category: 'financial_insurance',
      required: true,
      fileName: 'VAT_Registration_Certificate_1405.pdf',
      fileSize: '۱.۵ مگابایت',
      uploadedAt: '۱۴۰۵/۰۱/۱۰',
      status: 'verified',
      documentNumber: 'VAT-99201844-01',
      issueDate: '۱۴۰۵/۰۱/۰۱',
      expiryDate: '۱۴۰۶/۰۱/۰۱',
      notes: 'شمولیت کامل جهت اعمال ضریب ۱۰٪ ارزش افزوده بر کمیسیون بارنامه در Pricing OS',
    },
    vatTaxNumber: 'VAT-99201844-01',
    isVatExempt: false,
    bankAccountConfirmationDoc: {
      id: 'doc-bank-def',
      docKey: 'bank_account_confirmation',
      titleFa: 'تأییدیه شماره حساب و شبای بانکی رسمی به نام شرکت',
      category: 'financial_insurance',
      required: true,
      fileName: 'Official_IBAN_Bank_Confirmation.pdf',
      fileSize: '۹۸۰ کیلوبایت',
      uploadedAt: '۱۴۰۴/۱۱/۱۱',
      status: 'verified',
      documentNumber: 'CONF-MLT-8801-44',
      issueDate: '۱۴۰۴/۱۱/۱۰',
      notes: 'شماره شبا به نام شرکت در سامانه‌های ساتنا و پایا ثبت و تایید شده است.',
    },
    carrierLiabilityInsuranceDoc: {
      id: 'doc-ins-def',
      docKey: 'carrier_liability_insurance',
      titleFa: 'نمونه بیمه‌نامه مسئولیت مدنی متصدیان حمل‌ونقل (باربری)',
      category: 'financial_insurance',
      required: true,
      fileName: 'Carrier_Liability_Insurance_Policy.pdf',
      fileSize: '۳.۸ مگابایت',
      uploadedAt: '۱۴۰۴/۱۲/۲۰',
      status: 'verified',
      documentNumber: 'POL-INS-1405-77310',
      issueDate: '۱۴۰۴/۱۲/۱۵',
      expiryDate: '۱۴۰۵/۱۲/۱۵',
      authorityName: 'شرکت سهامی بیمه ایران / آسیا',
      notes: 'سقف پوشش خسارت تا سقف ۱۰۰ میلیارد تومان به ازای هر حادثه جاده‌ای و حریق',
    },
    insuranceProviderName: 'شرکت سهامی بیمه ایران',
    insurancePolicyNumber: 'POL-INS-1405-77310',
    insuranceCoverageCeilingToman: 100000000000,
    insuranceExpiryDate: '۱۴۰۵/۱۲/۱۵',
  };
};

export const TransportOrgManagementModal: React.FC = () => {
  const {
    isTransportOrgModalOpen,
    setIsTransportOrgModalOpen,
    transportOrgInitialTab,
    currentCarrierOrg,
    updateCarrierOrgProfile,
    carrierDrivers,
    addCarrierDriver,
    updateCarrierDriver,
    deleteCarrierDriver,
    carrierUsers,
    addCarrierUser,
    updateCarrierUser,
    deleteCarrierUser,
    userRole,
  } = usePricing();

  const isSeniorAdmin =
    userRole === 'System Admin / Fleet Director' ||
    userRole === 'System Admin' ||
    userRole === 'Supply Chain Manager / Admin';

  const [activeTab, setActiveTab] = useState<'profile' | 'users' | 'drivers'>('profile');

  // Sync initial tab when modal opens
  useEffect(() => {
    if (isTransportOrgModalOpen && transportOrgInitialTab) {
      setActiveTab(transportOrgInitialTab);
    }
  }, [isTransportOrgModalOpen, transportOrgInitialTab]);

  // Company Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Automatically revoke edit mode if active user is not Senior Admin
  useEffect(() => {
    if (!isSeniorAdmin && isEditingProfile) {
      setIsEditingProfile(false);
    }
  }, [isSeniorAdmin, isEditingProfile]);

  const [profileForm, setProfileForm] = useState({
    nameFa: '',
    nameEn: '',
    registrationNo: '',
    nationalId: '',
    economicCode: '',
    licenseNumber: '',
    managerName: '',
    phone: '',
    email: '',
    province: '',
    city: '',
    bank: '',
    shaba: '',
    accountNo: '',
  });

  const [dossierForm, setDossierForm] = useState<CompanyLegalDossier>(createDefaultLegalDossier());

  // Load profile form data from currentCarrierOrg
  useEffect(() => {
    if (currentCarrierOrg) {
      setProfileForm({
        nameFa: currentCarrierOrg.nameFa || '',
        nameEn: currentCarrierOrg.nameEn || '',
        registrationNo: currentCarrierOrg.registrationNo || '',
        nationalId: currentCarrierOrg.nationalId || '',
        economicCode: currentCarrierOrg.economicCode || '۴۱۱۱۴۵۶۷۸۹۱۲',
        licenseNumber: currentCarrierOrg.licenseNumber || '',
        managerName: currentCarrierOrg.managerName || '',
        phone: currentCarrierOrg.phone || '',
        email: currentCarrierOrg.email || '',
        province: currentCarrierOrg.province || '',
        city: currentCarrierOrg.city || '',
        bank: currentCarrierOrg.bankAccount?.bank || '',
        shaba: currentCarrierOrg.bankAccount?.shaba || '',
        accountNo: currentCarrierOrg.bankAccount?.accountNo || '',
      });

      setDossierForm(currentCarrierOrg.legalDossier || createDefaultLegalDossier(currentCarrierOrg));
    }
  }, [currentCarrierOrg]);

  // Save Profile Handler - Strictly Senior Admin Only
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSeniorAdmin) {
      alert('خطای دسترسی: ویرایش اطلاعات شرکت منحصراً در اختیار مدیر ارشد می‌باشد.');
      setIsEditingProfile(false);
      return;
    }
    updateCarrierOrgProfile({
      nameFa: profileForm.nameFa,
      nameEn: profileForm.nameEn,
      registrationNo: profileForm.registrationNo,
      nationalId: profileForm.nationalId,
      economicCode: profileForm.economicCode,
      licenseNumber: profileForm.licenseNumber,
      managerName: profileForm.managerName,
      phone: profileForm.phone,
      email: profileForm.email,
      province: profileForm.province,
      city: profileForm.city,
      bankAccount: {
        bank: profileForm.bank,
        shaba: profileForm.shaba,
        accountNo: profileForm.accountNo,
      },
      legalDossier: dossierForm,
    });
    setIsEditingProfile(false);
  };

  // -------------------------------------------------------------
  // User Management State & Form
  // -------------------------------------------------------------
  const [userSearch, setUserSearch] = useState('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [userForm, setUserForm] = useState<Partial<CarrierTeamMember>>({
    fullName: '',
    nationalId: '',
    email: '',
    phone: '',
    roleTitle: 'کارشناس دیسپاچینگ و عملیات',
    department: 'مدیریت عملیات و اعزام بار',
    accessLevel: 'operational',
    status: 'active',
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.fullName || !userForm.email) return;

    const newUser: CarrierTeamMember = {
      id: `usr-pg-${Date.now()}`,
      orgId: currentCarrierOrg?.id || 'org-carrier-pg-freight',
      fullName: userForm.fullName,
      nationalId: userForm.nationalId || '00' + Math.floor(10000000 + Math.random() * 90000000),
      email: userForm.email,
      phone: userForm.phone || '0912' + Math.floor(1000000 + Math.random() * 9000000),
      roleTitle: userForm.roleTitle || 'کارشناس سازمانی',
      department: userForm.department || 'عملیات',
      accessLevel: (userForm.accessLevel as any) || 'operational',
      status: 'active',
      lastActive: 'هم‌اکنون',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };

    addCarrierUser(newUser);
    setIsAddUserModalOpen(false);
    setUserForm({
      fullName: '',
      nationalId: '',
      email: '',
      phone: '',
      roleTitle: 'کارشناس دیسپاچینگ و عملیات',
      department: 'مدیریت عملیات و اعزام بار',
      accessLevel: 'operational',
      status: 'active',
    });
  };

  // -------------------------------------------------------------
  // Driver Management State & Form
  // -------------------------------------------------------------
  const [driverSearch, setDriverSearch] = useState('');
  const [driverStatusFilter, setDriverStatusFilter] = useState<'all' | 'active' | 'in_trip'>('all');
  const [isAddDriverModalOpen, setIsAddDriverModalOpen] = useState(false);
  const [driverFormStep, setDriverFormStep] = useState<'identity' | 'vehicle'>('identity');
  const [selectedDriverDossier, setSelectedDriverDossier] = useState<CarrierDriver | null>(null);

  // Initial Empty Driver Form
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
    vehicleType: 'تریلر کفی ۲۴ تن',
    plateNumber: '',
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
    tankType: 'none',
    tankInspectionPermitNo: '',
    tankPermitExpiryDate: '',
  };

  const [driverFullName, setDriverFullName] = useState('');
  const [driverIdentity, setDriverIdentity] = useState<DriverIdentityDocuments>(initialDriverIdentity);
  const [vehicleDocs, setVehicleDocs] = useState<VehicleFleetDocuments>(initialVehicleDocs);

  const resetDriverForm = () => {
    setDriverFullName('');
    setDriverIdentity(initialDriverIdentity);
    setVehicleDocs(initialVehicleDocs);
    setDriverFormStep('identity');
  };

  const handleCreateDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverFullName.trim()) return;

    const newDriver: CarrierDriver = {
      id: `drv-pg-${Date.now()}`,
      orgId: currentCarrierOrg?.id || 'org-carrier-pg-freight',
      fullName: driverFullName,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
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

    addCarrierDriver(newDriver);
    setIsAddDriverModalOpen(false);
    resetDriverForm();
  };

  if (!isTransportOrgModalOpen) return null;

  const filteredUsers = carrierUsers.filter((u) => {
    if (!userSearch.trim()) return true;
    const q = userSearch.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.roleTitle.toLowerCase().includes(q) ||
      u.department.toLowerCase().includes(q)
    );
  });

  const filteredDrivers = carrierDrivers.filter((d) => {
    const matchesFilter = driverStatusFilter === 'all' || d.status === driverStatusFilter;
    if (!driverSearch.trim()) return matchesFilter;
    const q = driverSearch.toLowerCase();
    return (
      matchesFilter &&
      (d.fullName.toLowerCase().includes(q) ||
        d.identityDocs.nationalIdNumber.includes(q) ||
        d.identityDocs.smartCardNumber.includes(q) ||
        d.vehicleDocs.plateNumber.toLowerCase().includes(q) ||
        d.vehicleDocs.vehicleType.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div
        id="transport-org-management-dialog"
        className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Modal Top Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-amber-50/80 via-slate-50 to-white text-slate-900 flex items-center justify-between shrink-0 border-b border-slate-200 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center font-bold shadow-2xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-950 font-title">
                  پورتال مدیریت سازمان حمل‌ونقل و پرونده ناوگان
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono text-[11px] font-bold border border-amber-300 shadow-2xs">
                  {currentCarrierOrg?.code || 'CARRIER-ORG'}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                مدیریت هویت شرکت، کاربران سازمانی، صدور مجوزها و ثبت جامع مدارک رانندگان و ناوگان
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsTransportOrgModalOpen(false)}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 rounded-xl transition-colors cursor-pointer"
            title="بستن پنجره"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="px-6 py-3 bg-slate-100/90 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-300/70'
              }`}
            >
              <Building className="w-4 h-4 text-amber-400" />
              <span>مشخصات و عنوان شرکت</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-300/70'
              }`}
            >
              <Users className="w-4 h-4 text-sky-400" />
              <span>کاربران سازمان ({carrierUsers.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('drivers')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'drivers'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-300/70'
              }`}
            >
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>مدارک رانندگان و ناوگان ({carrierDrivers.length})</span>
            </button>
          </div>

          {/* Quick Action Buttons on Right */}
          <div className="flex items-center gap-2">
            {activeTab === 'profile' && !isEditingProfile && (
              isSeniorAdmin ? (
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>ویرایش اطلاعات شرکت</span>
                </button>
              ) : (
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-300 text-slate-500 text-xs font-bold rounded-xl shadow-xs cursor-not-allowed select-none"
                  title="ویرایش اطلاعات شرکت فقط برای مدیر ارشد / مدیر سیستم مجاز است."
                >
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>ویرایش اطلاعات (مختص مدیر ارشد)</span>
                </div>
              )
            )}

            {activeTab === 'users' && (
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>افزودن کاربر جدید</span>
              </button>
            )}

            {activeTab === 'drivers' && (
              <button
                type="button"
                onClick={() => {
                  resetDriverForm();
                  setIsAddDriverModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>افزودن راننده و ناوگان</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Content Container */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* ======================================================== */}
          {/* TAB 1: COMPANY PROFILE & EDIT */}
          {/* ======================================================== */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {isEditingProfile ? (
                /* EDIT FORM */
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {/* Top Action Sticky Banner */}
                  <div className="p-4 bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-500/10 rounded-2xl border border-amber-300/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3 text-xs text-amber-950">
                      <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-xs">
                        <FileBadge2 className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-black text-sm block text-amber-950">ویرایش اطلاعات سازمانی و بارگذاری اسناد و مدارک رسمی (PDF)</span>
                        <span className="text-[11px] text-amber-800 font-medium">
                          مدارک ثبتی، پروانه‌های فعالیت راهداری، شناسه ملی، کد اقتصادی و بیمه‌نامه مسئولیت را به تفکیک بارگذاری و ذخیره کنید.
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition-all cursor-pointer shadow-xs"
                      >
                        انصراف
                      </button>
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer hover:shadow-md"
                      >
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>ذخیره تغییرات و مدارک</span>
                      </button>
                    </div>
                  </div>

                  {/* 1. DOCUMENT DOSSIER UPLOAD SECTION (PDF) */}
                  <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
                    <CompanyDocumentsDossier
                      dossier={dossierForm}
                      isEditing={true}
                      orgName={profileForm.nameFa || currentCarrierOrg?.nameFa || 'شرکت حمل‌ونقل'}
                      onChangeDossier={(upd) => setDossierForm((prev) => ({ ...prev, ...upd }))}
                    />
                  </div>

                  {/* 2. GENERAL COMPANY DETAILS FORM */}
                  <div className="bg-slate-50/80 rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 text-xs font-black text-slate-900 border-b border-slate-200 pb-3">
                      <Building2 className="w-4 h-4 text-amber-600" />
                      <span>اطلاعات پایه و هویتی شرکت حمل‌ونقل</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="font-bold text-slate-700">عنوان رسمی شرکت (فارسی):</label>
                        <input
                          type="text"
                          required
                          value={profileForm.nameFa}
                          onChange={(e) => setProfileForm({ ...profileForm, nameFa: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900 font-bold"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700">نام لاتین شرکت (English):</label>
                        <input
                          type="text"
                          value={profileForm.nameEn}
                          onChange={(e) => setProfileForm({ ...profileForm, nameEn: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900"
                          dir="ltr"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700">شماره ثبت شرکت:</label>
                        <input
                          type="text"
                          value={profileForm.registrationNo}
                          onChange={(e) => setProfileForm({ ...profileForm, registrationNo: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900 font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700">شناسه ملی شرکت:</label>
                        <input
                          type="text"
                          value={profileForm.nationalId}
                          onChange={(e) => setProfileForm({ ...profileForm, nationalId: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900 font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700">کد اقتصادی شرکت:</label>
                        <input
                          type="text"
                          value={profileForm.economicCode}
                          onChange={(e) => setProfileForm({ ...profileForm, economicCode: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900 font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700">شماره پروانه فعالیت راهداری (RMTO):</label>
                        <input
                          type="text"
                          value={profileForm.licenseNumber}
                          onChange={(e) => setProfileForm({ ...profileForm, licenseNumber: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900 font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700">نام مدیرعامل / مدیر ارشد:</label>
                        <input
                          type="text"
                          value={profileForm.managerName}
                          onChange={(e) => setProfileForm({ ...profileForm, managerName: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700">تلفن تماس مرکزی:</label>
                        <input
                          type="text"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900"
                          dir="ltr"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700">ایمیل سازمانی:</label>
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900"
                          dir="ltr"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700">استان مقر اصلی:</label>
                        <input
                          type="text"
                          value={profileForm.province}
                          onChange={(e) => setProfileForm({ ...profileForm, province: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700">شهر مقر اصلی:</label>
                        <input
                          type="text"
                          value={profileForm.city}
                          onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700">نام بانک عامل:</label>
                        <input
                          type="text"
                          value={profileForm.bank}
                          onChange={(e) => setProfileForm({ ...profileForm, bank: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900"
                        />
                      </div>

                      <div className="space-y-1.5 md:col-span-2">
                        <label className="font-bold text-slate-700">شماره شبا بانکی (IBAN):</label>
                        <input
                          type="text"
                          value={profileForm.shaba}
                          onChange={(e) => setProfileForm({ ...profileForm, shaba: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900 font-mono"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                /* VIEW PROFILE CARD */
                <div className="space-y-6">
                  {/* Read-Only Notice for Non-Senior Admin */}
                  {!isSeniorAdmin && (
                    <div className="p-3.5 bg-amber-50/90 border border-amber-200/90 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs text-amber-950 shadow-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shrink-0">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-bold block">پروفایل سازمانی در وضعیت فقط‌خواندنی (Read-Only)</span>
                          <span className="text-[11px] text-amber-800">
                            ویرایش مشخصات و مدارک رسمی شرکت منحصراً برای «مدیر ارشد» مجاز است.
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] bg-white text-slate-700 font-bold px-2.5 py-1 rounded-lg border border-amber-200 shrink-0">
                        نقش فعال شما: {userRole}
                      </span>
                    </div>
                  )}

                  {/* Hero Organization Identity Card */}
                  <div className="bg-gradient-to-br from-amber-50/70 via-white to-slate-50 text-slate-900 p-6 rounded-3xl border border-amber-200/90 shadow-xs">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-xs shrink-0 ring-4 ring-amber-500/20">
                          <Truck className="w-8 h-8" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2.5">
                            <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-950 font-title">
                              {currentCarrierOrg?.nameFa || 'شرکت حمل و نقل سراسری'}
                            </h1>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-[11px] font-bold shadow-2xs">
                              پروانه معتبر راهداری
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 font-bold mt-1 font-mono tracking-wide">
                            {currentCarrierOrg?.nameEn}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-800 mt-3 font-medium">
                            <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                              <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span className="text-slate-800 font-semibold">{currentCarrierOrg?.province} - {currentCarrierOrg?.city}</span>
                            </span>
                            <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                              <Phone className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span dir="ltr" className="text-slate-800 font-mono font-bold">{currentCarrierOrg?.phone}</span>
                            </span>
                            <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                              <Mail className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span className="text-slate-800 font-medium">{currentCarrierOrg?.email}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end md:self-center">
                        <div className="text-left bg-white px-4 py-2.5 rounded-2xl border border-amber-300 shadow-2xs">
                          <span className="text-[11px] text-slate-600 font-semibold block mb-0.5">امتیاز کیفیت ناوگان</span>
                          <span className="text-base font-black text-amber-700 flex items-center gap-1">
                            ★ {currentCarrierOrg?.rating || 4.9} <span className="text-xs font-bold text-slate-500">/ ۵.۰</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Specs Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Legal & Regulatory */}
                    <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                      <div className="flex items-center gap-2 text-slate-900 font-bold text-xs border-b border-slate-200 pb-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>مجوزها و هویت ثبتی</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">شماره ثبت:</span>
                          <span className="font-mono font-bold text-slate-900">{currentCarrierOrg?.registrationNo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">شناسه ملی:</span>
                          <span className="font-mono font-bold text-slate-900">{currentCarrierOrg?.nationalId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">پروانه راهداری:</span>
                          <span className="font-mono font-bold text-emerald-700">{currentCarrierOrg?.licenseNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">مدیرعامل:</span>
                          <span className="font-bold text-slate-900">{currentCarrierOrg?.managerName}</span>
                        </div>
                      </div>
                    </div>

                    {/* Fleet Capacity & Operational Metrics */}
                    <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                      <div className="flex items-center gap-2 text-slate-900 font-bold text-xs border-b border-slate-200 pb-2">
                        <Truck className="w-4 h-4 text-sky-600" />
                        <span>ظرفیت ناوگان و رانندگان</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">کل ناوگان تحت پوشش:</span>
                          <span className="font-mono font-bold text-slate-900">
                            {currentCarrierOrg?.fleetCount?.toLocaleString('fa-IR')} دستگاه
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">رانندگان فعال دارای هوشمند:</span>
                          <span className="font-mono font-bold text-sky-700">
                            {carrierDrivers.length} نفر ثبت شده
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">پرسنل و کاربران سیستم:</span>
                          <span className="font-mono font-bold text-slate-900">{carrierUsers.length} کاربر</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">پوشش کشوری:</span>
                          <span className="font-bold text-slate-900">۳۱ استان کشور</span>
                        </div>
                      </div>
                    </div>

                    {/* Financial & Banking Account */}
                    <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                      <div className="flex items-center gap-2 text-slate-900 font-bold text-xs border-b border-slate-200 pb-2">
                        <CreditCard className="w-4 h-4 text-amber-600" />
                        <span>حساب بانکی تسویه بارنامه</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">بانک عامل:</span>
                          <span className="font-bold text-slate-900">{currentCarrierOrg?.bankAccount?.bank}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">شماره حساب:</span>
                          <span className="font-mono font-bold text-slate-900">{currentCarrierOrg?.bankAccount?.accountNo}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-slate-500 block text-[11px]">شماره شبا:</span>
                          <span className="font-mono font-bold text-[11px] text-slate-900 block truncate" dir="ltr">
                            {currentCarrierOrg?.bankAccount?.shaba}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. DOSSIER DISPLAY IN VIEW MODE */}
                  <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
                    <CompanyDocumentsDossier
                      dossier={currentCarrierOrg?.legalDossier || createDefaultLegalDossier(currentCarrierOrg)}
                      isEditing={false}
                      orgName={currentCarrierOrg?.nameFa || 'شرکت حمل‌ونقل'}
                    />
                  </div>

                  {/* Dedicated Corridors Preview */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                    <span className="text-xs font-bold text-slate-800 block">کریدورهای اختصاصی و ظرفیت بارگیری روزانه:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                      {currentCarrierOrg?.dedicatedCorridors?.map((corr, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                            <span>{corr.origin}</span>
                            <span className="text-slate-400 font-normal">←</span>
                            <span>{corr.dest}</span>
                          </div>
                          <span className="text-[11px] font-mono text-sky-700 font-bold mt-2">
                            {corr.dailyCapacityTons.toLocaleString('fa-IR')} تن روزانه
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: ORGANIZATION USERS */}
          {/* ======================================================== */}
          {activeTab === 'users' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Search and stats */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="جستجو در کاربران (نام، ایمیل، نقش)..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <span className="text-xs text-slate-500">
                  نمایش {filteredUsers.length} از {carrierUsers.length} کاربر ثبت شده
                </span>
              </div>

              {/* Users Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-sky-300 shadow-2xs hover:shadow-xs transition-all flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <img
                        src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                        alt={user.fullName}
                        className="w-11 h-11 rounded-2xl object-cover border border-slate-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-slate-900 truncate">{user.fullName}</h4>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              user.accessLevel === 'full_admin'
                                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                : user.accessLevel === 'operational'
                                ? 'bg-sky-100 text-sky-900 border border-sky-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {user.accessLevel === 'full_admin'
                              ? 'مدیر ارشد'
                              : user.accessLevel === 'operational'
                              ? 'عملیاتی'
                              : 'قیمت‌گذاری'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium">{user.roleTitle}</p>
                        <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400">
                          <span className="flex items-center gap-1 font-mono" dir="ltr">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {user.email}
                          </span>
                          <span className="flex items-center gap-1 font-mono">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {user.phone}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteCarrierUser(user.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                      title="حذف کاربر"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: DRIVERS & FLEET DOSSIER */}
          {/* ======================================================== */}
          {activeTab === 'drivers' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Filter and Search Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="جستجو (نام راننده، کدملی، کارت هوشمند، پلاک)..."
                    value={driverSearch}
                    onChange={(e) => setDriverSearch(e.target.value)}
                    className="w-full pr-9 pl-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setDriverStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      driverStatusFilter === 'all'
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    همه رانندگان ({carrierDrivers.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setDriverStatusFilter('active')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      driverStatusFilter === 'active'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    آماده اعزام
                  </button>
                  <button
                    type="button"
                    onClick={() => setDriverStatusFilter('in_trip')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      driverStatusFilter === 'in_trip'
                        ? 'bg-sky-600 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    در حال حمل بار
                  </button>
                </div>
              </div>

              {/* Drivers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDrivers.map((driver) => (
                  <div
                    key={driver.id}
                    className="bg-white p-4.5 rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-2xs hover:shadow-xs transition-all space-y-3.5"
                  >
                    {/* Top Row: Driver info & status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <img
                          src={driver.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                          alt={driver.fullName}
                          className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xs text-slate-900">{driver.fullName}</h4>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                driver.status === 'in_trip'
                                  ? 'bg-sky-100 text-sky-800 border border-sky-200'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              }`}
                            >
                              {driver.status === 'in_trip' ? 'در حال حمل بار' : 'آماده به کار'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                            <span>کدملی: {driver.identityDocs.nationalIdNumber}</span>
                            <span>•</span>
                            <span>تلفن: {driver.identityDocs.mobilePhone}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedDriverDossier(driver)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg border border-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>پرونده کامل</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteCarrierDriver(driver.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="حذف راننده"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Vehicle & Plate Info */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-500 block text-[10px]">نوع خودرو و ناوگان:</span>
                        <span className="font-bold text-slate-800">{driver.vehicleDocs.vehicleType}</span>
                      </div>
                      <div className="text-left">
                        <span className="text-slate-500 block text-[10px]">پلاک انتظامی:</span>
                        <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded-lg border border-slate-300">
                          {driver.vehicleDocs.plateNumber}
                        </span>
                      </div>
                    </div>

                    {/* Document Badges (11 Essential Checks) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px]">
                      <div className="p-1.5 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">کارت هوشمند: {driver.identityDocs.smartCardNumber}</span>
                      </div>

                      <div className="p-1.5 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">
                          گواهینامه:{' '}
                          {driver.identityDocs.licenseType === 'grade1'
                            ? 'پایه یک'
                            : driver.identityDocs.licenseType === 'grade2'
                            ? 'پایه دو'
                            : 'ویژه'}
                        </span>
                      </div>

                      <div className="p-1.5 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">کارت سلامت معتبر</span>
                      </div>

                      <div className="p-1.5 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">معاینه فنی معتبر</span>
                      </div>

                      <div className="p-1.5 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">بیمه شخص ثالث</span>
                      </div>

                      <div className="p-1.5 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">عدم سوءپیشینه/اعتیاد</span>
                      </div>

                      <div className="p-1.5 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">هوشمند ناوگان: {driver.vehicleDocs.fleetSmartCardNumber}</span>
                      </div>

                      {driver.vehicleDocs.hasTankInspectionPermit ? (
                        <div className="p-1.5 bg-amber-50 text-amber-900 rounded-lg border border-amber-200 flex items-center gap-1">
                          <Flame className="w-3 h-3 text-amber-600 shrink-0" />
                          <span className="truncate">معاینه مخزن ADR/CNG</span>
                        </div>
                      ) : (
                        <div className="p-1.5 bg-slate-50 text-slate-600 rounded-lg border border-slate-200 flex items-center gap-1">
                          <Info className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">کاربری استاندارد</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>یکپارچه‌سازی و استعلام برخط با سامانه جامع سازمان راهداری و حمل‌ونقل جاده‌ای (RMTO)</span>
          </div>
          <button
            type="button"
            onClick={() => setIsTransportOrgModalOpen(false)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            بستن پنجره
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ADD USER SUB-MODAL */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isAddUserModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="px-5 py-4 bg-gradient-to-r from-amber-50/80 via-slate-50 to-white text-slate-900 flex items-center justify-between border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-sm text-slate-900 font-title">افزودن کاربر جدید به سازمان حمل‌ونقل</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="p-5 space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">نام و نام خانوادگی:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: علیرضا حسینی"
                    value={userForm.fullName}
                    onChange={(e) => setUserForm({ ...userForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900 font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">کد ملی:</label>
                    <input
                      type="text"
                      placeholder="۱۰ رقم کد ملی"
                      value={userForm.nationalId}
                      onChange={(e) => setUserForm({ ...userForm, nationalId: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono text-slate-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">شماره تلفن همراه:</label>
                    <input
                      type="text"
                      placeholder="0912xxxxxxx"
                      value={userForm.phone}
                      onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono text-slate-900"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">ایمیل سازمانی:</label>
                  <input
                    type="email"
                    required
                    placeholder="user@domain.ir"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono text-slate-900"
                    dir="ltr"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">عنوان و سمت شغلی:</label>
                    <input
                      type="text"
                      placeholder="مثال: کارشناس دیسپاچینگ"
                      value={userForm.roleTitle}
                      onChange={(e) => setUserForm({ ...userForm, roleTitle: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">سطح دسترسی سامانه:</label>
                    <select
                      value={userForm.accessLevel}
                      onChange={(e) => setUserForm({ ...userForm, accessLevel: e.target.value as any })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900 font-bold"
                    >
                      <option value="operational">دسترسی عملیاتی و دیسپاچینگ</option>
                      <option value="pricing_only">دسترسی مالی و قیمت‌گذاری</option>
                      <option value="full_admin">مدیریت کل (Full Admin)</option>
                      <option value="read_only">فقط مشاهده اسناد</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddUserModalOpen(false)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    ثبت و ایجاد کاربر
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* ADD DRIVER & FLEET SUB-MODAL (11 REQUESTED DOCUMENTS) */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isAddDriverModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] my-auto"
            >
              {/* Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-emerald-50/80 via-slate-50 to-white text-slate-900 flex items-center justify-between shrink-0 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center font-bold shadow-2xs">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-slate-950 font-title">ثبت جامع مدارک رانندگان و ناوگان حمل‌ونقل</h3>
                    <p className="text-[11px] text-slate-600 font-medium">
                      مطابق با ضوابط سازمان راهداری جهت صدور برخط بارنامه و احراز صلاحیت
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddDriverModalOpen(false)}
                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Step Navigator */}
              <div className="px-6 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-center gap-4 shrink-0 text-xs">
                <button
                  type="button"
                  onClick={() => setDriverFormStep('identity')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                    driverFormStep === 'identity'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-300'
                  }`}
                >
                  <FileCheck2 className="w-4 h-4 text-amber-400" />
                  <span>۱. مدارک هویت و صلاحیت راننده</span>
                </button>

                <ChevronLeft className="w-4 h-4 text-slate-400" />

                <button
                  type="button"
                  onClick={() => setDriverFormStep('vehicle')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                    driverFormStep === 'vehicle'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-300'
                  }`}
                >
                  <Truck className="w-4 h-4 text-emerald-400" />
                  <span>۲. مدارک فنی و قانونی وسیله نقلیه (ناوگان)</span>
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleCreateDriver} className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
                {driverFormStep === 'identity' ? (
                  /* ================= STEP 1: DRIVER IDENTITY & COMPETENCE ================= */
                  <div className="space-y-6 animate-in fade-in duration-150">
                    {/* Basic Name */}
                    <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-3">
                      <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                        <User className="w-4 h-4 text-amber-600" />
                        <span>مشخصات فردی راننده</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-700">نام و نام خانوادگی راننده: *</label>
                          <input
                            type="text"
                            required
                            placeholder="مثال: عباس محمدی گروسی"
                            value={driverFullName}
                            onChange={(e) => setDriverFullName(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold text-slate-900"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-700">شماره تلفن همراه راننده (جهت OTP بارنامه): *</label>
                          <input
                            type="text"
                            placeholder="0912xxxxxxx"
                            value={driverIdentity.mobilePhone}
                            onChange={(e) => setDriverIdentity({ ...driverIdentity, mobilePhone: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                            dir="ltr"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 1. National ID & Birth Certificate */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between text-slate-900 font-bold border-b border-slate-200 pb-2">
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4 text-slate-600" />
                          <span>۱. کارت ملی و شناسنامه راننده</span>
                        </div>
                        <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                          احراز هویت الزامی
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-slate-600">کد ملی راننده (۱۰ رقم):</label>
                          <input
                            type="text"
                            placeholder="0012345678"
                            value={driverIdentity.nationalIdNumber}
                            onChange={(e) => setDriverIdentity({ ...driverIdentity, nationalIdNumber: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-600">شماره شناسنامه:</label>
                          <input
                            type="text"
                            placeholder="شماره شناسنامه"
                            value={driverIdentity.birthCertificateNo}
                            onChange={(e) => setDriverIdentity({ ...driverIdentity, birthCertificateNo: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-600">تاریخ تولد:</label>
                          <input
                            type="text"
                            placeholder="۱۳۶۰/۰۱/۰۱"
                            value={driverIdentity.birthDate}
                            onChange={(e) => setDriverIdentity({ ...driverIdentity, birthDate: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 2. Driver Smart Card (RMTO) */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between text-slate-900 font-bold border-b border-slate-200 pb-2">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-emerald-600" />
                          <span>۲. کارت هوشمند راننده (صادره از سازمان راهداری جهت صدور بارنامه)</span>
                        </div>
                        <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                          استعلام برخط فعال
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-slate-600">شماره کارت هوشمند (۷ رقم):</label>
                          <input
                            type="text"
                            placeholder="۲۴۵۸۹۰۱"
                            value={driverIdentity.smartCardNumber}
                            onChange={(e) => setDriverIdentity({ ...driverIdentity, smartCardNumber: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-600">تاریخ صدور کارت هوشمند:</label>
                          <input
                            type="text"
                            placeholder="۱۴۰۱/۰۲/۱۰"
                            value={driverIdentity.smartCardIssueDate}
                            onChange={(e) => setDriverIdentity({ ...driverIdentity, smartCardIssueDate: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-600">تاریخ پایان اعتبار کارت هوشمند:</label>
                          <input
                            type="text"
                            placeholder="۱۴۰۶/۰۲/۱۰"
                            value={driverIdentity.smartCardExpiryDate}
                            onChange={(e) => setDriverIdentity({ ...driverIdentity, smartCardExpiryDate: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 3. Driver's License */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between text-slate-900 font-bold border-b border-slate-200 pb-2">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-sky-600" />
                          <span>۳. گواهینامه رانندگی (متناسب با کلاس خودرو)</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-slate-600">نوع گواهینامه:</label>
                          <select
                            value={driverIdentity.licenseType}
                            onChange={(e) => setDriverIdentity({ ...driverIdentity, licenseType: e.target.value as any })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
                          >
                            <option value="grade1">پایه یک (سنگین، کشنده و تریلر)</option>
                            <option value="grade2">پایه دو (نیمه‌سنگین و خاور)</option>
                            <option value="special">ویژه (جرثقیل، بوژی و کمرشکن)</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-600">شماره سریال گواهینامه:</label>
                          <input
                            type="text"
                            placeholder="۹۹۰۱۴۴۲۱۱"
                            value={driverIdentity.licenseNumber}
                            onChange={(e) => setDriverIdentity({ ...driverIdentity, licenseNumber: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-600">تاریخ پایان اعتبار گواهینامه:</label>
                          <input
                            type="text"
                            placeholder="۱۴۰۷/۰۸/۲۵"
                            value={driverIdentity.licenseExpiryDate}
                            onChange={(e) => setDriverIdentity({ ...driverIdentity, licenseExpiryDate: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 4. Health Card */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between text-slate-900 font-bold border-b border-slate-200 pb-2">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>۴. کارت سلامت راننده (دارای اعتبار - طب کار راهداری)</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-slate-600">شماره پرونده کارت سلامت:</label>
                          <input
                            type="text"
                            placeholder="HLT-1404-8821"
                            value={driverIdentity.healthCardNumber}
                            onChange={(e) => setDriverIdentity({ ...driverIdentity, healthCardNumber: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-600">تاریخ پایان اعتبار کارت سلامت:</label>
                          <input
                            type="text"
                            placeholder="۱۴۰۵/۱۱/۲۰"
                            value={driverIdentity.healthCardExpiryDate}
                            onChange={(e) => setDriverIdentity({ ...driverIdentity, healthCardExpiryDate: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 5. Criminal Record & Drug Test */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between text-slate-900 font-bold border-b border-slate-200 pb-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-700" />
                          <span>۵. گواهی عدم سوءپیشینه و عدم اعتیاد (الزامات سازمانی)</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-slate-600">شماره گواهی عدم سوءپیشینه:</label>
                          <input
                            type="text"
                            placeholder="CLR-1404-9910"
                            value={driverIdentity.noCriminalRecordNumber}
                            onChange={(e) => setDriverIdentity({ ...driverIdentity, noCriminalRecordNumber: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-600">تاریخ صدور عدم سوءپیشینه:</label>
                          <input
                            type="text"
                            placeholder="۱۴۰۴/۰۱/۱۵"
                            value={driverIdentity.noCriminalRecordIssueDate}
                            onChange={(e) => setDriverIdentity({ ...driverIdentity, noCriminalRecordIssueDate: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-600">نتیجه آزمایش عدم اعتیاد:</label>
                          <select
                            value={driverIdentity.drugTestPassed ? 'yes' : 'no'}
                            onChange={(e) => setDriverIdentity({ ...driverIdentity, drugTestPassed: e.target.value === 'yes' })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-emerald-800"
                          >
                            <option value="yes">منفی (مورد تایید آزمایشگاه مرجع)</option>
                            <option value="no">در دست اقدام / نامعتبر</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 6. Logbook */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between text-slate-900 font-bold border-b border-slate-200 pb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-600" />
                          <span>۶. دفترچه ثبت ساعت راننده (برای رانندگان تجهیزات خاص / اتوبوس در صورت لزوم)</span>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={driverIdentity.hasLogbook}
                            onChange={(e) => setDriverIdentity({ ...driverIdentity, hasLogbook: e.target.checked })}
                            className="rounded text-slate-900 focus:ring-slate-900"
                          />
                          <span className="text-[11px] font-bold text-slate-700">مشمول دفترچه ثبت ساعت پلیس‌راه</span>
                        </label>
                      </div>

                      {driverIdentity.hasLogbook && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-slate-600">شماره سریال دفترچه ثبت ساعت:</label>
                            <input
                              type="text"
                              placeholder="LOG-POL-44102"
                              value={driverIdentity.logbookNumber}
                              onChange={(e) => setDriverIdentity({ ...driverIdentity, logbookNumber: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-slate-600">تاریخ آخرین مهر کنترل پلیس‌راه:</label>
                            <input
                              type="text"
                              placeholder="۱۴۰۵/۰۵/۲۲"
                              value={driverIdentity.logbookLastCheckDate}
                              onChange={(e) => setDriverIdentity({ ...driverIdentity, logbookLastCheckDate: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setDriverFormStep('vehicle')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        <span>مرحله بعدی: مدارک فنی و قانونی وسیله نقلیه (ناوگان)</span>
                        <ChevronLeft className="w-4 h-4 text-amber-400" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ================= STEP 2: VEHICLE FLEET DOCUMENTS ================= */
                  <div className="space-y-6 animate-in fade-in duration-150">
                    {/* 1. Vehicle Registration & Ownership (Green Sheet) */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between text-slate-900 font-bold border-b border-slate-200 pb-2">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-sky-600" />
                          <span>۱. کارت خودرو یا سند مالکیت (برگ سبز)</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-slate-600">نوع و کاربری ناوگان: *</label>
                          <select
                            value={vehicleDocs.vehicleType}
                            onChange={(e) => setVehicleDocs({ ...vehicleDocs, vehicleType: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
                          >
                            <option value="تریلر کفی ۲۴ تن">تریلر کفی ۲۴ تن</option>
                            <option value="تریلی چادری سه محور ترانزیت">تریلی چادری سه محور ترانزیت</option>
                            <option value="کشنده یخچال‌دار ۲۲ تن">کشنده یخچال‌دار ۲۲ تن</option>
                            <option value="تانکر استیل مواد شیمیایی خطرناک (ADR)">تانکر استیل مواد شیمیایی (ADR)</option>
                            <option value="کامیون جفت ۱۵ تن">کامیون جفت ۱۵ تن</option>
                            <option value="کامیون تک ۱۰ تن روباز">کامیون تک ۱۰ تن روباز</option>
                            <option value="خاور مسقف چادری ۶ تن">خاور مسقف چادری ۶ تن</option>
                            <option value="کمرشکن بوژی سنگین">کمرشکن بوژی سنگین</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-600">پلاک انتظامی ناوگان: *</label>
                          <input
                            type="text"
                            placeholder="مثال: ۶۲ ع ۸۹۱ - ایران ۱۳"
                            value={vehicleDocs.plateNumber}
                            onChange={(e) => setVehicleDocs({ ...vehicleDocs, plateNumber: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-600">شماره شاسی / VIN (۱۷ کاراکتر):</label>
                          <input
                            type="text"
                            placeholder="NAAB22EX8LP449012"
                            value={vehicleDocs.vinCode}
                            onChange={(e) => setVehicleDocs({ ...vehicleDocs, vinCode: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono"
                            dir="ltr"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-600">شماره سریال سند مالکیت (برگ سبز):</label>
                          <input
                            type="text"
                            placeholder="GS-882190-IR"
                            value={vehicleDocs.greenSheetDocNo}
                            onChange={(e) => setVehicleDocs({ ...vehicleDocs, greenSheetDocNo: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-600">نام مالک خودرو:</label>
                          <input
                            type="text"
                            placeholder="نام مالک طبق سند"
                            value={vehicleDocs.ownerName}
                            onChange={(e) => setVehicleDocs({ ...vehicleDocs, ownerName: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-600">نوع مالکیت ناوگان:</label>
                          <select
                            value={vehicleDocs.ownershipType}
                            onChange={(e) => setVehicleDocs({ ...vehicleDocs, ownershipType: e.target.value as any })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                          >
                            <option value="self">خودمالک راننده</option>
                            <option value="company">ملکی سازمان حمل‌ونقل</option>
                            <option value="leased">استیجاری / قرارداد پیمانکاری</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 2. Fleet Smart Card */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between text-slate-900 font-bold border-b border-slate-200 pb-2">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-emerald-600" />
                          <span>۲. کارت هوشمند ناوگان (دارای اعتبار برای صدور بارنامه)</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-slate-600">شماره هوشمند ناوگان:</label>
                          <input
                            type="text"
                            placeholder="۳۳۹۱۰۸۴"
                            value={vehicleDocs.fleetSmartCardNumber}
                            onChange={(e) => setVehicleDocs({ ...vehicleDocs, fleetSmartCardNumber: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-600">تاریخ پایان اعتبار کارت هوشمند:</label>
                          <input
                            type="text"
                            placeholder="۱۴۰۶/۰۴/۰۱"
                            value={vehicleDocs.fleetSmartCardExpiryDate}
                            onChange={(e) => setVehicleDocs({ ...vehicleDocs, fleetSmartCardExpiryDate: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-600">ظرفیت ناخالص مجاز بارگیری (تن):</label>
                          <input
                            type="number"
                            placeholder="24.5"
                            value={vehicleDocs.maxAllowedCapacityTons}
                            onChange={(e) => setVehicleDocs({ ...vehicleDocs, maxAllowedCapacityTons: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 3. Computerized Technical Inspection */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between text-slate-900 font-bold border-b border-slate-200 pb-2">
                        <div className="flex items-center gap-2">
                          <FileCheck2 className="w-4 h-4 text-emerald-600" />
                          <span>۳. کارت معاینه فنی معتبر</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-slate-600">شماره گواهی معاینه فنی:</label>
                          <input
                            type="text"
                            placeholder="TC-1404-77189"
                            value={vehicleDocs.technicalInspectionDocNo}
                            onChange={(e) => setVehicleDocs({ ...vehicleDocs, technicalInspectionDocNo: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-600">نام مرکز مکانیزه معاینه فنی سنگین:</label>
                          <input
                            type="text"
                            placeholder="مرکز معاینه فنی سنگین شاهپور اصفهان"
                            value={vehicleDocs.technicalInspectionCenterName}
                            onChange={(e) => setVehicleDocs({ ...vehicleDocs, technicalInspectionCenterName: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-600">تاریخ پایان اعتبار معاینه فنی:</label>
                          <input
                            type="text"
                            placeholder="۱۴۰۵/۱۰/۱۵"
                            value={vehicleDocs.technicalInspectionExpiryDate}
                            onChange={(e) => setVehicleDocs({ ...vehicleDocs, technicalInspectionExpiryDate: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 4. Third-Party & Comprehensive Insurance */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between text-slate-900 font-bold border-b border-slate-200 pb-2">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>۴. بیمه‌نامه شخص ثالث و بیمه بدنه خودرو</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-slate-600">شرکت بیمه‌گر:</label>
                          <select
                            value={vehicleDocs.thirdPartyInsuranceProvider}
                            onChange={(e) => setVehicleDocs({ ...vehicleDocs, thirdPartyInsuranceProvider: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
                          >
                            <option value="بیمه ایران">بیمه ایران</option>
                            <option value="بیمه آسیا">بیمه آسیا</option>
                            <option value="بیمه البرز">بیمه البرز</option>
                            <option value="بیمه دانا">بیمه دانا</option>
                            <option value="بیمه معلم">بیمه معلم</option>
                            <option value="بیمه پارسیان">بیمه پارسیان</option>
                            <option value="بیمه رازی">بیمه رازی</option>
                            <option value="بیمه سامان">بیمه سامان</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-600">شماره بیمه‌نامه شخص ثالث:</label>
                          <input
                            type="text"
                            placeholder="INS-IR-1404-998811"
                            value={vehicleDocs.thirdPartyPolicyNumber}
                            onChange={(e) => setVehicleDocs({ ...vehicleDocs, thirdPartyPolicyNumber: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-600">تاریخ پایان اعتبار بیمه ثالث:</label>
                          <input
                            type="text"
                            placeholder="۱۴۰۵/۱۲/۲۸"
                            value={vehicleDocs.thirdPartyExpiryDate}
                            onChange={(e) => setVehicleDocs({ ...vehicleDocs, thirdPartyExpiryDate: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-600">شماره بیمه‌نامه بدنه (اختیاری):</label>
                          <input
                            type="text"
                            placeholder="INS-BD-1404-3321"
                            value={vehicleDocs.bodyInsurancePolicyNumber}
                            onChange={(e) => setVehicleDocs({ ...vehicleDocs, bodyInsurancePolicyNumber: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-600">تاریخ پایان اعتبار بیمه بدنه:</label>
                          <input
                            type="text"
                            placeholder="۱۴۰۵/۱۲/۲۸"
                            value={vehicleDocs.bodyInsuranceExpiryDate}
                            onChange={(e) => setVehicleDocs({ ...vehicleDocs, bodyInsuranceExpiryDate: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 5. Tank Inspection Permit (CNG / ADR / Chemical) */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between text-slate-900 font-bold border-b border-slate-200 pb-2">
                        <div className="flex items-center gap-2">
                          <Flame className="w-4 h-4 text-amber-600" />
                          <span>۵. مجوز معاینه مخزن (برای خودروهای دوگانه‌سوز یا تانکرهای حمل مواد خاص)</span>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={vehicleDocs.hasTankInspectionPermit}
                            onChange={(e) => setVehicleDocs({ ...vehicleDocs, hasTankInspectionPermit: e.target.checked })}
                            className="rounded text-amber-600 focus:ring-amber-500"
                          />
                          <span className="text-[11px] font-bold text-slate-700">مشمول بازرسی مخزن (CNG / تانکر ADR)</span>
                        </label>
                      </div>

                      {vehicleDocs.hasTankInspectionPermit && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <label className="text-slate-600">نوع مخزن / کاربری:</label>
                            <select
                              value={vehicleDocs.tankType}
                              onChange={(e) => setVehicleDocs({ ...vehicleDocs, tankType: e.target.value as any })}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
                            >
                              <option value="cng">مخزن گازسوز CNG</option>
                              <option value="hazardous_adr">تانکر حمل مواد شیمیایی و اشتعال‌زا (ADR)</option>
                              <option value="chemical_liquid">تانکر حمل مایعات سوختی و فرآورده‌های نفتی</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-slate-600">شماره تاییدیه تست هیدروستاتیک مخزن:</label>
                            <input
                              type="text"
                              placeholder="TANK-ADR-1404-9912"
                              value={vehicleDocs.tankInspectionPermitNo}
                              onChange={(e) => setVehicleDocs({ ...vehicleDocs, tankInspectionPermitNo: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-slate-600">تاریخ پایان اعتبار مجوز مخزن:</label>
                            <input
                              type="text"
                              placeholder="۱۴۰۶/۰۱/۳۰"
                              value={vehicleDocs.tankPermitExpiryDate}
                              onChange={(e) => setVehicleDocs({ ...vehicleDocs, tankPermitExpiryDate: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Submission Controls */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => setDriverFormStep('identity')}
                        className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                      >
                        <ChevronRight className="w-4 h-4" />
                        <span>بازگشت به مشخصات راننده</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsAddDriverModalOpen(false)}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                        >
                          انصراف
                        </button>
                        <button
                          type="submit"
                          className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>ثبت نهایی راننده و ناوگان</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* DRIVER FULL DOSSIER MODAL */}
      {/* ======================================================== */}
      <AnimatePresence>
        {selectedDriverDossier && (
          <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="px-6 py-4.5 bg-gradient-to-r from-amber-50/80 via-slate-50 to-white text-slate-900 flex items-center justify-between border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedDriverDossier.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                    alt={selectedDriverDossier.fullName}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-300 shadow-2xs"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="font-black text-sm text-slate-950 font-title">
                      پرونده الکترونیکی مدارک: {selectedDriverDossier.fullName}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">
                      کدملی: <span className="font-mono font-bold text-slate-900">{selectedDriverDossier.identityDocs.nationalIdNumber}</span> • هوشمند:{' '}
                      <span className="font-mono font-bold text-emerald-700">{selectedDriverDossier.identityDocs.smartCardNumber}</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDriverDossier(null)}
                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
                {/* Driver Identity Summary */}
                <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <span className="font-black text-slate-900 block text-xs border-b border-slate-200 pb-2">
                    مدارک هویت و صلاحیت فردی
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    <div>
                      <span className="text-slate-500 block text-[10px]">کارت ملی و شناسنامه:</span>
                      <span className="font-bold text-slate-900">
                        {selectedDriverDossier.identityDocs.nationalIdNumber} (شماره ش: {selectedDriverDossier.identityDocs.birthCertificateNo})
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">کارت هوشمند راهداری:</span>
                      <span className="font-mono font-bold text-emerald-700">
                        {selectedDriverDossier.identityDocs.smartCardNumber} (انقضا: {selectedDriverDossier.identityDocs.smartCardExpiryDate})
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">گواهینامه رانندگی:</span>
                      <span className="font-bold text-slate-900">
                        {selectedDriverDossier.identityDocs.licenseType === 'grade1' ? 'پایه یک' : 'پایه دو'} (ش: {selectedDriverDossier.identityDocs.licenseNumber})
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">کارت سلامت طب کار:</span>
                      <span className="font-bold text-emerald-700">
                        معتبر تا {selectedDriverDossier.identityDocs.healthCardExpiryDate}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">گواهی عدم سوءپیشینه:</span>
                      <span className="font-bold text-slate-900">
                        {selectedDriverDossier.identityDocs.noCriminalRecordNumber || 'ثبت شده'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">آزمایش عدم اعتیاد:</span>
                      <span className="font-bold text-emerald-700">منفی و معتبر</span>
                    </div>
                  </div>
                </div>

                {/* Fleet Summary */}
                <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <span className="font-black text-slate-900 block text-xs border-b border-slate-200 pb-2">
                    مدارک فنی و قانونی وسیله نقلیه (ناوگان)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    <div>
                      <span className="text-slate-500 block text-[10px]">نوع خودرو:</span>
                      <span className="font-bold text-slate-900">{selectedDriverDossier.vehicleDocs.vehicleType}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">پلاک انتظامی:</span>
                      <span className="font-mono font-bold text-slate-900 bg-slate-50 px-2 py-0.5 rounded border border-slate-300">
                        {selectedDriverDossier.vehicleDocs.plateNumber}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">کارت هوشمند ناوگان:</span>
                      <span className="font-mono font-bold text-emerald-700">
                        {selectedDriverDossier.vehicleDocs.fleetSmartCardNumber}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">معاینه فنی معتبر:</span>
                      <span className="font-bold text-slate-900">
                        تا {selectedDriverDossier.vehicleDocs.technicalInspectionExpiryDate} ({selectedDriverDossier.vehicleDocs.technicalInspectionCenterName})
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">بیمه شخص ثالث:</span>
                      <span className="font-bold text-slate-900">
                        {selectedDriverDossier.vehicleDocs.thirdPartyInsuranceProvider} (انقضا: {selectedDriverDossier.vehicleDocs.thirdPartyExpiryDate})
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">مجوز مخزن (ADR / CNG):</span>
                      <span className="font-bold text-slate-900">
                        {selectedDriverDossier.vehicleDocs.hasTankInspectionPermit
                          ? `دارد (${selectedDriverDossier.vehicleDocs.tankInspectionPermitNo})`
                          : 'مشمول نمی‌باشد'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedDriverDossier(null)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  بستن
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
