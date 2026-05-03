import { api } from "@/services/http"
import type {
  TypeSubscription,
  TypeCharge,
  TypeChargePreview,
  TypeAdminTenantsResponse,
  TypeGenerateChargeResponse,
  TypeMarkPaidResponse,
  TypeChangeStatusResponse,
  TypeActivateTenantResponse,
} from "./billing.types"

export const fetchSubscription = (): Promise<TypeSubscription> =>
  api.get("/me/subscription").then(r => r.data)

export const fetchCurrentCharge = (): Promise<TypeCharge | TypeChargePreview> =>
  api.get("/me/subscription/current-charge").then(r => r.data).catch(err => {
    if (err.response?.status === 404) return err.response.data as TypeChargePreview
    throw err
  })

export const fetchAdminTenantsBilling = (): Promise<TypeAdminTenantsResponse> =>
  api.get("/admin/billing/tenants").then(r => r.data)

export const generateManualCharge = ({
  tenantID,
  reason,
}: {
  tenantID: string
  reason?: string
}): Promise<TypeGenerateChargeResponse> =>
  api.post(`/admin/billing/tenants/${tenantID}/charges`, { reason }).then(r => r.data)

export const markAsPaid = ({
  tenantID,
  chargeID,
  reason,
}: {
  tenantID: string
  chargeID: string
  reason?: string
}): Promise<TypeMarkPaidResponse> =>
  api
    .post(`/admin/billing/tenants/${tenantID}/charges/${chargeID}/mark-paid`, { reason })
    .then(r => r.data)

export const changeSubscriptionStatus = ({
  tenantID,
  subscriptionStatus,
  reason,
}: {
  tenantID: string
  subscriptionStatus: 'active' | 'overdue' | 'suspended'
  reason: string
}): Promise<TypeChangeStatusResponse> =>
  api
    .patch(`/admin/billing/tenants/${tenantID}/subscription`, { subscriptionStatus, reason })
    .then(r => r.data)

export const activateTenantBilling = ({
  tenantID,
  amountCents,
  startBillingAt,
}: {
  tenantID: string
  amountCents: number
  startBillingAt?: string
}): Promise<TypeActivateTenantResponse> =>
  api
    .post(`/admin/billing/tenants/${tenantID}/activate`, { amountCents, startBillingAt })
    .then(r => r.data)
