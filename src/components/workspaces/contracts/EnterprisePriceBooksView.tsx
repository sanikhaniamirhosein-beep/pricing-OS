import React, { useState } from 'react';
import {
  Building2,
  Calendar,
  DollarSign,
  Plus,
  Edit2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Search,
  Sparkles,
  TrendingDown,
  Award,
  Clock,
  Trash2,
  X,
  Layers,
  FileCheck,
  Hash,
  Briefcase,
  Percent,
} from 'lucide-react';
import { usePricing } from '../../../store/PricingContext';
import { LogisticsContract, VolumeBand } from '../../../types/pricing';
import { ModernSelect } from '../../common/menus/ModernSelect';

export const EnterprisePriceBooksView: React.FC = () => {
  const { contracts, addContract, updateContract } = usePricing();
  const [selectedContract, setSelectedContract] = useState<LogisticsContract | null>(contracts?.[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State for creating/editing contract
  const [formDisplayId, setFormDisplayId] = useState('');
  const [formCustomerNameFa, setFormCustomerNameFa] = useState('');
  const [formCustomerNameEn, setFormCustomerNameEn] = useState('');
  const [formCustomerCode, setFormCustomerCode] = useState('');
  const [formIndustry, setFormIndustry] = useState('پتروشیمی و گاز');
  const [formTier, setFormTier] = useState<'Diamond' | 'Platinum' | 'Gold' | 'Silver'>('Platinum');
  const [formCommitmentTons, setFormCommitmentTons] = useState<number>(45000);
  const [formPenaltyPerTon, setFormPenaltyPerTon] = useState<number>(120000);
  const [formFuelAbsorption, setFormFuelAbsorption] = useState<number>(50);
  const [formEffectiveFrom, setFormEffectiveFrom] = useState('1403/01/01');
  const [formEffectiveTo, setFormEffectiveTo] = useState('1403/12/29');
  const [formVolumeBands, setFormVolumeBands] = useState<VolumeBand[]>([
    { minTonsPerMonth: 0, maxTonsPerMonth: 5000, discountPercent: 2.0, unitRateDiscountTomanPerTonKm: 0 },
    { minTonsPerMonth: 5000, maxTonsPerMonth: 15000, discountPercent: 5.5, unitRateDiscountTomanPerTonKm: 1200 },
    { minTonsPerMonth: 15000, maxTonsPerMonth: 999999, discountPercent: 8.5, unitRateDiscountTomanPerTonKm: 2500 },
  ]);
  const [formOverrides, setFormOverrides] = useState<{ corridor: string; rate: number }[]>([
    { corridor: 'عسلویه به تهران', rate: 24500000 },
    { corridor: 'بندرعباس به اصفهان', rate: 29000000 },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    const newId = `CT-${Math.floor(400 + Math.random() * 500)}`;
    setFormDisplayId(newId);
    setFormCustomerNameFa('');
    setFormCustomerNameEn('');
    setFormCustomerCode(`CUST-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormIndustry('پتروشیمی و گاز');
    setFormTier('Diamond');
    setFormCommitmentTons(50000);
    setFormPenaltyPerTon(150000);
    setFormFuelAbsorption(60);
    setFormEffectiveFrom('1403/01/01');
    setFormEffectiveTo('1403/12/29');
    setFormVolumeBands([
      { minTonsPerMonth: 0, maxTonsPerMonth: 5000, discountPercent: 2.0, unitRateDiscountTomanPerTonKm: 0 },
      { minTonsPerMonth: 5000, maxTonsPerMonth: 15000, discountPercent: 6.0, unitRateDiscountTomanPerTonKm: 1500 },
      { minTonsPerMonth: 15000, maxTonsPerMonth: 999999, discountPercent: 9.0, unitRateDiscountTomanPerTonKm: 3000 },
    ]);
    setFormOverrides([
      { corridor: 'بندرعباس به اصفهان', rate: 28500000 },
      { corridor: 'عسلویه به تبریز', rate: 36000000 },
    ]);
    setIsContractModalOpen(true);
  };

  const handleOpenEditModal = (contract: LogisticsContract) => {
    setModalMode('edit');
    setFormDisplayId(contract.displayId);
    setFormCustomerNameFa(contract.customerNameFa);
    setFormCustomerNameEn(contract.customerNameEn);
    setFormCustomerCode(contract.customerCode);
    setFormIndustry(contract.industry);
    setFormTier(contract.tier);
    setFormCommitmentTons(contract.minimumCommitmentTons);
    setFormPenaltyPerTon(contract.penaltyClausePerTonShortfallToman);
    setFormFuelAbsorption(contract.fuelIndexAbsorptionPercent);
    setFormEffectiveFrom(contract.effectiveFrom);
    setFormEffectiveTo(contract.effectiveTo);
    setFormVolumeBands(contract.volumeBands?.length ? [...contract.volumeBands] : []);
    const overrides = Object.entries(contract.negotiatedBaseOverrides || {}).map(([corridor, rate]) => ({
      corridor,
      rate: Number(rate),
    }));
    setFormOverrides(overrides);
    setIsContractModalOpen(true);
  };

  const handleSaveContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCustomerNameFa.trim()) {
      alert('لطفاً نام شرکت یا مشتری را وارد کنید.');
      return;
    }

    const overridesObj: Record<string, number> = {};
    formOverrides.forEach((o) => {
      if (o.corridor.trim() && o.rate > 0) {
        overridesObj[o.corridor.trim()] = o.rate;
      }
    });

    if (modalMode === 'create') {
      const newContract: LogisticsContract = {
        contractId: `contract-${Date.now()}`,
        displayId: formDisplayId || `CT-${Math.floor(400 + Math.random() * 500)}`,
        customerNameFa: formCustomerNameFa.trim(),
        customerNameEn: formCustomerNameEn.trim() || 'Enterprise Client',
        customerCode: formCustomerCode.trim() || `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
        industry: formIndustry,
        tier: formTier,
        minimumCommitmentTons: Number(formCommitmentTons) || 0,
        penaltyClausePerTonShortfallToman: Number(formPenaltyPerTon) || 0,
        fuelIndexAbsorptionPercent: Number(formFuelAbsorption) || 0,
        effectiveFrom: formEffectiveFrom,
        effectiveTo: formEffectiveTo,
        volumeBands: formVolumeBands,
        negotiatedBaseOverrides: overridesObj,
        status: 'Active',
        version: 1,
      };

      addContract(newContract);
      setSelectedContract(newContract);
      showToast(`دفترچه قیمت جدید "${newContract.customerNameFa}" با موفقیت افتتاح و فعال شد.`);
    } else if (selectedContract) {
      const updated: LogisticsContract = {
        ...selectedContract,
        customerNameFa: formCustomerNameFa.trim(),
        customerNameEn: formCustomerNameEn.trim() || selectedContract.customerNameEn,
        customerCode: formCustomerCode.trim(),
        industry: formIndustry,
        tier: formTier,
        minimumCommitmentTons: Number(formCommitmentTons) || 0,
        penaltyClausePerTonShortfallToman: Number(formPenaltyPerTon) || 0,
        fuelIndexAbsorptionPercent: Number(formFuelAbsorption) || 0,
        effectiveFrom: formEffectiveFrom,
        effectiveTo: formEffectiveTo,
        volumeBands: formVolumeBands,
        negotiatedBaseOverrides: overridesObj,
        version: (selectedContract.version || 1) + 1,
      };

      updateContract(updated);
      setSelectedContract(updated);
      showToast(`تغییرات دفترچه قیمت "${updated.customerNameFa}" با موفقیت ثبت و ذخیره شد.`);
    }

    setIsContractModalOpen(false);
  };

  const handleAddVolumeBand = () => {
    const lastBand = formVolumeBands[formVolumeBands.length - 1];
    const newMin = lastBand ? lastBand.maxTonsPerMonth : 0;
    setFormVolumeBands([
      ...formVolumeBands,
      {
        minTonsPerMonth: newMin,
        maxTonsPerMonth: newMin + 10000,
        discountPercent: (lastBand ? lastBand.discountPercent + 2 : 3),
        unitRateDiscountTomanPerTonKm: (lastBand ? lastBand.unitRateDiscountTomanPerTonKm + 1000 : 1000),
      },
    ]);
  };

  const handleRemoveVolumeBand = (idx: number) => {
    setFormVolumeBands(formVolumeBands.filter((_, i) => i !== idx));
  };

  const handleAddOverride = () => {
    setFormOverrides([...formOverrides, { corridor: 'تهران به مشهد', rate: 22000000 }]);
  };

  const handleRemoveOverride = (idx: number) => {
    setFormOverrides(formOverrides.filter((_, i) => i !== idx));
  };

  const filteredContracts = (contracts || []).filter(
    (c) =>
      c?.customerNameFa?.includes(searchQuery) ||
      c?.customerCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c?.industry?.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 bg-emerald-500 text-white rounded-2xl shadow-lg flex items-center justify-between text-xs font-bold animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 font-title">
                  ۲.۱ مدیریت دفترچه‌های قیمت شرکتی (Enterprise Price Books)
                </h1>
                <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {(contracts || []).length} قرارداد فعال
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                تعریف تعرفه‌های اختصاصی، ماتریس‌های توافقی با مشتریان کلیدی (هلدینگ‌های پتروشیمی، فولاد و مواد غذایی) و دوره‌های اعتبار ۶ ماهه و ۱ ساله
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="open-new-pricebook-btn"
              onClick={handleOpenCreateModal}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              افتتاح دفترچه قیمت جدید
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Contracts List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو بر اساس نام شرکت یا کد..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div className="space-y-2">
              {filteredContracts.map((contract) => {
                const isSelected = selectedContract?.contractId === contract.contractId;
                return (
                  <div
                    key={contract.contractId}
                    onClick={() => setSelectedContract(contract)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100/60 px-1.5 py-0.5 rounded">
                          {contract.customerCode}
                        </span>
                        <h3 className="text-xs font-bold text-slate-900 mt-1 leading-snug">
                          {contract.customerNameFa}
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">{contract.industry}</p>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          contract.tier === 'Diamond'
                            ? 'bg-blue-100 text-blue-800'
                            : contract.tier === 'Platinum'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {contract.tier}
                      </span>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        اعتبار تا: {contract.effectiveTo}
                      </span>
                      <span className="font-bold font-mono text-slate-700">
                        {contract.minimumCommitmentTons.toLocaleString('fa-IR')} تن/سال
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Selected Price Book Detail (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {selectedContract ? (
            <>
              {/* Contract Summary Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                        {selectedContract.displayId}
                      </span>
                      <h2 className="text-base font-bold text-slate-900 font-title">
                        {selectedContract.customerNameFa}
                      </h2>
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {selectedContract.customerNameEn}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id="edit-selected-contract-btn"
                      onClick={() => handleOpenEditModal(selectedContract)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                      ویرایش دفترچه
                    </button>
                    <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-xl font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      قرارداد معتبر و جاری
                    </span>
                  </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">سطح مشتری (Tier):</span>
                    <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                      {selectedContract.tier}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">تعهد حداقل بارگیری:</span>
                    <span className="font-mono font-bold text-slate-800 text-sm mt-0.5 block">
                      {selectedContract.minimumCommitmentTons.toLocaleString('fa-IR')} تن
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">جریمه عدم ایفای تعهد:</span>
                    <span className="font-mono font-bold text-amber-800 text-sm mt-0.5 block">
                      {selectedContract.penaltyClausePerTonShortfallToman.toLocaleString('fa-IR')} ت/تن
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">پوشش شاخص سوخت:</span>
                    <span className="font-mono font-bold text-blue-700 text-sm mt-0.5 block">
                      %{selectedContract.fuelIndexAbsorptionPercent}
                    </span>
                  </div>
                </div>

                {/* Validity Period Banner */}
                <div className="flex items-center justify-between bg-amber-50/50 p-3.5 rounded-2xl border border-amber-100 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <span>دوره اعتبار تعرفه دفترچه:</span>
                    <span className="font-bold font-mono">
                      {selectedContract.effectiveFrom} تا {selectedContract.effectiveTo}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-amber-800">نسخه {selectedContract.version || 1}</span>
                </div>
              </div>

              {/* Volume Discount Bands */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-amber-600" />
                    <h3 className="text-sm font-bold text-slate-900 font-title">
                      پله‌های تخفیف تناژ ماهانه (Volume-based Discount Bands)
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">تخفیف پله‌ای پلکانی</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">پله تناژ ماهانه (از - تا)</th>
                        <th className="py-3 px-4">درصد تخفیف</th>
                        <th className="py-3 px-4">کسر نرخ بر واحد تن-کیلومتر</th>
                        <th className="py-3 px-4">وضعیت شمول</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {(selectedContract?.volumeBands || []).map((band, bIdx) => (
                        <tr key={bIdx} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-mono font-bold">
                            {band.minTonsPerMonth.toLocaleString('fa-IR')} تا{' '}
                            {band.maxTonsPerMonth > 500000
                              ? 'بالای ۲۵,۰۰۰ تن'
                              : `${band.maxTonsPerMonth.toLocaleString('fa-IR')} تن`}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              %{band.discountPercent}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-700">
                            {band.unitRateDiscountTomanPerTonKm > 0
                              ? `-${band.unitRateDiscountTomanPerTonKm.toLocaleString('fa-IR')} تومان`
                              : 'نرخ استاندارد'}
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                              محاسبه خودکار در فاکتور
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Negotiated Base Corridor Overrides */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-600" />
                    <h3 className="text-sm font-bold text-slate-900 font-title">
                      نرخ‌های توافقی ویژه کریدورهای اختصاصی (Negotiated Base Overrides)
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(selectedContract?.negotiatedBaseOverrides || {}).map(([corridor, rate]) => (
                    <div
                      key={corridor}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{corridor}</span>
                        <span className="text-[11px] text-emerald-700 font-bold block mt-0.5">
                          تخفیف ویژه قرارداد کلان
                        </span>
                      </div>
                      <span className="font-mono font-bold text-sm text-slate-900 bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-2xs">
                        {Number(rate).toLocaleString('fa-IR')} تومان
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-400 text-xs">
              یک دفترچه قیمت را از لیست سمت راست انتخاب کنید.
            </div>
          )}
        </div>
      </div>

      {/* Modal for Creating / Editing Price Book Contract */}
      {isContractModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold font-title">
                    {modalMode === 'create' ? 'افتتاح دفترچه قیمت شرکتی جدید' : `ویرایش دفترچه قیمت (${formDisplayId})`}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    تعریف مشخصات حقوقی، تعهد تناژ، پله‌های تخفیف پلکانی و نرخ‌های توافقی کریدورها
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsContractModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveContract} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Section 1: Customer Identity */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Briefcase className="w-4 h-4 text-amber-600" />
                  <h3 className="text-xs font-bold text-slate-900">۱. مشخصات هویتی و حقوقی مشتری</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">نام رسمی شرکت (فارسی) *</label>
                    <input
                      type="text"
                      required
                      value={formCustomerNameFa}
                      onChange={(e) => setFormCustomerNameFa(e.target.value)}
                      placeholder="مثال: شرکت پتروشیمی زاگرس"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">نام انگلیسی شرکت</label>
                    <input
                      type="text"
                      value={formCustomerNameEn}
                      onChange={(e) => setFormCustomerNameEn(e.target.value)}
                      placeholder="مثال: Zagros Petrochemical Co."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono text-slate-900 focus:bg-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">شناسه / کد مشتری *</label>
                    <input
                      type="text"
                      required
                      value={formCustomerCode}
                      onChange={(e) => setFormCustomerCode(e.target.value)}
                      placeholder="مثال: CUST-ZAGROS"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold text-amber-900 focus:bg-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <ModernSelect
                      id="contract-modal-industry"
                      value={formIndustry}
                      onChange={setFormIndustry}
                      label="صنعت و رسته تجاری"
                      options={[
                        { value: 'پتروشیمی و گاز', label: 'پتروشیمی، نفت و گاز', badge: 'پتروشیمی' },
                        { value: 'صنایع فلزی و فولاد', label: 'صنایع فولاد، آهن‌آلات و فلزات', badge: 'فولاد' },
                        { value: 'صنایع غذایی و کشاورزی', label: 'مواد غذایی، لبنیات و کشاورزی', badge: 'غذا' },
                        { value: 'کاشی و سرامیک', label: 'کاشی، سرامیک و مصالح ساختمانی', badge: 'مصالح' },
                        { value: 'معدن و سیمان', label: 'سیمان، کلینکر و مواد معدنی', badge: 'معدن' },
                        { value: 'صنایع دارویی و بهداشتی', label: 'شوینده، بهداشتی و دارویی', badge: 'دارو' },
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">رده مشتری (Tier)</label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['Diamond', 'Platinum', 'Gold', 'Silver'] as const).map((tier) => (
                        <button
                          key={tier}
                          type="button"
                          onClick={() => setFormTier(tier)}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            formTier === tier
                              ? tier === 'Diamond'
                                ? 'bg-blue-600 text-white border-blue-600'
                                : tier === 'Platinum'
                                ? 'bg-purple-600 text-white border-purple-600'
                                : 'bg-amber-600 text-white border-amber-600'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {tier}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Commitment & Terms */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <DollarSign className="w-4 h-4 text-amber-600" />
                  <h3 className="text-xs font-bold text-slate-900">۲. تعهد تناژ، جریمه‌ها و دوره اعتبار</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">حداقل تعهد بارگیری سالانه (تن)</label>
                    <input
                      type="number"
                      step="1000"
                      value={formCommitmentTons}
                      onChange={(e) => setFormCommitmentTons(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">جریمه کسری تناژ (تومان / تن)</label>
                    <input
                      type="number"
                      step="10000"
                      value={formPenaltyPerTon}
                      onChange={(e) => setFormPenaltyPerTon(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold text-rose-800 focus:bg-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">درصد جذب نوسان شاخص سوخت (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formFuelAbsorption}
                      onChange={(e) => setFormFuelAbsorption(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold text-blue-800 focus:bg-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">تاریخ شروع اعتبار تعرفه</label>
                    <input
                      type="text"
                      value={formEffectiveFrom}
                      onChange={(e) => setFormEffectiveFrom(e.target.value)}
                      placeholder="1403/01/01"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono text-slate-900 focus:bg-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">تاریخ انقضای اعتبار تعرفه</label>
                    <input
                      type="text"
                      value={formEffectiveTo}
                      onChange={(e) => setFormEffectiveTo(e.target.value)}
                      placeholder="1403/12/29"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono text-slate-900 focus:bg-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Volume Discount Bands */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-amber-600" />
                    <h3 className="text-xs font-bold text-slate-900">۳. پله‌های تخفیف پلکانی تناژ ماهانه</h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddVolumeBand}
                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    افزودن پله تناژ
                  </button>
                </div>

                <div className="space-y-2">
                  {formVolumeBands.map((band, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <div className="flex-1 grid grid-cols-4 gap-2">
                        <div>
                          <span className="text-[10px] text-slate-400 block mb-0.5">از (تن/ماه):</span>
                          <input
                            type="number"
                            value={band.minTonsPerMonth}
                            onChange={(e) => {
                              const next = [...formVolumeBands];
                              next[idx].minTonsPerMonth = Number(e.target.value);
                              setFormVolumeBands(next);
                            }}
                            className="w-full bg-white border border-slate-200 rounded-lg p-1.5 font-mono text-xs"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block mb-0.5">تا (تن/ماه):</span>
                          <input
                            type="number"
                            value={band.maxTonsPerMonth}
                            onChange={(e) => {
                              const next = [...formVolumeBands];
                              next[idx].maxTonsPerMonth = Number(e.target.value);
                              setFormVolumeBands(next);
                            }}
                            className="w-full bg-white border border-slate-200 rounded-lg p-1.5 font-mono text-xs"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block mb-0.5">درصد تخفیف (%):</span>
                          <input
                            type="number"
                            step="0.5"
                            value={band.discountPercent}
                            onChange={(e) => {
                              const next = [...formVolumeBands];
                              next[idx].discountPercent = Number(e.target.value);
                              setFormVolumeBands(next);
                            }}
                            className="w-full bg-white border border-slate-200 rounded-lg p-1.5 font-mono font-bold text-emerald-700 text-xs"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block mb-0.5">کسر تن-کیلومتر (تومان):</span>
                          <input
                            type="number"
                            step="500"
                            value={band.unitRateDiscountTomanPerTonKm}
                            onChange={(e) => {
                              const next = [...formVolumeBands];
                              next[idx].unitRateDiscountTomanPerTonKm = Number(e.target.value);
                              setFormVolumeBands(next);
                            }}
                            className="w-full bg-white border border-slate-200 rounded-lg p-1.5 font-mono text-xs"
                          />
                        </div>
                      </div>

                      {formVolumeBands.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveVolumeBand(idx)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4: Negotiated Corridor Overrides */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-600" />
                    <h3 className="text-xs font-bold text-slate-900">۴. نرخ‌های توافقی اختصاصی کریدورها</h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddOverride}
                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    افزودن کریدور
                  </button>
                </div>

                <div className="space-y-2">
                  {formOverrides.map((override, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-[10px] text-slate-400 block mb-0.5">نام کریدور (مبدأ به مقصد):</span>
                          <input
                            type="text"
                            value={override.corridor}
                            onChange={(e) => {
                              const next = [...formOverrides];
                              next[idx].corridor = e.target.value;
                              setFormOverrides(next);
                            }}
                            placeholder="مثال: بندرعباس به تهران"
                            className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs font-bold"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block mb-0.5">نرخ مقطوع توافقی (تومان):</span>
                          <input
                            type="number"
                            step="500000"
                            value={override.rate}
                            onChange={(e) => {
                              const next = [...formOverrides];
                              next[idx].rate = Number(e.target.value);
                              setFormOverrides(next);
                            }}
                            className="w-full bg-white border border-slate-200 rounded-lg p-1.5 font-mono font-bold text-slate-900 text-xs"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveOverride(idx)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsContractModalOpen(false)}
                  className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {modalMode === 'create' ? 'افتتاح و ثبت رسمی دفترچه قیمت' : 'ذخیره تغییرات دفترچه'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
