import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export function formatNumber(value: number, decimals = 1) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value)
}

export function formatPhoneNumber(value: string) {
  // Remove tudo que não for número
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 10) {
    // Formato fixo: (99) 9999-9999
    return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, (m, d1, d2, d3) =>
      d3 ? `(${d1}) ${d2}-${d3}` : d2 ? `(${d1}) ${d2}` : d1 ? `(${d1}` : ''
    );
  } else {
    // Formato celular: (99) 99999-9999
    return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, (m, d1, d2, d3) =>
      d3 ? `(${d1}) ${d2}-${d3}` : d2 ? `(${d1}) ${d2}` : d1 ? `(${d1}` : ''
    );
  }
}

export function formatCNPJ(value: string) {
  // Remove tudo que não for número
  const numbers = value.replace(/\D/g, "");
  // Formato: 99.999.999/9999-99
  return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, (m, d1, d2, d3, d4, d5) =>
    d5 ? `${d1}.${d2}.${d3}/${d4}-${d5}` : 
    d4 ? `${d1}.${d2}.${d3}/${d4}` : 
    d3 ? `${d1}.${d2}.${d3}` : 
    d2 ? `${d1}.${d2}` : 
    d1 ? `${d1}` : ''
  );
}

export function formatCPF(value: string) {
  // Remove tudo que não for número
  const numbers = value.replace(/\D/g, "");
  // Formato: 999.999.999-99
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, (m, d1, d2, d3, d4) =>
    d4 ? `${d1}.${d2}.${d3}-${d4}` : 
    d3 ? `${d1}.${d2}.${d3}` : 
    d2 ? `${d1}.${d2}` : 
    d1 ? `${d1}` : ''
  );
}
