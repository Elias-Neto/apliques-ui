import { rest } from 'msw'

const BASE = 'http://localhost:3000'

export const sessionHandlers = [
  rest.post(`${BASE}/sessions`, (_req, res, ctx) =>
    res(ctx.status(200), ctx.json({ token: 'fake-jwt-token' }))
  ),
]
