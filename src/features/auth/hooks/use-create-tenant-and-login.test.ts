import { renderHook, waitFor, act } from '@testing-library/react'
import { server } from '@/test/msw/server'
import { rest } from 'msw'
import { createWrapper } from '@/test/wrappers'
import { useCreateTenantAndLogin } from './use-create-tenant-and-login'

const FORM_DATA = {
  companyName: 'Confecção Alpha',
  companyCnpj: '12.345.678/0001-90',
  ownerName: 'João Dono',
  ownerPhone: '(81) 99999-0001',
  ownerCpf: '123.456.789-01',
  ownerPassword: 'senha123',
}

describe('useCreateTenantAndLogin', () => {
  it('retorna token após criar tenant e fazer login', async () => {
    const { result } = renderHook(() => useCreateTenantAndLogin(), { wrapper: createWrapper() })
    act(() => { result.current.mutate(FORM_DATA) })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.token).toBe('fake-jwt-token')
  })

  it('retorna isError quando criação de tenant falha', async () => {
    server.use(
      rest.post('http://localhost:3000/tenants', (_req, res, ctx) => res(ctx.status(400)))
    )
    const { result } = renderHook(() => useCreateTenantAndLogin(), { wrapper: createWrapper() })
    act(() => { result.current.mutate(FORM_DATA) })
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
