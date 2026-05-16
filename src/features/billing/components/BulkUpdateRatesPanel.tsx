import * as React from "react"
import { IconArrowLeft, IconArrowRight, IconDownload, IconCheck, IconX } from "@tabler/icons-react"
import { toast } from "sonner"

import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { protoAction } from "@/lib/proto"
import { CurrencyInput } from "./RateInputs"
import { PriceAdjustmentCalculator, applyAdjustment, type Rounding } from "./PriceAdjustmentCalculator"
import type { ServiceItem } from "@/mock/services"
import { rateGroups } from "@/mock/data/team-member-rates"

// ─── Helpers ─────────────────────────────────────────────────────────────────

// ─── Stepper ─────────────────────────────────────────────────────────────────

const STEPS = ["Price adjustment", "Preview changes"]

function Stepper({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex shrink-0 items-center justify-center gap-0 border-b px-6 py-4">
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
      <div className="flex flex-1 min-h-0 flex-col gap-6 overflow-y-auto px-6 py-6">
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

      <div className="flex shrink-0 gap-3 border-t px-6 py-4">
        <Button size="xl" className="px-5" disabled={!valid} onClick={onNext}>Continue</Button>
      </div>
    </>
  )
}

// ─── Step 2 ──────────────────────────────────────────────────────────────────

type EditableMaps = {
  defaultRates: Record<string, string>
  clientRates: Record<string, Record<string, string>>
  teamRates: Record<string, Record<string, string>>
}

type Step2Props = {
  services: ServiceItem[]
  adjustment: number
  rounding: Rounding
  rateTypes: Record<RateTypeKey, boolean>
  editableMaps: EditableMaps
  onDefaultChange: (serviceId: string, val: string) => void
  onClientChange: (serviceId: string, accountId: string, val: string) => void
  onTeamChange: (serviceId: string, groupId: string, val: string) => void
  onBack: () => void
  onConfirm: () => void
}

function Step2({ services, adjustment, rounding, rateTypes, editableMaps, onDefaultChange, onClientChange, onTeamChange, onBack, onConfirm }: Step2Props) {
  const hasTeamRate = (svc: ServiceItem) =>
    rateGroups.some((g) => !g.archived && g.services.some((s) => s.serviceId === svc.id))

  // Services with team rates can't have client overrides — team rates take priority
  const clientOverridesApplies = (svc: ServiceItem) =>
    rateTypes.client && svc.clientOverridesList.length > 0 && !hasTeamRate(svc)

  const visibleServices = services.filter((svc) =>
    rateTypes.default ||
    clientOverridesApplies(svc) ||
    (rateTypes.team && hasTeamRate(svc))
  )

  const direction = adjustment > 0 ? "Increased" : "Decreased"
  const appliedToList = RATE_TYPE_OPTIONS.filter(({ key }) => rateTypes[key]).map(({ label }) => label)
  const appliedTo = appliedToList.length > 1
    ? appliedToList.slice(0, -1).join(", ") + ", and " + appliedToList.at(-1)
    : appliedToList[0] ?? ""
  const roundingPart = rounding > 0 ? `, rounded to $${rounding} increments,` : ""
  const summaryLine = `${direction} by ${Math.abs(adjustment)}%${roundingPart} and applied to ${appliedTo}`

  const fmtOld = (rate: number, svc: ServiceItem) =>
    `$${rate.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${svc.rateType === "Hour" ? "/hr" : ""}`

  const rateInputContent = (
    _focusKey: string,
    oldRate: number,
    newRateStr: string,
    svc: ServiceItem,
    onChange: (v: string) => void
  ) => {
    const parsed = parseFloat(newRateStr)
    const pct = newRateStr !== "" && oldRate > 0 && !isNaN(parsed)
      ? Math.round(((parsed - oldRate) / oldRate) * 100)
      : null
    const showDiff = newRateStr !== "" && !isNaN(parsed) && parsed !== oldRate

    return (
      <div className="flex items-center justify-end gap-2">
        {showDiff && (
          <>
            <span className="text-sm text-muted-foreground tabular-nums whitespace-nowrap line-through">
              {fmtOld(oldRate, svc)}
            </span>
            <IconArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
            {pct !== null && pct !== 0 && (
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${
                pct > 0
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}>
                {pct > 0 ? "+" : ""}{pct}%
              </span>
            )}
          </>
        )}
        <CurrencyInput
          value={newRateStr}
          onChange={onChange}
          suffix={svc.rateType === "Hour" ? "/hr" : undefined}
          className="w-28"
        />
      </div>
    )
  }

  const renderRateCell = (
    focusKey: string,
    oldRate: number,
    newRateStr: string,
    svc: ServiceItem,
    onChange: (v: string) => void
  ) => (
    <td className="w-56 px-4 py-2">
      {rateInputContent(focusKey, oldRate, newRateStr, svc, onChange)}
    </td>
  )

  return (
    <>
      <div className="flex flex-1 min-h-0 flex-col gap-4 overflow-y-auto px-6 py-6">
        <div className="flex flex-col gap-0">
          <h2 className="text-xl font-semibold">Preview changes</h2>
          <p className="text-sm text-muted-foreground">{summaryLine}</p>
        </div>

        <div className="flex flex-col gap-6">
          {visibleServices.map((svc) => {
            const teamEntries = rateTypes.team
              ? rateGroups
                  .filter((g) => !g.archived && g.services.some((s) => s.serviceId === svc.id))
                  .map((g) => {
                    const s = g.services.find((s) => s.serviceId === svc.id)!
                    return { groupId: g.id, groupName: g.name, oldRate: s.rate }
                  })
              : []

            const hasClientRows = clientOverridesApplies(svc)
            const hasTeamRows = teamEntries.length > 0

            // Build flat row list with optional sub-headers
            type RowDef =
              | { kind: "subheader"; label: string }
              | { kind: "client"; override: ServiceItem["clientOverridesList"][number] }
              | { kind: "team"; entry: { groupId: string; groupName: string; oldRate: number } }

            const rows: RowDef[] = []
            const multiSection = [hasClientRows, hasTeamRows].filter(Boolean).length > 1

            if (hasClientRows) {
              if (multiSection) rows.push({ kind: "subheader", label: "Client overrides" })
              for (const o of svc.clientOverridesList) rows.push({ kind: "client", override: o })
            }
            if (hasTeamRows) {
              if (multiSection) rows.push({ kind: "subheader", label: "Team member rates" })
              for (const entry of teamEntries) rows.push({ kind: "team", entry })
            }

            // Zebra only on data rows
            let dataRowIdx = 0

            return (
              <div key={svc.id}>
                <div className="shrink-0 overflow-hidden rounded-xl border">
                  <table className="panel-table w-full text-[14px]">
                    <thead className="border-b bg-background">
                      <tr>
                        <th className="px-4 py-3 text-left text-[13px] font-semibold text-secondary-foreground">{svc.name}</th>
                        <th className="w-56 px-4 py-3 text-right text-[13px] font-semibold text-secondary-foreground">
                          {rateTypes.default
                            ? rateInputContent(
                                `${svc.id}-default`,
                                svc.defaultRate,
                                editableMaps.defaultRates[svc.id] ?? "",
                                svc,
                                (v) => onDefaultChange(svc.id, v)
                              )
                            : <span className="tabular-nums">{fmtOld(svc.defaultRate, svc)}</span>
                          }
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, i) => {
                        if (row.kind === "subheader") {
                          return (
                            <tr key={`sh-${i}`} className="border-t bg-background">
                              <td colSpan={2} className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                {row.label}
                              </td>
                            </tr>
                          )
                        }

                        const zebra = dataRowIdx++ % 2 === 1 ? "bg-workspace" : ""

                        if (row.kind === "client") {
                          const o = row.override
                          return (
                            <tr key={`client-${o.accountId}`} className={zebra}>
                              <td className="px-4 py-2.5 truncate max-w-0">
                                <span className="font-medium truncate">{o.accountName}</span>
                              </td>
                              {renderRateCell(
                                `${svc.id}-client-${o.accountId}`,
                                o.rate,
                                editableMaps.clientRates[svc.id]?.[o.accountId] ?? "",
                                svc,
                                (v) => onClientChange(svc.id, o.accountId, v)
                              )}
                            </tr>
                          )
                        }

                        if (row.kind === "team") {
                          const { entry } = row
                          return (
                            <tr key={`team-${entry.groupId}`} className={zebra}>
                              <td className="px-4 py-2.5 truncate max-w-0">
                                <span className="font-medium truncate">{entry.groupName}</span>
                              </td>
                              {renderRateCell(
                                `${svc.id}-team-${entry.groupId}`,
                                entry.oldRate,
                                editableMaps.teamRates[svc.id]?.[entry.groupId] ?? "",
                                svc,
                                (v) => onTeamChange(svc.id, entry.groupId, v)
                              )}
                            </tr>
                          )
                        }

                        return null
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex shrink-0 gap-3 border-t px-6 py-4">
        <Button size="icon-xl" variant="outline" onClick={onBack}>
          <IconArrowLeft className="size-4" />
        </Button>
        <Button size="xl" className="px-5" onClick={onConfirm}>Apply changes</Button>
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

  const [defaultRates, setDefaultRates] = React.useState<Record<string, string>>({})
  const [clientRates, setClientRates] = React.useState<Record<string, Record<string, string>>>({})
  const [teamRates, setTeamRates] = React.useState<Record<string, Record<string, string>>>({})

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setStep(1)
      setAdjustment("")
      setRounding(1)
      setRateTypes({ default: true, client: false, team: false })
      setDefaultRates({})
      setClientRates({})
      setTeamRates({})
    }, 300)
  }

  const handleContinue = () => {
    const pct = parseFloat(adjustment)

    // Pre-fill editable maps from applyAdjustment
    const nextDefaultRates: Record<string, string> = {}
    const nextClientRates: Record<string, Record<string, string>> = {}
    const nextTeamRates: Record<string, Record<string, string>> = {}

    for (const svc of services) {
      if (rateTypes.default) {
        nextDefaultRates[svc.id] = String(applyAdjustment(svc.defaultRate, pct, rounding))
      }
      if (rateTypes.client && svc.clientOverridesList.length > 0) {
        nextClientRates[svc.id] = {}
        for (const o of svc.clientOverridesList) {
          nextClientRates[svc.id][o.accountId] = String(applyAdjustment(o.rate, pct, rounding))
        }
      }
      if (rateTypes.team) {
        const groups = rateGroups.filter((g) => !g.archived && g.services.some((s) => s.serviceId === svc.id))
        if (groups.length > 0) {
          nextTeamRates[svc.id] = {}
          for (const g of groups) {
            const s = g.services.find((s) => s.serviceId === svc.id)!
            nextTeamRates[svc.id][g.id] = String(applyAdjustment(s.rate, pct, rounding))
          }
        }
      }
    }

    setDefaultRates(nextDefaultRates)
    setClientRates(nextClientRates)
    setTeamRates(nextTeamRates)
    setStep(2)
  }

  const handleConfirm = () => {
    const updates = services.map((svc) => ({
      id: svc.id,
      defaultRate: rateTypes.default
        ? (parseFloat(defaultRates[svc.id]) || svc.defaultRate)
        : svc.defaultRate,
      clientOverridesList: rateTypes.client
        ? svc.clientOverridesList.map((o) => ({
            ...o,
            rate: parseFloat(clientRates[svc.id]?.[o.accountId]) || o.rate,
          }))
        : svc.clientOverridesList,
    }))

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
            onNext={handleContinue}
          />
        ) : (
          <Step2
            services={services}
            adjustment={parseFloat(adjustment)}
            rounding={rounding}
            rateTypes={rateTypes}
            editableMaps={{ defaultRates, clientRates, teamRates }}
            onDefaultChange={(sid, val) => setDefaultRates((p) => ({ ...p, [sid]: val }))}
            onClientChange={(sid, aid, val) =>
              setClientRates((p) => ({ ...p, [sid]: { ...p[sid], [aid]: val } }))
            }
            onTeamChange={(sid, gid, val) =>
              setTeamRates((p) => ({ ...p, [sid]: { ...p[sid], [gid]: val } }))
            }
            onBack={() => setStep(1)}
            onConfirm={handleConfirm}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}
