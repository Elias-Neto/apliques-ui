import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/toast/use-toast"
import { createCustomer } from "../customer.service"

export const useCreateCustomer = () => {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: createCustomer,
    onSuccess: customer => {
      qc.invalidateQueries({ queryKey: ["customers"] })
      toast({ title: "Cliente criado", description: `${customer.name} foi cadastrado.` })
    },
    onError: (error: any) =>
      toast({
        title: "Erro ao criar cliente",
        description: error?.response?.data?.message ?? "Tente novamente.",
        variant: "destructive",
      }),
  })
}
