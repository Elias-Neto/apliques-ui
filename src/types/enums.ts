enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

enum Module {
  Management = 'management',
  Billing = 'billing',
}

enum Permission {
  BillingMeShow = 'billing.me.show',
  BillingAdminList = 'billing.admin.list',
  BillingAdminManage = 'billing.admin.manage',
}

export { UserRole, Module, Permission }
