import { useMutation, useQueryClient } from "@tanstack/react-query"
import { changeBillingDay } from "../billing.service"
import { useToast } from "@/hooks/toast/use-toast"

export const useChangeBillingDay = () => {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: changeBillingDay,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["billing", "admin", "tenants"] })
      qc.invalidateQueries({ queryKey: ["billing", "subscription"] })
      qc.invalidateQueries({ queryKey: ["billing", "current-charge"] })
      toast({ title: "Dia de cobrança atualizado com sucesso." })
    },
    onError: () =>
      toast({
        title: "Erro ao atualizar dia de cobrança",
        description: "Tente novamente.",
        variant: "destructive",
      }),
  })
}
