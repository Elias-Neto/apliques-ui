import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/toast/use-toast"
import { TypeCustomerUpdateForm } from "../customer.schema"
import { updateCustomer } from "../customer.service"

type Vars = { id: string; data: TypeCustomerUpdateForm }

export const useUpdateCustomer = () => {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ id, data }: Vars) => updateCustomer(id, data),
    onSuccess: customer => {
      qc.invalidateQueries({ queryKey: ["customers"] })
      qc.invalidateQueries({ queryKey: ["customer", customer.id] })
      toast({ title: "Cliente atualizado", description: `${customer.name} foi atualizado.` })
    },
    onError: () =>
      toast({ title: "Erro ao atualizar cliente", description: "Tente novamente.", variant: "destructive" }),
  })
}
