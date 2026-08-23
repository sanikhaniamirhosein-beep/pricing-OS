import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  ShieldCheck,
  CheckCircle2,
  Bot,
  MessageSquare,
  Zap,
  ArrowLeft,
  ChevronLeft,
  RotateCw,
  Sliders,
  Scale,
  BrainCircuit,
  CornerDownLeft,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePricing } from '../../store/PricingContext';

interface AICoPilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AICoPilotDrawer: React.FC<AICoPilotDrawerProps> = ({ isOpen, onClose }) => {
  const { activeProductionPackage, pricingPolicy } = usePricing();
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'authoring' | 'explanation' | 'simulation' | 'investigation'>('authoring');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<
    { sender: 'user' | 'ai'; text: string; mode?: string; timestamp: string }[]
  >([
    {
      sender: 'ai',
      text: 'سلام و درود! من دستیار هوشمند و تحلیل‌گر تخصصی تعرفه لجستیک جاده‌ای هستم. آماده‌ام در تدوین فرمول‌های جدید، تحلیل دلایل محاسبات هر بارنامه، بهینه‌سازی گاردریل‌های کف سود و شناسایی نشت تخفیف به شما یاری برسانم.',
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const quickPrompts = [
    {
      labelFa: 'فرمول اضافه کرایه زمستانه گردنه‌های کوهستانی',
      mode: 'authoring',
      text: 'لطفاً یک رول بلاک (Rule Block) تعرفه برای گردنه‌های کوهستانی زاگرس با ضریب +۱۲٪ و گاردریل کف سود ۱۵٪ پیشنهاد بده.',
    },
    {
      labelFa: 'تحلیل علت افت حاشیه سود در محور رشت-بندرعباس',
      mode: 'investigation',
      text: 'ناهنجاری اخیراً ثبت‌شده در مسیر رشت-بندرعباس برای کشنده یخچال‌دار را بررسی و راهکار اصلاحی ارائه کن.',
    },
    {
      labelFa: 'سناریوهای تست استرس و شوک تقاضای فصلی',
      mode: 'simulation',
      text: 'برای پکیج تعرفه جدید جنوب، چه سناریوهای شوک تقاضا یا جهش قیمت سوختی را باید قبل از انتشار شبیه‌سازی کنیم؟',
    },
  ];

  const modes = [
    { id: 'authoring', labelFa: 'طراحی تعرفه', descFa: 'فرمول‌نویسی و رول‌بلاک' },
    { id: 'explanation', labelFa: 'تحلیل تصمیم', descFa: 'علت‌یابی قیمت بارنامه' },
    { id: 'simulation', labelFa: 'پیشنهاد تست', descFa: 'شبیه‌سازی و استرس' },
    { id: 'investigation', labelFa: 'کشف ناهنجاری', descFa: 'بررسی نشت تخفیف' },
  ];

  const handleSend = async (userPromptText?: string) => {
    const textToSend = userPromptText || prompt;
    if (!textToSend.trim() || isLoading) return;

    const userMsg = {
      sender: 'user' as const,
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          mode,
          context: {
            activePackage: activeProductionPackage.displayId,
            version: activeProductionPackage.version,
            marginFloor: pricingPolicy.guardrails.minMarginPercent,
          },
        }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: data.reply || 'پاسخ هوش مصنوعی دریافت شد.',
          mode,
          timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'بر اساس تحلیل هوشمند قواعد لجستیک جاده‌ای:\nبا توجه به ضریب تعدیل سوخت گازوئیل ۱.۰۴ و عوارض گردنه‌ها، پیشنهاد می‌شود کف حاشیه سود روی ۱۵٪ مقید (Clamp) بماند تا در صورت ترکیب تخفیف تناژ و بار برگشت، ناوگان حمل دچار زیان نشود.',
          mode,
          timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="absolute inset-y-0 left-0 w-full max-w-lg bg-white border-r border-slate-200 shadow-2xl flex flex-col font-sans"
          >
            {/* 1. Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-600 flex items-center justify-center shadow-xs">
                  <Sparkles className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 text-sm font-display tracking-tight">
                      دستیار هوشمند تحلیل و طراحی تعرفه
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100/90 text-teal-900 border border-teal-300/80">
                      هوشمند
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    مدل تحلیلی قواعد قیمت‌گذاری، تبارشناسی و کشف انحرافات
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="بستن پنجره گفتگو"
                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2. Mode Selector */}
            <div className="p-3 bg-slate-50/50 border-b border-slate-100">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {modes.map((m) => {
                  const isActive = mode === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMode(m.id as any)}
                      className={`px-2 py-1.5 rounded-xl text-right transition-all cursor-pointer border ${
                        isActive
                          ? 'bg-teal-600 text-white border-teal-700 font-bold shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200/80 hover:bg-slate-50 hover:border-teal-400'
                      }`}
                    >
                      <div className="text-[11px] font-bold block">{m.labelFa}</div>
                      <div className={`text-[9px] block truncate ${isActive ? 'text-teal-100' : 'text-slate-400'}`}>
                        {m.descFa}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Messages List Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs bg-slate-50/30">
              {messages.map((msg, idx) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={idx}
                    className={`flex flex-col ${isUser ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`p-3.5 rounded-2xl max-w-[92%] leading-relaxed shadow-2xs ${
                        isUser
                          ? 'bg-white text-slate-900 border border-slate-200 rounded-br-none'
                          : 'bg-teal-50/70 text-slate-900 border border-teal-200/80 rounded-bl-none'
                      }`}
                    >
                      {/* Message Header */}
                      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-200/60 text-[11px]">
                        <span className="flex items-center gap-1.5 font-bold">
                          {isUser ? (
                            <span className="text-amber-800">کاربر گرامی</span>
                          ) : (
                            <span className="text-teal-700 flex items-center gap-1">
                              <Bot className="w-3.5 h-3.5 text-teal-600" />
                              دستیار هوشمند قیمت‌گذاری
                            </span>
                          )}
                        </span>
                        <span className="font-mono text-slate-400 text-[10px]">{msg.timestamp}</span>
                      </div>

                      {/* Message Text */}
                      <div className="whitespace-pre-wrap leading-6 text-slate-800">{msg.text}</div>
                    </div>

                    {!isUser && (
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 mr-1 font-medium">
                        <ShieldCheck className="w-3 h-3 text-teal-600" />
                        <span>پیش‌نویس تحلیلی هوش مصنوعی (نیازمند شبیه‌سازی و تایید)</span>
                      </div>
                    )}
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-center gap-2 text-teal-900 text-xs p-3 bg-teal-50 rounded-2xl border border-teal-200 w-fit shadow-2xs">
                  <span className="w-3.5 h-3.5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                  <span className="font-medium">در حال تحلیل هوشمند قواعد تعرفه و شبیه‌سازی سناریو...</span>
                </div>
              )}
            </div>

            {/* 4. Quick Prompts */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-700 font-bold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-teal-600" />
                  پرسش‌های پیشنهادی:
                </span>
                <span className="text-[10px] text-slate-400">کلیک جهت پرسش سریع</span>
              </div>
              <div className="space-y-1">
                {quickPrompts.map((qp, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(qp.text)}
                    className="w-full text-right p-2 rounded-xl bg-white border border-slate-200/80 hover:border-teal-400 text-slate-800 text-xs hover:text-teal-800 hover:bg-teal-50/40 transition-all flex items-center justify-between cursor-pointer shadow-2xs group"
                  >
                    <span className="truncate font-medium text-[11px]">{qp.labelFa}</span>
                    <ChevronLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 shrink-0 mr-1 transition-transform group-hover:-translate-x-1" />
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Input Form */}
            <div className="p-3 bg-white border-t border-slate-200/80">
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
                  placeholder="دستور یا پرسش خود را بنویسید (مثلاً: محاسبه فرمول اضافه کرایه زمستانه)..."
                  className="flex-1 bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white focus:ring-1 focus:ring-teal-500/20 transition-all"
                />
                <button
                  type="submit"
                  disabled={isLoading || !prompt.trim()}
                  className="px-3.5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center transition-all cursor-pointer shadow-2xs shrink-0"
                  title="ارسال پیام"
                >
                  <Send className="w-4 h-4 rotate-180 text-white" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
