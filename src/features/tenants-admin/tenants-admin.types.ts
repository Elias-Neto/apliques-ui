type TypeAdminTenantRow = {
  tenantId: string
  companyName: string
  companyCnpj?: string
  ownerName: string
  ownerCpf?: string
  ownerPhone?: string
  planId: string
  planName?: string
  subscriptionStatus: string
  createdAt: string
}

type TypeCreateTenantPayload = {
  company: { name: string; cnpj?: string }
  owner: { name: string; cpf: string; phone: string; password: string }
  planId: string
}

type TypePlanOption = { planId: string; name: string }

type TypeEditTenantPayload = {
  tenantId: string
  company: { name: string; cnpj?: string }
  planId: string
}

export type { TypeAdminTenantRow, TypeCreateTenantPayload, TypeEditTenantPayload, TypePlanOption }
