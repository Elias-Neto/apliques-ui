import { useMutation } from '@tanstack/react-query'
import { api } from '@/services/http'

const impersonateTenant = async (tenantId: string): Promise<{ token: string }> => {
  const { data } = await api.post<{ token: string }>(`/admin/tenants/${tenantId}/impersonate`)
  return data
}

export function useImpersonateTenant() {
  const mutation = useMutation({ mutationFn: impersonateTenant })

  // window.open is called synchronously inside the click handler to preserve user activation.
  // Without this, async onSuccess loses the activation window and browsers block the popup.
  const impersonate = (tenantId: string) => {
    const newTab = window.open('about:blank', '_blank')
    mutation.mutate(tenantId, {
      onSuccess: ({ token }) => {
        if (newTab) {
          newTab.location.href = `${window.location.origin}?impersonation-token=${token}`
        }
      },
      onError: () => {
        newTab?.close()
      },
    })
  }

  return { impersonate, isPending: mutation.isPending }
}
