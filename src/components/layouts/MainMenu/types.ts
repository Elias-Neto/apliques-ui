export interface MenuItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isCollapsed: boolean;
  onClick?: () => void;
}

export interface MenuSectionProps {
  title: string;
  children: React.ReactNode;
  isCollapsed: boolean;
}

export interface MainMenuProps {
  className?: string;
} 