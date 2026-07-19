import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, type Mock } from 'vitest'
import { NotinhaPedidoDialog } from './NotinhaPedidoDialog'
import { Order } from '../order.types'

vi.mock('@/contexts/UserContext', () => ({ useUser: vi.fn() }))
vi.mock('@/hooks/use-share-image', () => ({ useShareImage: vi.fn() }))

import { useUser } from '@/contexts/UserContext'
import { useShareImage } from '@/hooks/use-share-image'

const mockUseUser = useUser as Mock
const mockUseShareImage = useShareImage as Mock

const ORDER: Order = {
  id: 'order-1',
  customerID: 'cliente-1',
  orderDate: '2026-06-03T00:00:00.000Z',
  totalPrice: 60000,
  productionStatus: 'em-producao',
  customer: { id: 'cliente-1', name: 'João Silva' },
  items: [
    {
      materialID: 'm1', colorID: 'c1', designID: 'd1',
      unitPrice: 35, quantity: 1000,
      material: { id: 'm1', name: 'Couro PU' },
      color: { id: 'c1', name: 'Verde' },
    },
  ],
}

describe('NotinhaPedidoDialog', () => {
  const share = vi.fn()
  const download = vi.fn()

  beforeEach(() => {
    mockUseUser.mockReturnValue({ user: { tenant: { name: 'Romero Borrachado' } } })
    mockUseShareImage.mockReturnValue({ share, download, isProcessing: false })
  })

  it('renderiza o card da notinha dentro do dialog', () => {
    render(<NotinhaPedidoDialog order={ORDER} open onOpenChange={vi.fn()} />)
    expect(screen.getByText('Romero Borrachado')).toBeInTheDocument()
    expect(screen.getByText(/Couro PU · Verde/)).toBeInTheDocument()
  })

  it('GWT-09.1: botão "Compartilhar imagem" chama share() do useShareImage', async () => {
    const user = userEvent.setup()
    render(<NotinhaPedidoDialog order={ORDER} open onOpenChange={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /compartilhar imagem/i }))
    expect(share).toHaveBeenCalledTimes(1)
  })

  it('botão "Salvar imagem" chama download() do useShareImage', async () => {
    const user = userEvent.setup()
    render(<NotinhaPedidoDialog order={ORDER} open onOpenChange={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /salvar imagem/i }))
    expect(download).toHaveBeenCalledTimes(1)
  })

  it('desabilita os botões enquanto isProcessing', () => {
    mockUseShareImage.mockReturnValue({ share, download, isProcessing: true })
    render(<NotinhaPedidoDialog order={ORDER} open onOpenChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: /compartilhar imagem/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /salvar imagem/i })).toBeDisabled()
  })
})
