import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowDown, ArrowUp, ArrowUpDown, ClipboardList, Trash2 } from "lucide-react"
import { Heading } from "@/components/ui/heading"
import { EmptyState } from "@/components/ui/empty-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination"
import { useFetchOrders } from "../hooks/use-fetch-orders"
import { useUpdateProductionStatus } from "../hooks/use-update-production-status"
import { useDeleteOrder } from "../hooks/use-delete-order"
import { OrderFilters as OrderFiltersForm } from "../components/OrderFilters"
import { Order, OrderSortDir, OrderSortField, ProductionStatus } from "../order.types"
import { OrderFilters } from "../order.service"
import { PRODUCTION_STATUS_BADGE_CLASSES, PRODUCTION_STATUS_LABEL } from "../order.constants"

const PAGE_SIZE = 20

const formatCurrency = (c: number) => (c / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const formatDate = (d: string) => new Date(d).toLocaleDateString('pt-BR')
const materialsSummary = (order: Order) =>
  Array.from(new Set(order.items.map(i => i.material?.name).filter(Boolean))).join(', ')
const orderQuantity = (order: Order) => order.items.reduce((sum, i) => sum + i.quantity, 0)

type SortState = { field: OrderSortField; dir: OrderSortDir }

interface SortableHeadProps {
  label: string
  sortKey: OrderSortField
  sort: SortState | null
  onToggle: (key: OrderSortField) => void
}

const SortableHead = ({ label, sortKey, sort, onToggle }: SortableHeadProps) => {
  const active = sort?.field === sortKey
  const Icon = active && sort ? (sort.dir === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown
  return (
    <TableHead>
      <button
        type="button"
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => onToggle(sortKey)}
      >
        {label}
        <Icon className={`w-3.5 h-3.5 ${active ? '' : 'text-muted-foreground/50'}`} />
      </button>
    </TableHead>
  )
}

interface StatusSelectProps {
  order: Order
  onChange: (status: ProductionStatus) => void
}

const StatusSelect = ({ order, onChange }: StatusSelectProps) => (
  <Select value={order.productionStatus} onValueChange={v => onChange(v as ProductionStatus)}>
    <SelectTrigger
      className={cn("w-36 h-8 text-xs font-medium", PRODUCTION_STATUS_BADGE_CLASSES[order.productionStatus])}
      onClick={e => e.stopPropagation()}
    >
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {(Object.keys(PRODUCTION_STATUS_LABEL) as ProductionStatus[]).map(s => (
        <SelectItem key={s} value={s} className={cn("text-xs font-medium my-0.5", PRODUCTION_STATUS_BADGE_CLASSES[s])}>
          {PRODUCTION_STATUS_LABEL[s]}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
)

interface DeleteOrderButtonProps {
  onConfirm: () => void
}

const DeleteOrderButton = ({ onConfirm }: DeleteOrderButtonProps) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button
        size="icon"
        variant="ghost"
        title="Excluir pedido"
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={e => e.stopPropagation()}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent onClick={e => e.stopPropagation()}>
      <AlertDialogHeader>
        <AlertDialogTitle>Excluir pedido</AlertDialogTitle>
        <AlertDialogDescription>
          Excluir este pedido? Os pagamentos do cliente não serão afetados.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={onConfirm}>
          Excluir
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
)

type BaseFilters = Omit<OrderFilters, 'limit' | 'offset' | 'sortBy' | 'sortDir'>

export default function OrdersList() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<BaseFilters>({})
  const [sort, setSort] = useState<SortState | null>(null)
  const [page, setPage] = useState(1)
  const { data, isLoading } = useFetchOrders({
    ...filters,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
    sortBy: sort?.field,
    sortDir: sort?.dir,
  })
  const { mutate: updateStatus } = useUpdateProductionStatus()
  const { mutate: deleteMutate } = useDeleteOrder()

  const handleFilter = (f: BaseFilters) => {
    setFilters(f)
    setPage(1)
  }

  const toggleSort = (field: OrderSortField) => {
    setSort(prev => (prev?.field === field
      ? { field, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
      : { field, dir: 'asc' }))
    setPage(1)
  }

  const orders = data?.items ?? []
  const total = data?.total ?? 0
  const pageStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const pageEnd = Math.min(page * PAGE_SIZE, total)
  const hasPrevPage = page > 1
  const hasNextPage = page * PAGE_SIZE < total

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
        onButtonClick={() => navigate('/apliques/producao/novo')}
      >
        Produção
      </Heading>

      <div className="container mx-auto px-4 py-6 space-y-4">
        <OrderFiltersForm onFilter={handleFilter} />

        {orders.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="Nenhum pedido encontrado"
            description="Cadastre o primeiro pedido para começar."
            buttonText="Novo Pedido"
            onButtonClick={() => navigate('/apliques/producao/novo')}
          />
        ) : (
          <>
            {/* Desktop/tablet largo (>=768px) — tabela */}
            <div className="hidden md:block border rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <SortableHead label="Qtd." sortKey="quantity" sort={sort} onToggle={toggleSort} />
                    <SortableHead label="Valor" sortKey="totalPrice" sort={sort} onToggle={toggleSort} />
                    <SortableHead label="Data" sortKey="orderDate" sort={sort} onToggle={toggleSort} />
                    <TableHead>Materiais</TableHead>
                    <TableHead className="w-40">Etapa</TableHead>
                    <TableHead className="w-20" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order: Order) => (
                    <TableRow
                      key={order.id}
                      className="cursor-pointer"
                      onClick={() => navigate(`/apliques/producao/${order.id}`)}
                    >
                      <TableCell className="font-semibold">{order.customer?.name ?? 'Cliente'}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {orderQuantity(order)} un
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(order.totalPrice)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {order.orderDate ? formatDate(order.orderDate) : '—'}
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-[200px] truncate">
                        {materialsSummary(order)}
                      </TableCell>
                      <TableCell>
                        <StatusSelect
                          order={order}
                          onChange={status => updateStatus({ id: order.id, status })}
                        />
                      </TableCell>
                      <TableCell>
                        <DeleteOrderButton onConfirm={() => deleteMutate(order.id)} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile (<768px) — cards */}
            <div className="md:hidden space-y-3">
              {orders.map((order: Order) => (
                <Card key={order.id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => navigate(`/apliques/producao/${order.id}`)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{order.customer?.name ?? 'Cliente'}</span>
                        <Badge variant="outline" className={PRODUCTION_STATUS_BADGE_CLASSES[order.productionStatus]}>
                          {PRODUCTION_STATUS_LABEL[order.productionStatus]}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {orderQuantity(order)} un · {formatCurrency(order.totalPrice)}
                        {order.orderDate && ` · ${formatDate(order.orderDate)}`}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {materialsSummary(order)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusSelect
                        order={order}
                        onChange={status => updateStatus({ id: order.id, status })}
                      />
                      <DeleteOrderButton onConfirm={() => deleteMutate(order.id)} />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-muted-foreground">
                {pageStart}–{pageEnd} de {total} pedidos
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
      </div>
    </div>
  )
}
