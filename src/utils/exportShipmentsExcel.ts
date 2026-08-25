import { MonthlyShipmentRecord } from '../data/mockMonthlyShipmentsData';

/**
 * Exports monthly shipments ledger to Excel compatible CSV with UTF-8 BOM
 */
export function exportShipmentsToExcel(
  shipments: MonthlyShipmentRecord[],
  companyName: string,
  selectedMonthLabel: string
): void {
  const headers = [
    'شماره ردیف',
    'کد محموله',
    'شماره بارنامه تمبردار',
    'ماه عملیاتی',
    'وضعیت عملیاتی',
    'وضعیت تحویل به‌موقع',
    'تاریخ ارسال برنامه‌ریزی',
    'تاریخ ارسال واقعی',
    'تاریخ تحویل برنامه‌ریزی',
    'تاریخ تحویل واقعی',
    'مدت زمان حمل (ساعت)',
    'استان مبدأ',
    'شهر مبدأ',
    'هاب / انبار مبدأ',
    'استان مقصد',
    'شهر مقصد',
    'هاب / انبار مقصد',
    'مسافت (کیلومتر)',
    'نوع کالا',
    'دسته‌بندی کالا',
    'وزن خالص (تن)',
    'نوع بسته‌بندی',
    'ارزش اظهارشده کالا (ریال)',
    'شرکت حمل‌کننده',
    'تلفن متصدی حمل',
    'نام راننده مسئول',
    'تلفن راننده',
    'کد ملی راننده',
    'نوع ناوگان',
    'پلاک کامیون',
    'کرایه پایه (ریال)',
    'عوارض راهداری ۹٪ (ریال)',
    'مالیات بر ارزش افزوده ۱۰٪ (ریال)',
    'بیمه مسئولیت (ریال)',
    'مجموع بهای تمام‌شده (ریال)',
    'مجموع بهای تمام‌شده (تومان)',
    'وضعیت پرداخت و تسویه',
    'شماره قرارداد مرتبط',
    'عنوان قرارداد',
    'توضیحات و رخدادها',
  ];

  const rows = shipments.map((s, idx) => [
    (idx + 1).toString(),
    `"${s.shipmentCode || ''}"`,
    `"${s.billOfLadingNo || ''}"`,
    `"${s.monthLabelFa || ''}"`,
    `"${s.statusLabelFa || ''}"`,
    s.isOnTime ? 'به‌موقع' : 'دارای تاخیر',
    `"${s.dispatchDatePlanned || ''}"`,
    `"${s.dispatchDateActual || ''}"`,
    `"${s.deliveryDatePlanned || ''}"`,
    `"${s.deliveryDateActual || ''}"`,
    s.transitDurationHours?.toString() || '—',
    `"${s.originProvince || ''}"`,
    `"${s.originCity || ''}"`,
    `"${s.originHub || ''}"`,
    `"${s.destProvince || ''}"`,
    `"${s.destCity || ''}"`,
    `"${s.destHub || ''}"`,
    s.distanceKm?.toString() || '0',
    `"${s.cargoType || ''}"`,
    `"${s.cargoCategory || ''}"`,
    s.weightTons?.toString() || '0',
    `"${s.packaging || ''}"`,
    s.declaredValueRials?.toLocaleString('en-US') || '0',
    `"${s.carrierName || ''}"`,
    `"${s.carrierPhone || ''}"`,
    `"${s.driverName || ''}"`,
    `"${s.driverPhone || ''}"`,
    `"${s.driverNationalCode || ''}"`,
    `"${s.truckType || ''}"`,
    `"${s.truckPlate || ''}"`,
    s.baseFreightRials?.toLocaleString('en-US') || '0',
    s.rmtoTaxRials?.toLocaleString('en-US') || '0',
    s.vatRials?.toLocaleString('en-US') || '0',
    s.insuranceCostRials?.toLocaleString('en-US') || '0',
    s.totalCostRials?.toLocaleString('en-US') || '0',
    s.totalCostToman?.toLocaleString('en-US') || '0',
    `"${s.paymentStatusLabelFa || ''}"`,
    `"${s.contractNumber || ''}"`,
    `"${s.contractTitle || ''}"`,
    `"${s.issueDetails || s.currentLocation || 'تحویل استاندارد'}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const safeCompName = (companyName || 'Shipper').replace(/[\s/\\:]/g, '_');
  const safeMonth = (selectedMonthLabel || 'Monthly').replace(/[\s/\\:]/g, '_');
  link.setAttribute('href', url);
  link.setAttribute('download', `گزارش_محموله_های_${safeMonth}_${safeCompName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
