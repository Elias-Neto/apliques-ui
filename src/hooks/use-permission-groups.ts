import { useState, useEffect } from "react";
import { GrupoPermissao } from "@/types/pessoa";
import { api } from "@/services/http";

export function usePermissionsGroups() {
  const [grupos, setGrupos] = useState<GrupoPermissao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar grupos de permissão da API
  const fetchGrupos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('/management/permission-groups');
      setGrupos(response.data);
    } catch (err) {
      setError('Erro ao carregar grupos de permissão');
      console.error('Erro ao carregar grupos de permissão:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar grupos na inicialização
  useEffect(() => {
    fetchGrupos();
  }, []);

  return {
    grupos,
    isLoading,
    error,
    refetch: fetchGrupos
  };
}
