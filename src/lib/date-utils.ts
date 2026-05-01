/**
 * Converte uma string de data no formato YYYY-MM-DD para um objeto Date
 * sem aplicar conversão de timezone.
 * 
 * Evita o problema de new Date('2025-10-31') que interpreta como UTC
 * e causa deslocamento de timezone.
 */
export function parseDateString(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day) // month - 1 porque Date usa 0-11 para meses
}

/**
 * Formata uma data no formato YYYY-MM-DD (ou ISO com timestamp) para exibição em português
 * sem aplicar conversão de timezone.
 */
export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
  // Se a data vier com timestamp (ISO format), extrair apenas a parte da data
  const dateOnly = dateString.split('T')[0]
  const date = parseDateString(dateOnly)
  return date.toLocaleDateString('pt-BR', options)
}

/**
 * Retorna o dia da semana e a data formatada
 * Ex: "Quinta-feira (31/10)"
 */
export function formatDateWithWeekday(dateString: string): string {
  const date = parseDateString(dateString)
  const weekday = date.toLocaleDateString('pt-BR', { weekday: 'long' })
  const dayMonth = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  // Capitalizar primeira letra do dia da semana
  const weekdayCapitalized = weekday.charAt(0).toUpperCase() + weekday.slice(1)
  return `${weekdayCapitalized} (${dayMonth})`
}

/**
 * Retorna o dia da semana e a data completa formatada
 * Ex: "Terça-feira 20/09/2025"
 */
export function formatDateWithWeekdayFull(dateString: string): string {
  // Se a data vier com timestamp (ISO format), extrair apenas a parte da data
  const dateOnly = dateString.split('T')[0]
  const date = parseDateString(dateOnly)
  const weekday = date.toLocaleDateString('pt-BR', { weekday: 'long' })
  const fullDate = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  // Capitalizar primeira letra do dia da semana
  const weekdayCapitalized = weekday.charAt(0).toUpperCase() + weekday.slice(1)
  return `${weekdayCapitalized} ${fullDate}`
}

