# Esquemas de Validação - Grupos de Permissão

Este diretório contém os esquemas de validação para as APIs relacionadas a grupos de permissão, utilizando a biblioteca `celebrate` (baseada em Joi).

## Estrutura dos Esquemas

### 1. `validateUpdatePermissionGroupSchema`
Valida a atualização de um grupo de permissão específico.

**Rota:** `PUT /api/permission-groups/:permissionGroupID/permissions`

**Parâmetros:**
- `permissionGroupID` (string, obrigatório): ID do grupo de permissão (ObjectId do MongoDB)

**Body:**
```typescript
{
  module: "production" | "sales" | "management",
  contexts: [
    {
      context: string,
      permissions: [
        {
          permission: string,
          active: boolean
        }
      ]
    }
  ]
}
```

### 2. `validateCreatePermissionGroupSchema`
Valida a criação de um novo grupo de permissão.

**Rota:** `POST /api/permission-groups`

**Body:**
```typescript
{
  label: string, // Nome do grupo (2-100 caracteres)
  module: "production" | "sales" | "management",
  contexts: [
    {
      context: string,
      permissions: [
        {
          permission: string,
          active: boolean
        }
      ]
    }
  ]
}
```

### 3. `validateListPermissionGroupsSchema`
Valida a listagem de grupos de permissão com filtros.

**Rota:** `GET /api/permission-groups`

**Query Parameters:**
- `module` (string, opcional): Filtrar por módulo
- `page` (number, opcional, padrão: 1): Página da paginação
- `limit` (number, opcional, padrão: 10): Limite de itens por página (máx: 100)

### 4. `validateGetPermissionGroupSchema`
Valida a busca de um grupo de permissão específico.

**Rota:** `GET /api/permission-groups/:permissionGroupID`

**Parâmetros:**
- `permissionGroupID` (string, obrigatório): ID do grupo de permissão

### 5. `validateDeletePermissionGroupSchema`
Valida a exclusão de um grupo de permissão.

**Rota:** `DELETE /api/permission-groups/:permissionGroupID`

**Parâmetros:**
- `permissionGroupID` (string, obrigatório): ID do grupo de permissão

## Módulos Disponíveis

Os módulos são definidos no enum `Module`:
- `production`: Módulo de produção
- `sales`: Módulo de vendas
- `management`: Módulo de gestão

## Exemplo de Uso

```typescript
import express from 'express';
import { validateUpdatePermissionGroupSchema } from '@/validations/permission-groups';

const router = express.Router();

router.put(
  '/permission-groups/:permissionGroupID',
  validateUpdatePermissionGroupSchema,
  async (req, res) => {
    // A validação já foi executada pelo middleware celebrate
    const { permissionGroupID } = req.params;
    const payload = req.body;
    
    // Lógica de atualização...
  }
);
```

## Exemplo de Payload

### Atualização de Grupo de Permissão
```json
{
  "module": "production",
  "contexts": [
    {
      "context": "meshes",
      "permissions": [
        {
          "permission": "production.meshes.list",
          "active": true
        },
        {
          "permission": "production.meshes.create",
          "active": false
        },
        {
          "permission": "production.meshes.edit",
          "active": true
        },
        {
          "permission": "production.meshes.delete",
          "active": false
        }
      ]
    },
    {
      "context": "stock",
      "permissions": [
        {
          "permission": "production.stock.list",
          "active": true
        },
        {
          "permission": "production.stock.create",
          "active": true
        },
        {
          "permission": "production.stock.edit",
          "active": false
        },
        {
          "permission": "production.stock.delete",
          "active": false
        }
      ]
    }
  ]
}
```

## Mensagens de Erro

Os esquemas incluem mensagens de erro personalizadas em português para melhor experiência do usuário:

- **Módulo inválido**: "Módulo deve ser um dos valores válidos: production, sales, management"
- **Campo obrigatório**: "Campo é obrigatório"
- **Array vazio**: "Deve haver pelo menos um item"
- **ObjectId inválido**: "ID deve ter 24 caracteres hexadecimais"

## Dependências

Para usar estes esquemas, certifique-se de ter as seguintes dependências instaladas:

```bash
npm install celebrate joi
npm install @types/joi # Para TypeScript
```

## Integração com Express

```typescript
import express from 'express';
import { errors } from 'celebrate';
import permissionGroupsRoutes from './routes/permission-groups';

const app = express();

app.use('/api', permissionGroupsRoutes);

// Middleware para tratar erros de validação do celebrate
app.use(errors());
```
