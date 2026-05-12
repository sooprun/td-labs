import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { IconCircleCheckFilled } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import type { Job } from "@/mock/data/pipelines"

type JobCardProps = {
  job: Job
  onClick: () => void
}

function StatusBadge({ badge }: { badge: Job["badge"] }) {
  if (!badge) return null
  if (badge.type === "check") {
    return <IconCircleCheckFilled className="size-5 shrink-0 text-[#24C875]" />
  }
  return (
    <span
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white",
        badge.color === "red" ? "bg-[#DE463C]" : "bg-[#FD993C]"
      )}
    >
      {badge.value}
    </span>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-1 text-[12px]">
      <span className="text-muted-foreground">{label}:</span>
      <span className="text-foreground">{value}</span>
    </div>
  )
}

export function JobCard({ job, onClick }: JobCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: job.id })

  return (
    <div
      ref={setNodeRef}
      style={transform ? { transform: CSS.Translate.toString(transform) } : undefined}
      className={cn(
        "cursor-grab rounded-lg border bg-background p-3 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing",
        isDragging && "opacity-40"
      )}
      onClick={onClick}
      {...listeners}
      {...attributes}
    >
      <div className="mb-2.5 flex items-start justify-between gap-2">
        <span className="text-sm font-semibold leading-snug text-foreground">
          {job.name}
        </span>
        <StatusBadge badge={job.badge} />
      </div>

      <div className="mb-2.5 flex flex-col gap-0.5">
        {job.dueDate && <MetaRow label="Due" value={job.dueDate} />}
        <MetaRow label="Time budget" value={job.timeBudget} />
        <MetaRow label="Time variance" value={job.timeVariance} />
        <MetaRow label="Time budget spent" value={job.timeBudgetSpent} />
      </div>

      <div className="flex items-center gap-1 text-[11px]">
        <span className="text-muted-foreground">{job.timeAgo}</span>
        {job.overdueText && (
          <>
            <span className="text-muted-foreground">/</span>
            <span className="font-semibold text-[#DE463C]">{job.overdueText}</span>
          </>
        )}
      </div>
    </div>
  )
}
