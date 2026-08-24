import * as XLSX from 'xlsx';
import { BatchShipmentRow, ShipperActiveLoad } from '../data/mockShipperData';
import { CARRIER_ORGANIZATIONS, CarrierOrgProfile } from '../data/mockOrganizationProfiles';

// Coordinates of major Iranian industrial & logistic hub cities
export const IRAN_CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  تهران: { lat: 35.6892, lng: 51.389 },
  اصفهان: { lat: 32.6546, lng: 51.668 },
  مشهد: { lat: 36.2972, lng: 59.6067 },
  تبریز: { lat: 38.08, lng: 46.2919 },
  شیراز: { lat: 29.5918, lng: 52.5837 },
  اهواز: { lat: 31.3183, lng: 48.6706 },
  بندرعباس: { lat: 27.1832, lng: 56.2666 },
  یزد: { lat: 31.8974, lng: 54.3569 },
  کرمان: { lat: 30.2839, lng: 57.0834 },
  قزوین: { lat: 36.2797, lng: 50.0049 },
  اراک: { lat: 34.0954, lng: 49.7013 },
  رشت: { lat: 37.2809, lng: 49.5924 },
  ساری: { lat: 36.5659, lng: 53.0586 },
  گرگان: { lat: 36.8427, lng: 54.4439 },
  سمنان: { lat: 35.5769, lng: 53.397 },
  ارومیه: { lat: 37.5527, lng: 45.0761 },
  اردبیل: { lat: 38.2498, lng: 48.2933 },
  زنجان: { lat: 36.6736, lng: 48.4787 },
  همدان: { lat: 34.7989, lng: 48.515 },
  کرمانشاه: { lat: 34.3277, lng: 47.0778 },
  سنندج: { lat: 35.3219, lng: 46.9862 },
  خرم‌آباد: { lat: 33.4878, lng: 48.3558 },
  ایلام: { lat: 33.6374, lng: 46.4227 },
  بوشهر: { lat: 28.9234, lng: 50.8203 },
  عسلویه: { lat: 27.4763, lng: 52.6074 },
  'بندر ماهشهر': { lat: 30.5589, lng: 49.1981 },
  ماهشهر: { lat: 30.5589, lng: 49.1981 },
  چابهار: { lat: 25.2919, lng: 60.643 },
  زاهدان: { lat: 29.4963, lng: 60.8629 },
  بیرجند: { lat: 32.8663, lng: 59.2211 },
  بجنورد: { lat: 37.4747, lng: 57.329 },
  قم: { lat: 34.6401, lng: 50.8764 },
  کاشان: { lat: 33.985, lng: 51.41 },
  'بندر انزلی': { lat: 37.4744, lng: 49.4622 },
  'بندر امام خمینی': { lat: 30.435, lng: 49.08 },
  شاهرود: { lat: 36.4182, lng: 54.9763 },
  نیشابور: { lat: 36.2133, lng: 58.7958 },
  سبزوار: { lat: 36.2126, lng: 57.6778 },
  ساوه: { lat: 35.0213, lng: 50.3565 },
  نجف‌آباد: { lat: 32.6342, lng: 51.3667 },
  سیرجان: { lat: 29.452, lng: 55.6814 },
  رفسنجان: { lat: 30.4067, lng: 55.9939 },
};

// Clean text
export function cleanString(val: any): string {
  if (val === undefined || val === null) return '';
  return String(val).trim();
}

// Convert Persian and Arabic numbers to English float
export function parseNumberSafe(val: any): number {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const str = String(val)
    .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString())
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString())
    .replace(/[,،\s_]/g, '')
    .trim();
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

// Identify city from free text
export function detectCityName(input: string): string {
  const clean = cleanString(input);
  if (!clean) return 'نامشخص';

  // Direct match in city coordinates
  const cityKeys = Object.keys(IRAN_CITY_COORDINATES);
  for (const city of cityKeys) {
    if (clean.includes(city)) {
      return city;
    }
  }

  // Common aliases
  if (clean.includes('پایتخت') || clean.includes('شمس آباد') || clean.includes('شورآباد')) return 'تهران';
  if (clean.includes('فولاد مبارکه') || clean.includes('ذوب آهن')) return 'اصفهان';
  if (clean.includes('رجایی') || clean.includes('شهید رجایی')) return 'بندرعباس';
  if (clean.includes('پارس جنوبی')) return 'عسلویه';
  if (clean.includes('منطقه ویژه ماهشهر')) return 'بندر ماهشهر';

  return clean;
}

// Calculate road distance in kilometers between two Iranian cities
export function estimateRoadDistanceKm(origin: string, dest: string): number {
  const normOrigin = detectCityName(origin);
  const normDest = detectCityName(dest);

  if (normOrigin === normDest) return 45; // Local intra-city transport

  const c1 = IRAN_CITY_COORDINATES[normOrigin];
  const c2 = IRAN_CITY_COORDINATES[normDest];

  if (c1 && c2) {
    const R = 6371; // Earth radius in km
    const dLat = ((c2.lat - c1.lat) * Math.PI) / 180;
    const dLon = ((c2.lng - c1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((c1.lat * Math.PI) / 180) *
        Math.cos((c2.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const directKm = R * c;

    // Road winding factor in Iranian road network is approximately ~1.28
    return Math.max(50, Math.round(directKm * 1.28));
  }

  // Fallback default realistic distance
  return 650;
}

// Suggest vehicle type based on weight
export function suggestTruckType(weightTons: number, currentType?: string): string {
  if (currentType && currentType.trim().length > 2) {
    return currentType.trim();
  }
  if (weightTons >= 22) return 'تریلر کفی ۱۸ چرخ';
  if (weightTons >= 18) return 'تریلی چادری ترانزیت';
  if (weightTons >= 14) return 'کامیون جفت ۱۰ چرخ';
  if (weightTons >= 8) return 'کامیون تک ۶ چرخ';
  if (weightTons >= 3.5) return 'خاور / کامیونت مسقف';
  return 'وانت نیسان باربری';
}

// Calculate comprehensive shipment pricing
export function calculateBatchRowPrice(
  originCity: string,
  destCity: string,
  weightTons: number,
  truckType: string,
  cargoValueToman: number
): { estimatedRials: number; discountRials: number; finalRials: number; distanceKm: number } {
  const distanceKm = estimateRoadDistanceKm(originCity, destCity);
  const tons = Math.max(1, weightTons);

  // Base handling and loading fee (Rials)
  const baseLoadingFee = 32000000; // ~3.2m Tomans

  // Tariff Ton-Kilometer (RMTO baseline standard in Iran)
  const tonKmRate = 2250; // Rials / ton / km
  const distanceCost = distanceKm * tons * tonKmRate;

  // Vehicle type multiplier
  let vehicleMultiplier = 1.0;
  if (truckType.includes('چادری') || truckType.includes('ترانزیت')) vehicleMultiplier = 1.12;
  if (truckType.includes('تانکر') || truckType.includes('کمرشکن') || truckType.includes('بوژی')) vehicleMultiplier = 1.25;
  if (truckType.includes('کامیونت') || truckType.includes('نیسان')) vehicleMultiplier = 0.9;

  // Cargo insurance fee based on estimated cargo value (0.15%)
  const insuranceRials = Math.round((cargoValueToman * 10 * 0.0015));

  const totalRawPrice = (baseLoadingFee + distanceCost) * vehicleMultiplier + insuranceRials;
  const estimatedRials = Math.round(totalRawPrice / 100000) * 100000;

  // Corporate Golden Tier 7% discount
  const discountRials = Math.round((estimatedRials * 0.07) / 10000) * 10000;
  const finalRials = estimatedRials - discountRials;

  return { estimatedRials, discountRials, finalRials, distanceKm };
}

// Match column names to standardized keys
function findColumnIndex(headers: string[], patterns: RegExp[]): number {
  for (let i = 0; i < headers.length; i++) {
    const h = cleanString(headers[i]).toLowerCase();
    for (const pat of patterns) {
      if (pat.test(h)) return i;
    }
  }
  return -1;
}

// Parse uploaded Excel or CSV file
export async function parseUploadedBatchFile(file: File): Promise<{
  rows: BatchShipmentRow[];
  totalRows: number;
  validRows: number;
  warningRows: number;
  errorRows: number;
  totalWeightTons: number;
  totalFinalPriceRials: number;
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          throw new Error('فایل خالی یا غیرقابل خواندن است');
        }

        const workbook = XLSX.read(data, { type: 'array', cellDates: true });
        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) {
          throw new Error('هیچ برگه فعالی در فایل اکسل یافت نشد');
        }

        const worksheet = workbook.Sheets[firstSheetName];
        // Read raw data as 2D array of rows
        const rawGrid: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

        if (!rawGrid || rawGrid.length === 0) {
          throw new Error('فایل هیچ داده‌ای ندارد');
        }

        // Find header row (first non-empty row containing text)
        let headerRowIndex = -1;
        for (let r = 0; r < Math.min(rawGrid.length, 5); r++) {
          const rowText = rawGrid[r].map(cleanString).join(' ');
          if (
            rowText.includes('مبدا') ||
            rowText.includes('مبدأ') ||
            rowText.includes('مقصد') ||
            rowText.includes('وزن') ||
            rowText.includes('کالا') ||
            rowText.includes('origin') ||
            rowText.includes('dest')
          ) {
            headerRowIndex = r;
            break;
          }
        }

        // If no explicit header matched, assume row 0 is header
        if (headerRowIndex === -1 && rawGrid.length > 1) {
          headerRowIndex = 0;
        }

        const headerList: string[] =
          headerRowIndex >= 0 ? rawGrid[headerRowIndex].map(cleanString) : [];

        // Detect column positions
        const colOriginCity = findColumnIndex(headerList, [/مبد[اأ]/, /شهر مبد/, /origin/]);
        const colDestCity = findColumnIndex(headerList, [/مقصد/, /شهر مقصد/, /destination/, /dest/]);
        const colOriginHub = findColumnIndex(headerList, [/انبار مبد/, /محل بارگیری/, /origin.*hub/]);
        const colDestHub = findColumnIndex(headerList, [/انبار مقصد/, /محل تخلیه/, /dest.*hub/]);
        const colCargoType = findColumnIndex(headerList, [/نوع کالا/, /نوع بار/, /گروه کالا/, /cargo.*type/]);
        const colCargoTitle = findColumnIndex(headerList, [/شرح/, /عنوان/, /نام کالا/, /محموله/, /title/, /desc/]);
        const colWeight = findColumnIndex(headerList, [/وزن/, /تناژ/, /weight/, /ton/]);
        const colTruckType = findColumnIndex(headerList, [/ناوگان/, /خودرو/, /کامیون/, /تریلی/, /truck/]);
        const colCargoValue = findColumnIndex(headerList, [/ارزش/, /مبلغ کالا/, /قیمت کالا/, /value/]);
        const colLoadingDate = findColumnIndex(headerList, [/تاریخ/, /زمان/, /date/]);
        const colSender = findColumnIndex(headerList, [/فرستنده/, /sender/]);
        const colReceiver = findColumnIndex(headerList, [/گیرنده/, /تحویل/, /receiver/]);

        const startDataRow = headerRowIndex >= 0 ? headerRowIndex + 1 : 0;
        const extractedRows: BatchShipmentRow[] = [];

        let rowCounter = 1;
        for (let r = startDataRow; r < rawGrid.length; r++) {
          const row = rawGrid[r];
          if (!row || row.length === 0) continue;

          // Check if row has any non-empty cell
          const hasContent = row.some((c: any) => cleanString(c) !== '');
          if (!hasContent) continue;

          // Extract fields with fallback to column index if headers weren't named
          const originRaw = colOriginCity >= 0 ? cleanString(row[colOriginCity]) : cleanString(row[1] || row[0]);
          const destRaw = colDestCity >= 0 ? cleanString(row[colDestCity]) : cleanString(row[2] || row[1]);
          const originHub = colOriginHub >= 0 ? cleanString(row[colOriginHub]) : cleanString(row[3]);
          const destHub = colDestHub >= 0 ? cleanString(row[colDestHub]) : cleanString(row[4]);
          const cargoType = colCargoType >= 0 ? cleanString(row[colCargoType]) : cleanString(row[5]) || 'صنعتی و عمومی';
          const cargoTitle = colCargoTitle >= 0 ? cleanString(row[colCargoTitle]) : cleanString(row[6]) || `محموله تجاری ردیف ${rowCounter}`;
          
          let rawWeight = colWeight >= 0 ? parseNumberSafe(row[colWeight]) : parseNumberSafe(row[7]);
          // If weight is in kg (e.g. 22000), convert to metric tons
          if (rawWeight > 150) {
            rawWeight = Math.round((rawWeight / 1000) * 10) / 10;
          }
          if (rawWeight <= 0) rawWeight = 18.0;

          const rawTruck = colTruckType >= 0 ? cleanString(row[colTruckType]) : cleanString(row[8]);
          const truckType = suggestTruckType(rawWeight, rawTruck);

          let rawValue = colCargoValue >= 0 ? parseNumberSafe(row[colCargoValue]) : parseNumberSafe(row[9]);
          if (rawValue <= 0) rawValue = 250000000; // 250m Tomans default cargo value

          const loadingDate = colLoadingDate >= 0 ? cleanString(row[colLoadingDate]) : cleanString(row[10]) || '۱۴۰۳/۰۶/۱۰';
          const senderName = colSender >= 0 ? cleanString(row[colSender]) : cleanString(row[11]) || 'واحد لجستیک مرکزی';
          const receiverName = colReceiver >= 0 ? cleanString(row[colReceiver]) : cleanString(row[12]) || 'انبار مقصد';

          // Extract standard city names
          const originCity = detectCityName(originRaw || 'تهران');
          const destCity = detectCityName(destRaw || 'اصفهان');

          // Calculate rates and discounts
          const pricing = calculateBatchRowPrice(originCity, destCity, rawWeight, truckType, rawValue);

          // Validation status check
          let status: 'valid' | 'warning' | 'error' = 'valid';
          let validationMessage = `مسافت ${pricing.distanceKm} کیلومتر - آماده صدور بارنامه`;

          if (!originRaw || !destRaw) {
            status = 'warning';
            validationMessage = 'مبدأ یا مقصد با دقت کم شناسایی شد، مسیر پیشنهادی اعمال گردید.';
          } else if (rawWeight > 26) {
            status = 'warning';
            validationMessage = 'وزن بالای ۲۶ تن نیازمند اخذ مجوز ترافیکی و بررسی ناوگان بوژی است.';
          } else if (originCity === destCity) {
            validationMessage = 'حمل درون‌شهری / حومه با کرایه پایه درون‌استانی محاسبه شد.';
          }

          extractedRows.push({
            id: `parsed-row-${Date.now()}-${rowCounter}`,
            rowNumber: rowCounter,
            originCity,
            destCity,
            originHub: originHub || `انبار مرکزی ${originCity}`,
            destHub: destHub || `پایانه توزیع ${destCity}`,
            cargoType,
            cargoTitle,
            weightTons: rawWeight,
            truckType,
            cargoValueToman: rawValue,
            estimatedPriceRials: pricing.estimatedRials,
            discountRials: pricing.discountRials,
            finalPriceRials: pricing.finalRials,
            loadingDate: loadingDate || '۱۴۰۳/۰۶/۱۰',
            status,
            validationMessage,
            senderName,
            receiverName,
          });

          rowCounter++;
        }

        if (extractedRows.length === 0) {
          throw new Error('هیچ ردیف معتبری در فایل یافت نشد.');
        }

        const totalRows = extractedRows.length;
        const validRows = extractedRows.filter((r) => r.status === 'valid').length;
        const warningRows = extractedRows.filter((r) => r.status === 'warning').length;
        const errorRows = extractedRows.filter((r) => r.status === 'error').length;
        const totalWeightTons = Math.round(extractedRows.reduce((sum, r) => sum + r.weightTons, 0) * 10) / 10;
        const totalFinalPriceRials = extractedRows.reduce((sum, r) => sum + r.finalPriceRials, 0);

        resolve({
          rows: extractedRows,
          totalRows,
          validRows,
          warningRows,
          errorRows,
          totalWeightTons,
          totalFinalPriceRials,
        });
      } catch (err: any) {
        reject(err);
      }
    };

    reader.onerror = () => {
      reject(new Error('خطا در خواندن فایل از حافظه مرورگر'));
    };

    reader.readAsArrayBuffer(file);
  });
}

// Generate genuine Standard Excel Template (.xlsx) or CSV
export function downloadGenuineTemplate(format: 'xlsx' | 'csv') {
  const headers = [
    'ردیف',
    'شهر مبدا',
    'شهر مقصد',
    'انبار مبدا',
    'انبار مقصد',
    'نوع کالا',
    'شرح محموله',
    'وزن خالص (تن)',
    'نوع ناوگان درخواستی',
    'ارزش تقریبی کالا (تومان)',
    'تاریخ بارگیری',
    'فرستنده',
    'گیرنده',
  ];

  const sampleRows = [
    [
      1,
      'اصفهان',
      'تهران',
      'مجتمع فولاد مبارکه - انبار نورد',
      'شهرک صنعتی شمس‌آباد',
      'صنعتی و فلزی',
      'کویل ورق فولادی ST37 (۲۲ تن)',
      22.0,
      'تریلر کفی ۱۸ چرخ',
      380000000,
      '۱۴۰۳/۰۶/۰۵',
      'فولاد مبارکه اصفهان',
      'ایران خودرو دیزل',
    ],
    [
      2,
      'بندرعباس',
      'اصفهان',
      'اسکله شهید رجایی پایانه صادرات',
      'شهرک صنعتی جی',
      'پتروشیمی',
      'پالت مواد پلی‌اتیلن سنگین (۱۸ تن)',
      18.0,
      'تریلی چادری ترانزیت',
      290000000,
      '۱۴۰۳/۰۶/۰۶',
      'پتروشیمی خلیج فارس',
      'صنایع پلاستیک اصفهان',
    ],
    [
      3,
      'اهواز',
      'تهران',
      'لوله و نورد خوزستان',
      'انبار شادآباد آهن مکان',
      'لوله و فولاد',
      'لوله مانیسمان صنعتی بدون درز (۲۴ تن)',
      24.0,
      'تریلر کفی ۱۸ چرخ',
      420000000,
      '۱۴۰۳/۰۶/۰۵',
      'فولاد خوزستان',
      'پارس پایپ تهران',
    ],
    [
      4,
      'تبریز',
      'مشهد',
      'منطقه صنعتی سلیمی تبریز',
      'انبار مرکزی طرق مشهد',
      'قطعات صنعتی',
      'پالت الکتروموتورهای صنعتی موتوژن (۱۲ تن)',
      12.0,
      'کامیون جفت ۱۰ چرخ',
      210000000,
      '۱۴۰۳/۰۶/۰۷',
      'موتوژن تبریز',
      'پارس پمپ مشهد',
    ],
    [
      5,
      'یزد',
      'رشت',
      'شهرک صنعتی یزد',
      'انبار پخش لاکان رشت',
      'کاشی و سرامیک',
      'پالت کاشی پرسلان نانو پولیش (۱۵ تن)',
      15.0,
      'کامیون تک ۱۰ چرخ',
      170000000,
      '۱۴۰۳/۰۶/۰۸',
      'کاشی کویر یزد',
      'ساختمان سپهر شمال',
    ],
  ];

  if (format === 'xlsx') {
    const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleRows]);
    // Set auto column width
    ws['!cols'] = [
      { wch: 6 },
      { wch: 14 },
      { wch: 14 },
      { wch: 28 },
      { wch: 28 },
      { wch: 16 },
      { wch: 32 },
      { wch: 14 },
      { wch: 20 },
      { wch: 22 },
      { wch: 14 },
      { wch: 22 },
      { wch: 22 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'سفارشات حمل بار');
    XLSX.writeFile(wb, 'Standard_Batch_Shipment_Template.xlsx');
  } else {
    // Generate UTF-8 CSV with BOM for perfect Persian rendering in Excel
    const csvContent =
      headers.join(',') +
      '\n' +
      sampleRows.map((r) => r.map((cell) => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Standard_Batch_Shipment_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Convert parsed batch rows to full-featured active tracked shipments (ShipperActiveLoad)
const SAMPLE_DRIVERS = [
  { name: 'علیرضا رضایی (ناوگان شرکتی)', phone: '۰۹۱۲۴۴۵۸۹۱۲', plate: '۶۸ ع ۹۴۱ ایران ۴۳' },
  { name: 'محمدرضا سلیمانی', phone: '۰۹۱۳۸۸۲۱۱۰۴', plate: '۲۴ ع ۵۱۲ ایران ۵۳' },
  { name: 'داوود کاظمی (پایانه جنوب)', phone: '۰۹۱۷۳۳۲۱۹۵۵', plate: '۷۲ ع ۴۸۱ ایران ۸۴' },
  { name: 'حسین صادقی پور', phone: '۰۹۱۴۷۷۸۱۲۳۴', plate: '۱۵ ع ۶۷۴ ایران ۲۵' },
  { name: 'بهنام حیدری نژاد', phone: '۰۹۱۲۳۱۸۹۰۴۴', plate: '۸۸ ع ۲۲۳ ایران ۱۱' },
  { name: 'صادق معتمدی', phone: '۰۹۳۵۶۶۱۸۲۹۹', plate: '۳۳ ع ۷۱۸ ایران ۶۲' },
  { name: 'مجید قنبری', phone: '۰۹۱۸۴۴۰۱۱۸۸', plate: '۴۲ ع ۱۹۹ ایران ۲۸' },
];

export function convertBatchRowsToActiveLoads(
  rows: BatchShipmentRow[],
  batchCode?: string,
  carrierIdOrMap?: string | Record<string, string>
): ShipperActiveLoad[] {
  const currentTimestamp = Date.now();

  return rows.map((row, index) => {
    const driver = SAMPLE_DRIVERS[index % SAMPLE_DRIVERS.length];
    const trackingCode = `TRK-${Math.floor(100000 + Math.random() * 900000)}`;
    const billOfLadingNo = `BL-1403-${Math.floor(8000 + Math.random() * 1900)}`;
    const loadId = `SHP-${currentTimestamp.toString().slice(-4)}${index + 1}`;

    // Resolve carrier for this specific row
    let targetCarrierId = typeof carrierIdOrMap === 'string' ? carrierIdOrMap : carrierIdOrMap?.[row.id];
    if (!targetCarrierId) {
      targetCarrierId = 'org-carrier-pg-freight';
    }
    const carrierProfile = CARRIER_ORGANIZATIONS.find((c) => c.id === targetCarrierId) || CARRIER_ORGANIZATIONS[0];

    // Cycle through realistic status distributions
    let status: ShipperActiveLoad['status'] = 'in_transit';
    let statusLabelFa = 'در مسیر به سمت مقصد';
    let progressPercent = Math.floor(35 + (index * 13) % 50);
    let currentLocation = `محور جاده‌ای ${row.originCity} به سمت ${row.destCity} (کیلومتر ${Math.floor(60 + (index * 45) % 300)})`;

    if (index % 4 === 0) {
      status = 'loading';
      statusLabelFa = 'در حال بارگیری در مبدأ';
      progressPercent = 12;
      currentLocation = row.originHub || `انبار مرکزی ${row.originCity}`;
    } else if (index % 4 === 3) {
      status = 'pending_driver';
      statusLabelFa = 'در صف تخصیص و اعزام ناوگان';
      progressPercent = 0;
      currentLocation = `پایانه باربری ${row.originCity}`;
    }

    return {
      id: loadId,
      trackingCode,
      billOfLadingNo,
      originCity: row.originCity,
      originHub: row.originHub || `انبار مرکزی ${row.originCity}`,
      destCity: row.destCity,
      destHub: row.destHub || `پایانه تخلیه ${row.destCity}`,
      cargoType: row.cargoTitle ? `${row.cargoTitle} (${row.cargoType})` : row.cargoType,
      weightTons: row.weightTons,
      truckType: row.truckType,
      driverName: status === 'pending_driver' ? 'در حال تخصیص هوشمند' : driver.name,
      driverPhone: status === 'pending_driver' ? '۰۲۱-۸۸۰۰۰۰۰۰ (پشتیبانی)' : driver.phone,
      truckPlate: status === 'pending_driver' ? 'تخصیص تا ۱۵ دقیقه آینده' : driver.plate,
      status,
      statusLabelFa,
      departureTime: `${row.loadingDate || '۱۴۰۳/۰۶/۱۰'} - ۰۸:۳۰`,
      estimatedArrival: `${row.loadingDate || '۱۴۰۳/۰۶/۱۰'} - ۱۸:۰۰`,
      progressPercent,
      currentLocation,
      totalCostRials: row.finalPriceRials,
      insuranceValuationRials: (row.cargoValueToman || 250000000) * 10,
      podSigned: false,
      carrierId: carrierProfile.id,
      carrierName: carrierProfile.nameFa,
      carrierLogo: carrierProfile.logoText,
      carrierRating: carrierProfile.rating,
      carrierPhone: carrierProfile.phone,
      carrierAddress: carrierProfile.address,
      carrierLicenseNo: carrierProfile.licenseNumber,
      carrierNationalId: carrierProfile.nationalId,
      carrierEconomicCode: carrierProfile.economicCode,
      carrierRegistrationNo: carrierProfile.registrationNo,
      carrierSelectionMode: 'managed',
    };
  });
}

