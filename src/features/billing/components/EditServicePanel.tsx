import * as React from "react"
import { IconX, IconChevronDown, IconChevronRight, IconCirclePlus, IconSearch, IconTrash, IconCurrencyDollar, IconUsers } from "@tabler/icons-react"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CurrencyInput, CurrencyCell } from "./RateInputs"
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
import type { RateGroup } from "@/mock/data/team-member-rates"

// ─── AddClientModal ───────────────────────────────────────────────────────────

function AddClientModal({
  open,
  onClose,
  availableAccounts,
  onAdd,
}: {
  open: boolean
  onClose: () => void
  availableAccounts: typeof accounts
  onAdd: (ids: string[]) => void
}) {
  const [selected, setSelected] = React.useState<string[]>([])
  const [search, setSearch] = React.useState("")

  React.useEffect(() => {
    if (open) { setSelected([]); setSearch("") }
  }, [open])

  const toggle = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])

  const filtered = availableAccounts.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="flex max-w-sm flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b px-4 pb-3 pt-4">
          <DialogTitle>Choose client</DialogTitle>
        </DialogHeader>
        <div className="relative shrink-0 border-b px-3 py-2">
          <IconSearch className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>
        <div className="max-h-64 overflow-y-auto py-1">
          {filtered.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No clients found</p>
          ) : filtered.map((acc) => (
            <label key={acc.id} className="flex cursor-pointer items-center gap-3 px-4 py-2.5 hover:bg-accent">
              <input
                type="checkbox"
                className="table-checkbox shrink-0"
                checked={selected.includes(acc.id)}
                onChange={() => toggle(acc.id)}
              />
              <span className="text-sm">{acc.name}</span>
            </label>
          ))}
        </div>
        <div className="flex shrink-0 gap-3 border-t px-4 py-3">
          <Button
            size="xl"
            className="px-5"
            disabled={selected.length === 0}
            onClick={() => { onAdd(selected); onClose() }}
          >
            Add {selected.length > 0 ? selected.length : ""} client{selected.length !== 1 ? "s" : ""}
          </Button>
          <Button size="xl" className="px-5" variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const CATEGORIES = ["Advisory", "Bookkeeping", "Payroll", "Tax"]
const MAX_DESCRIPTION = 4000

type EditServicePanelProps = {
  service: ServiceItem | null
  onClose: () => void
  onSave: (updated: ServiceItem) => void
  rateGroups: RateGroup[]
  onRateGroupsChange: (groups: RateGroup[]) => void
}

export function EditServicePanel({ service, onClose, onSave, rateGroups, onRateGroupsChange }: EditServicePanelProps) {
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
  const [addClientOpen, setAddClientOpen] = React.useState(false)
  const [teamRateInputs, setTeamRateInputs] = React.useState<Record<string, string>>({})

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
      const inputs: Record<string, string> = {}
      rateGroups.filter((g) => !g.archived).forEach((g) => {
        const svc = g.services.find((s) => s.serviceId === service.id)
        if (svc) inputs[g.id] = String(svc.rate)
      })
      setTeamRateInputs(inputs)
    }
  }, [service])

  const rateChanged = rate !== originalRate

  const usedAccountIds = overrides.map((o) => o.accountId)
  const availableAccounts = accounts.filter((a) => !usedAccountIds.includes(a.id))

  const handleAddClients = (ids: string[]) => {
    const defaultRate = parseFloat(rate) || 0
    const newOverrides = ids.flatMap((accountId) => {
      const account = accounts.find((a) => a.id === accountId)
      if (!account) return []
      return [{
        accountId: account.id,
        accountName: account.name,
        rate: defaultRate,
        rateInput: defaultRate > 0 ? String(defaultRate) : "",
      }]
    })
    setOverrides((prev) => [...prev, ...newOverrides])
  }

  // Keep for backwards compat (used by Select if still present)
  const handleSelectAccount = (accountId: string) => handleAddClients([accountId])

  const handleRemoveOverride = (accountId: string) =>
    setOverrides((prev) => prev.filter((o) => o.accountId !== accountId))

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
        <SheetHeader className="h-14 shrink-0 flex-row items-center justify-between border-b bg-slate-50 px-4 py-0">
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
              <CurrencyInput
                value={rate}
                onChange={setRate}
                suffix={rateType === "Hour" ? "/hr" : undefined}
                className="w-40"
              />
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

          {/* Client overrides */}
          <div className="flex flex-col gap-3">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-base font-semibold">Client overrides</p>
                <span className="inline-flex items-center rounded-full bg-[#7C3AED] px-2 py-0.5 text-[10px] font-bold text-white">New</span>
              </div>
              <p className="text-sm text-muted-foreground">Set custom rates for specific clients</p>
            </div>
            <div className={`rounded-xl overflow-hidden ${overrides.length === 0 ? "bg-slate-50" : "border bg-background"}`}>
                  {overrides.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-6">
                      <IconCurrencyDollar className="size-8 text-muted-foreground/40" strokeWidth={1} />
                      <p className="text-sm text-muted-foreground">No client overrides set</p>
                      {availableAccounts.length > 0 && (
                        <Button variant="link" size="default" className="h-auto gap-2 p-0 text-primary hover:text-primary" onClick={() => setAddClientOpen(true)}>
                          <IconCirclePlus className="size-4" />
                          Add client
                        </Button>
                      )}
                    </div>
                  ) : (
                    <table className="panel-table w-full text-[14px]">
                      <thead className="bg-background border-b">
                        <tr className="h-12" style={{ color: "rgb(38,51,77)" }}>
                          <th className="px-4 text-left text-[14px] font-semibold">Client</th>
                          <th className="w-px" />
                          <th className="w-px min-w-[100px] pr-[38px] text-right text-[14px] font-semibold">Override</th>
                          <th className="w-px" />
                        </tr>
                      </thead>
                      <tbody>
                        {overrides.map((o, i) => {
                          const defaultRate = parseFloat(rate) || 0
                          const parsed = parseFloat(o.rateInput)
                          const hasValue = o.rateInput.trim() !== "" && !isNaN(parsed)
                          const pct = hasValue && defaultRate > 0
                            ? Math.round(((parsed - defaultRate) / defaultRate) * 100)
                            : null
                          const fmtDefault = `$${defaultRate.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${rateType === "Hour" ? "/hr" : ""}`

                          return (
                            <tr key={o.accountId} className={`h-10 text-[14px] ${i % 2 === 1 ? "bg-workspace" : ""}`}>
                              <td className="px-4 text-sm">{o.accountName}</td>
                              <td className="w-px px-2 text-center whitespace-nowrap">
                                {hasValue && pct !== null && pct !== 0 && (
                                  <span className={`rounded-full px-1.5 py-0.5 text-xs font-medium ${
                                    pct > 0
                                      ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                                      : "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                                  }`}>
                                    {pct > 0 ? "+" : ""}{pct}%
                                  </span>
                                )}
                              </td>
                              <td className="w-px min-w-[100px] p-0">
                                <CurrencyCell
                                  value={o.rateInput}
                                  onChange={(v) => handleOverrideRateChange(o.accountId, v)}
                                  placeholder={defaultRate > 0 ? defaultRate.toFixed(2) : "0.00"}
                                  suffix={rateType === "Hour" ? "/hr" : undefined}
                                  className="w-full"
                                />
                              </td>
                              <td className="w-px px-2">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="size-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => handleRemoveOverride(o.accountId)}
                                >
                                  <IconTrash className="size-4" />
                                </Button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  )}
            </div>
            {overrides.length > 0 && availableAccounts.length > 0 && (
              <Button
                type="button"
                variant="link"
                size="default"
                className="h-auto gap-2 p-0 text-primary hover:text-primary self-start"
                onClick={() => setAddClientOpen(true)}
              >
                <IconCirclePlus className="size-4" />
                Add client
              </Button>
            )}
          </div>

          {/* Team member rates */}
          {(() => {
            const teamEntries = rateGroups
              .filter((g) => !g.archived)
              .flatMap((g) => {
                const svc = g.services.find((s) => s.serviceId === service?.id)
                if (!svc) return []
                return [{ group: g.id, groupName: g.name, members: g.members, rate: svc.rate, rateType: service?.rateType ?? "" }]
              })
            return (
              <div className="flex flex-col gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-base font-semibold">Team member rates</p>
                    <span className="inline-flex items-center rounded-full bg-[#7C3AED] px-2 py-0.5 text-[10px] font-bold text-white">New</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Rates applied based on team member billing groups</p>
                </div>
                <div className={`rounded-xl overflow-hidden ${teamEntries.length === 0 ? "bg-slate-50" : "border bg-background"}`}>
                  {teamEntries.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-6">
                      <IconUsers className="size-8 text-muted-foreground/40" strokeWidth={1} />
                      <p className="text-sm text-muted-foreground">No team member rates set</p>
                    </div>
                  ) : (
                    <table className="panel-table w-full text-[14px]">
                      <thead className="bg-background border-b">
                        <tr className="h-12" style={{ color: "rgb(38,51,77)" }}>
                          <th className="px-4 text-left text-[14px] font-semibold">Team name</th>
                          <th className="w-px px-4 text-left text-[14px] font-semibold whitespace-nowrap">Team members</th>
                          <th className="w-px min-w-[100px] pr-[38px] text-right text-[14px] font-semibold whitespace-nowrap">Team member rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teamEntries.map((entry, i) => (
                          <tr key={i} className={`h-10 text-[14px] ${i % 2 === 1 ? "bg-workspace" : ""}`}>
                            <td className="px-4 text-sm">{entry.groupName}</td>
                            <td className="w-px px-4">
                              <div className="flex items-center">
                                {entry.members.map((m, mi) => (
                                  <span
                                    key={m.name}
                                    className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-background text-[10px] font-bold text-white"
                                    style={{ backgroundColor: m.color, marginLeft: mi > 0 ? "-8px" : 0 }}
                                    title={m.name}
                                  >
                                    {m.initials}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="w-px min-w-[100px] p-0">
                              <CurrencyCell
                                value={teamRateInputs[entry.group] ?? String(entry.rate)}
                                onChange={(v) => setTeamRateInputs((prev) => ({ ...prev, [entry.group]: v }))}
                                suffix={entry.rateType === "Hour" ? "/hr" : undefined}
                                className="w-full"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )
          })()}

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
            const savedOverrides = overrides
              .filter((o) => o.rateInput.trim() !== "" && !isNaN(parseFloat(o.rateInput)))
              .map(({ rateInput: _, ...o }) => o)
            // Save team member rates
            const updatedRateGroups = rateGroups.map((g) => ({
              ...g,
              services: g.services.map((s) => {
                if (s.serviceId !== service.id) return s
                const newRate = parseFloat(teamRateInputs[g.id] ?? "")
                return isNaN(newRate) ? s : { ...s, rate: newRate }
              }),
            }))
            onRateGroupsChange(updatedRateGroups)
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

        <AddClientModal
          open={addClientOpen}
          onClose={() => setAddClientOpen(false)}
          availableAccounts={availableAccounts}
          onAdd={handleAddClients}
        />
      </SheetContent>
    </Sheet>
  )
}
