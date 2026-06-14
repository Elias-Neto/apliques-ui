import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/toast/use-toast"
import { createPayment } from "../payment.service"

type Vars = { customerID: string; data: { amount: number; date?: string; observation?: string | null } }

export const useAddPayment = () => {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ customerID, data }: Vars) => createPayment(customerID, data),
    onSuccess: (_, { customerID }) => {
      qc.invalidateQueries({ queryKey: ["payments", customerID] })
      qc.invalidateQueries({ queryKey: ["customers"] })
      qc.invalidateQueries({ queryKey: ["customer", customerID] })
      toast({ title: "Pagamento registrado" })
    },
    onError: (e: any) =>
      toast({ title: "Erro ao registrar pagamento", description: e?.response?.data?.message, variant: "destructive" }),
  })
}
