import * as React from "react"
import {
  IconDotsVertical,
  IconSettings,
  IconReceiptDollar,
  IconSearch,
  IconFilter,
  IconChevronDown,
  IconStar,
} from "@tabler/icons-react"
import { rateGroups, type RateGroup } from "@/mock/data/team-member-rates"
import { TeamRatesBulkActionsBar } from "@/features/billing/components/TeamRatesBulkActionsBar"
import { BulkUpdateTeamRatesPanel } from "@/features/billing/components/BulkUpdateTeamRatesPanel"

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
import { ClientRatesModal } from "@/features/billing/components/ClientRatesModal"
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
    <div className="flex min-h-11 items-end border-b">
      {(["Service items", "Team member custom rates"] as TopTab[]).map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`flex items-center gap-2 border-b-2 px-1 pb-2.5 pt-1 text-sm font-medium mr-6 transition-colors ${
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

function formatRate(rate: number, rateType?: string) {
  const amount = rate === 0
    ? "$0.00"
    : `$${rate.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  return rateType === "Hour" ? `${amount}/hr` : amount
}

// ─── Team member rates tab ───────────────────────────────────────────────────

function MemberAvatars({ members }: { members: RateGroup["members"] }) {
  return (
    <div className="flex items-center -space-x-1.5">
      {members.slice(0, 4).map((m) => (
        <span
          key={m.id}
          title={m.name}
          className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-background text-[10px] font-bold text-white"
          style={{ backgroundColor: m.color }}
        >
          {m.initials}
        </span>
      ))}
      {members.length > 4 && (
        <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-semibold text-muted-foreground">
          +{members.length - 4}
        </span>
      )}
    </div>
  )
}

function ServiceChips({ services }: { services: RateGroup["services"] }) {
  const MAX = 3
  const visible = services.slice(0, MAX)
  const rest = services.length - MAX
  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map((s) => (
        <span
          key={s.serviceId}
          className="inline-flex items-center rounded-full border bg-muted/50 px-2.5 py-0.5 text-xs text-foreground"
        >
          {s.serviceName}&nbsp;<span className="font-medium text-primary">
            ${s.rate.toLocaleString("en-US", { minimumFractionDigits: 0 })}{s.rateType === "Hour" ? "/hr" : ""}
          </span>
        </span>
      ))}
      {rest > 0 && (
        <span className="inline-flex items-center rounded-full border bg-muted/50 px-2.5 py-0.5 text-xs text-muted-foreground">
          +{rest} more
        </span>
      )}
    </div>
  )
}

function TeamMemberRatesTab() {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [bulkUpdateOpen, setBulkUpdateOpen] = React.useState(false)

  const filtered = rateGroups.filter((g) => !g.archived)
  const allSelected = filtered.length > 0 && selectedIds.length === filtered.length

  const toggleAll = () => setSelectedIds(allSelected ? [] : filtered.map((g) => g.id))
  const toggleOne = (id: string) => setSelectedIds((prev) =>
    prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
  )

  const selectedGroups = filtered.filter((g) => selectedIds.includes(g.id))

  return (
    <div className="mt-4">
      {selectedIds.length > 0 ? (
        <TeamRatesBulkActionsBar
          selectedCount={selectedIds.length}
          onClearSelection={() => setSelectedIds([])}
          onSelectAll={() => setSelectedIds(filtered.map((g) => g.id))}
          onUpdateRates={() => setBulkUpdateOpen(true)}
        />
      ) : (
      <DataTableToolbarSlot>
        <DataTableToolbarGroup className="shrink-0">
          <Button size="xl" variant="ghost" onClick={protoAction("Favorites")}>
            <IconStar className="size-4" />
            Favorites
            <IconChevronDown className="size-3.5" />
          </Button>
          <Button size="xl" variant="ghost" onClick={protoAction("Filter")}>
            <IconFilter className="size-4" />
            Filter
            <IconChevronDown className="size-3.5" />
          </Button>
        </DataTableToolbarGroup>
        <DataTableToolbarSpacer />
        <DataTableToolbarGroup className="shrink-0">
          <Button size="xl" onClick={protoAction("New custom rate")}>New custom rate</Button>
          <div className="relative w-48">
            <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Search" />
          </div>
        </DataTableToolbarGroup>
      </DataTableToolbarSlot>
      )}

      <div className="table-striped overflow-x-auto rounded-lg border bg-background">
        <Table>
          <TableHeader className="sticky top-0 z-40 bg-background">
            <TableRow>
              <TableHead className="w-12">
                <input type="checkbox" className="table-checkbox" checked={allSelected} onChange={toggleAll} />
              </TableHead>
              <TableHead className="w-56">Name</TableHead>
              <TableHead>Services</TableHead>
              <TableHead className="w-48">Team members</TableHead>
              <TableHead className="w-10 px-0">
                <Button size="icon-xl" variant="ghost" onClick={protoAction("Table settings")}>
                  <IconSettings className="size-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((group) => (
              <TableRow
                key={group.id}
                className="group"
                data-state={selectedIds.includes(group.id) ? "selected" : undefined}
              >
                <TableCell className="w-12">
                  <input
                    type="checkbox"
                    className="table-checkbox"
                    checked={selectedIds.includes(group.id)}
                    onChange={() => toggleOne(group.id)}
                  />
                </TableCell>
                <TableCell>
                  <button
                    className="font-medium text-primary hover:underline"
                    onClick={protoAction(`Open rate group: ${group.name}`)}
                  >
                    {group.name}
                  </button>
                </TableCell>
                <TableCell>
                  <ServiceChips services={group.services} />
                </TableCell>
                <TableCell>
                  <MemberAvatars members={group.members} />
                </TableCell>
                <TableCell className="w-10 px-0">
                  <Button size="icon-xl" variant="ghost" onClick={protoAction("Rate group actions")}>
                    <IconDotsVertical className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <BulkUpdateTeamRatesPanel
        open={bulkUpdateOpen}
        groups={selectedGroups}
        onClose={() => setBulkUpdateOpen(false)}
        onConfirm={() => { setSelectedIds([]); setBulkUpdateOpen(false) }}
      />
    </div>
  )
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
  const [viewingRates, setViewingRates] = React.useState<ServiceItem | null>(null)

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
        <div className="mt-4">
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
                  <TableHead>Individual rate</TableHead>
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
                    <TableCell>{formatRate(svc.defaultRate, svc.rateType)}</TableCell>
                    <TableCell>
                      {svc.customRates > 0 ? (
                        <button
                          className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                          onClick={() => setViewingRates(svc)}
                        >
                          {svc.customRates} {svc.customRates === 1 ? "client" : "clients"}
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
        <TeamMemberRatesTab />
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
      <ClientRatesModal
        service={viewingRates}
        onClose={() => setViewingRates(null)}
        onSave={(updated) => {
          onItemsChange(items.map((s) => s.id === updated.id ? updated : s))
          setViewingRates(null)
          toast.success(`"${updated.name}" saved`)
        }}
      />
    </PageLayout>
  )
}
