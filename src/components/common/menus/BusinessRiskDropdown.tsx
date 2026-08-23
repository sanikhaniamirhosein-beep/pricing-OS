import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Shield,
  Check,
  ChevronDown,
  Lock,
  Scale,
  Sparkles,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RiskClass } from '../../../types/pricing';

export interface RiskTierConfig {
  key: RiskClass;
  titleFa: string;
  badgeText: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  score: string;
  descFa: string;
  gateFa: string;
  icon: React.ElementType;
}

export const RISK_TIER_DEFINITIONS: RiskTierConfig[] = [
  {
    key: 'low',
    titleFa: 'ریسک تجاری پایین (Low Impact)',
    badgeText: 'ریسک پایین',
    colorClass: 'text-emerald-900',
    bgClass: 'bg-emerald-50/80',
    borderClass: 'border-emerald-200',
    score: '۰.۱۵ (امن)',
    descFa: 'تعدیلات جزئی زیر ۳٪، بدون تغییر در کف حاشیه سود ۱۵٪، مناسب اصلاحات محلی کریدورها',
    gateFa: 'تایید کارشناس ارشد تعرفه',
    icon: ShieldCheck,
  },
  {
    key: 'medium',
    titleFa: 'ریسک تجاری متوسط (Standard Impact)',
    badgeText: 'ریسک متوسط',
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/80',
    borderClass: 'border-amber-300',
    score: '۰.۴۵ (متوسط)',
    descFa: 'تغییرات کریدورهای اصلی، بازنگری تخفیفات تا ۸٪ و نیازمند شبیه‌سازی موفق ۱۰K بارنامه',
    gateFa: 'تایید مدیر ارشد تعرفه + شبیه‌سازی پایداری',
    icon: Shield,
  },
  {
    key: 'high',
    titleFa: 'ریسک استراتژیک بالا / بحرانی (Critical High Impact)',
    badgeText: 'ریسک بالا',
    colorClass: 'text-rose-950',
    bgClass: 'bg-rose-50/80',
    borderClass: 'border-rose-300',
    score: '۰.۸۲ (حساس)',
    descFa: 'بازنگری ساختاری کف حاشیه سود، تغییر سراسری ضرایب پایه و تخفیفات بالای ۱۰٪',
    gateFa: 'تصویب معاونت مالی + امضای احراز هویت دوعاملی (MFA OTP)',
    icon: ShieldAlert,
  },
];

interface BusinessRiskDropdownProps {
  id?: string;
  value: RiskClass;
  onChange: (risk: RiskClass) => void;
  label?: string;
  subLabel?: string;
  className?: string;
  disabled?: boolean;
}

export const BusinessRiskDropdown: React.FC<BusinessRiskDropdownProps> = ({
  id,
  value,
  onChange,
  label = 'منوی ارزیابی سطح ریسک تجاری (Business Risk Assessment):',
  subLabel = 'بر اساس دستورالعمل حاکمیت داده و کنترل سود عملیاتی',
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedTier = RISK_TIER_DEFINITIONS.find((r) => r.key === value) || RISK_TIER_DEFINITIONS[1];
  const IconComponent = selectedTier.icon;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef} id={id}>
      {label && (
        <label className="block text-slate-700 font-bold text-xs mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-600" />
            <span>{label}</span>
          </span>
          {subLabel && (
            <span className="text-[10px] font-normal text-slate-400">
              {subLabel}
            </span>
          )}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-2.5 sm:p-3 rounded-2xl border text-right transition-all duration-200 cursor-pointer flex items-center justify-between gap-2.5 shadow-2xs group ${
          isOpen
            ? `${selectedTier.bgClass} ${selectedTier.borderClass} ring-2 ring-amber-500/20 shadow-xs`
            : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-slate-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border ${
              value === 'high'
                ? 'bg-rose-100 text-rose-700 border-rose-200'
                : value === 'medium'
                ? 'bg-amber-100 text-amber-800 border-amber-200'
                : 'bg-emerald-100 text-emerald-800 border-emerald-200'
            }`}
          >
            <IconComponent className="w-4 h-4" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold ${selectedTier.colorClass} truncate`}>
                {selectedTier.titleFa}
              </span>
              <span className="text-[10px] font-mono font-bold bg-white/90 px-2 py-0.2 rounded-md border border-slate-200 text-slate-700 shrink-0">
                ضریب: {selectedTier.score}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 truncate mt-0.5 font-medium leading-tight">
              {selectedTier.descFa}
            </p>
          </div>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.18 }}
          className="shrink-0 text-slate-400 group-hover:text-slate-600 pl-1"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      {/* Floating Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2 w-full min-w-[320px] sm:min-w-[440px] max-w-[calc(100vw-32px)] bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col font-sans p-2.5 space-y-2"
          >
            <div className="px-1 py-0.5 flex items-center justify-between text-[11px] font-bold text-slate-700 border-b border-slate-100 pb-2">
              <span>سطح‌بندی ریسک بر اساس استاندارد ممیزی و بازرگانی:</span>
              <span className="text-[10px] font-mono text-slate-400">۳ سطح ارزیابی</span>
            </div>

            <div className="space-y-2">
              {RISK_TIER_DEFINITIONS.map((tier) => {
                const isSelected = value === tier.key;
                const TierIcon = tier.icon;
                return (
                  <button
                    key={tier.key}
                    type="button"
                    onClick={() => {
                      onChange(tier.key);
                      setIsOpen(false);
                    }}
                    className={`w-full text-right p-3 rounded-xl transition-all duration-150 cursor-pointer border flex flex-col gap-1.5 group ${
                      isSelected
                        ? `${tier.bgClass} ${tier.borderClass} ring-1 ring-amber-400/40 shadow-xs`
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                            tier.key === 'high'
                              ? 'bg-rose-200/70 text-rose-800'
                              : tier.key === 'medium'
                              ? 'bg-amber-200/70 text-amber-900'
                              : 'bg-emerald-200/70 text-emerald-900'
                          }`}
                        >
                          <TierIcon className="w-3.5 h-3.5" />
                        </div>
                        <span className={`text-xs font-bold ${tier.colorClass}`}>
                          {tier.titleFa}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold bg-white/90 px-2 py-0.5 rounded-md border border-slate-200 text-slate-700">
                          ضریب ریسک: {tier.score}
                        </span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center shadow-2xs">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed pr-8">
                      {tier.descFa}
                    </p>

                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 bg-white/70 px-2.5 py-1 rounded-lg border border-slate-200/80 mr-8">
                      <Lock className="w-3 h-3 text-amber-600 shrink-0" />
                      <span>گیت الزامی تصویب: {tier.gateFa}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
