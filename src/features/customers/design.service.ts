import { api } from "@/services/http"
import { Design } from "./design.types"
import { TypeDesignCreateForm, TypeDesignUpdateForm } from "./design.schema"

export const fetchDesigns = (customerID: string): Promise<Design[]> =>
  api.get(`/customers/${customerID}/designs`).then(r => r.data)

export const createDesign = (customerID: string, body: TypeDesignCreateForm): Promise<Design> =>
  api.post(`/customers/${customerID}/designs`, body).then(r => r.data)

export const updateDesign = (customerID: string, id: string, body: TypeDesignUpdateForm): Promise<Design> =>
  api.patch(`/customers/${customerID}/designs/${id}`, body).then(r => r.data)

export const deleteDesign = (customerID: string, id: string): Promise<void> =>
  api.delete(`/customers/${customerID}/designs/${id}`).then(() => undefined)
