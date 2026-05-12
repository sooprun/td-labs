import * as React from "react"
import { IconArrowRight, IconArrowLeft, IconDownload, IconCheck, IconX } from "@tabler/icons-react"
import { toast } from "sonner"

import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { protoAction } from "@/lib/proto"
import type { ServiceItem } from "@/mock/services"

// ─── Helpers ─────────────────────────────────────────────────────────────────

type Rounding = 0 | 1 | 5 | 10

const ROUNDING_OPTIONS: { value: Rounding; label: string }[] = [
  { value: 0,  label: "No rounding" },
  { value: 1,  label: "Nearest $1" },
  { value: 5,  label: "Nearest $5" },
  { value: 10, label: "Nearest $10" },
]

function applyAdjustment(rate: number, pct: number, rounding: Rounding): number {
  const raw = rate * (1 + pct / 100)
  if (rounding === 0) return Math.round(raw * 100) / 100
  return Math.round(raw / rounding) * rounding
}

function formatRate(rate: number) {
  return `$${rate.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

// ─── Stepper ─────────────────────────────────────────────────────────────────

const STEPS = ["Price adjustment", "Preview changes"]

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
                isCompleted
                  ? "bg-[#24C875] text-white"
                  : isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}>
                {isCompleted ? <IconCheck className="size-4" /> : num}
              </div>
              <span className={`text-xs font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="mb-5 mx-3 h-px w-12 bg-border" />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

// ─── Step 1 ──────────────────────────────────────────────────────────────────

type Step1Props = {
  adjustment: string
  setAdjustment: (v: string) => void
  rounding: Rounding
  setRounding: (v: Rounding) => void
  clientMode: "keep" | "update"
  setClientMode: (v: "keep" | "update") => void
  onNext: () => void
  onClose: () => void
}

function Step1({ adjustment, setAdjustment, rounding, setRounding, clientMode, setClientMode, onNext, onClose }: Step1Props) {
  const pct = parseFloat(adjustment)
  const valid = !isNaN(pct) && pct !== 0

  return (
    <>
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-6">
        <h2 className="text-2xl font-bold">Bulk update services</h2>

        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium">Price adjustment</div>
          <div className="flex items-center gap-3">
            <div className="relative w-32">
              <Input
                type="number"
                className="pr-8"
                value={adjustment}
                onChange={(e) => setAdjustment(e.target.value)}
                placeholder="0"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
            </div>
            <Select value={String(rounding)} onValueChange={(v) => setRounding(Number(v) as Rounding)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROUNDING_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={String(o.value)}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground">
            Enter positive values to increase (e.g., 10%) or negative values to decrease (e.g., -10%).
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {(["keep", "update"] as const).map((mode) => (
            <label
              key={mode}
              onClick={() => setClientMode(mode)}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                clientMode === mode
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted/40"
              }`}
            >
              <div className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                clientMode === mode ? "border-primary" : "border-muted-foreground/40"
              }`}>
                {clientMode === mode && <div className="size-2 rounded-full bg-primary" />}
              </div>
              <div>
                <div className="text-sm font-medium">
                  {mode === "keep" ? "Keep client overrides unchanged" : "Update client overrides by same %"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {mode === "keep"
                    ? "Clients with custom rates stay at their negotiated prices"
                    : `Raise all client-specific rates by ${valid ? `${pct > 0 ? "+" : ""}${pct}%` : "the same %"}`}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3 border-t px-6 py-4">
        <Button size="xl" disabled={!valid} onClick={onNext}>Continue</Button>
        <Button size="xl" variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </>
  )
}

// ─── Step 2 ──────────────────────────────────────────────────────────────────

type Step2Props = {
  services: ServiceItem[]
  adjustment: number
  rounding: Rounding
  clientMode: "keep" | "update"
  onBack: () => void
  onClose: () => void
  onConfirm: (updates: { id: string; defaultRate: number; clientOverridesList: ServiceItem["clientOverridesList"] }[]) => void
}

function Step2({ services, adjustment, rounding, clientMode, onBack, onClose, onConfirm }: Step2Props) {
  const updates = services.map((svc) => ({
    id: svc.id,
    defaultRate: applyAdjustment(svc.defaultRate, adjustment, rounding),
    clientOverridesList: clientMode === "update"
      ? svc.clientOverridesList.map((o) => ({ ...o, rate: applyAdjustment(o.rate, adjustment, rounding) }))
      : svc.clientOverridesList,
  }))

  const sign = adjustment > 0 ? "+" : ""
  const roundingLabel = ROUNDING_OPTIONS.find((o) => o.value === rounding)?.label ?? ""
  const summaryParts = [
    `${sign}${adjustment}%`,
    clientMode === "keep" ? "Client overrides: preserved" : "Client overrides: updated",
    roundingLabel,
  ]

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-6">
        <h2 className="text-2xl font-bold">Preview changes</h2>
        <p className="text-sm text-muted-foreground">{summaryParts.join(" · ")}</p>

        {clientMode === "update" && (
          <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">
            <span className="shrink-0">ℹ</span>
            Client-specific rates will also increase by {sign}{adjustment}%
          </div>
        )}

        <div className="flex flex-col gap-2">
          {updates.map((upd, i) => {
            const svc = services[i]
            return (
              <div key={upd.id} className="rounded-xl border bg-background">
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="font-medium">{svc.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground line-through">{formatRate(svc.defaultRate)}</span>
                    <IconArrowRight className="size-3.5 text-muted-foreground" />
                    <span className="font-medium">{formatRate(upd.defaultRate)}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      adjustment > 0
                        ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                    }`}>
                      {sign}{adjustment}%
                    </span>
                  </div>
                </div>

                {clientMode === "update" && upd.clientOverridesList.length > 0 && (
                  <div className="border-t px-4 pb-3 pt-2">
                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Client overrides
                    </div>
                    <div className="flex flex-col gap-1.5 pl-2">
                      {upd.clientOverridesList.map((o, j) => (
                        <div key={j} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{o.accountName}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground line-through">
                              {formatRate(svc.clientOverridesList[j].rate)}
                            </span>
                            <IconArrowRight className="size-3 text-muted-foreground" />
                            <span>{formatRate(o.rate)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex gap-3 border-t px-6 py-4">
        <Button size="icon-xl" variant="outline" onClick={onBack}>
          <IconArrowLeft className="size-4" />
        </Button>
        <Button size="xl" onClick={() => onConfirm(updates)}>Confirm update</Button>
        <Button size="xl" variant="outline" onClick={onClose}>Cancel</Button>
        <Button size="xl" variant="ghost" onClick={protoAction("Export to preview")}>
          <IconDownload className="size-4" />
          Export to preview
        </Button>
      </div>
    </>
  )
}

// ─── Panel ───────────────────────────────────────────────────────────────────

type BulkUpdateRatesPanelProps = {
  open: boolean
  services: ServiceItem[]
  onClose: () => void
  onConfirm: (updates: { id: string; defaultRate: number; clientOverridesList: ServiceItem["clientOverridesList"] }[]) => void
}

export function BulkUpdateRatesPanel({ open, services, onClose, onConfirm }: BulkUpdateRatesPanelProps) {
  const [step, setStep] = React.useState<1 | 2>(1)
  const [adjustment, setAdjustment] = React.useState("10")
  const [rounding, setRounding] = React.useState<Rounding>(5)
  const [clientMode, setClientMode] = React.useState<"keep" | "update">("keep")

  const handleClose = () => {
    onClose()
    setTimeout(() => { setStep(1); setAdjustment("10"); setRounding(5); setClientMode("keep") }, 300)
  }

  const handleConfirm = (updates: { id: string; defaultRate: number; clientOverridesList: ServiceItem["clientOverridesList"] }[]) => {
    onConfirm(updates)
    handleClose()
    toast.success(`Rates updated for ${updates.length} service${updates.length === 1 ? "" : "s"}`)
  }

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) handleClose() }}>
      <SheetContent className="flex w-full flex-col gap-0 p-0" showCloseButton={false}>
        {/* Header */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b bg-muted/40 px-4">
          <span className="text-base font-semibold">Update rates</span>
          <Button size="icon-xl" variant="ghost" onClick={handleClose}>
            <IconX className="size-4" />
          </Button>
        </div>

        {/* Stepper */}
        <Stepper step={step} />

        {step === 1 ? (
          <Step1
            adjustment={adjustment}
            setAdjustment={setAdjustment}
            rounding={rounding}
            setRounding={setRounding}
            clientMode={clientMode}
            setClientMode={setClientMode}
            onNext={() => setStep(2)}
            onClose={handleClose}
          />
        ) : (
          <Step2
            services={services}
            adjustment={parseFloat(adjustment)}
            rounding={rounding}
            clientMode={clientMode}
            onBack={() => setStep(1)}
            onClose={handleClose}
            onConfirm={handleConfirm}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}
