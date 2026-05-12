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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-xs text-muted-foreground">{label}</p>
      {children}
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
                {job.clientName} · 2024
              </p>
            </SheetHeader>

            <div className="flex flex-col gap-4 px-4 py-2">
              <Field label="Client">
                <p className="text-sm font-semibold text-[#1976D3]">
                  {job.clientName}
                </p>
              </Field>

              <Field label="Job">
                <p className="text-sm font-semibold">{job.jobTitle}</p>
              </Field>

              <Field label="Priority">
                <p className="text-sm font-semibold">{job.priority ?? "—"}</p>
              </Field>

              <Field label="Assignees">
                <div className="flex gap-1.5 pt-0.5">
                  {job.assignees.map((initials) => (
                    <span
                      key={initials}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
                    >
                      {initials}
                    </span>
                  ))}
                </div>
              </Field>

              <Field label="Days in stage">
                <p className="text-sm font-semibold">
                  {job.daysInStage} {job.daysInStage === 1 ? "day" : "days"}
                </p>
              </Field>
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
