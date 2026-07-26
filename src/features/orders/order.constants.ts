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

// Destaque do chip selecionado no detalhe do pedido (D24/D28) — mesma família de cor do mapa acima,
// reforçada explicitamente pro estado "on" (o Toggle base do shadcn aplica data-[state=on]:bg-accent
// incondicionalmente, que tem mais especificidade que uma classe solta — sem essa reforço, todo chip
// selecionado herdava a cor de "sucesso" do tema em vez da cor semântica da própria etapa).
// Classes completas (com o modificador data-[state=on]:) para o Tailwind conseguir escanear estaticamente —
// concatenar o modificador em runtime (ex. via template literal) faz o JIT não gerar o CSS.
export const PRODUCTION_STATUS_ACTIVE_CLASSES: Record<ProductionStatus, string> = {
  'a-fazer':     'data-[state=on]:border-slate-400 data-[state=on]:bg-slate-100 data-[state=on]:text-slate-700',
  'em-producao': 'data-[state=on]:border-amber-400 data-[state=on]:bg-amber-100 data-[state=on]:text-amber-800',
  'pronto':      'data-[state=on]:border-blue-400 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-800',
  'entregue':    'data-[state=on]:border-green-400 data-[state=on]:bg-green-100 data-[state=on]:text-green-800',
}
