import * as React from "react"
import { IconTrash } from "@tabler/icons-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ServiceItem, ClientOverride } from "@/mock/services"
import { accounts } from "@/mock/accounts"
import { CurrencyCell } from "./RateInputs"

type Props = {
  service: ServiceItem | null
  onClose: () => void
  onSave: (updated: ServiceItem) => void
}

type DraftOverride = ClientOverride & { rateInput: string }

function fmt(n: number, rateType?: string) {
  const amount = `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  return rateType === "Hour" ? `${amount}/hr` : amount
}

export function ClientRatesModal({ service, onClose, onSave }: Props) {
  const [overrides, setOverrides] = React.useState<DraftOverride[]>([])

  React.useEffect(() => {
    if (service) {
      setOverrides(service.clientOverridesList.map((o) => ({ ...o, rateInput: String(o.rate) })))
    }
  }, [service])

  const usedAccountIds = overrides.map((o) => o.accountId)
  const availableAccounts = accounts.filter((a) => !usedAccountIds.includes(a.id))

  const handleSelectAccount = (accountId: string) => {
    const account = accounts.find((a) => a.id === accountId)
    if (!account) return
    const defaultRate = service?.defaultRate ?? 0
    setOverrides((prev) => [...prev, {
      accountId: account.id,
      accountName: account.name,
      rate: defaultRate,
      rateInput: defaultRate > 0 ? String(defaultRate) : "",
    }])
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
    const saved = overrides.map(({ rateInput: _, ...o }) => o)
    onSave({ ...service, clientOverridesList: saved, customRates: saved.length })
  }

  return (
    <Dialog open={!!service} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Client overrides — {service?.name}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-1">
          {/* Default rate reference */}
          <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 text-sm">
            <span className="text-muted-foreground">Default rate</span>
            <span className="font-medium">{service ? fmt(service.defaultRate, service.rateType) : "—"}</span>
          </div>

          {/* Overrides table */}
          {overrides.length > 0 && (
            <div className="overflow-hidden rounded-xl border">
              <table className="w-full table-fixed text-sm">
                <thead className="border-b bg-background">
                  <tr>
                    <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-secondary-foreground">Account</th>
                    <th className="w-40 py-2.5 pr-3 text-right text-[13px] font-semibold text-secondary-foreground">Rate</th>
                    <th className="w-8" />
                  </tr>
                </thead>
                <tbody>
                  {overrides.map((o, i) => {
                    const pct = service && service.defaultRate > 0
                      ? Math.round(((o.rate - service.defaultRate) / service.defaultRate) * 100)
                      : null

                    return (
                      <tr key={o.accountId} className={`border-t ${i % 2 === 1 ? "bg-workspace" : ""}`}>
                        <td className="max-w-0 px-3 py-0">
                          <div className="flex items-center gap-2 py-2">
                            <span className="truncate">{o.accountName}</span>
                            {pct !== null && pct !== 0 && (
                              <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                                pct > 0
                                  ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                                  : "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                              }`}>
                                {pct > 0 ? "+" : ""}{pct}%
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="w-40 p-0">
                          <CurrencyCell
                            value={o.rateInput}
                            onChange={(v) => handleRateChange(o.accountId, v)}
                            suffix={service?.rateType === "Hour" ? "/hr" : undefined}
                          />
                        </td>
                        <td className="w-8 px-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-7 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemove(o.accountId)}
                          >
                            <IconTrash className="size-3.5" />
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Add client row */}
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
        </div>

        <DialogFooter>
          <Button size="xl" variant="outline" onClick={onClose}>Cancel</Button>
          <Button size="xl" onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
