import { useEffect, useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { X, Plus } from "lucide-react"
import { useFetchCustomers } from "@/features/customers/hooks/use-fetch-customers"
import { useCustomerDesigns } from "@/features/customers/hooks/use-customer-designs"
import { useFetchMaterials } from "@/features/catalog/hooks/use-materials"
import { useFetchColors } from "@/features/catalog/hooks/use-colors"
import { orderCreateSchema, TypeOrderCreateForm } from "../order.schema"
import { Order } from "../order.types"

interface OrderFormProps {
  initialData?: Partial<Order>
  onSubmit: (data: TypeOrderCreateForm) => void
  submitLabel: string
  isLoading?: boolean
}

type FormItem = {
  id: string
  materialID: string
  colorID: string
  designID: string
  unitPrice: string
  quantity: string
}

const toReais = (cents: number) => (cents / 100).toFixed(2)
const toCents = (value: string) => Math.round(parseFloat(value.replace(',', '.')) * 100) || 0
const subtotal = (item: FormItem) => toCents(item.unitPrice) * (parseInt(item.quantity) || 0)
const formatCurrency = (cents: number) =>
  (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const todayISO = () => new Date().toISOString().slice(0, 10)

const newEmptyItem = (): FormItem => ({
  id: Math.random().toString(36).slice(2),
  materialID: '', colorID: '', designID: '', unitPrice: '', quantity: '',
})

export function OrderForm({ initialData, onSubmit, submitLabel, isLoading }: OrderFormProps) {
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

  const addItem = () => setItems(prev => [...prev, newEmptyItem()])
  const removeItem = (id: string) => { if (items.length > 1) setItems(prev => prev.filter(i => i.id !== id)) }

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
        <div className="flex items-center justify-between">
          <Label>Itens *</Label>
          <Button type="button" size="sm" variant="outline" onClick={addItem}>
            <Plus className="h-3 w-3 mr-1" /> Adicionar item
          </Button>
        </div>

        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={item.id} className="rounded-md border p-3 space-y-2 bg-muted/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground font-medium">Item {idx + 1}</span>
                <Button
                  type="button" size="icon" variant="ghost"
                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                  onClick={() => removeItem(item.id)}
                  disabled={items.length <= 1}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Material *</Label>
                <Select value={item.materialID} onValueChange={v => handleMaterialChange(item.id, v)}>
                  <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Material" /></SelectTrigger>
                  <SelectContent>
                    {materials.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Cor *</Label>
                <Select value={item.colorID} onValueChange={v => updateItem(item.id, { colorID: v })}>
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
                  onValueChange={v => updateItem(item.id, { designID: v })}
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
                    onChange={e => updateItem(item.id, { unitPrice: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Quantidade *</Label>
                  <Input
                    className="h-8 text-sm" type="number" min={1} placeholder="100"
                    value={item.quantity}
                    onChange={e => updateItem(item.id, { quantity: e.target.value })}
                  />
                </div>
                <div className="text-right text-sm font-medium text-muted-foreground pt-5">
                  = {formatCurrency(subtotal(item))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-1 border-t">
          <span className="text-sm font-semibold">TOTAL: {formatCurrency(total)}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Observação</Label>
        <Textarea rows={2} placeholder="Observações sobre o pedido" {...register('observation')} />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Salvando..." : submitLabel}
      </Button>
    </form>
  )
}
