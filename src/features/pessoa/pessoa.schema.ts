import { z } from "zod"

export const pessoaCreateSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  cpf: z.string().min(14, "CPF inválido"),
  phone: z.string().optional(),
  password: z.string().min(1, "Senha obrigatória"),
  permissionGroups: z.array(z.string()).min(1, "Selecione um grupo"),
})

export const pessoaUpdateSchema = pessoaCreateSchema.partial({ password: true })

export type TypePessoaCreateForm = z.infer<typeof pessoaCreateSchema>
export type TypePessoaUpdateForm = z.infer<typeof pessoaUpdateSchema>
