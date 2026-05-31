// ─────────────────────────────────────────────
// useHomepageBloc — BloC hook cho trang chủ
// ─────────────────────────────────────────────

'use client';

import { useEffect, useReducer } from 'react';
import { homepageReducer } from './homepage.reducer';
import { initialHomepageState } from './homepage.state';
import { getStats, getServices, getNews } from '@/service/homepage.api';

export function useHomepageBloc() {
  const [state, dispatch] = useReducer(homepageReducer, initialHomepageState);

  /** Load toàn bộ dữ liệu trang chủ */
  async function fetchAll() {
    dispatch({ type: 'FETCH_ALL_START' });
    try {
      const [stats, services, news] = await Promise.all([
        getStats(),
        getServices(),
        getNews(),
      ]);
      dispatch({
        type: 'FETCH_ALL_SUCCESS',
        payload: { stats, services, news },
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Lỗi tải dữ liệu trang chủ.';
      dispatch({ type: 'FETCH_ALL_FAILURE', payload: { error: message } });
    }
  }

  useEffect(() => {
    fetchAll();
  }, []);

  return {
    state,
    // Actions có thể gọi từ UI
    refetch: fetchAll,
  };
}