import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/http';
import type {
  PermissionsResponse,
  ModuleType,
  UpdatePermissionGroupPayload,
} from '../types/permissions';

export function usePermissions() {
  const [permissions, setPermissions] = useState<PermissionsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModule, setSelectedModuleState] = useState<ModuleType>('');

  const fetchPermissions = useCallback(async (module: ModuleType) => {
    if (!module) {
      setPermissions(null);
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get(`/management/permission-groups/permissions?module=${module}`);
      setPermissions(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar permissões');
      setPermissions(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePermissions = useCallback(async (permissionGroupId: string, payload: UpdatePermissionGroupPayload) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await api.put(`/management/permission-groups/${permissionGroupId}/permissions`, payload);
      
      // Recarrega os dados após a atualização
      await fetchPermissions(selectedModule);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar permissões');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [selectedModule, fetchPermissions]);

  const setSelectedModule = useCallback((module: ModuleType) => {
    setSelectedModuleState(module);
    fetchPermissions(module);
  }, [fetchPermissions]);

  useEffect(() => {
    fetchPermissions(selectedModule);
  }, []);

  return {
    permissions,
    isLoading,
    error,
    selectedModule,
    fetchPermissions,
    updatePermissions,
    setSelectedModule,
  };
}
