import React, { useState, useRef, useEffect } from 'react';
import {
  Package,
  Check,
  ChevronDown,
  Snowflake,
  Flame,
  ShieldCheck,
  Boxes,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface CommodityOption {
  id: string;
  nameFa: string;
  categoryFa: string;
  riskLevel: 'عادی' | 'متوسط' | 'بالا';
  descriptionFa: string;
  iconType: 'box' | 'cold' | 'adr' | 'steel' | 'bulk';
}

export const IRAN_COMMODITY_CATEGORIES: CommodityOption[] = [
  {
    id: 'general_food',
    nameFa: 'مواد غذایی و فاسدشدنی',
    categoryFa: 'محصولات کنترل دما',
    riskLevel: 'متوسط',
    descriptionFa: 'لبنیات، پروتئین، فرآورده‌های منجمد و کنسانتره میوه',
    iconType: 'cold',
  },
  {
    id: 'steel_industrial',
    nameFa: 'فولاد و مصالح ساختمانی',
    categoryFa: 'صنایع سنگین و فلزی',
    riskLevel: 'عادی',
    descriptionFa: 'رول ورق گرم و سرد، میلگرد، شمش، پروفیل، لوله‌های صنعتی و سرامیک',
    iconType: 'steel',
  },
  {
    id: 'petrochem',
    nameFa: 'محصولات پتروشیمی',
    categoryFa: 'مواد پلیمری و پلاستیک',
    riskLevel: 'عادی',
    descriptionFa: 'گرانول، پلی‌اتیلن، رزین، کود اوره و مستربچ صنعتی',
    iconType: 'box',
  },
  {
    id: 'hazmat_adr',
    nameFa: 'مواد شیمیایی خطرناک ADR',
    categoryFa: 'کالای اشتعال‌زا و سمی',
    riskLevel: 'بالا',
    descriptionFa: 'حلال‌ها، اسیدها، گازهای تحت‌فشار و مواد کلاس ۱ الی ۹ با مجوز ویژه',
    iconType: 'adr',
  },
  {
    id: 'bulk_minerals',
    nameFa: 'کالای فله معدنی',
    categoryFa: 'معادن و خاک‌های صنعتی',
    riskLevel: 'عادی',
    descriptionFa: 'کنسانتره آهن، کلینکر، سیمان فله، گندله و خاک سرب و روی',
    iconType: 'bulk',
  },
  {
    id: 'electronics_sensitive',
    nameFa: 'لوازم الکترونیک و قطعات',
    categoryFa: 'کالای حساس و گران‌بها',
    riskLevel: 'متوسط',
    descriptionFa: 'لوازم خانگی، بردهای الکترونیکی، تجهیزات پزشکی و مخابراتی',
    iconType: 'box',
  },
];

interface CommodityPickerDropdownProps {
  id?: string;
  value: string;
  onChange: (commodityName: string) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export const CommodityPickerDropdown: React.FC<CommodityPickerDropdownProps> = ({
  id,
  value,
  onChange,
  label = 'نوع کالا و بسته‌بندی:',
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCommodity = IRAN_COMMODITY_CATEGORIES.find(
    (c) => c.nameFa === value || c.id === value || value.includes(c.nameFa)
  ) || {
    id: 'custom',
    nameFa: value || 'کالای تجاری استاندارد',
    categoryFa: 'کالای عمومی',
    riskLevel: 'عادی' as const,
    descriptionFa: 'بسته‌بندی استاندارد حمل جاده‌ای',
    iconType: 'box' as const,
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

  return (
    <div className={`relative ${className}`} ref={containerRef} id={id}>
      {label && (
        <label className="block text-slate-700 font-bold text-xs mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-amber-600" />
            <span>{label}</span>
          </span>
          <span className="text-[10px] font-normal text-slate-400">
            دسته‌بندی و ضریب ریسک
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
            <Package className="w-4 h-4" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-900 truncate">
                {selectedCommodity.nameFa}
              </span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded font-bold shrink-0 ${
                  selectedCommodity.riskLevel === 'بالا'
                    ? 'bg-rose-100 text-rose-900'
                    : selectedCommodity.riskLevel === 'متوسط'
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-emerald-100 text-emerald-900'
                }`}
              >
                ریسک {selectedCommodity.riskLevel}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 truncate mt-0.5 font-medium leading-tight">
              {selectedCommodity.categoryFa}
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
            <div className="p-2.5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700">
                دسته‌بندی‌های استاندارد کالای بارنامه:
              </span>
              <span className="text-[10px] text-slate-400 font-mono">۶ رده مصوب</span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-slate-100">
              {IRAN_COMMODITY_CATEGORIES.map((item) => {
                const isSelected = selectedCommodity.id === item.id || selectedCommodity.nameFa === item.nameFa;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onChange(item.nameFa);
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
                        {item.iconType === 'cold' ? (
                          <Snowflake className="w-4 h-4" />
                        ) : item.iconType === 'adr' ? (
                          <Flame className="w-4 h-4" />
                        ) : (
                          <Boxes className="w-4 h-4" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">
                            {item.nameFa}
                          </span>
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${
                              item.riskLevel === 'بالا'
                                ? 'bg-rose-100 text-rose-900 font-bold'
                                : item.riskLevel === 'متوسط'
                                ? 'bg-amber-100 text-amber-900 font-bold'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            ریسک {item.riskLevel}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                          {item.descriptionFa}
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
