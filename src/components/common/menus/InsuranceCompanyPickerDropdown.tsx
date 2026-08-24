import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  Check,
  ChevronDown,
  Search,
  X,
  Award,
  Building2,
  Sparkles,
  Shield,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface InsuranceCompanyOption {
  id: string;
  nameFa: string;
  type: 'state' | 'private';
  solvencyLevel: 'level1' | 'level2';
  solvencyText: string;
  specialtyFa: string;
  tagColor: string;
  marketShareFa: string;
}

export const IRAN_INSURANCE_COMPANIES: InsuranceCompanyOption[] = [
  {
    id: 'iran_ins',
    nameFa: 'بیمه ایران',
    type: 'state',
    solvencyLevel: 'level1',
    solvencyText: 'توانگری مالی سطح یک (دولتی)',
    specialtyFa: 'پوشش جامع ناوگان سنگین و باربری سراسری',
    tagColor: 'emerald',
    marketShareFa: 'بزرگترین سهم بازار',
  },
  {
    id: 'asia_ins',
    nameFa: 'بیمه آسیا',
    type: 'private',
    solvencyLevel: 'level1',
    solvencyText: 'توانگری مالی سطح یک',
    specialtyFa: 'بیمه مسئولیت متصدیان حمل‌ونقل و CMR',
    tagColor: 'blue',
    marketShareFa: 'رتبه ۱ شرکت‌های خصوصی',
  },
  {
    id: 'alborz_ins',
    nameFa: 'بیمه البرز',
    type: 'private',
    solvencyLevel: 'level1',
    solvencyText: 'توانگری مالی سطح یک',
    specialtyFa: 'تخصصی باربری، ترانزیت و محمولات ترافیکی',
    tagColor: 'indigo',
    marketShareFa: 'خسارت‌دهی سریع',
  },
  {
    id: 'dana_ins',
    nameFa: 'بیمه دانا',
    type: 'private',
    solvencyLevel: 'level1',
    solvencyText: 'توانگری مالی سطح یک',
    specialtyFa: 'پوشش شخص ثالث و حوادث رانندگان تجاری',
    tagColor: 'amber',
    marketShareFa: 'پوشش ویژه ناوگان',
  },
  {
    id: 'parsian_ins',
    nameFa: 'بیمه پارسیان',
    type: 'private',
    solvencyLevel: 'level1',
    solvencyText: 'توانگری مالی سطح یک',
    specialtyFa: 'تخفیف گروهی ناوگان شرکتی و خسارت آنلاین',
    tagColor: 'teal',
    marketShareFa: 'ارزیابی سیار خسارت',
  },
  {
    id: 'moallem_ins',
    nameFa: 'بیمه معلم',
    type: 'private',
    solvencyLevel: 'level1',
    solvencyText: 'توانگری مالی سطح یک',
    specialtyFa: 'بیمه‌های دریایی، کشتیرانی و کریدورهای صادراتی',
    tagColor: 'sky',
    marketShareFa: 'حمل چندوجهی',
  },
  {
    id: 'razi_ins',
    nameFa: 'بیمه رازی',
    type: 'private',
    solvencyLevel: 'level2',
    solvencyText: 'توانگری مالی استاندارد',
    specialtyFa: 'بیمه بدنه و آتش‌سوزی کامیون و کشنده‌ها',
    tagColor: 'purple',
    marketShareFa: 'طرح‌های منعطف',
  },
  {
    id: 'saman_ins',
    nameFa: 'بیمه سامان',
    type: 'private',
    solvencyLevel: 'level1',
    solvencyText: 'توانگری مالی سطح یک',
    specialtyFa: 'پوشش بین‌المللی سبز و حوادث جاده‌ای',
    tagColor: 'cyan',
    marketShareFa: 'ترانزیت برون‌مرزی',
  },
  {
    id: 'pasargad_ins',
    nameFa: 'بیمه پاسارگاد',
    type: 'private',
    solvencyLevel: 'level1',
    solvencyText: 'توانگری مالی سطح یک',
    specialtyFa: 'پوشش‌های مکمل خسارت و باربری داخلی',
    tagColor: 'rose',
    marketShareFa: 'شبکه سراسری',
  },
  {
    id: 'kowsar_ins',
    nameFa: 'بیمه کوثر',
    type: 'private',
    solvencyLevel: 'level1',
    solvencyText: 'توانگری مالی سطح یک',
    specialtyFa: 'پوشش ناوگان باری سنگین و ترابری',
    tagColor: 'slate',
    marketShareFa: 'پوشش سازمانی',
  },
];

interface InsuranceCompanyPickerDropdownProps {
  id?: string;
  value: string;
  onChange: (providerName: string) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export const InsuranceCompanyPickerDropdown: React.FC<InsuranceCompanyPickerDropdownProps> = ({
  id,
  value,
  onChange,
  label = 'شرکت بیمه‌گر شخص ثالث / بدنه:',
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedCompany: InsuranceCompanyOption = IRAN_INSURANCE_COMPANIES.find(
    (c) => c.nameFa === value || c.id === value || value.includes(c.nameFa)
  ) || {
    id: 'custom',
    nameFa: value || 'بیمه ایران',
    type: 'state',
    solvencyLevel: 'level1',
    solvencyText: 'بیمه‌گر مجاز مرکزی',
    specialtyFa: 'پوشش رسمی بارنامه و ناوگان',
    tagColor: 'emerald',
    marketShareFa: 'مجوز رسمی بیمه مرکزی',
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearch('');
    }
  }, [isOpen]);

  const filteredCompanies = IRAN_INSURANCE_COMPANIES.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.nameFa.toLowerCase().includes(q) ||
      c.specialtyFa.toLowerCase().includes(q) ||
      c.solvencyText.toLowerCase().includes(q)
    );
  });

  return (
    <div className={`relative ${className}`} ref={containerRef} id={id}>
      {label && (
        <label className="text-slate-700 font-bold text-xs mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{label}</span>
          </span>
          <span className="text-[10px] font-normal text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
            مورد تأیید بیمه مرکزی
          </span>
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-2.5 rounded-2xl border text-right transition-all duration-200 cursor-pointer flex items-center justify-between gap-2.5 shadow-2xs group ${
          isOpen
            ? 'bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs'
            : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-slate-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Shield className="w-4 h-4" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-950 truncate">
                {selectedCompany.nameFa}
              </span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-100/70 text-emerald-800 font-bold shrink-0 border border-emerald-200">
                {selectedCompany.marketShareFa}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 truncate mt-0.5 font-medium">
              {selectedCompany.specialtyFa}
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

      {/* Floating Animated Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="absolute left-0 right-0 top-full mt-2 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col font-sans"
            style={{ maxHeight: '340px' }}
          >
            {/* Search header */}
            <div className="p-2 border-b border-slate-100 bg-slate-50/80">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="جستجوی شرکت بیمه..."
                  className="w-full pr-8 pl-6 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-1.5 space-y-1 divide-y divide-slate-50">
              {filteredCompanies.map((company) => {
                const isSelected = selectedCompany.id === company.id || selectedCompany.nameFa === company.nameFa;
                return (
                  <button
                    key={company.id}
                    type="button"
                    onClick={() => {
                      onChange(company.nameFa);
                      setIsOpen(false);
                    }}
                    className={`w-full text-right p-2.5 rounded-xl transition-all duration-150 flex items-center justify-between cursor-pointer group ${
                      isSelected
                        ? 'bg-emerald-50/90 text-emerald-950 font-bold border border-emerald-300 shadow-2xs'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {company.nameFa}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                            {company.marketShareFa}
                          </span>
                          <span className="text-[9px] text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded font-bold">
                            {company.solvencyText}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                          {company.specialtyFa}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="shrink-0 mr-2 text-emerald-600">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                );
              })}

              {filteredCompanies.length === 0 && (
                <div className="p-4 text-center text-xs text-slate-400">
                  شرکت بیمه‌ای با این مشخصات یافت نشد
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
