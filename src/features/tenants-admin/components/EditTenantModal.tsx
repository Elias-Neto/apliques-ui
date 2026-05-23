import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { formatCNPJ } from '@/lib/masks'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { listPlans } from '../tenants-admin.service'
import { useEditTenantAdmin } from '../hooks/use-edit-tenant-admin'
import type { TypeAdminTenantRow } from '../tenants-admin.types'

interface EditTenantModalProps {
  tenant: TypeAdminTenantRow | null
  onClose: () => void
}

export function EditTenantModal({ tenant, onClose }: EditTenantModalProps) {
  const [companyName, setCompanyName] = useState('')
  const [companyCnpj, setCompanyCnpj] = useState('')
  const [planId, setPlanId] = useState('')

  const { mutate, isPending } = useEditTenantAdmin()
  const { data: plans = [] } = useQuery({ queryKey: ['plans'], queryFn: listPlans })

  useEffect(() => {
    if (tenant) {
      setCompanyName(tenant.companyName)
      setCompanyCnpj(tenant.companyCnpj ? formatCNPJ(tenant.companyCnpj) : '')
      setPlanId(tenant.planId)
    }
  }, [tenant])

  const canSubmit = companyName.trim() && planId

  const handleClose = () => {
    onClose()
  }

  const handleSubmit = () => {
    if (!tenant || !canSubmit) return
    mutate(
      {
        tenantId: tenant.tenantId,
        company: {
          name: companyName.trim(),
          cnpj: companyCnpj.replace(/\D/g, '') || undefined,
        },
        planId,
      },
      { onSuccess: handleClose },
    )
  }

  return (
    <Dialog open={!!tenant} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Editar tenant</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="editCompanyName">
              Nome da empresa <span className="text-destructive">*</span>
            </Label>
            <Input
              id="editCompanyName"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              placeholder="Romero Emborrachados"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="editCompanyCnpj">CNPJ (opcional)</Label>
            <Input
              id="editCompanyCnpj"
              value={companyCnpj}
              onChange={e => setCompanyCnpj(formatCNPJ(e.target.value))}
              placeholder="00.000.000/0001-00"
              inputMode="numeric"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="editPlanId">
              Plano <span className="text-destructive">*</span>
            </Label>
            <Select value={planId} onValueChange={setPlanId}>
              <SelectTrigger id="editPlanId">
                <SelectValue placeholder="Selecione o plano" />
              </SelectTrigger>
              <SelectContent>
                {plans.map(p => (
                  <SelectItem key={p.planId} value={p.planId}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit || isPending}>
            {isPending ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
