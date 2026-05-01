import { useQuery } from "@tanstack/react-query"
import { fetchPermissionsByModule } from "../services/permission-groups"
import type { ModuleType } from "../types/permission-group"

export const useFetchPermissionsByModule = (module: ModuleType) =>
  useQuery({
    queryKey: ["permissions-by-module", module],
    queryFn: () => fetchPermissionsByModule(module),
    enabled: !!module,
  })
