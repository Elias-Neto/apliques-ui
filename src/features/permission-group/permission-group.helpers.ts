import { Module } from "@/types/enums"
import type { PermissionsResponse, UpdatePermissionGroupPayload } from "./permission-group.types"

// Projetos derivados estendem este map adicionando entradas para seus Module.* enum values.
const MODULE_LABELS: Record<string, string> = {
  [Module.Management]: 'Minha empresa',
  [Module.Billing]: 'Minha mensalidade',
}

export const getModuleLabel = (moduleValue: string): string =>
  MODULE_LABELS[moduleValue] ?? moduleValue

export const getModuleActiveValue = (
  moduleActiveChanges: Record<string, boolean>,
  groupId: string,
  originalValue: boolean,
): boolean =>
  moduleActiveChanges[groupId] !== undefined ? moduleActiveChanges[groupId] : originalValue

export const getPermissionValue = (
  pendingChanges: Record<string, boolean>,
  groupId: string,
  permissionId: string,
  originalValue: boolean,
): boolean => {
  const key = `${groupId}-${permissionId}`
  return pendingChanges[key] !== undefined ? pendingChanges[key] : originalValue
}

// Agrupa permissoes por contexto pra renderizar em <PermissionGroupCollapsible>.
// Retorna apenas contextos com >=1 permissao.
export const groupPermissionsByContext = (permissions: PermissionsResponse) =>
  permissions.contexts
    .map(context => {
      const contextPermissions: Array<{
        groupId: string
        groupLabel: string
        permission: string
        label: string
        active: boolean
      }> = []

      permissions.permissionGroups.forEach(group => {
        group.permissions.forEach(permission => {
          if (permission.permission.startsWith(`${context.context}.`)) {
            const permissionLabel = context.permissions.find(
              p => p.permission === permission.permission,
            )?.label
            if (permissionLabel) {
              contextPermissions.push({
                groupId: group.id,
                groupLabel: group.label,
                permission: permission.permission,
                label: permissionLabel,
                active: permission.active,
              })
            }
          }
        })
      })

      return { context: context.context, label: context.label, permissions: contextPermissions }
    })
    .filter(c => c.permissions.length > 0)

// Constroi a lista de updates a enviar (1 por grupo afetado) a partir do estado pendente.
// Funcao pura: nao chama API. Page faz o `await updatePermissions` no handler.
export const buildPermissionUpdatesPerGroup = (params: {
  pendingChanges: Record<string, boolean>
  moduleActiveChanges: Record<string, boolean>
  permissions: PermissionsResponse
  selectedModule: string
}): Array<{ groupId: string; payload: UpdatePermissionGroupPayload }> => {
  const { pendingChanges, moduleActiveChanges, permissions, selectedModule } = params

  const groupUpdates: Record<string, Array<{ permission: string; active: boolean }>> = {}
  Object.entries(pendingChanges).forEach(([key, active]) => {
    const firstDashIndex = key.indexOf("-")
    const groupId = key.substring(0, firstDashIndex)
    const permission = key.substring(firstDashIndex + 1)
    if (!groupUpdates[groupId]) groupUpdates[groupId] = []
    groupUpdates[groupId].push({ permission, active })
  })

  const allGroupsToUpdate = new Set([
    ...Object.keys(groupUpdates),
    ...Object.keys(moduleActiveChanges),
  ])

  const result: Array<{ groupId: string; payload: UpdatePermissionGroupPayload }> = []

  for (const groupId of allGroupsToUpdate) {
    const group = permissions.permissionGroups.find(g => g.id === groupId)
    if (!group) continue

    const permissionUpdates = groupUpdates[groupId] || []
    const updatedPermissionsMap = new Map(permissionUpdates.map(p => [p.permission, p.active]))

    const contexts = permissions.contexts
      .map(context => {
        const contextPermissions: Array<{ permission: string; active: boolean }> = []
        group.permissions.forEach(perm => {
          if (perm.permission.startsWith(`${context.context}.`)) {
            const isUpdated = updatedPermissionsMap.has(perm.permission)
            const active = isUpdated ? updatedPermissionsMap.get(perm.permission)! : perm.active
            const fullPermission = perm.permission.startsWith(`${selectedModule}.`)
              ? perm.permission
              : `${selectedModule}.${perm.permission}`
            contextPermissions.push({ permission: fullPermission, active })
          }
        })
        return { context: context.context, permissions: contextPermissions }
      })
      .filter(ctx => ctx.permissions.length > 0)

    const payload: UpdatePermissionGroupPayload = { module: selectedModule, contexts }
    if (moduleActiveChanges[groupId] !== undefined) {
      payload.active = moduleActiveChanges[groupId]
    }
    result.push({ groupId, payload })
  }

  return result
}
