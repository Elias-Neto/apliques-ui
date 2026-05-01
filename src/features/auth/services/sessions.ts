import { api } from "@/services/http"
import { TypeLoginForm } from "@/features/auth/schemas/login"
import { TypeSessionResponse } from "@/features/auth/types/session"

export const createSession = async (payload: TypeLoginForm): Promise<TypeSessionResponse> => {
  const response = await api.post("/sessions", payload)
  return response.data
}
