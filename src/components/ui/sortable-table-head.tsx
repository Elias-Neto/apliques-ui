import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import { TableHead } from "@/components/ui/table"

export interface SortableTableHeadState<TField extends string> {
  field: TField
  dir: "asc" | "desc"
}

interface SortableTableHeadProps<TField extends string> {
  label: string
  sortKey: TField
  sort: SortableTableHeadState<TField> | null
  onToggle: (key: TField) => void
}

// Extraído de OrdersList.tsx (Produção) — 3º uso (Financeiro, Catálogo), cruza a
// regra dos 3 usos (tech-design catalogo-busca-sort-server-side.md §Frontend).
export function SortableTableHead<TField extends string>({
  label,
  sortKey,
  sort,
  onToggle,
}: SortableTableHeadProps<TField>) {
  const active = sort?.field === sortKey
  const Icon = active && sort ? (sort.dir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown
  return (
    <TableHead>
      <button
        type="button"
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => onToggle(sortKey)}
      >
        {label}
        <Icon className={`w-3.5 h-3.5 ${active ? "" : "text-muted-foreground/50"}`} />
      </button>
    </TableHead>
  )
}
