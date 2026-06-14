interface Customer {
  id: string
  name: string
  phone?: string | null
  origin?: string | null
  observation?: string | null
  ordersCount?: number
  balance?: number
  totalOrdered?: number
  totalPaid?: number
  payments?: Payment[]
  orders?: Order[]
  createdAt?: string
}

interface CustomerListItem {
  id: string
  name: string
  phone?: string | null
  origin?: string | null
  ordersCount: number
  balance: number
}

interface CustomersListResponse {
  items: CustomerListItem[]
  total: number
}

interface Payment {
  id: string
  amount: number
  date: string
  observation?: string | null
  createdAt?: string
}

interface OrderItem {
  materialID: string
  colorID: string
  designID: string
  unitPrice: number
  quantity: number
}

interface Order {
  _id: string
  orderDate: string
  items: OrderItem[]
  totalPrice: number
  productionStatus: 'em-producao' | 'pronto' | 'entregue'
  observation?: string | null
}

export type { Customer, CustomerListItem, CustomersListResponse, Payment, Order, OrderItem }
