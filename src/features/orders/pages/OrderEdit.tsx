import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OrderForm } from "../components/OrderForm"
import { useFetchOrder } from "../hooks/use-fetch-order"
import { useUpdateOrder } from "../hooks/use-update-order"
import { TypeOrderCreateForm } from "../order.schema"

export default function OrderEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: order, isLoading } = useFetchOrder(id ?? null)
  const { mutate: updateMutate, isPending: isUpdating } = useUpdateOrder()

  const handleUpdate = (data: TypeOrderCreateForm) => {
    if (!id) return
    // customerID não é editável (AC-08) — a API rejeita esse campo no PATCH.
    // OrderForm é compartilhado com a criação e sempre inclui customerID; removemos aqui.
    const { orderDate, items, observation } = data
    updateMutate({ id, data: { orderDate, items, observation } }, { onSuccess: () => navigate(`/apliques/producao/${id}`) })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-4 max-w-lg">
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
      <div className="container mx-auto px-4 py-6 max-w-lg space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/apliques/producao/${id}`)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Editar pedido</h1>
        </div>

        <OrderForm
          initialData={order}
          onSubmit={handleUpdate}
          onCancel={() => navigate(`/apliques/producao/${id}`)}
          submitLabel="Salvar"
          isLoading={isUpdating}
        />
      </div>
    </div>
  )
}
