import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/toast/use-toast"
import { TypeOrderUpdateForm } from "../order.schema"
import { updateOrder } from "../order.service"

type Vars = { id: string; data: TypeOrderUpdateForm }

export const useUpdateOrder = () => {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ id, data }: Vars) => updateOrder(id, data),
    onSuccess: order => {
      qc.invalidateQueries({ queryKey: ["orders"] })
      qc.invalidateQueries({ queryKey: ["order", order.id] })
      qc.invalidateQueries({ queryKey: ["customers"] })
      toast({ title: "Pedido atualizado" })
    },
    onError: () => toast({ title: "Erro ao atualizar pedido", variant: "destructive" }),
  })
}
