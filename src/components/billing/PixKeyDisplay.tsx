import { useState } from "react"
import { Copy, Check, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/toast/use-toast"

interface IPixKeyDisplayProps {
  pixKey: string
}

const WHATSAPP_URL =
  "https://wa.me/55819989321?text=Ol%C3%A1%2C+segue+meu+comprovante+de+pagamento"

export function PixKeyDisplay({ pixKey }: IPixKeyDisplayProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pixKey)
    } catch {
      // fallback for Android WebView / older browsers
      const el = document.createElement("input")
      el.value = pixKey
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      document.body.removeChild(el)
    }

    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
    toast({ title: "Chave PIX copiada!" })
  }

  const handleWhatsApp = () => {
    window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="space-y-4">
      <p className="font-medium">Pague via PIX</p>

      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Chave PIX:</p>
        <div className="flex gap-2">
          <Input readOnly value={pixKey} className="font-mono text-sm" />
          <Button variant="outline" onClick={handleCopy} className="shrink-0 gap-1">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copiado!" : "Copiar chave"}
          </Button>
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">
          Após o pagamento, envie o comprovante:
        </p>
        <Button variant="outline" className="w-full gap-2" onClick={handleWhatsApp}>
          <ExternalLink className="h-4 w-4" />
          Abrir WhatsApp
        </Button>
      </div>
    </div>
  )
}
