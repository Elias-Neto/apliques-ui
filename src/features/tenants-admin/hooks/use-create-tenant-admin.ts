import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useToast } from '@/hooks/toast/use-toast'

import { createTenantAdmin } from '../tenants-admin.service'

const useCreateTenantAdmin = () => {
  const qc = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: createTenantAdmin,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'tenants'] })
      toast({ title: 'Tenant criado', description: 'Novo tenant cadastrado com sucesso.' })
    },
    onError: () =>
      toast({
        title: 'Erro ao criar tenant',
        description: 'Verifique os dados e tente novamente.',
        variant: 'destructive',
      }),
  })
}

export { useCreateTenantAdmin }
