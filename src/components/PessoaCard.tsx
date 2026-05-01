import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Edit, Trash2 } from "lucide-react";
import { Pessoa } from "@/types/pessoa";
import { usePessoas } from "@/hooks/use-pessoas";

interface PessoaCardProps {
  pessoa: Pessoa;
  onEdit: (pessoa: Pessoa) => void;
  onDelete: (id: string) => void;
}

export function PessoaCard({ pessoa, onEdit, onDelete }: PessoaCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [pessoaDetalhada, setPessoaDetalhada] = useState<Pessoa | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const { getPessoaById } = usePessoas();



  const handleViewDetails = async () => {
    setIsLoadingDetails(true);
    try {
      const dadosCompletos = await getPessoaById(pessoa.id);
      setPessoaDetalhada(dadosCompletos);
      setShowDetails(true);
    } catch (error) {
      console.error('Erro ao carregar detalhes da pessoa:', error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  return (
    <>
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div 
            className="flex-1 cursor-pointer"
            onClick={handleViewDetails}
          >
            <h3 className="font-semibold text-lg mb-1">{pessoa.name}</h3>
            <p className="text-sm text-muted-foreground">
              {pessoa.permissionGroups?.map((group) => group.label).join(', ') || 'Nenhum grupo'}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(pessoa)}
              title="Editar"
            >
              <Edit className="h-4 w-4" />
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  title="Excluir"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir {pessoa.name}? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(pessoa.id)}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </Card>

      {/* Modal de detalhes */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes da Pessoa</DialogTitle>
          </DialogHeader>
          
          {isLoadingDetails ? (
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : pessoaDetalhada ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{pessoaDetalhada.name}</h3>
              </div>
              
              <div>
                <Badge variant="secondary" className="mb-1">CPF</Badge>
                <p className="text-sm">{pessoaDetalhada.cpf || 'Não informado'}</p>
              </div>
              
              <div>
                <Badge variant="secondary" className="mb-1">Grupos de Permissão</Badge>
                <p className="text-sm">{pessoaDetalhada.permissionGroups?.map((group) => group.label).join(', ') || 'Nenhum grupo'}</p>
              </div>
              
              {pessoaDetalhada.phone && (
                <div>
                  <Badge variant="secondary" className="mb-1">Telefone</Badge>
                  <p className="text-sm">{pessoaDetalhada.phone}</p>
                </div>
              )}
              
              <div className="flex space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDetails(false);
                    onEdit(pessoaDetalhada);
                  }}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="flex-1"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir {pessoaDetalhada.name}? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          setShowDetails(false);
                          onDelete(pessoaDetalhada.id);
                        }}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">Erro ao carregar detalhes</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

