import { api } from "@/services/http"
import { GrupoPermissao } from "@/features/pessoa/pessoa.types"
import {
  PermissionsResponse,
  ModuleType,
  UpdatePermissionGroupPayload,
} from "./permission-group.types"

export const fetchPermissionGroups = (): Promise<GrupoPermissao[]> =>
  api.get("/management/permission-groups").then(r => r.data)

export const fetchPermissionsByModule = (module: ModuleType): Promise<PermissionsResponse> =>
  api.get(`/management/permission-groups/permissions?module=${module}`).then(r => r.data)

export const updatePermissionGroupPermissions = (
  permissionGroupId: string,
  payload: UpdatePermissionGroupPayload,
): Promise<void> =>
  api
    .put(`/management/permission-groups/${permissionGroupId}/permissions`, payload)
    .then(() => undefined)
