import React, { useState } from 'react';
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
} from 'lucide-react';
import { usePricing } from '../../../store/PricingContext';
import { AnomalyItem } from '../../../types/pricing';

interface IntelligenceHubViewProps {
  activeSubTab?: string;
  onSubTabChange?: (tab: string) => void;
}

export const IntelligenceHubView: React.FC<IntelligenceHubViewProps> = ({
  activeSubTab = 'executive_kpis',
  onSubTabChange,
}) => {
  const { anomalies, resolveAnomaly, contracts } = usePricing();

  const [localTab, setLocalTab] = useState<string>('executive_kpis');
  const currentTab = activeSubTab || localTab;

  const handleTabSelect = (tab: string) => {
    setLocalTab(tab);
    if (onSubTabChange) onSubTabChange(tab);
  };

  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyItem | null>(anomalies?.[0] || null);

  const tabs = [
    { id: 'executive_kpis', labelFa: 'داشبورد مدیریتی و عملکرد شعب', labelEn: 'Executive KPIs', icon: LineChart },
    { id: 'route_profitability', labelFa: 'تحلیل سودآوری مسیر و بازگشت خالی', labelEn: 'Route Profitability', icon: TrendingUp },
    { id: 'leakage_tracking', labelFa: 'ردیابی نشت تخفیف زیر کف ۱۵٪', labelEn: 'Discount Leakage', icon: Percent },
    { id: 'anomaly_alerts', labelFa: 'هشدار ناهنجاری سوخت و کریدورها', labelEn: 'Anomaly Alerts', icon: Activity },
    { id: 'ai_suggestions', labelFa: 'پیشنهادات بهینه‌سازی هوشمند', labelEn: 'AI Recommendations', icon: Sparkles },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#D3D1C7] p-6 rounded-3xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E1F5EE] border border-[#9FE1CB] flex items-center justify-center text-[#085041]">
              <LineChart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-[#2C2C2A] text-lg font-display">
                  مرکز هوشمندی و پایش (Intelligence Hub)
                </h1>
                <span className="bg-[#E1F5EE] text-[#04342C] border border-[#9FE1CB] px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">
                  Pre-Settlement Anomaly & Leakage (BR-044)
                </span>
              </div>
              <p className="text-[#5F5E5A] mt-0.5 text-xs">
                پایش لحظه‌ای سودآوری ناوگان، کشف نشت تخفیفات، پیش‌بینی ناهنجاری‌ها و توصیه‌های هوشمند بهینه‌سازی بار
              </p>
            </div>
          </div>
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
            </button>
          );
        })}
      </div>

      {/* Subtab 1: Executive Dashboard KPIs */}
      {currentTab === 'executive_kpis' && (
        <div className="space-y-6">
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
        </div>
      )}

      {/* Subtab 2: Route Profitability */}
      {currentTab === 'route_profitability' && (
        <div className="bg-white border border-[#D3D1C7] p-6 rounded-3xl shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#D3D1C7] pb-4">
            <div>
              <h3 className="font-bold text-[#2C2C2A] text-base font-display">
                تحلیل سودآوری مسیرها و جبران کرایه بار برگشت (Route Profitability)
              </h3>
              <p className="text-[#5F5E5A] text-xs mt-1">
                رتبه‌بندی سود خالص کریدورها بر اساس هزینه سوخت، استهلاک، عوارض ETC و احتمال بار برگشت
              </p>
            </div>
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
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 3: Leakage Tracking */}
      {currentTab === 'leakage_tracking' && (
        <div className="bg-white border border-[#D3D1C7] p-6 rounded-3xl shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#D3D1C7] pb-4">
            <div>
              <h3 className="font-bold text-[#2C2C2A] text-base font-display">
                ردیابی نشت تخفیف زیر کف سود ۱۵٪ (Discount Leakage Tracking)
              </h3>
              <p className="text-[#5F5E5A] text-xs mt-1">
                کشف مواردی که تجمیع تخفیف تناژ و تخفیف مشتری، حاشیه سود بارنامه را به مرز بحرانی رسانده است
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-[#FAFAF8] border border-[#D3D1C7] rounded-2xl space-y-3">
              <h4 className="font-bold text-[#2C2C2A] text-xs">کریدورهای مشمول کلمپ خودکار (Auto-Clamped):</h4>
              <p className="text-[#5F5E5A] text-xs">
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
          <div className="flex items-center justify-between border-b border-[#D3D1C7] pb-4">
            <div>
              <h3 className="font-bold text-[#2C2C2A] text-base font-display">
                موتور هشدار ناهنجاری‌ها و مغایرت‌های مالی (Anomaly Alert Engine)
              </h3>
              <p className="text-[#5F5E5A] text-xs mt-1">
                تشخیص خودکار بارنامه‌های دارای انحراف قیمت، شوک‌های کریدوری و نوسانات نرخ سوخت
              </p>
            </div>
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

      {/* Subtab 5: AI Suggestions */}
      {currentTab === 'ai_suggestions' && (
        <div className="bg-white border border-[#D3D1C7] p-6 rounded-3xl shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#D3D1C7] pb-4">
            <div>
              <h3 className="font-bold text-[#2C2C2A] text-base font-display">
                پیشنهادات بهینه‌سازی هوشمند تعرفه (AI Optimization Suggestions)
              </h3>
              <p className="text-[#5F5E5A] text-xs mt-1">
                توصیه‌های مبتنی بر یادگیری ماشین برای متعادل‌سازی عرضه و تقاضای ناوگان و افزایش ضریب پر بودن کشنده‌ها
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-[#E1F5EE] border border-[#9FE1CB] rounded-2xl space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#085041]" />
                <h4 className="font-bold text-[#04342C] text-xs font-display">
                  اعمال مشوق ۵٪ بار برگشت مسیر یزد - بندرعباس
                </h4>
              </div>
              <p className="text-[#2C2C2A] text-xs leading-relaxed">
                به دلیل تقاضای بالای تخلیه در بندرعباس و بازگشت خالی ۳۰٪ کشنده‌ها، پیشنهاد می‌شود تخفیف بار برگشت برای حمل سنگ آهن فعال گردد.
              </p>
              <div className="pt-2 border-t border-[#9FE1CB]/60 flex justify-between items-center text-xs font-mono">
                <span className="text-[#04342C] font-sans">تخمین افزایش سود ماهانه:</span>
                <span className="font-bold text-[#085041]">+۴۲۰ میلیون تومان</span>
              </div>
            </div>

            <div className="p-5 bg-[#FAFAF8] border border-[#D3D1C7] rounded-2xl space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#085041]" />
                <h4 className="font-bold text-[#2C2C2A] text-xs font-display">
                  تعدیل خودکار ضریب یخچالی در فصل گرما
                </h4>
              </div>
              <p className="text-[#5F5E5A] text-xs leading-relaxed">
                با شروع فصل تابستان، مصرف گازوئیل موتور ترموکینگ کشنده‌های یخچالی ۲۰٪ بالا می‌رود؛ ضریب پایش دما باید به ۱.۱۵x به‌روزرسانی شود.
              </p>
              <div className="pt-2 border-t border-[#D3D1C7] flex justify-between items-center text-xs font-mono">
                <span className="text-[#5F5E5A] font-sans">تخمین حفظ حاشیه سود:</span>
                <span className="font-bold text-[#085041]">تثبیت روی ۱۸.۵٪</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
