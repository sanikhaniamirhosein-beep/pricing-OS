import React, { useState, useRef, useEffect } from 'react';
import {
  Truck,
  Check,
  ChevronDown,
  Scale,
  Snowflake,
  ShieldAlert,
  Layers,
  Search,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface VehicleOption {
  id: string;
  nameFa: string;
  categoryFa: string;
  capacityTon: number;
  axles: number;
  descriptionFa: string;
  isSpecialized?: boolean;
  tagColor?: string;
}

export const IRAN_LOGISTICS_FLEET: VehicleOption[] = [
  {
    id: 'tent_trailer',
    nameFa: 'تریلی چادری',
    categoryFa: 'ترانزیت استاندارد و صادراتی',
    capacityTon: 24,
    axles: 5,
    descriptionFa: 'حمل انواع کالای تجاری، کارتن و محموله‌های بسته‌بندی',
    tagColor: 'amber',
  },
  {
    id: 'flatbed_trailer',
    nameFa: 'تریلر کفی',
    categoryFa: 'کفی صنعتی و کانتینری',
    capacityTon: 25,
    axles: 5,
    descriptionFa: 'حمل آهن‌آلات، میلگرد، شمش، رول فولادی و کانتینر',
    tagColor: 'blue',
  },
  {
    id: 'reefer_trailer',
    nameFa: 'کشنده یخچال‌دار',
    categoryFa: 'کنترل فعال دما (-۱۸°C)',
    capacityTon: 20,
    axles: 5,
    descriptionFa: 'حمل فرآورده‌های پروتئینی، لبنی، دارویی و مواد غذایی',
    isSpecialized: true,
    tagColor: 'teal',
  },
  {
    id: 'rigid_15t',
    nameFa: 'کامیون جفت ۱۵ تن',
    categoryFa: 'کامیون ۱۰ چرخ',
    capacityTon: 15,
    axles: 3,
    descriptionFa: 'حمل مصالح ساختمانی، سرامیک و بارهای صنعتی متوسط',
    tagColor: 'slate',
  },
  {
    id: 'rigid_10t',
    nameFa: 'کامیون تک ۱۰ تن',
    categoryFa: 'کامیون ۶ چرخ',
    capacityTon: 10,
    axles: 2,
    descriptionFa: 'بارگیری شهری و بین‌شهری سریع و توزیع منطقه‌ای',
    tagColor: 'slate',
  },
  {
    id: 'light_5t',
    nameFa: 'خاور ۵ تن',
    categoryFa: 'کامیونت مسقف / روباز',
    capacityTon: 5,
    axles: 2,
    descriptionFa: 'بارهای سبک، لوازم حساس و خرده‌بار تجاری',
    tagColor: 'slate',
  },
  {
    id: 'heavy_bogie',
    nameFa: 'کمرشکن بوژی',
    categoryFa: 'فوق‌سنگین و ترافیکی',
    capacityTon: 60,
    axles: 11,
    descriptionFa: 'حمل ترانسفورماتور، توربین و ماشین‌آلات راه‌سازی',
    isSpecialized: true,
    tagColor: 'rose',
  },
];

interface VehiclePickerDropdownProps {
  id?: string;
  value: string;
  onChange: (vehicleName: string) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export const VehiclePickerDropdown: React.FC<VehiclePickerDropdownProps> = ({
  id,
  value,
  onChange,
  label = 'نوع ناوگان باربری:',
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Match selected vehicle
  const selectedVehicle: VehicleOption = IRAN_LOGISTICS_FLEET.find(
    (v) => v.nameFa === value || v.id === value || value.includes(v.nameFa)
  ) || {
    id: 'custom',
    nameFa: value || 'تریلی چادری',
    categoryFa: 'ناوگان حمل جاده‌ای',
    capacityTon: 22,
    axles: 5,
    descriptionFa: 'ناوگان باری استاندارد',
    tagColor: 'amber',
    isSpecialized: false,
  };

  // Close on outside click
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
            <Truck className="w-3.5 h-3.5 text-amber-600" />
            <span>{label}</span>
          </span>
          <span className="text-[10px] font-normal text-slate-400">
            ظرفیت و نوع تریلر
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
          <div className="w-7 h-7 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Truck className="w-3.5 h-3.5" />
          </div>

          <div className="min-w-0 flex-1 flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <span className="text-xs font-bold text-slate-900 truncate">
                {selectedVehicle.nameFa}
              </span>
              <span className="text-[10px] text-slate-400 font-medium truncate">
                ({selectedVehicle.categoryFa})
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold shrink-0 font-mono">
              {selectedVehicle.capacityTon} تن
            </span>
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
            className="absolute right-0 top-full mt-2 w-full min-w-[300px] sm:min-w-[360px] max-w-[calc(100vw-32px)] bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col font-sans"
            style={{ maxHeight: '360px' }}
          >
            <div className="p-2.5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                ناوگان فعال شبکه حمل جاده‌ای:
              </span>
              <span className="text-[10px] text-slate-400">۷ تیپ استاندارد</span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-slate-100">
              {IRAN_LOGISTICS_FLEET.map((fleet) => {
                const isSelected = selectedVehicle.id === fleet.id || selectedVehicle.nameFa === fleet.nameFa;
                return (
                  <button
                    key={fleet.id}
                    type="button"
                    onClick={() => {
                      onChange(fleet.nameFa);
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
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-amber-500 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                        }`}
                      >
                        {fleet.id === 'reefer_trailer' ? (
                          <Snowflake className="w-4 h-4" />
                        ) : (
                          <Truck className="w-4 h-4" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">
                            {fleet.nameFa}
                          </span>
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-100 text-slate-700 font-bold font-mono">
                            حداکثر {fleet.capacityTon} تن
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono">
                            ({fleet.axles} محور)
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                          {fleet.descriptionFa}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="shrink-0 mr-2 text-amber-600">
                        <Check className="w-4 h-4" />
                      </div>
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
