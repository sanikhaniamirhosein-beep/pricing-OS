import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Settings,
  X,
  CheckCircle2,
  Truck,
  FileText,
  DollarSign,
  TrendingDown,
  ShieldCheck,
  Bell,
  Volume2,
  Mail,
  Smartphone,
  Save,
  RotateCcw,
} from 'lucide-react';
import {
  CarrierNotificationPreferences,
  DEFAULT_CARRIER_NOTIFICATION_PREFERENCES,
} from '../../types/carrierNotifications';

interface CarrierNotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: CarrierNotificationPreferences;
  onSavePreferences: (prefs: CarrierNotificationPreferences) => void;
}

export const CarrierNotificationSettingsModal: React.FC<CarrierNotificationSettingsModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSavePreferences,
}) => {
  const [formData, setFormData] = useState<CarrierNotificationPreferences>(preferences);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(preferences);
      setSavedSuccess(false);
    }
  }, [isOpen, preferences]);

  if (!isOpen) return null;

  const handleToggle = (key: keyof CarrierNotificationPreferences) => {
    setFormData((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    onSavePreferences(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const handleResetToDefault = () => {
    setFormData(DEFAULT_CARRIER_NOTIFICATION_PREFERENCES);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white border border-slate-300 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 text-amber-400 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-100 font-display">
                تنظیمات هشدارهای مدیریت سازمان حمل‌ونقل
              </h3>
              <p className="text-xs text-slate-400">
                پیکربندی نوع هشدارهای عملیاتی، مدارک ناوگان، قراردادها و ناهنجاری‌های مالی
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Section 1: Fleet & Operations */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-200 pb-2">
              <Truck className="w-4 h-4 text-indigo-600" />
              <span>۱. هشدارهای عملیاتی و ناوگان</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.vehicleBreakdownAlerts}
                  onChange={() => handleToggle('vehicleBreakdownAlerts')}
                  className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <div>
                  <span className="font-bold text-slate-900 block">خرابی و نیاز به سرویس دوره‌ای</span>
                  <span className="text-[11px] text-slate-500">
                    اعلان نقص فنی در مسیر یا فرا رسیدن موعد سرویس روغن و لنت
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.vehicleDocExpiryAlerts}
                  onChange={() => handleToggle('vehicleDocExpiryAlerts')}
                  className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <div>
                  <span className="font-bold text-slate-900 block">انقضای بیمه و معاینه فنی ناوگان</span>
                  <span className="text-[11px] text-slate-500">
                    هشدار پیش از اتمام اعتبار بیمه شخص ثالث، بدنه و مجوزها
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.driverDocExpiryAlerts}
                  onChange={() => handleToggle('driverDocExpiryAlerts')}
                  className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <div>
                  <span className="font-bold text-slate-900 block">انقضای مدارک و گواهینامه راننده</span>
                  <span className="text-[11px] text-slate-500">
                    پایان اعتبار کارت سلامت، کارت هوشمند و گواهینامه پایه یک
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.unassignedShipmentAlerts}
                  onChange={() => handleToggle('unassignedShipmentAlerts')}
                  className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <div>
                  <span className="font-bold text-slate-900 block">محموله‌های معلق و فاقد راننده</span>
                  <span className="text-[11px] text-slate-500">
                    هشدار نزدیک شدن به زمان بارگیری بدون تخصیص قطعی خودرو
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Section 2: Contracts */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-200 pb-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>۲. قراردادها و توافق‌نامه‌های تجاری</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.contractExpiryAlerts}
                  onChange={() => handleToggle('contractExpiryAlerts')}
                  className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <div>
                  <span className="font-bold text-slate-900 block">نزدیک شدن به انقضای قرارداد</span>
                  <span className="text-[11px] text-slate-500">
                    هشدار ۳۰ و ۱۵ روز قبل از پایان قرارداد با شرکت‌های طرف حساب
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.contractRenewalAlerts}
                  onChange={() => handleToggle('contractRenewalAlerts')}
                  className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <div>
                  <span className="font-bold text-slate-900 block">تصمیم‌گیری و مذاکره تمدید</span>
                  <span className="text-[11px] text-slate-500">
                    قراردادهای نیازمند بازنگری شاخص تعرفه یا توافق الحاقیه
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Section 3: Financials */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-200 pb-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>۳. مالی، هزینه و تسویه‌حساب</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <label className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.unusualCostAlerts}
                  onChange={() => handleToggle('unusualCostAlerts')}
                  className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <div>
                  <span className="font-bold text-slate-900 block">افزایش غیرعادی هزینه</span>
                  <span className="text-[11px] text-slate-500">
                    انحراف سوخت، تعمیرات یا عوارض از میانگین دوره‌ای
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.driverPaymentDueAlerts}
                  onChange={() => handleToggle('driverPaymentDueAlerts')}
                  className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <div>
                  <span className="font-bold text-slate-900 block">سررسید پرداخت و کمیسیون</span>
                  <span className="text-[11px] text-slate-500">
                    موعد تسویه حق‌الزحمه رانندگان یا پایانه باربری
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.penaltyAlerts}
                  onChange={() => handleToggle('penaltyAlerts')}
                  className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <div>
                  <span className="font-bold text-slate-900 block">جریمه‌های ثبت‌شده</span>
                  <span className="text-[11px] text-slate-500">
                    جریمه اضافه تناژ، سرعت، پلیس‌راه یا تاخیر تحویل
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Section 4: Performance & Quality */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-200 pb-2">
              <TrendingDown className="w-4 h-4 text-purple-600" />
              <span>۴. عملکرد و کیفیت خدمات</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.performanceDropAlerts}
                  onChange={() => handleToggle('performanceDropAlerts')}
                  className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <div>
                  <span className="font-bold text-slate-900 block">افت عملکرد و شکایات مشتری</span>
                  <span className="text-[11px] text-slate-500">
                    کاهش امتیاز SLA رانندگان یا افزایش تاخیرات پیمانکار
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.failedDeliveryAlerts}
                  onChange={() => handleToggle('failedDeliveryAlerts')}
                  className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <div>
                  <span className="font-bold text-slate-900 block">تحویل‌های ناموفق و خسارت بار</span>
                  <span className="text-[11px] text-slate-500">
                    مغایرت دمای سردخانه، عدم تحویل یا آسیب محموله
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Section 5: System & Approvals */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-200 pb-2">
              <ShieldCheck className="w-4 h-4 text-slate-700" />
              <span>۵. سیستمی، اداری و تاییدات</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.pendingApprovalsAlerts}
                  onChange={() => handleToggle('pendingApprovalsAlerts')}
                  className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <div>
                  <span className="font-bold text-slate-900 block">درخواست‌های در انتظار تایید</span>
                  <span className="text-[11px] text-slate-500">
                    کارتابل حاکمیتی دوطرفه، تاییدیه هزینه‌های کلان و قراردادها
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.periodicReportsAlerts}
                  onChange={() => handleToggle('periodicReportsAlerts')}
                  className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <div>
                  <span className="font-bold text-slate-900 block">آماده شدن گزارش‌های دوره‌ای</span>
                  <span className="text-[11px] text-slate-500">
                    تولید خودکار گزارش هفتگی و ماهانه سودآوری و مصرف سوخت
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Channels & Sound */}
          <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 space-y-3">
            <h5 className="font-bold text-slate-900 text-xs">کانال‌های دریافت اعلان:</h5>
            <div className="flex items-center gap-6 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.soundEnabled}
                  onChange={() => handleToggle('soundEnabled')}
                  className="rounded text-amber-600 w-4 h-4"
                />
                <Volume2 className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-slate-700 font-medium">پخش صدای هشدار در سیستم</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.smsUrgentEnabled}
                  onChange={() => handleToggle('smsUrgentEnabled')}
                  className="rounded text-amber-600 w-4 h-4"
                />
                <Smartphone className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-slate-700 font-medium">ارسال پیامک برای موارد بحرانی</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.emailDigestEnabled}
                  onChange={() => handleToggle('emailDigestEnabled')}
                  className="rounded text-amber-600 w-4 h-4"
                />
                <Mail className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-slate-700 font-medium">ارسال خلاصه ایمیلی روزانه</span>
              </label>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-3 py-2 text-slate-600 hover:text-slate-900 text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-slate-200 rounded-xl transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>بازنشانی به پیش‌فرض</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition-colors cursor-pointer"
            >
              انصراف
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>تنظیمات ذخیره شد</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>ذخیره تنظیمات</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
