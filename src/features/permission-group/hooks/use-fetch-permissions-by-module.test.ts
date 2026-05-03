import { renderHook, waitFor } from '@testing-library/react'
import { createWrapper } from '@/test/wrappers'
import { useFetchPermissionsByModule } from './use-fetch-permissions-by-module'
import { MOCK_PERMISSIONS_RESPONSE } from '@/test/msw/handlers/permission-groups'

describe('useFetchPermissionsByModule', () => {
  it('não dispara fetch quando module é string vazia', () => {
    const { result } = renderHook(() => useFetchPermissionsByModule(''), { wrapper: createWrapper() })
    expect(result.current.fetchStatus).toBe('idle')
  })

  it('retorna permissões quando module fornecido', async () => {
    const { result } = renderHook(() => useFetchPermissionsByModule('management'), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.contexts).toHaveLength(MOCK_PERMISSIONS_RESPONSE.contexts.length)
  })
})
