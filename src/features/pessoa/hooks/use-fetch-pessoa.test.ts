import { renderHook, waitFor } from '@testing-library/react'
import { createWrapper } from '@/test/wrappers'
import { useFetchPessoa } from './use-fetch-pessoa'
import { MOCK_PESSOA_DETALHE } from '@/test/msw/handlers/pessoas'

describe('useFetchPessoa', () => {
  it('não dispara fetch quando id é null', () => {
    const { result } = renderHook(() => useFetchPessoa(null), { wrapper: createWrapper() })
    expect(result.current.fetchStatus).toBe('idle')
    expect(result.current.data).toBeUndefined()
  })

  it('retorna pessoa quando id fornecido', async () => {
    const { result } = renderHook(() => useFetchPessoa('pessoa-1'), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.name).toBe(MOCK_PESSOA_DETALHE.name)
  })
})
