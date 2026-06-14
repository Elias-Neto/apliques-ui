import { ClipboardList, Users, Palette, Wallet } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Permission } from "@/types/enums"

export type NavItem = {
  label: string
  href: string
  icon: LucideIcon
  permission: Permission
}

export type NavSection = {
  label: string
  items: NavItem[]
}

export const domainSections: NavSection[] = [
  {
    label: 'Apliques',
    items: [
      { label: 'Produção',   href: '/apliques/producao',   icon: ClipboardList, permission: Permission.OrdersRead },
      { label: 'Clientes',   href: '/apliques/clientes',   icon: Users,         permission: Permission.CustomersRead },
      { label: 'Catálogo',   href: '/apliques/catalogo',   icon: Palette,       permission: Permission.MaterialsRead },
      { label: 'Financeiro', href: '/apliques/financeiro', icon: Wallet,        permission: Permission.FinanceRead },
    ],
  },
]
