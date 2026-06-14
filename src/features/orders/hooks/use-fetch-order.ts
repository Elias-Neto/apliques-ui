import { useQuery } from "@tanstack/react-query"
import { fetchOrderById } from "../order.service"

export const useFetchOrder = (id: string | null) =>
  useQuery({
    queryKey: ["order", id],
    queryFn: () => fetchOrderById(id!),
    enabled: !!id,
  })
