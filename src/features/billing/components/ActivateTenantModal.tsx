import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CurrencyInput } from "@/components/ui/currency-input"
import { useActivateTenantBilling } from "../hooks/use-activate-tenant-billing"
import { formatDate } from "@/lib/date-utils"
import type { TypeAdminTenant, TypeActivateTenantResponse } from "../billing.types"

interface ActivateTenantModalProps {
  tenant: TypeAdminTenant
  open: boolean
  onClose: () => void
}

export function ActivateTenantModal({ tenant, open, onClose }: ActivateTenantModalProps) {
  const [amountCents, setAmountCents] = useState(0)
  const [billingDay, setBillingDay] = useState<number | "">(1)
  const [result, setResult] = useState<TypeActivateTenantResponse | null>(null)
  const { mutate, isPending } = useActivateTenantBilling()

  const billingDayValid = billingDay !== "" && Number.isInteger(billingDay) && billingDay >= 1 && billingDay <= 28
  const canConfirm = amountCents > 0 && billingDayValid

  const handleConfirm = () => {
    if (!canConfirm || !billingDayValid || billingDay === "") return
    mutate(
      { tenantID: tenant.tenantID, amountCents, billingDay: billingDay as number },
      { onSuccess: (data) => setResult(data) },
    )
  }

  const handleClose = () => {
    setAmountCents(0)
    setBillingDay(1)
    setResult(null)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ativar cobrança — {tenant.name}</DialogTitle>
        </DialogHeader>

        {!result ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Configure a mensalidade de <strong>{tenant.name}</strong>. A cobrança será gerada
              todo mês no dia definido.
            </p>
            <div className="space-y-1">
              <Label htmlFor="amount">
                Valor mensal <span className="text-destructive">*</span>
              </Label>
              <CurrencyInput
                id="amount"
                value={amountCents}
                onChange={setAmountCents}
                placeholder="R$ 0,00"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="billing-day">
                Dia de cobrança <span className="text-destructive">*</span>
              </Label>
              <Input
                id="billing-day"
                type="number"
                min={1}
                max={28}
                value={billingDay}
                onChange={e => {
                  const v = e.target.value
                  setBillingDay(v === "" ? "" : parseInt(v, 10))
                }}
                placeholder="1 – 28"
              />
              <p className="text-xs text-muted-foreground">Entre 1 e 28 (sem 29-31 para evitar meses curtos)</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button onClick={handleConfirm} disabled={!canConfirm || isPending}>
                {isPending ? "Ativando..." : "Ativar billing"}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-emerald-700 font-medium">
              Billing ativado! Dia de cobrança: <strong>{result.billingDay}</strong>. Primeiro
              vencimento: <strong>{formatDate(result.nextBillingAt)}</strong>.
            </p>
            <DialogFooter>
              <Button onClick={handleClose} className="w-full">
                Fechar
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
