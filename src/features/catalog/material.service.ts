import { api } from "@/services/http"
import { Material } from "./material.types"

type MaterialBody = { name: string; pricePerUnit: number }
type MaterialPatchBody = Partial<MaterialBody>

export const fetchMaterials = (): Promise<Material[]> =>
  api.get("/materials").then(r => r.data)

export const createMaterial = (body: MaterialBody): Promise<Material> =>
  api.post("/materials", body).then(r => r.data)

export const updateMaterial = (id: string, body: MaterialPatchBody): Promise<Material> =>
  api.patch(`/materials/${id}`, body).then(r => r.data)

export const deleteMaterial = (id: string): Promise<void> =>
  api.delete(`/materials/${id}`).then(() => undefined)
