import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { FinanceFilters } from './FinanceFilters'

describe('FinanceFilters', () => {
  it('busca por nome emite search sem tocar nos ranges', async () => {
    const onFilter = vi.fn()
    const user = userEvent.setup()
    render(<FinanceFilters onFilter={onFilter} />)

    await user.type(screen.getByPlaceholderText('Buscar por nome...'), 'Josimar')

    expect(onFilter).toHaveBeenLastCalledWith({
      search: 'Josimar',
      orderedMin: undefined,
      orderedMax: undefined,
      balanceMin: undefined,
      balanceMax: undefined,
    })
  })

  it('range de Pedidos/Saldo converte R$ digitado para centavos (EC-D7)', async () => {
    const onFilter = vi.fn()
    const user = userEvent.setup()
    render(<FinanceFilters onFilter={onFilter} />)

    await user.type(screen.getByLabelText('Pedidos de (R$)'), '1234.56')

    expect(onFilter).toHaveBeenLastCalledWith(
      expect.objectContaining({ orderedMin: 123456 }),
    )
  })

  it('campo de range vazio não entra no filtro (undefined, não 0 ou NaN)', async () => {
    const onFilter = vi.fn()
    const user = userEvent.setup()
    render(<FinanceFilters onFilter={onFilter} />)

    await user.type(screen.getByLabelText('Saldo de (R$)'), '5')
    await user.clear(screen.getByLabelText('Saldo de (R$)'))

    expect(onFilter).toHaveBeenLastCalledWith(
      expect.objectContaining({ balanceMin: undefined }),
    )
  })

  it('"Limpar" reseta todos os campos e emite filtro vazio', async () => {
    const onFilter = vi.fn()
    const user = userEvent.setup()
    render(<FinanceFilters onFilter={onFilter} />)

    await user.type(screen.getByPlaceholderText('Buscar por nome...'), 'Josimar')
    await user.click(screen.getByRole('button', { name: 'Limpar' }))

    expect(onFilter).toHaveBeenLastCalledWith({})
    expect(screen.getByPlaceholderText('Buscar por nome...')).toHaveValue('')
  })
})
