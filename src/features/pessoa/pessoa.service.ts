import { api } from "@/services/http"
import { Pessoa } from "./pessoa.types"
import { TypePessoaCreateForm, TypePessoaUpdateForm } from "./pessoa.schema"

export const fetchPessoas = (): Promise<Pessoa[]> =>
  api.get("/management/people").then(r => r.data)

export const fetchPessoaById = (id: string): Promise<Pessoa> =>
  api.get(`/management/people/${id}`).then(r => r.data)

export const createPessoa = (body: TypePessoaCreateForm): Promise<Pessoa> =>
  api.post("/management/people", body).then(r => r.data)

export const updatePessoa = (id: string, body: TypePessoaUpdateForm): Promise<Pessoa> =>
  api.put(`/management/people/${id}`, body).then(r => r.data)

export const deletePessoa = (id: string): Promise<void> =>
  api.delete(`/management/people/${id}`).then(() => undefined)
