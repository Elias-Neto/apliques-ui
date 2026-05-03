import { renderHook, waitFor, act } from '@testing-library/react'
import { createWrapper } from '@/test/wrappers'
import { useUpdatePessoa } from './use-update-pessoa'

describe('useUpdatePessoa', () => {
  it('retorna isSuccess após atualizar', async () => {
    const { result } = renderHook(() => useUpdatePessoa(), { wrapper: createWrapper() })
    act(() => {
      result.current.mutate({
        id: 'pessoa-1',
        data: { name: 'Maria Atualizada', cpf: '123.456.789-01', permissionGroups: ['group-1'] },
      })
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})
