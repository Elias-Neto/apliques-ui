import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Color } from "../color.types"
import { ColorCodeFormat } from "../color-code.utils"

const schema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
})
type NameForm = z.infer<typeof schema>

type SubmitPayload = {
  name: string
  code: string | null
  codeFormat: ColorCodeFormat | null
}

interface ColorModalProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  onSubmit: (data: SubmitPayload) => void
  isLoading?: boolean
  title: string
  initial?: Partial<Color>
}

type FormatOption = 'none' | ColorCodeFormat

function parseInitial(initial?: Partial<Color>): {
  format: FormatOption
  hex: string
  r: string; g: string; b: string
  c: string; m: string; y: string; k: string
  text: string
} {
  const fmt = (initial?.codeFormat ?? 'none') as FormatOption
  const code = initial?.code ?? ''

  if (fmt === 'rgb' && code) {
    const [r = '', g = '', b = ''] = code.split(',')
    return { format: 'rgb', hex: '', r, g, b, c: '', m: '', y: '', k: '', text: '' }
  }
  if (fmt === 'cmyk' && code) {
    const [c = '', m = '', y = '', k = ''] = code.split(',')
    return { format: 'cmyk', hex: '', r: '', g: '', b: '', c, m, y, k, text: '' }
  }
  if (fmt === 'hex') return { format: 'hex', hex: code, r: '', g: '', b: '', c: '', m: '', y: '', k: '', text: '' }
  if (fmt === 'text') return { format: 'text', hex: '', r: '', g: '', b: '', c: '', m: '', y: '', k: '', text: code }
  return { format: 'none', hex: '', r: '', g: '', b: '', c: '', m: '', y: '', k: '', text: '' }
}

export function ColorModal({ open, onOpenChange, onSubmit, isLoading, title, initial }: ColorModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NameForm>({
    resolver: zodResolver(schema),
    defaultValues: { name: initial?.name ?? '' },
  })

  const [fmt, setFmt] = useState<FormatOption>('none')
  const [hex, setHex] = useState('')
  const [r, setR] = useState(''); const [g, setG] = useState(''); const [b, setB] = useState('')
  const [c, setC] = useState(''); const [m, setM] = useState(''); const [y, setY] = useState(''); const [k, setK] = useState('')
  const [text, setText] = useState('')

  useEffect(() => {
    reset({ name: initial?.name ?? '' })
    const parsed = parseInitial(initial)
    setFmt(parsed.format)
    setHex(parsed.hex)
    setR(parsed.r); setG(parsed.g); setB(parsed.b)
    setC(parsed.c); setM(parsed.m); setY(parsed.y); setK(parsed.k)
    setText(parsed.text)
  }, [initial, reset])

  const buildPayload = (name: string): SubmitPayload => {
    if (fmt === 'hex') return { name, code: hex.trim() || null, codeFormat: 'hex' }
    if (fmt === 'rgb') return { name, code: `${r},${g},${b}`, codeFormat: 'rgb' }
    if (fmt === 'cmyk') return { name, code: `${c},${m},${y},${k}`, codeFormat: 'cmyk' }
    if (fmt === 'text') return { name, code: text.trim() || null, codeFormat: 'text' }
    return { name, code: null, codeFormat: null }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(d => onSubmit(buildPayload(d.name)))} className="space-y-4">
          <div className="space-y-2">
            <Label>Nome *</Label>
            <Input {...register("name")} placeholder="Ex: Verde Bandeira" />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Formato do código</Label>
            <Select value={fmt} onValueChange={v => setFmt(v as FormatOption)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem código</SelectItem>
                <SelectItem value="hex">Hex</SelectItem>
                <SelectItem value="rgb">RGB</SelectItem>
                <SelectItem value="cmyk">CMYK</SelectItem>
                <SelectItem value="text">Texto livre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {fmt === 'hex' && (
            <div className="space-y-2">
              <Label>Hex</Label>
              <Input value={hex} onChange={e => setHex(e.target.value)} placeholder="#RRGGBB" />
            </div>
          )}

          {fmt === 'rgb' && (
            <div className="space-y-2">
              <Label>RGB (0–255)</Label>
              <div className="flex gap-2">
                <Input value={r} onChange={e => setR(e.target.value)} placeholder="R" type="number" min={0} max={255} className="w-full" />
                <Input value={g} onChange={e => setG(e.target.value)} placeholder="G" type="number" min={0} max={255} className="w-full" />
                <Input value={b} onChange={e => setB(e.target.value)} placeholder="B" type="number" min={0} max={255} className="w-full" />
              </div>
            </div>
          )}

          {fmt === 'cmyk' && (
            <div className="space-y-2">
              <Label>CMYK (0–100%)</Label>
              <div className="flex gap-2">
                <Input value={c} onChange={e => setC(e.target.value)} placeholder="C" type="number" min={0} max={100} className="w-full" />
                <Input value={m} onChange={e => setM(e.target.value)} placeholder="M" type="number" min={0} max={100} className="w-full" />
                <Input value={y} onChange={e => setY(e.target.value)} placeholder="Y" type="number" min={0} max={100} className="w-full" />
                <Input value={k} onChange={e => setK(e.target.value)} placeholder="K" type="number" min={0} max={100} className="w-full" />
              </div>
            </div>
          )}

          {fmt === 'text' && (
            <div className="space-y-2">
              <Label>Código</Label>
              <Input value={text} onChange={e => setText(e.target.value)} placeholder="Ex: Pantone 340 C" />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
