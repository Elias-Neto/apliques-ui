import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deletePessoa } from "../services/pessoas"
import { useToast } from "@/hooks/toast/use-toast"

export const useDeletePessoa = () => {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: deletePessoa,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pessoas"] })
      toast({
        title: "Pessoa excluída",
        description: "Pessoa removida com sucesso.",
        variant: "destructive",
      })
    },
    onError: () =>
      toast({
        title: "Erro ao excluir pessoa",
        description: "Tente novamente.",
        variant: "destructive",
      }),
  })
}
