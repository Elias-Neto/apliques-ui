import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/toast/use-toast"
import { TypeDesignUpdateForm } from "../design.schema"
import { updateDesign } from "../design.service"

type Vars = { customerID: string; id: string; data: TypeDesignUpdateForm }

export const useUpdateDesign = () => {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ customerID, id, data }: Vars) => updateDesign(customerID, id, data),
    onSuccess: (_, { customerID }) => {
      qc.invalidateQueries({ queryKey: ["designs", customerID] })
      toast({ title: "Desenho atualizado" })
    },
    onError: () =>
      toast({ title: "Erro ao atualizar desenho", description: "Tente novamente.", variant: "destructive" }),
  })
}
