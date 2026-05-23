import { Heading } from "@/components/ui/heading"
import { KpiCard } from "../components/KpiCard"
import { TenantBillingRow } from "../components/TenantBillingRow"
import { useAdminTenantsBilling } from "../hooks/use-admin-tenants-billing"

export default function BillingAdmin() {
  const { data, isLoading } = useAdminTenantsBilling()

  return (
    <div className="min-h-screen bg-background">
      <Heading description="Gerencie a cobrança de todos os tenants" showButton={false}>
        Billing
      </Heading>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <KpiCard title="Tenants ativos" value={data?.kpis.active ?? 0} />
              <KpiCard
                title="Em atraso"
                value={data?.kpis.overdue ?? 0}
                highlight
                highlightColor="text-amber-600"
              />
              <KpiCard
                title="Suspensos"
                value={data?.kpis.suspended ?? 0}
                highlight
                highlightColor="text-red-600"
              />
              <KpiCard
                title="Aguardando ativação"
                value={data?.kpis.pendingActivation ?? 0}
              />
            </div>

            <div className="border rounded-lg overflow-hidden bg-card">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/30">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Nome</th>
                    <th className="px-4 py-3 text-left font-medium">Plano</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Dia cobrança</th>
                    <th className="px-4 py-3 text-left font-medium">Próx. cobrança</th>
                    <th className="px-4 py-3 text-left font-medium">Último pagamento</th>
                    <th className="px-4 py-3 text-left font-medium">Ativado em</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {(data?.tenants ?? []).length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                        Nenhum tenant cadastrado.
                      </td>
                    </tr>
                  ) : (
                    (data?.tenants ?? []).map(tenant => (
                      <TenantBillingRow key={tenant.tenantID} tenant={tenant} />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
