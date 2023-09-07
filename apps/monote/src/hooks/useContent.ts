import {create} from 'zustand';
import {persist} from 'zustand/middleware';

interface State {
  content: string;
  updateContent: (content: string) => void;
}

export const useContent = create<State>()(
  persist(
    (set) => ({
      content: '',
      updateContent: (content) => {
        set(() => ({content}));
      },
    }),
    {
      name: 'content',
    }
  )
);
