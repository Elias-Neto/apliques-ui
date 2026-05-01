export const formatPhone = (value: string) => {
  const numbers = value.replace(/\D/g, "").slice(0, 11)
  if (numbers.length <= 10) {
    return numbers.replace(/^(\d{2})(\d{0,4})(\d{0,4}).*$/, (_, d1, d2, d3) =>
      [d1 && `(${d1}`, d1 && d2 && ") ", d2, d3 && "-", d3].filter(Boolean).join("")
    )
  }
  return numbers.replace(/^(\d{2})(\d{0,5})(\d{0,4}).*$/, (_, d1, d2, d3) =>
    [d1 && `(${d1}`, d1 && d2 && ") ", d2, d3 && "-", d3].filter(Boolean).join("")
  )
}

export const formatCPF = (value: string) => {
  const numbers = value.replace(/\D/g, "").slice(0, 11)
  return numbers.replace(/^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2}).*$/, (_, d1, d2, d3, d4) =>
    [d1, d2 && ".", d2, d3 && ".", d3, d4 && "-", d4].filter(Boolean).join("")
  )
}

export const formatCNPJ = (value: string) => {
  const numbers = value.replace(/\D/g, "").slice(0, 14)
  return numbers.replace(/^(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2}).*$/, (_, d1, d2, d3, d4, d5) =>
    [d1, d2 && ".", d2, d3 && ".", d3, d4 && "/", d4, d5 && "-", d5].filter(Boolean).join("")
  )
}
