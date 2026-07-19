import { describe, it, expect } from 'vitest'
import { formatCurrency } from './format'

// pt-BR Intl.NumberFormat usa non-breaking space (code point 160) entre "R$" e o valor
const nbsp = String.fromCharCode(160)

describe('formatCurrency', () => {
  it('formata centavos em reais pt-BR', () => {
    expect(formatCurrency(120000)).toBe(`R$${nbsp}1.200,00`)
  })

  it('formata zero', () => {
    expect(formatCurrency(0)).toBe(`R$${nbsp}0,00`)
  })

  it('formata 1 centavo', () => {
    expect(formatCurrency(1)).toBe(`R$${nbsp}0,01`)
  })
})
