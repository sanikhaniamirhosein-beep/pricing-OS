export type NotificationCategory = 'shipment' | 'contract' | 'financial' | 'carrier_driver';

export type NotificationPriority = 'urgent' | 'normal';

export interface ShipperNotificationItem {
  id: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  titleFa: string;
  messageFa: string;
  timestamp: string;
  timestampRelative: string;
  isRead: boolean;
  
  // Deep-link Target Info
  targetTab: 'shipments' | 'contracts' | 'billing' | 'support' | 'quote' | 'batch_orders';
  targetRecordId?: string;
  targetRecordType?: 'load' | 'invoice' | 'contract' | 'ticket';
  
  // Specific Metadata for enriched presentation
  meta?: {
    billOfLadingNo?: string;
    trackingCode?: string;
    truckPlate?: string;
    driverName?: string;
    carrierName?: string;
    originDest?: string;
    amountToman?: number;
    delayMinutes?: number;
    daysLeft?: number;
    invoiceNo?: string;
    contractTitle?: string;
    actionLabelFa?: string;
  };
}

export interface ShipperNotificationPreferences {
  // Shipment Toggles
  shipmentStatusChange: boolean;    // تغییر وضعیت (بارگیری، در مسیر، تحویل)
  shipmentDelays: boolean;          // تأخیر نسبت به زمان برنامه‌ریزی‌شده
  shipmentDamage: boolean;          // مشکل یا آسیب گزارش‌شده

  // Contract Toggles
  contractExpiring: boolean;        // نزدیک شدن به تاریخ انقضا
  contractRenewed: boolean;         // تمدید یا فسخ قرارداد

  // Financial Toggles
  invoiceIssued: boolean;           // صدور فاکتور جدید
  paymentDue: boolean;              // سررسید پرداخت نزدیک است / پرداخت انجام شد
  unusualCost: boolean;             // تغییر یا افزایش هزینه غیرمعمول

  // Carrier / Driver Toggles
  driverTruckChange: boolean;       // تغییر راننده یا وسیله نقلیه
  carrierBreakdown: boolean;        // مشکل فنی یا تأخیر گزارش‌شده توسط حمل‌کننده

  // System & Delivery Channels
  onlyUrgentInHeader: boolean;
  soundAlerts: boolean;
  smsAlerts: boolean;
  emailAlerts: boolean;
}

export const DEFAULT_SHIPPER_NOTIFICATION_PREFERENCES: ShipperNotificationPreferences = {
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
  emailAlerts: false,
};
