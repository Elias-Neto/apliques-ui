import { useState } from "react"
import { Plus, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useCustomerDesigns } from "../hooks/use-customer-designs"
import { useAddDesign } from "../hooks/use-add-design"
import { useUpdateDesign } from "../hooks/use-update-design"
import { useDeleteDesign } from "../hooks/use-delete-design"
import { DesignModal } from "./DesignModal"
import { Design } from "../design.types"

interface DesignsSectionProps {
  customerID: string
}

export function DesignsSection({ customerID }: DesignsSectionProps) {
  const { data: designs = [], isLoading } = useCustomerDesigns(customerID)
  const { mutate: addDesign, isPending: isAdding } = useAddDesign()
  const { mutate: updateDesign, isPending: isUpdating } = useUpdateDesign()
  const { mutate: deleteDesign } = useDeleteDesign()

  const [showAddModal, setShowAddModal] = useState(false)
  const [editingDesign, setEditingDesign] = useState<Design | null>(null)

  const handleAdd = (data: { name: string }) => {
    addDesign({ customerID, data }, { onSuccess: () => setShowAddModal(false) })
  }

  const handleUpdate = (data: { name: string }) => {
    if (!editingDesign) return
    updateDesign({ customerID, id: editingDesign.id, data }, { onSuccess: () => setEditingDesign(null) })
  }

  if (isLoading) return <div className="h-8 bg-gray-200 rounded animate-pulse" />

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Desenhos</h3>
        <Button size="sm" variant="outline" onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-1" /> Novo desenho
        </Button>
      </div>

      {designs.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum desenho cadastrado.</p>
      ) : (
        <ul className="divide-y divide-border rounded-md border">
          {designs.map(design => (
            <li key={design.id} className="flex items-center justify-between px-4 py-2">
              <span className="text-sm">{design.name}</span>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" onClick={() => setEditingDesign(design)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir desenho</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir o desenho "{design.name}"?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive hover:bg-destructive/90"
                        onClick={() => deleteDesign({ customerID, id: design.id })}
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </li>
          ))}
        </ul>
      )}

      <DesignModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSubmit={handleAdd}
        isLoading={isAdding}
        title="Novo Desenho"
      />

      <DesignModal
        open={!!editingDesign}
        onOpenChange={open => { if (!open) setEditingDesign(null) }}
        onSubmit={handleUpdate}
        isLoading={isUpdating}
        title="Editar Desenho"
        initialName={editingDesign?.name}
      />
    </div>
  )
}
