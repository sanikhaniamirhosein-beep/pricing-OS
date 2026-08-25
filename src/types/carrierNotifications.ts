export type CarrierNotificationCategory =
  | 'fleet_ops'             // عملیاتی و ناوگان
  | 'contracts'             // قراردادها
  | 'financial'             // مالی و هزینه
  | 'performance_quality'   // عملکرد و کیفیت
  | 'system_administrative';// سیستمی و اداری

export type CarrierNotificationType =
  // ۱. عملیاتی/ناوگان
  | 'vehicle_breakdown_service'       // خرابی یا نیاز به سرویس دوره‌ای وسیله نقلیه
  | 'vehicle_doc_expiration'          // انقضای بیمه، معاینه فنی یا مجوز وسیله نقلیه
  | 'driver_doc_expiration'           // انقضای گواهینامه یا مدارک راننده
  | 'unassigned_urgent_shipment'      // تخصیص نیافتن راننده/وسیله به یه محموله (تا لحظه آخر بلاتکلیف)
  // ۲. قراردادها
  | 'contract_expiring_soon'          // نزدیک شدن به تاریخ انقضای قرارداد با شرکت طرف قرارداد
  | 'contract_renewal_decision'       // قراردادی که نیاز به تمدید یا تصمیم‌گیری دارد
  // ۳. مالی/هزینه
  | 'unusual_cost_spike'              // افزایش غیرعادی هزینه در یه دسته خاص (سوخت، تعمیرات و ...) نسبت به میانگین
  | 'driver_payment_due'              // سررسید پرداخت به راننده یا حق کمیسیون
  | 'penalty_registered'              // جریمه ثبت‌شده برای یه محموله یا راننده
  // ۴. عملکرد/کیفیت
  | 'performance_sla_drop'            // افت عملکرد یه راننده یا شرکت طرف قرارداد (افزایش تأخیرها یا شکایات)
  | 'failed_delivery_incident'        // تحویل‌های ناموفق یا محموله‌های مشکل‌دار نیازمند رسیدگی مدیریتی
  // ۵. سیستمی/اداری
  | 'pending_approval_request'        // درخواست‌های در انتظار تأیید (تأیید قرارداد جدید یا هزینه بزرگ یا بسته حاکمیتی)
  | 'periodic_report_ready';          // گزارش دوره‌ای آماده شد (ماهانه/هفتگی)

export type CarrierNotificationPriority = 'urgent' | 'high' | 'medium' | 'low';

export interface CarrierNotificationItem {
  id: string;
  category: CarrierNotificationCategory;
  type: CarrierNotificationType;
  priority: CarrierNotificationPriority;
  titleFa: string;
  messageFa: string;
  timestamp: string;
  relativeTimeFa: string;
  isRead: boolean;
  isStarred?: boolean;
  targetWorkspace: 'design' | 'validation' | 'governance' | 'intelligence' | 'system';
  targetSubTab?: string;
  targetRecordId?: string;
  meta?: {
    driverName?: string;
    driverPhone?: string;
    vehiclePlate?: string;
    vehicleModel?: string;
    contractName?: string;
    partnerCompany?: string;
    costCategory?: string;
    amountRials?: number;
    variancePercent?: number;
    shipmentCode?: string;
    originDestination?: string;
    delayMinutes?: number;
    reportName?: string;
    reportPeriod?: string;
    expiryDateFa?: string;
    penaltyReason?: string;
    slaScore?: number;
  };
  primaryActionLabelFa?: string;
  secondaryActionLabelFa?: string;
}

export interface CarrierNotificationPreferences {
  // ناوگان و عملیات
  vehicleBreakdownAlerts: boolean;
  vehicleDocExpiryAlerts: boolean;
  driverDocExpiryAlerts: boolean;
  unassignedShipmentAlerts: boolean;

  // قراردادها
  contractExpiryAlerts: boolean;
  contractRenewalAlerts: boolean;

  // مالی و هزینه
  unusualCostAlerts: boolean;
  driverPaymentDueAlerts: boolean;
  penaltyAlerts: boolean;

  // عملکرد و کیفیت
  performanceDropAlerts: boolean;
  failedDeliveryAlerts: boolean;

  // سیستمی و اداری
  pendingApprovalsAlerts: boolean;
  periodicReportsAlerts: boolean;

  // تنظیمات هشدار صوتی و پیامکی
  soundEnabled: boolean;
  emailDigestEnabled: boolean;
  smsUrgentEnabled: boolean;
}

export const DEFAULT_CARRIER_NOTIFICATION_PREFERENCES: CarrierNotificationPreferences = {
  vehicleBreakdownAlerts: true,
  vehicleDocExpiryAlerts: true,
  driverDocExpiryAlerts: true,
  unassignedShipmentAlerts: true,
  contractExpiryAlerts: true,
  contractRenewalAlerts: true,
  unusualCostAlerts: true,
  driverPaymentDueAlerts: true,
  penaltyAlerts: true,
  performanceDropAlerts: true,
  failedDeliveryAlerts: true,
  pendingApprovalsAlerts: true,
  periodicReportsAlerts: true,
  soundEnabled: true,
  emailDigestEnabled: true,
  smsUrgentEnabled: true,
};
