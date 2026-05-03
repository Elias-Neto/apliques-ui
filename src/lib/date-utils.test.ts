import { parseDateString, formatDate, formatDateWithWeekday, formatDateWithWeekdayFull } from './date-utils'

describe('parseDateString', () => {
  it('converte YYYY-MM-DD sem deslocamento de timezone', () => {
    const date = parseDateString('2025-10-31')
    expect(date.getDate()).toBe(31)
    expect(date.getMonth()).toBe(9)
    expect(date.getFullYear()).toBe(2025)
  })

  it('ignora timestamp ISO quando fornecido', () => {
    const date = parseDateString('2025-10-31')
    expect(date.getDate()).toBe(31)
  })
})

describe('formatDate', () => {
  it('formata YYYY-MM-DD em DD/MM/YYYY pt-BR', () => {
    const result = formatDate('2025-10-31')
    expect(result).toBe('31/10/2025')
  })

  it('extrai data de string ISO com timestamp', () => {
    const result = formatDate('2025-10-31T00:00:00.000Z')
    expect(result).toBe('31/10/2025')
  })
})

describe('formatDateWithWeekday', () => {
  it('retorna "Sexta-feira (31/10)" para 2025-10-31', () => {
    const result = formatDateWithWeekday('2025-10-31')
    expect(result).toMatch(/sexta-feira/i)
    expect(result).toContain('31/10')
  })
})

describe('formatDateWithWeekdayFull', () => {
  it('retorna dia da semana + data completa', () => {
    const result = formatDateWithWeekdayFull('2025-10-31')
    expect(result).toMatch(/sexta-feira/i)
    expect(result).toContain('31/10/2025')
  })
})
