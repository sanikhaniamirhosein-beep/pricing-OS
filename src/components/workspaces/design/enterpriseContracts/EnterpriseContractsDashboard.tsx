import React, { useState } from 'react';
import {
  Building2,
  FileText,
  Search,
  Plus,
  Edit,
  Printer,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers,
  Calendar,
  DollarSign,
  Truck,
  Scale,
  Lock,
  Activity,
  ChevronLeft,
  ChevronRight,
  Filter,
  Eye,
  Hash,
  Download,
  Share2,
  FileSpreadsheet,
} from 'lucide-react';
import { EnterpriseCorporateContract } from '../../../../types/enterpriseContract';
import { INITIAL_ENTERPRISE_CONTRACTS } from '../../../../data/mockEnterpriseContracts';
import { ContractGeneralInfoTab } from './ContractGeneralInfoTab';
import { ContractPartiesTab } from './ContractPartiesTab';
import { ContractDurationTab } from './ContractDurationTab';
import { ContractFinancialsTab } from './ContractFinancialsTab';
import { ContractScopeSlaTab } from './ContractScopeSlaTab';
import { ContractObligationsTab } from './ContractObligationsTab';
import { ContractTerminationTab } from './ContractTerminationTab';
import { ContractDocumentsTab } from './ContractDocumentsTab';
import { ContractLegalComplianceTab } from './ContractLegalComplianceTab';
import { ContractSystemRelationsTab } from './ContractSystemRelationsTab';
import { ContractAuditMetadataTab } from './ContractAuditMetadataTab';
import { AddEditEnterpriseContractModal } from './AddEditEnterpriseContractModal';
import { ContractPrintPreviewModal } from './ContractPrintPreviewModal';

export const EnterpriseContractsDashboard: React.FC = () => {
  const [contractsList, setContractsList] = useState<EnterpriseCorporateContract[]>(
    INITIAL_ENTERPRISE_CONTRACTS
  );
  const [selectedContractId, setSelectedContractId] = useState<string>(
    INITIAL_ENTERPRISE_CONTRACTS[0]?.id || ''
  );
  const [activeSectionTab, setActiveSectionTab] = useState<number>(1);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Modals
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<EnterpriseCorporateContract | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const selectedContract =
    contractsList.find((c) => c.id === selectedContractId) || contractsList[0] || null;

  // Filtered List
  const filteredContracts = contractsList.filter((c) => {
    const matchesSearch =
      c.generalInfo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.parties.counterparty.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contractId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.generalInfo.contractNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatusFilter === 'all' || c.generalInfo.status === selectedStatusFilter;

    const matchesType =
      selectedTypeFilter === 'all' || c.generalInfo.contractType === selectedTypeFilter;

    const matchesCategory =
      selectedCategoryFilter === 'all' || c.generalInfo.category === selectedCategoryFilter;

    return matchesSearch && matchesStatus && matchesType && matchesCategory;
  });

  const handleSaveContract = (contract: EnterpriseCorporateContract) => {
    const existingIdx = contractsList.findIndex((c) => c.id === contract.id);
    if (existingIdx >= 0) {
      const updated = [...contractsList];
      updated[existingIdx] = contract;
      setContractsList(updated);
      showToast(`قرارداد ${contract.generalInfo.contractNumber} با موفقیت به‌روزرسانی شد.`);
    } else {
      setContractsList([contract, ...contractsList]);
      setSelectedContractId(contract.id);
      showToast(`قرارداد سازمانی جدید (${contract.contractId}) با موفقیت ثبت گردید.`);
    }
  };

  const handleDeleteContract = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('آیا از حذف این پرونده قرارداد از سامانه اطمینان دارید؟')) {
      const remaining = contractsList.filter((c) => c.id !== id);
      setContractsList(remaining);
      if (selectedContractId === id && remaining.length > 0) {
        setSelectedContractId(remaining[0].id);
      }
      showToast('پرونده قرارداد حذف گردید.');
    }
  };

  const totalPortfolioValueToman = contractsList.reduce(
    (acc, curr) => acc + (curr.financialTerms?.totalAmountToman || 0),
    0
  );

  const totalCommittedTonnage = contractsList.reduce(
    (acc, curr) => acc + (curr.scopeOfService?.allocatedFleetCapacity?.monthlyMinTonnage || 0) * 12,
    0
  );

  const sectionTabs = [
    { id: 1, label: '۱. اطلاعات پایه', icon: FileText, desc: 'شناسه، وضعیت و نوع' },
    { id: 2, label: '۲. طرفین و نمایندگان', icon: Building2, desc: 'مشخصات و امضاها' },
    { id: 3, label: '۳. بازه زمانی و تمدید', icon: Calendar, desc: 'مواعد و یادآورها' },
    { id: 4, label: '۴. شرایط مالی و اقساط', icon: DollarSign, desc: 'مبالغ، تعرفه و تعدیل' },
    { id: 5, label: '۵. محدوده خدمات و SLA', icon: Truck, desc: 'مسیرها، ناوگان و سطح خدمت' },
    { id: 6, label: '۶. تعهدات و بیمه', icon: ShieldCheck, desc: 'مسئولیت‌ها و پوشش تمام‌خطر' },
    { id: 7, label: '۷. شرایط فسخ', icon: AlertTriangle, desc: 'مواعد، جرائم و علل فوری' },
    { id: 8, label: '۸. اسناد و الحاقیه‌ها', icon: Layers, desc: 'فایل PDF، پیوست‌ها و نسخ' },
    { id: 9, label: '۹. حقوقی و انطباق', icon: Scale, desc: 'قانون حاکم و مراجع داوری' },
    { id: 10, label: '۱۰. ارتباطات سیستمی', icon: Activity, desc: 'ناوگان، فاکتورها، KPI' },
    { id: 11, label: '۱۱. متادیتای مدیریتی', icon: Lock, desc: 'حسابرسی و محرمانگی' },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 left-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-indigo-500/30 flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top High-Craft Metrics Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>تعداد کل قراردادهای شرکتی</span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">
            {contractsList.length} شرکت طرف قرارداد
          </div>
          <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            {contractsList.filter((c) => c.generalInfo.status === 'active').length} قرارداد فعال و جاری
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>مجموع ارزش پرتفوی قراردادها</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-700">
            {(totalPortfolioValueToman / 1000000000).toLocaleString('fa-IR')} مـ میلیارد تومان
          </div>
          <p className="text-[11px] text-slate-500">ارزش کل تعهدات جابجایی کالا در سال ۱۴۰۵</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>تعهد تناژ کل سالانه ناوگان</span>
            <Truck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">
            {totalCommittedTonnage.toLocaleString('fa-IR')} تن بار
          </div>
          <p className="text-[11px] text-slate-500">توزیع شده روی خطوط ترانزیتی و صنعتی</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>شاخص انطباق حقوقی و بیمه</span>
            <ShieldCheck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-xl font-bold font-mono text-teal-700">۱۰۰٪ تایید شده</div>
          <p className="text-[11px] text-slate-500">پوشش کامل All-Risk و داوری اتاق بازرگانی</p>
        </div>
      </div>

      {/* Main Workspace Split: Left/Right Master-Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side (Desktop 4 cols): Contracts List & Filters */}
        <div className="lg:col-span-4 space-y-4">
          {/* Action Bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                فهرست قراردادهای هر شرکت
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingContract(null);
                  setIsAddEditModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-2xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                افزودن قرارداد جدید
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی نام شرکت، شناسه یا شماره ثبت..."
                className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Quick Filters */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-medium"
              >
                <option value="all">همه وضعیت‌ها</option>
                <option value="active">فعال</option>
                <option value="pending_sign">در انتظار امضا</option>
                <option value="draft">پیش‌نویس</option>
                <option value="renewing">در حال تمدید</option>
              </select>

              <select
                value={selectedTypeFilter}
                onChange={(e) => setSelectedTypeFilter(e.target.value)}
                className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-medium"
              >
                <option value="all">همه انواع خدمات</option>
                <option value="freight_transport">حمل‌ونقل باری</option>
                <option value="fleet_contracting">پیمانکاری ناوگان</option>
                <option value="logistics_services">خدمات لجستیک</option>
                <option value="intercompany_cooperation">همکاری بین‌شرکتی</option>
              </select>
            </div>
          </div>

          {/* Contracts Scrollable Cards List */}
          <div className="space-y-2.5 max-h-[calc(100vh-320px)] overflow-y-auto pr-0.5">
            {filteredContracts.length > 0 ? (
              filteredContracts.map((c) => {
                const isSelected = c.id === selectedContractId;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedContractId(c.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden text-xs ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-400 shadow-sm ring-1 ring-indigo-400/50'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                            {c.contractId}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              c.generalInfo.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {c.generalInfo.status === 'active' ? 'فعال' : 'در جریان'}
                          </span>
                        </div>
                        <div className="font-bold text-slate-900 truncate">
                          {c.parties.counterparty.companyName}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {c.generalInfo.title}
                        </div>
                      </div>

                      <div className="text-left shrink-0">
                        <div className="font-mono font-bold text-indigo-700 text-xs">
                          {(c.financialTerms.totalAmountToman / 1000000000).toLocaleString('fa-IR')} مـ ت
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {c.duration.durationMonths} ماهه
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-100/80 text-[11px] text-slate-500">
                      <span>تاریخ پایان: {c.duration.endDate}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingContract(c);
                            setIsAddEditModalOpen(true);
                          }}
                          className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-white"
                          title="ویرایش قرارداد"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteContract(c.id, e)}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-white"
                          title="حذف قرارداد"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-400">
                قراردادی با مشخصات جستجو یافت نشد.
              </div>
            )}
          </div>
        </div>

        {/* Right Side (Desktop 8 cols): Detailed 11-Section Master Dossier View */}
        <div className="lg:col-span-8 space-y-4">
          {selectedContract ? (
            <div className="space-y-4">
              {/* Dossier Action Bar */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 font-bold font-mono text-sm border border-indigo-100">
                    {selectedContract.displayId}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      پرونده جامع قرارداد {selectedContract.parties.counterparty.companyName}
                    </h3>
                    <div className="text-xs text-slate-500 font-mono">
                      شماره ثبت: {selectedContract.generalInfo.contractNumber} | شناسه: {selectedContract.contractId}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingContract(selectedContract);
                      setIsAddEditModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5 text-slate-600" />
                    ویرایش اطلاعات
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsPrintModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    پیش‌نمایش چاپ رسمی و PDF
                  </button>
                </div>
              </div>

              {/* 11 Section Tabs Navigation */}
              <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1.5">
                  {sectionTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeSectionTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveSectionTab(tab.id)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl text-center transition-all cursor-pointer ${
                          isActive
                            ? 'bg-indigo-600 text-white font-bold shadow-xs'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <Icon className={`w-4 h-4 mb-1 ${isActive ? 'text-white' : 'text-indigo-600'}`} />
                        <span className="text-[11px] truncate w-full">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Render Selected 11 Section Tab Component */}
              <div className="animate-in fade-in duration-150">
                {activeSectionTab === 1 && (
                  <ContractGeneralInfoTab contract={selectedContract} />
                )}
                {activeSectionTab === 2 && (
                  <ContractPartiesTab contract={selectedContract} />
                )}
                {activeSectionTab === 3 && (
                  <ContractDurationTab contract={selectedContract} />
                )}
                {activeSectionTab === 4 && (
                  <ContractFinancialsTab contract={selectedContract} />
                )}
                {activeSectionTab === 5 && (
                  <ContractScopeSlaTab contract={selectedContract} />
                )}
                {activeSectionTab === 6 && (
                  <ContractObligationsTab contract={selectedContract} />
                )}
                {activeSectionTab === 7 && (
                  <ContractTerminationTab contract={selectedContract} />
                )}
                {activeSectionTab === 8 && (
                  <ContractDocumentsTab contract={selectedContract} />
                )}
                {activeSectionTab === 9 && (
                  <ContractLegalComplianceTab contract={selectedContract} />
                )}
                {activeSectionTab === 10 && (
                  <ContractSystemRelationsTab contract={selectedContract} />
                )}
                {activeSectionTab === 11 && (
                  <ContractAuditMetadataTab contract={selectedContract} />
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
              قراردادی انتخاب نشده است.
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Contract Modal */}
      <AddEditEnterpriseContractModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        onSave={handleSaveContract}
        existingContract={editingContract}
      />

      {/* Official Print & PDF Preview Modal */}
      <ContractPrintPreviewModal
        contract={selectedContract}
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />
    </div>
  );
};
