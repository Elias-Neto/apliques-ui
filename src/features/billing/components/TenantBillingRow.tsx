import { useState } from "react"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SubscriptionStatusBadge } from "./ChargeStatusBadge"
import { GenerateManualChargeModal } from "./GenerateManualChargeModal"
import { MarkAsPaidModal } from "./MarkAsPaidModal"
import { ChangeStatusModal } from "./ChangeStatusModal"
import { ActivateTenantModal } from "./ActivateTenantModal"
import { formatDate } from "@/lib/date-utils"
import type { TypeAdminTenant } from "../billing.types"

type ModalType = 'generate' | 'markPaid' | 'changeStatus' | 'activate' | null

interface TenantBillingRowProps {
  tenant: TypeAdminTenant
}

export function TenantBillingRow({ tenant }: TenantBillingRowProps) {
  const [modal, setModal] = useState<ModalType>(null)

  const amountBrl = tenant.billingAmountCents
    ? (tenant.billingAmountCents / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })
    : '—'

  const isPendingActivation = tenant.subscriptionStatus === 'pending_activation'
  const canMarkPaid = !!tenant.currentPendingChargeID

  return (
    <>
      <tr className="border-b hover:bg-muted/30 transition-colors">
        <td className="px-4 py-3 font-medium">
          {tenant.name}
          {tenant.lastBillingError && (
            <span className="ml-2 text-xs text-destructive" title={tenant.lastBillingError.message}>
              ⚠ falha na cobrança
            </span>
          )}
        </td>
        <td className="px-4 py-3 text-sm text-muted-foreground">{tenant.plan}</td>
        <td className="px-4 py-3">
          <SubscriptionStatusBadge status={tenant.subscriptionStatus} />
        </td>
        <td className="px-4 py-3 text-sm">
          {tenant.nextBillingAt ? (
            <span>
              {formatDate(tenant.nextBillingAt)}
              {tenant.billingAmountCents > 0 && (
                <span className="text-muted-foreground ml-1">· {amountBrl}</span>
              )}
            </span>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </td>
        <td className="px-4 py-3 text-sm text-muted-foreground">
          {tenant.lastPaidAt ? formatDate(tenant.lastPaidAt) : '—'}
        </td>
        <td className="px-4 py-3 text-sm text-muted-foreground">
          {tenant.billingActivatedAt ? formatDate(tenant.billingActivatedAt) : '—'}
        </td>
        <td className="px-4 py-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setModal('generate')}
                disabled={isPendingActivation}
              >
                Gerar cobrança manual
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setModal('markPaid')}
                disabled={!canMarkPaid}
              >
                Marcar como pago
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setModal('changeStatus')}>
                Mudar status
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setModal('activate')}
                disabled={!isPendingActivation}
              >
                Ativar cobrança
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>

      {modal === 'generate' && (
        <GenerateManualChargeModal
          tenant={tenant}
          open
          onClose={() => setModal(null)}
        />
      )}
      {modal === 'markPaid' && tenant.currentPendingChargeID && (
        <MarkAsPaidModal
          tenant={tenant}
          chargeID={tenant.currentPendingChargeID}
          open
          onClose={() => setModal(null)}
        />
      )}
      {modal === 'changeStatus' && (
        <ChangeStatusModal
          tenant={tenant}
          open
          onClose={() => setModal(null)}
        />
      )}
      {modal === 'activate' && (
        <ActivateTenantModal
          tenant={tenant}
          open
          onClose={() => setModal(null)}
        />
      )}
    </>
  )
}
