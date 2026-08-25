/**
 * Role Management & Access Control (RBAC) Types
 * Supports both Carrier (Logistics) and Shipper Organizations
 */

export type OperationType = 'view' | 'create' | 'edit' | 'delete' | 'export';

export interface ModulePermissionConfig {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  export: boolean;
}

export interface SystemModuleDefinition {
  id: string;
  code: string;
  nameFa: string;
  nameEn: string;
  categoryFa: string;
  descriptionFa: string;
  isSensitive?: boolean;
  supportedOperations: OperationType[];
}

export interface ManagedRole {
  id: string;
  titleFa: string;
  titleEn: string;
  descriptionFa: string;
  iconName: string;
  colorCode: string;
  isSystemRole: boolean;
  portalType: 'carrier' | 'shipper' | 'both';
  departmentFa: string;
  levelBadge: string;
  userCount: number;
  createdAt: string;
  updatedAt: string;
  lastEditedBy?: string;
  dutiesFa: string[];
  permissions: Record<string, ModulePermissionConfig>;
}

export interface OrgMember {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  roleId: string;
  roleTitleFa: string;
  departmentFa: string;
  portalType: 'carrier' | 'shipper';
  status: 'active' | 'inactive' | 'pending';
  lastActive: string;
  avatar?: string;
  locationScope?: string;
  approvalLimitToman?: number;
}

export type RoleAuditActionType =
  | 'create_role'
  | 'edit_role'
  | 'duplicate_role'
  | 'delete_role'
  | 'reassign_user_role'
  | 'add_user'
  | 'toggle_user_status';

export interface RoleAuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  actionType: RoleAuditActionType;
  targetId: string;
  targetTitle: string;
  portalType: 'carrier' | 'shipper';
  beforeState?: string;
  afterState?: string;
  detailsFa: string;
  ipAddress?: string;
}
