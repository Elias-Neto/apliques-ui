import { renderHook, waitFor, act } from '@testing-library/react'
import { server } from '@/test/msw/server'
import { rest } from 'msw'
import { createWrapper } from '@/test/wrappers'
import { useCreatePessoa } from './use-create-pessoa'

const PAYLOAD = {
  name: 'João Costa',
  cpf: '111.111.111-11',
  phone: '',
  password: 'senha123',
  permissionGroups: ['group-1'],
}

describe('useCreatePessoa', () => {
  it('retorna isSuccess após criar', async () => {
    const { result } = renderHook(() => useCreatePessoa(), { wrapper: createWrapper() })
    act(() => { result.current.mutate(PAYLOAD) })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('retorna isError quando API falha', async () => {
    server.use(
      rest.post('http://localhost:3000/management/people', (_req, res, ctx) => res(ctx.status(400)))
    )
    const { result } = renderHook(() => useCreatePessoa(), { wrapper: createWrapper() })
    act(() => { result.current.mutate(PAYLOAD) })
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
