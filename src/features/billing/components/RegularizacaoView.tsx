import { useSubscription } from "../hooks/use-subscription"
import { useCurrentCharge } from "../hooks/use-current-charge"
import { PixKeyDisplay } from "@/components/billing/PixKeyDisplay"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { useUser } from "@/contexts/UserContext"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { Permission } from "@/types/enums"
import type { TypeCharge } from "../billing.types"

const PIX_KEY = "13541352450"

const isCharge = (data: unknown): data is TypeCharge =>
  !!data && typeof data === 'object' && 'chargeID' in data

function EmployeeSuspendedView({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Acesso temporariamente suspenso</h1>
          <p className="text-muted-foreground">
            A conta da sua empresa está com o acesso suspenso. Entre em contato com o responsável para regularizar.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Qualquer dúvida, fala com o Elias.
        </p>
        <Button variant="ghost" size="sm" onClick={onLogout} className="gap-2 text-muted-foreground">
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  )
}

export function RegularizacaoView() {
  const { data: subscription } = useSubscription()
  const { data: charge, isLoading: chargeLoading } = useCurrentCharge(subscription?.subscriptionStatus)
  const { logout } = useAuth()
  const { user } = useUser()

  const canSeeBilling = user?.permissions.includes(Permission.BillingMeShow) ?? false

  if (!canSeeBilling) {
    return <EmployeeSuspendedView onLogout={logout} />
  }

  const amountBrl = subscription?.billingAmountCents
    ? (subscription.billingAmountCents / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })
    : null

  const overdueDays =
    subscription?.daysUntilDue !== null && subscription?.daysUntilDue !== undefined && subscription.daysUntilDue < 0
      ? Math.abs(subscription.daysUntilDue)
      : null

  const showPixKey = !chargeLoading && isCharge(charge)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Sua conta tá temporariamente fora do ar</h1>
          <p className="text-muted-foreground">
            Seus dados não foram apagados.
            {amountBrl
              ? ` Pra voltar, é só pagar o PIX de ${amountBrl} abaixo.`
              : " Pra voltar, é só pagar o PIX abaixo."}
          </p>
          {overdueDays !== null && (
            <p className="text-sm font-medium text-red-600">
              Em atraso há: {overdueDays} {overdueDays === 1 ? 'dia' : 'dias'}
            </p>
          )}
        </div>

        {chargeLoading && (
          <p className="text-sm text-muted-foreground animate-pulse">Carregando cobrança...</p>
        )}

        {showPixKey && (
          <div className="border rounded-lg p-6 bg-card shadow-sm text-left">
            <PixKeyDisplay pixKey={PIX_KEY} />
          </div>
        )}

        {!chargeLoading && !isCharge(charge) && (
          <p className="text-sm text-muted-foreground">
            Nenhuma cobrança ativa no momento. O PIX será gerado em breve.
          </p>
        )}

        <p className="text-sm text-muted-foreground">
          Qualquer dúvida, fala com o Elias.
        </p>

        <Button variant="ghost" size="sm" onClick={logout} className="gap-2 text-muted-foreground">
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  )
}
