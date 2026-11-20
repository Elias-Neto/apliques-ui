import { ReactNode, useState } from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface FilterChip {
  key: string
  label: string
  onRemove: () => void
}

interface FilterLayoutProps {
  /** Campo de busca — fica sempre visível, fora da gaveta. */
  search?: ReactNode
  /** Filtros ativos (exceto a busca) — viram chips removíveis + contador no funil. */
  chips: FilterChip[]
  onClear: () => void
  /** Campos de filtro — ficam dentro da gaveta (grid de 2 colunas), em qualquer tamanho de tela. */
  children: ReactNode
}

export function FilterLayout({ search, chips, onClear, children }: FilterLayoutProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0 md:max-w-md">{search}</div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="relative shrink-0"
          aria-label={chips.length > 0 ? `Filtros (${chips.length} ativos)` : "Filtros"}
          onClick={() => setOpen(true)}
        >
          <Filter className="h-4 w-4" />
          {chips.length > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground">
              {chips.length}
            </span>
          )}
        </Button>
      </div>

      {chips.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {chips.map(chip => (
            <button
              key={chip.key}
              type="button"
              onClick={chip.onRemove}
              aria-label={`Remover filtro ${chip.label}`}
              className="inline-flex shrink-0 items-center gap-1 rounded-full border bg-background px-3 py-1 text-xs"
            >
              {chip.label}
              <X className="h-3 w-3" />
            </button>
          ))}
        </div>
      )}

      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content
            aria-describedby={undefined}
            className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-2xl md:left-1/2 md:right-auto md:w-full md:max-w-lg md:-translate-x-1/2 border bg-background shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom"
          >
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <DialogPrimitive.Title className="text-lg font-semibold">Filtros</DialogPrimitive.Title>
              <DialogPrimitive.Close className="rounded-sm p-1 opacity-70 hover:opacity-100" aria-label="Fechar">
                <X className="h-4 w-4" />
              </DialogPrimitive.Close>
            </div>

            <div className="grid grid-cols-2 gap-3 overflow-y-auto px-4 py-2">{children}</div>

            <div className="flex gap-2 border-t px-4 py-3">
              <Button type="button" variant="ghost" className="flex-1" onClick={onClear}>Limpar</Button>
              <Button type="button" className="flex-1" onClick={() => setOpen(false)}>Ver resultados</Button>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  )
}
