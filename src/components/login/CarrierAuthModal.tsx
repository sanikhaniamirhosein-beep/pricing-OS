import React, { useState } from 'react';
import {
  X,
  Building2,
  Lock,
  User,
  Mail,
  Shield,
  CheckCircle2,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  KeyRound,
  Users,
  AlertCircle,
  Briefcase,
  Layers,
} from 'lucide-react';
import { UserRole } from '../../types/pricing';
import { ModernSelect } from '../common/menus/ModernSelect';
import { CARRIER_ROLE_DETAILS, getRoleDetail } from '../../data/carrierRolesConfig';

interface CarrierAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (userData: {
    orgName: string;
    userName: string;
    userEmail: string;
    role: UserRole;
  }) => void;
}

interface TeamMemberItem {
  id: string;
  role: UserRole;
  fullName: string;
  email: string;
  password: string;
}

export const CarrierAuthModal: React.FC<CarrierAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login Form States (Multi-step login)
  const [loginStep, setLoginStep] = useState<1 | 2>(1);
  const [loginOrgName, setLoginOrgName] = useState('شرکت حمل و نقل سراسری خلیج فارس');
  const [loginOrgPassword, setLoginOrgPassword] = useState('carrier@1403');
  const [loginSelectedRole, setLoginSelectedRole] = useState<UserRole>('System Admin / Fleet Director');
  const [loginRolePassword, setLoginRolePassword] = useState('admin@1403');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register Form States (Multi-step)
  const [regStep, setRegStep] = useState<1 | 2>(1);
  const [regOrgName, setRegOrgName] = useState('');
  const [regOrgEmail, setRegOrgEmail] = useState('');
  const [regNationalId, setRegNationalId] = useState('');
  const [regAdminName, setRegAdminName] = useState('');
  const [regAdminEmail, setRegAdminEmail] = useState('');
  const [regOrgPassword, setRegOrgPassword] = useState('');
  const [regError, setRegError] = useState<string | null>(null);

  // Register Step 2: Team Members
  const [memberRole, setMemberRole] = useState<UserRole>('Pricing & Yield Manager');
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberPassword, setMemberPassword] = useState('');
  const [teamMembers, setTeamMembers] = useState<TeamMemberItem[]>([]);

  if (!isOpen) return null;

  const roleOptions = CARRIER_ROLE_DETAILS;

  // Handle Login Step 1 (Company credentials validation)
  const handleLoginStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginOrgName.trim()) {
      setLoginError('لطفاً نام سازمان یا شرکت حمل‌ونقل را وارد فرمایید.');
      return;
    }
    if (!loginOrgPassword.trim()) {
      setLoginError('لطفاً رمز ورود شرکت را وارد فرمایید.');
      return;
    }

    setLoginStep(2);
  };

  // Handle Login Step 2 (Role selection & Role password submit)
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginRolePassword.trim()) {
      setLoginError('لطفاً رمز ورود مربوط به نقش انتخاب‌شده را وارد فرمایید.');
      return;
    }

    // Role display name mapper
    const roleInfo = getRoleDetail(loginSelectedRole);
    const resolvedName = `${roleInfo.defaultUserName} (${roleInfo.titleFa})`;

    onSuccessLogin({
      orgName: loginOrgName,
      userName: resolvedName,
      userEmail: roleInfo.defaultUserEmail,
      role: loginSelectedRole,
    });
  };

  // Handle Register Step 1
  const handleRegStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regOrgName.trim()) {
      setRegError('لطفاً نام شرکت حمل‌ونقل را وارد نمایید.');
      return;
    }
    if (!regOrgEmail.trim() || !regOrgEmail.includes('@')) {
      setRegError('لطفاً یک ایمیل معتبر برای شرکت وارد نمایید.');
      return;
    }
    if (!regAdminName.trim()) {
      setRegError('لطفاً نام و نام خانوادگی مدیر ارشد / مدیر سیستم را وارد نمایید.');
      return;
    }
    if (!regAdminEmail.trim() || !regAdminEmail.includes('@')) {
      setRegError('لطفاً ایمیل مدیر ارشد را وارد نمایید.');
      return;
    }
    if (!regOrgPassword.trim() || regOrgPassword.length < 4) {
      setRegError('رمز عبور شرکت باید حداقل ۴ کاراکتر باشد.');
      return;
    }

    // Proceed to Step 2
    setRegStep(2);
  };

  // Add Team Member in Step 2
  const handleAddTeamMember = () => {
    if (!memberName.trim() || !memberEmail.trim() || !memberPassword.trim()) {
      setRegError('لطفاً کلیه اطلاعات کاربر جدید را تکمیل فرمایید.');
      return;
    }

    setTeamMembers((prev) => [
      ...prev,
      {
        id: `MEMBER-${Date.now()}`,
        role: memberRole,
        fullName: memberName,
        email: memberEmail,
        password: memberPassword,
      },
    ]);

    // Reset member inputs
    setMemberName('');
    setMemberEmail('');
    setMemberPassword('');
    setRegError(null);
  };

  // Finish Registration & Log In
  const handleFinishRegistration = () => {
    onSuccessLogin({
      orgName: regOrgName,
      userName: `${regAdminName} (مدیر ارشد / مدیر سیستم)`,
      userEmail: regAdminEmail,
      role: 'System Admin / Fleet Director',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div className="w-full max-w-2xl bg-white border border-amber-200/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Header with Organization Branding */}
        <div className="flex items-center justify-between p-5 border-b border-amber-100 bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base font-display">
                  درگاه اختصاصی سازمان‌های حمل‌ونقل و لجستیک
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  سازمانی
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                ورود امن به محیط تعرفه‌گذاری، مدیریت ناوگان و تصویب استراتژی‌ها
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

        {/* Top Switcher Tabs: ورود به سامانه / ثبت سامانه جدید */}
        <div className="px-6 pt-4 pb-2 bg-white border-b border-slate-100 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setLoginError(null);
            }}
            className={`flex-1 py-3 px-4 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>ورود به سامانه</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setRegError(null);
            }}
            className={`flex-1 py-3 px-4 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>ثبت سامانه جدید</span>
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="p-6 overflow-y-auto space-y-5 bg-white text-xs">
          {/* ===================== TAB 1: LOGIN ===================== */}
          {activeTab === 'login' && (
            <div className="space-y-4">
              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 flex items-center gap-2 text-xs font-medium animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Login Steps Progress Bar */}
              <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      loginStep === 1
                        ? 'bg-amber-500 text-white'
                        : 'bg-emerald-500 text-white'
                    }`}
                  >
                    {loginStep > 1 ? <CheckCircle2 className="w-4 h-4" /> : '۱'}
                  </div>
                  <span className={`text-xs ${loginStep === 1 ? 'font-bold text-slate-900' : 'text-slate-500'}`}>
                    مرحله ۱: مشخصات و رمز عبور شرکت
                  </span>
                </div>

                <div className="h-px w-12 bg-slate-200" />

                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      loginStep === 2
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    ۲
                  </div>
                  <span className={`text-xs ${loginStep === 2 ? 'font-bold text-slate-900' : 'text-slate-400'}`}>
                    مرحله ۲: تعیین نقش و رمز عبور
                  </span>
                </div>
              </div>

              {/* STEP 1: Company Credentials */}
              {loginStep === 1 && (
                <form onSubmit={handleLoginStep1Next} className="space-y-4 animate-in fade-in duration-150">
                  {/* Quick autofill presets */}
                  <div className="p-3 bg-[#FAF8F5] border border-amber-200/70 rounded-2xl flex flex-wrap items-center justify-between gap-2">
                    <span className="text-slate-600 font-bold text-[11px] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      شرکت‌های دمو پیش‌فرض:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setLoginOrgName('شرکت حمل و نقل سراسری خلیج فارس');
                          setLoginOrgPassword('carrier@1403');
                        }}
                        className="px-2.5 py-1 bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-amber-200 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                      >
                        خلیج فارس
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginOrgName('شرکت ترانزیت جهان لجستیک');
                          setLoginOrgPassword('jahan@1403');
                        }}
                        className="px-2.5 py-1 bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-amber-200 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                      >
                        جهان ترانزیت
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginOrgName('پیشگامان باربری آریا');
                          setLoginOrgPassword('arya@1403');
                        }}
                        className="px-2.5 py-1 bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-amber-200 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                      >
                        باربری آریا
                      </button>
                    </div>
                  </div>

                  {/* 1. اسم سازمان یا شرکت */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-amber-600" />
                      اسم سازمان یا شرکت حمل‌ونقل:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: شرکت حمل و نقل سراسری خلیج فارس"
                      value={loginOrgName}
                      onChange={(e) => setLoginOrgName(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-amber-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-medium transition-all"
                    />
                  </div>

                  {/* 2. رمز ورود شرکت */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-600" />
                      رمز ورود شرکت (Company Master Password):
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginOrgPassword}
                      onChange={(e) => setLoginOrgPassword(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-amber-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-mono font-bold transition-all"
                    />
                  </div>

                  {/* Next Step Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-all cursor-pointer text-sm"
                    >
                      <span>ادامه و تعیین نقش سازمانی</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>

                  {/* In case org does not exist */}
                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('register');
                        setRegError(null);
                      }}
                      className="text-xs font-bold text-amber-800 hover:text-amber-900 hover:underline cursor-pointer"
                    >
                      سازمان شما ثبت نشده است؟ برای ایجاد و ثبت سامانه جدید کلیک کنید
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2: Role Selection & Role Password */}
              {loginStep === 2 && (
                <form onSubmit={handleLoginSubmit} className="space-y-4 animate-in fade-in duration-150">
                  {/* Selected Company Preview Banner */}
                  <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 font-medium">سازمان انتخاب‌شده:</div>
                        <div className="text-xs font-bold text-slate-900">{loginOrgName}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setLoginStep(1);
                        setLoginError(null);
                      }}
                      className="text-[11px] font-bold text-amber-800 hover:text-amber-950 underline px-2 py-1 cursor-pointer"
                    >
                      ویرایش شرکت
                    </button>
                  </div>

                  {/* Role Selection Grid */}
                  <div>
                    <label className="block text-slate-800 font-extrabold mb-2 flex items-center gap-1.5 text-xs">
                      <Users className="w-4 h-4 text-amber-600" />
                      انتخاب نقش کاربری در شرکت:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                      {roleOptions.map((item) => {
                        const isSelected = loginSelectedRole === item.role;
                        return (
                          <button
                            type="button"
                            key={item.role}
                            onClick={() => setLoginSelectedRole(item.role)}
                            className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? 'bg-amber-50 border-amber-500 text-amber-950 shadow-2xs ring-1 ring-amber-500/30'
                                : 'bg-[#FAF8F5] border-amber-200/60 text-slate-700 hover:bg-white hover:border-amber-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-extrabold text-xs">{item.titleFa}</span>
                              <span
                                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                  isSelected
                                    ? 'bg-amber-500 border-amber-500 text-white'
                                    : 'border-slate-300'
                                }`}
                              >
                                {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500 line-clamp-1">
                              {item.accessScopeFa}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Role Password Input */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                      رمز ورود اختصاصی نقش ({roleOptions.find((r) => r.role === loginSelectedRole)?.titleFa}):
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="رمز عبور اختصاصی این نقش"
                      value={loginRolePassword}
                      onChange={(e) => setLoginRolePassword(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-amber-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-mono font-bold transition-all"
                    />
                  </div>

                  {/* Action Buttons: Back + Submit */}
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setLoginStep(1);
                        setLoginError(null);
                      }}
                      className="py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer text-xs"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>مرحله قبل</span>
                    </button>

                    <button
                      type="submit"
                      className="flex-1 py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-all cursor-pointer text-sm"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>تایید نهایی و ورود به سامانه</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ===================== TAB 2: REGISTER NEW ORG ===================== */}
          {activeTab === 'register' && (
            <div className="space-y-4">
              {regError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 flex items-center gap-2 text-xs font-medium animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{regError}</span>
                </div>
              )}

              {/* Steps Progress Indicator */}
              <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      regStep === 1
                        ? 'bg-amber-500 text-white'
                        : 'bg-emerald-500 text-white'
                    }`}
                  >
                    ۱
                  </span>
                  <span className="font-bold text-slate-800 text-xs">
                    اطلاعات پایه سازمان و مدیر ارشد
                  </span>
                </div>
                <span className="text-slate-300">———</span>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      regStep === 2
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    ۲
                  </span>
                  <span className="font-bold text-slate-500 text-xs">
                    تعریف کاربران و نقش‌ها
                  </span>
                </div>
              </div>

              {/* STEP 1: Basic Company & Admin Info */}
              {regStep === 1 && (
                <form onSubmit={handleRegStep1Submit} className="space-y-4">
                  {/* اسم شرکت */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-amber-600" />
                      اسم شرکت / سازمان حمل و نقل:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: شرکت حمل و نقل بین‌المللی اروند بار"
                      value={regOrgName}
                      onChange={(e) => setRegOrgName(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-amber-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-medium transition-all"
                    />
                  </div>

                  {/* ایمیل شرکت */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-amber-600" />
                      ایمیل رسمی شرکت:
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="info@arvand-logistics.ir"
                      value={regOrgEmail}
                      onChange={(e) => setRegOrgEmail(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-amber-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-mono font-medium transition-all text-left"
                    />
                  </div>

                  {/* نام و نام خانوادگی مدیر ارشد */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-amber-600" />
                        نام و نام خانوادگی مدیر ارشد:
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: مهندس محمدرضا شایگان"
                        value={regAdminName}
                        onChange={(e) => setRegAdminName(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-amber-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-medium transition-all"
                      />
                    </div>

                    {/* ایمیل مدیر ارشد */}
                    <div>
                      <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-amber-600" />
                        ایمیل مدیر ارشد:
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="shaygan@arvand-logistics.ir"
                        value={regAdminEmail}
                        onChange={(e) => setRegAdminEmail(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-amber-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-mono font-medium transition-all text-left"
                      />
                    </div>
                  </div>

                  {/* رمز عبور شرکت */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-600" />
                      تعیین رمز عبور سازمان:
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="حداقل ۶ کاراکتر امن"
                      value={regOrgPassword}
                      onChange={(e) => setRegOrgPassword(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-amber-200/80 rounded-xl p-3 text-slate-800 text-xs focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-mono font-bold transition-all"
                    />
                  </div>

                  {/* Next Step Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-all cursor-pointer text-sm"
                    >
                      <span>ادامه: تعریف نقش‌ها و حساب کاربران</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2: Optional Team Members Account Creation */}
              {regStep === 2 && (
                <div className="space-y-4">
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl text-amber-950">
                    <p className="text-xs font-bold leading-relaxed">
                      شرکت <span className="text-amber-800 font-black">«{regOrgName}»</span> با موفقیت تعریف شد. در این مرحله می‌توانید برای سایر مدیران و کارشناسان شرکت نیز حساب کاربری با نقش مشخص ایجاد فرمایید.
                    </p>
                  </div>

                  {/* Add Member Box */}
                  <div className="p-4 bg-[#FAF8F5] border border-amber-200/80 rounded-2xl space-y-3">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-amber-600" />
                      تعریف حساب کاربری جدید برای اعضای شرکت:
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <ModernSelect
                          id="carrier-member-role"
                          value={memberRole}
                          onChange={(val) => setMemberRole(val as UserRole)}
                          label="انتخاب نقش:"
                          options={roleOptions.map((ro) => ({
                            value: ro.role,
                            label: ro.titleFa,
                          }))}
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 mb-1 font-bold">نام و نام خانوادگی:</label>
                        <input
                          type="text"
                          placeholder="مثال: علی حسینی"
                          value={memberName}
                          onChange={(e) => setMemberName(e.target.value)}
                          className="w-full bg-white border border-amber-200 rounded-xl p-2.5 text-slate-800 text-xs font-medium focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 mb-1 font-bold">ایمیل شخص:</label>
                        <input
                          type="email"
                          placeholder="hosseini@company.ir"
                          value={memberEmail}
                          onChange={(e) => setMemberEmail(e.target.value)}
                          className="w-full bg-white border border-amber-200 rounded-xl p-2.5 text-slate-800 text-xs font-mono font-medium focus:border-amber-500 focus:outline-none text-left"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 mb-1 font-bold">رمز عبور کاربر:</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={memberPassword}
                          onChange={(e) => setMemberPassword(e.target.value)}
                          className="w-full bg-white border border-amber-200 rounded-xl p-2.5 text-slate-800 text-xs font-mono font-medium focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={handleAddTeamMember}
                        className="py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>افزودن به لیست کاربران شرکت</span>
                      </button>
                    </div>
                  </div>

                  {/* List of Added Members */}
                  {teamMembers.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-700 block">
                        کاربران اضافه‌شده به سازمان ({teamMembers.length} نفر):
                      </span>
                      <div className="space-y-1.5 max-h-32 overflow-y-auto">
                        {teamMembers.map((m) => {
                          const rName = roleOptions.find((r) => r.role === m.role)?.titleFa;
                          return (
                            <div
                              key={m.id}
                              className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900">{m.fullName}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 font-bold">
                                  {rName}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">{m.email}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  setTeamMembers((prev) => (prev || []).filter((item) => item.id !== m.id))
                                }
                                className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex items-center gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setRegStep(1)}
                      className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>بازگشت به مشخصات شرکت</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleFinishRegistration}
                      className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer text-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>تکمیل ثبت‌نام و ورود مستقیم به سامانه</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
