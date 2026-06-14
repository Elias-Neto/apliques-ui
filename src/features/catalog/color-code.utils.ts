export type ColorCodeFormat = 'hex' | 'rgb' | 'cmyk' | 'text'

export function colorCodeToCSS(code: string | null | undefined, format: ColorCodeFormat | null | undefined): string | null {
  if (!code || !format) return null
  if (format === 'hex') return code
  if (format === 'rgb') {
    const [r, g, b] = code.split(',').map(Number)
    if ([r, g, b].some(isNaN)) return null
    return `rgb(${r},${g},${b})`
  }
  if (format === 'cmyk') {
    const [c, m, y, k] = code.split(',').map(Number)
    if ([c, m, y, k].some(isNaN)) return null
    const r = Math.round(255 * (1 - c / 100) * (1 - k / 100))
    const g = Math.round(255 * (1 - m / 100) * (1 - k / 100))
    const b = Math.round(255 * (1 - y / 100) * (1 - k / 100))
    return `rgb(${r},${g},${b})`
  }
  return null
}

export function colorCodeDisplayLabel(code: string | null | undefined, format: ColorCodeFormat | null | undefined): string {
  if (!code || !format) return ''
  if (format === 'hex') return code
  if (format === 'rgb') {
    const [r, g, b] = code.split(',')
    return `R${r} G${g} B${b}`
  }
  if (format === 'cmyk') {
    const [c, m, y, k] = code.split(',')
    return `C${c} M${m} Y${y} K${k}`
  }
  return code
}
