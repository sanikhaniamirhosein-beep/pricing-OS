import React, { useState } from 'react';
import {
  DollarSign,
  PieChart,
  Percent,
  Truck,
  Building,
  Shield,
  Clock,
  Calculator,
  Save,
  CheckCircle2,
  Info,
  Sliders,
} from 'lucide-react';
import { usePricing } from '../../../store/PricingContext';

export const CommissionSplitsView: React.FC = () => {
  const { stakeholderSplits, updateStakeholderSplits } = usePricing();

  const [carrierCommission, setCarrierCommission] = useState<number>(stakeholderSplits.carrierCommissionPercent);
  const [rahdariTax, setRahdariTax] = useState<number>(stakeholderSplits.rahdariTaxPercent);
  const [insurancePercent, setInsurancePercent] = useState<number>(stakeholderSplits.mandatoryInsurancePercent);
  const [detentionShare, setDetentionShare] = useState<number>(stakeholderSplits.driverDetentionSharePercent);
  const [saved, setSaved] = useState(false);

  // Example Freight Calculator
  const [exampleFreightToman, setExampleFreightToman] = useState<number>(45000000); // 45M Toman

  const calculatedCarrierShareToman = Math.round(exampleFreightToman * (carrierCommission / 100));
  const calculatedRahdariTaxToman = Math.round(exampleFreightToman * (rahdariTax / 100));
  const calculatedInsuranceToman = Math.round(exampleFreightToman * (insurancePercent / 100));
  const calculatedDriverPayoutToman =
    exampleFreightToman - calculatedCarrierShareToman - calculatedRahdariTaxToman - calculatedInsuranceToman;
  const driverSharePercent = +(100 - carrierCommission - rahdariTax - insurancePercent).toFixed(1);

  const handleSave = () => {
    updateStakeholderSplits({
      carrierCommissionPercent: carrierCommission,
      rahdariTaxPercent: rahdariTax,
      mandatoryInsurancePercent: insurancePercent,
      driverDetentionSharePercent: detentionShare,
      carrierDetentionSharePercent: 100 - detentionShare,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 font-title">
                  ۶.۱ مدیریت کمیسیون و تسهیم سهم ذینفعان (Stakeholder Splits & Commissions)
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  سهم راننده: {driverSharePercent}٪
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                تفکیک قانونی و شفاف سهم شرکت باربری، عوارض ۴٪ راهداری، بیمه اجباری بارنامه و خالص دریافتی رانندگان (Driver Payout)
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer self-start md:self-auto"
          >
            <Save className="w-4 h-4" />
            ذخیره قوانین تسهیم
          </button>
        </div>

        {saved && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            قوانین تسهیم سهم ذینفعان با موفقیت ذخیره و در سامانه حسابداری اعمال گردید.
          </div>
        )}
      </div>

      {/* 2-Column Split Settings & Interactive Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Split Configuration Sliders (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 font-title">
                ضرایب درصدی تسهیم کرایه بارنامه
              </h2>
              <span className="text-xs font-mono text-slate-400">مجموع: ۱۰۰٪</span>
            </div>

            {/* Slider 1: Carrier Commission */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-amber-600" />
                  سهم کمیسیون شرکت حمل‌ونقل (باربری):
                </span>
                <span className="font-mono font-bold text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                  %{carrierCommission}
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="20"
                step="0.5"
                value={carrierCommission}
                onChange={(e) => setCarrierCommission(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">کارمزد خدمات نرم‌افزاری، صدور حواله و ضمانت پرداخت</p>
            </div>

            {/* Slider 2: Rahdari Tax (Legally 4%) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-blue-600" />
                  عوارض قانونی سازمان راهداری (دولتی):
                </span>
                <span className="font-mono font-bold text-xs bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
                  %{rahdariTax}
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="6"
                step="0.5"
                value={rahdariTax}
                onChange={(e) => setRahdariTax(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">واریز مستقیم به حساب خزانه سازمان راهداری و حمل و نقل جاده‌ای</p>
            </div>

            {/* Slider 3: Mandatory Insurance */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  حق بیمه اجباری حوادث بارنامه:
                </span>
                <span className="font-mono font-bold text-xs bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                  %{insurancePercent}
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={insurancePercent}
                onChange={(e) => setInsurancePercent(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">پوشش خسارت بدنه بار و مسئولیت مدنی حمل</p>
            </div>

            {/* Slider 4: Detention Split */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-purple-600" />
                  سهم راننده از حق توقف مازاد (Detention):
                </span>
                <span className="font-mono font-bold text-xs bg-purple-100 text-purple-900 px-2 py-0.5 rounded">
                  %{detentionShare}
                </span>
              </div>
              <input
                type="range"
                min="70"
                max="95"
                step="1"
                value={detentionShare}
                onChange={(e) => setDetentionShare(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">درصد پرداختی به راننده بابت معطلی مازاد در مبدأ یا مقصد</p>
            </div>
          </div>
        </div>

        {/* Right: Live Interactive Financial Breakdown Simulator (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900 font-title">
                  شبیه‌ساز و تفکیک مالی یک بارنامه نمونه (تومان)
                </h3>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                مبلغ کل کرایه ناخالص بارنامه (تومان):
              </label>
              <input
                type="number"
                step="1000000"
                value={exampleFreightToman}
                onChange={(e) => setExampleFreightToman(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-base font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Breakdown Cards */}
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-600" />
                  <span className="font-bold text-amber-950">سهم شرکت باربری (%{carrierCommission}):</span>
                </div>
                <span className="font-mono font-bold text-amber-900 text-sm">
                  {calculatedCarrierShareToman.toLocaleString('fa-IR')} تومان
                </span>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-600" />
                  <span className="font-bold text-blue-950">عوارض راهداری (%{rahdariTax}):</span>
                </div>
                <span className="font-mono font-bold text-blue-900 text-sm">
                  {calculatedRahdariTaxToman.toLocaleString('fa-IR')} تومان
                </span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-600" />
                  <span className="font-bold text-emerald-950">حق بیمه حوادث (%{insurancePercent}):</span>
                </div>
                <span className="font-mono font-bold text-emerald-900 text-sm">
                  {calculatedInsuranceToman.toLocaleString('fa-IR')} تومان
                </span>
              </div>

              {/* Driver Payout Highlight Box */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between shadow-xs mt-3">
                <div className="flex items-center gap-2.5">
                  <Truck className="w-5 h-5 text-amber-400" />
                  <div>
                    <span className="font-bold text-xs block text-slate-100">خالص پرداختی به راننده (Driver Payout):</span>
                    <span className="text-[11px] text-slate-400 font-mono">سهم خالص راننده: %{driverSharePercent}</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-lg text-amber-400">
                  {calculatedDriverPayoutToman.toLocaleString('fa-IR')} تومان
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
