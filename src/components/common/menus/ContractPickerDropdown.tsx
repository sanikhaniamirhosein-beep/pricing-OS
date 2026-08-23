import React, { useState, useRef, useEffect } from 'react';
import {
  Building2,
  Check,
  ChevronDown,
  ShieldCheck,
  BadgePercent,
  Search,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LogisticsContract } from '../../../types/pricing';

interface ContractPickerDropdownProps {
  id?: string;
  value: string;
  contracts: LogisticsContract[];
  onChange: (contractId: string) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export const ContractPickerDropdown: React.FC<ContractPickerDropdownProps> = ({
  id,
  value,
  contracts = [],
  onChange,
  label = 'قرارداد صاحب‌کالا (تخفیف اختصاصی):',
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedContract = contracts.find((c) => c.contractId === value);

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
            <Building2 className="w-3.5 h-3.5 text-amber-600" />
            <span>{label}</span>
          </span>
          <span className="text-[10px] font-normal text-slate-400">
            تخفیف‌های پله‌ای و SLA
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
            ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-500/20 shadow-xs'
            : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-slate-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Building2 className="w-4 h-4" />
          </div>

          <div className="min-w-0 flex-1">
            {selectedContract ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-900 truncate">
                    {selectedContract.customerNameFa}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-bold shrink-0">
                    {selectedContract.tier}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate mt-0.5 font-medium leading-tight font-mono">
                  {selectedContract.displayId} (تعهد ماهانه: {selectedContract.minimumCommitmentTons?.toLocaleString('fa-IR')} تن)
                </p>
              </>
            ) : (
              <>
                <span className="text-xs font-bold text-slate-700 truncate block">
                  تعرفه عمومی استاندارد (بدون قرارداد سازمانی)
                </span>
                <p className="text-[10px] text-slate-400 truncate mt-0.5 font-medium leading-tight">
                  نرخ مصوب شبکه کشوری بدون تخفیف‌های پله‌ای
                </p>
              </>
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
            className="absolute right-0 top-full mt-2 w-full min-w-[300px] sm:min-w-[360px] max-w-[calc(100vw-32px)] bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col font-sans"
            style={{ maxHeight: '320px' }}
          >
            <div className="p-2 border-b border-slate-100 bg-slate-50/80">
              <span className="text-[11px] font-bold text-slate-700">
                قراردادهای حقوقی و مشتریان کلیدی:
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-slate-100">
              {/* Option 1: None / Public */}
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setIsOpen(false);
                }}
                className={`w-full text-right p-2.5 rounded-xl transition-all duration-150 flex items-center justify-between cursor-pointer group ${
                  !value
                    ? 'bg-amber-50/90 text-amber-950 font-bold border border-amber-300 shadow-2xs'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold block text-slate-800">
                    تعرفه عمومی استاندارد (بدون قرارداد اختصاصی)
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    نرخ‌های پایه طبق جدول مصوب راهداری
                  </span>
                </div>
                {!value && <Check className="w-4 h-4 text-amber-600 shrink-0 mr-2" />}
              </button>

              {/* Real contracts */}
              {contracts.map((cnt) => {
                const isSelected = cnt.contractId === value;
                return (
                  <button
                    key={cnt.contractId}
                    type="button"
                    onClick={() => {
                      onChange(cnt.contractId);
                      setIsOpen(false);
                    }}
                    className={`w-full text-right p-2.5 rounded-xl transition-all duration-150 flex items-center justify-between cursor-pointer group ${
                      isSelected
                        ? 'bg-amber-50/90 text-amber-950 font-bold border border-amber-300 shadow-2xs'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Building2 className="w-3.5 h-3.5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900">
                            {cnt.customerNameFa}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-amber-100 text-amber-900">
                            {cnt.tier}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">
                          {cnt.displayId} • تعهد ماهانه: {cnt.minimumCommitmentTons?.toLocaleString('fa-IR')} تن
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-amber-600 shrink-0 mr-2" />
                    )}
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
