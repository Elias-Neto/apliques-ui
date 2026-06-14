import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/toast/use-toast"
import { updatePayment } from "../payment.service"

type Vars = { customerID: string; id: string; data: { amount?: number; date?: string; observation?: string | null } }

export const useUpdatePayment = () => {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ customerID, id, data }: Vars) => updatePayment(customerID, id, data),
    onSuccess: (_, { customerID }) => {
      qc.invalidateQueries({ queryKey: ["payments", customerID] })
      qc.invalidateQueries({ queryKey: ["customers"] })
      toast({ title: "Pagamento atualizado" })
    },
    onError: (e: any) =>
      toast({ title: "Erro ao atualizar pagamento", description: e?.response?.data?.message, variant: "destructive" }),
  })
}
