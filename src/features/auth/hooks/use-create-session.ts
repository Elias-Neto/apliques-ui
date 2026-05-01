import { useMutation } from "@tanstack/react-query"
import { createSession } from "@/features/auth/services/sessions"
import { useToast } from "@/hooks/toast/use-toast"

export const useCreateSession = () => {
  const { toast } = useToast()
  return useMutation({
    mutationFn: createSession,
    onError: () =>
      toast({
        title: "CPF ou senha incorretos",
        variant: "destructive",
      }),
  })
}
