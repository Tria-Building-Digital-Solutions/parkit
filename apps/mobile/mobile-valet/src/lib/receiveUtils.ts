/**
 * Re-exports Costa Rica utilities from shared package.
 * Kept for backward compatibility with existing imports in this app.
 */

export {
  COUNTRY_CR,
  MANUAL_TICKET_CODE_RE,
  MAX_DAMAGE_PHOTOS,
  isValidCrPlate,
  formatBenefitTime,
  extractBookingIdFromScan,
  randomWalkInPassword,
} from "@parkit/shared";
