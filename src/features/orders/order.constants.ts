import { ProductionStatus } from './order.types'

export const PRODUCTION_STATUS_LABEL: Record<ProductionStatus, string> = {
  'em-producao': 'Em produção',
  'pronto':      'Pronto',
  'entregue':    'Entregue',
}
