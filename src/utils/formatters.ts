export function normalizeCityName(name: string): string {
  return name.replace(/\s*\([^)]*\)/g, "").trim().toLowerCase();
}
