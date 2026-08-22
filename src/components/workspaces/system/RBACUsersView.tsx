import React, { useState } from 'react';
import {
  Users,
  Shield,
  Key,
  CheckCircle2,
  XCircle,
  Plus,
  Edit2,
  Lock,
  Unlock,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { usePricing } from '../../../store/PricingContext';
import { RBACRoleDefinition } from '../../../types/pricing';

export const RBACUsersView: React.FC = () => {
  const { rbacRoles, userRole } = usePricing();
  const [selectedRole, setSelectedRole] = useState<RBACRoleDefinition>(rbacRoles[0] || ({} as RBACRoleDefinition));

  const roleTitle = selectedRole?.roleNameFa || selectedRole?.titleFa || 'نقش نامشخص';
  const roleSubtitle = selectedRole?.roleNameEn || selectedRole?.titleEn || selectedRole?.role || 'Custom Role';
  const allowedMods = selectedRole?.allowedModules || ['pricing_studio', 'contract_studio'];

  const moduleNamesFa: Record<string, string> = {
    schema_builder: 'سازنده اسکیما و موجودیت‌ها',
    geo_matrix: 'ماتریس جغرافیایی و زون‌بندی',
    rules_engine: 'موتور قوانین و گاردریل‌ها',
    contracts_discounts: 'دفترچه‌های قیمت و تخفیفات',
    validation_lab: 'آزمایشگاه شبیه‌سازی و Replay',
    control_tower: 'برج مراقبت و تایید دوطرفه',
    live_ops: 'داشبورد عملیات زنده و تله‌متری',
    financials: 'امور مالی، تسویه و کمیسیون',
    system_settings: 'تنظیمات، دسترسی‌ها و اتصال‌ها',
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 font-title">
                  ۷.۱ مدیریت کاربران و سطوح دسترسی سازمانی (RBAC & Permissions)
                </h1>
                <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {rbacRoles.length} نقش ساختاریافته
                </span>
                <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-full font-medium">
                  نقش شما: {userRole}
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                تعریف نقش‌های استراتژیست، مدیر مالی، اپراتور و مدیر ناوگان با ماتریس دسترسی دانه‌درشت بر اساس اصل حداقل دسترسی
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Role Selection & Permissions Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Role List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono px-2">
              نقش‌های سازمانی تعریف‌شده
            </h2>

            <div className="space-y-2">
              {rbacRoles.map((role) => {
                const isSelected = selectedRole?.id === role.id;
                const rNameFa = role.roleNameFa || role.titleFa || 'نقش سازمانی';
                const rNameEn = role.roleNameEn || role.titleEn || role.role || 'Role';
                return (
                  <div
                    key={role.id}
                    onClick={() => setSelectedRole(role)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xs font-bold text-slate-900">{rNameFa}</h3>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">{rNameEn}</p>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded">
                        {role.userCount ?? 3} کاربر
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {role.descriptionFa}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">اختیار تایید نهایی:</span>
                      <span
                        className={`font-bold ${
                          role.canApproveDeployment ? 'text-emerald-700' : 'text-slate-400'
                        }`}
                      >
                        {role.canApproveDeployment ? 'دارد (Checker)' : 'ندارد (فقط پیشنهاددهنده)'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Selected Role Permissions Matrix (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-amber-600" />
                  <h2 className="text-base font-bold text-slate-900 font-title">
                    ماتریس دسترسی‌های نقش: {selectedRole?.roleNameFa || selectedRole?.titleFa || 'نقش منتخب'}
                  </h2>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedRole?.roleNameEn || selectedRole?.titleEn || selectedRole?.role}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-xl">
                  {(selectedRole?.allowedModules || []).length} ماژول مجاز
                </span>
              </div>
            </div>

            {/* Granular Permissions Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">ماژول‌های سیستم‌عامل قیمت‌گذاری</th>
                    <th className="py-3 px-4 text-center">مشاهده و گزارش‌گیری</th>
                    <th className="py-3 px-4 text-center">ویرایش و پیشنهاد (Maker)</th>
                    <th className="py-3 px-4 text-center">تصویب و انتشار (Checker)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {Object.entries(moduleNamesFa).map(([moduleKey, moduleTitleFa]) => {
                    const isModuleAllowed = (selectedRole?.allowedModules || []).includes(moduleKey as any);
                    const canEdit = isModuleAllowed && selectedRole?.id !== 'operator';
                    const canApprove = isModuleAllowed && Boolean(selectedRole?.canApproveDeployment);

                    return (
                      <tr key={moduleKey} className="hover:bg-slate-50">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {moduleTitleFa}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {isModuleAllowed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 inline-block" />
                          ) : (
                            <XCircle className="w-4 h-4 text-slate-300 inline-block" />
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {canEdit ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 inline-block" />
                          ) : (
                            <XCircle className="w-4 h-4 text-slate-300 inline-block" />
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {canApprove ? (
                            <span className="font-bold text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              <Lock className="w-3 h-3" />
                              مجاز (MFA)
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">غیرمجاز</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
