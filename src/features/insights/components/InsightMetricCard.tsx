import { IconChevronDown } from "@tabler/icons-react"

import type { InsightMetric } from "@/mock/insights"

type InsightMetricCardProps = {
  metric: InsightMetric
}

export function InsightMetricCard({ metric }: InsightMetricCardProps) {
  return (
    <div className="min-h-28 rounded-lg bg-background p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="text-4xl font-bold leading-none text-foreground">
          {metric.value}
        </span>
        {metric.filter ? (
          <button className="flex items-center gap-1 text-sm font-semibold text-muted-foreground">
            {metric.filter}
            <IconChevronDown className="size-4" />
          </button>
        ) : null}
      </div>
      <p className="mt-4 text-sm font-semibold text-foreground">
        {metric.label}
      </p>
    </div>
  )
}
