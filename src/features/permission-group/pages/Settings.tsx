import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { PermissionGroupCollapsible } from "@/features/permission-group/components/PermissionGroupCollapsible"
import { useFetchPermissionsByModule } from "@/features/permission-group/hooks/use-fetch-permissions-by-module"
import { useUpdatePermissionGroupPermissions } from "@/features/permission-group/hooks/use-update-permission-group-permissions"
import { ModuleType, PermissionGroup } from "@/features/permission-group/types/permission-group"
import { Module } from "@/types/enums"
import { Save, X, Settings as SettingsIcon } from "lucide-react"

export default function Settings() {
  const [selectedModule, setSelectedModule] = useState<ModuleType>("")
  const { data: permissions, isLoading, error } = useFetchPermissionsByModule(selectedModule)
  const { mutateAsync: updatePermissions } = useUpdatePermissionGroupPermissions()

  const [pendingChanges, setPendingChanges] = useState<Record<string, boolean>>({})
  const [moduleActiveChanges, setModuleActiveChanges] = useState<Record<string, boolean>>({})
  const [hasChanges, setHasChanges] = useState(false)

  // Resetar alterações pendentes quando mudar de módulo
  useEffect(() => {
    setPendingChanges({})
    setModuleActiveChanges({})
    setHasChanges(false)
  }, [selectedModule])

  const handleModuleChange = (module: ModuleType) => {
    setSelectedModule(module)
  }

  const handlePermissionToggle = (groupId: string, permissionId: string, originalValue: boolean) => {
    const key = `${groupId}-${permissionId}`
    const currentDisplayValue = getPermissionValue(groupId, permissionId, originalValue)
    const newValue = !currentDisplayValue
    
    setPendingChanges(prev => {
      const newChanges = { ...prev }
      
      // Se o novo valor é igual ao original, remover das alterações pendentes
      if (newValue === originalValue) {
        delete newChanges[key]
      } else {
        newChanges[key] = newValue
      }
      
      return newChanges
    })
    
    // Atualizar hasChanges baseado se ainda há alterações pendentes
    setPendingChanges(current => {
      const updatedChanges = { ...current }
      if (newValue === originalValue) {
        delete updatedChanges[key]
      } else {
        updatedChanges[key] = newValue
      }
      setHasChanges(Object.keys(updatedChanges).length > 0 || Object.keys(moduleActiveChanges).length > 0)
      return updatedChanges
    })
  }

  const handleModuleActiveToggle = (groupId: string, originalValue: boolean) => {
    const currentValue = getModuleActiveValue(groupId, originalValue)
    const newValue = !currentValue

    setModuleActiveChanges(prev => {
      const newChanges = { ...prev }
      
      // Se o novo valor é igual ao original, remover das alterações pendentes
      if (newValue === originalValue) {
        delete newChanges[groupId]
      } else {
        newChanges[groupId] = newValue
      }
      
      return newChanges
    })

    // Atualizar hasChanges
    setModuleActiveChanges(current => {
      const updatedChanges = { ...current }
      if (newValue === originalValue) {
        delete updatedChanges[groupId]
      } else {
        updatedChanges[groupId] = newValue
      }
      setHasChanges(Object.keys(pendingChanges).length > 0 || Object.keys(updatedChanges).length > 0)
      return updatedChanges
    })
  }

  const getModuleActiveValue = (groupId: string, originalValue: boolean) => {
    return moduleActiveChanges[groupId] !== undefined ? moduleActiveChanges[groupId] : originalValue
  }

  const getPermissionValue = (groupId: string, permissionId: string, originalValue: boolean) => {
    const key = `${groupId}-${permissionId}`
    return pendingChanges[key] !== undefined ? pendingChanges[key] : originalValue
  }

  const handleCancelChanges = () => {
    setPendingChanges({})
    setModuleActiveChanges({})
    setHasChanges(false)
  }

  const handleApplyChanges = async () => {
    if (!permissions || (Object.keys(pendingChanges).length === 0 && Object.keys(moduleActiveChanges).length === 0)) return

    // Preparar payload para cada grupo que teve alterações
    const groupUpdates: Record<string, Array<{ permission: string; active: boolean }>> = {}

    Object.entries(pendingChanges).forEach(([key, active]) => {
      // Separar apenas pelo primeiro '-' para preservar hífens no nome da permissão
      const firstDashIndex = key.indexOf('-')
      const groupId = key.substring(0, firstDashIndex)
      const permission = key.substring(firstDashIndex + 1)
      
      if (!groupUpdates[groupId]) {
        groupUpdates[groupId] = []
      }
      groupUpdates[groupId].push({ permission, active })
    })

    try {
      // Aplicar alterações para cada grupo
      const allGroupsToUpdate = new Set([
        ...Object.keys(groupUpdates),
        ...Object.keys(moduleActiveChanges)
      ])

      for (const groupId of allGroupsToUpdate) {
        // Encontrar o grupo para obter suas permissões completas
        const group = permissions.permissionGroups.find(g => g.id === groupId)
        if (!group) continue

        const permissionUpdates = groupUpdates[groupId] || []

        // Criar mapa de permissões atualizadas
        const updatedPermissionsMap = new Map(
          permissionUpdates.map(p => [p.permission, p.active])
        )

        // Usar a mesma estrutura de contextos que vem do GET
        const contexts = permissions.contexts.map(context => {
          // Encontrar todas as permissões deste contexto para este grupo
          const contextPermissions: Array<{ permission: string; active: boolean }> = []

          group.permissions.forEach(perm => {
            // Verificar se esta permissão pertence a este contexto
            if (perm.permission.startsWith(`${context.context}.`)) {
              const isUpdated = updatedPermissionsMap.has(perm.permission)
              const active = isUpdated ? updatedPermissionsMap.get(perm.permission)! : perm.active
              
              // Adicionar prefixo do módulo se não existir
              const fullPermission = perm.permission.startsWith(`${selectedModule}.`) 
                ? perm.permission 
                : `${selectedModule}.${perm.permission}`
              
              contextPermissions.push({ permission: fullPermission, active })
            }
          })

          return {
            context: context.context, // Usar o contexto exato que vem do GET
            permissions: contextPermissions
          }
        }).filter(ctx => ctx.permissions.length > 0) // Só incluir contextos que têm permissões

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const payload: any = {
          module: selectedModule,
          contexts
        }

        // Adicionar o campo active se houver alteração para este grupo
        if (moduleActiveChanges[groupId] !== undefined) {
          payload.active = moduleActiveChanges[groupId]
        }

        await updatePermissions({ permissionGroupId: groupId, payload, module: selectedModule })
      }

      // Limpar alterações pendentes após sucesso
      setPendingChanges({})
      setModuleActiveChanges({})
      setHasChanges(false)
    } catch (err) {
      console.error('Erro ao aplicar alterações:', err)
    }
  }

  const getModuleLabel = (module: ModuleType) => module

  if (error) {
    return (
      <div className="container py-8 space-y-8">
        <div className="flex items-center gap-2">
          <SettingsIcon className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-4xl font-bold">Permissionamento</h1>
            <p className="text-muted-foreground">Gerencie as permissões dos grupos de usuários</p>
          </div>
        </div>
        <Card className="p-6">
          <p className="text-red-600">Erro ao carregar permissões: {error.message}</p>
        </Card>
      </div>
    )
  }

  const getPermissionLabel = (permission: string) => {
    const contextId = permission.split('.')[0]
    
    const context = permissions.contexts.find(context => context.context === contextId)

    const permissionLabel = context?.permissions.find(p => p.permission === permission)?.label

    return permissionLabel
  }

  // Agrupar permissões por contexto
  const getPermissionsByContext = () => {
    if (!permissions) return []

    const contextGroups = permissions.contexts.map(context => {
      // Encontrar todas as permissões deste contexto em todos os grupos
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
            const permissionLabel = context.permissions.find(p => p.permission === permission.permission)?.label
            if (permissionLabel) {
              contextPermissions.push({
                groupId: group.id,
                groupLabel: group.label,
                permission: permission.permission,
                label: permissionLabel,
                active: permission.active
              })
            }
          }
        })
      })

      return {
        context: context.context,
        label: context.label,
        permissions: contextPermissions
      }
    }).filter(context => context.permissions.length > 0)

    return contextGroups
  }

  return (
    <div className="min-h-screen bg-background">
      <Heading 
        description="Gerencie as permissões dos grupos de usuários"
        showButton={false}
      >
        Permissionamento
      </Heading>
      
      <div className="container mx-auto px-4 py-6 space-y-8">

      {/* Seletor de Módulo */}
      <Card className="p-6">
        {Object.values(Module).length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum módulo configurado. Popular <code>Module</code> em <code>src/types/enums.ts</code> antes de usar permissionamento.
          </p>
        ) : (
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Módulo:</label>
            <Select value={selectedModule} onValueChange={handleModuleChange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Module).map((moduleValue) => (
                  <SelectItem key={moduleValue as string} value={moduleValue as string}>
                    {moduleValue as string}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="p-6">
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map(j => (
                    <div key={j} className="flex items-center justify-between">
                      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                      <div className="h-6 w-11 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Estado Ativo do Módulo por Grupo */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Módulo de {getModuleLabel(selectedModule)}</h2>
            <div className="space-y-3">
              {permissions?.permissionGroups.map((group) => (
                <div key={group.id} className="flex items-center justify-between py-2">
                  <label htmlFor={`module-active-${group.id}`} className="text-sm font-medium">
                    {group.label}
                  </label>
                  <Switch
                    id={`module-active-${group.id}`}
                    checked={getModuleActiveValue(group.id, group.moduleActive)}
                    onCheckedChange={() => handleModuleActiveToggle(group.id, group.moduleActive)}
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Grupos de Permissões Colapsáveis */}
          <div className="space-y-6">
            {getPermissionsByContext().map((contextGroup) => (
              <PermissionGroupCollapsible
                key={contextGroup.context}
                contextLabel={contextGroup.label}
                permissions={contextGroup.permissions}
                getPermissionValue={getPermissionValue}
                onPermissionToggle={handlePermissionToggle}
                defaultExpanded={false}
              />
            ))}
          </div>

          {/* Botões Aplicar e Cancelar */}
          {hasChanges && (
            <div className="fixed bottom-0 left-0 right-0 z-50">
              <div className="bg-white/95 backdrop-blur-sm border-t border-gray-200 p-4 shadow-xl">
                <div className="flex gap-3 justify-center max-w-md mx-auto">
                  <Button 
                    onClick={handleCancelChanges}
                    variant="outline"
                    size="lg"
                    className="shadow-sm"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleApplyChanges}
                    size="lg"
                    className="shadow-sm"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Aplicar Alterações
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      </div>
    </div>
  )
} 