import { describe, it, expect } from 'vitest'
import { computeExtratoData, presetToCutoffDate, PRESET_ORDER } from './extrato.utils'
import { Customer, Order, Payment } from './customer.types'

const order = (id: string, orderDate: string, totalPrice: number): Order => ({
  _id: id,
  orderDate,
  items: [],
  totalPrice,
  productionStatus: 'em-producao',
})

const payment = (id: string, date: string, amount: number): Payment => ({
  id,
  amount,
  date,
})

// Mesma fixture do test plan (docs/romero-emborrachados/qa/test-plans/02-notinha.md §2):
// saldoAnterior R$1.200 + pedidos R$1.400 - pagamentos R$900 = saldoAtual R$1.700
const CUSTOMER: Customer = {
  id: 'cliente-extrato-teste',
  name: 'Cliente Extrato Teste',
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

describe('computeExtratoData — invariante (D10 / AC-13 / GWT-04)', () => {
  it('GWT-04: reconstrói o exemplo do PRD (corte em 2026-05-20)', () => {
    const data = computeExtratoData(CUSTOMER, cutoff('2026-05-20'))
    expect(data.saldoAnterior).toBe(120000)
    expect(data.totalPedidosPeriodo).toBe(140000)
    expect(data.totalPagamentosPeriodo).toBe(90000)
    expect(data.saldoAtual).toBe(170000)
    expect(data.saldoAtual).toBe(CUSTOMER.balance)
  })

  it('GWT-04.1: pedido exatamente no dia do corte cai no período, não no anterior', () => {
    const data = computeExtratoData(CUSTOMER, cutoff('2026-05-20'))
    expect(data.pedidosDoPeriodo.map(o => o._id)).toContain('o2')
    expect(data.saldoAnterior).toBe(120000) // só o1 (01/01), não o2
  })

  it('GWT-04.2: pagamento exatamente no dia do corte cai no período', () => {
    const data = computeExtratoData(CUSTOMER, cutoff('2026-06-10'))
    expect(data.pagamentosDoPeriodo.map(p => p.id)).toContain('p1')
  })

  it('GWT-04.3: corte antes de tudo → saldoAnterior 0, saldoAtual = balance', () => {
    const data = computeExtratoData(CUSTOMER, cutoff('2020-01-01'))
    expect(data.saldoAnterior).toBe(0)
    expect(data.pedidosDoPeriodo).toHaveLength(3)
    expect(data.pagamentosDoPeriodo).toHaveLength(2)
    expect(data.saldoAtual).toBe(CUSTOMER.balance)
  })

  it('GWT-04.4: corte depois de tudo → saldoAnterior = balance, período vazio', () => {
    const data = computeExtratoData(CUSTOMER, cutoff('2030-01-01'))
    expect(data.saldoAnterior).toBe(CUSTOMER.balance)
    expect(data.pedidosDoPeriodo).toHaveLength(0)
    expect(data.pagamentosDoPeriodo).toHaveLength(0)
    expect(data.saldoAtual).toBe(data.saldoAnterior)
  })

  it('GWT-04.5 / preset "Desde o início": saldoAnterior sempre 0, período = histórico inteiro', () => {
    const data = computeExtratoData(CUSTOMER, null)
    expect(data.saldoAnterior).toBe(0)
    expect(data.pedidosDoPeriodo).toHaveLength(3)
    expect(data.pagamentosDoPeriodo).toHaveLength(2)
    expect(data.saldoAtual).toBe(CUSTOMER.balance)
  })

  it('GWT-04.5: invariante vale pros 7 presets — saldoAtual sempre reconstrói customer.balance', () => {
    const today = new Date(2026, 6, 18) // 18/07/2026, mesma data usada no PRD/wireframe
    for (const preset of PRESET_ORDER) {
      const data = computeExtratoData(CUSTOMER, presetToCutoffDate(preset, today))
      expect(data.saldoAtual).toBe(CUSTOMER.balance)
    }
  })

  it('EC-D4/L-02: saldo negativo intermediário (pagamento antes do corte > pedidos antes do corte) ainda bate com o balance real', () => {
    const customerComAdiantamento: Customer = {
      ...CUSTOMER,
      totalOrdered: 300000,
      totalPaid: 200000,
      balance: 100000, // max(0, 300000 - 200000)
      orders: [order('o1', '2026-06-01T00:00:00.000Z', 300000)],
      payments: [payment('p1', '2026-01-01T00:00:00.000Z', 200000)], // adiantamento, antes do corte
    }
    const data = computeExtratoData(customerComAdiantamento, cutoff('2026-05-01'))
    // rawSaldoAnterior = 0 (pedidos) - 200000 (pagamento) = -200000 → clampado pra exibição
    expect(data.saldoAnterior).toBe(0)
    // saldoAtual NÃO pode ser max(0, 0 + 300000) = 300000 (ignoraria o adiantamento) —
    // tem que usar o raw (-200000) internamente: max(0, -200000 + 300000) = 100000
    expect(data.saldoAtual).toBe(100000)
    expect(data.saldoAtual).toBe(customerComAdiantamento.balance)
  })

  it('cliente sem pedidos/pagamentos: tudo zero', () => {
    const vazio: Customer = { id: 'x', name: 'Vazio', balance: 0, orders: [], payments: [] }
    const data = computeExtratoData(vazio, cutoff('2026-01-01'))
    expect(data.saldoAnterior).toBe(0)
    expect(data.saldoAtual).toBe(0)
    expect(data.pedidosDoPeriodo).toHaveLength(0)
    expect(data.pagamentosDoPeriodo).toHaveLength(0)
  })

  it('GWT-05.1/06.1: reordena pedidos e pagamentos do período em ordem crescente', () => {
    const data = computeExtratoData(CUSTOMER, cutoff('2020-01-01'))
    expect(data.pedidosDoPeriodo.map(o => o._id)).toEqual(['o1', 'o2', 'o3'])
    expect(data.pagamentosDoPeriodo.map(p => p.id)).toEqual(['p1', 'p2'])
  })
})

describe('presetToCutoffDate', () => {
  const today = new Date(2026, 6, 18) // 18/07/2026

  it('"inicio" retorna null (sentinela)', () => {
    expect(presetToCutoffDate('inicio', today)).toBeNull()
  })

  it.each([
    ['7', 11],
    ['15', 3],
    ['30', 18],
    ['90', 19],
    ['180', 19],
    ['365', 18],
  ] as const)('preset %s subtrai o número certo de dias', (preset, expectedDay) => {
    const result = presetToCutoffDate(preset, today)
    expect(result).not.toBeNull()
    expect(result!.getDate()).toBe(expectedDay)
  })
})
