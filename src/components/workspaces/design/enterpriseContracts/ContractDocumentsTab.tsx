import React, { useState } from 'react';
import {
  FileText,
  FileCheck2,
  Paperclip,
  History,
  Plus,
  Download,
  Eye,
  CheckCircle2,
  FileCode,
  FileSpreadsheet,
  Layers,
  Calendar,
  User,
  ExternalLink,
} from 'lucide-react';
import {
  EnterpriseCorporateContract,
  ContractDocumentAttachment,
  ContractAmendment,
} from '../../../../types/enterpriseContract';

interface Props {
  contract: EnterpriseCorporateContract;
  onAddAmendment?: (amendment: ContractAmendment) => void;
}

export const ContractDocumentsTab: React.FC<Props> = ({ contract, onAddAmendment }) => {
  const { documents } = contract;
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAddAmendmentModalOpen, setIsAddAmendmentModalOpen] = useState(false);
  const [newAmdNumber, setNewAmdNumber] = useState(`الحاقیه شماره ${(documents.amendments.length + 1).toLocaleString('fa-IR')}/۱۴۰۵`);
  const [newAmdTitle, setNewAmdTitle] = useState('');
  const [newAmdSummary, setNewAmdSummary] = useState('');
  const [newAmdFinancial, setNewAmdFinancial] = useState<number>(0);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-600" />;
      case 'xlsx':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
      default:
        return <Paperclip className="w-5 h-5 text-slate-700" />;
    }
  };

  const allAttachments = [
    ...(documents.mainContractFile ? [documents.mainContractFile] : []),
    ...(documents.technicalAttachments || []),
  ];

  const handleSaveAmendment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAmdTitle.trim() || !newAmdSummary.trim()) return;

    const amendment: ContractAmendment = {
      id: `amd-${Date.now()}`,
      amendmentNumber: newAmdNumber,
      title: newAmdTitle,
      approvalDate: '۱۴۰۵/۰۵/۰۱',
      effectiveDate: '۱۴۰۵/۰۵/۰۵',
      summaryFa: newAmdSummary,
      financialImpactToman: newAmdFinancial > 0 ? newAmdFinancial : undefined,
      status: 'approved',
    };

    if (onAddAmendment) {
      onAddAmendment(amendment);
    } else {
      documents.amendments.unshift(amendment);
    }

    setNewAmdTitle('');
    setNewAmdSummary('');
    setNewAmdFinancial(0);
    setIsAddAmendmentModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center justify-between animate-in fade-in">
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-600 hover:text-emerald-800 text-xs px-2"
          >
            بستن
          </button>
        </div>
      )}

      {/* Official Attachments List */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-slate-700" />
            <h4 className="text-xs font-bold text-slate-900">اسناد رسمی، ضمائم و فایل‌های الکترونیکی قرارداد</h4>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {allAttachments.length.toLocaleString('fa-IR')} فایل بارگذاری‌شده
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allAttachments.map((att) => (
            <div
              key={att.id}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                  {getFileIcon(att.fileType)}
                </div>
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 line-clamp-1">{att.title || att.fileName}</div>
                  <div className="text-slate-500 text-[11px] font-mono flex items-center gap-2">
                    <span>{att.fileSizeMb} MB</span>
                    <span>•</span>
                    <span>{att.uploadDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setToastMessage(`دانلود فایل ${att.title || att.fileName} در محیط پیش‌نمایش آغاز شد.`);
                    setTimeout(() => setToastMessage(null), 4000);
                  }}
                  className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="دانلود فایل پیوست"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Amendments & Addendums List */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-700" />
            <h4 className="text-xs font-bold text-slate-900">تاریخچه الحاقیه‌ها و تغییرات رسمی توافق‌نامه</h4>
          </div>

          <button
            type="button"
            onClick={() => setIsAddAmendmentModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ثبت الحاقیه جدید</span>
          </button>
        </div>

        {documents.amendments.length > 0 ? (
          <div className="space-y-3">
            {documents.amendments.map((amd) => (
              <div
                key={amd.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-slate-900 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 text-[11px]">
                      {amd.amendmentNumber}
                    </span>
                    <span className="font-bold text-slate-900">{amd.title}</span>
                  </div>

                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    تصویب و ابلاغ شده
                  </span>
                </div>

                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {amd.summaryFa}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 text-[11px] text-slate-500 font-mono">
                  <span>تاریخ لازم‌الاجرا: {amd.effectiveDate}</span>
                  {amd.financialImpactToman && (
                    <span className="text-emerald-700 font-bold">
                      اثر مالی: +{(amd.financialImpactToman / 1000000).toLocaleString('fa-IR')} م تومان
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-400">
            الحاقیه‌ای برای این قرارداد ثبت نشده است.
          </div>
        )}
      </div>

      {/* Add Amendment Modal */}
      {isAddAmendmentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">ثبت الحاقیه جدید برای قرارداد</h3>
              <button
                type="button"
                onClick={() => setIsAddAmendmentModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                بستن
              </button>
            </div>

            <form onSubmit={handleSaveAmendment} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-700 font-medium block">شماره و کد الحاقیه:</label>
                <input
                  type="text"
                  value={newAmdNumber}
                  onChange={(e) => setNewAmdNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-medium block">عنوان موضوع الحاقیه:</label>
                <input
                  type="text"
                  value={newAmdTitle}
                  onChange={(e) => setNewAmdTitle(e.target.value)}
                  placeholder="مثال: افزایش سقف تعهد تناژ و تمدید دوره زمانی..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-medium block">خلاصه تغییرات توافق‌شده:</label>
                <textarea
                  value={newAmdSummary}
                  onChange={(e) => setNewAmdSummary(e.target.value)}
                  rows={3}
                  placeholder="شرح کامل بندهای اصلاحی قرارداد..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-medium block">اثر ریالی تغییرات (تومان):</label>
                <input
                  type="number"
                  value={newAmdFinancial}
                  onChange={(e) => setNewAmdFinancial(Number(e.target.value))}
                  placeholder="۰"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddAmendmentModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-xs cursor-pointer transition-colors"
                >
                  ذخیره و ثبت الحاقیه
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
