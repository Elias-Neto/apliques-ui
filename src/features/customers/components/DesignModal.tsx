import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { designCreateSchema, TypeDesignCreateForm } from "../design.schema"

interface DesignModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: TypeDesignCreateForm) => void
  isLoading?: boolean
  title: string
  initialName?: string
}

export function DesignModal({ open, onOpenChange, onSubmit, isLoading, title, initialName }: DesignModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TypeDesignCreateForm>({
    resolver: zodResolver(designCreateSchema),
    defaultValues: { name: initialName ?? "" },
  })

  useEffect(() => {
    reset({ name: initialName ?? "" })
  }, [initialName, reset])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="design-name">Nome *</Label>
            <Input id="design-name" {...register("name")} placeholder="Ex: Logo Empresa X" />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
