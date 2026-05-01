import { useQuery } from "@tanstack/react-query"
import { fetchPessoas } from "../pessoa.service"

export const useFetchPessoas = () =>
  useQuery({ queryKey: ["pessoas"], queryFn: fetchPessoas })
