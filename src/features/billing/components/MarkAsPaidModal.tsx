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
import { Textarea } from "@/components/ui/textarea"
import { useMarkAsPaid } from "../hooks/use-mark-as-paid"
import { formatDate } from "@/lib/date-utils"
import type { TypeAdminTenant, TypeMarkPaidResponse } from "../billing.types"

interface MarkAsPaidModalProps {
  tenant: TypeAdminTenant
  chargeID: string
  open: boolean
  onClose: () => void
}

export function MarkAsPaidModal({ tenant, chargeID, open, onClose }: MarkAsPaidModalProps) {
  const [reason, setReason] = useState("")
  const [result, setResult] = useState<TypeMarkPaidResponse | null>(null)
  const { mutate, isPending } = useMarkAsPaid()

  const handleConfirm = () => {
    mutate(
      { tenantID: tenant.tenantID, chargeID, reason: reason || undefined },
      { onSuccess: (data) => setResult(data) },
    )
  }

  const handleClose = () => {
    setReason("")
    setResult(null)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Marcar como pago — {tenant.name}</DialogTitle>
        </DialogHeader>

        {!result ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Marcar a cobrança corrente de <strong>{tenant.name}</strong> como paga manualmente?
              Isso muda o status para <strong>ativo</strong> e zera o ciclo.
            </p>
            <div className="space-y-1">
              <Label htmlFor="reason">Motivo (opcional)</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Ex: PIX recebido fora do sistema"
                rows={2}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button onClick={handleConfirm} disabled={isPending}>
                {isPending ? "Salvando..." : "Confirmar"}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-emerald-700 font-medium">
              Pagamento confirmado. Próximo vencimento:{" "}
              <strong>{formatDate(result.tenant.nextBillingAt)}</strong>.
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
