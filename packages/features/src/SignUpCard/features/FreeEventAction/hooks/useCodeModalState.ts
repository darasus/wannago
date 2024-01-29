import {create} from 'zustand';

interface State {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  onOpenChange: (isOpen: boolean) => void;
}

export const useCodeModalState = create<State>()((set) => ({
  isOpen: false,
  open: () => set(() => ({isOpen: true})),
  close: () => set(() => ({isOpen: false})),
  onOpenChange: (isOpen) => set(() => ({isOpen})),
}));
