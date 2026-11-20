import { useQuery } from "@tanstack/react-query"
import { fetchSubscription } from "../billing.service"

// `enabled=false` evita o GET /me/subscription (403) pra quem não tem billing.me.show (ex: funcionário).
export const useSubscription = (enabled = true) =>
  useQuery({
    enabled,
    queryKey: ["billing", "subscription"],
    queryFn: fetchSubscription,
    retry: false,
    refetchInterval: (query) => {
      const status = query.state.data?.subscriptionStatus
      if (status === 'overdue' || status === 'suspended') return 30_000
      return false
    },
  })
