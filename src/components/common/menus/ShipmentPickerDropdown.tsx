import React, { useState, useRef, useEffect } from 'react';
import {
  Truck,
  ChevronDown,
  Search,
  Check,
  MapPin,
  FileText,
  Clock,
  CheckCircle2,
  Navigation,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ShipperActiveLoad } from '../../../data/mockShipperData';
import { IranLicensePlate } from '../IranLicensePlate';

interface ShipmentPickerDropdownProps {
  id?: string;
  loads: ShipperActiveLoad[];
  selectedLoadId?: string;
  onSelect: (load: ShipperActiveLoad) => void;
  label?: string;
  className?: string;
  variant?: 'light' | 'white';
}

export const ShipmentPickerDropdown: React.FC<ShipmentPickerDropdownProps> = ({
  id = 'shipment-picker-dropdown',
  loads = [],
  selectedLoadId,
  onSelect,
  label,
  className = '',
  variant = 'white',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedLoad = loads.find((l) => l.id === selectedLoadId) || loads[0];

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

  const filteredLoads = loads.filter((load) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (load.billOfLadingNo || '').toLowerCase().includes(q) ||
      (load.trackingCode || '').toLowerCase().includes(q) ||
      (load.originCity || '').toLowerCase().includes(q) ||
      (load.destCity || '').toLowerCase().includes(q) ||
      (load.driverName || '').toLowerCase().includes(q) ||
      (load.cargoType || '').toLowerCase().includes(q) ||
      (load.truckPlate || '').toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status: ShipperActiveLoad['status']) => {
    switch (status) {
      case 'in_transit':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            در مسیر حمل
          </span>
        );
      case 'loading':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold">
            <Clock className="w-2.5 h-2.5 text-blue-600" />
            بارگیری مبدأ
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
            تحویل شد
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold">
            در صف اعزام
          </span>
        );
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef} id={id}>
      {label && (
        <label className="block text-slate-700 font-bold text-xs mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-amber-600" />
            <span>{label}</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">({loads.length} بارنامه فعال)</span>
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        id={`${id}-trigger`}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-2.5 sm:p-3 rounded-2xl border text-right transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 shadow-2xs group ${
          isOpen
            ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-500/20 shadow-xs'
            : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-transform">
            <Truck className="w-4 h-4" />
          </div>
          {selectedLoad ? (
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono font-bold text-slate-900 text-xs">
                  {selectedLoad.billOfLadingNo}
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-800 text-xs font-bold flex items-center gap-1">
                  <span>{selectedLoad.originCity}</span>
                  <span className="text-slate-400 text-[10px]">➔</span>
                  <span>{selectedLoad.destCity}</span>
                </span>
                {getStatusBadge(selectedLoad.status)}
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5 truncate">
                <span>{selectedLoad.cargoType}</span>
                <span className="text-slate-300">•</span>
                <span className="font-mono text-slate-600">{selectedLoad.weightTons} تن</span>
                <span className="text-slate-300">•</span>
                <span>راننده: {selectedLoad.driverName}</span>
              </div>
            </div>
          ) : (
            <span className="text-xs text-slate-400">یک محموله را انتخاب کنید...</span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-amber-100/70 text-slate-600 group-hover:text-amber-800 flex items-center justify-center transition-colors">
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-amber-600' : ''}`}
            />
          </div>
        </div>
      </button>

      {/* Floating Animated Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="absolute z-50 right-0 left-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden min-w-[320px] max-w-full"
          >
            {/* Search and Header in Dropdown */}
            <div className="p-3 bg-slate-50/90 border-b border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>انتخاب محموله جهت پیگیری و اسناد</span>
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {filteredLoads.length} از {loads.length}
                </span>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="جستجو با شماره بارنامه، راننده، شهر یا کالا..."
                  className="w-full bg-white border border-slate-200 rounded-xl pr-8 pl-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
                />
              </div>
            </div>

            {/* List of Shipments */}
            <div className="max-h-72 overflow-y-auto p-1.5 space-y-1 divide-y divide-slate-100">
              {filteredLoads.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  هیچ بارنامه‌ای با این مشخصات یافت نشد.
                </div>
              ) : (
                filteredLoads.map((load) => {
                  const isSelected = selectedLoad?.id === load.id;
                  return (
                    <button
                      key={load.id}
                      type="button"
                      onClick={() => {
                        onSelect(load);
                        setIsOpen(false);
                      }}
                      className={`w-full text-right p-3 rounded-xl text-xs transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-amber-50/90 text-amber-950 border border-amber-300/80 font-bold shadow-2xs'
                          : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-transparent'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0 flex-1">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold shrink-0 mt-0.5 ${
                            isSelected
                              ? 'bg-amber-500 text-white'
                              : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                          }`}
                        >
                          <Truck className="w-4 h-4" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-slate-900">
                              {load.billOfLadingNo}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400">
                              ({load.trackingCode})
                            </span>
                            {getStatusBadge(load.status)}
                          </div>

                          <div className="text-slate-800 font-bold text-xs flex items-center gap-1.5 mt-1">
                            <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                            <span>{load.originCity}</span>
                            <span className="text-slate-400">➔</span>
                            <span>{load.destCity}</span>
                            <span className="text-[11px] text-slate-500 font-normal truncate">
                              ({load.destHub})
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-1 flex-wrap">
                            <span>{load.cargoType} ({load.weightTons} تن)</span>
                            <span className="text-slate-300">•</span>
                            <span>راننده: <strong className="text-slate-700">{load.driverName}</strong></span>
                            <span className="text-slate-300">•</span>
                            <IranLicensePlate plateString={load.truckPlate} size="xs" />
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
