import { useQuery } from "@tanstack/react-query"
import { fetchCustomerOrigins } from "../customer.service"

export const useCustomerOrigins = () =>
  useQuery({
    queryKey: ["customers", "origins"],
    queryFn: fetchCustomerOrigins,
  })
