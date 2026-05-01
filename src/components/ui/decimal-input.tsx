import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface DecimalInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  decimalPlaces?: number;
  suffix?: string;
}

export function DecimalInput({ 
  value, 
  onChange, 
  className, 
  decimalPlaces = 3,
  suffix = "",
  ...props 
}: DecimalInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const multiplier = Math.pow(10, decimalPlaces);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Permite apenas números e vírgula
    const cleaned = input.replace(/[^\d,]/g, "");
    
    // Permite apenas uma vírgula
    const parts = cleaned.split(",");
    const formatted = parts.length > 1 
      ? parts[0] + "," + parts.slice(1).join("").slice(0, decimalPlaces)
      : parts[0];
    
    setInputValue(formatted);
    
    // Converte para número (multiplicado pelo multiplicador)
    const numberValue = formatted.replace(",", ".");
    const parsedValue = parseFloat(numberValue);
    const newValue = isNaN(parsedValue) ? 0 : Math.round(parsedValue * multiplier);
    
    onChange(newValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
    // Mostra o valor editável quando foca (sem sufixo)
    const rawValue = value === 0 ? "" : (value / multiplier).toString().replace(".", ",");
    setInputValue(rawValue);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // Formata o valor para exibição quando não está focado
  const displayValue = isFocused 
    ? inputValue
    : new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces
      }).format(value / multiplier) + (suffix ? " " + suffix : "");

  return (
    <Input
      {...props}
      type="text"
      inputMode="decimal"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={cn(className)}
    />
  );
}

