import { api } from "@/services/http";

export interface MeResponse {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  cpf?: string;
  permissions: string[];
  tenant: {
    id: string;
    name: string;
    cnpj: string;
  };
}

let mePromise: Promise<MeResponse> | null = null;

export const getMe = async (): Promise<MeResponse> => {
  if (!mePromise) {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token não encontrado");
    mePromise = api.get("/management/people/me").then(res => res.data);
  }
  return mePromise;
};

export const resetMeCache = () => {
  mePromise = null;
}; 