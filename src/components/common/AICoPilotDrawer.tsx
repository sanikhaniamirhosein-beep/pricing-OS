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
  Sliders,
  Scale,
  BrainCircuit,
  MessageSquareQuote,
  AlertCircle,
  Building2,
  Truck,
  Shield,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { usePricing } from '../../store/PricingContext';

interface AICoPilotDrawerProps {
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

export const AICoPilotDrawer: React.FC<AICoPilotDrawerProps> = ({ isOpen, onClose }) => {
  const { activeProductionPackage, pricingPolicy, routeMatrix, currentCarrierOrg } = usePricing();
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'authoring' | 'explanation' | 'simulation' | 'investigation'>('authoring');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const carrierName = currentCarrierOrg?.nameFa || 'شرکت حمل‌ونقل';
  const carrierCode = currentCarrierOrg?.code || 'CAR-01';
  const fleetCount = currentCarrierOrg?.fleetCount || 1200;
  const licenseNo = currentCarrierOrg?.licenseNumber || currentCarrierOrg?.legalDossier?.rmtoPermitDoc?.documentNumber || 'LIC-RMTO-1405-9921';
  const insuranceCeilingBillion = currentCarrierOrg?.insuranceCeilingToman
    ? (currentCarrierOrg.insuranceCeilingToman / 1000000000).toFixed(0)
    : '۱۰۰';

  const initialWelcomeMessage: ChatMessage = useMemo(() => {
    return {
      sender: 'ai',
      text: `سلام و درود! من **دستیار هوشمند مدیریت تعرفه، ممیزی بارنامه و هدایت ناوگان** ویژه **${carrierName}** (\`${carrierCode}\`) هستم.

اتصال به موتور هوش مصنوعی **Gemini 3.7 Flash** با اشراف کامل بر پرونده حقوقی (پروانه راهداری \`${licenseNo}\` و بیمه‌نامه **${insuranceCeilingBillion} میلیارد تومانی**) و ${fleetCount} ناوگان فعال برقرار است.

زمینه‌های اصلی تحلیل و اقدام:
- 📊 **طراحی و تنظیم تعرفه و رول‌بلاک‌ها:** فرمول‌بندی نرخ تن/کیلومتر، قلاب سوخت و شرایط کوهستانی.
- 🔍 **تحلیل تبارشناسی بارنامه (Decision Trace):** تفکیک سهم باربری، راننده، عوارض راهداری و بیمه.
- 🛡️ **گاردریل کف سود و صیانت از درآمد:** تثبیت حاشیه سود بالای ۱۵٪ و جلوگیری از نشت تخفیفات.
- 🚛 **شبیه‌سازی بار برگشت و تخصیص ناوگان:** کاهش ضریب یک‌سرخالی و بهینه‌سازی دیسپاچینگ.

پرسش یا دستور مد نظرتان را بفرمایید:`,
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    };
  }, [carrierName, carrierCode, fleetCount, licenseNo, insuranceCeilingBillion]);

  const [messages, setMessages] = useState<ChatMessage[]>([initialWelcomeMessage]);

  useEffect(() => {
    setMessages([initialWelcomeMessage]);
  }, [initialWelcomeMessage]);

  const quickPrompts = useMemo(() => {
    const orgId = currentCarrierOrg?.id || '';
    const nameLower = (currentCarrierOrg?.nameFa || '').toLowerCase();

    if (orgId.includes('safir') || nameLower.includes('سفیران') || nameLower.includes('سرد') || nameLower.includes('انجماد')) {
      return [
        {
          labelFa: 'فرمول ضریب یخچالی و قلاب سوخت ژنراتور',
          badge: 'زنجیره سرد',
          mode: 'authoring' as const,
          text: `برای ناوگان کشنده یخچالی شرکت ${carrierName} در فصول گرم و محورهای جنوب، چه رول‌بلاک تعرفه‌ای با ضریب سوخت ژنراتور ترموکینگ پیشنهاد می‌دهید؟`,
        },
        {
          labelFa: 'کاهش بار برگشت خالی ناوگان کانتینر سرد',
          badge: 'بار برگشت',
          mode: 'simulation' as const,
          text: `راهکار بهینه‌سازی بار برگشت با جذب محمولات سبزیجات منجمد و کنسانتره برای ناوگان یخچالی ${carrierName} جهت کاهش تردد خالی به زیر ۶٪ چیست؟`,
        },
        {
          labelFa: 'تبارشناسی بارنامه محمولات دارویی و پروتئینی',
          badge: 'تحلیل بارنامه',
          mode: 'explanation' as const,
          text: `نحوه تفکیک و محاسبه حق بیمه فساد کالا، عوارض راهداری و سهم خالص متصدی در بارنامه حمل فرآورده‌های دارویی با ارزش بالا را تحلیل کن.`,
        },
        {
          labelFa: 'پایش نشت تخفیف و حاشیه سود شعب استانی',
          badge: 'کف سود ۱۵٪',
          mode: 'investigation' as const,
          text: `بررسی راهکار گاردریل کلمپ برای جلوگیری از افت حاشیه سود شعب اصفهان و مشهد به زیر کف قانونی ۱۵.۰٪.`,
        },
      ];
    } else if (orgId.includes('petro') || nameLower.includes('پترو') || nameLower.includes('نفت') || nameLower.includes('شیمی')) {
      return [
        {
          labelFa: 'رول‌بلاک اضافه کرایه محمولات خطرناک ADR',
          badge: 'مواد خطرناک',
          mode: 'authoring' as const,
          text: `لطفاً رول‌بلاک تعرفه حمل مواد شیمیایی کلاس ۳ و ۸ (ADR) با ضریب +۱۸٪ و الزام اسکورت ایمنی برای تانکرهای ${carrierName} را تعریف و تحلیل نما.`,
        },
        {
          labelFa: 'تبارشناسی کرایه تانکر استیل ماهشهر به تبریز',
          badge: 'محاسبه خطی',
          mode: 'explanation' as const,
          text: `کرایه تانکر ۲۵ تن متانول از پتروشیمی ماهشهر به مقصد تبریز با احتساب عوارض ۹٪ راهداری و بیمه مسئولیت مدنی چگونه محاسبه می‌شود؟`,
        },
        {
          labelFa: 'شبیه‌سازی شوک افزایش قیمت سوخت و استهلاک مخزن',
          badge: 'تست استرس',
          mode: 'simulation' as const,
          text: `در صورت افزایش نرخ سوخت و استهلاک تانکرهای دوجداره استیل، چه تغییری در ضرایب تعرفه برای حفظ سودآوری بالای ۲۱٪ لازم است؟`,
        },
        {
          labelFa: 'پایش سقف تعهد بیمه‌نامه و تطابق بارنامه‌ها',
          badge: 'ممیزی رگولاتوری',
          mode: 'investigation' as const,
          text: `تحلیل انطباق سقف بیمه‌نامه ${insuranceCeilingBillion} میلیارد تومانی شرکت با ارزش اظهارشده محمولات پتروشیمی در استعلام‌های آنلاین.`,
        },
      ];
    } else {
      return [
        {
          labelFa: 'فرمول اضافه کرایه زمستانه گردنه‌های کوهستانی',
          badge: 'رول‌بلاک جدید',
          mode: 'authoring' as const,
          text: 'یک رول‌بلاک تعرفه برای گردنه‌های کوهستانی زاگرس و البرز با ضریب +۱۲٪ و گاردریل کف سود ۱۵٪ پیشنهاد بده و نحوه محاسبه آن را شرح بده.',
        },
        {
          labelFa: 'تحلیل تبارشناسی کرایه تریلی کفی تهران به بندرعباس',
          badge: 'تبارشناسی مالی',
          mode: 'explanation' as const,
          text: 'کرایه تریلی کفی با ۲۲ تن بار برای مسافت ۱۲۸۰ کیلومتر محور تهران به بندرعباس چگونه بر مبنای تن/کیلومتر و عوارض راهداری محاسبه می‌شود؟',
        },
        {
          labelFa: 'شبیه‌سازی شوک تقاضای فصلی و تعادل بار برگشت',
          badge: 'شبیه‌سازی ریسک',
          mode: 'simulation' as const,
          text: `برای خطوط اختصاصی شرکت ${carrierName}، چه سناریوهای شوک تقاضا و جذب بار برگشت را باید قبل از انتشار پکیج تعرفه جدید شبیه‌سازی کنیم؟`,
        },
        {
          labelFa: 'بررسی نشت تخفیف مشتریان VIP و افت حاشیه سود',
          badge: 'کشف ناهنجاری',
          mode: 'investigation' as const,
          text: 'ناهنجاری‌های اخیراً ثبت‌شده ناشی از هم‌پوشانی تخفیفات تناژ با تخفیف فصلی را بررسی و راهکار گاردریل کلمپ ارائه کن.',
        },
      ];
    }
  }, [currentCarrierOrg, carrierName, insuranceCeilingBillion]);

  const modes = [
    { id: 'authoring' as const, labelFa: 'طراحی تعرفه', descFa: 'فرمول‌نویسی و رول‌بلاک' },
    { id: 'explanation' as const, labelFa: 'تحلیل تصمیم', descFa: 'علت‌یابی قیمت بارنامه' },
    { id: 'simulation' as const, labelFa: 'پیشنهاد تست', descFa: 'شبیه‌سازی و استرس' },
    { id: 'investigation' as const, labelFa: 'کشف ناهنجاری', descFa: 'بررسی نشت تخفیف' },
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
            activePackage: activeProductionPackage?.displayId || 'SP-1042',
            version: activeProductionPackage?.version || 11,
            marginFloor: pricingPolicy?.guardrails?.minMarginPercent || 15,
            corridorsCount: routeMatrix?.length || 12,
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
        <div className="fixed inset-0 z-50 overflow-hidden" id="ai-copilot-modal">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#04342C]/40 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="absolute inset-y-0 left-0 w-full max-w-xl bg-white border-r border-[#D3D1C7] shadow-2xl flex flex-col font-sans"
          >
            {/* 1. Header */}
            <div className="p-4 border-b border-[#D3D1C7] bg-[#FAFAF8] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E1F5EE] border border-[#9FE1CB] text-[#085041] flex items-center justify-center shadow-xs">
                  <Sparkles className="w-5 h-5 text-[#085041]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-[#2C2C2A] text-sm font-display tracking-tight">
                      دستیار هوشمند و تحلیل‌گر تعرفه متصدی (Gemini AI)
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E1F5EE] text-[#04342C] border border-[#9FE1CB]">
                      پنل مدیریت باربری
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#5F5E5A] font-medium mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>سازمان حمل‌ونقل: <strong className="text-slate-800">{carrierName}</strong></span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[#085041] font-semibold">{fleetCount} ناوگان فعال</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleResetChat}
                  title="شروع گفتگوی جدید"
                  className="p-2 text-[#5F5E5A] hover:text-[#2C2C2A] hover:bg-[#F1EFE8] rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  aria-label="بستن پنجره گفتگو"
                  className="p-2 text-[#5F5E5A] hover:text-[#2C2C2A] hover:bg-[#F1EFE8] rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Carrier Quick Status Banner */}
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between text-xs text-slate-600 gap-2 overflow-x-auto">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                <span>پروانه راهداری: <strong className="font-mono text-slate-800">{licenseNo}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-slate-400">سقف بیمه‌نامه:</span>
                <strong className="text-[#085041] font-mono">{insuranceCeilingBillion} میلیارد ت</strong>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-slate-400">کف حاشیه سود:</span>
                <strong className="text-emerald-700 font-mono">۱۵.۰٪ کلمپ</strong>
              </div>
            </div>

            {/* 2. Mode Selector */}
            <div className="p-3 bg-[#F1EFE8]/40 border-b border-[#D3D1C7]">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {modes.map((m) => {
                  const isActive = mode === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMode(m.id)}
                      className={`px-2 py-1.5 rounded-xl text-right transition-all cursor-pointer border ${
                        isActive
                          ? 'bg-[#085041] text-white border-[#04342C] font-bold shadow-2xs'
                          : 'bg-white text-[#2C2C2A] border-[#D3D1C7] hover:bg-[#FAFAF8] hover:border-[#0F6E56]'
                      }`}
                    >
                      <div className="text-[11px] font-bold block">{m.labelFa}</div>
                      <div className={`text-[9px] block truncate ${isActive ? 'text-[#9FE1CB]' : 'text-[#888780]'}`}>
                        {m.descFa}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Messages List Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs bg-[#FAFAF8]">
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
                          ? 'bg-white text-[#2C2C2A] border border-[#D3D1C7] rounded-br-none'
                          : msg.isError
                          ? 'bg-[#FAECE7] text-[#712B13] border border-[#F0997D] rounded-bl-none'
                          : 'bg-[#E1F5EE]/40 text-[#2C2C2A] border border-[#9FE1CB] rounded-bl-none'
                      }`}
                    >
                      {/* Message Header */}
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#D3D1C7]/70 text-[11px]">
                        <span className="flex items-center gap-1.5 font-bold">
                          {isUser ? (
                            <span className="text-[#888780]">کاربر / طراح تعرفه</span>
                          ) : (
                            <span className="text-[#085041] flex items-center gap-1">
                              <Bot className="w-3.5 h-3.5 text-[#0F6E56]" />
                              دستیار هوشمند Gemini
                            </span>
                          )}
                        </span>
                        <div className="flex items-center gap-2">
                          {!isUser && (
                            <button
                              type="button"
                              onClick={() => handleCopy(msg.text, idx)}
                              title="کپی متن پاسخ"
                              className="text-[#5F5E5A] hover:text-[#085041] p-1 rounded transition-colors cursor-pointer"
                            >
                              {copiedIdx === idx ? (
                                <Check className="w-3 h-3 text-[#0F6E56]" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          )}
                          <span className="font-mono text-[#888780] text-[10px]">{msg.timestamp}</span>
                        </div>
                      </div>

                      {/* Message Text with Markdown */}
                      {isUser ? (
                        <div className="whitespace-pre-wrap leading-6 text-[#2C2C2A] font-medium">{msg.text}</div>
                      ) : (
                        <div className="markdown-body text-[#2C2C2A] leading-6 space-y-2 prose-sm prose-slate">
                          <Markdown>{msg.text}</Markdown>
                        </div>
                      )}
                    </div>

                    {!isUser && !msg.isError && (
                      <div className="text-[10px] text-[#5F5E5A] mt-1 flex items-center gap-1 mr-1 font-medium">
                        <ShieldCheck className="w-3 h-3 text-[#0F6E56]" />
                        <span>پاسخ مستقیم و زنده موتور هوش مصنوعی Gemini 3.7 Flash</span>
                      </div>
                    )}
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-center gap-2 text-[#04342C] text-xs p-3.5 bg-[#E1F5EE] rounded-2xl border border-[#9FE1CB] w-fit shadow-2xs">
                  <span className="w-4 h-4 border-2 border-[#085041] border-t-transparent rounded-full animate-spin" />
                  <span className="font-bold">در حال تفکر و پردازش زنده با مدل هوش مصنوعی Gemini 3.7 Flash...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* 4. Quick Prompts */}
            <div className="p-3 bg-[#FAFAF8] border-t border-[#D3D1C7] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#2C2C2A] font-bold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#0F6E56]" />
                  پرسش‌های پیشنهادی سریع:
                </span>
                <span className="text-[10px] text-[#888780]">کلیک جهت ارسال فوری</span>
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
                    className="w-full text-right p-2 rounded-xl bg-white border border-[#D3D1C7] hover:border-[#0F6E56] text-[#2C2C2A] text-xs hover:text-[#04342C] hover:bg-[#E1F5EE]/40 transition-all flex items-center justify-between cursor-pointer shadow-2xs group"
                  >
                    <span className="truncate font-medium text-[11px]">{qp.labelFa}</span>
                    <ChevronLeft className="w-3.5 h-3.5 text-[#888780] group-hover:text-[#085041] shrink-0 mr-1 transition-transform group-hover:-translate-x-1" />
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Input Form */}
            <div className="p-3.5 bg-white border-t border-[#D3D1C7]">
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
                  placeholder="دستور یا پرسش خود را بنویسید (مثلاً: نحوه فرمول‌بندی نرخ حمل میلگرد با تریلی لبه‌دار)..."
                  className="flex-1 bg-[#FAFAF8] border border-[#D3D1C7] rounded-xl px-3.5 py-2.5 text-xs text-[#2C2C2A] placeholder:text-[#888780] focus:outline-none focus:border-[#085041] focus:bg-white focus:ring-2 focus:ring-[#9FE1CB] transition-all"
                />
                <button
                  type="submit"
                  disabled={isLoading || !prompt.trim()}
                  className="px-4 py-2.5 bg-[#085041] hover:bg-[#04342C] disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center transition-all cursor-pointer shadow-2xs shrink-0 gap-1.5"
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

