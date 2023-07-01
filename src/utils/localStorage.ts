export function setItem (key: string, value: string): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getItem (key: string): string | null {
  return JSON.parse(localStorage.getItem(key) || 'null')
}