import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createPessoa } from "../pessoa.service"
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
    onError: (error: any) =>
      toast({
        title: "Erro ao criar pessoa",
        description: error?.response?.data?.message ?? "Tente novamente.",
        variant: "destructive",
      }),
  })
}
