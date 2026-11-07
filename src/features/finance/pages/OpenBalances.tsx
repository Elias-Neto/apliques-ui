import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Wallet } from "lucide-react"
import { Heading } from "@/components/ui/heading"
import { EmptyState } from "@/components/ui/empty-state"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination"
import { SortableTableHead } from "@/components/ui/sortable-table-head"
import { useOpenBalances } from "../hooks/use-open-balances"
import { FinanceFilters } from "../components/FinanceFilters"
import { CustomerBalance, FinanceFilters as FinanceFiltersState, FinanceSortDir, FinanceSortField } from "../finance.service"

const PAGE_SIZE = 20

const formatCurrency = (c: number) =>
  (c / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

type SortState = { field: FinanceSortField; dir: FinanceSortDir }

export default function OpenBalances() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<FinanceFiltersState>({})
  const [sort, setSort] = useState<SortState | null>(null)
  const [page, setPage] = useState(1)

  const { data, isLoading } = useOpenBalances({
    ...filters,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
    sortBy: sort?.field,
    sortDir: sort?.dir,
  })

  const handleFilter = (f: FinanceFiltersState) => {
    setFilters(f)
    setPage(1)
  }

  const toggleSort = (field: FinanceSortField) => {
    setSort(prev => (prev?.field === field
      ? { field, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
      : { field, dir: 'asc' }))
    setPage(1)
  }

  const items = data?.items ?? []
  const total = data?.total ?? 0
  const totalOpen = data?.totalOpen ?? 0
  const hasAnyFilter = Boolean(
    filters.search || filters.orderedMin !== undefined || filters.orderedMax !== undefined
    || filters.balanceMin !== undefined || filters.balanceMax !== undefined,
  )
  const pageStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const pageEnd = Math.min(page * PAGE_SIZE, total)
  const hasPrevPage = page > 1
  const hasNextPage = page * PAGE_SIZE < total

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Heading description="Clientes com saldo em aberto" showButton={false}>Financeiro</Heading>
        <div className="container mx-auto px-4 py-6 space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Heading description="Clientes com saldo em aberto" showButton={false}>
        Financeiro
      </Heading>

      <div className="container mx-auto px-4 py-6 space-y-4">
        <div className="rounded-lg border p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wallet className="h-5 w-5 text-destructive" />
            <p className="text-sm text-muted-foreground">Total em aberto</p>
          </div>
          <p className="text-2xl font-bold text-destructive">{formatCurrency(totalOpen)}</p>
        </div>

        {!hasAnyFilter && total === 0 ? (
          <div className="text-center py-12">
            <Wallet className="mx-auto h-10 w-10 text-green-500 mb-3" />
            <p className="text-muted-foreground">Nenhum cliente com saldo em aberto.</p>
          </div>
        ) : (
          <>
            <FinanceFilters onFilter={handleFilter} />

            {items.length === 0 ? (
              <EmptyState
                icon={Wallet}
                title="Nenhum cliente encontrado"
                description="Nenhum cliente com saldo em aberto corresponde a esse filtro."
                buttonText="Limpar filtros"
                onButtonClick={() => handleFilter({})}
              />
            ) : (
              <>
                {/* Desktop/tablet largo (>=768px) — tabela */}
                <div className="hidden md:block border rounded-xl overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <SortableTableHead label="Cliente" sortKey="name" sort={sort} onToggle={toggleSort} />
                        <TableHead>Origem</TableHead>
                        <SortableTableHead label="Pedidos" sortKey="totalOrdered" sort={sort} onToggle={toggleSort} />
                        <SortableTableHead label="Pago" sortKey="totalPaid" sort={sort} onToggle={toggleSort} />
                        <SortableTableHead label="Saldo" sortKey="balance" sort={sort} onToggle={toggleSort} />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item: CustomerBalance) => (
                        <TableRow
                          key={item.customer.id}
                          className="cursor-pointer"
                          onClick={() => navigate(`/apliques/clientes/${item.customer.id}`)}
                        >
                          <TableCell className="font-semibold">{item.customer.name}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {item.customer.origin ?? '—'}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{formatCurrency(item.totalOrdered)}</TableCell>
                          <TableCell className="text-muted-foreground">{formatCurrency(item.totalPaid)}</TableCell>
                          <TableCell>
                            <Badge variant="destructive" className="font-bold">
                              {formatCurrency(item.balance)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile (<768px) — cards */}
                <div className="md:hidden space-y-3">
                  {items.map((item: CustomerBalance) => (
                    <Card
                      key={item.customer.id}
                      className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => navigate(`/apliques/clientes/${item.customer.id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{item.customer.name}</p>
                          {item.customer.origin && (
                            <p className="text-xs text-muted-foreground">{item.customer.origin}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            Pedidos: {formatCurrency(item.totalOrdered)} · Pago: {formatCurrency(item.totalPaid)}
                          </p>
                        </div>
                        <Badge variant="destructive" className="text-base font-bold px-3 py-1">
                          {formatCurrency(item.balance)}
                        </Badge>
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
    </div>
  )
}

