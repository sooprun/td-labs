import * as React from "react"
import { IconX, IconCheck, IconChevronRight, IconChevronDown, IconArrowLeft } from "@tabler/icons-react"

import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { ServiceItem } from "@/mock/services"
import type { Account } from "@/mock/data/accounts"

// ─── Stepper ──────────────────────────────────────────────────────────────────

function Stepper({ step }: { step: 1 | 2 }) {
  const steps = ["Select services", "Set prices"]
  return (
    <div className="flex items-center justify-center gap-0 border-b px-6 py-4">
      {steps.map((label, i) => {
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
            {i < steps.length - 1 && <div className="mb-5 mx-3 h-px w-12 bg-border" />}
          </React.Fragment>
        )
      })}
    </div>
  )
}

// ─── Step 1: Select services ──────────────────────────────────────────────────

function CategoryGroup({
  category,
  services,
  selectedServiceIds,
  onToggle,
}: {
  category: string
  services: ServiceItem[]
  selectedServiceIds: string[]
  onToggle: (id: string) => void
}) {
  const [open, setOpen] = React.useState(true)
  return (
    <div className="flex flex-col">
      <button
        className="flex items-center gap-2 py-2 text-left"
        onClick={() => setOpen((o) => !o)}
      >
        {open
          ? <IconChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
          : <IconChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
        }
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{category}</span>
      </button>
      {open && services.map((svc) => (
        <label key={svc.id} className="flex cursor-pointer items-center gap-3 rounded-lg px-1 py-2.5 hover:bg-muted/40">
          <input
            type="checkbox"
            className="table-checkbox shrink-0"
            checked={selectedServiceIds.includes(svc.id)}
            onChange={() => onToggle(svc.id)}
          />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{svc.name}</div>
            {svc.description && (
              <div className="truncate text-xs text-muted-foreground">{svc.description}</div>
            )}
          </div>
          <span className="shrink-0 text-xs text-muted-foreground">
            ${svc.defaultRate.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{svc.rateType === "Hour" ? "/hr" : ""}
          </span>
        </label>
      ))}
    </div>
  )
}

// ─── Step 2: Set prices ───────────────────────────────────────────────────────

type RateMap = Record<string, Record<string, string>> // serviceId → accountId → rateInput

function Step2({
  services,
  accounts,
  rates,
  onRateChange,
}: {
  services: ServiceItem[]
  accounts: Account[]
  rates: RateMap
  onRateChange: (serviceId: string, accountId: string, value: string) => void
}) {
  return (
    <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-6">
      <h2 className="text-2xl font-bold">Set prices</h2>
      <p className="text-sm text-muted-foreground">
        Set a custom rate for each client. Leave as-is to use the default rate.
      </p>
      {services.map((svc) => (
        <div key={svc.id} className="flex flex-col gap-3 rounded-xl border bg-background p-4">
          <div className="flex items-baseline justify-between">
            <span className="font-medium">{svc.name}</span>
            <span className="text-xs text-muted-foreground">
              Default rate: ${svc.defaultRate.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{svc.rateType === "Hour" ? "/hr" : ""}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {accounts.map((acc) => {
              const inputVal = rates[svc.id]?.[acc.id] ?? ""
              const parsed = parseFloat(inputVal)
              const pct = svc.defaultRate > 0 && !isNaN(parsed)
                ? Math.round(((parsed - svc.defaultRate) / svc.defaultRate) * 100)
                : null
              return (
                <div key={acc.id} className="flex items-center gap-3">
                  <span className="flex-1 truncate text-sm text-muted-foreground">{acc.name}</span>
                  <span className="inline-flex w-14 shrink-0 justify-center">
                    {pct !== null && pct !== 0 && (
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        pct > 0
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}>
                        {pct > 0 ? "+" : ""}{pct}%
                      </span>
                    )}
                  </span>
                  <div className="relative w-32 shrink-0">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                    <Input
                      className={`h-8 pl-6 text-right text-sm ${svc.rateType === "Hour" ? "pr-8" : ""}`}
                      value={inputVal}
                      placeholder="0.00"
                      onChange={(e) => onRateChange(svc.id, acc.id, e.target.value)}
                      onFocus={(e) => { const t = e.target; requestAnimationFrame(() => { t.setSelectionRange(t.value.length, t.value.length) }) }}
                    />
                    {svc.rateType === "Hour" && (
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">/hr</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Panel ────────────────────────────────────────────────────────────────────

type Props = {
  open: boolean
  selectedAccounts: Account[]
  services: ServiceItem[]
  onClose: () => void
  onSave: (updated: ServiceItem[]) => void
}

export function SetCustomRatesPanel({ open, selectedAccounts, services, onClose, onSave }: Props) {
  const [step, setStep] = React.useState<1 | 2>(1)
  const [selectedServiceIds, setSelectedServiceIds] = React.useState<string[]>([])
  const [rates, setRates] = React.useState<RateMap>({})

  const reset = () => {
    setStep(1)
    setSelectedServiceIds([])
    setRates({})
  }

  const handleClose = () => { onClose(); setTimeout(reset, 300) }

  const handleToggleService = (id: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleContinue = () => {
    // Pre-fill rates: existing override if any, else default rate
    const initial: RateMap = {}
    for (const svcId of selectedServiceIds) {
      const svc = services.find((s) => s.id === svcId)!
      initial[svcId] = {}
      for (const acc of selectedAccounts) {
        const existing = svc.clientOverridesList.find((o) => o.accountId === acc.id)
        const val = existing ? String(existing.rate) : svc.defaultRate > 0 ? String(svc.defaultRate) : ""
        initial[svcId][acc.id] = val
      }
    }
    setRates(initial)
    setStep(2)
  }

  const handleRateChange = (serviceId: string, accountId: string, value: string) => {
    setRates((prev) => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], [accountId]: value },
    }))
  }

  const handleSave = () => {
    const updated = services.map((svc) => {
      if (!selectedServiceIds.includes(svc.id)) return svc
      const accRates = rates[svc.id] ?? {}
      // Merge new overrides with existing ones (overwrite if account already has one)
      const newOverrides = selectedAccounts
        .map((acc) => ({
          accountId: acc.id,
          accountName: acc.name,
          rate: parseFloat(accRates[acc.id]) || 0,
        }))
      const merged = [
        ...svc.clientOverridesList.filter((o) => !selectedAccounts.some((a) => a.id === o.accountId)),
        ...newOverrides,
      ]
      return { ...svc, clientOverridesList: merged, customRates: merged.length }
    })
    onSave(updated)
    handleClose()
  }

  const selectedServices = services.filter((s) => selectedServiceIds.includes(s.id))
  const categories = Array.from(new Set(services.filter((s) => !s.archived).map((s) => s.category))).sort()

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) handleClose() }}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0" showCloseButton={false}>
        {/* Header */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b bg-muted/40 px-4">
          <span className="text-base font-semibold">Set client overrides</span>
          <Button size="icon-xl" variant="ghost" onClick={handleClose}>
            <IconX className="size-4" />
          </Button>
        </div>

        <Stepper step={step} />

        {step === 1 ? (
          <>
            <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-6 py-6">
              <h2 className="text-2xl font-bold">Select services</h2>
              <p className="mb-2 text-sm text-muted-foreground">
                Choose which services to set client overrides for across {selectedAccounts.length} selected {selectedAccounts.length === 1 ? "client" : "clients"}.
              </p>
              {categories.map((cat) => (
                <CategoryGroup
                  key={cat}
                  category={cat}
                  services={services.filter((s) => !s.archived && s.category === cat)}
                  selectedServiceIds={selectedServiceIds}
                  onToggle={handleToggleService}
                />
              ))}
            </div>
            <div className="flex gap-3 border-t px-6 py-4">
              <Button size="xl" disabled={selectedServiceIds.length === 0} onClick={handleContinue}>
                Continue
              </Button>
              <Button size="xl" variant="outline" onClick={handleClose}>Cancel</Button>
            </div>
          </>
        ) : (
          <>
            <Step2
              services={selectedServices}
              accounts={selectedAccounts}
              rates={rates}
              onRateChange={handleRateChange}
            />
            <div className="flex gap-3 border-t px-6 py-4">
              <Button size="icon-xl" variant="outline" onClick={() => setStep(1)}>
                <IconArrowLeft className="size-4" />
              </Button>
              <Button size="xl" onClick={handleSave}>Save client overrides</Button>
              <Button size="xl" variant="outline" onClick={handleClose}>Cancel</Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
