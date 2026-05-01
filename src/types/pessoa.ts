interface Pessoa {
  id: string
  name: string
  cpf: string
  permissionGroups: GrupoPermissao[]
  phone?: string
  createdAt?: string
  updatedAt?: string
}

interface GrupoPermissao {
  id: string
  label: string
}

export type { Pessoa, GrupoPermissao }

