import { z } from "zod"

export const loginSchema = z.object({
  cpf: z.string().min(14, "CPF inválido"),
  password: z.string().min(1, "Senha obrigatória"),
})

export type TypeLoginForm = z.infer<typeof loginSchema>
