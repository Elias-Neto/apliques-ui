import { describe, it, expect } from 'vitest'
import { accountCreateSchema } from './account-create'

describe('accountCreateSchema', () => {
  const valid = {
    companyName: 'Empresa Teste',
    companyCnpj: '12.345.678/0001-95',
    ownerName: 'Dono Teste',
    ownerPhone: '(81) 9999-9999',
    ownerCpf: '123.456.789-01',
    ownerPassword: 'senha123',
  }

  it('todos os campos válidos → parse sem erro', () => {
    const result = accountCreateSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('companyCnpj vazio → aceita (campo opcional)', () => {
    const result = accountCreateSchema.safeParse({ ...valid, companyCnpj: '' })
    expect(result.success).toBe(true)
  })

  it('companyCnpj parcial (menos de 18 chars, não vazio) → ZodError', () => {
    const result = accountCreateSchema.safeParse({ ...valid, companyCnpj: '12345678' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toContain('companyCnpj')
  })

  it('ownerPassword com menos de 8 chars → ZodError', () => {
    const result = accountCreateSchema.safeParse({ ...valid, ownerPassword: 'abc' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toContain('ownerPassword')
  })

  it('ownerCpf com menos de 14 chars → ZodError', () => {
    const result = accountCreateSchema.safeParse({ ...valid, ownerCpf: '123' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toContain('ownerCpf')
  })
})
