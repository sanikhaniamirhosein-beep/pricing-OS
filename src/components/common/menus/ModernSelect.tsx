import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface ModernSelectOption {
  value: string;
  label: string;
  subLabel?: string;
  badge?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface ModernSelectProps {
  id?: string;
  value: string;
  onChange: (val: string) => void;
  options: ModernSelectOption[];
  label?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  searchable?: boolean;
  className?: string;
  disabled?: boolean;
  variant?: 'default' | 'amber' | 'teal';
}

export const ModernSelect: React.FC<ModernSelectProps> = ({
  id,
  value,
  onChange,
  options = [],
  label,
  placeholder = 'انتخاب کنید...',
  icon,
  searchable = false,
  className = '',
  disabled = false,
  variant = 'default',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((o) => o.value === value);

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
    if (isOpen && searchable) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearch('');
    }
  }, [isOpen, searchable]);

  const filteredOptions = options.filter((o) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      o.label.toLowerCase().includes(q) ||
      (o.subLabel && o.subLabel.toLowerCase().includes(q))
    );
  });

  const isAmber = variant === 'amber';
  const isTeal = variant === 'teal';

  return (
    <div className={`relative ${className}`} ref={containerRef} id={id}>
      {label && (
        <label className="block text-slate-700 font-bold text-xs mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            {icon}
            <span>{label}</span>
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
            ? isAmber
              ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-500/20 shadow-xs'
              : isTeal
              ? 'bg-teal-50/90 border-teal-400 ring-2 ring-teal-500/20 shadow-xs'
              : 'bg-slate-50 border-slate-400 ring-2 ring-slate-400/20 shadow-xs'
            : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-slate-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {selectedOption?.icon ? (
            <div className="shrink-0 text-slate-500">{selectedOption.icon}</div>
          ) : icon ? (
            <div className="shrink-0 text-slate-500">{icon}</div>
          ) : null}

          <div className="min-w-0 flex-1">
            {selectedOption ? (
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 truncate">
                  {selectedOption.label}
                </span>
                {selectedOption.badge && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium shrink-0">
                    {selectedOption.badge}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-xs text-slate-400 font-medium">
                {placeholder}
              </span>
            )}
            {selectedOption?.subLabel && (
              <p className="text-[10px] text-slate-400 truncate mt-0.5 font-medium leading-tight">
                {selectedOption.subLabel}
              </p>
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

      {/* Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="absolute left-0 right-0 top-full mt-2 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col font-sans"
            style={{ maxHeight: '280px' }}
          >
            {searchable && (
              <div className="p-2 border-b border-slate-100 bg-slate-50/80">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="جستجو..."
                    className="w-full pr-8 pl-6 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5 divide-y divide-slate-50">
              {filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={opt.disabled}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-right p-2 rounded-xl transition-all duration-150 flex items-center justify-between cursor-pointer group ${
                      isSelected
                        ? isAmber
                          ? 'bg-amber-50/90 text-amber-950 font-bold border border-amber-300 shadow-2xs'
                          : isTeal
                          ? 'bg-teal-50/90 text-teal-950 font-bold border border-teal-300 shadow-2xs'
                          : 'bg-slate-100 text-slate-900 font-bold shadow-2xs'
                        : 'hover:bg-slate-50 text-slate-700'
                    } ${opt.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {opt.icon && <div className="shrink-0">{opt.icon}</div>}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {opt.label}
                          </span>
                          {opt.badge && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                              {opt.badge}
                            </span>
                          )}
                        </div>
                        {opt.subLabel && (
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            {opt.subLabel}
                          </p>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <Check
                        className={`w-3.5 h-3.5 shrink-0 mr-1.5 ${
                          isAmber
                            ? 'text-amber-600'
                            : isTeal
                            ? 'text-teal-600'
                            : 'text-slate-900'
                        }`}
                      />
                    )}
                  </button>
                );
              })}

              {filteredOptions.length === 0 && (
                <div className="p-4 text-center text-xs text-slate-400">
                  موردی یافت نشد
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
