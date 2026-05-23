// Espelho do helper backend billing.helper.ts — mesma lógica, sem o throw agressivo.
// UI valida 1..28 antes de chamar; backend é a fonte de verdade após submit.
export const computeNextBillingAt = (fromDate: Date, billingDay: number): Date => {
  const year = fromDate.getUTCFullYear()
  const month = fromDate.getUTCMonth()
  const day = fromDate.getUTCDate()
  const sameMonthCandidate = new Date(Date.UTC(year, month, billingDay, 0, 0, 0, 0))
  if (day <= billingDay) return sameMonthCandidate
  return new Date(Date.UTC(year, month + 1, billingDay, 0, 0, 0, 0))
}
