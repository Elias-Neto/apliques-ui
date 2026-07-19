import { forwardRef } from "react"
import { formatCurrency } from "@/lib/format"
import { formatDate } from "@/lib/date-utils"
import { Order } from "../order.types"

interface NotinhaPedidoCardProps {
  order: Order
  tenantName: string
}

// D4 (tech-design-02): card capturado por html-to-image usa inline styles,
// não classes Tailwind — mesmo padrão do sonar-ui, evita depender de
// extração de stylesheet que o html-to-image não garante 1:1.
export const NotinhaPedidoCard = forwardRef<HTMLDivElement, NotinhaPedidoCardProps>(
  ({ order, tenantName }, ref) => (
    <div
      ref={ref}
      style={{
        width: 300,
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

      <div style={{ height: 6, background: 'linear-gradient(to right, #3b82f6, #6366f1, #a855f7)' }} />

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <p style={{ fontSize: 12, textTransform: 'uppercase', color: '#94a3b8', fontWeight: 500, margin: 0 }}>
            Pedido para
          </p>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', margin: '2px 0 0 0' }}>
            {order.customer?.name ?? 'Cliente'}
          </p>
          <p style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 0 0' }}>
            Pedido em {formatDate(order.orderDate)}
          </p>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e2e8f0', fontSize: 14 }}>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i}>
                <td style={{ border: '1px solid #e2e8f0', padding: 8, verticalAlign: 'top', color: '#334155' }}>
                  <p style={{ fontWeight: 600, margin: 0 }}>
                    {item.material?.name ?? '—'} · {item.color?.name ?? '—'}
                  </p>
                  {item.design?.name && (
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 0 0' }}>{item.design.name}</p>
                  )}
                  <p style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 0 0' }}>
                    {item.quantity} un × {formatCurrency(item.unitPrice)}
                  </p>
                </td>
                <td style={{ border: '1px solid #e2e8f0', padding: 8, verticalAlign: 'top', textAlign: 'right', fontWeight: 700, color: '#1e293b', whiteSpace: 'nowrap' }}>
                  {formatCurrency(item.unitPrice * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: 14, color: '#64748b', fontWeight: 500, textTransform: 'uppercase', margin: 0 }}>
            Total do pedido
          </p>
          <p style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', margin: 0 }}>
            {formatCurrency(order.totalPrice)}
          </p>
        </div>
      </div>
    </div>
  )
)

NotinhaPedidoCard.displayName = 'NotinhaPedidoCard'
