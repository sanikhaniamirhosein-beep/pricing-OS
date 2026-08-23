import React from 'react';
import { Sliders, Cpu, ArrowLeft, Eye, Edit3, ShieldAlert, Sparkles } from 'lucide-react';
import { SurfaceMode } from '../../hooks/useSurfaceMode';

interface SurfaceModeToggleProps {
  surfaceId: string;
  surfaceTitleFa: string;
  mode: SurfaceMode;
  onToggle: () => void;
  onSetMode: (mode: SurfaceMode) => void;
  className?: string;
}

export const SurfaceModeToggle: React.FC<SurfaceModeToggleProps> = ({
  surfaceTitleFa,
  mode,
  onSetMode,
  className = '',
}) => {
  const isAdvanced = mode === 'advanced';

  return (
    <div
      className={`inline-flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl border border-slate-200 shadow-2xs ${className}`}
      title={`حالت کاری اختصاصی برای «${surfaceTitleFa}»`}
    >
      <button
        type="button"
        onClick={() => onSetMode('simple')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
          !isAdvanced
            ? 'bg-white text-slate-800 shadow-xs border border-slate-200/80'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Sliders className="w-3.5 h-3.5 text-amber-600" />
        <span>حالت ساده</span>
      </button>

      <button
        type="button"
        onClick={() => onSetMode('advanced')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
          isAdvanced
            ? 'bg-slate-900 text-amber-400 shadow-xs border border-slate-700 font-mono'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Cpu className="w-3.5 h-3.5 text-amber-400" />
        <span>حالت پیشرفته</span>
        <span className="text-[10px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono font-normal">
          PRO
        </span>
      </button>
    </div>
  );
};

interface AdvancedConfigSummaryCardProps {
  surfaceTitleFa: string;
  onSwitchToAdvanced: () => void;
  summaryItems: { label: string; value: string | React.ReactNode; isCode?: boolean }[];
  descriptionFa?: string;
}

export const AdvancedConfigSummaryCard: React.FC<AdvancedConfigSummaryCardProps> = ({
  surfaceTitleFa,
  onSwitchToAdvanced,
  summaryItems,
  descriptionFa = 'این بخش دارای پیکربندی و فرمول‌های پیشرفته مهندسی تعرفه است که در حالت ساده فقط‌خواندنی نمایش داده می‌شود.',
}) => {
  return (
    <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-slate-900 text-white p-4 sm:p-5 rounded-2xl border border-slate-700 shadow-sm space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-slate-100">
                پیکربندی پیشرفته: {surfaceTitleFa}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                بدون افت داده (Lossless)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">{descriptionFa}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onSwitchToAdvanced}
          className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>ویرایش در حالت پیشرفته</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
        {summaryItems.map((item, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1"
          >
            <span className="text-slate-400 text-[11px] block">{item.label}:</span>
            <div className={`text-slate-200 font-semibold ${item.isCode ? 'font-mono text-amber-300 text-[11px] break-all' : ''}`}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
