import { useQuery } from "@tanstack/react-query"
import { fetchPessoas } from "../services/pessoas"

export const useFetchPessoas = () =>
  useQuery({ queryKey: ["pessoas"], queryFn: fetchPessoas })
