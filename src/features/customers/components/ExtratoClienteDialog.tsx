import { useMemo, useRef, useState } from "react"
import { Share2, Download } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useShareImage } from "@/hooks/use-share-image"
import { useUser } from "@/contexts/UserContext"
import { formatCurrency } from "@/lib/format"
import { computeExtratoData, presetToCutoffDate, PRESET_LABELS, PRESET_ORDER, type PeriodPreset } from "../extrato.utils"
import { ExtratoClienteCard } from "./ExtratoClienteCard"
import { Customer } from "../customer.types"

interface ExtratoClienteDialogProps {
  customer: Customer
  open: boolean
  onOpenChange: (open: boolean) => void
}

const parseDateInput = (value: string): Date => {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function ExtratoClienteDialog({ customer, open, onOpenChange }: ExtratoClienteDialogProps) {
  const { user } = useUser()
  const [step, setStep] = useState<'period' | 'preview'>('period')
  const [preset, setPreset] = useState<PeriodPreset>('90')
  const [customDate, setCustomDate] = useState('')
  const cardRef = useRef<HTMLDivElement>(null)

  const today = useMemo(() => new Date(), [])
  const cutoff = customDate ? parseDateInput(customDate) : presetToCutoffDate(preset, today)
  const preview = useMemo(() => computeExtratoData(customer, cutoff), [customer, cutoff])

  const fileName = `extrato-${customer.name.toLowerCase().replace(/\s+/g, '-')}.png`
  const { share, download, isProcessing } = useShareImage(cardRef, fileName)

  const handleOpenChange = (next: boolean) => {
    if (!next) setStep('period')
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm">
        {step === 'period' ? (
          <>
            <DialogHeader>
              <DialogTitle>Gerar extrato — {customer.name}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                O que veio antes disso entra como "saldo anterior", num número só — igual conta de caderno.
              </p>

              <div className="space-y-1.5">
                <Label htmlFor="extrato-preset">Período</Label>
                <Select
                  value={preset}
                  onValueChange={v => { setPreset(v as PeriodPreset); setCustomDate('') }}
                >
                  <SelectTrigger id="extrato-preset"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PRESET_ORDER.map(p => (
                      <SelectItem key={p} value={p}>{PRESET_LABELS[p]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="extrato-data">Ou escolher outra data</Label>
                <Input
                  id="extrato-data"
                  type="date"
                  value={customDate}
                  onChange={e => setCustomDate(e.target.value)}
                />
              </div>

              <div className="bg-muted/40 rounded-xl p-3 flex justify-between items-center">
                <p className="text-xs text-muted-foreground">Saldo em aberto antes do período</p>
                <p className="text-lg font-bold">{formatCurrency(preview.saldoAnterior)}</p>
              </div>

              <Button className="w-full bg-slate-800 hover:bg-slate-700" onClick={() => setStep('preview')}>
                Gerar extrato →
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Extrato de cobrança</DialogTitle>
            </DialogHeader>

            <div className="flex justify-center bg-slate-50 rounded-2xl p-3">
              <ExtratoClienteCard
                ref={cardRef}
                customer={customer}
                cutoff={cutoff}
                tenantName={user?.tenant.name ?? ''}
              />
            </div>

            <div className="space-y-2">
              <Button className="w-full bg-green-600 hover:bg-green-700" onClick={share} disabled={isProcessing}>
                <Share2 className="h-4 w-4 mr-2" /> Compartilhar imagem
              </Button>
              <Button variant="outline" className="w-full" onClick={download} disabled={isProcessing}>
                <Download className="h-4 w-4 mr-2" /> Salvar imagem
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
