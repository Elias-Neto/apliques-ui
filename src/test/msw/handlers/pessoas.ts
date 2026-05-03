import { rest } from 'msw'

const BASE = 'http://localhost:3000'

export const MOCK_ME: {
  id: string
  name: string
  email: string
  phone?: string
  cpf?: string
  permissions: string[]
  tenant: { id: string; name: string; cnpj: string }
} = {
  id: 'pessoa-1',
  name: 'Maria Silva',
  email: 'maria@empresa.com',
  phone: '(81) 99999-0001',
  cpf: '123.456.789-01',
  permissions: ['management.people.list', 'billing.me.show'],
  tenant: { id: 'tenant-1', name: 'Têxtil Nordeste', cnpj: '12.345.678/0001-90' },
}

export const MOCK_PESSOAS = [
  {
    id: 'pessoa-1',
    name: 'Maria Silva',
    cpf: '123.456.789-01',
    phone: '(81) 99999-0001',
    permissionGroups: [{ id: 'group-1', label: 'Operador' }],
  },
]

export const MOCK_PESSOA_DETALHE = {
  ...MOCK_PESSOAS[0],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

export const pessoaHandlers = [
  rest.get(`${BASE}/management/people/me`, (_req, res, ctx) =>
    res(ctx.status(200), ctx.json(MOCK_ME))
  ),
  rest.get(`${BASE}/management/people`, (_req, res, ctx) =>
    res(ctx.status(200), ctx.json(MOCK_PESSOAS))
  ),
  rest.get(`${BASE}/management/people/:id`, (_req, res, ctx) =>
    res(ctx.status(200), ctx.json(MOCK_PESSOA_DETALHE))
  ),
  rest.post(`${BASE}/management/people`, (_req, res, ctx) =>
    res(ctx.status(201), ctx.json({ id: 'pessoa-nova', name: 'João Costa', cpf: '000.000.000-00', permissionGroups: [] }))
  ),
  rest.put(`${BASE}/management/people/:id`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json({ ...MOCK_PESSOA_DETALHE, id: req.params.id as string }))
  ),
  rest.delete(`${BASE}/management/people/:id`, (_req, res, ctx) =>
    res(ctx.status(204))
  ),
]
