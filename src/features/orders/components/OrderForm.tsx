import { useEffect, useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { useFetchCustomers } from "@/features/customers/hooks/use-fetch-customers"
import { useCustomerDesigns } from "@/features/customers/hooks/use-customer-designs"
import { useFetchMaterials } from "@/features/catalog/hooks/use-materials"
import { useFetchColors } from "@/features/catalog/hooks/use-colors"
import { orderCreateSchema, TypeOrderCreateForm } from "../order.schema"
import { Order } from "../order.types"
import { OrderItemRow } from "./OrderItemRow"
import { FormItem, subtotal, formatCurrency, toReais, toCents, newEmptyItem } from "./order-item.utils"

interface OrderFormProps {
  initialData?: Partial<Order>
  onSubmit: (data: TypeOrderCreateForm) => void
  onCancel?: () => void
  submitLabel: string
  isLoading?: boolean
}

const todayISO = () => new Date().toISOString().slice(0, 10)

export function OrderForm({ initialData, onSubmit, onCancel, submitLabel, isLoading }: OrderFormProps) {
  const { data: customersData } = useFetchCustomers()
  const { data: materials = [] } = useFetchMaterials()
  const { data: colors = [] }    = useFetchColors()

  const { register, handleSubmit, watch, setValue } = useForm<{
    customerID: string; orderDate: string; observation: string
  }>({
    defaultValues: {
      customerID:  initialData?.customerID ?? '',
      orderDate:   initialData?.orderDate ? initialData.orderDate.slice(0, 10) : todayISO(),
      observation: initialData?.observation ?? '',
    },
  })

  const selectedCustomerID = watch('customerID')
  const { data: designs = [] } = useCustomerDesigns(selectedCustomerID || null)

  const [items, setItems] = useState<FormItem[]>(() => {
    if (initialData?.items?.length) {
      return initialData.items.map(item => ({
        id: Math.random().toString(36).slice(2),
        materialID: item.materialID,
        colorID:    item.colorID,
        designID:   item.designID,
        unitPrice:  toReais(item.unitPrice),
        quantity:   String(item.quantity),
      }))
    }
    return [newEmptyItem()]
  })

  // L-05 (test plan rev. 11): item carregado de um pedido já existente (edição) nasce
  // colapsado — só um item recém-adicionado nesta sessão (addItem) nasce expandido.
  const [expandedItemId, setExpandedItemId] = useState<string | null>(() =>
    initialData?.items?.length ? null : (items[0]?.id ?? null)
  )

  useEffect(() => {
    // ao trocar de cliente, reseta o designID de todos os itens
    setItems(prev => prev.map(i => ({ ...i, designID: '' })))
  }, [selectedCustomerID])

  const customers = customersData?.items ?? []

  const updateItem = useCallback((id: string, patch: Partial<FormItem>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...patch } : item))
  }, [])

  const handleMaterialChange = useCallback((itemId: string, materialId: string) => {
    const material = materials.find(m => m.id === materialId)
    updateItem(itemId, {
      materialID: materialId,
      unitPrice: material ? toReais(material.pricePerUnit) : '',
    })
  }, [materials, updateItem])

  const toggleExpand = (id: string) => {
    setExpandedItemId(prev => (prev === id ? null : id))
  }

  const addItem = () => {
    const item = newEmptyItem()
    setItems(prev => [...prev, item])
    // L-06 (test plan rev. 11): item novo nasce expandido, colapsando qualquer outro aberto
    setExpandedItemId(item.id)
  }

  const removeItem = (id: string) => {
    if (items.length <= 1) return
    setItems(prev => prev.filter(i => i.id !== id))
    setExpandedItemId(prev => (prev === id ? null : prev))
  }

  const total = items.reduce((sum, item) => sum + subtotal(item), 0)

  const handleFormSubmit = (meta: { customerID: string; orderDate: string; observation: string }) => {
    const payload: TypeOrderCreateForm = {
      customerID:  meta.customerID,
      orderDate:   meta.orderDate || undefined,
      items:       items.map(item => ({
        materialID: item.materialID,
        colorID:    item.colorID,
        designID:   item.designID,
        unitPrice:  toCents(item.unitPrice),
        quantity:   parseInt(item.quantity) || 0,
      })),
      observation: meta.observation || null,
    }
    const result = orderCreateSchema.safeParse(payload)
    if (!result.success) {
      alert(result.error.errors[0]?.message ?? 'Dados inválidos')
      return
    }
    onSubmit(result.data)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Cliente *</Label>
        <Select value={watch('customerID')} onValueChange={v => setValue('customerID', v)}>
          <SelectTrigger><SelectValue placeholder="Selecione o cliente" /></SelectTrigger>
          <SelectContent>
            {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Data do pedido</Label>
        <Input type="date" {...register('orderDate')} />
      </div>

      <div className="space-y-2">
        <Label>Itens *</Label>

        <div className="space-y-2">
          {items.map((item, idx) => (
            <OrderItemRow
              key={item.id}
              item={item}
              index={idx}
              materials={materials}
              colors={colors}
              designs={designs}
              selectedCustomerID={selectedCustomerID}
              isExpanded={expandedItemId === item.id}
              onToggleExpand={toggleExpand}
              onUpdate={updateItem}
              onMaterialChange={handleMaterialChange}
              onRemove={removeItem}
              canRemove={items.length > 1}
            />
          ))}
        </div>

        <Button type="button" variant="outline" className="w-full border-dashed" onClick={addItem}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Adicionar item
        </Button>
      </div>

      <div className="space-y-2">
        <Label>Observação</Label>
        <Textarea rows={2} placeholder="Observações sobre o pedido" {...register('observation')} />
      </div>

      <div className="sticky bottom-0 bg-background pt-2 border-t space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-lg font-bold">{formatCurrency(total)}</span>
        </div>
        <div className="flex gap-2">
          {onCancel && (
            <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading ? "Salvando..." : submitLabel}
          </Button>
        </div>
      </div>
    </form>
  )
}
