import React, { useState, useMemo } from 'react';
import {
  Truck,
  Calendar,
  Filter,
  Search,
  Download,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Building2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Eye,
  MapPin,
  ShieldCheck,
  CreditCard,
  Layers,
  ArrowUpDown,
  RefreshCw,
  Phone,
  User,
  Package,
  Sparkles,
  Info,
  X,
  FileCheck2,
  SlidersHorizontal,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import {
  MonthlyShipmentRecord,
  MONTH_OPTIONS,
  STATUS_FILTER_OPTIONS,
  PAYMENT_FILTER_OPTIONS,
  getMonthlyShipmentsForOrg,
} from '../../data/mockMonthlyShipmentsData';
import { exportShipmentsToExcel } from '../../utils/exportShipmentsExcel';
import { usePricing } from '../../store/PricingContext';
import { ShipmentDocumentModal } from './ShipmentDocumentModal';
import { generateDocumentPackageForMonthlyShipment } from '../../utils/monthlyShipmentDocAdapter';
import { FullShipmentDocumentPackage } from '../../types/shipmentDocuments';
import { ModernSelect, ModernSelectOption } from '../common/menus/ModernSelect';

interface MonthlyShipmentsSectionProps {
  onNavigateTab?: (tabId: string) => void;
  onSelectContract?: (contractId: string) => void;
}

export const MonthlyShipmentsSection: React.FC<MonthlyShipmentsSectionProps> = ({
  onNavigateTab,
  onSelectContract,
}) => {
  const { currentShipperOrg } = usePricing();

  // Filters State
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCarrier, setSelectedCarrier] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sorting State
  const [sortField, setSortField] = useState<keyof MonthlyShipmentRecord>('dispatchDatePlanned');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Selected Shipment for Detail Modal
  const [selectedShipment, setSelectedShipment] = useState<MonthlyShipmentRecord | null>(null);

  // Document Modal State for Monthly Shipment
  const [isDocModalOpen, setIsDocModalOpen] = useState<boolean>(false);
  const [activeDocType, setActiveDocType] = useState<'bill_of_lading' | 'loading_order' | 'official_invoice' | 'proforma'>('bill_of_lading');
  const [activeDocPackage, setActiveDocPackage] = useState<FullShipmentDocumentPackage | null>(null);

  const handleOpenDocModal = (
    shipment: MonthlyShipmentRecord,
    docType: 'bill_of_lading' | 'loading_order' | 'official_invoice' | 'proforma' = 'bill_of_lading'
  ) => {
    const pkg = generateDocumentPackageForMonthlyShipment(shipment, currentShipperOrg);
    setActiveDocPackage(pkg);
    setActiveDocType(docType);
    setIsDocModalOpen(true);
  };

  // Print / PDF Preview Modal State
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  // Raw dataset based on active shipper organization
  const allShipments = useMemo(() => {
    return getMonthlyShipmentsForOrg(
      currentShipperOrg.id,
      currentShipperOrg.nameFa,
      currentShipperOrg.contractId
    );
  }, [currentShipperOrg]);

  // Unique carriers list for filter dropdown
  const uniqueCarriers = useMemo(() => {
    const carrierSet = new Set<string>();
    allShipments.forEach((s) => {
      if (s.carrierName) carrierSet.add(s.carrierName);
    });
    return Array.from(carrierSet);
  }, [allShipments]);

  // Options for ModernSelect dropdowns
  const monthOptions = useMemo<ModernSelectOption[]>(() => {
    return MONTH_OPTIONS.map((opt) => {
      const count =
        opt.key === 'all'
          ? allShipments.length
          : allShipments.filter((s) => s.monthKey === opt.key).length;
      return {
        value: opt.key,
        label: opt.labelFa,
        badge: `${count} بارنامه`,
      };
    });
  }, [allShipments]);

  const carrierOptions = useMemo<ModernSelectOption[]>(() => {
    const list: ModernSelectOption[] = [
      {
        value: 'all',
        label: 'همه شرکت‌های باربری',
        badge: `${allShipments.length} کل`,
      },
    ];
    uniqueCarriers.forEach((c) => {
      const count = allShipments.filter((s) => s.carrierName === c).length;
      list.push({
        value: c,
        label: c,
        subLabel: 'شرکت حمل‌ونقل مجاز طرف قرارداد',
        badge: `${count} بارنامه`,
      });
    });
    return list;
  }, [uniqueCarriers, allShipments]);

  const paymentOptions = useMemo<ModernSelectOption[]>(() => {
    return PAYMENT_FILTER_OPTIONS.map((opt) => {
      const count =
        opt.key === 'all'
          ? allShipments.length
          : allShipments.filter((s) => s.paymentStatus === opt.key).length;
      return {
        value: opt.key,
        label: opt.labelFa,
        badge: `${count} مورد`,
      };
    });
  }, [allShipments]);

  // Filtered & Searched Dataset
  const filteredShipments = useMemo(() => {
    return allShipments.filter((shipment) => {
      // Month filter
      if (selectedMonth !== 'all' && shipment.monthKey !== selectedMonth) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'all' && shipment.status !== selectedStatus) {
        return false;
      }
      // Carrier filter
      if (selectedCarrier !== 'all' && shipment.carrierName !== selectedCarrier) {
        return false;
      }
      // Payment filter
      if (selectedPayment !== 'all' && shipment.paymentStatus !== selectedPayment) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          shipment.shipmentCode.toLowerCase().includes(q) ||
          shipment.billOfLadingNo.toLowerCase().includes(q) ||
          shipment.originCity.toLowerCase().includes(q) ||
          shipment.destCity.toLowerCase().includes(q) ||
          shipment.originHub.toLowerCase().includes(q) ||
          shipment.destHub.toLowerCase().includes(q) ||
          shipment.cargoType.toLowerCase().includes(q) ||
          shipment.driverName.toLowerCase().includes(q) ||
          shipment.carrierName.toLowerCase().includes(q) ||
          shipment.truckPlate.toLowerCase().includes(q) ||
          shipment.contractNumber.toLowerCase().includes(q) ||
          shipment.contractTitle.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [allShipments, selectedMonth, selectedStatus, selectedCarrier, selectedPayment, searchQuery]);

  // Sorted Dataset
  const sortedShipments = useMemo(() => {
    return [...filteredShipments].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return 0;
    });
  }, [filteredShipments, sortField, sortDirection]);

  // KPI Calculations based on active filters
  const stats = useMemo(() => {
    const totalCount = filteredShipments.length;
    const totalCostRials = filteredShipments.reduce((sum, s) => sum + (s.totalCostRials || 0), 0);
    const totalCostToman = Math.round(totalCostRials / 10);
    const totalWeightTons = filteredShipments.reduce((sum, s) => sum + (s.weightTons || 0), 0);

    const deliveredCount = filteredShipments.filter((s) => s.status === 'delivered').length;
    const inTransitCount = filteredShipments.filter((s) => s.status === 'in_transit').length;
    const pendingCount = filteredShipments.filter((s) => s.status === 'pending').length;
    const issueCount = filteredShipments.filter((s) => s.status === 'issue' || !s.isOnTime).length;

    const onTimeCount = filteredShipments.filter((s) => s.isOnTime).length;
    const onTimeRate = totalCount > 0 ? ((onTimeCount / totalCount) * 100).toFixed(1) : '100.0';

    return {
      totalCount,
      totalCostRials,
      totalCostToman,
      totalWeightTons,
      deliveredCount,
      inTransitCount,
      pendingCount,
      issueCount,
      onTimeRate,
    };
  }, [filteredShipments]);

  const hasActiveFilters =
    selectedMonth !== 'all' ||
    selectedStatus !== 'all' ||
    selectedCarrier !== 'all' ||
    selectedPayment !== 'all' ||
    searchQuery.trim() !== '';

  const handleResetFilters = () => {
    setSelectedMonth('all');
    setSelectedStatus('all');
    setSelectedCarrier('all');
    setSelectedPayment('all');
    setSearchQuery('');
  };

  // Sort toggle handler
  const handleSort = (field: keyof MonthlyShipmentRecord) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Helper for Export Excel
  const handleExportExcel = () => {
    const monthObj = MONTH_OPTIONS.find((m) => m.key === selectedMonth);
    const label = monthObj ? monthObj.labelFa : 'همه ماه‌ها';
    exportShipmentsToExcel(sortedShipments, currentShipperOrg.nameFa, label);
  };

  // Helper for Link to Contract
  const handleGoToContract = (contractId: string) => {
    if (onSelectContract) {
      onSelectContract(contractId);
    }
    if (onNavigateTab) {
      onNavigateTab('contracts');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Summary Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Shipments */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-700">
                <Package className="w-4 h-4" />
              </span>
              تعداد کل محموله‌ها
            </span>
            <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full font-mono">
              {selectedMonth === 'all' ? 'سال ۱۴۰۵' : MONTH_OPTIONS.find((m) => m.key === selectedMonth)?.labelFa}
            </span>
          </div>

          <div>
            <div className="text-3xl font-bold font-mono text-slate-900 tracking-tight">
              {stats.totalCount} <span className="text-xs font-normal text-slate-500">بارنامه</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2.5 text-[11px] font-medium flex-wrap">
              <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200/80 font-bold">
                {stats.deliveredCount} تحویل‌شده
              </span>
              <span className="text-blue-800 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200/80 font-bold">
                {stats.inTransitCount} در مسیر
              </span>
              {stats.issueCount > 0 && (
                <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/80 font-bold">
                  {stats.issueCount} تاخیر
                </span>
              )}
            </div>
          </div>
        </div>

        {/* KPI 2: Total Cost */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700">
                <CreditCard className="w-4 h-4" />
              </span>
              بهای تمام‌شده کرایه حمل
            </span>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
              خالص و با مالیات
            </span>
          </div>

          <div>
            <div className="text-2xl font-bold font-mono text-emerald-700">
              {(stats.totalCostToman / 1000000).toLocaleString('fa-IR', { maximumFractionDigits: 1 })}{' '}
              <span className="text-xs font-normal text-slate-500">میلیون تومان</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">
              معادل {stats.totalCostRials.toLocaleString('fa-IR')} ریال
            </p>
          </div>
        </div>

        {/* KPI 3: On-Time Delivery Rate */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-700">
                <CheckCircle2 className="w-4 h-4" />
              </span>
              شاخص تحویل به‌موقع (SLA)
            </span>
            <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/80">
              هدف: ۹۸٪
            </span>
          </div>

          <div>
            <div className="text-3xl font-bold font-mono text-blue-700">
              {stats.onTimeRate}٪
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              تطابق با زمان‌بندی توافق‌شده در قراردادها
            </p>
          </div>
        </div>

        {/* KPI 4: Total Tonnage */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700">
                <Truck className="w-4 h-4" />
              </span>
              مجموع تناژ جابجا شده
            </span>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/80">
              ناخالص
            </span>
          </div>

          <div>
            <div className="text-3xl font-bold font-mono text-slate-900 tracking-tight">
              {stats.totalWeightTons.toLocaleString('fa-IR', { maximumFractionDigits: 1 })}{' '}
              <span className="text-xs font-normal text-slate-500">تن کالا</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              میانگین {(stats.totalCount > 0 ? (stats.totalWeightTons / stats.totalCount).toFixed(1) : 0)} تن برای هر بارنامه
            </p>
          </div>
        </div>
      </div>

      {/* 2. Modern Minimal Filter & Control Toolbar */}
      <div className="bg-white border border-slate-200/90 p-5 rounded-3xl shadow-xs space-y-4">
        {/* Toolbar Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-700 shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-slate-800 text-sm font-display">
                  دفتر کل بارنامه‌ها و محموله‌های شرکت
                </h3>
                <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
                  {currentShipperOrg.nameFa}
                </span>
                <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  {sortedShipments.length} ردیف یافت شد
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-0.5">
                ممیزی و پایش هزینه‌های کرایه، رهگیری راننده و وضعیت تسویه به تفکیک ماه‌های سال
              </p>
            </div>
          </div>

          {/* Action Buttons (Excel Export & Print) */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                title="پاک کردن تمامی فیلترها"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>حذف فیلترها</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleExportExcel}
              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/90 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              title="خروجی فایل اکسل با فرمت استاندارد"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>خروجی اکسل (CSV)</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPrintModalOpen(true)}
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/90 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              title="پیش‌نمایش نسخه رسمی و ذخیره PDF"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>چاپ رسمی و PDF</span>
            </button>
          </div>
        </div>

        {/* Quick Status Chips Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-slate-100 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 ml-1">وضعیت:</span>
          
          <button
            type="button"
            onClick={() => setSelectedStatus('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
              selectedStatus === 'all'
                ? 'bg-slate-800 text-white font-bold shadow-xs'
                : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            همه وضعیت‌ها ({allShipments.length})
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatus('delivered')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              selectedStatus === 'delivered'
                ? 'bg-emerald-700 text-white font-bold shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100/70 border border-emerald-200/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>تحویل‌شده</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatus('in_transit')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              selectedStatus === 'in_transit'
                ? 'bg-blue-700 text-white font-bold shadow-xs'
                : 'bg-blue-50 text-blue-800 hover:bg-blue-100/70 border border-blue-200/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>در مسیر حمل</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatus('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              selectedStatus === 'pending'
                ? 'bg-amber-600 text-white font-bold shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100/70 border border-amber-200/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>در انتظار بارگیری</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatus('issue')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              selectedStatus === 'issue'
                ? 'bg-rose-700 text-white font-bold shadow-xs'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100/70 border border-rose-200/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>دارای تاخیر / مغایرت</span>
          </button>
        </div>

        {/* Minimal Dropdown Filter Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 pt-2">
          {/* Filter 1: Month / Period Dropdown */}
          <div>
            <ModernSelect
              value={selectedMonth}
              onChange={(val) => setSelectedMonth(val)}
              options={monthOptions}
              label="دوره زمانی و ماه"
              icon={<Calendar className="w-3.5 h-3.5 text-teal-600" />}
              variant="teal"
            />
          </div>

          {/* Filter 2: Carrier Company Dropdown */}
          <div>
            <ModernSelect
              value={selectedCarrier}
              onChange={(val) => setSelectedCarrier(val)}
              options={carrierOptions}
              label="شرکت باربری طرف قرارداد"
              icon={<Building2 className="w-3.5 h-3.5 text-blue-600" />}
              searchable={true}
              variant="teal"
            />
          </div>

          {/* Filter 3: Payment Status Dropdown */}
          <div>
            <ModernSelect
              value={selectedPayment}
              onChange={(val) => setSelectedPayment(val)}
              options={paymentOptions}
              label="وضعیت تسویه مالی"
              icon={<CreditCard className="w-3.5 h-3.5 text-emerald-600" />}
              variant="teal"
            />
          </div>

          {/* Filter 4: Instant Search Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span>جستجوی بارنامه، راننده یا شهر</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="کد، بارنامه، شهر، پلاک، راننده..."
                className="w-full bg-white hover:bg-slate-50/80 focus:bg-white border border-slate-200 hover:border-slate-300 rounded-2xl pl-8 pr-9 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition-all shadow-2xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center absolute left-2.5 top-2.5 text-xs transition-colors cursor-pointer"
                  title="پاک کردن جستجو"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Shipments Ledger Data Table */}
      <div className="bg-white border border-slate-200/90 rounded-3xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200/90 text-slate-700 font-bold">
                <th className="py-4 px-4 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleSort('shipmentCode')}
                    className="flex items-center gap-1.5 hover:text-teal-700 transition-colors cursor-pointer group"
                  >
                    <span>کد محموله و بارنامه</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-700" />
                  </button>
                </th>
                <th className="py-4 px-4 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleSort('dispatchDatePlanned')}
                    className="flex items-center gap-1.5 hover:text-teal-700 transition-colors cursor-pointer group"
                  >
                    <span>زمان‌بندی و SLA</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-700" />
                  </button>
                </th>
                <th className="py-4 px-4 whitespace-nowrap">
                  <span>مسیر و مسافت</span>
                </th>
                <th className="py-4 px-4 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleSort('weightTons')}
                    className="flex items-center gap-1.5 hover:text-teal-700 transition-colors cursor-pointer group"
                  >
                    <span>مشخصات کالا و تناژ</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-700" />
                  </button>
                </th>
                <th className="py-4 px-4 whitespace-nowrap">
                  <span>حمل‌کننده و راننده</span>
                </th>
                <th className="py-4 px-4 whitespace-nowrap">
                  <span>وضعیت عملیاتی</span>
                </th>
                <th className="py-4 px-4 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleSort('totalCostRials')}
                    className="flex items-center gap-1.5 hover:text-teal-700 transition-colors cursor-pointer group"
                  >
                    <span>مبلغ و وضعیت تسویه</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-700" />
                  </button>
                </th>
                <th className="py-4 px-4 whitespace-nowrap">
                  <span>قرارداد مرتبط</span>
                </th>
                <th className="py-4 px-4 text-center whitespace-nowrap">
                  <span>عملیات</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedShipments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-14 text-center text-slate-400 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                      <Info className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-700 text-sm">هیچ محموله‌ای با فیلترهای جاری پیدا نشد</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        لطفاً دوره زمانی، وضعیت یا عبارت جستجو را تغییر دهید
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl text-xs font-bold border border-teal-200 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>بازنشانی فیلترها</span>
                    </button>
                  </td>
                </tr>
              ) : (
                sortedShipments.map((item) => {
                  // Operational Status Pill
                  let statusPill = (
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/90 px-2.5 py-1 rounded-xl text-[11px] font-bold inline-flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {item.statusLabelFa}
                    </span>
                  );
                  if (item.status === 'in_transit') {
                    statusPill = (
                      <span className="bg-blue-50 text-blue-800 border border-blue-200/90 px-2.5 py-1 rounded-xl text-[11px] font-bold inline-flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                        <span>{item.statusLabelFa}</span>
                        <span className="text-[10px] font-mono text-blue-600 bg-blue-100/70 px-1 rounded">
                          {item.progressPercent}٪
                        </span>
                      </span>
                    );
                  } else if (item.status === 'pending') {
                    statusPill = (
                      <span className="bg-amber-50 text-amber-800 border border-amber-200/90 px-2.5 py-1 rounded-xl text-[11px] font-bold inline-flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        {item.statusLabelFa}
                      </span>
                    );
                  } else if (item.status === 'issue' || !item.isOnTime) {
                    statusPill = (
                      <span className="bg-rose-50 text-rose-800 border border-rose-200/90 px-2.5 py-1 rounded-xl text-[11px] font-bold inline-flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        {item.statusLabelFa}
                      </span>
                    );
                  }

                  // Payment Badge
                  let payBadge = (
                    <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-bold inline-block mt-1">
                      {item.paymentStatusLabelFa}
                    </span>
                  );
                  if (item.paymentStatus === 'credit_open') {
                    payBadge = (
                      <span className="text-[10px] text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 font-bold inline-block mt-1">
                        {item.paymentStatusLabelFa}
                      </span>
                    );
                  } else if (item.paymentStatus === 'pending_verification') {
                    payBadge = (
                      <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 font-bold inline-block mt-1">
                        {item.paymentStatusLabelFa}
                      </span>
                    );
                  }

                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedShipment(item)}
                      className="hover:bg-teal-50/20 transition-colors cursor-pointer group"
                    >
                      {/* 1. Code & Bill of Lading */}
                      <td className="py-4 px-4 align-top">
                        <div className="font-mono font-bold text-slate-800 text-xs group-hover:text-teal-700 transition-colors">
                          {item.shipmentCode}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center gap-1">
                          <FileText className="w-3 h-3 text-slate-400" />
                          <span>بارنامه: {item.billOfLadingNo}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md mt-1.5 inline-block font-mono">
                          {item.monthLabelFa}
                        </span>
                      </td>

                      {/* 2. Schedule & SLA */}
                      <td className="py-4 px-4 align-top space-y-1">
                        <div className="text-[11px] flex items-center gap-1">
                          <span className="text-slate-400 text-[10px]">ارسال:</span>
                          <span className="font-mono text-slate-700 font-medium">
                            {item.dispatchDateActual || item.dispatchDatePlanned}
                          </span>
                        </div>
                        <div className="text-[11px] flex items-center gap-1">
                          <span className="text-slate-400 text-[10px]">تحویل:</span>
                          <span className="font-mono text-slate-700 font-medium">
                            {item.deliveryDateActual || item.deliveryDatePlanned}
                          </span>
                        </div>
                        <div className="pt-0.5">
                          {item.isOnTime ? (
                            <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              تحویل به‌موقع ({item.transitDurationHours} ساعت)
                            </span>
                          ) : (
                            <span className="text-[10px] text-rose-700 font-bold flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-rose-600" />
                              تاخیر عملیاتی
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 3. Route & Distance */}
                      <td className="py-4 px-4 align-top space-y-1 max-w-[210px]">
                        <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs">
                          <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          <span>{item.originCity}</span>
                          <span className="text-slate-400 text-xs">←</span>
                          <span>{item.destCity}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate" title={`${item.originHub} به ${item.destHub}`}>
                          {item.destHub}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {item.distanceKm} کیلومتر
                        </div>
                      </td>

                      {/* 4. Cargo & Weight */}
                      <td className="py-4 px-4 align-top space-y-1">
                        <div className="font-bold text-slate-800 text-xs">{item.cargoType}</div>
                        <div className="text-[11px] font-mono text-teal-800 font-bold">
                          {item.weightTons} تن
                          {item.volumeM3 ? <span className="text-slate-400 font-normal"> ({item.volumeM3} م³)</span> : null}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[140px]" title={item.packaging}>
                          {item.packaging}
                        </div>
                      </td>

                      {/* 5. Carrier & Driver */}
                      <td className="py-4 px-4 align-top space-y-1">
                        <div className="font-medium text-slate-800 text-xs">{item.carrierName}</div>
                        <div className="text-[11px] text-slate-600 flex items-center gap-1 font-mono">
                          <User className="w-3 h-3 text-slate-400" />
                          <span>{item.driverName}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded-md inline-block">
                          {item.truckPlate}
                        </div>
                      </td>

                      {/* 6. Operational Status */}
                      <td className="py-4 px-4 align-top space-y-1">
                        {statusPill}
                        {item.issueDetails && (
                          <p className="text-[10px] text-rose-700 leading-tight max-w-[160px]" title={item.issueDetails}>
                            {item.issueDetails}
                          </p>
                        )}
                      </td>

                      {/* 7. Cost & Payment */}
                      <td className="py-4 px-4 align-top">
                        <div className="font-mono font-bold text-emerald-700 text-xs">
                          {item.totalCostToman.toLocaleString('fa-IR')}{' '}
                          <span className="text-[10px] font-normal text-slate-500">تومان</span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {item.totalCostRials.toLocaleString('fa-IR')} ریال
                        </div>
                        {payBadge}
                      </td>

                      {/* 8. Linked Contract */}
                      <td className="py-4 px-4 align-top">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGoToContract(item.contractId);
                          }}
                          className="text-[11px] font-bold text-teal-800 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-2.5 py-1.5 rounded-xl border border-teal-200/90 flex items-center gap-1 transition-all cursor-pointer"
                          title="مشاهده پرونده کامل در بخش قراردادها"
                        >
                          <FileText className="w-3 h-3 text-teal-600" />
                          <span className="font-mono">{item.contractNumber}</span>
                          <ExternalLink className="w-2.5 h-2.5 text-teal-500" />
                        </button>
                        <div className="text-[10px] text-slate-400 mt-1 truncate max-w-[120px]" title={item.contractTitle}>
                          {item.contractTitle}
                        </div>
                      </td>

                      {/* 9. Action Details Button */}
                      <td className="py-4 px-4 text-center align-middle">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedShipment(item);
                          }}
                          className="px-3 py-1.5 text-teal-800 hover:bg-teal-50 border border-teal-200/80 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                          title="مشاهده شناسنامه و ریزمحاسبات"
                        >
                          <Eye className="w-3.5 h-3.5 text-teal-600" />
                          <span>شناسنامه</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary Bar */}
        <div className="bg-slate-50/90 border-t border-slate-200/90 px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span>
              نمایش <strong>{sortedShipments.length}</strong> بارنامه از مجموع{' '}
              <strong>{allShipments.length}</strong> محموله فعال سال
            </span>
          </div>
          <div className="flex items-center gap-5 font-mono text-xs">
            <span>
              مجموع تناژ: <strong>{stats.totalWeightTons} تن</strong>
            </span>
            <span>
              مجموع بهای کرایه:{' '}
              <strong className="text-emerald-700">{stats.totalCostToman.toLocaleString('fa-IR')} تومان</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 4. Full Shipment Detail Modal */}
      {selectedShipment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200/90 flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200/90 flex items-start justify-between bg-slate-50/70 sticky top-0 z-10">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold shrink-0">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="font-bold text-slate-900 text-base font-display">
                      شناسنامه و جزئیات کامل محموله {selectedShipment.shipmentCode}
                    </h3>
                    <span className="bg-teal-50 text-teal-800 border border-teal-200 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full">
                      بارنامه: {selectedShipment.billOfLadingNo}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5">
                    ثبت‌شده در دفتر کل بارنامه‌های رسمی راهداری و سیستم لجستیک {currentShipperOrg.nameFa}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedShipment(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Timeline & Delivery Stepper */}
              <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-teal-600" />
                    جدول زمانی حرکت و انطباق با تعهد SLA
                  </span>
                  <span
                    className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                      selectedShipment.isOnTime
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {selectedShipment.isOnTime ? 'تحویل به‌موقع (On-Time)' : 'دارای تاخیر عملیاتی'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] text-slate-400 block">ارسال برنامه‌ریزی:</span>
                    <span className="font-mono font-bold text-slate-800 block">
                      {selectedShipment.dispatchDatePlanned}
                    </span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] text-slate-400 block">ارسال واقعی (خروج):</span>
                    <span className="font-mono font-bold text-slate-800 block">
                      {selectedShipment.dispatchDateActual || '—'}
                    </span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] text-slate-400 block">تحویل برنامه‌ریزی (ETA):</span>
                    <span className="font-mono font-bold text-slate-800 block">
                      {selectedShipment.deliveryDatePlanned}
                    </span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] text-slate-400 block">تحویل قطعی در مقصد:</span>
                    <span className="font-mono font-bold text-slate-800 block">
                      {selectedShipment.deliveryDateActual || 'در حال حمل'}
                    </span>
                  </div>
                </div>

                {selectedShipment.issueDetails && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-xs flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                    <div>
                      <strong>توضیحات و گزارش تاخیر / رخداد: </strong>
                      <span>{selectedShipment.issueDetails}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Route & Hubs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Origin */}
                <div className="p-5 rounded-2xl border border-slate-200/80 space-y-2 bg-white">
                  <div className="flex items-center gap-2 text-teal-700 font-bold text-xs">
                    <MapPin className="w-4 h-4" />
                    <span>مبدأ و انبار بارگیری</span>
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    {selectedShipment.originProvince} - {selectedShipment.originCity}
                  </div>
                  <div className="text-xs text-slate-600 font-medium">{selectedShipment.originHub}</div>
                  {selectedShipment.originAddress && (
                    <div className="text-[11px] text-slate-400 leading-relaxed">{selectedShipment.originAddress}</div>
                  )}
                </div>

                {/* Destination */}
                <div className="p-5 rounded-2xl border border-slate-200/80 space-y-2 bg-white">
                  <div className="flex items-center gap-2 text-blue-700 font-bold text-xs">
                    <MapPin className="w-4 h-4" />
                    <span>مقصد و انبار تخلیه</span>
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    {selectedShipment.destProvince} - {selectedShipment.destCity}
                  </div>
                  <div className="text-xs text-slate-600 font-medium">{selectedShipment.destHub}</div>
                  {selectedShipment.destAddress && (
                    <div className="text-[11px] text-slate-400 leading-relaxed">{selectedShipment.destAddress}</div>
                  )}
                </div>
              </div>

              {/* Cargo & Fleet Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cargo */}
                <div className="p-5 rounded-2xl border border-slate-200/80 space-y-3 bg-white">
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-xs border-b border-slate-100 pb-2.5">
                    <Package className="w-4 h-4 text-amber-600" />
                    <span>مشخصات بار و کالا</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] block">نوع کالا:</span>
                      <span className="font-bold text-slate-800">{selectedShipment.cargoType}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">دسته‌بندی:</span>
                      <span className="font-bold text-slate-800">{selectedShipment.cargoCategory}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">وزن محموله:</span>
                      <span className="font-mono font-bold text-teal-800 text-sm">{selectedShipment.weightTons} تن</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">نوع بسته‌بندی:</span>
                      <span className="font-medium text-slate-700">{selectedShipment.packaging}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 text-[10px] block">ارزش اظهارشده بیمه:</span>
                      <span className="font-mono font-bold text-slate-800">
                        {selectedShipment.declaredValueRials.toLocaleString('fa-IR')} ریال
                      </span>
                    </div>
                  </div>
                </div>

                {/* Fleet & Carrier */}
                <div className="p-5 rounded-2xl border border-slate-200/80 space-y-3 bg-white">
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-xs border-b border-slate-100 pb-2.5">
                    <Truck className="w-4 h-4 text-teal-600" />
                    <span>شرکت باربری و راننده مسئول</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="col-span-2">
                      <span className="text-slate-400 text-[10px] block">شرکت حمل‌ونقل:</span>
                      <span className="font-bold text-slate-800">{selectedShipment.carrierName}</span>
                      <span className="text-[10px] text-slate-400 block font-mono mt-0.5">
                        تلفن تماس: {selectedShipment.carrierPhone}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">نام راننده:</span>
                      <span className="font-bold text-slate-800">{selectedShipment.driverName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">موبایل راننده:</span>
                      <span className="font-mono text-slate-700 font-bold">{selectedShipment.driverPhone}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">نوع ناوگان:</span>
                      <span className="font-medium text-slate-700">{selectedShipment.truckType}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">پلاک خودرو:</span>
                      <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                        {selectedShipment.truckPlate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    ریز صورت‌حساب مالی و تعرفه مصوب
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full font-mono">
                    {selectedShipment.paymentStatusLabelFa}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 block">کرایه پایه تن‌کیلومتر:</span>
                    <span className="font-mono font-bold text-slate-700">
                      {selectedShipment.baseFreightRials.toLocaleString('fa-IR')} ریال
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 block">عوارض راهداری (۹٪):</span>
                    <span className="font-mono font-bold text-slate-700">
                      {selectedShipment.rmtoTaxRials.toLocaleString('fa-IR')} ریال
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 block">ارزش افزوده (۱۰٪):</span>
                    <span className="font-mono font-bold text-slate-700">
                      {selectedShipment.vatRials.toLocaleString('fa-IR')} ریال
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 block">بیمه مسئولیت کالا:</span>
                    <span className="font-mono font-bold text-slate-700">
                      {selectedShipment.insuranceCostRials.toLocaleString('fa-IR')} ریال
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200/80 text-sm">
                  <span className="font-bold text-slate-800">مجموع کل پرداختی فاکتور:</span>
                  <div className="text-left">
                    <span className="text-base font-bold font-mono text-emerald-700">
                      {selectedShipment.totalCostToman.toLocaleString('fa-IR')} تومان
                    </span>
                    <span className="text-xs text-slate-400 block font-mono">
                      ({selectedShipment.totalCostRials.toLocaleString('fa-IR')} ریال)
                    </span>
                  </div>
                </div>
              </div>

              {/* Official Electronic Documents Dossier Box */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                      <FileCheck2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 font-display">
                        اسناد و مدارک رسمی الکترونیکی محموله
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        مشاهده، بررسی و دریافت نسخه‌های دیجیتال معتبر راهداری و مالیاتی
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenDocModal(selectedShipment, 'bill_of_lading')}
                    className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Eye className="w-3.5 h-3.5 text-teal-200" />
                    <span>مشاهده پکیج کامل اسناد</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleOpenDocModal(selectedShipment, 'bill_of_lading')}
                    className="p-3 bg-slate-50 hover:bg-teal-50/70 border border-slate-200 hover:border-teal-300 rounded-xl text-right transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-600 group-hover:text-teal-700 transition-colors" />
                      <span className="text-[10px] font-mono text-slate-400">BL</span>
                    </div>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-teal-900 block">
                      بارنامه رسمی
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate">
                      کد راهداری تمبردار
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenDocModal(selectedShipment, 'loading_order')}
                    className="p-3 bg-slate-50 hover:bg-teal-50/70 border border-slate-200 hover:border-teal-300 rounded-xl text-right transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <Building2 className="w-4 h-4 text-sky-600 group-hover:text-teal-700 transition-colors" />
                      <span className="text-[10px] font-mono text-slate-400">DSP</span>
                    </div>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-teal-900 block">
                      حواله بارگیری
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate">
                      نوبت ورود به انبار
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenDocModal(selectedShipment, 'official_invoice')}
                    className="p-3 bg-slate-50 hover:bg-teal-50/70 border border-slate-200 hover:border-teal-300 rounded-xl text-right transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <CreditCard className="w-4 h-4 text-emerald-600 group-hover:text-teal-700 transition-colors" />
                      <span className="text-[10px] font-mono text-slate-400">INV</span>
                    </div>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-teal-900 block">
                      فاکتور مالیاتی
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate">
                      سامانه مودیان و ۱۰٪ VAT
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenDocModal(selectedShipment, 'proforma')}
                    className="p-3 bg-slate-50 hover:bg-teal-50/70 border border-slate-200 hover:border-teal-300 rounded-xl text-right transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <FileText className="w-4 h-4 text-amber-500 group-hover:text-teal-700 transition-colors" />
                      <span className="text-[10px] font-mono text-slate-400">PRF</span>
                    </div>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-teal-900 block">
                      پیش‌فاکتور
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate">
                      برآورد هزینه و شرایط
                    </span>
                  </button>
                </div>
              </div>

              {/* Linked Contract Dossier */}
              <div className="bg-teal-50/60 p-5 rounded-2xl border border-teal-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">
                    قرارداد بالادستی مرتبط
                  </span>
                  <h4 className="font-bold text-slate-800 text-xs">
                    {selectedShipment.contractTitle}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-mono">
                    شماره ثبت: {selectedShipment.contractNumber} | رده تجاری: {selectedShipment.contractTier}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedShipment(null);
                    handleGoToContract(selectedShipment.contractId);
                  }}
                  className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <span>مشاهده پرونده در بخش قراردادها</span>
                  <ExternalLink className="w-3.5 h-3.5 text-teal-200" />
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-slate-200/90 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenDocModal(selectedShipment, 'bill_of_lading')}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <FileCheck2 className="w-4 h-4 text-teal-200" />
                  <span>اسناد الکترونیکی (بارنامه، حواله، فاکتورها)</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedShipment(null)}
                className="px-5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/90 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                بستن پنجره
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Electronic Document Viewer Modal (Bill of Lading, Loading Order, Tax Invoice, Proforma) */}
      {activeDocPackage && (
        <ShipmentDocumentModal
          isOpen={isDocModalOpen}
          documentPackage={activeDocPackage}
          initialDocType={activeDocType}
          onClose={() => {
            setIsDocModalOpen(false);
            setActiveDocPackage(null);
          }}
        />
      )}

      {/* 5. Print & PDF View Modal */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
            {/* Print Header Controls */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-100/80 sticky top-0 z-10 print:hidden">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-teal-700" />
                <span className="font-bold text-slate-800 text-xs">پیش‌نمایش چاپ رسمی و خروجی PDF گزارش ماهانه</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-teal-200" />
                  <span>ارسال به چاپگر / ذخیره PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-2 text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-xl cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Document Body */}
            <div className="p-8 space-y-6 text-right font-sans">
              {/* Document Official Header */}
              <div className="border-b-2 border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900 font-display">
                    گزارش رسمی و ریز بارنامه‌های محموله‌های جاده‌ای
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    شرکت صاحب کالا: <strong>{currentShipperOrg.nameFa}</strong> (کد سازمانی: {currentShipperOrg.code})
                  </p>
                </div>
                <div className="text-left text-xs space-y-1 font-mono">
                  <div>تاریخ گزارش: {new Date().toLocaleDateString('fa-IR')}</div>
                  <div>
                    دوره گزارش:{' '}
                    {selectedMonth === 'all'
                      ? 'کل سال ۱۴۰۵'
                      : MONTH_OPTIONS.find((m) => m.key === selectedMonth)?.labelFa}
                  </div>
                  <div>تعداد کل بارنامه‌ها: {sortedShipments.length} فقره</div>
                </div>
              </div>

              {/* KPI Summary Strip */}
              <div className="grid grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-center text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">تعداد کل محموله‌ها:</span>
                  <span className="font-bold text-slate-800 font-mono text-sm">{stats.totalCount} فقره</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">مجموع تناژ ناخالص:</span>
                  <span className="font-bold text-slate-800 font-mono text-sm">{stats.totalWeightTons} تن</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">مجموع بهای تمام‌شده کرایه:</span>
                  <span className="font-bold text-emerald-800 font-mono text-sm">
                    {stats.totalCostToman.toLocaleString('fa-IR')} تومان
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">شاخص تحویل به‌موقع:</span>
                  <span className="font-bold text-blue-800 font-mono text-sm">{stats.onTimeRate}٪</span>
                </div>
              </div>

              {/* Detailed Table for Print */}
              <table className="w-full border-collapse text-[10px] border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-slate-800 font-bold">
                    <th className="p-2 border-l border-slate-300">ردیف</th>
                    <th className="p-2 border-l border-slate-300">کد محموله / بارنامه</th>
                    <th className="p-2 border-l border-slate-300">تاریخ ارسال و تحویل</th>
                    <th className="p-2 border-l border-slate-300">مبدأ و مقصد</th>
                    <th className="p-2 border-l border-slate-300">نوع کالا و وزن</th>
                    <th className="p-2 border-l border-slate-300">شرکت باربری و راننده</th>
                    <th className="p-2 border-l border-slate-300">وضعیت</th>
                    <th className="p-2 border-l border-slate-300">کرایه کل (تومان)</th>
                    <th className="p-2">وضعیت مالی</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {sortedShipments.map((s, idx) => (
                    <tr key={s.id}>
                      <td className="p-2 text-center border-l border-slate-200 font-mono">{idx + 1}</td>
                      <td className="p-2 border-l border-slate-200 font-mono">
                        <div>{s.shipmentCode}</div>
                        <div className="text-slate-500">{s.billOfLadingNo}</div>
                      </td>
                      <td className="p-2 border-l border-slate-200 font-mono">
                        <div>ارسال: {s.dispatchDateActual || s.dispatchDatePlanned}</div>
                        <div>تحویل: {s.deliveryDateActual || s.deliveryDatePlanned}</div>
                      </td>
                      <td className="p-2 border-l border-slate-200">
                        <div>
                          {s.originCity} ← {s.destCity}
                        </div>
                        <div className="text-slate-500 truncate max-w-[120px]">{s.destHub}</div>
                      </td>
                      <td className="p-2 border-l border-slate-200">
                        <div>{s.cargoType}</div>
                        <div className="font-mono font-bold text-slate-700">{s.weightTons} تن</div>
                      </td>
                      <td className="p-2 border-l border-slate-200">
                        <div>{s.carrierName}</div>
                        <div className="text-slate-500">
                          {s.driverName} ({s.truckPlate})
                        </div>
                      </td>
                      <td className="p-2 border-l border-slate-200">{s.statusLabelFa}</td>
                      <td className="p-2 border-l border-slate-200 font-mono font-bold text-emerald-800">
                        {s.totalCostToman.toLocaleString('fa-IR')}
                      </td>
                      <td className="p-2">{s.paymentStatusLabelFa}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Official Stamp & Signatures Area */}
              <div className="pt-8 grid grid-cols-3 gap-6 text-center text-xs border-t border-slate-300">
                <div className="space-y-12">
                  <span>مدیر واحد لجستیک و حمل‌ونقل</span>
                  <div className="border-t border-dashed border-slate-400 w-32 mx-auto" />
                </div>
                <div className="space-y-12">
                  <span>مدیریت مالی و ممیزی اسناد</span>
                  <div className="border-t border-dashed border-slate-400 w-32 mx-auto" />
                </div>
                <div className="space-y-12">
                  <span>مهر و امضای شرکت صاحب کالا</span>
                  <div className="border-t border-dashed border-slate-400 w-32 mx-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
