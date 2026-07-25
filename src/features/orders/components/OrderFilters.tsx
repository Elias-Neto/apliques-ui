import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFetchCustomers } from "@/features/customers/hooks/use-fetch-customers"
import { useFetchMaterials } from "@/features/catalog/hooks/use-materials"
import { ProductionStatus } from "../order.types"
import { PRODUCTION_STATUS_LABEL } from "../order.constants"

interface OrderFiltersState {
  productionStatus?: ProductionStatus
  customerID?: string
  materialID?: string
  dateFrom?: string
  dateTo?: string
}

interface OrderFiltersProps {
  onFilter: (f: OrderFiltersState) => void
}

export function OrderFilters({ onFilter }: OrderFiltersProps) {
  const [status, setStatus] = useState<ProductionStatus | 'all'>('all')
  const [customerID, setCustomerID] = useState('all')
  const [materialID, setMaterialID] = useState('all')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const { data: customersData } = useFetchCustomers()
  const { data: materials = [] } = useFetchMaterials()
  const customers = customersData?.items ?? []

  // Auto-apply (AC-06n): cada mudança de campo já dispara a busca — sem botão "Filtrar".
  const emit = (next: {
    status: ProductionStatus | 'all'
    customerID: string
    materialID: string
    from: string
    to: string
  }) => {
    onFilter({
      productionStatus: next.status === 'all' ? undefined : next.status,
      customerID: next.customerID === 'all' ? undefined : next.customerID,
      materialID: next.materialID === 'all' ? undefined : next.materialID,
      dateFrom: next.from || undefined,
      dateTo: next.to || undefined,
    })
  }

  const handleStatus = (v: ProductionStatus | 'all') => {
    setStatus(v)
    emit({ status: v, customerID, materialID, from, to })
  }

  const handleCustomer = (v: string) => {
    setCustomerID(v)
    emit({ status, customerID: v, materialID, from, to })
  }

  const handleMaterial = (v: string) => {
    setMaterialID(v)
    emit({ status, customerID, materialID: v, from, to })
  }

  const handleFrom = (v: string) => {
    setFrom(v)
    emit({ status, customerID, materialID, from: v, to })
  }

  const handleTo = (v: string) => {
    setTo(v)
    emit({ status, customerID, materialID, from, to: v })
  }

  const clear = () => {
    setStatus('all')
    setCustomerID('all')
    setMaterialID('all')
    setFrom('')
    setTo('')
    onFilter({})
  }

  return (
    <div className="flex flex-wrap gap-3 items-end p-4 rounded-lg border bg-muted/30">
      <div className="space-y-1 min-w-[160px]">
        <Label className="text-xs">Etapa</Label>
        <Select value={status} onValueChange={v => handleStatus(v as ProductionStatus | 'all')}>
          <SelectTrigger>
            <SelectValue placeholder="Todas as etapas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as etapas</SelectItem>
            {(Object.keys(PRODUCTION_STATUS_LABEL) as ProductionStatus[]).map(s => (
              <SelectItem key={s} value={s}>{PRODUCTION_STATUS_LABEL[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1 min-w-[160px]">
        <Label className="text-xs">Cliente</Label>
        <Select value={customerID} onValueChange={handleCustomer}>
          <SelectTrigger>
            <SelectValue placeholder="Todos os clientes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os clientes</SelectItem>
            {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1 min-w-[160px]">
        <Label className="text-xs">Material</Label>
        <Select value={materialID} onValueChange={handleMaterial}>
          <SelectTrigger>
            <SelectValue placeholder="Todos os materiais" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os materiais</SelectItem>
            {materials.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Data de</Label>
        <Input type="date" value={from} onChange={e => handleFrom(e.target.value)} className="w-36" />
      </div>

      <div className="space-y-1">
        <Label className="text-xs">até</Label>
        <Input type="date" value={to} onChange={e => handleTo(e.target.value)} className="w-36" />
      </div>

      <Button size="sm" variant="ghost" onClick={clear}>Limpar</Button>
    </div>
  )
}
