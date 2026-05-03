import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { server } from '@/test/msw/server'
import { rest } from 'msw'
import { createRouterWrapper } from '@/test/wrappers'
import Pessoas from './Pessoas'
import { MOCK_PESSOAS } from '@/test/msw/handlers/pessoas'

describe('Pessoas page', () => {
  it('renderiza lista de pessoas após carregar', async () => {
    render(<Pessoas />, { wrapper: createRouterWrapper() })
    expect(await screen.findByText(MOCK_PESSOAS[0].name)).toBeInTheDocument()
  })

  it('exibe skeleton durante loading', () => {
    render(<Pessoas />, { wrapper: createRouterWrapper() })
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('exibe empty state quando lista vazia', async () => {
    server.use(
      rest.get('http://localhost:3000/management/people', (_req, res, ctx) =>
        res(ctx.status(200), ctx.json([]))
      )
    )
    render(<Pessoas />, { wrapper: createRouterWrapper() })
    expect(await screen.findByText(/nenhuma pessoa encontrada/i)).toBeInTheDocument()
  })

  it('abre dialog de criar pessoa ao clicar em Nova Pessoa', async () => {
    const user = userEvent.setup()
    render(<Pessoas />, { wrapper: createRouterWrapper() })
    await screen.findByText(MOCK_PESSOAS[0].name)
    await user.click(screen.getByRole('button', { name: /nova pessoa/i }))
    expect(await screen.findByText(/criar nova pessoa/i)).toBeInTheDocument()
  })
})
