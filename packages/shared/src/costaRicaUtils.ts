import type { Locale } from './types/locale';

export const COUNTRY_CR = 'CR';
export const MANUAL_TICKET_CODE_RE = /^[A-Za-z0-9\-_]+$/;
export const MAX_DAMAGE_PHOTOS = 8;

/**
 * Validates Costa Rica plate formats:
 * - 6 digits: 123456
 * - 3 letters + 3 numbers: ABC-123
 * - 3 letters + 4 numbers: ABC-1234
 * - 2 letters + 4 numbers: AB-1234
 * - Any alphanumeric with 5-7 characters
 */
export function isValidCrPlate(value: string): boolean {
  const p = value.trim().toUpperCase();
  if (/^\d{6}$/.test(p)) return true;
  if (/^[A-Z]{3}-\d{3}$/.test(p)) return true;
  if (/^[A-Z]{3}-\d{4}$/.test(p)) return true;
  if (/^[A-Z]{2}-\d{4}$/.test(p)) return true;
  if (/^[A-Z0-9]{5,7}$/.test(p)) return true;
  return false;
}

/**
 * Formats benefit time in a human-readable format
 */
export function formatBenefitTime(
  value: number | null | undefined,
  locale: Locale
): string {
  if (value == null || Number.isNaN(value)) {
    return locale === 'es' ? '0 min' : '0 min';
  }
  const totalMinutes = Math.max(0, Math.floor(value));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours === 0 && minutes === 0) return locale === 'es' ? '0 min' : '0 min';
  if (hours === 0) return locale === 'es' ? `${minutes} min` : `${minutes} min`;
  if (minutes === 0) return locale === 'es' ? `${hours} h` : `${hours} h`;
  return locale === 'es' ? `${hours} h ${minutes} min` : `${hours} h ${minutes} min`;
}

/**
 * Extracts booking ID from QR scan or URL
 */
export function extractBookingIdFromScan(raw: string): string {
  const t = raw.trim();
  if (!t) return t;
  if (/^[a-f0-9-]{8,}$/i.test(t)) return t;
  
  try {
    const u = new URL(t);
    const pathParts = u.pathname.split('/').filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1];
    if (/^[a-f0-9-]{8,}$/i.test(lastPart)) return lastPart;
  } catch {
    // Invalid URL, continue with original value
  }
  
  return t;
}

/**
 * Generates a random walk-in password
 */
export function randomWalkInPassword(): string {
  const r = Math.random().toString(36).slice(2, 10);
  return `Tmp${r}Aa1`;
}
