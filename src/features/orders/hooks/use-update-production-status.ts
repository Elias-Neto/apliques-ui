import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/toast/use-toast"
import { ProductionStatus } from "../order.types"
import { updateProductionStatus } from "../order.service"

type Vars = { id: string; status: ProductionStatus }

export const useUpdateProductionStatus = () => {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ id, status }: Vars) => updateProductionStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] })
      toast({ title: "Etapa atualizada" })
    },
    onError: () => toast({ title: "Erro ao atualizar etapa", variant: "destructive" }),
  })
}
