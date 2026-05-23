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
import { useChangeBillingDay } from "../hooks/use-change-billing-day"
import { computeNextBillingAt } from "../helpers/compute-next-billing-at"
import { formatDate } from "@/lib/date-utils"
import type { TypeAdminTenant } from "../billing.types"

interface ChangeBillingDayModalProps {
  tenant: TypeAdminTenant
  open: boolean
  onClose: () => void
}

export function ChangeBillingDayModal({ tenant, open, onClose }: ChangeBillingDayModalProps) {
  const [billingDay, setBillingDay] = useState<number | "">(tenant.billingDay ?? "")
  const { mutate, isPending } = useChangeBillingDay()

  const billingDayValid =
    billingDay !== "" &&
    Number.isInteger(billingDay) &&
    (billingDay as number) >= 1 &&
    (billingDay as number) <= 28

  const isSameDay = billingDay === tenant.billingDay
  const canConfirm = billingDayValid && !isSameDay

  const previewDate =
    billingDayValid && !isSameDay
      ? computeNextBillingAt(new Date(), billingDay as number)
      : null

  const handleConfirm = () => {
    if (!canConfirm || billingDay === "") return
    mutate(
      { tenantID: tenant.tenantID, billingDay: billingDay as number },
      { onSuccess: handleClose },
    )
  }

  const handleClose = () => {
    setBillingDay(tenant.billingDay ?? "")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Mudar dia de cobrança — {tenant.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Dia atual:{" "}
            <strong>
              {tenant.billingDay != null ? `dia ${tenant.billingDay}` : "não definido"}
            </strong>
            {tenant.nextBillingAt && (
              <> · Próx. cobrança: <strong>{formatDate(tenant.nextBillingAt)}</strong></>
            )}
          </p>

          <div className="space-y-1">
            <Label htmlFor="billing-day">
              Novo dia de cobrança <span className="text-destructive">*</span>
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
            <p className="text-xs text-muted-foreground">Entre 1 e 28</p>
            {isSameDay && (
              <p className="text-xs text-destructive">Dia idêntico ao atual.</p>
            )}
          </div>

          {previewDate && (
            <p className="text-sm text-muted-foreground">
              Próximo vencimento estimado:{" "}
              <strong className="text-foreground">{formatDate(previewDate.toISOString())}</strong>
              <span className="ml-1 text-xs">(o servidor confirma o valor exato)</span>
            </p>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm} disabled={!canConfirm || isPending}>
              {isPending ? "Salvando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
