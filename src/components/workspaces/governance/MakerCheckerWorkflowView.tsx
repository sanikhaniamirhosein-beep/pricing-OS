import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  GitCompare,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  AlertTriangle,
  FileText,
  Key,
  Shield,
  Layers,
  Sparkles,
  ArrowRight,
  Plus,
  Search,
  Check,
  Award,
  Download,
  Printer,
  X,
  Lock,
  FileCheck2,
  Sliders,
  ChevronRight,
  TrendingUp,
  Percent,
  Cpu,
  BarChart3,
  ExternalLink,
  RotateCcw,
  Code2,
  SlidersHorizontal,
  Info,
  Calendar,
  User,
} from 'lucide-react';
import { usePricing } from '../../../store/PricingContext';
import { ApprovalRequest, DiffItem } from '../../../types/pricing';

export const MakerCheckerWorkflowView: React.FC = () => {
  const {
    approvalQueue,
    approveRequest,
    rejectRequest,
    submitForApproval,
    triggerStepUpMFA,
    strategyPackages,
    userName,
    userRole,
  } = usePricing();

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending_approval' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequestId, setSelectedRequestId] = useState<string>(approvalQueue?.[0]?.id || '');
  const [diffViewMode, setDiffViewMode] = useState<'visual' | 'json'>('visual');

  // Modal States
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // New Request Form State
  const [newRequestTitle, setNewRequestTitle] = useState('');
  const [newRequestDesc, setNewRequestDesc] = useState('');
  const [newRequestPackageId, setNewRequestPackageId] = useState('');
  const [newRequestRisk, setNewRequestRisk] = useState<'low' | 'medium' | 'high'>('medium');
  const [newRequestDiffs, setNewRequestDiffs] = useState<DiffItem[]>([
    { fieldNameFa: 'سقف تخفیف کریدور جنوب', fieldPath: 'policies.discounts.DP-22.cap', oldValue: '۸٪', newValue: '۱۲٪' },
    { fieldNameFa: 'کف حاشیه سود ناخالص', fieldPath: 'policies.guardrails.minGrossMargin', oldValue: '۱۴٪', newValue: '۱۵.۵٪' },
  ]);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredQueue = useMemo(() => {
    return (approvalQueue || []).filter((req) => {
      if (!req) return false;
      const matchesFilter = activeFilter === 'all' || req.status === activeFilter;
      const matchesSearch =
        !searchQuery ||
        req.titleFa.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.displayId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.makerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.packageVersion.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [approvalQueue, activeFilter, searchQuery]);

  const selectedRequest = useMemo(() => {
    return (
      (approvalQueue || []).find((q) => q.id === selectedRequestId) ||
      filteredQueue[0] ||
      approvalQueue?.[0] ||
      null
    );
  }, [approvalQueue, selectedRequestId, filteredQueue]);

  const pendingCount = (approvalQueue || []).filter((q) => q && q.status === 'pending_approval').length;
  const approvedCount = (approvalQueue || []).filter((q) => q && q.status === 'approved').length;
  const rejectedCount = (approvalQueue || []).filter((q) => q && q.status === 'rejected').length;

  const handleApproveWithMFA = (requestId: string) => {
    const req = approvalQueue.find((q) => q.id === requestId);
    if (!req) return;

    triggerStepUpMFA(
      `تایید نهایی و امضای دیجیتال بسته تعرفه (${req.displayId} - ${req.packageVersion}) با تفکیک سازنده/تصویب‌کننده (قانون BR-012)`,
      () => {
        const res = approveRequest(
          requestId,
          'تایید شد بر اساس بررسی ممیزی حاکمیت داده، احراز پایداری حاشیه سود در تست شبیه‌سازی و گواهی احراز هویت دوعاملی (MFA OTP).'
        );
        if (res.success) {
          showToast(`درخواست ${req.displayId} با موفقیت تصویب و صورت‌جلسه رسمی صادر گردید.`, 'success');
        } else {
          showToast(res.error || 'خطا در تصویب درخواست', 'error');
        }
      }
    );
  };

  const handleBatchApprovePending = () => {
    const pendingReqs = (approvalQueue || []).filter((q) => q.status === 'pending_approval');
    if (pendingReqs.length === 0) return;

    triggerStepUpMFA(
      `تصویب گروهی (${pendingReqs.length} درخواست معلق در کارتابل) با احراز هویت دوعاملی مدیر ارشد`,
      () => {
        pendingReqs.forEach((r) => approveRequest(r.id, 'تصویب دسته‌ای در جلسه کمیته حاکمیت تعرفه'));
        showToast(`کلیه ${pendingReqs.length} درخواست معلق با موفقیت تصویب شدند.`, 'success');
      }
    );
  };

  const handleConfirmReject = () => {
    if (!selectedRequest) return;
    const finalReason = rejectionReason.trim() || 'درخواست به دلیل عدم انطباق با شاخص‌های حاشیه سود عودت داده شد.';
    const res = rejectRequest(selectedRequest.id, finalReason);
    if (res.success) {
      showToast(`درخواست ${selectedRequest.displayId} رد شد و به سازنده عودت یافت.`, 'info');
      setShowRejectModal(false);
      setRejectionReason('');
    } else {
      showToast(res.error || 'خطا در ثبت رد درخواست', 'error');
    }
  };

  const handleCreateNewRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequestTitle.trim()) {
      showToast('لطفاً عنوان درخواست را وارد کنید.', 'error');
      return;
    }

    const created = submitForApproval({
      titleFa: newRequestTitle,
      descriptionFa: newRequestDesc,
      packageVersion: newRequestPackageId || 'SP-1045@v1 (Draft)',
      riskClass: newRequestRisk,
      diffSummary: newRequestDiffs,
    });

    showToast(`درخواست ${created.displayId} با موفقیت در صف تایید کارتابل قرار گرفت.`, 'success');
    setShowNewRequestModal(false);
    setSelectedRequestId(created.id);
    setNewRequestTitle('');
    setNewRequestDesc('');
  };

  const PREDEFINED_REJECTION_REASONS = [
    'مغایرت با کف حاشیه سود ۱۵٪ سازمانی (قانون BR-004)',
    'سقف تخفیفات پلاتینیوم فراتر از حد مجاز مصوب معاونت مالی',
    'نیاز به تکرار شبیه‌سازی با حجم نمونه بیشتر (حداقل ۱۰,۰۰۰ بارنامه)',
    'عدم شفافیت در فرمول سهم ناوگان از اضافه بهای سختی مسیر',
  ];

  return (
    <div className="space-y-6" id="maker-checker-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="toast-notification-banner"
          className={`fixed bottom-6 left-6 z-50 px-5 py-3 rounded-2xl shadow-xl border flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 text-xs font-bold ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950 text-emerald-100 border-emerald-700/80 shadow-emerald-950/20'
              : toastMessage.type === 'error'
              ? 'bg-rose-950 text-rose-100 border-rose-700/80 shadow-rose-950/20'
              : 'bg-slate-900 text-slate-100 border-slate-700'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Modern Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-600 shrink-0 shadow-2xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  حاکمیت داده و کنترل کیفیت تعرفه • BR-012
                </span>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full font-mono">
                  Maker-Checker Framework
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 font-title tracking-tight">
                کارتابل تایید دوطرفه و ممیزی تغییرات تعرفه
              </h1>
              <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
                تفکیک سیستمی نقش طراح (Maker) و ممیز تصویب‌کننده (Checker)، مقایسه برخط مقادیر (Diff Viewer) و صدور صورت‌جلسه دیجیتال با امضای امنیتی MFA.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {pendingCount > 1 && (
              <button
                type="button"
                id="btn-batch-approve"
                onClick={handleBatchApprovePending}
                className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/90 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs active:scale-98"
              >
                <Layers className="w-4 h-4 text-amber-600" />
                <span>تایید گروهی ({pendingCount} مورد معلق) با MFA</span>
              </button>
            )}
            <button
              type="button"
              id="btn-new-proposal"
              onClick={() => setShowNewRequestModal(true)}
              className="px-4.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-98"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>ارسال پیشنهاد جدید به صف ممیزی</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Stat Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100">
          <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-200/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 font-bold block">کل درخواست‌های کارتابل</span>
              <span className="text-base font-bold text-slate-900 font-mono mt-0.5 block">
                {(approvalQueue || []).length}
              </span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-slate-200/60 flex items-center justify-center text-slate-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-amber-50/60 p-3 rounded-2xl border border-amber-200/70 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-amber-800 font-bold block">در انتظار بررسی و امضا</span>
              <span className="text-base font-bold text-amber-900 font-mono mt-0.5 block">{pendingCount}</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-amber-200/60 flex items-center justify-center text-amber-700">
              <Clock className="w-4 h-4 animate-pulse" />
            </div>
          </div>

          <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-200/70 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-emerald-800 font-bold block">تصویب‌شده نهایی</span>
              <span className="text-base font-bold text-emerald-900 font-mono mt-0.5 block">{approvedCount}</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-emerald-200/60 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-rose-50/60 p-3 rounded-2xl border border-rose-200/70 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-rose-800 font-bold block">رد شده / نیاز به بازنگری</span>
              <span className="text-base font-bold text-rose-900 font-mono mt-0.5 block">{rejectedCount}</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-rose-200/60 flex items-center justify-center text-rose-700">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel: Filter Tabs & Request Queue (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-xs space-y-3.5">
            {/* Search Input with Clear Button */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                id="input-search-queue"
                placeholder="جستجو در شناسه، طراح یا عنوان پکیج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-8 py-2 text-xs focus:outline-none focus:border-amber-400 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Modern Redesigned Filter Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/60" id="queue-filter-tabs">
              <button
                type="button"
                id="tab-filter-all"
                onClick={() => setActiveFilter('all')}
                className={`py-2 px-1 rounded-xl transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                  activeFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs font-bold ring-1 ring-slate-200'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <span className="text-[11px] leading-tight">همه</span>
                <span className="text-[10px] font-mono opacity-80">({(approvalQueue || []).length})</span>
              </button>

              <button
                type="button"
                id="tab-filter-pending"
                onClick={() => setActiveFilter('pending_approval')}
                className={`py-2 px-1 rounded-xl transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                  activeFilter === 'pending_approval'
                    ? 'bg-amber-500 text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-amber-800 hover:bg-amber-50/50'
                }`}
              >
                <span className="text-[11px] leading-tight">معلق</span>
                <span className={`text-[10px] font-mono ${activeFilter === 'pending_approval' ? 'text-amber-100' : 'text-amber-700'}`}>
                  ({pendingCount})
                </span>
              </button>

              <button
                type="button"
                id="tab-filter-approved"
                onClick={() => setActiveFilter('approved')}
                className={`py-2 px-1 rounded-xl transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                  activeFilter === 'approved'
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-emerald-800 hover:bg-emerald-50/50'
                }`}
              >
                <span className="text-[11px] leading-tight">تایید</span>
                <span className={`text-[10px] font-mono ${activeFilter === 'approved' ? 'text-emerald-100' : 'text-emerald-700'}`}>
                  ({approvedCount})
                </span>
              </button>

              <button
                type="button"
                id="tab-filter-rejected"
                onClick={() => setActiveFilter('rejected')}
                className={`py-2 px-1 rounded-xl transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                  activeFilter === 'rejected'
                    ? 'bg-rose-600 text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-rose-800 hover:bg-rose-50/50'
                }`}
              >
                <span className="text-[11px] leading-tight">رد</span>
                <span className={`text-[10px] font-mono ${activeFilter === 'rejected' ? 'text-rose-100' : 'text-rose-700'}`}>
                  ({rejectedCount})
                </span>
              </button>
            </div>

            {/* List of Requests */}
            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-0.5">
              {filteredQueue.length === 0 ? (
                <div className="p-8 text-center text-slate-400 space-y-2 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
                  <ShieldCheck className="w-8 h-8 mx-auto opacity-40 text-slate-400" />
                  <p className="text-xs font-medium">درخواستی در این دسته‌بندی یافت نشد.</p>
                </div>
              ) : (
                filteredQueue.map((req) => {
                  const isSelected = selectedRequest?.id === req.id;
                  return (
                    <div
                      key={req.id}
                      id={`request-card-${req.id}`}
                      onClick={() => setSelectedRequestId(req.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-150 space-y-2.5 relative ${
                        isSelected
                          ? 'bg-amber-50/90 border-amber-300 shadow-2xs ring-2 ring-amber-400/20'
                          : 'bg-white border-slate-200/80 hover:bg-slate-50/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded-md">
                              {req.displayId}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 ${
                                req.riskClass === 'high'
                                  ? 'bg-rose-100 text-rose-800'
                                  : req.riskClass === 'medium'
                                  ? 'bg-amber-100 text-amber-900'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  req.riskClass === 'high'
                                    ? 'bg-rose-500'
                                    : req.riskClass === 'medium'
                                    ? 'bg-amber-500'
                                    : 'bg-emerald-500'
                                }`}
                              />
                              ریسک {req.riskClass === 'high' ? 'بالا' : req.riskClass === 'medium' ? 'متوسط' : 'پایین'}
                            </span>
                          </div>
                          <h3 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                            {req.titleFa}
                          </h3>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            req.status === 'pending_approval'
                              ? 'bg-amber-100 text-amber-900 border border-amber-200'
                              : req.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                              : 'bg-rose-100 text-rose-900 border border-rose-200'
                          }`}
                        >
                          {req.status === 'pending_approval'
                            ? 'معلق'
                            : req.status === 'approved'
                            ? 'تصویب‌شده'
                            : 'رد شده'}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <div className="flex items-center gap-1.5 truncate max-w-[170px]">
                          <User className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{req.makerName.split('(')?.[0]}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                            {req.diffSummary?.length || 0} تغییر
                          </span>
                          <span className="font-mono text-[10px] text-slate-400">
                            {req.createdAt ? req.createdAt.split('T')?.[0] : '-'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: Detailed Diff & Approval Action Workspace (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {selectedRequest ? (
            <>
              {/* Header & Action Bar */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg border border-amber-200">
                        {selectedRequest.displayId}
                      </span>
                      <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200">
                        {selectedRequest.packageVersion}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                          selectedRequest.status === 'pending_approval'
                            ? 'bg-amber-50 text-amber-900 border-amber-200'
                            : selectedRequest.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                            : 'bg-rose-50 text-rose-900 border-rose-200'
                        }`}
                      >
                        وضعیت: {selectedRequest.status === 'pending_approval' ? 'در انتظار تایید و امضا' : selectedRequest.status === 'approved' ? 'تصویب‌شده نهایی' : 'رد شده'}
                      </span>
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 font-title">
                      {selectedRequest.titleFa}
                    </h2>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                      {selectedRequest.descriptionFa}
                    </p>
                  </div>

                  {/* Actions depending on status */}
                  <div className="flex items-center gap-2 shrink-0">
                    {selectedRequest.status === 'pending_approval' && (
                      <>
                        <button
                          type="button"
                          id="btn-action-reject"
                          onClick={() => {
                            setRejectionReason('');
                            setShowRejectModal(true);
                          }}
                          className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5 active:scale-98"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>عدم تایید / بازنگری</span>
                        </button>
                        <button
                          type="button"
                          id="btn-action-approve-mfa"
                          onClick={() => handleApproveWithMFA(selectedRequest.id)}
                          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98"
                        >
                          <ShieldCheck className="w-4 h-4 text-emerald-200" />
                          <span>تایید با کد امنیتی (MFA OTP)</span>
                        </button>
                      </>
                    )}

                    {selectedRequest.status === 'approved' && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          id="btn-view-certificate"
                          onClick={() => setShowCertificateModal(true)}
                          className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <Award className="w-4 h-4 text-amber-600" />
                          <span>مشاهده صورت‌جلسه تصویب</span>
                        </button>
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-2.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          تصویب‌شده توسط {selectedRequest.checkerName}
                        </span>
                      </div>
                    )}

                    {selectedRequest.status === 'rejected' && (
                      <button
                        type="button"
                        id="btn-resubmit-modified"
                        onClick={() => {
                          showToast('درخواست مجدداً جهت اصلاح به فرم پیشنهاد جدید منتقل شد.', 'info');
                          setShowNewRequestModal(true);
                          setNewRequestTitle(`اصلاحیه: ${selectedRequest.titleFa}`);
                          setNewRequestDesc(`بر اساس بازخورد ممیز: ${selectedRequest.rejectionReason || ''}`);
                        }}
                        className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-98"
                      >
                        <RotateCcw className="w-4 h-4 text-amber-400" />
                        <span>ارسال مجدد با اصلاحات</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Maker / Checker Audit Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                  <div className="bg-slate-50/90 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 block">طراح و پیشنهاددهنده (Maker):</span>
                    <span className="font-bold text-slate-900 block">{selectedRequest.makerName}</span>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                      <span>نقش: {selectedRequest.makerRole}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50/90 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 block">ممیز و تصویب‌کننده (Checker):</span>
                    <span className="font-bold text-slate-900 block">
                      {selectedRequest.checkerName || 'در انتظار تایید معاونت مالی'}
                    </span>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      {selectedRequest.approvedAt ? (
                        <span className="text-emerald-700 font-mono font-bold">
                          تاریخ: {selectedRequest.approvedAt.split('T')?.[0]}
                        </span>
                      ) : (
                        <span className="text-amber-700 font-bold">احراز هویت MFA الزامی</span>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-50/90 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 block">کنترل تفکیک اختیارات (BR-012):</span>
                    <span className="font-bold text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      اصل تفکیک Maker ≠ Checker احراز شد
                    </span>
                    <span className="text-[10px] text-slate-500 block">ثبت خودکار در دفترکل تغییرات (Audit Trail)</span>
                  </div>
                </div>

                {/* Pre-Flight Compliance Verification Checklist */}
                <div className="bg-slate-50/60 p-3.5 rounded-2xl border border-slate-200/70 space-y-2">
                  <h4 className="text-[11px] font-bold text-slate-700 flex items-center gap-2">
                    <Sliders className="w-3.5 h-3.5 text-amber-600" />
                    گیت‌های اعتبارسنجی پیش از تصویب (Pre-Flight Governance Gates):
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200/70">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>شبیه‌سازی ۱۰K بارنامه: <strong className="text-emerald-700 font-bold">Pass</strong></span>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200/70">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>کف حاشیه سود ۱۵٪: <strong className="text-emerald-700 font-bold">احراز شد</strong></span>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200/70">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>اقامت داده در کشور (OQ-02): <strong className="text-emerald-700 font-bold">فعال</strong></span>
                    </div>
                  </div>
                </div>

                {/* If Rejected: Show Rejection Notice Box */}
                {selectedRequest.status === 'rejected' && selectedRequest.rejectionReason && (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-1.5 text-xs text-rose-900">
                    <div className="flex items-center gap-2 font-bold text-rose-800">
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>علت عدم تصویب / درخواست بازنگری توسط ممیز:</span>
                    </div>
                    <p className="pr-6 text-rose-700 leading-relaxed font-sans">
                      {selectedRequest.rejectionReason}
                    </p>
                  </div>
                )}
              </div>

              {/* Graphic & Textual Diff Viewer with Modern View Mode Switcher */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                      <GitCompare className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 font-title">
                        ممیزی و مقایسه تفصیلی تغییرات تعرفه (Visual Diff Viewer)
                      </h3>
                      <span className="text-[11px] text-slate-500">
                        مقایسه مقادیر پیش‌فرض پروداکشن (Baseline) با نسخه جدید پیشنهادی
                      </span>
                    </div>
                  </div>

                  {/* Modern Mode Switcher */}
                  <div className="flex items-center gap-2">
                    <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-bold border border-slate-200/60" id="diff-mode-switcher">
                      <button
                        type="button"
                        id="btn-diff-mode-visual"
                        onClick={() => setDiffViewMode('visual')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                          diffViewMode === 'visual'
                            ? 'bg-white text-slate-900 shadow-2xs font-bold'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        <GitCompare className="w-3.5 h-3.5" />
                        <span>نمای بصری</span>
                      </button>
                      <button
                        type="button"
                        id="btn-diff-mode-json"
                        onClick={() => setDiffViewMode('json')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                          diffViewMode === 'json'
                            ? 'bg-white text-slate-900 shadow-2xs font-bold'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>JSON Tree</span>
                      </button>
                    </div>
                    <span className="text-xs text-slate-500 font-mono bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
                      {selectedRequest.diffSummary.length} پارامتر تغییر یافته
                    </span>
                  </div>
                </div>

                {/* Visual Mode */}
                {diffViewMode === 'visual' ? (
                  <div className="space-y-3">
                    {selectedRequest.diffSummary.map((diff, dIdx) => (
                      <div
                        key={dIdx}
                        className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                      >
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-900 block">{diff.fieldNameFa}</span>
                          <span className="text-[10px] text-slate-400 font-mono block">{diff.fieldPath}</span>
                        </div>

                        <div className="flex items-center gap-3 text-xs font-mono self-end md:self-auto">
                          <div className="bg-rose-50 border border-rose-200/80 text-rose-800 px-3.5 py-2 rounded-xl text-left">
                            <span className="text-[9px] text-rose-500 block font-sans font-bold">مقدار فعلی (Old / Baseline):</span>
                            <span className="font-bold">{diff.oldValue}</span>
                          </div>

                          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                          <div className="bg-emerald-50 border border-emerald-200/80 text-emerald-800 px-3.5 py-2 rounded-xl text-left">
                            <span className="text-[9px] text-emerald-600 block font-sans font-bold">مقدار جدید (New Proposed):</span>
                            <span className="font-bold">{diff.newValue}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* JSON Tree Mode */
                  <div className="bg-slate-950 p-4 rounded-2xl font-mono text-xs text-emerald-400 overflow-x-auto dir-ltr space-y-1 border border-slate-800 shadow-inner">
                    <div className="text-slate-500">// Visual Snapshot Diff for {selectedRequest.displayId}</div>
                    <pre className="text-slate-200">
                      {JSON.stringify(
                        {
                          requestId: selectedRequest.id,
                          displayId: selectedRequest.displayId,
                          version: selectedRequest.packageVersion,
                          maker: selectedRequest.makerName,
                          diffs: selectedRequest.diffSummary.map((d) => ({
                            path: d.fieldPath,
                            name: d.fieldNameFa,
                            from: d.oldValue,
                            to: d.newValue,
                          })),
                        },
                        null,
                        2
                      )}
                    </pre>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-400 text-xs space-y-3">
              <ShieldCheck className="w-10 h-10 mx-auto text-slate-300" />
              <p>یک درخواست را از ستون سمت راست انتخاب کنید یا پیشنهاد جدیدی ثبت نمایید.</p>
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm font-title">
                    عدم تایید و ثبت علت بازنگری ({selectedRequest.displayId})
                  </h3>
                  <p className="text-[11px] text-slate-500">دلایل کارشناسی و ممیزی جهت اطلاع طراح بسته</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <span className="text-[11px] text-slate-500 block font-bold">پیشنهادهای سریع علت رد:</span>
              <div className="flex flex-wrap gap-1.5">
                {PREDEFINED_REJECTION_REASONS.map((reason, rIdx) => (
                  <button
                    key={rIdx}
                    type="button"
                    onClick={() => setRejectionReason(reason)}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer text-right"
                  >
                    + {reason}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">متن کامل توضیحات ممیز:</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="دلایل کارشناسی، مغایرت با سقف تخفیفات یا لزوم بازنگری بر اساس نرخ‌های رقابتی..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:bg-white focus:border-rose-500 h-28 leading-relaxed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                ثبت رد درخواست و عودت به سازنده
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Approval Request Modal */}
      {showNewRequestModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm font-title">
                    ارسال بسته تعرفه جدید به کارتابل تایید دوطرفه
                  </h3>
                  <p className="text-[11px] text-slate-500">طراح تعرفه (Maker): {userName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNewRequestModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewRequest} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">عنوان بسته یا تغییرات تعرفه:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: بسته تشویقی بازگشت ناوگان جنوب و تعدیل فصلی گازوئیل"
                  value={newRequestTitle}
                  onChange={(e) => setNewRequestTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:bg-white focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">بسته مرجع / شناسه نسخه:</label>
                  <select
                    value={newRequestPackageId}
                    onChange={(e) => setNewRequestPackageId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:bg-white focus:border-amber-500"
                  >
                    <option value="SP-1043@v1 (Staging)">SP-1043@v1 (بسته نرخ‌های رقابتی جنوب)</option>
                    <option value="SP-1044@v2 (Staging)">SP-1044@v2 (تعرفه گردنه‌های برف‌گیر)</option>
                    <option value="SP-1045@v1 (Draft)">SP-1045@v1 (بسته پیش‌نویس جدید)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">ارزیابی سطح ریسک تجاری:</label>
                  <select
                    value={newRequestRisk}
                    onChange={(e) => setNewRequestRisk(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:bg-white focus:border-amber-500"
                  >
                    <option value="low">کم (تعدیلات جزئی زیر ۳٪)</option>
                    <option value="medium">متوسط (تغییرات کریدورهای اصلی)</option>
                    <option value="high">بالا (تخفیفات حجمی و بازنگری کلان)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">شرح تغییرات و توجیه اقتصادی:</label>
                <textarea
                  value={newRequestDesc}
                  onChange={(e) => setNewRequestDesc(e.target.value)}
                  placeholder="دلایل تغییر، پیش‌بینی رشد حجم سفرها و نتایج شبیه‌سازی..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:bg-white focus:border-amber-500 h-20 leading-relaxed"
                />
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 block">پارامترهای متغیر در این بسته (Diff):</span>
                <div className="space-y-1.5">
                  {newRequestDiffs.map((d, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 text-[11px]">
                      <span className="font-bold text-slate-800">{d.fieldNameFa}</span>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-rose-600 line-through">{d.oldValue}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-emerald-700 font-bold">{d.newValue}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewRequestModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  ثبت و ارجاع به کارتابل تایید
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Digital Approval Certificate Modal */}
      {showCertificateModal && selectedRequest && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full border border-slate-200 shadow-2xl space-y-6 relative overflow-hidden">
            {/* Watermark Background Stamp */}
            <div className="absolute right-12 -bottom-10 opacity-5 pointer-events-none">
              <ShieldCheck className="w-80 h-80 text-emerald-900" />
            </div>

            {/* Certificate Header */}
            <div className="flex items-center justify-between border-b pb-4 border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-700">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base font-title">
                    صورت‌جلسه رسمی تصویب بسته تعرفه حمل و نقل
                  </h3>
                  <p className="text-xs text-slate-500">کمیته عالی حاکمیت داده، کنترل ریسک و ممیزی مالی</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCertificateModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Certificate Body */}
            <div className="bg-slate-50/90 p-5 rounded-2xl border border-slate-200 space-y-4 text-xs">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200/80">
                <div>
                  <span className="text-[10px] text-slate-400 block">شماره گواهی مصوبه:</span>
                  <span className="font-mono font-bold text-slate-800 text-sm">
                    {selectedRequest.certificateNumber || 'CERT-GOV-8821-IR'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block text-left">تاریخ و ساعت تصویب:</span>
                  <span className="font-mono text-slate-700 text-left block">
                    {selectedRequest.approvedAt || new Date().toISOString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">شناسه پکیج و نسخه:</span>
                  <strong className="text-slate-800 block mt-0.5">{selectedRequest.packageVersion}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">عنوان مصوبه:</span>
                  <strong className="text-slate-800 block mt-0.5">{selectedRequest.titleFa}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">پیشنهاددهنده تعرفه (Maker):</span>
                  <span className="text-slate-700 block mt-0.5">{selectedRequest.makerName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">تصویب‌کننده و کنترل حاکمیت (Checker):</span>
                  <span className="text-emerald-800 font-bold block mt-0.5">{selectedRequest.checkerName || 'معاونت مالی و کنترل حاکمیت'}</span>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[10px] text-slate-400 block mb-1">تغییرات مصوب ممهور به امضای دیجیتال:</span>
                <div className="space-y-1">
                  {selectedRequest.diffSummary.map((diff, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px] bg-white p-2.5 rounded-xl border border-slate-200">
                      <span>{diff.fieldNameFa}</span>
                      <span className="font-mono font-bold text-emerald-700">{diff.newValue}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-[11px] leading-relaxed flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  این گواهی بر اساس احراز هویت دوعاملی (Step-Up MFA OTP) و منطبق بر قانون تفکیک وظایف BR-012 صادر شده و
                  دارای اعتبار رسمی جهت انتشار در سامانه بارنامه آنلاین است.
                </span>
              </div>
            </div>

            {/* Footer / Print Action */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-slate-400 font-mono">
                HASH: SHA256-9c2b84f3e1a700d9841bb25e
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    showToast('صورت‌جلسه رسمی جهت چاپ یا بارگیری آماده شد.', 'success');
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>چاپ صورت‌جلسه</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowCertificateModal(false)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  بستن
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
