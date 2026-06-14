import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/toast/use-toast"
import { TypeDesignCreateForm } from "../design.schema"
import { createDesign } from "../design.service"

type Vars = { customerID: string; data: TypeDesignCreateForm }

export const useAddDesign = () => {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ customerID, data }: Vars) => createDesign(customerID, data),
    onSuccess: (_, { customerID }) => {
      qc.invalidateQueries({ queryKey: ["designs", customerID] })
      toast({ title: "Desenho criado", description: "Desenho adicionado ao cliente." })
    },
    onError: () =>
      toast({ title: "Erro ao criar desenho", description: "Tente novamente.", variant: "destructive" }),
  })
}
