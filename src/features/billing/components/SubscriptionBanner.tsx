import { useState } from "react"
import { Link } from "react-router-dom"
import { X } from "lucide-react"
import type { TypeSubscription } from "../billing.types"
import { formatDate } from "@/lib/date-utils"

const DISMISSED_KEY = "billing_banner_dismissed_v1"

interface SubscriptionBannerProps {
  subscription: TypeSubscription
}

export function SubscriptionBanner({ subscription }: SubscriptionBannerProps) {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(DISMISSED_KEY) === 'true'
  )

  const { subscriptionStatus, daysUntilDue, nextBillingAt } = subscription

  if (subscription.isPlatformOwner) return null
  if (subscriptionStatus === 'suspended') return null
  if (subscriptionStatus === 'pending_activation') return null

  const overdueDays = daysUntilDue !== null && daysUntilDue < 0 ? Math.abs(daysUntilDue) : 0
  const isDismissable = subscriptionStatus === 'active'

  if (subscriptionStatus === 'active') {
    if (daysUntilDue === null || daysUntilDue > 1) return null
    if (dismissed) return null
  }

  const MensalidadeLink = () => (
    <Link
      to="/minha-mensalidade"
      className="font-semibold underline underline-offset-2 hover:opacity-80"
    >
      Minha mensalidade
    </Link>
  )

  const dataBrl = nextBillingAt ? formatDate(nextBillingAt) : null

  const renderMessage = () => {
    if (subscriptionStatus === 'active' && daysUntilDue === 1) {
      return (
        <span>
          Olá! Sua mensalidade vence amanhã{dataBrl ? ` (${dataBrl})` : ''}. Quando puder, dá uma
          olhada lá em <MensalidadeLink /> — o PIX já tá pronto.
        </span>
      )
    }

    if (subscriptionStatus === 'active' && daysUntilDue === 0) {
      return (
        <span>
          Sua mensalidade vence hoje. Pode regularizar lá em <MensalidadeLink /> quando der.
        </span>
      )
    }

    if (subscriptionStatus === 'overdue' && overdueDays >= 1 && overdueDays <= 6) {
      const dono = 'o responsável'
      return (
        <span>
          Sua mensalidade venceu há {overdueDays} {overdueDays === 1 ? 'dia' : 'dia(s)'}. Quando
          puder, regulariza ali em <MensalidadeLink /> — qualquer dúvida, fala com {dono} no
          WhatsApp.
        </span>
      )
    }

    if (subscriptionStatus === 'overdue' && overdueDays >= 7 && overdueDays <= 13) {
      const daysLeft = 14 - overdueDays
      return (
        <span>
          Sua mensalidade tá em aberto há {overdueDays} dias. Em {daysLeft}{' '}
          {daysLeft === 1 ? 'dia' : 'dia(s)'} sua conta entra em modo regularização. Bora resolver
          lá em <MensalidadeLink />?
        </span>
      )
    }

    return null
  }

  const message = renderMessage()
  if (!message) return null

  const isOverdue = subscriptionStatus === 'overdue'
  const bannerClass = isOverdue
    ? 'bg-amber-50 border-amber-200 text-amber-900'
    : 'bg-emerald-50 border-emerald-200 text-emerald-900'

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, 'true')
    setDismissed(true)
  }

  return (
    <div className={`flex items-center justify-between px-4 py-2 border-b text-sm ${bannerClass}`}>
      <span className="flex-1">{message}</span>
      {isDismissable && (
        <button
          onClick={handleDismiss}
          className="ml-4 opacity-60 hover:opacity-100 flex-shrink-0"
          aria-label="Fechar aviso"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
