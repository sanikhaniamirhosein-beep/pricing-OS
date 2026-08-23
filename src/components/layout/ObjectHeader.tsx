import React from 'react';
import {
  Calendar,
  User,
  Shield,
  Layers,
  Sparkles,
  GitBranch,
  Clock,
  CheckCircle2,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { LifecycleStatus, RiskClass } from '../../types/pricing';
import { RiskMeterBadge } from '../common/RiskMeterBadge';

interface ObjectHeaderProps {
  titleFa: string;
  displayId: string;
  typeFa: string;
  version: number;
  status: LifecycleStatus;
  riskClass: RiskClass;
  ownerName: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  impactedScopeFa?: string;
  simulationPassed?: boolean;
  onSendToSimulation?: () => void;
  onActionClick?: () => void;
  actionLabelFa?: string;
  actionDisabled?: boolean;
}

export const ObjectHeader: React.FC<ObjectHeaderProps> = ({
  titleFa,
  displayId,
  typeFa,
  version,
  status,
  riskClass,
  ownerName,
  effectiveFrom = '۱۴۰۵/۰۵/۰۱',
  effectiveTo = '۱۴۰۵/۰۸/۳۰',
  impactedScopeFa = 'ناوگان ترانزیت جاده‌ای، کفی بنادر، کانتینری و زنجیره سرد',
  simulationPassed = true,
  onSendToSimulation,
  onActionClick,
  actionLabelFa,
  actionDisabled = false,
}) => {
  const statusLabels: Record<LifecycleStatus, string> = {
    Active: 'فعال در محیط عملیاتی',
    Approved: 'تصویب‌شده',
    'In Review': 'در صف بررسی و تایید',
    Draft: 'پیش‌نویس اولیه',
    Simulated: 'شبیه‌سازی‌شده',
    Validated: 'اعتبارسنجی‌شده',
    Scheduled: 'زمان‌بندی‌شده',
    Paused: 'متوقف موقت',
    Deprecated: 'منسوخ‌شده',
    Archived: 'بایگانی‌شده',
  };

  const statusStyle = {
    Active: { backgroundColor: '#EAF3DE', color: '#27500A', borderColor: '#27500A40' },
    Approved: { backgroundColor: '#E1F5EE', color: '#04342C', borderColor: '#9FE1CB' },
    'In Review': { backgroundColor: '#FAEEDA', color: '#633806', borderColor: '#EF9F2740' },
    Draft: { backgroundColor: '#F1EFE8', color: '#2C2C2A', borderColor: '#D3D1C7' },
    Simulated: { backgroundColor: '#E6F1FB', color: '#0C447C', borderColor: '#0C447C40' },
    Validated: { backgroundColor: '#EAF3DE', color: '#27500A', borderColor: '#27500A40' },
    Scheduled: { backgroundColor: '#E1F5EE', color: '#085041', borderColor: '#9FE1CB' },
    Paused: { backgroundColor: '#FAEEDA', color: '#633806', borderColor: '#EF9F2740' },
    Deprecated: { backgroundColor: '#F1EFE8', color: '#888780', borderColor: '#D3D1C7' },
    Archived: { backgroundColor: '#F1EFE8', color: '#888780', borderColor: '#D3D1C7' },
  }[status] || { backgroundColor: '#F1EFE8', color: '#2C2C2A', borderColor: '#D3D1C7' };

  return (
    <div className="bg-white border border-[#D3D1C7] rounded-3xl p-6 shadow-xs mb-8 space-y-5">
      {/* Top row: Title, Type, Status, Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-mono font-bold bg-[#E1F5EE] text-[#04342C] border border-[#9FE1CB] px-2.5 py-1 rounded-lg">
              {displayId}@v{version}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-[#F1EFE8] text-[#2C2C2A] border border-[#D3D1C7] font-medium">
              {typeFa}
            </span>
            <span
              style={statusStyle}
              className="text-xs font-bold px-3 py-1 rounded-full border"
            >
              وضعیت: {statusLabels[status] || status}
            </span>
            <RiskMeterBadge riskClass={riskClass} size="sm" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#2C2C2A] font-display">{titleFa}</h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          {onSendToSimulation && (
            <button
              type="button"
              onClick={onSendToSimulation}
              className="px-4 py-2.5 rounded-xl bg-[#FAFAF8] hover:bg-[#F1EFE8] text-[#2C2C2A] border border-[#D3D1C7] text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <GitBranch className="w-4 h-4 text-[#085041]" />
              ارسال به آزمایشگاه شبیه‌سازی
            </button>
          )}

          {actionLabelFa && onActionClick && (
            <button
              type="button"
              disabled={actionDisabled}
              onClick={onActionClick}
              className="px-5 py-2.5 rounded-xl bg-[#085041] hover:bg-[#04342C] disabled:opacity-50 text-white text-xs font-bold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              {actionLabelFa}
            </button>
          )}
        </div>
      </div>

      {/* Bottom metadata grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-[#F1EFE8] text-xs">
        <div className="flex items-center gap-2.5 text-[#5F5E5A] bg-[#FAFAF8] p-2.5 rounded-xl border border-[#D3D1C7]">
          <User className="w-4 h-4 text-[#888780] shrink-0" />
          <span>
            مسئول سند: <strong className="text-[#2C2C2A] font-semibold">{ownerName}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2.5 text-[#5F5E5A] bg-[#FAFAF8] p-2.5 rounded-xl border border-[#D3D1C7]">
          <Calendar className="w-4 h-4 text-[#888780] shrink-0" />
          <span>
            بازه اعتبار: <strong className="text-[#2C2C2A] font-semibold">{effectiveFrom} الی {effectiveTo}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2.5 text-[#5F5E5A] bg-[#FAFAF8] p-2.5 rounded-xl border border-[#D3D1C7]">
          <CheckCircle2 className="w-4 h-4 text-[#085041] shrink-0" />
          <span>
            شبیه‌سازی: <strong className="text-[#085041] font-semibold">{simulationPassed ? 'موفقیت‌آمیز' : 'در انتظار'}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2.5 text-[#5F5E5A] bg-[#FAFAF8] p-2.5 rounded-xl border border-[#D3D1C7]">
          <Layers className="w-4 h-4 text-[#888780] shrink-0" />
          <span className="truncate">
            حوزه شمول: <strong className="text-[#2C2C2A] font-semibold">{impactedScopeFa}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
