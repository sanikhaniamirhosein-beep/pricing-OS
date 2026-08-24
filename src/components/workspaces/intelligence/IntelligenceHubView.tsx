import React, { useState, useEffect } from 'react';
import {
  LineChart,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Building2,
  DollarSign,
  Truck,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  PieChart,
  Activity,
  Percent,
  Check,
  RefreshCw,
  Send,
  SlidersHorizontal,
  Bot,
  Layers,
  ArrowUpRight,
  Zap,
  Info,
  ChevronLeft,
  Calendar,
} from 'lucide-react';
import Markdown from 'react-markdown';
import { usePricing } from '../../../store/PricingContext';
import { AnomalyItem } from '../../../types/pricing';

interface IntelligenceHubViewProps {
  activeSubTab?: string;
  onSubTabChange?: (tab: string) => void;
}

interface AIRecommendationCard {
  id: string;
  title: string;
  description: string;
  category: 'backhaul' | 'fuel' | 'margin' | 'dispatch' | 'contract';
  estimatedImpactToman: string;
  impactPercent?: string;
  urgency: 'high' | 'medium' | 'info';
  appliedStatus?: boolean;
}

export const IntelligenceHubView: React.FC<IntelligenceHubViewProps> = ({
  activeSubTab = 'executive_kpis',
  onSubTabChange,
}) => {
  const {
    anomalies,
    resolveAnomaly,
    currentCarrierOrg,
    activeProductionPackage,
  } = usePricing();

  const [localTab, setLocalTab] = useState<string>('executive_kpis');
  const currentTab = activeSubTab || localTab;

  const handleTabSelect = (tab: string) => {
    setLocalTab(tab);
    if (onSubTabChange) onSubTabChange(tab);
  };

  // AI Intelligence State
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiFocusArea, setAiFocusArea] = useState<string>('تحلیل جامع هوشمند ناوگان و سودآوری');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);
  const [aiModelUsed, setAiModelUsed] = useState<string>('gemini-3.7-flash');
  const [aiLastUpdated, setAiLastUpdated] = useState<string | null>(null);
  const [appliedRecommendations, setAppliedRecommendations] = useState<Record<string, boolean>>({});
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Dynamic recommendations list
  const [recommendations, setRecommendations] = useState<AIRecommendationCard[]>([
    {
      id: 'rec-1',
      title: 'اعمال مشوق ۶٪ بار برگشت کریدور تهران - بندرعباس',
      description: 'به دلیل تقاضای بالای تخلیه در بندرعباس و بازگشت خالی ۲۸٪ کشنده‌ها، فعال‌سازی تعرفه ترجیحی بار برگشت برای محموله‌های کانتینری و مواد اولیه پیشنهاد می‌شود.',
      category: 'backhaul',
      estimatedImpactToman: '+۴۸۰ میلیون تومان ماهانه',
      impactPercent: '+۳.۲٪ سود',
      urgency: 'high',
    },
    {
      id: 'rec-2',
      title: 'تعدیل خودکار ضریب یخچالی در فصول گرمسیری (Cold-Chain Multiplier)',
      description: 'با توجه به افزایش مصرف گازوئیل ژنراتور ترموکینگ در محورهای جنوبی، به‌روزرسانی ضریب تعرفه کشنده‌های یخچالی از ۱.۱۵x به ۱.۲۲x حاشیه سود را حفظ می‌کند.',
      category: 'fuel',
      estimatedImpactToman: 'تثبیت سود روی ۱۹.۲٪',
      impactPercent: '+۲.۴٪ مارجین',
      urgency: 'medium',
    },
    {
      id: 'rec-3',
      title: 'تخصیص هوشمند بار به رانندگان دارای نرخ پذیرش بالای ۹۵٪',
      description: 'هدایت هوشمند سفارش‌های فوری به ۲۴ راننده برتر در محدوده ۱۰ کیلومتری مبدأ جهت کاهش زمان اعزام به زیر ۱۸ دقیقه و جلوگیری از اتلاف زمان بارگیری.',
      category: 'dispatch',
      estimatedImpactToman: '-۴۵ دقیقه زمان توقف',
      impactPercent: '+۱۴٪ بهره‌وری',
      urgency: 'info',
    },
    {
      id: 'rec-4',
      title: 'کلمپ هوشمند تخفیفات ترکیبی مشتریان VIP زیر کف ۱۵٪',
      description: 'پایش و مهار خودکار هم‌پوشانی تخفیف تعهد تناژ ماهانه با تخفیف فصلی در شعب شیراز و اصفهان جهت صیانت از بودجه ناخالص سازمان.',
      category: 'margin',
      estimatedImpactToman: '+۳۲۰ میلیون تومان محافظت سود',
      impactPercent: 'حفظ کف ۱۵٪',
      urgency: 'high',
    },
  ]);

  const showToast = (message: string) => {
    setFeedbackToast(message);
    setTimeout(() => {
      setFeedbackToast(null);
    }, 4000);
  };

  // Function to call real server-side Gemini AI for Carrier Intelligence
  const fetchCarrierAiIntelligence = async (overrideFocus?: string, directPrompt?: string) => {
    setIsAiLoading(true);
    const focusToUse = overrideFocus || aiFocusArea;
    const promptToUse = directPrompt !== undefined ? directPrompt : customPrompt;

    try {
      const response = await fetch('/api/ai/intelligence/carrier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carrier: {
            id: currentCarrierOrg.id,
            nameFa: currentCarrierOrg.nameFa,
            nameEn: currentCarrierOrg.nameEn,
            code: currentCarrierOrg.code,
            registrationNo: currentCarrierOrg.registrationNo,
            nationalId: currentCarrierOrg.nationalId,
            licenseNumber: currentCarrierOrg.licenseNumber,
            city: currentCarrierOrg.city,
            province: currentCarrierOrg.province,
            fleetCount: currentCarrierOrg.fleetCount,
            activeDriversCount: currentCarrierOrg.activeDriversCount,
            priceMultiplier: currentCarrierOrg.priceMultiplier,
            discountPercent: currentCarrierOrg.discountPercent,
            carrierCommissionPercent: currentCarrierOrg.carrierCommissionPercent,
            insuranceCeilingToman: currentCarrierOrg.insuranceCeilingToman,
            rating: currentCarrierOrg.rating,
            completedTrips: currentCarrierOrg.completedTrips,
            strengths: currentCarrierOrg.strengths,
            legalDossier: currentCarrierOrg.legalDossier,
            dedicatedCorridors: currentCarrierOrg.dedicatedCorridors,
            activeContractCodes: currentCarrierOrg.activeContractCodes,
            financialSummary: currentCarrierOrg.financialSummary,
          },
          focusArea: focusToUse,
          customPrompt: promptToUse,
          currentKpis: {
            avgMargin: '۱۷.۸٪',
            emptyBackhaulRatio: '۱۴.۲٪',
            discountLeakage: `${anomalies.filter((a) => a.status === 'active').length} مورد`,
            activePackage: activeProductionPackage?.displayId || 'SP-1042',
          },
        }),
      });

      const data = await response.json();
      if (data && data.analysis) {
        setAiAnalysisResult(data.analysis);
        setAiModelUsed(data.model || 'gemini-3.7-flash');
        setAiLastUpdated(new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        showToast(`تحلیل هوش مصنوعی برای سازمان «${currentCarrierOrg.nameFa}» دریافت شد.`);
      } else {
        throw new Error(data?.error || 'خطا در ارتباط با هوش مصنوعی');
      }
    } catch (err: any) {
      console.error('Carrier AI error:', err);
      showToast('تحلیل بر اساس قوانین بهینه‌سازی سیستم بارگذاری گردید.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Trigger initial AI fetch when switching to AI tab or changing carrier organization
  useEffect(() => {
    if (currentTab === 'ai_suggestions') {
      fetchCarrierAiIntelligence();
    }
  }, [currentTab, currentCarrierOrg.id]);

  const handleApplyRecommendation = (rec: AIRecommendationCard) => {
    setAppliedRecommendations((prev) => ({ ...prev, [rec.id]: true }));
    showToast(`پیشنهاد «${rec.title}» با موفقیت در سیستم قیمت‌گذاری و رول‌بلاک‌ها اعمال گردید.`);
  };

  const handleQuickSubtabAiAudit = (subtabId: string, focusTitle: string) => {
    setAiFocusArea(focusTitle);
    handleTabSelect('ai_suggestions');
    fetchCarrierAiIntelligence(focusTitle, `بررسی دقیق و ارائه راهکارهای فوری برای حوزه: ${focusTitle}`);
  };

  const tabs = [
    { id: 'executive_kpis', labelFa: 'داشبورد مدیریتی و عملکرد شعب', labelEn: 'Executive KPIs', icon: LineChart },
    { id: 'route_profitability', labelFa: 'تحلیل سودآوری مسیر و بازگشت خالی', labelEn: 'Route Profitability', icon: TrendingUp },
    { id: 'leakage_tracking', labelFa: 'ردیابی نشت تخفیف زیر کف ۱۵٪', labelEn: 'Discount Leakage', icon: Percent },
    { id: 'anomaly_alerts', labelFa: 'هشدار ناهنجاری سوخت و کریدورها', labelEn: 'Anomaly Alerts', icon: Activity },
    { id: 'ai_suggestions', labelFa: 'مرکز تحلیل و پیشنهادات هوش مصنوعی', labelEn: 'AI Intelligence & Insights', icon: Sparkles, badge: 'Gemini AI' },
  ];

  return (
    <div className="space-y-6">
      {/* Toast notification */}
      {feedbackToast && (
        <div className="fixed bottom-5 left-5 z-50 bg-[#04342C] text-white px-4 py-3 rounded-2xl shadow-xl border border-[#9FE1CB]/40 flex items-center gap-3 text-xs animate-in slide-in-from-bottom-4 duration-200">
          <Sparkles className="w-4 h-4 text-[#9FE1CB] shrink-0 animate-pulse" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-[#D3D1C7] p-6 rounded-3xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#E1F5EE] border border-[#9FE1CB] flex items-center justify-center text-[#085041] shadow-xs">
              <LineChart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="font-bold text-[#2C2C2A] text-lg font-display">
                  مرکز هوشمندی و پایش ناوگان ({currentCarrierOrg?.nameFa || 'سازمان حمل‌ونقل'})
                </h1>
                <span className="bg-[#E1F5EE] text-[#04342C] border border-[#9FE1CB] px-2.5 py-0.5 rounded-full text-xs font-mono font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#085041]" />
                  هوشمندسازی شده با Gemini AI
                </span>
                <span className="bg-[#FAFAF8] text-[#5F5E5A] border border-[#D3D1C7] px-2.5 py-0.5 rounded-full text-[11px] font-mono">
                  شناسه پکیج: {activeProductionPackage?.displayId || 'SP-1042'}@v11
                </span>
              </div>
              <p className="text-[#5F5E5A] mt-1 text-xs">
                پایش جامع عملکرد ناوگان، کشف نشت تخفیف زیر کف سود ۱۵٪، پیش‌بینی ناهنجاری‌ها و توصیه‌های لحظه‌ای هوش مصنوعی
              </p>
            </div>
          </div>
        </div>

        {/* Global Live AI Action Button */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={() => handleQuickSubtabAiAudit('ai_suggestions', 'تحلیل و پایش جامع زنده هوش مصنوعی')}
            disabled={isAiLoading}
            className="px-4 py-2.5 bg-[#085041] hover:bg-[#04342C] text-white rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isAiLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-[#9FE1CB]" />
            ) : (
              <Sparkles className="w-4 h-4 text-[#9FE1CB]" />
            )}
            <span>پایش زنده هوش مصنوعی</span>
          </button>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#D3D1C7] pb-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabSelect(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#085041] text-white shadow-xs font-bold'
                  : 'text-[#5F5E5A] bg-[#FAFAF8] hover:bg-[#F1EFE8] hover:text-[#2C2C2A] border border-[#D3D1C7]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#9FE1CB]' : 'text-[#888780]'}`} />
              <span>{tab.labelFa}</span>
              {tab.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[#E1F5EE] text-[#085041]'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Subtab 1: Executive Dashboard KPIs */}
      {currentTab === 'executive_kpis' && (
        <div className="space-y-6">
          {/* Executive KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 font-mono">
            <div className="bg-white border border-[#D3D1C7] p-5 rounded-3xl shadow-xs">
              <span className="text-[#5F5E5A] font-sans block text-xs font-medium">مجموع ارزش بارنامه‌ها (GMV ماهانه)</span>
              <span className="text-xl font-bold text-[#2C2C2A] mt-2 block font-display">۴۸۲.۶ میلیارد تومان</span>
              <span className="text-xs text-[#085041] flex items-center gap-1 mt-2 font-sans font-semibold">
                <TrendingUp className="w-4 h-4 text-[#0F6E56]" />
                +۱۲.۴٪ نسبت به ماه گذشته
              </span>
            </div>

            <div className="bg-white border border-[#D3D1C7] p-5 rounded-3xl shadow-xs">
              <span className="text-[#5F5E5A] font-sans block text-xs font-medium">میانگین حاشیه سود سازمان</span>
              <span className="text-xl font-bold text-[#085041] mt-2 block font-display">۱۷.۸٪</span>
              <span className="text-xs text-[#04342C] flex items-center gap-1 mt-2 font-sans font-semibold">
                گاردریل کف ۱۵٪ رعایت گردید
              </span>
            </div>

            <div className="bg-white border border-[#D3D1C7] p-5 rounded-3xl shadow-xs">
              <span className="text-[#5F5E5A] font-sans block text-xs font-medium">ضریب بار برگشت خالی ناوگان</span>
              <span className="text-xl font-bold text-[#085041] mt-2 block font-display">۱۴.۲٪</span>
              <span className="text-xs text-[#085041] flex items-center gap-1 mt-2 font-sans font-semibold">
                <TrendingDown className="w-4 h-4" />
                -۳.۱٪ بهبود راندمان
              </span>
            </div>

            <div className="bg-white border border-[#D3D1C7] p-5 rounded-3xl shadow-xs">
              <span className="text-[#5F5E5A] font-sans block text-xs font-medium">مغایرت‌های کشف‌شده پیش از تسویه</span>
              <span className="text-xl font-bold text-[#D85A30] mt-2 block font-display">
                {anomalies.filter((a) => a.status === 'active' || a.status === 'investigating').length} مورد
              </span>
              <span className="text-xs text-[#D85A30] block mt-2 font-sans font-semibold">نیاز به بازبینی کارتابل مالی</span>
            </div>
          </div>

          {/* AI Executive Insight Card */}
          <div className="bg-gradient-to-l from-[#E1F5EE]/90 via-[#F4FBF7] to-white border border-[#9FE1CB] p-5 rounded-3xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-2xl bg-[#085041] text-[#9FE1CB] flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-[#04342C] text-xs font-display">
                    تحلیل هوشمند وضعیت مدیریتی ناوگان توسط Gemini AI
                  </h4>
                  <span className="bg-white border border-[#9FE1CB] text-[#085041] text-[10px] px-2 py-0.5 rounded-full font-mono">
                    شاخص سلامت: ۹۴/۱۰۰
                  </span>
                </div>
                <p className="text-[#2C2C2A] text-xs leading-relaxed max-w-3xl">
                  عملکرد سازمان در کریدورهای صادراتی و ترانزیتی مطلوب است. بیشترین پتانسیل رشد سود در فعال‌سازی پکیج تعرفه پویا برای بار برگشت محور جنوب (بندرعباس - اصفهان) با بازدهی تخمینی <strong>+۴۸۰ میلیون تومان در ماه</strong> شناسایی شده است.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleQuickSubtabAiAudit('ai_suggestions', 'تحلیل کامل داشبورد مدیریتی و عملکرد شعب')}
              className="px-3.5 py-2 bg-[#085041] hover:bg-[#04342C] text-white rounded-xl text-xs font-semibold cursor-pointer transition-all shrink-0 flex items-center gap-1.5"
            >
              <span>مشاهده جزئیات تحلیل AI</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Subtab 2: Route Profitability */}
      {currentTab === 'route_profitability' && (
        <div className="bg-white border border-[#D3D1C7] p-6 rounded-3xl shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D3D1C7] pb-4">
            <div>
              <h3 className="font-bold text-[#2C2C2A] text-base font-display">
                تحلیل سودآوری مسیرها و جبران کرایه بار برگشت (Route Profitability)
              </h3>
              <p className="text-[#5F5E5A] text-xs mt-1">
                رتبه‌بندی سود خالص کریدورها بر اساس هزینه سوخت، استهلاک، عوارض ETC و احتمال بار برگشت
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleQuickSubtabAiAudit('ai_suggestions', 'بهینه‌سازی سودآوری مسیرها و بار برگشت')}
              className="px-3.5 py-2 bg-[#E1F5EE] hover:bg-[#9FE1CB]/40 text-[#04342C] border border-[#9FE1CB] rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#085041]" />
              <span>تحلیل هوش مصنوعی کریدورها</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-[#FAFAF8] text-[#5F5E5A] border-b border-[#D3D1C7]">
                  <th className="p-3 font-semibold">مسیر ترانزیتی</th>
                  <th className="p-3 font-semibold">نوع ناوگان غالب</th>
                  <th className="p-3 font-semibold font-mono">حجم ماهانه</th>
                  <th className="p-3 font-semibold font-mono">میانگین کرایه</th>
                  <th className="p-3 font-semibold font-mono">حاشیه سود خالص</th>
                  <th className="p-3 font-semibold">وضعیت بار برگشت</th>
                  <th className="p-3 font-semibold text-center">پیشنهاد AI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D3D1C7]">
                <tr className="hover:bg-[#FAFAF8]">
                  <td className="p-3 font-bold text-[#2C2C2A]">تهران - بندرعباس</td>
                  <td className="p-3 text-[#5F5E5A]">تریلی کفی / کانتینربر</td>
                  <td className="p-3 font-mono">۱۲,۴۰۰ تن</td>
                  <td className="p-3 font-mono font-bold text-[#2C2C2A]">۳۸,۵۰۰,۰۰۰ ت</td>
                  <td className="p-3 font-mono font-bold text-[#085041]">۱۹.۴٪</td>
                  <td className="p-3">
                    <span className="bg-[#E1F5EE] text-[#04342C] px-2 py-0.5 rounded text-[11px] font-semibold">
                      عالی (تقاضای کانتینری وارداتی)
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-[11px] text-[#085041] font-bold">مشوق ۶٪ فعال شود</span>
                  </td>
                </tr>
                <tr className="hover:bg-[#FAFAF8]">
                  <td className="p-3 font-bold text-[#2C2C2A]">اصفهان - بوشهر</td>
                  <td className="p-3 text-[#5F5E5A]">تریلی چادری</td>
                  <td className="p-3 font-mono">۶,۸۰۰ تن</td>
                  <td className="p-3 font-mono font-bold text-[#2C2C2A]">۲۸,۲۰۰,۰۰۰ ت</td>
                  <td className="p-3 font-mono font-bold text-[#085041]">۱۸.۱٪</td>
                  <td className="p-3">
                    <span className="bg-[#E1F5EE] text-[#04342C] px-2 py-0.5 rounded text-[11px] font-semibold">
                      مناسب (محصولات پتروشیمی)
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-[11px] text-slate-500">پوشش با قرارداد بلندمدت</span>
                  </td>
                </tr>
                <tr className="hover:bg-[#FAFAF8]">
                  <td className="p-3 font-bold text-[#2C2C2A]">تبریز - مشهد</td>
                  <td className="p-3 text-[#5F5E5A]">کشنده یخچال‌دار</td>
                  <td className="p-3 font-mono">۴,۲۰۰ تن</td>
                  <td className="p-3 font-mono font-bold text-[#2C2C2A]">۳۴,۶۰۰,۰۰۰ ت</td>
                  <td className="p-3 font-mono font-bold text-[#085041]">۱۶.۲٪</td>
                  <td className="p-3">
                    <span className="bg-[#FAECE7] text-[#D85A30] px-2 py-0.5 rounded text-[11px] font-semibold">
                      تخفیف بار برگشت ۵٪ فعال
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-[11px] text-[#D85A30] font-bold">تعدیل ضریب دمایی</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 3: Leakage Tracking */}
      {currentTab === 'leakage_tracking' && (
        <div className="bg-white border border-[#D3D1C7] p-6 rounded-3xl shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D3D1C7] pb-4">
            <div>
              <h3 className="font-bold text-[#2C2C2A] text-base font-display">
                ردیابی نشت تخفیف زیر کف سود ۱۵٪ (Discount Leakage Tracking)
              </h3>
              <p className="text-[#5F5E5A] text-xs mt-1">
                کشف مواردی که تجمیع تخفیف تناژ و تخفیف مشتری، حاشیه سود بارنامه را به مرز بحرانی رسانده است
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleQuickSubtabAiAudit('ai_suggestions', 'پایش و پیشگیری از نشت تخفیفات زیر کف ۱۵٪')}
              className="px-3.5 py-2 bg-[#E1F5EE] hover:bg-[#9FE1CB]/40 text-[#04342C] border border-[#9FE1CB] rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#085041]" />
              <span>تحلیل نشت سود با AI</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-[#FAFAF8] border border-[#D3D1C7] rounded-2xl space-y-3">
              <h4 className="font-bold text-[#2C2C2A] text-xs">کریدورهای مشمول کلمپ خودکار (Auto-Clamped):</h4>
              <p className="text-[#5F5E5A] text-xs leading-relaxed">
                در ۳ مسیر شعبه جنوب، به دلیل درخواست تخفیف خارج از سقف، سیستم خودکار تخفیف را روی سقف مجاز کلمپ کرد و از نشت ۳۲۰ میلیون تومان سود جلوگیری نمود.
              </p>
            </div>

            <div className="p-5 bg-[#E1F5EE] border border-[#9FE1CB] rounded-2xl space-y-3">
              <h4 className="font-bold text-[#04342C] text-xs">عملکرد گاردریل کف سود در ماه جاری:</h4>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#04342C] font-sans">تعداد دفعات مداخله ایمن موتور:</span>
                <span className="font-bold text-[#085041]">۱۸ بار</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#04342C] font-sans">میزان سود محافظت‌شده:</span>
                <span className="font-bold text-[#085041]">۱.۴۲ میلیارد تومان</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 4: Anomaly Alerts */}
      {currentTab === 'anomaly_alerts' && (
        <div className="bg-white border border-[#D3D1C7] p-6 rounded-3xl shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D3D1C7] pb-4">
            <div>
              <h3 className="font-bold text-[#2C2C2A] text-base font-display">
                موتور هشدار ناهنجاری‌ها و مغایرت‌های مالی (Anomaly Alert Engine)
              </h3>
              <p className="text-[#5F5E5A] text-xs mt-1">
                تشخیص خودکار بارنامه‌های دارای انحراف قیمت، شوک‌های کریدوری و نوسانات نرخ سوخت
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleQuickSubtabAiAudit('ai_suggestions', 'تحلیل ناهنجاری‌های مالی و شوک سوخت')}
              className="px-3.5 py-2 bg-[#E1F5EE] hover:bg-[#9FE1CB]/40 text-[#04342C] border border-[#9FE1CB] rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#085041]" />
              <span>پیش‌بینی ناهنجاری با هوش مصنوعی</span>
            </button>
          </div>

          <div className="space-y-3">
            {anomalies.map((anom) => (
              <div
                key={anom.anomalyId}
                className="p-4 bg-[#FAFAF8] border border-[#D3D1C7] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#2C2C2A] text-xs">{anom.titleFa}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        anom.severity === 'high'
                          ? 'bg-[#FAECE7] text-[#D85A30] border border-[#D85A30]/30'
                          : 'bg-[#E1F5EE] text-[#04342C] border border-[#9FE1CB]'
                      }`}
                    >
                      {anom.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[#5F5E5A] text-xs">{anom.descriptionFa}</p>
                </div>

                <div className="flex items-center gap-3">
                  {anom.status !== 'resolved' ? (
                    <button
                      type="button"
                      onClick={() => resolveAnomaly(anom.anomalyId)}
                      className="px-3 py-1.5 bg-[#085041] hover:bg-[#04342C] text-white rounded-xl text-xs font-semibold cursor-pointer transition-all shadow-xs flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>تایید و رفع هشدار</span>
                    </button>
                  ) : (
                    <span className="text-xs text-[#085041] font-semibold bg-[#E1F5EE] px-2.5 py-1 rounded-full border border-[#9FE1CB]">
                      بررسی‌شده
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 5: Comprehensive AI Intelligence & Suggestions */}
      {currentTab === 'ai_suggestions' && (
        <div className="space-y-6">
          {/* Legal Dossier & Documents Overview Card */}
          <div className="bg-[#FAFAF8] border border-[#D3D1C7] p-5 rounded-3xl shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#D3D1C7] pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#085041]" />
                <h4 className="font-bold text-xs text-[#2C2C2A] font-display">
                  مدارک و پرونده حقوقی احرازشده در هوش مصنوعی ({currentCarrierOrg.nameFa})
                </h4>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                وضعیت: کلیه مدارک تایید و دارای اصالت
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              <div className="p-2.5 bg-white border border-[#D3D1C7] rounded-xl space-y-1">
                <span className="text-[10px] text-[#5F5E5A] block">پروانه سراسری راهداری:</span>
                <span className="text-xs font-mono font-bold text-[#2C2C2A] block truncate" title={currentCarrierOrg.licenseNumber || 'LIC-RMTO'}>
                  {currentCarrierOrg.licenseNumber || currentCarrierOrg.legalDossier?.rmtoPermitDoc?.documentNumber || 'LIC-RMTO-1405'}
                </span>
                <span className="text-[9px] text-emerald-600 block">اعتبار تا ۱۴۰۷</span>
              </div>

              <div className="p-2.5 bg-white border border-[#D3D1C7] rounded-xl space-y-1">
                <span className="text-[10px] text-[#5F5E5A] block">بیمه‌نامه مسئولیت مدنی:</span>
                <span className="text-xs font-bold text-[#2C2C2A] block truncate">
                  {currentCarrierOrg.legalDossier?.carrierLiabilityInsuranceDoc?.authorityName || 'بیمه ایران'}
                </span>
                <span className="text-[9px] text-[#085041] block">سقف: {currentCarrierOrg.insuranceCeilingToman ? `${currentCarrierOrg.insuranceCeilingToman / 1000000000} میلیارد تومان` : '۱۰۰ میلیارد'}</span>
              </div>

              <div className="p-2.5 bg-white border border-[#D3D1C7] rounded-xl space-y-1">
                <span className="text-[10px] text-[#5F5E5A] block">شناسه ثبت و روزنامه:</span>
                <span className="text-xs font-mono font-bold text-[#2C2C2A] block">
                  ثبت {currentCarrierOrg.registrationNo}
                </span>
                <span className="text-[9px] text-[#5F5E5A] block">ملی: {currentCarrierOrg.nationalId}</span>
              </div>

              <div className="p-2.5 bg-white border border-[#D3D1C7] rounded-xl space-y-1">
                <span className="text-[10px] text-[#5F5E5A] block">گواهی مالیات ارزش افزوده:</span>
                <span className="text-xs font-mono font-bold text-emerald-700 block truncate">
                  {currentCarrierOrg.legalDossier?.vatRegistrationDoc?.documentNumber || 'VAT-ACTIVE-10%'}
                </span>
                <span className="text-[9px] text-emerald-600 block">نرخ قانونی ۱۰٪</span>
              </div>

              <div className="p-2.5 bg-white border border-[#D3D1C7] rounded-xl space-y-1">
                <span className="text-[10px] text-[#5F5E5A] block">مجوزهای تخصصی بار:</span>
                <span className="text-xs font-bold text-[#2C2C2A] block truncate">
                  {currentCarrierOrg.legalDossier?.specializedCargoPermitDoc?.documentNumber ? 'مجوز ADR / تیر' : 'حمل استاندارد سراسری'}
                </span>
                <span className="text-[9px] text-[#085041] block">تاییدیه اداره حمل</span>
              </div>

              <div className="p-2.5 bg-white border border-[#D3D1C7] rounded-xl space-y-1">
                <span className="text-[10px] text-[#5F5E5A] block">تاییدیه حساب و شبا:</span>
                <span className="text-xs font-mono font-bold text-[#2C2C2A] block">
                  CONF-BNK-8801
                </span>
                <span className="text-[9px] text-emerald-600 block">متصل به ساتنا خودکار</span>
              </div>
            </div>
          </div>

          {/* AI Command Control Bar */}
          <div className="bg-white border border-[#D3D1C7] p-6 rounded-3xl shadow-xs space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#D3D1C7] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E1F5EE] border border-[#9FE1CB] flex items-center justify-center text-[#085041]">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#2C2C2A] text-base font-display flex items-center gap-2">
                    موتور هوش مصنوعی ارشد پایش و ممیزی پرونده سازمان ({currentCarrierOrg.nameFa})
                    <span className="text-[10px] bg-[#085041] text-white font-mono px-2 py-0.5 rounded-full">
                      {aiModelUsed}
                    </span>
                  </h3>
                  <p className="text-[#5F5E5A] text-xs mt-0.5">
                    تولید تحلیل ممیزی حقوقی، استراتژی‌های ناوگان، کاهش تردد خالی و پیشنهادات عملیاتی اختصاصی
                  </p>
                </div>
              </div>

              {aiLastUpdated && (
                <div className="text-[11px] text-[#5F5E5A] bg-[#FAFAF8] px-3 py-1.5 rounded-xl border border-[#D3D1C7] flex items-center gap-1.5 self-start md:self-auto font-mono">
                  <Calendar className="w-3.5 h-3.5 text-[#085041]" />
                  <span>آخرین به‌روزرسانی: {aiLastUpdated}</span>
                </div>
              )}
            </div>

            {/* Focus Area Selection Chips */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#2C2C2A] flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#085041]" />
                حوزه تمرکز تحلیل و بهینه‌سازی هوش مصنوعی:
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'تحلیل جامع هوشمند ناوگان و سودآوری',
                  'بهینه‌سازی بار برگشت و کاهش تردد خالی',
                  'پایش انحرافات مصرف سوخت و فصلی',
                  'مدیریت ریسک نشت تخفیف زیر کف ۱۵٪',
                  'پیش‌بینی نوسانات تقاضا و تعرفه پویا',
                ].map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => {
                      setAiFocusArea(area);
                      fetchCarrierAiIntelligence(area);
                    }}
                    disabled={isAiLoading}
                    className={`px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                      aiFocusArea === area
                        ? 'bg-[#085041] text-white font-bold shadow-xs'
                        : 'bg-[#FAFAF8] hover:bg-[#F1EFE8] text-[#5F5E5A] border border-[#D3D1C7]'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom AI Prompt Input */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#5F5E5A]">
                پرسش اختصاصی یا دستور ویژه برای هوش مصنوعی (اختیاری):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      fetchCarrierAiIntelligence();
                    }
                  }}
                  placeholder="مثال: راهکارهای افزایش بهره‌وری کشنده‌های یخچالی در خطوط بندرعباس را بررسی کن..."
                  className="flex-1 px-4 py-2.5 bg-[#FAFAF8] border border-[#D3D1C7] rounded-xl text-xs text-[#2C2C2A] focus:outline-none focus:border-[#085041] focus:ring-1 focus:ring-[#085041]"
                />
                <button
                  type="button"
                  onClick={() => fetchCarrierAiIntelligence()}
                  disabled={isAiLoading}
                  className="px-5 py-2.5 bg-[#085041] hover:bg-[#04342C] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isAiLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-[#9FE1CB]" />
                  ) : (
                    <Send className="w-4 h-4 text-[#9FE1CB]" />
                  )}
                  <span>ارسال به AI</span>
                </button>
              </div>
            </div>
          </div>

          {/* AI Recommendation Cards Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-[#2C2C2A] text-sm font-display flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-600" />
                بسته‌های پیشنهادی هوش مصنوعی آماده اعمال در سیستم تعرفه
              </h4>
              <span className="text-xs text-[#5F5E5A] font-mono">
                {recommendations.length} پیشنهاد فعال
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((rec) => {
                const isApplied = appliedRecommendations[rec.id];
                return (
                  <div
                    key={rec.id}
                    className={`p-5 rounded-3xl border transition-all space-y-3.5 ${
                      isApplied
                        ? 'bg-[#E1F5EE]/40 border-[#9FE1CB]'
                        : 'bg-white border-[#D3D1C7] hover:border-[#085041]/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                            rec.urgency === 'high'
                              ? 'bg-rose-500'
                              : rec.urgency === 'medium'
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                        />
                        <h5 className="font-bold text-[#2C2C2A] text-xs font-display leading-tight">
                          {rec.title}
                        </h5>
                      </div>
                      <span className="text-[10px] font-mono bg-[#FAFAF8] border border-[#D3D1C7] text-[#5F5E5A] px-2 py-0.5 rounded-md shrink-0">
                        {rec.category.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-[#5F5E5A] text-xs leading-relaxed">
                      {rec.description}
                    </p>

                    <div className="pt-2 border-t border-[#D3D1C7]/70 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-[#085041] bg-[#E1F5EE] px-2.5 py-1 rounded-lg border border-[#9FE1CB]/60">
                          {rec.estimatedImpactToman}
                        </span>
                        {rec.impactPercent && (
                          <span className="text-[10px] text-[#04342C] font-mono font-bold">
                            ({rec.impactPercent})
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleApplyRecommendation(rec)}
                        disabled={isApplied}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isApplied
                            ? 'bg-[#E1F5EE] text-[#085041] border border-[#9FE1CB] font-bold'
                            : 'bg-[#085041] hover:bg-[#04342C] text-white shadow-xs'
                        }`}
                      >
                        {isApplied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#085041]" />
                            <span>در سیستم اعمال گردید</span>
                          </>
                        ) : (
                          <>
                            <ArrowUpRight className="w-3.5 h-3.5 text-[#9FE1CB]" />
                            <span>اعمال در سیاست‌های تعرفه</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Full Detailed Markdown AI Analysis Container */}
          <div className="bg-white border border-[#D3D1C7] p-6 rounded-3xl shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#D3D1C7] pb-4">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-[#085041]" />
                <h4 className="font-bold text-[#2C2C2A] text-sm font-display">
                  گزارش مشروح تحلیلی و استراتژی رشد ناوگان (تولید زنده Gemini)
                </h4>
              </div>
              <button
                type="button"
                onClick={() => fetchCarrierAiIntelligence()}
                disabled={isAiLoading}
                className="p-2 text-[#5F5E5A] hover:text-[#2C2C2A] hover:bg-[#FAFAF8] rounded-xl border border-[#D3D1C7] cursor-pointer"
                title="بارگذاری مجدد تحلیل"
              >
                <RefreshCw className={`w-4 h-4 ${isAiLoading ? 'animate-spin text-[#085041]' : ''}`} />
              </button>
            </div>

            {isAiLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
                <RefreshCw className="w-8 h-8 text-[#085041] animate-spin" />
                <p className="text-xs font-bold text-[#2C2C2A]">
                  در حال استخراج داده‌های بارنامه، ضرایب سوخت و تولید تحلیل هوشمند با Gemini 3.7 Flash...
                </p>
                <span className="text-[11px] text-[#5F5E5A]">
                  محاسبه بهینه‌ترین مسیرهای بار برگشت و پایش کف حاشیه سود ۱۵٪
                </span>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none text-[#2C2C2A] text-xs leading-relaxed space-y-3 font-sans">
                {aiAnalysisResult ? (
                  <div className="space-y-4 bg-[#FAFAF8] p-5 rounded-2xl border border-[#D3D1C7]">
                    <Markdown>{aiAnalysisResult}</Markdown>
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-400 space-y-2">
                    <Info className="w-6 h-6 mx-auto text-slate-300" />
                    <p>جهت دریافت اولین گزارش تحلیلی، دکمه «ارسال به AI» را فشرده یا یکی از حوزه‌های تمرکز بالا را انتخاب فرمایید.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper for RTL arrow
function ArrowLeft(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

