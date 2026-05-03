import { describe, it, expect } from 'vitest'
import { loginSchema } from './login'

describe('loginSchema', () => {
  it('CPF com 14 chars + password não-vazio → parse sem erro', () => {
    const result = loginSchema.safeParse({ cpf: '123.456.789-01', password: 'abc' })
    expect(result.success).toBe(true)
  })

  it('CPF com menos de 14 chars → ZodError no campo cpf', () => {
    const result = loginSchema.safeParse({ cpf: '123', password: 'abc' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toContain('cpf')
  })

  it('password vazio → ZodError no campo password', () => {
    const result = loginSchema.safeParse({ cpf: '123.456.789-01', password: '' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toContain('password')
  })

  it('objeto vazio → ZodError (ambos os campos)', () => {
    const result = loginSchema.safeParse({})
    expect(result.success).toBe(false)
    expect(result.error?.issues.length).toBeGreaterThan(0)
  })
})
