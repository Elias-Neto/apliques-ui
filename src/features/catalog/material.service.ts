import { api } from "@/services/http"
import { Material } from "./material.types"

type MaterialBody = { name: string; pricePerUnit: number }
type MaterialPatchBody = Partial<MaterialBody>

export type MaterialSortField = 'name'
export type MaterialSortDir = 'asc' | 'desc'

export interface MaterialFilters {
  search?: string
  sortBy?: MaterialSortField
  sortDir?: MaterialSortDir
}

export const fetchMaterials = (filters?: MaterialFilters): Promise<Material[]> =>
  api.get("/materials", { params: filters }).then(r => r.data)

export const createMaterial = (body: MaterialBody): Promise<Material> =>
  api.post("/materials", body).then(r => r.data)

export const updateMaterial = (id: string, body: MaterialPatchBody): Promise<Material> =>
  api.patch(`/materials/${id}`, body).then(r => r.data)

export const deleteMaterial = (id: string): Promise<void> =>
  api.delete(`/materials/${id}`).then(() => undefined)
