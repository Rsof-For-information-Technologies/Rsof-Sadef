'use client';

import { create } from 'zustand';

export type DrawerPlacements = 'left' | 'right' | 'top' | 'bottom';

type DrawerTypes = {
  view?: React.ReactNode;
  isOpen?: boolean;
  placement?: DrawerPlacements;
  customSize?: string;
  screenWidth?: number;
};


interface DrawerStore {
  state: DrawerTypes;
  openDrawer: (state: DrawerTypes) => void;
  closeDrawer: () => void;
}
export const useDrawerStore = create<DrawerStore>((set) => ({
  state: {
    isOpen: false,
    view: null,
    placement: 'right',
    customSize: '270px'
  },
  openDrawer: (state) => set((store) => ({ ...store, state: { ...store.state, ...state } })),
  closeDrawer: () => set((store) => ({ ...store, state: { ...store.state, isOpen: false } })),
}))