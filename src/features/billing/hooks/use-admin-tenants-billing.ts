import { useQuery } from "@tanstack/react-query"
import { fetchAdminTenantsBilling } from "../billing.service"

export const useAdminTenantsBilling = () =>
  useQuery({
    queryKey: ["billing", "admin", "tenants"],
    queryFn: fetchAdminTenantsBilling,
  })
