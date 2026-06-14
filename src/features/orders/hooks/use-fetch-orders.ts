import { useQuery } from "@tanstack/react-query"
import { ProductionStatus } from "../order.types"
import { fetchOrders } from "../order.service"

interface Filters {
  productionStatus?: ProductionStatus
  customerID?: string
  dateFrom?: string
  dateTo?: string
}

export const useFetchOrders = (filters?: Filters) =>
  useQuery({ queryKey: ["orders", filters], queryFn: () => fetchOrders(filters) })
