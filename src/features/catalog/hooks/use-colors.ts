import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/toast/use-toast"
import { fetchColors, createColor, updateColor, deleteColor } from "../color.service"

export const useFetchColors = () =>
  useQuery({ queryKey: ["colors"], queryFn: fetchColors })

export const useCreateColor = () => {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: createColor,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["colors"] }); toast({ title: "Cor criada" }) },
    onError: (e: any) => toast({ title: "Erro", description: e?.response?.data?.message, variant: "destructive" }),
  })
}

export const useUpdateColor = () => {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateColor>[1] }) => updateColor(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["colors"] }); toast({ title: "Cor atualizada" }) },
    onError: () => toast({ title: "Erro ao atualizar cor", variant: "destructive" }),
  })
}

export const useDeleteColor = () => {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: deleteColor,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["colors"] }); toast({ title: "Cor excluída", variant: "destructive" } as any) },
    onError: (e: any) => toast({ title: "Erro ao excluir cor", description: e?.response?.data?.message, variant: "destructive" }),
  })
}
