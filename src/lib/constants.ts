/**
 * Shared constants used across the app.
 * TODO: Replace static exchange rates with live data from Supabase
 * once the exchange_rates table is reliably populated.
 */

// Fallback exchange rates — used when Supabase data is unavailable.
// These should be updated periodically or replaced with live data.
export const FALLBACK_USD_TRY = 36
export const FALLBACK_GOLD_TRY_GRAM = 3200
