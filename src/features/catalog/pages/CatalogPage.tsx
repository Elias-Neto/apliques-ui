import { useState } from "react"
import { Search, PackageSearch, Palette } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heading } from "@/components/ui/heading"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { SortableTableHead } from "@/components/ui/sortable-table-head"
import { Edit2, Plus, Trash2 } from "lucide-react"
import { useFetchMaterials, useCreateMaterial, useUpdateMaterial, useDeleteMaterial } from "../hooks/use-materials"
import { useFetchColors, useCreateColor, useUpdateColor, useDeleteColor } from "../hooks/use-colors"
import { MaterialModal } from "../components/MaterialModal"
import { ColorModal } from "../components/ColorModal"
import { Material } from "../material.types"
import { Color } from "../color.types"
import { colorCodeToCSS, colorCodeDisplayLabel } from "../color-code.utils"
import { MaterialSortField } from "../material.service"
import { ColorSortField } from "../color.service"

type SortState<TField extends string> = { field: TField; dir: 'asc' | 'desc' }

export default function CatalogPage() {
  const [materialSearch, setMaterialSearch] = useState('')
  const [materialSort, setMaterialSort] = useState<SortState<MaterialSortField> | null>(null)
  const [colorSearch, setColorSearch] = useState('')
  const [colorSort, setColorSort] = useState<SortState<ColorSortField> | null>(null)

  const { data: materials = [], isLoading: loadingMaterials } = useFetchMaterials({
    search: materialSearch.trim() || undefined,
    sortBy: materialSort?.field,
    sortDir: materialSort?.dir,
  })
  const { data: colors = [], isLoading: loadingColors } = useFetchColors({
    search: colorSearch.trim() || undefined,
    sortBy: colorSort?.field,
    sortDir: colorSort?.dir,
  })
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

  const toggleMaterialSort = (field: MaterialSortField) => {
    setMaterialSort(prev => (prev?.field === field
      ? { field, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
      : { field, dir: 'asc' }))
  }

  const toggleColorSort = (field: ColorSortField) => {
    setColorSort(prev => (prev?.field === field
      ? { field, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
      : { field, dir: 'asc' }))
  }

  const materialSearchActive = materialSearch.trim().length > 0
  const colorSearchActive = colorSearch.trim().length > 0

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
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome"
                  value={materialSearch}
                  onChange={e => setMaterialSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button size="sm" onClick={() => setShowMatCreate(true)}>
                <Plus className="h-4 w-4 mr-1" /> Novo Material
              </Button>
            </div>

            {loadingMaterials ? (
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
            ) : materials.length === 0 ? (
              materialSearchActive ? (
                <EmptyState
                  icon={PackageSearch}
                  title="Nenhum material encontrado"
                  description="Nenhum material corresponde a essa busca."
                  buttonText="Limpar busca"
                  onButtonClick={() => setMaterialSearch('')}
                />
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum material cadastrado.</p>
              )
            ) : (
              <>
                {/* Desktop/tablet largo (>=768px) — tabela */}
                <div className="hidden md:block border rounded-xl overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <SortableTableHead label="Nome" sortKey="name" sort={materialSort} onToggle={toggleMaterialSort} />
                        <TableHead className="w-24" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {materials.map(m => (
                        <TableRow key={m.id}>
                          <TableCell className="font-medium">{m.name}</TableCell>
                          <TableCell>
                            <div className="flex gap-1 justify-end">
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
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile (<768px) — cards */}
                <div className="md:hidden space-y-3">
                  {materials.map(m => (
                    <Card key={m.id} className="flex items-center justify-between px-4 py-3">
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
                    </Card>
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="cores" className="mt-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou código"
                  value={colorSearch}
                  onChange={e => setColorSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button size="sm" onClick={() => setShowColorCreate(true)}>
                <Plus className="h-4 w-4 mr-1" /> Nova Cor
              </Button>
            </div>

            {loadingColors ? (
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
            ) : colors.length === 0 ? (
              colorSearchActive ? (
                <EmptyState
                  icon={Palette}
                  title="Nenhuma cor encontrada"
                  description="Nenhuma cor corresponde a essa busca."
                  buttonText="Limpar busca"
                  onButtonClick={() => setColorSearch('')}
                />
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma cor cadastrada.</p>
              )
            ) : (
              <>
                {/* Desktop/tablet largo (>=768px) — tabela */}
                <div className="hidden md:block border rounded-xl overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <SortableTableHead label="Nome" sortKey="name" sort={colorSort} onToggle={toggleColorSort} />
                        <TableHead>Código</TableHead>
                        <TableHead className="w-24" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {colors.map(c => {
                        const css = c.code ? colorCodeToCSS(c.code, c.codeFormat) : null
                        const label = c.code ? colorCodeDisplayLabel(c.code, c.codeFormat) : null
                        return (
                          <TableRow key={c.id}>
                            <TableCell className="font-medium">{c.name}</TableCell>
                            <TableCell>
                              {c.code && (
                                <Badge variant="outline" className="text-xs flex items-center gap-1.5 w-fit">
                                  {css && (
                                    <span className="inline-block h-3 w-3 rounded-sm flex-shrink-0 border border-black/10" style={{ backgroundColor: css }} />
                                  )}
                                  {label || c.code}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1 justify-end">
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
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile (<768px) — cards */}
                <div className="md:hidden space-y-3">
                  {colors.map(c => {
                    const css = c.code ? colorCodeToCSS(c.code, c.codeFormat) : null
                    const label = c.code ? colorCodeDisplayLabel(c.code, c.codeFormat) : null
                    return (
                      <Card key={c.id} className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{c.name}</span>
                          {c.code && (
                            <Badge variant="outline" className="text-xs flex items-center gap-1.5">
                              {css && (
                                <span className="inline-block h-3 w-3 rounded-sm flex-shrink-0 border border-black/10" style={{ backgroundColor: css }} />
                              )}
                              {label || c.code}
                            </Badge>
                          )}
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
                      </Card>
                    )
                  })}
                </div>
              </>
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
