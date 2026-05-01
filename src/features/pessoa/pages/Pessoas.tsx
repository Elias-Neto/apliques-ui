import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { EmptyState } from "@/components/ui/empty-state"
import { Heading } from "@/components/ui/heading"
import { PessoaForm } from "@/features/pessoa/components/PessoaForm"
import { PessoaCard } from "@/features/pessoa/components/PessoaCard"
import { useFetchPessoas } from "@/features/pessoa/hooks/use-fetch-pessoas"
import { useCreatePessoa } from "@/features/pessoa/hooks/use-create-pessoa"
import { useUpdatePessoa } from "@/features/pessoa/hooks/use-update-pessoa"
import { useDeletePessoa } from "@/features/pessoa/hooks/use-delete-pessoa"
import { TypePessoaPayload } from "@/features/pessoa/services/pessoas"
import { Pessoa } from "@/features/pessoa/types/pessoa"
import { Users } from "lucide-react"

export default function Pessoas() {
  const { data: pessoas = [], isLoading } = useFetchPessoas()
  const { mutate: createMutate, isPending: isCreating } = useCreatePessoa()
  const { mutate: updateMutate, isPending: isUpdating } = useUpdatePessoa()
  const { mutate: deleteMutate } = useDeletePessoa()

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingPessoa, setEditingPessoa] = useState<Pessoa | null>(null)

  const handleCreate = (data: TypePessoaPayload) => {
    createMutate(data, {
      onSuccess: () => setShowCreateForm(false),
    })
  }

  const handleEdit = (pessoa: Pessoa) => {
    setEditingPessoa(pessoa)
    setShowEditForm(true)
  }

  const handleUpdate = (data: TypePessoaPayload) => {
    if (!editingPessoa) return
    updateMutate({ id: editingPessoa.id, data }, {
      onSuccess: () => {
        setShowEditForm(false)
        setEditingPessoa(null)
      },
    })
  }

  const handleDelete = (id: string) => {
    deleteMutate(id)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Heading description="Gerencie as pessoas do sistema" showButton={false}>
          Pessoas
        </Heading>
        <div className="container mx-auto px-4 py-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Heading
        description="Gerencie as pessoas do sistema"
        showButton
        buttonText="Nova Pessoa"
        onButtonClick={() => setShowCreateForm(true)}
      >
        Pessoas
      </Heading>

      <div className="container mx-auto px-4 py-6">
        {pessoas.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Nenhuma pessoa encontrada"
            description="Comece criando sua primeira pessoa."
            buttonText="Criar Primeira Pessoa"
            onButtonClick={() => setShowCreateForm(true)}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pessoas.map(pessoa => (
              <PessoaCard
                key={pessoa.id}
                pessoa={pessoa}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Nova Pessoa</DialogTitle>
            </DialogHeader>
            <PessoaForm
              onSubmit={handleCreate}
              submitLabel="Criar Pessoa"
              isLoading={isCreating}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Pessoa</DialogTitle>
            </DialogHeader>
            {editingPessoa && (
              <PessoaForm
                initialData={editingPessoa}
                onSubmit={handleUpdate}
                submitLabel="Salvar Alterações"
                isLoading={isUpdating}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
