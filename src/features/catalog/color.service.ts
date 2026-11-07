import { api } from "@/services/http"
import { Color } from "./color.types"
import { ColorCodeFormat } from "./color-code.utils"

type ColorBody = { name: string; code?: string | null; codeFormat?: ColorCodeFormat | null }
type ColorPatchBody = Partial<ColorBody>

export type ColorSortField = 'name'
export type ColorSortDir = 'asc' | 'desc'

export interface ColorFilters {
  search?: string
  sortBy?: ColorSortField
  sortDir?: ColorSortDir
}

export const fetchColors = (filters?: ColorFilters): Promise<Color[]> =>
  api.get("/colors", { params: filters }).then(r => r.data)

export const createColor = (body: ColorBody): Promise<Color> =>
  api.post("/colors", body).then(r => r.data)

export const updateColor = (id: string, body: ColorPatchBody): Promise<Color> =>
  api.patch(`/colors/${id}`, body).then(r => r.data)

export const deleteColor = (id: string): Promise<void> =>
  api.delete(`/colors/${id}`).then(() => undefined)
