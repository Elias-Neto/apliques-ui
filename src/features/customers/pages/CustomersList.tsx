import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Pencil, Search, Trash2, Users } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Heading } from "@/components/ui/heading"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { FilterLayout, FilterChip } from "@/components/filters/FilterLayout"
import { SortableTableHead } from "@/components/ui/sortable-table-head"
import { useFetchCustomers } from "../hooks/use-fetch-customers"
import { useCreateCustomer } from "../hooks/use-create-customer"
import { useDeleteCustomer } from "../hooks/use-delete-customer"
import { useUpdateCustomer } from "../hooks/use-update-customer"
import { useFetchCustomer } from "../hooks/use-fetch-customer"
import { useCustomerOrigins } from "../hooks/use-customer-origins"
import { CustomerForm } from "../components/CustomerForm"
import { TypeCustomerCreateForm } from "../customer.schema"
import { CustomerListItem } from "../customer.types"
import { CustomerSortDir, CustomerSortField } from "../customer.service"

const PAGE_SIZE = 20

const formatCurrency = (centavos: number) =>
  (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

// Range de Pedidos é número puro; range de Saldo é R$ → centavos. Vazio = sem filtro (não 0),
// mesma semântica dos filtros da tela de produção.
const toUnits = (value: string): number | undefined => {
  if (!value) return undefined
  const parsed = parseInt(value, 10)
  return Number.isNaN(parsed) ? undefined : parsed
}

const toCents = (value: string): number | undefined => {
  if (!value) return undefined
  const cents = Math.round(parseFloat(value.replace(',', '.')) * 100)
  return Number.isNaN(cents) ? undefined : cents
}

interface RangeFilters {
  origin: string
  ordersCountMin: string
  ordersCountMax: string
  balanceMin: string
  balanceMax: string
}

const EMPTY_FILTERS: RangeFilters = {
  origin: 'all',
  ordersCountMin: '',
  ordersCountMax: '',
  balanceMin: '',
  balanceMax: '',
}

type SortState = { field: CustomerSortField; dir: CustomerSortDir }

export default function CustomersList() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortState | null>(null)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<RangeFilters>(EMPTY_FILTERS)
  const [editingID, setEditingID] = useState<string | null>(null)

  const { data: origins = [] } = useCustomerOrigins()
  const { data: editingCustomer } = useFetchCustomer(editingID)
  const { mutate: updateMutate, isPending: isUpdating } = useUpdateCustomer()

  const { data, isLoading } = useFetchCustomers({
    search: search.trim() || undefined,
    origin: filters.origin === 'all' ? undefined : filters.origin,
    ordersCountMin: toUnits(filters.ordersCountMin),
    ordersCountMax: toUnits(filters.ordersCountMax),
    balanceMin: toCents(filters.balanceMin),
    balanceMax: toCents(filters.balanceMax),
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

  const handleUpdate = (form: TypeCustomerCreateForm) => {
    if (!editingID) return
    updateMutate({ id: editingID, data: form }, { onSuccess: () => setEditingID(null) })
  }

  const setFilter = (patch: Partial<RangeFilters>) => {
    setFilters(prev => ({ ...prev, ...patch }))
    setPage(1)
  }

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS)
    setSearch('')
    setPage(1)
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

  const rangeLabel = (name: string, min: string, max: string) =>
    min && max ? `${name} ${min}–${max}` : min ? `${name} ≥ ${min}` : `${name} ≤ ${max}`
  const chips: FilterChip[] = []
  if (filters.origin !== 'all') chips.push({ key: 'origin', label: filters.origin, onRemove: () => setFilter({ origin: 'all' }) })
  if (filters.ordersCountMin || filters.ordersCountMax) chips.push({ key: 'orders', label: rangeLabel('Pedidos', filters.ordersCountMin, filters.ordersCountMax), onRemove: () => setFilter({ ordersCountMin: '', ordersCountMax: '' }) })
  if (filters.balanceMin || filters.balanceMax) chips.push({ key: 'balance', label: rangeLabel('Saldo R$', filters.balanceMin, filters.balanceMax), onRemove: () => setFilter({ balanceMin: '', balanceMax: '' }) })

  const items = data?.items ?? []
  const total = data?.total ?? 0
  const filtersActive = JSON.stringify(filters) !== JSON.stringify(EMPTY_FILTERS)
  const searchActive = search.trim().length > 0 || filtersActive
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
            <FilterLayout
                      onClear={clearFilters}
              chips={chips}
              search={
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    aria-label="Buscar por nome"
                    placeholder="Buscar por nome"
                    value={search}
                    onChange={e => handleSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
              }
            >

              <div className="space-y-1 col-span-2 md:col-span-1 md:min-w-[160px]">
                <Label className="text-xs">De onde?</Label>
                <Select value={filters.origin} onValueChange={v => setFilter({ origin: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os lugares" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os lugares</SelectItem>
                    {origins.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1 md:w-auto">
                <Label htmlFor="customer-filter-orders-min" className="text-xs">Pedidos de</Label>
                <Input
                  id="customer-filter-orders-min"
                  type="number" step="1" min={0} placeholder="0"
                  value={filters.ordersCountMin}
                  onChange={e => setFilter({ ordersCountMin: e.target.value })}
                  className="w-full md:w-28"
                />
              </div>

              <div className="space-y-1 md:w-auto">
                <Label htmlFor="customer-filter-orders-max" className="text-xs">até</Label>
                <Input
                  id="customer-filter-orders-max"
                  type="number" step="1" min={0} placeholder="0"
                  value={filters.ordersCountMax}
                  onChange={e => setFilter({ ordersCountMax: e.target.value })}
                  className="w-full md:w-28"
                />
              </div>

              <div className="space-y-1 md:w-auto">
                <Label htmlFor="customer-filter-balance-min" className="text-xs">Saldo de (R$)</Label>
                <Input
                  id="customer-filter-balance-min"
                  type="number" step="0.01" min={0} placeholder="0,00"
                  value={filters.balanceMin}
                  onChange={e => setFilter({ balanceMin: e.target.value })}
                  className="w-full md:w-32"
                />
              </div>

              <div className="space-y-1 md:w-auto">
                <Label htmlFor="customer-filter-balance-max" className="text-xs">até</Label>
                <Input
                  id="customer-filter-balance-max"
                  type="number" step="0.01" min={0} placeholder="0,00"
                  value={filters.balanceMax}
                  onChange={e => setFilter({ balanceMax: e.target.value })}
                  className="w-full md:w-32"
                />
              </div>
            </FilterLayout>

            {items.length === 0 ? (
              <EmptyState
                icon={Users}
                title="Nenhum cliente encontrado"
                description="Nenhum cliente corresponde aos filtros."
                buttonText="Limpar filtros"
                onButtonClick={clearFilters}
              />
            ) : (
              <>
                {/* Desktop/tablet largo (>=768px) — tabela */}
                <div className="hidden md:block border rounded-xl overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <SortableTableHead label="Nome" sortKey="name" sort={sort} onToggle={toggleSort} />
                        <TableHead>De onde?</TableHead>
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
                            <div className="flex gap-1 justify-end">
                            <Button size="icon" variant="ghost" aria-label={`Editar ${customer.name}`} onClick={() => setEditingID(customer.id)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="icon" variant="ghost" aria-label={`Excluir ${customer.name}`} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                  <Trash2 className="h-4 w-4" />
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
                        <Button size="icon" variant="ghost" aria-label={`Editar ${customer.name}`} onClick={() => setEditingID(customer.id)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="icon" variant="ghost" aria-label={`Excluir ${customer.name}`} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                              <Trash2 className="h-4 w-4" />
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

      <Dialog open={!!editingID} onOpenChange={open => !open && setEditingID(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Editar Cliente</DialogTitle></DialogHeader>
          {editingCustomer && editingCustomer.id === editingID ? (
            <CustomerForm
              key={editingCustomer.id}
              initialData={editingCustomer}
              onSubmit={handleUpdate}
              submitLabel="Salvar"
              isLoading={isUpdating}
            />
          ) : (
            <div className="h-40 bg-gray-200 rounded animate-pulse" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
