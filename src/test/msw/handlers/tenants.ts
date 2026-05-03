import { rest } from 'msw'

const BASE = 'http://localhost:3000'

export const tenantHandlers = [
  rest.post(`${BASE}/tenants`, (_req, res, ctx) =>
    res(ctx.status(201), ctx.json({ id: 'tenant-1' }))
  ),
]
