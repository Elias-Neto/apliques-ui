import {
  getModuleLabel,
  getModuleActiveValue,
  getPermissionValue,
  groupPermissionsByContext,
  buildPermissionUpdatesPerGroup,
} from './permission-group.helpers'
import { MOCK_PERMISSIONS_RESPONSE } from '@/test/msw/handlers/permission-groups'

describe('getModuleLabel', () => {
  it('retorna "Minha Empresa" para módulo management', () => {
    expect(getModuleLabel('management')).toBe('Minha Empresa')
  })

  it('retorna "Mensalidade" para módulo billing', () => {
    expect(getModuleLabel('billing')).toBe('Mensalidade')
  })

  it('retorna o próprio valor quando não mapeado', () => {
    expect(getModuleLabel('unknown-module')).toBe('unknown-module')
  })
})

describe('getModuleActiveValue', () => {
  it('retorna valor pendente quando existe', () => {
    expect(getModuleActiveValue({ 'group-1': false }, 'group-1', true)).toBe(false)
  })

  it('retorna valor original quando não há pendência', () => {
    expect(getModuleActiveValue({}, 'group-1', true)).toBe(true)
  })
})

describe('getPermissionValue', () => {
  it('retorna valor pendente da permissão', () => {
    const changes = { 'group-1-management.people.list': false }
    expect(getPermissionValue(changes, 'group-1', 'management.people.list', true)).toBe(false)
  })

  it('retorna valor original quando sem pendência', () => {
    expect(getPermissionValue({}, 'group-1', 'management.people.list', true)).toBe(true)
  })
})

describe('groupPermissionsByContext', () => {
  it('agrupa permissões por contexto', () => {
    const result = groupPermissionsByContext(MOCK_PERMISSIONS_RESPONSE)
    expect(result).toHaveLength(1)
    expect(result[0].context).toBe('management.people')
    expect(result[0].permissions).toHaveLength(2)
  })

  it('filtra contextos sem permissões correspondentes nos grupos', () => {
    const emptyPermissions = { ...MOCK_PERMISSIONS_RESPONSE, permissionGroups: [] }
    const result = groupPermissionsByContext(emptyPermissions)
    expect(result).toHaveLength(0)
  })
})

// buildPermissionUpdatesPerGroup usa indexOf('-') para separar groupId de permissionId.
// Em produção os IDs são MongoDB ObjectIds (sem dash). Usamos IDs sem dash aqui.
const PERMISSIONS_NODASH = {
  ...MOCK_PERMISSIONS_RESPONSE,
  permissionGroups: [{
    id: 'operador',
    label: 'Operador',
    moduleActive: true,
    permissions: [
      { permission: 'management.people.list', active: true },
      { permission: 'management.people.create', active: false },
    ],
  }],
}

describe('buildPermissionUpdatesPerGroup', () => {
  it('retorna array vazio quando não há mudanças', () => {
    const result = buildPermissionUpdatesPerGroup({
      pendingChanges: {},
      moduleActiveChanges: {},
      permissions: PERMISSIONS_NODASH,
      selectedModule: 'management',
    })
    expect(result).toHaveLength(0)
  })

  it('inclui grupo com mudança de permissão', () => {
    const result = buildPermissionUpdatesPerGroup({
      pendingChanges: { 'operador-management.people.create': true },
      moduleActiveChanges: {},
      permissions: PERMISSIONS_NODASH,
      selectedModule: 'management',
    })
    expect(result).toHaveLength(1)
    expect(result[0].groupId).toBe('operador')
  })

  it('inclui grupo com mudança de moduleActive', () => {
    const result = buildPermissionUpdatesPerGroup({
      pendingChanges: {},
      moduleActiveChanges: { 'operador': false },
      permissions: PERMISSIONS_NODASH,
      selectedModule: 'management',
    })
    expect(result).toHaveLength(1)
    expect(result[0].payload.active).toBe(false)
  })
})
