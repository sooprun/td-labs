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
              <SheetTitle className="text-xl">{job.name}</SheetTitle>
              <p className="text-sm text-muted-foreground">2024 Tax Season</p>
            </SheetHeader>

            <div className="flex flex-col gap-4 px-4 py-2">
              <Field label="Due date" value={job.dueDate ?? "—"} />
              <Field label="Time budget" value={job.timeBudget} />
              <Field label="Time variance" value={job.timeVariance} />
              <Field label="Time budget spent" value={job.timeBudgetSpent} />
              <Field label="Time in stage" value={job.timeAgo} />
              {job.overdueText && (
                <div>
                  <p className="mb-0.5 text-xs text-muted-foreground">Status</p>
                  <p className="text-sm font-semibold text-[#DE463C]">
                    {job.overdueText}
                  </p>
                </div>
              )}
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
