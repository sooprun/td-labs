import * as React from "react"
import {
  IconChevronDown,
  IconFilter,
  IconPencil,
  IconPlus,
  IconSortAZ,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { protoAction } from "@/lib/proto"
import { initialStages, pipelineName } from "@/mock/data/pipelines"
import type { Job, Stage } from "@/mock/data/pipelines"
import { PipelineBoard } from "@/features/pipelines/components/PipelineBoard"
import { JobDetailSheet } from "@/features/pipelines/components/JobDetailSheet"

export function PipelinesPage() {
  const [stages, setStages] = React.useState<Stage[]>(initialStages)
  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null)

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 px-6 pb-3 pt-4">
        <div className="mb-2.5 flex items-center gap-1">
          <button
            className="text-xl font-semibold text-foreground hover:opacity-75"
            onClick={protoAction("Switch pipeline")}
          >
            {pipelineName}
          </button>
          <IconChevronDown
            className="size-4 cursor-pointer text-muted-foreground"
            onClick={protoAction("Switch pipeline")}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="text-primary hover:bg-[#F2F9FF] hover:text-primary"
              onClick={protoAction("Sort")}
            >
              <IconSortAZ className="size-4" />
              Account name, A to Z
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-primary hover:bg-[#F2F9FF] hover:text-primary"
              onClick={protoAction("Filter")}
            >
              <IconFilter className="size-4" />
              Filter
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" onClick={protoAction("Add job")}>
              <IconPlus className="size-4" />
              Add job
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={protoAction("Edit pipeline")}
            >
              <IconPencil className="size-4" />
              Edit
            </Button>
          </div>
        </div>
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
