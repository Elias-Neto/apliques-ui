import { useNavigate } from "react-router-dom"
import { Wallet } from "lucide-react"
import { Heading } from "@/components/ui/heading"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useOpenBalances } from "../hooks/use-open-balances"

const formatCurrency = (c: number) =>
  (c / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function OpenBalances() {
  const { data, isLoading } = useOpenBalances()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background">
      <Heading description="Clientes com saldo em aberto" showButton={false}>
        Financeiro
      </Heading>

      <div className="container mx-auto px-4 py-6 space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />)}
          </div>
        ) : (
          <>
            {data && (
              <div className="rounded-lg border p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Wallet className="h-5 w-5 text-destructive" />
                  <p className="text-sm text-muted-foreground">Total em aberto</p>
                </div>
                <p className="text-2xl font-bold text-destructive">{formatCurrency(data.totalOpen)}</p>
              </div>
            )}

            {data?.byCustomer.length === 0 ? (
              <div className="text-center py-12">
                <Wallet className="mx-auto h-10 w-10 text-green-500 mb-3" />
                <p className="text-muted-foreground">Nenhum cliente com saldo em aberto.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data?.byCustomer.map(item => (
                  <Card
                    key={item.customer.id}
                    className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/apliques/clientes/${item.customer.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{item.customer.name}</p>
                        {item.customer.origin && (
                          <p className="text-xs text-muted-foreground">{item.customer.origin}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Pedidos: {formatCurrency(item.totalOrdered)} · Pago: {formatCurrency(item.totalPaid)}
                        </p>
                      </div>
                      <Badge variant="destructive" className="text-base font-bold px-3 py-1">
                        {formatCurrency(item.balance)}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
