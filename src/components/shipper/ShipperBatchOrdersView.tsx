import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  FileText,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Sparkles,
  Layers,
  Code,
  Key,
  Truck,
  Building,
  Calculator,
  RefreshCw,
  Plus,
  Trash2,
  Edit2,
  Check,
  Eye,
  ExternalLink,
  ChevronDown,
  Info,
  ShieldCheck,
  Zap,
  Play,
  FileCheck2,
  Sliders,
  HelpCircle,
  FileUp,
} from 'lucide-react';
import {
  SAMPLE_BATCH_SHIPMENTS,
  INITIAL_BATCH_HISTORIES,
  BatchShipmentRow,
  BatchUploadHistory,
  ShipperActiveLoad,
} from '../../data/mockShipperData';
import { usePricing } from '../../store/PricingContext';
import {
  parseUploadedBatchFile,
  downloadGenuineTemplate,
  calculateBatchRowPrice,
  convertBatchRowsToActiveLoads,
} from '../../utils/excelBatchParser';

interface ShipperBatchOrdersViewProps {
  onNavigateTab?: (tabId: string) => void;
  onBatchSubmitted?: (count: number, createdLoads?: ShipperActiveLoad[]) => void;
}

// Preset pre-configured sample datasets for quick testing
const PRESET_DATASETS: {
  id: string;
  name: string;
  fileName: string;
  desc: string;
  rows: BatchShipmentRow[];
}[] = [
  {
    id: 'msc_steel',
    name: 'سفارشات کویل و ورق فولادی (۵ محموله سنگین)',
    fileName: 'Mubarakeh_Steel_Batch_5Loads.xlsx',
    desc: 'مبدا: اصفهان و اهواز به مقاصد تهران، شیراز و مشهد - تناژ بالا',
    rows: [
      {
        id: 'st-1',
        rowNumber: 1,
        originCity: 'اصفهان',
        destCity: 'تهران',
        originHub: 'مجتمع فولاد مبارکه - انبار نورد گرم',
        destHub: 'شهرک صنعتی شمس‌آباد - فاز ۳',
        cargoType: 'صنعتی و فلزی',
        cargoTitle: 'کویل ورق فولادی ST37 (۲۲ تن)',
        weightTons: 22.0,
        truckType: 'تریلر کفی ۱۸ چرخ',
        cargoValueToman: 380000000,
        estimatedPriceRials: 145000000,
        discountRials: 10150000,
        finalPriceRials: 134850000,
        loadingDate: '۱۴۰۳/۰۶/۰۵',
        status: 'valid',
        validationMessage: 'اطلاعات کامل و آماده صدور بارنامه',
        senderName: 'فولاد مبارکه اصفهان',
        receiverName: 'ایران خودرو دیزل',
      },
      {
        id: 'st-2',
        rowNumber: 2,
        originCity: 'اهواز',
        destCity: 'تهران',
        originHub: 'لوله و نورد خوزستان',
        destHub: 'انبار شادآباد آهن مکان',
        cargoType: 'لوله فولادی',
        cargoTitle: 'شاخه لوله بدون درز مانیسمان صنعتی (۲۴ تن)',
        weightTons: 24.0,
        truckType: 'تریلر کفی ۱۸ چرخ',
        cargoValueToman: 420000000,
        estimatedPriceRials: 178000000,
        discountRials: 12460000,
        finalPriceRials: 165540000,
        loadingDate: '۱۴۰۳/۰۶/۰۵',
        status: 'valid',
        validationMessage: 'مهار بار و پلمپ الکترونیک تایید شد',
        senderName: 'فولاد خوزستان',
        receiverName: 'پارس لوله تهران',
      },
      {
        id: 'st-3',
        rowNumber: 3,
        originCity: 'اصفهان',
        destCity: 'مشهد',
        originHub: 'ذوب‌آهن اصفهان - انبار خروجی',
        destHub: 'انبار مرکزی طرق مشهد',
        cargoType: 'میلگرد و پروفیل',
        cargoTitle: 'بندیل میلگرد آجدار A3 سایز ۱۸ (۲۳ تن)',
        weightTons: 23.0,
        truckType: 'تریلر کفی ۱۸ چرخ',
        cargoValueToman: 390000000,
        estimatedPriceRials: 215000000,
        discountRials: 15050000,
        finalPriceRials: 199950000,
        loadingDate: '۱۴۰۳/۰۶/۰۶',
        status: 'valid',
        validationMessage: 'مسیر آزادراهی با ETA ۲۸ ساعت',
        senderName: 'ذوب‌آهن اصفهان',
        receiverName: 'سازه بتن خراسان',
      },
      {
        id: 'st-4',
        rowNumber: 4,
        originCity: 'یزد',
        destCity: 'تبریز',
        originHub: 'شهرک فولاد آلیاژی یزد',
        destHub: 'منطقه صنعتی چرمشهر تبریز',
        cargoType: 'شمش آلیاژی',
        cargoTitle: 'شمش فولاد فورجینگ آلیاژی (۲۰ تن)',
        weightTons: 20.0,
        truckType: 'تریلی لبه‌دار',
        cargoValueToman: 450000000,
        estimatedPriceRials: 228000000,
        discountRials: 15960000,
        finalPriceRials: 212040000,
        loadingDate: '۱۴۰۳/۰۶/۰۷',
        status: 'valid',
        validationMessage: 'بیمه ارزش افزوده آلیاژی اعمال شد',
        senderName: 'فولاد آلیاژی ایران',
        receiverName: 'تراکتورسازی تبریز',
      },
      {
        id: 'st-5',
        rowNumber: 5,
        originCity: 'قزوین',
        destCity: 'شیراز',
        originHub: 'شهرک صنعتی کاسپین',
        destHub: 'منطقه ویژه اقتصادی شیراز',
        cargoType: 'کاشی و سرامیک',
        cargoTitle: 'پالت کاشی پرسلان صادراتی (۱۵ تن)',
        weightTons: 15.0,
        truckType: 'کامیون تک ۱۰ چرخ',
        cargoValueToman: 160000000,
        estimatedPriceRials: 118000000,
        discountRials: 8260000,
        finalPriceRials: 109740000,
        loadingDate: '۱۴۰۳/۰۶/۰۸',
        status: 'warning',
        validationMessage: 'وزن بار نیازمند مهار دوبل و گوه است',
        senderName: 'سرامیک البرز',
        receiverName: 'بازرگانی فارس',
      },
    ],
  },
  {
    id: 'petro_chem',
    name: 'سفارشات پتروشیمی و رزین (۷ محموله چادری و تانکر)',
    fileName: 'Petrochemical_Export_Consignment_7Loads.csv',
    desc: 'مبدا: بندرعباس، عسلویه و ماهشهر به تبریز، مشهد و تهران',
    rows: [
      {
        id: 'pt-1',
        rowNumber: 1,
        originCity: 'بندرعباس',
        destCity: 'تهران',
        originHub: 'اسکله شهید رجایی - پایانه صادرات',
        destHub: 'انبار شورآباد کهریزک',
        cargoType: 'پتروشیمی',
        cargoTitle: 'پالت گرانول پلی‌پروپیلن PP (۲۱ تن)',
        weightTons: 21.0,
        truckType: 'تریلی چادری ترانزیت',
        cargoValueToman: 510000000,
        estimatedPriceRials: 265000000,
        discountRials: 18550000,
        finalPriceRials: 246450000,
        loadingDate: '۱۴۰۳/۰۶/۰۶',
        status: 'valid',
        validationMessage: 'پلمپ گمرکی و استاندارد ترانزیت فعال',
        senderName: 'پتروشیمی جم',
        receiverName: 'پلیمر تهران',
      },
      {
        id: 'pt-2',
        rowNumber: 2,
        originCity: 'بندرعباس',
        destCity: 'اصفهان',
        originHub: 'مجتمع خلیج فارس رجایی',
        destHub: 'شهرک صنعتی جی اصفهان',
        cargoType: 'پتروشیمی',
        cargoTitle: 'کیسه پلی‌اتیلن سنگین HDPE (۲۲ تن)',
        weightTons: 22.0,
        truckType: 'تریلی چادری ترانزیت',
        cargoValueToman: 440000000,
        estimatedPriceRials: 198000000,
        discountRials: 13860000,
        finalPriceRials: 184140000,
        loadingDate: '۱۴۰۳/۰۶/۰۶',
        status: 'valid',
        validationMessage: 'تاییدیه انبارداری و تحویل سریع',
        senderName: 'پتروشیمی مارون',
        receiverName: 'صنایع پلاستیک اصفهان',
      },
      {
        id: 'pt-3',
        rowNumber: 3,
        originCity: 'بندر ماهشهر',
        destCity: 'تبریز',
        originHub: 'منطقه ویژه پتروشیمی ماهشهر',
        destHub: 'شهرک صنعتی سلیمی تبریز',
        cargoType: 'شیمیایی مایع',
        cargoTitle: 'تانکر ایزوسیانات مایع MDI (۲۴ تن)',
        weightTons: 24.0,
        truckType: 'تانکر استیل ۳ محفظه',
        cargoValueToman: 680000000,
        estimatedPriceRials: 320000000,
        discountRials: 22400000,
        finalPriceRials: 297600000,
        loadingDate: '۱۴۰۳/۰۶/۰۷',
        status: 'valid',
        validationMessage: 'گواهی حمل مواد شیمیایی ADR و کد UN ثبت شد',
        senderName: 'پتروشیمی کارون',
        receiverName: 'فوم پلی‌یورتان غرب',
      },
      {
        id: 'pt-4',
        rowNumber: 4,
        originCity: 'عسلویه',
        destCity: 'مشهد',
        originHub: 'پایانه پارس جنوبی',
        destHub: 'انبار پخش خاوران مشهد',
        cargoType: 'کود شیمیایی',
        cargoTitle: 'کود اوره گرانول ۵۰ کیلویی (۲۲ تن)',
        weightTons: 22.0,
        truckType: 'تریلی لبه‌دار کفی',
        cargoValueToman: 260000000,
        estimatedPriceRials: 310000000,
        discountRials: 21700000,
        finalPriceRials: 288300000,
        loadingDate: '۱۴۰۳/۰۶/۰۸',
        status: 'valid',
        validationMessage: 'محاسبه مسافت ۱۶۵۰ کیلومتری و کرایه مصوب',
        senderName: 'پتروشیمی پردیس',
        receiverName: 'خدمات حمایتی کشاورزی خراسان',
      },
      {
        id: 'pt-5',
        rowNumber: 5,
        originCity: 'اراک',
        destCity: 'رشت',
        originHub: 'پتروشیمی شازند اراک',
        destHub: 'انبار لاکان رشت',
        cargoType: 'پلیمر مایع',
        cargoTitle: 'بشکه پلی‌اتر پلی‌ال (۱۶ تن)',
        weightTons: 16.0,
        truckType: 'کامیون جفت ۱۰ چرخ',
        cargoValueToman: 310000000,
        estimatedPriceRials: 132000000,
        discountRials: 9240000,
        finalPriceRials: 122760000,
        loadingDate: '۱۴۰۳/۰۶/۰۹',
        status: 'valid',
        validationMessage: 'آماده تخصیص ناوگان',
        senderName: 'پتروشیمی شازند',
        receiverName: 'کاسپین فوم گیلان',
      },
      {
        id: 'pt-6',
        rowNumber: 6,
        originCity: 'اصفهان',
        destCity: 'یزد',
        originHub: 'انبار رازی اصفهان',
        destHub: 'شهرک صنعتی یزد',
        cargoType: 'گرانول پلاستیک',
        cargoTitle: 'پالت مستربچ رنگی صنعتی (۱۰ تن)',
        weightTons: 10.0,
        truckType: 'کامیون تک ۶ چرخ',
        cargoValueToman: 180000000,
        estimatedPriceRials: 65000000,
        discountRials: 4550000,
        finalPriceRials: 60450000,
        loadingDate: '۱۴۰۳/۰۶/۱۰',
        status: 'valid',
        validationMessage: 'تخلیه در همان روز (مسافت ۳۲۰ کیلومتر)',
        senderName: 'رنگدانه‌های البرز',
        receiverName: 'صنایع پلاستیک یزد',
      },
      {
        id: 'pt-7',
        rowNumber: 7,
        originCity: 'تهران',
        destCity: 'کرمان',
        originHub: 'شهرک رازی شهرری',
        destHub: 'منطقه صنعتی خضراء کرمان',
        cargoType: 'بسته‌بندی صنعتی',
        cargoTitle: 'رول فیلم استرچ و نایلون حبابدار (۸ تن)',
        weightTons: 8.0,
        truckType: 'کامیونت مسقف فلزی',
        cargoValueToman: 140000000,
        estimatedPriceRials: 89000000,
        discountRials: 6230000,
        finalPriceRials: 82770000,
        loadingDate: '۱۴۰۳/۰۶/۱۱',
        status: 'valid',
        validationMessage: 'بار حجمی با ضریب مسقف فلزی',
        senderName: 'پارس پلاستیک نوین',
        receiverName: 'بسته‌بندی کرمان پارت',
      },
    ],
  },
];

export const ShipperBatchOrdersView: React.FC<ShipperBatchOrdersViewProps> = ({
  onNavigateTab,
  onBatchSubmitted,
}) => {
  const { userOrgName } = usePricing();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sub-tabs
  const [activeSubTab, setActiveSubTab] = useState<'upload' | 'history' | 'api_integration'>('upload');

  // File Upload & Parsing States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileNameDisplay, setFileNameDisplay] = useState<string>('MSC_Orders_Week36_Production.xlsx');
  const [fileSizeDisplay, setFileSizeDisplay] = useState<string>('148 KB');
  const [fileStatus, setFileStatus] = useState<'ready_to_parse' | 'parsing' | 'parsed' | 'idle'>('parsed');
  
  // Step by step parsing animation indicator
  const [parsingStep, setParsingStep] = useState<number>(0);
  const [parsingProgress, setParsingProgress] = useState<number>(0);
  const [parsingMessage, setParsingMessage] = useState<string>('');

  // Active extracted rows & histories
  const [rows, setRows] = useState<BatchShipmentRow[]>(SAMPLE_BATCH_SHIPMENTS);
  const [histories, setHistories] = useState<BatchUploadHistory[]>(INITIAL_BATCH_HISTORIES);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'valid' | 'warning' | 'error'>('all');
  const [parsedBannerShow, setParsedBannerShow] = useState(false);

  // Totals calculations
  const totalRowsCount = rows.length;
  const validRowsCount = rows.filter((r) => r.status === 'valid').length;
  const warningRowsCount = rows.filter((r) => r.status === 'warning').length;
  const errorRowsCount = rows.filter((r) => r.status === 'error').length;
  const totalWeightTons = rows.reduce((sum, r) => sum + r.weightTons, 0);
  const totalEstimatedPriceRials = rows.reduce((sum, r) => sum + r.estimatedPriceRials, 0);
  const totalDiscountRials = rows.reduce((sum, r) => sum + r.discountRials, 0);
  const totalFinalPriceRials = rows.reduce((sum, r) => sum + r.finalPriceRials, 0);

  // Filtered rows for preview table
  const filteredRows = rows.filter((r) => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

  // Handle file chosen from file input or drag-and-drop
  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    setFileNameDisplay(file.name);
    setFileSizeDisplay(`${Math.round(file.size / 1024) || 120} KB`);
    setFileStatus('ready_to_parse');
    setIsSubmittedSuccess(false);
    setParsedBannerShow(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Load a preset dataset scenario
  const handleSelectPreset = (presetId: string) => {
    const preset = PRESET_DATASETS.find((p) => p.id === presetId);
    if (!preset) return;
    setFileNameDisplay(preset.fileName);
    setFileSizeDisplay('132 KB');
    setSelectedFile(new File([''], preset.fileName, { type: 'application/vnd.ms-excel' }));
    setFileStatus('ready_to_parse');
    setIsSubmittedSuccess(false);
    setParsedBannerShow(false);
  };

  // THE KEY PARSING ACTION: Read file, recognize cities, cargo, tons, and compute freight costs
  const handleExecuteParsingAndCalculation = async () => {
    setFileStatus('parsing');
    setParsingProgress(15);
    setParsingStep(1);
    setParsingMessage('در حال بازخوانی ردیف‌ها و بررسی ساختار ستون‌های فایل اکسل...');

    try {
      // Step 1: Read file content
      let extracted: BatchShipmentRow[] = [];

      // If user uploaded a real file (not an empty dummy preset file)
      if (selectedFile && selectedFile.size > 0) {
        await new Promise((r) => setTimeout(r, 400));
        setParsingProgress(45);
        setParsingStep(2);
        setParsingMessage('تطبیق هوشمند مبادی، مقاصد، انبارهای بارگیری و مسافت جاده‌ای...');

        const parseResult = await parseUploadedBatchFile(selectedFile);
        extracted = parseResult.rows;

        await new Promise((r) => setTimeout(r, 400));
        setParsingProgress(80);
        setParsingStep(3);
        setParsingMessage('محاسبه تعرفه پایه تن-کیلومتر، ارزش بیمه و اعمال ۷٪ تخفیف قرارداد شرکتی...');

        await new Promise((r) => setTimeout(r, 350));
        setParsingProgress(100);
        setParsingStep(4);
        setParsingMessage(`خوانش فایل با موفقیت پایان یافت: ${extracted.length} محموله شناسایی و قیمت‌گذاری شد.`);
      } else {
        // Preset dataset scenario
        await new Promise((r) => setTimeout(r, 400));
        setParsingProgress(50);
        setParsingStep(2);
        setParsingMessage('تطبیق هوشمند مبادی، مقاصد، انبارهای بارگیری و مسافت جاده‌ای...');

        const matchedPreset = PRESET_DATASETS.find((p) => p.fileName === fileNameDisplay);
        if (matchedPreset) {
          extracted = matchedPreset.rows;
        } else {
          extracted = SAMPLE_BATCH_SHIPMENTS.map((r, idx) => {
            const pricing = calculateBatchRowPrice(r.originCity, r.destCity, r.weightTons, r.truckType, r.cargoValueToman);
            return {
              ...r,
              id: `parsed-${Date.now()}-${idx}`,
              rowNumber: idx + 1,
              estimatedPriceRials: pricing.estimatedRials,
              discountRials: pricing.discountRials,
              finalPriceRials: pricing.finalRials,
              status: 'valid',
            };
          });
        }

        await new Promise((r) => setTimeout(r, 400));
        setParsingProgress(80);
        setParsingStep(3);
        setParsingMessage('محاسبه تعرفه پایه تن-کیلومتر، ارزش بیمه و اعمال ۷٪ تخفیف قرارداد شرکتی...');

        await new Promise((r) => setTimeout(r, 350));
        setParsingProgress(100);
        setParsingStep(4);
        setParsingMessage('محاسبه و تجمیع مبالغ نهایی با موفقیت تکمیل گردید.');
      }

      setRows(extracted);
      setFileStatus('parsed');
      setParsedBannerShow(true);
    } catch (err: any) {
      console.error('Error parsing batch file:', err);
      setFileStatus('ready_to_parse');
      alert(`خطا در بازخوانی فایل اکسل: ${err.message || 'فرمت فایل نامعتبر است'}. لطفاً از قالب استاندارد اکسل استفاده فرمایید.`);
    }
  };

  // Download genuine standard Excel/CSV template using xlsx
  const handleDownloadTemplate = (format: 'xlsx' | 'csv') => {
    downloadGenuineTemplate(format);
  };

  // Delete a row
  const handleDeleteRow = (id: string) => {
    setRows(rows.filter((r) => r.id !== id));
  };

  // Submit batch orders
  const handleSubmitBatch = () => {
    if (errorRowsCount > 0) {
      alert('لطفاً ردیف‌های دارای خطا را قبل از ثبت نهایی اصلاح یا حذف فرمایید.');
      return;
    }

    const batchCode = `BAT-1403-${Math.floor(1000 + Math.random() * 9000)}`;
    const newHistory: BatchUploadHistory = {
      id: `batch-1403-${Math.floor(100 + Math.random() * 900)}`,
      fileName: fileNameDisplay,
      fileSizeKb: 145,
      uploadDate: '۱۴۰۳/۰۶/۰۱ - همین الان',
      totalRows: rows.length,
      validRows: rows.length,
      totalPriceRials: totalFinalPriceRials,
      status: 'submitted',
      batchCode,
    };

    const createdLoads = convertBatchRowsToActiveLoads(rows, batchCode);

    setHistories([newHistory, ...histories]);
    setIsSubmittedSuccess(true);
    if (onBatchSubmitted) {
      onBatchSubmitted(rows.length, createdLoads);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Overview & Actions Banner (Clean Light & Refined) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-bold shrink-0">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold font-title text-slate-900">
                  ثبت دسته‌ای بارها (Bulk & Batch Booking)
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                  آپلود اکسل / CSV و وب‌سرویس API
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                خوانش هوشمند فایل اکسل، تشخیص خودکار مبادی و مقاصد و محاسبه نرخ تن-کیلومتر با تخفیف قرارداد سازمانی
              </p>
            </div>
          </div>

          {/* Quick Sub-tab selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold shrink-0">
            <button
              type="button"
              onClick={() => setActiveSubTab('upload')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeSubTab === 'upload'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UploadCloud className="w-4 h-4 text-amber-600" />
              <span>بارگذاری و پردازش فایل</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('history')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeSubTab === 'history'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4 text-blue-600" />
              <span>تاریخچه دسته‌ها ({histories.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('api_integration')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeSubTab === 'api_integration'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code className="w-4 h-4 text-teal-600" />
              <span>اتصال مستقیم به ERP و وب‌سرویس</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Workstation Sub-Views */}
      {activeSubTab === 'upload' && (
        <div className="space-y-6">
          {/* Upload Dropzone & Preset Scenarios Strip */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Dropzone & Parse Action Center (8 cols) */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 font-title flex items-center gap-1.5">
                  <FileUp className="w-4 h-4 text-amber-600" />
                  <span>انتخاب یا رهاسازی فایل اکسل سفارشات</span>
                </span>
                <span className="text-[11px] text-slate-400 font-mono">فرمت‌های مجاز: .xlsx, .xls, .csv</span>
              </div>

              {/* Drag and Drop Container */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-amber-500 bg-amber-50/50 scale-[0.99]'
                    : fileStatus === 'ready_to_parse'
                    ? 'border-amber-400 bg-amber-50/30'
                    : 'border-slate-300 hover:border-amber-400 bg-slate-50/60 hover:bg-amber-50/20'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelected(e.target.files[0]);
                    }
                  }}
                />

                <div className="w-12 h-12 rounded-2xl bg-amber-100/80 text-amber-700 mx-auto flex items-center justify-center mb-2.5">
                  <UploadCloud className="w-6 h-6 animate-bounce" />
                </div>

                <h3 className="text-sm font-bold text-slate-900 font-title">
                  فایل اکسل یا CSV سفارشات را اینجا رها کنید یا کلیک نمایید
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  سامانه به صورت خودکار ستون‌های مبدأ، مقصد، وزن و نوع ناوگان را شناسایی می‌کند
                </p>

                {/* Selected File Badge */}
                {fileNameDisplay && (
                  <div className="inline-flex items-center gap-2.5 mt-3.5 px-4 py-2 bg-white border border-amber-300 rounded-xl text-xs font-bold text-amber-950 shadow-2xs">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>فایل انتخاب‌شده: <strong>{fileNameDisplay}</strong></span>
                    <span className="font-mono text-[11px] text-slate-500">({fileSizeDisplay})</span>
                    {fileStatus === 'ready_to_parse' && (
                      <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">
                        آماده پردازش
                      </span>
                    )}
                    {fileStatus === 'parsed' && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                        پردازش‌شده
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* THE MAIN ACTION BUTTON REQUESTED BY USER: Parse & Calculate Button */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                <div className="space-y-1 text-right">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-xs sm:text-sm font-title text-white">
                      موتور هوشمند استخراج بارنامه و استعلام هزینه
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    با زدن دکمه روبرو، محتوای فایل خوانده شده، مسافت‌ها تخمین زده می‌شود و فاکتور نهایی دسته صادر خواهد شد.
                  </p>
                </div>

                <button
                  type="button"
                  id="btn-execute-excel-parsing"
                  onClick={handleExecuteParsingAndCalculation}
                  disabled={fileStatus === 'parsing'}
                  className={`px-6 py-3.5 rounded-xl font-bold text-xs flex items-center gap-2.5 shadow-md transition-all cursor-pointer shrink-0 ${
                    fileStatus === 'parsing'
                      ? 'bg-amber-600/70 text-white cursor-wait'
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white hover:scale-[1.02] shadow-amber-500/30'
                  }`}
                >
                  {fileStatus === 'parsing' ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>در حال خوانش و محاسبه هزینه‌ها...</span>
                    </>
                  ) : (
                    <>
                      <Calculator className="w-4 h-4 text-white" />
                      <span>خواندن فایل و محاسبه خودکار هزینه‌ها</span>
                    </>
                  )}
                </button>
              </div>

              {/* Parsing Progress Bar State */}
              {fileStatus === 'parsing' && (
                <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-2xl space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-950">
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                      {parsingMessage}
                    </span>
                    <span className="font-mono">{parsingProgress}٪</span>
                  </div>
                  <div className="w-full h-2 bg-amber-200/80 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-300 rounded-full"
                      style={{ width: `${parsingProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Quick Sample Presets Bar */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-600 block mb-2">
                  یا جهت تست سریع، یکی از فایل‌های نمونه استاندارد زیر را انتخاب کنید:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PRESET_DATASETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset.id)}
                      className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer flex items-center justify-between text-xs ${
                        fileNameDisplay === preset.fileName
                          ? 'bg-amber-50 border-amber-400 text-amber-950 font-bold'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{preset.name}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-1">{preset.desc}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono shrink-0">
                        {preset.rows.length} بار
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Template Download & ERP Guide (4 cols) */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs font-title">
                  <Download className="w-4 h-4 text-amber-600" />
                  <span>دانلود قالب اکسل استاندارد ثبت بار</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  برای جلوگیری از خطای پردازش ستون‌ها، پیشنهاد می‌شود از قالب استاندارد اکسل شامل ستون‌های مبدا، مقصد، نوع ناوگان، وزن و ارزش کالا استفاده فرمایید.
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleDownloadTemplate('xlsx')}
                    className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>قالب Excel (.xlsx)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadTemplate('csv')}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-slate-600" />
                    <span>قالب متنی CSV</span>
                  </button>
                </div>
              </div>

              {/* ERP Integration Callout Box */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-[11px] space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                  <Code className="w-3.5 h-3.5 text-teal-600" />
                  <span>اتصال سیستمی برای مشتریان ERP</span>
                </div>
                <p className="text-slate-500 leading-relaxed">
                  برای شرکت‌های دارای سامانه SAP، راهکاران یا سیستم‌های انبارداری داخلی، امکان اتصال وب‌سرویس مستقیم بدون نیاز به فایل نیز فراهم است.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('api_integration')}
                  className="text-teal-700 font-bold hover:underline flex items-center gap-1 mt-1 text-[11px] cursor-pointer"
                >
                  <span>مشاهده وب‌سرویس API و کلید اختصاصی</span>
                  <ArrowRight className="w-3 h-3 rotate-180" />
                </button>
              </div>
            </div>
          </div>

          {/* 3. Summary Price & Totals Ribbon (Calculated automatically from parsed rows) */}
          <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50 border border-amber-200/80 rounded-3xl p-5 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                <div className="space-y-0.5">
                  <span className="text-[11px] text-slate-500 font-medium block">تعداد سفارشات دسته:</span>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-base font-bold text-slate-900 font-mono">{totalRowsCount}</strong>
                    <span className="text-[11px] text-slate-500">بارنامه</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                      {validRowsCount} معتبر
                    </span>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[11px] text-slate-500 font-medium block">مجموع تناژ محموله‌ها:</span>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-base font-bold text-slate-900 font-mono">{totalWeightTons}</strong>
                    <span className="text-[11px] text-slate-500">تن خالص</span>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[11px] text-slate-500 font-medium block">تخفیف قرارداد طلایی:</span>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-base font-bold text-emerald-700 font-mono">
                      {(totalDiscountRials / 10).toLocaleString('fa-IR')}
                    </strong>
                    <span className="text-[11px] text-emerald-800 font-medium">تومان (۷٪)</span>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[11px] text-slate-700 font-bold block">مبلغ کل قابل پرداخت دسته:</span>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-lg font-black text-amber-900 font-mono">
                      {(totalFinalPriceRials / 10).toLocaleString('fa-IR')}
                    </strong>
                    <span className="text-xs font-bold text-amber-950">تومان</span>
                  </div>
                </div>
              </div>

              {/* Submit Final Batch Button */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  id="btn-submit-final-batch"
                  onClick={handleSubmitBatch}
                  disabled={isSubmittedSuccess || totalRowsCount === 0}
                  className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer ${
                    isSubmittedSuccess
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-amber-500/20'
                  }`}
                >
                  {isSubmittedSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>دسته با موفقیت ثبت و به دیسپچینگ ارجاع شد</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>تأیید نهایی و صدور همزمان {totalRowsCount} بارنامه</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Success Banner */}
          {isSubmittedSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-3xl p-4 sm:p-5 text-emerald-900 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs font-title">
                    سفارشات دسته‌ای با کد پیگیری اختصاصی ثبت شد!
                  </h4>
                  <p className="text-[11px] text-emerald-800">
                    ناوگان‌های مورد نیاز تخصیص داده شده و صورتحساب تجمیعی در بخش امور مالی قابل دریافت است.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onNavigateTab && onNavigateTab('shipments')}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  رهگیری بارها در جدول حمل
                </button>
              </div>
            </div>
          )}

          {/* 4. Detailed Preview Table with Row-by-Row breakdown */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Table Header Controls */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-bold text-slate-900 font-title">
                  پیش‌نمایش تفکیکی ردیف‌های فایل ({filteredRows.length} ردیف)
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  (محاسبه قیمت آنی بر اساس تعرفه راهداری و تخفیف شرکتی)
                </span>
              </div>

              {/* Status Filter Chips */}
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setFilterStatus('all')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    filterStatus === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-200/80 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  همه ({rows.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('valid')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    filterStatus === 'valid'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  معتبر ({validRowsCount})
                </button>
                {warningRowsCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setFilterStatus('warning')}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      filterStatus === 'warning'
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                    }`}
                  >
                    دارای هشدار ({warningRowsCount})
                  </button>
                )}
                {errorRowsCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setFilterStatus('error')}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      filterStatus === 'error'
                        ? 'bg-rose-600 text-white'
                        : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                    }`}
                  >
                    خطادار ({errorRowsCount})
                  </button>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                    <th className="p-3 text-center w-12">ردیف</th>
                    <th className="p-3">مسیر (مبدأ ➔ مقصد)</th>
                    <th className="p-3">شرح محموله و نوع بار</th>
                    <th className="p-3">وزن (تن)</th>
                    <th className="p-3">نوع ناوگان درخواستی</th>
                    <th className="p-3">تاریخ بارگیری</th>
                    <th className="p-3 text-left">کرایه پایه (تومان)</th>
                    <th className="p-3 text-left">تخفیف قرارداد</th>
                    <th className="p-3 text-left">مبلغ نهایی (تومان)</th>
                    <th className="p-3 text-center">وضعیت صحت</th>
                    <th className="p-3 text-center w-16">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredRows.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 text-center font-mono text-slate-400 font-bold">
                        {row.rowNumber}
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{row.originCity}</span>
                          <span className="text-slate-400">➔</span>
                          <span>{row.destCity}</span>
                        </div>
                        {row.originHub && (
                          <span className="text-[10px] text-slate-400 block truncate max-w-[180px]">
                            {row.originHub}
                          </span>
                        )}
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-slate-800">{row.cargoTitle}</div>
                        <span className="text-[10px] text-slate-400">{row.cargoType}</span>
                      </td>

                      <td className="p-3 font-mono font-bold text-slate-800">
                        {row.weightTons} تن
                      </td>

                      <td className="p-3 text-slate-700">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-bold">
                          {row.truckType}
                        </span>
                      </td>

                      <td className="p-3 font-mono text-slate-600 text-[11px]">
                        {row.loadingDate}
                      </td>

                      <td className="p-3 text-left font-mono text-slate-500">
                        {(row.estimatedPriceRials / 10).toLocaleString('fa-IR')}
                      </td>

                      <td className="p-3 text-left font-mono text-emerald-700 font-bold">
                        -{(row.discountRials / 10).toLocaleString('fa-IR')}
                      </td>

                      <td className="p-3 text-left font-mono font-bold text-slate-900">
                        {(row.finalPriceRials / 10).toLocaleString('fa-IR')}
                      </td>

                      <td className="p-3 text-center">
                        {row.status === 'valid' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            معتبر
                          </span>
                        )}
                        {row.status === 'warning' && (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold"
                            title={row.validationMessage}
                          >
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            بررسی مجدد
                          </span>
                        )}
                        {row.status === 'error' && (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-bold"
                            title={row.validationMessage}
                          >
                            <XCircle className="w-3 h-3 text-rose-600" />
                            خطای داده
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteRow(row.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="حذف این ردیف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. History Sub-View */}
      {activeSubTab === 'history' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-900 font-title">
                آرشیو و تاریخچه دسته‌های بارگذاری‌شده
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              تعداد: {histories.length} دسته
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-100/80 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                  <th className="p-3">کد دسته (Batch ID)</th>
                  <th className="p-3">نام فایل</th>
                  <th className="p-3">تاریخ و زمان آپلود</th>
                  <th className="p-3 text-center">تعداد بارنامه‌ها</th>
                  <th className="p-3 text-left">مجموع مبلغ فاکتور (تومان)</th>
                  <th className="p-3 text-center">وضعیت پردازش</th>
                  <th className="p-3 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {histories.map((hist) => (
                  <tr key={hist.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-mono font-bold text-amber-900">
                      {hist.batchCode}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-slate-800">{hist.fileName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({hist.fileSizeKb} KB)</span>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-slate-600 text-[11px]">
                      {hist.uploadDate}
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-slate-800">
                      {hist.totalRows} سفارش
                    </td>
                    <td className="p-3 text-left font-mono font-bold text-slate-900">
                      {(hist.totalPriceRials / 10).toLocaleString('fa-IR')}
                    </td>
                    <td className="p-3 text-center">
                      {hist.status === 'completed' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          تکمیل و صادر شده
                        </span>
                      )}
                      {hist.status === 'submitted' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold">
                          در صف تخصیص راننده
                        </span>
                      )}
                      {hist.status === 'draft' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300 text-[10px] font-bold">
                          پیش‌نویس
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveSubTab('upload');
                          setFileNameDisplay(hist.fileName);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        مشاهده ردیف‌ها
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. API & ERP Integration Sub-View */}
      {activeSubTab === 'api_integration' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Documentation & JSON Schema (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                  <Code className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs font-title text-slate-900">
                    مستندات وب‌سرویس RESTful ثبت دسته‌ای بارنامه (ERP Endpoint)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    ارسال مستقیم لیست سفارشات از پایگاه داده و نرم‌افزار انبارداری شرکت شما
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 font-mono text-[11px] font-bold">
                POST /api/v2/loads/batch
              </span>
            </div>

            {/* Code Snippet */}
            <div className="bg-slate-900 rounded-2xl p-4 text-left font-mono text-xs text-slate-200 overflow-x-auto direction-ltr">
              <div className="text-slate-400 mb-2">// cURL Example: Submit 50+ loads programmatically</div>
              <pre className="text-amber-400">
{`curl -X POST https://api.logistics-platform.ir/v2/loads/batch \\
  -H "Authorization: Bearer shp_live_9941a0b3c882194f7e2d" \\
  -H "Content-Type: application/json" \\
  -d '{
    "batchReference": "MSC-ERP-W36",
    "contractTier": "golden_enterprise",
    "loads": [
      {
        "originCity": "اصفهان",
        "destCity": "تهران",
        "weightTons": 22.0,
        "cargoType": "صنعتی",
        "truckType": "تریلر کفی ۱۸ چرخ",
        "cargoValueToman": 380000000,
        "loadingDate": "1403-06-05"
      }
    ]
  }'`}
              </pre>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>مزایای اتصال وب‌سرویس برای کارخانجات:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                <li>تولید خودکار حواله بارگیری در لحظه خروج کالا از باسکول کارخانه</li>
                <li>دریافت وب‌هوک (Webhook) لحظه‌ای به محض تخصیص راننده و ورود به مقصد</li>
                <li>تطبیق خودکار فاکتورهای مالی در نرم‌افزارهای حسابداری بدون خطای انسانی</li>
              </ul>
            </div>
          </div>

          {/* Right API Key & Security Settings Card (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-slate-900 font-bold text-xs font-title">
              <Key className="w-4 h-4 text-amber-600" />
              <span>کلید اختصاصی وب‌سرویس صاحب بار (API Key)</span>
            </div>

            <p className="text-[11px] text-slate-500">
              این کلید دسترسی به سازمان <strong className="text-slate-800">{userOrgName || 'شرکت شما'}</strong> اختصاص دارد. آن را در اختیار افراد غیرمجاز قرار ندهید.
            </p>

            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-700">کلید زنده تولید (Live Token):</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value="shp_live_9941a0b3c882194f7e2d"
                  className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 select-all"
                />
                <button
                  type="button"
                  onClick={() => alert('کلید وب‌سرویس در حافظه کپی شد.')}
                  className="px-3 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
                >
                  کپی
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={() => onNavigateTab && onNavigateTab('settings')}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>مدیریت کامل کلیدها در تب تنظیمات و کاربران</span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
