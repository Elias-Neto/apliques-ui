import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { TypeSubscriptionStatus } from "../billing.types"

const statusConfig: Record<TypeSubscriptionStatus, { label: string; className: string }> = {
  active: { label: "Ativo", className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  overdue: { label: "Em atraso", className: "bg-amber-100 text-amber-800 border-amber-200" },
  suspended: { label: "Suspenso", className: "bg-red-100 text-red-800 border-red-200" },
  pending_activation: { label: "Aguardando ativação", className: "bg-gray-100 text-gray-700 border-gray-200" },
}

export function SubscriptionStatusBadge({ status }: { status: TypeSubscriptionStatus }) {
  const config = statusConfig[status] ?? { label: status, className: "" }
  return (
    <Badge variant="outline" className={cn(config.className)}>
      {config.label}
    </Badge>
  )
}
