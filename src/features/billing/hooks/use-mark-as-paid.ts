import { useMutation, useQueryClient } from "@tanstack/react-query"
import { markAsPaid } from "../billing.service"
import { useToast } from "@/hooks/toast/use-toast"

export const useMarkAsPaid = () => {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: markAsPaid,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["billing", "admin", "tenants"] })
      toast({ title: "Marcado como pago", description: "Ciclo recalculado com sucesso." })
    },
    onError: () =>
      toast({
        title: "Erro ao marcar como pago",
        description: "Tente novamente.",
        variant: "destructive",
      }),
  })
}
