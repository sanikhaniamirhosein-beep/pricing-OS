import React, { useState, useMemo } from 'react';
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
  Plus,
  Search,
  Filter,
  Eye,
  KeyRound,
  History,
  Sliders,
  Radio,
  Sparkles,
  UserCheck,
  Building2,
  FileText,
  Percent,
  TrendingUp,
  Database,
  ArrowUpRight,
  ArrowDownRight,
  HelpCircle,
  RefreshCw,
  Check,
} from 'lucide-react';
import { usePricing } from '../../../store/PricingContext';
import { StrategyPackage, RiskClass, AuditLogEvent } from '../../../types/pricing';
import { RiskMeterBadge } from '../../common/RiskMeterBadge';
import { ModernSelect } from '../../common/menus/ModernSelect';

interface ControlTowerViewProps {
  activeSubTab?: string;
  onSubTabChange?: (tab: string) => void;
}

type GovernanceTab = 'approval_inbox' | 'strategy_packages' | 'release_scheduler' | 'rollback_breakglass' | 'audit_trail';

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
    createStrategyPackage,
    auditLogs,
    userName,
    userRole,
    setUserRole,
    setIsMfaModalOpen,
    setPendingMfaAction,
  } = usePricing();

  // Normalize subTab input
  const normalizeTab = (tab?: string): GovernanceTab => {
    if (!tab) return 'approval_inbox';
    if (tab === 'inbox' || tab === 'approval_inbox') return 'approval_inbox';
    if (tab === 'packages' || tab === 'strategy_packages') return 'strategy_packages';
    if (tab === 'diff' || tab === 'release' || tab === 'release_scheduler') return 'release_scheduler';
    if (tab === 'rollback' || tab === 'rollback_breakglass') return 'rollback_breakglass';
    if (tab === 'audit' || tab === 'audit_trail') return 'audit_trail';
    return 'approval_inbox';
  };

  const [localActiveTab, setLocalActiveTab] = useState<GovernanceTab>(normalizeTab(activeSubTab));
  const activeTab: GovernanceTab = normalizeTab(activeSubTab) || localActiveTab;

  const handleTabSelect = (tab: GovernanceTab) => {
    setLocalActiveTab(tab);
    if (onSubTabChange) onSubTabChange(tab);
  };

  // Local UI States
  const [selectedPackageId, setSelectedPackageId] = useState<string>(strategyPackages?.[0]?.packageId || '');
  const [canaryPercent, setCanaryPercent] = useState<number>(100);
  const [rollbackReason, setRollbackReason] = useState<string>('افزایش ناگهانی نرخ سوخت و نیاز به بازگشت موقت به تعرفه مرجع پایدار');
  const [selectedRollbackTarget, setSelectedRollbackTarget] = useState<string>('SP-1041');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);
  const [breakGlassEnabled, setBreakGlassEnabled] = useState<boolean>(false);
  const [breakGlassCode, setBreakGlassCode] = useState<string>('');

  // Inbox & Packages Filter States
  const [inboxStatusFilter, setInboxStatusFilter] = useState<'all' | 'In Review' | 'Draft' | 'Approved'>('all');
  const [packagesSearchQuery, setPackagesSearchQuery] = useState<string>('');
  const [packagesRiskFilter, setPackagesRiskFilter] = useState<string>('all');
  const [packagesEnvFilter, setPackagesEnvFilter] = useState<string>('all');

  // Audit Logs Filter
  const [auditSearchQuery, setAuditSearchQuery] = useState<string>('');
  const [auditTypeFilter, setAuditTypeFilter] = useState<string>('all');

  // New Strategy Package Modal Form State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPkgTitle, setNewPkgTitle] = useState('');
  const [newPkgSummary, setNewPkgSummary] = useState('');
  const [newPkgRisk, setNewPkgRisk] = useState<RiskClass>('medium');

  // Inspect Package Modal
  const [inspectingPackage, setInspectingPackage] = useState<StrategyPackage | null>(null);

  // Selected package for details or diff
  const selectedPackage = useMemo(() => {
    return strategyPackages.find((p) => p.packageId === selectedPackageId) || strategyPackages[0] || null;
  }, [strategyPackages, selectedPackageId]);

  // Pending packages for Inbox
  const filteredInboxPackages = useMemo(() => {
    return (strategyPackages || []).filter((p) => {
      if (!p) return false;
      if (inboxStatusFilter === 'all') {
        return p.status === 'In Review' || p.status === 'Draft' || p.status === 'Approved';
      }
      return p.status === inboxStatusFilter;
    });
  }, [strategyPackages, inboxStatusFilter]);

  // Filtered packages for Packages Tab
  const filteredPackages = useMemo(() => {
    return (strategyPackages || []).filter((p) => {
      if (!p) return false;
      const matchesSearch =
        p.titleFa.toLowerCase().includes(packagesSearchQuery.toLowerCase()) ||
        p.displayId.toLowerCase().includes(packagesSearchQuery.toLowerCase()) ||
        p.changeSummaryFa.toLowerCase().includes(packagesSearchQuery.toLowerCase()) ||
        p.authorName.toLowerCase().includes(packagesSearchQuery.toLowerCase());
      const matchesRisk = packagesRiskFilter === 'all' || p.riskClass === packagesRiskFilter;
      const matchesEnv = packagesEnvFilter === 'all' || p.environment === packagesEnvFilter;
      return matchesSearch && matchesRisk && matchesEnv;
    });
  }, [strategyPackages, packagesSearchQuery, packagesRiskFilter, packagesEnvFilter]);

  // Filtered audit logs
  const filteredAuditLogs = useMemo(() => {
    return (auditLogs || []).filter((log) => {
      const matchesSearch =
        log.actorName.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
        log.eventType.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
        log.objectRef.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
        (log.actorRole && log.actorRole.toLowerCase().includes(auditSearchQuery.toLowerCase()));
      const matchesType = auditTypeFilter === 'all' || log.eventType.includes(auditTypeFilter);
      return matchesSearch && matchesType;
    });
  }, [auditLogs, auditSearchQuery, auditTypeFilter]);

  // Action: Submit for Review
  const handleSubmitForReview = (pkg: StrategyPackage) => {
    const res = submitPackageForReview(pkg.packageId);
    if (res.success) {
      setFeedbackMsg({
        type: 'success',
        text: `بسته ${pkg.displayId}@v${pkg.version} با موفقیت به کارتابل کمیته حاکمیت ارسال گردید و در محیط آزمایشی (Staging) مستقر شد.`,
      });
    } else {
      setFeedbackMsg({ type: 'error', text: res.error || 'خطا در ارسال پکیج به کارتابل.' });
    }
  };

  // Action: Approve with MFA & Maker-Checker Check
  const handleApproveWithMfa = (pkg: StrategyPackage) => {
    // Check maker != checker rule (BR-012)
    if (pkg.authorName === userName && !breakGlassEnabled) {
      setFeedbackMsg({
        type: 'error',
        text: `گیت حاکمیتی (قانون BR-012): شما ایجادکننده این بسته هستید (${pkg.authorName}). طبق اصل تفکیک وظایف (Maker ≠ Checker)، تایید نهایی باید توسط عضو دیگری از کمیته کنترل مالی انجام پذیرد. برای تایید در محیط دمو می‌توانید نقش خود را به "Finance Controller" تغییر دهید.`,
      });
      return;
    }

    setPendingMfaAction(() => () => {
      const res = approvePackage(pkg.packageId, userName);
      if (res.success) {
        setFeedbackMsg({
          type: 'success',
          text: `بسته ${pkg.displayId}@v${pkg.version} با موفقیت توسط «${userName}» تایید گردید و آماده انتشار در پروداکشن شد.`,
        });
      } else {
        setFeedbackMsg({ type: 'error', text: res.error || 'خطا در تایید بسته استراتژی.' });
      }
    });

    setIsMfaModalOpen(true);
  };

  // Action: Publish with MFA
  const handlePublishWithMfa = (pkg: StrategyPackage) => {
    setPendingMfaAction(() => () => {
      const res = publishPackage(pkg.packageId, canaryPercent);
      if (res.success) {
        setFeedbackMsg({
          type: 'success',
          text: `بسته ${pkg.displayId}@v${pkg.version} با سهم توزیع ${canaryPercent}٪ در محیط پروداکشن با موفقیت فعال گردید. کش‌های شبکه محاسبه کرایه اینولیدیت شدند (BR-042).`,
        });
      } else {
        setFeedbackMsg({ type: 'error', text: res.error || 'خطا در انتشار بسته استراتژی.' });
      }
    });

    setIsMfaModalOpen(true);
  };

  // Action: Rollback with MFA
  const handleRollbackWithMfa = () => {
    setPendingMfaAction(() => () => {
      const res = rollbackPackage(selectedRollbackTarget, rollbackReason);
      if (res.success) {
        setFeedbackMsg({
          type: 'success',
          text: `عملیات بازگشت اضطراری (Rollback BR-007) با موفقیت اجرا شد. تعرفه عملیاتی به نسخه ${selectedRollbackTarget} بازگردانی گردید.`,
        });
      } else {
        setFeedbackMsg({ type: 'error', text: res.error || 'خطا در اجرای بازگشت اضطراری.' });
      }
    });

    setIsMfaModalOpen(true);
  };

  // Action: Create Package
  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPkgTitle.trim()) return;

    const created = createStrategyPackage({
      titleFa: newPkgTitle.trim(),
      changeSummaryFa: newPkgSummary.trim() || 'به‌روزرسانی تعرفه‌ها و اعمال قواعد جدید ناوگان',
      riskClass: newPkgRisk,
    });

    setIsCreateModalOpen(false);
    setNewPkgTitle('');
    setNewPkgSummary('');
    setFeedbackMsg({
      type: 'success',
      text: `بسته استراتژی جدید ${created.displayId}@v1 با موفقیت ساخته شد و در وضعیت پیش‌نویس (Draft) قرار گرفت.`,
    });
    handleTabSelect('approval_inbox');
  };

  // Subtabs Definition
  const tabs = [
    {
      id: 'approval_inbox' as GovernanceTab,
      labelFa: 'کارتابل تایید دوطرفه (Maker-Checker)',
      badge: `${filteredInboxPackages.length}`,
      icon: ShieldCheck,
    },
    {
      id: 'strategy_packages' as GovernanceTab,
      labelFa: 'مدیریت بسته‌های استراتژی (Packages)',
      badge: `${strategyPackages.length}`,
      icon: Layers,
    },
    {
      id: 'release_scheduler' as GovernanceTab,
      labelFa: 'توزیع قناری و مقایسه تفاضلی (Canary & Diff)',
      icon: Radio,
    },
    {
      id: 'rollback_breakglass' as GovernanceTab,
      labelFa: 'کنسول بازگشت فوری و اضطراری (Rollback BR-007)',
      badge: 'BR-007',
      icon: RotateCcw,
    },
    {
      id: 'audit_trail' as GovernanceTab,
      labelFa: 'دفترکل وقایع و لاگ‌های حاکمیتی (Audit)',
      badge: `${auditLogs?.length || 0}`,
      icon: History,
    },
  ];

  return (
    <div className="space-y-6 text-xs animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-900 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-bold text-slate-900 text-base font-display">
                برج مراقبت و حاکمیت انتشار (Control Tower)
              </h1>
              <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold">
                Maker-Checker BR-012 & Canary Rollback BR-007
              </span>
            </div>
            <p className="text-slate-500 mt-1 text-xs leading-relaxed">
              واحد یکتای استقرار (Strategy Package)، تایید صلاحیت چندمرحله‌ای با MFA، توزیع ترافیک قناری، و بازگشت اضطراری به نسخ پایدار
            </p>
          </div>
        </div>

        {/* Quick Actions & Role Switcher */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs">
            <UserCheck className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-slate-500">کاربر فعال:</span>
            <strong className="text-slate-800">{userName}</strong>
            <span className="text-[10px] bg-slate-200/70 text-slate-700 px-1.5 py-0.5 rounded font-mono">
              {userRole}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            بسته استراتژی جدید
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedbackMsg && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between animate-in fade-in duration-150 ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : feedbackMsg.type === 'warning'
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedbackMsg.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : feedbackMsg.type === 'warning' ? (
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span className="font-semibold leading-relaxed text-xs">{feedbackMsg.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMsg(null)}
            className="text-slate-500 hover:text-slate-900 text-xs px-2 py-1 rounded cursor-pointer font-bold"
          >
            بستن
          </button>
        </div>
      )}

      {/* Navigation Tabs Bar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center gap-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabSelect(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-500'}`} />
              <span>{tab.labelFa}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isActive ? 'bg-slate-950/15 text-slate-950' : 'bg-slate-200/70 text-slate-600'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: کارتابل تایید دوطرفه (Approval Inbox - Maker-Checker BR-012) */}
      {activeTab === 'approval_inbox' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-5">
            {/* Filter and Overview Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-bold text-slate-900 text-sm font-display flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-amber-600" />
                  درخواست‌های در انتظار بررسی و تایید کمیته حاکمیت نرخ
                </h2>
                <p className="text-slate-400 text-xs mt-0.5">
                  مطابق بند BR-012، هرگونه تغییر در تعرفه‌ها باید توسط فردی غیر از سازنده پکیج و با تایید هویت دومرحله‌ای (MFA) تصویب گردد.
                </p>
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200">
                {(['all', 'In Review', 'Draft', 'Approved'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setInboxStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      inboxStatusFilter === st
                        ? 'bg-amber-500 text-slate-950 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st === 'all'
                      ? 'همه'
                      : st === 'In Review'
                      ? 'در انتظار تصویب'
                      : st === 'Draft'
                      ? 'پیش‌نویس'
                      : 'تاییدشده'}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Demo Switcher Tip */}
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  <strong>راهنمای تست Maker-Checker:</strong> اگر ایجادکننده پکیج شما باشید، سیستم مانع تایید خودکار می‌شود. برای تست نقش، می‌توانید نقش کاربری را سوییچ کنید:
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setUserRole('Finance Controller')}
                  className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-950 border border-amber-300 rounded-lg font-bold text-[11px] cursor-pointer"
                >
                  نقش: معاونت مالی (Approver)
                </button>
                <button
                  type="button"
                  onClick={() => setUserRole('Pricing Strategist')}
                  className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-950 border border-amber-300 rounded-lg font-bold text-[11px] cursor-pointer"
                >
                  نقش: طراح تعرفه (Maker)
                </button>
              </div>
            </div>

            {/* Packages List */}
            {filteredInboxPackages.length > 0 ? (
              <div className="space-y-4">
                {filteredInboxPackages.map((pkg) => {
                  const isAuthor = pkg.authorName === userName;
                  return (
                    <div
                      key={pkg.packageId}
                      className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 shadow-2xs hover:border-slate-300 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-mono font-bold text-amber-950 bg-amber-100 px-2.5 py-0.5 rounded-lg border border-amber-300 text-xs">
                            {pkg.displayId}@v{pkg.version}
                          </span>
                          <h3 className="font-bold text-slate-900 text-sm font-display">{pkg.titleFa}</h3>
                          <RiskMeterBadge riskClass={pkg.riskClass} size="sm" />
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              pkg.status === 'Active'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : pkg.status === 'Approved'
                                ? 'bg-blue-100 text-blue-900 border border-blue-300'
                                : pkg.status === 'In Review'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {pkg.status}
                          </span>
                        </div>

                        <div className="text-xs text-slate-500 flex items-center gap-2">
                          <span>ایجاد شده توسط:</span>
                          <strong className={`font-semibold ${isAuthor ? 'text-amber-800' : 'text-slate-800'}`}>
                            {pkg.authorName} {isAuthor && '(شما)'}
                          </strong>
                          <span className="text-slate-300">|</span>
                          <span>تاریخ: {pkg.createdAt}</span>
                        </div>
                      </div>

                      <p className="text-slate-700 text-xs leading-relaxed">{pkg.changeSummaryFa}</p>

                      {/* Package Meta Info Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white p-3.5 rounded-xl border border-slate-200 font-mono shadow-2xs">
                        <div>
                          <span className="text-slate-400 font-sans block text-[10px]">محیط استقرار:</span>
                          <span className="text-slate-800 font-semibold">{pkg.environment}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-sans block text-[10px]">تاییدیه شبیه‌سازی (BR-033):</span>
                          <span
                            className={`font-bold ${
                              pkg.simulationPassed
                                ? 'text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded'
                                : 'text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded'
                            }`}
                          >
                            {pkg.simulationPassed ? 'Pass (تأییدشده)' : 'Pending (نیازمند اجرا)'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-sans block text-[10px]">هدف بازگشت اضطراری:</span>
                          <span className="text-slate-700 font-semibold">{pkg.rollbackTargetRef || 'SP-1041'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-sans block text-[10px]">هش کانتینر (SHA-256):</span>
                          <span className="text-slate-600 truncate block">
                            {pkg?.snapshotHash ? pkg.snapshotHash.substring(0, 12) : '3f8a912b4e'}...
                          </span>
                        </div>
                      </div>

                      {/* Policy & Matrix Components Tags */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-[11px] text-slate-400">اقلام مشمول در بسته:</span>
                        {(pkg.pricingPolicyVersionRefs || []).map((ref) => (
                          <span key={ref} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-mono">
                            سیاست: {ref}
                          </span>
                        ))}
                        {(pkg.productVersionRefs || []).map((ref) => (
                          <span key={ref} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-mono">
                            محصول: {ref}
                          </span>
                        ))}
                        {(pkg.discountPolicyVersionRefs || []).map((ref) => (
                          <span key={ref} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-mono">
                            تخفیف: {ref}
                          </span>
                        ))}
                      </div>

                      {/* Action Buttons Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/60">
                        <button
                          type="button"
                          onClick={() => setInspectingPackage(pkg)}
                          className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-medium flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          مشاهده دقیق جزئیات بسته
                        </button>

                        <div className="flex items-center gap-2">
                          {pkg.status === 'Draft' && (
                            <button
                              type="button"
                              onClick={() => handleSubmitForReview(pkg)}
                              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-xl font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer text-xs"
                            >
                              <Send className="w-3.5 h-3.5" />
                              ارسال به کارتابل تصویب (Submit)
                            </button>
                          )}

                          {pkg.status === 'In Review' && (
                            <button
                              type="button"
                              onClick={() => handleApproveWithMfa(pkg)}
                              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer text-xs"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              تصویب بسته (Approve با MFA)
                            </button>
                          )}

                          {pkg.status === 'Approved' && (
                            <button
                              type="button"
                              onClick={() => handlePublishWithMfa(pkg)}
                              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer text-xs"
                            >
                              <Zap className="w-4 h-4" />
                              انتشار فوری در پروداکشن (Publish)
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <ShieldCheck className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-slate-600 font-semibold">هیچ پکیجی در صف تایید با فیلتر فعلی یافت نشد.</p>
                <p className="text-slate-400 text-xs">می‌توانید با کلیک روی «بسته استراتژی جدید» یک بسته جدید ایجاد نمایید.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: مدیریت بسته‌های استراتژی (Strategy Packages Registry) */}
      {activeTab === 'strategy_packages' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-5">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="جستجو در شناسه‌ها، عناوین و مولفین..."
                  value={packagesSearchQuery}
                  onChange={(e) => setPackagesSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pr-9 pl-4 text-slate-800 text-xs focus:bg-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Filter className="w-3.5 h-3.5" />
                  <span>ریسک:</span>
                  <select
                    value={packagesRiskFilter}
                    onChange={(e) => setPackagesRiskFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
                  >
                    <option value="all">همه سطوح</option>
                    <option value="low">کم (Low)</option>
                    <option value="medium">متوسط (Medium)</option>
                    <option value="high">بالا (High)</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span>محیط:</span>
                  <select
                    value={packagesEnvFilter}
                    onChange={(e) => setPackagesEnvFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
                  >
                    <option value="all">همه محیط‌ها</option>
                    <option value="production">عملیاتی (Production)</option>
                    <option value="staging">آزمایشی (Staging)</option>
                    <option value="draft">پیش‌نویس (Draft)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPackages.map((pkg) => {
                const isActive = pkg.status === 'Active' && pkg.environment === 'production';
                return (
                  <div
                    key={pkg.packageId}
                    className={`bg-white border rounded-2xl p-5 shadow-2xs space-y-4 flex flex-col justify-between transition-all ${
                      isActive ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-amber-950 bg-amber-100 px-2.5 py-0.5 rounded-lg border border-amber-300 text-xs">
                          {pkg.displayId}@v{pkg.version}
                        </span>
                        <RiskMeterBadge riskClass={pkg.riskClass} size="sm" />
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm font-display">{pkg.titleFa}</h3>
                      <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">{pkg.changeSummaryFa}</p>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 font-mono text-xs shadow-2xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-sans">وضعیت:</span>
                        <span
                          className={`font-bold ${
                            isActive ? 'text-emerald-700' : 'text-slate-700'
                          }`}
                        >
                          {pkg.status} {isActive && '(فعال در تولید)'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-sans">محیط:</span>
                        <span className="text-slate-800 font-medium">{pkg.environment}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-sans">پشتیبان Rollback:</span>
                        <span className="text-amber-800 font-semibold">{pkg.rollbackTargetRef || 'SP-1041'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
                      <span className="truncate">مولف: <strong className="text-slate-700">{pkg.authorName}</strong></span>
                      <button
                        type="button"
                        onClick={() => setInspectingPackage(pkg)}
                        className="text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        جزئیات
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: توزیع قناری و مقایسه تفاضلی (Release Scheduler & Version Diff) */}
      {activeTab === 'release_scheduler' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Canary Scheduler Controls */}
            <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-5">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm font-display">
                <Radio className="w-4 h-4 text-amber-600" />
                <span>تنظیمات توزیع مرحله‌ای قناری (Canary Release)</span>
              </div>

              <p className="text-slate-500 text-xs leading-relaxed">
                توزیع تدریجی ترافیک استعلام کرایه روی نسخه جدید برای اطمینان از عدم خطای حاشیه سود و انطباق با بازار.
              </p>

              {/* Canary Slider */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">سهم ترافیک نسخه جدید:</span>
                  <span className="font-mono font-bold text-amber-900 text-sm bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                    {canaryPercent}٪
                  </span>
                </div>

                <input
                  type="range"
                  min={10}
                  max={100}
                  step={5}
                  value={canaryPercent}
                  onChange={(e) => setCanaryPercent(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />

                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>۱۰٪ آزمایشی</span>
                  <span>۵۰٪ کریدورهای مرکزی</span>
                  <span>۱۰۰٪ کل شبکه</span>
                </div>
              </div>

              {/* Fleet Invalidation Nodes */}
              <div className="space-y-2 text-xs">
                <span className="font-semibold text-slate-700 block">نودهای فعال توزیع کش (Edge Nodes):</span>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex items-center justify-between">
                    <span>شعبه تهران-مرکزی</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex items-center justify-between">
                    <span>شعبه بندرعباس</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex items-center justify-between">
                    <span>شعبه اصفهان</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex items-center justify-between">
                    <span>شعبه تبریز</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handlePublishWithMfa(selectedPackage || activeProductionPackage)}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer text-xs"
              >
                <Zap className="w-4 h-4" />
                اعمال توزیع {canaryPercent}٪ و انتشار با MFA
              </button>
            </div>

            {/* Right: Version Diff Table */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <h2 className="font-bold text-slate-900 text-sm font-display flex items-center gap-2">
                  <GitCompare className="w-4 h-4 text-amber-600" />
                  مقایسه تفاضلی سلول‌های ماتریس تعرفه (Cell-Level Diff Viewer)
                </h2>
                <span className="text-xs text-slate-600 font-mono bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 font-semibold">
                  SP-1042@v11 vs SP-1041@v8
                </span>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                <table className="w-full text-right border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
                      <th className="p-3.5">کریدور جاده‌ای</th>
                      <th className="p-3.5">نوع کشنده</th>
                      <th className="p-3.5">نسخه قبلی (SP-1041)</th>
                      <th className="p-3.5">نسخه جدید (SP-1042)</th>
                      <th className="p-3.5">تغییر نرخ و درصد</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr className="hover:bg-slate-50/80">
                      <td className="p-3.5 font-sans font-bold text-slate-900">تهران ➔ بندرعباس</td>
                      <td className="p-3.5 text-slate-700">تریلی چادری</td>
                      <td className="p-3.5 text-slate-500">۳۶,۰۰۰,۰۰۰ ت</td>
                      <td className="p-3.5 text-slate-900 font-bold">۳۸,۵۰۰,۰۰۰ ت</td>
                      <td className="p-3.5 text-emerald-700 font-bold bg-emerald-50/50">
                        <span className="flex items-center gap-1">
                          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                          +۲,۵۰۰,۰۰۰ ت (+۶.۹٪)
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/80">
                      <td className="p-3.5 font-sans font-bold text-slate-900">تهران ➔ بندرعباس</td>
                      <td className="p-3.5 text-slate-700">کشنده یخچال‌دار</td>
                      <td className="p-3.5 text-slate-500">۴۸,۰۰۰,۰۰۰ ت</td>
                      <td className="p-3.5 text-slate-900 font-bold">۵۱,۰۰۰,۰۰۰ ت</td>
                      <td className="p-3.5 text-emerald-700 font-bold bg-emerald-50/50">
                        <span className="flex items-center gap-1">
                          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                          +۳,۰۰۰,۰۰۰ ت (+۶.۲٪)
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/80">
                      <td className="p-3.5 font-sans font-bold text-slate-900">مشهد ➔ بازرگان</td>
                      <td className="p-3.5 text-slate-700">تریلی چادری</td>
                      <td className="p-3.5 text-slate-500">۵۴,۰۰۰,۰۰۰ ت</td>
                      <td className="p-3.5 text-slate-900 font-bold">۵۱,۰۰۰,۰۰۰ ت</td>
                      <td className="p-3.5 text-rose-700 font-bold bg-rose-50/50">
                        <span className="flex items-center gap-1">
                          <ArrowDownRight className="w-3.5 h-3.5 text-rose-600" />
                          -۳,۰۰۰,۰۰۰ ت (-۵.۵٪)
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/80">
                      <td className="p-3.5 font-sans font-bold text-slate-900">اصفهان ➔ بوشهر</td>
                      <td className="p-3.5 text-slate-700">کفی ۴۰ فوت</td>
                      <td className="p-3.5 text-slate-500">۲۲,۰۰۰,۰۰۰ ت</td>
                      <td className="p-3.5 text-slate-900 font-bold">۲۳,۸۰۰,۰۰۰ ت</td>
                      <td className="p-3.5 text-emerald-700 font-bold bg-emerald-50/50">
                        <span className="flex items-center gap-1">
                          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                          +۱,۸۰۰,۰۰۰ ت (+۸.۱٪)
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: کنسول بازگشت اضطراری و Break-Glass (Rollback Console BR-007) */}
      {activeTab === 'rollback_breakglass' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1-Click Rollback Panel */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-5">
              <div className="flex items-center gap-2.5 text-rose-700 font-bold text-sm font-display">
                <RotateCcw className="w-5 h-5" />
                <span>کنسول بازگشت اضطراری تعرفه (1-Click Emergency Rollback - BR-007)</span>
              </div>

              <p className="text-slate-600 text-xs leading-relaxed">
                در صورت کشف هرگونه ناهنجاری، خطای سیستمی یا نوسان شدید بازار، امکان بازگردانی آنی تعرفه به نسخه پایدار بدون هیچ توقف در سرویس مهیاست.
              </p>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-sans">بسته فعال پروداکشن:</span>
                  <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    {activeProductionPackage?.displayId || 'SP-1042'}@v{activeProductionPackage?.version || '11'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-sans">بسته هدف بازگشت ایمن:</span>
                  <select
                    value={selectedRollbackTarget}
                    onChange={(e) => setSelectedRollbackTarget(e.target.value)}
                    className="bg-white border border-emerald-300 text-emerald-900 font-bold px-2 py-1 rounded text-xs focus:outline-none"
                  >
                    <option value="SP-1041">SP-1041@v8 (نسخه پایدار تابستانه)</option>
                    <option value="SP-1039">SP-1039@v5 (نسخه مبنای بهاره)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-2 font-semibold text-xs">علت بازگشت اضطراری (الزامی برای ثبت در لاگ حسابرسی):</label>
                <textarea
                  rows={3}
                  value={rollbackReason}
                  onChange={(e) => setRollbackReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 text-xs focus:bg-white focus:border-rose-500 focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleRollbackWithMfa}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer text-xs"
              >
                <RotateCcw className="w-4 h-4" />
                اجرای بازگشت اضطراری به {selectedRollbackTarget} با MFA
              </button>
            </div>

            {/* Break-Glass Emergency Mode Panel */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-5">
              <div className="flex items-center gap-2.5 text-amber-900 font-bold text-sm font-display">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                <span>پروتکل شرایط اضطراری (Break-Glass Override Protocol)</span>
              </div>

              <p className="text-slate-600 text-xs leading-relaxed">
                در شرایط بحرانی (مانند قطعی اتصال، تحولات ناگهانی سهمیه سوخت یا مسدودی شریان‌های اصلی)، مدیر ارشد سیستم می‌تواند پروتکل Break-Glass را فعال کند تا صف‌های زمان‌بر تایید چندمرحله‌ای برای انتشار فوری تعرفه امدادی موقتاً دور زده شوند.
              </p>

              <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl space-y-3 text-xs text-amber-950">
                <div className="flex items-center justify-between">
                  <span className="font-bold">وضعیت پروتکل Break-Glass:</span>
                  <button
                    type="button"
                    onClick={() => setBreakGlassEnabled(!breakGlassEnabled)}
                    className={`px-3 py-1 rounded-full font-bold text-xs transition-colors cursor-pointer ${
                      breakGlassEnabled
                        ? 'bg-rose-600 text-white shadow-2xs'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {breakGlassEnabled ? 'فعال (حالت اضطراری)' : 'غیرفعال (استاندارد)'}
                  </button>
                </div>

                {breakGlassEnabled && (
                  <div className="space-y-2 pt-2 border-t border-amber-200">
                    <label className="block text-[11px] font-semibold text-amber-900">
                      کد مجوز دسترسی بحرانی (Security Break-Glass Token):
                    </label>
                    <input
                      type="password"
                      placeholder="BG-SEC-******"
                      value={breakGlassCode}
                      onChange={(e) => setBreakGlassCode(e.target.value)}
                      className="w-full bg-white border border-amber-300 rounded-xl p-2 font-mono text-xs focus:outline-none"
                    />
                    <span className="text-[10px] text-rose-700 block font-semibold">
                      * تمامی اقدامات انجام‌شده در حالت Break-Glass با برچسب بحرانی و فوریت درجه ۱ در دفترکل حسابرسی ذخیره می‌شوند.
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-800 block">گواهی‌های امنیتی فعال در این سامانه:</span>
                <ul className="space-y-1 text-slate-600 text-[11px] list-disc list-inside">
                  <li>رمزنگاری نامتقارن کلیدهای دسترسی (BR-012)</li>
                  <li>تفکیک وظایف قطعی طراح و تصویب‌کننده (Maker ≠ Checker)</li>
                  <li>گاردریل سخت حداقل حاشیه سود ۱۵٪ (Hard Minimum Margin Guardrail)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: دفترکل حسابرسی و لاگ‌های حاکمیتی (Audit Trail) */}
      {activeTab === 'audit_trail' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-5">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-bold text-slate-900 text-sm font-display flex items-center gap-2">
                  <History className="w-4 h-4 text-amber-600" />
                  دفترکل تغییرات و لاگ‌های حسابرسی حاکمیتی (Immutable Audit Trail)
                </h2>
                <p className="text-slate-400 text-xs mt-0.5">
                  ثبت لحظه‌ای تمامی وقایع تغییر تعرفه، تایید بسته‌ها، اصلاح قوانین و بازگشت‌های اضطراری
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="جستجو در وقایع و مجریان..."
                    value={auditSearchQuery}
                    onChange={(e) => setAuditSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 pr-8 pl-3 text-slate-800 text-xs focus:bg-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <select
                  value={auditTypeFilter}
                  onChange={(e) => setAuditTypeFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
                >
                  <option value="all">همه رویدادها</option>
                  <option value="approval">تصویب و تایید</option>
                  <option value="policy">تغییر سیاست</option>
                  <option value="package">بسته‌های استراتژی</option>
                  <option value="rollback">بازگشت اضطراری</option>
                </select>
              </div>
            </div>

            {/* Audit Logs Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <table className="w-full text-right border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
                    <th className="p-3.5">نوع رویداد</th>
                    <th className="p-3.5">موضوع / پکیج هدف</th>
                    <th className="p-3.5">اقدام‌کننده</th>
                    <th className="p-3.5">نقش سیستمی</th>
                    <th className="p-3.5">وضعیت MFA</th>
                    <th className="p-3.5">زمان ثبت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {filteredAuditLogs.length > 0 ? (
                    filteredAuditLogs.map((log, index) => (
                      <tr key={log.eventId || index} className="hover:bg-slate-50/80">
                        <td className="p-3.5">
                          <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] font-bold">
                            {log.eventType}
                          </span>
                        </td>
                        <td className="p-3.5 font-sans font-semibold text-slate-900">{log.objectRef}</td>
                        <td className="p-3.5 font-sans text-slate-700">{log.actorName}</td>
                        <td className="p-3.5 font-sans text-slate-500">{log.actorRole || '—'}</td>
                        <td className="p-3.5">
                          {log.mfaVerified ? (
                            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 w-fit">
                              <Check className="w-3 h-3 text-emerald-600" />
                              MFA تأییدشده
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[10px]">استاندارد</span>
                          )}
                        </td>
                        <td className="p-3.5 text-slate-400 text-[11px] font-sans">
                          {new Date(log.timestamp).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })} - {new Date(log.timestamp).toLocaleDateString('fa-IR')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 font-sans">
                        هیچ رویدادی منطبق با جستجو یافت نشد.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ایجاد بسته استراتژی جدید (New Strategy Package Modal) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-bold text-slate-900 text-sm font-display flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-600" />
                تعریف بسته استراتژی تعرفه جدید (Strategy Package)
              </h2>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePackage} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1 text-xs">عنوان پکیج (فارسی):</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: بسته تعرفه پاییزه ناوگان سنگین و یخچال‌دار"
                  value={newPkgTitle}
                  onChange={(e) => setNewPkgTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 text-xs">خلاصه تغییرات و اهداف تجاری:</label>
                <textarea
                  rows={3}
                  placeholder="توضیح دهید چه پارامترهایی در ماتریس یا سیاست تغییر یافته‌اند..."
                  value={newPkgSummary}
                  onChange={(e) => setNewPkgSummary(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 text-xs">سطح ریسک مالی (Risk Class):</label>
                  <select
                    value={newPkgRisk}
                    onChange={(e) => setNewPkgRisk(e.target.value as RiskClass)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-800 focus:outline-none"
                  >
                    <option value="low">کم (Low Risk)</option>
                    <option value="medium">متوسط (Medium Risk)</option>
                    <option value="high">بالا (High Risk)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1 text-xs">مولف ایجادکننده:</label>
                  <input
                    type="text"
                    disabled
                    value={userName}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2 text-xs text-slate-600 font-semibold"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold text-xs shadow-2xs cursor-pointer"
                >
                  ایجاد بسته و ثبت در پیش‌نویس‌ها
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: مشاهده جزئیات بسته (Inspect Package Modal) */}
      {inspectingPackage && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-amber-950 bg-amber-100 px-2.5 py-0.5 rounded-lg border border-amber-300 text-xs">
                  {inspectingPackage.displayId}@v{inspectingPackage.version}
                </span>
                <h2 className="font-bold text-slate-900 text-sm font-display">{inspectingPackage.titleFa}</h2>
              </div>
              <button
                type="button"
                onClick={() => setInspectingPackage(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                {inspectingPackage.changeSummaryFa}
              </p>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-xs">
                <div>
                  <span className="text-slate-400 font-sans block text-[10px]">وضعیت چرخه حیات:</span>
                  <span className="font-bold text-slate-900">{inspectingPackage.status}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans block text-[10px]">محیط جاری:</span>
                  <span className="font-bold text-slate-900">{inspectingPackage.environment}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans block text-[10px]">مولف بسته:</span>
                  <span className="font-bold text-slate-900">{inspectingPackage.authorName}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans block text-[10px]">تصویب‌کننده (Approver):</span>
                  <span className="font-bold text-slate-900">{inspectingPackage.approverName || 'هنوز تصویب نشده'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 font-sans block text-[10px]">هش کانتینر بسته (SHA-256):</span>
                  <span className="font-mono text-slate-700 break-all text-[11px]">{inspectingPackage.snapshotHash}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setInspectingPackage(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs cursor-pointer"
              >
                بستن پنجره
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
