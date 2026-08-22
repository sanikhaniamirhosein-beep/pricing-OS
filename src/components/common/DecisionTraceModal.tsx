import React, { useState } from 'react';
import {
  X,
  FileSearch,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Fuel,
  Sparkles,
  Download,
  Copy,
  Check,
  Truck,
  ArrowRight,
  TrendingUp,
  Clock,
  Layers,
  Scale,
} from 'lucide-react';
import { usePricing } from '../../store/PricingContext';

export const DecisionTraceModal: React.FC = () => {
  const { selectedTrace, setSelectedTrace } = usePricing();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'visual' | 'json'>('visual');

  if (!selectedTrace) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(selectedTrace, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 shadow-xs">
              <FileSearch className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base font-display">ردگیری و تبارشناسی تصمیم (Decision Trace)</h3>
                <span className="text-xs font-mono bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200 font-bold">
                  {selectedTrace.traceId}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                استناد مستقیم به پکیج استراتژی{' '}
                <span className="text-sky-700 font-mono font-bold">
                  {selectedTrace?.strategyPackageRef?.displayId || 'PKG'}@v{selectedTrace?.strategyPackageRef?.version || '1.0'}
                </span>{' '}
                (هش محتوا:{' '}
                <span className="font-mono text-slate-600">
                  {selectedTrace?.strategyPackageRef?.snapshotHash ? selectedTrace.strategyPackageRef.snapshotHash.substring(0, 8) : '0x00000000'}...
                </span>
                )
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setActiveTab('visual')}
                className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer font-medium ${
                  activeTab === 'visual' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                نمای بصری قواعد
              </button>
              <button
                onClick={() => setActiveTab('json')}
                className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer font-medium ${
                  activeTab === 'json' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                سند خام JSON (BR-046)
              </button>
            </div>
            <button
              onClick={() => setSelectedTrace(null)}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {activeTab === 'visual' ? (
            <>
              {/* Top KPI Metrics Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center gap-3.5 shadow-xs">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs">کرایه نهایی تعیین‌شده</span>
                    <span className="text-base font-bold text-emerald-700 font-mono">
                      {(selectedTrace.finalPriceToman / 1000000).toLocaleString('fa-IR')} م تومان
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center gap-3.5 shadow-xs">
                  <div className="p-2.5 rounded-xl bg-sky-50 text-sky-700 border border-sky-200">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs">حاشیه سود محقق‌شده</span>
                    <span className="text-base font-bold text-sky-700 font-mono">
                      {selectedTrace.finalMarginPercent.toLocaleString('fa-IR')}٪
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center gap-3.5 shadow-xs">
                  <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs">بهای تمام‌شده تخمینی</span>
                    <span className="text-sm font-bold text-slate-800 font-mono">
                      {(selectedTrace.costBasisToman / 1000000).toFixed(1)} م تومان
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center gap-3.5 shadow-xs">
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs">زمان پاسخ موتور (Latency)</span>
                    <span className="text-sm font-bold text-indigo-700 font-mono">{selectedTrace.latencyMs} ms</span>
                  </div>
                </div>
              </div>

              {/* Context Snapshot Bar */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-700 font-semibold mb-3 block flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-600" />
                  زمینه و اطلاعات محموله ورودی (Input Context Snapshot):
                </span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-slate-700">
                  <div>
                    <span className="text-slate-500">مسیر تردد: </span>
                    <span className="font-bold text-slate-900">
                      {selectedTrace.contextSnapshot.originCity} ➔ {selectedTrace.contextSnapshot.destinationCity}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">نوع ناوگان: </span>
                    <span className="font-bold text-slate-900">{selectedTrace.contextSnapshot.vehicleType}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">وزن بار: </span>
                    <span className="font-bold font-mono text-slate-900">
                      {selectedTrace.contextSnapshot.cargoWeightTons} تن
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">کانال سفارش: </span>
                    <span className="font-bold text-sky-700">{selectedTrace.contextSnapshot.channel}</span>
                  </div>
                </div>
              </div>

              {/* Explanation Text */}
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl text-indigo-900 leading-relaxed flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-1 text-indigo-950">
                    توضیح محاسباتی تولیدشده از گراف اجرایی (Executable Graph Explanation - BR-041):
                  </span>
                  <p className="text-indigo-900/90">{selectedTrace.explanationFa}</p>
                </div>
              </div>

              {/* Section 1: Applied Rules */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    قواعد و ضرایب تعرفه اعمال‌شده ({(selectedTrace.appliedRules || []).length}):
                  </span>
                </div>
                <div className="space-y-2">
                  {(selectedTrace.appliedRules || []).map((rule, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white border border-slate-200 hover:border-emerald-300 rounded-xl flex items-center justify-between shadow-xs transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">{rule.nameFa}</span>
                          <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            {rule.ref}
                          </span>
                        </div>
                        {rule.note && <span className="text-slate-500 text-xs block">{rule.note}</span>}
                      </div>
                      <span className="font-mono font-bold text-emerald-700 text-sm">
                        +{((rule?.valueToman || 0) / 1000000).toLocaleString('fa-IR')} م تومان
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Applied & Skipped Discounts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Applied Discounts */}
                <div className="space-y-3">
                  <span className="font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-600" />
                    تخفیف‌های تاییدشده ({(selectedTrace.appliedDiscounts || []).length}):
                  </span>
                  {(selectedTrace.appliedDiscounts || []).length > 0 ? (
                    <div className="space-y-2">
                      {(selectedTrace.appliedDiscounts || []).map((disc, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-800 block">{disc.nameFa}</span>
                            <span className="text-xs font-mono text-slate-500">{disc.ref}</span>
                          </div>
                          <span className="font-mono font-bold text-sky-700">
                            -{((disc?.discountToman || 0) / 1000000).toLocaleString('fa-IR')} م
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic p-3 bg-slate-50 rounded-xl border border-slate-100">هیچ تخفیفی برای این زمینه اعمال نشد.</p>
                  )}
                </div>

                {/* Skipped Discounts / Rules with Reasons */}
                <div className="space-y-3">
                  <span className="font-bold text-slate-900 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-slate-400" />
                    تخفیف‌ها و قواعد ردشده با ذکر علت ({((selectedTrace.skippedRules || []).length) + ((selectedTrace.skippedDiscounts || []).length)}):
                  </span>
                  <div className="space-y-2">
                    {[...(selectedTrace.skippedDiscounts || []), ...(selectedTrace.skippedRules || [])].map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between text-slate-800 font-medium">
                          <span>{item.nameFa}</span>
                          <span className="text-xs font-mono text-slate-400">{item.ref}</span>
                        </div>
                        <span className="text-rose-700 block text-xs">علت رد: {item.reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 3: Guardrail & External Hooks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <div>
                      <span className="font-bold text-slate-900 block">کنترل گاردریل کف سود (Margin Floor)</span>
                      <span className="text-slate-500 text-xs">
                        وضعیت: {selectedTrace?.guardrails?.[0]?.status === 'ok' ? 'بدون نقض (Pass)' : selectedTrace?.guardrails?.[0]?.status ? 'کلمپ‌شده (Clamped)' : 'بدون نقض (Pass)'}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-emerald-700 text-xs bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                    کف الزامی ۱۵٪
                  </span>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Fuel className="w-5 h-5 text-amber-600" />
                    <div>
                      <span className="font-bold text-slate-900 block">هوک خارجی شاخص سوخت (Fuel Hook)</span>
                      <span className="text-slate-500 text-xs">
                        ضریب دریافتی: {selectedTrace?.externalDataUsed?.[0]?.value ?? 1.0}x
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-sky-700 text-xs font-bold bg-sky-50 px-2 py-1 rounded-md border border-sky-200">
                    {selectedTrace?.externalDataUsed?.[0]?.latencyMs ?? 12} ms
                  </span>
                </div>
              </div>
            </>
          ) : (
            /* JSON View */
            <div className="relative">
              <div className="absolute top-3 left-3 z-10 flex gap-2">
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="px-3.5 py-2 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 text-slate-800 rounded-xl flex items-center gap-2 font-medium transition-colors cursor-pointer text-xs"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'کپی شد' : 'کپی کل JSON'}
                </button>
              </div>
              <pre className="p-5 bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed dir-ltr max-h-[60vh] rounded-2xl shadow-inner">
                {JSON.stringify(selectedTrace, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            سند تبارشناسی دارای امضای دیجیتال و غیرقابل‌تغییر است (Immutable Financial Audit Trace - BR-037).
          </span>
          <button
            type="button"
            onClick={() => setSelectedTrace(null)}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition-colors cursor-pointer"
          >
            بستن پنجره
          </button>
        </div>
      </div>
    </div>
  );
};
