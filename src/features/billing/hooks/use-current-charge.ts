import { useQuery } from "@tanstack/react-query"
import { fetchCurrentCharge } from "../billing.service"
import type { TypeCharge } from "../billing.types"

const isActiveCharge = (data: unknown): data is TypeCharge =>
  !!data && typeof data === 'object' && 'chargeID' in data && (data as TypeCharge).status === 'pending'

export const useCurrentCharge = () =>
  useQuery({
    queryKey: ["billing", "current-charge"],
    queryFn: fetchCurrentCharge,
    retry: false,
    refetchInterval: (query) => {
      if (isActiveCharge(query.state.data)) return 5_000
      return false
    },
  })
