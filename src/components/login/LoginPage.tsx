import React, { useState } from 'react';
import {
  Truck,
  Building2,
  Package,
  Calculator,
  ChevronDown,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Layers,
  LineChart,
  FlaskConical,
  Lock,
  Sparkles,
  Cpu,
  CheckCircle2,
  Scale,
  Activity,
  FileSpreadsheet,
  FileText,
  Percent,
  Sliders,
  HelpCircle,
  PhoneCall,
  ChevronRight,
  TrendingUp,
  Award,
} from 'lucide-react';
import { UserRole, ShipperUserRole } from '../../types/pricing';
import { CarrierAuthModal } from './CarrierAuthModal';
import { PricingHero } from './PricingHero';
import { ShipperAuthModal } from './ShipperAuthModal';

interface LoginPageProps {
  onLogin: (
    portalType: 'carrier' | 'shipper',
    role?: UserRole,
    details?: {
      orgName?: string;
      userName?: string;
      userEmail?: string;
      shipperRole?: ShipperUserRole;
      locationScope?: string;
      approvalLimitToman?: number;
    }
  ) => void;
  onOpenQuickQuote: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onOpenQuickQuote }) => {
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const [isCarrierModalOpen, setIsCarrierModalOpen] = useState(false);
  const [isShipperModalOpen, setIsShipperModalOpen] = useState(false);

  const servicesList = [
    {
      icon: Layers,
      title: 'استودیوی طراحی و بوم فرمول‌نویسی تعرفه',
      desc: 'تدوین رول‌بلاک‌ها، ضرایب فصلی، سوخت، عوارض و شرایط بار با منطق قطعی و شفاف',
      tag: 'طراحی پایه',
    },
    {
      icon: FlaskConical,
      title: 'آزمایشگاه شبیه‌سازی مونت‌کارلو و تست استرس',
      desc: 'اجرای ۱۰,۰۰۰ سناریوی فرضی، پیش‌بینی ریسک و رفتار تعرفه در شوک‌های قیمتی',
      tag: 'اعتبارسنجی',
    },
    {
      icon: ShieldCheck,
      title: 'برج مراقبت و حاکمیت سازمانی (Maker-Checker)',
      desc: 'فرایند تایید دوطرفه، ممیزی تغییرات، مقایسه تفاوت‌ها (Diff) و امکان بازگشت آنی',
      tag: 'حاکمیت و ریسک',
    },
    {
      icon: FileSpreadsheet,
      title: 'ماتریس کریدورها و نرخ پایه ناوگان',
      desc: 'مدیریت بیش از ۵۰ مسیر اصلی و نرخ پایه انواع کشنده، کفی، لبه‌دار و کمپرسی',
      tag: 'مدیریت ناوگان',
    },
    {
      icon: LineChart,
      title: 'پایش هوشمند ناهنجاری‌ها و نشت سود',
      desc: 'شناسایی خودکار تراکنش‌های مشکوک، افت سودآوری و سوءاستفاده از تخفیفات',
      tag: 'هوشمندی مالی',
    },
    {
      icon: Cpu,
      title: 'حاکمیت داده درون‌مرزی و اتصال وب‌سرویس (API)',
      desc: 'معماری کاملاً ایزوله، منطبق بر الزامات امنیت ملی داده و سرعت پاسخگویی زیر ۵۰ میلی‌ثانیه',
      tag: 'زیرساخت ابری',
    },
  ];

  const featuresList = [
    {
      icon: Scale,
      title: 'تضمین کف حاشیه سود ۱۵٪',
      description:
        'موتور قیمت‌گذاری با اعمال گاردریل هوشمند (Clamp/Reject)، به هیچ عنوان اجازه صدور بارنامه با سود منفی یا زیر حاشیه مصوب مالی را نمی‌دهد.',
      color: 'from-amber-500/15 to-amber-600/5',
      badge: 'تضمین سودآوری',
      accent: 'text-amber-700',
    },
    {
      icon: Activity,
      title: 'شبیه‌سازی ۱۰,۰۰۰ سناریوی مونت‌کارلو',
      description:
        'قبل از انتشار هر پکیج تعرفه، رفتار مالی در برابر نوسان قیمت سوخت، تغییرات فصلی و شوک‌های عرضه و تقاضا سنجیده و تایید می‌شود.',
      color: 'from-teal-500/15 to-teal-600/5',
      badge: 'مدل‌سازی آماری',
      accent: 'text-teal-700',
    },
    {
      icon: ShieldCheck,
      title: 'تفکیک اختیارات دوطرفه (Maker-Checker)',
      description:
        'طراحان تعرفه تنها می‌توانند پیشنهاد دهند؛ تصویب و انتشار به عهده کمیته حاکمیت است و هیچ تغییری بدون امضای دیجیتال منتشر نمی‌شود.',
      color: 'from-blue-500/15 to-blue-600/5',
      badge: 'حاکمیت شرکتی',
      accent: 'text-blue-700',
    },
    {
      icon: Zap,
      title: 'محاسبه قطعی و بدون تقریب',
      description:
        'خروجی تمامی فرمول‌ها کاملاً شفاف و مستند به ردپای تصمیم (Traceability) است و هیچگونه ابهام یا محاسبه تصادفی وجود ندارد.',
      color: 'from-indigo-500/15 to-indigo-600/5',
      badge: 'شفافیت محاسباتی',
      accent: 'text-indigo-700',
    },
    {
      icon: LineChart,
      title: 'رصد نشت تخفیف و ناهنجاری',
      description:
        'ردیابی هم‌پوشانی نامتعارف تخفیفات تناژ، کدهای تبلیغاتی و نرخ‌های توافقی جهت حفاظت از درآمدهای شرکت‌های حمل‌ونقل.',
      color: 'from-rose-500/15 to-rose-600/5',
      badge: 'جلوگیری از نشت',
      accent: 'text-rose-700',
    },
    {
      icon: Cpu,
      title: 'استقرار ایزوله و درون‌مرزی',
      description:
        'سازگار با قوانین حفظ محرمانگی داده‌ها، قابلیت کار در شبکه‌های محلی ایزوله و اتصال زنده به سامانه‌های پایش سوخت و راهداری.',
      color: 'from-emerald-500/15 to-emerald-600/5',
      badge: 'امنیت درون‌مرزی',
      accent: 'text-emerald-700',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 flex flex-col font-sans selection:bg-teal-500/20 selection:text-teal-900">
      {/* 1. TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-amber-200/70 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Right: Site Logo & Name + Services Hover Menu */}
            <div className="flex items-center gap-8">
              {/* Brand Logo */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-700 flex items-center justify-center shadow-xs">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-lg tracking-tight text-slate-900 font-display">
                      Pricing OS
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                      پلتفرم لجستیک
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-none mt-1">
                    سیستم جامع مدیریت و قیمت‌گذاری لجستیک جاده‌ای
                  </p>
                </div>
              </div>

              {/* Services Dropdown (Hover & Click) */}
              <div
                className="relative hidden md:block"
                onMouseEnter={() => setIsServicesMenuOpen(true)}
                onMouseLeave={() => setIsServicesMenuOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setIsServicesMenuOpen(!isServicesMenuOpen)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isServicesMenuOpen
                      ? 'bg-teal-50 text-teal-800 border border-teal-200 shadow-2xs'
                      : 'text-slate-700 hover:text-teal-800 hover:bg-slate-50'
                  }`}
                >
                  <Layers className="w-4 h-4 text-teal-600" />
                  <span>خدمات سامانه</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isServicesMenuOpen ? 'rotate-180 text-teal-700' : 'text-slate-400'
                    }`}
                  />
                </button>

                {/* Services Dropdown Menu */}
                {isServicesMenuOpen && (
                  <div className="absolute right-0 top-full pt-2 w-[520px] z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="bg-white border border-amber-200/90 rounded-3xl shadow-2xl p-4 grid grid-cols-2 gap-2.5">
                      <div className="col-span-2 pb-2 mb-1 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-teal-600" />
                          زیرسیستم‌ها و ابزارهای جامع تعرفه‌گذاری
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">۶ ماژول فعال</span>
                      </div>

                      {servicesList.map((srv, idx) => {
                        const Icon = srv.icon;
                        return (
                          <div
                            key={idx}
                            className="p-3 rounded-2xl bg-[#FAF8F5] border border-amber-100/80 hover:bg-teal-50/50 hover:border-teal-300 transition-all text-right group"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="w-7 h-7 rounded-lg bg-white text-teal-700 border border-amber-200/60 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100/80 text-amber-900 border border-amber-200">
                                {srv.tag}
                              </span>
                            </div>
                            <h4 className="text-[11px] font-bold text-slate-900 group-hover:text-teal-900 line-clamp-1">
                              {srv.title}
                            </h4>
                            <p className="text-[10px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                              {srv.desc}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Left: Quick Quote Button & Support */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onOpenQuickQuote}
                className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-md shadow-teal-600/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Calculator className="w-4 h-4 text-teal-100" />
                <span>استعلام قیمت</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. SHADER HERO */}
      <PricingHero />

      {/* 3. PORTAL LOGIN SECTION (TWO DISTINCT PORTAL CARDS) */}
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white via-[#FAF8F5] to-[#F5EFEB]">
        {/* Subtle background decorative shapes */}
        <div className="absolute top-1/4 right-5 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-5 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Main Title & Subtitle */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-300/80 text-teal-900 text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>پایانه امن و یکپارچه قیمت‌گذاری لجستیک کشور</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight font-display leading-tight sm:leading-snug">
              ورود به درگاه هوشمند{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-teal-600 to-amber-600">
                سیستم عامل قیمت‌گذاری
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              لطفاً نوع کاربری خود را انتخاب فرمایید تا به میز کار تخصصی متناسب با دسترسی‌های سازمانی خود هدایت شوید.
            </p>
          </div>

          {/* Two Main Login Cards (Prominent, High Quality) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
            {/* Card 1: ورود سازمان‌های حمل و نقل (Right side in RTL) */}
            <div className="relative group bg-white border-2 border-amber-200/90 hover:border-amber-400 rounded-3xl p-8 sm:p-10 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-6">
                {/* Header Badge & Icon */}
                <div className="flex items-center justify-between">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <Building2 className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-mono">
                    پرتال سازمانی
                  </span>
                </div>

                {/* Card Title & Target Users */}
                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
                    ورود سازمان‌های حمل و نقل
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                    ویژه شرکت‌های باربری سراسری، فورواردرها، ناوگان ترانزیت، مدیران بازرگانی و استراتژیست‌های تعرفه
                  </p>
                </div>

                {/* Capabilities List */}
                <div className="space-y-2.5 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-700 block">دسترسی‌ها و قابلیت‌های کلیدی:</span>
                  <ul className="space-y-2 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>تدوین فرمول‌های تعرفه پایه و رول‌بلاک‌های اضافه کرایه</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>کنترل گاردریل کف حاشیه سود ۱۵٪ و جلوگیری از نشت تخفیف</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>تصویب بسته‌های استراتژی تعرفه با تاییدیه دوطرفه (Maker-Checker)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>مدیریت ماتریس کریدورها، نرخ ناوگان و شبیه‌سازی مونت‌کارلو</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8 mt-8 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCarrierModalOpen(true)}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-3 shadow-md shadow-amber-600/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>ورود به استودیوی قیمت‌گذاری و مدیریت ناوگان</span>
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <p className="text-center text-[11px] text-slate-600 mt-2.5 font-medium">
                  ورود / ثبت سازمان با نقش‌های تخصصی تعرفه‌گذاری
                </p>
              </div>
            </div>

            {/* Card 2: ورود صاحبان بار و صنایع (Left side in RTL) */}
            <div className="relative group bg-white border-2 border-teal-200/90 hover:border-teal-400 rounded-3xl p-8 sm:p-10 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-6">
                {/* Header Badge & Icon */}
                <div className="flex items-center justify-between">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-600 to-teal-700 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <Package className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-900 border border-teal-200 font-mono">
                    پرتال تجاری
                  </span>
                </div>

                {/* Card Title & Target Users */}
                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
                    ورود صاحبان بار و صنایع
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                    ویژه شرکت‌های پتروشیمی، مجتمع‌های فولادی، معادن، کارخانجات تولیدی و تجار عمده
                  </p>
                </div>

                {/* Capabilities List */}
                <div className="space-y-2.5 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-700 block">دسترسی‌ها و قابلیت‌های کلیدی:</span>
                  <ul className="space-y-2 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>استعلام شفاف و آنی کرایه در تمام مسیرهای جاده‌ای و بنادر</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>مشاهده تخفیفات حجمی، پلن‌های تناژ اختصاصی و قراردادهای سالانه</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>شبیه‌ساز کف نرخ قراردادها و تضمین ثبات قیمت در طول مدت توافق</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>ردگیری جزئیات و دلایل ریاضی محاسبات کرایه برای هر بارنامه</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8 mt-8 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsShipperModalOpen(true)}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-teal-700 to-teal-600 hover:from-teal-800 hover:to-teal-700 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-3 shadow-md shadow-teal-600/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>ورود به پورتال هوشمند صاحبان بار و قراردادها</span>
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <p className="text-center text-[11px] text-slate-600 mt-2.5 font-medium">
                  ورود / ثبت حساب بار شرکتی و بار خرد
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PLATFORM CORE PILLARS & FEATURES SECTION */}
      <section className="py-20 bg-white border-y border-amber-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>ارکان بنیادین سیستم عامل قیمت‌گذاری</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              ویژگی‌های متمایز و استانداردهای پلتفرم
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              طراحی‌شده برای برآورده‌سازی پیچیده‌ترین الزامات عملیاتی، مالی و حاکمیتی در صنعت حمل‌ونقل جاده‌ای کالا
            </p>
          </div>

          {/* 6 Feature Cards with generous spacing */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresList.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-7 rounded-3xl bg-[#FAF8F5] border border-amber-200/80 hover:border-teal-400/80 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between group space-y-4"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-amber-200/80 text-teal-700 flex items-center justify-center shadow-xs group-hover:bg-teal-600 group-hover:text-white transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200">
                        {feat.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 font-display group-hover:text-teal-900">
                      {feat.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. SUMMARY OF SERVICES & VALUE FLOW SECTION */}
      <section className="py-20 bg-[#F5EFEB] border-b border-amber-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
              <span>جریان ارزش و اکوسیستم عملیاتی</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              خلاصه خدمات سامانه از طراحی تا صدور بارنامه
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              نگاهی به چرخه کامل تعرفه‌گذاری هوشمند و فرایند اعتبارسنجی در پلتفرم
            </p>
          </div>

          {/* Process Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-amber-200/80 shadow-xs space-y-3 relative">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                ۱
              </div>
              <h3 className="font-bold text-slate-900 text-sm font-display">طراحی و تدوین رول‌بلاک‌ها</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                تعریف ضرایب ناوگان، اضافه کرایه‌های جوی، سوخت، گردنه‌ها و تخفیفات پلکانی قراردادها.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-amber-200/80 shadow-xs space-y-3 relative">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                ۲
              </div>
              <h3 className="font-bold text-slate-900 text-sm font-display">تست استرس و مونت‌کارلو</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                شبیه‌سازی ۱۰,۰۰۰ بارنامه در شرایط بحرانی جهت اطمینان از حفظ حاشیه سود حداقل ۱۵٪.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-amber-200/80 shadow-xs space-y-3 relative">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                ۳
              </div>
              <h3 className="font-bold text-slate-900 text-sm font-display">تصویب حاکمیتی دوطرفه</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                بررسی تغییرات (Diff) توسط کمیته ریسک و انتشار امن به محیط عملیاتی (Production).
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-amber-200/80 shadow-xs space-y-3 relative">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                ۴
              </div>
              <h3 className="font-bold text-slate-900 text-sm font-display">پایش زنده و رصد نشت</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                نظارت ۲۴/۷ بر سودآوری واقعی بارنامه‌ها، کشف ناهنجاری‌ها و ردگیری مستندات محاسباتی.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-white border-t border-amber-200/80 py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-700 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-800 font-display">سیستم عامل قیمت‌گذاری لجستیک جاده‌ای</span>
              <p className="text-[11px] text-slate-600">Road Freight Pricing Operating System • نسخه ۱.۱</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-600">
            <span className="bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-amber-200/70">
              موتور محاسباتی قطعی
            </span>
            <span className="bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-amber-200/70">
              تضمین گاردریل کف سود ۱۵٪
            </span>
            <span className="bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-amber-200/70">
              تفکیک وظایف (سازنده/تصویب‌کننده)
            </span>
          </div>
        </div>
      </footer>

      {/* Carrier Auth Modal (ورود و ثبت سازمان‌های حمل و نقل) */}
      <CarrierAuthModal
        isOpen={isCarrierModalOpen}
        onClose={() => setIsCarrierModalOpen(false)}
        onSuccessLogin={(userData) => {
          setIsCarrierModalOpen(false);
          onLogin('carrier', userData.role, {
            orgName: userData.orgName,
            userName: userData.userName,
            userEmail: userData.userEmail,
          });
        }}
      />

      {/* Shipper Auth Modal (ورود و ایجاد حساب بار شرکتی و بار خرد) */}
      <ShipperAuthModal
        isOpen={isShipperModalOpen}
        onClose={() => setIsShipperModalOpen(false)}
        onSuccessLogin={(userData) => {
          setIsShipperModalOpen(false);
          onLogin('shipper', userData.role, {
            orgName: userData.orgName,
            userName: userData.userName,
            userEmail: userData.userEmail,
            shipperRole: userData.shipperRole,
            locationScope: userData.locationScope,
            approvalLimitToman: userData.approvalLimitToman,
          });
        }}
      />
    </div>
  );
};
