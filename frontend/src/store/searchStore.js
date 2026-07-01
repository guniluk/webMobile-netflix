import { create } from 'zustand';

export const useSearchStore = create((set) => ({
  activeTab: 'movie', // 'movie', 'tv', 'person'
  query: '',
  results: [],
  setActiveTab: (tab) => set({ activeTab: tab }),
  setQuery: (query) => set({ query }),
  setResults: (results) => set({ results }),
  clearSearch: () => set({ query: '', results: [] }),
}));
