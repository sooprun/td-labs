import * as React from "react"
import {
  IconArrowsSort,
  IconChevronDown,
  IconFilter,
  IconPencil,
  IconPlus,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { protoAction } from "@/lib/proto"
import { initialStages, pipelineName, type Job, type Stage } from "@/mock/pipelines"
import { PipelineBoard } from "@/features/pipelines/components/PipelineBoard"
import { JobDetailSheet } from "@/features/pipelines/components/JobDetailSheet"
import { DataTableToolbarSlot, DataTableToolbarGroup, DataTableToolbarSpacer } from "@/components/data-table/DataTableToolbar"

export function PipelinesPage() {
  const [stages, setStages] = React.useState<Stage[]>(initialStages)
  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null)

  return (
    <div className="flex h-full flex-col overflow-hidden bg-workspace">
      <div className="flex shrink-0 flex-col gap-4 px-6 pb-4 pt-6">
        <div className="flex items-center gap-1">
          <button
            className="text-3xl font-semibold text-foreground hover:opacity-75"
            onClick={protoAction("Switch pipeline")}
          >
            {pipelineName}
          </button>
          <IconChevronDown
            className="size-5 cursor-pointer text-muted-foreground"
            onClick={protoAction("Switch pipeline")}
          />
        </div>

        <DataTableToolbarSlot>
          <DataTableToolbarGroup>
            <Button size="xl" variant="ghost" className="text-primary hover:text-primary" onClick={protoAction("Sort")}>
              <IconArrowsSort className="size-4" />
              Time in stage, shortest first
            </Button>
            <Button size="xl" variant="ghost" className="text-primary hover:text-primary" onClick={protoAction("Filter")}>
              <IconFilter className="size-4" />
              Filter
            </Button>
          </DataTableToolbarGroup>
          <DataTableToolbarSpacer />
          <DataTableToolbarGroup>
            <Button size="xl" onClick={protoAction("Add job")}>
              <IconPlus className="size-4" />
              Add job
            </Button>
            <Button size="xl" variant="outline" onClick={protoAction("Edit pipeline")}>
              <IconPencil className="size-4" />
              Edit
            </Button>
          </DataTableToolbarGroup>
        </DataTableToolbarSlot>
      </div>

      <div className="min-h-0 flex-1 overflow-x-auto overflow-y-hidden">
        <PipelineBoard
          stages={stages}
          onStagesChange={setStages}
          onJobClick={setSelectedJob}
        />
      </div>

      <JobDetailSheet
        job={selectedJob}
        open={selectedJob !== null}
        onClose={() => setSelectedJob(null)}
      />
    </div>
  )
}
