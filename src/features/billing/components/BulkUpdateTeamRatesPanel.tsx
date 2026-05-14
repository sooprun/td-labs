import * as React from "react"
import { IconArrowRight, IconArrowLeft, IconCheck, IconX } from "@tabler/icons-react"
import { toast } from "sonner"

import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { RateGroup } from "@/mock/data/team-member-rates"
import { serviceItems as allServices } from "@/mock/services"

// ─── Member avatars ───────────────────────────────────────────────────────────

function MemberAvatars({ members }: { members: RateGroup["members"] }) {
  return (
    <div className="flex items-center -space-x-1.5">
      {members.slice(0, 4).map((m) => (
        <span
          key={m.id}
          title={m.name}
          className="inline-flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-background text-[10px] font-bold text-white"
          style={{ backgroundColor: m.color }}
        >
          {m.initials}
        </span>
      ))}
      {members.length > 4 && (
        <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-semibold text-muted-foreground">
          +{members.length - 4}
        </span>
      )}
    </div>
  )
}

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

function formatRate(rate: number, rateType?: string) {
  const amount = `$${rate.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  return rateType === "Hour" ? `${amount}/hr` : amount
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

// ─── Step 1 ──────────────────────────────────────────────────────────────────

function Step1({
  adjustment, setAdjustment, rounding, setRounding, onNext, onClose,
}: {
  adjustment: string
  setAdjustment: (v: string) => void
  rounding: Rounding
  setRounding: (v: Rounding) => void
  onNext: () => void
  onClose: () => void
}) {
  const pct = parseFloat(adjustment)
  const valid = !isNaN(pct) && pct !== 0

  return (
    <>
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-6">
        <h2 className="text-2xl font-bold">Price adjustment</h2>

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
            Enter a positive value to increase (e.g., 10%) or negative to decrease (e.g., -10%).
          </p>
        </div>
      </div>

      <div className="flex gap-3 border-t px-6 py-4">
        <Button size="xl" className="px-5" disabled={!valid} onClick={onNext}>Continue</Button>
      </div>
    </>
  )
}

// ─── Step 2 ──────────────────────────────────────────────────────────────────

function Step2({
  groups, adjustment, rounding, onBack, onClose, onConfirm,
}: {
  groups: RateGroup[]
  adjustment: number
  rounding: Rounding
  onBack: () => void
  onClose: () => void
  onConfirm: () => void
}) {
  const sign = adjustment > 0 ? "+" : ""
  const roundingLabel = ROUNDING_OPTIONS.find((o) => o.value === rounding)?.label ?? ""

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-6">
        <h2 className="text-2xl font-bold">Preview changes</h2>
        <p className="text-sm text-muted-foreground">{sign}{adjustment}% · {roundingLabel}</p>

        <div className="flex flex-col gap-3">
          {groups.map((group) => (
            <div key={group.id} className="rounded-xl border bg-background">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="font-medium">{group.name}</span>
                <MemberAvatars members={group.members} />
              </div>
              <div className="border-t px-4 pb-3 pt-2 flex flex-col gap-1.5">
                {group.services.map((svc) => {
                  const serviceItem = allServices.find((s) => s.id === svc.serviceId)
                  const newRate = applyAdjustment(svc.rate, adjustment, rounding)
                  return (
                    <div key={svc.serviceId} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{serviceItem?.name ?? svc.serviceId}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground line-through">{formatRate(svc.rate, serviceItem?.rateType)}</span>
                        <IconArrowRight className="size-3.5 text-muted-foreground" />
                        <span className="font-medium">{formatRate(newRate, serviceItem?.rateType)}</span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          adjustment > 0
                            ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                        }`}>
                          {sign}{adjustment}%
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 border-t px-6 py-4">
        <Button size="icon-xl" variant="outline" onClick={onBack}>
          <IconArrowLeft className="size-4" />
        </Button>
        <Button size="xl" className="px-5" onClick={onConfirm}>Confirm update</Button>
      </div>
    </>
  )
}

// ─── Panel ───────────────────────────────────────────────────────────────────

type Props = {
  open: boolean
  groups: RateGroup[]
  onClose: () => void
  onConfirm: () => void
}

export function BulkUpdateTeamRatesPanel({ open, groups, onClose, onConfirm }: Props) {
  const [step, setStep] = React.useState<1 | 2>(1)
  const [adjustment, setAdjustment] = React.useState("10")
  const [rounding, setRounding] = React.useState<Rounding>(5)

  const reset = () => { setStep(1); setAdjustment("10"); setRounding(5) }
  const handleClose = () => { onClose(); setTimeout(reset, 300) }
  const handleConfirm = () => {
    onConfirm()
    handleClose()
    toast.success(`Rates updated for ${groups.length} rate group${groups.length === 1 ? "" : "s"}`)
  }

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) handleClose() }}>
      <SheetContent className="flex w-full flex-col gap-0 p-0" showCloseButton={false}>
        <div className="flex h-14 shrink-0 items-center justify-between border-b bg-muted/40 px-4">
          <span className="text-base font-semibold">Update team member rates</span>
          <Button size="icon-xl" variant="ghost" onClick={handleClose}>
            <IconX className="size-4" />
          </Button>
        </div>

        <Stepper step={step} />

        {step === 1 ? (
          <Step1
            adjustment={adjustment}
            setAdjustment={setAdjustment}
            rounding={rounding}
            setRounding={setRounding}
            onNext={() => setStep(2)}
            onClose={handleClose}
          />
        ) : (
          <Step2
            groups={groups}
            adjustment={parseFloat(adjustment)}
            rounding={rounding}
            onBack={() => setStep(1)}
            onClose={handleClose}
            onConfirm={handleConfirm}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}
