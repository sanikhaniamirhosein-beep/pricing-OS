import React from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck } from 'lucide-react';
import { EnterpriseCorporateContract } from '../../../../types/enterpriseContract';

interface Props {
  contract: EnterpriseCorporateContract | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ContractPrintPreviewModal: React.FC<Props> = ({ contract, isOpen, onClose }) => {
  if (!isOpen || !contract) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden my-auto">
        {/* Modal Toolbar */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold">پیش‌نمایش چاپ سند رسمی قرارداد حقوقی</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              چاپ سند (Print / PDF)
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Contract Document */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50 print:bg-white print:p-0">
          <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-sm border border-slate-200 print:border-none print:shadow-none space-y-6 text-slate-900 text-xs leading-relaxed">
            {/* Official Header */}
            <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-slate-500">بسمه تعالی</div>
                <h1 className="text-base font-bold text-slate-900">
                  {contract.generalInfo.title}
                </h1>
                <div className="text-xs text-slate-600 font-mono">
                  شماره ثبت قرارداد: {contract.generalInfo.contractNumber} | شناسه سیستمی: {contract.contractId}
                </div>
              </div>
              <div className="text-left font-mono text-[11px] space-y-0.5 text-slate-600">
                <div>تاریخ صدور: {contract.duration.startDate}</div>
                <div>انقضا: {contract.duration.endDate}</div>
                <div>پیوست: دارد (۳ برگ)</div>
              </div>
            </div>

            {/* Article 1: Parties */}
            <div className="space-y-2">
              <h2 className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-1">
                ماده ۱: طرفین قرارداد
              </h2>
              <p className="text-justify">
                این قرارداد در تاریخ <strong>{contract.duration.startDate}</strong> فیمابین{' '}
                <strong>شرکت حمل و نقل سراسری خلیج فارس</strong> با شناسه ملی ۱۰۱۰۱۲۹۴۸۱۱ به نمایندگی{' '}
                <strong>{contract.parties.internalSignatory.fullName}</strong> ({contract.parties.internalSignatory.position}) به عنوان طرف اول (متصدی حمل)، و شرکت{' '}
                <strong>{contract.parties.counterparty.companyName}</strong> با شناسه ملی{' '}
                <strong>{contract.parties.counterparty.nationalId}</strong> به نشانی{' '}
                {contract.parties.counterparty.address} به نمایندگی{' '}
                <strong>{contract.parties.counterpartySignatory.fullName}</strong> ({contract.parties.counterpartySignatory.position}) به عنوان طرف دوم (کارفرما) منعقد گردید.
              </p>
            </div>

            {/* Article 2: Subject & Scope */}
            <div className="space-y-2">
              <h2 className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-1">
                ماده ۲: موضوع قرارداد و محدوده خدمات
              </h2>
              <p className="text-justify">{contract.scopeOfService.description}</p>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1 text-[11px]">
                <div>• مسیرهای تحت پوشش: {contract.scopeOfService.coveredRoutesOrZones.join(' — ')}</div>
                <div>• نوع محمولات مجاز: {contract.scopeOfService.allowedCommodityTypes.join(' — ')}</div>
                <div>• ظرفیت ناوگان اختصاصی: {contract.scopeOfService.allocatedFleetCapacity.truckCount} دستگاه کشنده با حداقل تعهد ماهانه {contract.scopeOfService.allocatedFleetCapacity.monthlyMinTonnage.toLocaleString('fa-IR')} تن</div>
              </div>
            </div>

            {/* Article 3: Duration */}
            <div className="space-y-2">
              <h2 className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-1">
                ماده ۳: مدت قرارداد
              </h2>
              <p className="text-justify">
                مدت این قرارداد از تاریخ <strong>{contract.duration.startDate}</strong> لغایت{' '}
                <strong>{contract.duration.endDate}</strong> به مدت <strong>{contract.duration.durationMonths} ماه شمسی</strong> می‌باشد و در صورت رضایت طرفین قابل تمدید خواهد بود.
              </p>
            </div>

            {/* Article 4: Financial Amount */}
            <div className="space-y-2">
              <h2 className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-1">
                ماده ۴: مبلغ قرارداد و شرایط پرداخت
              </h2>
              <p className="text-justify">
                مبلغ برآوردی کل قرارداد معادل{' '}
                <strong>{(contract.financialTerms.totalAmountToman / 1000000).toLocaleString('fa-IR')} میلیون تومان</strong> می‌باشد که مطابق صورت‌وضعیت‌های تسلیمی و جدول اقساط مندرج در پیوست تسویه خواهد شد.
              </p>
              <p className="text-[11px] text-slate-600">{contract.financialTerms.priceAdjustmentClause}</p>
            </div>

            {/* Article 5: SLA & Liability */}
            <div className="space-y-2">
              <h2 className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-1">
                ماده ۵: بیمه و مسئولیت‌ها
              </h2>
              <p className="text-justify">
                متصدی حمل متعهد به حفظ پوشش بیمه‌نامه جامع شماره{' '}
                <strong>{contract.obligations.liabilityInsurance.policyNumber}</strong> نزد{' '}
                <strong>{contract.obligations.liabilityInsurance.insurerName}</strong> تا سقف{' '}
                {(contract.obligations.liabilityInsurance.coverageAmountToman / 1000000000).toLocaleString('fa-IR')} میلیارد تومان می‌باشد.
              </p>
            </div>

            {/* Article 6: Dispute Resolution */}
            <div className="space-y-2">
              <h2 className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-1">
                ماده ۶: حل اختلاف و داوری
              </h2>
              <p className="text-justify">
                کلیه اختلافات ناشی از این قرارداد در ابتدا از طریق مذاکره و در صورت عدم حصول توافق، از طریق{' '}
                <strong>{contract.legalCompliance.arbitrationCenterName}</strong> حل و فصل خواهد شد.
              </p>
            </div>

            {/* Signatures & Seals */}
            <div className="pt-8 border-t-2 border-slate-900 grid grid-cols-2 gap-8 text-center">
              <div className="space-y-12">
                <div className="font-bold">امضا و مهر طرف اول (شرکت حمل و نقل)</div>
                <div className="font-semibold text-slate-800">
                  {contract.parties.internalSignatory.fullName}
                  <div className="text-[11px] text-slate-500">{contract.parties.internalSignatory.position}</div>
                </div>
              </div>

              <div className="space-y-12">
                <div className="font-bold">امضا و مهر طرف دوم (کارفرما / شرکت طرف قرارداد)</div>
                <div className="font-semibold text-slate-800">
                  {contract.parties.counterpartySignatory.fullName}
                  <div className="text-[11px] text-slate-500">{contract.parties.counterpartySignatory.position}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
