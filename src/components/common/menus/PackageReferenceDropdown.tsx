import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Layers,
  Check,
  ChevronDown,
  Search,
  CheckCircle2,
  Clock,
  FileCode,
  Tag,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StrategyPackage, RiskClass } from '../../../types/pricing';

export interface PackageOption {
  id: string;
  title: string;
  version: string;
  displayId: string;
  status: 'Draft' | 'In Review' | 'Active' | 'Deprecated' | string;
  env?: 'draft' | 'staging' | 'production' | string;
  risk?: RiskClass;
  author: string;
  date?: string;
  changeSummary?: string;
}

interface PackageReferenceDropdownProps {
  id?: string;
  value: string;
  options: PackageOption[];
  onChange: (packageId: string) => void;
  label?: string;
  subLabel?: string;
  className?: string;
  disabled?: boolean;
}

export const PackageReferenceDropdown: React.FC<PackageReferenceDropdownProps> = ({
  id,
  value,
  options = [],
  onChange,
  label = 'منوی انتخاب بسته مرجع (Reference Package):',
  subLabel = 'بسته مبنا جهت محاسبه و مقایسه تغییرات (Baseline Diff)',
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((p) => p.id === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase();
    return options.filter(
      (opt) =>
        opt.title.toLowerCase().includes(q) ||
        opt.displayId.toLowerCase().includes(q) ||
        opt.author.toLowerCase().includes(q) ||
        opt.version.toLowerCase().includes(q)
    );
  }, [options, searchQuery]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return {
          label: 'پایدار در پروداکشن',
          className: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dotColor: 'bg-emerald-600',
        };
      case 'In Review':
        return {
          label: 'محیط آزمایشی Staging',
          className: 'bg-amber-50 text-amber-900 border-amber-200',
          dotColor: 'bg-amber-500',
        };
      default:
        return {
          label: 'پیش‌نویس Draft',
          className: 'bg-slate-100 text-slate-700 border-slate-200',
          dotColor: 'bg-slate-400',
        };
    }
  };

  const statusBadge = selectedOption ? getStatusBadge(selectedOption.status) : null;

  return (
    <div className={`relative ${className}`} ref={containerRef} id={id}>
      {label && (
        <label className="block text-slate-700 font-bold text-xs mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-600" />
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
            ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-500/20 shadow-xs'
            : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-slate-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Layers className="w-4 h-4" />
          </div>

          <div className="min-w-0 flex-1">
            {selectedOption ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-slate-900 text-amber-400 px-1.5 py-0.2 rounded-md shrink-0">
                    {selectedOption.displayId}
                  </span>
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {selectedOption.title}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0 hidden sm:inline">
                    {selectedOption.version}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500 font-medium">
                  {statusBadge && (
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded border font-semibold ${statusBadge.className}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dotColor}`} />
                      <span>{statusBadge.label}</span>
                    </span>
                  )}
                  <span className="text-slate-400 truncate">
                    طراح: {selectedOption.author}
                  </span>
                </div>
              </>
            ) : (
              <span className="text-xs text-slate-400">یک بسته مرجع انتخاب کنید...</span>
            )}
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
            className="absolute right-0 top-full mt-2 w-full min-w-[320px] sm:min-w-[420px] max-w-[calc(100vw-32px)] bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col font-sans"
            style={{ maxHeight: '340px' }}
          >
            {/* Search Header */}
            <div className="p-2.5 border-b border-slate-100 bg-slate-50/90 space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجوی بسته، شناسه یا طراح..."
                  className="w-full pr-8 pl-3 py-1.5 bg-white text-xs text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {filteredOptions.map((opt) => {
                const isSelected = selectedOption && selectedOption.id === opt.id;
                const badge = getStatusBadge(opt.status);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      onChange(opt.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-right p-2.5 rounded-xl transition-all duration-150 flex items-center justify-between gap-2.5 cursor-pointer group border ${
                      isSelected
                        ? 'bg-amber-50/95 border-amber-300 text-amber-950 font-bold shadow-2xs'
                        : 'bg-white hover:bg-slate-50/90 border-slate-100 hover:border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-800 px-1.5 py-0.2 rounded border border-slate-200">
                          {opt.displayId}
                        </span>
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {opt.title}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {opt.version}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded border text-[9px] font-bold ${badge.className}`}>
                          <span className={`w-1 h-1 rounded-full ${badge.dotColor}`} />
                          <span>{badge.label}</span>
                        </span>
                        <span>طراح: {opt.author}</span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 mr-1 shadow-xs">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}

              {filteredOptions.length === 0 && (
                <div className="py-6 text-center text-slate-400 text-xs">
                  بسته‌ای منطبق با جستجو یافت نشد
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
