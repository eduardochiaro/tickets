export function setItem(key: string, value: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export function getItem(key: string): string | null {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem(key) || 'null');
  }
  return null;
}
