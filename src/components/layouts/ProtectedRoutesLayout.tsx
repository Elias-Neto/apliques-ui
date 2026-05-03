import { Routes, Route } from "react-router-dom"
import { MainMenu } from "@/components/layouts/MainMenu"
import { useMenu } from "@/hooks/use-menu"
import { cn } from "@/lib/utils"
import Pessoas from "@/features/pessoa/pages/Pessoas"
import Settings from "@/features/permission-group/pages/Settings"
import Home from "@/features/home/pages/Home"
import NotFound from "@/components/layouts/NotFound"
import MinhaMensalidade from "@/features/billing/pages/MinhaMensalidade"
import BillingAdmin from "@/features/billing/pages/BillingAdmin"
import MeusDados from "@/features/account/pages/MeusDados"
import { SubscriptionBanner } from "@/features/billing/components/SubscriptionBanner"
import { RegularizacaoView } from "@/features/billing/components/RegularizacaoView"
import { useSubscription } from "@/features/billing/hooks/use-subscription"

export const ProtectedRoutesLayout = () => {
  const { isCollapsed } = useMenu()
  const { data: subscription, isLoading: subLoading } = useSubscription()

  if (!subLoading && subscription?.subscriptionStatus === 'suspended') {
    return <RegularizacaoView />
  }

  return (
    <div className="flex min-h-screen">
      <MainMenu />
      <main
        className={cn(
          "flex-1 overflow-auto transition-all duration-300",
          isCollapsed ? "lg:ml-[63px]" : "lg:ml-64",
        )}
      >
        {subscription && <SubscriptionBanner subscription={subscription} />}
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/minha-conta/meus-dados" element={<MeusDados />} />
          <Route path="/pessoas" element={<Pessoas />} />
          <Route path="/configuracoes/permissionamento" element={<Settings />} />
          <Route path="/minha-mensalidade" element={<MinhaMensalidade />} />
          <Route path="/admin/billing" element={<BillingAdmin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}
