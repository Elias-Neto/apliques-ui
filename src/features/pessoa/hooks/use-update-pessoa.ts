import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updatePessoa } from "../pessoa.service"
import { TypePessoaUpdateForm } from "../pessoa.schema"
import { useToast } from "@/hooks/toast/use-toast"

type Vars = { id: string; data: TypePessoaUpdateForm }

export const useUpdatePessoa = () => {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ id, data }: Vars) => updatePessoa(id, data),
    onSuccess: pessoa => {
      qc.invalidateQueries({ queryKey: ["pessoas"] })
      qc.invalidateQueries({ queryKey: ["pessoa", pessoa.id] })
      toast({
        title: "Pessoa atualizada",
        description: `${pessoa.name} foi atualizada com sucesso.`,
      })
    },
    onError: () =>
      toast({
        title: "Erro ao atualizar pessoa",
        description: "Tente novamente.",
        variant: "destructive",
      }),
  })
}
