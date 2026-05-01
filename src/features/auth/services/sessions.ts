import { api } from "@/services/http";
import { TypeCreateSessionPayload, TypeSessionResponse } from "@/features/auth/types/session";

const createSession = async (payload: TypeCreateSessionPayload): Promise<TypeSessionResponse> => {
  const response = await api.post("/sessions", payload);
  return response.data;
}

export { createSession }