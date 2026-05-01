import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MenuItemProps } from "../types";

export const MenuItem = ({ href, icon, children, isCollapsed, onClick }: MenuItemProps) => {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={cn(
          "flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors w-full text-left",
          isCollapsed && "justify-center px-2"
        )}
        title={isCollapsed ? String(children) : undefined}
      >
        <div className={cn("shrink-0", isCollapsed ? "h-6 w-6" : "h-4 w-4")}>
          {icon}
        </div>
        {!isCollapsed && children}
      </button>
    );
  }

  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors",
        isCollapsed && "justify-center px-2"
      )}
      title={isCollapsed ? String(children) : undefined}
    >
      <div className={cn("shrink-0", isCollapsed ? "h-6 w-6" : "h-4 w-4")}>
        {icon}
      </div>
      {!isCollapsed && children}
    </Link>
  );
}; 