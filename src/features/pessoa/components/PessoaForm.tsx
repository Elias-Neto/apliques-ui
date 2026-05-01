import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pessoa } from "@/features/pessoa/types/pessoa"
import { useFetchPermissionGroups } from "@/features/permission-group/hooks/use-fetch-permission-groups"
import { formatCPF, formatPhone } from "@/lib/masks"
import {
  pessoaCreateSchema,
  pessoaUpdateSchema,
  TypePessoaCreateForm,
} from "@/features/pessoa/schemas/pessoa"

interface PessoaFormProps {
  initialData?: Partial<Pessoa>
  onSubmit: (data: TypePessoaCreateForm) => void
  submitLabel: string
  isLoading?: boolean
}

export function PessoaForm({ initialData, onSubmit, submitLabel, isLoading = false }: PessoaFormProps) {
  const { data: grupos = [], isLoading: isLoadingGrupos, error: errorGrupos } = useFetchPermissionGroups()
  const editMode = Boolean(initialData?.id)

  const form = useForm<TypePessoaCreateForm>({
    resolver: zodResolver(editMode ? pessoaUpdateSchema : pessoaCreateSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      cpf: initialData?.cpf ?? "",
      phone: initialData?.phone ?? "",
      password: "",
      permissionGroups: initialData?.permissionGroups?.map(g => g.id) ?? [],
    },
  })

  const { register, handleSubmit, watch, setValue, formState: { errors } } = form
  const cpf = watch("cpf")
  const phone = watch("phone")
  const permissionGroups = watch("permissionGroups")

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome *</Label>
        <Input id="name" {...register("name")} placeholder="Digite o nome da pessoa" />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cpf">CPF *</Label>
        <Input
          id="cpf"
          value={cpf}
          onChange={e => setValue("cpf", formatCPF(e.target.value), { shouldValidate: true })}
          placeholder="000.000.000-00"
          maxLength={14}
        />
        {errors.cpf && <p className="text-sm text-red-500">{errors.cpf.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          value={phone ?? ""}
          onChange={e => setValue("phone", formatPhone(e.target.value), { shouldValidate: true })}
          placeholder="(00) 00000-0000"
          maxLength={15}
        />
        {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
      </div>

      {!editMode && (
        <div className="space-y-2">
          <Label htmlFor="password">Senha *</Label>
          <Input id="password" type="password" {...register("password")} placeholder="Digite a senha" />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="permissionGroups">Grupos de Permissão *</Label>
        <Select
          value={permissionGroups[0] ?? ""}
          onValueChange={value => setValue("permissionGroups", [value], { shouldValidate: true })}
          disabled={isLoadingGrupos}
        >
          <SelectTrigger>
            <SelectValue placeholder={
              isLoadingGrupos
                ? "Carregando grupos..."
                : errorGrupos
                  ? "Erro ao carregar grupos"
                  : "Selecione um grupo de permissão"
            } />
          </SelectTrigger>
          <SelectContent>
            {grupos.map(grupo => (
              <SelectItem key={grupo.id} value={grupo.id}>{grupo.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.permissionGroups && <p className="text-sm text-red-500">{errors.permissionGroups.message}</p>}
        {errorGrupos && <p className="text-sm text-red-500">{errorGrupos.message ?? "Erro ao carregar grupos"}</p>}
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Salvando..." : submitLabel}
      </Button>
    </form>
  )
}
