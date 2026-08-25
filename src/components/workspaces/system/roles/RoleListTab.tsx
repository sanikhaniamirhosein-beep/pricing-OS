import React, { useState } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Copy,
  Trash2,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Users,
  Calendar,
  Lock,
  Sparkles,
  Layers,
  Filter,
  CheckCircle2,
  TrendingUp,
  Truck,
  CreditCard,
  Calculator,
  Warehouse,
  Receipt,
  FileCheck,
  FileSpreadsheet,
  Sliders,
  X,
} from 'lucide-react';
import { ManagedRole } from '../../../../types/roles';

interface RoleListTabProps {
  roles: ManagedRole[];
  onOpenCreate: () => void;
  onOpenEdit: (role: ManagedRole) => void;
  onOpenDuplicate: (role: ManagedRole) => void;
  onOpenDelete: (role: ManagedRole) => void;
  onNavigateToUserAssignment: (roleId?: string) => void;
  portalType: 'carrier' | 'shipper';
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldCheck,
  TrendingUp,
  Truck,
  CreditCard,
  Users,
  Calculator,
  Warehouse,
  Receipt,
  FileCheck,
  FileSpreadsheet,
  Sliders,
  Layers,
};

export const RoleListTab: React.FC<RoleListTabProps> = ({
  roles,
  onOpenCreate,
  onOpenEdit,
  onOpenDuplicate,
  onOpenDelete,
  onNavigateToUserAssignment,
  portalType,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'system' | 'custom'>('all');

  const filteredRoles = roles.filter((r) => {
    const matchesSearch =
      r.titleFa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.descriptionFa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.departmentFa.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (typeFilter === 'system') return r.isSystemRole;
    if (typeFilter === 'custom') return !r.isSystemRole;
    return true;
  });

  const systemRolesCount = roles.filter((r) => r.isSystemRole).length;
  const customRolesCount = roles.filter((r) => !r.isSystemRole).length;
  const totalUsersCount = roles.reduce((acc, r) => acc + (r.userCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Action Bar & Metrics */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 font-title">
                  مدیریت نقش‌ها و سطوح دسترسی سازمانی (RBAC)
                </h2>
                <span className="bg-teal-100 text-teal-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {roles.length} نقش فعال
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                تعریف نقش‌های استراتژیست، مدیران عملیات، پرسنل انبار و مالی با ماتریس تفکیک وظایف و ثبت ممیزی
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenCreate}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ نقش جدید</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">نقش‌های پایه سیستمی</span>
            <div className="text-xl font-bold text-slate-900 mt-1 font-mono">{systemRolesCount} نقش</div>
            <span className="text-[10px] text-teal-700 font-medium">غیرقابل حذف / استاندارد هسته</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
            <Lock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">نقش‌های سفارشی سازمان</span>
            <div className="text-xl font-bold text-slate-900 mt-1 font-mono">{customRolesCount} نقش</div>
            <span className="text-[10px] text-purple-700 font-medium">قابلیت ویرایش کامل و کپی</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">کاربران منتسب در سیستم</span>
            <div className="text-xl font-bold text-slate-900 mt-1 font-mono">{totalUsersCount} کاربر</div>
            <button
              type="button"
              onClick={() => onNavigateToUserAssignment()}
              className="text-[10px] text-teal-700 hover:underline font-bold"
            >
              مشاهده جدول انتساب کاربران ➔
            </button>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در عنوان نقش، توضیحات یا دپارتمان..."
            className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-hidden font-medium"
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

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              typeFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            همه نقش‌ها ({roles.length})
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter('system')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              typeFilter === 'system'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            سیستمی ({systemRolesCount})
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter('custom')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              typeFilter === 'custom'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            سفارشی ({customRolesCount})
          </button>
        </div>
      </div>

      {/* Role Table / List */}
      {filteredRoles.length === 0 ? (
        /* Empty State */
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">نقشی با این مشخصات یافت نشد</h3>
            <p className="text-xs text-slate-500 mt-1">
              عبارت جستجو یا فیلترهای اعمال‌شده نتیجه‌ای در بر نداشت.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('all');
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
            >
              پاکسازی فیلترها
            </button>
            <button
              type="button"
              onClick={onOpenCreate}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all"
            >
              + تعریف نقش جدید
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-bold text-slate-700">
                  <th className="py-4 px-5">عنوان نقش و شناسه</th>
                  <th className="py-4 px-4">توضیح کوتاه و دپارتمان</th>
                  <th className="py-4 px-3 text-center">کاربران متصل</th>
                  <th className="py-4 px-3 text-center">نوع نقش</th>
                  <th className="py-4 px-3 text-center">آخرین ویرایش</th>
                  <th className="py-4 px-5 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredRoles.map((role) => {
                  const IconComp = ICON_MAP[role.iconName] || ShieldCheck;
                  return (
                    <tr
                      key={role.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Title & Icon */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-xs shrink-0"
                            style={{ backgroundColor: role.colorCode || '#085041' }}
                          >
                            <IconComp className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-xs">{role.titleFa}</span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                {role.levelBadge}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono" dir="ltr">
                              {role.titleEn}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Description & Department */}
                      <td className="py-4 px-4 max-w-xs">
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {role.descriptionFa}
                        </p>
                        <span className="text-[10px] text-teal-800 font-medium mt-1 block">
                          واحد: {role.departmentFa}
                        </span>
                      </td>

                      {/* User Count */}
                      <td className="py-4 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => onNavigateToUserAssignment(role.id)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 transition-colors font-mono font-bold text-xs"
                          title="مشاهده کاربران دارای این نقش"
                        >
                          <Users className="w-3.5 h-3.5 text-slate-500" />
                          <span>{role.userCount || 0} نفر</span>
                        </button>
                      </td>

                      {/* Role Type Badge */}
                      <td className="py-4 px-3 text-center">
                        {role.isSystemRole ? (
                          <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-1 rounded-full text-[11px] font-bold">
                            <Lock className="w-3 h-3 text-teal-600" />
                            <span>سیستمی (پیش‌فرض)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-800 border border-purple-200 px-2.5 py-1 rounded-full text-[11px] font-bold">
                            <Sparkles className="w-3 h-3 text-purple-600" />
                            <span>سفارشی سازمان</span>
                          </span>
                        )}
                      </td>

                      {/* Dates */}
                      <td className="py-4 px-3 text-center font-mono text-[11px] text-slate-500">
                        <div>{role.updatedAt || role.createdAt}</div>
                        <div className="text-[10px] text-slate-400">توسط {role.lastEditedBy || 'سیستم'}</div>
                      </td>

                      {/* Operations */}
                      <td className="py-4 px-5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => onOpenEdit(role)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 transition-colors shadow-2xs"
                            title="ویرایش مشخصات و دسترسی‌ها"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Duplicate / Copy Button */}
                          <button
                            type="button"
                            onClick={() => onOpenDuplicate(role)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-800 transition-colors shadow-2xs"
                            title="کپی‌سازی و ساخت نقش جدید بر اساس این الگو"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          {/* Delete Button (Disabled for System Roles) */}
                          <button
                            type="button"
                            disabled={role.isSystemRole}
                            onClick={() => onOpenDelete(role)}
                            className={`p-2 rounded-xl transition-colors shadow-2xs ${
                              role.isSystemRole
                                ? 'bg-slate-100 text-slate-300 cursor-not-allowed opacity-50'
                                : 'bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 cursor-pointer'
                            }`}
                            title={
                              role.isSystemRole
                                ? 'نقش‌های سیستمی غیرقابل حذف هستند'
                                : 'حذف این نقش'
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
