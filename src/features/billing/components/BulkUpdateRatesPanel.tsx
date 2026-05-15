import * as React from "react"
import { IconArrowRight, IconArrowLeft, IconDownload, IconCheck, IconX } from "@tabler/icons-react"
import { toast } from "sonner"

import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { protoAction } from "@/lib/proto"
import { PriceAdjustmentCalculator, applyAdjustment, type Rounding } from "./PriceAdjustmentCalculator"
import type { ServiceItem } from "@/mock/services"
import { rateGroups } from "@/mock/data/team-member-rates"

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

type RateTypeKey = "default" | "client" | "team"

type Step1Props = {
  adjustment: string
  setAdjustment: (v: string) => void
  rounding: Rounding
  setRounding: (v: Rounding) => void
  rateTypes: Record<RateTypeKey, boolean>
  setRateTypes: (v: Record<RateTypeKey, boolean>) => void
  onNext: () => void
}

const RATE_TYPE_OPTIONS: { key: RateTypeKey; label: string; description: string }[] = [
  { key: "default", label: "Default rates", description: "The base rate used when no override is set" },
  { key: "client", label: "Client overrides", description: "Per-client rates that override the default" },
  { key: "team", label: "Team member rates", description: "Rates tied to individual team members" },
]

function Step1({ adjustment, setAdjustment, rounding, setRounding, rateTypes, setRateTypes, onNext }: Step1Props) {
  const pct = parseFloat(adjustment)
  const anySelected = Object.values(rateTypes).some(Boolean)
  const valid = !isNaN(pct) && pct !== 0 && anySelected

  const toggle = (key: RateTypeKey) => setRateTypes({ ...rateTypes, [key]: !rateTypes[key] })

  return (
    <>
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-6">
        <h2 className="text-xl font-semibold">Price adjustment</h2>

        <PriceAdjustmentCalculator
          adjustment={adjustment}
          setAdjustment={setAdjustment}
          rounding={rounding}
          setRounding={setRounding}
          autoFocus={true}
        />

        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium">Apply to</div>
          {RATE_TYPE_OPTIONS.map(({ key, label, description }) => (
            <label
              key={key}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                rateTypes[key] ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"
              }`}
            >
              <input
                type="checkbox"
                className="table-checkbox mt-0.5 shrink-0"
                checked={rateTypes[key]}
                onChange={() => toggle(key)}
              />
              <div>
                <div className="text-sm font-medium">{label}</div>
                <div className="text-sm text-muted-foreground">{description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3 border-t px-6 py-4">
        <Button size="xl" className="px-5" disabled={!valid} onClick={onNext}>Continue</Button>
      </div>
    </>
  )
}

// ─── Step 2 ──────────────────────────────────────────────────────────────────

type Step2Props = {
  services: ServiceItem[]
  adjustment: number
  rounding: Rounding
  rateTypes: Record<RateTypeKey, boolean>
  onBack: () => void
  onConfirm: (updates: { id: string; defaultRate: number; clientOverridesList: ServiceItem["clientOverridesList"] }[]) => void
}

function Step2({ services, adjustment, rounding, rateTypes, onBack, onConfirm }: Step2Props) {
  const hasTeamRate = (svc: ServiceItem) =>
    rateGroups.some((g) => !g.archived && g.services.some((s) => s.serviceId === svc.id))

  const visibleServices = services.filter((svc) =>
    (rateTypes.default) ||
    (rateTypes.client && svc.clientOverridesList.length > 0) ||
    (rateTypes.team && hasTeamRate(svc))
  )

  const updates = services.map((svc) => ({
    id: svc.id,
    defaultRate: rateTypes.default ? applyAdjustment(svc.defaultRate, adjustment, rounding) : svc.defaultRate,
    clientOverridesList: rateTypes.client
      ? svc.clientOverridesList.map((o) => ({ ...o, rate: applyAdjustment(o.rate, adjustment, rounding) }))
      : svc.clientOverridesList,
  }))

  const direction = adjustment > 0 ? "Increased" : "Decreased"
  const appliedToList = RATE_TYPE_OPTIONS.filter(({ key }) => rateTypes[key]).map(({ label }) => label)
  const appliedTo = appliedToList.length > 1
    ? appliedToList.slice(0, -1).join(", ") + ", and " + appliedToList.at(-1)
    : appliedToList[0] ?? ""
  const roundingPart = rounding > 0 ? `, rounded to $${rounding} increments,` : ""
  const summaryLine = `${direction} by ${Math.abs(adjustment)}%${roundingPart} and applied to ${appliedTo}`

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-6">
        <div className="flex flex-col gap-0">
          <h2 className="text-xl font-semibold">Preview changes</h2>
          <p className="text-sm text-muted-foreground">{summaryLine}</p>
        </div>

        <div className="flex flex-col gap-2">
          {visibleServices.map((svc) => {
            const upd = updates.find((u) => u.id === svc.id)!
            return (
              <div key={upd.id} className="rounded-xl border bg-background">
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="font-medium">{svc.name}</span>
                  {!rateTypes.default && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground/60">Default rate:</span>
                      <span className="text-sm text-muted-foreground">{formatRate(svc.defaultRate)}</span>
                    </div>
                  )}
                  {rateTypes.default && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Default rate:</span>
                      <span className="text-sm text-muted-foreground line-through">{formatRate(svc.defaultRate)}</span>
                      <IconArrowRight className="size-3.5 text-muted-foreground" />
                      <span className="font-medium">{formatRate(upd.defaultRate)}</span>
                    </div>
                  )}
                </div>

                {rateTypes.client && upd.clientOverridesList.length > 0 && (
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

                {rateTypes.team && (() => {
                  const teamEntries = rateGroups
                    .filter((g) => !g.archived && g.services.some((s) => s.serviceId === svc.id))
                    .flatMap((g) => {
                      const s = g.services.find((s) => s.serviceId === svc.id)!
                      return [{ groupName: g.name, oldRate: s.rate, newRate: applyAdjustment(s.rate, adjustment, rounding) }]
                    })
                  if (teamEntries.length === 0) return null
                  return (
                    <div className="border-t px-4 pb-3 pt-2">
                      <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Team member rates
                      </div>
                      <div className="flex flex-col gap-1.5 pl-2">
                        {teamEntries.map((entry, j) => (
                          <div key={j} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{entry.groupName}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground line-through">{formatRate(entry.oldRate)}</span>
                              <IconArrowRight className="size-3 text-muted-foreground" />
                              <span>{formatRate(entry.newRate)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })()}
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex gap-3 border-t px-6 py-4">
        <Button size="icon-xl" variant="outline" onClick={onBack}>
          <IconArrowLeft className="size-4" />
        </Button>
        <Button size="xl" className="px-5" onClick={() => onConfirm(updates)}>Confirm update</Button>
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
  const [adjustment, setAdjustment] = React.useState("")
  const [rounding, setRounding] = React.useState<Rounding>(1)
  const [rateTypes, setRateTypes] = React.useState<Record<RateTypeKey, boolean>>({ default: true, client: false, team: false })

  const handleClose = () => {
    onClose()
    setTimeout(() => { setStep(1); setAdjustment(""); setRounding(1); setRateTypes({ default: true, client: false, team: false }) }, 300)
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
          <span className="text-xl font-semibold">Update service rates</span>
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
            rateTypes={rateTypes}
            setRateTypes={setRateTypes}
            onNext={() => setStep(2)}

          />
        ) : (
          <Step2
            services={services}
            adjustment={parseFloat(adjustment)}
            rounding={rounding}
            rateTypes={rateTypes}
            onBack={() => setStep(1)}

            onConfirm={handleConfirm}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}
