enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

enum Module {
  Management = 'management',
  Billing = 'billing',
  Platform = 'platform',
}

enum Permission {
  // management
  ManagementPeopleList = 'management.people.list',
  ManagementPermissionGroupsList = 'management.permission-groups.list',
  ManagementPermissionGroupsEdit = 'management.permission-groups.edit',

  BillingMeShow = 'billing.me.show',

  // platform.billing (ADR-0003)
  BillingAdminList = 'platform.billing.list',
  BillingAdminManage = 'platform.billing.manage',

  // platform.tenants (ADR-0003)
  ImpersonateTenant = 'platform.tenants.impersonate',
  TenantAdminList = 'platform.tenants.list',
  TenantAdminCreate = 'platform.tenants.create',
}

export { UserRole, Module, Permission }
