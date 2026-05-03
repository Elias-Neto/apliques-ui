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
    expect(screen.getByRole('option', { name: 'Minha Empresa' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Mensalidade' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'management' })).not.toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'billing' })).not.toBeInTheDocument()
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
