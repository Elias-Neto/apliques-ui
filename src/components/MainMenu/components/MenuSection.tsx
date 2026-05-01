import { MenuSectionProps } from "../types";

export const MenuSection = ({ title, children, isCollapsed }: MenuSectionProps) => (
  <div className="space-y-1">
    {!isCollapsed && <h2 className="px-4 py-2 text-sm font-semibold">{title}</h2>}
    {children}
  </div>
); 