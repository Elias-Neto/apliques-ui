import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { ExtratoClienteCard } from './ExtratoClienteCard'
import { Customer, Order, Payment } from '../customer.types'

const order = (id: string, orderDate: string, totalPrice: number): Order => ({
  _id: id,
  orderDate,
  items: [
    { materialID: 'm1', colorID: 'c1', designID: 'd1', unitPrice: 35, quantity: 1000 },
  ],
  totalPrice,
  productionStatus: 'em-producao',
})

const payment = (id: string, date: string, amount: number): Payment => ({ id, amount, date })

// Mesma fixture do test plan (docs/romero-emborrachados/qa/test-plans/02-notinha.md §2)
const CUSTOMER: Customer = {
  id: 'cliente-1',
  name: 'João Silva',
  totalOrdered: 260000,
  totalPaid: 90000,
  balance: 170000,
  orders: [
    order('o1', '2026-01-01T00:00:00.000Z', 120000),
    order('o2', '2026-05-20T00:00:00.000Z', 80000),
    order('o3', '2026-06-15T00:00:00.000Z', 60000),
  ],
  payments: [
    payment('p1', '2026-06-10T00:00:00.000Z', 50000),
    payment('p2', '2026-07-01T00:00:00.000Z', 40000),
  ],
}

const cutoff = (isoDateOnly: string): Date => {
  const [y, m, d] = isoDateOnly.split('-').map(Number)
  return new Date(y, m - 1, d)
}

describe('ExtratoClienteCard', () => {
  it('GWT-05 / AC-05: pedidos do período mostram só data + total, sem item-level', () => {
    render(<ExtratoClienteCard ref={createRef()} customer={CUSTOMER} cutoff={cutoff('2026-05-20')} tenantName="Romero Borrachado" />)
    expect(screen.getByText('20/05/2026')).toBeInTheDocument()
    expect(screen.getByText('15/06/2026')).toBeInTheDocument()
    expect(screen.queryByText(/materialID|1000 un|Couro/i)).not.toBeInTheDocument()
  })

  it('GWT-06 / AC-06: pagamentos aparecem (data + valor), sem total ao lado do título', () => {
    render(<ExtratoClienteCard ref={createRef()} customer={CUSTOMER} cutoff={cutoff('2026-05-20')} tenantName="Romero Borrachado" />)
    expect(screen.getByText('10/06/2026')).toBeInTheDocument()
    expect(screen.getByText('01/07/2026')).toBeInTheDocument()
    expect(screen.getByText('Pagamentos do período')).toBeInTheDocument()
  })

  it('GWT-04 / GWT-07: saldo anterior, pedidos e saldo atual batem com o exemplo do PRD', () => {
    render(<ExtratoClienteCard ref={createRef()} customer={CUSTOMER} cutoff={cutoff('2026-05-20')} tenantName="Romero Borrachado" />)
    expect(screen.getByText('R$ 1.200,00')).toBeInTheDocument() // saldo anterior
    expect(screen.getByText('R$ 1.700,00')).toBeInTheDocument() // saldo devedor atual
  })

  it('GWT-07.1: ordem de DOM — saldo anterior → pedidos → pagamentos → saldo atual (por último)', () => {
    render(<ExtratoClienteCard ref={createRef()} customer={CUSTOMER} cutoff={cutoff('2026-05-20')} tenantName="Romero Borrachado" />)
    const text = document.body.textContent ?? ''
    const iAnterior = text.indexOf('Saldo anterior')
    const iPedidos = text.indexOf('Pedidos do período')
    const iPagamentos = text.indexOf('Pagamentos do período')
    const iAtual = text.indexOf('Saldo devedor atual')
    expect(iAnterior).toBeGreaterThan(-1)
    expect(iPedidos).toBeGreaterThan(iAnterior)
    expect(iPagamentos).toBeGreaterThan(iPedidos)
    expect(iAtual).toBeGreaterThan(iPagamentos)
  })

  it('AC-08: nenhum badge de etapa de produção aparece', () => {
    render(<ExtratoClienteCard ref={createRef()} customer={CUSTOMER} cutoff={cutoff('2026-05-20')} tenantName="Romero Borrachado" />)
    expect(screen.queryByText(/em produção|pronto|entregue/i)).not.toBeInTheDocument()
  })

  it('GWT-09 (edge): sem atividade no período mostra estado vazio nas 2 tabelas', () => {
    render(<ExtratoClienteCard ref={createRef()} customer={CUSTOMER} cutoff={cutoff('2030-01-01')} tenantName="Romero Borrachado" />)
    expect(screen.getByText('Nenhum pedido no período.')).toBeInTheDocument()
    expect(screen.getByText('Nenhum pagamento no período.')).toBeInTheDocument()
  })

  it('GWT-10 (edge): preset "desde o início" mostra saldo anterior R$ 0,00 e período textual', () => {
    render(<ExtratoClienteCard ref={createRef()} customer={CUSTOMER} cutoff={null} tenantName="Romero Borrachado" />)
    expect(screen.getByText('Período: desde o início')).toBeInTheDocument()
    expect(screen.getByText('R$ 0,00')).toBeInTheDocument()
  })
})
