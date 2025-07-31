'use client';

import { ReactNode } from 'react';
import { create } from 'zustand';


type ModelStore = {
  view: ReactNode;
  isOpen: boolean;
  customSize?: string;
  openModal: ({ view, customSize, }: { view: ReactNode, customSize?: string, }) => void
  closeModal: () => void
}

export const useModalStore = create<ModelStore>((set) => ({

  isOpen: false,

  view: null,

  customSize: '320px',

  openModal: ({ view, customSize, }) => set((store) => ({ ...store, isOpen: true, view, customSize })),

  closeModal: () => set((store) => ({ ...store, isOpen: false }))

}))
