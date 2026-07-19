import { Customer, Order, Payment } from './customer.types'

type PeriodPreset = '7' | '15' | '30' | '90' | '180' | '365' | 'inicio'

const PRESET_LABELS: Record<PeriodPreset, string> = {
  '7':      'Última semana',
  '15':     'Últimos 15 dias',
  '30':     'Últimos 30 dias',
  '90':     'Últimos 90 dias',
  '180':    'Últimos 6 meses',
  '365':    'Último ano',
  'inicio': 'Desde o início (todo o tempo)',
}

const PRESET_ORDER: PeriodPreset[] = ['7', '15', '30', '90', '180', '365', 'inicio']

interface ExtratoData {
  saldoAnterior: number
  pedidosDoPeriodo: Order[]
  pagamentosDoPeriodo: Payment[]
  totalPedidosPeriodo: number
  totalPagamentosPeriodo: number
  saldoAtual: number
}

// Extrai só a data (sem timezone) de um ISO string, evitando o deslocamento
// de "new Date('2026-05-20T00:00:00.000Z')" virar 19/05 em fusos negativos.
const dateOnly = (isoDateString: string): Date => {
  const [year, month, day] = isoDateString.split('T')[0].split('-').map(Number)
  return new Date(year, month - 1, day)
}

const presetToCutoffDate = (preset: PeriodPreset, today: Date): Date | null => {
  if (preset === 'inicio') return null
  const cutoff = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  cutoff.setDate(cutoff.getDate() - Number(preset))
  return cutoff
}

const sortAsc = <T,>(items: T[], getDate: (item: T) => string): T[] =>
  [...items].sort((a, b) => dateOnly(getDate(a)).getTime() - dateOnly(getDate(b)).getTime())

const isBeforeCutoff = (dateString: string, cutoff: Date) => dateOnly(dateString).getTime() < cutoff.getTime()
const isAtOrAfterCutoff = (dateString: string, cutoff: Date) => dateOnly(dateString).getTime() >= cutoff.getTime()

// D9/D10: função pura, client-side, sem I/O. saldoAnterior/saldoAtual usam
// max(0, ...) só na exposição final — a soma intermediária (rawSaldoAnterior)
// tem que ficar sem clamp, senão a invariante abaixo quebra quando o saldo
// "antes do corte" é negativo mas o saldo total real (histórico completo) é
// positivo (ver test plan L-02).
//
// Invariante (AC-13): saldoAtual === customer.balance para qualquer cutoff,
// incluindo null — repartir a mesma soma em duas partes nunca muda o total.
const computeExtratoData = (customer: Customer, cutoff: Date | null): ExtratoData => {
  const orders = customer.orders ?? []
  const payments = customer.payments ?? []

  const ordersAntes = cutoff ? orders.filter(o => isBeforeCutoff(o.orderDate, cutoff)) : []
  const paymentsAntes = cutoff ? payments.filter(p => isBeforeCutoff(p.date, cutoff)) : []
  const ordersDoPeriodo = cutoff ? orders.filter(o => isAtOrAfterCutoff(o.orderDate, cutoff)) : orders
  const paymentsDoPeriodo = cutoff ? payments.filter(p => isAtOrAfterCutoff(p.date, cutoff)) : payments

  const totalOrdersAntes = ordersAntes.reduce((sum, o) => sum + o.totalPrice, 0)
  const totalPaymentsAntes = paymentsAntes.reduce((sum, p) => sum + p.amount, 0)
  const rawSaldoAnterior = totalOrdersAntes - totalPaymentsAntes
  const saldoAnterior = Math.max(0, rawSaldoAnterior)

  const pedidosDoPeriodo = sortAsc(ordersDoPeriodo, o => o.orderDate)
  const pagamentosDoPeriodo = sortAsc(paymentsDoPeriodo, p => p.date)

  const totalPedidosPeriodo = pedidosDoPeriodo.reduce((sum, o) => sum + o.totalPrice, 0)
  const totalPagamentosPeriodo = pagamentosDoPeriodo.reduce((sum, p) => sum + p.amount, 0)

  const saldoAtual = Math.max(0, rawSaldoAnterior + totalPedidosPeriodo - totalPagamentosPeriodo)

  return { saldoAnterior, pedidosDoPeriodo, pagamentosDoPeriodo, totalPedidosPeriodo, totalPagamentosPeriodo, saldoAtual }
}

export { computeExtratoData, presetToCutoffDate, PRESET_LABELS, PRESET_ORDER }
export type { PeriodPreset, ExtratoData }
