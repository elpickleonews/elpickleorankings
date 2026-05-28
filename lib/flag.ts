export function countryFlag(iso2: string): string {
  if (!iso2 || iso2.length !== 2) return '🏳️'
  const offset = 0x1F1E6 - 'A'.charCodeAt(0)
  return String.fromCodePoint(
    iso2.toUpperCase().charCodeAt(0) + offset,
    iso2.toUpperCase().charCodeAt(1) + offset,
  )
}
