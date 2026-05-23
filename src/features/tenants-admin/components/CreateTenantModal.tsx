import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { formatPhone, formatCNPJ, formatCPF } from '@/lib/masks'
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
import { useCreateTenantAdmin } from '../hooks/use-create-tenant-admin'

interface CreateTenantModalProps {
  open: boolean
  onClose: () => void
}

const EMPTY_FORM = {
  companyName: '',
  companyCnpj: '',
  ownerName: '',
  ownerCpf: '',
  ownerPhone: '',
  ownerPassword: '',
  planId: '',
}

export function CreateTenantModal({ open, onClose }: CreateTenantModalProps) {
  const [form, setForm] = useState(EMPTY_FORM)
  const { mutate, isPending } = useCreateTenantAdmin()
  const { data: plans = [] } = useQuery({ queryKey: ['plans'], queryFn: listPlans })

  const canSubmit =
    form.companyName.trim() &&
    form.ownerName.trim() &&
    form.ownerCpf.trim() &&
    form.ownerPhone.trim() &&
    form.ownerPassword.trim() &&
    form.planId

  const handleClose = () => {
    setForm(EMPTY_FORM)
    onClose()
  }

  const handleSubmit = () => {
    if (!canSubmit) return
    mutate(
      {
        company: {
          name: form.companyName.trim(),
          cnpj: form.companyCnpj.replace(/\D/g, '') || undefined,
        },
        owner: {
          name: form.ownerName.trim(),
          cpf: form.ownerCpf.trim(),
          phone: form.ownerPhone.replace(/\D/g, ''),
          password: form.ownerPassword,
        },
        planId: form.planId,
      },
      { onSuccess: handleClose },
    )
  }

  const field = (key: keyof typeof EMPTY_FORM) => (
    (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [key]: e.target.value }))
  )

  const phoneField = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, ownerPhone: formatPhone(e.target.value) }))

  const cnpjField = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, companyCnpj: formatCNPJ(e.target.value) }))

  const cpfField = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, ownerCpf: formatCPF(e.target.value) }))

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo tenant</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground font-medium">Empresa</p>

          <div className="space-y-1">
            <Label htmlFor="companyName">
              Nome da empresa <span className="text-destructive">*</span>
            </Label>
            <Input
              id="companyName"
              value={form.companyName}
              onChange={field('companyName')}
              placeholder="Romero Emborrachados"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="companyCnpj">CNPJ (opcional)</Label>
            <Input
              id="companyCnpj"
              value={form.companyCnpj}
              onChange={cnpjField}
              placeholder="00.000.000/0001-00"
              inputMode="numeric"
            />
          </div>

          <p className="text-sm text-muted-foreground font-medium pt-2">Dono</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="ownerName">
                Nome <span className="text-destructive">*</span>
              </Label>
              <Input
                id="ownerName"
                value={form.ownerName}
                onChange={field('ownerName')}
                placeholder="Nome completo"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="ownerCpf">
                CPF <span className="text-destructive">*</span>
              </Label>
              <Input
                id="ownerCpf"
                value={form.ownerCpf}
                onChange={cpfField}
                placeholder="000.000.000-00"
                inputMode="numeric"
                maxLength={14}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="ownerPhone">
                Telefone <span className="text-destructive">*</span>
              </Label>
              <Input
                id="ownerPhone"
                value={form.ownerPhone}
                onChange={phoneField}
                placeholder="(81) 99999-0000"
                inputMode="numeric"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="ownerPassword">
                Senha inicial <span className="text-destructive">*</span>
              </Label>
              <Input
                id="ownerPassword"
                type="password"
                value={form.ownerPassword}
                onChange={field('ownerPassword')}
                placeholder="Mínimo 8 caracteres"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="planId">
              Plano <span className="text-destructive">*</span>
            </Label>
            <Select value={form.planId} onValueChange={v => setForm(f => ({ ...f, planId: v }))}>
              <SelectTrigger id="planId">
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
            {isPending ? 'Criando...' : 'Criar tenant'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
