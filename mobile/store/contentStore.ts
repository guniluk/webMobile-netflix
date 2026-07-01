import { create } from 'zustand';

interface ContentState {
  contentType: 'movie' | 'tv';
  setContentType: (type: 'movie' | 'tv') => void;
  refreshTrigger: number;
  triggerRefresh: () => void;
}

export const useContentStore = create<ContentState>((set) => ({
  contentType: 'movie',
  setContentType: (type) => set({ contentType: type }),
  refreshTrigger: 0,
  triggerRefresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
}));
