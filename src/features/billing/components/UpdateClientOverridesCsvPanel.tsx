import * as React from "react"
import { IconX, IconCheck, IconCloudUpload, IconDownload } from "@tabler/icons-react"

import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

// ─── Stepper ──────────────────────────────────────────────────────────────────

const STEPS = ["Upload", "Review"]

function Stepper({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex items-center justify-center gap-0 border-b px-6 py-4">
      {STEPS.map((label, i) => {
        const num = i + 1
        const isCompleted = num < step
        const isActive = num === step
        return (
          <React.Fragment key={num}>
            <div className="flex flex-col items-center gap-1.5">
              <div className={`flex size-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                isCompleted ? "bg-[#24C875] text-white"
                : isActive ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
              }`}>
                {isCompleted ? <IconCheck className="size-4" /> : num}
              </div>
              <span className={`text-xs font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && <div className="mb-5 mx-3 h-px w-12 bg-border" />}
          </React.Fragment>
        )
      })}
    </div>
  )
}

// ─── Dropzone ─────────────────────────────────────────────────────────────────

function Dropzone({ onFileSelect }: { onFileSelect: (file: File) => void }) {
  const [isDragging, setIsDragging] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onFileSelect(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFileSelect(file)
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-8 py-12 text-center transition-colors ${
        isDragging ? "border-primary bg-primary/5" : "border-border bg-muted/30 hover:bg-muted/50"
      }`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <IconCloudUpload className="size-6" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-foreground">Drag & drop file here</p>
        <p className="text-xs text-muted-foreground">or</p>
      </div>
      <Button
        size="xl"
        variant="outline"
        className="px-5"
        onClick={() => inputRef.current?.click()}
      >
        Browse
      </Button>
      <p className="text-xs text-muted-foreground">
        300 KB file size limit. Supported file types: CSV.
      </p>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}

// ─── Step 1 ───────────────────────────────────────────────────────────────────

function Step1({ onFileSelect }: { onFileSelect: (file: File) => void }) {
  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-6">
      <div className="flex flex-col gap-0">
        <h2 className="text-xl font-semibold">Upload CSV file</h2>
        <p className="text-sm text-muted-foreground">
          Upload a CSV file to update client overrides in bulk. Download the sample file below to make sure your file matches the required format.
        </p>
      </div>

      <Dropzone onFileSelect={onFileSelect} />

      <div className="flex justify-end">
        <Button size="xl" variant="ghost" onClick={() => {}}>
          <IconDownload className="size-4" />
          Download CSV sample
        </Button>
      </div>
    </div>
  )
}

// ─── Panel ────────────────────────────────────────────────────────────────────

type Props = {
  open: boolean
  onClose: () => void
}

export function UpdateClientOverridesCsvPanel({ open, onClose }: Props) {
  const [step] = React.useState<1 | 2>(1)

  const reset = () => {}
  const handleClose = () => { onClose(); setTimeout(reset, 300) }

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) handleClose() }}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0" showCloseButton={false}>
        {/* Header */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b bg-muted/40 px-4">
          <span className="text-xl font-semibold">Update client overrides</span>
          <Button size="icon-xl" variant="ghost" onClick={handleClose}>
            <IconX className="size-4" />
          </Button>
        </div>

        <Stepper step={step} />

        {step === 1 && (
          <Step1 onFileSelect={() => {}} />
        )}
      </SheetContent>
    </Sheet>
  )
}
