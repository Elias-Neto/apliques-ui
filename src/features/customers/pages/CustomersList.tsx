import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Users } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Heading } from "@/components/ui/heading"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination"
import { SortableTableHead } from "@/components/ui/sortable-table-head"
import { useFetchCustomers } from "../hooks/use-fetch-customers"
import { useCreateCustomer } from "../hooks/use-create-customer"
import { useDeleteCustomer } from "../hooks/use-delete-customer"
import { CustomerForm } from "../components/CustomerForm"
import { TypeCustomerCreateForm } from "../customer.schema"
import { CustomerListItem } from "../customer.types"
import { CustomerSortDir, CustomerSortField } from "../customer.service"

const PAGE_SIZE = 20

const formatCurrency = (centavos: number) =>
  (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

type SortState = { field: CustomerSortField; dir: CustomerSortDir }

export default function CustomersList() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortState | null>(null)
  const [page, setPage] = useState(1)

  const { data, isLoading } = useFetchCustomers({
    search: search.trim() || undefined,
    sortBy: sort?.field,
    sortDir: sort?.dir,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  })
  const { mutate: createMutate, isPending: isCreating } = useCreateCustomer()
  const { mutate: deleteMutate } = useDeleteCustomer()
  const [showCreate, setShowCreate] = useState(false)

  const handleCreate = (data: TypeCustomerCreateForm) => {
    createMutate(data, { onSuccess: () => setShowCreate(false) })
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const toggleSort = (field: CustomerSortField) => {
    setSort(prev => (prev?.field === field
      ? { field, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
      : { field, dir: 'asc' }))
    setPage(1)
  }

  const items = data?.items ?? []
  const total = data?.total ?? 0
  const searchActive = search.trim().length > 0
  const pageStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const pageEnd = Math.min(page * PAGE_SIZE, total)
  const hasPrevPage = page > 1
  const hasNextPage = page * PAGE_SIZE < total

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

      <div className="container mx-auto px-4 py-6 space-y-4">
        {!searchActive && total === 0 ? (
          <EmptyState
            icon={Users}
            title="Nenhum cliente cadastrado"
            description="Cadastre o primeiro cliente para começar."
            buttonText="Cadastrar Cliente"
            onButtonClick={() => setShowCreate(true)}
          />
        ) : (
          <>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome"
                value={search}
                onChange={e => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {items.length === 0 ? (
              <EmptyState
                icon={Users}
                title="Nenhum cliente encontrado"
                description="Nenhum cliente corresponde a essa busca."
                buttonText="Limpar busca"
                onButtonClick={() => handleSearch('')}
              />
            ) : (
              <>
                {/* Desktop/tablet largo (>=768px) — tabela */}
                <div className="hidden md:block border rounded-xl overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <SortableTableHead label="Nome" sortKey="name" sort={sort} onToggle={toggleSort} />
                        <TableHead>Origem</TableHead>
                        <SortableTableHead label="Pedidos" sortKey="ordersCount" sort={sort} onToggle={toggleSort} />
                        <SortableTableHead label="Saldo" sortKey="balance" sort={sort} onToggle={toggleSort} />
                        <TableHead className="w-24" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((customer: CustomerListItem) => (
                        <TableRow
                          key={customer.id}
                          className="cursor-pointer"
                          onClick={() => navigate(`/apliques/clientes/${customer.id}`)}
                        >
                          <TableCell className="font-semibold">{customer.name}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {customer.origin ?? '—'}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {customer.ordersCount} pedido{customer.ordersCount !== 1 ? 's' : ''}
                          </TableCell>
                          <TableCell>
                            {customer.balance > 0 ? (
                              <Badge variant="destructive" className="font-bold">
                                {formatCurrency(customer.balance)}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell onClick={e => e.stopPropagation()}>
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
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile (<768px) — cards */}
                <div className="md:hidden grid gap-4">
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

                <div className="flex items-center justify-between pt-2">
                  <p className="text-sm text-muted-foreground">
                    {pageStart}–{pageEnd} de {total} clientes
                  </p>
                  <Pagination className="mx-0 w-auto">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => hasPrevPage && setPage(p => p - 1)}
                          className={hasPrevPage ? 'cursor-pointer' : 'pointer-events-none opacity-50'}
                        />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => hasNextPage && setPage(p => p + 1)}
                          className={hasNextPage ? 'cursor-pointer' : 'pointer-events-none opacity-50'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </>
            )}
          </>
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
