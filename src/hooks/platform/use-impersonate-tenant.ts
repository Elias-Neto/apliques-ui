import { useMutation } from '@tanstack/react-query'
import { api } from '@/services/http'

const impersonateTenant = async (tenantId: string): Promise<{ token: string }> => {
  const { data } = await api.post<{ token: string }>(`/admin/tenants/${tenantId}/impersonate`)
  return data
}

export function useImpersonateTenant() {
  return useMutation({
    mutationFn: impersonateTenant,
    onSuccess: ({ token }) => {
      const url = `${window.location.origin}?impersonation-token=${token}`
      window.open(url, '_blank', 'noopener,noreferrer')
    },
  })
}
