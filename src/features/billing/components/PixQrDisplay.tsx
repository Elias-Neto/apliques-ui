import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

interface PixQrDisplayProps {
  brCode: string
  brCodeBase64: string
  expiresAt: string
}

function useCountdown(expiresAt: string) {
  const [secondsLeft, setSecondsLeft] = useState(() =>
    Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000))
  )

  useEffect(() => {
    if (secondsLeft <= 0) return
    const id = setInterval(() => setSecondsLeft(s => Math.max(0, s - 1)), 1000)
    return () => clearInterval(id)
  }, [expiresAt])

  return secondsLeft
}

export function PixQrDisplay({ brCode, brCodeBase64, expiresAt }: PixQrDisplayProps) {
  const [copied, setCopied] = useState(false)
  const [showFallback, setShowFallback] = useState(false)
  const secondsLeft = useCountdown(expiresAt)

  const h = Math.floor(secondsLeft / 3600)
  const m = Math.floor((secondsLeft % 3600) / 60)
  const s = secondsLeft % 60
  const countdown = h > 0
    ? `${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`
    : `${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(brCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch {
      setShowFallback(true)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <img src={brCodeBase64} alt="QR Code PIX" className="w-48 h-48 border rounded-lg" />
      {secondsLeft > 0 ? (
        <p className="text-sm text-muted-foreground">
          Expira em{" "}
          <span className="font-mono font-medium text-foreground">{countdown}</span>
        </p>
      ) : (
        <p className="text-sm text-destructive font-medium">
          PIX expirado — aguarde o próximo ser gerado
        </p>
      )}
      <Button
        onClick={handleCopy}
        variant="outline"
        className="w-full gap-2"
        disabled={secondsLeft === 0}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? "Copiado!" : "Copiar PIX"}
      </Button>
      {showFallback && (
        <div className="w-full space-y-1">
          <p className="text-xs text-muted-foreground">Selecione e pressione Ctrl+C:</p>
          <input
            readOnly
            value={brCode}
            className="w-full text-xs border rounded px-2 py-1 font-mono bg-muted"
            onFocus={e => e.target.select()}
          />
        </div>
      )}
      <p className="text-xs text-center text-muted-foreground">
        Esse PIX expira em 24h. Quando expirar, geramos um novo aqui na hora.
      </p>
    </div>
  )
}
