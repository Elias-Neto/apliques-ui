import { api } from "@/services/http"

export interface CustomerBalance {
  customer: { id: string; name: string; origin?: string | null }
  totalOrdered: number
  totalPaid: number
  balance: number
}

export type FinanceSortField = 'name' | 'totalOrdered' | 'totalPaid' | 'balance'
export type FinanceSortDir = 'asc' | 'desc'

export interface FinanceFilters {
  search?: string
  orderedMin?: number
  orderedMax?: number
  balanceMin?: number
  balanceMax?: number
  sortBy?: FinanceSortField
  sortDir?: FinanceSortDir
  limit?: number
  offset?: number
}

export interface OpenBalancesResponse {
  totalOpen: number
  items: CustomerBalance[]
  total: number
}

export const fetchOpenBalances = (filters?: FinanceFilters): Promise<OpenBalancesResponse> =>
  api.get("/finance/open", { params: filters }).then(r => r.data)
