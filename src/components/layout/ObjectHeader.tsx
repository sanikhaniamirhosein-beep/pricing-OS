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

  const statusColors = {
    Active: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    Approved: 'bg-sky-50 text-sky-800 border-sky-300',
    'In Review': 'bg-amber-50 text-amber-900 border-amber-300',
    Draft: 'bg-blue-50 text-blue-800 border-blue-300',
    Simulated: 'bg-indigo-50 text-indigo-800 border-indigo-300',
    Validated: 'bg-purple-50 text-purple-800 border-purple-300',
    Scheduled: 'bg-teal-50 text-teal-800 border-teal-300',
    Paused: 'bg-orange-50 text-orange-800 border-orange-300',
    Deprecated: 'bg-slate-100 text-slate-700 border-slate-300',
    Archived: 'bg-slate-100 text-slate-600 border-slate-300',
  }[status] || 'bg-slate-100 text-slate-700 border-slate-300';

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm mb-8 space-y-5">
      {/* Top row: Title, Type, Status, Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-mono font-bold bg-amber-50 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-lg">
              {displayId}@v{version}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-medium">
              {typeFa}
            </span>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusColors}`}>
              وضعیت: {statusLabels[status] || status}
            </span>
            <RiskMeterBadge riskClass={riskClass} size="sm" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">{titleFa}</h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          {onSendToSimulation && (
            <button
              type="button"
              onClick={onSendToSimulation}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <GitBranch className="w-4 h-4 text-amber-600" />
              ارسال به آزمایشگاه شبیه‌سازی
            </button>
          )}

          {actionLabelFa && onActionClick && (
            <button
              type="button"
              disabled={actionDisabled}
              onClick={onActionClick}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-bold shadow-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              {actionLabelFa}
            </button>
          )}
        </div>
      </div>

      {/* Bottom metadata grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-2.5 text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <User className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            مسئول سند: <strong className="text-slate-800 font-semibold">{ownerName}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2.5 text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            بازه اعتبار: <strong className="text-slate-800 font-semibold">{effectiveFrom} الی {effectiveTo}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2.5 text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            شبیه‌سازی: <strong className={simulationPassed ? 'text-emerald-700 font-semibold' : 'text-amber-700 font-semibold'}>
              {simulationPassed ? 'تأییدشده (Pass)' : 'نیازمند اجرا'}
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-2.5 text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 truncate">
          <Layers className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="truncate">
            دامنه شمول: <strong className="text-slate-800 font-semibold">{impactedScopeFa}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
