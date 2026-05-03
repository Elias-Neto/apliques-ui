import { render, screen } from '@testing-library/react'
import { vi, type Mock } from 'vitest'
import { createRouterWrapper } from '@/test/wrappers'
import { MainMenu } from './index'
import { Permission } from '@/types/enums'
import type { NavSection } from '@/config/nav'

vi.mock('@/hooks/use-menu', () => ({
  useMenu: () => ({ isOpen: false, setIsOpen: vi.fn(), isCollapsed: false, setIsCollapsed: vi.fn() }),
}))

vi.mock('@/hooks/use-scroll-direction', () => ({
  useScrollDirection: () => ({ isAtTop: true }),
}))

vi.mock('@/features/auth/hooks/use-auth', () => ({
  useAuth: () => ({ logout: vi.fn() }),
}))

vi.mock('@/contexts/UserContext', () => ({
  useUser: vi.fn(),
}))

// Getter mutável — permite trocar por teste sem re-importar o módulo
let _domainSections: NavSection[] = []
vi.mock('@/config/nav', () => ({
  get domainSections() { return _domainSections },
}))

import { useUser } from '@/contexts/UserContext'
const mockUseUser = useUser as Mock

const renderMenu = (permissions: string[] = []) => {
  mockUseUser.mockReturnValue({
    user: { name: 'Teste', permissions },
    isLoading: false,
    error: null,
    refetch: async () => {},
  })
  return render(<MainMenu />, { wrapper: createRouterWrapper() })
}

beforeEach(() => {
  _domainSections = []
})

describe('MainMenu — estrutura base (domainSections vazio)', () => {
  it('renderiza "Painel" em "Início" (não "Home")', () => {
    renderMenu()
    expect(screen.getByText('Início')).toBeInTheDocument()
    expect(screen.getByText('Painel')).toBeInTheDocument()
    expect(screen.queryByText('Home')).not.toBeInTheDocument()
  })

  it('renderiza seção "Minha Conta" com "Meus dados"', () => {
    renderMenu()
    expect(screen.getByText('Minha Conta')).toBeInTheDocument()
    expect(screen.getByText('Meus dados')).toBeInTheDocument()
  })

  it('renderiza seção "Minha Empresa" com "Permissões" e "Pessoas"', () => {
    renderMenu()
    expect(screen.getByText('Minha Empresa')).toBeInTheDocument()
    expect(screen.getByText('Permissões')).toBeInTheDocument()
    expect(screen.getByText('Pessoas')).toBeInTheDocument()
    expect(screen.queryByText('Configurações')).not.toBeInTheDocument()
    expect(screen.queryByText('Permissionamento')).not.toBeInTheDocument()
  })

  it('"Minha mensalidade" oculto sem permissão billing.me.show', () => {
    renderMenu([])
    expect(screen.queryByText('Minha mensalidade')).not.toBeInTheDocument()
  })

  it('"Minha mensalidade" visível com permissão billing.me.show', () => {
    renderMenu([Permission.BillingMeShow])
    expect(screen.getByText('Minha mensalidade')).toBeInTheDocument()
  })

  it('"Meus dados" visível sem nenhuma permissão especial', () => {
    renderMenu([])
    expect(screen.getByText('Meus dados')).toBeInTheDocument()
  })

  it('domainSections vazio não renderiza seção extra', () => {
    renderMenu()
    expect(screen.queryByText('Produção')).not.toBeInTheDocument()
  })
})

describe('MainMenu — domainSections populado', () => {
  it('renderiza seção de domínio entre "Início" e "Minha Conta"', () => {
    _domainSections = [
      {
        label: 'Produção',
        items: [{ label: 'Borrachados', href: '/producao/borrachados', icon: () => null as any }],
      },
    ]
    renderMenu()

    expect(screen.getByText('Produção')).toBeInTheDocument()
    expect(screen.getByText('Borrachados')).toBeInTheDocument()

    // Verificar ordem: "Início" antes de "Produção", "Produção" antes de "Minha Conta"
    const allText = document.body.textContent ?? ''
    const posInicio = allText.indexOf('Início')
    const posProducao = allText.indexOf('Produção')
    const posMinhaConta = allText.indexOf('Minha Conta')
    expect(posInicio).toBeLessThan(posProducao)
    expect(posProducao).toBeLessThan(posMinhaConta)
  })

  it('múltiplas seções de domínio preservam ordem declarada', () => {
    _domainSections = [
      { label: 'Produção', items: [] },
      { label: 'Vendas', items: [] },
    ]
    renderMenu()

    const allText = document.body.textContent ?? ''
    const posProducao = allText.indexOf('Produção')
    const posVendas = allText.indexOf('Vendas')
    expect(posProducao).toBeLessThan(posVendas)
  })
})
