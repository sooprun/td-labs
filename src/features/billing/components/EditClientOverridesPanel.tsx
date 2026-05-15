import * as React from "react"
import { IconSearch, IconX, IconCheck, IconChevronDown, IconInfoCircle, IconArrowLeft, IconArrowRight } from "@tabler/icons-react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DataTableSortIcon, type SortDir } from "@/components/data-table/DataTableSortIcon"
import type { ServiceItem } from "@/mock/services"
import type { Account } from "@/mock/data/accounts"
import { rateGroups } from "@/mock/data/team-member-rates"

// ─── Helpers ─────────────────────────────────────────────────────────────────

type Rounding = number
type ApplyTo = "overrides" | "all"

const ROUNDING_PRESETS: { value: number; label: string }[] = [
  { value: 0,  label: "No rounding" },
  { value: 1,  label: "$1" },
  { value: 5,  label: "$5" },
  { value: 10, label: "$10" },
]

function applyAdjustment(rate: number, pct: number, rounding: Rounding): number {
  const raw = rate * (1 + pct / 100)
  if (rounding === 0) return Math.round(raw * 100) / 100
  return pct >= 0
    ? Math.ceil(raw / rounding) * rounding
    : Math.floor(raw / rounding) * rounding
}

// Shared Continue button — consistent size and padding across all panels
function ContinueButton({ disabled, onClick }: { disabled?: boolean; onClick: () => void }) {
  return (
    <Button size="xl" className="px-5" disabled={disabled} onClick={onClick}>
      Continue
    </Button>
  )
}

function RoundingInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [input, setInput] = React.useState(value === 0 ? "" : String(value))

  const handleChange = (raw: string) => {
    setInput(raw)
    const n = parseFloat(raw)
    onChange(!raw || isNaN(n) ? 0 : n)
  }

  return (
    <div className="relative flex w-full items-center">
      <span className="pointer-events-none absolute left-3 text-sm text-muted-foreground">$</span>
      <Input
        type="text"
        inputMode="decimal"
        className="pl-6 pr-9 text-right"
        value={input}
        placeholder="0"
        onChange={(e) => handleChange(e.target.value)}
        onFocus={(e) => { const t = e.target; requestAnimationFrame(() => t.setSelectionRange(t.value.length, t.value.length)) }}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="absolute right-2 flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-foreground">
            <IconChevronDown className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {ROUNDING_PRESETS.map((p) => (
            <DropdownMenuItem key={p.value} onClick={() => { setInput(p.value === 0 ? "" : String(p.value)); onChange(p.value) }}>
              {p.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// ─── Stepper ─────────────────────────────────────────────────────────────────

const STEPS = ["Price adjustment", "Review overrides"]

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

// ─── Step 1: Price adjustment ─────────────────────────────────────────────────

const APPLY_TO_OPTIONS: { value: ApplyTo; label: string; description: string }[] = [
  {
    value: "all",
    label: "All services",
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

  const example = 137.50
  const afterPct = valid ? example * (1 + pct / 100) : null
  const afterRound = afterPct !== null && rounding > 0
    ? (pct >= 0 ? Math.ceil(afterPct / rounding) * rounding : Math.floor(afterPct / rounding) * rounding)
    : afterPct
  const fmt = (n: number) => n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`

  return (
    <>
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-6">
        <h2 className="text-xl font-semibold">Price adjustment</h2>

        {/* Calculator */}
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1 flex flex-col gap-2">
              <div className="text-sm font-medium">Adjust by</div>
              <div className="relative w-full">
                <Input
                  autoFocus
                  type="text"
                  inputMode="decimal"
                  className="pr-8 text-right"
                  value={adjustment}
                  onChange={(e) => setAdjustment(e.target.value)}
                  onFocus={(e) => { const t = e.target; requestAnimationFrame(() => t.setSelectionRange(t.value.length, t.value.length)) }}
                  placeholder="0"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
              </div>
            </div>
            <div className="col-span-1 flex flex-col gap-2">
              <div className="text-sm font-medium">Round to</div>
              <RoundingInput value={rounding} onChange={setRounding} />
            </div>
          </div>

          {afterPct === null ? (
            <p className="text-xs text-muted-foreground">Enter a positive or negative percentage to see how prices will change</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Example: {[fmt(example), fmt(afterPct), rounding > 0 ? fmt(afterRound!) : null].filter(Boolean).join(" → ")}
            </p>
          )}
        </div>

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
              ? "1 selected service uses team member rates and can't have client overrides — it will be skipped."
              : `${skippedCount} selected services use team member rates and can't have client overrides — they'll be skipped.`}
          </div>
        )}
      </div>

      <div className="flex gap-3 border-t px-6 py-4">
        <ContinueButton disabled={!valid} onClick={onNext} />
      </div>
    </>
  )
}

// ─── Step 2: Set prices ───────────────────────────────────────────────────────

type OverrideMap = Record<string, string>

function Step2({
  account,
  services,
  overrides,
  onOverrideChange,
  onBack,
  onSave,
}: {
  account: Account
  services: ServiceItem[]
  overrides: OverrideMap
  onOverrideChange: (id: string, value: string) => void
  onBack: () => void
  onSave: () => void
}) {
  const [search, setSearch] = React.useState("")
  const [sortKey, setSortKey] = React.useState<"name" | "category" | "defaultRate">("name")
  const [sortDir, setSortDir] = React.useState<SortDir>("asc")
  const [focusedId, setFocusedId] = React.useState<string | null>(null)

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

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">Review overrides</h2>
          <p className="text-sm text-muted-foreground">
            Review and adjust individual overrides for {account.name}. Clear a field to use the default rate.
          </p>
        </div>

        <div className="relative">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search services" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="overflow-hidden rounded-xl border">
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
                const existingOverride = svc.clientOverridesList.find((o) => o.accountId === account.id)
                const oldPrice = existingOverride?.rate ?? svc.defaultRate
                const fmtOld = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${svc.rateType === "Hour" ? "/hr" : ""}`

                const raw = overrides[svc.id] ?? ""
                const isFocused = focusedId === svc.id
                const parsed = parseFloat(raw)
                const displayVal = !isFocused && raw && !isNaN(parsed) ? parsed.toFixed(2) : raw
                const pct = raw !== "" && oldPrice > 0 && !isNaN(parsed)
                  ? Math.round(((parsed - oldPrice) / oldPrice) * 100)
                  : null

                return (
                  <tr key={svc.id} className={i % 2 === 1 ? "bg-workspace" : ""}>
                    <td className="px-4 py-2.5">
                      <div className="font-medium truncate">{svc.name}</div>
                    </td>
                    <td className="w-64 px-4 py-2">
                      <div className="flex items-center justify-end gap-2">
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
                        <div className="relative w-28 shrink-0">
                          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                          <Input
                            type="text"
                            inputMode="decimal"
                            className={`pl-6 text-right text-sm ${svc.rateType === "Hour" ? "pr-8" : ""}`}
                            value={displayVal}
                            placeholder={oldPrice > 0 ? oldPrice.toFixed(2) : "0.00"}
                            onChange={(e) => onOverrideChange(svc.id, e.target.value)}
                            onFocus={(e) => {
                              setFocusedId(svc.id)
                              const t = e.target
                              requestAnimationFrame(() => t.setSelectionRange(t.value.length, t.value.length))
                            }}
                            onBlur={() => setFocusedId(null)}
                          />
                          {svc.rateType === "Hour" && (
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">/hr</span>
                          )}
                        </div>
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

      <div className="flex gap-3 border-t px-6 py-4">
        <Button size="icon-xl" variant="outline" onClick={onBack}>
          <IconArrowLeft className="size-4" />
        </Button>
        <Button size="xl" className="px-5" onClick={onSave}>Save</Button>
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
  const [overrides, setOverrides] = React.useState<OverrideMap>({})

  const teamRateServiceIds = new Set(
    rateGroups.filter((g) => !g.archived).flatMap((g) => g.services.map((s) => s.serviceId))
  )
  // Only operate on the services selected in the table
  const activeServices = services.filter((s) =>
    selectedIds.includes(s.id) && !teamRateServiceIds.has(s.id)
  )
  const skippedCount = selectedIds.filter((id) => teamRateServiceIds.has(id)).length
  const servicesWithOverride = activeServices.filter((s) =>
    s.clientOverridesList.some((o) => o.accountId === account.id)
  )
  // Show "Apply to" only when there's a mix — some services have overrides, some don't
  const showApplyTo = servicesWithOverride.length > 0 && servicesWithOverride.length < activeServices.length

  React.useEffect(() => {
    if (!open) return
    setStep(1)
    setAdjustment("")
    setRounding(1)
    setApplyTo("all")
    setOverrides({})
  }, [open])

  const handleContinue = () => {
    const pct = parseFloat(adjustment)
    const initial: OverrideMap = {}

    // Which services to include in step 2:
    // - "overrides": only services that already have an override
    // - "all" (or no choice shown): all active non-team-rate services
    const targetServices = showApplyTo && applyTo === "overrides"
      ? servicesWithOverride
      : activeServices

    targetServices.forEach((svc) => {
      const existing = svc.clientOverridesList.find((o) => o.accountId === account.id)
      const base = existing?.rate ?? svc.defaultRate
      const result = applyAdjustment(base, pct, rounding)
      initial[svc.id] = String(result)
    })
    setOverrides(initial)
    setStep(2)
  }

  const handleSave = () => {
    const updated = services.map((svc) => {
      if (teamRateServiceIds.has(svc.id)) return svc
      const raw = overrides[svc.id]
      // Service not included in step 2 — leave untouched
      if (raw === undefined) return svc
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

  // Step 2 shows only services that were included in the calculation
  const step2Services = activeServices.filter((s) => overrides[s.id] !== undefined)

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <SheetContent side="right" className="flex w-[520px] max-w-full flex-col gap-0 p-0" showCloseButton={false}>
        {/* Header */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b bg-muted/40 px-4">
          <span className="text-xl font-semibold">Update client overrides</span>
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
            onOverrideChange={(id, val) => setOverrides((prev) => ({ ...prev, [id]: val }))}
            onBack={() => setStep(1)}
            onSave={handleSave}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}
