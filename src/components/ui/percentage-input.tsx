import * as React from "react"
import { Input } from "@/components/ui/input"

interface PercentageInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number
  onChange: (value: number) => void
}

export function PercentageInput({ value, onChange, ...props }: PercentageInputProps) {
  // Converte o valor para string formatada para exibição
  const [displayValue, setDisplayValue] = React.useState(() => {
    return value.toString()
  })

  // Atualiza o display quando o valor muda externamente
  React.useEffect(() => {
    setDisplayValue(value.toString())
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value.replace(/[^0-9]/g, '')
    
    // Remove zeros à esquerda
    newValue = newValue.replace(/^0+/, '')
    
    // Limita a 3 dígitos (max 999%)
    if (newValue.length > 3) {
      newValue = newValue.slice(0, 3)
    }

    // Atualiza o display
    setDisplayValue(newValue)
    
    // Converte para número e chama o onChange
    const numericValue = newValue ? parseInt(newValue, 10) : 0
    onChange(numericValue)
  }

  const handleBlur = () => {
    // Garante que sempre exiba um valor, mesmo que vazio
    if (!displayValue) {
      setDisplayValue('0')
      onChange(0)
    }
  }

  return (
    <div className="relative">
      <Input
        {...props}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground">
        %
      </div>
    </div>
  )
} 