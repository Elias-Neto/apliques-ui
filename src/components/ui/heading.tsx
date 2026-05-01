import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Plus } from "lucide-react"

interface HeadingProps {
  children: React.ReactNode
  className?: string
  description?: string
  buttonText?: string
  onButtonClick?: () => void
  showButton?: boolean
}

export function Heading({ 
  children, 
  className, 
  description, 
  buttonText = "Novo Preço",
  onButtonClick,
  showButton = false
}: HeadingProps) {
  return (
    <div className="border-b bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-start gap-4 md:gap-0 md:block">
          <h1 className={cn(
            "text-3xl font-bold text-foreground",
            className
          )}>
            {children}
          </h1>
          {description && (
            <p className="text-muted-foreground mt-1 mb-4">{description}</p>
          )}
          {showButton && (
            <Button 
              onClick={onButtonClick}
              className="flex items-center gap-2 w-full md:w-auto"
            >
              <Plus className="h-4 w-4" />
              {buttonText}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
} 