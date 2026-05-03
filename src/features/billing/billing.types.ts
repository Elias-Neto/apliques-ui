type TypeSubscriptionStatus = 'pending_activation' | 'active' | 'overdue' | 'suspended'
type TypeChargeStatus = 'pending' | 'paid' | 'expired' | 'manually_paid' | 'failed' | 'cancelled'

interface TypeSubscription {
  subscriptionStatus: TypeSubscriptionStatus
  nextBillingAt: string | null
  lastPaidAt: string | null
  billingAmountCents: number
  daysUntilDue: number | null
  isPlatformOwner?: boolean
}

interface TypeCharge {
  chargeID: string
  status: TypeChargeStatus
  amountCents: number
  brCode: string
  brCodeBase64: string
  expiresAt: string
  cycleStart: string
  cycleEnd: string
  createdAt: string
}

interface TypeChargePreview {
  reason: 'no_charge_yet' | 'pending_activation' | 'platform_owner_no_billing'
  subscriptionStatus?: TypeSubscriptionStatus
  nextBillingAt?: string | null
  daysUntilDue?: number | null
  billingAmountCents?: number
}

interface TypeAdminTenant {
  tenantID: string
  name: string
  plan: string
  subscriptionStatus: TypeSubscriptionStatus
  nextBillingAt: string | null
  billingAmountCents: number
  lastPaidAt: string | null
  billingActivatedAt: string | null
  currentPendingChargeID: string | null
  lastBillingError?: { at: string; message: string } | null
}

interface TypeBillingKpis {
  active: number
  overdue: number
  suspended: number
  pendingActivation: number
}

interface TypeAdminTenantsResponse {
  kpis: TypeBillingKpis
  tenants: TypeAdminTenant[]
}

interface TypeGenerateChargeResponse {
  chargeID: string
  brCode: string
  brCodeBase64: string
  expiresAt: string
  amountCents: number
}

interface TypeMarkPaidResponse {
  chargeID: string
  status: 'manually_paid'
  tenant: {
    subscriptionStatus: 'active'
    lastPaidAt: string
    nextBillingAt: string
  }
}

interface TypeChangeStatusResponse {
  tenantID: string
  subscriptionStatus: TypeSubscriptionStatus
  changedBy: string
  changedAt: string
}

interface TypeActivateTenantResponse {
  tenantID: string
  subscriptionStatus: 'active'
  billingActivatedAt: string
  nextBillingAt: string
  billingAmountCents: number
}

export type {
  TypeSubscriptionStatus,
  TypeChargeStatus,
  TypeSubscription,
  TypeCharge,
  TypeChargePreview,
  TypeAdminTenant,
  TypeBillingKpis,
  TypeAdminTenantsResponse,
  TypeGenerateChargeResponse,
  TypeMarkPaidResponse,
  TypeChangeStatusResponse,
  TypeActivateTenantResponse,
}
