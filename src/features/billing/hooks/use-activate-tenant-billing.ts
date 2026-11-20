import { useMutation, useQueryClient } from "@tanstack/react-query"
import { activateTenantBilling } from "../billing.service"
import { useToast } from "@/hooks/toast/use-toast"

export const useActivateTenantBilling = () => {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: activateTenantBilling,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["billing", "admin", "tenants"] })
      toast({ title: "Mensalidade ativada", description: "Inquilino ativado para cobrança com sucesso." })
    },
    onError: () =>
      toast({
        title: "Erro ao ativar mensalidade",
        description: "Tente novamente.",
        variant: "destructive",
      }),
  })
}
