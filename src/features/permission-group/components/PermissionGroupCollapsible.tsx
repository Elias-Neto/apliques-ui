import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Permission {
  groupId: string
  groupLabel: string
  permission: string
  label: string
  active: boolean
}

interface PermissionGroupCollapsibleProps {
  contextLabel: string
  permissions: Permission[]
  getPermissionValue: (groupId: string, permissionId: string, originalValue: boolean) => boolean
  onPermissionToggle: (groupId: string, permissionId: string, originalValue: boolean) => void
  defaultExpanded?: boolean
}

export function PermissionGroupCollapsible({
  contextLabel,
  permissions,
  getPermissionValue,
  onPermissionToggle,
  defaultExpanded = false
}: PermissionGroupCollapsibleProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  // Agrupar permissões por grupo dentro do contexto
  const groupedPermissions = Object.values(
    permissions.reduce((acc, perm) => {
      if (!acc[perm.groupId]) {
        acc[perm.groupId] = {
          groupId: perm.groupId,
          groupLabel: perm.groupLabel,
          permissions: []
        }
      }
      acc[perm.groupId].permissions.push(perm)
      return acc
    }, {} as Record<string, { groupId: string; groupLabel: string; permissions: Permission[] }>)
  )

  return (
    <div className="space-y-4">
      {/* Header colapsável */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-left">{contextLabel}</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {groupedPermissions.length} {groupedPermissions.length === 1 ? 'grupo' : 'grupos'}
          </span>
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform duration-200" />
          ) : (
            <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform duration-200" />
          )}
        </div>
      </button>

      {/* Conteúdo colapsável */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {groupedPermissions.map((group) => (
            <Card key={group.groupId} className="p-6 hover:shadow-md transition-shadow duration-200">
              <h3 className="text-lg font-semibold mb-4 text-primary">{group.groupLabel}</h3>
              <div className="space-y-3">
                {group.permissions.map((permission) => (
                  <div key={permission.permission} className="flex items-center justify-between">
                    <label 
                      htmlFor={`${permission.groupId}-${permission.permission}`}
                      className="text-sm font-medium cursor-pointer hover:text-primary transition-colors"
                    >
                      {permission.label}
                    </label>
                    <Switch 
                      id={`${permission.groupId}-${permission.permission}`}
                      checked={getPermissionValue(permission.groupId, permission.permission, permission.active)}
                      onCheckedChange={() => 
                        onPermissionToggle(permission.groupId, permission.permission, permission.active)
                      }
                    />
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
