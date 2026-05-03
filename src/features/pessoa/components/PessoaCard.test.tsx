import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createWrapper } from '@/test/wrappers'
import { PessoaCard } from './PessoaCard'
import { MOCK_PESSOAS, MOCK_PESSOA_DETALHE } from '@/test/msw/handlers/pessoas'

const pessoa = MOCK_PESSOAS[0]

describe('PessoaCard', () => {
  it('renderiza nome e grupo da pessoa', () => {
    const user = userEvent.setup()
    render(
      <PessoaCard pessoa={pessoa} onEdit={vi.fn()} onDelete={vi.fn()} />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('Maria Silva')).toBeInTheDocument()
    expect(screen.getByText('Operador')).toBeInTheDocument()
  })

  it('abre dialog de detalhes ao clicar no card', async () => {
    const user = userEvent.setup()
    render(
      <PessoaCard pessoa={pessoa} onEdit={vi.fn()} onDelete={vi.fn()} />,
      { wrapper: createWrapper() }
    )
    await user.click(screen.getByText('Maria Silva'))
    expect(await screen.findByText('Detalhes da Pessoa')).toBeInTheDocument()
    expect(await screen.findByText(MOCK_PESSOA_DETALHE.cpf)).toBeInTheDocument()
  })

  it('chama onEdit ao clicar em editar', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()
    render(
      <PessoaCard pessoa={pessoa} onEdit={onEdit} onDelete={vi.fn()} />,
      { wrapper: createWrapper() }
    )
    await user.click(screen.getByRole('button', { name: /editar maria silva/i }))
    expect(onEdit).toHaveBeenCalledWith(pessoa)
  })

  it('chama onDelete após confirmar exclusão', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    render(
      <PessoaCard pessoa={pessoa} onEdit={vi.fn()} onDelete={onDelete} />,
      { wrapper: createWrapper() }
    )
    await user.click(screen.getByRole('button', { name: /excluir maria silva/i }))
    await user.click(screen.getByRole('button', { name: /^excluir$/i }))
    expect(onDelete).toHaveBeenCalledWith(pessoa.id)
  })
})
