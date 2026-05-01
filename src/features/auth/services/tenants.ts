import { api } from '@/services/http'
import { TypeCreateTenantPayload, TypeTenant } from "@/features/auth/types/tenant"

const createTenant = async (
  payload: TypeCreateTenantPayload
): Promise<TypeTenant> => {
  const response = await api.post("/tenants", payload)
  return response.data
}

export { createTenant }