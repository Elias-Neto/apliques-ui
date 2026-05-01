export interface MenuState {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  toggle: () => void
  isCollapsed: boolean
  setIsCollapsed: (isCollapsed: boolean) => void
} 