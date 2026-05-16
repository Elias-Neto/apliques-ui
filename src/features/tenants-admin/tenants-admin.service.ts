import { api } from '@/services/http'

import type { TypeAdminTenantRow, TypeCreateTenantPayload, TypePlanOption } from './tenants-admin.types'

const listTenantsAdmin = (): Promise<TypeAdminTenantRow[]> =>
  api.get('/admin/tenants').then(r => r.data)

const createTenantAdmin = (payload: TypeCreateTenantPayload): Promise<{ id: string }> =>
  api.post('/admin/tenants', payload).then(r => r.data)

const listPlans = (): Promise<TypePlanOption[]> =>
  api.get('/plans').then(r => r.data)

export { listTenantsAdmin, createTenantAdmin, listPlans }
