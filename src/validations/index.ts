/**
 * Índice de exportação dos esquemas de validação
 */

// Esquemas de validação para grupos de permissão
export {
  validateCreatePermissionGroupSchema,
  validateUpdatePermissionGroupSchema,
  validateListPermissionGroupsSchema,
  validateGetPermissionGroupSchema,
  validateDeletePermissionGroupSchema,
} from './permission-groups';

// Re-exportar tipos relacionados
export type {
  UpdatePermissionGroupPayload,
  UpdatePermissionGroupContext,
  PermissionGroup,
  PermissionGroupPermission,
  ModuleType,
} from '@/types/permissions';

export { Module } from '@/types/enums';



