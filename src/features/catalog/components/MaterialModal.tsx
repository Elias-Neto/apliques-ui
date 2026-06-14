import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Material } from "../material.types"

const schema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  pricePerUnit: z.number({ invalid_type_error: "Preço obrigatório" }).int().min(1, "Preço precisa ser maior que zero"),
})
type Form = z.infer<typeof schema>

interface MaterialModalProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  onSubmit: (data: Form) => void
  isLoading?: boolean
  title: string
  initial?: Partial<Material>
}

const formatCentsToReais = (cents: number) => (cents / 100).toFixed(2)
const parseReaisToCents = (value: string) => Math.round(parseFloat(value.replace(',', '.')) * 100)

export function MaterialModal({ open, onOpenChange, onSubmit, isLoading, title, initial }: MaterialModalProps) {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initial?.name ?? "",
      pricePerUnit: initial?.pricePerUnit ?? undefined,
    },
  })

  useEffect(() => {
    reset({
      name: initial?.name ?? "",
      pricePerUnit: initial?.pricePerUnit ?? undefined,
    })
  }, [initial, reset])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mat-name">Nome *</Label>
            <Input id="mat-name" {...register("name")} placeholder="Ex: Couro PU" />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="mat-price">Preço por aplique (R$) *</Label>
            <Input
              id="mat-price"
              type="number"
              min={0.01}
              step={0.01}
              placeholder="0.35"
              defaultValue={initial?.pricePerUnit ? formatCentsToReais(initial.pricePerUnit) : ""}
              onChange={e => setValue("pricePerUnit", parseReaisToCents(e.target.value), { shouldValidate: true })}
            />
            {errors.pricePerUnit && <p className="text-sm text-red-500">{errors.pricePerUnit.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
