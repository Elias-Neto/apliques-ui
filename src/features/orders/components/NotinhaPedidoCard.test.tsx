import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { NotinhaPedidoCard } from './NotinhaPedidoCard'
import { Order } from '../order.types'

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
      design: { id: 'd1', name: 'Logo X' },
    },
    {
      materialID: 'm2', colorID: 'c2', designID: 'd2',
      unitPrice: 50, quantity: 500,
      material: { id: 'm2', name: 'Silicone' },
      color: { id: 'c2', name: 'Azul' },
      design: { id: 'd2', name: 'Coração' },
    },
  ],
}

describe('NotinhaPedidoCard (AC-01 / AC-02)', () => {
  it('GWT-01: renderiza itens com subtotais e o total do pedido', () => {
    render(<NotinhaPedidoCard ref={createRef()} order={ORDER} tenantName="Romero Borrachado" />)
    expect(screen.getByText(/Couro PU · Verde/)).toBeInTheDocument()
    expect(screen.getByText(/Silicone · Azul/)).toBeInTheDocument()
    expect(screen.getByText('R$ 350,00')).toBeInTheDocument()
    expect(screen.getByText('R$ 250,00')).toBeInTheDocument()
    expect(screen.getByText('R$ 600,00')).toBeInTheDocument()
  })

  it('GWT-02 / AC-02: não mostra nenhuma informação de pagamento/saldo', () => {
    render(<NotinhaPedidoCard ref={createRef()} order={ORDER} tenantName="Romero Borrachado" />)
    const text = document.body.textContent ?? ''
    expect(text).not.toMatch(/pago/i)
    expect(text).not.toMatch(/saldo/i)
    expect(text).not.toMatch(/em aberto/i)
  })

  it('não mostra a etapa de produção', () => {
    render(<NotinhaPedidoCard ref={createRef()} order={ORDER} tenantName="Romero Borrachado" />)
    expect(screen.queryByText(/em produção/i)).not.toBeInTheDocument()
  })

  it('não mostra o rodapé "Gerado em" (polish 2026-07-19)', () => {
    render(<NotinhaPedidoCard ref={createRef()} order={ORDER} tenantName="Romero Borrachado" />)
    expect(screen.queryByText(/Gerado em/i)).not.toBeInTheDocument()
  })

  it('GWT-01.1: renderiza normalmente com 1 item só', () => {
    const orderComUmItem = { ...ORDER, items: [ORDER.items[0]], totalPrice: 35000 }
    render(<NotinhaPedidoCard ref={createRef()} order={orderComUmItem} tenantName="Romero Borrachado" />)
    expect(screen.getByText(/Couro PU · Verde/)).toBeInTheDocument()
    expect(screen.queryByText(/Silicone/)).not.toBeInTheDocument()
  })
})
