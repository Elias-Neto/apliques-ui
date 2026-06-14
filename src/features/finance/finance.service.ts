import { api } from "@/services/http"

interface CustomerBalance {
  customer: { id: string; name: string; origin?: string | null }
  totalOrdered: number
  totalPaid: number
  balance: number
}

interface OpenBalancesResponse {
  totalOpen: number
  byCustomer: CustomerBalance[]
}

export const fetchOpenBalances = (): Promise<OpenBalancesResponse> =>
  api.get("/finance/open").then(r => r.data)
