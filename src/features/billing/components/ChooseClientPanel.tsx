import * as React from "react"
import { IconArrowLeft, IconSearch } from "@tabler/icons-react"
import { DataTableSortIcon, type SortDir } from "@/components/data-table/DataTableSortIcon"

import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { accounts as AccountsType } from "@/mock/accounts"

type Account = (typeof AccountsType)[number]

type Props = {
  open: boolean
  onClose: () => void
  availableAccounts: typeof AccountsType
  onAdd: (ids: string[]) => void
}

export function ChooseClientPanel({ open, onClose, availableAccounts, onAdd }: Props) {
  const [selected, setSelected] = React.useState<string[]>([])
  const [search, setSearch] = React.useState("")
  const [sortDir, setSortDir] = React.useState<SortDir>("asc")

  React.useEffect(() => {
    if (open) { setSelected([]); setSearch("") }
  }, [open])

  const filtered = availableAccounts
    .filter((a) => a.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name) * (sortDir === "asc" ? 1 : -1))

  const allSelected = filtered.length > 0 && filtered.every((a) => selected.includes(a.id))
  const someSelected = filtered.some((a) => selected.includes(a.id))

  const toggle = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])

  const handleHeaderCheckbox = () => {
    if (allSelected) setSelected([])
    else setSelected(filtered.map((a) => a.id))
  }

  const handleAdd = () => {
    onAdd(selected)
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <SheetContent side="right" className="flex flex-col gap-0 p-0" width={400} showCloseButton={false}>

        {/* Header */}
        <div className="flex h-14 shrink-0 items-center gap-2 border-b bg-muted/40 px-4">
          <Button size="icon-xl" variant="ghost" onClick={onClose}>
            <IconArrowLeft className="size-4" />
          </Button>
          <div className="flex flex-col">
            <span className="text-xl font-semibold leading-tight">Choose client</span>
            <span className="text-xs text-muted-foreground">{selected.length} selected</span>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex flex-col px-6 py-6">
            <div className="relative">
              <IconSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div className="px-6 pb-6 -mt-2">
            <div className="rounded-xl border overflow-hidden">
              <table className="panel-table w-full text-[14px]">
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
                      <button className="flex items-center gap-1 hover:text-foreground" onClick={() => setSortDir((d) => d === "asc" ? "desc" : "asc")}>
                        Client <DataTableSortIcon col="name" sortKey="name" sortDir={sortDir} />
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="py-8 text-center text-sm text-muted-foreground">No clients found</td>
                    </tr>
                  ) : filtered.map((acc, i) => (
                    <tr
                      key={acc.id}
                      data-state={selected.includes(acc.id) ? "selected" : undefined}
                      className={`cursor-pointer ${selected.includes(acc.id) ? "" : i % 2 === 1 ? "bg-muted/50" : ""}`}
                      onClick={() => toggle(acc.id)}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="table-checkbox"
                          checked={selected.includes(acc.id)}
                          onChange={() => toggle(acc.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="px-2 py-3 font-medium">{acc.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center gap-3 border-t px-6 py-4">
          <Button size="xl" className="px-5" disabled={selected.length === 0} onClick={handleAdd}>
            Add{selected.length > 0 ? ` ${selected.length}` : ""} client{selected.length !== 1 ? "s" : ""}
          </Button>
          <Button size="xl" variant="outline" className="px-5" onClick={onClose}>Cancel</Button>
        </div>

      </SheetContent>
    </Sheet>
  )
}
