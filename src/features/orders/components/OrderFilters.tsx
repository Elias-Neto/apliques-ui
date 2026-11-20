import { useState } from "react"
import { Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFetchCustomers } from "@/features/customers/hooks/use-fetch-customers"
import { useFetchMaterials } from "@/features/catalog/hooks/use-materials"
import { useFetchColors } from "@/features/catalog/hooks/use-colors"
import { FilterLayout, FilterChip } from "@/components/filters/FilterLayout"
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


  // Aplica vários campos de uma vez (chip de faixa limpa min+max juntos) com um único emit.
  const patchFilters = (p: Partial<ReturnType<typeof current>>) => {
    if (p.status !== undefined) setStatus(p.status)
    if (p.customerID !== undefined) setCustomerID(p.customerID)
    if (p.materialID !== undefined) setMaterialID(p.materialID)
    if (p.colorID !== undefined) setColorID(p.colorID)
    if (p.quantityMin !== undefined) setQuantityMin(p.quantityMin)
    if (p.quantityMax !== undefined) setQuantityMax(p.quantityMax)
    if (p.totalPriceMin !== undefined) setTotalPriceMin(p.totalPriceMin)
    if (p.totalPriceMax !== undefined) setTotalPriceMax(p.totalPriceMax)
    if (p.from !== undefined) setFrom(p.from)
    if (p.to !== undefined) setTo(p.to)
    emit({ ...current(), ...p })
  }

  const rangeLabel = (name: string, min: string, max: string) =>
    min && max ? `${name} ${min}–${max}` : min ? `${name} ≥ ${min}` : `${name} ≤ ${max}`

  const chips: FilterChip[] = []
  if (status !== 'all') chips.push({ key: 'status', label: PRODUCTION_STATUS_LABEL[status], onRemove: () => patchFilters({ status: 'all' }) })
  if (customerID !== 'all') chips.push({ key: 'customer', label: customers.find(c => c.id === customerID)?.name ?? 'Cliente', onRemove: () => patchFilters({ customerID: 'all' }) })
  if (materialID !== 'all') chips.push({ key: 'material', label: materials.find(m => m.id === materialID)?.name ?? 'Material', onRemove: () => patchFilters({ materialID: 'all' }) })
  if (colorID !== 'all') chips.push({ key: 'color', label: colors.find(c => c.id === colorID)?.name ?? 'Cor', onRemove: () => patchFilters({ colorID: 'all' }) })
  if (quantityMin || quantityMax) chips.push({ key: 'qty', label: rangeLabel('Unidades', quantityMin, quantityMax), onRemove: () => patchFilters({ quantityMin: '', quantityMax: '' }) })
  if (totalPriceMin || totalPriceMax) chips.push({ key: 'price', label: rangeLabel('Valor R$', totalPriceMin, totalPriceMax), onRemove: () => patchFilters({ totalPriceMin: '', totalPriceMax: '' }) })
  if (from || to) chips.push({ key: 'date', label: rangeLabel('Data', from, to), onRemove: () => patchFilters({ from: '', to: '' }) })

  const searchField = (
    <Input
      id="order-filter-search"
      aria-label="Buscar"
      placeholder="Procurar por cliente, cor ou material"
      value={search}
      onChange={e => handleSearch(e.target.value)}
      className="pl-9"
    />
  )

  return (
    <FilterLayout
      onClear={clear}
      chips={chips}
      search={
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          {searchField}
        </div>
      }
    >
      <div className="space-y-1 col-span-2 md:col-span-1 md:min-w-[160px]">
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

      <div className="space-y-1 col-span-2 md:col-span-1 md:min-w-[160px]">
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

      <div className="space-y-1 col-span-2 md:col-span-1 md:min-w-[160px]">
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

      <div className="space-y-1 col-span-2 md:col-span-1 md:min-w-[160px]">
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

      <div className="space-y-1 md:w-auto">
        <Label htmlFor="order-filter-qty-min" className="text-xs">Unidades de</Label>
        <Input
          id="order-filter-qty-min"
          type="number" step="1" min={0} placeholder="0"
          value={quantityMin}
          onChange={e => handleQuantityMin(e.target.value)}
          className="w-full md:w-28"
        />
      </div>

      <div className="space-y-1 md:w-auto">
        <Label htmlFor="order-filter-qty-max" className="text-xs">até</Label>
        <Input
          id="order-filter-qty-max"
          type="number" step="1" min={0} placeholder="0"
          value={quantityMax}
          onChange={e => handleQuantityMax(e.target.value)}
          className="w-full md:w-28"
        />
      </div>

      <div className="space-y-1 md:w-auto">
        <Label htmlFor="order-filter-price-min" className="text-xs">Valor de (R$)</Label>
        <Input
          id="order-filter-price-min"
          type="number" step="0.01" min={0} placeholder="0,00"
          value={totalPriceMin}
          onChange={e => handleTotalPriceMin(e.target.value)}
          className="w-full md:w-32"
        />
      </div>

      <div className="space-y-1 md:w-auto">
        <Label htmlFor="order-filter-price-max" className="text-xs">até</Label>
        <Input
          id="order-filter-price-max"
          type="number" step="0.01" min={0} placeholder="0,00"
          value={totalPriceMax}
          onChange={e => handleTotalPriceMax(e.target.value)}
          className="w-full md:w-32"
        />
      </div>

      <div className="space-y-1 md:w-auto">
        <Label className="text-xs">Data de</Label>
        <Input type="date" value={from} onChange={e => handleFrom(e.target.value)} className="w-full md:w-36" />
      </div>

      <div className="space-y-1 md:w-auto">
        <Label className="text-xs">até</Label>
        <Input type="date" value={to} onChange={e => handleTo(e.target.value)} className="w-full md:w-36" />
      </div>
    </FilterLayout>
  )
}
