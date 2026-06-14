enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

enum Module {
  Management = 'management',
  Billing = 'billing',
  Platform = 'platform',

  // domain — Romero
  Customers = 'customers',
  Materials = 'materials',
  Colors = 'colors',
  Designs = 'designs',
  Orders = 'orders',
  Payments = 'payments',
  Finance = 'finance',
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
  TenantAdminEdit = 'platform.tenants.edit',

  // customers
  CustomersCreate = 'customers.create',
  CustomersRead   = 'customers.read',
  CustomersUpdate = 'customers.update',
  CustomersDelete = 'customers.delete',

  // materials
  MaterialsCreate = 'materials.create',
  MaterialsRead   = 'materials.read',
  MaterialsUpdate = 'materials.update',
  MaterialsDelete = 'materials.delete',

  // colors
  ColorsCreate = 'colors.create',
  ColorsRead   = 'colors.read',
  ColorsUpdate = 'colors.update',
  ColorsDelete = 'colors.delete',

  // designs
  DesignsCreate = 'designs.create',
  DesignsRead   = 'designs.read',
  DesignsUpdate = 'designs.update',
  DesignsDelete = 'designs.delete',

  // orders
  OrdersCreate = 'orders.create',
  OrdersRead   = 'orders.read',
  OrdersUpdate = 'orders.update',
  OrdersDelete = 'orders.delete',
  OrdersUpdateProductionStatus = 'orders.update-production-status',

  // payments
  PaymentsCreate = 'payments.create',
  PaymentsUpdate = 'payments.update',
  PaymentsDelete = 'payments.delete',

  // finance
  FinanceRead = 'finance.read',
}

export { UserRole, Module, Permission }
