import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
  Users,
  History,
  Plus,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Building,
  Key,
} from 'lucide-react';
import {
  ManagedRole,
  OrgMember,
  RoleAuditLogEntry,
  SystemModuleDefinition,
} from '../../../../types/roles';
import {
  CARRIER_MODULES,
  SHIPPER_MODULES,
  INITIAL_CARRIER_MANAGED_ROLES,
  INITIAL_SHIPPER_MANAGED_ROLES,
  INITIAL_CARRIER_MEMBERS,
  INITIAL_SHIPPER_MEMBERS,
  INITIAL_ROLE_AUDIT_LOGS,
} from '../../../../data/mockRolesData';
import { RoleListTab } from './RoleListTab';
import { UserRoleAssignmentTab } from './UserRoleAssignmentTab';
import { RoleAuditLogTab } from './RoleAuditLogTab';
import { RoleStepperModal } from './RoleStepperModal';
import { DeleteRoleModal } from './DeleteRoleModal';
import { usePricing } from '../../../../store/PricingContext';

interface RoleManagementViewProps {
  portalType?: 'carrier' | 'shipper';
}

export const RoleManagementView: React.FC<RoleManagementViewProps> = ({
  portalType: propPortalType,
}) => {
  const { userPortalType, userName, userRole } = usePricing();
  const currentPortalType: 'carrier' | 'shipper' =
    propPortalType || (userPortalType === 'shipper' ? 'shipper' : 'carrier');

  // Sub-tabs State
  const [activeTab, setActiveTab] = useState<'roles_list' | 'user_assignment' | 'audit_log'>('roles_list');

  // Modules Definition for current portal
  const activeModules: SystemModuleDefinition[] =
    currentPortalType === 'carrier' ? CARRIER_MODULES : SHIPPER_MODULES;

  // Roles State (Persisted in LocalStorage or Mock fallback)
  const [roles, setRoles] = useState<ManagedRole[]>(() => {
    try {
      const storageKey = `managed_roles_${currentPortalType}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return currentPortalType === 'carrier'
      ? INITIAL_CARRIER_MANAGED_ROLES
      : INITIAL_SHIPPER_MANAGED_ROLES;
  });

  // Org Members State
  const [members, setMembers] = useState<OrgMember[]>(() => {
    try {
      const storageKey = `managed_members_${currentPortalType}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return currentPortalType === 'carrier'
      ? INITIAL_CARRIER_MEMBERS
      : INITIAL_SHIPPER_MEMBERS;
  });

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<RoleAuditLogEntry[]>(() => {
    try {
      const storageKey = `managed_audit_logs_${currentPortalType}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_ROLE_AUDIT_LOGS.filter((l) => l.portalType === currentPortalType || !l.portalType);
  });

  // Recalculate userCount per role when members change
  useEffect(() => {
    setRoles((prevRoles) =>
      prevRoles.map((role) => {
        const count = members.filter((m) => m.roleId === role.id).length;
        return { ...role, userCount: count };
      })
    );
  }, [members]);

  // Persist State
  useEffect(() => {
    try {
      localStorage.setItem(`managed_roles_${currentPortalType}`, JSON.stringify(roles));
      localStorage.setItem(`managed_members_${currentPortalType}`, JSON.stringify(members));
      localStorage.setItem(`managed_audit_logs_${currentPortalType}`, JSON.stringify(auditLogs));
    } catch {
      // ignore
    }
  }, [roles, members, auditLogs, currentPortalType]);

  // Modals State
  const [isStepperOpen, setIsStepperOpen] = useState(false);
  const [stepperMode, setStepperMode] = useState<'create' | 'edit' | 'duplicate'>('create');
  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState<ManagedRole | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<ManagedRole | null>(null);

  const [filterRoleIdForUsers, setFilterRoleIdForUsers] = useState<string | null>(null);
  const [auditLogSearchTarget, setAuditLogSearchTarget] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // -------------------------------------------------------------
  // CRUD Actions
  // -------------------------------------------------------------

  const handleOpenCreate = () => {
    setSelectedRoleForEdit(null);
    setStepperMode('create');
    setIsStepperOpen(true);
  };

  const handleOpenEdit = (role: ManagedRole) => {
    setSelectedRoleForEdit(role);
    setStepperMode('edit');
    setIsStepperOpen(true);
  };

  const handleOpenDuplicate = (role: ManagedRole) => {
    setSelectedRoleForEdit(role);
    setStepperMode('duplicate');
    setIsStepperOpen(true);
  };

  const handleOpenDelete = (role: ManagedRole) => {
    setRoleToDelete(role);
    setIsDeleteModalOpen(true);
  };

  // Save Role from Stepper
  const handleSaveRole = (savedRole: ManagedRole) => {
    const timestamp = new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());

    if (stepperMode === 'edit') {
      const oldRole = roles.find((r) => r.id === savedRole.id);
      setRoles((prev) => prev.map((r) => (r.id === savedRole.id ? savedRole : r)));

      // Audit Log for Edit
      const newLog: RoleAuditLogEntry = {
        id: `LOG-RBAC-${Date.now()}`,
        timestamp,
        actorName: userName || 'مدیر ارشد سازمان',
        actorRole: userRole || 'مدیر سیستم',
        actionType: 'edit_role',
        targetId: savedRole.id,
        targetTitle: savedRole.titleFa,
        portalType: currentPortalType,
        beforeState: `دپارتمان: ${oldRole?.departmentFa || '-'} | عنوان: ${oldRole?.titleFa}`,
        afterState: `دپارتمان: ${savedRole.departmentFa} | عنوان: ${savedRole.titleFa}`,
        detailsFa: `به‌روزرسانی تنظیمات و ماتریس دسترسی‌های نقش «${savedRole.titleFa}»`,
        ipAddress: '192.168.1.100',
      };
      setAuditLogs((prev) => [newLog, ...prev]);
      showToast(`نقش «${savedRole.titleFa}» با موفقیت ویرایش و ذخیره شد.`);
    } else if (stepperMode === 'duplicate') {
      const newId = `role-custom-${Date.now()}`;
      const duplicatedRole = { ...savedRole, id: newId, isSystemRole: false, userCount: 0 };
      setRoles((prev) => [...prev, duplicatedRole]);

      // Audit Log for Duplicate
      const newLog: RoleAuditLogEntry = {
        id: `LOG-RBAC-${Date.now()}`,
        timestamp,
        actorName: userName || 'مدیر ارشد سازمان',
        actorRole: userRole || 'مدیر سیستم',
        actionType: 'duplicate_role',
        targetId: newId,
        targetTitle: duplicatedRole.titleFa,
        portalType: currentPortalType,
        beforeState: `الگو: ${selectedRoleForEdit?.titleFa}`,
        afterState: `نقش جدید: ${duplicatedRole.titleFa}`,
        detailsFa: `کپی‌سازی و ایجاد نقش جدید بر پایه الگوی «${selectedRoleForEdit?.titleFa}»`,
        ipAddress: '192.168.1.100',
      };
      setAuditLogs((prev) => [newLog, ...prev]);
      showToast(`نقش جدید «${duplicatedRole.titleFa}» با موفقیت از روی الگو ایجاد شد.`);
    } else {
      // Create
      setRoles((prev) => [...prev, savedRole]);

      // Audit Log for Create
      const newLog: RoleAuditLogEntry = {
        id: `LOG-RBAC-${Date.now()}`,
        timestamp,
        actorName: userName || 'مدیر ارشد سازمان',
        actorRole: userRole || 'مدیر سیستم',
        actionType: 'create_role',
        targetId: savedRole.id,
        targetTitle: savedRole.titleFa,
        portalType: currentPortalType,
        beforeState: '---',
        afterState: `عنوان: ${savedRole.titleFa} | دپارتمان: ${savedRole.departmentFa}`,
        detailsFa: `تعریف و ثبت نقش سازمانی جدید با ${Object.keys(savedRole.permissions).length} ماژول مجوز`,
        ipAddress: '192.168.1.100',
      };
      setAuditLogs((prev) => [newLog, ...prev]);
      showToast(`نقش «${savedRole.titleFa}» با موفقیت در سامانه ایجاد شد.`);
    }

    setIsStepperOpen(false);
  };

  // Delete Role with optional Reassignment
  const handleConfirmDeleteRole = (deletedRoleId: string, reassignToRoleId?: string) => {
    const deletedRole = roles.find((r) => r.id === deletedRoleId);
    if (!deletedRole) return;

    const targetReassignRole = reassignToRoleId
      ? roles.find((r) => r.id === reassignToRoleId)
      : undefined;

    const timestamp = new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());

    // Reassign members if necessary
    if (reassignToRoleId && targetReassignRole) {
      setMembers((prev) =>
        prev.map((m) => {
          if (m.roleId === deletedRoleId) {
            return {
              ...m,
              roleId: targetReassignRole.id,
              roleTitleFa: targetReassignRole.titleFa,
            };
          }
          return m;
        })
      );
    }

    // Remove Role
    setRoles((prev) => prev.filter((r) => r.id !== deletedRoleId));

    // Audit Log for Deletion
    const newLog: RoleAuditLogEntry = {
      id: `LOG-RBAC-${Date.now()}`,
      timestamp,
      actorName: userName || 'مدیر ارشد سازمان',
      actorRole: userRole || 'مدیر سیستم',
      actionType: 'delete_role',
      targetId: deletedRoleId,
      targetTitle: deletedRole.titleFa,
      portalType: currentPortalType,
      beforeState: `نقش با ${deletedRole.userCount} کاربر منتسب`,
      afterState: targetReassignRole ? `حذف شد (کاربران به «${targetReassignRole.titleFa}» منتقل شدند)` : 'حذف شد',
      detailsFa: `حذف دائمی نقش «${deletedRole.titleFa}» از ساختار سازمانی توسط مدیر ارشد`,
      ipAddress: '192.168.1.100',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    showToast(`نقش «${deletedRole.titleFa}» با موفقیت حذف گردید.`);
  };

  // Reassign Single User Role
  const handleReassignUserRole = (userId: string, newRoleId: string) => {
    const member = members.find((m) => m.id === userId);
    const targetRole = roles.find((r) => r.id === newRoleId);
    if (!member || !targetRole || member.roleId === newRoleId) return;

    const oldRoleTitle = member.roleTitleFa;

    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === userId) {
          return {
            ...m,
            roleId: newRoleId,
            roleTitleFa: targetRole.titleFa,
            lastActive: 'هم‌اکنون تغییر نقش یافت',
          };
        }
        return m;
      })
    );

    const timestamp = new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());

    const newLog: RoleAuditLogEntry = {
      id: `LOG-RBAC-${Date.now()}`,
      timestamp,
      actorName: userName || 'مدیر ارشد سازمان',
      actorRole: userRole || 'مدیر سیستم',
      actionType: 'reassign_user_role',
      targetId: member.id,
      targetTitle: member.fullName,
      portalType: currentPortalType,
      beforeState: `نقش قبلی: ${oldRoleTitle}`,
      afterState: `نقش جدید: ${targetRole.titleFa}`,
      detailsFa: `تغییر و بازتخصیص نقش سازمانی کاربر «${member.fullName}» به «${targetRole.titleFa}»`,
      ipAddress: '192.168.1.100',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    showToast(`نقش کاربر «${member.fullName}» به «${targetRole.titleFa}» تغییر یافت.`);
  };

  // Add Member (With support for custom dynamic role creation on the fly)
  const handleAddMember = (newMember: Partial<OrgMember>, customRoleToCreate?: ManagedRole) => {
    const timestamp = new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());

    let targetRoleId = newMember.roleId || roles[0]?.id || '';
    let targetRoleTitle = newMember.roleTitleFa || roles[0]?.titleFa || 'نقش سازمانی';

    // If manager created a custom role on the fly:
    if (customRoleToCreate) {
      targetRoleId = customRoleToCreate.id;
      targetRoleTitle = customRoleToCreate.titleFa;

      // Add to organization roles catalog
      setRoles((prev) => [customRoleToCreate, ...prev]);

      // Audit Log for role creation
      const roleLog: RoleAuditLogEntry = {
        id: `LOG-RBAC-${Date.now()}-ROLE`,
        timestamp,
        actorName: userName || 'مدیر ارشد سازمان',
        actorRole: userRole || 'مدیر سیستم',
        actionType: 'create_role',
        targetId: customRoleToCreate.id,
        targetTitle: customRoleToCreate.titleFa,
        portalType: currentPortalType,
        beforeState: '---',
        afterState: `عنوان: ${customRoleToCreate.titleFa} | دپارتمان: ${customRoleToCreate.departmentFa}`,
        detailsFa: `تعریف و ثبت مستقیم نقش سفارشی «${customRoleToCreate.titleFa}» با ${Object.keys(customRoleToCreate.permissions).length} ماژول دسترسی و ${customRoleToCreate.dutiesFa.length} شرح وظیفه اختصاصی`,
        ipAddress: '192.168.1.100',
      };
      setAuditLogs((prev) => [roleLog, ...prev]);
    }

    const memberObj: OrgMember = {
      id: newMember.id || `USR-${Date.now()}`,
      fullName: newMember.fullName || 'کاربر جدید',
      email: newMember.email || 'user@org.ir',
      phone: newMember.phone || '۰۹۱۲۰۰۰۰۰۰۰',
      roleId: targetRoleId,
      roleTitleFa: targetRoleTitle,
      departmentFa: newMember.departmentFa || (customRoleToCreate ? customRoleToCreate.departmentFa : 'عملیات سازمانی'),
      portalType: currentPortalType,
      status: 'active',
      lastActive: 'دعوت‌نامه ارسال شد',
      locationScope: newMember.locationScope,
      approvalLimitToman: newMember.approvalLimitToman,
    };

    setMembers((prev) => [...prev, memberObj]);

    const userLog: RoleAuditLogEntry = {
      id: `LOG-RBAC-${Date.now()}-USER`,
      timestamp,
      actorName: userName || 'مدیر ارشد سازمان',
      actorRole: userRole || 'مدیر سیستم',
      actionType: 'add_user',
      targetId: memberObj.id,
      targetTitle: memberObj.fullName,
      portalType: currentPortalType,
      beforeState: '---',
      afterState: `کاربر فعال با نقش «${memberObj.roleTitleFa}»`,
      detailsFa: `ثبت پرسنل جدید «${memberObj.fullName}» و تخصیص نقش «${memberObj.roleTitleFa}»`,
      ipAddress: '192.168.1.100',
    };
    setAuditLogs((prev) => [userLog, ...prev]);

    showToast(
      customRoleToCreate
        ? `کاربر «${memberObj.fullName}» با نقش اختصاصی «${targetRoleTitle}» و دسترسی‌های تعیین‌شده با موفقیت ثبت شد.`
        : `کاربر «${memberObj.fullName}» با موفقیت به پرسنل سازمان افزوده شد.`
    );
  };

  // Toggle User Active Status
  const handleToggleUserStatus = (userId: string) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === userId) {
          const nextStatus = m.status === 'active' ? 'inactive' : 'active';
          return { ...m, status: nextStatus };
        }
        return m;
      })
    );
    showToast('وضعیت دسترسی کاربر به‌روزرسانی شد.');
  };

  // Navigation helpers
  const handleNavigateToUserAssignment = (roleId?: string) => {
    setFilterRoleIdForUsers(roleId || null);
    setActiveTab('user_assignment');
  };

  const handleNavigateToAuditLog = (targetQuery?: string) => {
    setAuditLogSearchTarget(targetQuery || null);
    setActiveTab('audit_log');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 bg-teal-50 border border-teal-300 rounded-2xl text-teal-900 text-xs font-bold flex items-center justify-between shadow-md animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-teal-700 hover:text-teal-900 text-xs font-bold mr-4"
          >
            بستن
          </button>
        </div>
      )}

      {/* Main Navigation Tabs */}
      <div className="bg-white p-3 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {[
            {
              id: 'roles_list',
              label: '۱. لیست نقش‌ها و ماتریس دسترسی‌ها',
              icon: Shield,
              count: roles.length,
            },
            {
              id: 'user_assignment',
              label: '۲. انتساب نقش به پرسنل و کاربران',
              icon: Users,
              count: members.length,
            },
            {
              id: 'audit_log',
              label: '۳. تاریخچه ممیزی و تغییرات (Audit Log)',
              icon: History,
              count: auditLogs.length,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.id === 'user_assignment') setFilterRoleIdForUsers(null);
                  if (tab.id === 'audit_log') setAuditLogSearchTarget(null);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-teal-700 text-white shadow-sm ring-2 ring-teal-700/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    isSelected ? 'bg-teal-800 text-teal-100' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-tab Views */}
      {activeTab === 'roles_list' && (
        <RoleListTab
          roles={roles}
          onOpenCreate={handleOpenCreate}
          onOpenEdit={handleOpenEdit}
          onOpenDuplicate={handleOpenDuplicate}
          onOpenDelete={handleOpenDelete}
          onNavigateToUserAssignment={handleNavigateToUserAssignment}
          portalType={currentPortalType}
        />
      )}

      {activeTab === 'user_assignment' && (
        <UserRoleAssignmentTab
          members={members}
          roles={roles}
          modules={activeModules}
          onReassignUserRole={handleReassignUserRole}
          onAddMember={handleAddMember}
          onToggleUserStatus={handleToggleUserStatus}
          onNavigateToAuditLog={handleNavigateToAuditLog}
          portalType={currentPortalType}
          selectedFilterRoleId={filterRoleIdForUsers}
        />
      )}

      {activeTab === 'audit_log' && (
        <RoleAuditLogTab
          auditLogs={auditLogs}
          portalType={currentPortalType}
          initialFilterTarget={auditLogSearchTarget}
        />
      )}

      {/* Stepper Modal (4-step Creation/Edit/Duplicate) */}
      <RoleStepperModal
        isOpen={isStepperOpen}
        onClose={() => setIsStepperOpen(false)}
        onSave={handleSaveRole}
        initialRole={selectedRoleForEdit}
        modules={activeModules}
        portalType={currentPortalType}
        mode={stepperMode}
      />

      {/* Delete Role Modal with Safe Reassignment Check */}
      <DeleteRoleModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        roleToDelete={roleToDelete}
        assignedUsers={members.filter((m) => m.roleId === roleToDelete?.id)}
        availableRoles={roles}
        onConfirmDelete={handleConfirmDeleteRole}
      />
    </div>
  );
};
