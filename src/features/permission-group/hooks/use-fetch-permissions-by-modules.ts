import { useQueries } from "@tanstack/react-query"
import { fetchPermissionsByModule } from "../permission-group.service"
import type { ModuleType, PermissionsResponse } from "../permission-group.types"

export type ModulePermissions = { module: ModuleType; data: PermissionsResponse }

// Busca as permissões de vários módulos de uma vez (uma área do seletor agrega N módulos).
// Mesma queryKey do hook por módulo → a invalidação do update continua valendo.
export const useFetchPermissionsByModules = (modules: ModuleType[]) => {
  const results = useQueries({
    queries: modules.map(module => ({
      queryKey: ["permissions-by-module", module],
      queryFn: () => fetchPermissionsByModule(module),
      enabled: !!module,
    })),
  })

  const isLoading = results.some(r => r.isLoading)
  const error = results.find(r => r.error)?.error as Error | null | undefined
  const loaded: ModulePermissions[] = results.flatMap((r, i) =>
    r.data ? [{ module: modules[i], data: r.data }] : [],
  )

  return { data: loaded, isLoading, error: error ?? null }
}
