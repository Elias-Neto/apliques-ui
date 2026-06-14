import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ProductionStatus } from "../order.types"

interface OrderFiltersState {
  productionStatus?: ProductionStatus
  customerID?: string
  dateFrom?: string
  dateTo?: string
}

interface OrderFiltersProps {
  onFilter: (f: OrderFiltersState) => void
}

const STATUS_LABELS: Record<ProductionStatus, string> = {
  'em-producao': 'Em produção',
  'pronto': 'Pronto',
  'entregue': 'Entregue',
}

export function OrderFilters({ onFilter }: OrderFiltersProps) {
  const [status, setStatus] = useState<ProductionStatus | 'all'>('all')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const apply = () => {
    onFilter({
      productionStatus: status === 'all' ? undefined : status,
      dateFrom: from || undefined,
      dateTo:   to   || undefined,
    })
  }

  const clear = () => {
    setStatus('all')
    setFrom('')
    setTo('')
    onFilter({})
  }

  return (
    <div className="flex flex-wrap gap-3 items-end p-4 rounded-lg border bg-muted/30">
      <div className="space-y-1 min-w-[160px]">
        <Label className="text-xs">Etapa</Label>
        <Select value={status} onValueChange={v => setStatus(v as ProductionStatus | 'all')}>
          <SelectTrigger>
            <SelectValue placeholder="Todas as etapas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as etapas</SelectItem>
            {(Object.keys(STATUS_LABELS) as ProductionStatus[]).map(s => (
              <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Data de</Label>
        <Input type="date" value={from} onChange={e => setFrom(e.target.value)} className="w-36" />
      </div>

      <div className="space-y-1">
        <Label className="text-xs">até</Label>
        <Input type="date" value={to} onChange={e => setTo(e.target.value)} className="w-36" />
      </div>

      <div className="flex gap-2">
        <Button size="sm" onClick={apply}>Filtrar</Button>
        <Button size="sm" variant="ghost" onClick={clear}>Limpar</Button>
      </div>
    </div>
  )
}
