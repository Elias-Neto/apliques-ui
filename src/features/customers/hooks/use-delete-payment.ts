import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/toast/use-toast"
import { deletePayment } from "../payment.service"

type Vars = { customerID: string; id: string }

export const useDeletePayment = () => {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ customerID, id }: Vars) => deletePayment(customerID, id),
    onSuccess: (_, { customerID }) => {
      qc.invalidateQueries({ queryKey: ["payments", customerID] })
      qc.invalidateQueries({ queryKey: ["customers"] })
      toast({ title: "Pagamento removido", variant: "destructive" } as any)
    },
    onError: () =>
      toast({ title: "Erro ao remover pagamento", variant: "destructive" }),
  })
}
