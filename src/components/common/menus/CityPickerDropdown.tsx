import React, { useState, useRef, useEffect } from 'react';
import {
  MapPin,
  Search,
  Check,
  ChevronDown,
  Anchor,
  Factory,
  Building2,
  Globe2,
  X,
  Compass,
  Star,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface CityOption {
  id: string;
  nameFa: string;
  provinceFa: string;
  hubNameFa: string;
  category: 'port' | 'industrial' | 'border' | 'capital' | 'general';
  categoryLabelFa: string;
  isPopular?: boolean;
}

export const IRAN_LOGISTICS_CITIES: CityOption[] = [
  {
    id: 'tehran',
    nameFa: 'تهران',
    provinceFa: 'تهران',
    hubNameFa: 'پایانه مرکزی جنوب / احمدآباد مستوفی / شورآباد',
    category: 'capital',
    categoryLabelFa: 'پایتخت و هاب توزیع',
    isPopular: true,
  },
  {
    id: 'bandar_abbas',
    nameFa: 'بندرعباس',
    provinceFa: 'هرمزگان',
    hubNameFa: 'اسکله شهید رجایی و گمرک شهید باهنر',
    category: 'port',
    categoryLabelFa: 'بندر استراتژیک کانتینری',
    isPopular: true,
  },
  {
    id: 'isfahan',
    nameFa: 'اصفهان',
    provinceFa: 'اصفهان',
    hubNameFa: 'پایانه بار امیرکبیر و مجتمع فولاد مبارکه',
    category: 'industrial',
    categoryLabelFa: 'قطب صنعتی و فولادی کشور',
    isPopular: true,
  },
  {
    id: 'mashhad',
    nameFa: 'مشهد',
    provinceFa: 'خراسان رضوی',
    hubNameFa: 'پایانه بار بزرگ شرق / جاده سنتو',
    category: 'general',
    categoryLabelFa: 'کلان‌شهر و کریدور ترانزیت شرق',
    isPopular: true,
  },
  {
    id: 'tabriz',
    nameFa: 'تبریز',
    provinceFa: 'آذربایجان شرقی',
    hubNameFa: 'پایانه ترانزیت غرب / جاده آذرشهر',
    category: 'industrial',
    categoryLabelFa: 'هاب صنعتی و ترانزیت قفقاز',
    isPopular: true,
  },
  {
    id: 'ahvaz',
    nameFa: 'اهواز',
    provinceFa: 'خوزستان',
    hubNameFa: 'پایانه بار خوزستان و صنایع پتروشیمی',
    category: 'industrial',
    categoryLabelFa: 'قطب نفت، پتروشیمی و فولاد',
    isPopular: true,
  },
  {
    id: 'bushehr',
    nameFa: 'بوشهر',
    provinceFa: 'بوشهر',
    hubNameFa: 'گمرک منطقه ویژه اقتصادی و عسلویه',
    category: 'port',
    categoryLabelFa: 'پایانه دریایی و انرژی',
    isPopular: true,
  },
  {
    id: 'chabahar',
    nameFa: 'چابهار',
    provinceFa: 'سیستان و بلوچستان',
    hubNameFa: 'بندر شهید بهشتی و کریدور اقیانوسی',
    category: 'port',
    categoryLabelFa: 'تنها بندر اقیانوسی کشور',
    isPopular: true,
  },
  {
    id: 'bazargan',
    nameFa: 'بازرگان',
    provinceFa: 'آذربایجان غربی',
    hubNameFa: 'گمرک مرزی ترانزیت ایران-ترکیه-اروپا',
    category: 'border',
    categoryLabelFa: 'پایانه مرز ترانزیتی زمینی',
    isPopular: true,
  },
  {
    id: 'shiraz',
    nameFa: 'شیراز',
    provinceFa: 'فارس',
    hubNameFa: 'پایانه بار شیراز و شهرک صنعتی بزرگ',
    category: 'general',
    categoryLabelFa: 'مرکز جنوب مرکزی کشور',
    isPopular: true,
  },
  {
    id: 'rasht',
    nameFa: 'رشت',
    provinceFa: 'گیلان',
    hubNameFa: 'پایانه بار گیلان و کریدور شمال-جنوب (انزلی)',
    category: 'general',
    categoryLabelFa: 'هاب کشاورزی و ترانزیت خزر',
    isPopular: true,
  },
  {
    id: 'bandar_imam',
    nameFa: 'بندر امام خمینی',
    provinceFa: 'خوزستان',
    hubNameFa: 'مجتمع بندری امام خمینی (فله‌بری و غلات)',
    category: 'port',
    categoryLabelFa: 'هاب اصلی کالاهای اساسی',
    isPopular: false,
  },
  {
    id: 'arak',
    nameFa: 'اراک',
    provinceFa: 'مرکزی',
    hubNameFa: 'پایانه بار مرکزی و شهرک صنعتی خیرآباد',
    category: 'industrial',
    categoryLabelFa: 'صنایع سنگین و ماشین‌سازی',
    isPopular: false,
  },
  {
    id: 'yazd',
    nameFa: 'یزد',
    provinceFa: 'یزد',
    hubNameFa: 'پایانه بار یزد و منطقه ویژه اقتصادی',
    category: 'industrial',
    categoryLabelFa: 'صنایع معدنی، کاشی و نساجی',
    isPopular: false,
  },
  {
    id: 'qazvin',
    nameFa: 'قزوین',
    provinceFa: 'قزوین',
    hubNameFa: 'پایانه بار کاسپین و البرز صنعتی',
    category: 'industrial',
    categoryLabelFa: 'هاب لجستیک غرب تهران',
    isPopular: false,
  },
  {
    id: 'kerman',
    nameFa: 'کرمان',
    provinceFa: 'کرمان',
    hubNameFa: 'پایانه بار کرمان و معادن سرچشمه و گل‌گهر',
    category: 'industrial',
    categoryLabelFa: 'صنایع مس و سنگ‌آهن',
    isPopular: false,
  },
];

interface CityPickerDropdownProps {
  id?: string;
  value: string;
  onChange: (cityName: string) => void;
  label?: string;
  type?: 'origin' | 'destination';
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const CityPickerDropdown: React.FC<CityPickerDropdownProps> = ({
  id,
  value,
  onChange,
  label,
  type = 'origin',
  placeholder = 'انتخاب شهر...',
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'popular' | 'port' | 'industrial' | 'border'>('all');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Match selected city
  const selectedCity = IRAN_LOGISTICS_CITIES.find(
    (c) => c.nameFa === value || c.id === value || value.includes(c.nameFa)
  ) || {
    id: 'custom',
    nameFa: value || placeholder,
    provinceFa: '',
    hubNameFa: 'شهر مشخص‌شده',
    category: 'general' as const,
    categoryLabelFa: 'نقطه بارگیری/تخلیه',
    isPopular: false,
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Filter cities
  const filteredCities = IRAN_LOGISTICS_CITIES.filter((city) => {
    // category filter
    if (activeCategoryFilter === 'popular' && !city.isPopular) return false;
    if (activeCategoryFilter === 'port' && city.category !== 'port') return false;
    if (activeCategoryFilter === 'industrial' && city.category !== 'industrial') return false;
    if (activeCategoryFilter === 'border' && city.category !== 'border') return false;

    // query filter
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      city.nameFa.toLowerCase().includes(q) ||
      city.provinceFa.toLowerCase().includes(q) ||
      city.hubNameFa.toLowerCase().includes(q) ||
      city.categoryLabelFa.toLowerCase().includes(q)
    );
  });

  const isOrigin = type === 'origin';
  const themeColor = isOrigin ? 'amber' : 'teal';

  return (
    <div className={`relative ${className}`} ref={containerRef} id={id}>
      {label && (
        <label className="block text-slate-700 font-bold text-xs mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <MapPin
              className={`w-3.5 h-3.5 ${
                isOrigin ? 'text-amber-600' : 'text-teal-600'
              }`}
            />
            <span>{label}</span>
          </span>
          <span className="text-[10px] font-normal text-slate-400">
            {isOrigin ? 'محل بارگیری' : 'محل تخلیه'}
          </span>
        </label>
      )}

      {/* Trigger Button - Modern, high-craft, interactive */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-2.5 rounded-2xl border text-right transition-all duration-200 cursor-pointer flex items-center justify-between gap-2.5 shadow-2xs group ${
          isOpen
            ? isOrigin
              ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-500/20 shadow-xs'
              : 'bg-teal-50/90 border-teal-400 ring-2 ring-teal-500/20 shadow-xs'
            : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-slate-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
              isOrigin
                ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                : 'bg-teal-500/10 text-teal-600 border border-teal-500/20'
            }`}
          >
            <MapPin className="w-4 h-4" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-900 truncate">
                {selectedCity.nameFa}
              </span>
              {selectedCity.provinceFa && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium shrink-0">
                  استان {selectedCity.provinceFa}
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 truncate mt-0.5 font-medium leading-tight">
              {selectedCity.hubNameFa}
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

      {/* Floating Animated Popover Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="absolute left-0 right-0 top-full mt-2 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col font-sans"
            style={{ maxHeight: '380px' }}
          >
            {/* Search and Quick Filters Header */}
            <div className="p-2.5 border-b border-slate-100 bg-slate-50/70 space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجوی شهر، بندر، پایانه یا گمرک..."
                  className="w-full pr-8 pl-8 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Categorization Pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-[10px] font-bold scrollbar-none">
                <button
                  type="button"
                  onClick={() => setActiveCategoryFilter('all')}
                  className={`px-2.5 py-1 rounded-lg transition-all shrink-0 cursor-pointer ${
                    activeCategoryFilter === 'all'
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100'
                  }`}
                >
                  همه شهرها
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategoryFilter('popular')}
                  className={`px-2.5 py-1 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                    activeCategoryFilter === 'popular'
                      ? 'bg-amber-500 text-white shadow-2xs'
                      : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100'
                  }`}
                >
                  <Star className="w-2.5 h-2.5 fill-current" />
                  پرتکرار
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategoryFilter('port')}
                  className={`px-2.5 py-1 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                    activeCategoryFilter === 'port'
                      ? 'bg-teal-600 text-white shadow-2xs'
                      : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100'
                  }`}
                >
                  <Anchor className="w-2.5 h-2.5" />
                  بنادر و اسکله‌ها
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategoryFilter('industrial')}
                  className={`px-2.5 py-1 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                    activeCategoryFilter === 'industrial'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100'
                  }`}
                >
                  <Factory className="w-2.5 h-2.5" />
                  قطب‌های صنعتی
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategoryFilter('border')}
                  className={`px-2.5 py-1 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                    activeCategoryFilter === 'border'
                      ? 'bg-purple-600 text-white shadow-2xs'
                      : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100'
                  }`}
                >
                  <Globe2 className="w-2.5 h-2.5" />
                  پایانه‌های مرزی
                </button>
              </div>
            </div>

            {/* Cities Scrollable List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 max-h-64 divide-y divide-slate-100">
              {filteredCities.map((city) => {
                const isSelected = selectedCity.nameFa === city.nameFa;
                return (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => {
                      onChange(city.nameFa);
                      setIsOpen(false);
                    }}
                    className={`w-full text-right p-2.5 rounded-xl transition-all duration-150 flex items-center justify-between cursor-pointer group ${
                      isSelected
                        ? isOrigin
                          ? 'bg-amber-50/90 text-amber-950 font-bold border border-amber-200 shadow-2xs'
                          : 'bg-teal-50/90 text-teal-950 font-bold border border-teal-200 shadow-2xs'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected
                            ? isOrigin
                              ? 'bg-amber-500 text-white'
                              : 'bg-teal-600 text-white'
                            : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                        }`}
                      >
                        {city.category === 'port' ? (
                          <Anchor className="w-3.5 h-3.5" />
                        ) : city.category === 'border' ? (
                          <Globe2 className="w-3.5 h-3.5" />
                        ) : city.category === 'industrial' ? (
                          <Factory className="w-3.5 h-3.5" />
                        ) : (
                          <MapPin className="w-3.5 h-3.5" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900">
                            {city.nameFa}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            ({city.provinceFa})
                          </span>
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-medium mr-auto ${
                              city.category === 'port'
                                ? 'bg-teal-50 text-teal-700 border border-teal-200/60'
                                : city.category === 'border'
                                ? 'bg-purple-50 text-purple-700 border border-purple-200/60'
                                : city.category === 'industrial'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {city.categoryLabelFa}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {city.hubNameFa}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="shrink-0 mr-2">
                        <Check
                          className={`w-4 h-4 ${
                            isOrigin ? 'text-amber-600' : 'text-teal-600'
                          }`}
                        />
                      </div>
                    )}
                  </button>
                );
              })}

              {filteredCities.length === 0 && (
                <div className="p-6 text-center text-xs text-slate-400 space-y-1">
                  <Compass className="w-6 h-6 mx-auto text-slate-300" />
                  <p className="font-bold text-slate-600">شهری با این مشخصات یافت نشد</p>
                  <p className="text-[11px]">می‌توانید نام شهر را دستی تایپ و ثبت کنید.</p>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        onChange(searchQuery.trim());
                        setIsOpen(false);
                      }}
                      className="mt-2 px-3 py-1 bg-amber-500 text-white rounded-lg text-xs font-bold hover:bg-amber-600 cursor-pointer"
                    >
                      ثبت «{searchQuery.trim()}» به عنوان شهر سفارشی
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Quick Popular Cities Footer Chips */}
            <div className="p-2 border-t border-slate-100 bg-slate-50/90 flex items-center justify-between text-[10px]">
              <span className="text-slate-400 font-medium">گزینه‌های سریع:</span>
              <div className="flex items-center gap-1">
                {['تهران', 'بندرعباس', 'اصفهان', 'مشهد', 'تبریز'].map((cityName) => (
                  <button
                    key={cityName}
                    type="button"
                    onClick={() => {
                      onChange(cityName);
                      setIsOpen(false);
                    }}
                    className={`px-2 py-0.5 rounded-md font-bold transition-colors cursor-pointer ${
                      selectedCity.nameFa === cityName
                        ? 'bg-amber-200 text-amber-950 font-black'
                        : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {cityName}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
