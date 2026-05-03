import { useMutation } from "@tanstack/react-query"
import { createTenant } from "@/features/auth/services/tenants"
import { createSession } from "@/features/auth/services/sessions"
import { useToast } from "@/hooks/toast/use-toast"
import { TypeAccountCreateForm } from "@/features/auth/schemas/account-create"

export const useCreateTenantAndLogin = () => {
  const { toast } = useToast()
  return useMutation({
    mutationFn: async (data: TypeAccountCreateForm) => {
      await createTenant({
        company: { name: data.companyName, ...(data.companyCnpj ? { cnpj: data.companyCnpj } : {}) },
        owner: {
          name: data.ownerName,
          phone: data.ownerPhone,
          cpf: data.ownerCpf,
          password: data.ownerPassword,
        },
      })
      const session = await createSession({ cpf: data.ownerCpf, password: data.ownerPassword })
      return session
    },
    onSuccess: () =>
      toast({
        title: "Conta criada com sucesso!",
        description: "Sua conta foi criada e você foi logado automaticamente.",
      }),
    onError: () =>
      toast({
        title: "Erro ao criar conta",
        description: "Tente novamente. Verifique se todos os dados estão corretos.",
        variant: "destructive",
      }),
  })
}
