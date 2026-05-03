import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface KpiCardProps {
  title: string
  value: number
  highlight?: boolean
  highlightColor?: string
}

export function KpiCard({ title, value, highlight, highlightColor = "text-amber-600" }: KpiCardProps) {
  return (
    <Card className={cn(highlight && value > 0 ? "border-amber-300" : "")}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <span
          className={cn(
            "text-3xl font-bold",
            highlight && value > 0 ? highlightColor : "text-foreground",
          )}
        >
          {value}
        </span>
      </CardContent>
    </Card>
  )
}
