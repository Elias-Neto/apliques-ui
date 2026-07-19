import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Edit2, Receipt } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useFetchOrder } from "../hooks/use-fetch-order"
import { useUpdateOrder } from "../hooks/use-update-order"
import { useUpdateProductionStatus } from "../hooks/use-update-production-status"
import { useDeleteOrder } from "../hooks/use-delete-order"
import { OrderForm } from "../components/OrderForm"
import { NotinhaPedidoDialog } from "../components/NotinhaPedidoDialog"
import { ProductionStatus } from "../order.types"
import { PRODUCTION_STATUS_LABEL } from "../order.constants"
import { TypeOrderCreateForm } from "../order.schema"

const STATUS_VARIANTS: Record<ProductionStatus, 'default' | 'secondary' | 'outline'> = {
  'em-producao': 'default',
  'pronto': 'secondary',
  'entregue': 'outline',
}

const formatCurrency = (c: number) => (c / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const formatDate = (d: string) => new Date(d).toLocaleDateString('pt-BR')

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: order, isLoading } = useFetchOrder(id ?? null)
  const { mutate: updateOrder, isPending: isUpdating } = useUpdateOrder()
  const { mutate: updateStatus } = useUpdateProductionStatus()
  const { mutate: deleteOrder } = useDeleteOrder()
  const [showEdit, setShowEdit] = useState(false)
  const [showNotinha, setShowNotinha] = useState(false)

  const handleUpdate = (data: TypeOrderCreateForm) => {
    if (!id) return
    updateOrder({ id, data }, { onSuccess: () => setShowEdit(false) })
  }

  const handleDelete = () => {
    if (!id) return
    deleteOrder(id, { onSuccess: () => navigate('/apliques/producao') })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-4 max-w-2xl">
        {[...Array(5)].map((_, i) => <div key={i} className="h-8 bg-gray-200 rounded animate-pulse" />)}
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-6">
        <p className="text-muted-foreground">Pedido não encontrado.</p>
        <Button variant="ghost" onClick={() => navigate('/apliques/producao')} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-2xl space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">
              {order.customer?.name ?? 'Pedido'}
            </h1>
            <p className="text-sm text-muted-foreground">{formatDate(order.orderDate)}</p>
          </div>
          <Badge variant={STATUS_VARIANTS[order.productionStatus]}>
            {PRODUCTION_STATUS_LABEL[order.productionStatus]}
          </Badge>
        </div>

        {/* Itens */}
        <div className="rounded-md border divide-y divide-border">
          {order.items.map((item, i) => (
            <div key={i} className="px-4 py-3 space-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {item.material?.name ?? '—'} · {item.color?.name ?? '—'}
                  </p>
                  {item.design?.name && (
                    <p className="text-xs text-muted-foreground">{item.design.name}</p>
                  )}
                </div>
                <div className="text-right text-sm">
                  <p className="font-medium">{formatCurrency(item.unitPrice * item.quantity)}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.quantity} un × {formatCurrency(item.unitPrice)}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div className="px-4 py-3 flex items-center justify-between bg-muted/30">
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Total</span>
            <span className="text-lg font-bold">{formatCurrency(order.totalPrice)}</span>
          </div>
        </div>

        {/* Observação */}
        {order.observation && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Observação</p>
            <p className="text-sm">{order.observation}</p>
          </div>
        )}

        {/* Etapa de produção */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Etapa de produção</p>
          <Select
            value={order.productionStatus}
            onValueChange={v => updateStatus({ id: order.id, status: v as ProductionStatus })}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(PRODUCTION_STATUS_LABEL) as ProductionStatus[]).map(s => (
                <SelectItem key={s} value={s}>{PRODUCTION_STATUS_LABEL[s]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Ações */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowEdit(true)}>
            <Edit2 className="h-4 w-4 mr-2" /> Editar pedido
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="text-destructive hover:text-destructive">
                Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir pedido?</AlertDialogTitle>
                <AlertDialogDescription>
                  Os pagamentos do cliente não serão afetados. O saldo devedor será recalculado automaticamente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive hover:bg-destructive/90"
                  onClick={handleDelete}
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Gerar notinha (PRD-02) */}
        <Button
          className="w-full bg-slate-800 hover:bg-slate-700"
          onClick={() => setShowNotinha(true)}
        >
          <Receipt className="h-4 w-4 mr-2" /> Gerar notinha
        </Button>

        {/* Link pro cliente */}
        <div>
          <Button
            variant="link"
            className="px-0 text-muted-foreground"
            onClick={() => navigate(`/apliques/clientes/${order.customerID}`)}
          >
            Ver ficha de {order.customer?.name ?? 'cliente'} →
          </Button>
        </div>

      </div>

      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Pedido</DialogTitle>
          </DialogHeader>
          <OrderForm
            initialData={order}
            onSubmit={handleUpdate}
            submitLabel="Salvar"
            isLoading={isUpdating}
          />
        </DialogContent>
      </Dialog>

      <NotinhaPedidoDialog order={order} open={showNotinha} onOpenChange={setShowNotinha} />
    </div>
  )
}
