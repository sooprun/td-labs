import * as React from "react"
import {
  IconDotsVertical,
  IconSettings,
  IconReceiptDollar,
} from "@tabler/icons-react"

import { PageHeader, PageLayout } from "@/components/page/PageLayout"
import { StatusTabs } from "@/components/page/StatusTabs"
import {
  DataTableToolbarGroup,
  DataTableToolbarSlot,
  DataTableToolbarSpacer,
} from "@/components/data-table/DataTableToolbar"
import { Button } from "@/components/ui/button"
import { DataTableSortIcon, type SortDir } from "@/components/data-table/DataTableSortIcon"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { protoAction } from "@/lib/proto"
import { toast } from "sonner"
import type { ServiceItem } from "@/mock/services"
import { ServicesBulkActionsBar } from "@/features/billing/components/ServicesBulkActionsBar"
import { EditServicePanel } from "@/features/billing/components/EditServicePanel"
import { BulkUpdateRatesPanel } from "@/features/billing/components/BulkUpdateRatesPanel"

// ─── Tabs ────────────────────────────────────────────────────────────────────

type TopTab = "Service items" | "Team member custom rates"

function TopTabs({
  active,
  onChange,
}: {
  active: TopTab
  onChange: (tab: TopTab) => void
}) {
  return (
    <div className="flex border-b">
      {(["Service items", "Team member custom rates"] as TopTab[]).map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`flex items-center gap-2 border-b-2 px-1 pb-3 pt-1 text-sm font-medium mr-6 transition-colors ${
            active === tab
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          {tab}
          {tab === "Team member custom rates" && (
            <span className="inline-flex items-center rounded-full bg-[#7C3AED] px-2 py-0.5 text-[10px] font-bold text-white">
              New
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

// ─── Sort ────────────────────────────────────────────────────────────────────

type SortKey = keyof Pick<
  ServiceItem,
  "name" | "category" | "defaultRate" | "rateType"
>

// ─── Format ──────────────────────────────────────────────────────────────────

function formatRate(rate: number) {
  return rate === 0
    ? "$0.00"
    : `$${rate.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// ─── Page ────────────────────────────────────────────────────────────────────

type ServicesPageProps = {
  items: ServiceItem[]
  onItemsChange: (items: ServiceItem[]) => void
}

export function ServicesPage({ items, onItemsChange }: ServicesPageProps) {
  const [topTab, setTopTab] = React.useState<TopTab>("Service items")
  const [status, setStatus] = React.useState<"Active" | "Archived">("Active")
  const [sortKey, setSortKey] = React.useState<SortKey>("name")
  const [sortDir, setSortDir] = React.useState<SortDir>("asc")
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [editingService, setEditingService] = React.useState<ServiceItem | null>(null)
  const [bulkUpdateOpen, setBulkUpdateOpen] = React.useState(false)

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  const filtered = items
    .filter((s) => (status === "Active" ? !s.archived : s.archived))
    .sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv))
      return sortDir === "asc" ? cmp : -cmp
    })

  const allSelected = filtered.length > 0 && selectedIds.length === filtered.length

  const handleToggleAll = () => {
    setSelectedIds(allSelected ? [] : filtered.map((s) => s.id))
  }

  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  // Reset selection when switching tabs/status
  React.useEffect(() => { setSelectedIds([]) }, [topTab, status])

  return (
    <PageLayout>
      <PageHeader title="Services" />

      <TopTabs
        active={topTab}
        onChange={setTopTab}
      />

      {topTab === "Service items" ? (
        <div className="mt-5">
          {/* Toolbar */}
          {selectedIds.length > 0 ? (
            <ServicesBulkActionsBar
              selectedCount={selectedIds.length}
              onClearSelection={() => setSelectedIds([])}
              onSelectAll={() => setSelectedIds(filtered.map((s) => s.id))}
              onBulkUpdateRates={() => setBulkUpdateOpen(true)}
            />
          ) : (
            <DataTableToolbarSlot>
              <DataTableToolbarGroup className="shrink-0">
                <StatusTabs
                  tabs={[
                    { label: "Active", active: status === "Active", onClick: () => setStatus("Active") },
                    { label: "Archived", active: status === "Archived", onClick: () => setStatus("Archived") },
                  ]}
                />
              </DataTableToolbarGroup>
              <DataTableToolbarSpacer />
              <DataTableToolbarGroup className="shrink-0">
                <Button size="xl" onClick={protoAction("New service")}>New service</Button>
                <Button size="xl" variant="outline" onClick={protoAction("Copy from library")}>
                  Copy from library
                </Button>
                <Button size="xl" variant="outline" disabled>
                  Copy from QuickBooks
                </Button>
              </DataTableToolbarGroup>
            </DataTableToolbarSlot>
          )}

          {/* Table */}
          <div className="table-striped overflow-x-auto rounded-lg border bg-background">
            <Table>
              <TableHeader className="sticky top-0 z-40 bg-background">
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      className="table-checkbox"
                      checked={allSelected}
                      onChange={handleToggleAll}
                    />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer select-none hover:text-foreground"
                    onClick={() => handleSort("name")}
                  >
                    <span className="inline-flex items-center">
                      Name
                      <DataTableSortIcon col="name" sortKey={sortKey} sortDir={sortDir} />
                    </span>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer select-none hover:text-foreground"
                    onClick={() => handleSort("category")}
                  >
                    <span className="inline-flex items-center">
                      Category
                      <DataTableSortIcon col="category" sortKey={sortKey} sortDir={sortDir} />
                    </span>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer select-none hover:text-foreground"
                    onClick={() => handleSort("defaultRate")}
                  >
                    <span className="inline-flex items-center">
                      Default rate
                      <DataTableSortIcon col="defaultRate" sortKey={sortKey} sortDir={sortDir} />
                    </span>
                  </TableHead>
                  <TableHead>Custom rate</TableHead>
                  <TableHead
                    className="cursor-pointer select-none hover:text-foreground"
                    onClick={() => handleSort("rateType")}
                  >
                    <span className="inline-flex items-center">
                      Rate type
                      <DataTableSortIcon col="rateType" sortKey={sortKey} sortDir={sortDir} />
                    </span>
                  </TableHead>
                  <TableHead className="w-10 px-0">
                    <Button size="icon-xl" variant="ghost" onClick={protoAction("Table settings")}>
                      <IconSettings className="size-4" />
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((svc) => (
                  <TableRow
                    key={svc.id}
                    className="group"
                    data-state={selectedIds.includes(svc.id) ? "selected" : undefined}
                  >
                    <TableCell className="w-12">
                      <input
                        type="checkbox"
                        className="table-checkbox"
                        checked={selectedIds.includes(svc.id)}
                        onChange={() => handleToggle(svc.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <button
                        className="font-medium text-primary hover:underline"
                        onClick={() => setEditingService(svc)}
                      >
                        {svc.name}
                      </button>
                      {svc.description && (
                        <div className="text-xs text-muted-foreground">{svc.description}</div>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{svc.category}</TableCell>
                    <TableCell>{formatRate(svc.defaultRate)}</TableCell>
                    <TableCell>
                      {svc.customRates > 0 ? (
                        <button
                          className="text-primary hover:underline"
                          onClick={protoAction("View custom rates")}
                        >
                          {svc.customRates}
                        </button>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{svc.rateType}</TableCell>
                    <TableCell className="w-10 px-0">
                      <Button size="icon-xl" variant="ghost" onClick={protoAction("Service actions")}>
                        <IconDotsVertical className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center pb-24 pt-16 text-center">
          <div className="mx-auto flex max-w-lg flex-col items-center">
            <IconReceiptDollar className="mb-6 size-16 text-muted-foreground/40" strokeWidth={1.25} />
            <h2 className="text-xl font-semibold tracking-normal">
              Custom rates isn't part of this prototype yet
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Everything's working — this section just hasn't been built out. Try a different page.
            </p>
          </div>
        </div>
      )}

      <EditServicePanel
        service={editingService}
        onClose={() => setEditingService(null)}
        onSave={(updated) => {
          onItemsChange(items.map((s) => s.id === updated.id ? updated : s))
          setEditingService(null)
          toast.success(`"${updated.name}" saved`)
        }}
      />

      <BulkUpdateRatesPanel
        open={bulkUpdateOpen}
        services={items.filter((s) => selectedIds.includes(s.id))}
        onClose={() => setBulkUpdateOpen(false)}
        onConfirm={(updates) => {
          onItemsChange(items.map((svc) => {
            const upd = updates.find((u) => u.id === svc.id)
            return upd ? { ...svc, defaultRate: upd.defaultRate, clientOverridesList: upd.clientOverridesList } : svc
          }))
          setSelectedIds([])
          setBulkUpdateOpen(false)
        }}
      />
    </PageLayout>
  )
}
