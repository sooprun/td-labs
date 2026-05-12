import { useDroppable } from "@dnd-kit/core"
import { IconBolt, IconChevronLeft } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { protoAction } from "@/lib/proto"
import type { Job, Stage } from "@/mock/data/pipelines"

import { JobCard } from "./JobCard"

type PipelineColumnProps = {
  stage: Stage
  onJobClick: (job: Job) => void
}

export function PipelineColumn({ stage, onJobClick }: PipelineColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id })
  const hasAutomations = stage.automationCount > 0

  return (
    <div
      className={cn(
        "flex w-[252px] shrink-0 flex-col rounded-xl transition-colors",
        isOver ? "bg-[#F2F9FF] ring-2 ring-[#1976D3]/30" : "bg-[#F1F4F9]"
      )}
    >
      <div className="flex items-center gap-1.5 px-3 py-2.5">
        <IconChevronLeft className="size-3.5 shrink-0 text-muted-foreground" />
        <span className="flex-1 text-sm font-semibold text-foreground">
          {stage.name}
        </span>
        <span className="text-xs font-semibold text-muted-foreground">
          ({stage.jobs.length})
        </span>
        <div className="size-4 rounded border-2 border-border bg-background" />
      </div>

      <div
        className={cn(
          "flex items-center gap-1 border-b border-border px-3 py-1",
          hasAutomations ? "text-[#1976D3]" : "text-muted-foreground"
        )}
      >
        <IconBolt className="size-3 shrink-0" />
        <span className="text-xs font-semibold">{stage.automationCount}</span>
      </div>

      <div
        ref={setNodeRef}
        className="flex min-h-[60px] flex-1 flex-col gap-1.5 overflow-y-auto p-2"
      >
        {stage.jobs.map((job) => (
          <JobCard key={job.id} job={job} onClick={() => onJobClick(job)} />
        ))}
      </div>

      <button
        className={cn(
          "w-full rounded-b-xl border-t border-border px-3.5 py-2.5 text-xs font-semibold transition-colors",
          hasAutomations
            ? "text-[#1976D3] hover:bg-[#F2F9FF]"
            : "cursor-not-allowed text-muted-foreground"
        )}
        onClick={hasAutomations ? protoAction("Pipeline automation") : undefined}
        disabled={!hasAutomations}
      >
        Set up automations
      </button>
    </div>
  )
}
