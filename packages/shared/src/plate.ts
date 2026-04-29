/**
 * Placa Costa Rica: solo números (ej. 345723) o alfanumérico LLL-NNN (ej. RWF-001) o LLL-NNNN (ej. ABC-1234).
 * Misma lógica que `apps/web/src/lib/inputMasks.ts`.
 */
export function formatPlate(value: string): string {
  const raw = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const letters = raw.replace(/[^A-Z]/g, "").slice(0, 3);
  const allDigits = raw.replace(/[^0-9]/g, "");

  if (letters.length === 0) {
    return allDigits.slice(0, 6);
  }

  // Support up to 4 digits for newer plate formats
  const digits = allDigits.slice(0, 4);
  return letters + (digits.length > 0 ? "-" + digits : "");
}
