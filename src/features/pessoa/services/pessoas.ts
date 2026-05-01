import { api } from "@/services/http"
import { Pessoa } from "../types/pessoa"

export type TypePessoaPayload = {
  name: string
  cpf: string
  password?: string
  permissionGroups: string[]
  phone?: string
}

export const fetchPessoas = (): Promise<Pessoa[]> =>
  api.get("/management/people").then(r => r.data)

export const fetchPessoaById = (id: string): Promise<Pessoa> =>
  api.get(`/management/people/${id}`).then(r => r.data)

export const createPessoa = (body: TypePessoaPayload): Promise<Pessoa> =>
  api.post("/management/people", body).then(r => r.data)

export const updatePessoa = (id: string, body: Partial<TypePessoaPayload>): Promise<Pessoa> =>
  api.put(`/management/people/${id}`, body).then(r => r.data)

export const deletePessoa = (id: string): Promise<void> =>
  api.delete(`/management/people/${id}`).then(() => undefined)
