import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, Info } from 'lucide-react';
import { RiskClass } from '../../types/pricing';

interface RiskMeterBadgeProps {
  riskClass: RiskClass;
  marginProximity?: number; // e.g. 16.5% vs 15% floor
  hasPassedSimulation?: boolean;
  impactedCorridorsCount?: number;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskMeterBadge: React.FC<RiskMeterBadgeProps> = ({
  riskClass,
  marginProximity = 18.2,
  hasPassedSimulation = true,
  impactedCorridorsCount = 8,
  interactive = true,
  size = 'md',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const config = {
    low: {
      style: { backgroundColor: '#97C459', color: '#173404', borderColor: '#97C459' },
      dot: 'bg-[#173404]',
      labelFa: 'ریسک پایین (Low Risk)',
      labelEn: 'Low Risk',
      icon: ShieldCheck,
      descFa: 'تغییرات جزئی بدون تاثیر منفی بر کف حاشیه سود ۱۵٪',
    },
    medium: {
      style: { backgroundColor: '#EF9F27', color: '#412402', borderColor: '#EF9F27' },
      dot: 'bg-[#412402]',
      labelFa: 'ریسک متوسط (Medium Risk)',
      labelEn: 'Medium Risk',
      icon: AlertTriangle,
      descFa: 'نیازمند شبیه‌سازی الزامی و تاییدیه کنترل مالی',
    },
    high: {
      style: { backgroundColor: '#E24B4A', color: '#501313', borderColor: '#E24B4A' },
      dot: 'bg-[#501313]',
      labelFa: 'ریسک بالا (High Risk)',
      labelEn: 'High Risk',
      icon: ShieldAlert,
      descFa: 'تغییر ساختاری تعرفه/تخفیف، نیازمند شبیه‌سازی ۱۰,۰۰۰ بارنامه و تایید ۲ مرحله‌ای',
    },
  }[riskClass];

  const Icon = config.icon;
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-xs px-3 py-1.5 gap-2',
    lg: 'text-sm px-4 py-2 gap-2.5',
  }[size];

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={() => interactive && setShowTooltip(!showTooltip)}
        onMouseEnter={() => interactive && setShowTooltip(true)}
        onMouseLeave={() => interactive && setShowTooltip(false)}
        style={config.style}
        className={`inline-flex items-center font-bold rounded-full border transition-all duration-200 cursor-pointer shadow-xs ${sizeClasses}`}
        aria-label={`سطح ریسک: ${config.labelFa}`}
      >
        <span className={`w-2 h-2 rounded-full animate-pulse ${config.dot}`} />
        <Icon className="w-3.5 h-3.5" />
        <span>{config.labelFa}</span>
      </button>

      {showTooltip && (
        <div className="absolute z-50 top-full mt-2 w-72 p-4 bg-white border border-[#D3D1C7] rounded-2xl shadow-xl text-xs text-[#2C2C2A] right-0 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-[#F1EFE8] pb-2 mb-2 font-semibold">
            <span className="flex items-center gap-1.5 text-[#2C2C2A]">
              <Info className="w-4 h-4 text-[#0F6E56]" />
              تحلیل عوامل تشکیل‌دهنده ریسک (Risk Meter)
            </span>
          </div>
          <p className="text-[#5F5E5A] mb-3 leading-relaxed">{config.descFa}</p>
          <div className="space-y-2 bg-[#FAFAF8] p-2.5 rounded-xl border border-[#D3D1C7]">
            <div className="flex justify-between">
              <span className="text-[#5F5E5A]">فاصله تا کف سود (۱۵٪):</span>
              <span className={`font-mono font-bold ${marginProximity < 16 ? 'text-[#04342C]' : 'text-[#085041]'}`}>
                {marginProximity.toFixed(1)}٪
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5F5E5A]">وضعیت شبیه‌سازی:</span>
              <span className={hasPassedSimulation ? 'text-[#085041] font-bold' : 'text-[#791F1F] font-bold'}>
                {hasPassedSimulation ? 'تأییدشده (Pass)' : 'نیازمند اجرا (Required)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5F5E5A]">دامنه کریدورهای متاثر:</span>
              <span className="font-mono text-[#2C2C2A] font-semibold">{impactedCorridorsCount} مسیر اصلی</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
