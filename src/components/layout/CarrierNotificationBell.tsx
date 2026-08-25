import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  Truck,
  Wrench,
  FileCheck2,
  FileText,
  AlertTriangle,
  Flame,
  CreditCard,
  DollarSign,
  TrendingDown,
  Clock,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  CheckCheck,
  Sliders,
  Settings,
  X,
  Search,
  ChevronLeft,
  Filter,
  ExternalLink,
  Info,
  Calendar,
  User,
  Star,
  Download,
  Phone,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import {
  CarrierNotificationItem,
  CarrierNotificationCategory,
  CarrierNotificationType,
  CarrierNotificationPriority,
  CarrierNotificationPreferences,
  DEFAULT_CARRIER_NOTIFICATION_PREFERENCES,
} from '../../types/carrierNotifications';
import { INITIAL_CARRIER_NOTIFICATIONS } from '../../data/mockCarrierNotificationsData';
import { CarrierNotificationSettingsModal } from './CarrierNotificationSettingsModal';

interface CarrierNotificationBellProps {
  onNavigateToWorkspace: (workspaceId: string, subTabId?: string, recordId?: string) => void;
}

export const CarrierNotificationBell: React.FC<CarrierNotificationBellProps> = ({
  onNavigateToWorkspace,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<CarrierNotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('carrier_management_notifications_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return INITIAL_CARRIER_NOTIFICATIONS;
  });

  const [preferences, setPreferences] = useState<CarrierNotificationPreferences>(() => {
    try {
      const saved = localStorage.getItem('carrier_notification_preferences_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return DEFAULT_CARRIER_NOTIFICATION_PREFERENCES;
  });

  const [activeCategory, setActiveCategory] = useState<'all' | 'urgent' | CarrierNotificationCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedNotificationForDetail, setSelectedNotificationForDetail] = useState<CarrierNotificationItem | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('carrier_management_notifications_v1', JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem('carrier_notification_preferences_v1', JSON.stringify(preferences));
    } catch {
      // ignore
    }
  }, [preferences]);

  // Outside click to close popover
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      // Preferences filter check
      if (item.type === 'vehicle_breakdown_service' && !preferences.vehicleBreakdownAlerts) return false;
      if (item.type === 'vehicle_doc_expiration' && !preferences.vehicleDocExpiryAlerts) return false;
      if (item.type === 'driver_doc_expiration' && !preferences.driverDocExpiryAlerts) return false;
      if (item.type === 'unassigned_urgent_shipment' && !preferences.unassignedShipmentAlerts) return false;
      if (item.type === 'contract_expiring_soon' && !preferences.contractExpiryAlerts) return false;
      if (item.type === 'contract_renewal_decision' && !preferences.contractRenewalAlerts) return false;
      if (item.type === 'unusual_cost_spike' && !preferences.unusualCostAlerts) return false;
      if (item.type === 'driver_payment_due' && !preferences.driverPaymentDueAlerts) return false;
      if (item.type === 'penalty_registered' && !preferences.penaltyAlerts) return false;
      if (item.type === 'performance_sla_drop' && !preferences.performanceDropAlerts) return false;
      if (item.type === 'failed_delivery_incident' && !preferences.failedDeliveryAlerts) return false;
      if (item.type === 'pending_approval_request' && !preferences.pendingApprovalsAlerts) return false;
      if (item.type === 'periodic_report_ready' && !preferences.periodicReportsAlerts) return false;

      // Category tab filter
      if (activeCategory === 'urgent' && item.priority !== 'urgent') return false;
      if (activeCategory !== 'all' && activeCategory !== 'urgent' && item.category !== activeCategory) return false;

      // Unread only toggle
      if (showOnlyUnread && item.isRead) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.titleFa.toLowerCase().includes(q);
        const matchesMsg = item.messageFa.toLowerCase().includes(q);
        const matchesDriver = item.meta?.driverName?.toLowerCase().includes(q);
        const matchesPlate = item.meta?.vehiclePlate?.toLowerCase().includes(q);
        const matchesContract = item.meta?.contractName?.toLowerCase().includes(q);
        const matchesCode = item.meta?.shipmentCode?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesMsg && !matchesDriver && !matchesPlate && !matchesContract && !matchesCode) {
          return false;
        }
      }

      return true;
    });
  }, [notifications, preferences, activeCategory, showOnlyUnread, searchQuery]);

  const totalUnreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const urgentUnreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead && n.priority === 'urgent').length;
  }, [notifications]);

  // Actions
  const handleMarkAsRead = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
  };

  const handleToggleStar = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isStarred: !item.isStarred } : item))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleResetSampleNotifications = () => {
    setNotifications(INITIAL_CARRIER_NOTIFICATIONS);
  };

  const handleNotificationClick = (item: CarrierNotificationItem) => {
    handleMarkAsRead(item.id);
    setSelectedNotificationForDetail(item);
  };

  const handleExecutePrimaryAction = (item: CarrierNotificationItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    handleMarkAsRead(item.id);
    setIsOpen(false);
    setSelectedNotificationForDetail(null);
    onNavigateToWorkspace(item.targetWorkspace, item.targetSubTab, item.targetRecordId);
  };

  // Helper icons and styles for category
  const getCategoryConfig = (category: CarrierNotificationCategory, type: CarrierNotificationType) => {
    switch (category) {
      case 'fleet_ops':
        if (type === 'vehicle_breakdown_service') {
          return {
            icon: Wrench,
            badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
            dotColor: 'bg-rose-500',
            labelFa: 'خرابی و سرویس ناوگان',
          };
        }
        if (type === 'vehicle_doc_expiration' || type === 'driver_doc_expiration') {
          return {
            icon: FileCheck2,
            badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
            dotColor: 'bg-amber-500',
            labelFa: 'انقضای مدارک و مجوزها',
          };
        }
        return {
          icon: Truck,
          badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          dotColor: 'bg-indigo-500',
          labelFa: 'عملیاتی و ناوگان',
        };

      case 'contracts':
        return {
          icon: FileText,
          badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
          dotColor: 'bg-blue-500',
          labelFa: 'قراردادها و شرکت‌ها',
        };

      case 'financial':
        if (type === 'unusual_cost_spike') {
          return {
            icon: Flame,
            badgeBg: 'bg-red-50 text-red-700 border-red-200',
            dotColor: 'bg-red-500',
            labelFa: 'افزایش غیرعادی هزینه',
          };
        }
        return {
          icon: DollarSign,
          badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dotColor: 'bg-emerald-500',
          labelFa: 'مالی، تسویه و جریمه',
        };

      case 'performance_quality':
        return {
          icon: TrendingDown,
          badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
          dotColor: 'bg-purple-500',
          labelFa: 'افت عملکرد و شکایات',
        };

      case 'system_administrative':
        if (type === 'periodic_report_ready') {
          return {
            icon: Download,
            badgeBg: 'bg-cyan-50 text-cyan-800 border-cyan-200',
            dotColor: 'bg-cyan-500',
            labelFa: 'گزارش تحلیلی دوره‌ای',
          };
        }
        return {
          icon: ShieldCheck,
          badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
          dotColor: 'bg-slate-600',
          labelFa: 'در انتظار تاییدیه سازمانی',
        };

      default:
        return {
          icon: Bell,
          badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
          dotColor: 'bg-slate-500',
          labelFa: 'اعلان سیستم',
        };
    }
  };

  const getPriorityBadge = (priority: CarrierNotificationPriority) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-600 text-white flex items-center gap-1 shadow-xs animate-pulse">
            <Flame className="w-3 h-3" />
            فوری و بحرانی
          </span>
        );
      case 'high':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500 text-white flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            اولویت بالا
          </span>
        );
      case 'medium':
        return (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
            اولویت متوسط
          </span>
        );
      case 'low':
        return (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-50 text-slate-500">
            اطلاع‌رسانی
          </span>
        );
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Bell Button */}
      <button
        type="button"
        id="btn-header-carrier-notifications"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-xl border transition-all duration-150 cursor-pointer ${
          isOpen
            ? 'bg-slate-900 text-amber-400 border-slate-900 shadow-xs'
            : totalUnreadCount > 0
            ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
        }`}
        title="مرکز اعلانات، هشدارهای ناوگان، مالی، عملکرد و کارتابل تاییدیه"
      >
        <Bell className="w-4.5 h-4.5" />
        {totalUnreadCount > 0 && (
          <span
            className={`absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-extrabold flex items-center justify-center text-white shadow-sm border-2 border-white ${
              urgentUnreadCount > 0 ? 'bg-rose-600 animate-pulse' : 'bg-amber-600'
            }`}
          >
            {totalUnreadCount}
          </span>
        )}
      </button>

      {/* Main Notification Drawer / Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="panel-carrier-notifications-dropdown"
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute left-0 mt-3 w-[360px] sm:w-[500px] md:w-[540px] max-w-[94vw] bg-white border border-slate-300 rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header Area */}
            <div className="p-4 bg-slate-900 text-white border-b border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-amber-400 flex items-center justify-center">
                    <Bell className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-100 font-display">
                      مرکز پایش و اعلانات مدیریت ناوگان
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium">
                      هشدارهای عملیاتی، قراردادها، ناهنجاری مالی و تاییدات
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsSettingsOpen(true)}
                    className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    title="تنظیمات دریافت هشدارهای سازمانی"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status summary bar */}
              <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    {totalUnreadCount} خوانده نشده
                  </span>
                  {urgentUnreadCount > 0 && (
                    <span className="flex items-center gap-1 text-rose-400 font-bold bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-800/60">
                      <Flame className="w-3.5 h-3.5" />
                      {urgentUnreadCount} مورد بحرانی
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {totalUnreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllAsRead}
                      className="text-[11px] text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1 cursor-pointer font-bold"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      خوانده شدن همه
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Filter Categories Toolbar */}
            <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 space-y-2">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                <button
                  type="button"
                  onClick={() => setActiveCategory('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeCategory === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  همه ({notifications.length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCategory('urgent')}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                    activeCategory === 'urgent'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  فوری / بحرانی
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCategory('fleet_ops')}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                    activeCategory === 'fleet_ops'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  ناوگان و عملیات
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCategory('contracts')}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                    activeCategory === 'contracts'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  قراردادها
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCategory('financial')}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                    activeCategory === 'financial'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  مالی و هزینه
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCategory('performance_quality')}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                    activeCategory === 'performance_quality'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-white text-purple-700 border border-purple-200 hover:bg-purple-50'
                  }`}
                >
                  <TrendingDown className="w-3.5 h-3.5" />
                  کیفیت و عملکرد
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCategory('system_administrative')}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                    activeCategory === 'system_administrative'
                      ? 'bg-slate-700 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  سیستمی و تاییدیه
                </button>
              </div>

              {/* Search & unread toggle */}
              <div className="flex items-center gap-2 pt-1">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="جستجو در هشدارها، پلاک، راننده یا کد بارنامه..."
                    className="w-full bg-white border border-slate-300 rounded-xl pr-8 pl-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-800"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setShowOnlyUnread(!showOnlyUnread)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 ${
                    showOnlyUnread
                      ? 'bg-amber-100 border-amber-400 text-amber-900'
                      : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Filter className="w-3 h-3" />
                  {showOnlyUnread ? 'همه' : 'فقط خوانده‌نشده'}
                </button>
              </div>
            </div>

            {/* Notifications List Container */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 divide-y divide-slate-100">
              {filteredNotifications.map((item) => {
                const config = getCategoryConfig(item.category, item.type);
                const IconComponent = config.icon;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    className={`p-3.5 rounded-2xl border transition-all duration-150 cursor-pointer space-y-2.5 group relative ${
                      !item.isRead
                        ? 'bg-amber-50/40 hover:bg-amber-50/80 border-amber-200/80 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    {/* Top Row: Category tag, Priority badge, Relative time, Star action */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border flex items-center gap-1.5 ${config.badgeBg}`}
                        >
                          <IconComponent className="w-3 h-3" />
                          <span>{config.labelFa}</span>
                        </span>
                        {getPriorityBadge(item.priority)}
                        {!item.isRead && (
                          <span className="w-2 h-2 rounded-full bg-amber-500 ring-2 ring-amber-200 animate-pulse" />
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
                        <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {item.relativeTimeFa}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleToggleStar(item.id, e)}
                          className={`p-1 rounded-md hover:bg-slate-200 transition-colors ${
                            item.isStarred ? 'text-amber-500' : 'text-slate-300 hover:text-slate-500'
                          }`}
                          title="نشانه‌گذاری اعلان مهم"
                        >
                          <Star className={`w-3.5 h-3.5 ${item.isStarred ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Title & Message */}
                    <div>
                      <h4
                        className={`text-xs font-bold font-title tracking-tight transition-colors ${
                          !item.isRead ? 'text-slate-900' : 'text-slate-700 group-hover:text-slate-900'
                        }`}
                      >
                        {item.titleFa}
                      </h4>
                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed mt-1">
                        {item.messageFa}
                      </p>
                    </div>

                    {/* Metadata tags (if any) */}
                    {item.meta && (
                      <div className="flex items-center gap-2 flex-wrap text-[10px] font-mono font-medium text-slate-600 bg-slate-100/80 p-2 rounded-xl border border-slate-200/60">
                        {item.meta.vehiclePlate && (
                          <span className="flex items-center gap-1 text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200 font-bold">
                            <Truck className="w-3 h-3 text-indigo-600" />
                            {item.meta.vehiclePlate}
                          </span>
                        )}
                        {item.meta.driverName && (
                          <span className="flex items-center gap-1 text-slate-800 bg-white px-2 py-0.5 rounded-md border border-slate-200 font-sans font-bold">
                            <User className="w-3 h-3 text-slate-500" />
                            {item.meta.driverName}
                          </span>
                        )}
                        {item.meta.partnerCompany && (
                          <span className="flex items-center gap-1 text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 font-sans font-bold">
                            {item.meta.partnerCompany}
                          </span>
                        )}
                        {item.meta.costCategory && (
                          <span className="flex items-center gap-1 text-red-900 bg-red-50 px-2 py-0.5 rounded-md border border-red-200 font-sans font-bold">
                            {item.meta.costCategory}
                          </span>
                        )}
                        {item.meta.variancePercent !== undefined && (
                          <span className="text-red-600 font-bold font-sans">
                            +{item.meta.variancePercent}% انحراف
                          </span>
                        )}
                        {item.meta.amountRials !== undefined && (
                          <span className="text-slate-900 font-bold font-sans">
                            {item.meta.amountRials.toLocaleString('fa-IR')} ریال
                          </span>
                        )}
                        {item.meta.expiryDateFa && (
                          <span className="flex items-center gap-1 text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 font-sans font-bold">
                            <Calendar className="w-3 h-3 text-amber-600" />
                            سررسید: {item.meta.expiryDateFa}
                          </span>
                        )}
                        {item.meta.slaScore !== undefined && (
                          <span className="text-purple-800 font-bold font-sans">
                            امتیاز SLA: {item.meta.slaScore}٪
                          </span>
                        )}
                      </div>
                    )}

                    {/* Bottom Action Buttons */}
                    <div className="pt-1 flex items-center justify-between gap-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        {item.primaryActionLabelFa && (
                          <button
                            type="button"
                            onClick={(e) => handleExecutePrimaryAction(item, e)}
                            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-amber-400 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                          >
                            <span>{item.primaryActionLabelFa}</span>
                            <ChevronLeft className="w-3 h-3" />
                          </button>
                        )}
                        {item.secondaryActionLabelFa && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNotificationClick(item);
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            {item.secondaryActionLabelFa}
                          </button>
                        )}
                      </div>

                      <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-700 flex items-center gap-0.5">
                        جزئیات
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Empty state */}
              {filteredNotifications.length === 0 && (
                <div className="py-12 px-4 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      هیچ هشداری در این دسته‌بندی یافت نشد
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      تمامی آیتم‌های عملیاتی، قراردادها، مالی و تاییدیه‌ها در وضعیت مطلوب و تاییدشده قرار دارند.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetSampleNotifications}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    بارگذاری مجدد داده‌های آزمایشی
                  </button>
                </div>
              )}
            </div>

            {/* Footer Status & Guide */}
            <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span className="text-[11px]">
                مجموع: {notifications.length} اعلان فعال پایش ناوگان
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onNavigateToWorkspace('intelligence', 'anomaly_alerts');
                }}
                className="text-[11px] font-bold text-slate-900 hover:underline flex items-center gap-1 cursor-pointer"
              >
                مرکز هوشمندی و هشدارها
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Detail & Action Drawer/Modal */}
      <AnimatePresence>
        {selectedNotificationForDetail && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white border border-slate-300 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-slate-800 text-amber-400">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-100">
                      رسیدگی و جزئیات اعلان سازمانی
                    </h3>
                    <span className="text-[10px] text-slate-400">
                      شناسه: {selectedNotificationForDetail.id}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedNotificationForDetail(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="flex items-center justify-between">
                  {getPriorityBadge(selectedNotificationForDetail.priority)}
                  <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    {selectedNotificationForDetail.relativeTimeFa}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-900 leading-snug">
                    {selectedNotificationForDetail.titleFa}
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    {selectedNotificationForDetail.messageFa}
                  </p>
                </div>

                {/* Structured Metadata view */}
                {selectedNotificationForDetail.meta && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-800">اطلاعات تکمیلی پرونده:</h5>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {selectedNotificationForDetail.meta.vehiclePlate && (
                        <div className="p-2.5 bg-slate-100 rounded-xl">
                          <span className="text-slate-500 block text-[10px]">پلاک ناوگان:</span>
                          <span className="font-bold text-slate-900 font-mono">
                            {selectedNotificationForDetail.meta.vehiclePlate}
                          </span>
                        </div>
                      )}
                      {selectedNotificationForDetail.meta.driverName && (
                        <div className="p-2.5 bg-slate-100 rounded-xl">
                          <span className="text-slate-500 block text-[10px]">راننده مسئول:</span>
                          <span className="font-bold text-slate-900">
                            {selectedNotificationForDetail.meta.driverName}
                          </span>
                        </div>
                      )}
                      {selectedNotificationForDetail.meta.driverPhone && (
                        <div className="p-2.5 bg-slate-100 rounded-xl">
                          <span className="text-slate-500 block text-[10px]">شماره تماس:</span>
                          <span className="font-bold text-slate-900 font-mono flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-500" />
                            {selectedNotificationForDetail.meta.driverPhone}
                          </span>
                        </div>
                      )}
                      {selectedNotificationForDetail.meta.partnerCompany && (
                        <div className="p-2.5 bg-slate-100 rounded-xl">
                          <span className="text-slate-500 block text-[10px]">شرکت طرف قرارداد:</span>
                          <span className="font-bold text-blue-900">
                            {selectedNotificationForDetail.meta.partnerCompany}
                          </span>
                        </div>
                      )}
                      {selectedNotificationForDetail.meta.amountRials !== undefined && (
                        <div className="p-2.5 bg-slate-100 rounded-xl">
                          <span className="text-slate-500 block text-[10px]">مبلغ مورد بحث:</span>
                          <span className="font-bold text-emerald-700 font-mono">
                            {selectedNotificationForDetail.meta.amountRials.toLocaleString('fa-IR')} ریال
                          </span>
                        </div>
                      )}
                      {selectedNotificationForDetail.meta.expiryDateFa && (
                        <div className="p-2.5 bg-slate-100 rounded-xl">
                          <span className="text-slate-500 block text-[10px]">تاریخ انقضا / سررسید:</span>
                          <span className="font-bold text-amber-800">
                            {selectedNotificationForDetail.meta.expiryDateFa}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer Actions */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedNotificationForDetail(null)}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition-colors cursor-pointer"
                >
                  بستن
                </button>

                {selectedNotificationForDetail.primaryActionLabelFa && (
                  <button
                    type="button"
                    onClick={(e) => handleExecutePrimaryAction(selectedNotificationForDetail, e)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>{selectedNotificationForDetail.primaryActionLabelFa}</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Notification Preferences & Alert Configuration Modal */}
      <CarrierNotificationSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        preferences={preferences}
        onSavePreferences={(newPrefs) => setPreferences(newPrefs)}
      />
    </div>
  );
};
