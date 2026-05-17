import * as React from "react"
import { IconArrowLeft, IconSearch } from "@tabler/icons-react"

import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { accounts } from "@/mock/accounts"

type Props = {
  open: boolean
  onClose: () => void
  availableAccounts: typeof accounts
  onAdd: (ids: string[]) => void
}

export function ChooseClientPanel({ open, onClose, availableAccounts, onAdd }: Props) {
  const [selected, setSelected] = React.useState<string[]>([])
  const [search, setSearch] = React.useState("")

  React.useEffect(() => {
    if (open) { setSelected([]); setSearch("") }
  }, [open])

  const filtered = availableAccounts
    .filter((a) => a.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name))

  const toggle = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])

  const handleAdd = () => {
    onAdd(selected)
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <SheetContent side="right" className="flex w-[360px] flex-col gap-0 p-0" showCloseButton={false}>

        {/* Header */}
        <div className="flex h-14 shrink-0 items-center gap-3 border-b bg-muted/40 px-4">
          <Button size="icon-xl" variant="ghost" onClick={onClose}>
            <IconArrowLeft className="size-4" />
          </Button>
          <div className="flex flex-col">
            <span className="text-base font-semibold leading-tight">Choose client</span>
            {selected.length > 0 && (
              <span className="text-xs text-muted-foreground">{selected.length} selected</span>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="shrink-0 border-b px-4 py-3">
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

        {/* List */}
        <div className="flex-1 overflow-y-auto py-1">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No clients found</p>
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

        {/* Footer */}
        <div className="flex shrink-0 items-center gap-3 border-t px-4 py-4">
          <Button size="xl" disabled={selected.length === 0} onClick={handleAdd}>
            Add{selected.length > 0 ? ` ${selected.length}` : ""} client{selected.length !== 1 ? "s" : ""}
          </Button>
          <Button size="xl" variant="outline" onClick={onClose}>Cancel</Button>
        </div>

      </SheetContent>
    </Sheet>
  )
}
