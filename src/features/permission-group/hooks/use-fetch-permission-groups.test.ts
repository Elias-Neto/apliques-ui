import { renderHook, waitFor } from '@testing-library/react'
import { createWrapper } from '@/test/wrappers'
import { useFetchPermissionGroups } from './use-fetch-permission-groups'
import { MOCK_GRUPOS } from '@/test/msw/handlers/permission-groups'

describe('useFetchPermissionGroups', () => {
  it('retorna lista de grupos', async () => {
    const { result } = renderHook(() => useFetchPermissionGroups(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(MOCK_GRUPOS.length)
  })
})
