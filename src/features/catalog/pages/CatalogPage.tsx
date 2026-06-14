import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heading } from "@/components/ui/heading"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Edit2, Plus, Trash2 } from "lucide-react"
import { useFetchMaterials, useCreateMaterial, useUpdateMaterial, useDeleteMaterial } from "../hooks/use-materials"
import { useFetchColors, useCreateColor, useUpdateColor, useDeleteColor } from "../hooks/use-colors"
import { MaterialModal } from "../components/MaterialModal"
import { ColorModal } from "../components/ColorModal"
import { Material } from "../material.types"
import { Color } from "../color.types"
import { colorCodeToCSS, colorCodeDisplayLabel } from "../color-code.utils"

export default function CatalogPage() {
  const { data: materials = [], isLoading: loadingMaterials } = useFetchMaterials()
  const { data: colors = [], isLoading: loadingColors } = useFetchColors()
  const { mutate: createMat, isPending: creatingMat } = useCreateMaterial()
  const { mutate: updateMat, isPending: updatingMat } = useUpdateMaterial()
  const { mutate: deleteMat } = useDeleteMaterial()
  const { mutate: createColor, isPending: creatingColor } = useCreateColor()
  const { mutate: updateColor, isPending: updatingColor } = useUpdateColor()
  const { mutate: deleteColor } = useDeleteColor()

  const [showMatCreate, setShowMatCreate] = useState(false)
  const [editMat, setEditMat] = useState<Material | null>(null)
  const [showColorCreate, setShowColorCreate] = useState(false)
  const [editColor, setEditColor] = useState<Color | null>(null)

  return (
    <div className="min-h-screen bg-background">
      <Heading description="Materiais e cores usados nos pedidos" showButton={false}>Catálogo</Heading>
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="materiais">
          <TabsList>
            <TabsTrigger value="materiais">Materiais</TabsTrigger>
            <TabsTrigger value="cores">Cores</TabsTrigger>
          </TabsList>

          <TabsContent value="materiais" className="mt-4 space-y-4">
            <div className="flex justify-end">
              <Button size="sm" onClick={() => setShowMatCreate(true)}>
                <Plus className="h-4 w-4 mr-1" /> Novo Material
              </Button>
            </div>
            {loadingMaterials ? (
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
            ) : materials.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum material cadastrado.</p>
            ) : (
              <ul className="divide-y divide-border rounded-md border">
                {materials.map(m => (
                  <li key={m.id} className="flex items-center justify-between px-4 py-3">
                    <span className="font-medium">{m.name}</span>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => setEditMat(m)}>
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
                            <AlertDialogTitle>Excluir material</AlertDialogTitle>
                            <AlertDialogDescription>Materiais em uso em pedidos não podem ser excluídos.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => deleteMat(m.id)}>Excluir</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="cores" className="mt-4 space-y-4">
            <div className="flex justify-end">
              <Button size="sm" onClick={() => setShowColorCreate(true)}>
                <Plus className="h-4 w-4 mr-1" /> Nova Cor
              </Button>
            </div>
            {loadingColors ? (
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
            ) : colors.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma cor cadastrada.</p>
            ) : (
              <ul className="divide-y divide-border rounded-md border">
                {colors.map(c => (
                  <li key={c.id} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{c.name}</span>
                      {c.code && (() => {
                        const css = colorCodeToCSS(c.code, c.codeFormat)
                        const label = colorCodeDisplayLabel(c.code, c.codeFormat)
                        return (
                          <Badge variant="outline" className="text-xs flex items-center gap-1.5">
                            {css && (
                              <span className="inline-block h-3 w-3 rounded-sm flex-shrink-0 border border-black/10" style={{ backgroundColor: css }} />
                            )}
                            {label || c.code}
                          </Badge>
                        )
                      })()}
                    </div>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => setEditColor(c)}>
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
                            <AlertDialogTitle>Excluir cor</AlertDialogTitle>
                            <AlertDialogDescription>Cores em uso em pedidos não podem ser excluídas.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => deleteColor(c.id)}>Excluir</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <MaterialModal open={showMatCreate} onOpenChange={setShowMatCreate} onSubmit={d => createMat(d, { onSuccess: () => setShowMatCreate(false) })} isLoading={creatingMat} title="Novo Material" />
      <MaterialModal open={!!editMat} onOpenChange={v => { if (!v) setEditMat(null) }} onSubmit={d => updateMat({ id: editMat!.id, data: d }, { onSuccess: () => setEditMat(null) })} isLoading={updatingMat} title="Editar Material" initial={editMat ?? undefined} />
      <ColorModal open={showColorCreate} onOpenChange={setShowColorCreate} onSubmit={({ name, code, codeFormat }) => createColor({ name, code, codeFormat }, { onSuccess: () => setShowColorCreate(false) })} isLoading={creatingColor} title="Nova Cor" />
      <ColorModal open={!!editColor} onOpenChange={v => { if (!v) setEditColor(null) }} onSubmit={({ name, code, codeFormat }) => updateColor({ id: editColor!.id, data: { name, code, codeFormat } }, { onSuccess: () => setEditColor(null) })} isLoading={updatingColor} title="Editar Cor" initial={editColor ?? undefined} />
    </div>
  )
}
