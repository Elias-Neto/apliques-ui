import { useState, useEffect, useCallback } from "react";
import { Pessoa, GrupoPermissao } from "@/types/pessoa";
import { api } from "@/services/http";

export function usePessoas() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para normalizar dados da API
  const normalizePessoa = (data: unknown): Pessoa => {
    const obj = data as Record<string, unknown>;
    
    // Normalizar permissionGroups - manter estrutura de objetos
    let permissionGroups: GrupoPermissao[] = [];
    
    // Verificar se existe permissionGroups
    const groupsData = obj.permissionGroups;
    
    if (Array.isArray(groupsData)) {
      permissionGroups = groupsData.map((group: unknown) => {
        if (typeof group === 'object' && group !== null) {
          const groupObj = group as Record<string, unknown>;
          return {
            id: String(groupObj.id || ''),
            label: String(groupObj.label || groupObj.name || '')
          };
        }
        // Se for uma string, criar um objeto com id vazio
        return {
          id: '',
          label: String(group)
        };
      }).filter(group => group.label.trim() !== '');
    }
    
    return {
      id: (obj.id as string) || '',
      name: (obj.name as string) || '',
      cpf: (obj.cpf as string) || '',
      password: (obj.password as string) || '',
      permissionGroups: permissionGroups,
      phone: (obj.phone as string) || '',
      createdAt: obj.createdAt as string,
      updatedAt: obj.updatedAt as string
    };
  };

  // Carregar pessoas da API
  const fetchPessoas = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('/management/people');
      const normalizedData = Array.isArray(response.data) 
        ? response.data.map(normalizePessoa)
        : [];
      setPessoas(normalizedData);
    } catch (err) {
      setError('Erro ao carregar pessoas');
      console.error('Erro ao carregar pessoas:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carregar pessoas na inicialização
  useEffect(() => {
    fetchPessoas();
  }, [fetchPessoas]);

  // Criar nova pessoa
  const createPessoa = async (pessoaData: Omit<Pessoa, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await api.post('/management/people', pessoaData);
      const normalizedData = normalizePessoa(response.data);
      setPessoas(prev => [...prev, normalizedData]);
      return normalizedData;
    } catch (err) {
      setError('Erro ao criar pessoa');
      console.error('Erro ao criar pessoa:', err);
      throw err;
    }
  };

  // Atualizar pessoa
  const updatePessoa = async (id: string, pessoaData: Partial<Omit<Pessoa, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      const response = await api.put(`/management/people/${id}`, pessoaData);
      const normalizedData = normalizePessoa(response.data);
      setPessoas(prev => prev.map(pessoa => 
        pessoa.id === id ? normalizedData : pessoa
      ));
      return normalizedData;
    } catch (err) {
      setError('Erro ao atualizar pessoa');
      console.error('Erro ao atualizar pessoa:', err);
      throw err;
    }
  };

  // Deletar pessoa
  const deletePessoa = async (id: string) => {
    try {
      await api.delete(`/management/people/${id}`);
      setPessoas(prev => prev.filter(pessoa => pessoa.id !== id));
    } catch (err) {
      setError('Erro ao deletar pessoa');
      console.error('Erro ao deletar pessoa:', err);
      throw err;
    }
  };

  // Buscar pessoa por ID
  const getPessoaById = async (id: string) => {
    try {
      const response = await api.get(`/management/people/${id}`);
      return normalizePessoa(response.data);
    } catch (err) {
      setError('Erro ao buscar pessoa');
      console.error('Erro ao buscar pessoa:', err);
      throw err;
    }
  };

  return {
    pessoas,
    isLoading,
    error,
    createPessoa,
    updatePessoa,
    deletePessoa,
    getPessoaById,
    refetch: fetchPessoas
  };
}

