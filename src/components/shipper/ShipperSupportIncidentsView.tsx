import React, { useState } from 'react';
import {
  LifeBuoy,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
  Truck,
  Phone,
  ShieldAlert,
  Search,
  Filter,
  PlusCircle,
  FileText,
  Paperclip,
  User,
  Headphones,
  Navigation,
  ArrowRight,
  Sparkles,
  CheckCircle,
  XCircle,
  Maximize2,
  RotateCcw,
  BadgeAlert,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import {
  INITIAL_ACTIVE_LOADS,
  INITIAL_SUPPORT_TICKETS,
  ShipperActiveLoad,
  ShipperSupportTicket,
  ShipperTicketMessage,
} from '../../data/mockShipperData';
import { ModernSelect } from '../common/menus/ModernSelect';
import { IranLicensePlate } from '../common/IranLicensePlate';

interface ShipperSupportIncidentsViewProps {
  initialSelectedTicketId?: string | null;
  initialPreselectedLoadId?: string | null;
  onNavigateToTracking?: (load: ShipperActiveLoad) => void;
}

export const ShipperSupportIncidentsView: React.FC<ShipperSupportIncidentsViewProps> = ({
  initialSelectedTicketId,
  initialPreselectedLoadId,
  onNavigateToTracking,
}) => {
  const [tickets, setTickets] = useState<ShipperSupportTicket[]>(INITIAL_SUPPORT_TICKETS);
  const [selectedTicketId, setSelectedTicketId] = useState<string>(
    initialSelectedTicketId ||
      (initialPreselectedLoadId
        ? tickets.find((t) => t.loadId === initialPreselectedLoadId)?.id || tickets[0]?.id
        : tickets[0]?.id)
  );

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState<boolean>(!!initialPreselectedLoadId && !tickets.some(t => t.loadId === initialPreselectedLoadId));

  // Chat state
  const [replyText, setReplyText] = useState<string>('');

  // New Ticket Form State
  const [newTicketLoadId, setNewTicketLoadId] = useState<string>(
    initialPreselectedLoadId || INITIAL_ACTIVE_LOADS[0]?.id || ''
  );
  const [newTicketCategory, setNewTicketCategory] = useState<ShipperSupportTicket['category']>('delay');
  const [newTicketPriority, setNewTicketPriority] = useState<ShipperSupportTicket['priority']>('high');
  const [newTicketSubject, setNewTicketSubject] = useState<string>('');
  const [newTicketDescription, setNewTicketDescription] = useState<string>('');
  const [newTicketLocation, setNewTicketLocation] = useState<string>('');

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];
  const relatedActiveLoad = INITIAL_ACTIVE_LOADS.find((l) => l.id === selectedTicket?.loadId);

  // Filtered tickets
  const filteredTickets = tickets.filter((t) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      t.id.toLowerCase().includes(q) ||
      t.billOfLadingNo.toLowerCase().includes(q) ||
      t.trackingCode.toLowerCase().includes(q) ||
      t.driverName.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      t.originCity.toLowerCase().includes(q) ||
      t.destCity.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const openCount = tickets.filter((t) => t.status === 'open').length;
  const inProgressCount = tickets.filter((t) => t.status === 'in_progress').length;
  const resolvedCount = tickets.filter((t) => t.status === 'resolved').length;

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    const newMessage: ShipperTicketMessage = {
      id: `msg-${Date.now()}`,
      sender: 'shipper',
      senderName: 'مهندس اکبری (صاحب بار)',
      text: replyText.trim(),
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    };

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === selectedTicket.id) {
          return {
            ...t,
            updatedAt: 'همین الان',
            messages: [...t.messages, newMessage],
          };
        }
        return t;
      })
    );

    setReplyText('');

    // Simulate auto-support response after 1.5s
    setTimeout(() => {
      const autoResponse: ShipperTicketMessage = {
        id: `msg-rep-${Date.now()}`,
        sender: 'support',
        senderName: 'مهندس حسینی (پشتیبانی عملیات دیسپچینگ)',
        text: 'پیام شما دریافت شد. در حال پیگیری با راننده و پایانه مبدأ/مقصد هستیم و نتیجه در همین صفحه به اطلاع شما خواهد رسید.',
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      };

      setTickets((prev) =>
        prev.map((t) => {
          if (t.id === selectedTicket.id) {
            return {
              ...t,
              status: t.status === 'open' ? 'in_progress' : t.status,
              statusLabelFa: 'در حال پیگیری تیم دیسپچینگ',
              updatedAt: 'همین الان',
              messages: [...t.messages, autoResponse],
            };
          }
          return t;
        })
      );
    }, 1500);
  };

  const handleQuickChip = (text: string) => {
    setReplyText(text);
  };

  const handleResolveTicket = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const sysMsg: ShipperTicketMessage = {
            id: `msg-res-${Date.now()}`,
            sender: 'system',
            senderName: 'سیستم ثبت رضایت صاحب بار',
            text: 'تیکت توسط صاحب بار به عنوان «حل‌شده و رضایت‌بخش» علامت‌گذاری و مختومه گردید.',
            timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
            isSystemAction: true,
          };
          return {
            ...t,
            status: 'resolved',
            statusLabelFa: 'حل‌شده و مختومه',
            updatedAt: 'همین الان',
            resolutionNotes: 'مشکل با توافق طرفین برطرف شد.',
            messages: [...t.messages, sysMsg],
          };
        }
        return t;
      })
    );
  };

  const handleCreateNewTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const load = INITIAL_ACTIVE_LOADS.find((l) => l.id === newTicketLoadId) || INITIAL_ACTIVE_LOADS[0];

    let catLabel = 'تاخیر در حمل';
    if (newTicketCategory === 'damage') catLabel = 'آسیب به بار یا نقض پلمپ';
    if (newTicketCategory === 'breakdown') catLabel = 'نقص فنی ناوگان و توقف';
    if (newTicketCategory === 'route_deviation') catLabel = 'انحراف از مسیر مجاز';
    if (newTicketCategory === 'driver_issue') catLabel = 'عدم پاسخگویی راننده';
    if (newTicketCategory === 'pricing_dispute') catLabel = 'مغایرت کرایه یا عوارض';
    if (newTicketCategory === 'other') catLabel = 'سایر فوریت‌های حمل';

    const prioLabel =
      newTicketPriority === 'urgent'
        ? 'فوری / اضطراری'
        : newTicketPriority === 'high'
        ? 'اولویت بالا'
        : 'عادی';

    const newTicket: ShipperSupportTicket = {
      id: `INC-1403-${Math.floor(1000 + Math.random() * 9000)}`,
      loadId: load.id,
      billOfLadingNo: load.billOfLadingNo,
      trackingCode: load.trackingCode,
      originCity: load.originCity,
      destCity: load.destCity,
      cargoType: `${load.cargoType} (${load.weightTons} تن)`,
      driverName: load.driverName,
      driverPhone: load.driverPhone,
      truckPlate: load.truckPlate,
      category: newTicketCategory,
      categoryLabelFa: catLabel,
      priority: newTicketPriority,
      priorityLabelFa: prioLabel,
      status: 'open',
      statusLabelFa: 'باز (در صف بررسی دیسپچینگ)',
      subject: newTicketSubject || `گزارش مشکل ${catLabel} در بارنامه ${load.billOfLadingNo}`,
      description: newTicketDescription || 'مشکل توسط صاحب بار ثبت گردید.',
      createdAt: '۱۴۰۳/۰۶/۰۱ - همین الان',
      updatedAt: 'همین الان',
      assignedAgent: 'شیفت دیسپچینگ فوری ۲۴/۷',
      locationAtReport: newTicketLocation || load.currentLocation,
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'shipper',
          senderName: 'مهندس اکبری (صاحب بار)',
          text: newTicketDescription || 'گزارش ثبت شد.',
          timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        },
        {
          id: `msg-sys-${Date.now()}`,
          sender: 'system',
          senderName: 'سامانه هوشمند پشتیبانی بار',
          text: `تیکت پشتیبانی متصل به بارنامه ${load.billOfLadingNo} ثبت شد. کارشناس مربوطه حداکثر ظرف ۵ دقیقه پاسخ خواهد داد.`,
          timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
          isSystemAction: true,
        },
      ],
    };

    setTickets([newTicket, ...tickets]);
    setSelectedTicketId(newTicket.id);
    setIsNewTicketModalOpen(false);
    setNewTicketSubject('');
    setNewTicketDescription('');
    setNewTicketLocation('');
  };

  const getStatusBadge = (status: ShipperSupportTicket['status']) => {
    switch (status) {
      case 'open':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300 text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
            باز (در صف بررسی)
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-300 text-[11px] font-bold">
            <Clock className="w-3 h-3 text-blue-600 animate-spin" />
            در حال بررسی دیسپچینگ
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-300 text-[11px] font-bold">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            حل‌شده و مختومه
          </span>
        );
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: ShipperSupportTicket['priority']) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            فوری / اضطراری
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 border border-orange-200 text-[10px] font-bold">
            اولویت بالا
          </span>
        );
      case 'normal':
      default:
        return (
          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold">
            عادی
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Metrics & SLA Overview Banner (Clean, Light & Minimalist) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-bold shrink-0">
              <LifeBuoy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold font-title text-slate-900">
                  مرکز پشتیبانی، دیسپچینگ و فوریت‌های حین حمل
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold">
                  اتصال مستقیم به بارنامه ۲۴/۷
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                حل سریع مغایرت‌ها، تاخیرات جاده‌ای، هماهنگی بارگیری/تخلیه و ارزیابی آنلاین خسارت بدون نیاز به تماس‌های مکرر
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:02188000011"
              className="px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              <span className="font-mono text-slate-900">خط اضطراری: ۰۲۱-۸۸۰۰۰۰۱۱</span>
            </a>

            <button
              type="button"
              id="btn-open-new-ticket-modal"
              onClick={() => setIsNewTicketModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>ثبت تیکت فوریت جدید</span>
            </button>
          </div>
        </div>

        {/* Clean Light KPI Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100 text-xs">
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
            <span className="text-slate-500 text-[11px] block">تیکت‌های در حال پیگیری:</span>
            <div className="flex items-center gap-2 mt-1">
              <strong className="text-base font-bold text-amber-700 font-mono">
                {openCount + inProgressCount}
              </strong>
              <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full font-bold border border-amber-200">
                مورد فعال
              </span>
            </div>
          </div>

          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
            <span className="text-slate-500 text-[11px] block">میانگین زمان پاسخگویی (SLA):</span>
            <div className="flex items-center gap-2 mt-1">
              <strong className="text-base font-bold text-emerald-700 font-mono">
                ۳.۸ دقیقه
              </strong>
              <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                تضمین طلایی
              </span>
            </div>
          </div>

          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
            <span className="text-slate-500 text-[11px] block">حل و فصل موفق تیکت‌ها:</span>
            <div className="flex items-center gap-2 mt-1">
              <strong className="text-base font-bold text-slate-800 font-mono">
                {resolvedCount} تیکت
              </strong>
              <span className="text-[10px] text-slate-500 font-medium">(۱۰۰٪ رضایت)</span>
            </div>
          </div>

          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
            <span className="text-slate-500 text-[11px] block">پوشش بیمه و پشتیبانی:</span>
            <div className="flex items-center gap-1.5 mt-1 text-teal-700 font-bold">
              <ShieldAlert className="w-4 h-4 text-teal-600" />
              <span>تمام‌خطر فعال</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Workstation: Left Chat Detail (7 cols) + Right Ticket List (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* RIGHT COLUMN (5 COLS): Filterable Ticket List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-4 space-y-3">
            {/* Search & Filters */}
            <div className="flex flex-col gap-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                <input
                  type="text"
                  placeholder="جستجوی شماره بارنامه، شناسه تیکت، راننده یا شهر..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`flex-1 py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center whitespace-nowrap ${
                    statusFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  همه ({tickets.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('in_progress')}
                  className={`flex-1 py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center whitespace-nowrap ${
                    statusFilter === 'in_progress'
                      ? 'bg-white text-blue-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  در حال بررسی ({inProgressCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('open')}
                  className={`flex-1 py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center whitespace-nowrap ${
                    statusFilter === 'open'
                      ? 'bg-white text-amber-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  باز ({openCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('resolved')}
                  className={`flex-1 py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center whitespace-nowrap ${
                    statusFilter === 'resolved'
                      ? 'bg-white text-emerald-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  حل‌شده ({resolvedCount})
                </button>
              </div>
            </div>

            {/* Ticket Cards List */}
            <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-0.5">
              {filteredTickets.length === 0 ? (
                <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <LifeBuoy className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-600 font-bold">موردی با فیلترهای انتخابی یافت نشد.</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    می‌توانید فیلتر جستجو را پاک کنید یا تیکت جدید ثبت نمایید.
                  </p>
                </div>
              ) : (
                filteredTickets.map((ticket) => {
                  const isSelected = ticket.id === selectedTicket?.id;
                  return (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicketId(ticket.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-right space-y-2.5 ${
                        isSelected
                          ? 'bg-amber-50/60 border-amber-400 ring-2 ring-amber-400/20 shadow-xs'
                          : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                            {ticket.id}
                          </span>
                          <span className="font-mono text-[11px] font-bold text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded-md">
                            {ticket.billOfLadingNo}
                          </span>
                        </div>
                        {getStatusBadge(ticket.status)}
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                          {ticket.subject}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                          <span>{ticket.originCity} ➔ {ticket.destCity}</span>
                          <span>•</span>
                          <span>راننده: {ticket.driverName}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                        <div className="flex items-center gap-2">
                          {getPriorityBadge(ticket.priority)}
                          <span className="text-slate-500 font-medium">{ticket.categoryLabelFa}</span>
                        </div>
                        <div className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{ticket.updatedAt}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* LEFT COLUMN (7 COLS): Incident Details & Live Chat Conversation */}
        <div className="lg:col-span-7 space-y-4">
          {selectedTicket ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col min-h-[660px]">
              {/* Incident Header & Connected Waybill Information */}
              <div className="p-4 sm:p-5 bg-slate-50/90 border-b border-slate-200 space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">شماره تیکت:</span>
                    <span className="font-mono font-bold text-xs text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                      {selectedTicket.id}
                    </span>
                    {getPriorityBadge(selectedTicket.priority)}
                    {getStatusBadge(selectedTicket.status)}
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedTicket.status !== 'resolved' ? (
                      <button
                        type="button"
                        onClick={() => handleResolveTicket(selectedTicket.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>علامت‌گذاری به عنوان حل‌شده</span>
                      </button>
                    ) : (
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        مختومه با رضایت کامل
                      </span>
                    )}
                  </div>
                </div>

                {/* Connected Waybill Banner (Never generic!) */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-amber-600" />
                      <span className="font-bold text-slate-900">بارنامه متصل:</span>
                      <strong className="font-mono font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {selectedTicket.billOfLadingNo}
                      </strong>
                      <span className="text-slate-400 font-mono text-[11px]">({selectedTicket.trackingCode})</span>
                    </div>

                    {relatedActiveLoad && onNavigateToTracking && (
                      <button
                        type="button"
                        onClick={() => onNavigateToTracking(relatedActiveLoad)}
                        className="text-[11px] font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <Navigation className="w-3 h-3" />
                        <span>مشاهده زنده روی نقشه GPS</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">مسیر حمل:</span>
                      <span className="font-bold text-slate-800">{selectedTicket.originCity} به {selectedTicket.destCity}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">راننده ناوگان:</span>
                      <span className="font-bold text-slate-800">{selectedTicket.driverName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] mb-1">پلاک کامیون:</span>
                      <IranLicensePlate plateString={selectedTicket.truckPlate} size="xs" />
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">کارشناس پاسخگو:</span>
                      <span className="font-bold text-teal-800 truncate block">{selectedTicket.assignedAgent}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                    <div className="flex items-center gap-1 text-slate-600">
                      <Navigation className="w-3.5 h-3.5 text-amber-600" />
                      <span>موقعیت ثبت حادثه:</span>
                      <strong className="text-slate-800">{selectedTicket.locationAtReport}</strong>
                    </div>

                    <a
                      href={`tel:${selectedTicket.driverPhone}`}
                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors"
                    >
                      <Phone className="w-3 h-3 text-emerald-600" />
                      <span>تماس مستقیم با راننده ({selectedTicket.driverPhone})</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Chat Thread Messages */}
              <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-50/40">
                {selectedTicket.messages.map((msg) => {
                  if (msg.isSystemAction) {
                    return (
                      <div key={msg.id} className="flex justify-center my-2">
                        <div className="px-3 py-1.5 rounded-full bg-slate-200/80 text-slate-700 text-[11px] font-medium border border-slate-300/60 flex items-center gap-1.5 max-w-[90%] text-center">
                          <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>{msg.text}</span>
                          <span className="text-[10px] text-slate-500 font-mono shrink-0">({msg.timestamp})</span>
                        </div>
                      </div>
                    );
                  }

                  const isShipper = msg.sender === 'shipper';
                  const isDriver = msg.sender === 'driver';
                  const isSupport = msg.sender === 'support';

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 max-w-[88%] ${
                        isShipper ? 'mr-auto flex-row-reverse' : 'ml-auto flex-row'
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${
                          isShipper
                            ? 'bg-amber-500 text-white'
                            : isSupport
                            ? 'bg-teal-600 text-white'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {isShipper ? 'شما' : isSupport ? <Headphones className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                      </div>

                      {/* Message Bubble */}
                      <div
                        className={`p-3.5 rounded-2xl space-y-1 text-right text-xs shadow-2xs ${
                          isShipper
                            ? 'bg-amber-500 text-white rounded-tr-none'
                            : isSupport
                            ? 'bg-white text-slate-800 border border-teal-200 rounded-tl-none ring-1 ring-teal-500/10'
                            : 'bg-white text-slate-800 border border-blue-200 rounded-tl-none'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3 text-[10px]">
                          <span className={`font-bold ${isShipper ? 'text-amber-100' : isSupport ? 'text-teal-800' : 'text-blue-800'}`}>
                            {msg.senderName}
                          </span>
                          <span className={`font-mono ${isShipper ? 'text-amber-200' : 'text-slate-400'}`}>
                            {msg.timestamp}
                          </span>
                        </div>
                        <p className="leading-relaxed whitespace-pre-wrap font-medium">
                          {msg.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Reply Chips */}
              <div className="px-4 py-2 bg-slate-100/70 border-t border-slate-200/80 flex items-center gap-1.5 overflow-x-auto text-[11px]">
                <span className="text-slate-400 font-bold shrink-0 text-[10px]">پاسخ سریع:</span>
                {[
                  'آیا موقعیت دقیق GPS راننده بررسی شد؟',
                  'هماهنگی با نوبت‌دهی انبار مقصد انجام شده است.',
                  'لطفاً عکس پلمپ و وضعیت بار ضمیمه شود.',
                  'مشکل رفع گردید، با تشکر از پیگیری سریع.',
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickChip(chip)}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200 text-[11px] whitespace-nowrap transition-colors cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Chat Input Box */}
              <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                <input
                  type="file"
                  id="incident-file-upload"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setReplyText((prev) => prev ? `${prev} [ضمیمه: ${file.name}]` : `[پیوست سند: ${file.name}]`);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('incident-file-upload')?.click()}
                  className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  title="پیوست تصویر یا سند خسارت/بارنامه"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  placeholder="پیام یا توضیحات جدید خود را درباره این بارنامه بنویسید..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-amber-500 focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className={`p-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    replyText.trim()
                      ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4 rotate-180" />
                  <span className="hidden sm:inline">ارسال</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400">
              یک تیکت را از ستون راست انتخاب فرمایید.
            </div>
          )}
        </div>
      </div>

      {/* 3. Modal: Register New In-Transit Incident / Ticket */}
      {isNewTicketModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden text-right">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm font-title">ثبت تیکت فوریت و گزارش مشکل حین حمل</h3>
                  <p className="text-xs text-amber-100">ارسال مستقیم به دیسپچینگ ۲۴ ساعته و اتصال به بارنامه</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewTicketModalOpen(false)}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateNewTicket} className="p-5 space-y-4">
              {/* Select Active Shipment (Crucial: Connected to active loads!) */}
              <div>
                <ModernSelect
                  id="ticket-active-load-select"
                  label="انتخاب بارنامه / محموله دارای مشکل"
                  value={newTicketLoadId}
                  onChange={(val) => setNewTicketLoadId(val)}
                  options={INITIAL_ACTIVE_LOADS.map((load) => ({
                    value: load.id,
                    label: `${load.billOfLadingNo} (${load.originCity} ➔ ${load.destCity})`,
                    subLabel: `راننده: ${load.driverName} • ${load.cargoType} • ${load.truckType}`,
                    badge: load.status === 'in_transit' ? 'در مسیر' : 'بارگیری',
                  }))}
                />
              </div>

              {/* Category & Priority Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <ModernSelect
                    id="ticket-category-select"
                    label="دسته‌بندی نوع مشکل"
                    value={newTicketCategory}
                    onChange={(val) => setNewTicketCategory(val as any)}
                    options={[
                      { value: 'delay', label: 'تاخیر در بارگیری / رسیدن به مقصد', badge: 'عملیاتی' },
                      { value: 'damage', label: 'آسیب به بار / نقض پلمپ یا چادر', badge: 'بیمه/خسارت' },
                      { value: 'breakdown', label: 'نقص فنی ناوگان و توقف بین‌راهی', badge: 'فنی' },
                      { value: 'route_deviation', label: 'انحراف از مسیر یا تغییر مقصد', badge: 'ناوبری' },
                      { value: 'driver_issue', label: 'عدم پاسخگویی یا ناهماهنگی راننده', badge: 'راننده' },
                      { value: 'pricing_dispute', label: 'مغایرت نرخ، کرایه، عوارض یا توقف', badge: 'مالی' },
                      { value: 'other', label: 'سایر فوریت‌های عملیاتی', badge: 'سایر' },
                    ]}
                  />
                </div>

                <div>
                  <ModernSelect
                    id="ticket-priority-select"
                    label="درجه فوریت و حساسیت"
                    value={newTicketPriority}
                    onChange={(val) => setNewTicketPriority(val as any)}
                    options={[
                      { value: 'urgent', label: 'فوری / اضطراری', subLabel: 'اقدام زیر ۵ دقیقه', badge: 'فوری' },
                      { value: 'high', label: 'اولویت بالا', subLabel: 'خطر توقف خط تولید', badge: 'بالا' },
                      { value: 'normal', label: 'عادی', subLabel: 'پیگیری اداری و مالی', badge: 'عادی' },
                    ]}
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  عنوان مختصر مشکل:
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: تاخیر در بارگیری در انبار مبدأ به دلیل نقص باسکول..."
                  value={newTicketSubject}
                  onChange={(e) => setNewTicketSubject(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  شرح کامل و اقدامات مورد نیاز از تیم دیسپچینگ:
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="جزئیات دقیق مشکل، تماس با راننده یا هماهنگی انبار را شرح دهید..."
                  value={newTicketDescription}
                  onChange={(e) => setNewTicketDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-amber-500 focus:outline-none resize-none"
                />
              </div>

              {/* Location hint */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  موقعیت مکانی یا انبار مبدأ/مقصد (اختیاری):
                </label>
                <input
                  type="text"
                  placeholder="مثال: پایانه شهید رجایی یا کیلومتر ۴۰ اتوبان کاشان..."
                  value={newTicketLocation}
                  onChange={(e) => setNewTicketLocation(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewTicketModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>ثبت فوری تیکت و ارجاع به کارشناس</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
