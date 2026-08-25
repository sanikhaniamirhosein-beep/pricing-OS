import React, { useState } from 'react';
import {
  AlertTriangle,
  X,
  Trash2,
  Users,
  ShieldAlert,
  ArrowRight,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import { ManagedRole, OrgMember } from '../../../../types/roles';

interface DeleteRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleToDelete: ManagedRole | null;
  assignedUsers: OrgMember[];
  availableRoles: ManagedRole[];
  onConfirmDelete: (roleId: string, reassignToRoleId?: string) => void;
}

export const DeleteRoleModal: React.FC<DeleteRoleModalProps> = ({
  isOpen,
  onClose,
  roleToDelete,
  assignedUsers,
  availableRoles,
  onConfirmDelete,
}) => {
  const [selectedReassignRoleId, setSelectedReassignRoleId] = useState<string>('');

  if (!isOpen || !roleToDelete) return null;

  const isSystemRole = roleToDelete.isSystemRole;
  const userCount = assignedUsers.length;
  const otherRoles = availableRoles.filter((r) => r.id !== roleToDelete.id);

  const canDelete = !isSystemRole && (userCount === 0 || !!selectedReassignRoleId);

  const handleConfirm = () => {
    if (!canDelete) return;
    onConfirmDelete(roleToDelete.id, userCount > 0 ? selectedReassignRoleId : undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-6 bg-rose-50/70 border-b border-rose-100 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-rose-950 font-title">
                حذف نقش: {roleToDelete.titleFa}
              </h3>
              <p className="text-xs text-rose-700 mt-0.5">
                بررسی وابستگی‌های کاربری و تایید نهایی حذف نقش سازمانی
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-xl hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* If System Role: Forbidden Notice */}
          {isSystemRole ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <strong className="block font-bold mb-1">نقش‌های پیش‌فرض سیستمی غیرقابل حذف هستند:</strong>
                این نقش جزو استانداردهای پایه معماری سامانه (Core System Role) بوده و حذف آن منجر به اختلال در سطوح دسترسی پیش‌فرض سازمان می‌شود. در صورت عدم نیاز، می‌توانید کاربران متصل به آن را به نقش دیگری انتقال دهید.
              </div>
            </div>
          ) : userCount > 0 ? (
            /* If Users are Connected: Force Reassignment */
            <div className="space-y-4">
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-900 leading-relaxed">
                  <strong className="block font-bold mb-1">
                    اخطار: {userCount} کاربر در حال حاضر دارای این نقش هستند!
                  </strong>
                  امکان حذف این نقش بدون بازتخصیص کاربران وجود ندارد. لطفاً ابتدا نقش جایگزین برای پرسنل زیر را انتخاب نمایید:
                </div>
              </div>

              {/* Connected Users List */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2 max-h-40 overflow-y-auto">
                <div className="text-[11px] font-bold text-slate-500 flex items-center justify-between px-1">
                  <span>کاربران متصل به این نقش</span>
                  <span>{userCount} نفر</span>
                </div>
                {assignedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="bg-white border border-slate-200 rounded-xl p-2.5 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-800 text-[10px] font-bold flex items-center justify-center">
                        {user.fullName.slice(0, 1)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800">{user.fullName}</span>
                        <span className="text-[10px] text-slate-400 font-mono mr-2">{user.email}</span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {user.departmentFa}
                    </span>
                  </div>
                ))}
              </div>

              {/* Select Target Role for Reassignment */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  انتخاب نقش جایگزین برای بازتخصیص کاربران <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedReassignRoleId}
                  onChange={(e) => setSelectedReassignRoleId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-rose-500 outline-hidden font-medium"
                >
                  <option value="">-- لطفاً یک نقش جایگزین انتخاب کنید --</option>
                  {otherRoles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.titleFa} ({r.departmentFa})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  کلیه {userCount} کاربر پس از تایید، بلافاصله به نقش انتخابی بالا منتقل خواهند شد.
                </p>
              </div>
            </div>
          ) : (
            /* No Users Connected */
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 leading-relaxed">
              هیچ کاربری به این نقش متصل نیست. آیا از حذف دائمی نقش <strong>«{roleToDelete.titleFa}»</strong> از سامانه مطمئن هستید؟ این عملیات در تاریخچه ممیزی (Audit Log) ثبت خواهد شد.
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            انصراف
          </button>

          {!isSystemRole && (
            <button
              type="button"
              disabled={!canDelete}
              onClick={handleConfirm}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs ${
                canDelete
                  ? 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              <span>{userCount > 0 ? 'بازتخصیص کاربران و حذف نقش' : 'تایید و حذف نقش'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
