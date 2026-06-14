import { useQuery } from "@tanstack/react-query"
import { fetchPayments } from "../payment.service"

export const useCustomerPayments = (customerID: string | null) =>
  useQuery({
    queryKey: ["payments", customerID],
    queryFn: () => fetchPayments(customerID!),
    enabled: !!customerID,
  })
