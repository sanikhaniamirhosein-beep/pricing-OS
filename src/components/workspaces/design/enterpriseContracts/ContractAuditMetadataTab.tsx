import React from 'react';
import {
  ShieldAlert,
  User,
  Calendar,
  Lock,
  History,
  CheckCircle2,
  FileKey,
  Layers,
} from 'lucide-react';
import { EnterpriseCorporateContract } from '../../../../types/enterpriseContract';

interface Props {
  contract: EnterpriseCorporateContract;
}

export const ContractAuditMetadataTab: React.FC<Props> = ({ contract }) => {
  const { auditFields } = contract;

  const getConfidentialityBadge = (level: string) => {
    switch (level) {
      case 'top_secret_c_level':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <Lock className="w-3.5 h-3.5" />
            فوق‌محرمانه - فقط هیئت مدیره و مدیران ارشد (C-Level)
          </span>
        );
      case 'confidential':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Lock className="w-3.5 h-3.5" />
            محرمانه سازمانی - معاونت بازرگانی و مالی
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            عمومی داخلی پرسنل دیسپاچینگ
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Confidentiality & Record Ownership Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>ایجادکننده رکورد قرارداد</span>
            <User className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-sm font-bold text-slate-900">{auditFields.createdBy}</div>
          <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {auditFields.createdAt}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>آخرین ویرایش‌کننده</span>
            <User className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-sm font-bold text-slate-900">{auditFields.lastModifiedBy}</div>
          <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {auditFields.lastModifiedAt}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>سطح دسترسی و طبقه‌بندی امنیتی</span>
            <FileKey className="w-4 h-4 text-amber-600" />
          </div>
          <div className="pt-1">{getConfidentialityBadge(auditFields.confidentialityLevel)}</div>
          <p className="text-[11px] text-slate-500">مبتنی بر پالیسی کنترل دسترسی نقشی (RBAC)</p>
        </div>
      </div>

      {/* Audit Trail Log */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <History className="w-4 h-4 text-indigo-600" />
          <h4 className="text-sm font-bold text-slate-900">ردپای حسابرسی و وقایع امنیتی قرارداد (Audit Trail)</h4>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {auditFields.auditTrail.map((log, idx) => (
            <div key={idx} className="py-3 flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0"></span>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-800">
                    {log.user} ({log.action})
                  </span>
                  <span className="font-mono">{log.timestamp}</span>
                </div>
                <p className="text-slate-700 leading-relaxed">{log.detailsFa}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
