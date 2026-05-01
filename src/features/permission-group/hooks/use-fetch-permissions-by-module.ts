import { useQuery } from "@tanstack/react-query"
import { fetchPermissionsByModule } from "../permission-group.service"
import type { ModuleType } from "../permission-group.types"

export const useFetchPermissionsByModule = (module: ModuleType) =>
  useQuery({
    queryKey: ["permissions-by-module", module],
    queryFn: () => fetchPermissionsByModule(module),
    enabled: !!module,
  })
