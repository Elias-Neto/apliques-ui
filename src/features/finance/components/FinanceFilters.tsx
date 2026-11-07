import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FinanceFilters as FinanceFiltersState } from "../finance.service"

interface FinanceFiltersProps {
  onFilter: (f: FinanceFiltersState) => void
}

// Mesma conversão de order-item.utils.ts::toCents, duplicada aqui (escopo local a este
// filtro, 1 linha — não justifica dependência cross-feature em orders/).
const toCents = (value: string): number | undefined => {
  if (!value) return undefined
  const cents = Math.round(parseFloat(value.replace(',', '.')) * 100)
  return Number.isNaN(cents) ? undefined : cents
}

export function FinanceFilters({ onFilter }: FinanceFiltersProps) {
  const [search, setSearch] = useState('')
  const [orderedMin, setOrderedMin] = useState('')
  const [orderedMax, setOrderedMax] = useState('')
  const [balanceMin, setBalanceMin] = useState('')
  const [balanceMax, setBalanceMax] = useState('')

  // Auto-apply, sem botão "Filtrar" — mesmo padrão de OrderFilters (AC-06n do PRD-01).
  const emit = (next: {
    search: string
    orderedMin: string
    orderedMax: string
    balanceMin: string
    balanceMax: string
  }) => {
    onFilter({
      search: next.search || undefined,
      orderedMin: toCents(next.orderedMin),
      orderedMax: toCents(next.orderedMax),
      balanceMin: toCents(next.balanceMin),
      balanceMax: toCents(next.balanceMax),
    })
  }

  const handleSearch = (v: string) => {
    setSearch(v)
    emit({ search: v, orderedMin, orderedMax, balanceMin, balanceMax })
  }

  const handleOrderedMin = (v: string) => {
    setOrderedMin(v)
    emit({ search, orderedMin: v, orderedMax, balanceMin, balanceMax })
  }

  const handleOrderedMax = (v: string) => {
    setOrderedMax(v)
    emit({ search, orderedMin, orderedMax: v, balanceMin, balanceMax })
  }

  const handleBalanceMin = (v: string) => {
    setBalanceMin(v)
    emit({ search, orderedMin, orderedMax, balanceMin: v, balanceMax })
  }

  const handleBalanceMax = (v: string) => {
    setBalanceMax(v)
    emit({ search, orderedMin, orderedMax, balanceMin, balanceMax: v })
  }

  const clear = () => {
    setSearch('')
    setOrderedMin('')
    setOrderedMax('')
    setBalanceMin('')
    setBalanceMax('')
    onFilter({})
  }

  return (
    <div className="flex flex-wrap gap-3 items-end p-4 rounded-lg border bg-muted/30">
      <div className="space-y-1 min-w-[200px] flex-1">
        <Label htmlFor="finance-filter-search" className="text-xs">Cliente</Label>
        <Input
          id="finance-filter-search"
          placeholder="Buscar por nome..."
          value={search}
          onChange={e => handleSearch(e.target.value)}
        />
      </div>

      <div className="space-y-1 w-full md:w-auto">
        <Label htmlFor="finance-filter-ordered-min" className="text-xs">Pedidos de (R$)</Label>
        <Input
          id="finance-filter-ordered-min"
          type="number" step="0.01" min={0} placeholder="0,00"
          value={orderedMin}
          onChange={e => handleOrderedMin(e.target.value)}
          className="w-full md:w-32"
        />
      </div>

      <div className="space-y-1 w-full md:w-auto">
        <Label htmlFor="finance-filter-ordered-max" className="text-xs">até</Label>
        <Input
          id="finance-filter-ordered-max"
          type="number" step="0.01" min={0} placeholder="0,00"
          value={orderedMax}
          onChange={e => handleOrderedMax(e.target.value)}
          className="w-full md:w-32"
        />
      </div>

      <div className="space-y-1 w-full md:w-auto">
        <Label htmlFor="finance-filter-balance-min" className="text-xs">Saldo de (R$)</Label>
        <Input
          id="finance-filter-balance-min"
          type="number" step="0.01" min={0} placeholder="0,00"
          value={balanceMin}
          onChange={e => handleBalanceMin(e.target.value)}
          className="w-full md:w-32"
        />
      </div>

      <div className="space-y-1 w-full md:w-auto">
        <Label htmlFor="finance-filter-balance-max" className="text-xs">até</Label>
        <Input
          id="finance-filter-balance-max"
          type="number" step="0.01" min={0} placeholder="0,00"
          value={balanceMax}
          onChange={e => handleBalanceMax(e.target.value)}
          className="w-full md:w-32"
        />
      </div>

      <div className="w-full md:w-auto">
        <Button size="sm" variant="ghost" onClick={clear} className="w-full md:w-auto">Limpar</Button>
      </div>
    </div>
  )
}
