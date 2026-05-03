import { rest } from 'msw'

const BASE = 'http://localhost:3000'

export const MOCK_GRUPOS = [
  { id: 'group-1', label: 'Operador' },
  { id: 'group-2', label: 'Administrador' },
]

export const MOCK_PERMISSIONS_RESPONSE = {
  contexts: [
    {
      context: 'management.people',
      label: 'Pessoas',
      permissions: [
        { permission: 'management.people.list', label: 'Listar' },
        { permission: 'management.people.create', label: 'Criar' },
      ],
    },
  ],
  permissionGroups: [
    {
      id: 'group-1',
      label: 'Operador',
      moduleActive: true,
      permissions: [
        { permission: 'management.people.list', active: true },
        { permission: 'management.people.create', active: false },
      ],
    },
  ],
}

export const permissionGroupHandlers = [
  rest.get(`${BASE}/management/permission-groups`, (_req, res, ctx) =>
    res(ctx.status(200), ctx.json(MOCK_GRUPOS))
  ),
  rest.get(`${BASE}/management/permission-groups/permissions`, (_req, res, ctx) =>
    res(ctx.status(200), ctx.json(MOCK_PERMISSIONS_RESPONSE))
  ),
  rest.put(`${BASE}/management/permission-groups/:id/permissions`, (_req, res, ctx) =>
    res(ctx.status(200))
  ),
]
