import React, { useState } from 'react';
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
} from 'lucide-react';
import { usePricing } from '../../../store/PricingContext';
import { ApprovalRequest } from '../../../types/pricing';

export const MakerCheckerWorkflowView: React.FC = () => {
  const { approvalQueue, approveRequest, rejectRequest, triggerStepUpMFA, userRole } = usePricing();
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(
    approvalQueue?.[0] || null
  );
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const handleApproveWithMFA = (requestId: string) => {
    // Trigger Step-up MFA security requirement before approval
    triggerStepUpMFA(
      `تایید و انتشار بسته تعرفه سازمانی (${requestId}) - عملیات نیازمند تایید دوعاملی مدیر ارشد است`,
      () => {
        approveRequest(requestId, 'تایید شد با احراز هویت دوعاملی (MFA OTP). کلیه پارامترهای گاردریل و حاشیه سود احراز گردید.');
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 font-title">
                  ۴.۱ کارتابل تایید دوطرفه و مقایسه نسخه‌ها (Maker-Checker & Diff Viewer)
                </h1>
                <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {(approvalQueue || []).filter((q) => q && q.status === 'pending_approval').length} درخواست در صف تایید
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                تفکیک اختیارات استراتژیست و مدیر حاکمیت/مالی، ممیزی تغییرات تعرفه با Diff Viewer و احراز هویت دوعاملی (MFA)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Workflow Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Approval Requests Queue (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono px-2">
              صف بررسی درخواست‌های انتشار تعرفه
            </h2>

            <div className="space-y-2">
              {(approvalQueue || []).map((req) => {
                const isSelected = selectedRequest?.id === req.id;
                return (
                  <div
                    key={req.id}
                    onClick={() => setSelectedRequest(req)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100/70 px-1.5 py-0.5 rounded">
                          {req.displayId}
                        </span>
                        <h3 className="text-xs font-bold text-slate-900 mt-1.5 leading-snug">
                          {req.titleFa}
                        </h3>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          req.status === 'pending_approval'
                            ? 'bg-amber-100 text-amber-800'
                            : req.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {req.status === 'pending_approval'
                          ? 'در انتظار تایید'
                          : req.status === 'approved'
                          ? 'تایید شده'
                          : 'رد شده'}
                      </span>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>سازنده (Maker): {req.makerName}</span>
                      <span className="font-mono text-slate-400">{req?.createdAt ? req.createdAt.split('T')?.[0] : '-'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Diff Viewer & Approval Action (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {selectedRequest ? (
            <>
              {/* Request Metadata Header Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                        {selectedRequest.displayId}
                      </span>
                      <h2 className="text-base font-bold text-slate-900 font-title">
                        {selectedRequest.titleFa}
                      </h2>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {selectedRequest.descriptionFa}
                    </p>
                  </div>

                  {selectedRequest.status === 'pending_approval' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowRejectModal(true)}
                        className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        عدم تایید / رد
                      </button>
                      <button
                        onClick={() => handleApproveWithMFA(selectedRequest.id)}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        تایید با کد امنیتی (MFA)
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      این بسته در تاریخ {selectedRequest?.approvedAt ? selectedRequest.approvedAt.split('T')?.[0] : '-'} توسط {selectedRequest.checkerName} تایید شده است.
                    </span>
                  )}
                </div>

                {/* Maker / Checker Audit Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">طراح و پیشنهاددهنده (Maker):</span>
                    <span className="font-bold text-slate-800 block mt-0.5">{selectedRequest.makerName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{selectedRequest.makerRole}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">بسته پیشنهادی:</span>
                    <span className="font-bold text-slate-800 font-mono block mt-0.5">{selectedRequest.packageVersion}</span>
                    <span className="text-[10px] text-emerald-700 font-bold">سازگار با قوانین گاردریل</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">سطح ریسک امنیتی:</span>
                    <span className="font-bold text-amber-800 block mt-0.5">MFA Step-Up الزامی</span>
                    <span className="text-[10px] text-slate-400">تایید دوطرفه مدیر حاکمیت</span>
                  </div>
                </div>
              </div>

              {/* Graphic & Textual Diff Viewer */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <GitCompare className="w-5 h-5 text-amber-600" />
                    <h3 className="text-sm font-bold text-slate-900 font-title">
                      مقایسه تفصیلی تغییرات با نسخه جاری (Visual Diff Viewer)
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {selectedRequest.diffSummary.length} پارامتر تغییر یافته
                  </span>
                </div>

                <div className="space-y-3">
                  {selectedRequest.diffSummary.map((diff, dIdx) => (
                    <div
                      key={dIdx}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{diff.fieldNameFa}</span>
                        <span className="text-[11px] text-slate-500 font-mono">{diff.fieldPath}</span>
                      </div>

                      <div className="flex items-center gap-3 text-xs font-mono">
                        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-3 py-1.5 rounded-xl">
                          <span className="text-[9px] text-rose-500 block font-sans">مقدار فعلی (Old):</span>
                          <span className="font-bold">{diff.oldValue}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl">
                          <span className="text-[9px] text-emerald-600 block font-sans">مقدار جدید (New):</span>
                          <span className="font-bold">{diff.newValue}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-400 text-xs">
              یک درخواست را از ستون سمت راست انتخاب کنید.
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-xl space-y-4">
            <h3 className="font-bold text-slate-900 font-title">علت عدم تایید یا درخواست بازنگری</h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="دلایل کارشناسی، مغایرت با سقف تخفیفات یا نیاز به تعدیل نرخ..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:bg-white focus:border-rose-500 h-28"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                انصراف
              </button>
              <button
                onClick={() => {
                  rejectRequest(selectedRequest.id, rejectionReason || 'درخواست جهت بازنگری عودت داده شد.');
                  setShowRejectModal(false);
                }}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                ثبت رد درخواست
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
