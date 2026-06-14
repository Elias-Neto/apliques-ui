import { z } from "zod"

export const designCreateSchema = z.object({
  name: z.string().min(1, "Nome do desenho obrigatório"),
})

export const designUpdateSchema = designCreateSchema

export type TypeDesignCreateForm = z.infer<typeof designCreateSchema>
export type TypeDesignUpdateForm = z.infer<typeof designUpdateSchema>
