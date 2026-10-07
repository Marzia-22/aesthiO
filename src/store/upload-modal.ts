import { create } from "zustand";

interface UploadModalStore {
  isOpen: boolean;
  refreshNonce: number;
  open: () => void;
  close: () => void;
  triggerRefresh: () => void;
}

export const useUploadModal = create<UploadModalStore>((set) => ({
  isOpen: false,
  refreshNonce: 0,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  triggerRefresh: () =>
    set((state) => ({ refreshNonce: state.refreshNonce + 1 })),
}));
