import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Sparkles,
  X,
  Send,
  ShieldCheck,
  Bot,
  Zap,
  ChevronLeft,
  RotateCcw,
  Copy,
  Check,
  TrendingDown,
  Building2,
  Package,
  FileText,
  BadgePercent,
  Compass,
  ArrowUpRight,
  Truck,
  Layers,
  HelpCircle,
  Briefcase,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { usePricing } from '../../store/PricingContext';

interface ShipperAICoPilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  mode?: string;
  timestamp: string;
  isError?: boolean;
}

export const ShipperAICoPilotDrawer: React.FC<ShipperAICoPilotDrawerProps> = ({ isOpen, onClose }) => {
  const { currentShipperOrg } = usePricing();
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'savings' | 'route_optimize' | 'contract_tier' | 'cargo_safety'>('savings');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const orgName = currentShipperOrg?.nameFa || 'صاحب کالا';
  const orgCode = currentShipperOrg?.code || 'SHP-01';
  const tierName = currentShipperOrg?.tierInfo?.tierName || currentShipperOrg?.tier || 'پلاتینیوم تجاری';
  const discountPercent = currentShipperOrg?.tierInfo?.currentDiscountPercent || 14.0;
  const creditAvailableBillion = currentShipperOrg?.tierInfo?.availableCreditRials
    ? (currentShipperOrg.tierInfo.availableCreditRials / 10000000000).toFixed(1)
    : '۸.۴';

  // Company-tailored welcome message
  const initialWelcomeMessage: ChatMessage = useMemo(() => {
    return {
      sender: 'ai',
      text: `سلام و درود! من **دستیار هوشمند مدیریت لجستیک و مشاور زنجیره تأمین** ویژه شرکت **${orgName}** (\`${orgCode}\`) هستم.

آماده‌ام با اتکا به موتور هوش مصنوعی **Gemini** و پرونده حقوقی، هاب‌های بارگیری و محمولات ثبت‌شده شما، در حوزه‌های زیر بهینه‌سازی ارائه دهم:

- 💰 **کاهش هزینه کرایه و بهره‌مندی از تخفیفات حجم:** تحلیل نرخ پایه، استفاده از تخفیف **${discountPercent}٪** رده **${tierName}** و فرصت‌های تجمیع بار.
- 🔄 **استفاده از ظرفیت بار برگشت و ناوگان آماده:** رزرو تریلی‌ها و کامیون‌های بازگشتی با تخفیف ترجیحی تا ۱۸٪ در خطوط اصلی کارخانه.
- 📋 **ممیزی پیش‌فاکتور و بارنامه‌های رسمی:** راستی‌آزمایی محاسبات تمبر، بیمه تمام‌خطر راهداری و پیشگیری از اضافه‌پرداخت.
- 💳 **مدیریت خط اعتباری و تسهیلات تجاری:** پایش مانده اعتبار در دسترس (**${creditAvailableBillion} میلیارد تومان**) و سررسید صورتحساب‌ها.

می‌توانید از گزینه‌های پیشنهادی سریع زیر استفاده کنید یا پرسش خود را مطرح نمایید:`,
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    };
  }, [orgName, orgCode, tierName, discountPercent, creditAvailableBillion]);

  const [messages, setMessages] = useState<ChatMessage[]>([initialWelcomeMessage]);

  // Reset messages when current shipper organization changes
  useEffect(() => {
    setMessages([initialWelcomeMessage]);
  }, [initialWelcomeMessage]);

  // Dynamic quick prompts adapted to the specific shipper
  const quickPrompts = useMemo(() => {
    const orgId = currentShipperOrg?.id || '';
    const orgNameLower = (currentShipperOrg?.nameFa || '').toLowerCase();

    if (orgId.includes('mobarakeh') || orgNameLower.includes('مبارکه') || orgNameLower.includes('فولاد')) {
      return [
        {
          labelFa: 'صرفه‌جویی کریدور اصفهان به بندرعباس',
          badge: 'کاهش کرایه',
          mode: 'savings' as const,
          text: `برای محمولات کلاف گرم و اسلب مجتمع فولاد مبارکه در مسیر اصفهان به بندرعباس، چه راهکاری برای کاهش بهای تمام‌شده کرایه با استفاده از ناوگان کفی ۳ محور پیشنهاد می‌دهید؟`,
        },
        {
          labelFa: 'بهره‌مندی از نرخ تخفیف حجم تجاری پلاتینیوم',
          badge: 'تخفیف سازمانی',
          mode: 'contract_tier' as const,
          text: `شرایط اعمال تخفیف ۱۴٪ رده تجاری پلاتینیوم و ارتقا به رده الماس با افزایش حجم تناژ ماهانه فولاد مبارکه را بررسی و تحلیل کن.`,
        },
        {
          labelFa: 'رزرو ناوگان کفی بازگشتی از هرمزگان',
          badge: 'بار برگشت',
          mode: 'route_optimize' as const,
          text: `چگونه می‌توان با رزرو ناوگان بازگشتی از اسکله شهید رجایی و پایانه‌های جنوب، کرایه حمل کلاف‌های صنعتی را تا ۱۵٪ کاهش داد؟`,
        },
        {
          labelFa: 'الزامات مهار زنجیری و پوشش بیمه رول‌های فولادی',
          badge: 'ایمنی محموله',
          mode: 'cargo_safety' as const,
          text: `الزامات ایمنی، مهار استاندارد زنجیری و نحوه محاسبه حق بیمه تمام‌خطر برای محمولات با ارزش بالای ۲ میلیارد تومان فولاد مبارکه چیست؟`,
        },
      ];
    } else if (orgId.includes('pgpc') || orgNameLower.includes('پتروشیمی') || orgNameLower.includes('خلیج فارس')) {
      return [
        {
          labelFa: 'کاهش کرایه تانکر از ماهشهر به مقاصد صادراتی',
          badge: 'بهینه‌سازی تانکر',
          mode: 'savings' as const,
          text: `برای حمل مایعات شیمیایی و پلیمری از منطقه ویژه پتروشیمی ماهشهر به مقاصد اصفهان و تهران، چه راهکاری برای کاهش هزینه کرایه تانکر استیل وجود دارد؟`,
        },
        {
          labelFa: 'مدیریت خط اعتباری و پرداخت اعتباری بارنامه‌ها',
          badge: 'خط اعتباری',
          mode: 'contract_tier' as const,
          text: `نحوه تخصیص مانده خط اعتباری ۱۲ میلیارد تومانی هلدینگ پتروشیمی خلیج فارس برای تسویه فاکتورهای ۳۰ روزه باربری‌ها چگونه است؟`,
        },
        {
          labelFa: 'پایش گواهینامه ADR و الزامات مواد سوختی/شیمیایی',
          badge: 'استاندارد خطرناک',
          mode: 'cargo_safety' as const,
          text: `الزامات پروانه ترافیکی ADR کلاس ۳ و ۸ راهداری و پوشش بیمه زیست‌محیطی برای متانول و حلال‌های پتروشیمی را تشریح کن.`,
        },
        {
          labelFa: 'سوآپ کریدوری تانکرهای ماهشهر و عسلویه',
          badge: 'لجستیک ترکیبی',
          mode: 'route_optimize' as const,
          text: `راهکار سوآپ ناوگان تانکر بین عسلویه و ماهشهر جهت حذف ترددهای یک‌سرخالی و تخفیف ۱۰٪ کرایه چیست؟`,
        },
      ];
    } else if (orgId.includes('mihan') || orgId.includes('kalleh') || orgNameLower.includes('میهن') || orgNameLower.includes('کاله') || orgNameLower.includes('لبنی')) {
      return [
        {
          labelFa: 'کاهش هزینه توزیع ناوگان یخچالی زنجیره سرد',
          badge: 'زنجیره سرد',
          mode: 'savings' as const,
          text: `برای توزیع فرآورده‌های لبنی و پروتئینی منجمد از هاب مرکزی اسلامشهر به مراکز استان‌ها، چه راهکارهایی برای کاهش هزینه ناوگان یخچالی دارید؟`,
        },
        {
          labelFa: 'دیسپاچینگ شبانه و کاهش استهلاک دمایی',
          badge: 'زمان‌بندی هوشمند',
          mode: 'route_optimize' as const,
          text: `تاثیر دیسپاچینگ شبانه ناوگان کانتینر یخچالی در کاهش مصرف سوخت ترموکینگ و افزایش کیفیت حمل محصولات فاسدشدنی چقدر است؟`,
        },
        {
          labelFa: 'بیمه فساد کالا و استانداردهای دامپزشکی',
          badge: 'پوشش خسارت',
          mode: 'cargo_safety' as const,
          text: `شرایط پوشش ۱۰۰٪ بیمه فساد کالا با ثبت آنلاین دیتالاگر دما در بارنامه‌های رسمی راهداری چیست؟`,
        },
        {
          labelFa: 'تخفیف قرارداد سالانه تناژ تضمینی لبنیات',
          badge: 'قرارداد کلان',
          mode: 'contract_tier' as const,
          text: `نحوه استفاده از تخفیف حداکثری پلاتینیوم برای ارسال‌های روزانه بالای ۴۰۰ تن به فروشگاه‌های زنجیره‌ای را توضیح دهید.`,
        },
      ];
    } else {
      return [
        {
          labelFa: `فرصت‌های کاهش هزینه کرایه برای شرکت ${orgName}`,
          badge: 'کاهش هزینه',
          mode: 'savings' as const,
          text: `با توجه به سابقه بارگیری و انبارهای ثبت‌شده شرکت «${orgName}»، چه فرصت‌های طلایی برای کاهش هزینه‌های لجستیک و کرایه حمل بار وجود دارد؟`,
        },
        {
          labelFa: 'رزرو ناوگان بار برگشت در کریدورهای اصلی',
          badge: 'بار برگشت',
          mode: 'route_optimize' as const,
          text: `چگونه می‌توان با هماهنگی ناوگان بار برگشت در خطوط پرتردد صنعتی، تخفیف ۸ تا ۱۵ درصدی در نرخ کرایه دریافت کرد؟`,
        },
        {
          labelFa: `بهره‌مندی از تخفیف حجم تجاری رده ${tierName}`,
          badge: 'تخفیف سازمانی',
          mode: 'contract_tier' as const,
          text: `شرایط استفاده از تخفیف سازمانی رده ${tierName} (${discountPercent}٪) و افزایش سقف خط اعتباری را توضیح دهید.`,
        },
        {
          labelFa: 'محاسبه بهینه حق بیمه و صدور بارنامه رسمی',
          badge: 'بیمه و بارنامه',
          mode: 'cargo_safety' as const,
          text: `فرمول محاسبه نرخ بیمه مسئولیت مدنی بر اساس ارزش اظهارشده کالا و استانداردهای قانونی بارنامه راهداری چیست؟`,
        },
      ];
    }
  }, [currentShipperOrg, orgName, tierName, discountPercent]);

  const modes = [
    { id: 'savings' as const, labelFa: 'صرفه‌جویی کرایه', descFa: 'کاهش هزینه‌ها و تجمیع بار', icon: TrendingDown },
    { id: 'route_optimize' as const, labelFa: 'ناوگان و بار برگشت', descFa: 'تخفیف خطوط برگشتی', icon: Truck },
    { id: 'contract_tier' as const, labelFa: 'تخفیفات و اعتبارات', descFa: 'رده تجاری و خط اعتباری', icon: BadgePercent },
    { id: 'cargo_safety' as const, labelFa: 'بیمه و استعلام بار', descFa: 'پوشش تمام‌خطر و بارنامه', icon: ShieldCheck },
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([initialWelcomeMessage]);
  };

  const handleSend = async (userPromptText?: string) => {
    const textToSend = userPromptText || prompt;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          mode,
          history: updatedMessages.map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
          context: {
            portalType: 'shipper',
            shipperOrg: {
              id: currentShipperOrg?.id,
              nameFa: currentShipperOrg?.nameFa,
              code: currentShipperOrg?.code,
              industry: currentShipperOrg?.industry,
              tier: currentShipperOrg?.tier,
              tierInfo: currentShipperOrg?.tierInfo,
              hubs: currentShipperOrg?.savedLocations,
              commodities: currentShipperOrg?.savedCommodities,
              legalDossier: currentShipperOrg?.legalDossier,
              activeLoadsCount: currentShipperOrg?.activeLoads?.length || 0,
            },
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: data.reply || 'پاسخ هوش مصنوعی دریافت شد.',
            mode,
            timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: data.reply || data.error || 'خطا در ارتباط با سرویس هوش مصنوعی.',
            mode,
            timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
            isError: true,
          },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `خطا در برقراری ارتباط با سرور هوش مصنوعی: ${err.message || 'شبکه در دسترس نیست'}`,
          mode,
          timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" id="shipper-ai-copilot-modal">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Panel - Emerald / Sky Fresh Modern Shipper Theme */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="absolute inset-y-0 left-0 w-full max-w-xl bg-white border-r border-slate-200 shadow-2xl flex flex-col font-sans"
          >
            {/* 1. Header with Shipper Identity */}
            <div className="p-4 border-b border-slate-200 bg-gradient-to-l from-emerald-50/70 via-sky-50/50 to-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">
                      دستیار هوشمند لجستیک صاحب کالا (Gemini AI)
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      مشاور زنجیره تأمین
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>تحلیل اختصاصی شرکت: <strong className="text-slate-800">{orgName}</strong></span>
                    <span className="text-slate-300">•</span>
                    <span className="text-emerald-700 font-bold">{tierName} ({discountPercent}٪ تخفیف)</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleResetChat}
                  title="شروع گفتگوی جدید"
                  className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  aria-label="بستن پنجره گفتگو"
                  className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 2. Company Quick KPI Strip */}
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between text-xs text-slate-600 gap-2 overflow-x-auto">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>کد تجاری: <strong className="font-mono text-slate-800">{orgCode}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-slate-400">اعتبار در دسترس:</span>
                <strong className="text-emerald-700 font-mono">{creditAvailableBillion} میلیارد ت</strong>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-slate-400">بارهای فعال:</span>
                <strong className="text-slate-800 font-mono">{currentShipperOrg?.activeLoads?.length || 0} محموله</strong>
              </div>
            </div>

            {/* 3. Mode Selector - Specific to Shipper Operations */}
            <div className="p-3 bg-slate-100/50 border-b border-slate-200">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {modes.map((m) => {
                  const isActive = mode === m.id;
                  const IconComp = m.icon;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMode(m.id)}
                      className={`px-2.5 py-2 rounded-xl text-right transition-all cursor-pointer border flex flex-col justify-between gap-1 ${
                        isActive
                          ? 'bg-emerald-700 text-white border-emerald-800 font-bold shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-200' : 'text-emerald-600'}`} />
                        <span className="text-[11px] font-bold truncate">{m.labelFa}</span>
                      </div>
                      <div className={`text-[9px] truncate ${isActive ? 'text-emerald-100' : 'text-slate-400'}`}>
                        {m.descFa}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Messages List Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs bg-slate-50/50">
              {messages.map((msg, idx) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={idx}
                    className={`flex flex-col ${isUser ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`p-4 rounded-2xl max-w-[94%] leading-relaxed shadow-2xs transition-all ${
                        isUser
                          ? 'bg-white text-slate-900 border border-slate-200 rounded-br-none'
                          : msg.isError
                          ? 'bg-rose-50 text-rose-900 border border-rose-200 rounded-bl-none'
                          : 'bg-gradient-to-br from-emerald-50/90 via-white to-sky-50/60 text-slate-900 border border-emerald-200/90 rounded-bl-none'
                      }`}
                    >
                      {/* Message Header */}
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/70 text-[11px]">
                        <span className="flex items-center gap-1.5 font-bold">
                          {isUser ? (
                            <span className="text-slate-500">کاربر / مدیر زنجیره تأمین ({orgName})</span>
                          ) : (
                            <span className="text-emerald-800 flex items-center gap-1">
                              <Bot className="w-3.5 h-3.5 text-emerald-600" />
                              دستیار هوشمند لجستیک صاحب کالا (Gemini)
                            </span>
                          )}
                        </span>
                        <div className="flex items-center gap-2">
                          {!isUser && (
                            <button
                              type="button"
                              onClick={() => handleCopy(msg.text, idx)}
                              title="کپی متن پاسخ"
                              className="text-slate-400 hover:text-emerald-700 p-1 rounded transition-colors cursor-pointer"
                            >
                              {copiedIdx === idx ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          )}
                          <span className="font-mono text-slate-400 text-[10px]">{msg.timestamp}</span>
                        </div>
                      </div>

                      {/* Message Text with Markdown */}
                      {isUser ? (
                        <div className="whitespace-pre-wrap leading-6 text-slate-800 font-medium">{msg.text}</div>
                      ) : (
                        <div className="markdown-body text-slate-800 leading-6 space-y-2 prose-sm prose-slate">
                          <Markdown>{msg.text}</Markdown>
                        </div>
                      )}
                    </div>

                    {!isUser && !msg.isError && (
                      <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1 mr-1 font-medium">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>تحلیل پردازش‌شده بر پایه اطلاعات و الزامات شرکت {orgName}</span>
                      </div>
                    )}
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-center gap-2 text-emerald-900 text-xs p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 w-fit shadow-2xs">
                  <span className="w-4 h-4 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin" />
                  <span className="font-bold">در حال پردازش سناریوهای بهینه‌سازی زنجیره تأمین با هوش مصنوعی Gemini 3.7 Flash...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* 5. Company-Tailored Quick Prompts */}
            <div className="p-3 bg-white border-t border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-800 font-bold flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  پرسش‌ها و راهکارهای متناسب با شرکت شما ({orgName}):
                </span>
                <span className="text-[10px] text-slate-400">کلیک جهت ارسال آنی</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {quickPrompts.map((qp, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setMode(qp.mode);
                      handleSend(qp.text);
                    }}
                    className="w-full text-right p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 text-slate-800 text-xs transition-all flex items-center justify-between cursor-pointer shadow-2xs group"
                  >
                    <div className="flex flex-col truncate ml-1">
                      <span className="truncate font-semibold text-[11px] text-slate-800 group-hover:text-emerald-950">
                        {qp.labelFa}
                      </span>
                      <span className="text-[9px] text-emerald-700 font-medium">
                        {qp.badge}
                      </span>
                    </div>
                    <ChevronLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 shrink-0 transition-transform group-hover:-translate-x-1" />
                  </button>
                ))}
              </div>
            </div>

            {/* 6. Input Form */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2 items-center"
              >
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={`دستور یا استعلام لجستیکی شرکت ${orgName} را بنویسید (مثلاً: نحوه استفاده از بار برگشت)...`}
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 transition-all"
                />
                <button
                  type="submit"
                  disabled={isLoading || !prompt.trim()}
                  className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center transition-all cursor-pointer shadow-2xs shrink-0 gap-1.5"
                  title="ارسال پیام"
                >
                  <span className="text-xs hidden sm:inline">ارسال</span>
                  <Send className="w-3.5 h-3.5 rotate-180 text-white" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
