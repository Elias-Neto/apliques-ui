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
import { CheckCircle } from "lucide-react"
import { useGenerateManualCharge } from "../hooks/use-generate-manual-charge"
import type { TypeAdminTenant } from "../billing.types"

interface GenerateManualChargeModalProps {
  tenant: TypeAdminTenant
  open: boolean
  onClose: () => void
}

export function GenerateManualChargeModal({ tenant, open, onClose }: GenerateManualChargeModalProps) {
  const [reason, setReason] = useState("")
  const [generated, setGenerated] = useState(false)
  const { mutate, isPending } = useGenerateManualCharge()

  const amountBrl = (tenant.billingAmountCents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  const handleConfirm = () => {
    mutate(
      { tenantID: tenant.tenantID, reason: reason || undefined },
      { onSuccess: () => setGenerated(true) },
    )
  }

  const handleClose = () => {
    setReason("")
    setGenerated(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Gerar cobrança manual — {tenant.name}</DialogTitle>
        </DialogHeader>

        {!generated ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Gerar cobrança agora para <strong>{tenant.name}</strong> — valor{" "}
              <strong>{amountBrl}</strong>? A cobrança anterior em aberto será cancelada.
            </p>
            <div className="space-y-1">
              <Label htmlFor="reason">Motivo (opcional)</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Ex: cliente solicitou nova cobrança"
                rows={2}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button onClick={handleConfirm} disabled={isPending}>
                {isPending ? "Gerando..." : "Gerar cobrança"}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle className="h-5 w-5" />
              <p className="font-medium">Cobrança gerada com sucesso!</p>
            </div>
            <p className="text-sm text-muted-foreground">
              O cliente pode acessar <strong>Minha Mensalidade</strong> para visualizar a chave PIX e
              efetuar o pagamento.
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
