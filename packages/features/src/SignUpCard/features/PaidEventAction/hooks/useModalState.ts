import {create} from 'zustand';

interface BearState {
  isSignUpCodeModalOpen: boolean;
  openSignUpCodeModal: () => void;
  closeSignUpCodeModal: () => void;
  onSignUpCodeModalOpenChange: (isOpen: boolean) => void;

  isTicketSelectorModalOpen: boolean;
  openTicketSelectorUpModal: () => void;
  closeTicketSelectorModal: () => void;
  onTicketSelectorModalOpenChange: (isOpen: boolean) => void;
}

export const useModalState = create<BearState>()((set) => ({
  isSignUpCodeModalOpen: false,
  openSignUpCodeModal: () => set(() => ({isSignUpCodeModalOpen: true})),
  closeSignUpCodeModal: () => set(() => ({isSignUpCodeModalOpen: false})),
  onSignUpCodeModalOpenChange: (isSignUpCodeModalOpen) =>
    set(() => ({
      isSignUpCodeModalOpen,
    })),

  isTicketSelectorModalOpen: false,
  openTicketSelectorUpModal: () =>
    set(() => ({isTicketSelectorModalOpen: true})),
  closeTicketSelectorModal: () =>
    set(() => ({isTicketSelectorModalOpen: false})),
  onTicketSelectorModalOpenChange: (isTicketSelectorModalOpen) =>
    set(() => ({isTicketSelectorModalOpen})),
}));
