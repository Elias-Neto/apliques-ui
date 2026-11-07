import { keepPreviousData, useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/toast/use-toast"
import { fetchMaterials, createMaterial, updateMaterial, deleteMaterial, MaterialFilters } from "../material.service"

export const useFetchMaterials = (filters?: MaterialFilters) =>
  useQuery({
    queryKey: ["materials", filters],
    queryFn: () => fetchMaterials(filters),
    placeholderData: keepPreviousData,
  })

export const useCreateMaterial = () => {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: createMaterial,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["materials"] }); toast({ title: "Material criado" }) },
    onError: (e: any) => toast({ title: "Erro", description: e?.response?.data?.message, variant: "destructive" }),
  })
}

export const useUpdateMaterial = () => {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateMaterial>[1] }) => updateMaterial(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["materials"] }); toast({ title: "Material atualizado" }) },
    onError: () => toast({ title: "Erro ao atualizar material", variant: "destructive" }),
  })
}

export const useDeleteMaterial = () => {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: deleteMaterial,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["materials"] }); toast({ title: "Material excluído", variant: "destructive" } as any) },
    onError: (e: any) => toast({ title: "Erro ao excluir material", description: e?.response?.data?.message, variant: "destructive" }),
  })
}
