import {create} from 'zustand';

interface State {
  isSaved: boolean;
  isSaving: boolean;
  isUnsaved: boolean;
  setSaving: () => void;
  setUnsaved: () => void;
  setSaved: () => void;
}

export const useSaved = create<State>((set) => ({
  isSaved: true,
  isUnsaved: false,
  isSaving: false,
  setSaved: () => {
    set(() => ({isSaved: true, isUnsaved: false, isSaving: false}));
  },
  setUnsaved: () => {
    set(() => ({isSaved: false, isUnsaved: true, isSaving: false}));
  },
  setSaving: () => {
    set(() => ({isSaved: false, isUnsaved: false, isSaving: true}));
  },
}));
