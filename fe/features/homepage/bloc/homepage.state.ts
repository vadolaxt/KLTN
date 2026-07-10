// ─────────────────────────────────────────────
// HOMEPAGE STATE
// ─────────────────────────────────────────────

import type { IconName } from '@/lib/constants/icons';

export interface StatItem {
  id: string;
  value: string;
  label: string;
}

export interface ServiceItem {
  id: string;
  iconKey: IconName;
  name: string;
  description: string;
  linkLabel: string;
  href: string;
  variant: 'default' | 'chatbot';
}

export interface NewsItem {
  id: string;
  tag: string;
  title: string;
  description: string;
  date: string;
  emoji: string;
  gradientVariant: 'green' | 'blue' | 'purple';
  href: string;
  imageUrl?: string | null;
  sourceUrl?: string | null;
}

export interface HomepageState {
  stats: StatItem[];
  services: ServiceItem[];
  news: NewsItem[];
  isLoading: boolean;
  error: string | null;
}

export const initialHomepageState: HomepageState = {
  stats: [],
  services: [],
  news: [],
  isLoading: false,
  error: null,
};
