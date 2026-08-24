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
        return <Paperclip className="w-5 h-5 text-indigo-600" />;
    }
  };

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
      documents.amendments.push(amendment);
    }

    setNewAmdTitle('');
    setNewAmdSummary('');
    setNewAmdFinancial(0);
    setIsAddAmendmentModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Main Signed Contract File Card */}
      {documents.mainContractFile && (
        <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-white border border-indigo-200 text-indigo-700 shadow-2xs">
                <FileCheck2 className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">{documents.mainContractFile.title}</h4>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                    اصالت امضا تایید شده
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-mono mt-1">
                  {documents.mainContractFile.fileName} • {documents.mainContractFile.fileSizeMb} مگابایت • آپلود در {documents.mainContractFile.uploadDate} توسط {documents.mainContractFile.uploadedBy}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => alert('نسخه رسمی و پی‌دی‌اف قرارداد در پنجره مرورگر باز خواهد شد.')}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-2xs cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                مشاهده متن کامل
              </button>
              <button
                type="button"
                onClick={() => alert('فایل با موفقیت دانلود شد.')}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                دانلود
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Technical Attachments Grid */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-indigo-600" />
            <h4 className="text-sm font-bold text-slate-900">ضمائم و پیوست‌های فنی قرارداد</h4>
          </div>
          <span className="text-xs text-slate-500">
            {documents.technicalAttachments.length} پیوست رسمی
          </span>
        </div>

        {documents.technicalAttachments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {documents.technicalAttachments.map((att) => (
              <div
                key={att.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 rounded-lg bg-white border border-slate-200 shrink-0">
                    {getFileIcon(att.fileType)}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-slate-900 truncate">{att.title}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
                      {att.fileName} ({att.fileSizeMb} MB)
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => alert(`دانلود پیوست: ${att.title}`)}
                  className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors shrink-0 mr-2 cursor-pointer"
                  title="دانلود فایل پیوست"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-400">
            پیوست فنی ثبت نشده است.
          </div>
        )}
      </div>

      {/* Amendments (الحاقیه‌ها) */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <h4 className="text-sm font-bold text-slate-900">الحاقیه‌ها و متمم‌های رسمی قرارداد (Amendments)</h4>
          </div>

          <button
            type="button"
            onClick={() => setIsAddAmendmentModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            ثبت الحاقیه جدید
          </button>
        </div>

        {documents.amendments.length > 0 ? (
          <div className="space-y-3">
            {documents.amendments.map((amd) => (
              <div key={amd.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold font-mono">
                      {amd.amendmentNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{amd.title}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>تاریخ تصویب: {amd.approvalDate}</span>
                    <span>لازم‌الاجرا از: {amd.effectiveDate}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
                  {amd.summaryFa}
                </p>

                {amd.financialImpactToman && (
                  <div className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                    <span>تأثیر مالی الحاقیه: </span>
                    <span className="font-mono">
                      +{(amd.financialImpactToman / 1000000000).toLocaleString('fa-IR')} میلیارد تومان
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-400">
            تاکنون الحاقیه‌ای برای این قرارداد صادر نشده است.
          </div>
        )}
      </div>

      {/* Version History Table */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <History className="w-4 h-4 text-indigo-600" />
          <h4 className="text-sm font-bold text-slate-900">تاریخچه نسخه‌ها و ویرایش‌های حقوقی (Version History)</h4>
        </div>

        <div className="divide-y divide-slate-100">
          {documents.versionHistory.map((ver, idx) => (
            <div key={idx} className="py-3 flex items-start gap-4 text-xs">
              <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-mono font-bold border border-indigo-100 shrink-0 mt-0.5">
                نسخه {ver.version}.0
              </span>
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {ver.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    ویرایش توسط: {ver.modifiedBy}
                  </span>
                </div>
                <p className="text-slate-800 leading-relaxed">{ver.changeSummaryFa}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Amendment Modal */}
      {isAddAmendmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                ثبت الحاقیه و متمم رسمی قرارداد
              </h4>
              <button
                onClick={() => setIsAddAmendmentModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAmendment} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">شماره و عنوان الحاقیه:</label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newAmdNumber}
                    onChange={(e) => setNewAmdNumber(e.target.value)}
                    className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 font-mono"
                    placeholder="شماره الحاقیه"
                  />
                  <input
                    type="text"
                    value={newAmdTitle}
                    onChange={(e) => setNewAmdTitle(e.target.value)}
                    className="col-span-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800"
                    placeholder="عنوان (مثلاً افزایش ناوگان کریدور شرق)"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">شرح مفاد و بندهای اصلاحی الحاقیه:</label>
                <textarea
                  value={newAmdSummary}
                  onChange={(e) => setNewAmdSummary(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 h-24"
                  placeholder="توضیح تغییرات، تعداد ناوگان الحاقی یا تغییر نرخ توافقی..."
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">مبلغ یا بار مالی الحاقیه (تومان):</label>
                <input
                  type="number"
                  value={newAmdFinancial || ''}
                  onChange={(e) => setNewAmdFinancial(Number(e.target.value))}
                  className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 font-mono"
                  placeholder="اختیاری - در صورت داشتن بار مالی"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddAmendmentModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
                >
                  ذخیره و الصاق الحاقیه
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
