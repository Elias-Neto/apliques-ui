import { useQuery } from "@tanstack/react-query"
import { fetchOpenBalances } from "../finance.service"

export const useOpenBalances = () =>
  useQuery({ queryKey: ["finance", "open"], queryFn: fetchOpenBalances })
