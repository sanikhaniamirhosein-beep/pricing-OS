import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  Truck,
  FileCheck2,
  Receipt,
  UserCheck,
  Flame,
  ShieldAlert,
  AlertTriangle,
  Clock,
  CheckCircle2,
  CheckCheck,
  Settings,
  X,
  ExternalLink,
  ChevronLeft,
  Filter,
  Sparkles,
  DollarSign,
  MapPin,
  FileText,
  Trash2,
  Layers,
  Info,
} from 'lucide-react';
import {
  ShipperNotificationItem,
  NotificationCategory,
  NotificationPriority,
  ShipperNotificationPreferences,
  DEFAULT_SHIPPER_NOTIFICATION_PREFERENCES,
} from '../../types/shipperNotifications';
import { INITIAL_SHIPPER_NOTIFICATIONS } from '../../data/mockShipperNotificationsData';
import { ShipperNotificationSettingsModal } from './ShipperNotificationSettingsModal';

interface ShipperNotificationBellProps {
  onNavigateToRecord: (
    tab: 'shipments' | 'contracts' | 'billing' | 'support' | 'quote' | 'batch_orders',
    recordId?: string,
    recordType?: 'load' | 'invoice' | 'contract' | 'ticket'
  ) => void;
}

export const ShipperNotificationBell: React.FC<ShipperNotificationBellProps> = ({
  onNavigateToRecord,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<ShipperNotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('shipper_live_notifications');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return INITIAL_SHIPPER_NOTIFICATIONS;
  });

  const [preferences, setPreferences] = useState<ShipperNotificationPreferences>(() => {
    try {
      const saved = localStorage.getItem('shipper_notification_preferences');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return DEFAULT_SHIPPER_NOTIFICATION_PREFERENCES;
  });

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [activeFilterCategory, setActiveFilterCategory] = useState<'all' | 'urgent' | NotificationCategory>('all');
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('shipper_live_notifications', JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem('shipper_notification_preferences', JSON.stringify(preferences));
    } catch {
      // ignore
    }
  }, [preferences]);

  // Outside click handler
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Filter notifications according to shipper preferences
  const visibleNotifications = useMemo(() => {
    return notifications.filter((item) => {
      // Category & Specific event preferences filter
      if (item.category === 'shipment') {
        if (item.titleFa.includes('تأخیر') && !preferences.shipmentDelays) return false;
        if ((item.titleFa.includes('آسیب') || item.titleFa.includes('نقص')) && !preferences.shipmentDamage) return false;
        if ((item.titleFa.includes('بارگیری') || item.titleFa.includes('تحویل') || item.titleFa.includes('مسیر')) && !preferences.shipmentStatusChange) return false;
      }
      if (item.category === 'contract') {
        if (item.titleFa.includes('انقضا') && !preferences.contractExpiring) return false;
        if (item.titleFa.includes('تمدید') && !preferences.contractRenewed) return false;
      }
      if (item.category === 'financial') {
        if (item.titleFa.includes('صدور') && !preferences.invoiceIssued) return false;
        if (item.titleFa.includes('سررسید') && !preferences.paymentDue) return false;
        if (item.titleFa.includes('هزینه') && !preferences.unusualCost) return false;
      }
      if (item.category === 'carrier_driver') {
        if (item.titleFa.includes('تغییر راننده') && !preferences.driverTruckChange) return false;
        if (item.titleFa.includes('فنی') && !preferences.carrierBreakdown) return false;
      }

      // Tab filter
      if (activeFilterCategory === 'urgent' && item.priority !== 'urgent') return false;
      if (activeFilterCategory !== 'all' && activeFilterCategory !== 'urgent' && item.category !== activeFilterCategory) return false;

      // Unread only toggle
      if (showOnlyUnread && item.isRead) return false;

      return true;
    });
  }, [notifications, preferences, activeFilterCategory, showOnlyUnread]);

  // Unread badge counters
  const totalUnreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const urgentUnreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead && n.priority === 'urgent').length;
  }, [notifications]);

  const badgeCount = preferences.onlyUrgentInHeader ? urgentUnreadCount : totalUnreadCount;

  // Actions
  const handleMarkAsRead = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleToggleReadStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleDeleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleNotificationClick = (item: ShipperNotificationItem) => {
    handleMarkAsRead(item.id);
    setIsOpen(false);
    onNavigateToRecord(item.targetTab, item.targetRecordId, item.targetRecordType);
  };

  const handleSavePreferences = (newPrefs: ShipperNotificationPreferences) => {
    setPreferences(newPrefs);
  };

  // Helper to simulate a new live alert for testing
  const handleSimulateNewAlert = () => {
    const templates: Array<Omit<ShipperNotificationItem, 'id' | 'timestamp' | 'timestampRelative' | 'isRead'>> = [
      {
        category: 'shipment',
        priority: 'urgent',
        titleFa: 'تأخیر فوری در تحویل بارنامه',
        messageFa: 'سیستم دیسپچینگ هوشمند اعلام کرد که ناوگان حامل میلگرد در ایستگاه پلیس‌راه به دلیل ترافیک دچار تاخیر ۹۰ دقیقه‌ای شده است.',
        targetTab: 'shipments',
        targetRecordId: 'load-101',
        targetRecordType: 'load',
        meta: {
          billOfLadingNo: 'BL-1403-90812',
          truckPlate: '۶۳ ع ۹۲۱ - ایران ۱۳',
          delayMinutes: 90,
          actionLabelFa: 'بررسی وضعیت محموله',
        },
      },
      {
        category: 'financial',
        priority: 'urgent',
        titleFa: 'ثبت مغایرت هزینه حق توقف تخلیه',
        messageFa: 'اعلام صورتحساب اضافه هزینه توقف به مبلغ ۲,۴۰۰,۰۰۰ تومان توسط شرکت باربری برای تایید در کارتابل مالی قرار گرفت.',
        targetTab: 'billing',
        targetRecordId: 'inv-1403-882',
        targetRecordType: 'invoice',
        meta: {
          invoiceNo: 'INV-1403-882',
          amountToman: 2400000,
          actionLabelFa: 'مشاهده فاکتور و تایید مالی',
        },
      },
      {
        category: 'carrier_driver',
        priority: 'urgent',
        titleFa: 'جایگزینی راننده و صدور حواله جدید',
        messageFa: 'راننده جدید آقای علی کاظمی به عنوان راننده اصلی محموله بارنامه BL-1403-88341 تایید گردید.',
        targetTab: 'shipments',
        targetRecordId: 'load-102',
        targetRecordType: 'load',
        meta: {
          billOfLadingNo: 'BL-1403-88341',
          driverName: 'علی کاظمی',
          truckPlate: '۴۸ ج ۷۶۳ - ایران ۵۳',
          actionLabelFa: 'مشاهده جزئیات راننده',
        },
      },
    ];

    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    const newItem: ShipperNotificationItem = {
      ...randomTemplate,
      id: `notif-sim-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      timestampRelative: 'همین الان',
      isRead: false,
    };

    setNotifications((prev) => [newItem, ...prev]);
  };

  // Helper icons and styles by category
  const getCategoryMeta = (cat: NotificationCategory) => {
    switch (cat) {
      case 'shipment':
        return {
          label: 'محموله و بارنامه',
          icon: <Truck className="w-3.5 h-3.5" />,
          colorBg: 'bg-sky-50 text-sky-800 border-sky-200',
        };
      case 'contract':
        return {
          label: 'قرارداد و SLA',
          icon: <FileCheck2 className="w-3.5 h-3.5" />,
          colorBg: 'bg-purple-50 text-purple-800 border-purple-200',
        };
      case 'financial':
        return {
          label: 'مالی و فاکتور',
          icon: <Receipt className="w-3.5 h-3.5" />,
          colorBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
      case 'carrier_driver':
        return {
          label: 'حمل‌کننده و راننده',
          icon: <UserCheck className="w-3.5 h-3.5" />,
          colorBg: 'bg-blue-50 text-blue-800 border-blue-200',
        };
    }
  };

  return (
    <div className="relative font-sans text-right" dir="rtl" ref={containerRef}>
      {/* 1. Header Bell Trigger Button */}
      <button
        type="button"
        id="btn-shipper-header-notifications"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="اعلان‌ها و هشدارهای صاحب بار"
        className={`relative p-2 rounded-xl transition-all duration-150 cursor-pointer border ${
          isOpen
            ? 'bg-sky-50 text-sky-900 border-sky-300 shadow-xs'
            : 'bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border-slate-200 hover:border-slate-300 shadow-2xs'
        }`}
        title="مرکز اعلان‌های هوشمند و هشدارهای محموله‌ها"
      >
        <Bell className="w-4.5 h-4.5" />

        {/* Dynamic Badge */}
        {badgeCount > 0 && (
          <span
            className={`absolute -top-1.5 -left-1.5 min-w-5 h-5 px-1 rounded-full text-[10px] font-bold font-mono flex items-center justify-center text-white shadow-xs ${
              urgentUnreadCount > 0
                ? 'bg-rose-600 animate-pulse ring-2 ring-white'
                : 'bg-sky-600 ring-2 ring-white'
            }`}
          >
            {badgeCount}
          </span>
        )}
      </button>

      {/* 2. Notification Popover Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute left-0 sm:-left-12 mt-2.5 w-[92vw] sm:w-[460px] max-w-[480px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden flex flex-col max-h-[82vh]"
          >
            {/* Popover Header */}
            <div className="p-4 bg-gradient-to-l from-sky-50 via-teal-50/40 to-white border-b border-slate-200/80 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 font-title flex items-center gap-2">
                      <span>مرکز هشدارهای هوشمند صاحب بار</span>
                      {urgentUnreadCount > 0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold flex items-center gap-1 border border-rose-200">
                          <Flame className="w-3 h-3 text-rose-600" />
                          {urgentUnreadCount} مورد فوری
                        </span>
                      )}
                    </h3>
                    <p className="text-[11px] text-slate-500">اطلاع‌رسانی لحظه‌ای وضعیت محموله، قرارداد و مالی</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {/* Settings modal trigger */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setIsSettingsModalOpen(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-sky-700 hover:bg-sky-50 rounded-xl transition-colors cursor-pointer"
                    title="تنظیمات دسته‌بندی اعلان‌ها"
                  >
                    <Settings className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleMarkAllAsRead}
                    disabled={totalUnreadCount === 0}
                    className="text-slate-600 hover:text-sky-700 font-medium disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>خوانده‌شدن همه</span>
                  </button>

                  <span className="text-slate-300">|</span>

                  <button
                    type="button"
                    onClick={() => setShowOnlyUnread(!showOnlyUnread)}
                    className={`font-medium cursor-pointer transition-colors ${
                      showOnlyUnread ? 'text-sky-700 font-bold' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {showOnlyUnread ? 'نمایش همه' : 'فقط خوانده‌نشده'}
                  </button>
                </div>

                {/* Test Simulate Alert */}
                <button
                  type="button"
                  onClick={handleSimulateNewAlert}
                  className="text-slate-500 hover:text-amber-800 text-[10px] font-bold flex items-center gap-1 bg-amber-50 hover:bg-amber-100/80 px-2 py-0.5 rounded-lg border border-amber-200/70 transition-colors cursor-pointer"
                  title="ایجاد شبیه‌سازی اعلان تست"
                >
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>تست اعلان جدید</span>
                </button>
              </div>

              {/* Category Filter Chips */}
              <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
                <button
                  type="button"
                  onClick={() => setActiveFilterCategory('all')}
                  className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeFilterCategory === 'all'
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  همه ({notifications.length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveFilterCategory('urgent')}
                  className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                    activeFilterCategory === 'urgent'
                      ? 'bg-rose-600 text-white shadow-2xs'
                      : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
                  }`}
                >
                  <Flame className="w-3 h-3" />
                  <span>فوری ({notifications.filter((n) => n.priority === 'urgent').length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveFilterCategory('shipment')}
                  className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeFilterCategory === 'shipment'
                      ? 'bg-sky-700 text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  محموله ({notifications.filter((n) => n.category === 'shipment').length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveFilterCategory('financial')}
                  className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeFilterCategory === 'financial'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  مالی ({notifications.filter((n) => n.category === 'financial').length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveFilterCategory('contract')}
                  className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeFilterCategory === 'contract'
                      ? 'bg-purple-700 text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  قرارداد ({notifications.filter((n) => n.category === 'contract').length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveFilterCategory('carrier_driver')}
                  className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeFilterCategory === 'carrier_driver'
                      ? 'bg-blue-700 text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  راننده ({notifications.filter((n) => n.category === 'carrier_driver').length})
                </button>
              </div>
            </div>

            {/* Scrollable Notification List */}
            <div className="overflow-y-auto p-3 space-y-2.5 flex-1 max-h-[56vh] bg-slate-50/50">
              {visibleNotifications.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-600">هیچ اعلانی در این دسته وجود ندارد</p>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                    همه هشدارها را بررسی کرده‌اید یا فیلترهای نمایش غیرفعال شده‌اند.
                  </p>
                </div>
              ) : (
                visibleNotifications.map((item) => {
                  const catMeta = getCategoryMeta(item.category);
                  const isUrgent = item.priority === 'urgent';

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleNotificationClick(item)}
                      className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer group ${
                        !item.isRead
                          ? isUrgent
                            ? 'bg-rose-50/40 hover:bg-rose-50/70 border-rose-200/90 shadow-xs'
                            : 'bg-white hover:bg-sky-50/40 border-sky-200/80 shadow-2xs'
                          : 'bg-white/80 hover:bg-slate-50 border-slate-200/70 text-slate-600 opacity-85'
                      }`}
                    >
                      {/* Unread indicator bar on right */}
                      {!item.isRead && (
                        <div
                          className={`absolute top-3 right-0 bottom-3 w-1 rounded-l-full ${
                            isUrgent ? 'bg-rose-500' : 'bg-sky-500'
                          }`}
                        />
                      )}

                      {/* Header Row of the Card */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-lg font-bold border flex items-center gap-1 ${catMeta.colorBg}`}
                          >
                            {catMeta.icon}
                            <span>{catMeta.label}</span>
                          </span>

                          {isUrgent ? (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-0.5">
                              <Flame className="w-3 h-3 text-rose-600" />
                              فوری
                            </span>
                          ) : (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md font-medium text-slate-400 bg-slate-100">
                              عادی
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span>{item.timestampRelative}</span>

                          {/* Quick dismiss / read toggle */}
                          <button
                            type="button"
                            onClick={(e) => handleToggleReadStatus(item.id, e)}
                            className="p-1 hover:text-sky-700 rounded-md transition-colors"
                            title={item.isRead ? 'خوانده نشده' : 'خوانده شد'}
                          >
                            <CheckCircle2 className={`w-3.5 h-3.5 ${item.isRead ? 'text-slate-300' : 'text-sky-600'}`} />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleDeleteNotification(item.id, e)}
                            className="p-1 hover:text-rose-600 rounded-md transition-colors"
                            title="حذف اعلان"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-slate-300 hover:text-rose-500" />
                          </button>
                        </div>
                      </div>

                      {/* Title & Message */}
                      <div className="mt-1.5">
                        <h4
                          className={`text-xs font-bold ${
                            !item.isRead ? (isUrgent ? 'text-rose-950 font-title' : 'text-slate-900 font-title') : 'text-slate-700'
                          }`}
                        >
                          {item.titleFa}
                        </h4>
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                          {item.messageFa}
                        </p>
                      </div>

                      {/* Metadata Details Pills */}
                      {item.meta && (
                        <div className="mt-2 pt-2 border-t border-slate-100/90 flex flex-wrap items-center gap-1.5 text-[10px]">
                          {item.meta.billOfLadingNo && (
                            <span className="bg-slate-100 px-2 py-0.5 rounded-md font-mono text-slate-700 font-bold">
                              بارنامه: {item.meta.billOfLadingNo}
                            </span>
                          )}

                          {item.meta.truckPlate && (
                            <span className="bg-slate-100 px-2 py-0.5 rounded-md font-mono text-slate-700">
                              پلاک: {item.meta.truckPlate}
                            </span>
                          )}

                          {item.meta.driverName && (
                            <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-700">
                              راننده: {item.meta.driverName}
                            </span>
                          )}

                          {item.meta.amountToman !== undefined && (
                            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md font-mono font-bold">
                              مبلغ: {item.meta.amountToman.toLocaleString('fa-IR')} تومان
                            </span>
                          )}

                          {item.meta.delayMinutes !== undefined && (
                            <span className="bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-md font-bold">
                              تاخیر: {item.meta.delayMinutes} دقیقه
                            </span>
                          )}

                          {item.meta.daysLeft !== undefined && (
                            <span className="bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-md font-bold">
                              مهلت باقی‌مانده: {item.meta.daysLeft} روز
                            </span>
                          )}
                        </div>
                      )}

                      {/* Deep-link Action CTA Footer */}
                      <div className="mt-2.5 flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-100">
                        <span className="text-[10px] text-slate-400 font-mono">
                          {item.timestamp}
                        </span>

                        <span className="text-sky-700 group-hover:text-sky-800 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          <span>{item.meta?.actionLabelFa || 'مشاهده رکورد و جزئیات'}</span>
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-white border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
              <span>{visibleNotifications.length} اعلان نمایش داده شده</span>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsSettingsModalOpen(true);
                }}
                className="text-sky-700 hover:text-sky-900 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>شخصی‌سازی اعلان‌ها</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preferences Modal */}
      <ShipperNotificationSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        preferences={preferences}
        onSavePreferences={handleSavePreferences}
      />
    </div>
  );
};
