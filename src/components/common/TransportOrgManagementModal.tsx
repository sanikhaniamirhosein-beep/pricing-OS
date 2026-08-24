import React, { useState, useEffect } from 'react';
import {
  Building2,
  Building,
  User,
  Users,
  Truck,
  ShieldCheck,
  CreditCard,
  Edit2,
  Plus,
  Trash2,
  X,
  CheckCircle2,
  AlertTriangle,
  Search,
  Phone,
  Mail,
  MapPin,
  Lock,
  Sparkles,
  Award,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  FileBadge2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePricing } from '../../store/PricingContext';
import { CarrierTeamMember, CompanyLegalDossier } from '../../types/pricing';
import { CompanyDocumentsDossier } from './CompanyDocumentsDossier';
import { FleetDriversTab } from './fleet/FleetDriversTab';
import { AddOrgUserModal } from './fleet/AddOrgUserModal';

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
      notes: 'شمولیت کامل جهت اعمال ضریب ۱۰٪ ارزش افزوده بر کمیسیون بارنامه در سامانه هوشمند',
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
    deleteCarrierDriver,
    carrierUsers,
    addCarrierUser,
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
      if (transportOrgInitialTab === 'profile' || transportOrgInitialTab === 'users' || transportOrgInitialTab === 'drivers') {
        setActiveTab(transportOrgInitialTab);
      }
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

  // User Search & State
  const [userSearch, setUserSearch] = useState('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

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

  if (!isTransportOrgModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <motion.div
        id="transport-org-management-dialog"
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.97, opacity: 0 }}
        className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto"
      >
        {/* Modern Modal Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-amber-500/10 via-slate-50 to-white text-slate-900 flex items-center justify-between shrink-0 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md ring-4 ring-amber-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-950 font-title">
                  پورتال مدیریت سازمان حمل‌ونقل و پرونده جامع ناوگان
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono text-[11px] font-bold border border-amber-300">
                  {currentCarrierOrg?.code || 'CARRIER-ORG'}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                مدیریت هویت سازمانی، اعضای تیم و پرونده جامع ۱۱ مدرک رانندگان و ناوگان حمل‌ونقل جاده‌ای
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsTransportOrgModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="بستن پنجره"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900/10'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
              }`}
            >
              <Building className="w-4 h-4 text-amber-400" />
              <span>مشخصات و اسناد رسمی شرکت</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900/10'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
              }`}
            >
              <Users className="w-4 h-4 text-sky-400" />
              <span>کاربران و سطوح دسترسی ({carrierUsers.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('drivers')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'drivers'
                  ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900/10'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
              }`}
            >
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>مدارک رانندگان و ناوگان ({carrierDrivers.length})</span>
            </button>
          </div>

          {/* Context Action Button */}
          <div className="flex items-center gap-2">
            {activeTab === 'profile' && !isEditingProfile && (
              isSeniorAdmin ? (
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>ویرایش مشخصات شرکت</span>
                </button>
              ) : (
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-300 text-slate-500 text-xs font-bold rounded-xl shadow-xs cursor-not-allowed select-none"
                  title="ویرایش اطلاعات شرکت فقط برای مدیر ارشد مجاز است."
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
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50/40">
          {/* ======================================================== */}
          {/* TAB 1: COMPANY PROFILE                                   */}
          {/* ======================================================== */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {isEditingProfile ? (
                /* EDIT PROFILE FORM */
                <form onSubmit={handleSaveProfile} className="space-y-6 text-xs animate-in fade-in duration-150">
                  <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                    <div className="flex items-center gap-2 text-amber-900 font-bold">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>حالت ویرایش اطلاعات رسمی شرکت فعال است</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="px-3.5 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        انصراف
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        ذخیره تغییرات
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                    <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 text-xs flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-amber-600" />
                      <span>مشخصات ثبتی و هویتی شرکت حمل‌ونقل</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700">نام فارسی شرکت:</label>
                        <input
                          type="text"
                          value={profileForm.nameFa}
                          onChange={(e) => setProfileForm({ ...profileForm, nameFa: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700">نام انگلیسی / برند بین‌المللی:</label>
                        <input
                          type="text"
                          value={profileForm.nameEn}
                          onChange={(e) => setProfileForm({ ...profileForm, nameEn: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-mono text-slate-900 outline-none focus:border-amber-500"
                          dir="ltr"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700">شماره ثبت رسمی:</label>
                        <input
                          type="text"
                          value={profileForm.registrationNo}
                          onChange={(e) => setProfileForm({ ...profileForm, registrationNo: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-mono text-slate-900 outline-none focus:border-amber-500"
                          dir="ltr"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700">شناسه ملی شرکت (۱۱ رقم):</label>
                        <input
                          type="text"
                          value={profileForm.nationalId}
                          onChange={(e) => setProfileForm({ ...profileForm, nationalId: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-mono text-slate-900 outline-none focus:border-amber-500"
                          dir="ltr"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700">کد اقتصادی (۱۲ رقم):</label>
                        <input
                          type="text"
                          value={profileForm.economicCode}
                          onChange={(e) => setProfileForm({ ...profileForm, economicCode: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-mono text-slate-900 outline-none focus:border-amber-500"
                          dir="ltr"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700">شماره پروانه فعالیت راهداری:</label>
                        <input
                          type="text"
                          value={profileForm.licenseNumber}
                          onChange={(e) => setProfileForm({ ...profileForm, licenseNumber: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-mono text-slate-900 outline-none focus:border-amber-500"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                    <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 text-xs flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-600" />
                      <span>اطلاعات تماس، اقامتگاه قانونی و حساب بانکی تسویه</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700">نام مدیرعامل:</label>
                        <input
                          type="text"
                          value={profileForm.managerName}
                          onChange={(e) => setProfileForm({ ...profileForm, managerName: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700">تلفن تماس:</label>
                        <input
                          type="text"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-mono text-slate-900 outline-none"
                          dir="ltr"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700">ایمیل سازمانی:</label>
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-mono text-slate-900 outline-none"
                          dir="ltr"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700">استان مقر اصلی:</label>
                        <input
                          type="text"
                          value={profileForm.province}
                          onChange={(e) => setProfileForm({ ...profileForm, province: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700">شهر مقر اصلی:</label>
                        <input
                          type="text"
                          value={profileForm.city}
                          onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700">نام بانک عامل:</label>
                        <input
                          type="text"
                          value={profileForm.bank}
                          onChange={(e) => setProfileForm({ ...profileForm, bank: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none"
                        />
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="font-bold text-slate-700">شماره شبا بانکی (IBAN):</label>
                        <input
                          type="text"
                          value={profileForm.shaba}
                          onChange={(e) => setProfileForm({ ...profileForm, shaba: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-mono text-slate-900 outline-none"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                /* VIEW PROFILE READONLY */
                <div className="space-y-6">
                  {/* Hero Organization Identity Card */}
                  <div className="bg-gradient-to-br from-amber-50/70 via-white to-slate-50 text-slate-900 p-6 rounded-3xl border border-amber-200 shadow-xs">
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
                              پروانه معتبر راهداری RMTO
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
                          <span className="text-[11px] text-slate-600 font-semibold block mb-0.5">امتیاز کیفی ناوگان</span>
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
                      <div className="flex items-center gap-2 text-slate-900 font-bold text-xs border-b border-slate-100 pb-2">
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

                    {/* Fleet Capacity */}
                    <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                      <div className="flex items-center gap-2 text-slate-900 font-bold text-xs border-b border-slate-100 pb-2">
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

                    {/* Banking Account */}
                    <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                      <div className="flex items-center gap-2 text-slate-900 font-bold text-xs border-b border-slate-100 pb-2">
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

                  {/* Company Documents Dossier */}
                  <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
                    <CompanyDocumentsDossier
                      dossier={currentCarrierOrg?.legalDossier || createDefaultLegalDossier(currentCarrierOrg)}
                      isEditing={false}
                      orgName={currentCarrierOrg?.nameFa || 'شرکت حمل‌ونقل'}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: ORGANIZATION USERS                                */}
          {/* ======================================================== */}
          {activeTab === 'users' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Search bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="جستجو در بین کاربران و اعضای سازمان..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none text-slate-900"
                  />
                </div>

                <span className="text-xs text-slate-500 font-bold">
                  تعداد کل کاربران: <span className="font-mono text-slate-900">{filteredUsers.length}</span>
                </span>
              </div>

              {/* Users Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="bg-white p-4.5 rounded-2xl border border-slate-200 hover:border-sky-300 transition-all shadow-2xs flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.fullName}
                          className="w-11 h-11 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-slate-950 text-xs">{user.fullName}</h4>
                            <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 text-[10px] font-bold border border-sky-200">
                              {user.department}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 font-medium mt-0.5">{user.roleTitle}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`آیا از حذف دسترسی کاربر «${user.fullName}» اطمینان دارید؟`)) {
                            deleteCarrierUser(user.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                        title="حذف دسترسی کاربر"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
                      <span className="font-mono">{user.email}</span>
                      <span className="text-emerald-700 font-medium">فعال در سیستم</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add User Sub-Modal */}
              <AddOrgUserModal
                isOpen={isAddUserModalOpen}
                onClose={() => setIsAddUserModalOpen(false)}
                onSave={addCarrierUser}
                currentOrgId={currentCarrierOrg?.id}
              />
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: DRIVERS & FLEET DOSSIER                           */}
          {/* ======================================================== */}
          {activeTab === 'drivers' && (
            <FleetDriversTab
              carrierDrivers={carrierDrivers}
              onAddDriver={addCarrierDriver}
              onDeleteDriver={deleteCarrierDriver}
              currentOrgId={currentCarrierOrg?.id}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
};
