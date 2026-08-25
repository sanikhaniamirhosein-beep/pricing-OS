import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Settings,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Truck,
  FileCheck2,
  Receipt,
  UserCheck,
  Volume2,
  Smartphone,
  Mail,
  ShieldAlert,
  Flame,
  RotateCcw,
  Sparkles,
  Info,
  Check,
  Sliders,
  BellRing,
  Layers,
} from 'lucide-react';
import {
  ShipperNotificationPreferences,
  DEFAULT_SHIPPER_NOTIFICATION_PREFERENCES,
} from '../../types/shipperNotifications';

interface ShipperNotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: ShipperNotificationPreferences;
  onSavePreferences: (newPrefs: ShipperNotificationPreferences) => void;
}

export const ShipperNotificationSettingsModal: React.FC<ShipperNotificationSettingsModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSavePreferences,
}) => {
  const [localPrefs, setLocalPrefs] = useState<ShipperNotificationPreferences>(preferences || DEFAULT_SHIPPER_NOTIFICATION_PREFERENCES);
  const [activeCategory, setActiveCategory] = useState<'all' | 'shipment' | 'contract' | 'financial' | 'carrier' | 'channels'>('all');
  const [isSaved, setIsSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Synchronize local state with props when modal opens or preferences change
  useEffect(() => {
    if (isOpen && preferences) {
      setLocalPrefs(preferences);
      setIsSaved(false);
    }
  }, [isOpen, preferences]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleToggle = (key: keyof ShipperNotificationPreferences) => {
    setLocalPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    onSavePreferences(localPrefs);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 400);
  };

  const handleReset = () => {
    setLocalPrefs(DEFAULT_SHIPPER_NOTIFICATION_PREFERENCES);
  };

  const handleEnableAll = () => {
    setLocalPrefs({
      shipmentStatusChange: true,
      shipmentDelays: true,
      shipmentDamage: true,
      contractExpiring: true,
      contractRenewed: true,
      invoiceIssued: true,
      paymentDue: true,
      unusualCost: true,
      driverTruckChange: true,
      carrierBreakdown: true,
      onlyUrgentInHeader: false,
      soundAlerts: true,
      smsAlerts: true,
      emailAlerts: true,
    });
  };

  // Categories count
  const enabledCount = Object.values(localPrefs).filter(Boolean).length;

  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div
          id="shipper-notification-settings-overlay"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity cursor-pointer z-0"
          />

          {/* Modal Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden z-10 font-sans text-slate-800 text-right max-h-[90vh] flex flex-col my-auto"
            dir="rtl"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-l from-sky-50 via-teal-50/40 to-white border-b border-slate-200/80 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-600 to-teal-600 text-white flex items-center justify-center shadow-md shadow-sky-600/20 shrink-0">
                  <BellRing className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-slate-900 font-title">
                      تنظیمات و دسته‌بندی اعلان‌های زنگوله
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold">
                      {enabledCount} رویداد فعال
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    تعیین رویدادهایی که مایلید هشدارهای فوری یا عادی آن‌ها در زنگوله و سامانه به شما نمایش داده شوند.
                  </p>
                </div>
              </div>

              <button
                type="button"
                id="btn-close-notification-settings"
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                title="بستن"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Filter Tabs */}
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-200/70 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none text-xs">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                  activeCategory === 'all'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                همه دسته‌ها
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('shipment')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  activeCategory === 'shipment'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>محموله و حمل</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('contract')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  activeCategory === 'contract'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>قراردادها</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('financial')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  activeCategory === 'financial'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>مالی و فاکتور</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('carrier')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  activeCategory === 'carrier'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>راننده و ناوگان</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('channels')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  activeCategory === 'channels'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>صدا و کانال‌ها</span>
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1 divide-y divide-slate-100">
              {/* Category 1: Shipment Events */}
              {(activeCategory === 'all' || activeCategory === 'shipment') && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">رویدادهای مربوط به محموله و حمل‌ونقل</h4>
                        <p className="text-[11px] text-slate-400">تغییرات وضعیت بارگیری و تحویل، تأخیرهای زمانی و حوادث بار</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {/* Toggle 1: Status Changes */}
                    <button
                      type="button"
                      id="toggle-shipment-status-change"
                      onClick={() => handleToggle('shipmentStatusChange')}
                      className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                        localPrefs.shipmentStatusChange
                          ? 'bg-sky-50/80 border-sky-300 text-sky-950 shadow-2xs'
                          : 'bg-slate-50/50 border-slate-200/80 text-slate-400 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-800">عادی</span>
                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors ${
                            localPrefs.shipmentStatusChange ? 'bg-sky-600 text-white' : 'border border-slate-300 bg-white'
                          }`}
                        >
                          {localPrefs.shipmentStatusChange && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                      <span className="text-xs font-bold block text-slate-800">تغییر وضعیت محموله</span>
                      <span className="text-[10px] text-slate-500 mt-1 block">بارگیری شد، در مسیر، تحویل داده شد</span>
                    </button>

                    {/* Toggle 2: Delays */}
                    <button
                      type="button"
                      id="toggle-shipment-delays"
                      onClick={() => handleToggle('shipmentDelays')}
                      className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                        localPrefs.shipmentDelays
                          ? 'bg-amber-50/80 border-amber-300 text-amber-950 shadow-2xs'
                          : 'bg-slate-50/50 border-slate-200/80 text-slate-400 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 flex items-center gap-1">
                          <Flame className="w-3 h-3 text-rose-600" />
                          فوری
                        </span>
                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors ${
                            localPrefs.shipmentDelays ? 'bg-amber-600 text-white' : 'border border-slate-300 bg-white'
                          }`}
                        >
                          {localPrefs.shipmentDelays && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                      <span className="text-xs font-bold block text-slate-800">تأخیر در تحویل محموله</span>
                      <span className="text-[10px] text-slate-500 mt-1 block">تأخیر نسبت به زمان برنامه‌ریزی‌شده</span>
                    </button>

                    {/* Toggle 3: Damage & Issues */}
                    <button
                      type="button"
                      id="toggle-shipment-damage"
                      onClick={() => handleToggle('shipmentDamage')}
                      className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                        localPrefs.shipmentDamage
                          ? 'bg-rose-50/80 border-rose-300 text-rose-950 shadow-2xs'
                          : 'bg-slate-50/50 border-slate-200/80 text-slate-400 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3 text-rose-600" />
                          بسیار فوری
                        </span>
                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors ${
                            localPrefs.shipmentDamage ? 'bg-rose-600 text-white' : 'border border-slate-300 bg-white'
                          }`}
                        >
                          {localPrefs.shipmentDamage && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                      <span className="text-xs font-bold block text-slate-800">مشکل یا آسیب به بار</span>
                      <span className="text-[10px] text-slate-500 mt-1 block">نقض پلمپ، خیس‌خوردگی یا صدمه بارگیر</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Category 2: Contract Events */}
              {(activeCategory === 'all' || activeCategory === 'contract') && (
                <div className="pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center shrink-0">
                        <FileCheck2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">رویدادهای مربوط به قراردادها و توافقات</h4>
                        <p className="text-[11px] text-slate-400">انقضای قراردادهای حمل، سررسید تمدید و تغییرات تعرفه</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Contract Expiring */}
                    <button
                      type="button"
                      id="toggle-contract-expiring"
                      onClick={() => handleToggle('contractExpiring')}
                      className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                        localPrefs.contractExpiring
                          ? 'bg-purple-50/80 border-purple-300 text-purple-950 shadow-2xs'
                          : 'bg-slate-50/50 border-slate-200/80 text-slate-400 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">اولویت بالا</span>
                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors ${
                            localPrefs.contractExpiring ? 'bg-purple-600 text-white' : 'border border-slate-300 bg-white'
                          }`}
                        >
                          {localPrefs.contractExpiring && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                      <span className="text-xs font-bold block text-slate-800">نزدیک شدن به انقضای قرارداد</span>
                      <span className="text-[10px] text-slate-500 mt-1 block">هشدار ۱۰ و ۳ روز مانده به سررسید اعتبار سالانه</span>
                    </button>

                    {/* Contract Renewed */}
                    <button
                      type="button"
                      id="toggle-contract-renewed"
                      onClick={() => handleToggle('contractRenewed')}
                      className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                        localPrefs.contractRenewed
                          ? 'bg-teal-50/80 border-teal-300 text-teal-950 shadow-2xs'
                          : 'bg-slate-50/50 border-slate-200/80 text-slate-400 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-100 text-teal-800">اطلاع‌رسانی</span>
                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors ${
                            localPrefs.contractRenewed ? 'bg-teal-600 text-white' : 'border border-slate-300 bg-white'
                          }`}
                        >
                          {localPrefs.contractRenewed && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                      <span className="text-xs font-bold block text-slate-800">تمدید، تغییر یا الحاقیه قرارداد</span>
                      <span className="text-[10px] text-slate-500 mt-1 block">ثبت الحاقیه جدید، تغییر تعرفه یا فسخ قرارداد</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Category 3: Financial & Invoice Events */}
              {(activeCategory === 'all' || activeCategory === 'financial') && (
                <div className="pt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                      <Receipt className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">رویدادهای مالی، فاکتورها و تسویه</h4>
                      <p className="text-[11px] text-slate-400">فاکتورهای رسمی، سررسید تسویه و مغایرت‌های هزینه‌ای</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {/* Invoice Issued */}
                    <button
                      type="button"
                      id="toggle-invoice-issued"
                      onClick={() => handleToggle('invoiceIssued')}
                      className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                        localPrefs.invoiceIssued
                          ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 shadow-2xs'
                          : 'bg-slate-50/50 border-slate-200/80 text-slate-400 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">عادی</span>
                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors ${
                            localPrefs.invoiceIssued ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                          }`}
                        >
                          {localPrefs.invoiceIssued && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                      <span className="text-xs font-bold block text-slate-800">صدور فاکتور جدید</span>
                      <span className="text-[10px] text-slate-500 mt-1 block">فاکتور رسمی الکترونیکی سامانه مودیان</span>
                    </button>

                    {/* Payment Due */}
                    <button
                      type="button"
                      id="toggle-payment-due"
                      onClick={() => handleToggle('paymentDue')}
                      className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                        localPrefs.paymentDue
                          ? 'bg-amber-50/80 border-amber-300 text-amber-950 shadow-2xs'
                          : 'bg-slate-50/50 border-slate-200/80 text-slate-400 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">سررسید</span>
                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors ${
                            localPrefs.paymentDue ? 'bg-amber-600 text-white' : 'border border-slate-300 bg-white'
                          }`}
                        >
                          {localPrefs.paymentDue && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                      <span className="text-xs font-bold block text-slate-800">سررسید پرداخت یا تسویه</span>
                      <span className="text-[10px] text-slate-500 mt-1 block">مهلت پرداخت فاکتور یا وصول حواله بانکی</span>
                    </button>

                    {/* Unusual Cost Increase */}
                    <button
                      type="button"
                      id="toggle-unusual-cost"
                      onClick={() => handleToggle('unusualCost')}
                      className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                        localPrefs.unusualCost
                          ? 'bg-rose-50/80 border-rose-300 text-rose-950 shadow-2xs'
                          : 'bg-slate-50/50 border-slate-200/80 text-slate-400 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">فوری</span>
                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors ${
                            localPrefs.unusualCost ? 'bg-rose-600 text-white' : 'border border-slate-300 bg-white'
                          }`}
                        >
                          {localPrefs.unusualCost && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                      <span className="text-xs font-bold block text-slate-800">افزایش هزینه غیرمعمول</span>
                      <span className="text-[10px] text-slate-500 mt-1 block">حق توقف مازاد، عوارض یا انحراف نرخ کرایه</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Category 4: Carrier & Driver Events */}
              {(activeCategory === 'all' || activeCategory === 'carrier') && (
                <div className="pt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">رویدادهای حمل‌کننده و راننده مسئول</h4>
                      <p className="text-[11px] text-slate-400">تغییرات ناوگان، تعویض راننده و گزارش خرابی یا توقف فنی</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Driver/Truck Reassignment */}
                    <button
                      type="button"
                      id="toggle-driver-truck-change"
                      onClick={() => handleToggle('driverTruckChange')}
                      className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                        localPrefs.driverTruckChange
                          ? 'bg-blue-50/80 border-blue-300 text-blue-950 shadow-2xs'
                          : 'bg-slate-50/50 border-slate-200/80 text-slate-400 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">عملیاتی</span>
                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors ${
                            localPrefs.driverTruckChange ? 'bg-blue-600 text-white' : 'border border-slate-300 bg-white'
                          }`}
                        >
                          {localPrefs.driverTruckChange && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                      <span className="text-xs font-bold block text-slate-800">تغییر راننده یا وسیله نقلیه</span>
                      <span className="text-[10px] text-slate-500 mt-1 block">تغییر مشخصات راننده بارنامه یا پلاک کشنده</span>
                    </button>

                    {/* Carrier Technical Breakdown */}
                    <button
                      type="button"
                      id="toggle-carrier-breakdown"
                      onClick={() => handleToggle('carrierBreakdown')}
                      className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                        localPrefs.carrierBreakdown
                          ? 'bg-amber-50/80 border-amber-300 text-amber-950 shadow-2xs'
                          : 'bg-slate-50/50 border-slate-200/80 text-slate-400 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">هشدار فنی</span>
                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors ${
                            localPrefs.carrierBreakdown ? 'bg-amber-600 text-white' : 'border border-slate-300 bg-white'
                          }`}
                        >
                          {localPrefs.carrierBreakdown && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                      <span className="text-xs font-bold block text-slate-800">مشکل فنی یا توقف اضطراری ناوگان</span>
                      <span className="text-[10px] text-slate-500 mt-1 block">گزارش خرابی قطعات، پنچری یا توقف امدادی در جاده</span>
                    </button>
                  </div>
                </div>
              )}

              {/* General Preferences & Channels */}
              {(activeCategory === 'all' || activeCategory === 'channels') && (
                <div className="pt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center shrink-0">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">تنظیمات اولویت سربرگ و کانال‌های اطلاع‌رسانی</h4>
                      <p className="text-[11px] text-slate-400">شمارنده نشان‌ها، هشدارهای صوتی و پیامکی</p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <label className="flex items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200/80 cursor-pointer hover:border-sky-300 transition-colors">
                      <span className="text-slate-800 font-medium">فقط موارد فوری در نشان زنگوله شمرده شوند</span>
                      <input
                        type="checkbox"
                        checked={localPrefs.onlyUrgentInHeader}
                        onChange={() => handleToggle('onlyUrgentInHeader')}
                        className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer accent-sky-600"
                      />
                    </label>

                    <label className="flex items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200/80 cursor-pointer hover:border-sky-300 transition-colors">
                      <span className="text-slate-800 font-medium">پخش صدای هشدار هنگام دریافت اعلان جدید</span>
                      <input
                        type="checkbox"
                        checked={localPrefs.soundAlerts}
                        onChange={() => handleToggle('soundAlerts')}
                        className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer accent-sky-600"
                      />
                    </label>

                    <label className="flex items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200/80 cursor-pointer hover:border-sky-300 transition-colors">
                      <span className="text-slate-800 font-medium">ارسال پیامک (SMS) برای رویدادهای فوری</span>
                      <input
                        type="checkbox"
                        checked={localPrefs.smsAlerts}
                        onChange={() => handleToggle('smsAlerts')}
                        className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer accent-sky-600"
                      />
                    </label>

                    <label className="flex items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200/80 cursor-pointer hover:border-sky-300 transition-colors">
                      <span className="text-slate-800 font-medium">ارسال خلاصه وضعیت روزانه به ایمیل</span>
                      <input
                        type="checkbox"
                        checked={localPrefs.emailAlerts}
                        onChange={() => handleToggle('emailAlerts')}
                        className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer accent-sky-600"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="btn-reset-notification-settings"
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
                  title="بازگردانی تمام گزینه‌ها به حالت پیش‌فرض"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">بازنشانی به پیش‌فرض</span>
                  <span className="sm:hidden">بازنشانی</span>
                </button>

                <button
                  type="button"
                  id="btn-enable-all-notifications"
                  onClick={handleEnableAll}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-sky-700 hover:bg-sky-50 rounded-xl transition-colors cursor-pointer"
                  title="فعال‌سازی دریافت کلیه رویدادها"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>فعال‌سازی همه</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="btn-cancel-notification-settings"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
                >
                  انصراف
                </button>

                <button
                  type="button"
                  id="btn-save-notification-settings"
                  onClick={handleSave}
                  className={`flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl text-white shadow-md transition-all cursor-pointer ${
                    isSaved ? 'bg-emerald-600 shadow-emerald-600/20' : 'bg-sky-600 hover:bg-sky-700 shadow-sky-600/20'
                  }`}
                >
                  {isSaved ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>ذخیره شد</span>
                    </>
                  ) : (
                    <span>ذخیره تغییرات</span>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

