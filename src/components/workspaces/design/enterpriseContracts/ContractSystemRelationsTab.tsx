import React, { useState } from 'react';
import {
  Truck,
  Receipt,
  BarChart3,
  MessageSquare,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Activity,
  CreditCard,
  TrendingUp,
  FileCheck2,
} from 'lucide-react';
import {
  EnterpriseCorporateContract,
  ActivityNote,
  LinkedFleetDriver,
  LinkedInvoiceTransaction,
} from '../../../../types/enterpriseContract';

interface Props {
  contract: EnterpriseCorporateContract;
  onAddNote?: (note: ActivityNote) => void;
}

export const ContractSystemRelationsTab: React.FC<Props> = ({ contract, onAddNote }) => {
  const { systemRelations } = contract;
  const { performanceReport, linkedFleetDrivers, linkedInvoices, activityNotes } = systemRelations;

  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState<'operational' | 'financial' | 'legal' | 'general'>('operational');

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    const note: ActivityNote = {
      id: `note-${Date.now()}`,
      authorName: 'کاربر جاری سیستم (مدیر عملیات)',
      authorRole: 'عملیات و دیسپاچینگ',
      date: '۱۴۰۵/۰۵/۱۵ ۱۰:۲۰',
      contentFa: newNoteContent,
      category: newNoteCategory,
    };

    if (onAddNote) {
      onAddNote(note);
    } else {
      activityNotes.unshift(note);
    }

    setNewNoteContent('');
    setIsAddNoteOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Live Operational Performance Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">سفرهای انجام‌شده</span>
            <Truck className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">
            {performanceReport.totalShipmentsCompleted.toLocaleString('fa-IR')} سفر
          </div>
          <p className="text-[11px] text-slate-500">
            نرخ تحویل به‌موقع: {performanceReport.onTimeDeliveryRate}٪
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">کل تناژ حمل‌شده</span>
            <BarChart3 className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">
            {performanceReport.totalTonnageHauled.toLocaleString('fa-IR')} تن
          </div>
          <p className="text-[11px] text-slate-500">
            ادعاهای خسارت: {performanceReport.damageClaimsCount.toLocaleString('fa-IR')} مورد
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">امتیاز رضایت مشتری</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-800">
            {performanceReport.customerSatisfactionScore} / ۵.۰
          </div>
          <p className="text-[11px] text-slate-500">شاخص طلایی رضایت‌مندی</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">اختلافات و دعاوی فعال</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">
            {performanceReport.activeDisputesCount.toLocaleString('fa-IR')} پرونده
          </div>
          <p className="text-[11px] text-slate-500">تحت پیگیری دایره حقوقی</p>
        </div>
      </div>

      {/* Linked Fleet Drivers Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-slate-700" />
            <h4 className="text-xs font-bold text-slate-900">ناوگان و رانندگان اختصاصی متصل به قرارداد</h4>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {linkedFleetDrivers.length.toLocaleString('fa-IR')} کشنده فعال
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600 font-bold bg-slate-50/80">
                <th className="p-3.5">نام راننده</th>
                <th className="p-3.5">پلاک کشنده</th>
                <th className="p-3.5">نوع بارگیر</th>
                <th className="p-3.5">شماره کارت هوشمند</th>
                <th className="p-3.5">تاریخ تخصیص</th>
                <th className="p-3.5">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {linkedFleetDrivers.map((driver) => (
                <tr key={driver.driverId} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3.5 font-medium">{driver.driverName}</td>
                  <td className="p-3.5 font-mono font-bold text-slate-900">{driver.plateNumber}</td>
                  <td className="p-3.5 text-slate-600">{driver.vehicleType}</td>
                  <td className="p-3.5 font-mono text-slate-600">{driver.smartCardNo}</td>
                  <td className="p-3.5 font-mono text-slate-600">{driver.assignedDate}</td>
                  <td className="p-3.5">
                    {driver.status === 'active' ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">
                        فعال در سرویس
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[11px]">
                        آماده‌به‌خدمت
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Linked Electronic Invoices Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-slate-700" />
            <h4 className="text-xs font-bold text-slate-900">صورت‌حساب‌ها و اسناد مالی متصل به قرارداد</h4>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {linkedInvoices.length.toLocaleString('fa-IR')} صورت‌وضعیت
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600 font-bold bg-slate-50/80">
                <th className="p-3.5">شماره سند / فاکتور</th>
                <th className="p-3.5">شرح صورت‌وضعیت</th>
                <th className="p-3.5">مبلغ (تومان)</th>
                <th className="p-3.5">تاریخ صدور</th>
                <th className="p-3.5">وضعیت تسویه</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {linkedInvoices.map((inv) => (
                <tr key={inv.invoiceId} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                  <td className="p-3.5 font-medium">{inv.descriptionFa}</td>
                  <td className="p-3.5 font-mono font-bold text-slate-900">{(inv.amountToman / 1000000).toLocaleString('fa-IR')} م تومان</td>
                  <td className="p-3.5 font-mono text-slate-600">{inv.issueDate}</td>
                  <td className="p-3.5">
                    {inv.status === 'paid' ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">
                        تسویه شده
                      </span>
                    ) : inv.status === 'overdue' ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-[11px] font-semibold">
                        معوقه
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-semibold">
                        در انتظار پرداخت
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Notes & System Log */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-slate-700" />
            <h4 className="text-xs font-bold text-slate-900">یادداشت‌های پیگیری، مکاتبات و رخدادهای عملیاتی</h4>
          </div>

          <button
            type="button"
            onClick={() => setIsAddNoteOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ثبت یادداشت</span>
          </button>
        </div>

        <div className="space-y-3">
          {activityNotes.map((note) => (
            <div key={note.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-bold text-slate-900">{note.authorName} ({note.authorRole})</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">{note.date}</span>
              </div>
              <p className="text-slate-700 leading-relaxed">{note.contentFa}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Note Modal */}
      {isAddNoteOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">ثبت یادداشت جدید برای پرونده قرارداد</h3>
              <button
                type="button"
                onClick={() => setIsAddNoteOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer"
              >
                بستن
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-700 font-medium block">دسته‌بندی موضوعی:</label>
                <select
                  value={newNoteCategory}
                  onChange={(e) => setNewNoteCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:border-amber-500"
                >
                  <option value="operational">عملیات و اعزام ناوگان</option>
                  <option value="financial">امور مالی و صورت‌حساب‌ها</option>
                  <option value="legal">حقوقی و داوری</option>
                  <option value="general">عمومی و هماهنگی</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-medium block">متن یادداشت و شرح رخداد:</label>
                <textarea
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  rows={4}
                  placeholder="توضیحات تکمیلی..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddNoteOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-xs cursor-pointer transition-colors"
                >
                  ثبت در پرونده
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
