import { forwardRef } from "react"
import { formatCurrency } from "@/lib/format"
import { formatDate } from "@/lib/date-utils"
import { computeExtratoData } from "../extrato.utils"
import { Customer } from "../customer.types"

interface ExtratoClienteCardProps {
  customer: Customer
  cutoff: Date | null
  tenantName: string
}

const formatDateObj = (d: Date) => d.toLocaleDateString('pt-BR')

// D4 (tech-design-02): mesmo padrão da Notinha de Pedido — inline styles,
// layout tabular/grade (evidência de campo da Juliana/Sonar, ver PRD §Decisões).
export const ExtratoClienteCard = forwardRef<HTMLDivElement, ExtratoClienteCardProps>(
  ({ customer, cutoff, tenantName }, ref) => {
    const data = computeExtratoData(customer, cutoff)
    const hoje = new Date()
    const periodoTexto = cutoff
      ? `Período: ${formatDateObj(cutoff)} até hoje`
      : 'Período: desde o início'
    const diaAnterior = cutoff ? new Date(cutoff.getFullYear(), cutoff.getMonth(), cutoff.getDate() - 1) : null

    return (
      <div
        ref={ref}
        style={{
          width: 320,
          backgroundColor: '#ffffff',
          borderRadius: 16,
          overflow: 'hidden',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div style={{ backgroundColor: '#1e293b', padding: '16px 20px' }}>
          <p style={{ color: '#ffffff', fontWeight: 700, fontSize: 16, textTransform: 'uppercase', letterSpacing: 0.5, margin: 0 }}>
            {tenantName}
          </p>
          <p style={{ color: '#94a3b8', fontSize: 12, margin: '2px 0 0 0' }}>Apliques em emborrachado</p>
        </div>

        <div style={{ height: 6, background: 'linear-gradient(to right, #ef4444, #fb923c, #ef4444)' }} />

        <div style={{ padding: '16px 20px 4px 20px' }}>
          <p style={{ fontSize: 12, textTransform: 'uppercase', color: '#94a3b8', fontWeight: 500, margin: 0 }}>
            Extrato de
          </p>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', margin: '2px 0 0 0' }}>{customer.name}</p>
          <p style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 0 0' }}>{periodoTexto}</p>
        </div>

        <div style={{ margin: '12px 20px', backgroundColor: '#f8fafc', borderRadius: 10, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
            Saldo anterior{diaAnterior && <span style={{ color: '#94a3b8' }}> (até {formatDateObj(diaAnterior)})</span>}
          </p>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#334155', margin: 0, whiteSpace: 'nowrap' }}>
            {formatCurrency(data.saldoAnterior)}
          </p>
        </div>

        <div style={{ padding: '4px 20px 0 20px' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid #e2e8f0', paddingBottom: 4, margin: 0 }}>
            Pedidos do período
          </p>
          {data.pedidosDoPeriodo.length === 0 ? (
            <p style={{ fontSize: 13, color: '#94a3b8', padding: '8px 0' }}>Nenhum pedido no período.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e2e8f0', fontSize: 13, marginTop: 6 }}>
              <tbody>
                {data.pedidosDoPeriodo.map(o => (
                  <tr key={o._id}>
                    <td style={{ border: '1px solid #e2e8f0', padding: '6px 8px', color: '#475569' }}>{formatDate(o.orderDate)}</td>
                    <td style={{ border: '1px solid #e2e8f0', padding: '6px 8px', textAlign: 'right', fontWeight: 600, color: '#334155', whiteSpace: 'nowrap' }}>
                      {formatCurrency(o.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ padding: '14px 20px 0 20px' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid #e2e8f0', paddingBottom: 4, margin: 0 }}>
            Pagamentos do período
          </p>
          {data.pagamentosDoPeriodo.length === 0 ? (
            <p style={{ fontSize: 13, color: '#94a3b8', padding: '8px 0' }}>Nenhum pagamento no período.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e2e8f0', fontSize: 13, marginTop: 6 }}>
              <tbody>
                {data.pagamentosDoPeriodo.map(p => (
                  <tr key={p.id}>
                    <td style={{ border: '1px solid #e2e8f0', padding: '6px 8px', color: '#475569' }}>{formatDate(p.date)}</td>
                    <td style={{ border: '1px solid #e2e8f0', padding: '6px 8px', textAlign: 'right', fontWeight: 600, color: '#334155', whiteSpace: 'nowrap' }}>
                      {formatCurrency(p.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ padding: '16px 20px 4px 20px' }}>
          <div style={{ backgroundColor: '#dc2626', borderRadius: 12, padding: '14px 16px' }}>
            <p style={{ color: '#fecaca', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, margin: '0 0 4px 0' }}>
              Saldo devedor atual
            </p>
            <p style={{ color: '#ffffff', fontSize: 22, fontWeight: 700, margin: 0, whiteSpace: 'nowrap' }}>
              {formatCurrency(data.saldoAtual)}
            </p>
          </div>
          <p style={{ textAlign: 'center', fontSize: 11, color: '#94a3b8', padding: '8px 0 0 0', margin: 0 }}>
            {formatCurrency(data.saldoAnterior)} (anterior) + {formatCurrency(data.totalPedidosPeriodo)} (pedidos) − {formatCurrency(data.totalPagamentosPeriodo)} (pagamentos)
          </p>
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: '#64748b', padding: '16px 0 14px 0', margin: 0 }}>
          Gerado em {formatDateObj(hoje)}
        </p>
      </div>
    )
  }
)

ExtratoClienteCard.displayName = 'ExtratoClienteCard'
