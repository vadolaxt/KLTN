// ─────────────────────────────────────────────
// HOMEPAGE REDUCER
// ─────────────────────────────────────────────

import type { HomepageState } from './homepage.state';
import type { HomepageEvent } from './homepage.event';
import { initialHomepageState } from './homepage.state';

export function homepageReducer(
  state: HomepageState,
  event: HomepageEvent,
): HomepageState {
  switch (event.type) {
    case 'FETCH_ALL_START':
      return { ...state, isLoading: true, error: null };

    case 'FETCH_ALL_SUCCESS':
      return {
        ...state,
        isLoading: false,
        stats: event.payload.stats as HomepageState['stats'],
        services: event.payload.services as HomepageState['services'],
        news: event.payload.news as HomepageState['news'],
      };

    case 'FETCH_ALL_FAILURE':
      return { ...state, isLoading: false, error: event.payload.error };

    case 'RESET':
      return initialHomepageState;

    default:
      return state;
  }
}