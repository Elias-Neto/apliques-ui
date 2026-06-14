import { z } from "zod"

const orderItemSchema = z.object({
  materialID: z.string().min(1, "Material obrigatório"),
  colorID:    z.string().min(1, "Cor obrigatória"),
  designID:   z.string().min(1, "Desenho obrigatório"),
  unitPrice:  z.number().int().min(1, "Preço precisa ser maior que zero"),
  quantity:   z.number().int().min(1, "Quantidade precisa ser maior que zero"),
})

export const orderCreateSchema = z.object({
  customerID:  z.string().min(1, "Cliente obrigatório"),
  orderDate:   z.string().optional(),
  items:       z.array(orderItemSchema).min(1, "Adicione ao menos 1 item"),
  observation: z.string().optional().nullable(),
})

export const orderUpdateSchema = z.object({
  orderDate:   z.string().optional(),
  items:       z.array(orderItemSchema).min(1).optional(),
  observation: z.string().optional().nullable(),
})

export type TypeOrderCreateForm = z.infer<typeof orderCreateSchema>
export type TypeOrderUpdateForm = z.infer<typeof orderUpdateSchema>
export type TypeOrderItemForm   = z.infer<typeof orderItemSchema>
