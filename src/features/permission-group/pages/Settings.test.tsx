import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { server } from '@/test/msw/server'
import { createWrapper } from '@/test/wrappers'
import Settings from './Settings'
import { MOCK_PERMISSIONS_RESPONSE } from '@/test/msw/handlers/permission-groups'

describe('Settings page', () => {
  it('renderiza o heading de permissões', () => {
    render(<Settings />, { wrapper: createWrapper() })
    expect(screen.getByRole('heading', { name: /^permissões$/i })).toBeInTheDocument()
  })

  it('dropdown exibe labels PT-BR dos módulos (sem termos em inglês)', async () => {
    const user = userEvent.setup()
    render(<Settings />, { wrapper: createWrapper() })
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByRole('option', { name: 'Minha empresa' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Minha mensalidade' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'management' })).not.toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'billing' })).not.toBeInTheDocument()
  })

  it('seletor espelha as áreas do menu (Produção, Clientes, Catálogo, Financeiro)', async () => {
    const user = userEvent.setup()
    render(<Settings />, { wrapper: createWrapper() })
    await user.click(screen.getByRole('combobox'))
    ;['Produção', 'Clientes', 'Catálogo', 'Financeiro'].forEach(label =>
      expect(screen.getByRole('option', { name: label })).toBeInTheDocument(),
    )
    expect(screen.queryByRole('option', { name: 'Pedidos' })).not.toBeInTheDocument()
    expect(screen.queryByRole('option', { name: /Catálogo — /i })).not.toBeInTheDocument()
  })

  it('renderiza permissões após selecionar módulo', async () => {
    const user = userEvent.setup()
    render(<Settings />, { wrapper: createWrapper() })

    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getAllByRole('option')[0])

    // Múltiplos "Operador" no DOM (card de module-active + collapsible) — verificar presença
    const groupLabels = await screen.findAllByText(MOCK_PERMISSIONS_RESPONSE.permissionGroups[0].label)
    expect(groupLabels.length).toBeGreaterThan(0)
  })

  it('switch do módulo é derivado das permissões e desliga todas e religa todas de uma vez', async () => {
    const user = userEvent.setup()
    render(<Settings />, { wrapper: createWrapper() })

    const moduleSwitch = await screen.findByRole('switch', { name: 'Operador' })
    expect(moduleSwitch).toBeChecked() // mock: 1 permissão ligada → módulo ligado

    await user.click(moduleSwitch)
    expect(moduleSwitch).not.toBeChecked()
    expect(screen.getByRole('button', { name: /aplicar alterações/i })).toBeInTheDocument()

    // ligar de novo libera TODAS as permissões do grupo (inclusive a que estava desligada)
    await user.click(moduleSwitch)
    expect(moduleSwitch).toBeChecked()
    expect(screen.getByRole('button', { name: /aplicar alterações/i })).toBeInTheDocument()
  })

  it('exibe skeleton enquanto carrega permissões', async () => {
    server.use(
      rest.get('http://localhost:3000/management/permission-groups/permissions', (_req, res, ctx) =>
        res(ctx.delay('infinite'))
      )
    )
    const user = userEvent.setup()
    render(<Settings />, { wrapper: createWrapper() })
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getAllByRole('option')[0])
    // Com delay infinito, isLoading permanece true e skeleton fica visível
    await waitFor(() => {
      expect(document.querySelector('.animate-pulse')).not.toBeNull()
    })
  })
})
