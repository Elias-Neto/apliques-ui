import { ReactNode } from "react"
import { EmptyState } from "./empty-state"
import { LucideIcon } from "lucide-react"

interface DataListProps<T> {
  items: T[]
  emptyState: {
    icon: LucideIcon
    title: string
    description: string
    buttonText: string
    onButtonClick: () => void
  }
  renderItem: (item: T) => ReactNode
  gridClassName?: string
  containerClassName?: string
}

export function DataList<T>({
  items,
  emptyState,
  renderItem,
  gridClassName = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
  containerClassName = "container mx-auto px-4 py-6"
}: DataListProps<T>) {
  return (
    <div className={containerClassName}>
      {items.length === 0 ? (
        <EmptyState
          icon={emptyState.icon}
          title={emptyState.title}
          description={emptyState.description}
          buttonText={emptyState.buttonText}
          onButtonClick={emptyState.onButtonClick}
        />
      ) : (
        <div className={gridClassName}>
          {items.map(renderItem)}
        </div>
      )}
    </div>
  )
} 