import { renderHook, waitFor, act } from '@testing-library/react'
import { createWrapper } from '@/test/wrappers'
import { useDeletePessoa } from './use-delete-pessoa'

describe('useDeletePessoa', () => {
  it('retorna isSuccess após deletar', async () => {
    const { result } = renderHook(() => useDeletePessoa(), { wrapper: createWrapper() })
    act(() => { result.current.mutate('pessoa-1') })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})
