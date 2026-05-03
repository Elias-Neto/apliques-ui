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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { useGenerateManualCharge } from "../hooks/use-generate-manual-charge"
import { PixQrDisplay } from "./PixQrDisplay"
import type { TypeAdminTenant, TypeGenerateChargeResponse } from "../billing.types"

interface GenerateManualChargeModalProps {
  tenant: TypeAdminTenant
  open: boolean
  onClose: () => void
}

export function GenerateManualChargeModal({ tenant, open, onClose }: GenerateManualChargeModalProps) {
  const [reason, setReason] = useState("")
  const [newCharge, setNewCharge] = useState<TypeGenerateChargeResponse | null>(null)
  const { mutate, isPending } = useGenerateManualCharge()

  const amountBrl = (tenant.billingAmountCents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  const handleConfirm = () => {
    mutate(
      { tenantID: tenant.tenantID, reason: reason || undefined },
      { onSuccess: (data) => setNewCharge(data) },
    )
  }

  const handleClose = () => {
    setReason("")
    setNewCharge(null)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Gerar cobrança manual — {tenant.name}</DialogTitle>
        </DialogHeader>

        {!newCharge ? (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Atenção:</strong> o PIX anterior será cancelado no nosso sistema, mas
                continua ativo no AbacatePay. Se o cliente já pagou o PIX anterior, use "Marcar
                como pago" em vez disso.
              </AlertDescription>
            </Alert>
            <p className="text-sm text-muted-foreground">
              Gerar PIX agora para <strong>{tenant.name}</strong> — valor{" "}
              <strong>{amountBrl}</strong>?
            </p>
            <div className="space-y-1">
              <Label htmlFor="reason">Motivo (opcional)</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Ex: cliente solicitou novo PIX"
                rows={2}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button onClick={handleConfirm} disabled={isPending}>
                {isPending ? "Gerando..." : "Gerar PIX"}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-emerald-700 font-medium">PIX gerado com sucesso!</p>
            <PixQrDisplay
              brCode={newCharge.brCode}
              brCodeBase64={newCharge.brCodeBase64}
              expiresAt={newCharge.expiresAt}
            />
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
