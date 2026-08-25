import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Printer,
  X,
  Building2,
  Truck,
  ShieldCheck,
  QrCode,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Scale,
  Receipt,
  FileCheck,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Phone,
  User,
} from 'lucide-react';
import {
  FullShipmentDocumentPackage,
  GeneratedProformaInvoice,
  GeneratedOfficialInvoice,
  GeneratedLoadingOrder,
  GeneratedBillOfLading,
} from '../../types/shipmentDocuments';
import { IranLicensePlate } from '../common/IranLicensePlate';

interface ShipmentDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentPackage: FullShipmentDocumentPackage;
  initialDocType?: 'proforma' | 'official_invoice' | 'loading_order' | 'bill_of_lading';
}

export const ShipmentDocumentModal: React.FC<ShipmentDocumentModalProps> = ({
  isOpen,
  onClose,
  documentPackage,
  initialDocType = 'bill_of_lading',
}) => {
  const [selectedDoc, setSelectedDoc] = useState<'proforma' | 'official_invoice' | 'loading_order' | 'bill_of_lading'>(
    initialDocType
  );
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  useEffect(() => {
    if (initialDocType && isOpen) {
      setSelectedDoc(initialDocType);
    }
  }, [initialDocType, isOpen]);

  if (!isOpen) return null;

  const { proformaInvoice, officialInvoice, loadingOrder, billOfLading } = documentPackage;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = (docName: string) => {
    let docTitle = 'پیش‌فاکتور رسمی حمل کالا';
    let docCode = proformaInvoice.documentNumber;
    if (docName === 'official_invoice') {
      docTitle = 'صورتحساب رسمی خدمات حمل و نقل';
      docCode = officialInvoice.invoiceNumber;
    } else if (docName === 'loading_order') {
      docTitle = 'حواله بارگیری و مجوز خروج انبار';
      docCode = loadingOrder.loadingOrderCode || loadingOrder.dispatchSlipNo;
    } else if (docName === 'bill_of_lading') {
      docTitle = 'بارنامه دولتی تمبردار راهداری';
      docCode = billOfLading.rmtoTrackingCode || billOfLading.billOfLadingNo;
    }

    // Generate standalone printable HTML file with full styling
    const docElement = document.getElementById('printable-document-content');
    const docHtml = docElement ? docElement.innerHTML : '';
    
    const fullHtml = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>${docTitle} - ${docCode}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;700;800;900&display=swap');
    body {
      font-family: 'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      direction: rtl;
      text-align: right;
      padding: 30px;
      color: #0f172a;
      background: #f8fafc;
    }
    .paper {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      padding: 32px;
      border: 1px solid #cbd5e1;
      border-radius: 16px;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
    }
    table { width: 100%; border-collapse: collapse; margin: 12px 0; }
    th, td { border: 1px solid #e2e8f0; padding: 8px 10px; font-size: 12px; }
    th { background: #f1f5f9; font-weight: bold; }
    .font-mono { font-family: monospace; }
    @media print {
      body { background: #fff; padding: 0; }
      .paper { border: none; box-shadow: none; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="paper">
    ${docHtml}
  </div>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${docTitle.replace(/\s+/g, '_')}_${docCode}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadNotice(`فایل چاپی استاندارد "${docTitle}" با شناسه ${docCode} با موفقیت دانلود شد.`);
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Control Bar - Bright Modern & Clear */}
        <div className="p-4 sm:p-5 bg-white text-slate-900 flex flex-wrap items-center justify-between gap-3 shrink-0 border-b border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 font-display">اسناد الکترونیکی و مدارک رسمی محموله</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 font-mono text-xs border border-teal-200 font-bold">
                  {documentPackage.billOfLadingNo}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                تولیدشده مطابق استانداردهای رسمی سازمان امور مالیاتی و راهداری و حمل‌ونقل جاده‌ای کشور
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-print-doc"
              onClick={handlePrint}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">چاپ سند</span>
            </button>
            <button
              type="button"
              id="btn-download-active-doc"
              onClick={() => handleDownloadPdf(selectedDoc)}
              className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-teal-200" />
              <span>دانلود PDF</span>
            </button>
            <button
              type="button"
              id="btn-close-doc-modal"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Download Notice Notification Banner */}
        {downloadNotice && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2.5 text-xs text-emerald-900 font-bold flex items-center justify-between animate-in fade-in">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{downloadNotice}</span>
            </span>
            <span className="text-[10px] text-emerald-700 font-normal">
              جهت خروجی مستقیم PDF می‌توانید از دکمه «چاپ سند» نیز استفاده نمایید.
            </span>
          </div>
        )}

        {/* 4 Tabs Selector Bar */}
        <div className="bg-slate-50 p-2 sm:px-5 border-b border-slate-200 flex items-center gap-1.5 sm:gap-2 overflow-x-auto shrink-0">
          {[
            { id: 'proforma', label: '۱. پیش‌فاکتور (Proforma)', icon: FileText, number: 'PRF' },
            { id: 'official_invoice', label: '۲. فاکتور رسمی مالیاتی (Tax Invoice)', icon: Receipt, number: 'INV' },
            { id: 'loading_order', label: '۳. حواله بارگیری (Loading Order)', icon: Building2, number: 'DSP' },
            { id: 'bill_of_lading', label: '۴. بارنامه راهداری (Bill of Lading)', icon: ShieldCheck, number: 'BL' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedDoc === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                id={`tab-doc-${tab.id}`}
                onClick={() => setSelectedDoc(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Document Printable Paper Viewer Container */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-50">
          <div
            id="printable-document-content"
            className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-300 shadow-md p-6 sm:p-8 space-y-6 text-right font-sans text-slate-900 relative"
          >
            {/* DOCUMENT 1: PROFORMA INVOICE */}
            {selectedDoc === 'proforma' && <ProformaDocumentView doc={proformaInvoice} />}

            {/* DOCUMENT 2: OFFICIAL TAX INVOICE */}
            {selectedDoc === 'official_invoice' && <OfficialInvoiceDocumentView doc={officialInvoice} />}

            {/* DOCUMENT 3: LOADING ORDER / DISPATCH SLIP */}
            {selectedDoc === 'loading_order' && <LoadingOrderDocumentView doc={loadingOrder} />}

            {/* DOCUMENT 4: OFFICIAL RMTO BILL OF LADING */}
            {selectedDoc === 'bill_of_lading' && <BillOfLadingDocumentView doc={billOfLading} />}
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// SUB-VIEW 1: PROFORMA INVOICE VIEW
// -------------------------------------------------------------
const ProformaDocumentView: React.FC<{ doc: GeneratedProformaInvoice }> = ({ doc }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block font-mono">
            QUOTATION & PROFORMA INVOICE
          </span>
          <h1 className="text-xl font-black text-slate-900 font-title">پیش‌فاکتور و استعلام رسمی حمل کالا</h1>
          <p className="text-xs text-slate-500 mt-0.5">{doc.carrierCompany.companyName}</p>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-mono space-y-1 min-w-[200px]">
          <div className="flex justify-between">
            <span className="text-slate-500">شماره پیش‌فاکتور:</span>
            <strong className="text-slate-900">{doc.documentNumber}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">تاریخ صدور:</span>
            <span className="text-slate-800">{doc.issueDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">مهلت اعتبار:</span>
            <span className="text-rose-600 font-bold">{doc.validityDate}</span>
          </div>
        </div>
      </div>

      {/* Shipper & Consignee Parties */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200 space-y-1.5 text-xs">
          <div className="font-bold text-slate-800 border-b border-slate-200 pb-1 flex items-center justify-between">
            <span>مشتری / متقاضی حمل (صاحب کالا):</span>
            <span className="text-[10px] text-slate-400 font-mono">فرستنده</span>
          </div>
          <div>نام / شرکت: <strong>{doc.shipperParty.name}</strong></div>
          <div>شناسه / کد ملی: <span className="font-mono">{doc.shipperParty.nationalId}</span></div>
          {doc.shipperParty.economicCode && (
            <div>کد اقتصادی: <span className="font-mono">{doc.shipperParty.economicCode}</span></div>
          )}
          <div>تلفن تماس: <span className="font-mono">{doc.shipperParty.phone}</span></div>
          <div className="text-slate-600 text-[11px]">نشانی: {doc.shipperParty.address}</div>
        </div>

        <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200 space-y-1.5 text-xs">
          <div className="font-bold text-slate-800 border-b border-slate-200 pb-1 flex items-center justify-between">
            <span>تحویل‌گیرنده در مقصد:</span>
            <span className="text-[10px] text-slate-400 font-mono">گیرنده</span>
          </div>
          <div>نام / انبار: <strong>{doc.consigneeParty.name}</strong></div>
          <div>کد پستی: <span className="font-mono">{doc.consigneeParty.postalCode}</span></div>
          <div>تلفن تماس: <span className="font-mono">{doc.consigneeParty.phone}</span></div>
          <div className="text-slate-600 text-[11px]">نشانی تخلیه: {doc.consigneeParty.address}</div>
        </div>
      </div>

      {/* Cargo & Route Details */}
      <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <span className="text-slate-500 block text-[11px]">نوع محموله:</span>
          <strong className="text-slate-900">{doc.cargoDetails.cargoName}</strong>
        </div>
        <div>
          <span className="text-slate-500 block text-[11px]">وزن ناخالص:</span>
          <strong className="text-slate-900 font-mono">{doc.cargoDetails.weightTons} تن</strong>
        </div>
        <div>
          <span className="text-slate-500 block text-[11px]">نوع بسته‌بندی:</span>
          <strong className="text-slate-900">{doc.cargoDetails.packagingType}</strong>
        </div>
        <div>
          <span className="text-slate-500 block text-[11px]">ارزش اظهاری کالا:</span>
          <strong className="text-slate-900 font-mono">
            {(doc.cargoDetails.declaredValueRials / 10000000).toLocaleString('fa-IR')} م تومان
          </strong>
        </div>
        <div className="sm:col-span-2 pt-2 border-t border-amber-200/60">
          <span className="text-slate-500 text-[11px]">مبدأ بارگیری:</span>
          <span className="text-slate-800 font-bold mr-1">{doc.routeDetails.originCity} ({doc.routeDetails.originHub})</span>
        </div>
        <div className="sm:col-span-2 pt-2 border-t border-amber-200/60">
          <span className="text-slate-500 text-[11px]">مقصد تخلیه:</span>
          <span className="text-slate-800 font-bold mr-1">{doc.routeDetails.destCity} ({doc.routeDetails.destHub})</span>
        </div>
      </div>

      {/* Pricing Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
        <table className="w-full text-right divide-y divide-slate-200">
          <thead className="bg-slate-100 text-slate-700 font-bold text-[11px]">
            <tr>
              <th className="p-2.5">ردیف</th>
              <th className="p-2.5">شرح خدمات قیمت‌گذاری</th>
              <th className="p-2.5 text-center">مقدار</th>
              <th className="p-2.5 text-left">مبلغ کل (ریال)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800 font-mono">
            {doc.items.map((item) => (
              <tr key={item.rowNo} className="hover:bg-slate-50">
                <td className="p-2.5 font-bold text-center text-slate-400">{item.rowNo}</td>
                <td className="p-2.5 font-sans font-medium text-slate-900">{item.description}</td>
                <td className="p-2.5 text-center font-sans">{item.quantity} {item.unit}</td>
                <td className="p-2.5 text-left font-bold">{item.totalPriceRials.toLocaleString('fa-IR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals & Financial Breakdown */}
      <div className="bg-slate-50 text-slate-900 p-4 rounded-xl border border-slate-200 space-y-2 text-xs font-mono">
        <div className="flex justify-between text-slate-600">
          <span className="font-sans">مجموع کرایه پایه و هزینه‌های جانبی:</span>
          <span className="font-bold text-slate-800">{(doc.pricingBreakdown.totalNetPayableRials - doc.pricingBreakdown.vatAmountRials + doc.pricingBreakdown.discountRials).toLocaleString('fa-IR')} ریال</span>
        </div>
        <div className="flex justify-between text-emerald-700">
          <span className="font-sans font-bold">تخفیف قرارداد وفاداری / سازمانی:</span>
          <span className="font-bold">- {doc.pricingBreakdown.discountRials.toLocaleString('fa-IR')} ریال</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span className="font-sans">مالیات بر ارزش افزوده (۱۰٪ VAT):</span>
          <span className="font-bold text-slate-800">+ {doc.pricingBreakdown.vatAmountRials.toLocaleString('fa-IR')} ریال</span>
        </div>
        <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-base font-bold text-teal-800">
          <span className="font-sans text-slate-900 font-bold">مبلغ کل قابل پرداخت نهایی:</span>
          <span className="text-teal-800 text-lg">{doc.pricingBreakdown.totalNetPayableRials.toLocaleString('fa-IR')} ریال</span>
        </div>
      </div>

      {/* Payment Terms & Signatures */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
        <div><strong>شرایط تسویه و پرداخت:</strong> {doc.paymentTerms}</div>
        <div className="text-[11px] text-slate-500">
          * این پیش‌فاکتور صرفاً جنبه برآورد قطعی هزینه تا پایان مهلت اعتبار دارد و پس از تایید توسط فرستنده، مبنای صدور حواله بارگیری خواهد بود.
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// SUB-VIEW 2: OFFICIAL TAX INVOICE VIEW
// -------------------------------------------------------------
const OfficialInvoiceDocumentView: React.FC<{ doc: GeneratedOfficialInvoice }> = ({ doc }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center border-b-2 border-slate-900 pb-4 relative">
        <div className="text-[11px] font-bold text-slate-500 font-mono">صورتحساب الکترونیکی فروش کالا و خدمات</div>
        <h1 className="text-xl font-black text-slate-900 font-title mt-0.5">صورتحساب / فاکتور رسمی مالیاتی</h1>
        <p className="text-xs text-slate-600 mt-0.5">مطابق با ماده ۱۹ قانون مالیات بر ارزش افزوده</p>

        <div className="mt-3 flex flex-wrap items-center justify-between text-xs font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <div>شماره صورتحساب: <strong>{doc.invoiceNumber}</strong></div>
          <div>تاریخ صدور: <strong>{doc.issueDate}</strong></div>
          <div>بارنامه مرجع: <strong className="text-amber-700">{doc.relatedBillOfLadingNo}</strong></div>
        </div>
      </div>

      {/* Seller & Buyer Blocks (Tax standard) */}
      <div className="space-y-3">
        {/* Seller */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-300 text-xs space-y-1">
          <div className="font-bold text-slate-900 text-[11px] bg-slate-200 px-2 py-0.5 rounded inline-block mb-1">
            مشخصات فروشنده (ارائه‌دهنده خدمات حمل):
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>نام شرکت: <strong>{doc.seller.companyName}</strong></div>
            <div>شناسه ملی: <span className="font-mono">{doc.seller.nationalId}</span></div>
            <div>کد اقتصادی: <span className="font-mono">{doc.seller.economicCode}</span></div>
            <div>شماره ثبت: <span className="font-mono">{doc.seller.registrationNumber}</span></div>
            <div>کد پستی: <span className="font-mono">{doc.seller.postalCode}</span></div>
            <div>تلفن: <span className="font-mono">{doc.seller.phone}</span></div>
            <div className="sm:col-span-3 text-slate-600">نشانی: {doc.seller.address}</div>
          </div>
        </div>

        {/* Buyer */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-300 text-xs space-y-1">
          <div className="font-bold text-slate-900 text-[11px] bg-slate-200 px-2 py-0.5 rounded inline-block mb-1">
            مشخصات خریدار (صاحب کالا / متقاضی):
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>نام شخص / شرکت: <strong>{doc.buyer.name}</strong></div>
            <div>کد / شناسه ملی: <span className="font-mono">{doc.buyer.nationalId}</span></div>
            <div>کد اقتصادی: <span className="font-mono">{doc.buyer.economicCode || 'حقیقی'}</span></div>
            <div>کد پستی: <span className="font-mono">{doc.buyer.postalCode}</span></div>
            <div>تلفن: <span className="font-mono">{doc.buyer.phone}</span></div>
            <div className="sm:col-span-3 text-slate-600">نشانی پستی: {doc.buyer.address}</div>
          </div>
        </div>
      </div>

      {/* Tax Table */}
      <div className="border border-slate-300 rounded-xl overflow-hidden text-xs">
        <table className="w-full text-right divide-y divide-slate-200">
          <thead className="bg-slate-100 text-slate-800 font-bold text-[11px]">
            <tr>
              <th className="p-2">ردیف</th>
              <th className="p-2">شرح کالا یا خدمات</th>
              <th className="p-2 text-center">تعداد/وزن</th>
              <th className="p-2 text-left">مبلغ کل (ریال)</th>
              <th className="p-2 text-left">تخفیف</th>
              <th className="p-2 text-left">مالیات و عوارض</th>
              <th className="p-2 text-left">مبلغ نهایی (ریال)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
            {doc.items.map((it) => (
              <tr key={it.rowNo}>
                <td className="p-2 text-center text-slate-400">{it.rowNo}</td>
                <td className="p-2 font-sans text-slate-900 font-medium">{it.description}</td>
                <td className="p-2 text-center font-sans">{it.quantity} {it.unit}</td>
                <td className="p-2 text-left">{it.totalPriceRials.toLocaleString('fa-IR')}</td>
                <td className="p-2 text-left text-emerald-700">{it.discountRials.toLocaleString('fa-IR')}</td>
                <td className="p-2 text-left">{it.vatAmountRials.toLocaleString('fa-IR')}</td>
                <td className="p-2 text-left font-bold text-slate-900">{it.netPayableRials.toLocaleString('fa-IR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Final Settlement Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1 font-mono">
          <div className="font-sans font-bold text-slate-800 border-b border-slate-200 pb-1">
            اطلاعات تسویه حساب و پرداخت:
          </div>
          <div>روش پرداخت: <strong className="font-sans">{doc.paymentInfo.paymentMethod}</strong></div>
          <div>شناسه تراکنش مالیاتی: <span>{doc.paymentInfo.transactionId}</span></div>
          <div>شماره شبا: <span>{doc.paymentInfo.ibanNumber}</span></div>
          <div>وضعیت: <strong className="text-emerald-700 font-sans">{doc.paymentInfo.paymentStatusFa}</strong></div>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 font-mono text-xs">
          <div className="flex justify-between text-slate-600 text-[11px]">
            <span className="font-sans">جمع کل قبل از مالیات:</span>
            <span className="font-bold text-slate-800">{(doc.pricingBreakdown.totalNetPayableRials - doc.pricingBreakdown.vatAmountRials).toLocaleString('fa-IR')} ریال</span>
          </div>
          <div className="flex justify-between text-slate-600 text-[11px]">
            <span className="font-sans">مالیات و عوارض ارزش افزوده (۱۰٪):</span>
            <span className="font-bold text-slate-800">{doc.pricingBreakdown.vatAmountRials.toLocaleString('fa-IR')} ریال</span>
          </div>
          <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-teal-800 text-sm">
            <span className="font-sans text-slate-900 font-bold">مبلغ کل قابل پرداخت:</span>
            <span className="text-teal-800 text-base">{doc.pricingBreakdown.totalNetPayableRials.toLocaleString('fa-IR')} ریال</span>
          </div>
        </div>
      </div>

      {/* Fiscal Digital Seal */}
      <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>دارای تاییدیه ثبت صورتحساب در سامانه مودیان سازمان امور مالیاتی کشور (کد یکتای مالیاتی معتبر)</span>
        </div>
        <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-emerald-300 text-emerald-800">
          {doc.fiscalBarcode}
        </span>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// SUB-VIEW 3: LOADING ORDER / DISPATCH SLIP
// -------------------------------------------------------------
const LoadingOrderDocumentView: React.FC<{ doc: GeneratedLoadingOrder }> = ({ doc }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest block font-mono">
            WAREHOUSE LOADING ORDER & DISPATCH SLIP
          </span>
          <h1 className="text-xl font-black text-slate-900 font-title">حواله رسمی بارگیری و مجوز ورود به انبار</h1>
          <p className="text-xs text-slate-500 mt-0.5">مجوز عملیاتی ورود ناوگان به گیت انبار مبدأ</p>
        </div>

        <div className="bg-sky-50 p-3 rounded-xl border border-sky-200 text-xs font-mono space-y-1 min-w-[200px]">
          <div className="flex justify-between">
            <span className="text-sky-700">شماره حواله بارگیری:</span>
            <strong className="text-sky-950 font-bold">{doc.loadingOrderCode}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-sky-700">کد تردد گیت:</span>
            <strong className="text-emerald-700 font-bold">{doc.securityClearanceCode}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-sky-700">تاریخ صدور:</span>
            <span className="text-slate-800">{doc.issueDate}</span>
          </div>
        </div>
      </div>

      {/* Driver and Fleet Card */}
      <div className="p-4.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-slate-800">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 font-display">
            <Truck className="w-4 h-4 text-teal-700" />
            مشخصات راننده مجاز و ناوگان باربری
          </h4>
          <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200 font-mono font-bold">
            کارت هوشمند فعال
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div>
            <span className="text-slate-500 text-[10px] block font-sans">نام راننده:</span>
            <strong className="text-slate-900 text-sm font-sans">{doc.driverFleet.driverFullName}</strong>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block font-sans">کد ملی راننده:</span>
            <span className="text-slate-700 font-bold">{doc.driverFleet.driverNationalCode}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block font-sans">کارت هوشمند راننده:</span>
            <span className="text-teal-800 font-bold">{doc.driverFleet.driverSmartCardNo}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block font-sans">تلفن همراه:</span>
            <span className="text-slate-700">{doc.driverFleet.driverPhone}</span>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <span className="text-slate-500 text-[10px] block font-sans mb-1">شماره پلاک ناوگان:</span>
            <IranLicensePlate plateString={doc.driverFleet.truckPlate} size="xs" />
          </div>
          <div className="pt-2 border-t border-slate-200">
            <span className="text-slate-500 text-[10px] block font-sans">نوع وسیله نقلیه:</span>
            <span className="text-slate-800 font-sans font-medium">{doc.driverFleet.truckType}</span>
          </div>
          <div className="pt-2 border-t border-slate-200">
            <span className="text-slate-500 text-[10px] block font-sans">کارت هوشمند ناوگان:</span>
            <span className="text-slate-700">{doc.driverFleet.fleetSmartCardNo}</span>
          </div>
          <div className="pt-2 border-t border-slate-200">
            <span className="text-slate-500 text-[10px] block font-sans">بیمه‌نامه شخص ثالث:</span>
            <span className="text-slate-700">{doc.driverFleet.thirdPartyInsuranceNo}</span>
          </div>
        </div>
      </div>

      {/* Loading Site & Time Slot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
          <div className="font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center justify-between">
            <span>محل دقیق بارگیری و تحویل:</span>
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div>انبار / سایت: <strong>{doc.originWarehouse.hubName}</strong></div>
          <div className="text-slate-600">نشانی: {doc.originWarehouse.address}</div>
          <div>مسئول انبار مبدأ: <strong>{doc.originWarehouse.warehouseManagerName}</strong></div>
          <div>تلفن هماهنگی: <span className="font-mono">{doc.originWarehouse.warehousePhone}</span></div>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
          <div className="font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center justify-between">
            <span>زمان‌بندی و نوبت بارگیری (Time Slot):</span>
            <Clock className="w-3.5 h-3.5 text-sky-500" />
          </div>
          <div>نوبت مجاز بارگیری: <strong className="text-sky-800">{doc.scheduledLoadingSlot}</strong></div>
          <div>حداکثر مهلت مراجعه: <span className="text-rose-700 font-bold">{doc.expirySlot}</span></div>
          <div className="pt-1 text-slate-500 text-[11px]">
            * در صورت عدم حضور در بازه زمانی تعیین‌شده، نوبت لغو و به انتهای صف منتقل می‌شود.
          </div>
        </div>
      </div>

      {/* Cargo Technical Specs for Loading Crew */}
      <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-2">
        <div className="font-bold text-amber-900 flex items-center justify-between">
          <span>مشخصات فنی و دستورالعمل‌های ویژه انباردار و راننده:</span>
          <Scale className="w-4 h-4 text-amber-700" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-slate-800">
          <div>نوع کالا: <strong className="font-sans">{doc.cargoSpecs.cargoType}</strong></div>
          <div>وزن مجاز بارگیری: <strong>{doc.cargoSpecs.weightTons} تن</strong></div>
          <div>تعداد بسته‌ها: <strong>{doc.cargoSpecs.packageCount}</strong></div>
        </div>
        <div className="pt-2 border-t border-amber-200/80 space-y-1">
          <span className="font-bold text-slate-800 block text-[11px]">الزامات ایمنی و مهار بار:</span>
          {doc.cargoSpecs.specialInstructions.map((ins, i) => (
            <div key={i} className="text-[11px] text-slate-700 flex items-start gap-1.5">
              <span className="text-amber-600 font-bold">•</span>
              <span>{ins}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 text-center text-xs text-slate-500">
        <div className="space-y-8">
          <div>امضای مسئول صدور حواله</div>
          <div className="font-bold text-slate-800">واحد دیسپچینگ</div>
        </div>
        <div className="space-y-8">
          <div>امضای مسئول انبار مبدأ / باسکول</div>
          <div className="font-bold text-slate-800">انباردار خروج</div>
        </div>
        <div className="space-y-8">
          <div>امضا و اثر انگشت راننده</div>
          <div className="font-bold text-slate-800">{doc.driverFleet.driverFullName}</div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// SUB-VIEW 4: OFFICIAL RMTO BILL OF LADING VIEW
// -------------------------------------------------------------
const BillOfLadingDocumentView: React.FC<{ doc: GeneratedBillOfLading }> = ({ doc }) => {
  return (
    <div className="space-y-5 border-4 border-double border-slate-800 p-4 sm:p-6 rounded-2xl bg-white relative">
      {/* Official Watermark & RMTO Header */}
      <div className="text-center border-b-2 border-slate-800 pb-3 relative">
        <div className="flex items-center justify-between text-xs text-slate-600 font-mono">
          <span>جمهوری اسلامی ایران</span>
          <span className="font-bold text-slate-900">وزارت راه و شهرسازی</span>
          <span>سازمان راهداری و حمل‌ونقل جاده‌ای</span>
        </div>
        <h1 className="text-lg sm:text-xl font-black text-slate-900 font-title mt-1">
          بارنامه رسمی تمبردار الکترونیکی حمل کالا
        </h1>
        <p className="text-[11px] text-slate-500 mt-0.5">{doc.carrierCompany.companyName} - شعبه رسمی راهداری</p>

        {/* Top Numbers */}
        <div className="mt-2.5 flex flex-wrap items-center justify-between text-xs font-mono bg-slate-100 p-2 rounded-xl border border-slate-300">
          <div>شماره بارنامه راهداری: <strong className="text-amber-900 text-sm">{doc.billOfLadingNo}</strong></div>
          <div>کد رهگیری برخط: <strong className="text-slate-900">{doc.rmtoTrackingCode}</strong></div>
          <div>تاریخ و زمان صدور: <span>{doc.issueDateTime}</span></div>
        </div>
      </div>

      {/* Section 1: Sender & Consignee */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border border-slate-300 rounded-xl p-3 bg-slate-50/70">
        <div className="space-y-1">
          <div className="font-bold text-slate-900 border-b border-slate-200 pb-1">
            ۱. مشخصات فرستنده کالا (مبدأ):
          </div>
          <div>نام / شرکت: <strong>{doc.sender.name}</strong></div>
          <div>کد / شناسه ملی: <span className="font-mono">{doc.sender.nationalId}</span></div>
          <div>تلفن تماس: <span className="font-mono">{doc.sender.phone}</span></div>
          <div className="text-slate-600 text-[11px]">محل بارگیری: {doc.sender.address}</div>
        </div>

        <div className="space-y-1 sm:border-r sm:border-slate-200 sm:pr-3">
          <div className="font-bold text-slate-900 border-b border-slate-200 pb-1">
            ۲. مشخصات گیرنده کالا (مقصد):
          </div>
          <div>نام / شرکت: <strong>{doc.consignee.name}</strong></div>
          <div>کد / شناسه ملی: <span className="font-mono">{doc.consignee.nationalId}</span></div>
          <div>تلفن تماس: <span className="font-mono">{doc.consignee.phone}</span></div>
          <div className="text-slate-600 text-[11px]">محل تخلیه: {doc.consignee.address}</div>
        </div>
      </div>

      {/* Section 2: Driver & Fleet */}
      <div className="border border-slate-300 rounded-xl p-3 bg-slate-50/70 text-xs space-y-2">
        <div className="font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center justify-between">
          <span>۳. مشخصات راننده و مشخصات ناوگان حمل‌کننده:</span>
          <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-mono font-bold">
            استعلام برخط راهداری: فعال
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
          <div>راننده اول: <strong className="font-sans">{doc.driverFleet.driverFullName}</strong></div>
          <div>کد ملی: <span>{doc.driverFleet.driverNationalCode}</span></div>
          <div>شماره کارت هوشمند: <strong className="text-amber-800">{doc.driverFleet.driverSmartCardNo}</strong></div>
          <div>شماره گواهینامه: <span>{doc.driverFleet.driverLicenseNo}</span></div>

          <div className="pt-1 flex items-center gap-1.5">
            <span className="text-[10px] text-slate-500">پلاک:</span>
            <IranLicensePlate plateString={doc.driverFleet.truckPlate} size="xs" />
          </div>
          <div className="pt-1">نوع کامیون: <span className="font-sans">{doc.driverFleet.truckType}</span></div>
          <div className="pt-1">کارت هوشمند ناوگان: <span>{doc.driverFleet.fleetSmartCardNo}</span></div>
          <div className="pt-1">بیمه شخص ثالث: <span>{doc.driverFleet.thirdPartyInsuranceNo}</span></div>
        </div>
      </div>

      {/* Section 3: Technical Cargo Specs */}
      <div className="border border-slate-300 rounded-xl p-3 bg-slate-50/70 text-xs space-y-2">
        <div className="font-bold text-slate-900 border-b border-slate-200 pb-1">
          ۴. مشخصات فنی و ارزش ریالی محموله:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
          <div>شرح کالا: <strong className="font-sans">{doc.cargoTechnical.commodityName}</strong></div>
          <div>وزن ناخالص: <strong>{(doc.cargoTechnical.grossWeightKg / 1000).toLocaleString('fa-IR')} تن</strong></div>
          <div>وزن خالص: <span>{(doc.cargoTechnical.netWeightKg / 1000).toLocaleString('fa-IR')} تن</span></div>
          <div>تعداد و نوع بسته: <span className="font-sans">{doc.cargoTechnical.packageCount}</span></div>
          <div className="sm:col-span-2">ارزش اظهاری کالا: <strong>{(doc.cargoTechnical.goodsValueRials / 10000000).toLocaleString('fa-IR')} میلیون تومان</strong></div>
          <div className="sm:col-span-2">شرکت بیمه‌گر: <span className="font-sans">{doc.insuranceCompany} ({doc.insurancePolicyNumber})</span></div>
        </div>
      </div>

      {/* Section 4: Financials */}
      <div className="border border-slate-300 rounded-xl p-3.5 bg-slate-50/90 text-slate-800 text-xs font-mono space-y-2">
        <div className="font-sans font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center justify-between">
          <span>۵. مبالغ مالی، کرایه حمل و کسورات قانونی:</span>
          <span className="text-[10px] text-slate-500 font-sans">واحد: ریال</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600">
          <div>کرایه پایه حمل: <strong className="text-slate-900 block">{doc.financials.baseFreightRials.toLocaleString('fa-IR')}</strong></div>
          <div>حق کمیسیون شرکت: <span className="font-bold text-slate-800">{doc.financials.commissionRials.toLocaleString('fa-IR')}</span></div>
          <div>حق بیمه کالا: <span className="font-bold text-slate-800">{doc.financials.insuranceCostRials.toLocaleString('fa-IR')}</span></div>
          <div>عوارض جاده‌ای و باسکول: <span className="font-bold text-slate-800">{doc.financials.roadTaxWeighbridgeRials.toLocaleString('fa-IR')}</span></div>

          <div className="pt-2 border-t border-slate-200">پیش‌پرداخت در مبدأ: <strong className="text-emerald-700 block">{doc.financials.prepaymentAdvanceRials.toLocaleString('fa-IR')}</strong></div>
          <div className="pt-2 border-t border-slate-200">باقیمانده پس‌کرایه: <strong className="text-slate-800 block">{doc.financials.remainingDestinationPayableRials.toLocaleString('fa-IR')}</strong></div>
          <div className="pt-2 border-t border-slate-200">مالیات ارزش افزوده: <span className="font-bold text-slate-800">{doc.financials.vatAmountRials.toLocaleString('fa-IR')}</span></div>
          <div className="pt-2 border-t border-slate-200 text-slate-900 font-bold text-sm">
            جمع کل کرایه: <span className="text-teal-800 text-base block">{doc.financials.totalNetPayableRials.toLocaleString('fa-IR')}</span>
          </div>
        </div>
      </div>

      {/* Footer: RMTO Barcode and Legal Stamps */}
      <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-slate-100 rounded-xl border border-slate-300 flex items-center justify-center p-1 shrink-0">
            <QrCode className="w-12 h-12 text-slate-900" />
          </div>
          <div className="text-[10px] text-slate-500 space-y-0.5">
            <div>استعلام اصالت بارنامه در سامانه سازمان راهداری:</div>
            <div className="font-mono text-sky-700 underline">{doc.rmtoQrValidationUrl}</div>
            <div>دارای تمبر مالیاتی و مهر دیجیتال سازمان راهداری</div>
          </div>
        </div>

        <div className="text-center sm:text-left space-y-1">
          <div className="text-[10px] text-slate-400">مهر و امضای الکترونیکی شرکت حمل‌ونقل</div>
          <div className="font-bold text-slate-800 text-[11px] font-title">{doc.carrierCompany.companyName}</div>
          <span className="text-[9px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-mono">
            VERIFIED-DIGITAL-SIGNATURE
          </span>
        </div>
      </div>
    </div>
  );
};
