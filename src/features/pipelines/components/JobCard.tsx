import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"

import { cn } from "@/lib/utils"
import type { Job } from "@/mock/data/pipelines"

type JobCardProps = {
  job: Job
  onClick: () => void
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
      <div className="mb-1.5">
        <span className="inline-flex h-[22px] items-center rounded-full bg-[#24C875] px-2 text-[11px] font-semibold text-white">
          {job.clientInitials}
        </span>
      </div>

      <p className="text-[13px] font-semibold text-foreground">{job.clientName}</p>

      <div className="my-1.5 h-px bg-border" />

      <div className="mb-1.5 flex flex-wrap gap-1">
        {job.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex h-[18px] items-center rounded-full bg-muted px-2 text-[11px] font-semibold text-muted-foreground"
          >
            {tag}
          </span>
        ))}
        {job.priority === "Medium" && (
          <span className="inline-flex h-[18px] items-center rounded-full border border-amber-200 bg-amber-50 px-2 text-[11px] font-semibold text-amber-700">
            {job.priority}
          </span>
        )}
      </div>

      <p className="mb-2 text-sm font-semibold text-foreground">{job.jobTitle}</p>

      <div className="flex items-center justify-between">
        <div className="flex">
          {job.assignees.map((initials, i) => (
            <span
              key={initials}
              style={{ marginLeft: i > 0 ? -4 : 0 }}
              className="flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-background bg-primary text-[9px] font-bold text-primary-foreground"
            >
              {initials}
            </span>
          ))}
        </div>
        <span className="text-[12px] font-semibold text-muted-foreground">
          {job.daysInStage} {job.daysInStage === 1 ? "day" : "days"}
        </span>
      </div>
    </div>
  )
}
