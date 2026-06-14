type ProductionStatus = 'em-producao' | 'pronto' | 'entregue'

interface OrderItem {
  materialID: string
  colorID: string
  designID: string
  unitPrice: number
  quantity: number
  material?: { id: string; name: string; pricePerUnit?: number } | null
  color?: { id: string; name: string; code?: string | null; codeFormat?: string | null } | null
  design?: { id: string; name: string } | null
}

interface Order {
  id: string
  customerID: string
  orderDate: string
  items: OrderItem[]
  totalPrice: number
  productionStatus: ProductionStatus
  observation?: string | null
  customer?: { id: string; name: string } | null
  createdAt?: string
}

interface OrdersListResponse {
  items: Order[]
  total: number
}

export type { Order, OrderItem, OrdersListResponse, ProductionStatus }
