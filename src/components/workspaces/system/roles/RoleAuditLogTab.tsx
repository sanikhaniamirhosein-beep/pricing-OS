import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  Shield,
  Clock,
  User,
  PlusCircle,
  Edit,
  Trash2,
  Copy,
  RefreshCw,
  FileSpreadsheet,
  Download,
  X,
  AlertTriangle,
} from 'lucide-react';
import { RoleAuditLogEntry, RoleAuditActionType } from '../../../../types/roles';

interface RoleAuditLogTabProps {
  auditLogs: RoleAuditLogEntry[];
  portalType: 'carrier' | 'shipper';
  initialFilterTarget?: string | null;
}

const ACTION_CONFIG: Record<
  RoleAuditActionType,
  { labelFa: string; colorClass: string; icon: React.ComponentType<{ className?: string }> }
> = {
  create_role: { labelFa: 'ایجاد نقش جدید', colorClass: 'bg-teal-50 text-teal-800 border-teal-200', icon: PlusCircle },
  edit_role: { labelFa: 'ویرایش دسترسی‌ها', colorClass: 'bg-blue-50 text-blue-800 border-blue-200', icon: Edit },
  duplicate_role: { labelFa: 'کپی‌سازی نقش', colorClass: 'bg-sky-50 text-sky-800 border-sky-200', icon: Copy },
  delete_role: { labelFa: 'حذف نقش سازمانی', colorClass: 'bg-rose-50 text-rose-800 border-rose-200', icon: Trash2 },
  reassign_user_role: {
    labelFa: 'تغییر نقش کاربر',
    colorClass: 'bg-purple-50 text-purple-800 border-purple-200',
    icon: RefreshCw,
  },
  add_user: { labelFa: 'ثبت کاربر جدید', colorClass: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: PlusCircle },
  toggle_user_status: {
    labelFa: 'تغییر وضعیت کاربر',
    colorClass: 'bg-amber-50 text-amber-800 border-amber-200',
    icon: Shield,
  },
};

export const RoleAuditLogTab: React.FC<RoleAuditLogTabProps> = ({
  auditLogs,
  portalType,
  initialFilterTarget,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialFilterTarget || '');
  const [actionFilter, setActionFilter] = useState<string>('all');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.targetTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.detailsFa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.beforeState && log.beforeState.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.afterState && log.afterState.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (actionFilter !== 'all' && log.actionType !== actionFilter) return false;

    return true;
  });

  const handleExportCSV = () => {
    const headers = ['شناسه لاگ', 'تاریخ و ساعت', 'مجری', 'سمت', 'نوع عملیات', 'هدف', 'وضعیت قبلی', 'وضعیت بعدی', 'توضیحات'];
    const rows = filteredLogs.map((l) => [
      l.id,
      l.timestamp,
      l.actorName,
      l.actorRole,
      ACTION_CONFIG[l.actionType]?.labelFa || l.actionType,
      l.targetTitle,
      l.beforeState || '-',
      l.afterState || '-',
      l.detailsFa,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${(val || '').replace(/"/g, '""')}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rbac_audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 shrink-0">
            <History className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 font-title">
                تاریخچه ممیزی و رویدادهای دسترسی (Security Audit Log)
              </h2>
              <span className="bg-teal-100 text-teal-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                {auditLogs.length} رکورد ثبت‌شده
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              ردیابی غیرقابل تغییر کلیه رخدادهای ایجاد، ویرایش، حذف، کپی نقش‌ها و تغییر انتساب کاربران (Before/After)
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-2xs cursor-pointer"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>خروجی گزارش اکسل/CSV</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در مجری، عنوان نقش، کاربر یا جزئیات تغییرات..."
            className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-teal-500 outline-hidden font-medium"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Type Filter */}
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="font-bold">فیلتر عملیات:</span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 text-slate-800 font-medium outline-hidden"
          >
            <option value="all">همه رخدادها</option>
            <option value="create_role">ایجاد نقش</option>
            <option value="edit_role">ویرایش دسترسی‌ها</option>
            <option value="reassign_user_role">تغییر نقش کاربر</option>
            <option value="duplicate_role">کپی‌سازی نقش</option>
            <option value="delete_role">حذف نقش</option>
            <option value="add_user">ثبت کاربر</option>
          </select>
        </div>
      </div>

      {/* Audit Log Timeline / Table */}
      {filteredLogs.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-xs space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mx-auto">
            <History className="w-8 h-8" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">هیچ رویدادی با این شرایط یافت نشد</h3>
          <p className="text-xs text-slate-500">
            برای مشاهده کلیه رخدادها، فیلتر جستجو را پاک کنید.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-bold text-slate-700">
                  <th className="py-4 px-5">زمان و شناسه لاگ</th>
                  <th className="py-4 px-4">کاربر مجری (Actor)</th>
                  <th className="py-4 px-4 text-center">نوع عملیات</th>
                  <th className="py-4 px-4">موضوع / هدف تغییرات</th>
                  <th className="py-4 px-5">مقایسه مقادیر (Before ➔ After)</th>
                  <th className="py-4 px-4">شرح ممیزی و IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredLogs.map((log) => {
                  const actionMeta = ACTION_CONFIG[log.actionType] || {
                    labelFa: log.actionType,
                    colorClass: 'bg-slate-100 text-slate-700 border-slate-200',
                    icon: History,
                  };
                  const ActionIcon = actionMeta.icon;

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Timestamp & ID */}
                      <td className="py-4 px-5 font-mono text-[11px]">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{log.timestamp}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{log.id}</span>
                      </td>

                      {/* Actor */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 font-bold text-[10px] flex items-center justify-center">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 text-xs block">{log.actorName}</span>
                            <span className="text-[10px] text-slate-400">{log.actorRole}</span>
                          </div>
                        </div>
                      </td>

                      {/* Action Badge */}
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${actionMeta.colorClass}`}
                        >
                          <ActionIcon className="w-3.5 h-3.5" />
                          <span>{actionMeta.labelFa}</span>
                        </span>
                      </td>

                      {/* Target */}
                      <td className="py-4 px-4">
                        <span className="font-bold text-slate-900 text-xs block">{log.targetTitle}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{log.targetId}</span>
                      </td>

                      {/* Before / After Diff */}
                      <td className="py-4 px-5 max-w-xs">
                        <div className="space-y-1 text-[11px]">
                          {log.beforeState && (
                            <div className="bg-rose-50/80 text-rose-900 border border-rose-200 px-2 py-0.5 rounded-md flex items-start gap-1">
                              <span className="font-bold text-[10px] text-rose-600 shrink-0">قبل:</span>
                              <span className="line-clamp-1">{log.beforeState}</span>
                            </div>
                          )}
                          {log.afterState && (
                            <div className="bg-emerald-50/80 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded-md flex items-start gap-1">
                              <span className="font-bold text-[10px] text-emerald-600 shrink-0">بعد:</span>
                              <span className="line-clamp-1">{log.afterState}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Details & IP */}
                      <td className="py-4 px-4 max-w-xs">
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {log.detailsFa}
                        </p>
                        {log.ipAddress && (
                          <span className="text-[10px] font-mono text-slate-400 mt-0.5 block" dir="ltr">
                            IP: {log.ipAddress}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
