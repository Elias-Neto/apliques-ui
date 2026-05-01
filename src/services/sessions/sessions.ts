import { api } from "@/services/http";
import { TypeCreateSessionPayload, TypeSessionResponse } from "@/types/sessions";

const createSession = async (payload: TypeCreateSessionPayload): Promise<TypeSessionResponse> => {
  const response = await api.post("/sessions", payload);
  return response.data;
}

export { createSession }