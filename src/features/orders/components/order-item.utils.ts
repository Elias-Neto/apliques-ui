export type FormItem = {
  id: string
  materialID: string
  colorID: string
  designID: string
  unitPrice: string
  quantity: string
}

export const toReais = (cents: number) => (cents / 100).toFixed(2)
export const toCents = (value: string) => Math.round(parseFloat(value.replace(',', '.')) * 100) || 0
export const subtotal = (item: FormItem) => toCents(item.unitPrice) * (parseInt(item.quantity) || 0)
export const formatCurrency = (cents: number) =>
  (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export const newEmptyItem = (): FormItem => ({
  id: Math.random().toString(36).slice(2),
  materialID: '', colorID: '', designID: '', unitPrice: '', quantity: '',
})
