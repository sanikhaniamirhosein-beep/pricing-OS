import React, { useState } from 'react';
import {
  ShieldCheck,
  Send,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  Layers,
  AlertTriangle,
  Lock,
  GitCompare,
  FileCheck,
  Zap,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { usePricing } from '../../../store/PricingContext';
import { StrategyPackage } from '../../../types/pricing';
import { RiskMeterBadge } from '../../common/RiskMeterBadge';

interface ControlTowerViewProps {
  activeSubTab?: string;
  onSubTabChange?: (tab: 'packages' | 'inbox' | 'diff' | 'rollback' | 'audit') => void;
}

export const ControlTowerView: React.FC<ControlTowerViewProps> = ({
  activeSubTab,
  onSubTabChange,
}) => {
  const {
    strategyPackages,
    activeProductionPackage,
    approvePackage,
    publishPackage,
    rollbackPackage,
    submitPackageForReview,
    userName,
    userRole,
    setIsMfaModalOpen,
    setPendingMfaAction,
  } = usePricing();

  const [localActiveTab, setLocalActiveTab] = useState<'packages' | 'inbox' | 'diff' | 'rollback' | 'audit'>('inbox');
  const activeTab = (activeSubTab as any) || localActiveTab;
  const setActiveTab = (tab: 'packages' | 'inbox' | 'diff' | 'rollback' | 'audit') => {
    setLocalActiveTab(tab);
    if (onSubTabChange) onSubTabChange(tab);
  };
  const [selectedPackageId, setSelectedPackageId] = useState<string>(strategyPackages[0]?.packageId || '');
  const [canaryPercent, setCanaryPercent] = useState<number>(100);
  const [rollbackReason, setRollbackReason] = useState<string>('افزایش ناگهانی نرخ سوخت و نیاز به بازگشت موقت به تعرفه مرجع');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const pendingPackages = strategyPackages.filter((p) => p.status === 'In Review' || p.status === 'Draft');

  const handleApproveWithMfa = (pkg: StrategyPackage) => {
    // Check maker != checker rule (BR-012)
    if (pkg.authorName === userName) {
      setFeedbackMsg({
        type: 'error',
        text: 'گیت حاکمیتی (قانون BR-012): شما ایجادکننده این پکیج هستید و طبق اصل تفکیک وظایف (Maker ≠ Checker)، تصویب باید توسط عضو دیگری از کمیته کنترل مالی انجام شود.',
      });
      return;
    }

    setPendingMfaAction(() => () => {
      const res = approvePackage(pkg.packageId, userName);
      if (res.success) {
        setFeedbackMsg({ type: 'success', text: `پکیج ${pkg.displayId}@v${pkg.version} با موفقیت تصویب گردید.` });
      } else {
        setFeedbackMsg({ type: 'error', text: res.error || 'خطا در تصویب پکیج.' });
      }
    });

    setIsMfaModalOpen(true);
  };

  const handlePublishWithMfa = (pkg: StrategyPackage) => {
    setPendingMfaAction(() => () => {
      const res = publishPackage(pkg.packageId, canaryPercent);
      if (res.success) {
        setFeedbackMsg({
          type: 'success',
          text: `پکیج ${pkg.displayId}@v${pkg.version} در محیط پروداکشن با موفقیت منتشر و کش‌های سیستم اینولیدیت شدند (BR-042).`,
        });
      } else {
        setFeedbackMsg({ type: 'error', text: res.error || 'خطا در انتشار پکیج.' });
      }
    });

    setIsMfaModalOpen(true);
  };

  const handleRollbackWithMfa = () => {
    setPendingMfaAction(() => () => {
      const res = rollbackPackage('SP-1041', rollbackReason);
      if (res.success) {
        setFeedbackMsg({
          type: 'success',
          text: 'عملیات بازگشت اضطراری (Rollback) با موفقیت انجام شد و نسخه SP-1041 فعال گردید (BR-007).',
        });
      } else {
        setFeedbackMsg({ type: 'error', text: res.error || 'خطا در بازگشت اضطراری.' });
      }
    });

    setIsMfaModalOpen(true);
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-bold text-slate-900 text-base font-display">برج مراقبت و حاکمیت انتشار (Control Tower)</h2>
            <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-lg font-mono text-xs font-bold">
              Strategy Package & Governance
            </span>
          </div>
          <p className="text-slate-500 mt-1 text-xs">
            واحد یکتای استقرار (Strategy Package)، تایید دوطرفه (BR-012)، انتشار مرحله‌ای (Canary) و بازگشت آنی (BR-007)
          </p>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedbackMsg && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between animate-in fade-in duration-200 ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedbackMsg.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span className="font-semibold leading-relaxed text-xs">{feedbackMsg.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMsg(null)}
            className="text-slate-500 hover:text-slate-900 text-xs mr-2 cursor-pointer font-bold"
          >
            بستن
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('inbox')}
          className={`px-4 py-2.5 rounded-xl font-semibold transition-all cursor-pointer text-xs ${
            activeTab === 'inbox' ? 'bg-amber-500 text-white font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          کارتابل تاییدیه و حاکمیت (Approval Inbox)
        </button>
        <button
          onClick={() => setActiveTab('packages')}
          className={`px-4 py-2.5 rounded-xl font-semibold transition-all cursor-pointer text-xs ${
            activeTab === 'packages' ? 'bg-amber-500 text-white font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          مدیریت بسته‌های استراتژی (Strategy Packages)
        </button>
        <button
          onClick={() => setActiveTab('diff')}
          className={`px-4 py-2.5 rounded-xl font-semibold transition-all cursor-pointer text-xs ${
            activeTab === 'diff' ? 'bg-amber-500 text-white font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          مقایسه نسخ و تغییرات سلولی (Version Diff)
        </button>
        <button
          onClick={() => setActiveTab('rollback')}
          className={`px-4 py-2.5 rounded-xl font-semibold transition-all cursor-pointer text-xs ${
            activeTab === 'rollback' ? 'bg-amber-500 text-white font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          کنسول بازگشت اضطراری (Rollback Console)
        </button>
      </div>

      {/* Tab 1: Approval Inbox */}
      {activeTab === 'inbox' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
            <h3 className="font-bold text-slate-900 text-base font-display flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-amber-600" />
              درخواست‌های در انتظار تایید کمیته حاکمیت تعرفه:
            </h3>

            {pendingPackages.length > 0 ? (
              <div className="space-y-4">
                {pendingPackages.map((pkg) => (
                  <div
                    key={pkg.packageId}
                    className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 shadow-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200 text-xs">
                          {pkg.displayId}@v{pkg.version}
                        </span>
                        <span className="font-bold text-slate-900 text-sm font-display">{pkg.titleFa}</span>
                        <RiskMeterBadge riskClass={pkg.riskClass} size="sm" />
                      </div>
                      <span className="text-xs text-slate-500">
                        ایجاد شده توسط: <strong className="text-slate-800 font-medium">{pkg.authorName}</strong>
                      </span>
                    </div>

                    <p className="text-slate-700 text-xs leading-relaxed">{pkg.changeSummaryFa}</p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white p-3.5 rounded-xl border border-slate-200 font-mono shadow-xs">
                      <div>
                        <span className="text-slate-500 font-sans">وضعیت: </span>
                        <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded">{pkg.status}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-sans">شبیه‌سازی: </span>
                        <span className={pkg.simulationPassed ? 'text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded' : 'text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded'}>
                          {pkg.simulationPassed ? 'تأییدشده (Pass)' : 'نیازمند اجرا'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-sans">محیط: </span>
                        <span className="text-slate-800 font-semibold">{pkg.environment}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-sans">هش محتوا: </span>
                        <span className="text-slate-600">{pkg.snapshotHash.substring(0, 8)}...</span>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                      {pkg.status === 'Draft' && (
                        <button
                          type="button"
                          onClick={() => {
                            const res = submitPackageForReview(pkg.packageId);
                            if (res.success) {
                              setFeedbackMsg({ type: 'success', text: 'پکیج با موفقیت به کارتابل بررسی ارسال شد.' });
                            } else {
                              setFeedbackMsg({ type: 'error', text: res.error || 'خطا در ارسال پکیج.' });
                            }
                          }}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-amber-300 rounded-xl font-semibold flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
                        >
                          <Send className="w-3.5 h-3.5" />
                          ارسال به کارتابل تصویب (Submit)
                        </button>
                      )}

                      {pkg.status === 'In Review' && (
                        <button
                          type="button"
                          onClick={() => handleApproveWithMfa(pkg)}
                          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer text-xs"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          تصویب پکیج (Approve با MFA)
                        </button>
                      )}

                      {pkg.status === 'Approved' && (
                        <button
                          type="button"
                          onClick={() => handlePublishWithMfa(pkg)}
                          className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer text-xs"
                        >
                          <Zap className="w-4 h-4" />
                          انتشار فوری در پروداکشن (Publish)
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic p-4">در حال حاضر هیچ پکیجی در صف تایید قرار ندارد.</p>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Strategy Packages */}
      {activeTab === 'packages' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {strategyPackages.map((pkg) => (
              <div
                key={pkg.packageId}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200 text-xs">
                      {pkg.displayId}@v{pkg.version}
                    </span>
                    <RiskMeterBadge riskClass={pkg.riskClass} size="sm" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm font-display">{pkg.titleFa}</h4>
                  <p className="text-slate-600 text-xs leading-relaxed">{pkg.changeSummaryFa}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 font-mono text-xs shadow-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">وضعیت:</span>
                    <span className="font-bold text-emerald-700">{pkg.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">محیط:</span>
                    <span className="text-slate-800 font-medium">{pkg.environment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">هدف Rollback:</span>
                    <span className="text-amber-800 font-semibold">{pkg.rollbackTargetRef || '—'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
                  <span>مولف: <strong className="text-slate-700">{pkg.authorName.split(' ')[0]}</strong></span>
                  <span className="text-slate-400">{pkg.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Version Diff */}
      {activeTab === 'diff' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-900 text-base font-display flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-amber-600" />
              مقایسه تفاضلی سلول‌های ماتریس تعرفه (Cell-Level Diff Viewer):
            </h3>
            <span className="text-xs text-slate-600 font-mono bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 font-semibold">SP-1042@v11 vs SP-1041@v8</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 text-xs font-bold">
                  <th className="p-4">کریدور جاده‌ای</th>
                  <th className="p-4">نوع کشنده</th>
                  <th className="p-4">نرخ نسخه قبلی (SP-1041)</th>
                  <th className="p-4">نرخ نسخه جدید (SP-1042)</th>
                  <th className="p-4">تغییر ریالی و درصدی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-xs">
                <tr className="hover:bg-slate-50/80">
                  <td className="p-4 font-sans font-bold text-slate-900">تهران ➔ بندرعباس</td>
                  <td className="p-4 text-slate-700">تریلی چادری</td>
                  <td className="p-4 text-slate-500">۳۶,۰۰۰,۰۰۰ تومان</td>
                  <td className="p-4 text-slate-900 font-bold">۳۸,۵۰۰,۰۰۰ تومان</td>
                  <td className="p-4 text-emerald-700 font-bold bg-emerald-50/50">+۲,۵۰۰,۰۰۰ تومان (+۶.۹٪)</td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="p-4 font-sans font-bold text-slate-900">تهران ➔ بندرعباس</td>
                  <td className="p-4 text-slate-700">کشنده یخچال‌دار</td>
                  <td className="p-4 text-slate-500">۴۸,۰۰۰,۰۰۰ تومان</td>
                  <td className="p-4 text-slate-900 font-bold">۵۱,۰۰۰,۰۰۰ تومان</td>
                  <td className="p-4 text-emerald-700 font-bold bg-emerald-50/50">+۳,۰۰۰,۰۰۰ تومان (+۶.۲٪)</td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="p-4 font-sans font-bold text-slate-900">مشهد ➔ بازرگان</td>
                  <td className="p-4 text-slate-700">تریلی چادری</td>
                  <td className="p-4 text-slate-500">۵۱,۰۰۰,۰۰۰ تومان</td>
                  <td className="p-4 text-slate-900 font-bold">۵۴,۰۰۰,۰۰۰ تومان</td>
                  <td className="p-4 text-emerald-700 font-bold bg-emerald-50/50">+۳,۰۰۰,۰۰۰ تومان (+۵.۸٪)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Rollback Console */}
      {activeTab === 'rollback' && (
        <div className="max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 text-rose-700 font-bold text-base font-display">
            <RotateCcw className="w-5 h-5" />
            <span>کنسول بازگشت اضطراری تعرفه (1-Click Emergency Rollback - BR-007)</span>
          </div>

          <p className="text-slate-600 text-xs leading-relaxed">
            در صورت کشف هرگونه ناهنجاری یا عدم توافق بازار، می‌توانید در کمتر از چند ثانیه بدون نیاز به بازنویسی نرم‌افزار،
            تعرفه را به نسخه قبلی و ایمن بازگردانید. تاریخچه حسابرسی کاملاً حفظ می‌گردد.
          </p>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-slate-600 font-sans">پکیج فعال فعلی:</span>
              <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                {activeProductionPackage.displayId}@v{activeProductionPackage.version}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 font-sans">بسته هدف بازگشت ایمن:</span>
              <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">SP-1041@v8 (نسخه تابستانه پایدار)</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 mb-2 font-semibold font-sans text-xs">علت بازگشت اضطراری (الزامی):</label>
            <textarea
              rows={3}
              value={rollbackReason}
              onChange={(e) => setRollbackReason(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-slate-800 text-xs focus:bg-white focus:border-rose-500 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={handleRollbackWithMfa}
            className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer text-xs"
          >
            <RotateCcw className="w-4 h-4" />
            تایید بازگشت اضطراری با احراز هویت دومرحله‌ای (MFA)
          </button>
        </div>
      )}
    </div>
  );
};
