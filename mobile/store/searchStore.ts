import { create } from 'zustand';

interface SearchState {
  activeTab: 'movie' | 'tv' | 'person';
  query: string;
  results: any[];
  setActiveTab: (tab: 'movie' | 'tv' | 'person') => void;
  setQuery: (query: string) => void;
  setResults: (results: any[]) => void;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  activeTab: 'movie',
  query: '',
  results: [],
  setActiveTab: (tab) => set({ activeTab: tab }),
  setQuery: (query) => set({ query }),
  setResults: (results) => set({ results }),
  clearSearch: () => set({ query: '', results: [] }),
}));
