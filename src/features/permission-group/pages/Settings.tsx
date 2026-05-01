import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { PermissionGroupCollapsible } from "@/features/permission-group/components/PermissionGroupCollapsible"
import { useFetchPermissionsByModule } from "@/features/permission-group/hooks/use-fetch-permissions-by-module"
import { useUpdatePermissionGroupPermissions } from "@/features/permission-group/hooks/use-update-permission-group-permissions"
import { ModuleType } from "@/features/permission-group/permission-group.types"
import {
  getModuleActiveValue,
  getPermissionValue,
  groupPermissionsByContext,
  buildPermissionUpdatesPerGroup,
} from "@/features/permission-group/permission-group.helpers"
import { Module } from "@/types/enums"
import { Save, X, Settings as SettingsIcon } from "lucide-react"

export default function Settings() {
  const [selectedModule, setSelectedModule] = useState<ModuleType>("")
  const { data: permissions, isLoading, error } = useFetchPermissionsByModule(selectedModule)
  const { mutateAsync: updatePermissions } = useUpdatePermissionGroupPermissions()

  const [pendingChanges, setPendingChanges] = useState<Record<string, boolean>>({})
  const [moduleActiveChanges, setModuleActiveChanges] = useState<Record<string, boolean>>({})
  const [hasChanges, setHasChanges] = useState(false)

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
    const currentDisplayValue = getPermissionValue(pendingChanges, groupId, permissionId, originalValue)
    const newValue = !currentDisplayValue

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
    const currentValue = getModuleActiveValue(moduleActiveChanges, groupId, originalValue)
    const newValue = !currentValue

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

  const handleCancelChanges = () => {
    setPendingChanges({})
    setModuleActiveChanges({})
    setHasChanges(false)
  }

  const handleApplyChanges = async () => {
    if (!permissions || (Object.keys(pendingChanges).length === 0 && Object.keys(moduleActiveChanges).length === 0)) return

    const updates = buildPermissionUpdatesPerGroup({
      pendingChanges,
      moduleActiveChanges,
      permissions,
      selectedModule,
    })

    for (const { groupId, payload } of updates) {
      await updatePermissions({ permissionGroupId: groupId, payload, module: selectedModule })
    }

    setPendingChanges({})
    setModuleActiveChanges({})
    setHasChanges(false)
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
            <h2 className="text-lg font-semibold mb-4">Módulo de {selectedModule}</h2>
            <div className="space-y-3">
              {permissions?.permissionGroups.map((group) => (
                <div key={group.id} className="flex items-center justify-between py-2">
                  <label htmlFor={`module-active-${group.id}`} className="text-sm font-medium">
                    {group.label}
                  </label>
                  <Switch
                    id={`module-active-${group.id}`}
                    checked={getModuleActiveValue(moduleActiveChanges, group.id, group.moduleActive)}
                    onCheckedChange={() => handleModuleActiveToggle(group.id, group.moduleActive)}
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Grupos de Permissões Colapsáveis */}
          <div className="space-y-6">
            {permissions && groupPermissionsByContext(permissions).map((contextGroup) => (
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
