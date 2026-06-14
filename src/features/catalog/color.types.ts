import { ColorCodeFormat } from "./color-code.utils"

interface Color {
  id: string
  name: string
  code?: string | null
  codeFormat?: ColorCodeFormat | null
  createdAt?: string
}

export type { Color }
