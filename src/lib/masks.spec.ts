import { describe, it, expect } from 'vitest'
import { formatCPF, formatCNPJ, formatPhone } from './masks'

describe('formatCPF', () => {
  it("'12345678901' → '123.456.789-01'", () => {
    expect(formatCPF('12345678901')).toBe('123.456.789-01')
  })

  it('string com caracteres não-numéricos → formata só os números', () => {
    expect(formatCPF('123.456.789-01')).toBe('123.456.789-01')
  })

  it('string vazia → vazia', () => {
    expect(formatCPF('')).toBe('')
  })

  it('mais de 11 dígitos → trunca em 11', () => {
    expect(formatCPF('123456789012345')).toBe('123.456.789-01')
  })
})

describe('formatCNPJ', () => {
  it("'12345678000195' → '12.345.678/0001-95'", () => {
    expect(formatCNPJ('12345678000195')).toBe('12.345.678/0001-95')
  })

  it('mais de 14 dígitos → trunca', () => {
    expect(formatCNPJ('123456780001959999')).toBe('12.345.678/0001-95')
  })
})

describe('formatPhone', () => {
  it("10 dígitos (fixo) → '(81) 3333-3333'", () => {
    expect(formatPhone('8133333333')).toBe('(81) 3333-3333')
  })

  it("11 dígitos (celular) → '(81) 99999-9999'", () => {
    expect(formatPhone('81999999999')).toBe('(81) 99999-9999')
  })

  it('string vazia → vazia', () => {
    expect(formatPhone('')).toBe('')
  })
})
