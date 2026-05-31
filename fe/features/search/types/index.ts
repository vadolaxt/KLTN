export interface ScoreHistory {
  year: number;
  method: string;
  combo: string;
  score: string;
  quota: number;
}

export interface Major {
  code: string;
  name: string;
  faculty: string;
  linhVuc: string;
  icon: string;
  score: number;
  quota: number;
  tuition: string;
  duration: string;
  methods: string[];
  combos: string;
  tags: string[];
  desc: string;
  careers: string[];
  scoreHistory: ScoreHistory[];
}

export type ViewMode = 'grid' | 'list';

export interface SearchState {
  searchQuery: string;
  selectedFaculty: string;
  selectedMethod: string;
  activeLinhVuc: string;
  scoreRange: [number, number];
  selectedQuotas: string[];
  selectedCombos: string[];
  selectedTags: string[];
  sortBy: string;
  viewMode: ViewMode;
  currentPage: number;
  compareList: Major[];
}
