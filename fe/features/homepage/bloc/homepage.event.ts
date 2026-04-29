// ─────────────────────────────────────────────
// HOMEPAGE EVENTS
// ─────────────────────────────────────────────

export type HomepageEvent =
  | { type: 'FETCH_ALL_START' }
  | { type: 'FETCH_ALL_SUCCESS'; payload: { stats: unknown[]; services: unknown[]; news: unknown[] } }
  | { type: 'FETCH_ALL_FAILURE'; payload: { error: string } }
  | { type: 'RESET' };