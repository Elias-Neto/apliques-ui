import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/toast/use-toast"
import { deleteCustomer } from "../customer.service"

export const useDeleteCustomer = () => {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customers"] })
      toast({ title: "Cliente excluído", description: "Cliente removido com sucesso.", variant: "destructive" })
    },
    onError: (error: any) =>
      toast({
        title: "Erro ao excluir cliente",
        description: error?.response?.data?.message ?? "Tente novamente.",
        variant: "destructive",
      }),
  })
}
