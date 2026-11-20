import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { FilterLayout } from './FilterLayout'

describe('FilterLayout', () => {
  it('campos escondidos até tocar no funil; busca sempre visível', async () => {
    render(
      <FilterLayout chips={[]} onClear={vi.fn()} search={<input placeholder="Buscar" />}>
        <span>campo</span>
      </FilterLayout>,
    )
    expect(screen.getByPlaceholderText('Buscar')).toBeInTheDocument()
    expect(screen.queryByText('campo')).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Filtros' }))
    expect(screen.getByText('campo')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Ver resultados' }))
    expect(screen.queryByText('campo')).not.toBeInTheDocument()
  })

  it('chips mostram filtros ativos, contador no funil e remover chama onRemove', async () => {
    const onRemove = vi.fn()
    render(
      <FilterLayout
        chips={[{ key: 'a', label: 'Couro PU', onRemove }, { key: 'b', label: 'A fazer', onRemove: vi.fn() }]}
        onClear={vi.fn()}
      >
        <span>campo</span>
      </FilterLayout>,
    )
    expect(screen.getByRole('button', { name: 'Filtros (2 ativos)' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Remover filtro Couro PU' }))
    expect(onRemove).toHaveBeenCalledTimes(1)
  })
})
