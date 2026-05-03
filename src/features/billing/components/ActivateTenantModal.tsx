import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
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
  const [result, setResult] = useState<TypeActivateTenantResponse | null>(null)
  const { mutate, isPending } = useActivateTenantBilling()

  const canConfirm = amountCents > 0

  const handleConfirm = () => {
    if (!canConfirm) return
    mutate(
      { tenantID: tenant.tenantID, amountCents },
      { onSuccess: (data) => setResult(data) },
    )
  }

  const handleClose = () => {
    setAmountCents(0)
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
              Configure o valor da mensalidade para <strong>{tenant.name}</strong>. O primeiro
              vencimento será em 28 dias.
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
              Billing ativado! Primeiro vencimento:{" "}
              <strong>{formatDate(result.nextBillingAt)}</strong>.
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
