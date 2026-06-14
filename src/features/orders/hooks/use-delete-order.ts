import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/toast/use-toast"
import { deleteOrder } from "../order.service"

export const useDeleteOrder = () => {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] })
      qc.invalidateQueries({ queryKey: ["customers"] })
      toast({ title: "Pedido excluído", variant: "destructive" } as any)
    },
    onError: (e: any) =>
      toast({ title: "Erro ao excluir pedido", description: e?.response?.data?.message, variant: "destructive" }),
  })
}
