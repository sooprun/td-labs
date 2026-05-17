import * as React from "react"
import { IconX, IconChevronRight, IconChevronDown } from "@tabler/icons-react"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import type { ServiceItem } from "@/mock/services"
import { CurrencyInput } from "./RateInputs"

type Props = {
  open: boolean
  accountId: string
  accountName: string
  services: ServiceItem[]
  onClose: () => void
  onSave: (updated: ServiceItem[]) => void
}

type RowState = {
  selected: boolean
  rateInput: string
}

// ─── Category group ───────────────────────────────────────────────────────────

function CategoryGroup({
  category,
  services,
  rows,
  onToggle,
  onRateChange,
}: {
  category: string
  services: ServiceItem[]
  rows: Record<string, RowState>
  onToggle: (id: string) => void
  onRateChange: (id: string, value: string) => void
}) {
  const [open, setOpen] = React.useState(true)

  const handleToggle = (id: string) => {
    onToggle(id)
  }

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
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {category}
        </span>
      </button>

      {open && (
        <div className="flex flex-col">
          {services.map((svc) => {
            const row = rows[svc.id]
            return (
              <label
                key={svc.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-1 py-2.5 hover:bg-muted/40"
              >
                <input
                  type="checkbox"
                  className="table-checkbox shrink-0"
                  checked={row.selected}
                  onChange={() => handleToggle(svc.id)}
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
                <CurrencyInput
                  value={row.rateInput}
                  onChange={(v) => onRateChange(svc.id, v)}
                  suffix={svc.rateType === "Hour" ? "/hr" : undefined}
                  className="w-28"
                />
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Panel ────────────────────────────────────────────────────────────────────

export function AddCustomRatePanel({ open, accountId, accountName, services, onClose, onSave }: Props) {
  // Only show services that don't already have an override for this account
  const available = services.filter(
    (s) => !s.clientOverridesList.some((o) => o.accountId === accountId)
  )

  const [rows, setRows] = React.useState<Record<string, RowState>>({})

  // Reset when panel opens
  React.useEffect(() => {
    if (open) {
      const initial: Record<string, RowState> = {}
      available.forEach((s) => {
        initial[s.id] = { selected: false, rateInput: s.defaultRate > 0 ? String(s.defaultRate) : "" }
      })
      setRows(initial)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const handleToggle = (id: string) => {
    setRows((prev) => ({ ...prev, [id]: { ...prev[id], selected: !prev[id].selected } }))
  }

  const handleRateChange = (id: string, value: string) => {
    setRows((prev) => ({ ...prev, [id]: { ...prev[id], rateInput: value } }))
  }

  const selectedCount = Object.values(rows).filter((r) => r.selected).length
  const canSave = selectedCount > 0 && Object.entries(rows)
    .filter(([, r]) => r.selected)
    .every(([, r]) => r.rateInput !== "" && !isNaN(parseFloat(r.rateInput)))

  const handleSave = () => {
    const updated = services.map((s) => {
      const row = rows[s.id]
      if (!row?.selected) return s
      return {
        ...s,
        clientOverridesList: [
          ...s.clientOverridesList,
          { accountId, accountName, rate: parseFloat(row.rateInput) || 0 },
        ],
        customRates: s.clientOverridesList.length + 1,
      }
    })
    onSave(updated)
    onClose()
  }

  // Group by category
  const categories = Array.from(new Set(available.map((s) => s.category))).sort()

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <SheetContent side="right" className="flex flex-col gap-0 p-0" showCloseButton={false}>
        {/* Header */}
        <SheetHeader className="h-14 shrink-0 flex-row items-center justify-between border-b bg-muted/40 px-4 py-0">
          <SheetTitle className="text-base">Set client overrides</SheetTitle>
          <Button size="icon-xl" variant="ghost" onClick={onClose}>
            <IconX className="size-4" />
          </Button>
        </SheetHeader>

        {/* Subheader */}
        <div className="border-b px-6 py-3">
          <p className="text-sm text-muted-foreground">
            Choose which services to set client overrides for. <span className="font-medium text-foreground">{accountName}</span>'s default rates are shown for reference.
          </p>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-6 py-4">
          {available.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              All services already have a client override for this client.
            </p>
          ) : (
            categories.map((cat) => (
              <CategoryGroup
                key={cat}
                category={cat}
                services={available.filter((s) => s.category === cat)}
                rows={rows}
                onToggle={handleToggle}
                onRateChange={handleRateChange}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 border-t px-6 py-4">
          <Button size="xl" disabled={!canSave} onClick={handleSave}>
            {selectedCount > 0 ? `Set ${selectedCount} client override${selectedCount === 1 ? "" : "s"}` : "Set client overrides"}
          </Button>
          <Button size="xl" variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
