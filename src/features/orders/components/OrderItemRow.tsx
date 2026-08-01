import { ChevronRight, ChevronUp, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Material } from "@/features/catalog/material.types"
import { Color } from "@/features/catalog/color.types"
import { Design } from "@/features/customers/design.types"
import { FormItem, subtotal, formatCurrency, toCents } from "./order-item.utils"

interface OrderItemRowProps {
  item: FormItem
  index: number
  materials: Material[]
  colors: Color[]
  designs: Design[]
  selectedCustomerID: string
  isExpanded: boolean
  onToggleExpand: (id: string) => void
  onUpdate: (id: string, patch: Partial<FormItem>) => void
  onMaterialChange: (id: string, materialId: string) => void
  onRemove: (id: string) => void
  canRemove: boolean
}

export function OrderItemRow({
  item, index, materials, colors, designs, selectedCustomerID,
  isExpanded, onToggleExpand, onUpdate, onMaterialChange, onRemove, canRemove,
}: OrderItemRowProps) {
  const materialName = materials.find(m => m.id === item.materialID)?.name
  const colorName = colors.find(c => c.id === item.colorID)?.name
  const designName = designs.find(d => d.id === item.designID)?.name
  const hasSummary = materialName && colorName && designName

  // sempre visível e sempre separada do toque de abrir/fechar — nunca reaproveita
  // um ícone que também poderia significar "fechar" (ver amenda rev. 11, §Escopo)
  const removeButton = (
    <Button
      type="button" size="icon" variant="ghost"
      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
      onClick={e => { e.stopPropagation(); onRemove(item.id) }}
      disabled={!canRemove}
    >
      <Trash2 className="h-3.5 w-3.5" />
    </Button>
  )

  if (!isExpanded) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => onToggleExpand(item.id)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onToggleExpand(item.id) }}
        className="flex items-center gap-2 rounded-md border p-3 bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors"
      >
        <div className="flex-1 min-w-0">
          {hasSummary ? (
            <>
              <p className="text-sm font-medium truncate">{materialName} · {colorName} · {designName}</p>
              <p className="text-xs text-muted-foreground">
                {parseInt(item.quantity) || 0} un × {formatCurrency(toCents(item.unitPrice))} = {formatCurrency(subtotal(item))}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Item {index + 1} — selecione material, cor e desenho</p>
          )}
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        {removeButton}
      </div>
    )
  }

  return (
    <div className="rounded-md border-2 border-primary/40 p-3 space-y-2 bg-muted/20">
      <div
        role="button"
        tabIndex={0}
        onClick={() => onToggleExpand(item.id)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onToggleExpand(item.id) }}
        className="flex items-center justify-between mb-1 cursor-pointer"
      >
        <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
          <ChevronUp className="h-3.5 w-3.5" />
          Item {index + 1} · editando
        </span>
        {removeButton}
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Material *</Label>
        <Select value={item.materialID} onValueChange={v => onMaterialChange(item.id, v)}>
          <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Material" /></SelectTrigger>
          <SelectContent>
            {materials.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Cor *</Label>
        <Select value={item.colorID} onValueChange={v => onUpdate(item.id, { colorID: v })}>
          <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Cor" /></SelectTrigger>
          <SelectContent>
            {colors.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Desenho *</Label>
        <Select
          value={item.designID}
          onValueChange={v => onUpdate(item.id, { designID: v })}
          disabled={!selectedCustomerID}
        >
          <SelectTrigger className="h-8 text-sm">
            <SelectValue placeholder={!selectedCustomerID ? "Selecione o cliente primeiro" : "Desenho"} />
          </SelectTrigger>
          <SelectContent>
            {designs.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-3 gap-2 items-end">
        <div className="space-y-1">
          <Label className="text-xs">Preço un. (R$) *</Label>
          <Input
            className="h-8 text-sm" type="number" min={0.01} step={0.01} placeholder="0.35"
            value={item.unitPrice}
            onChange={e => onUpdate(item.id, { unitPrice: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Quantidade *</Label>
          <Input
            className="h-8 text-sm" type="number" min={1} placeholder="100"
            value={item.quantity}
            onChange={e => onUpdate(item.id, { quantity: e.target.value })}
          />
        </div>
        <div className="text-right text-sm font-medium text-muted-foreground pt-5">
          = {formatCurrency(subtotal(item))}
        </div>
      </div>
    </div>
  )
}
