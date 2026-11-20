import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { PermissionGroupCollapsible } from "@/features/permission-group/components/PermissionGroupCollapsible"
import { useFetchPermissionsByModules } from "@/features/permission-group/hooks/use-fetch-permissions-by-modules"
import { useUpdatePermissionGroupPermissions } from "@/features/permission-group/hooks/use-update-permission-group-permissions"
import {
  getModuleActiveValue,
  getPermissionValue,
  groupPermissionsByContext,
  buildPermissionUpdatesPerGroup,
  getModuleSectionLabel,
  PERMISSION_AREAS,
} from "@/features/permission-group/permission-group.helpers"
import { Module } from "@/types/enums"
import { useSubscription } from "@/features/billing/hooks/use-subscription"
import { Save, X, Settings as SettingsIcon } from "lucide-react"

export default function Settings() {
  const { data: subscription } = useSubscription()
  const visibleAreas = PERMISSION_AREAS.filter(
    area => !area.modules.includes(Module.Platform) || !!subscription?.isPlatformOwner,
  )
  const [selectedAreaID, setSelectedAreaID] = useState<string>(PERMISSION_AREAS[0].id)
  const selectedArea = visibleAreas.find(a => a.id === selectedAreaID) ?? visibleAreas[0]
  const areaModules = selectedArea?.modules ?? []
  const { data: modulesPermissions, isLoading, error } = useFetchPermissionsByModules(areaModules)
  const { mutateAsync: updatePermissions } = useUpdatePermissionGroupPermissions()

  // pendingChanges: `${groupId}-${permission}` (permissão é única entre módulos).
  // moduleActiveChanges: `${module}:${groupId}` (o switch "módulo ativo" é por módulo da API).
  const [pendingChanges, setPendingChanges] = useState<Record<string, boolean>>({})
  const [moduleActiveChanges, setModuleActiveChanges] = useState<Record<string, boolean>>({})
  const hasChanges = Object.keys(pendingChanges).length > 0 || Object.keys(moduleActiveChanges).length > 0

  useEffect(() => {
    setPendingChanges({})
    setModuleActiveChanges({})
  }, [selectedAreaID])

  const handlePermissionToggle = (groupId: string, permissionId: string, originalValue: boolean) => {
    const key = `${groupId}-${permissionId}`
    const currentDisplayValue = getPermissionValue(pendingChanges, groupId, permissionId, originalValue)
    const newValue = !currentDisplayValue

    setPendingChanges(current => {
      const updatedChanges = { ...current }
      if (newValue === originalValue) {
        delete updatedChanges[key]
      } else {
        updatedChanges[key] = newValue
      }
      return updatedChanges
    })
  }

  const handleModuleActiveToggle = (module: string, groupId: string, originalValue: boolean) => {
    const key = `${module}:${groupId}`
    const newValue = !getModuleActiveValue(moduleActiveChanges, key, originalValue)

    setModuleActiveChanges(current => {
      const updatedChanges = { ...current }
      if (newValue === originalValue) {
        delete updatedChanges[key]
      } else {
        updatedChanges[key] = newValue
      }
      return updatedChanges
    })
  }

  const handleCancelChanges = () => {
    setPendingChanges({})
    setModuleActiveChanges({})
  }

  // Um PUT por (módulo, grupo) afetado — mesmo payload de antes; só o agrupamento é da tela.
  const handleApplyChanges = async () => {
    if (!hasChanges) return

    for (const { module, data } of modulesPermissions) {
      const modulePermissions = new Set(
        data.permissionGroups.flatMap(g => g.permissions.map(p => p.permission)),
      )

      const modulePending = Object.fromEntries(
        Object.entries(pendingChanges).filter(([key]) => {
          const permission = key.substring(key.indexOf("-") + 1)
          return modulePermissions.has(permission)
        }),
      )
      const moduleActive = Object.fromEntries(
        Object.entries(moduleActiveChanges)
          .filter(([key]) => key.startsWith(`${module}:`))
          .map(([key, value]) => [key.substring(module.length + 1), value]),
      )

      const updates = buildPermissionUpdatesPerGroup({
        pendingChanges: modulePending,
        moduleActiveChanges: moduleActive,
        permissions: data,
        selectedModule: module,
      })

      for (const { groupId, payload } of updates) {
        await updatePermissions({ permissionGroupId: groupId, payload, module })
      }
    }

    setPendingChanges({})
    setModuleActiveChanges({})
  }

  const boundGetPermissionValue = useCallback(
    (groupId: string, permissionId: string, originalValue: boolean) =>
      getPermissionValue(pendingChanges, groupId, permissionId, originalValue),
    [pendingChanges],
  )

  if (error) {
    return (
      <div className="container py-8 space-y-8">
        <div className="flex items-center gap-2">
          <SettingsIcon className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-4xl font-bold">Permissões</h1>
            <p className="text-muted-foreground">Gerencie as permissões dos grupos de usuários</p>
          </div>
        </div>
        <Card className="p-6">
          <p className="text-red-600">Erro ao carregar permissões: {error.message}</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Heading
        description="Gerencie as permissões dos grupos de usuários"
        showButton={false}
      >
        Permissões
      </Heading>

      <div className="container mx-auto px-4 py-6 space-y-8">

      {/* Seletor de Área (espelha o menu) */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Área:</label>
          <Select value={selectedArea?.id} onValueChange={setSelectedAreaID}>
            <SelectTrigger className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {visibleAreas.map(area => (
                <SelectItem key={area.id} value={area.id}>{area.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
          {modulesPermissions.map(({ module, data }) => {
            const sectionLabel = areaModules.length > 1 ? getModuleSectionLabel(module) : selectedArea.label
            return (
              <section key={module} className="space-y-6">
                {/* Estado Ativo do Módulo por Grupo */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Módulo de {sectionLabel}</h2>
                  <div className="space-y-3">
                    {data.permissionGroups.map(group => (
                      <div key={group.id} className="flex items-center justify-between py-2">
                        <label htmlFor={`module-active-${module}-${group.id}`} className="text-sm font-medium">
                          {group.label}
                        </label>
                        <Switch
                          id={`module-active-${module}-${group.id}`}
                          checked={getModuleActiveValue(moduleActiveChanges, `${module}:${group.id}`, group.moduleActive)}
                          onCheckedChange={() => handleModuleActiveToggle(module, group.id, group.moduleActive)}
                        />
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Grupos de Permissões Colapsáveis */}
                <div className="space-y-6">
                  {groupPermissionsByContext(data).map(contextGroup => (
                    <PermissionGroupCollapsible
                      key={contextGroup.context}
                      contextLabel={contextGroup.label}
                      permissions={contextGroup.permissions}
                      getPermissionValue={boundGetPermissionValue}
                      onPermissionToggle={handlePermissionToggle}
                      defaultExpanded={false}
                    />
                  ))}
                </div>
              </section>
            )
          })}

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
