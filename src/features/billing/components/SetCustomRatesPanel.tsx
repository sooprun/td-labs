import * as React from "react"
import { IconX, IconCheck, IconArrowLeft, IconArrowRight, IconSearch } from "@tabler/icons-react"
import { IconLock, IconChevronDown } from "@tabler/icons-react"
import { DataTableSortIcon, type SortDir } from "@/components/data-table/DataTableSortIcon"

import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { ServiceItem } from "@/mock/services"
import { CurrencyInput } from "./RateInputs"
import type { Account } from "@/mock/data/accounts"
import { rateGroups } from "@/mock/data/team-member-rates"
import { PriceAdjustmentCalculator, applyAdjustment, type Rounding } from "./PriceAdjustmentCalculator"

// ─── Stepper ──────────────────────────────────────────────────────────────────

function Stepper({ step }: { step: 1 | 2 }) {
  const steps = ["Select services", "Price adjustment"]
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

function Step1({
  services,
  selectedServiceIds,
  onToggle,
  onSelectAll,
  onClearAll,
  onContinue,
}: {
  services: ServiceItem[]
  selectedServiceIds: string[]
  onToggle: (id: string) => void
  onSelectAll: () => void
  onClearAll: () => void
  onContinue: () => void
}) {
  const [search, setSearch] = React.useState("")
  const [sortKey, setSortKey] = React.useState<"name" | "category" | "defaultRate">("name")
  const [sortDir, setSortDir] = React.useState<SortDir>("asc")

  const handleSort = (key: "name" | "category" | "defaultRate") => {
    if (sortKey === key) setSortDir((d) => d === "asc" ? "desc" : "asc")
    else { setSortKey(key); setSortDir("asc") }
  }

  const teamRateServiceIds = new Set(
    rateGroups.filter((g) => !g.archived).flatMap((g) => g.services.map((s) => s.serviceId))
  )

  const allFiltered = services
    .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1
      if (sortKey === "defaultRate") return (a.defaultRate - b.defaultRate) * mul
      return a[sortKey].localeCompare(b[sortKey]) * mul
    })

  const filtered = allFiltered.filter((s) => !teamRateServiceIds.has(s.id))
  const teamRateServices = allFiltered.filter((s) => teamRateServiceIds.has(s.id))
  const skippedCount = search
    ? teamRateServices.length
    : services.filter((s) => teamRateServiceIds.has(s.id)).length

  const selectableFiltered = filtered
  const allSelected = selectableFiltered.length > 0 && selectableFiltered.every((s) => selectedServiceIds.includes(s.id))
  const someSelected = selectableFiltered.some((s) => selectedServiceIds.includes(s.id))

  const handleHeaderCheckbox = () => {
    if (allSelected) onClearAll()
    else onSelectAll()
  }

  return (
    <>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="flex flex-col px-6 py-6">
          <div className="flex flex-col gap-0">
            <h2 className="text-xl font-semibold">Select services</h2>
            <p className="text-sm text-muted-foreground">{selectedServiceIds.length} selected</p>
            <p className="mt-3 text-sm">Choose which services should use client-specific pricing on invoices and proposals.</p>
          </div>
          {skippedCount > 0 && (
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">
              <span className="shrink-0 mt-px">ℹ</span>
              <span>
                {skippedCount === 1
                  ? "1 service below can't be overridden — it uses team member rates."
                  : `${skippedCount} services below can't be overridden — they use team member rates.`}
              </span>
            </div>
          )}
          <div className="relative mt-4">
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="px-6 pb-6 -mt-2">
          <div className="rounded-xl border overflow-hidden">
          <table className="panel-table w-full table-fixed text-[14px]">
            <thead className="bg-background border-b">
              <tr>
                <th className="w-12 px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    className="table-checkbox"
                    checked={allSelected}
                    ref={(el) => { if (el) el.indeterminate = !allSelected && someSelected }}
                    onChange={handleHeaderCheckbox}
                  />
                </th>
                <th className="px-2 py-3 text-left text-[14px] font-semibold text-secondary-foreground">
                  <button className="flex items-center gap-1 hover:text-foreground" onClick={() => handleSort("name")}>
                    Service <DataTableSortIcon col="name" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="w-32 px-2 py-3 text-left text-[14px] font-semibold text-secondary-foreground">
                  <button className="flex items-center gap-1 hover:text-foreground" onClick={() => handleSort("category")}>
                    Category <DataTableSortIcon col="category" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="w-40 px-4 py-3 text-right text-[14px] font-semibold text-secondary-foreground">
                  <button className="flex items-center gap-1 justify-end w-full hover:text-foreground" onClick={() => handleSort("defaultRate")}>
                    Default price <DataTableSortIcon col="defaultRate" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((svc, i) => (
                <tr
                  key={svc.id}
                  data-state={selectedServiceIds.includes(svc.id) ? "selected" : undefined}
                  className={`cursor-pointer ${selectedServiceIds.includes(svc.id) ? "" : i % 2 === 1 ? "bg-muted/50" : ""}`}
                  onClick={() => onToggle(svc.id)}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="table-checkbox"
                      checked={selectedServiceIds.includes(svc.id)}
                      onChange={() => onToggle(svc.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="px-2 py-3">
                    <div className="font-medium truncate">{svc.name}</div>
                  </td>
                  <td className="w-32 px-2 py-3 text-muted-foreground truncate">{svc.category}</td>
                  <td className="w-32 px-4 py-3 text-right tabular-nums">
                    ${svc.defaultRate.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{svc.rateType === "Hour" ? "/hr" : ""}
                  </td>
                </tr>
              ))}
              {teamRateServices.map((svc) => (
                <tr key={svc.id} className="cursor-not-allowed opacity-50">
                  <td className="px-4 py-3">
                    <input type="checkbox" className="table-checkbox" disabled />
                  </td>
                  <td className="px-2 py-3">
                    <div className="font-medium truncate">{svc.name}</div>
                  </td>
                  <td className="w-32 px-2 py-3 text-muted-foreground truncate">{svc.category}</td>
                  <td className="w-32 px-4 py-3 text-right">
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      <IconLock className="size-3 shrink-0" />
                      Team rates
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t px-6 py-4">
        <Button size="xl" className="px-5" disabled={selectedServiceIds.length === 0} onClick={onContinue}>
          Continue
        </Button>
      </div>
    </>
  )
}

// ─── Step 2: Price adjustment ───────────────────────────────────────────────────────

type RateMap = Record<string, Record<string, string>> // serviceId → accountId → rateInput

function Step2({
  services,
  accounts,
  rates,
  onRateChange,
  onBack,
  onSave,
}: {
  services: ServiceItem[]
  accounts: Account[]
  rates: RateMap
  onRateChange: (serviceId: string, accountId: string, value: string) => void
  onBack: () => void
  onSave: () => void
}) {
  const [search, setSearch] = React.useState("")
  const [adjustment, setAdjustment] = React.useState("")
  const [rounding, setRounding] = React.useState<Rounding>(0)
  const [pinned, setPinned] = React.useState<Set<string>>(new Set())
  const [collapsed, setCollapsed] = React.useState<Set<string>>(new Set())

  const toggleCollapsed = (accId: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev)
      next.has(accId) ? next.delete(accId) : next.add(accId)
      return next
    })

  // Freeze baseline on mount — calculator always computes relative to this
  const baseRates = React.useRef<Record<string, Record<string, number>>>({})
  React.useEffect(() => {
    const base: Record<string, Record<string, number>> = {}
    for (const svc of services) {
      base[svc.id] = {}
      for (const acc of accounts) {
        const raw = rates[svc.id]?.[acc.id] ?? ""
        const parsed = parseFloat(raw)
        base[svc.id][acc.id] = !isNaN(parsed) && raw !== "" ? parsed : svc.defaultRate
      }
    }
    baseRates.current = base
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Apply calculator to all non-pinned cells whenever adjustment or rounding changes
  React.useEffect(() => {
    const pct = parseFloat(adjustment)
    for (const svc of services) {
      for (const acc of accounts) {
        const key = `${svc.id}:${acc.id}`
        if (pinned.has(key)) continue
        if (adjustment === "" || isNaN(pct)) {
          // Reset to baseline: show existing override if there was one, else empty
          const existingOverride = svc.clientOverridesList.find((o) => o.accountId === acc.id)
          const base = baseRates.current[svc.id]?.[acc.id]
          onRateChange(svc.id, acc.id, existingOverride && base != null ? String(base) : "")
        } else {
          const base = baseRates.current[svc.id]?.[acc.id] ?? svc.defaultRate
          const newRate = applyAdjustment(base, pct, rounding)
          onRateChange(svc.id, acc.id, String(newRate))
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adjustment, rounding])

  const handleManualChange = (serviceId: string, accountId: string, value: string) => {
    const key = `${serviceId}:${accountId}`
    setPinned((prev) => {
      const next = new Set(prev)
      if (value !== "") next.add(key)
      else next.delete(key) // cleared → unpin, let calculator take over
      return next
    })
    onRateChange(serviceId, accountId, value)
  }

  const filtered = accounts.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div className="flex flex-1 min-h-0 flex-col gap-4 overflow-y-auto px-6 py-6">
        <div className="flex flex-col gap-0">
          <h2 className="text-xl font-semibold">Price adjustment</h2>
          <p className="text-sm text-muted-foreground">
            {services.length} {services.length === 1 ? "service" : "services"} · {accounts.length} {accounts.length === 1 ? "account" : "accounts"}
          </p>
        </div>

        <PriceAdjustmentCalculator
          adjustment={adjustment}
          setAdjustment={setAdjustment}
          rounding={rounding}
          setRounding={setRounding}
          autoFocus={true}
        />

        <div className="relative">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search clients" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="flex flex-col gap-6">
          {filtered.map((acc) => {
            const isCollapsed = collapsed.has(acc.id)
            return (
            <div key={acc.id} className="flex flex-col gap-0 overflow-hidden rounded-xl border">
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-3 text-left hover:bg-accent/50"
                onClick={() => toggleCollapsed(acc.id)}
              >
                <IconChevronDown
                  className="size-4 shrink-0 text-muted-foreground transition-transform duration-200"
                  style={{ transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)" }}
                />
                <span className="text-sm font-semibold">{acc.name}</span>
              </button>
              <div
                style={{
                  display: "grid",
                  gridTemplateRows: isCollapsed ? "0fr" : "1fr",
                  transition: "grid-template-rows 200ms ease",
                }}
              >
              <div className="overflow-hidden">
              <div className="shrink-0 border-t">
                <table className="panel-table w-full text-[14px]">
                  <thead className="border-b bg-background">
                    <tr>
                      <th className="px-4 py-3 text-left text-[13px] font-semibold text-secondary-foreground">Service</th>
                      <th className="w-52 px-4 py-3 text-right text-[13px] font-semibold text-secondary-foreground">Client override</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((svc, i) => {
                      const key = `${svc.id}:${acc.id}`
                      const isPinned = pinned.has(key)
                      const inputVal = rates[svc.id]?.[acc.id] ?? ""
                      const parsed = parseFloat(inputVal)
                      const existingOverride = svc.clientOverridesList.find((o) => o.accountId === acc.id)
                      const oldPrice = existingOverride?.rate ?? svc.defaultRate
                      const fmtOld = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${svc.rateType === "Hour" ? "/hr" : ""}`
                      const pct = inputVal !== "" && oldPrice > 0 && !isNaN(parsed)
                        ? Math.round(((parsed - oldPrice) / oldPrice) * 100)
                        : null

                      return (
                        <tr key={svc.id} className={i % 2 === 1 ? "bg-workspace" : ""}>
                          <td className="px-4 py-2.5">
                            <div className="font-medium truncate">{svc.name}</div>
                            {svc.description && (
                              <div className="text-xs text-muted-foreground truncate">{svc.description}</div>
                            )}
                          </td>
                          <td className="w-52 px-4 py-2">
                            <div className="flex items-center justify-end gap-2">
                              {inputVal === "" ? null : !isNaN(parsed) && parsed === oldPrice ? null : (
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
                                value={inputVal}
                                onChange={(v) => handleManualChange(svc.id, acc.id, v)}
                                placeholder={svc.defaultRate > 0 ? svc.defaultRate.toFixed(2) : "0.00"}
                                suffix={svc.rateType === "Hour" ? "/hr" : undefined}
                                className={`w-28 ${isPinned ? "ring-1 ring-primary/40" : ""}`}
                              />
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              </div>
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
        <Button size="xl" className="px-5" onClick={onSave}>Apply overrides</Button>
      </div>
    </>
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
        initial[svcId][acc.id] = (existing && existing.rate > 0) ? String(existing.rate) : ""
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

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) handleClose() }}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0" showCloseButton={false}>
        {/* Header */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b bg-muted/40 px-4">
          <span className="text-xl font-semibold">Set client overrides</span>
          <Button size="icon-xl" variant="ghost" onClick={handleClose}>
            <IconX className="size-4" />
          </Button>
        </div>

        <Stepper step={step} />

        {step === 1 ? (
          <Step1
            services={services.filter((s) => !s.archived)}
            selectedServiceIds={selectedServiceIds}
            onToggle={handleToggleService}
            onSelectAll={() => setSelectedServiceIds(services.filter((s) => !s.archived && !rateGroups.some((g) => !g.archived && g.services.some((sv) => sv.serviceId === s.id))).map((s) => s.id))}
            onClearAll={() => setSelectedServiceIds([])}
            onContinue={handleContinue}
          />
        ) : (
          <Step2
            services={selectedServices}
            accounts={selectedAccounts}
            rates={rates}
            onRateChange={handleRateChange}
            onBack={() => setStep(1)}
            onSave={handleSave}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}
