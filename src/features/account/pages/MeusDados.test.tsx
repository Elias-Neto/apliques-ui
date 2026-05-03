import { render, screen } from '@testing-library/react'
import { vi, type Mock } from 'vitest'
import { createWrapper } from '@/test/wrappers'
import { MOCK_ME } from '@/test/msw/handlers/pessoas'
import MeusDados from './MeusDados'

vi.mock('@/contexts/UserContext', () => ({
  useUser: vi.fn(),
}))

import { useUser } from '@/contexts/UserContext'
const mockUseUser = useUser as Mock

describe('MeusDados page', () => {
  it('exibe dados do usuário logado', () => {
    mockUseUser.mockReturnValue({ user: MOCK_ME, isLoading: false, error: null, refetch: async () => {} })
    render(<MeusDados />, { wrapper: createWrapper() })
    expect(screen.getByText(MOCK_ME.name)).toBeInTheDocument()
    expect(screen.getByText(MOCK_ME.email)).toBeInTheDocument()
    expect(screen.getByText(MOCK_ME.tenant.name)).toBeInTheDocument()
  })

  it('exibe CNPJ do tenant', () => {
    mockUseUser.mockReturnValue({ user: MOCK_ME, isLoading: false, error: null, refetch: async () => {} })
    render(<MeusDados />, { wrapper: createWrapper() })
    expect(screen.getByText(MOCK_ME.tenant.cnpj)).toBeInTheDocument()
  })

  it('exibe "—" para campos opcionais ausentes (phone, cpf)', () => {
    const userSemOpcionais = { ...MOCK_ME, phone: undefined, cpf: undefined }
    mockUseUser.mockReturnValue({ user: userSemOpcionais, isLoading: false, error: null, refetch: async () => {} })
    render(<MeusDados />, { wrapper: createWrapper() })
    const tracos = screen.getAllByText('—')
    expect(tracos.length).toBeGreaterThanOrEqual(2)
  })

  it('exibe "—" para CNPJ ausente', () => {
    const tenantSemCnpj = { ...MOCK_ME, tenant: { ...MOCK_ME.tenant, cnpj: '' } }
    mockUseUser.mockReturnValue({ user: tenantSemCnpj, isLoading: false, error: null, refetch: async () => {} })
    render(<MeusDados />, { wrapper: createWrapper() })
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('exibe skeleton enquanto carrega', () => {
    mockUseUser.mockReturnValue({ user: null, isLoading: true, error: null, refetch: async () => {} })
    render(<MeusDados />, { wrapper: createWrapper() })
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
  })
})
