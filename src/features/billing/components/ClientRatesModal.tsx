import * as React from "react"
import { IconTrash, IconCirclePlus, IconSearch, IconCurrencyDollar, IconInfoCircle } from "@tabler/icons-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { ServiceItem, ClientOverride } from "@/mock/services"
import { accounts } from "@/mock/accounts"
import { CurrencyCell } from "./RateInputs"

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
    if (!open) { setSelected([]); setSearch("") }
  }, [open])

  const filtered = availableAccounts
    .filter((a) => a.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name))

  const toggle = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="flex max-w-sm flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b px-4 pb-3 pt-4">
          <DialogTitle>Choose client</DialogTitle>
        </DialogHeader>
        <div className="relative shrink-0 border-b px-3 py-2">
          <IconSearch className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} autoFocus />
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
          <Button size="xl" className="px-5" disabled={selected.length === 0} onClick={() => { onAdd(selected); onClose() }}>
            Add {selected.length > 0 ? selected.length : ""} client{selected.length !== 1 ? "s" : ""}
          </Button>
          <Button size="xl" variant="outline" className="px-5" onClick={onClose}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── ClientRatesModal ─────────────────────────────────────────────────────────

type Props = {
  service: ServiceItem | null
  onClose: () => void
  onSave: (updated: ServiceItem) => void
}

type DraftOverride = ClientOverride & { rateInput: string }

export function ClientRatesModal({ service, onClose, onSave }: Props) {
  const [overrides, setOverrides] = React.useState<DraftOverride[]>([])
  const [addClientOpen, setAddClientOpen] = React.useState(false)

  React.useEffect(() => {
    if (service) {
      setOverrides(service.clientOverridesList.map((o) => ({ ...o, rateInput: String(o.rate) })))
    }
  }, [service])

  const usedAccountIds = overrides.map((o) => o.accountId)
  const availableAccounts = accounts.filter((a) => !usedAccountIds.includes(a.id))

  const handleAdd = (ids: string[]) => {
    const defaultRate = service?.defaultRate ?? 0
    const newOverrides = ids.flatMap((accountId) => {
      const account = accounts.find((a) => a.id === accountId)
      if (!account) return []
      return [{ accountId: account.id, accountName: account.name, rate: defaultRate, rateInput: defaultRate > 0 ? String(defaultRate) : "" }]
    })
    setOverrides((prev) => [...prev, ...newOverrides])
  }

  const handleRemove = (accountId: string) => {
    setOverrides((prev) => prev.filter((o) => o.accountId !== accountId))
  }

  const handleRateChange = (accountId: string, value: string) => {
    setOverrides((prev) => prev.map((o) =>
      o.accountId === accountId ? { ...o, rateInput: value, rate: parseFloat(value) || 0 } : o
    ))
  }

  const handleSave = () => {
    if (!service) return
    const saved = overrides
      .filter((o) => o.rateInput.trim() !== "" && !isNaN(parseFloat(o.rateInput)))
      .map(({ rateInput: _, ...o }) => o)
    onSave({ ...service, clientOverridesList: saved, customRates: saved.length })
    onClose()
  }

  return (
    <>
      <Dialog open={!!service} onOpenChange={(o) => { if (!o) onClose() }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Client overrides — {service?.name}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-3">
            {overrides.length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-xl bg-slate-50 py-6">
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
              <>
                <div className="rounded-xl overflow-hidden border bg-background">
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
                        const defaultRate = service?.defaultRate ?? 0
                        const parsed = parseFloat(o.rateInput)
                        const hasValue = o.rateInput.trim() !== "" && !isNaN(parsed)
                        const pct = hasValue && defaultRate > 0
                          ? Math.round(((parsed - defaultRate) / defaultRate) * 100)
                          : null
                        return (
                          <tr key={o.accountId} className={`h-10 text-[14px] ${i % 2 === 1 ? "bg-workspace" : ""}`}>
                            <td className="px-4 text-sm">{o.accountName}</td>
                            <td className="w-px px-2 text-right whitespace-nowrap">
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
                                onChange={(v) => handleRateChange(o.accountId, v)}
                                placeholder={defaultRate > 0 ? defaultRate.toFixed(2) : "0.00"}
                                suffix={service?.rateType === "Hour" ? "/hr" : undefined}
                                className="w-full"
                              />
                            </td>
                            <td className="w-px px-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleRemove(o.accountId)}
                              >
                                <IconTrash className="size-4" />
                              </Button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                {availableAccounts.length > 0 && (
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
              </>
            )}
          </div>

          <DialogFooter>
            <Button size="xl" variant="outline" onClick={onClose}>Cancel</Button>
            <Button size="xl" onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddClientModal
        open={addClientOpen}
        onClose={() => setAddClientOpen(false)}
        availableAccounts={availableAccounts}
        onAdd={handleAdd}
      />
    </>
  )
}
