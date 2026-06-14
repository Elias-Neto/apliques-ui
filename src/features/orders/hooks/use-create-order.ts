import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/toast/use-toast"
import { createOrder } from "../order.service"

export const useCreateOrder = () => {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] })
      qc.invalidateQueries({ queryKey: ["customers"] })
      toast({ title: "Pedido criado" })
    },
    onError: (e: any) =>
      toast({ title: "Erro ao criar pedido", description: e?.response?.data?.message ?? "Tente novamente.", variant: "destructive" }),
  })
}
