import * as React from "react"
import { IconSearch } from "@tabler/icons-react"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { accounts } from "@/mock/accounts"

type Props = {
  open: boolean
  onClose: () => void
  availableAccounts: typeof accounts
  onAdd: (ids: string[]) => void
}

export function AddClientModal({ open, onClose, availableAccounts, onAdd }: Props) {
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

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Choose client</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
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
          <div className="max-h-64 overflow-y-auto rounded-xl border">
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
        </div>
        <DialogFooter>
          <Button size="xl" variant="outline" onClick={onClose}>Cancel</Button>
          <Button size="xl" disabled={selected.length === 0} onClick={() => { onAdd(selected); onClose() }}>
            Add{selected.length > 0 ? ` ${selected.length}` : ""} client{selected.length !== 1 ? "s" : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
