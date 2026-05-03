import { describe, it, expect } from 'vitest'
import { pessoaCreateSchema, pessoaUpdateSchema } from './pessoa.schema'

describe('pessoaCreateSchema', () => {
  const valid = {
    name: 'Funcionário Teste',
    cpf: '123.456.789-01',
    phone: '(81) 99999-9999',
    password: 'senha123',
    permissionGroups: ['507f1f77bcf86cd799439011'],
  }

  it('campos válidos → parse sem erro', () => {
    const result = pessoaCreateSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('name vazio → ZodError', () => {
    const result = pessoaCreateSchema.safeParse({ ...valid, name: '' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toContain('name')
  })

  it('cpf com menos de 14 chars → ZodError', () => {
    const result = pessoaCreateSchema.safeParse({ ...valid, cpf: '123' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toContain('cpf')
  })

  it('permissionGroups array vazio → ZodError', () => {
    const result = pessoaCreateSchema.safeParse({ ...valid, permissionGroups: [] })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toContain('permissionGroups')
  })

  it('password ausente → ZodError', () => {
    const { password, ...withoutPassword } = valid
    const result = pessoaCreateSchema.safeParse(withoutPassword)
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toContain('password')
  })
})

describe('pessoaUpdateSchema', () => {
  it('sem password → parse sem erro (password é optional no update)', () => {
    const result = pessoaUpdateSchema.safeParse({
      name: 'Novo Nome',
      cpf: '123.456.789-01',
      permissionGroups: ['507f1f77bcf86cd799439011'],
    })
    expect(result.success).toBe(true)
  })

  it('com password → parse sem erro', () => {
    const result = pessoaUpdateSchema.safeParse({
      name: 'Novo Nome',
      cpf: '123.456.789-01',
      password: 'novaSenha',
      permissionGroups: ['507f1f77bcf86cd799439011'],
    })
    expect(result.success).toBe(true)
  })
})
