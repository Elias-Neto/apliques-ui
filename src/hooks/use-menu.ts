import { create } from "zustand"

interface MenuState {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  toggle: () => void
  isCollapsed: boolean
  setIsCollapsed: (isCollapsed: boolean) => void
}

export const useMenu = create<MenuState>(set => ({
  isOpen: false,
  setIsOpen: isOpen => set({ isOpen }),
  toggle: () => set(state => ({ isOpen: !state.isOpen })),
  isCollapsed: false,
  setIsCollapsed: isCollapsed => set({ isCollapsed }),
}))
