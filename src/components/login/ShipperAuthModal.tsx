import React, { useState } from 'react';
import {
  X,
  Package,
  Building2,
  User,
  Mail,
  Phone,
  Lock,
  KeyRound,
  CheckCircle2,
  Plus,
  Trash2,
  Sparkles,
  AlertCircle,
  Briefcase,
  Layers,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  MapPin,
  FileText,
  DollarSign,
  Warehouse,
  Receipt,
  FileCheck2,
  Users,
  Building,
} from 'lucide-react';
import { UserRole, ShipperUserRole } from '../../types/pricing';
import {
  SHIPPER_ROLE_DETAILS,
  SHIPPER_AVAILABLE_LOCATIONS,
  ShipperRoleDetail,
  getShipperRoleDetail,
} from '../../data/shipperRolesConfig';
import { ModernSelect } from '../common/menus/ModernSelect';

interface ShipperAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (userData: {
    orgName: string;
    userName: string;
    userEmail: string;
    role: UserRole;
    isCorporate: boolean;
    shipperRole?: ShipperUserRole;
    locationScope?: string;
    approvalLimitToman?: number;
    nationalId?: string;
    primaryWarehouse?: string;
  }) => void;
}

interface ShipperRoleMember {
  id: string;
  role: ShipperUserRole;
  roleTitleFa: string;
  fullName: string;
  email: string;
  password: string;
  locationScope?: string;
  approvalLimitToman?: number;
}

export const ShipperAuthModal: React.FC<ShipperAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
}) => {
  // Main Category: بار شرکتی | بار خرد
  const [cargoCategory, setCargoCategory] = useState<'corporate' | 'retail'>('corporate');

  // Sub-action: ورود | ایجاد حساب
  const [actionType, setActionType] = useState<'login' | 'register'>('login');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Corporate Login States (Multi-step)
  const [corpLoginStep, setCorpLoginStep] = useState<1 | 2>(1);
  const [corpLoginOrgName, setCorpLoginOrgName] = useState('شرکت فولاد مبارکه اصفهان');
  const [corpLoginNationalId, setCorpLoginNationalId] = useState('10100445588');
  const [corpLoginOrgPassword, setCorpLoginOrgPassword] = useState('steel@1403');
  const [corpLoginSelectedRoleId, setCorpLoginSelectedRoleId] = useState<string>('shp-role-scm-admin');
  const [corpLoginFullName, setCorpLoginFullName] = useState('مهندس جواد اکبری');
  const [corpLoginRolePassword, setCorpLoginRolePassword] = useState('pass@123');
  const [corpLoginLocationScope, setCorpLoginLocationScope] = useState<string>(SHIPPER_AVAILABLE_LOCATIONS[0]);
  const [corpLoginApprovalLimitToman, setCorpLoginApprovalLimitToman] = useState<number>(100000000);

  // Corporate Register Multi-Step (1: Company Info, 2: Admin Profile, 3: Personnel & Roles)
  const [corpRegStep, setCorpRegStep] = useState<1 | 2 | 3>(1);
  const [corpRegCompanyName, setCorpRegCompanyName] = useState('');
  const [corpRegNationalId, setCorpRegNationalId] = useState('');
  const [corpRegRegistrationNo, setCorpRegRegistrationNo] = useState('');
  const [corpRegPrimaryWarehouse, setCorpRegPrimaryWarehouse] = useState(SHIPPER_AVAILABLE_LOCATIONS[0]);
  const [corpRegCity, setCorpRegCity] = useState('اصفهان');
  const [corpRegCompanyPhone, setCorpRegCompanyPhone] = useState('');
  const [corpRegCompanyEmail, setCorpRegCompanyEmail] = useState('');
  const [corpRegCompanyPassword, setCorpRegCompanyPassword] = useState('');

  // Step 2: Supply Chain Manager (Admin) Info
  const [corpRegAdminName, setCorpRegAdminName] = useState('');
  const [corpRegAdminEmail, setCorpRegAdminEmail] = useState('');
  const [corpRegAdminPassword, setCorpRegAdminPassword] = useState('');
  const [corpRegAdminPhone, setCorpRegAdminPhone] = useState('');

  // Step 3: Add Team Members with granular roles & scopes
  const [newMemberRoleId, setNewMemberRoleId] = useState<string>('shp-role-logistics-spec');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberPassword, setNewMemberPassword] = useState('');
  const [newMemberLocationScope, setNewMemberLocationScope] = useState(SHIPPER_AVAILABLE_LOCATIONS[0]);
  const [newMemberApprovalLimitToman, setNewMemberApprovalLimitToman] = useState<number>(100000000);

  const [corpMembersList, setCorpMembersList] = useState<ShipperRoleMember[]>([
    {
      id: 'CORP-ROLE-1',
      role: 'Logistics Specialist / Coordinator',
      roleTitleFa: 'کارشناس ثبت سفارش / لجستیک',
      fullName: 'مریم سهرابی',
      email: 'm.sohrabi@msc.ir',
      password: 'pass@123',
      approvalLimitToman: 100000000,
    },
    {
      id: 'CORP-ROLE-2',
      role: 'Warehouse / Dispatch Operator',
      roleTitleFa: 'مسئول انبار / تحویل‌گیرنده',
      fullName: 'رضا حسینی',
      email: 'r.hosseini@msc.ir',
      password: 'pass@123',
      locationScope: 'انبار مرکزی (اصفهان - مجتمع فولاد مبارکه)',
    },
    {
      id: 'CORP-ROLE-3',
      role: 'Finance Manager / Billing Specialist',
      roleTitleFa: 'مدیر / کارشناس مالی مشتری',
      fullName: 'سعید محمدی',
      email: 's.mohammadi@msc.ir',
      password: 'pass@123',
    },
  ]);

  // Retail Login States
  const [retailLoginFullName, setRetailLoginFullName] = useState('علی مرادی');
  const [retailLoginPhone, setRetailLoginPhone] = useState('09123456789');
  const [retailLoginEmail, setRetailLoginEmail] = useState('ali.moradi@gmail.com');
  const [retailLoginPassword, setRetailLoginPassword] = useState('retail@123');

  // Retail Register States
  const [retailRegFullName, setRetailRegFullName] = useState('');
  const [retailRegEmail, setRetailRegEmail] = useState('');
  const [retailRegPhone, setRetailRegPhone] = useState('');
  const [retailRegPassword, setRetailRegPassword] = useState('');

  if (!isOpen) return null;

  const currentSelectedRoleDetail =
    SHIPPER_ROLE_DETAILS.find((r) => r.id === corpLoginSelectedRoleId) || SHIPPER_ROLE_DETAILS[0];

  const currentNewMemberRoleDetail =
    SHIPPER_ROLE_DETAILS.find((r) => r.id === newMemberRoleId) || SHIPPER_ROLE_DETAILS[1];

  // 1.1 Corporate Login Step 1 Next
  const handleCorpLoginStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!corpLoginOrgName.trim()) {
      setErrorMessage('لطفاً نام شرکت را وارد نمایید.');
      return;
    }
    if (!corpLoginOrgPassword.trim()) {
      setErrorMessage('لطفاً گذرواژه ورود به شرکت را وارد فرمایید.');
      return;
    }

    setCorpLoginStep(2);
  };

  // 1.2 Submit Corporate Login (Step 2)
  const handleCorporateLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!corpLoginFullName.trim()) {
      setErrorMessage('لطفاً نام و نام خانوادگی خود را وارد فرمایید.');
      return;
    }
    if (!corpLoginRolePassword.trim()) {
      setErrorMessage('لطفاً گذرواژه نقش خود را وارد فرمایید.');
      return;
    }

    const roleDetail = currentSelectedRoleDetail;
    const finalLocationScope = roleDetail.locationScoped
      ? corpLoginLocationScope
      : 'همه انبارها و کارخانجات';
    const finalApprovalLimit = roleDetail.hasApprovalLimit
      ? corpLoginApprovalLimitToman
      : 0;

    onSuccessLogin({
      orgName: corpLoginOrgName,
      userName: corpLoginFullName.trim(),
      userEmail: `shipper@${corpLoginOrgName.replace(/\s+/g, '').toLowerCase()}.ir`,
      role: roleDetail.role,
      shipperRole: roleDetail.role,
      locationScope: finalLocationScope,
      approvalLimitToman: finalApprovalLimit,
      nationalId: corpLoginNationalId,
      isCorporate: true,
    });
  };

  // Add Member in Registration Step 3
  const handleAddCorpMember = () => {
    if (!newMemberName.trim() || !newMemberEmail.trim() || !newMemberPassword.trim()) {
      setErrorMessage('لطفاً اطلاعات عضو سازمانی (نام، ایمیل و گذرواژه) را کامل نمایید.');
      return;
    }

    const roleDet = currentNewMemberRoleDetail;

    const newMember: ShipperRoleMember = {
      id: `CORP-ROLE-${Date.now()}`,
      role: roleDet.role,
      roleTitleFa: roleDet.titleFa,
      fullName: newMemberName,
      email: newMemberEmail,
      password: newMemberPassword,
      locationScope: roleDet.locationScoped ? newMemberLocationScope : undefined,
      approvalLimitToman: roleDet.hasApprovalLimit ? newMemberApprovalLimitToman : undefined,
    };

    setCorpMembersList((prev) => [...prev, newMember]);
    setNewMemberName('');
    setNewMemberEmail('');
    setNewMemberPassword('');
    setErrorMessage(null);
  };

  const handleRemoveCorpMember = (id: string) => {
    setCorpMembersList((prev) => prev.filter((m) => m.id !== id));
  };

  // 2. Submit Corporate Register
  const handleCorporateRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (corpRegStep === 1) {
      if (!corpRegCompanyName.trim()) {
        setErrorMessage('لطفاً نام رسمی شرکت را وارد فرمایید.');
        return;
      }
      if (!corpRegNationalId.trim()) {
        setErrorMessage('لطفاً شناسه ملی یا شماره ثبت شرکت را وارد فرمایید.');
        return;
      }
      if (!corpRegCompanyEmail.trim() || !corpRegCompanyEmail.includes('@')) {
        setErrorMessage('لطفاً ایمیل رسمی معتبر شرکت را وارد فرمایید.');
        return;
      }
      if (!corpRegCompanyPassword.trim() || corpRegCompanyPassword.length < 4) {
        setErrorMessage('گذرواژه سازمانی باید حداقل ۴ کاراکتر باشد.');
        return;
      }
      setCorpRegStep(2);
      return;
    }

    if (corpRegStep === 2) {
      if (!corpRegAdminName.trim()) {
        setErrorMessage('لطفاً نام و نام خانوادگی مدیر ارشد زنجیره تامین را وارد نمایید.');
        return;
      }
      if (!corpRegAdminEmail.trim() || !corpRegAdminEmail.includes('@')) {
        setErrorMessage('لطفاً ایمیل سازمانی مدیر ارشد را وارد نمایید.');
        return;
      }
      if (!corpRegAdminPassword.trim() || corpRegAdminPassword.length < 4) {
        setErrorMessage('گذرواژه مدیر ارشد باید حداقل ۴ کاراکتر باشد.');
        return;
      }
      setCorpRegStep(3);
      return;
    }

    // Step 3 Completion:
    const orgDisplay = corpRegCompanyName.trim() || 'شرکت بازرگانی صنایع صنعتی';

    onSuccessLogin({
      orgName: orgDisplay,
      userName: `${corpRegAdminName} (مدیر ارشد لجستیک / زنجیره تأمین)`,
      userEmail: corpRegAdminEmail,
      role: 'Supply Chain Manager / Admin',
      shipperRole: 'Supply Chain Manager / Admin',
      locationScope: 'همه انبارها و کارخانجات',
      approvalLimitToman: 0,
      nationalId: corpRegNationalId,
      primaryWarehouse: corpRegPrimaryWarehouse,
      isCorporate: true,
    });
  };

  // 3. Submit Retail Login
  const handleRetailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!retailLoginFullName.trim()) {
      setErrorMessage('لطفاً نام و نام خانوادگی را وارد فرمایید.');
      return;
    }
    if (!retailLoginPhone.trim()) {
      setErrorMessage('لطفاً شماره تلفن همراه را وارد نمایید.');
      return;
    }
    if (!retailLoginEmail.trim()) {
      setErrorMessage('لطفاً ایمیل خود را وارد نمایید.');
      return;
    }
    if (!retailLoginPassword.trim()) {
      setErrorMessage('لطفاً گذرواژه خود را وارد فرمایید.');
      return;
    }

    onSuccessLogin({
      orgName: 'پنل اختصاصی بار خرد',
      userName: `${retailLoginFullName} (صاحب بار شخصی)`,
      userEmail: retailLoginEmail,
      role: 'Logistics Specialist / Coordinator',
      shipperRole: 'Logistics Specialist / Coordinator',
      isCorporate: false,
    });
  };

  // 4. Submit Retail Register
  const handleRetailRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!retailRegFullName.trim()) {
      setErrorMessage('لطفاً نام و نام خانوادگی را وارد فرمایید.');
      return;
    }
    if (!retailRegEmail.trim() || !retailRegEmail.includes('@')) {
      setErrorMessage('لطفاً ایمیل معتبر را وارد فرمایید.');
      return;
    }
    if (!retailRegPhone.trim() || retailRegPhone.length < 10) {
      setErrorMessage('لطفاً شماره تلفن معتبر (۱۱ رقم) را وارد فرمایید.');
      return;
    }
    if (!retailRegPassword.trim() || retailRegPassword.length < 4) {
      setErrorMessage('گذرواژه باید حداقل ۴ کاراکتر باشد.');
      return;
    }

    onSuccessLogin({
      orgName: 'پنل اختصاصی بار خرد',
      userName: `${retailRegFullName} (صاحب بار شخصی)`,
      userEmail: retailRegEmail,
      role: 'Logistics Specialist / Coordinator',
      shipperRole: 'Logistics Specialist / Coordinator',
      isCorporate: false,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div className="w-full max-w-3xl bg-white border border-sky-200/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-sky-100 bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-600 to-teal-600 text-white flex items-center justify-center shadow-md">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base font-display">
                  پرتال سازمانی صاحبان بار و صنایع
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-900 border border-sky-300">
                  مدیریت زنجیره تأمین و سفارشات
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                تفکیک دقیق نقش‌ها، سطوح دسترسی جغرافیایی (انبارها) و سقف تایید مالی سفارشات
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            aria-label="بستن"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level 1: Category Selector (بار شرکتی / بار خرد) */}
        <div className="p-3 bg-[#F0F7FA] border-b border-sky-100/80 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setCargoCategory('corporate');
              setErrorMessage(null);
            }}
            className={`py-2.5 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              cargoCategory === 'corporate'
                ? 'bg-sky-700 text-white shadow-md shadow-sky-700/20'
                : 'bg-white text-slate-700 hover:bg-sky-50 border border-sky-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>بار شرکتی و سازمانی (کارخانجات و صنایع)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setCargoCategory('retail');
              setErrorMessage(null);
            }}
            className={`py-2.5 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              cargoCategory === 'retail'
                ? 'bg-sky-700 text-white shadow-md shadow-sky-700/20'
                : 'bg-white text-slate-700 hover:bg-sky-50 border border-sky-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>بار خرد و انفرادی (شخصی)</span>
          </button>
        </div>

        {/* Level 2: Action Switcher (ورود / ایجاد حساب در سامانه) */}
        <div className="px-6 pt-3 pb-2 bg-white border-b border-slate-100 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setActionType('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              actionType === 'login'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>ورود پرسنل و مدیران شرکت</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActionType('register');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              actionType === 'register'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ثبت‌نام شرکت و سازمان صاحب بار جدید</span>
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="p-6 overflow-y-auto space-y-4 bg-white text-xs">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 flex items-center gap-2 text-xs font-medium animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* OPTION 1: BAR-E SHERKATI (CORPORATE) */}
          {/* ========================================================================= */}
          {cargoCategory === 'corporate' && (
            <>
              {/* 1.1 Corporate Login */}
              {actionType === 'login' && (
                <div className="space-y-4">
                  {/* Step Progress Indicator */}
                  <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                          corpLoginStep === 1
                            ? 'bg-sky-600 text-white'
                            : 'bg-emerald-500 text-white'
                        }`}
                      >
                        {corpLoginStep > 1 ? <CheckCircle2 className="w-4 h-4" /> : '۱'}
                      </div>
                      <span className={`text-xs ${corpLoginStep === 1 ? 'font-bold text-slate-900' : 'text-slate-500'}`}>
                        مرحله ۱: هویت حقوقی و گذرواژه سازمان
                      </span>
                    </div>

                    <div className="h-px w-12 bg-slate-200" />

                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                          corpLoginStep === 2
                            ? 'bg-sky-600 text-white'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        ۲
                      </div>
                      <span className={`text-xs ${corpLoginStep === 2 ? 'font-bold text-slate-900' : 'text-slate-400'}`}>
                        مرحله ۲: انتخاب نقش سازمانی و قلمرو دسترسی (Scope)
                      </span>
                    </div>
                  </div>

                  {/* Corporate Login Step 1 */}
                  {corpLoginStep === 1 && (
                    <form onSubmit={handleCorpLoginStep1Next} className="space-y-4 animate-in fade-in duration-150">
                      {/* Preset quick helpers */}
                      <div className="p-3 bg-[#F8FAFC] border border-sky-200/70 rounded-2xl flex flex-wrap items-center justify-between gap-2">
                        <span className="text-slate-600 font-bold text-[11px] flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                          شرکت‌های صاحب بار نمونه:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setCorpLoginOrgName('شرکت فولاد مبارکه اصفهان');
                              setCorpLoginNationalId('10260289411');
                              setCorpLoginOrgPassword('steel@1403');
                              setCorpLoginFullName('مهندس جواد اکبری');
                              setCorpLoginSelectedRoleId('shp-role-scm-admin');
                            }}
                            className="px-2.5 py-1 bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-900 border border-sky-200 rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-2xs"
                          >
                            فولاد مبارکه اصفهان
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCorpLoginOrgName('شرکت صنایع پتروشیمی خلیج فارس');
                              setCorpLoginNationalId('10100112233');
                              setCorpLoginOrgPassword('petro@1403');
                              setCorpLoginFullName('دکتر هادی کاظمی');
                              setCorpLoginSelectedRoleId('shp-role-scm-admin');
                            }}
                            className="px-2.5 py-1 bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-900 border border-sky-200 rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-2xs"
                          >
                            پتروشیمی خلیج فارس
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCorpLoginOrgName('صنایع کاشی و سرامیک البرز');
                              setCorpLoginNationalId('10100778899');
                              setCorpLoginOrgPassword('alborz@1403');
                              setCorpLoginFullName('مهندس کیوان راد');
                              setCorpLoginSelectedRoleId('shp-role-scm-admin');
                            }}
                            className="px-2.5 py-1 bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-900 border border-sky-200 rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-2xs"
                          >
                            کاشی و سرامیک البرز
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCorpLoginOrgName('گروه صنایع غذایی و لبنیات میهن');
                              setCorpLoginNationalId('10100987654');
                              setCorpLoginOrgPassword('mihan@1403');
                              setCorpLoginFullName('مهندس سعید کریمی');
                              setCorpLoginSelectedRoleId('shp-role-scm-admin');
                            }}
                            className="px-2.5 py-1 bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-900 border border-sky-200 rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-2xs"
                          >
                            صنایع غذایی میهن
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCorpLoginOrgName('شرکت قند و شکر فریمان و خراسان');
                              setCorpLoginNationalId('10380112233');
                              setCorpLoginOrgPassword('sugar@1403');
                              setCorpLoginFullName('مهندس قاسم تقوی');
                              setCorpLoginSelectedRoleId('shp-role-scm-admin');
                            }}
                            className="px-2.5 py-1 bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-900 border border-sky-200 rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-2xs"
                          >
                            قند و شکر خراسان
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* اسم شرکت */}
                        <div>
                          <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-sky-600" />
                            نام رسمی شرکت / مجتمع صنعتی:
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="مثال: شرکت فولاد مبارکه اصفهان"
                            value={corpLoginOrgName}
                            onChange={(e) => setCorpLoginOrgName(e.target.value)}
                            className="w-full bg-[#F8FAFC] border border-sky-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 font-medium transition-all"
                          />
                        </div>

                        {/* شناسه ملی شرکت */}
                        <div>
                          <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-sky-600" />
                            شناسه ملی / شماره ثبت شرکت:
                          </label>
                          <input
                            type="text"
                            placeholder="مثال: 10100445588"
                            value={corpLoginNationalId}
                            onChange={(e) => setCorpLoginNationalId(e.target.value)}
                            className="w-full bg-[#F8FAFC] border border-sky-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 font-mono font-medium transition-all text-left"
                          />
                        </div>
                      </div>

                      {/* گذرواژه ورود به شرکت */}
                      <div>
                        <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-sky-600" />
                          گذرواژه سازمانی شرکت (Company Master Password):
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={corpLoginOrgPassword}
                          onChange={(e) => setCorpLoginOrgPassword(e.target.value)}
                          className="w-full bg-[#F8FAFC] border border-sky-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 font-mono font-bold transition-all"
                        />
                      </div>

                      {/* Next Step Button */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 transition-all cursor-pointer text-sm"
                        >
                          <span>ادامه و تعیین نقش و پرسنل سازمانی</span>
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Corporate Login Step 2 */}
                  {corpLoginStep === 2 && (
                    <form onSubmit={handleCorporateLogin} className="space-y-4 animate-in fade-in duration-150">
                      {/* Preview Company Banner */}
                      <div className="p-3 bg-sky-50/80 border border-sky-200 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-500 font-medium">سازمان صاحب بار:</div>
                            <div className="text-xs font-bold text-slate-900">{corpLoginOrgName}</div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setCorpLoginStep(1);
                            setErrorMessage(null);
                          }}
                          className="text-[11px] font-bold text-sky-800 hover:text-sky-950 underline px-2 py-1 cursor-pointer"
                        >
                          ویرایش شرکت
                        </button>
                      </div>

                      {/* 4 Standard Shipper Roles Selector */}
                      <div className="space-y-2">
                        <label className="block text-slate-800 font-bold text-xs flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Briefcase className="w-4 h-4 text-sky-600" />
                            انتخاب نقش سازمانی صاحب بار:
                          </span>
                          <span className="text-[10px] text-slate-500 font-normal">
                            (بر اساس ماتریس تفکیک وظایف لجستیک)
                          </span>
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {SHIPPER_ROLE_DETAILS.map((r) => {
                            const isSelected = corpLoginSelectedRoleId === r.id;
                            return (
                              <div
                                key={r.id}
                                onClick={() => {
                                  setCorpLoginSelectedRoleId(r.id);
                                  setCorpLoginFullName(r.defaultUserName);
                                }}
                                className={`p-3 rounded-2xl border text-right cursor-pointer transition-all ${
                                  isSelected
                                    ? 'bg-sky-50/90 border-sky-500 ring-2 ring-sky-500/20 shadow-xs'
                                    : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-slate-50'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-slate-900 text-xs">
                                    {r.titleFa}
                                  </span>
                                  <span
                                    className={`text-[9px] px-2 py-0.5 rounded-md font-bold ${
                                      isSelected
                                        ? 'bg-sky-600 text-white'
                                        : 'bg-slate-100 text-slate-600'
                                    }`}
                                  >
                                    {r.levelBadge}
                                  </span>
                                </div>
                                <div className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                                  {r.accessScopeFa}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Active Role Duties & Scopes Preview Box */}
                      <div className="p-3.5 bg-[#F8FAFC] border border-sky-200/80 rounded-2xl space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-sky-950 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-sky-600" />
                            شرح وظایف و اختیارات {currentSelectedRoleDetail.titleFa}:
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {currentSelectedRoleDetail.titleEn}
                          </span>
                        </div>
                        <ul className="space-y-1 text-[11px] text-slate-600 pr-4 list-disc marker:text-sky-600">
                          {currentSelectedRoleDetail.dutiesFa.map((duty, idx) => (
                            <li key={idx}>{duty}</li>
                          ))}
                        </ul>

                        {/* Location Scope for Warehouse Operator */}
                        {currentSelectedRoleDetail.locationScoped && (
                          <div className="mt-2 pt-2 border-t border-sky-100">
                            <label className="block text-slate-800 font-bold text-xs mb-1 flex items-center gap-1.5">
                              <Warehouse className="w-3.5 h-3.5 text-amber-600" />
                              تعیین انبار / موقعیت تحت نظارت (Location Scope):
                            </label>
                            <ModernSelect
                              id="corp-login-loc-scope"
                              value={corpLoginLocationScope}
                              onChange={setCorpLoginLocationScope}
                              options={SHIPPER_AVAILABLE_LOCATIONS.map((loc) => ({
                                value: loc,
                                label: loc,
                              }))}
                            />
                            <p className="text-[10px] text-amber-800 mt-1">
                              * مسئول انبار تنها مجاز به مشاهده بارهای ورودی/خروجی این انبار و تایید بارگیری و آپلود POD آن می‌باشد.
                            </p>
                          </div>
                        )}

                        {/* Approval Limit for Logistics Coordinator */}
                        {currentSelectedRoleDetail.hasApprovalLimit && (
                          <div className="mt-2 pt-2 border-t border-sky-100 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 text-slate-700">
                              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                              <span>سقف تایید خودکار سفارش بدون نیاز به تایید مدیر:</span>
                            </div>
                            <div className="font-bold font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                              {corpLoginApprovalLimitToman.toLocaleString('fa-IR')} تومان
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* نام و نام خانوادگی */}
                        <div>
                          <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-sky-600" />
                            نام و نام خانوادگی شخص:
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="مثال: مهندس جواد اکبری"
                            value={corpLoginFullName}
                            onChange={(e) => setCorpLoginFullName(e.target.value)}
                            className="w-full bg-[#F8FAFC] border border-sky-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 font-medium transition-all"
                          />
                        </div>

                        {/* گذرواژه اختصاصی اون نقش */}
                        <div>
                          <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                            <KeyRound className="w-3.5 h-3.5 text-sky-600" />
                            گذرواژه اختصاصی کاربر:
                          </label>
                          <input
                            type="password"
                            required
                            placeholder="رمز عبور شخصی برای این نقش"
                            value={corpLoginRolePassword}
                            onChange={(e) => setCorpLoginRolePassword(e.target.value)}
                            className="w-full bg-[#F8FAFC] border border-sky-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 font-mono font-bold transition-all"
                          />
                        </div>
                      </div>

                      {/* Action Buttons: Back + Submit */}
                      <div className="pt-2 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setCorpLoginStep(1);
                            setErrorMessage(null);
                          }}
                          className="py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer text-xs"
                        >
                          <ArrowRight className="w-4 h-4" />
                          <span>مرحله قبل</span>
                        </button>

                        <button
                          type="submit"
                          className="flex-1 py-3.5 bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 transition-all cursor-pointer text-sm"
                        >
                          <KeyRound className="w-4 h-4" />
                          <span>ورود به پرتال صاحب بار با نقش {currentSelectedRoleDetail.titleFa}</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* 1.2 Corporate Register (3 Steps: Company Identity -> SCM Admin -> Define Team & Scopes) */}
              {actionType === 'register' && (
                <form onSubmit={handleCorporateRegister} className="space-y-4">
                  {/* Step Progress Indicators */}
                  <div className="flex items-center justify-between px-1 pb-3 border-b border-slate-100 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                          corpRegStep === 1
                            ? 'bg-sky-600 text-white'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {corpRegStep > 1 ? <CheckCircle2 className="w-4 h-4" /> : '۱'}
                      </div>
                      <span className={corpRegStep === 1 ? 'font-bold text-slate-900' : 'text-slate-500'}>
                        هویت حقوقی شرکت
                      </span>
                    </div>

                    <div className="h-px w-8 bg-slate-200" />

                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                          corpRegStep === 2
                            ? 'bg-sky-600 text-white'
                            : corpRegStep > 2
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {corpRegStep > 2 ? <CheckCircle2 className="w-4 h-4" /> : '۲'}
                      </div>
                      <span className={corpRegStep === 2 ? 'font-bold text-slate-900' : 'text-slate-500'}>
                        مدیر ارشد لجستیک
                      </span>
                    </div>

                    <div className="h-px w-8 bg-slate-200" />

                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                          corpRegStep === 3
                            ? 'bg-sky-600 text-white'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        ۳
                      </div>
                      <span className={corpRegStep === 3 ? 'font-bold text-slate-900' : 'text-slate-500'}>
                        تعریف پرسنل و دسترسی‌ها
                      </span>
                    </div>
                  </div>

                  {/* STEP 1: Company Legal Identity */}
                  {corpRegStep === 1 && (
                    <div className="space-y-3 animate-in fade-in duration-150">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* نام شرکت */}
                        <div>
                          <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-sky-600" />
                            نام ثبتی شرکت / مجتمع صنعتی:
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="مثال: صنایع پتروشیمی زاگرس"
                            value={corpRegCompanyName}
                            onChange={(e) => setCorpRegCompanyName(e.target.value)}
                            className="w-full bg-[#F8FAFC] border border-sky-200/80 rounded-xl p-2.5 text-slate-800 text-xs focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 font-medium transition-all"
                          />
                        </div>

                        {/* شناسه ملی */}
                        <div>
                          <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-sky-600" />
                            شناسه ملی / کد اقتصادی:
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="مثال: 10100998877"
                            value={corpRegNationalId}
                            onChange={(e) => setCorpRegNationalId(e.target.value)}
                            className="w-full bg-[#F8FAFC] border border-sky-200/80 rounded-xl p-2.5 text-slate-800 text-xs focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 font-mono font-medium transition-all text-left"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* انبار / کارخانه اصلی */}
                        <div>
                          <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
                            <Warehouse className="w-3.5 h-3.5 text-sky-600" />
                            انبار اصلی / کارخانه مرکزی (Primary Hub):
                          </label>
                          <ModernSelect
                            id="corp-reg-warehouse"
                            value={corpRegPrimaryWarehouse}
                            onChange={setCorpRegPrimaryWarehouse}
                            options={SHIPPER_AVAILABLE_LOCATIONS.map((loc) => ({
                              value: loc,
                              label: loc,
                            }))}
                          />
                        </div>

                        {/* شماره ثبت */}
                        <div>
                          <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
                            <FileCheck2 className="w-3.5 h-3.5 text-sky-600" />
                            شماره ثبت شرکت و شهر ثبتی:
                          </label>
                          <input
                            type="text"
                            placeholder="مثال: ۴۴۵۹۲ - اصفهان"
                            value={corpRegRegistrationNo}
                            onChange={(e) => setCorpRegRegistrationNo(e.target.value)}
                            className="w-full bg-[#F8FAFC] border border-sky-200/80 rounded-xl p-2.5 text-slate-800 text-xs focus:border-sky-500 focus:bg-white focus:outline-none font-medium transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* ایمیل رسمی شرکت */}
                        <div>
                          <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-sky-600" />
                            ایمیل رسمی سازمان:
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="logistics@company.ir"
                            value={corpRegCompanyEmail}
                            onChange={(e) => setCorpRegCompanyEmail(e.target.value)}
                            className="w-full bg-[#F8FAFC] border border-sky-200/80 rounded-xl p-2.5 text-slate-800 text-xs focus:border-sky-500 focus:bg-white focus:outline-none font-mono font-medium text-left"
                          />
                        </div>

                        {/* گذرواژه شرکت */}
                        <div>
                          <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-sky-600" />
                            گذرواژه سازمانی ورود به شرکت:
                          </label>
                          <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={corpRegCompanyPassword}
                            onChange={(e) => setCorpRegCompanyPassword(e.target.value)}
                            className="w-full bg-[#F8FAFC] border border-sky-200/80 rounded-xl p-2.5 text-slate-800 text-xs focus:border-sky-500 focus:bg-white focus:outline-none font-mono font-bold"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
                        >
                          <span>مرحله بعدی: ثبت مشخصات مدیر ارشد لجستیک</span>
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Supply Chain Manager (Admin) Profile */}
                  {corpRegStep === 2 && (
                    <div className="space-y-3 animate-in fade-in duration-150">
                      <div className="p-3 bg-sky-50 border border-sky-200 rounded-2xl space-y-1">
                        <span className="text-xs font-bold text-sky-950 block">
                          مشخصات مدیر ارشد لجستیک / زنجیره تأمین (Supply Chain Manager / Admin)
                        </span>
                        <p className="text-[11px] text-slate-600">
                          مدیر ارشد دسترسی کامل به پورتال، گزارش‌های هزینه‌ای، تایید نهایی قراردادها، مدیریت سقف اعتباری و تعریف پرسنل خواهد داشت.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* نام مدیر ارشد */}
                        <div>
                          <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-sky-600" />
                            نام و نام خانوادگی مدیر ارشد:
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="مثال: دکتر مهدی صبوری"
                            value={corpRegAdminName}
                            onChange={(e) => setCorpRegAdminName(e.target.value)}
                            className="w-full bg-[#F8FAFC] border border-sky-200/80 rounded-xl p-2.5 text-slate-800 text-xs focus:border-sky-500 focus:bg-white focus:outline-none font-medium"
                          />
                        </div>

                        {/* شماره تماس همراه مدیر */}
                        <div>
                          <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-sky-600" />
                            شماره تلفن همراه مدیر ارشد:
                          </label>
                          <input
                            type="text"
                            placeholder="مثال: 09121112233"
                            value={corpRegAdminPhone}
                            onChange={(e) => setCorpRegAdminPhone(e.target.value)}
                            className="w-full bg-[#F8FAFC] border border-sky-200/80 rounded-xl p-2.5 text-slate-800 text-xs focus:border-sky-500 focus:bg-white focus:outline-none font-mono text-left"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* ایمیل اختصاصی مدیر */}
                        <div>
                          <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-sky-600" />
                            ایمیل سازمانی مدیر ارشد:
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="m.sabouri@company.ir"
                            value={corpRegAdminEmail}
                            onChange={(e) => setCorpRegAdminEmail(e.target.value)}
                            className="w-full bg-[#F8FAFC] border border-sky-200/80 rounded-xl p-2.5 text-slate-800 text-xs focus:border-sky-500 focus:bg-white focus:outline-none font-mono text-left"
                          />
                        </div>

                        {/* گذرواژه اختصاصی مدیر */}
                        <div>
                          <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-sky-600" />
                            گذرواژه اختصاصی مدیر ارشد:
                          </label>
                          <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={corpRegAdminPassword}
                            onChange={(e) => setCorpRegAdminPassword(e.target.value)}
                            className="w-full bg-[#F8FAFC] border border-sky-200/80 rounded-xl p-2.5 text-slate-800 text-xs focus:border-sky-500 focus:bg-white focus:outline-none font-mono font-bold"
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setCorpRegStep(1)}
                          className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center gap-1 text-xs cursor-pointer"
                        >
                          <ArrowRight className="w-4 h-4" />
                          <span>بازگشت</span>
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
                        >
                          <span>مرحله بعدی: تخصیص نقش‌های پرسنل و انبارها</span>
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Define Personnel, Scopes & Approval Limits */}
                  {corpRegStep === 3 && (
                    <div className="space-y-4 animate-in fade-in duration-150">
                      {/* Member Creation Card */}
                      <div className="p-4 bg-[#F8FAFC] border border-sky-200/80 rounded-2xl space-y-3">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-sky-600" />
                          تعریف پرسنل لجستیک، مسئولین انبار و امور مالی:
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-700 font-bold mb-1">انتخاب نقش سازمانی:</label>
                            <ModernSelect
                              id="new-member-role-select"
                              value={newMemberRoleId}
                              onChange={setNewMemberRoleId}
                              options={SHIPPER_ROLE_DETAILS.filter((r) => r.role !== 'Supply Chain Manager / Admin').map((r) => ({
                                value: r.id,
                                label: `${r.titleFa} (${r.levelBadge})`,
                              }))}
                            />
                          </div>

                          <div>
                            <label className="block text-slate-700 mb-1 font-bold">نام و نام خانوادگی:</label>
                            <input
                              type="text"
                              placeholder="مثال: رضا حسینی"
                              value={newMemberName}
                              onChange={(e) => setNewMemberName(e.target.value)}
                              className="w-full bg-white border border-sky-200 rounded-xl p-2 text-slate-800 text-xs font-medium focus:border-sky-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-700 mb-1 font-bold">ایمیل سازمانی کاربر:</label>
                            <input
                              type="email"
                              placeholder="hosseini@company.ir"
                              value={newMemberEmail}
                              onChange={(e) => setNewMemberEmail(e.target.value)}
                              className="w-full bg-white border border-sky-200 rounded-xl p-2 text-slate-800 text-xs font-mono font-medium focus:border-sky-500 focus:outline-none text-left"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-700 mb-1 font-bold">گذرواژه ورود کاربر:</label>
                            <input
                              type="password"
                              placeholder="••••••••"
                              value={newMemberPassword}
                              onChange={(e) => setNewMemberPassword(e.target.value)}
                              className="w-full bg-white border border-sky-200 rounded-xl p-2 text-slate-800 text-xs font-mono font-medium focus:border-sky-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Granular Scope Inputs */}
                        {currentNewMemberRoleDetail.locationScoped && (
                          <div className="p-2.5 bg-amber-50/80 border border-amber-200 rounded-xl space-y-1">
                            <label className="block text-amber-950 font-bold text-xs flex items-center gap-1.5">
                              <Warehouse className="w-3.5 h-3.5 text-amber-600" />
                              تخصیص انبار / کارخانه به این مسئول انبار (Location Scope):
                            </label>
                            <ModernSelect
                              id="new-member-loc"
                              value={newMemberLocationScope}
                              onChange={setNewMemberLocationScope}
                              options={SHIPPER_AVAILABLE_LOCATIONS.map((loc) => ({
                                value: loc,
                                label: loc,
                              }))}
                            />
                          </div>
                        )}

                        {currentNewMemberRoleDetail.hasApprovalLimit && (
                          <div className="p-2.5 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-1">
                            <label className="block text-emerald-950 font-bold text-xs flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                                سقف تایید سفارش بدون نیاز به تایید مدیر:
                              </span>
                              <span className="font-mono font-bold">
                                {newMemberApprovalLimitToman.toLocaleString('fa-IR')} تومان
                              </span>
                            </label>
                            <input
                              type="range"
                              min={20000000}
                              max={300000000}
                              step={10000000}
                              value={newMemberApprovalLimitToman}
                              onChange={(e) => setNewMemberApprovalLimitToman(Number(e.target.value))}
                              className="w-full accent-emerald-600 cursor-pointer"
                            />
                          </div>
                        )}

                        <div className="flex justify-end pt-1">
                          <button
                            type="button"
                            onClick={handleAddCorpMember}
                            className="py-2 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>افزودن این پرسنل به لیست شرکت</span>
                          </button>
                        </div>
                      </div>

                      {/* Defined Personnel Table / List */}
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-800 flex items-center justify-between">
                          <span>اعضای آماده تخصیص ({corpMembersList.length} نفر):</span>
                          <span className="text-[10px] text-slate-500 font-normal">
                            مدیر ارشد لجستیک: {corpRegAdminName || 'دکتر صبوری'}
                          </span>
                        </span>
                        <div className="space-y-1.5 max-h-36 overflow-y-auto">
                          {corpMembersList.map((m) => (
                            <div
                              key={m.id}
                              className="p-2 bg-[#F8FAFC] border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-lg bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-[10px]">
                                  {m.fullName.substring(0, 1)}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-800">{m.fullName}</div>
                                  <div className="text-[10px] text-slate-500 font-mono">{m.email}</div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-200 text-[10px] font-bold">
                                  {m.roleTitleFa}
                                </span>
                                {m.locationScope && (
                                  <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-bold truncate max-w-[120px]">
                                    {m.locationScope}
                                  </span>
                                )}
                                {m.approvalLimitToman && (
                                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9px] font-mono font-bold">
                                    سقف: {(m.approvalLimitToman / 1000000).toLocaleString('fa-IR')} م
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCorpMember(m.id)}
                                  className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                                  title="حذف"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setCorpRegStep(2)}
                          className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center gap-1 text-xs cursor-pointer"
                        >
                          <ArrowRight className="w-4 h-4" />
                          <span>مرحله قبل</span>
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-3.5 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-sky-600/20 text-sm"
                        >
                          <CheckCircle2 className="w-4.5 h-4.5" />
                          <span>تکمیل ثبت‌نام سازمان و ورود به پرتال با نقش مدیر ارشد</span>
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              )}
            </>
          )}

          {/* ========================================================================= */}
          {/* OPTION 2: BAR-E KHORRD (RETAIL / INDIVIDUAL) */}
          {/* ========================================================================= */}
          {cargoCategory === 'retail' && (
            <>
              {actionType === 'login' && (
                <form onSubmit={handleRetailLogin} className="space-y-4 animate-in fade-in duration-150">
                  <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-2xl text-[11px] text-sky-950 font-medium">
                    ورود صاحبان بار خرد، بارهای شخصی، محموله‌های کارگاهی و حمل‌های انفرادی
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-sky-600" />
                      نام و نام خانوادگی:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: علی مرادی"
                      value={retailLoginFullName}
                      onChange={(e) => setRetailLoginFullName(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-sky-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-sky-500 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-sky-600" />
                        شماره تلفن همراه:
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="09123456789"
                        value={retailLoginPhone}
                        onChange={(e) => setRetailLoginPhone(e.target.value)}
                        className="w-full bg-[#F8FAFC] border border-sky-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-sky-500 focus:bg-white focus:outline-none font-mono text-left"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-sky-600" />
                        پست الکترونیک:
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="ali.moradi@gmail.com"
                        value={retailLoginEmail}
                        onChange={(e) => setRetailLoginEmail(e.target.value)}
                        className="w-full bg-[#F8FAFC] border border-sky-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-sky-500 focus:bg-white focus:outline-none font-mono text-left"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-sky-600" />
                      گذرواژه حساب کاربری:
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={retailLoginPassword}
                      onChange={(e) => setRetailLoginPassword(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-sky-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-sky-500 focus:bg-white focus:outline-none font-mono font-bold"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 cursor-pointer text-sm"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>ورود به سامانه بار خرد</span>
                    </button>
                  </div>
                </form>
              )}

              {actionType === 'register' && (
                <form onSubmit={handleRetailRegister} className="space-y-4 animate-in fade-in duration-150">
                  <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-2xl text-[11px] text-sky-950 font-medium">
                    ایجاد حساب کاربری جدید برای ارسال بارهای انفرادی، اثاثیه صنعتی و بار خرد
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-sky-600" />
                      نام و نام خانوادگی کامل:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: مهران کاظمی"
                      value={retailRegFullName}
                      onChange={(e) => setRetailRegFullName(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-sky-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-sky-500 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-sky-600" />
                        شماره تلفن همراه (جهت دریافت کد پیگیری):
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="09121112233"
                        value={retailRegPhone}
                        onChange={(e) => setRetailRegPhone(e.target.value)}
                        className="w-full bg-[#F8FAFC] border border-sky-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-sky-500 focus:bg-white focus:outline-none font-mono text-left"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-sky-600" />
                        پست الکترونیک (ایمیل):
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="kazemi@gmail.com"
                        value={retailRegEmail}
                        onChange={(e) => setRetailRegEmail(e.target.value)}
                        className="w-full bg-[#F8FAFC] border border-sky-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-sky-500 focus:bg-white focus:outline-none font-mono text-left"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-sky-600" />
                      تعیین گذرواژه حساب:
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={retailRegPassword}
                      onChange={(e) => setRetailRegPassword(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-sky-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-sky-500 focus:bg-white focus:outline-none font-mono font-bold"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 cursor-pointer text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>ثبت‌نام و ورود مستقیم به پنل استعلام بار خرد</span>
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
