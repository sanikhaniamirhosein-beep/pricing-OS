import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  PieChart as PieChartIcon,
  Download,
  Calendar,
  Sparkles,
  RefreshCw,
  Send,
  SlidersHorizontal,
  Bot,
  Zap,
  ArrowUpRight,
  Info,
  DollarSign,
  ShieldCheck,
  Check,
  FileSpreadsheet,
  Building2,
  FileText,
  Package,
} from 'lucide-react';
import Markdown from 'react-markdown';
import { usePricing } from '../../store/PricingContext';
import {
  ROUTE_ANALYTICS_DATA,
  FLEET_USAGE_DATA,
  MONTHLY_SPEND_DATA,
} from '../../data/mockShipperData';
import { MonthlyShipmentsSection } from './MonthlyShipmentsSection';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface ShipperAiSavingCard {
  id: string;
  title: string;
  description: string;
  category: 'consolidation' | 'backhaul' | 'contract' | 'fleet_mix';
  estimatedSavingsToman: string;
  savingsPercent: string;
  impactCorridor: string;
  actionLabel: string;
  applied?: boolean;
}

interface ShipperAnalyticsViewProps {
  onNavigateTab?: (tabId: string) => void;
}

export const ShipperAnalyticsView: React.FC<ShipperAnalyticsViewProps> = ({
  onNavigateTab,
}) => {
  const COLORS = ['#f59e0b', '#0d9488', '#3b82f6', '#8b5cf6', '#64748b'];

  const {
    currentShipperOrg,
  } = usePricing();

  const [activeViewMode, setActiveViewMode] = useState<'overview' | 'monthly_shipments' | 'ai_advisor' | 'savings_matrix'>('overview');
  
  // AI States
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [selectedGoal, setSelectedGoal] = useState<string>('کاهش هزینه کرایه و بهینه‌سازی قراردادها');
  const [customShipperPrompt, setCustomShipperPrompt] = useState<string>('');
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [aiModelUsed, setAiModelUsed] = useState<string>('gemini-3.7-flash');
  const [aiLastUpdated, setAiLastUpdated] = useState<string | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [appliedSavings, setAppliedSavings] = useState<Record<string, boolean>>({});

  const showToast = (message: string) => {
    setFeedbackToast(message);
    setTimeout(() => {
      setFeedbackToast(null);
    }, 4000);
  };

  // Structured saving opportunities for shippers
  const [savingsCards, setSavingsCards] = useState<ShipperAiSavingCard[]>([
    {
      id: 'sav-1',
      title: 'تجمیع بارهای خرد خرده‌بار (LTL) در خط تهران - اصفهان',
      description: 'با تجمیع ۳ محموله ۵ تنی در یک کشنده تریلی کفی چادری در روزهای فرد، هزینه حمل تن‌کیلومتر تا ۱۸٪ کاهش می‌یابد.',
      category: 'consolidation',
      estimatedSavingsToman: '۳۸,۰۰۰,۰۰۰ تومان در ماه',
      savingsPercent: '-۱۸٪',
      impactCorridor: 'تهران - اصفهان',
      actionLabel: 'اعمال الگوی تجمیع بار',
    },
    {
      id: 'sav-2',
      title: 'استفاده از ظرفیت بار برگشت کریدور بندرعباس - یزد',
      description: 'ناوگان تخلیه‌کننده کانتینری در بندرعباس تخفیف ترجیحی تا ۱۲٪ برای حمل مواد اولیه به مقصد یزد و اصفهان ارائه می‌دهند.',
      category: 'backhaul',
      estimatedSavingsToman: '۵۲,۵۰۰,۰۰۰ تومان در ماه',
      savingsPercent: '-۱۲٪',
      impactCorridor: 'بندرعباس - یزد',
      actionLabel: 'رزرو با تعرفه بار برگشت',
    },
    {
      id: 'sav-3',
      title: 'انعقاد قرارداد تناژ تضمینی بالای ۵۰۰ تن ماهانه',
      description: 'با توجه به ثبت بیش از ۸۰ سرویس در ماه، انتقال به پکیج قراردادی سالانه (Enterprise Tier) نرخ پایه را ۶.۵٪ تعدیل می‌نماید.',
      category: 'contract',
      estimatedSavingsToman: '۸۴,۰۰۰,۰۰۰ تومان در ماه',
      savingsPercent: '-۶.۵٪ کل فاکتور',
      impactCorridor: 'تمام خطوط فعال',
      actionLabel: 'تنظیم پیش‌نویس قرارداد',
    },
    {
      id: 'sav-4',
      title: 'بهینه‌سازی ناوگان کشنده جفت به تک در محورهای فرعی',
      description: 'جایگزینی تریلی جفت با تک در حمل قطعات سبک صنعتی موجب کاهش مصرف سوخت و کرایه بارنامه تا ۱۰٪ می‌گردد.',
      category: 'fleet_mix',
      estimatedSavingsToman: '۲۴,۰۰۰,۰۰۰ تومان در ماه',
      savingsPercent: '-۱۰٪',
      impactCorridor: 'تبریز - مشهد',
      actionLabel: 'تغییر نوع ناوگان پیش‌فرض',
    },
  ]);

  // Server-side AI fetch for Shipper Analytics
  const fetchShipperAiAnalytics = async (overrideGoal?: string, directPrompt?: string) => {
    setIsAiLoading(true);
    const goalToUse = overrideGoal || selectedGoal;
    const promptToUse = directPrompt !== undefined ? directPrompt : customShipperPrompt;

    try {
      const response = await fetch('/api/ai/analytics/shipper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipperOrg: {
            id: currentShipperOrg.id,
            code: currentShipperOrg.code,
            nameFa: currentShipperOrg.nameFa,
            nameEn: currentShipperOrg.nameEn,
            industry: currentShipperOrg.industry,
            tier: currentShipperOrg.tier,
            nationalId: currentShipperOrg.nationalId,
            economicCode: currentShipperOrg.economicCode,
            contactPerson: currentShipperOrg.contactPerson,
            phone: currentShipperOrg.phone,
            email: currentShipperOrg.email,
            address: currentShipperOrg.address,
            tierInfo: currentShipperOrg.tierInfo,
            activeLoadsCount: currentShipperOrg.activeLoads?.length || 0,
            invoicesCount: currentShipperOrg.invoices?.length || 0,
            savedLocations: currentShipperOrg.savedLocations,
            savedCommodities: currentShipperOrg.savedCommodities,
            contractId: currentShipperOrg.contractId,
            entityType: currentShipperOrg.entityType,
            legalDossier: currentShipperOrg.legalDossier,
            individualProfile: currentShipperOrg.individualProfile,
          },
          routeAnalytics: ROUTE_ANALYTICS_DATA,
          fleetUsage: FLEET_USAGE_DATA,
          monthlySpend: MONTHLY_SPEND_DATA,
          targetGoal: goalToUse,
          customPrompt: promptToUse,
        }),
      });

      const data = await response.json();
      if (data && data.insights) {
        setAiInsights(data.insights);
        setAiModelUsed(data.model || 'gemini-3.7-flash');
        setAiLastUpdated(new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        showToast(`تحلیل هوش مصنوعی برای «${currentShipperOrg.nameFa}» به‌روزرسانی شد.`);
      } else {
        throw new Error(data?.error || 'خطا در دریافت تحلیل هوش مصنوعی');
      }
    } catch (err: any) {
      console.error('Shipper AI error:', err);
      showToast('تحلیل لجستیکی با الگوریتم بهینه‌سازی سیستم بارگذاری گردید.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Trigger fetch when switching to AI tab or changing shipper organization
  useEffect(() => {
    if (activeViewMode === 'ai_advisor') {
      fetchShipperAiAnalytics();
    }
  }, [activeViewMode, currentShipperOrg.id]);

  const handleApplySaving = (saving: ShipperAiSavingCard) => {
    setAppliedSavings((prev) => ({ ...prev, [saving.id]: true }));
    showToast(`پیشنهاد صرفه‌جویی «${saving.title}» روی فرآیند استعلام قیمت اعمال گردید.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast notification */}
      {feedbackToast && (
        <div className="fixed bottom-5 left-5 z-50 bg-[#1e293b] text-white px-4 py-3 rounded-2xl shadow-xl border border-teal-500/40 flex items-center gap-3 text-xs animate-in slide-in-from-bottom-4 duration-200">
          <Sparkles className="w-4 h-4 text-teal-400 shrink-0 animate-pulse" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Main Header & View Mode Switcher */}
      <div className="bg-white border border-slate-200/90 p-6 rounded-3xl shadow-xs space-y-5">
        {/* Top Title Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-700 shadow-xs shrink-0">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="font-bold text-slate-800 text-lg font-display tracking-tight">
                  مرکز گزارش‌ها و تحلیل‌های لجستیک
                </h1>
                <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-0.5 rounded-full">
                  {currentShipperOrg.nameFa}
                </span>
                <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full font-mono">
                  کد سازمانی: {currentShipperOrg.code}
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                تحلیل جامع عملکرد، پایش و ممیزی بارنامه‌ها، هوشمندی داده‌محور و فرصت‌های کاهش بهای تمام‌شده حمل
              </p>
            </div>
          </div>
        </div>

        {/* 4-way Tab Segmented Navigation Bar */}
        <div className="bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80 flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveViewMode('overview')}
            className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer ${
              activeViewMode === 'overview'
                ? 'bg-white text-teal-900 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <BarChart3 className={`w-4 h-4 ${activeViewMode === 'overview' ? 'text-teal-700' : 'text-slate-400'}`} />
            <span>نمودارها و عملکرد</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveViewMode('monthly_shipments')}
            className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer ${
              activeViewMode === 'monthly_shipments'
                ? 'bg-white text-teal-900 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <FileSpreadsheet className={`w-4 h-4 ${activeViewMode === 'monthly_shipments' ? 'text-teal-700' : 'text-slate-400'}`} />
            <span>ریز محموله‌های ماهانه</span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
              activeViewMode === 'monthly_shipments'
                ? 'bg-teal-50 text-teal-800 font-bold border border-teal-200'
                : 'bg-slate-200/70 text-slate-600'
            }`}>
              دفتر کل
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveViewMode('ai_advisor');
              if (!aiInsights && !isAiLoading) {
                fetchShipperAiAnalytics();
              }
            }}
            className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer ${
              activeViewMode === 'ai_advisor'
                ? 'bg-white text-teal-900 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${activeViewMode === 'ai_advisor' ? 'text-teal-600 animate-pulse' : 'text-slate-400'}`} />
            <span>مشاور هوش مصنوعی</span>
            <span className="text-[10px] bg-teal-50 text-teal-700 font-bold px-1.5 py-0.5 rounded-md border border-teal-200">
              Gemini
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveViewMode('savings_matrix')}
            className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer ${
              activeViewMode === 'savings_matrix'
                ? 'bg-white text-teal-900 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Zap className={`w-4 h-4 ${activeViewMode === 'savings_matrix' ? 'text-amber-500' : 'text-slate-400'}`} />
            <span>فرصت‌های صرفه‌جویی</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
              activeViewMode === 'savings_matrix'
                ? 'bg-amber-50 text-amber-800 font-bold border border-amber-200'
                : 'bg-slate-200/70 text-slate-600'
            }`}>
              {savingsCards.length}
            </span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: Standard Analytics & Charts */}
      {activeViewMode === 'overview' && (
        <div className="space-y-6">
          {/* AI Banner Callout on Overview */}
          <div className="bg-gradient-to-l from-teal-50/80 via-emerald-50/30 to-white border border-teal-200 p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-teal-200" />
              </div>
              <div>
                <span className="font-bold text-slate-800 text-xs block">
                  هوش مصنوعی ۴ راهکار کاهش هزینه لجستیک به ارزش ۱۹۸ میلیون تومان در ماه شناسایی کرده است
                </span>
                <span className="text-[11px] text-slate-500">
                  بهینه‌سازی تجمیع بار در کریدور تهران - اصفهان و استفاده از تخفیف بار برگشت بندرعباس
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveViewMode('monthly_shipments')}
                className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600" />
                <span>دفتر محموله‌های ماهانه</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveViewMode('ai_advisor');
                  if (!aiInsights) fetchShipperAiAnalytics();
                }}
                className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>تحلیل هوش مصنوعی</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-teal-300" />
              </button>
            </div>
          </div>

          {/* 1. Analytics KPI Header Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* KPI 1: On-Time Delivery Rate */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  شاخص تحویل به‌موقع (On-Time Delivery)
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                  عالی
                </span>
              </div>
              <div className="text-3xl font-bold font-mono text-emerald-600">
                ۹۸.۴٪
              </div>
              <p className="text-[11px] text-slate-500">
                از مجموع ۱۲۴ محموله گذشته، تنها ۲ مورد تاخیر ناشی از شرایط جوی ثبت شده است.
              </p>
            </div>

            {/* KPI 2: Average Transit Duration */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span className="flex items-center gap-1.5 font-bold">
                  <Clock className="w-4 h-4 text-blue-600" />
                  میانگین زمان بارگیری تا تخلیه
                </span>
                <span className="text-[10px] bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full font-bold">
                  مسیرهای بین‌استانی
                </span>
              </div>
              <div className="text-3xl font-bold font-mono text-blue-600">
                ۱۴.۲ <span className="text-xs font-normal text-slate-400">ساعت</span>
              </div>
              <p className="text-[11px] text-slate-500">
                بهبود ۲.۵ ساعته به دلیل هماهنگی الکترونیک و تخصیص هوشمند ناوگان.
              </p>
            </div>

            {/* KPI 3: Fleet Efficiency Index */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span className="flex items-center gap-1.5 font-bold">
                  <Truck className="w-4 h-4 text-amber-600" />
                  ضریب بهره‌وری تناژ (Load Factor)
                </span>
                <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
                  بهینه‌شده
                </span>
              </div>
              <div className="text-3xl font-bold font-mono text-amber-600">
                ۹۳.۸٪
              </div>
              <p className="text-[11px] text-slate-500">
                استفاده حداکثری از ظرفیت بارگیری و کاهش هزینه‌های مازاد تن‌کیلومتر.
              </p>
            </div>
          </div>

          {/* 2. Charts Row: Cost by Route + Fleet Usage Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Spend by Route (7 Cols) */}
            <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-xs flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-600" />
                    تحلیل هزینه‌ها بر اساس مسیرهای تجاری پرتردد
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">پرهزینه‌ترین کریدورهای حمل و نقل شرکت در ۶ ماه اخیر</p>
                </div>

                <button
                  type="button"
                  onClick={() => showToast('فایل گزارش تفصیلی اکسل تولید و آماده دریافت گردید.')}
                  className="p-2 text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer"
                  title="دانلود گزارش تحلیلی"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ROUTE_ANALYTICS_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="route"
                      stroke="#94a3b8"
                      fontSize={10}
                      tickLine={false}
                      axisLine={{ stroke: '#e2e8f0' }}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickFormatter={(val) => `${val} م`}
                    />
                    <Tooltip
                      formatter={(val: any) => [`${val} میلیون تومان`, 'مجموع هزینه']}
                      labelStyle={{ fontFamily: 'Vazirmatn', fontWeight: 'bold' }}
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        color: '#fff',
                        borderRadius: '12px',
                        border: 'none',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="spendMillionRials" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                {ROUTE_ANALYTICS_DATA.slice(0, 3).map((r, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <span className="text-slate-700 font-bold">{r.route}</span>
                    <span className="font-mono text-slate-500">
                      {r.count} سرویس • {r.sharePercent}٪ از کل بودجه
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Fleet Usage Breakdown (5 Cols) */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-xs flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-teal-600" />
                  سهم انواع ناوگان حمل و نقل
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">تعداد کل: ۸۱ سرویس</span>
              </div>

              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={FLEET_USAGE_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="count"
                    >
                      {FLEET_USAGE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any, name: any, item: any) => [
                        `${val ?? 0} بارنامه (${item?.payload?.percentage ?? 0}٪)`,
                        item?.payload?.truck || name || '',
                      ]}
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        color: '#fff',
                        borderRadius: '12px',
                        border: 'none',
                        fontSize: '11px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                {FLEET_USAGE_DATA.map((fleet, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                      />
                      <span className="text-slate-700 font-medium">{fleet.truck}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-800">
                      {fleet.percentage}٪ ({fleet.count} بار)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE: Monthly Shipments Ledger & Drilldown Report */}
      {activeViewMode === 'monthly_shipments' && (
        <MonthlyShipmentsSection
          onNavigateTab={onNavigateTab}
        />
      )}

      {/* VIEW MODE 2: AI Advisor & Live Gemini Intelligence */}
      {activeViewMode === 'ai_advisor' && (
        <div className="space-y-6">
          {/* Shipper Legal Dossier & Hubs Overview Card */}
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-3xl shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-700" />
                <h4 className="font-bold text-xs text-slate-800 font-display">
                  پرونده ثبتی و مدارک احرازشده در هوش مصنوعی ({currentShipperOrg.nameFa})
                </h4>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                وضعیت: مدارک شرکتی تاییدشده
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              <div className="p-2.5 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-500 block">شناسه ملی و اقتصادی:</span>
                <span className="text-xs font-mono font-bold text-slate-800 block truncate" title={currentShipperOrg.nationalId}>
                  ملی: {currentShipperOrg.nationalId || '۱۰۱۰۱...'}
                </span>
                <span className="text-[9px] text-slate-500 block">کد: {currentShipperOrg.economicCode || '۴۱۱...'}</span>
              </div>

              <div className="p-2.5 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-500 block">گواهی مالیات ارزش افزوده:</span>
                <span className="text-xs font-mono font-bold text-emerald-700 block truncate">
                  {currentShipperOrg.legalDossier?.vatTaxCertificateNumber || 'VAT-ACTIVE-10%'}
                </span>
                <span className="text-[9px] text-emerald-600 block">
                  {currentShipperOrg.legalDossier?.hasVatCertificate ? 'دارای گواهی معتبر' : 'نرخ ارزش افزوده ۱۰٪'}
                </span>
              </div>

              <div className="p-2.5 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-500 block">سقف اعتبار و تسویه:</span>
                <span className="text-xs font-bold text-slate-800 block truncate">
                  {currentShipperOrg.tierInfo?.creditLimitRials ? `${(currentShipperOrg.tierInfo.creditLimitRials / 10000000000).toFixed(0)} میلیارد تومان` : 'خط اعتباری باز'}
                </span>
                <span className="text-[9px] text-teal-700 block">تسویه ۳۰ تا ۴۵ روزه</span>
              </div>

              <div className="p-2.5 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-500 block">هاب‌ها و انبارهای بارگیری:</span>
                <span className="text-xs font-bold text-slate-800 block truncate">
                  {currentShipperOrg.savedLocations?.length ? `${currentShipperOrg.savedLocations.length} هاب فعال` : 'انبار مرکزی'}
                </span>
                <span className="text-[9px] text-slate-500 block truncate">
                  {currentShipperOrg.savedLocations?.[0]?.title || currentShipperOrg.address || 'مبدأ فعال'}
                </span>
              </div>

              <div className="p-2.5 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-500 block">اقلام و کالاهای تخصصی:</span>
                <span className="text-xs font-bold text-slate-800 block truncate">
                  {currentShipperOrg.savedCommodities?.length ? `${currentShipperOrg.savedCommodities.length} رده کالا` : 'محصولات صنعتی'}
                </span>
                <span className="text-[9px] text-teal-700 block truncate">
                  {currentShipperOrg.savedCommodities?.[0]?.title || 'کالای استاندارد'}
                </span>
              </div>

              <div className="p-2.5 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-500 block">قرارداد لجستیک سازمانی:</span>
                <span className="text-xs font-mono font-bold text-slate-800 block truncate">
                  {currentShipperOrg.contractId || 'CNT-ENTERPRISE'}
                </span>
                <span className="text-[9px] text-emerald-600 block">تعهد تناژ ماهانه</span>
              </div>
            </div>
          </div>

          {/* AI Command Center */}
          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-xs space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base font-display flex items-center gap-2">
                    مشاور ارشد هوش مصنوعی بهینه‌سازی بودجه ({currentShipperOrg.nameFa})
                    <span className="text-[10px] bg-teal-700 text-white font-mono px-2 py-0.5 rounded-full">
                      {aiModelUsed}
                    </span>
                  </h3>
                  <p className="text-slate-500 text-xs mt-0.5">
                    تحلیل داده‌های بارنامه‌ها، قیمت‌گذاری تن‌کیلومتر و ارائه پیشنهادات کاهش هزینه‌های حمل
                  </p>
                </div>
              </div>

              {aiLastUpdated && (
                <div className="text-[11px] text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5 self-start md:self-auto font-mono">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  <span>به‌روزرسانی: {aiLastUpdated}</span>
                </div>
              )}
            </div>

            {/* Strategy Goal Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600" />
                هدف استراتژیک بهینه‌سازی باربری:
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'کاهش هزینه کرایه و بهینه‌سازی قراردادها',
                  'تجمیع بارهای خرد و بهینه‌سازی ناوگان',
                  'پیش‌بینی نوسانات فصلی قیمت و سوخت',
                  'بهینه‌سازی زمان تحویل و کاهش جریمه توقف',
                  'استفاده از بار برگشت جهت دریافت تخفیف حداکثری',
                ].map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => {
                      setSelectedGoal(goal);
                      fetchShipperAiAnalytics(goal);
                    }}
                    disabled={isAiLoading}
                    className={`px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                      selectedGoal === goal
                        ? 'bg-teal-700 text-white font-bold shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Shipper Prompt Input */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-600">
                پرسش اختصاصی شما از هوش مصنوعی برای محموله‌ها و کریدورها:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customShipperPrompt}
                  onChange={(e) => setCustomShipperPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      fetchShipperAiAnalytics();
                    }
                  }}
                  placeholder="مثال: چطور می‌توان هزینه بارگیری در بندرعباس را در فصل گرما به حداقل رساند؟"
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700"
                />
                <button
                  type="button"
                  onClick={() => fetchShipperAiAnalytics()}
                  disabled={isAiLoading}
                  className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isAiLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-teal-300" />
                  ) : (
                    <Send className="w-4 h-4 text-teal-300" />
                  )}
                  <span>ارسال به AI</span>
                </button>
              </div>
            </div>
          </div>

          {/* AI Markdown Analysis Box */}
          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-teal-600" />
                <h4 className="font-bold text-slate-800 text-sm font-display">
                  گزارش مشاوره‌ای زنجیره تامین و صرفه‌جویی مالی (تولید زنده Gemini)
                </h4>
              </div>
              <button
                type="button"
                onClick={() => fetchShipperAiAnalytics()}
                disabled={isAiLoading}
                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl border border-slate-200 cursor-pointer"
                title="به‌روزرسانی تحلیل"
              >
                <RefreshCw className={`w-4 h-4 ${isAiLoading ? 'animate-spin text-teal-600' : ''}`} />
              </button>
            </div>

            {isAiLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
                <RefreshCw className="w-8 h-8 text-teal-600 animate-spin" />
                <p className="text-xs font-bold text-slate-800">
                  در حال بررسی الگوهای حمل، ماتریس هزینه‌ها و استخراج توصیه‌های کاهش کرایه با Gemini 3.7 Flash...
                </p>
                <span className="text-[11px] text-slate-500">
                  تحلیل خطوط پرتردد و مقایسه با کرایه‌های مرجع تن‌کیلومتر
                </span>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none text-slate-800 text-xs leading-relaxed space-y-3 font-sans">
                {aiInsights ? (
                  <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <Markdown>{aiInsights}</Markdown>
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-400 space-y-2">
                    <Info className="w-6 h-6 mx-auto text-slate-300" />
                    <p>جهت دریافت اولین تحلیل، یکی از گزینه‌های هدف استراتژیک را فشرده یا دکمه «ارسال به AI» را لمس فرمایید.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW MODE 3: Savings Matrix & Actionable Directives */}
      {activeViewMode === 'savings_matrix' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-base font-display flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  ماتریس پیشنهادات صرفه‌جویی و کاهش بودجه حمل‌ونقل
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  فرصت‌های شناسایی‌شده توسط هوش مصنوعی بر اساس تاریخچه بارنامه‌ها و مسیرهای تجاری شرکت
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono">
                مجموع پتانسیل ماهانه: ۱۹۸,۵۰۰,۰۰۰ تومان
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savingsCards.map((sav) => {
                const isApplied = appliedSavings[sav.id];
                return (
                  <div
                    key={sav.id}
                    className={`p-5 rounded-3xl border transition-all space-y-3.5 ${
                      isApplied
                        ? 'bg-teal-50/40 border-teal-300'
                        : 'bg-white border-slate-200 hover:border-teal-600/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                        <h5 className="font-bold text-slate-800 text-xs font-display leading-tight">
                          {sav.title}
                        </h5>
                      </div>
                      <span className="text-[10px] font-mono bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md shrink-0">
                        {sav.impactCorridor}
                      </span>
                    </div>

                    <p className="text-slate-500 text-xs leading-relaxed">
                      {sav.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                          {sav.estimatedSavingsToman}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-mono font-bold">
                          ({sav.savingsPercent})
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleApplySaving(sav)}
                        disabled={isApplied}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isApplied
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold'
                            : 'bg-teal-700 hover:bg-teal-800 text-white shadow-xs'
                        }`}
                      >
                        {isApplied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-700" />
                            <span>در سفارش‌ها اعمال شد</span>
                          </>
                        ) : (
                          <>
                            <ArrowUpRight className="w-3.5 h-3.5 text-teal-200" />
                            <span>{sav.actionLabel}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

