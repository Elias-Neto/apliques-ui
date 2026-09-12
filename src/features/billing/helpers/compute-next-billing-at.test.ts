import { computeNextBillingAt } from './compute-next-billing-at'

// ADR 0011/D1 — mesma âncora BRT do helper backend (billing.helper.ts).
// fromDate usa T15:00Z (meio-dia BRT) pra não cruzar a virada do dia civil por acidente.
describe('computeNextBillingAt', () => {
  it('billingDay no futuro no mesmo mês', () => {
    expect(
      computeNextBillingAt(new Date('2026-05-16T15:00:00.000Z'), 20).toISOString(),
    ).toBe('2026-05-20T03:00:00.000Z')
  })

  it('billingDay já passou no mês → próximo mês', () => {
    expect(
      computeNextBillingAt(new Date('2026-05-16T15:00:00.000Z'), 10).toISOString(),
    ).toBe('2026-06-10T03:00:00.000Z')
  })

  it('fromDate é exatamente o billingDay → retorna mesmo dia (idempotente)', () => {
    expect(
      computeNextBillingAt(new Date('2026-05-10T15:00:00.000Z'), 10).toISOString(),
    ).toBe('2026-05-10T03:00:00.000Z')
  })

  it('transição de ano (dez→jan)', () => {
    expect(
      computeNextBillingAt(new Date('2026-12-25T15:00:00.000Z'), 5).toISOString(),
    ).toBe('2027-01-05T03:00:00.000Z')
  })

  it('regressão ADR 0011/D1: usa o dia civil BRT, não o dia UTC bruto, perto da virada', () => {
    // 2026-09-01T02:00Z = 2026-08-31T23:00 BRT — ainda dia 31 em BRT.
    expect(
      computeNextBillingAt(new Date('2026-09-01T02:00:00.000Z'), 1).toISOString(),
    ).toBe('2026-09-01T03:00:00.000Z')
  })
})
