import { useQuery } from '@tanstack/react-query'

import { listTenantsAdmin } from '../tenants-admin.service'

const useAdminTenants = () =>
  useQuery({ queryKey: ['admin', 'tenants'], queryFn: listTenantsAdmin })

export { useAdminTenants }
