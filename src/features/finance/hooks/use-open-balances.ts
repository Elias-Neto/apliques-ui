import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { fetchOpenBalances, FinanceFilters } from "../finance.service"

export const useOpenBalances = (filters?: FinanceFilters) =>
  useQuery({
    queryKey: ["finance", "open", filters],
    queryFn: () => fetchOpenBalances(filters),
    placeholderData: keepPreviousData,
  })
