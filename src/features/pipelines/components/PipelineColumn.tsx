import { useDroppable } from "@dnd-kit/core"
import { IconBolt, IconChevronsLeft, IconClock } from "@tabler/icons-react"

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

  return (
    <div
      className={cn(
        "flex w-[252px] shrink-0 flex-col rounded-xl transition-colors",
        isOver ? "bg-[#F2F9FF] ring-2 ring-[#1976D3]/30" : "bg-[#F1F4F9]"
      )}
    >
      {/* Column header */}
      <div className="flex items-center gap-1.5 px-3 py-2.5">
        <button
          className="shrink-0 text-muted-foreground hover:text-foreground"
          onClick={protoAction("Collapse column")}
        >
          <IconChevronsLeft className="size-3.5" />
        </button>
        <span className="flex-1 truncate text-sm font-semibold text-foreground">
          {stage.name}
        </span>
        <span className="shrink-0 text-xs font-semibold text-muted-foreground">
          ({stage.jobs.length})
        </span>
        <div className="size-4 shrink-0 rounded border-2 border-border bg-background" />
      </div>

      {/* Automation + time row */}
      <div className="flex items-center justify-between border-b border-border px-3 py-1">
        <button
          className={cn(
            "flex items-center gap-1 transition-colors",
            stage.automationCount > 0
              ? "text-[#1976D3] hover:opacity-75"
              : "cursor-default text-muted-foreground"
          )}
          onClick={
            stage.automationCount > 0
              ? protoAction("Pipeline automation")
              : undefined
          }
        >
          <IconBolt className="size-3 shrink-0" />
          <span className="text-xs font-semibold">{stage.automationCount}</span>
        </button>

        {stage.avgTimeInStage && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <IconClock className="size-3 shrink-0" />
            <span className="text-xs font-semibold">{stage.avgTimeInStage}</span>
          </div>
        )}
      </div>

      {/* Cards */}
      <div
        ref={setNodeRef}
        className="flex min-h-[60px] flex-1 flex-col gap-1.5 overflow-y-auto p-2"
      >
        {stage.jobs.map((job) => (
          <JobCard key={job.id} job={job} onClick={() => onJobClick(job)} />
        ))}
      </div>

      {/* Set up automations */}
      <button
        className={cn(
          "w-full rounded-b-xl border-t border-border px-3.5 py-2.5 text-xs font-semibold transition-colors",
          stage.automationCount > 0
            ? "text-[#1976D3] hover:bg-[#F2F9FF]"
            : "cursor-not-allowed text-muted-foreground"
        )}
        disabled={!stage.automationCount}
        onClick={
          stage.automationCount > 0
            ? protoAction("Pipeline automation")
            : undefined
        }
      >
        Set up automations
      </button>
    </div>
  )
}
