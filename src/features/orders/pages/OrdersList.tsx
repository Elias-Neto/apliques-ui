import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ClipboardList, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Heading } from "@/components/ui/heading"
import { EmptyState } from "@/components/ui/empty-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { useFetchOrders } from "../hooks/use-fetch-orders"
import { useCreateOrder } from "../hooks/use-create-order"
import { useUpdateProductionStatus } from "../hooks/use-update-production-status"
import { useDeleteOrder } from "../hooks/use-delete-order"
import { OrderFilters } from "../components/OrderFilters"
import { OrderForm } from "../components/OrderForm"
import { TypeOrderCreateForm } from "../order.schema"
import { Order, ProductionStatus } from "../order.types"

const STATUS_LABELS: Record<ProductionStatus, string> = {
  'em-producao': 'Em produção',
  'pronto': 'Pronto',
  'entregue': 'Entregue',
}

const STATUS_VARIANTS: Record<ProductionStatus, 'default' | 'secondary' | 'outline'> = {
  'em-producao': 'default',
  'pronto': 'secondary',
  'entregue': 'outline',
}

const formatCurrency = (c: number) => (c / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const formatDate = (d: string) => new Date(d).toLocaleDateString('pt-BR')

interface Filters {
  productionStatus?: ProductionStatus
  dateFrom?: string
  dateTo?: string
}

export default function OrdersList() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<Filters>({})
  const { data, isLoading } = useFetchOrders(filters)
  const { mutate: createMutate, isPending: isCreating } = useCreateOrder()
  const { mutate: updateStatus } = useUpdateProductionStatus()
  const { mutate: deleteMutate } = useDeleteOrder()
  const [showCreate, setShowCreate] = useState(false)

  const handleCreate = (formData: TypeOrderCreateForm) => {
    createMutate(formData, { onSuccess: () => setShowCreate(false) })
  }

  const orders = data?.items ?? []

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Heading description="Acompanhe os pedidos em produção" showButton={false}>Produção</Heading>
        <div className="container mx-auto px-4 py-6 space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Heading
        description="Acompanhe os pedidos em produção"
        showButton
        buttonText="Novo Pedido"
        onButtonClick={() => setShowCreate(true)}
      >
        Produção
      </Heading>

      <div className="container mx-auto px-4 py-6 space-y-4">
        <OrderFilters onFilter={f => setFilters(f as Filters)} />

        {orders.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="Nenhum pedido encontrado"
            description="Cadastre o primeiro pedido para começar."
            buttonText="Novo Pedido"
            onButtonClick={() => setShowCreate(true)}
          />
        ) : (
          <div className="space-y-3">
            {orders.map((order: Order) => (
              <Card key={order.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => navigate(`/apliques/producao/${order.id}`)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{order.customer?.name ?? 'Cliente'}</span>
                      <Badge variant={STATUS_VARIANTS[order.productionStatus]}>
                        {STATUS_LABELS[order.productionStatus]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.items.reduce((sum, i) => sum + i.quantity, 0)} un · {formatCurrency(order.totalPrice)}
                      {order.orderDate && ` · ${formatDate(order.orderDate)}`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {order.items.map(i => i.material?.name ?? '').filter(Boolean).join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Select
                      value={order.productionStatus}
                      onValueChange={v => updateStatus({ id: order.id, status: v as ProductionStatus })}
                    >
                      <SelectTrigger className="w-36 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(STATUS_LABELS) as ProductionStatus[]).map(s => (
                          <SelectItem key={s} value={s} className="text-xs">{STATUS_LABELS[s]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive text-xs">
                          Excluir
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir pedido</AlertDialogTitle>
                          <AlertDialogDescription>
                            Excluir este pedido? Os pagamentos do cliente não serão afetados.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive hover:bg-destructive/90"
                            onClick={() => deleteMutate(order.id)}
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Novo Pedido</DialogTitle></DialogHeader>
          <OrderForm onSubmit={handleCreate} submitLabel="Criar Pedido" isLoading={isCreating} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
