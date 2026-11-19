import { api } from "@/services/http"
import { Customer, CustomersListResponse } from "./customer.types"
import { TypeCustomerCreateForm, TypeCustomerUpdateForm } from "./customer.schema"

export type CustomerSortField = 'name' | 'ordersCount' | 'balance'
export type CustomerSortDir = 'asc' | 'desc'

export interface CustomerFilters {
  search?: string
  origin?: string
  ordersCountMin?: number
  ordersCountMax?: number
  balanceMin?: number
  balanceMax?: number
  sortBy?: CustomerSortField
  sortDir?: CustomerSortDir
  limit?: number
  offset?: number
}

export const fetchCustomers = (params?: CustomerFilters): Promise<CustomersListResponse> =>
  api.get("/customers", { params }).then(r => r.data)

export const fetchCustomerById = (id: string): Promise<Customer> =>
  api.get(`/customers/${id}`).then(r => r.data)

export const createCustomer = (body: TypeCustomerCreateForm): Promise<Customer> =>
  api.post("/customers", body).then(r => r.data)

export const updateCustomer = (id: string, body: TypeCustomerUpdateForm): Promise<Customer> =>
  api.patch(`/customers/${id}`, body).then(r => r.data)

export const deleteCustomer = (id: string): Promise<void> =>
  api.delete(`/customers/${id}`).then(() => undefined)

export const fetchCustomerOrigins = (): Promise<string[]> =>
  api.get("/customers/origins").then(r => r.data)
