import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { server } from '@/test/msw/server'
import { createRouterWrapper } from '@/test/wrappers'
import Login from './Login'

describe('Login page', () => {
  it('renderiza campos de CPF e senha', () => {
    render(<Login />, { wrapper: createRouterWrapper() })
    expect(screen.getByLabelText(/cpf/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
  })

  it('exibe erros de validação quando submetido vazio', async () => {
    const user = userEvent.setup()
    render(<Login />, { wrapper: createRouterWrapper() })
    await user.click(screen.getByRole('button', { name: /entrar/i }))
    expect(await screen.findByText('CPF inválido')).toBeInTheDocument()
  })

  it('desabilita botão enquanto autenticando', async () => {
    // delay infinito para manter isPending=true enquanto verificamos o botão
    server.use(
      rest.post('http://localhost:3000/sessions', (_req, res, ctx) =>
        res(ctx.delay('infinite'))
      )
    )
    const user = userEvent.setup()
    render(<Login />, { wrapper: createRouterWrapper() })
    await user.type(screen.getByLabelText(/cpf/i), '12345678901')
    await user.type(screen.getByLabelText(/senha/i), 'senha123')
    user.click(screen.getByRole('button', { name: /entrar/i }))
    expect(await screen.findByRole('button', { name: /entrando/i })).toBeDisabled()
  })
})
