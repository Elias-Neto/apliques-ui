import { api } from '../http'
import { TypeCreateTenantPayload, TypeTenant } from "../../types/tenants"

const createTenant = async (
  payload: TypeCreateTenantPayload
): Promise<TypeTenant> => {
  const response = await api.post("/tenants", payload)
  return response.data
}

export { createTenant }