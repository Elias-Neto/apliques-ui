// Espelho do helper backend billing.helper.ts — mesma lógica, sem o throw agressivo.
// UI valida 1..28 antes de chamar; backend é a fonte de verdade após submit.
//
// ADR 0011/D1: âncora em America/Sao_Paulo (BRT, UTC-3 fixo), não UTC 00:00.
// Brasil sem horário de verão desde o Decreto 9.772/2019 — se DST voltar, o
// teste-sentinela em compute-next-billing-at.test.ts quebra e reabrimos a ADR.
const BUSINESS_UTC_OFFSET_HOURS = 3

const businessDayKey = (date: Date): string =>
  new Date(date.getTime() - BUSINESS_UTC_OFFSET_HOURS * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10)

const startOfBusinessDay = (year: number, month0: number, day: number): Date =>
  new Date(Date.UTC(year, month0, day, BUSINESS_UTC_OFFSET_HOURS))

export const computeNextBillingAt = (fromDate: Date, billingDay: number): Date => {
  const [yearStr, monthStr, dayStr] = businessDayKey(fromDate).split('-')
  const year = Number(yearStr)
  const month = Number(monthStr) - 1
  const day = Number(dayStr)
  const sameMonthCandidate = startOfBusinessDay(year, month, billingDay)
  if (day <= billingDay) return sameMonthCandidate
  return startOfBusinessDay(year, month + 1, billingDay)
}
