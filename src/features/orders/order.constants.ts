import { ProductionStatus } from './order.types'

export const PRODUCTION_STATUS_LABEL: Record<ProductionStatus, string> = {
  'a-fazer':     'A fazer',
  'em-producao': 'Em produção',
  'pronto':      'Pronto',
  'entregue':    'Entregue',
}

// Fonte única de cor por etapa (D19/D22) — usada em tabela, card e detalhe do pedido
export const PRODUCTION_STATUS_BADGE_CLASSES: Record<ProductionStatus, string> = {
  'a-fazer':     'bg-slate-100 text-slate-700 border-transparent hover:bg-slate-100',
  'em-producao': 'bg-amber-100 text-amber-800 border-transparent hover:bg-amber-100',
  'pronto':      'bg-blue-100 text-blue-800 border-transparent hover:bg-blue-100',
  'entregue':    'bg-green-100 text-green-800 border-transparent hover:bg-green-100',
}
