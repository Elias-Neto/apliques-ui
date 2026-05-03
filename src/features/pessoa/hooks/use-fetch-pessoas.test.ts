import { renderHook, waitFor } from '@testing-library/react'
import { server } from '@/test/msw/server'
import { rest } from 'msw'
import { createWrapper } from '@/test/wrappers'
import { useFetchPessoas } from './use-fetch-pessoas'
import { MOCK_PESSOAS } from '@/test/msw/handlers/pessoas'

describe('useFetchPessoas', () => {
  it('retorna lista quando API responde com sucesso', async () => {
    const { result } = renderHook(() => useFetchPessoas(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data![0].name).toBe(MOCK_PESSOAS[0].name)
  })

  it('expõe isError quando API falha', async () => {
    server.use(
      rest.get('http://localhost:3000/management/people', (_req, res, ctx) => res(ctx.status(500)))
    )
    const { result } = renderHook(() => useFetchPessoas(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
