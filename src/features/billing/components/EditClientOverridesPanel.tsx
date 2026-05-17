import * as React from "react"
import { IconSearch, IconX, IconCheck, IconArrowLeft, IconArrowRight } from "@tabler/icons-react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableSortIcon, type SortDir } from "@/components/data-table/DataTableSortIcon"
import { CurrencyInput } from "./RateInputs"
import type { ServiceItem } from "@/mock/services"
import type { Account } from "@/mock/data/accounts"
import { rateGroups } from "@/mock/data/team-member-rates"
import { PriceAdjustmentCalculator, applyAdjustment, type Rounding } from "./PriceAdjustmentCalculator"

// ─── Helpers ─────────────────────────────────────────────────────────────────

type ApplyTo = "overrides" | "all"

// Shared Continue button — consistent size and padding across all panels
function ContinueButton({ disabled, onClick }: { disabled?: boolean; onClick: () => void }) {
  return (
    <Button size="xl" className="px-5" disabled={disabled} onClick={onClick}>
      Continue
    </Button>
  )
}

// ─── Stepper ─────────────────────────────────────────────────────────────────

const STEPS = ["Price adjustment", "Review overrides"]

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

// ─── Step 1: Price adjustment ─────────────────────────────────────────────────

const APPLY_TO_OPTIONS: { value: ApplyTo; label: string; description: string }[] = [
  {
    value: "all",
    label: "All selected services",
    description: "Set or update overrides for all selected services",
  },
  {
    value: "overrides",
    label: "Existing overrides only",
    description: "Update only services that already have client overrides",
  },
]

function Step1({
  adjustment, setAdjustment,
  rounding, setRounding,
  applyTo, setApplyTo,
  showApplyTo,
  skippedCount,
  onNext,
}: {
  adjustment: string
  setAdjustment: (v: string) => void
  rounding: Rounding
  setRounding: (v: Rounding) => void
  applyTo: ApplyTo
  setApplyTo: (v: ApplyTo) => void
  showApplyTo: boolean
  skippedCount: number
  onNext: () => void
}) {
  const pct = parseFloat(adjustment)
  const valid = !isNaN(pct) && pct !== 0

  return (
    <>
      <div className="flex flex-1 min-h-0 flex-col gap-6 overflow-y-auto px-6 py-6">
        <h2 className="text-xl font-semibold">Price adjustment</h2>

        <PriceAdjustmentCalculator
          adjustment={adjustment}
          setAdjustment={setAdjustment}
          rounding={rounding}
          setRounding={setRounding}
        />

        {/* Apply to — only shown when some services don't have overrides yet */}
        {showApplyTo && (
          <div className="flex flex-col gap-2">
            <div className="text-sm font-medium">Apply to</div>
            {APPLY_TO_OPTIONS.map(({ value, label, description }) => (
              <label
                key={value}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                  applyTo === value ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"
                }`}
              >
                <input
                  type="radio"
                  className="mt-0.5 shrink-0 accent-primary"
                  checked={applyTo === value}
                  onChange={() => setApplyTo(value)}
                />
                <div>
                  <div className="text-sm font-medium">{label}</div>
                  <div className="text-sm text-muted-foreground">{description}</div>
                </div>
              </label>
            ))}
          </div>
        )}

        {/* Info banner — shown when "All services" is selected and some are team-rate */}
        {skippedCount > 0 && applyTo === "all" && (
          <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">
            <span className="shrink-0">ℹ</span>
            {skippedCount === 1
              ? "1 selected service will be skipped because it already uses team member rates"
              : `${skippedCount} selected services will be skipped because they already use team member rates`}
          </div>
        )}
      </div>

      <div className="flex shrink-0 gap-3 border-t px-6 py-4">
        <ContinueButton disabled={!valid} onClick={onNext} />
      </div>
    </>
  )
}

// ─── Step 2: Review overrides ─────────────────────────────────────────────────

type OverrideMap = Record<string, string>  // manual entries only
type BaselineMap = Record<string, number>  // per-service baseline (existing override or default)
type CalcMap     = Record<string, number>  // calculator-computed values

function Step2({
  account,
  services,
  overrides,
  baselineRates,
  calculatedRates,
  adjustment,
  rounding,
  applyTo,
  onOverrideChange,
  onBack,
  onSave,
}: {
  account: Account
  services: ServiceItem[]
  overrides: OverrideMap
  baselineRates: BaselineMap
  calculatedRates: CalcMap
  adjustment: number
  rounding: Rounding
  applyTo: ApplyTo
  onOverrideChange: (id: string, value: string) => void
  onBack: () => void
  onSave: (finalOverrides: OverrideMap) => void
}) {
  const [search, setSearch] = React.useState("")
  const [sortKey, setSortKey] = React.useState<"name" | "category" | "defaultRate">("name")
  const [sortDir, setSortDir] = React.useState<SortDir>("asc")

  const handleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    else { setSortKey(key); setSortDir("asc") }
  }

  const filtered = services
    .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1
      if (sortKey === "defaultRate") return (a.defaultRate - b.defaultRate) * mul
      return a[sortKey].localeCompare(b[sortKey]) * mul
    })

  const direction = adjustment > 0 ? "Increased" : "Decreased"
  const roundingPart = rounding > 0 ? `, rounded to $${rounding} increments` : ""
  const appliedTo = applyTo === "all" ? "all selected services" : "existing overrides only"
  const summaryLine = `${direction} by ${Math.abs(adjustment)}%${roundingPart}, applied to ${appliedTo}`

  const handleSave = () => {
    // Merge: manual entries take priority, calculated fills the rest
    const merged: OverrideMap = {}
    for (const svc of services) {
      const manual = overrides[svc.id] ?? ""
      if (manual !== "") {
        merged[svc.id] = manual
      } else {
        const calc = calculatedRates[svc.id]
        merged[svc.id] = calc !== undefined ? String(calc) : ""
      }
    }
    onSave(merged)
  }

  return (
    <>
      <div className="flex flex-1 min-h-0 flex-col gap-4 overflow-y-auto px-6 py-6">
        <div className="flex flex-col gap-0">
          <h2 className="text-xl font-semibold">Review overrides</h2>
          <p className="text-sm text-muted-foreground">{summaryLine}</p>
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">
            <span className="mt-px shrink-0">ℹ</span>
            Manual entries won&apos;t be overwritten by the price adjustment
          </div>
        </div>

        <div className="relative">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search services" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="shrink-0 overflow-hidden rounded-xl border">
          <table className="panel-table w-full text-[14px]">
            <thead className="border-b bg-background">
              <tr>
                <th className="px-4 py-3 text-left text-[13px] font-semibold text-secondary-foreground">
                  <button className="flex items-center gap-1 hover:text-foreground" onClick={() => handleSort("name")}>
                    Service <DataTableSortIcon col="name" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="w-64 px-4 py-3 text-right text-[13px] font-semibold text-secondary-foreground">
                  Client override
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((svc, i) => {
                const manualVal = overrides[svc.id] ?? ""
                const calcVal = calculatedRates[svc.id]
                const oldPrice = baselineRates[svc.id] ?? svc.defaultRate
                const fmtOld = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${svc.rateType === "Hour" ? "/hr" : ""}`

                // Effective value for delta: manual if typed, else calculated
                const effectiveParsed = manualVal !== "" ? parseFloat(manualVal) : calcVal
                const showDelta = effectiveParsed !== undefined && !isNaN(effectiveParsed) && effectiveParsed !== oldPrice
                const pct = showDelta && oldPrice > 0
                  ? Math.round(((effectiveParsed! - oldPrice) / oldPrice) * 100)
                  : null

                // Placeholder: calculated value if available, else baseline
                const placeholder = calcVal !== undefined
                  ? calcVal % 1 === 0 ? String(calcVal) : calcVal.toFixed(2)
                  : oldPrice > 0 ? oldPrice.toFixed(2) : "0.00"

                return (
                  <tr key={svc.id} className={i % 2 === 1 ? "bg-workspace" : ""}>
                    <td className="px-4 py-2.5">
                      <div className="font-medium truncate">{svc.name}</div>
                    </td>
                    <td className="w-64 px-4 py-2">
                      <div className="flex items-center justify-end gap-2">
                        {showDelta && (
                          <>
                            <span className="text-sm text-muted-foreground tabular-nums whitespace-nowrap line-through">{fmtOld(oldPrice)}</span>
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
                          value={manualVal}
                          onChange={(v) => onOverrideChange(svc.id, v)}
                          placeholder={placeholder}
                          suffix={svc.rateType === "Hour" ? "/hr" : undefined}
                          className="w-28"
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">No services found</p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 gap-3 border-t px-6 py-4">
        <Button size="icon-xl" variant="outline" onClick={onBack}>
          <IconArrowLeft className="size-4" />
        </Button>
        <Button size="xl" className="px-5" onClick={handleSave}>Apply overrides</Button>
      </div>
    </>
  )
}

// ─── Panel ────────────────────────────────────────────────────────────────────

type Props = {
  open: boolean
  account: Account
  services: ServiceItem[]
  selectedIds: string[]
  onClose: () => void
  onSave: (updated: ServiceItem[]) => void
}

export function EditClientOverridesPanel({ open, account, services, selectedIds, onClose, onSave }: Props) {
  const [step, setStep] = React.useState<1 | 2>(1)
  const [adjustment, setAdjustment] = React.useState("")
  const [rounding, setRounding] = React.useState<Rounding>(1)
  const [applyTo, setApplyTo] = React.useState<ApplyTo>("all")
  const [overrides, setOverrides] = React.useState<OverrideMap>({})        // manual entries only
  const [baselineRates, setBaselineRates] = React.useState<BaselineMap>({}) // existing override or default rate
  const [calculatedRates, setCalculatedRates] = React.useState<CalcMap>({}) // calculator output → shown as placeholders
  const [step2Services, setStep2Services] = React.useState<ServiceItem[]>([])

  const teamRateServiceIds = new Set(
    rateGroups.filter((g) => !g.archived).flatMap((g) => g.services.map((s) => s.serviceId))
  )
  const activeServices = services.filter((s) =>
    selectedIds.includes(s.id) && !teamRateServiceIds.has(s.id)
  )
  const skippedCount = selectedIds.filter((id) => teamRateServiceIds.has(id)).length
  const servicesWithOverride = activeServices.filter((s) =>
    s.clientOverridesList.some((o) => o.accountId === account.id)
  )
  const showApplyTo = servicesWithOverride.length > 0 && servicesWithOverride.length < activeServices.length

  React.useEffect(() => {
    if (!open) return
    setStep(1)
    setAdjustment("")
    setRounding(1)
    setApplyTo("all")
    setOverrides({})
    setBaselineRates({})
    setCalculatedRates({})
    setStep2Services([])
  }, [open])

  const handleContinue = () => {
    const pct = parseFloat(adjustment)
    const targetServices = showApplyTo && applyTo === "overrides" ? servicesWithOverride : activeServices

    const baseline: BaselineMap = {}
    const calculated: CalcMap = {}
    targetServices.forEach((svc) => {
      const existing = svc.clientOverridesList.find((o) => o.accountId === account.id)
      const base = existing?.rate ?? svc.defaultRate
      baseline[svc.id] = base
      calculated[svc.id] = applyAdjustment(base, pct, rounding)
    })

    setBaselineRates(baseline)
    setCalculatedRates(calculated)
    setOverrides({})  // manual entries start empty
    setStep2Services(targetServices)
    setStep(2)
  }

  const handleSave = (finalOverrides: OverrideMap) => {
    const updated = services.map((svc) => {
      if (teamRateServiceIds.has(svc.id)) return svc
      // Service not included in step 2 — leave untouched
      if (!step2Services.some((s) => s.id === svc.id)) return svc
      const raw = finalOverrides[svc.id] ?? ""
      const parsed = parseFloat(raw)
      if (raw.trim() === "" || isNaN(parsed)) {
        const newOverrides = svc.clientOverridesList.filter((o) => o.accountId !== account.id)
        return { ...svc, clientOverridesList: newOverrides, customRates: newOverrides.length }
      }
      const existing = svc.clientOverridesList.find((o) => o.accountId === account.id)
      const newOverrides = existing
        ? svc.clientOverridesList.map((o) => o.accountId === account.id ? { ...o, rate: parsed } : o)
        : [...svc.clientOverridesList, { accountId: account.id, accountName: account.name, rate: parsed }]
      return { ...svc, clientOverridesList: newOverrides, customRates: newOverrides.length }
    })
    onSave(updated)
  }

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <SheetContent side="right" className="flex w-[520px] max-w-full flex-col gap-0 p-0" showCloseButton={false}>
        {/* Header */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b bg-muted/40 px-4">
          <span className="text-xl font-semibold">Set client overrides</span>
          <Button size="icon-xl" variant="ghost" onClick={onClose}>
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
            applyTo={applyTo}
            setApplyTo={setApplyTo}
            showApplyTo={showApplyTo}
            skippedCount={skippedCount}
            onNext={handleContinue}
          />
        ) : (
          <Step2
            account={account}
            services={step2Services}
            overrides={overrides}
            baselineRates={baselineRates}
            calculatedRates={calculatedRates}
            adjustment={parseFloat(adjustment)}
            rounding={rounding}
            applyTo={applyTo}
            onOverrideChange={(id, val) => setOverrides((prev) => ({ ...prev, [id]: val }))}
            onBack={() => setStep(1)}
            onSave={handleSave}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}
