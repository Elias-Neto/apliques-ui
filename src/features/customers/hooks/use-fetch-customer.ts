import { useQuery } from "@tanstack/react-query"
import { fetchCustomerById } from "../customer.service"

export const useFetchCustomer = (id: string | null) =>
  useQuery({
    queryKey: ["customer", id],
    queryFn: () => fetchCustomerById(id!),
    enabled: !!id,
  })
