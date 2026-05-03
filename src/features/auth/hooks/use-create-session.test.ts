import { renderHook, waitFor, act } from '@testing-library/react'
import { server } from '@/test/msw/server'
import { rest } from 'msw'
import { createWrapper } from '@/test/wrappers'
import { useCreateSession } from './use-create-session'

const CREDS = { cpf: '123.456.789-01', password: 'senha123' }

describe('useCreateSession', () => {
  it('retorna token após login com sucesso', async () => {
    const { result } = renderHook(() => useCreateSession(), { wrapper: createWrapper() })
    act(() => { result.current.mutate(CREDS) })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.token).toBe('fake-jwt-token')
  })

  it('retorna isError quando credenciais inválidas', async () => {
    server.use(
      rest.post('http://localhost:3000/sessions', (_req, res, ctx) => res(ctx.status(401)))
    )
    const { result } = renderHook(() => useCreateSession(), { wrapper: createWrapper() })
    act(() => { result.current.mutate(CREDS) })
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
