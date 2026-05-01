import { create } from 'zustand'
import { MenuState } from './types'

export const useMenu = create<MenuState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  isCollapsed: false,
  setIsCollapsed: (isCollapsed) => set({ isCollapsed })
})) 