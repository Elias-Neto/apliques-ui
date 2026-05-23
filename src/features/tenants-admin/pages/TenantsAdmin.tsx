import { useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAdminTenants } from '../hooks/use-admin-tenants'
import { useImpersonateTenant } from '../hooks/use-impersonate-tenant'
import { CreateTenantModal } from '../components/CreateTenantModal'
import { EditTenantModal } from '../components/EditTenantModal'
import type { TypeAdminTenantRow } from '../tenants-admin.types'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR')
}

function TenantAdminRow({
  tenant,
  onEdit,
}: {
  tenant: TypeAdminTenantRow
  onEdit: (tenant: TypeAdminTenantRow) => void
}) {
  const { impersonate, isPending: isImpersonating } = useImpersonateTenant()

  return (
    <tr className="border-b hover:bg-muted/30 transition-colors">
      <td className="px-4 py-3 font-medium">{tenant.companyName}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">
        {tenant.companyCnpj ?? '—'}
      </td>
      <td className="px-4 py-3 text-sm">{tenant.ownerName}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">
        {tenant.ownerCpf ?? '—'}
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">
        {tenant.ownerPhone ?? '—'}
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">
        {tenant.planName ?? tenant.planId}
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">
        {formatDate(tenant.createdAt)}
      </td>
      <td className="px-4 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(tenant)}>
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => impersonate(tenant.tenantId)}
              disabled={isImpersonating}
            >
              Entrar como
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  )
}

export default function TenantsAdmin() {
  const { data: tenants = [], isLoading } = useAdminTenants()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingTenant, setEditingTenant] = useState<TypeAdminTenantRow | null>(null)

  return (
    <div className="min-h-screen bg-background">
      <Heading
        description="Gerencie os tenants da plataforma"
        showButton
        buttonText="Novo tenant"
        onButtonClick={() => setShowCreateModal(true)}
      >
        Tenants
      </Heading>

      <div className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
        ) : (
          <div className="border rounded-lg overflow-hidden bg-card">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/30">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Empresa</th>
                  <th className="px-4 py-3 text-left font-medium">CNPJ</th>
                  <th className="px-4 py-3 text-left font-medium">Dono</th>
                  <th className="px-4 py-3 text-left font-medium">CPF</th>
                  <th className="px-4 py-3 text-left font-medium">Telefone</th>
                  <th className="px-4 py-3 text-left font-medium">Plano</th>
                  <th className="px-4 py-3 text-left font-medium">Cadastro</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {tenants.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                      Nenhum tenant cadastrado.
                    </td>
                  </tr>
                ) : (
                  tenants.map(tenant => (
                    <TenantAdminRow
                      key={tenant.tenantId}
                      tenant={tenant}
                      onEdit={setEditingTenant}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CreateTenantModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <EditTenantModal
        tenant={editingTenant}
        onClose={() => setEditingTenant(null)}
      />
    </div>
  )
}
