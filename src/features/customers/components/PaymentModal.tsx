import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Payment } from "../payment.types"

const schema = z.object({
  amount:      z.number({ invalid_type_error: "Valor obrigatório" }).min(0.01, "Valor deve ser maior que 0"),
  date:        z.string().optional(),
  observation: z.string().optional().nullable(),
})

type Form = z.infer<typeof schema>

interface PaymentModalProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  onSubmit: (data: { amount: number; date?: string; observation?: string | null }) => void
  isLoading?: boolean
  title: string
  initial?: Partial<Payment>
  balance?: number
}

const formatCentsToReais = (c: number) => (c / 100).toFixed(2)
const parseReaisToCents = (v: string) => Math.round(parseFloat(v.replace(',', '.')) * 100)
const formatCurrency = (c: number) => (c / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const today = () => new Date().toISOString().split('T')[0]

export function PaymentModal({ open, onOpenChange, onSubmit, isLoading, title, initial, balance }: PaymentModalProps) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount:      initial?.amount ? parseFloat(formatCentsToReais(initial.amount)) : undefined,
      date:        initial?.date ? initial.date.slice(0, 10) : today(),
      observation: initial?.observation ?? '',
    },
  })

  useEffect(() => {
    reset({
      amount:      initial?.amount ? parseFloat(formatCentsToReais(initial.amount)) : undefined,
      date:        initial?.date ? initial.date.slice(0, 10) : today(),
      observation: initial?.observation ?? '',
    })
  }, [initial, reset])

  const amountValue = watch('amount')
  const amountCents = amountValue ? parseReaisToCents(String(amountValue)) : 0
  const saldoApos = balance !== undefined ? balance - amountCents : undefined

  const handleSubmitForm = (data: Form) => {
    onSubmit({
      amount:      parseReaisToCents(String(data.amount)),
      date:        data.date,
      observation: data.observation || null,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pay-amount">Valor (R$) *</Label>
            <Input
              id="pay-amount"
              type="number"
              min={0.01}
              step={0.01}
              placeholder="0.00"
              {...register('amount', { valueAsNumber: true })}
            />
            {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
            {balance !== undefined && (
              <p className="text-xs text-muted-foreground">
                Saldo em aberto: {formatCurrency(balance)}
                {amountCents > 0 && (
                  <span className={saldoApos! < 0 ? ' text-destructive' : ''}>
                    {' '}→ após: {formatCurrency(Math.max(0, saldoApos!))}
                  </span>
                )}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pay-date">Data do pagamento</Label>
            <Input id="pay-date" type="date" {...register('date')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pay-obs">Observação</Label>
            <Textarea id="pay-obs" rows={2} placeholder="PIX, comprovante, etc." {...register('observation')} />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
