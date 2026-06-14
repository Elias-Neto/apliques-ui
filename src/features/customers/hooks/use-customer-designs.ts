import { useQuery } from "@tanstack/react-query"
import { fetchDesigns } from "../design.service"

export const useCustomerDesigns = (customerID: string | null) =>
  useQuery({
    queryKey: ["designs", customerID],
    queryFn: () => fetchDesigns(customerID!),
    enabled: !!customerID,
  })
