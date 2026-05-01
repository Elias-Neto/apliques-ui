import { Button } from "./button"
import { Plus } from "lucide-react"
import { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  buttonText: string
  onButtonClick: () => void
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  buttonText,
  onButtonClick,
  className
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] text-center ${className}`}>
      <Icon className="h-16 w-16 text-muted-foreground mb-6" />
      <h3 className="text-xl font-semibold text-foreground mb-3">
        {title}
      </h3>
      <p className="text-muted-foreground mb-8 max-w-md">
        {description}
      </p>
      <Button 
        onClick={onButtonClick}
        className="flex items-center gap-2"
      >
        <Plus className="h-5 w-5" />
        {buttonText}
      </Button>
    </div>
  )
} 