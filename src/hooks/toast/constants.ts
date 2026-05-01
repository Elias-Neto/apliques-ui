export const TOAST_LIMIT = 1
export const TOAST_REMOVE_DELAY = 500

let count = 0

export function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
} 