import { Card } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"
import { useUser } from "@/contexts/UserContext"
import { Permission } from "@/types/enums"

const Field = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-sm font-medium">{value}</p>
  </div>
)

export default function MeusDados() {
  const { user, isLoading } = useUser()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 space-y-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <Card className="p-6 space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
            ))}
          </Card>
        </div>
      </div>
    )
  }

  if (!user) return null

  const isAdmin = user.permissions.includes(Permission.ManagementPermissionGroupsEdit)

  return (
    <div className="min-h-screen bg-background">
      <Heading description="Seus dados de cadastro" showButton={false}>
        Meus dados
      </Heading>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <Card className="p-6 space-y-4">
          <Field label="Nome" value={user.name} />
          <Field label="Email" value={user.email ?? "—"} />
          <Field label="Telefone" value={user.phone ?? "—"} />
          <Field label="CPF" value={user.cpf ?? "—"} />
        </Card>
        {isAdmin && (
          <Card className="p-6 space-y-4">
            <Field label="Empresa" value={user.tenant.name} />
            <Field label="CNPJ" value={user.tenant.cnpj || "—"} />
          </Card>
        )}
      </div>
    </div>
  )
}
