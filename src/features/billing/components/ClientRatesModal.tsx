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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ServiceItem, ClientOverride } from "@/mock/services"
import { accounts } from "@/mock/accounts"

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
          <DialogTitle>Client prices — {service?.name}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-1">
          {/* Default rate reference */}
          <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 text-sm">
            <span className="text-muted-foreground">Default rate</span>
            <span className="font-medium">{service ? fmt(service.defaultRate, service.rateType) : "—"}</span>
          </div>

          {/* Overrides list */}
          {overrides.map((o) => {
            const pct = service && service.defaultRate > 0
              ? ((o.rate - service.defaultRate) / service.defaultRate) * 100
              : null
            return (
              <div key={o.accountId} className="flex items-center gap-3">
                <span className="flex-1 truncate text-sm">{o.accountName}</span>
                {pct !== null && (
                  <span className="inline-flex w-14 shrink-0 justify-center">
                    {Math.round(pct) !== 0 && (
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        pct > 0
                          ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                      }`}>
                        {pct > 0 ? "+" : ""}{Math.round(pct)}%
                      </span>
                    )}
                  </span>
                )}
                <div className="relative w-28 shrink-0">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                  <Input
                    className={`h-8 pl-6 text-sm ${service?.rateType === "Hour" ? "pr-8" : ""}`}
                    value={o.rateInput}
                    onChange={(e) => handleRateChange(o.accountId, e.target.value)}
                    placeholder="0.00"
                  />
                  {service?.rateType === "Hour" && (
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">/hr</span>
                  )}
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => handleRemove(o.accountId)}
                >
                  <IconTrash className="size-3.5" />
                </Button>
              </div>
            )
          })}

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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
