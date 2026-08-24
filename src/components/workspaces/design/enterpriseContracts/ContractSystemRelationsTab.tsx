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
    <div className="space-y-6">
      {/* KPI Performance Report Box */}
      <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <h4 className="text-sm font-bold text-white">شاخص‌های کلیدی عملکرد طرف قرارداد (KPI Performance)</h4>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            امتیاز رضایت: {performanceReport.customerSatisfactionScore} از ۵.۰
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-center">
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
            <div className="text-[11px] text-slate-400">سفرهای انجام شده</div>
            <div className="text-base font-bold font-mono text-white">
              {performanceReport.totalShipmentsCompleted.toLocaleString('fa-IR')}
            </div>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
            <div className="text-[11px] text-slate-400">مجموع تناژ حمل‌شده</div>
            <div className="text-base font-bold font-mono text-emerald-400">
              {performanceReport.totalTonnageHauled.toLocaleString('fa-IR')} تن
            </div>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
            <div className="text-[11px] text-slate-400">نرخ تحویل به‌موقع</div>
            <div className="text-base font-bold font-mono text-cyan-400">
              {performanceReport.onTimeDeliveryRate}٪
            </div>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
            <div className="text-[11px] text-slate-400">تعداد دعاوی خسارت</div>
            <div className="text-base font-bold font-mono text-emerald-400">
              {performanceReport.damageClaimsCount === 0 ? 'صفر (عالی)' : performanceReport.damageClaimsCount}
            </div>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
            <div className="text-[11px] text-slate-400">اختلافات فعال</div>
            <div className="text-base font-bold font-mono text-white">
              {performanceReport.activeDisputesCount}
            </div>
          </div>
        </div>
      </div>

      {/* Linked Fleet & Drivers & Linked Invoices Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Linked Fleet and Drivers */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-indigo-600" />
              <h4 className="text-sm font-bold text-slate-900">ناوگان و رانندگان اختصاص‌یافته</h4>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {linkedFleetDrivers.length} خودرو فعال
            </span>
          </div>

          {linkedFleetDrivers.length > 0 ? (
            <div className="space-y-2.5">
              {linkedFleetDrivers.map((item) => (
                <div
                  key={item.driverId}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900">{item.driverName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {item.vehicleType} • کارت هوشمند: {item.smartCardNo}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800 text-[11px]">
                      {item.plateNumber}
                    </div>
                    <div className="text-[10px] text-emerald-600 mt-0.5 font-medium">فعال در کریدور</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-slate-400">
              ناوگان به صورت متمرکز از استخر عمومی دیسپاچ تخصیص می‌یابد.
            </div>
          )}
        </div>

        {/* Linked Invoices & Billing */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-600" />
              <h4 className="text-sm font-bold text-slate-900">فاکتورها و تراکنش‌های مالی متصل</h4>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {linkedInvoices.length} صورت‌حساب
            </span>
          </div>

          {linkedInvoices.length > 0 ? (
            <div className="space-y-2.5">
              {linkedInvoices.map((inv) => (
                <div
                  key={inv.invoiceId}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-mono font-bold text-slate-900">{inv.invoiceNumber}</div>
                    <div className="text-[11px] text-slate-500">{inv.descriptionFa}</div>
                  </div>
                  <div className="text-left">
                    <div className="font-mono font-bold text-emerald-700">
                      {(inv.amountToman / 1000000).toLocaleString('fa-IR')} م تومان
                    </div>
                    <span
                      className={`inline-block text-[10px] font-semibold px-2 py-0.2 rounded ${
                        inv.status === 'paid'
                          ? 'text-emerald-700 bg-emerald-50'
                          : 'text-amber-700 bg-amber-50'
                      }`}
                    >
                      {inv.status === 'paid' ? 'تسویه شده' : 'در گردش پرداخت'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-slate-400">
              صورت‌حسابی تا این لحظه صادر نشده است.
            </div>
          )}
        </div>
      </div>

      {/* Activity Notes & Communications */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            <h4 className="text-sm font-bold text-slate-900">یادداشت‌های داخلی و تاریخچه تعاملات کارشناسان</h4>
          </div>

          <button
            type="button"
            onClick={() => setIsAddNoteOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            ثبت یادداشت جدید
          </button>
        </div>

        {activityNotes.length > 0 ? (
          <div className="space-y-3">
            {activityNotes.map((note) => (
              <div key={note.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span className="font-semibold text-slate-800 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-indigo-600" />
                    {note.authorName} ({note.authorRole})
                  </span>
                  <span className="font-mono">{note.date}</span>
                </div>
                <p className="text-slate-800 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-100">
                  {note.contentFa}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-400">
            یادداشتی برای این قرارداد ثبت نشده است.
          </div>
        )}
      </div>

      {/* Add Note Modal */}
      {isAddNoteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                ثبت یادداشت تعاملات داخلی
              </h4>
              <button onClick={() => setIsAddNoteOpen(false)} className="text-slate-400 hover:text-white text-xs p-1">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">دسته‌بندی موضوع:</label>
                <select
                  value={newNoteCategory}
                  onChange={(e) => setNewNoteCategory(e.target.value as any)}
                  className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800"
                >
                  <option value="operational">عملیات و هماهنگی بارگیری</option>
                  <option value="financial">امور مالی و صورت‌حساب</option>
                  <option value="legal">مسائل حقوقی و اداری</option>
                  <option value="general">یادداشت عمومی</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">متن یادداشت / گزارش تعامل:</label>
                <textarea
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 h-28"
                  placeholder="شرح جلسه، هماهنگی یا نکته عملیاتی..."
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddNoteOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
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
