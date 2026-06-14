import { api } from "@/services/http"
import { Order, OrdersListResponse, ProductionStatus } from "./order.types"
import { TypeOrderCreateForm, TypeOrderUpdateForm } from "./order.schema"

interface OrderFilters {
  productionStatus?: ProductionStatus
  customerID?: string
  dateFrom?: string
  dateTo?: string
  limit?: number
  offset?: number
}

export const fetchOrders = (filters?: OrderFilters): Promise<OrdersListResponse> =>
  api.get("/orders", { params: filters }).then(r => r.data)

export const fetchOrderById = (id: string): Promise<Order> =>
  api.get(`/orders/${id}`).then(r => r.data)

export const createOrder = (body: TypeOrderCreateForm): Promise<Order> =>
  api.post("/orders", body).then(r => r.data)

export const updateOrder = (id: string, body: TypeOrderUpdateForm): Promise<Order> =>
  api.patch(`/orders/${id}`, body).then(r => r.data)

export const updateProductionStatus = (id: string, status: ProductionStatus): Promise<Order> =>
  api.patch(`/orders/${id}/production-status`, { status }).then(r => r.data)

export const deleteOrder = (id: string): Promise<void> =>
  api.delete(`/orders/${id}`).then(() => undefined)
