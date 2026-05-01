type TypeCreateTenantPayload = {
  company: {
    name: string
    cnpj: string
  }
  owner: {
    name: string
    phone: string
    cpf: string
    password: string
  }
}

type TypeTenant = {
  id: string
  company: {
    name: string
    cnpj: string
  }
  owner: {
    name: string
    phone: string
    cpf: string
    password: string
  }
  createdAt: string
}

export type { TypeCreateTenantPayload, TypeTenant }