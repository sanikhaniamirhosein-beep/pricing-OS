import React from 'react';
import {
  Lock,
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  UserCheck,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Building2,
  Users,
} from 'lucide-react';

interface RoleAccessGuardProps {
  sectionTitleFa: string;
  currentRoleTitleFa: string;
  currentRoleTitleEn?: string;
  departmentFa?: string;
  dutiesFa?: string[];
  allowedRolesForSection?: string[];
  onBackToAllowed: () => void;
  onOpenRoleSwitcher?: () => void;
  isShipper?: boolean;
}

export const RoleAccessGuard: React.FC<RoleAccessGuardProps> = ({
  sectionTitleFa,
  currentRoleTitleFa,
  currentRoleTitleEn,
  departmentFa,
  dutiesFa = [],
  allowedRolesForSection = [],
  onBackToAllowed,
  onOpenRoleSwitcher,
  isShipper = true,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Warning Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-5 border-b border-slate-700">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border-2 border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0 shadow-lg animate-pulse">
            <Lock className="w-8 h-8" />
          </div>

          <div className="text-center sm:text-right space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold font-mono">
                RBAC Access Restricted
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold">
                حفاظت سطوح دسترسی
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
              بخش «{sectionTitleFa}» برای نقش شما قفل است
            </h2>

            <p className="text-sm text-slate-200 leading-relaxed">
              مطابق ماتریس اختیارات سازمانی، حساب کاربری با عنوان{' '}
              <strong className="text-amber-300 font-bold">«{currentRoleTitleFa}»</strong> مجوز ورود، مشاهده یا اعمال تغییرات در این بخش را ندارد.
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left: Current Active Role Details */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3.5">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <Briefcase className="w-4 h-4 text-sky-600" />
                <h3 className="font-bold text-slate-800 text-xs">اطلاعات نقش فعال شما:</h3>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">عنوان شغلی:</span>
                  <span className="font-bold text-slate-900">{currentRoleTitleFa}</span>
                </div>
                {currentRoleTitleEn && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">عنوان انگلیسی:</span>
                    <span className="font-mono text-slate-700">{currentRoleTitleEn}</span>
                  </div>
                )}
                {departmentFa && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">دپارتمان سازمانی:</span>
                    <span className="text-sky-800 font-medium">{departmentFa}</span>
                  </div>
                )}
              </div>

              {/* Responsibilities list */}
              {dutiesFa.length > 0 && (
                <div className="pt-2 border-t border-slate-200 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-700 block">وظایف و دسترسی‌های مجاز این نقش:</span>
                  <ul className="space-y-1">
                    {dutiesFa.map((duty, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{duty}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right: Permitted Roles & Security Guidance */}
            <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200/80 space-y-3.5">
              <div className="flex items-center gap-2 pb-2 border-b border-amber-200/70">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-amber-950 text-xs">چه نقش‌هایی به «{sectionTitleFa}» دسترسی دارند؟</h3>
              </div>

              {allowedRolesForSection.length > 0 ? (
                <div className="space-y-2">
                  <span className="text-[11px] text-amber-900 block leading-relaxed">
                    تنها کاربران با سمت‌های زیر مجاز به فعالیت در این بخش هستند:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {allowedRolesForSection.map((roleName, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-xl bg-white border border-amber-300 text-amber-950 font-bold text-xs shadow-2xs flex items-center gap-1.5"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                        {roleName}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-amber-900 leading-relaxed">
                  دسترسی به این بخش مستلزم ارتقای سطح کاربری یا تایید مدیر ارشد سیستم می‌باشد.
                </p>
              )}

              <div className="p-3 bg-white/80 border border-amber-200 rounded-xl text-[11px] text-slate-600 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  برای تغییر نقش یا آزمایش سناریوهای مختلف کاربری، از منوی بالا سمت چپ می‌توانید نقش مورد نظر را انتخاب فرمایید.
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-200">
            {onOpenRoleSwitcher && (
              <button
                type="button"
                onClick={onOpenRoleSwitcher}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Users className="w-4 h-4 text-slate-600" />
                <span>تعویض نقش کاربری</span>
              </button>
            )}

            <button
              type="button"
              onClick={onBackToAllowed}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <span>بازگشت به بخش مجاز</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
