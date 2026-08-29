import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Check, Edit2, Receipt, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useFetchOrder } from "../hooks/use-fetch-order"
import { useUpdateProductionStatus } from "../hooks/use-update-production-status"
import { useDeleteOrder } from "../hooks/use-delete-order"
import { NotinhaPedidoDialog } from "../components/NotinhaPedidoDialog"
import { ProductionStatus } from "../order.types"
import { PRODUCTION_STATUS_ACTIVE_CLASSES, PRODUCTION_STATUS_BADGE_CLASSES, PRODUCTION_STATUS_LABEL } from "../order.constants"
import { cn } from "@/lib/utils"

const formatCurrency = (c: number) => (c / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const formatDate = (d: string) => new Date(d).toLocaleDateString('pt-BR')

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: order, isLoading } = useFetchOrder(id ?? null)
  const { mutate: updateStatus } = useUpdateProductionStatus()
  const { mutate: deleteOrder } = useDeleteOrder()
  const [showNotinha, setShowNotinha] = useState(false)

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

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 text-destructive hover:text-destructive hover:bg-destructive/10"
                title="Excluir pedido"
              >
                <Trash2 className="h-5 w-5" />
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
          <ToggleGroup
            type="single"
            value={order.productionStatus}
            onValueChange={v => {
              if (!v) return // Radix desmarca ao clicar no item já ativo — etapa nunca é opcional
              updateStatus({ id: order.id, status: v as ProductionStatus })
            }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full"
          >
            {(Object.keys(PRODUCTION_STATUS_LABEL) as ProductionStatus[]).map(s => (
              <ToggleGroupItem
                key={s}
                value={s}
                className={cn(
                  PRODUCTION_STATUS_BADGE_CLASSES[s],
                  "h-12 flex-1 rounded-full border-2 border-transparent font-medium data-[state=on]:font-semibold",
                  PRODUCTION_STATUS_ACTIVE_CLASSES[s]
                )}
              >
                {order.productionStatus === s && <Check className="h-4 w-4" />}
                {PRODUCTION_STATUS_LABEL[s]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        {/* Ações */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/apliques/producao/${id}/editar`)}>
            <Edit2 className="h-4 w-4 mr-2" /> Editar pedido
          </Button>

          {/* Gerar notinha (PRD-02) */}
          <Button
            className="flex-1 bg-slate-800 hover:bg-slate-700"
            onClick={() => setShowNotinha(true)}
          >
            <Receipt className="h-4 w-4 mr-2" /> Gerar notinha
          </Button>
        </div>

      </div>

      <NotinhaPedidoDialog order={order} open={showNotinha} onOpenChange={setShowNotinha} />
    </div>
  )
}
