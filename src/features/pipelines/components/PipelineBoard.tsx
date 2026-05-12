import * as React from "react"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core"

import type { Job, Stage } from "@/mock/pipelines"

import { JobCard } from "./JobCard"
import { PipelineColumn } from "./PipelineColumn"

type PipelineBoardProps = {
  stages: Stage[]
  onStagesChange: (stages: Stage[]) => void
  onJobClick: (job: Job) => void
}

export function PipelineBoard({
  stages,
  onStagesChange,
  onJobClick,
}: PipelineBoardProps) {
  const [activeJob, setActiveJob] = React.useState<Job | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  const handleDragStart = ({ active }: DragStartEvent) => {
    const job = stages.flatMap((s) => s.jobs).find((j) => j.id === active.id)
    setActiveJob(job ?? null)
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveJob(null)
    if (!over) return

    const sourceStage = stages.find((s) => s.jobs.some((j) => j.id === active.id))
    const targetStage = stages.find((s) => s.id === over.id)

    if (!sourceStage || !targetStage || sourceStage.id === targetStage.id) return

    const job = sourceStage.jobs.find((j) => j.id === active.id)!

    onStagesChange(
      stages.map((stage) => {
        if (stage.id === sourceStage.id) {
          return { ...stage, jobs: stage.jobs.filter((j) => j.id !== active.id) }
        }
        if (stage.id === targetStage.id) {
          return { ...stage, jobs: [...stage.jobs, job] }
        }
        return stage
      })
    )
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full items-stretch gap-3 px-5 pb-5 pt-1">
        {stages.map((stage) => (
          <PipelineColumn key={stage.id} stage={stage} onJobClick={onJobClick} />
        ))}
      </div>
      <DragOverlay>
        {activeJob ? (
          <div className="w-[252px] rotate-1 opacity-95 drop-shadow-lg">
            <JobCard job={activeJob} onClick={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
