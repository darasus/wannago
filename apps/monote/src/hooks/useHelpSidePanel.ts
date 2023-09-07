import {create} from 'zustand';
import {persist} from 'zustand/middleware';

interface State {
  isOpen: boolean;
  toggle: () => void;
}

export const useHelpSidePanel = create<State>()(
  persist(
    (set) => ({
      isOpen: false,
      toggle: () => {
        set((state) => ({isOpen: !state.isOpen}));
      },
    }),
    {
      name: 'help-side-panel',
    }
  )
);
