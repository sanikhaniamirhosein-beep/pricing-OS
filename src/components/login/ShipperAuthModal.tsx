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
} from 'lucide-react';
import { UserRole } from '../../types/pricing';
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
  }) => void;
}

interface ShipperRoleMember {
  id: string;
  roleTitle: string;
  fullName: string;
  email: string;
  password: string;
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
  const [corpLoginOrgPassword, setCorpLoginOrgPassword] = useState('steel@1403');
  const [corpLoginRole, setCorpLoginRole] = useState('مدیر تدارکات و زنجیره تامین');
  const [corpLoginFullName, setCorpLoginFullName] = useState('مهندس جواد اکبری');
  const [corpLoginRolePassword, setCorpLoginRolePassword] = useState('pass@123');

  // Corporate Register States
  const [corpRegAdminName, setCorpRegAdminName] = useState('');
  const [corpRegCompanyEmail, setCorpRegCompanyEmail] = useState('');
  const [corpRegCompanyPassword, setCorpRegCompanyPassword] = useState('');
  const [corpRegCompanyName, setCorpRegCompanyName] = useState('');

  // Corporate Register Role items
  const [corpNewRoleTitle, setCorpNewRoleTitle] = useState('کارشناس صدور و پیگیری بارنامه');
  const [corpNewRoleName, setCorpNewRoleName] = useState('');
  const [corpNewRoleEmail, setCorpNewRoleEmail] = useState('');
  const [corpNewRolePass, setCorpNewRolePass] = useState('');
  const [corpMembersList, setCorpMembersList] = useState<ShipperRoleMember[]>([]);

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

  const corporateRoleOptions = [
    'مدیر تدارکات و زنجیره تامین',
    'کارشناس صدور و پیگیری بارنامه',
    'مدیر بازرگانی و قراردادهای حمل',
    'کارشناس مالی و تسویه فاکتورها',
    'مدیر انبار و ترخیص کالا',
  ];

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

    onSuccessLogin({
      orgName: corpLoginOrgName,
      userName: `${corpLoginFullName} (${corpLoginRole})`,
      userEmail: `shipper@${corpLoginOrgName.replace(/\s+/g, '').toLowerCase()}.ir`,
      role: 'Key Account Manager',
      isCorporate: true,
    });
  };

  // 2. Submit Corporate Register
  const handleAddCorpMember = () => {
    if (!corpNewRoleName.trim() || !corpNewRoleEmail.trim() || !corpNewRolePass.trim()) {
      setErrorMessage('لطفاً اطلاعات عضو سازمانی را کامل نمایید.');
      return;
    }

    setCorpMembersList((prev) => [
      ...prev,
      {
        id: `CORP-ROLE-${Date.now()}`,
        roleTitle: corpNewRoleTitle,
        fullName: corpNewRoleName,
        email: corpNewRoleEmail,
        password: corpNewRolePass,
      },
    ]);

    setCorpNewRoleName('');
    setCorpNewRoleEmail('');
    setCorpNewRolePass('');
    setErrorMessage(null);
  };

  const handleCorporateRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!corpRegAdminName.trim()) {
      setErrorMessage('لطفاً نام و نام خانوادگی مدیر ارشد را وارد نمایید.');
      return;
    }
    if (!corpRegCompanyEmail.trim() || !corpRegCompanyEmail.includes('@')) {
      setErrorMessage('لطفاً ایمیل معتبر شرکت را وارد فرمایید.');
      return;
    }
    if (!corpRegCompanyPassword.trim() || corpRegCompanyPassword.length < 4) {
      setErrorMessage('گذرواژه شرکت باید حداقل ۴ کاراکتر باشد.');
      return;
    }

    const orgDisplay = corpRegCompanyName.trim() || 'شرکت بازرگانی صنایع صنعتی';

    onSuccessLogin({
      orgName: orgDisplay,
      userName: `${corpRegAdminName} (مدیر ارشد صاحب‌کالا)`,
      userEmail: corpRegCompanyEmail,
      role: 'Key Account Manager',
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
      userName: `${retailLoginFullName} (صاحب بار)`,
      userEmail: retailLoginEmail,
      role: 'Key Account Manager',
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
      userName: `${retailRegFullName} (صاحب بار)`,
      userEmail: retailRegEmail,
      role: 'Key Account Manager',
      isCorporate: false,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div className="w-full max-w-2xl bg-white border border-teal-200/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-teal-100 bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base font-display">
                  درگاه اختصاصی صاحبان بار و صنایع
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-900 border border-teal-300">
                  صاحب بار
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                استعلام شفاف تعرفه، پیگیری قراردادها و تخفیفات تناژ
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
        <div className="p-4 bg-[#F5FAF8] border-b border-teal-100/80 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setCargoCategory('corporate');
              setErrorMessage(null);
            }}
            className={`py-3 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              cargoCategory === 'corporate'
                ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20'
                : 'bg-white text-slate-700 hover:bg-teal-50 border border-teal-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>بار شرکتی (کارخانجات و صنایع)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setCargoCategory('retail');
              setErrorMessage(null);
            }}
            className={`py-3 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              cargoCategory === 'retail'
                ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20'
                : 'bg-white text-slate-700 hover:bg-teal-50 border border-teal-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>بار خرد (حمل انفرادی / شخصی)</span>
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
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>ورود به سامانه</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActionType('register');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              actionType === 'register'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ایجاد حساب در سامانه</span>
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
                            ? 'bg-teal-600 text-white'
                            : 'bg-emerald-500 text-white'
                        }`}
                      >
                        {corpLoginStep > 1 ? <CheckCircle2 className="w-4 h-4" /> : '۱'}
                      </div>
                      <span className={`text-xs ${corpLoginStep === 1 ? 'font-bold text-slate-900' : 'text-slate-500'}`}>
                        مرحله ۱: مشخصات و گذرواژه شرکت
                      </span>
                    </div>

                    <div className="h-px w-12 bg-slate-200" />

                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                          corpLoginStep === 2
                            ? 'bg-teal-600 text-white'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        ۲
                      </div>
                      <span className={`text-xs ${corpLoginStep === 2 ? 'font-bold text-slate-900' : 'text-slate-400'}`}>
                        مرحله ۲: تعیین نقش و گذرواژه نقش
                      </span>
                    </div>
                  </div>

                  {/* Corporate Login Step 1 */}
                  {corpLoginStep === 1 && (
                    <form onSubmit={handleCorpLoginStep1Next} className="space-y-4 animate-in fade-in duration-150">
                      {/* Preset quick helpers */}
                      <div className="p-3 bg-[#FAF8F5] border border-teal-200/70 rounded-2xl flex flex-wrap items-center justify-between gap-2">
                        <span className="text-slate-600 font-bold text-[11px] flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                          شرکت‌های صنعتی پیش‌فرض:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setCorpLoginOrgName('شرکت فولاد مبارکه اصفهان');
                              setCorpLoginOrgPassword('steel@1403');
                              setCorpLoginFullName('مهندس جواد اکبری');
                              setCorpLoginRole('مدیر تدارکات و زنجیره تامین');
                            }}
                            className="px-2.5 py-1 bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-900 border border-teal-200 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                          >
                            فولاد مبارکه
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCorpLoginOrgName('هلدینگ پتروشیمی خلیج فارس');
                              setCorpLoginOrgPassword('petro@1403');
                              setCorpLoginFullName('دکتر فریبرز نادری');
                              setCorpLoginRole('مدیر بازرگانی و قراردادهای حمل');
                            }}
                            className="px-2.5 py-1 bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-900 border border-teal-200 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                          >
                            پتروشیمی خلیج فارس
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCorpLoginOrgName('صنایع کاشی و سرامیک البرز');
                              setCorpLoginOrgPassword('alborz@1403');
                              setCorpLoginFullName('سعید کمالی');
                              setCorpLoginRole('کارشناس صدور و پیگیری بارنامه');
                            }}
                            className="px-2.5 py-1 bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-900 border border-teal-200 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                          >
                            کاشی البرز
                          </button>
                        </div>
                      </div>

                      {/* اسم شرکت */}
                      <div>
                        <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-teal-600" />
                          اسم شرکت / مجتمع صنعتی:
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="مثال: شرکت فولاد مبارکه اصفهان"
                          value={corpLoginOrgName}
                          onChange={(e) => setCorpLoginOrgName(e.target.value)}
                          className="w-full bg-[#FAF8F5] border border-amber-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium transition-all"
                        />
                      </div>

                      {/* گذرواژه ورود به شرکت */}
                      <div>
                        <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-teal-600" />
                          گذرواژه ورود به شرکت (Master Password):
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={corpLoginOrgPassword}
                          onChange={(e) => setCorpLoginOrgPassword(e.target.value)}
                          className="w-full bg-[#FAF8F5] border border-amber-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-mono font-bold transition-all"
                        />
                      </div>

                      {/* Next Step Button */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md shadow-teal-600/20 transition-all cursor-pointer text-sm"
                        >
                          <span>ادامه و تعیین نقش سازمانی</span>
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Corporate Login Step 2 */}
                  {corpLoginStep === 2 && (
                    <form onSubmit={handleCorporateLogin} className="space-y-4 animate-in fade-in duration-150">
                      {/* Preview Company Banner */}
                      <div className="p-3 bg-teal-50/80 border border-teal-200 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-500 font-medium">شرکت انتخاب‌شده:</div>
                            <div className="text-xs font-bold text-slate-900">{corpLoginOrgName}</div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setCorpLoginStep(1);
                            setErrorMessage(null);
                          }}
                          className="text-[11px] font-bold text-teal-800 hover:text-teal-950 underline px-2 py-1 cursor-pointer"
                        >
                          ویرایش شرکت
                        </button>
                      </div>

                      {/* نام و نام خانوادگی */}
                      <div>
                        <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-teal-600" />
                          نام و نام خانوادگی شخص:
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="مثال: مهندس جواد اکبری"
                          value={corpLoginFullName}
                          onChange={(e) => setCorpLoginFullName(e.target.value)}
                          className="w-full bg-[#FAF8F5] border border-amber-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium transition-all"
                        />
                      </div>

                      {/* انتخاب نقش در سامانه */}
                      <div>
                        <ModernSelect
                          id="corp-login-role"
                          value={corpLoginRole}
                          onChange={setCorpLoginRole}
                          label="انتخاب نقش در سامانه:"
                          icon={<Briefcase className="w-3.5 h-3.5 text-teal-600" />}
                          options={corporateRoleOptions.map((opt) => ({
                            value: opt,
                            label: opt,
                          }))}
                        />
                      </div>

                      {/* گذرواژه اختصاصی اون نقش */}
                      <div>
                        <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                          <KeyRound className="w-3.5 h-3.5 text-teal-600" />
                          گذرواژه اختصاصی نقش:
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="رمز عبور شخصی برای این نقش"
                          value={corpLoginRolePassword}
                          onChange={(e) => setCorpLoginRolePassword(e.target.value)}
                          className="w-full bg-[#FAF8F5] border border-amber-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-mono font-bold transition-all"
                        />
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
                          className="flex-1 py-3.5 bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md shadow-teal-600/20 transition-all cursor-pointer text-sm"
                        >
                          <KeyRound className="w-4 h-4" />
                          <span>ورود به پرتال شرکتی</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* 1.2 Corporate Register */}
              {actionType === 'register' && (
                <form onSubmit={handleCorporateRegister} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* نام شرکت */}
                    <div>
                      <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-teal-600" />
                        نام شرکت / سازمان:
                      </label>
                      <input
                        type="text"
                        placeholder="مثال: صنایع پتروشیمی زاگرس"
                        value={corpRegCompanyName}
                        onChange={(e) => setCorpRegCompanyName(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-amber-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium transition-all"
                      />
                    </div>

                    {/* نام و نام خانوادگی مدیر ارشد */}
                    <div>
                      <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-teal-600" />
                        نام و نام خانوادگی مدیر ارشد:
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: دکتر مهدی صبوری"
                        value={corpRegAdminName}
                        onChange={(e) => setCorpRegAdminName(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-amber-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* ایمیل شرکت */}
                    <div>
                      <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-teal-600" />
                        ایمیل رسمی شرکت:
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="logistics@company.ir"
                        value={corpRegCompanyEmail}
                        onChange={(e) => setCorpRegCompanyEmail(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-amber-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-mono font-medium transition-all text-left"
                      />
                    </div>

                    {/* گذرواژه شرکت */}
                    <div>
                      <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-teal-600" />
                        گذرواژه شرکت:
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={corpRegCompanyPassword}
                        onChange={(e) => setCorpRegCompanyPassword(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-amber-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-mono font-bold transition-all"
                      />
                    </div>
                  </div>

                  {/* تعریف نقش‌های مختلف شرکت و اطلاعات افراد */}
                  <div className="p-4 bg-[#FAF8F5] border border-amber-200/80 rounded-2xl space-y-3">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-teal-600" />
                      تعریف نقش‌های مختلف شرکت و اعضای تیم:
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <ModernSelect
                          id="corp-new-role"
                          value={corpNewRoleTitle}
                          onChange={setCorpNewRoleTitle}
                          label="نقش در سامانه:"
                          options={corporateRoleOptions.map((opt) => ({
                            value: opt,
                            label: opt,
                          }))}
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 mb-1 font-bold">نام و نام خانوادگی:</label>
                        <input
                          type="text"
                          placeholder="مثال: رضا صالحی"
                          value={corpNewRoleName}
                          onChange={(e) => setCorpNewRoleName(e.target.value)}
                          className="w-full bg-white border border-amber-200 rounded-xl p-2 text-slate-800 text-xs font-medium focus:border-teal-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 mb-1 font-bold">ایمیل شخص:</label>
                        <input
                          type="email"
                          placeholder="salehi@company.ir"
                          value={corpNewRoleEmail}
                          onChange={(e) => setCorpNewRoleEmail(e.target.value)}
                          className="w-full bg-white border border-amber-200 rounded-xl p-2 text-slate-800 text-xs font-mono font-medium focus:border-teal-500 focus:outline-none text-left"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 mb-1 font-bold">گذرواژه اون نقش:</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={corpNewRolePass}
                          onChange={(e) => setCorpNewRolePass(e.target.value)}
                          className="w-full bg-white border border-amber-200 rounded-xl p-2 text-slate-800 text-xs font-mono font-medium focus:border-teal-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={handleAddCorpMember}
                        className="py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>ثبت نقش در لیست شرکت</span>
                      </button>
                    </div>
                  </div>

                  {/* List of Defined Roles */}
                  {corpMembersList.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-700 block">
                        نقش‌ها و کاربران تعریف‌شده ({corpMembersList.length} نفر):
                      </span>
                      <div className="space-y-1 max-h-28 overflow-y-auto">
                        {corpMembersList.map((m) => (
                          <div
                            key={m.id}
                            className="p-2 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{m.fullName}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-teal-50 text-teal-900 border border-teal-200 font-bold">
                                {m.roleTitle}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">{m.email}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                setCorpMembersList((prev) => (prev || []).filter((item) => item.id !== m.id))
                              }
                              className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-teal-700 hover:bg-teal-800 active:scale-[0.99] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md shadow-teal-700/20 transition-all cursor-pointer text-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>تکمیل ایجاد حساب شرکتی و ورود به سامانه</span>
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* ========================================================================= */}
          {/* OPTION 2: BAR-E KHORRD (RETAIL / INDIVIDUAL) */}
          {/* ========================================================================= */}
          {cargoCategory === 'retail' && (
            <>
              {/* 2.1 Retail Login */}
              {actionType === 'login' && (
                <form onSubmit={handleRetailLogin} className="space-y-4">
                  {/* نام و نام خانوادگی */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-teal-600" />
                      نام و نام خانوادگی:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: علی مرادی"
                      value={retailLoginFullName}
                      onChange={(e) => setRetailLoginFullName(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-amber-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* شماره تلفن */}
                    <div>
                      <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-teal-600" />
                        شماره تلفن همراه:
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="09123456789"
                        value={retailLoginPhone}
                        onChange={(e) => setRetailLoginPhone(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-amber-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-mono font-medium transition-all text-left"
                      />
                    </div>

                    {/* ایمیل */}
                    <div>
                      <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-teal-600" />
                        آدرس ایمیل:
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="ali.moradi@gmail.com"
                        value={retailLoginEmail}
                        onChange={(e) => setRetailLoginEmail(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-amber-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-mono font-medium transition-all text-left"
                      />
                    </div>
                  </div>

                  {/* گذرواژه */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-teal-600" />
                      گذرواژه:
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={retailLoginPassword}
                      onChange={(e) => setRetailLoginPassword(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-amber-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-mono font-bold transition-all"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md shadow-teal-600/20 transition-all cursor-pointer text-sm"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>ورود به سامانه بار خرد</span>
                    </button>
                  </div>
                </form>
              )}

              {/* 2.2 Retail Register */}
              {actionType === 'register' && (
                <form onSubmit={handleRetailRegister} className="space-y-4">
                  {/* نام و نام خانوادگی */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-teal-600" />
                      نام و نام خانوادگی:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: حسین یوسفی"
                      value={retailRegFullName}
                      onChange={(e) => setRetailRegFullName(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-amber-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* ایمیل */}
                    <div>
                      <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-teal-600" />
                        آدرس ایمیل:
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="hosein@gmail.com"
                        value={retailRegEmail}
                        onChange={(e) => setRetailRegEmail(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-amber-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-mono font-medium transition-all text-left"
                      />
                    </div>

                    {/* شماره تلفن */}
                    <div>
                      <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-teal-600" />
                        شماره تلفن همراه:
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="09121112233"
                        value={retailRegPhone}
                        onChange={(e) => setRetailRegPhone(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-amber-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-mono font-medium transition-all text-left"
                      />
                    </div>
                  </div>

                  {/* گذرواژه */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-teal-600" />
                      تعیین گذرواژه حساب:
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="حداقل ۴ کاراکتر"
                      value={retailRegPassword}
                      onChange={(e) => setRetailRegPassword(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-amber-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-mono font-bold transition-all"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-teal-700 hover:bg-teal-800 active:scale-[0.99] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md shadow-teal-700/20 transition-all cursor-pointer text-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>ایجاد حساب بار خرد و ورود به پرتال</span>
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
