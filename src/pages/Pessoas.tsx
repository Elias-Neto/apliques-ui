import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Heading } from "@/components/ui/heading";
import { PessoaForm } from "@/components/PessoaForm";
import { PessoaCard } from "@/components/PessoaCard";
import { usePessoas } from "@/hooks/use-pessoas";
import { useToast } from "@/hooks/toast/use-toast";
import { Pessoa } from "@/types/pessoa";
import { Users } from "lucide-react";

export default function Pessoas() {
  const { pessoas, isLoading, createPessoa, updatePessoa, deletePessoa } = usePessoas();
  const { toast } = useToast();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingPessoa, setEditingPessoa] = useState<Pessoa | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (data: Omit<Pessoa, 'id' | 'createdAt' | 'updatedAt'> & { password?: string }) => {
    try {
      setIsSubmitting(true);
      await createPessoa(data);
      setShowCreateForm(false);
      toast({
        title: "Pessoa criada",
        description: `${data.name} foi criada com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao criar pessoa",
        description: "Ocorreu um erro ao criar a pessoa. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (pessoa: Pessoa) => {
    setEditingPessoa(pessoa);
    setShowEditForm(true);
  };

  const handleUpdate = async (data: Omit<Pessoa, 'id' | 'createdAt' | 'updatedAt'> & { password?: string }) => {
    if (!editingPessoa) return;
    
    try {
      setIsSubmitting(true);
      await updatePessoa(editingPessoa.id, data);
      setShowEditForm(false);
      setEditingPessoa(null);
      toast({
        title: "Pessoa atualizada",
        description: `${data.name} foi atualizada com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar pessoa",
        description: "Ocorreu um erro ao atualizar a pessoa. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const pessoa = pessoas.find(p => p.id === id);
    if (!pessoa) return;

    try {
      await deletePessoa(id);
      toast({
        title: "Pessoa excluída",
        description: `${pessoa.name} foi excluída com sucesso.`,
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Erro ao excluir pessoa",
        description: "Ocorreu um erro ao excluir a pessoa. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Heading 
          description="Gerencie as pessoas do sistema"
          showButton={false}
        >
          Pessoas
        </Heading>
        <div className="container mx-auto px-4 py-6">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Heading 
        description="Gerencie as pessoas do sistema"
        showButton={!isLoading}
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
          {pessoas.map((pessoa) => (
            <PessoaCard
              key={pessoa.id}
              pessoa={pessoa}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal de criação */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Criar Nova Pessoa</DialogTitle>
          </DialogHeader>
          <PessoaForm
            onSubmit={handleCreate}
            submitLabel="Criar Pessoa"
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de edição */}
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
              isLoading={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}

