import { useRef } from "react"
import { Share2, Download } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useShareImage } from "@/hooks/use-share-image"
import { useUser } from "@/contexts/UserContext"
import { NotinhaPedidoCard } from "./NotinhaPedidoCard"
import { Order } from "../order.types"

interface NotinhaPedidoDialogProps {
  order: Order
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NotinhaPedidoDialog({ order, open, onOpenChange }: NotinhaPedidoDialogProps) {
  const { user } = useUser()
  const cardRef = useRef<HTMLDivElement>(null)
  const fileName = `notinha-pedido-${(order.customer?.name ?? 'cliente').toLowerCase().replace(/\s+/g, '-')}.png`
  const { share, download, isProcessing } = useShareImage(cardRef, fileName)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Notinha do pedido</DialogTitle>
        </DialogHeader>

        <div className="flex justify-center bg-slate-50 rounded-2xl p-3">
          <NotinhaPedidoCard ref={cardRef} order={order} tenantName={user?.tenant.name ?? ''} />
        </div>

        <div className="space-y-2">
          <Button className="w-full bg-green-600 hover:bg-green-700" onClick={share} disabled={isProcessing}>
            <Share2 className="h-4 w-4 mr-2" /> Compartilhar imagem
          </Button>
          <Button variant="outline" className="w-full" onClick={download} disabled={isProcessing}>
            <Download className="h-4 w-4 mr-2" /> Salvar imagem
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
