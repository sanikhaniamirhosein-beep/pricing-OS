import React, { useState, useEffect } from 'react';
import {
  Truck,
  MapPin,
  Search,
  Filter,
  FileText,
  Download,
  Phone,
  Navigation,
  CheckCircle2,
  Clock,
  Radio,
  Eye,
  ChevronLeft,
  Calendar,
  Layers,
  ArrowUpDown,
  FileCheck,
  Shield,
  AlertTriangle,
  LifeBuoy,
  MessageSquare,
  PlusCircle,
  XCircle,
  Headphones,
  CheckCircle,
  ExternalLink,
  Receipt,
  Building2,
  ShieldCheck,
  Printer,
  Sparkles,
  Check,
} from 'lucide-react';
import {
  INITIAL_ACTIVE_LOADS,
  INITIAL_SUPPORT_TICKETS,
  ShipperActiveLoad,
  ShipperSupportTicket,
} from '../../data/mockShipperData';
import { usePricing } from '../../store/PricingContext';
import { getShipperRoleDetail } from '../../data/shipperRolesConfig';
import { ModernSelect } from '../common/menus/ModernSelect';
import { ShipmentPickerDropdown } from '../common/menus/ShipmentPickerDropdown';
import { Warehouse, CheckSquare, Upload, FileBadge, ShieldAlert, Stamp } from 'lucide-react';
import { generateFullShipmentDocumentPackage } from '../../utils/shipmentDocumentGenerator';
import { ShipmentDocumentModal } from './ShipmentDocumentModal';
import { FullShipmentDocumentPackage } from '../../types/shipmentDocuments';

interface ShipperShipmentsViewProps {
  initialSelectedShipment?: ShipperActiveLoad | null;
  onNavigateToSupport?: (loadId: string, ticketId?: string) => void;
  loads?: ShipperActiveLoad[];
  onNavigateTab?: (tabId: string) => void;
}

export const ShipperShipmentsView: React.FC<ShipperShipmentsViewProps> = ({
  initialSelectedShipment,
  onNavigateToSupport,
  loads = INITIAL_ACTIVE_LOADS,
  onNavigateTab,
}) => {
  const { currentShipperOrg } = usePricing();
  const [activeTab, setActiveTab] = useState<'active' | 'live_map' | 'history' | 'edocs'>('active');
  const [selectedLoad, setSelectedLoad] = useState<ShipperActiveLoad>(
    initialSelectedShipment || loads?.[0] || INITIAL_ACTIVE_LOADS?.[0] || ({} as ShipperActiveLoad)
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [ticketsList, setTicketsList] = useState<ShipperSupportTicket[]>(INITIAL_SUPPORT_TICKETS);

  // Shipment Document Modal State
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docModalType, setDocModalType] = useState<'proforma' | 'official_invoice' | 'loading_order' | 'bill_of_lading'>('bill_of_lading');
  const [activeDocPackage, setActiveDocPackage] = useState<FullShipmentDocumentPackage | null>(null);

  // Generate document package whenever selectedLoad changes or when opening modal
  const openDocumentViewer = (
    load: ShipperActiveLoad,
    docType: 'proforma' | 'official_invoice' | 'loading_order' | 'bill_of_lading' = 'bill_of_lading'
  ) => {
    const pkg = generateFullShipmentDocumentPackage(load, currentShipperOrg);
    setActiveDocPackage(pkg);
    setDocModalType(docType);
    setIsDocModalOpen(true);
  };

  // Keep selected load synced if loads or initialSelectedShipment change
  useEffect(() => {
    if (initialSelectedShipment) {
      setSelectedLoad(initialSelectedShipment);
    } else if (loads && loads.length > 0) {
      if (!selectedLoad?.id || !loads.some((l) => l.id === selectedLoad.id)) {
        setSelectedLoad(loads[0]);
      }
    }
  }, [initialSelectedShipment, loads]);

  // Quick report modal
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [incidentCategory, setIncidentCategory] = useState<ShipperSupportTicket['category']>('delay');
  const [incidentPriority, setIncidentPriority] = useState<ShipperSupportTicket['priority']>('high');
  const [incidentSubject, setIncidentSubject] = useState('');
  const [incidentDescription, setIncidentDescription] = useState('');

  // Find ticket associated with the currently selected load
  const activeTicketForSelectedLoad = ticketsList.find(
    (t) => t.loadId === selectedLoad?.id && t.status !== 'resolved'
  );
  const anyTicketForSelectedLoad = ticketsList.find((t) => t.loadId === selectedLoad?.id);

  // Filter loads
  const currentLoads = loads && loads.length > 0 ? loads : INITIAL_ACTIVE_LOADS;
  const filteredLoads = (currentLoads || []).filter((load) => {
    const q = (searchQuery || '').toLowerCase().trim();
    const matchesSearch =
      !q ||
      (load?.billOfLadingNo || '').toLowerCase().includes(q) ||
      (load?.trackingCode || '').toLowerCase().includes(q) ||
      (load?.originCity || '').toLowerCase().includes(q) ||
      (load?.destCity || '').toLowerCase().includes(q) ||
      (load?.cargoType || '').toLowerCase().includes(q) ||
      (load?.truckType || '').toLowerCase().includes(q) ||
      (load?.driverName || '').toLowerCase().includes(q);

    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && load?.status === statusFilter;
  });

  const handleCreateQuickIncident = (e: React.FormEvent) => {
    e.preventDefault();
    let catLabel = 'تاخیر در حمل';
    if (incidentCategory === 'damage') catLabel = 'آسیب به بار یا نقض پلمپ';
    if (incidentCategory === 'breakdown') catLabel = 'نقص فنی ناوگان و توقف';
    if (incidentCategory === 'route_deviation') catLabel = 'انحراف از مسیر مجاز';
    if (incidentCategory === 'driver_issue') catLabel = 'عدم پاسخگویی راننده';
    if (incidentCategory === 'pricing_dispute') catLabel = 'مغایرت نرخ یا عوارض';
    if (incidentCategory === 'other') catLabel = 'سایر فوریت‌های عملیاتی';

    const prioLabel =
      incidentPriority === 'urgent'
        ? 'فوری / اضطراری'
        : incidentPriority === 'high'
        ? 'اولویت بالا'
        : 'عادی';

    const newTicket: ShipperSupportTicket = {
      id: `INC-1403-${Math.floor(1000 + Math.random() * 9000)}`,
      loadId: selectedLoad.id,
      billOfLadingNo: selectedLoad.billOfLadingNo,
      trackingCode: selectedLoad.trackingCode,
      originCity: selectedLoad.originCity,
      destCity: selectedLoad.destCity,
      cargoType: `${selectedLoad.cargoType} (${selectedLoad.weightTons} تن)`,
      driverName: selectedLoad.driverName,
      driverPhone: selectedLoad.driverPhone,
      truckPlate: selectedLoad.truckPlate,
      category: incidentCategory,
      categoryLabelFa: catLabel,
      priority: incidentPriority,
      priorityLabelFa: prioLabel,
      status: 'open',
      statusLabelFa: 'باز (در صف بررسی دیسپچینگ)',
      subject: incidentSubject || `گزارش مشکل ${catLabel} در بارنامه ${selectedLoad.billOfLadingNo}`,
      description: incidentDescription || 'گزارش توسط صاحب بار از صفحه رهگیری ثبت شد.',
      createdAt: '۱۴۰۳/۰۶/۰۱ - همین الان',
      updatedAt: 'همین الان',
      assignedAgent: 'شیفت دیسپچینگ فوری ۲۴/۷',
      locationAtReport: selectedLoad.currentLocation,
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'shipper',
          senderName: 'مهندس اکبری (صاحب بار)',
          text: incidentDescription || 'گزارش ثبت شد.',
          timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        },
        {
          id: `msg-sys-${Date.now()}`,
          sender: 'system',
          senderName: 'سامانه دیسپچینگ هوشمند',
          text: `تیکت فوریت مستقیم از صفحه رهگیری بارنامه ${selectedLoad.billOfLadingNo} ایجاد گردید. تیم پشتیبانی تا چند دقیقه آینده پاسخ خواهد داد.`,
          timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
          isSystemAction: true,
        },
      ],
    };

    setTicketsList([newTicket, ...ticketsList]);
    setIsReportModalOpen(false);
    setIncidentSubject('');
    setIncidentDescription('');

    if (onNavigateToSupport) {
      onNavigateToSupport(selectedLoad.id, newTicket.id);
    }
  };

  const getStatusBadge = (status: ShipperActiveLoad['status']) => {
    switch (status) {
      case 'in_transit':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            در مسیر به سمت مقصد
          </span>
        );
      case 'loading':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            در حال بارگیری در مبدأ
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            تحویل داده شد (POD تایید شد)
          </span>
        );
      case 'pending_driver':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold">
            در انتظار اعزام ناوگان
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Primary Control & Active Load Selection Banner (Bright Modern Light Theme) */}
      <div className="bg-gradient-to-r from-amber-50/70 via-white to-slate-50 p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center font-bold shadow-2xs shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 font-title">
                مدیریت و رهگیری هوشمند بارها و ناوگان
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[10px]">
                پوشش سراسری برخط
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              انتخاب و رهگیری لحظه‌ای محموله‌ها، صدور اسناد رسمی چهارگانه، و مدیریت دیسپچینگ ناوگان
            </p>
          </div>
        </div>

        {/* Modern Shipment Picker Dropdown in Top Header */}
        <div className="w-full lg:w-96 shrink-0">
          <ShipmentPickerDropdown
            id="top-header-shipment-picker"
            loads={currentLoads}
            selectedLoadId={selectedLoad?.id}
            onSelect={(load) => setSelectedLoad(load)}
            label="انتخاب محموله فعال جهت مدیریت و رهگیری:"
          />
        </div>
      </div>

      {/* Sub Header Navigation */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {[
            { id: 'active', label: 'بارهای فعال جاری', icon: Truck, count: (currentLoads || []).filter(l => l?.status !== 'delivered').length },
            { id: 'live_map', label: 'نقشه رهگیری زنده GPS', icon: Navigation },
            { id: 'history', label: 'تاریخچه سفارش‌ها', icon: Calendar },
            { id: 'edocs', label: 'اسناد الکترونیکی و POD', icon: FileCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Global Search inside shipments */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          <input
            type="text"
            placeholder="جستجوی شماره بارنامه، راننده یا شهر..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>

      {/* VIEW 1: Active Loads Table */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">لیست محموله‌های فعال:</span>
                <span className="text-xs font-mono text-slate-400">({filteredLoads.length} مورد)</span>
              </div>

              <div className="flex items-center gap-2 min-w-[200px]">
                <ModernSelect
                  id="shipments-status-filter"
                  value={statusFilter}
                  onChange={setStatusFilter}
                  icon={<Filter className="w-3.5 h-3.5 text-slate-400" />}
                  options={[
                    { value: 'all', label: 'همه وضعیت‌ها', badge: `${currentLoads.length}` },
                    { value: 'in_transit', label: 'در حال حرکت', badge: `${currentLoads.filter(l => l.status === 'in_transit').length}` },
                    { value: 'loading', label: 'در حال بارگیری', badge: `${currentLoads.filter(l => l.status === 'loading').length}` },
                    { value: 'pending_driver', label: 'در انتظار ناوگان', badge: `${currentLoads.filter(l => l.status === 'pending_driver').length}` },
                  ]}
                  className="w-48"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold">
                    <th className="p-3.5">شماره بارنامه / رهگیری</th>
                    <th className="p-3.5">مسیر (مبدأ ➔ مقصد)</th>
                    <th className="p-3.5">شرح کالا و وزن</th>
                    <th className="p-3.5">راننده و پلاک ناوگان</th>
                    <th className="p-3.5">وضعیت حمل</th>
                    <th className="p-3.5">پیشرفت مسیر</th>
                    <th className="p-3.5 text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLoads.map((load) => (
                    <tr
                      key={load.id}
                      className="hover:bg-amber-50/40 transition-colors group cursor-pointer"
                      onClick={() => {
                        setSelectedLoad(load);
                        setActiveTab('live_map');
                      }}
                    >
                      <td className="p-3.5">
                        <div className="font-mono font-bold text-slate-900">{load.billOfLadingNo}</div>
                        <div className="font-mono text-[11px] text-slate-400">{load.trackingCode}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-800">{load.originCity} ➔ {load.destCity}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[180px]">{load.destHub}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-medium text-slate-800">{load.cargoType}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{load.weightTons} تن • {load.truckType}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-800">{load.driverName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{load.truckPlate}</div>
                      </td>
                      <td className="p-3.5">
                        {getStatusBadge(load.status)}
                      </td>
                      <td className="p-3.5">
                        <div className="w-28 space-y-1">
                          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                            <span>{load.progressPercent}%</span>
                            <span>{load?.estimatedArrival ? (load.estimatedArrival.split(' - ')?.[1] || load.estimatedArrival) : '-'}</span>
                          </div>
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-amber-500 h-full rounded-full transition-all"
                              style={{ width: `${load.progressPercent}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedLoad(load);
                              setActiveTab('live_map');
                            }}
                            className="px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                            <span>رهگیری</span>
                          </button>

                          {/* Quick Documents View Button */}
                          <button
                            type="button"
                            onClick={() => openDocumentViewer(load, 'bill_of_lading')}
                            className="px-2 py-1.5 bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            title="مشاهده مدارک بارنامه، فاکتور و حواله"
                          >
                            <FileText className="w-3.5 h-3.5 text-amber-600" />
                            <span>مدارک</span>
                          </button>

                          {/* Quick Incident Button / Ticket Status */}
                          {ticketsList.find((t) => t.loadId === load.id && t.status !== 'resolved') ? (
                            <button
                              type="button"
                              onClick={() => {
                                const t = ticketsList.find((tk) => tk.loadId === load.id);
                                if (onNavigateToSupport && t) {
                                  onNavigateToSupport(load.id, t.id);
                                }
                              }}
                              className="px-2 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                              title="مشاهده تیکت فعال حین حمل"
                            >
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                              <span>تیکت فعال</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedLoad(load);
                                setIsReportModalOpen(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                              title="گزارش مشکل این بارنامه"
                            >
                              <LifeBuoy className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Live Tracking GPS & Interactive Map Simulation */}
      {activeTab === 'live_map' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Map Simulation Canvas (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-3xl p-5 sm:p-6 text-slate-900 shadow-xs relative overflow-hidden border border-slate-200 min-h-[420px] flex flex-col justify-between">
              {/* Top Map HUD */}
              <div className="flex flex-wrap items-center justify-between gap-3 z-10 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center font-bold shadow-2xs">
                    <Radio className="w-5 h-5 animate-pulse text-amber-600" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 font-medium">گیرنده ماهواره‌ای GPS / دیسپچینگ AVL</div>
                    <div className="text-sm font-bold text-slate-900 font-mono flex items-center gap-2">
                      <span>{selectedLoad.billOfLadingNo}</span>
                      <span className="text-slate-500 font-sans font-normal text-xs">({selectedLoad.driverName})</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    سیگنال برخط ماهواره‌ای
                  </span>
                  <button
                    type="button"
                    onClick={() => openDocumentViewer(selectedLoad, 'bill_of_lading')}
                    className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-full text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span>اسناد بارنامه</span>
                  </button>
                </div>
              </div>

              {/* Graphical Route Simulation Vector Canvas (Light Theme) */}
              <div className="my-8 px-6 relative">
                {/* Route Background Track */}
                <div className="relative h-3.5 bg-slate-100 rounded-full w-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 via-amber-400 to-amber-500 transition-all duration-700 rounded-full"
                    style={{ width: `${selectedLoad.progressPercent}%` }}
                  />
                </div>

                {/* Truck Marker */}
                <div
                  className="absolute -top-3.5 transition-all duration-700"
                  style={{ left: `calc(${selectedLoad.progressPercent}% - 20px)` }}
                >
                  <div className="w-11 h-11 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg border-2 border-white ring-4 ring-amber-400/25 animate-bounce">
                    <Truck className="w-5 h-5" />
                  </div>
                </div>

                {/* Milestones / Checkpoints */}
                <div className="flex justify-between items-center text-xs pt-5 text-slate-700">
                  <div className="text-right bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="block font-bold text-amber-700 text-xs">{selectedLoad?.originCity || '-'}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      خروج: {selectedLoad?.departureTime ? (selectedLoad.departureTime.split(' - ')?.[1] || selectedLoad.departureTime) : '-'}
                    </span>
                  </div>

                  <div className="text-center bg-amber-50/80 px-4 py-2 rounded-2xl border border-amber-200/70 shadow-2xs">
                    <span className="text-[11px] text-amber-800 block font-medium">موقعیت فعلی روی نقشه:</span>
                    <span className="font-bold text-slate-900 text-xs">{selectedLoad?.currentLocation || '-'}</span>
                  </div>

                  <div className="text-left bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="block font-bold text-emerald-700 text-xs">{selectedLoad?.destCity || '-'}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      تخمین رسیدن: {selectedLoad?.estimatedArrival ? (selectedLoad.estimatedArrival.split(' - ')?.[1] || selectedLoad.estimatedArrival) : '-'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Metrics HUD (Light Theme) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/90 p-4 rounded-2xl border border-slate-200 text-xs text-slate-800">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                  <span className="text-slate-500 text-[10px] block">سرعت لحظه‌ای:</span>
                  <strong className="font-bold font-mono text-amber-700 text-xs">۷۸ کیلومتر بر ساعت</strong>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                  <span className="text-slate-500 text-[10px] block">درصد پیمایش:</span>
                  <strong className="font-bold font-mono text-emerald-700 text-xs">{selectedLoad.progressPercent}٪ تکمیل شده</strong>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                  <span className="text-slate-500 text-[10px] block">پلاک کامیون:</span>
                  <strong className="font-bold font-mono text-slate-900 text-xs">{selectedLoad.truckPlate}</strong>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                  <span className="text-slate-500 text-[10px] block">زمان تخمینی تحویل (ETA):</span>
                  <strong className="font-bold font-mono text-amber-700 text-xs">{selectedLoad.estimatedArrival}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Driver Card & Shipment Deep Details (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Driver Profile */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">مشخصات ناوگان و راننده:</span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                  احراز هویت شده
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center font-bold text-lg">
                  {selectedLoad?.driverName ? selectedLoad.driverName.substring(0, 1) : 'ر'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-900 text-sm">{selectedLoad?.driverName || '-'}</div>
                  <div className="text-slate-500 text-xs font-mono">{selectedLoad?.truckPlate || '-'}</div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400">نوع ناوگان:</span>
                  <span className="font-bold font-mono text-slate-800">{selectedLoad.truckType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">شماره تماس راننده:</span>
                  <span className="font-bold font-mono text-slate-800">{selectedLoad.driverPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">بیمه باربری:</span>
                  <span className="font-bold text-emerald-700">بیمه دانا (سقف ۲.۸ میلیارد)</span>
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href={`tel:${selectedLoad.driverPhone}`}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>تماس مستقیم با راننده</span>
                </a>
                <button
                  type="button"
                  onClick={() => openDocumentViewer(selectedLoad, 'bill_of_lading')}
                  className="px-3 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  title="مشاهده بارنامه و مدارک"
                >
                  <FileText className="w-4 h-4" />
                  <span>مدارک</span>
                </button>
              </div>
            </div>

            {/* In-Transit Incident & 24/7 Dispatch Support Card (Light Theme) */}
            <div className="bg-gradient-to-br from-amber-50 via-white to-orange-50/40 text-slate-900 p-5 rounded-2xl border border-amber-200/90 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-amber-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-800 flex items-center justify-center">
                    <LifeBuoy className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold font-title text-slate-900">پشتیبانی و فوریت‌های حین حمل</span>
                </div>
                <span className="text-[10px] font-mono text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded border border-amber-300 font-bold">
                  ۲۴/۷ دیسپچینگ
                </span>
              </div>

              {activeTicketForSelectedLoad ? (
                <div className="bg-white p-3 rounded-xl border border-amber-300/80 shadow-2xs space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-800 font-bold text-[11px] flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                      تیکت فعال برای این بارنامه:
                    </span>
                    <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-800 border border-slate-200">
                      {activeTicketForSelectedLoad.id}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] line-clamp-2">
                    {activeTicketForSelectedLoad.subject}
                  </p>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 border-t border-slate-100">
                    <span className="text-amber-800 font-bold">{activeTicketForSelectedLoad.statusLabelFa}</span>
                    <span>{activeTicketForSelectedLoad.updatedAt}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateToSupport) {
                        onNavigateToSupport(selectedLoad.id, activeTicketForSelectedLoad.id);
                      }
                    }}
                    className="w-full mt-1 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>مشاهده گفتگو و پیگیری زنده تیکت</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    در صورت بروز تاخیر، آسیب به پلمپ، توقف فنی یا هرگونه مغایرت در مسیر <strong className="text-slate-900">{selectedLoad.originCity} به {selectedLoad.destCity}</strong>، مستقیماً تیکت ثبت فرمایید:
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(true)}
                    className="w-full py-2.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                  >
                    <AlertTriangle className="w-4 h-4 animate-pulse" />
                    <span>گزارش سریع مشکل در این بارنامه ({selectedLoad.billOfLadingNo})</span>
                  </button>
                </div>
              )}

              {anyTicketForSelectedLoad && !activeTicketForSelectedLoad && (
                <div className="flex items-center justify-between bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200 text-[11px] text-emerald-900">
                  <span className="flex items-center gap-1 text-emerald-800 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    تیکت قبلی این بار حل شده است
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateToSupport) {
                        onNavigateToSupport(selectedLoad.id, anyTicketForSelectedLoad.id);
                      }
                    }}
                    className="text-amber-800 hover:underline font-bold"
                  >
                    مشاهده آرشیو
                  </button>
                </div>
              )}
            </div>

            {/* Quick Switch Shipment */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-700 block">انتخاب سایر بارهای در حال تردد:</span>
              <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
                {currentLoads.map((load) => (
                  <button
                    key={load.id}
                    type="button"
                    onClick={() => setSelectedLoad(load)}
                    className={`w-full text-right p-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                      selectedLoad.id === load.id
                        ? 'bg-amber-50 text-amber-950 border border-amber-300 font-bold'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-transparent'
                    }`}
                  >
                    <div>
                      <span className="block font-mono">{load.billOfLadingNo}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{load.originCity} ➔ {load.destCity}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                      {load.statusLabelFa}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: Order History */}
      {activeTab === 'history' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">آرشیو و تاریخچه تمامی بارنامه‌ها</h3>
              <p className="text-xs text-slate-400">جستجو و فیلتر بارهای تحویل‌شده در ماه‌های گذشته ({currentLoads.length} بارنامه)</p>
            </div>
            <button
              type="button"
              onClick={() => alert('خروجی اکسل کامل گزارش بارنامه‌ها با موفقیت دانلود شد.')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>خروجی اکسل کامل (XLSX)</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {currentLoads.map((load) => (
              <div key={load.id} className="py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-slate-900">{load.billOfLadingNo}</span>
                    <span className="text-slate-400">|</span>
                    <span className="font-bold text-slate-700">{load.originCity} به {load.destCity}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    کالا: {load.cargoType} ({load.weightTons} تن) • راننده: {load.driverName}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-left font-mono">
                    <div className="font-bold text-slate-900">{(load.totalCostRials / 10).toLocaleString('fa-IR')} تومان</div>
                    <div className="text-[10px] text-slate-400">{load?.departureTime ? (load.departureTime.split(' - ')?.[0] || load.departureTime) : '-'}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert(`دانلود نسخه دیجیتال بارنامه ${load.billOfLadingNo}`)}
                    className="p-2 bg-slate-50 hover:bg-amber-50 text-slate-600 hover:text-amber-900 rounded-lg border border-slate-200 cursor-pointer"
                    title="دانلود بارنامه"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: e-Documents & Digital POD */}
      {activeTab === 'edocs' && (
        <div className="space-y-6">
          {/* Header & Quick Filter Banner (Bright Light Theme with Modern ShipmentPickerDropdown) */}
          <div className="bg-gradient-to-r from-amber-50/70 via-white to-slate-50 text-slate-900 p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 font-bold shrink-0">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base font-title flex items-center gap-2">
                  <span>سامانه صدور و مدیریت اسناد الکترونیکی محموله‌ها</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full border border-emerald-300 font-mono font-bold">
                    تولید خودکار برخط
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  برای هر محموله ثبت‌شده، مدارک پیش‌فاکتور رسمی، فاکتور مالیاتی ارزش‌افزوده، حواله بارگیری انبار و بارنامه تمبردار راهداری به تفکیک تولید شده است.
                </p>
              </div>
            </div>

            <div className="w-full lg:w-80 shrink-0">
              <ShipmentPickerDropdown
                id="edocs-shipment-picker"
                loads={currentLoads}
                selectedLoadId={selectedLoad?.id}
                onSelect={(load) => setSelectedLoad(load)}
                label="انتخاب محموله جهت مشاهده اسناد:"
              />
            </div>
          </div>

          {/* 4 Standard Shipment Documents Grid for the selected load */}
          {(() => {
            const currentPackage = generateFullShipmentDocumentPackage(selectedLoad, currentShipperOrg);
            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>بسته اسناد رسمی بارنامه</span>
                    <span className="font-mono text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                      {selectedLoad.billOfLadingNo}
                    </span>
                    <span className="text-xs font-normal text-slate-500">
                      ({selectedLoad.cargoType} • {selectedLoad.driverName})
                    </span>
                  </h4>

                  <button
                    type="button"
                    onClick={() => openDocumentViewer(selectedLoad, 'bill_of_lading')}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>مشاهده پیش‌نمایش و چاپ کلیه اسناد</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* DOCUMENT CARD 1: PROFORMA INVOICE */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold">
                          <FileText className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          {currentPackage.proformaInvoice.issueDate}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-bold">
                          {currentPackage.proformaInvoice.documentNumber}
                        </span>
                        <h5 className="font-bold text-slate-800 text-sm mt-1">پیش‌فاکتور حمل و استعلام بها</h5>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                          محاسبه کرایه پایه، بیمه‌نامه، مالیات و شرایط پرداخت قبل از بارگیری
                        </p>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1 text-[11px] font-mono">
                        <div className="flex justify-between text-slate-600">
                          <span>مبلغ کل برآورد:</span>
                          <strong className="text-slate-900">
                            {currentPackage.proformaInvoice.pricingBreakdown.totalNetPayableRials.toLocaleString('fa-IR')} ریال
                          </strong>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>مهلت اعتبار:</span>
                          <span className="text-rose-600 font-bold">{currentPackage.proformaInvoice.validityDate.split(' ')[0]}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex gap-2">
                      <button
                        type="button"
                        onClick={() => openDocumentViewer(selectedLoad, 'proforma')}
                        className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>مشاهده جزئیات</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => alert(`دانلود پیش‌فاکتور ${currentPackage.proformaInvoice.documentNumber}`)}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                        title="دانلود PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* DOCUMENT CARD 2: TAX OFFICIAL INVOICE */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
                          <Receipt className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded font-bold">
                          سامانه مودیان
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                          {currentPackage.officialInvoice.invoiceNumber}
                        </span>
                        <h5 className="font-bold text-slate-800 text-sm mt-1">صورتحساب و فاکتور رسمی مالیاتی</h5>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                          دارای شناسه یکتای مالیاتی، کد اقتصادی و ثبت ۱۰٪ ارزش افزوده
                        </p>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1 text-[11px] font-mono">
                        <div className="flex justify-between text-slate-600">
                          <span>مالیات ارزش افزوده:</span>
                          <strong className="text-emerald-700">
                            {currentPackage.officialInvoice.pricingBreakdown.vatAmountRials.toLocaleString('fa-IR')} ریال
                          </strong>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>وضعیت تسویه:</span>
                          <span className="text-slate-800 font-bold font-sans">
                            {currentPackage.officialInvoice.paymentInfo.paymentStatusFa}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex gap-2">
                      <button
                        type="button"
                        onClick={() => openDocumentViewer(selectedLoad, 'official_invoice')}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>مشاهده فاکتور</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => alert(`دانلود فاکتور مالیاتی ${currentPackage.officialInvoice.invoiceNumber}`)}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                        title="دانلود PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* DOCUMENT CARD 3: LOADING ORDER / DISPATCH SLIP */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-sky-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center font-bold">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono text-sky-800 bg-sky-100 px-1.5 py-0.5 rounded font-bold">
                          گیت ورود و باسکول
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded font-bold">
                          {currentPackage.loadingOrder.loadingOrderCode}
                        </span>
                        <h5 className="font-bold text-slate-800 text-sm mt-1">حواله رسمی بارگیری و نوبت انبار</h5>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                          شامل کارت هوشمند راننده، پلاک ناوگان، نوبت ورود و دستورالعمل مهار
                        </p>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1 text-[11px]">
                        <div className="flex justify-between text-slate-600">
                          <span>راننده منتسب:</span>
                          <strong className="text-slate-900 font-mono">{currentPackage.loadingOrder.driverFleet.driverFullName}</strong>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>کد حراست گیت:</span>
                          <strong className="text-sky-700 font-mono">{currentPackage.loadingOrder.securityClearanceCode}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex gap-2">
                      <button
                        type="button"
                        onClick={() => openDocumentViewer(selectedLoad, 'loading_order')}
                        className="flex-1 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>مشاهده حواله</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => alert(`دانلود حواله بارگیری ${currentPackage.loadingOrder.loadingOrderCode}`)}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                        title="دانلود PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* DOCUMENT CARD 4: OFFICIAL RMTO BILL OF LADING */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded font-bold">
                          تمبردار راهداری
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-bold">
                          {currentPackage.billOfLading.billOfLadingNo}
                        </span>
                        <h5 className="font-bold text-slate-800 text-sm mt-1">بارنامه رسمی تمبردار راهداری</h5>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                          سند رسمی دارای کد رهگیری RMTO، بیمه‌نامه دانا و مهر دیجیتال شرکت
                        </p>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1 text-[11px]">
                        <div className="flex justify-between text-slate-600">
                          <span>کد رهگیری برخط:</span>
                          <strong className="text-slate-900 font-mono">{currentPackage.billOfLading.rmtoTrackingCode}</strong>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>بیمه پوشش کامل:</span>
                          <span className="text-emerald-700 font-bold">فعال و تاییدشده</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex gap-2">
                      <button
                        type="button"
                        onClick={() => openDocumentViewer(selectedLoad, 'bill_of_lading')}
                        className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>مشاهده بارنامه</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => alert(`دانلود بارنامه الکترونیکی ${currentPackage.billOfLading.billOfLadingNo}`)}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                        title="دانلود PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Complete Shipments Electronic Document Table */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">آرشیو اسناد و فاکتورهای تمامی محموله‌های ثبت‌شده</h4>
                <p className="text-xs text-slate-400">مشاهده و دریافت مدارک به تفکیک بارنامه‌های فعال و تحویل‌شده</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alert('کلیه مدارک و بارنامه‌های منتخب در قالب فایل فشرده ZIP آماده دانلود شد.')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>دانلود یکجای تمام اسناد (ZIP)</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">شماره بارنامه / رهگیری</th>
                    <th className="p-3">مسیر و نوع کالا</th>
                    <th className="p-3">پیش‌فاکتور</th>
                    <th className="p-3">فاکتور رسمی</th>
                    <th className="p-3">حواله بارگیری</th>
                    <th className="p-3">بارنامه راهداری</th>
                    <th className="p-3 text-center">عملیات سند</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentLoads.map((load) => {
                    const pkg = generateFullShipmentDocumentPackage(load, currentShipperOrg);
                    return (
                      <tr key={load.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-mono">
                          <div className="font-bold text-slate-900">{load.billOfLadingNo}</div>
                          <div className="text-[10px] text-slate-400">{load.trackingCode}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-slate-800">{load.originCity} ➔ {load.destCity}</div>
                          <div className="text-[11px] text-slate-500">{load.cargoType} ({load.weightTons} تن)</div>
                        </td>
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => openDocumentViewer(load, 'proforma')}
                            className="text-amber-700 hover:underline font-mono text-[11px] block cursor-pointer"
                          >
                            {pkg.proformaInvoice.documentNumber}
                          </button>
                          <span className="text-[10px] text-slate-400">تایید نهایی</span>
                        </td>
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => openDocumentViewer(load, 'official_invoice')}
                            className="text-emerald-700 hover:underline font-mono text-[11px] block cursor-pointer"
                          >
                            {pkg.officialInvoice.invoiceNumber}
                          </button>
                          <span className="text-[10px] text-emerald-600 font-sans">ثبت در مودیان</span>
                        </td>
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => openDocumentViewer(load, 'loading_order')}
                            className="text-sky-700 hover:underline font-mono text-[11px] block cursor-pointer"
                          >
                            {pkg.loadingOrder.loadingOrderCode}
                          </button>
                          <span className="text-[10px] text-slate-400 font-sans">{pkg.loadingOrder.driverFleet.driverFullName}</span>
                        </td>
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => openDocumentViewer(load, 'bill_of_lading')}
                            className="text-slate-900 hover:text-amber-700 hover:underline font-mono text-[11px] font-bold block cursor-pointer"
                          >
                            {pkg.billOfLading.billOfLadingNo}
                          </button>
                          <span className="text-[10px] text-emerald-600 font-sans">تمبردار قانونی</span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => openDocumentViewer(load, 'bill_of_lading')}
                            className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-lg text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>مشاهده</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* QUICK IN-TRANSIT INCIDENT REPORT MODAL (Auto-bound to selectedLoad) */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden text-right">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-rose-600 to-rose-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-sm font-title">گزارش فوری مشکل و ثبت تیکت حین حمل</h3>
                  <p className="text-xs text-rose-100">اتصال خودکار به بارنامه {selectedLoad.billOfLadingNo}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateQuickIncident} className="p-5 space-y-4 text-xs">
              {/* Pre-filled shipment summary info badge */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">بارنامه انتخابی:</span>
                  <strong className="font-mono text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded">
                    {selectedLoad.billOfLadingNo} ({selectedLoad.trackingCode})
                  </strong>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                  <div>مسیر: <strong>{selectedLoad.originCity} به {selectedLoad.destCity}</strong></div>
                  <div>راننده: <strong>{selectedLoad.driverName} ({selectedLoad.truckPlate})</strong></div>
                  <div className="col-span-2 text-slate-500">موقعیت فعلی ناوگان: <strong>{selectedLoad.currentLocation}</strong></div>
                </div>
              </div>

              {/* Category & Priority Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <ModernSelect
                    id="incident-category-select"
                    value={incidentCategory}
                    onChange={(val) => setIncidentCategory(val as any)}
                    label="نوع فوریت / مشکل"
                    options={[
                      { value: 'delay', label: 'تاخیر در بارگیری / رسیدن به مقصد' },
                      { value: 'damage', label: 'آسیب به بار / نقض پلمپ یا چادر' },
                      { value: 'breakdown', label: 'نقص فنی ناوگان و توقف بین‌راهی' },
                      { value: 'route_deviation', label: 'انحراف از مسیر یا تغییر مقصد' },
                      { value: 'driver_issue', label: 'عدم پاسخگویی یا ناهماهنگی راننده' },
                      { value: 'pricing_dispute', label: 'مغایرت نرخ، کرایه، عوارض یا توقف' },
                      { value: 'other', label: 'سایر موارد عملیاتی' },
                    ]}
                  />
                </div>

                <div>
                  <ModernSelect
                    id="incident-priority-select"
                    value={incidentPriority}
                    onChange={(val) => setIncidentPriority(val as any)}
                    label="سطح اولویت"
                    options={[
                      { value: 'urgent', label: 'فوری / اضطراری (اقدام کمتر از ۵ دقیقه)', badge: 'فوری' },
                      { value: 'high', label: 'اولویت بالا (خطر توقف خط تولید)', badge: 'بالا' },
                      { value: 'normal', label: 'عادی (پیگیری اداری)', badge: 'عادی' },
                    ]}
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  عنوان مشکل:
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: تاخیر در تخلیه بار در انبار مقصد..."
                  value={incidentSubject}
                  onChange={(e) => setIncidentSubject(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-rose-500 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  شرح کامل حادثه و درخواست از دیسپچینگ:
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="توضیحات تکمیلی را جهت رسیدگی فوری کارشناس بنویسید..."
                  value={incidentDescription}
                  onChange={(e) => setIncidentDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-rose-500 focus:outline-none resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>ارسال به دیسپچینگ و باز کردن تیکت</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SHIPMENT DOCUMENT MODAL (Proforma, Tax Invoice, Loading Order, Bill of Lading) */}
      {isDocModalOpen && activeDocPackage && (
        <ShipmentDocumentModal
          isOpen={isDocModalOpen}
          onClose={() => setIsDocModalOpen(false)}
          documentPackage={activeDocPackage}
          initialDocType={docModalType}
        />
      )}
    </div>
  );
};
