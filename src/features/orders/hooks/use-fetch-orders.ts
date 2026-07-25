import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { fetchOrders, OrderFilters } from "../order.service"

export const useFetchOrders = (filters?: OrderFilters) =>
  useQuery({
    queryKey: ["orders", filters],
    queryFn: () => fetchOrders(filters),
    placeholderData: keepPreviousData,
  })
