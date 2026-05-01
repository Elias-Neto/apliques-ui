export type Permission = {
  permission: string;
  label: string;
};

export type PermissionContext = {
  context: string;
  label: string;
  permissions: Permission[];
};

export type PermissionGroupPermission = {
  permission: string;
  active: boolean;
};

export type PermissionGroup = {
  id: string;
  label: string;
  permissions: PermissionGroupPermission[];
  moduleActive: boolean;
};

export type PermissionsResponse = {
  contexts: PermissionContext[];
  permissionGroups: PermissionGroup[];
};

// preencher por cliente (ver `enum Module` em ./enums.ts)
export type ModuleType = string;

export type UpdatePermissionsPayload = {
  permissionGroupId: string;
  permissions: PermissionGroupPermission[];
};

export type UpdatePermissionGroupContext = {
  context: string;
  permissions: PermissionGroupPermission[];
};

export type UpdatePermissionGroupPayload = {
  module: ModuleType;
  contexts: UpdatePermissionGroupContext[];
  active?: boolean;
};
