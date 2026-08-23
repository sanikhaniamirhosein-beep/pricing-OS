import React, { useState } from 'react';
import {
  Receipt,
  Download,
  CreditCard,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Wallet,
  Plus,
  Send,
  FileText,
  DollarSign,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import {
  INITIAL_SHIPPER_INVOICES,
  INITIAL_SHIPPER_TRANSACTIONS,
  INITIAL_SHIPPER_TIER,
  ShipperInvoice,
} from '../../data/mockShipperData';
import { ModernSelect } from '../common/menus/ModernSelect';

export const ShipperBillingView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'invoices' | 'transactions' | 'credit' | 'dispute'>('invoices');
  const [invoices, setInvoices] = useState(INITIAL_SHIPPER_INVOICES);

  // Dispute modal / form state
  const [disputeInvoiceNo, setDisputeInvoiceNo] = useState('INV-88490');
  const [disputeReason, setDisputeReason] = useState('اعمال هزینه توقف نامعتبر راننده');
  const [disputeDescription, setDisputeDescription] = useState('تخلیه بار در انبار شمس‌آباد در زمان کمتر از ۲ ساعت انجام شد، اما مبلغ ۱,۵۰۰,۰۰۰ تومان حق توقف محاسبه شده است.');
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);

  // Credit Request Form
  const [creditRequestAmountMillion, setCreditRequestAmountMillion] = useState(200);
  const [creditRequestReason, setCreditRequestReason] = useState('افزایش خطوط تولید نورد و افزایش حجم محموله‌های ماهانه به ۳۰۰۰ تن');
  const [creditRequestSubmitted, setCreditRequestSubmitted] = useState(false);

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDisputeSubmitted(true);
    setTimeout(() => {
      setDisputeSubmitted(false);
      alert(`تیکت اعتراض مالی برای فاکتور ${disputeInvoiceNo} با شماره پیگیری DSP-1403-${Math.floor(1000 + Math.random() * 9000)} ثبت شد.`);
    }, 1500);
  };

  const handleCreditRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCreditRequestSubmitted(true);
    setTimeout(() => {
      setCreditRequestSubmitted(false);
      alert(`درخواست افزایش سقف اعتبار به مبلغ ${creditRequestAmountMillion} میلیون تومان برای بررسی مدیریت مالی ارسال شد.`);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Wallet & Credit Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Available Credit */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-300 text-xs">
            <span className="flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-amber-400" />
              مانده اعتبار در دسترس
            </span>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full font-mono">پس‌کرایه ۳۰ روزه</span>
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300">
            {(INITIAL_SHIPPER_TIER.availableCreditRials / 10).toLocaleString('fa-IR')}{' '}
            <span className="text-xs font-normal text-slate-300">تومان</span>
          </div>
          <div className="text-[11px] text-slate-400">
            از مجموع ۵۰۰,۰۰۰,۰۰۰ تومان سقف مجاز
          </div>
        </div>

        {/* Card 2: Due Invoices */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="flex items-center gap-1.5 font-bold">
              <Clock className="w-4 h-4 text-amber-600" />
              صورتحساب‌های در انتظار پرداخت
            </span>
            <span className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
              ۱ فاکتور سررسید
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-800">
            ۴۱,۳۵۰,۰۰۰ <span className="text-xs font-normal text-slate-400">تومان</span>
          </div>
          <div className="text-[11px] text-slate-500">
            سررسید فاکتور جاری: <strong>۱۴۰۳/۰۶/۳۰</strong>
          </div>
        </div>

        {/* Card 3: Total Spend YTD */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="flex items-center gap-1.5 font-bold">
              <Receipt className="w-4 h-4 text-emerald-600" />
              مجموع تسویه‌شده در سال جاری
            </span>
            <span className="text-[10px] bg-emerald-50 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
              ۱۴۸ بارنامه
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700">
            ۳۹۶,۴۰۰,۰۰۰ <span className="text-xs font-normal text-slate-400">تومان</span>
          </div>
          <div className="text-[11px] text-slate-500">
            میانگین کرایه هر سرویس: ۲,۶۷۰,۰۰۰ تومان
          </div>
        </div>
      </div>

      {/* 2. Sub-tab Navigation */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {[
            { id: 'invoices', label: 'لیست فاکتورها و صورتحساب‌ها', icon: Receipt },
            { id: 'transactions', label: 'ریز تراکنش‌ها و لاگ مالی', icon: DollarSign },
            { id: 'credit', label: 'درخواست افزایش اعتبار و پرداخت', icon: CreditCard },
            { id: 'dispute', label: 'ثبت اعتراض مالی (Dispute)', icon: AlertTriangle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => alert('گزارش کامل دوره‌ای صورتحساب‌ها به فرمت اکسل دانلود شد.')}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>دانلود اکسل گردش حساب</span>
        </button>
      </div>

      {/* VIEW 1: Invoices Table */}
      {activeSubTab === 'invoices' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-xs">صورتحساب‌های دوره‌ای و فاکتورهای رسمی تجاری</h3>
            <span className="text-[11px] font-mono text-slate-400">۳ فاکتور ثبت‌شده</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold">
                  <th className="p-3.5">شماره فاکتور</th>
                  <th className="p-3.5">تاریخ صدور</th>
                  <th className="p-3.5">تاریخ سررسید</th>
                  <th className="p-3.5">تعداد بارنامه</th>
                  <th className="p-3.5">مبلغ کل فاکتور</th>
                  <th className="p-3.5">وضعیت پرداخت</th>
                  <th className="p-3.5 text-center">دانلود / عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-slate-900">
                      {inv.invoiceNo}
                    </td>
                    <td className="p-3.5 font-mono text-slate-600">{inv.date}</td>
                    <td className="p-3.5 font-mono text-slate-600">{inv.dueDate}</td>
                    <td className="p-3.5">
                      <span className="font-mono font-bold text-slate-800">{inv.shipmentCount}</span> محموله
                    </td>
                    <td className="p-3.5 font-mono font-bold text-slate-900">
                      {(inv.amountRials / 10).toLocaleString('fa-IR')} تومان
                    </td>
                    <td className="p-3.5">
                      {inv.status === 'paid' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          تسویه‌شده
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-bold">
                          <Clock className="w-3 h-3 text-amber-600" />
                          در انتظار تسویه
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => alert(`دانلود PDF فاکتور رسمی ${inv.invoiceNo}`)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                        {inv.status === 'due' && (
                          <button
                            type="button"
                            onClick={() => {
                              setDisputeInvoiceNo(inv.invoiceNo);
                              setActiveSubTab('dispute');
                            }}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold cursor-pointer"
                          >
                            ثبت اعتراض
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: Transactions Log */}
      {activeSubTab === 'transactions' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <h3 className="font-bold text-slate-800 text-xs pb-2 border-b border-slate-100">
            ریز تراکنش‌های اعتباری و درگاهی (Ledger)
          </h3>

          <div className="divide-y divide-slate-100">
            {INITIAL_SHIPPER_TRANSACTIONS.map((trx) => (
              <div key={trx.id} className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                      trx.type === 'credit'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {trx.type === 'credit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{trx.description}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      کد ارجاع: {trx.referenceNo} • {trx.date}
                    </div>
                  </div>
                </div>

                <div className="text-left font-mono">
                  <div
                    className={`font-bold ${
                      trx.type === 'credit' ? 'text-emerald-700' : 'text-slate-800'
                    }`}
                  >
                    {trx.type === 'credit' ? '+' : '-'}{(trx.amountRials / 10).toLocaleString('fa-IR')} تومان
                  </div>
                  <div className="text-[10px] text-slate-400">
                    مانده پس از تراکنش: {(trx.balanceAfterRials / 10).toLocaleString('fa-IR')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: Credit Line Increase Request */}
      {activeSubTab === 'credit' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form onSubmit={handleCreditRequestSubmit} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 text-xs flex items-center gap-2 pb-2 border-b border-slate-100">
              <CreditCard className="w-4 h-4 text-amber-600" />
              درخواست افزایش سقف اعتبار تجاری (Credit Line Expansion)
            </h3>

            <div>
              <label className="block text-slate-700 font-bold text-xs mb-1">مبلغ درخواستی افزایش سقف (میلیون تومان):</label>
              <input
                type="number"
                value={creditRequestAmountMillion}
                onChange={(e) => setCreditRequestAmountMillion(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold text-xs mb-1">دلیل و توجیه افزایش حجم بارنامه:</label>
              <textarea
                rows={3}
                value={creditRequestReason}
                onChange={(e) => setCreditRequestReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={creditRequestSubmitted}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              {creditRequestSubmitted ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>درخواست ارسال شد...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>ثبت و ارسال درخواست افزایش اعتبار</span>
                </>
              )}
            </button>
          </form>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 text-xs pb-2 border-b border-slate-100">
              روش‌های پرداخت متصل
            </h3>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold font-mono">
                  ACC
                </div>
                <div>
                  <div className="font-bold text-slate-800">حساب تجاری بانک ملت (فولاد مبارکه)</div>
                  <div className="text-[10px] text-slate-400 font-mono">شبا: IR880120000000001234567890</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                حساب اصلی
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold font-mono">
                  POS
                </div>
                <div>
                  <div className="font-bold text-slate-800">درگاه پرداخت اینترنتی شاپرک / سداد</div>
                  <div className="text-[10px] text-slate-400">پرداخت مستقیم با کلیه کارت‌های شتاب</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-bold">
                فعال
              </span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: Dispute Submission Form */}
      {activeSubTab === 'dispute' && (
        <form onSubmit={handleDisputeSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-2xl mx-auto space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <div>
              <h3 className="font-bold text-slate-800 text-xs">سامانه ثبت اعتراض و گزارش مغایرت مالی (Dispute Resolution)</h3>
              <p className="text-[11px] text-slate-400">بررسی سریع توسط واحد نظارت بر تعرفه‌ها ظرف ۲۴ ساعت کاری</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold text-xs mb-1">شماره فاکتور مورد اعتراض:</label>
              <input
                type="text"
                value={disputeInvoiceNo}
                onChange={(e) => setDisputeInvoiceNo(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <ModernSelect
                id="billing-dispute-reason"
                value={disputeReason}
                onChange={setDisputeReason}
                label="نوع مغایرت:"
                options={[
                  { value: 'اعمال هزینه توقف نامعتبر راننده', label: 'اعمال هزینه توقف نامعتبر راننده', badge: 'حق توقف' },
                  { value: 'مغایرت تناژ باسکول مبدأ با فاکتور', label: 'مغایرت تناژ باسکول مبدأ با فاکتور', badge: 'وزن/تناژ' },
                  { value: 'عدم اعمال تخفیف پلکانی قرارداد', label: 'عدم اعمال تخفیف پلکانی قرارداد', badge: 'تخفیف' },
                  { value: 'محاسبه اشتباه عوارض جاده‌ای', label: 'محاسبه اشتباه عوارض جاده‌ای', badge: 'عوارض' },
                ]}
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold text-xs mb-1">توضیحات و مستندات:</label>
            <textarea
              rows={4}
              value={disputeDescription}
              onChange={(e) => setDisputeDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={disputeSubmitted}
            className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            {disputeSubmitted ? (
              <>
                <Check className="w-4 h-4" />
                <span>تیکت اعتراض با موفقیت ثبت شد...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>ارسال تیکت اعتراض جهت بررسی مالی و بازگشت وجه</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
