import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PessoaForm } from './PessoaForm'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    {children}
  </QueryClientProvider>
)

describe('PessoaForm', () => {
  it('exibe erros de validação quando submetido vazio', async () => {
    const user = userEvent.setup()
    render(<PessoaForm onSubmit={vi.fn()} submitLabel="Salvar" />, { wrapper })
    await user.click(screen.getByRole('button', { name: /salvar/i }))
    expect(await screen.findByText('Nome obrigatório')).toBeInTheDocument()
    expect(screen.getByText('CPF inválido')).toBeInTheDocument()
    expect(screen.getByText('Senha obrigatória')).toBeInTheDocument()
  })

  it('chama onSubmit com dados válidos', async () => {
    const onSubmit = vi.fn()
    render(<PessoaForm onSubmit={onSubmit} submitLabel="Salvar" />, { wrapper })
    await screen.findByText('Operador')

    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/nome \*/i), 'Maria Silva')
    fireEvent.change(screen.getByLabelText(/cpf \*/i), { target: { value: '123.456.789-01' } })
    await user.type(screen.getByLabelText(/senha \*/i), 'senha123')
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getAllByRole('option')[0])
    await user.click(screen.getByRole('button', { name: /salvar/i }))

    // react-hook-form handleSubmit passa (data, event) — segundo arg é o SyntheticEvent
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Maria Silva', permissionGroups: ['group-1'] }),
        expect.anything()
      )
    )
  })

  it('desabilita o botão quando isLoading=true', () => {
    render(<PessoaForm onSubmit={vi.fn()} submitLabel="Salvar" isLoading />, { wrapper })
    expect(screen.getByRole('button', { name: /salvando/i })).toBeDisabled()
  })

  it('oculta campo de senha em modo de edição', () => {
    render(
      <PessoaForm
        onSubmit={vi.fn()}
        submitLabel="Atualizar"
        initialData={{ id: 'pessoa-1', name: 'Maria', cpf: '123.456.789-01' }}
      />,
      { wrapper }
    )
    expect(screen.queryByLabelText(/senha \*/i)).not.toBeInTheDocument()
  })
})
