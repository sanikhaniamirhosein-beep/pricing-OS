import React, { useState } from 'react';
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
  const [localPrefs, setLocalPrefs] = useState<ShipperNotificationPreferences>(preferences);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden z-10 font-sans text-slate-800 text-right max-h-[90vh] flex flex-col"
          dir="rtl"
        >
          {/* Header */}
          <div className="p-5 bg-gradient-to-l from-sky-50 via-teal-50/40 to-white border-b border-slate-200/80 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-600/20 shrink-0">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-title flex items-center gap-2">
                  <span>تنظیمات و دسته‌بندی اعلان‌های صاحب بار</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold">
                    سفارشی‌سازی زنگوله
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  انتخاب کنید چه رویدادهایی با اولویت فوری یا عادی در زنگوله و پنل به شما نمایش داده شوند.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="p-5 overflow-y-auto space-y-5 flex-1 divide-y divide-slate-100">
            {/* Category 1: Shipment Events */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">رویدادهای مربوط به محموله و ناوگان</h4>
                    <p className="text-[11px] text-slate-400">تغییرات وضعیت حمل، تأخیرهای زمانی و حوادث بار</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Toggle 1: Status Changes */}
                <button
                  type="button"
                  onClick={() => handleToggle('shipmentStatusChange')}
                  className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                    localPrefs.shipmentStatusChange
                      ? 'bg-sky-50/70 border-sky-300 text-sky-950 shadow-2xs'
                      : 'bg-slate-50/50 border-slate-200/80 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-800">عادی</span>
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center ${localPrefs.shipmentStatusChange ? 'bg-sky-600 text-white' : 'border border-slate-300'}`}>
                      {localPrefs.shipmentStatusChange && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                  <span className="text-xs font-bold block">تغییر وضعیت محموله</span>
                  <span className="text-[10px] text-slate-500 mt-1 block">بارگیری شد، در مسیر، تحویل داده شد</span>
                </button>

                {/* Toggle 2: Delays */}
                <button
                  type="button"
                  onClick={() => handleToggle('shipmentDelays')}
                  className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                    localPrefs.shipmentDelays
                      ? 'bg-amber-50/70 border-amber-300 text-amber-950 shadow-2xs'
                      : 'bg-slate-50/50 border-slate-200/80 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-rose-600" />
                      فوری
                    </span>
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center ${localPrefs.shipmentDelays ? 'bg-amber-600 text-white' : 'border border-slate-300'}`}>
                      {localPrefs.shipmentDelays && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                  <span className="text-xs font-bold block">تأخیر در تحویل محموله</span>
                  <span className="text-[10px] text-slate-500 mt-1 block">تأخیر نسبت به زمان برنامه‌ریزی‌شده</span>
                </button>

                {/* Toggle 3: Damage & Issues */}
                <button
                  type="button"
                  onClick={() => handleToggle('shipmentDamage')}
                  className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                    localPrefs.shipmentDamage
                      ? 'bg-rose-50/70 border-rose-300 text-rose-950 shadow-2xs'
                      : 'bg-slate-50/50 border-slate-200/80 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 text-rose-600" />
                      بسیار فوری
                    </span>
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center ${localPrefs.shipmentDamage ? 'bg-rose-600 text-white' : 'border border-slate-300'}`}>
                      {localPrefs.shipmentDamage && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                  <span className="text-xs font-bold block">مشکل یا آسیب به بار</span>
                  <span className="text-[10px] text-slate-500 mt-1 block">نقض پلمپ، خیس‌خوردگی یا صدمه بارگیر</span>
                </button>
              </div>
            </div>

            {/* Category 2: Contract Events */}
            <div className="pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">رویدادهای مربوط به قراردادها و SLA</h4>
                    <p className="text-[11px] text-slate-400">انقضای قراردادهای سالانه و ارتقای پله‌های تخفیف</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Contract Expiring */}
                <button
                  type="button"
                  onClick={() => handleToggle('contractExpiring')}
                  className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                    localPrefs.contractExpiring
                      ? 'bg-purple-50/70 border-purple-300 text-purple-950 shadow-2xs'
                      : 'bg-slate-50/50 border-slate-200/80 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">اولویت بالا</span>
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center ${localPrefs.contractExpiring ? 'bg-purple-600 text-white' : 'border border-slate-300'}`}>
                      {localPrefs.contractExpiring && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                  <span className="text-xs font-bold block">نزدیک شدن به انقضای قرارداد</span>
                  <span className="text-[10px] text-slate-500 mt-1 block">هشدار ۱۰ و ۳ روز مانده به سررسید اعتبار سالانه</span>
                </button>

                {/* Contract Renewed */}
                <button
                  type="button"
                  onClick={() => handleToggle('contractRenewed')}
                  className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                    localPrefs.contractRenewed
                      ? 'bg-teal-50/70 border-teal-300 text-teal-950 shadow-2xs'
                      : 'bg-slate-50/50 border-slate-200/80 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-100 text-teal-800">اطلاع‌رسانی</span>
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center ${localPrefs.contractRenewed ? 'bg-teal-600 text-white' : 'border border-slate-300'}`}>
                      {localPrefs.contractRenewed && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                  <span className="text-xs font-bold block">تمدید یا فسخ قرارداد / الحاقیه</span>
                  <span className="text-[10px] text-slate-500 mt-1 block">ثبت الحاقیه جدید، تغییر تعرفه یا فسخ</span>
                </button>
              </div>
            </div>

            {/* Category 3: Financial & Invoice Events */}
            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">رویدادهای مالی و صورتحساب‌ها</h4>
                  <p className="text-[11px] text-slate-400">فاکتورهای رسمی، سررسید تسویه و مغایرت‌های هزینه‌ای</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Invoice Issued */}
                <button
                  type="button"
                  onClick={() => handleToggle('invoiceIssued')}
                  className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                    localPrefs.invoiceIssued
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 shadow-2xs'
                      : 'bg-slate-50/50 border-slate-200/80 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">عادی</span>
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center ${localPrefs.invoiceIssued ? 'bg-emerald-600 text-white' : 'border border-slate-300'}`}>
                      {localPrefs.invoiceIssued && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                  <span className="text-xs font-bold block">صدور فاکتور جدید</span>
                  <span className="text-[10px] text-slate-500 mt-1 block">فاکتور رسمی الکترونیکی سامانه مودیان</span>
                </button>

                {/* Payment Due */}
                <button
                  type="button"
                  onClick={() => handleToggle('paymentDue')}
                  className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                    localPrefs.paymentDue
                      ? 'bg-amber-50/70 border-amber-300 text-amber-950 shadow-2xs'
                      : 'bg-slate-50/50 border-slate-200/80 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">سررسید</span>
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center ${localPrefs.paymentDue ? 'bg-amber-600 text-white' : 'border border-slate-300'}`}>
                      {localPrefs.paymentDue && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                  <span className="text-xs font-bold block">سررسید پرداخت یا تسویه</span>
                  <span className="text-[10px] text-slate-500 mt-1 block">مهلت پرداخت فاکتور یا وصول حواله</span>
                </button>

                {/* Unusual Cost Increase */}
                <button
                  type="button"
                  onClick={() => handleToggle('unusualCost')}
                  className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                    localPrefs.unusualCost
                      ? 'bg-rose-50/70 border-rose-300 text-rose-950 shadow-2xs'
                      : 'bg-slate-50/50 border-slate-200/80 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">فوری</span>
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center ${localPrefs.unusualCost ? 'bg-rose-600 text-white' : 'border border-slate-300'}`}>
                      {localPrefs.unusualCost && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                  <span className="text-xs font-bold block">افزایش هزینه غیرمعمول</span>
                  <span className="text-[10px] text-slate-500 mt-1 block">حق توقف مازاد، عوارض یا انحراف نرخ</span>
                </button>
              </div>
            </div>

            {/* Category 4: Carrier & Driver Events */}
            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">رویدادهای حمل‌کننده و راننده مسئول</h4>
                  <p className="text-[11px] text-slate-400">تغییرات ناوگان اختصاصی، راننده جدید و گزارش خرابی فنی</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Driver/Truck Reassignment */}
                <button
                  type="button"
                  onClick={() => handleToggle('driverTruckChange')}
                  className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                    localPrefs.driverTruckChange
                      ? 'bg-blue-50/70 border-blue-300 text-blue-950 shadow-2xs'
                      : 'bg-slate-50/50 border-slate-200/80 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">عملیاتی</span>
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center ${localPrefs.driverTruckChange ? 'bg-blue-600 text-white' : 'border border-slate-300'}`}>
                      {localPrefs.driverTruckChange && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                  <span className="text-xs font-bold block">تغییر راننده یا وسیله نقلیه</span>
                  <span className="text-[10px] text-slate-500 mt-1 block">تغییر مشخصات راننده یا پلاک کشنده</span>
                </button>

                {/* Carrier Technical Breakdown */}
                <button
                  type="button"
                  onClick={() => handleToggle('carrierBreakdown')}
                  className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                    localPrefs.carrierBreakdown
                      ? 'bg-amber-50/70 border-amber-300 text-amber-950 shadow-2xs'
                      : 'bg-slate-50/50 border-slate-200/80 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">هشدار فنی</span>
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center ${localPrefs.carrierBreakdown ? 'bg-amber-600 text-white' : 'border border-slate-300'}`}>
                      {localPrefs.carrierBreakdown && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                  <span className="text-xs font-bold block">مشکل فنی یا نقص جاده‌ای ناوگان</span>
                  <span className="text-[10px] text-slate-500 mt-1 block">گزارش خرابی قطعات، پنچری یا امداد جاده‌ای</span>
                </button>
              </div>
            </div>

            {/* General Preferences & Channels */}
            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center">
                  <Volume2 className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-800">تنظیمات اولویت و کانال‌های اطلاع‌رسانی</h4>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label className="flex items-center justify-between gap-2 cursor-pointer">
                  <span className="text-slate-700">فقط اعلانات فوری در زنگوله شمارش شوند</span>
                  <input
                    type="checkbox"
                    checked={localPrefs.onlyUrgentInHeader}
                    onChange={() => handleToggle('onlyUrgentInHeader')}
                    className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between gap-2 cursor-pointer">
                  <span className="text-slate-700">پخش صدای نوتیفیکیشن در هنگام دریافت</span>
                  <input
                    type="checkbox"
                    checked={localPrefs.soundAlerts}
                    onChange={() => handleToggle('soundAlerts')}
                    className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between gap-2 cursor-pointer">
                  <span className="text-slate-700">ارسال پیامک (SMS) برای موارد اضطراری</span>
                  <input
                    type="checkbox"
                    checked={localPrefs.smsAlerts}
                    onChange={() => handleToggle('smsAlerts')}
                    className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between gap-2 cursor-pointer">
                  <span className="text-slate-700">ارسال گزارش روزانه به ایمیل</span>
                  <input
                    type="checkbox"
                    checked={localPrefs.emailAlerts}
                    onChange={() => handleToggle('emailAlerts')}
                    className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>بازنشانی به حالت اولیه</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
              >
                انصراف
              </button>

              <button
                type="button"
                onClick={handleSave}
                className={`flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl text-white shadow-md transition-all cursor-pointer ${
                  isSaved ? 'bg-emerald-600 shadow-emerald-600/20' : 'bg-sky-600 hover:bg-sky-700 shadow-sky-600/20'
                }`}
              >
                {isSaved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تنظیمات ذخیره شد</span>
                  </>
                ) : (
                  <span>ذخیره تغییرات</span>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
