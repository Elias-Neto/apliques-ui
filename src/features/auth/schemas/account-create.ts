import { z } from "zod"

export const accountCreateSchema = z.object({
  companyName: z.string().min(1, "Nome da empresa obrigatório"),
  companyCnpj: z.string().min(18, "CNPJ inválido"),
  ownerName: z.string().min(1, "Nome do proprietário obrigatório"),
  ownerPhone: z.string().min(14, "Telefone inválido"),
  ownerCpf: z.string().min(14, "CPF inválido"),
  ownerPassword: z.string().min(8, "Senha precisa ter ao menos 8 caracteres"),
})

export type TypeAccountCreateForm = z.infer<typeof accountCreateSchema>
