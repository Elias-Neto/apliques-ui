import { useMutation, useQueryClient } from "@tanstack/react-query"
import { changeSubscriptionStatus } from "../billing.service"
import { useToast } from "@/hooks/toast/use-toast"

export const useChangeSubscriptionStatus = () => {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: changeSubscriptionStatus,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["billing", "admin", "tenants"] })
      toast({ title: "Status atualizado com sucesso." })
    },
    onError: () =>
      toast({
        title: "Erro ao atualizar status",
        description: "Tente novamente.",
        variant: "destructive",
      }),
  })
}
