import { InsightMetricCard } from "@/features/insights/components/InsightMetricCard"
import { cn } from "@/lib/utils"
import type { InsightMetric } from "@/mock/data/insights"

type InsightMetricGridProps = {
  metrics: InsightMetric[]
  className?: string
}

export function InsightMetricGrid({ metrics, className }: InsightMetricGridProps) {
  return (
    <div className={cn("grid gap-3 md:grid-cols-2 xl:grid-cols-4", className)}>
      {metrics.map((metric) => (
        <InsightMetricCard key={metric.id} metric={metric} />
      ))}
    </div>
  )
}
