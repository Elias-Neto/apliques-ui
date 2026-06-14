import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/toast/use-toast"
import { deleteDesign } from "../design.service"

type Vars = { customerID: string; id: string }

export const useDeleteDesign = () => {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ customerID, id }: Vars) => deleteDesign(customerID, id),
    onSuccess: (_, { customerID }) => {
      qc.invalidateQueries({ queryKey: ["designs", customerID] })
      toast({ title: "Desenho excluído", variant: "destructive" } as any)
    },
    onError: (error: any) =>
      toast({
        title: "Erro ao excluir desenho",
        description: error?.response?.data?.message ?? "Tente novamente.",
        variant: "destructive",
      }),
  })
}
