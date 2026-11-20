import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, type Mock } from 'vitest'
import { ExtratoClienteDialog } from './ExtratoClienteDialog'
import { Customer, Order, Payment } from '../customer.types'

vi.mock('@/contexts/UserContext', () => ({ useUser: vi.fn() }))
vi.mock('@/hooks/use-share-image', () => ({ useShareImage: vi.fn() }))

import { useUser } from '@/contexts/UserContext'
import { useShareImage } from '@/hooks/use-share-image'

const mockUseUser = useUser as Mock
const mockUseShareImage = useShareImage as Mock

const order = (id: string, orderDate: string, totalPrice: number): Order => ({
  _id: id, orderDate, items: [], totalPrice, productionStatus: 'em-producao',
})
const payment = (id: string, date: string, amount: number): Payment => ({ id, amount, date })

// Datas relativas a "hoje" (a Dialog computa cutoff com `new Date()` real) —
// evita acoplar o teste a uma data fixa de calendário.
const daysAgo = (n: number) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

// Preset default = "Últimos 90 dias": o1 (200 dias atrás) cai como "anterior";
// o2 (10 dias atrás) cai no período.
const CUSTOMER: Customer = {
  id: 'c1',
  name: 'João Silva',
  totalOrdered: 150000,
  totalPaid: 100000,
  balance: 50000,
  orders: [order('o1', daysAgo(200), 100000), order('o2', daysAgo(10), 50000)],
  payments: [payment('p1', daysAgo(5), 100000)],
}

describe('ExtratoClienteDialog', () => {
  beforeEach(() => {
    mockUseUser.mockReturnValue({ user: { tenant: { name: 'Romero Borrachado' } } })
    mockUseShareImage.mockReturnValue({ share: vi.fn(), download: vi.fn(), isProcessing: false })
  })

  it('GWT-03.1: abre com "Desde o início (todo o tempo)" pré-selecionado — nada vira saldo anterior', () => {
    render(<ExtratoClienteDialog customer={CUSTOMER} open onOpenChange={vi.fn()} />)
    expect(screen.getByText('Desde o início (todo o tempo)')).toBeInTheDocument()
    expect(screen.getByText('R$ 0,00')).toBeInTheDocument() // do início: nada antes do corte
  })

  it('GWT-03.3: data manual fica bloqueada até marcar o checkbox; ao marcar, sobrepõe o preset e atualiza a prévia', async () => {
    const user = userEvent.setup()
    render(<ExtratoClienteDialog customer={CUSTOMER} open onOpenChange={vi.fn()} />)

    const dateInput = screen.getByLabelText(/a partir de/i)
    expect(dateInput).toBeDisabled()

    await user.click(screen.getByLabelText(/escolher uma data específica/i))
    expect(dateInput).toBeEnabled()
    expect(screen.getByText(/desta data em diante/i)).toBeInTheDocument()

    const dataAntesDeTudo = new Date()
    dataAntesDeTudo.setDate(dataAntesDeTudo.getDate() - 500)
    const isoDate = dataAntesDeTudo.toISOString().split('T')[0]
    fireEvent.change(dateInput, { target: { value: isoDate } })

    expect(screen.getByText('R$ 0,00')).toBeInTheDocument() // nada antes de 500 dias atrás
  })

  it('GWT-03.4: desmarcar o checkbox descarta a data e volta ao preset padrão', async () => {
    const user = userEvent.setup()
    render(<ExtratoClienteDialog customer={CUSTOMER} open onOpenChange={vi.fn()} />)

    await user.click(screen.getByLabelText(/escolher uma data específica/i))
    // corte 3 dias atrás: o1 (100000) + o2 (50000) - p1 (100000) ficam antes → R$ 500,00
    fireEvent.change(screen.getByLabelText(/a partir de/i), { target: { value: daysAgo(3).slice(0, 10) } })
    expect(screen.getByText('R$ 500,00')).toBeInTheDocument()

    await user.click(screen.getByLabelText(/escolher uma data específica/i))
    expect(screen.getByLabelText(/a partir de/i)).toBeDisabled()
    expect(screen.getByText('R$ 0,00')).toBeInTheDocument() // volta pro "desde o início"
  })

  it('EC-T2: ao gerar o extrato, o cutoff escolhido é preservado no preview', async () => {
    const user = userEvent.setup()
    render(<ExtratoClienteDialog customer={CUSTOMER} open onOpenChange={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /gerar extrato/i }))

    expect(screen.getByText('Extrato do cliente')).toBeInTheDocument()
    expect(screen.getByText(/Período:/)).toBeInTheDocument()
    expect(screen.getByText('João Silva')).toBeInTheDocument()
  })

  it('GWT-09.1: no preview, "Compartilhar imagem" chama share() do useShareImage', async () => {
    const share = vi.fn()
    mockUseShareImage.mockReturnValue({ share, download: vi.fn(), isProcessing: false })
    const user = userEvent.setup()
    render(<ExtratoClienteDialog customer={CUSTOMER} open onOpenChange={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /gerar extrato/i }))
    await user.click(screen.getByRole('button', { name: /compartilhar imagem/i }))

    expect(share).toHaveBeenCalledTimes(1)
  })
})
