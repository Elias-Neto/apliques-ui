import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFetchCustomers } from "@/features/customers/hooks/use-fetch-customers"
import { useFetchMaterials } from "@/features/catalog/hooks/use-materials"
import { useFetchColors } from "@/features/catalog/hooks/use-colors"
import { ProductionStatus } from "../order.types"
import { PRODUCTION_STATUS_LABEL } from "../order.constants"

interface OrderFiltersState {
  productionStatus?: ProductionStatus
  customerID?: string
  materialID?: string
  colorID?: string
  search?: string
  quantityMin?: number
  quantityMax?: number
  totalPriceMin?: number
  totalPriceMax?: number
  dateFrom?: string
  dateTo?: string
}

interface OrderFiltersProps {
  onFilter: (f: OrderFiltersState) => void
}

// Range de Unidades é número puro (não moeda) — sem conversão pra centavos, só parseInt.
// Range de Valor é R$ → centavos, mesma semântica "vazio = sem filtro" (não 0) do
// FinanceFilters.tsx::toCents — reusar order-item.utils.ts::toCents não serve aqui,
// aquele retorna 0 pra vazio (ok pra form de item, errado pra filtro de range).
const toUnits = (value: string): number | undefined => {
  if (!value) return undefined
  const parsed = parseInt(value, 10)
  return Number.isNaN(parsed) ? undefined : parsed
}

const toCents = (value: string): number | undefined => {
  if (!value) return undefined
  const cents = Math.round(parseFloat(value.replace(',', '.')) * 100)
  return Number.isNaN(cents) ? undefined : cents
}

export function OrderFilters({ onFilter }: OrderFiltersProps) {
  const [status, setStatus] = useState<ProductionStatus | 'all'>('all')
  const [customerID, setCustomerID] = useState('all')
  const [materialID, setMaterialID] = useState('all')
  const [colorID, setColorID] = useState('all')
  const [search, setSearch] = useState('')
  const [quantityMin, setQuantityMin] = useState('')
  const [quantityMax, setQuantityMax] = useState('')
  const [totalPriceMin, setTotalPriceMin] = useState('')
  const [totalPriceMax, setTotalPriceMax] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const { data: customersData } = useFetchCustomers()
  const { data: materials = [] } = useFetchMaterials()
  const { data: colors = [] } = useFetchColors()
  const customers = customersData?.items ?? []

  // Auto-apply (AC-06n): cada mudança de campo já dispara a busca — sem botão "Filtrar".
  const emit = (next: {
    status: ProductionStatus | 'all'
    customerID: string
    materialID: string
    colorID: string
    search: string
    quantityMin: string
    quantityMax: string
    totalPriceMin: string
    totalPriceMax: string
    from: string
    to: string
  }) => {
    onFilter({
      productionStatus: next.status === 'all' ? undefined : next.status,
      customerID: next.customerID === 'all' ? undefined : next.customerID,
      materialID: next.materialID === 'all' ? undefined : next.materialID,
      colorID: next.colorID === 'all' ? undefined : next.colorID,
      search: next.search.trim() || undefined,
      quantityMin: toUnits(next.quantityMin),
      quantityMax: toUnits(next.quantityMax),
      totalPriceMin: toCents(next.totalPriceMin),
      totalPriceMax: toCents(next.totalPriceMax),
      dateFrom: next.from || undefined,
      dateTo: next.to || undefined,
    })
  }

  const current = () => ({
    status, customerID, materialID, colorID, search,
    quantityMin, quantityMax, totalPriceMin, totalPriceMax, from, to,
  })

  const handleStatus = (v: ProductionStatus | 'all') => {
    setStatus(v)
    emit({ ...current(), status: v })
  }

  const handleCustomer = (v: string) => {
    setCustomerID(v)
    emit({ ...current(), customerID: v })
  }

  const handleMaterial = (v: string) => {
    setMaterialID(v)
    emit({ ...current(), materialID: v })
  }

  const handleColor = (v: string) => {
    setColorID(v)
    emit({ ...current(), colorID: v })
  }

  const handleSearch = (v: string) => {
    setSearch(v)
    emit({ ...current(), search: v })
  }

  const handleQuantityMin = (v: string) => {
    setQuantityMin(v)
    emit({ ...current(), quantityMin: v })
  }

  const handleQuantityMax = (v: string) => {
    setQuantityMax(v)
    emit({ ...current(), quantityMax: v })
  }

  const handleTotalPriceMin = (v: string) => {
    setTotalPriceMin(v)
    emit({ ...current(), totalPriceMin: v })
  }

  const handleTotalPriceMax = (v: string) => {
    setTotalPriceMax(v)
    emit({ ...current(), totalPriceMax: v })
  }

  const handleFrom = (v: string) => {
    setFrom(v)
    emit({ ...current(), from: v })
  }

  const handleTo = (v: string) => {
    setTo(v)
    emit({ ...current(), to: v })
  }

  const clear = () => {
    setStatus('all')
    setCustomerID('all')
    setMaterialID('all')
    setColorID('all')
    setSearch('')
    setQuantityMin('')
    setQuantityMax('')
    setTotalPriceMin('')
    setTotalPriceMax('')
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

      <div className="space-y-1 min-w-[160px]">
        <Label className="text-xs">Cor</Label>
        <Select value={colorID} onValueChange={handleColor}>
          <SelectTrigger>
            <SelectValue placeholder="Todas as cores" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as cores</SelectItem>
            {colors.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1 min-w-[200px] flex-1">
        <Label htmlFor="order-filter-search" className="text-xs">Buscar</Label>
        <Input
          id="order-filter-search"
          placeholder="Cliente, cor ou material"
          value={search}
          onChange={e => handleSearch(e.target.value)}
        />
      </div>

      <div className="space-y-1 w-full md:w-auto">
        <Label htmlFor="order-filter-qty-min" className="text-xs">Unidades de</Label>
        <Input
          id="order-filter-qty-min"
          type="number" step="1" min={0} placeholder="0"
          value={quantityMin}
          onChange={e => handleQuantityMin(e.target.value)}
          className="w-full md:w-28"
        />
      </div>

      <div className="space-y-1 w-full md:w-auto">
        <Label htmlFor="order-filter-qty-max" className="text-xs">até</Label>
        <Input
          id="order-filter-qty-max"
          type="number" step="1" min={0} placeholder="0"
          value={quantityMax}
          onChange={e => handleQuantityMax(e.target.value)}
          className="w-full md:w-28"
        />
      </div>

      <div className="space-y-1 w-full md:w-auto">
        <Label htmlFor="order-filter-price-min" className="text-xs">Valor de (R$)</Label>
        <Input
          id="order-filter-price-min"
          type="number" step="0.01" min={0} placeholder="0,00"
          value={totalPriceMin}
          onChange={e => handleTotalPriceMin(e.target.value)}
          className="w-full md:w-32"
        />
      </div>

      <div className="space-y-1 w-full md:w-auto">
        <Label htmlFor="order-filter-price-max" className="text-xs">até</Label>
        <Input
          id="order-filter-price-max"
          type="number" step="0.01" min={0} placeholder="0,00"
          value={totalPriceMax}
          onChange={e => handleTotalPriceMax(e.target.value)}
          className="w-full md:w-32"
        />
      </div>

      <div className="space-y-1 w-full md:w-auto">
        <Label className="text-xs">Data de</Label>
        <Input type="date" value={from} onChange={e => handleFrom(e.target.value)} className="w-full md:w-36" />
      </div>

      <div className="space-y-1 w-full md:w-auto">
        <Label className="text-xs">até</Label>
        <Input type="date" value={to} onChange={e => handleTo(e.target.value)} className="w-full md:w-36" />
      </div>

      <div className="w-full md:w-auto">
        <Button size="sm" variant="ghost" onClick={clear} className="w-full md:w-auto">Limpar</Button>
      </div>
    </div>
  )
}
