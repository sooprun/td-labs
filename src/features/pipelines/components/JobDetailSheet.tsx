import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { protoAction } from "@/lib/proto"
import type { Job } from "@/mock/data/pipelines"

type JobDetailSheetProps = {
  job: Job | null
  open: boolean
  onClose: () => void
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-0.5 text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  )
}

export function JobDetailSheet({ job, open, onClose }: JobDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="sm:max-w-[480px]">
        {job && (
          <>
            <SheetHeader className="pb-2">
              <SheetTitle className="text-xl">{job.jobTitle}</SheetTitle>
              <p className="text-sm text-muted-foreground">
                {job.clientName} · 2024 Tax Season
              </p>
            </SheetHeader>

            <div className="flex flex-col gap-4 px-4 py-2">
              <Field label="Client" value={job.clientName} />
              <Field label="Job" value={job.jobTitle} />
              {job.priority && (
                <Field label="Priority" value={job.priority} />
              )}
              <Field
                label="Days in stage"
                value={`${job.daysInStage} ${job.daysInStage === 1 ? "day" : "days"}`}
              />
            </div>

            <SheetFooter className="flex-col gap-2">
              <Button className="w-full" onClick={protoAction("Create invoice")}>
                Create invoice
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={protoAction("View client")}
              >
                View client
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
