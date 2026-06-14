import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Users } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Heading } from "@/components/ui/heading"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useFetchCustomers } from "../hooks/use-fetch-customers"
import { useCreateCustomer } from "../hooks/use-create-customer"
import { useDeleteCustomer } from "../hooks/use-delete-customer"
import { CustomerForm } from "../components/CustomerForm"
import { TypeCustomerCreateForm } from "../customer.schema"
import { CustomerListItem } from "../customer.types"

const formatCurrency = (centavos: number) =>
  (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function CustomersList() {
  const navigate = useNavigate()
  const { data, isLoading } = useFetchCustomers()
  const { mutate: createMutate, isPending: isCreating } = useCreateCustomer()
  const { mutate: deleteMutate } = useDeleteCustomer()
  const [showCreate, setShowCreate] = useState(false)

  const handleCreate = (data: TypeCustomerCreateForm) => {
    createMutate(data, { onSuccess: () => setShowCreate(false) })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Heading description="Gerencie seus clientes" showButton={false}>Clientes</Heading>
        <div className="container mx-auto px-4 py-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-28 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const items = data?.items ?? []

  return (
    <div className="min-h-screen bg-background">
      <Heading
        description="Gerencie seus clientes"
        showButton
        buttonText="Novo Cliente"
        onButtonClick={() => setShowCreate(true)}
      >
        Clientes
      </Heading>

      <div className="container mx-auto px-4 py-6">
        {items.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Nenhum cliente cadastrado"
            description="Cadastre o primeiro cliente para começar."
            buttonText="Cadastrar Cliente"
            onButtonClick={() => setShowCreate(true)}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((customer: CustomerListItem) => (
              <Card key={customer.id} className="p-4 hover:shadow-md transition-shadow">
                <div
                  className="flex-1 cursor-pointer mb-3"
                  onClick={() => navigate(`/apliques/clientes/${customer.id}`)}
                >
                  <h3 className="font-semibold text-lg">{customer.name}</h3>
                  {customer.origin && (
                    <p className="text-sm text-muted-foreground">{customer.origin}</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{customer.ordersCount} pedido{customer.ordersCount !== 1 ? 's' : ''}</Badge>
                    {customer.balance > 0 && (
                      <Badge variant="destructive">{formatCurrency(customer.balance)} em aberto</Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate(`/apliques/clientes/${customer.id}`)}
                  >
                    Ver ficha
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                        Excluir
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir cliente</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir {customer.name}? Clientes com pedidos, pagamentos ou desenhos não podem ser excluídos.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive hover:bg-destructive/90"
                          onClick={() => deleteMutate(customer.id)}
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Novo Cliente</DialogTitle></DialogHeader>
          <CustomerForm onSubmit={handleCreate} submitLabel="Cadastrar" isLoading={isCreating} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
