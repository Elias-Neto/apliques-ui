import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createPessoa } from "../services/pessoas"
import { useToast } from "@/hooks/toast/use-toast"

export const useCreatePessoa = () => {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: createPessoa,
    onSuccess: pessoa => {
      qc.invalidateQueries({ queryKey: ["pessoas"] })
      toast({
        title: "Pessoa criada",
        description: `${pessoa.name} foi criada com sucesso.`,
      })
    },
    onError: () =>
      toast({
        title: "Erro ao criar pessoa",
        description: "Tente novamente.",
        variant: "destructive",
      }),
  })
}
