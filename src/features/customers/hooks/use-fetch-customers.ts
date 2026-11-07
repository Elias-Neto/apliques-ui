import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { fetchCustomers, CustomerFilters } from "../customer.service"

export const useFetchCustomers = (params?: CustomerFilters) =>
  useQuery({
    queryKey: ["customers", params],
    queryFn: () => fetchCustomers(params),
    placeholderData: keepPreviousData,
  })
