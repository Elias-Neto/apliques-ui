import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updatePermissionGroupPermissions } from "../services/permission-groups"
import { useToast } from "@/hooks/toast/use-toast"
import type { ModuleType, UpdatePermissionGroupPayload } from "../types/permission-group"

type Vars = {
  permissionGroupId: string
  payload: UpdatePermissionGroupPayload
  module: ModuleType
}

export const useUpdatePermissionGroupPermissions = () => {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ permissionGroupId, payload }: Vars) =>
      updatePermissionGroupPermissions(permissionGroupId, payload),
    onSuccess: (_, { module }) => {
      qc.invalidateQueries({ queryKey: ["permissions-by-module", module] })
      toast({ title: "Permissões atualizadas" })
    },
    onError: () =>
      toast({
        title: "Erro ao atualizar permissões",
        variant: "destructive",
      }),
  })
}
