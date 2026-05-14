import * as React from "react"
import { IconX, IconTrash, IconChevronDown, IconChevronRight } from "@tabler/icons-react"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ServiceItem, RateType, ClientOverride } from "@/mock/services"
import { accounts } from "@/mock/accounts"
import { rateGroups } from "@/mock/data/team-member-rates"

const CATEGORIES = ["Advisory", "Bookkeeping", "Payroll", "Tax"]
const MAX_DESCRIPTION = 4000

type EditServicePanelProps = {
  service: ServiceItem | null
  onClose: () => void
  onSave: (updated: ServiceItem) => void
}

export function EditServicePanel({ service, onClose, onSave }: EditServicePanelProps) {
  const [name, setName] = React.useState("")
  const [category, setCategory] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [rate, setRate] = React.useState("")
  const [rateType, setRateType] = React.useState<RateType>("")
  const [tax, setTax] = React.useState(false)
  const [updateTemplates, setUpdateTemplates] = React.useState(false)
  const [overridesOpen, setOverridesOpen] = React.useState(false)
  const [teamRatesOpen, setTeamRatesOpen] = React.useState(false)
  const [originalRate, setOriginalRate] = React.useState("")
  const [overrides, setOverrides] = React.useState<(ClientOverride & { rateInput: string })[]>([])

  // Sync form when service changes
  React.useEffect(() => {
    if (service) {
      setName(service.name)
      setCategory(service.category)
      setDescription(service.description)
      const r = service.defaultRate > 0 ? String(service.defaultRate) : ""
      setRate(r)
      setOriginalRate(r)
      setRateType(service.rateType)
      setTax(false)
      setUpdateTemplates(false)
      setOverrides(service.clientOverridesList.map((o) => ({ ...o, rateInput: String(o.rate) })))
      setOverridesOpen(false)
    }
  }, [service])

  const rateChanged = rate !== originalRate

  const usedAccountIds = overrides.map((o) => o.accountId)
  const availableAccounts = accounts.filter((a) => !usedAccountIds.includes(a.id))

  const handleSelectAccount = (accountId: string) => {
    const account = accounts.find((a) => a.id === accountId)
    if (!account) return
    const defaultRate = parseFloat(rate) || 0
    setOverrides((prev) => [...prev, {
      accountId: account.id,
      accountName: account.name,
      rate: defaultRate,
      rateInput: defaultRate > 0 ? String(defaultRate) : "",
    }])
  }

  const handleRemoveOverride = (accountId: string) => {
    setOverrides((prev) => prev.filter((o) => o.accountId !== accountId))
  }

  const handleOverrideRateChange = (accountId: string, value: string) => {
    setOverrides((prev) => prev.map((o) =>
      o.accountId === accountId ? { ...o, rateInput: value, rate: parseFloat(value) || 0 } : o
    ))
  }

  return (
    <Sheet open={!!service} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0"
        showCloseButton={false}
      >
        {/* Header */}
        <SheetHeader className="h-14 shrink-0 flex-row items-center justify-between border-b bg-muted/40 px-4 py-0">
          <SheetTitle className="text-xl">Edit service</SheetTitle>
          <Button size="icon-xl" variant="ghost" onClick={onClose}>
            <IconX className="size-4" />
          </Button>
        </SheetHeader>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-5">
          {/* Row 1: Service name + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="svc-name">Service name</Label>
              <Input
                id="svc-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Category name</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="svc-desc">Description</Label>
            <div className="relative">
              <Textarea
                id="svc-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, MAX_DESCRIPTION))}
                className="resize-none pr-16"
                rows={3}
              />
              <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">
                {description.length}/{MAX_DESCRIPTION}
              </span>
            </div>
          </div>

          {/* Row 3: Rate + Rate type + Tax */}
          <div className="flex items-end gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="svc-rate">Rate</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                <Input
                  id="svc-rate"
                  className={`pl-6 w-40 text-right ${rateType === "Hour" ? "pr-8" : ""}`}
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  onFocus={(e) => { const t = e.target; requestAnimationFrame(() => { t.setSelectionRange(t.value.length, t.value.length) }) }}
                  placeholder="0.00"
                />
                {rateType === "Hour" && (
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">/hr</span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Rate type</Label>
              <Select value={rateType} onValueChange={(v) => setRateType(v as RateType)}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Select a rate type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hour">Hour</SelectItem>
                  <SelectItem value="Item">Item</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <Switch
                checked={tax}
                onCheckedChange={setTax}
                id="svc-tax"
              />
              <Label htmlFor="svc-tax">Tax</Label>
            </div>
          </div>

          {/* Client overrides + Team member rates group */}
          <div className="rounded-xl border bg-background">

            {/* Client overrides (collapsible) */}
            <div className="flex flex-col px-4 py-3">
            <button
              className="flex min-w-0 items-center gap-2 text-left"
              onClick={() => setOverridesOpen((o) => !o)}
            >
              {overridesOpen
                ? <IconChevronDown className="size-4 shrink-0 text-muted-foreground" />
                : <IconChevronRight className="size-4 shrink-0 text-muted-foreground" />
              }
              <span className="text-sm font-medium">Client overrides</span>
              {overrides.length > 0 && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {overrides.length}
                </span>
              )}
            </button>

            {/* Animated content */}
            <div
              style={{
                display: "grid",
                gridTemplateRows: overridesOpen ? "1fr" : "0fr",
                transition: "grid-template-rows 200ms ease",
              }}
            >
              <div className="overflow-hidden" style={{ minHeight: 0 }}><div className="flex flex-col gap-3 pt-3">
                {overrides.length === 0 && (
                  <p className="pl-6 text-sm text-muted-foreground">No client overrides set</p>
                )}

                {overrides.map((o) => {
                  const defaultRate = parseFloat(rate) || 0
                  const pct = defaultRate > 0 ? ((o.rate - defaultRate) / defaultRate) * 100 : null
                  const rounded = pct !== null ? Math.round(pct) : null
                  return (
                  <div key={o.accountId} className="flex items-center gap-3">
                    <span className="flex-1 truncate text-sm">{o.accountName}</span>
                    <span className="inline-flex w-14 shrink-0 justify-center">
                      {rounded !== null && rounded !== 0 && (
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          rounded > 0
                            ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                        }`}>
                          {rounded > 0 ? "+" : ""}{rounded}%
                        </span>
                      )}
                    </span>
                    <div className="relative w-28 shrink-0">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                      <Input
                        className={`pl-6 text-right text-sm ${rateType === "Hour" ? "pr-8" : ""}`}
                        value={o.rateInput}
                        onChange={(e) => handleOverrideRateChange(o.accountId, e.target.value)}
                        onFocus={(e) => { const t = e.target; requestAnimationFrame(() => { t.setSelectionRange(t.value.length, t.value.length) }) }}
                        placeholder="0.00"
                      />
                      {rateType === "Hour" && (
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">/hr</span>
                      )}
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveOverride(o.accountId)}
                    >
                      <IconTrash className="size-3.5" />
                    </Button>
                  </div>
                )})}

                {/* Persistent add row */}
                {availableAccounts.length > 0 && (
                  <Select value="" onValueChange={handleSelectAccount}>
                    <SelectTrigger className="h-8 text-sm text-muted-foreground">
                      <SelectValue placeholder="Add client…" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableAccounts.map((a) => (
                        <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div></div>
            </div>
            </div>

            {/* Team member rates (collapsible) */}
            {(() => {
              const teamEntries = rateGroups
                .filter((g) => !g.archived)
                .flatMap((g) => {
                  const svc = g.services.find((s) => s.serviceId === service?.id)
                  if (!svc) return []
                  return g.members.map((m) => ({ member: m, rate: svc.rate, rateType: service?.rateType ?? "", group: g.name }))
                })
              return (
                <div className="flex flex-col border-t px-4 py-3">
                  <button
                    className="flex min-w-0 items-center gap-2 text-left"
                    onClick={() => setTeamRatesOpen((o) => !o)}
                  >
                    {teamRatesOpen
                      ? <IconChevronDown className="size-4 shrink-0 text-muted-foreground" />
                      : <IconChevronRight className="size-4 shrink-0 text-muted-foreground" />
                    }
                    <span className="text-sm font-medium">Team member rates</span>
                    {teamEntries.length > 0 && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        {teamEntries.length}
                      </span>
                    )}
                  </button>
                  <div style={{ display: "grid", gridTemplateRows: teamRatesOpen ? "1fr" : "0fr", transition: "grid-template-rows 200ms ease" }}>
                    <div className="overflow-hidden" style={{ minHeight: 0 }}><div className="flex flex-col gap-2 pt-3">
                      {teamEntries.length === 0 ? (
                        <p className="pl-6 text-sm text-muted-foreground">No team member rates set</p>
                      ) : teamEntries.map((entry, i) => (
                        <div key={i} className="flex items-center gap-3 pl-2">
                          <span
                            className="inline-flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                            style={{ backgroundColor: entry.member.color }}
                            title={entry.member.name}
                          >
                            {entry.member.initials}
                          </span>
                          <span className="flex-1 truncate text-sm">{entry.member.name}</span>
                          <span className="text-xs text-muted-foreground">{entry.group}</span>
                          <span className="text-sm font-medium shrink-0">
                            ${entry.rate.toLocaleString("en-US", { minimumFractionDigits: 0 })}{entry.rateType === "Hour" ? "/hr" : ""}
                          </span>
                        </div>
                      ))}
                    </div></div>
                  </div>
                </div>
              )
            })()}

          </div>

          {/* Update templates checkbox */}
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              className="table-checkbox mt-0.5"
              checked={updateTemplates}
              onChange={(e) => setUpdateTemplates(e.target.checked)}
            />
            <div>
              <div className="text-sm font-medium">Update existing templates</div>
              <div className="text-sm text-muted-foreground">
                Existing invoice, recurring invoice, and proposal templates will reflect your changes
              </div>
            </div>
          </label>

          {/* Rate change info banner */}
          {rateChanged && (
            <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">
              <span className="shrink-0">ℹ</span>
              Your changes will apply to new invoices, proposals, and time entries
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t px-6 py-4">
          <Button size="xl" className="px-5" onClick={() => {
            if (!service) return
            const savedOverrides = overrides.map(({ rateInput: _, ...o }) => o)
            onSave({
              ...service,
              name,
              category,
              description,
              defaultRate: parseFloat(rate) || 0,
              rateType,
              clientOverridesList: savedOverrides,
              customRates: savedOverrides.length,
            })
            onClose()
          }}>Save</Button>
          <Button size="xl" className="px-5" variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
