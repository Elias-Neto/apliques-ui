import { pessoaHandlers } from './pessoas'
import { sessionHandlers } from './sessions'
import { tenantHandlers } from './tenants'
import { permissionGroupHandlers } from './permission-groups'

export const handlers = [
  ...pessoaHandlers,
  ...sessionHandlers,
  ...tenantHandlers,
  ...permissionGroupHandlers,
]
