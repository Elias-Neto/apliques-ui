import { CheckCircle, AlertCircle, Clock } from "lucide-react"
import { useSubscription } from "../hooks/use-subscription"
import { useCurrentCharge } from "../hooks/use-current-charge"
import { PixKeyDisplay } from "@/components/billing/PixKeyDisplay"
import { Heading } from "@/components/ui/heading"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/date-utils"
import type { TypeCharge, TypeChargePreview } from "../billing.types"

const PIX_KEY = "13541352450"

const isCharge = (data: TypeCharge | TypeChargePreview | undefined): data is TypeCharge =>
  !!data && 'chargeID' in data

const isPreview = (data: TypeCharge | TypeChargePreview | undefined): data is TypeChargePreview =>
  !!data && 'reason' in data

export default function MinhaMensalidade() {
  const { data: subscription, isLoading: subLoading } = useSubscription()
  const { data: chargeData, isLoading: chargeLoading } = useCurrentCharge()

  if (subLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Heading description="Acompanhe e pague sua mensalidade" showButton={false}>
          Minha Mensalidade
        </Heading>
        <div className="container mx-auto px-4 py-6 max-w-lg">
          <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>
    )
  }

  if (subscription?.isPlatformOwner) {
    return (
      <div className="min-h-screen bg-background">
        <Heading description="Acompanhe e pague sua mensalidade" showButton={false}>
          Minha Mensalidade
        </Heading>
        <div className="container mx-auto px-4 py-6 max-w-lg">
          <p className="text-muted-foreground">Operadores da plataforma não têm cobrança.</p>
        </div>
      </div>
    )
  }

  const status = subscription?.subscriptionStatus

  const amountBrl = subscription?.billingAmountCents
    ? (subscription.billingAmountCents / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })
    : null

  const showPixKey =
    !chargeLoading && isCharge(chargeData) &&
    (chargeData.status === 'pending' || chargeData.status === 'failed')

  return (
    <div className="min-h-screen bg-background">
      <Heading description="Acompanhe e pague sua mensalidade" showButton={false}>
        Minha Mensalidade
      </Heading>
      <div className="container mx-auto px-4 py-6 max-w-lg">
        {status === 'pending_activation' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-muted-foreground" />
                Aguardando ativação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Sua conta ainda não foi configurada para cobrança. Entre em contato para ativar sua
                mensalidade.
              </p>
            </CardContent>
          </Card>
        )}

        {(status === 'active' || status === 'overdue') && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                {status === 'active' ? (
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                )}
                {status === 'active' ? 'Mensalidade em dia' : 'Mensalidade em atraso'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {amountBrl && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Valor</span>
                  <span className="font-medium">{amountBrl}</span>
                </div>
              )}
              {subscription?.nextBillingAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Vencimento</span>
                  <span className="font-medium">{formatDate(subscription.nextBillingAt)}</span>
                </div>
              )}
              {subscription?.lastPaidAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Último pagamento</span>
                  <span className="font-medium">{formatDate(subscription.lastPaidAt)}</span>
                </div>
              )}
              <div className="border-t pt-4">
                {chargeLoading && (
                  <p className="text-sm text-center text-muted-foreground animate-pulse">
                    Carregando cobrança...
                  </p>
                )}
                {showPixKey && <PixKeyDisplay pixKey={PIX_KEY} />}
                {!chargeLoading && isPreview(chargeData) && (
                  <div className="text-center text-sm text-muted-foreground space-y-1">
                    <p>Sua mensalidade ainda não está disponível para pagamento.</p>
                    {chargeData.daysUntilDue != null && chargeData.daysUntilDue > 0 && (
                      <p>
                        Vence em{' '}
                        <strong>
                          {chargeData.daysUntilDue === 1
                            ? '1 dia'
                            : `${chargeData.daysUntilDue} dias`}
                        </strong>
                        .
                      </p>
                    )}
                    <p>O PIX será gerado automaticamente no início do dia.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
