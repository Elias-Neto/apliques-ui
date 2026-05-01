import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Pessoa } from "@/types/pessoa";
import { usePermissionsGroups } from "@/hooks/use-permission-groups";

interface PessoaFormProps {
  initialData?: Partial<Pessoa>;
  onSubmit: (data: {
    name: string;
    cpf: string;
    password?: string;
    permissionGroups: string[];
    phone?: string;
  }) => void;
  submitLabel: string;
  isLoading?: boolean;
}

// Determinar se é modo de edição
const isEditMode = (initialData?: Partial<Pessoa>) => {
  return initialData && initialData.id;
};

export function PessoaForm({ 
  initialData, 
  onSubmit, 
  submitLabel, 
  isLoading = false 
}: PessoaFormProps) {
  const { grupos, isLoading: isLoadingGrupos, error: errorGrupos } = usePermissionsGroups();
  const editMode = isEditMode(initialData);
  
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    cpf: initialData?.cpf || "",
    password: "",
    permissionGroups: initialData?.permissionGroups || [],
    phone: initialData?.phone || "",
  });

  // Função para formatar CPF
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  // Função para formatar telefone
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
  };

  // Atualizar o formulário quando initialData mudar
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        cpf: initialData.cpf || "",
        password: "",
        permissionGroups: initialData.permissionGroups || [],
        phone: initialData.phone || "",
      });
    }
  }, [initialData, editMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isPasswordValid = editMode ? true : formData.password.trim(); // Senha só obrigatória na criação
    if (formData.name.trim() && formData.cpf.trim() && isPasswordValid && formData.permissionGroups.length > 0) {
      // Converter permissionGroups para array de strings (IDs)
      const permissionGroupsIds = formData.permissionGroups.map(group => group.id);
      
      // No modo edição, não enviar senha se estiver vazia
      const dataToSubmit = editMode && !formData.password.trim() 
        ? { ...formData, permissionGroups: permissionGroupsIds, password: undefined }
        : { ...formData, permissionGroups: permissionGroupsIds };
      onSubmit(dataToSubmit);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    // Aplicar formatação específica para cada campo
    if (field === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (field === 'phone') {
      formattedValue = formatPhone(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: formattedValue
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Digite o nome da pessoa"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cpf">CPF *</Label>
        <Input
          id="cpf"
          value={formData.cpf}
          onChange={(e) => handleInputChange('cpf', e.target.value)}
          placeholder="000.000.000-00"
          maxLength={14}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          placeholder="(00) 00000-0000"
          maxLength={15}
        />
      </div>

      {!editMode && (
        <div className="space-y-2">
          <Label htmlFor="password">Senha *</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="Digite a senha"
            required
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="permissionGroups">Grupos de Permissão *</Label>
        <Select
          value={formData.permissionGroups[0]?.id || ""}
          onValueChange={(value) => {
            const selectedGroup = grupos.find(g => g.id === value);
            if (selectedGroup) {
              setFormData(prev => ({
                ...prev,
                permissionGroups: [selectedGroup]
              }));
            }
          }}
          disabled={isLoadingGrupos}
        >
          <SelectTrigger>
            <SelectValue placeholder={
              isLoadingGrupos 
                ? "Carregando grupos..." 
                : errorGrupos 
                  ? "Erro ao carregar grupos" 
                  : "Selecione um grupo de permissão"
            } />
          </SelectTrigger>
          <SelectContent>
            {grupos.map((grupo) => (
              <SelectItem key={grupo.id} value={grupo.id}>
                {grupo.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errorGrupos && (
          <p className="text-sm text-red-500">{errorGrupos}</p>
        )}
      </div>

      <Button 
        type="submit" 
        disabled={isLoading || !formData.name.trim() || !formData.cpf.trim() || (!editMode && !formData.password.trim()) || formData.permissionGroups.length === 0}
      >
        {isLoading ? "Salvando..." : submitLabel}
      </Button>
    </form>
  );
}

