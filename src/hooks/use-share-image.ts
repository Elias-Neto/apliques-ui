import { useState, type RefObject } from "react"
import { toPng } from "html-to-image"
import { useToast } from "@/hooks/toast/use-toast"

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const captureBlob = async (node: HTMLElement): Promise<Blob> => {
  const dataUrl = await toPng(node, { cacheBust: true, pixelRatio: 2, backgroundColor: '#ffffff' })
  const response = await fetch(dataUrl)
  return response.blob()
}

export const useShareImage = (ref: RefObject<HTMLElement>, fileName: string) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const share = async () => {
    if (!ref.current) return
    setIsProcessing(true)
    try {
      const blob = await captureBlob(ref.current)
      const file = new File([blob], fileName, { type: 'image/png' })
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file] })
      } else {
        downloadBlob(blob, fileName)
        toast({ title: "Imagem baixada", description: "Agora você pode enviar a imagem no WhatsApp." })
      }
    } catch {
      toast({ title: "Erro ao gerar imagem", variant: "destructive" })
    } finally {
      setIsProcessing(false)
    }
  }

  const download = async () => {
    if (!ref.current) return
    setIsProcessing(true)
    try {
      const blob = await captureBlob(ref.current)
      downloadBlob(blob, fileName)
    } catch {
      toast({ title: "Erro ao gerar imagem", variant: "destructive" })
    } finally {
      setIsProcessing(false)
    }
  }

  return { share, download, isProcessing }
}
