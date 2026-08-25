import React, { useState } from 'react';
import {
  Users,
  Search,
  History,
  Phone,
  Mail,
  Building,
  MapPin,
  DollarSign,
  X,
  UserX,
} from 'lucide-react';
import {
  OrgMember,
  ManagedRole,
  SystemModuleDefinition,
} from '../../../../types/roles';

interface UserRoleAssignmentTabProps {
  members: OrgMember[];
  roles: ManagedRole[];
  modules?: SystemModuleDefinition[];
  onReassignUserRole: (userId: string, newRoleId: string) => void;
  onAddMember?: (member: Partial<OrgMember>, customRoleToCreate?: ManagedRole) => void;
  onToggleUserStatus: (userId: string) => void;
  onNavigateToAuditLog: (filterTarget?: string) => void;
  portalType: 'carrier' | 'shipper';
  selectedFilterRoleId?: string | null;
}

export const UserRoleAssignmentTab: React.FC<UserRoleAssignmentTabProps> = ({
  members,
  roles,
  onReassignUserRole,
  onToggleUserStatus,
  onNavigateToAuditLog,
  portalType,
  selectedFilterRoleId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>(selectedFilterRoleId || 'all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  const departments = Array.from(new Set(members.map((m) => m.departmentFa))).filter(Boolean);

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.phone.includes(searchQuery) ||
      m.departmentFa.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (roleFilter !== 'all' && m.roleId !== roleFilter) return false;
    if (departmentFilter !== 'all' && m.departmentFa !== departmentFilter) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 font-title">
                انتساب نقش و سطوح دسترسی به پرسنل (User-Role Assignment)
              </h2>
              <span className="bg-teal-100 text-teal-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                {members.length} کاربر ثبت‌شده
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              مدیریت و انتساب بلادرنگ نقش‌های سازمانی، وضعیت فعال‌بودن، حوزه انبار و سقف تایید مالی پرسنل
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigateToAuditLog()}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border border-slate-200 shadow-2xs cursor-pointer"
          >
            <History className="w-4 h-4 text-slate-500" />
            <span>مشاهده تاریخچه تغییرات (Audit Log)</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی نام، ایمیل، شماره تماس یا دپارتمان..."
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

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-600">فیلتر نقش:</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:ring-2 focus:ring-teal-500 outline-hidden"
            >
              <option value="all">همه نقش‌ها ({members.length})</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.titleFa} ({r.userCount} نفر)
                </option>
              ))}
            </select>
          </div>

          {departments.length > 0 && (
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-600">واحد سازمانی:</label>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:ring-2 focus:ring-teal-500 outline-hidden"
              >
                <option value="all">همه واحدها</option>
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          )}

          {(roleFilter !== 'all' || departmentFilter !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setRoleFilter('all');
                setDepartmentFilter('all');
                setSearchQuery('');
              }}
              className="px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-bold transition-all cursor-pointer"
            >
              پاکسازی فیلترها
            </button>
          )}
        </div>
      </div>

      {/* Users Table */}
      {filteredMembers.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-700">هیچ کاربری با فیلترهای انتخابی یافت نشد</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            می‌توانید فیلترهای جستجو را پاک کنید.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500">
                  <th className="py-3.5 px-4">مشخصات کاربر</th>
                  <th className="py-3.5 px-4">واحد سازمانی</th>
                  <th className="py-3.5 px-4">نقش فعلی و تغییر بلادرنگ</th>
                  {portalType === 'shipper' && <th className="py-3.5 px-4">حوزه انبار و سقف تایید</th>}
                  <th className="py-3.5 px-4">وضعیت دسترسی</th>
                  <th className="py-3.5 px-4 text-left">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredMembers.map((m) => {
                  const currentRole = roles.find((r) => r.id === m.roleId);
                  const isUserActive = m.status === 'active';

                  return (
                    <tr
                      key={m.id}
                      className={`hover:bg-slate-50/60 transition-colors ${
                        !isUserActive ? 'bg-slate-50/30 opacity-70' : ''
                      }`}
                    >
                      {/* Name & Contact */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                            {m.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{m.fullName}</span>
                              <span className="text-[10px] font-mono text-slate-400">{m.id}</span>
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5 font-mono">
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3 text-slate-400" />
                                {m.phone}
                              </span>
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3 text-slate-400" />
                                {m.email}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-xl font-medium text-xs">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          {m.departmentFa || currentRole?.departmentFa || 'عملیات سازمانی'}
                        </span>
                      </td>

                      {/* Role Dropdown */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={m.roleId}
                            disabled={!isUserActive}
                            onChange={(e) => onReassignUserRole(m.id, e.target.value)}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:ring-2 focus:ring-teal-500 outline-hidden cursor-pointer shadow-2xs disabled:bg-slate-100 disabled:cursor-not-allowed"
                          >
                            {roles.map((r) => (
                              <option key={r.id} value={r.id}>
                                {r.titleFa} — ({r.isSystemRole ? 'سیستمی' : 'سفارشی'})
                              </option>
                            ))}
                          </select>
                          {currentRole && (
                            <span
                              className="w-3 h-3 rounded-full shrink-0 border border-white shadow-2xs"
                              style={{ backgroundColor: currentRole.colorCode }}
                              title={currentRole.titleFa}
                            />
                          )}
                        </div>
                      </td>

                      {/* Shipper Specific Fields */}
                      {portalType === 'shipper' && (
                        <td className="py-3.5 px-4">
                          <div className="space-y-1 text-[11px]">
                            {m.locationScope && (
                              <div className="flex items-center gap-1 text-slate-700">
                                <MapPin className="w-3 h-3 text-amber-600" />
                                <span>{m.locationScope}</span>
                              </div>
                            )}
                            {m.approvalLimitToman !== undefined && (
                              <div className="flex items-center gap-1 text-emerald-700 font-mono font-bold">
                                <DollarSign className="w-3 h-3" />
                                <span>سقف: {(m.approvalLimitToman / 1000000).toLocaleString('fa-IR')} م تومان</span>
                              </div>
                            )}
                          </div>
                        </td>
                      )}

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {isUserActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            فعال
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <UserX className="w-3 h-3" />
                            غیرفعال شده
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-left">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => onNavigateToAuditLog(m.fullName)}
                            className="p-1.5 text-slate-400 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-all"
                            title="مشاهده رویدادهای این کاربر"
                          >
                            <History className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onToggleUserStatus(m.id)}
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                              isUserActive
                                ? 'bg-slate-50 text-slate-600 hover:bg-rose-50 hover:text-rose-700 border-slate-200 hover:border-rose-200'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
                            }`}
                          >
                            {isUserActive ? 'تعلیق دسترسی' : 'فعال‌سازی مجدد'}
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
