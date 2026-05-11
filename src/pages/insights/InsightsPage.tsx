import { IconCalendar, IconChevronDown, IconUserCircle } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { PageHeader, PageLayout, PageSection } from "@/components/page/PageLayout"
import { InsightMetricGrid } from "@/features/insights/components/InsightMetricGrid"
import { jobMetrics, pendingClientActivityMetrics } from "@/mock/data/insights"

function AssigneeFilter() {
  return (
    <button className="flex items-center gap-1 text-sm font-semibold text-muted-foreground">
      <IconUserCircle className="size-4" />
      Alex Suprun
      <IconChevronDown className="size-4" />
    </button>
  )
}

export function InsightsPage() {
  return (
    <PageLayout>
      <PageHeader
        action={
          <Button size="sm" variant="link">
            Edit widgets
          </Button>
        }
        title="Insights"
      />

      <PageSection meta={<AssigneeFilter />} title="Jobs">
        <InsightMetricGrid metrics={jobMetrics} />
      </PageSection>

      <PageSection meta={<AssigneeFilter />} title="Pending client activity">
        <InsightMetricGrid
          className="xl:grid-cols-5"
          metrics={pendingClientActivityMetrics}
        />
      </PageSection>

      <PageSection
        action={
          <Button size="sm" variant="link">
            <IconCalendar className="size-4" />
            Calendar view
          </Button>
        }
        meta={
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-sm font-semibold text-muted-foreground">
              <IconCalendar className="size-4" />
              May-11-2026
              <IconChevronDown className="size-4" />
            </button>
            <AssigneeFilter />
          </div>
        }
        title="Tasks: to do"
      >
        <div className="grid gap-4 xl:grid-cols-[1fr_17rem]">
          <div className="flex min-h-72 items-center justify-center rounded-lg border bg-background p-6 text-center">
            <div>
              <p className="text-lg font-semibold">
                There is nothing in your to-do list at the moment
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Tasks from the selected date and assignee will appear here.
              </p>
            </div>
          </div>
          <div className="flex min-h-72 items-end justify-center rounded-lg border bg-background p-6 text-center text-sm font-semibold text-muted-foreground">
            No pending tasks
          </div>
        </div>
      </PageSection>
    </PageLayout>
  )
}
