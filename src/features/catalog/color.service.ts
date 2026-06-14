import { api } from "@/services/http"
import { Color } from "./color.types"
import { ColorCodeFormat } from "./color-code.utils"

type ColorBody = { name: string; code?: string | null; codeFormat?: ColorCodeFormat | null }
type ColorPatchBody = Partial<ColorBody>

export const fetchColors = (): Promise<Color[]> =>
  api.get("/colors").then(r => r.data)

export const createColor = (body: ColorBody): Promise<Color> =>
  api.post("/colors", body).then(r => r.data)

export const updateColor = (id: string, body: ColorPatchBody): Promise<Color> =>
  api.patch(`/colors/${id}`, body).then(r => r.data)

export const deleteColor = (id: string): Promise<void> =>
  api.delete(`/colors/${id}`).then(() => undefined)
