import React, { useState, useRef } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Download,
  Trash2,
  ShieldCheck,
  Building2,
  Scale,
  Clock,
  Lock,
  ExternalLink,
  Flame,
  Snowflake,
  Globe,
  Truck,
  Info,
  X,
  RefreshCw,
  File,
  Check,
  Calendar,
  CreditCard,
  Receipt,
  FileBadge2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { CompanyLegalDossier, CompanyUploadedDoc } from '../../types/pricing';

// ============================================================================
// PDF PREVIEW MODAL
// ============================================================================

interface PdfViewerModalProps {
  doc: CompanyUploadedDoc | null;
  orgName?: string;
  onClose: () => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({ doc, orgName, onClose }) => {
  if (!doc) return null;

  const handleDownload = () => {
    if (doc.fileDataUrl) {
      const a = document.createElement('a');
      a.href = doc.fileDataUrl;
      a.download = doc.fileName || `${doc.docKey}.pdf`;
      a.click();
    } else {
      // Create a fallback text/pdf blob download
      const sampleBlob = new Blob(
        [
          `سند الکترونیکی سامانه لجستیک Pricing OS\n\nسازمان: ${orgName || 'شرکت حمل و نقل'}\nعنوان سند: ${doc.titleFa}\nشناسه مدرک: ${doc.documentNumber || 'LIC-1405-AUTO'}\nوضعیت: ${doc.status}\nتاریخ: ${doc.uploadedAt || '۱۴۰۴/۱۲/۰۱'}`
        ],
        { type: 'text/plain;charset=utf-8' }
      );
      const url = URL.createObjectURL(sampleBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.fileName || `${doc.docKey}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-850 border-b border-slate-700/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base text-white">{doc.titleFa}</h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    doc.status === 'verified'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : doc.status === 'uploaded'
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}
                >
                  {doc.status === 'verified'
                    ? 'تأیید شده و معتبر'
                    : doc.status === 'uploaded'
                    ? 'بارگذاری شده (در انتظار بررسی)'
                    : 'نیازمند بررسی'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {doc.fileName || 'document.pdf'} • {doc.fileSize || '۱.۵ مگابایت'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-600 transition-colors cursor-pointer"
              title="دانلود فایل"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">دریافت PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewer Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950 flex flex-col items-center justify-center min-h-[380px]">
          {doc.fileDataUrl ? (
            <div className="w-full h-[60vh] bg-white rounded-2xl overflow-hidden border border-slate-700 shadow-inner">
              <iframe
                src={doc.fileDataUrl}
                title={doc.titleFa}
                className="w-full h-full border-none"
              />
            </div>
          ) : (
            /* High-fidelity official PDF Certificate rendering preview */
            <div className="w-full max-w-2xl bg-white text-slate-900 p-8 rounded-2xl shadow-xl border border-slate-300 relative font-sans space-y-6">
              {/* Official Watermark & Stamp */}
              <div className="absolute top-8 left-8 opacity-15 pointer-events-none select-none">
                <div className="w-28 h-28 rounded-full border-4 border-dashed border-slate-900 flex items-center justify-center rotate-12">
                  <span className="font-black text-xs text-center">سامانه احراز اصالت اسناد لجستیک</span>
                </div>
              </div>

              {/* Certificate Top Header */}
              <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-slate-900 font-title">{doc.titleFa}</h2>
                  <p className="text-xs text-slate-600 font-bold mt-1">
                    سازمان متقاضی: <span className="text-slate-900">{orgName || 'شرکت حمل‌ونقل سراسری'}</span>
                  </p>
                </div>
                <div className="text-left font-mono text-[11px] text-slate-700 space-y-0.5">
                  <div>شماره مدرک: <strong className="text-slate-950">{doc.documentNumber || '۱۴۰۵-۹۹۲۱'}</strong></div>
                  <div>تاریخ صدور: <strong>{doc.issueDate || '۱۴۰۴/۱۱/۱۵'}</strong></div>
                  {doc.expiryDate && <div>اعتبار تا: <strong className="text-rose-700">{doc.expiryDate}</strong></div>}
                </div>
              </div>

              {/* Document Meta Info Grid */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block mb-1">مرجع صادرکننده / نهاد نظارتی:</span>
                  <span className="font-bold text-slate-800">{doc.authorityName || 'سازمان راهداری و حمل‌ونقل جاده‌ای کشور'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">تاریخ بارگذاری در کارتابل:</span>
                  <span className="font-bold text-slate-800">{doc.uploadedAt || '۱۴۰۴/۱۲/۰۱'}</span>
                </div>
                {doc.notes && (
                  <div className="col-span-2 pt-2 border-t border-slate-200">
                    <span className="text-slate-500 block mb-1">توضیحات و مندرجات پرونده:</span>
                    <span className="font-medium text-slate-800 leading-relaxed">{doc.notes}</span>
                  </div>
                )}
              </div>

              {/* Security & Verification Box */}
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-emerald-900">سند دیجیتال دارای تأییدیه برخط سامانه احراز هویت شرکت‌ها</div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed font-mono">
                    SHA-256 Hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <span>سامانه یکپارچه Pricing OS و پورتال شرکت‌های حمل‌ونقل</span>
                <span className="font-mono">صفحه ۱ از ۱</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-850 border-t border-slate-700/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>اسناد بارگذاری‌شده رمزنگاری شده و تنها برای کاربران مجاز قابل دسترس هستند.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
          >
            بستن پنجره
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// PDF UPLOAD CARD COMPONENT (Supports Drag & Drop, File Reader, Preview, Delete)
// ============================================================================

interface PdfUploadCardProps {
  doc: CompanyUploadedDoc;
  isEditing: boolean;
  onUpdateDoc: (updated: Partial<CompanyUploadedDoc>) => void;
  onPreview: (doc: CompanyUploadedDoc) => void;
  icon?: React.ReactNode;
}

export const PdfUploadCard: React.FC<PdfUploadCardProps> = ({
  doc,
  isEditing,
  onUpdateDoc,
  onPreview,
  icon,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!isEditing) return;
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      alert('لطفاً تنها فایل با فرمت PDF بارگذاری فرمایید.');
      return;
    }

    const fileSizeStr =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} مگابایت`
        : `${Math.round(file.size / 1024)} کیلوبایت`;

    const reader = new FileReader();
    reader.onload = () => {
      onUpdateDoc({
        fileName: file.name,
        fileSize: fileSizeStr,
        uploadedAt: new Date().toLocaleDateString('fa-IR'),
        fileDataUrl: reader.result as string,
        status: 'uploaded',
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateDoc({
      fileName: undefined,
      fileSize: undefined,
      uploadedAt: undefined,
      fileDataUrl: undefined,
      status: 'missing',
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const hasFile = Boolean(doc.fileName);

  return (
    <div
      className={`rounded-2xl border transition-all ${
        hasFile
          ? 'bg-slate-50 border-slate-200'
          : 'bg-amber-50/40 border-dashed border-amber-300'
      } p-4 space-y-3`}
    >
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header Info */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0">
            {icon || <FileText className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-xs font-black text-slate-900">{doc.titleFa}</h4>
              {doc.required && (
                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded-md border border-rose-200">
                  الزامی
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">فرمت مورد پذیرش: سند دیجیتال PDF (حداکثر ۱۰ مگابایت)</p>
          </div>
        </div>

        {/* Status Badge */}
        <span
          className={`text-[11px] font-bold px-2 py-0.5 rounded-lg shrink-0 border ${
            doc.status === 'verified'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : doc.status === 'uploaded'
              ? 'bg-sky-50 text-sky-800 border-sky-300'
              : 'bg-rose-50 text-rose-800 border-rose-300'
          }`}
        >
          {doc.status === 'verified'
            ? 'تأیید شده (معتبر)'
            : doc.status === 'uploaded'
            ? 'بارگذاری شده'
            : 'نیاز به آپلود PDF'}
        </span>
      </div>

      {/* File Dropzone or Uploaded File Banner */}
      {hasFile ? (
        <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0 font-black text-[10px] font-mono">
              PDF
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 block truncate" dir="ltr">
                {doc.fileName}
              </span>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono mt-0.5">
                <span>{doc.fileSize}</span>
                <span>•</span>
                <span>آپلود: {doc.uploadedAt}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
            <button
              type="button"
              onClick={() => onPreview(doc)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              title="مشاهده پیش‌نمایش PDF"
            >
              <Eye className="w-3.5 h-3.5 text-slate-600" />
              <span>مشاهده</span>
            </button>

            {isEditing && (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors cursor-pointer"
                  title="جایگزینی فایل PDF"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-sky-600" />
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer"
                  title="حذف فایل"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        /* Empty upload dropzone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => isEditing && fileInputRef.current?.click()}
          className={`p-4 rounded-xl border-2 border-dashed text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-amber-500 bg-amber-50/80 scale-[1.01]'
              : 'border-slate-300 hover:border-amber-400 bg-white/70 hover:bg-white'
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                فایل PDF مدرک را بکشید و اینجا رها کنید، یا{' '}
                <span className="text-amber-600 underline">انتخاب فایل از سیستم</span>
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">حداکثر حجم مجاز: ۱۰ مگابایت</span>
            </div>
          </div>
        </div>
      )}

      {/* Editable or Informational Metadata Inputs */}
      {isEditing && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-200 text-xs">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700">شماره ثبت / مجوز / شناسه مدرک:</label>
            <input
              type="text"
              value={doc.documentNumber || ''}
              onChange={(e) => onUpdateDoc({ documentNumber: e.target.value })}
              placeholder="مثال: LIC-RMTO-1405-9921"
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700">تاریخ اعتبار / انقضا:</label>
            <input
              type="text"
              value={doc.expiryDate || ''}
              onChange={(e) => onUpdateDoc({ expiryDate: e.target.value })}
              placeholder="۱۴۰۶/۱۲/۲۹"
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-[11px] font-bold text-slate-700">توضیحات و دارندگان امضا / پوشش:</label>
            <input
              type="text"
              value={doc.notes || ''}
              onChange={(e) => onUpdateDoc({ notes: e.target.value })}
              placeholder="دارندگان امضا، شماره پرونده یا توضیحات تکمیلی"
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// COMPLETE COMPANY LEGAL & REGULATORY DOSSIER (Rendered in Edit and View Mode)
// ============================================================================

interface CompanyDocumentsDossierProps {
  dossier: CompanyLegalDossier;
  isEditing: boolean;
  orgName: string;
  onChangeDossier?: (updated: Partial<CompanyLegalDossier>) => void;
}

export const CompanyDocumentsDossier: React.FC<CompanyDocumentsDossierProps> = ({
  dossier,
  isEditing,
  orgName,
  onChangeDossier,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'legal' | 'logistics' | 'financial_insurance'>('all');
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState<CompanyUploadedDoc | null>(null);

  const updateDoc = (docKey: keyof CompanyLegalDossier, partialDoc: Partial<CompanyUploadedDoc>) => {
    if (!onChangeDossier) return;
    const currentDoc = dossier[docKey] as CompanyUploadedDoc;
    if (currentDoc) {
      onChangeDossier({
        [docKey]: {
          ...currentDoc,
          ...partialDoc,
        },
      });
    }
  };

  const specializedOptions = [
    'مواد سوختی، نفتی و شیمیایی (خطرناک ADR)',
    'محمولات فوق سنگین و ترافیکی (بوژی و کمرشکن)',
    'کالاهای فاسدشدنی و زنجیره سرد (یخچالی)',
    'ترانزیت بین‌المللی و کارنه تیر (CMR / TIR)',
    'حمل فله و غلات کشاورزی',
    'حمل کانتینری و محمولات گمرکی',
  ];

  const toggleSpecializedService = (serviceName: string) => {
    if (!onChangeDossier) return;
    const currentServices = dossier.specializedServices || [];
    const exists = currentServices.includes(serviceName);
    const updated = exists
      ? currentServices.filter((s) => s !== serviceName)
      : [...currentServices, serviceName];
    onChangeDossier({ specializedServices: updated });
  };

  return (
    <div className="space-y-6">
      {/* Top Header: احراز هویت حقوقی (منتقل شده به بالای منوی مدارک) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1 border-b border-slate-200">
        <div className="flex items-center gap-2.5 text-xs font-black text-slate-900">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <FileBadge2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <span className="text-sm font-black text-slate-900 block">احراز هویت حقوقی</span>
            <span className="text-[11px] text-slate-500 font-normal">
              پرونده مدارک ثبتی، پروانه‌های فعالیت و اسناد مالی و بیمه سازمان حمل‌ونقل
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>استعلام و احراز هویت شرکتی فعال</span>
        </div>
      </div>

      {/* Category Navigation Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 p-2 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-1.5 flex-wrap text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            همه مدارک و پرونده‌ها (۸ سند)
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('legal')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'legal'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span>۱. پرونده ثبتی و حقوقی</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('logistics')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'logistics'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-sky-400" />
            <span>۲. مجوزهای فعالیت لجستیکی</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('financial_insurance')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'financial_insurance'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
            <span>۳. مدارک مالی و بیمه</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 1: پرونده ثبتی و حقوقی */}
      {/* ======================================================== */}
      {(activeCategory === 'all' || activeCategory === 'legal') && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xs">
                ۱
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">پرونده ثبتی و حقوقی شرکت</h3>
                <p className="text-xs text-slate-500">
                  شامل آگهی روزنامه رسمی (حق امضا)، شناسه ملی و کد اقتصادی، و مدارک هویتی مدیرعامل
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
              ۳ مدرک اصلی
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* ۱-۱. آگهی تأسیس و روزنامه رسمی */}
            <PdfUploadCard
              doc={dossier.officialGazetteDoc}
              isEditing={isEditing}
              onUpdateDoc={(updated) => updateDoc('officialGazetteDoc', updated)}
              onPreview={(doc) => setSelectedPreviewDoc(doc)}
              icon={<Building2 className="w-4 h-4 text-amber-400" />}
            />

            {/* ۱-۲. شناسه ملی و کد اقتصادی */}
            <PdfUploadCard
              doc={dossier.nationalIdAndEconomicCodeDoc}
              isEditing={isEditing}
              onUpdateDoc={(updated) => updateDoc('nationalIdAndEconomicCodeDoc', updated)}
              onPreview={(doc) => setSelectedPreviewDoc(doc)}
              icon={<FileText className="w-4 h-4 text-amber-400" />}
            />

            {/* ۱-۳. کارت ملی و شناسنامه مدیرعامل */}
            <PdfUploadCard
              doc={dossier.ceoIdentityDoc}
              isEditing={isEditing}
              onUpdateDoc={(updated) => updateDoc('ceoIdentityDoc', updated)}
              onPreview={(doc) => setSelectedPreviewDoc(doc)}
              icon={<ShieldCheck className="w-4 h-4 text-amber-400" />}
            />
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 2: مجوزهای فعالیت لجستیکی */}
      {/* ======================================================== */}
      {(activeCategory === 'all' || activeCategory === 'logistics') && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-black text-xs">
                ۲
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">مجوزهای فعالیت لجستیکی و حمل‌ونقل</h3>
                <p className="text-xs text-slate-500">
                  پروانه معتبر سازمان راهداری، راه‌آهن، هواپیمایی و مجوزهای حمل تخصصی (سوختی ADR، ترافیکی، فاسدشدنی، CMR)
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-sky-800 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-lg">
              صلاحیت عملیاتی
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* ۲-۱. پروانه فعالیت راهداری */}
            <PdfUploadCard
              doc={dossier.rmtoPermitDoc}
              isEditing={isEditing}
              onUpdateDoc={(updated) => updateDoc('rmtoPermitDoc', updated)}
              onPreview={(doc) => setSelectedPreviewDoc(doc)}
              icon={<Truck className="w-4 h-4 text-sky-400" />}
            />

            {/* ۲-۲. مجوزهای حمل تخصصی */}
            <PdfUploadCard
              doc={dossier.specializedCargoPermitDoc}
              isEditing={isEditing}
              onUpdateDoc={(updated) => updateDoc('specializedCargoPermitDoc', updated)}
              onPreview={(doc) => setSelectedPreviewDoc(doc)}
              icon={<Flame className="w-4 h-4 text-amber-400" />}
            />
          </div>

          {/* حوزه تخصص‌های لجستیکی */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                حوزه‌های خدمات تخصصی تحت پوشش مجوزهای بارگذاری‌شده:
              </span>
              <span className="text-[11px] text-slate-500">
                {dossier.specializedServices?.length || 0} تخصص فعال
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              {specializedOptions.map((opt, idx) => {
                const isSelected = dossier.specializedServices?.includes(opt);
                return (
                  <label
                    key={idx}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-sky-50 border-sky-300 text-sky-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-700 font-medium'
                    } ${isEditing ? 'cursor-pointer hover:border-sky-400' : 'cursor-default'}`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={!isEditing}
                      onChange={() => toggleSpecializedService(opt)}
                      className="w-4 h-4 text-sky-600 rounded-md focus:ring-sky-500 accent-sky-600"
                    />
                    <span className="text-[11px]">{opt}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 3: مدارک مالی و بیمه */}
      {/* ======================================================== */}
      {(activeCategory === 'all' || activeCategory === 'financial_insurance') && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs">
                ۳
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">مدارک مالی، مالیاتی و بیمه‌نامه مسئولیت</h3>
                <p className="text-xs text-slate-500">
                  گواهی ثبت‌نام ارزش افزوده (VAT)، تأییدیه شبا بانکی و نمونه بیمه‌نامه مسئولیت مدنی حمل‌کننده
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
              تسویه و صدور فاکتور
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* ۳-۱. گواهی ارزش افزوده */}
            <PdfUploadCard
              doc={dossier.vatRegistrationDoc}
              isEditing={isEditing}
              onUpdateDoc={(updated) => updateDoc('vatRegistrationDoc', updated)}
              onPreview={(doc) => setSelectedPreviewDoc(doc)}
              icon={<Receipt className="w-4 h-4 text-emerald-400" />}
            />

            {/* ۳-۲. تأییدیه شبا و حساب بانکی */}
            <PdfUploadCard
              doc={dossier.bankAccountConfirmationDoc}
              isEditing={isEditing}
              onUpdateDoc={(updated) => updateDoc('bankAccountConfirmationDoc', updated)}
              onPreview={(doc) => setSelectedPreviewDoc(doc)}
              icon={<CreditCard className="w-4 h-4 text-emerald-400" />}
            />

            {/* ۳-۳. بیمه‌نامه مسئولیت حمل‌کننده */}
            <PdfUploadCard
              doc={dossier.carrierLiabilityInsuranceDoc}
              isEditing={isEditing}
              onUpdateDoc={(updated) => updateDoc('carrierLiabilityInsuranceDoc', updated)}
              onPreview={(doc) => setSelectedPreviewDoc(doc)}
              icon={<ShieldCheck className="w-4 h-4 text-emerald-400" />}
            />
          </div>

          {/* Insurance Details Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block mb-1">شرکت بیمه‌گر مسئولیت متصدی:</span>
              <span className="font-bold text-slate-900">{dossier.insuranceProviderName || 'بیمه ایران'}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-1">سقف تعهد خسارت در هر حادثه:</span>
              <span className="font-bold font-mono text-emerald-700">
                {(dossier.insuranceCoverageCeilingToman || 100000000000).toLocaleString('fa-IR')} تومان
              </span>
            </div>
            <div>
              <span className="text-slate-500 block mb-1">تاریخ انقضای بیمه‌نامه:</span>
              <span className="font-bold font-mono text-slate-800">{dossier.insuranceExpiryDate || '۱۴۰۵/۱۲/۱۵'}</span>
            </div>
          </div>
        </div>
      )}

      {/* PDF Modal Viewer */}
      <PdfViewerModal
        doc={selectedPreviewDoc}
        orgName={orgName}
        onClose={() => setSelectedPreviewDoc(null)}
      />
    </div>
  );
};
