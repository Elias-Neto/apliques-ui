import { useMutation, useQueryClient } from "@tanstack/react-query"
import { generateManualCharge } from "../billing.service"
import { useToast } from "@/hooks/toast/use-toast"

export const useGenerateManualCharge = () => {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: generateManualCharge,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["billing", "admin", "tenants"] })
    },
    onError: () =>
      toast({
        title: "Erro ao gerar cobrança",
        description: "Tente novamente.",
        variant: "destructive",
      }),
  })
}
