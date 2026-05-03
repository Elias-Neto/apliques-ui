import { useQuery } from "@tanstack/react-query"
import { fetchSubscription } from "../billing.service"

export const useSubscription = () =>
  useQuery({
    queryKey: ["billing", "subscription"],
    queryFn: fetchSubscription,
    retry: false,
    refetchInterval: (query) => {
      const status = query.state.data?.subscriptionStatus
      if (status === 'overdue' || status === 'suspended') return 30_000
      return false
    },
  })
