import type { LucideIcon } from "lucide-react"

export type NavItem = {
  label: string
  href: string
  icon: LucideIcon
}

export type NavSection = {
  label: string
  items: NavItem[]
}

// Bootstrap base: vazio. Projetos derivados editam este arquivo após clonar.
// Importe ícones nominalmente de lucide-react: import { Wrench } from "lucide-react"
export const domainSections: NavSection[] = []
