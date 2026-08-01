import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OrderForm } from "../components/OrderForm"
import { useCreateOrder } from "../hooks/use-create-order"
import { TypeOrderCreateForm } from "../order.schema"

export default function OrderNew() {
  const navigate = useNavigate()
  const { mutate: createMutate, isPending: isCreating } = useCreateOrder()

  const handleCreate = (formData: TypeOrderCreateForm) => {
    createMutate(formData, { onSuccess: () => navigate('/apliques/producao') })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-lg space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/apliques/producao')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Novo pedido</h1>
        </div>

        <OrderForm
          onSubmit={handleCreate}
          onCancel={() => navigate('/apliques/producao')}
          submitLabel="Criar Pedido"
          isLoading={isCreating}
        />
      </div>
    </div>
  )
}
