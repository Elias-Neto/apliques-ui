import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/toast/use-toast'
import { editTenantAdmin } from '../tenants-admin.service'

export function useEditTenantAdmin() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { mutate, isPending } = useMutation({
    mutationFn: editTenantAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tenants'] })
      toast({ description: 'Inquilino atualizado.' })
    },
    onError: () => {
      toast({ description: 'Erro ao atualizar inquilino. Tente novamente.' })
    },
  })

  return { mutate, isPending }
}
