import { renderHook, waitFor, act } from '@testing-library/react'
import { createWrapper } from '@/test/wrappers'
import { useUpdatePermissionGroupPermissions } from './use-update-permission-group-permissions'

describe('useUpdatePermissionGroupPermissions', () => {
  it('retorna isSuccess após atualizar', async () => {
    const { result } = renderHook(() => useUpdatePermissionGroupPermissions(), { wrapper: createWrapper() })
    act(() => {
      result.current.mutate({
        permissionGroupId: 'group-1',
        module: 'management',
        payload: {
          module: 'management',
          contexts: [{ context: 'management.people', permissions: [{ permission: 'management.people.list', active: true }] }],
        },
      })
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})
