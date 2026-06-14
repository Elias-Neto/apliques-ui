import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Customer } from "../customer.types"
import { customerCreateSchema, TypeCustomerCreateForm } from "../customer.schema"

interface CustomerFormProps {
  initialData?: Partial<Customer>
  onSubmit: (data: TypeCustomerCreateForm) => void
  submitLabel: string
  isLoading?: boolean
}

export function CustomerForm({ initialData, onSubmit, submitLabel, isLoading = false }: CustomerFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<TypeCustomerCreateForm>({
    resolver: zodResolver(customerCreateSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      phone: initialData?.phone ?? "",
      origin: initialData?.origin ?? "",
      observation: initialData?.observation ?? "",
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome *</Label>
        <Input id="name" {...register("name")} placeholder="Nome do cliente" />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input id="phone" {...register("phone")} placeholder="(00) 00000-0000" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="origin">Origem</Label>
        <Input id="origin" {...register("origin")} placeholder="Ex: Caruaru/PE" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="observation">Observação</Label>
        <Textarea id="observation" {...register("observation")} placeholder="Observações sobre o cliente" rows={3} />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Salvando..." : submitLabel}
      </Button>
    </form>
  )
}
