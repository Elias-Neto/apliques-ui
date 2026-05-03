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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useChangeSubscriptionStatus } from "../hooks/use-change-subscription-status"
import type { TypeAdminTenant } from "../billing.types"

type ChangeableStatus = 'active' | 'overdue' | 'suspended'

interface ChangeStatusModalProps {
  tenant: TypeAdminTenant
  open: boolean
  onClose: () => void
}

export function ChangeStatusModal({ tenant, open, onClose }: ChangeStatusModalProps) {
  const [status, setStatus] = useState<ChangeableStatus | "">("")
  const [reason, setReason] = useState("")
  const { mutate, isPending } = useChangeSubscriptionStatus()

  const isSameStatus = status === tenant.subscriptionStatus
  const canConfirm = status !== "" && reason.trim().length > 0 && !isSameStatus

  const handleConfirm = () => {
    if (!status || !canConfirm) return
    mutate(
      { tenantID: tenant.tenantID, subscriptionStatus: status, reason },
      { onSuccess: handleClose },
    )
  }

  const handleClose = () => {
    setStatus("")
    setReason("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Mudar status — {tenant.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <AlertDescription>
              Mudar status só atualiza o status. Para zerar o ciclo de cobrança, use "Marcar como
              pago".
            </AlertDescription>
          </Alert>

          <div className="space-y-1">
            <Label htmlFor="new-status">Novo status</Label>
            <Select value={status} onValueChange={v => setStatus(v as ChangeableStatus)}>
              <SelectTrigger id="new-status">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="overdue">Em atraso</SelectItem>
                <SelectItem value="suspended">Suspenso</SelectItem>
              </SelectContent>
            </Select>
            {isSameStatus && (
              <p className="text-xs text-destructive">Status idêntico ao atual.</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="reason">
              Motivo <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Obrigatório — descreva o motivo da mudança"
              rows={2}
            />
          </div>

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
