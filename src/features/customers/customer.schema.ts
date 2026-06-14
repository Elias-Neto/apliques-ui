import { z } from "zod"

export const customerCreateSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  phone: z.string().optional().nullable(),
  origin: z.string().optional().nullable(),
  observation: z.string().optional().nullable(),
})

export const customerUpdateSchema = customerCreateSchema

export type TypeCustomerCreateForm = z.infer<typeof customerCreateSchema>
export type TypeCustomerUpdateForm = z.infer<typeof customerUpdateSchema>
