import { useQuery } from "@tanstack/react-query"
import { fetchPessoaById } from "../services/pessoas"

export const useFetchPessoa = (id: string | null) =>
  useQuery({
    queryKey: ["pessoa", id],
    queryFn: () => fetchPessoaById(id!),
    enabled: !!id,
  })
