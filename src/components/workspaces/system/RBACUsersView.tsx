import React from 'react';
import { RoleManagementView } from './roles/RoleManagementView';

export const RBACUsersView: React.FC = () => {
  return <RoleManagementView portalType="carrier" />;
};
