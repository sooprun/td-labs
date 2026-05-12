import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"

import { cn } from "@/lib/utils"
import type { Job } from "@/mock/data/pipelines"

type JobCardProps = {
  job: Job
  onClick: () => void
}

const priorityColors: Record<string, string> = {
  High: "border-red-200 bg-red-50 text-red-700",
  Medium: "border-orange-200 bg-orange-50 text-orange-600",
  Low: "border-green-200 bg-green-50 text-green-700",
}

export function JobCard({ job, onClick }: JobCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: job.id })

  return (
    <div
      ref={setNodeRef}
      style={transform ? { transform: CSS.Translate.toString(transform) } : undefined}
      className={cn(
        "cursor-pointer rounded-lg border bg-background p-3 shadow-sm transition-shadow hover:shadow-md",
        isDragging && "cursor-grabbing opacity-40"
      )}
      onClick={onClick}
      onMouseDown={() => { document.body.classList.add("is-dragging") }}
      onMouseUp={() => { document.body.classList.remove("is-dragging") }}
      {...listeners}
      {...attributes}
    >
      <div className="mb-2">
        <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#24C875] text-xs font-bold text-white">
          {job.clientInitials}
        </span>
      </div>

      <p className="mb-2 text-sm font-semibold text-foreground">{job.clientName}</p>

      <div className="mb-1.5 flex flex-wrap gap-1">
        {job.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex h-[20px] items-center rounded px-1.5 text-[12px] font-medium bg-muted text-muted-foreground"
          >
            {tag}
          </span>
        ))}
        {job.priority && (
          <span
            className={cn(
              "inline-flex h-[20px] items-center rounded-full border px-2 text-[12px] font-medium",
              priorityColors[job.priority]
            )}
          >
            {job.priority}
          </span>
        )}
      </div>

      <p className="mb-3 text-sm font-semibold text-foreground">{job.jobTitle}</p>

      <div className="flex items-center justify-between">
        <div className="flex">
          {job.assignees.map((initials, i) => (
            <span
              key={initials}
              style={{ marginLeft: i > 0 ? -4 : 0 }}
              className="flex size-[26px] items-center justify-center rounded-full border-2 border-background bg-primary text-[10px] font-bold text-primary-foreground"
            >
              {initials}
            </span>
          ))}
        </div>
        <span className="text-xs font-semibold text-muted-foreground">
          {job.daysInStage} {job.daysInStage === 1 ? "day" : "days"}
        </span>
      </div>
    </div>
  )
}
