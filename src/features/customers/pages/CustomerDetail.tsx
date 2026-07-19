import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Edit2, Plus, Trash2, Pencil, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useFetchCustomer } from "../hooks/use-fetch-customer"
import { useUpdateCustomer } from "../hooks/use-update-customer"
import { useAddPayment } from "../hooks/use-add-payment"
import { useUpdatePayment } from "../hooks/use-update-payment"
import { useDeletePayment } from "../hooks/use-delete-payment"
import { CustomerForm } from "../components/CustomerForm"
import { DesignsSection } from "../components/DesignsSection"
import { PaymentModal } from "../components/PaymentModal"
import { ExtratoClienteDialog } from "../components/ExtratoClienteDialog"
import { TypeCustomerUpdateForm } from "../customer.schema"
import { Payment } from "../payment.types"
import { Order } from "../customer.types"
import { PRODUCTION_STATUS_LABEL } from "@/features/orders/order.constants"

const formatCurrency = (centavos: number) =>
  (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const formatDate = (d: string) => new Date(d).toLocaleDateString('pt-BR')

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: customer, isLoading } = useFetchCustomer(id ?? null)
  const { mutate: updateMutate, isPending: isUpdating } = useUpdateCustomer()
  const { mutate: addPayment, isPending: isAdding } = useAddPayment()
  const { mutate: updatePayment, isPending: isUpdating2 } = useUpdatePayment()
  const { mutate: deletePayment } = useDeletePayment()

  const [showEdit, setShowEdit] = useState(false)
  const [showAddPayment, setShowAddPayment] = useState(false)
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null)
  const [showExtrato, setShowExtrato] = useState(false)

  const handleUpdate = (data: TypeCustomerUpdateForm) => {
    if (!id) return
    updateMutate({ id, data }, { onSuccess: () => setShowEdit(false) })
  }

  const handleAddPayment = (data: { amount: number; date?: string; observation?: string | null }) => {
    if (!id) return
    addPayment({ customerID: id, data }, { onSuccess: () => setShowAddPayment(false) })
  }

  const handleUpdatePayment = (data: { amount: number; date?: string; observation?: string | null }) => {
    if (!id || !editingPayment) return
    updatePayment({ customerID: id, id: editingPayment.id, data }, { onSuccess: () => setEditingPayment(null) })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-8 bg-gray-200 rounded animate-pulse" />)}
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="container mx-auto px-4 py-6">
        <p className="text-muted-foreground">Cliente não encontrado.</p>
        <Button variant="ghost" onClick={() => navigate('/apliques/clientes')} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
        </Button>
      </div>
    )
  }

  const payments = (customer as any).payments ?? []
  const orders: Order[] = (customer as any).orders ?? []
  const balance = Math.max(0, (customer as any).balance ?? 0)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/apliques/clientes')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold flex-1">{customer.name}</h1>
          <Button variant="outline" size="sm" onClick={() => setShowEdit(true)}>
            <Edit2 className="h-4 w-4 mr-1" /> Editar
          </Button>
        </div>

        {/* Info */}
        <div className="grid gap-3 sm:grid-cols-2">
          {customer.phone && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Telefone</p>
              <p className="font-medium">{customer.phone}</p>
            </div>
          )}
          {customer.origin && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Origem</p>
              <p className="font-medium">{customer.origin}</p>
            </div>
          )}
          {customer.observation && (
            <div className="sm:col-span-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Observação</p>
              <p className="font-medium">{customer.observation}</p>
            </div>
          )}
        </div>

        {/* Saldo (D2: derivado, max(0, real)) */}
        <div className="rounded-lg border p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Saldo devedor</p>
          <p className={`text-3xl font-bold ${balance > 0 ? 'text-destructive' : 'text-green-600'}`}>
            {formatCurrency(balance)}
          </p>
          {(customer as any).totalOrdered !== undefined && (
            <p className="text-xs text-muted-foreground">
              Total pedidos: {formatCurrency((customer as any).totalOrdered)} ·
              Total pago: {formatCurrency((customer as any).totalPaid ?? 0)}
            </p>
          )}
        </div>

        {/* Gerar extrato (PRD-02) — desabilitado sem nenhum pedido histórico */}
        <Button
          className="w-full bg-slate-800 hover:bg-slate-700"
          disabled={orders.length === 0}
          onClick={() => setShowExtrato(true)}
        >
          <FileText className="h-4 w-4 mr-2" /> Gerar extrato
        </Button>

        {/* Pagamentos (ledger do cliente) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Pagamentos</h3>
            <Button size="sm" variant="outline" onClick={() => setShowAddPayment(true)}>
              <Plus className="h-4 w-4 mr-1" /> Registrar pagamento
            </Button>
          </div>

          {payments.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum pagamento registrado.</p>
          ) : (
            <ul className="divide-y divide-border rounded-md border">
              {payments.map((p: Payment) => (
                <li key={p.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="font-medium">{formatCurrency(p.amount)}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(p.date)}{p.observation ? ` · ${p.observation}` : ''}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => setEditingPayment(p)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remover pagamento</AlertDialogTitle>
                          <AlertDialogDescription>
                            Remover pagamento de {formatCurrency(p.amount)}? O saldo será recalculado automaticamente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive hover:bg-destructive/90"
                            onClick={() => deletePayment({ customerID: id!, id: p.id })}
                          >
                            Remover
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Desenhos */}
        {id && <DesignsSection customerID={id} />}

        {/* Pedidos */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'}
          </h3>
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum pedido registrado.</p>
          ) : (
            <ul className="divide-y divide-border rounded-md border">
              {orders.map((o, i) => {
                const totalQty = o.items.reduce((sum, item) => sum + item.quantity, 0)
                return (
                  <li
                    key={o._id ?? i}
                    className="px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => navigate(`/apliques/producao/${o._id}`)}
                  >
                    <p className="font-medium">
                      {formatDate(o.orderDate)} · {totalQty} un · {formatCurrency(o.totalPrice)}
                    </p>
                    <p className="text-xs text-muted-foreground">{PRODUCTION_STATUS_LABEL[o.productionStatus]}</p>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Editar Cliente</DialogTitle></DialogHeader>
          <CustomerForm initialData={customer} onSubmit={handleUpdate} submitLabel="Salvar" isLoading={isUpdating} />
        </DialogContent>
      </Dialog>

      <PaymentModal
        open={showAddPayment}
        onOpenChange={setShowAddPayment}
        onSubmit={handleAddPayment}
        isLoading={isAdding}
        title="Registrar Pagamento"
        balance={balance}
      />

      <PaymentModal
        open={!!editingPayment}
        onOpenChange={v => { if (!v) setEditingPayment(null) }}
        onSubmit={handleUpdatePayment}
        isLoading={isUpdating2}
        title="Editar Pagamento"
        initial={editingPayment ?? undefined}
        balance={balance}
      />

      <ExtratoClienteDialog customer={customer} open={showExtrato} onOpenChange={setShowExtrato} />
    </div>
  )
}
