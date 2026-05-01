import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function CurrencyInput({ value, onChange, className, ...props }: CurrencyInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove tudo que não for número
    const numbers = e.target.value.replace(/\D/g, "");
    
    // Converte para número (em centavos)
    const newValue = numbers ? parseInt(numbers, 10) : 0;
    
    // Chama o onChange com o novo valor
    onChange(newValue);
  };

  // Formata o valor para exibição (R$ X,XX)
  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  }).format(value / 100);

  return (
    <Input
      {...props}
      type="text"
      inputMode="numeric"
      value={formatted}
      onChange={handleChange}
      className={cn(className)}
    />
  );
} 