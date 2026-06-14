import { api } from "@/services/http"
import { Payment } from "./payment.types"

export const fetchPayments = (customerID: string): Promise<Payment[]> =>
  api.get(`/customers/${customerID}/payments`).then(r => r.data)

export const createPayment = (
  customerID: string,
  body: { amount: number; date?: string; observation?: string | null },
): Promise<Payment> =>
  api.post(`/customers/${customerID}/payments`, body).then(r => r.data)

export const updatePayment = (
  customerID: string,
  id: string,
  body: { amount?: number; date?: string; observation?: string | null },
): Promise<Payment> =>
  api.patch(`/customers/${customerID}/payments/${id}`, body).then(r => r.data)

export const deletePayment = (customerID: string, id: string): Promise<void> =>
  api.delete(`/customers/${customerID}/payments/${id}`).then(() => undefined)
