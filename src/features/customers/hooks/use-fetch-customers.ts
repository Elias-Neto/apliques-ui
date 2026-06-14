import { useQuery } from "@tanstack/react-query"
import { fetchCustomers } from "../customer.service"

export const useFetchCustomers = (params?: { search?: string }) =>
  useQuery({ queryKey: ["customers", params], queryFn: () => fetchCustomers(params) })
