import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { server } from '@/test/msw/server'
import { createRouterWrapper } from '@/test/wrappers'
import AccountCreate from './AccountCreate'

describe('AccountCreate page', () => {
  it('renderiza todos os campos do formulário', () => {
    render(<AccountCreate />, { wrapper: createRouterWrapper() })
    expect(screen.getByLabelText(/nome da empresa/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/cnpj/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/nome do proprietário/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^cpf$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^senha$/i)).toBeInTheDocument()
  })

  it('toggle de visibilidade de senha funciona', async () => {
    const user = userEvent.setup()
    render(<AccountCreate />, { wrapper: createRouterWrapper() })
    const senhaInput = screen.getByLabelText(/^senha$/i)
    expect(senhaInput).toHaveAttribute('type', 'password')
    await user.click(screen.getByRole('button', { name: /mostrar senha/i }))
    expect(senhaInput).toHaveAttribute('type', 'text')
  })

  it('desabilita todos os campos enquanto submete', async () => {
    server.use(
      rest.post('http://localhost:3000/tenants', (_req, res, ctx) =>
        res(ctx.delay('infinite'))
      )
    )
    const user = userEvent.setup()
    render(<AccountCreate />, { wrapper: createRouterWrapper() })

    await user.type(screen.getByLabelText(/nome da empresa/i), 'Confecção Alpha')
    await user.type(screen.getByLabelText(/cnpj/i), '12345678000190')
    await user.type(screen.getByLabelText(/nome do proprietário/i), 'João Dono')
    await user.type(screen.getByLabelText(/telefone/i), '81999990001')
    await user.type(screen.getByLabelText(/^cpf$/i), '12345678901')
    await user.type(screen.getByLabelText(/^senha$/i), 'senha123')

    user.click(screen.getByRole('button', { name: /criar conta/i }))
    expect(await screen.findByRole('button', { name: /criando conta/i })).toBeDisabled()
  })
})
