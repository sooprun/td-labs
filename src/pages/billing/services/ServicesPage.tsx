import * as React from "react"
import {
  IconChevronUp,
  IconChevronDown,
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
import { protoAction } from "@/lib/proto"
import { serviceItems, type ServiceItem } from "@/mock/services"

// ─── Tabs ────────────────────────────────────────────────────────────────────

type TopTab = "Service items" | "Custom rates"

function TopTabs({
  active,
  onChange,
}: {
  active: TopTab
  onChange: (tab: TopTab) => void
}) {
  return (
    <div className="flex border-b">
      {(["Service items", "Custom rates"] as TopTab[]).map((tab) => (
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
          {tab === "Custom rates" && (
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
  "name" | "description" | "category" | "defaultRate" | "rateType"
>
type SortDir = "asc" | "desc"

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (col !== sortKey) {
    return (
      <span className="ml-1 inline-flex flex-col opacity-30">
        <IconChevronUp className="size-3 -mb-0.5" />
        <IconChevronDown className="size-3" />
      </span>
    )
  }
  return sortDir === "asc"
    ? <IconChevronUp className="ml-1 size-3.5 text-primary" />
    : <IconChevronDown className="ml-1 size-3.5 text-primary" />
}

// ─── Format ──────────────────────────────────────────────────────────────────

function formatRate(rate: number) {
  return rate === 0
    ? "$0.00"
    : `$${rate.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function ServicesPage() {
  const [topTab, setTopTab] = React.useState<TopTab>("Service items")
  const [status, setStatus] = React.useState<"Active" | "Archived">("Active")
  const [sortKey, setSortKey] = React.useState<SortKey>("name")
  const [sortDir, setSortDir] = React.useState<SortDir>("asc")

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  const filtered = serviceItems
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

  return (
    <PageLayout>
      <PageHeader title="Services" />

      <TopTabs active={topTab} onChange={setTopTab} />

      {topTab === "Service items" ? (
        <div className="mt-5">
          {/* Toolbar */}
          <DataTableToolbarSlot>
            <DataTableToolbarGroup>
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

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border bg-background">
            <table className="w-full text-sm table-striped">
              <thead>
                <tr className="border-b text-left text-xs font-medium text-muted-foreground">
                  <th
                    className="h-10 cursor-pointer select-none px-4 font-medium hover:text-foreground"
                    onClick={() => handleSort("name")}
                  >
                    <span className="inline-flex items-center">
                      Name
                      <SortIcon col="name" sortKey={sortKey} sortDir={sortDir} />
                    </span>
                  </th>
                  <th
                    className="h-10 cursor-pointer select-none px-4 font-medium hover:text-foreground"
                    onClick={() => handleSort("description")}
                  >
                    <span className="inline-flex items-center">
                      Description
                      <SortIcon col="description" sortKey={sortKey} sortDir={sortDir} />
                    </span>
                  </th>
                  <th
                    className="h-10 cursor-pointer select-none px-4 font-medium hover:text-foreground"
                    onClick={() => handleSort("category")}
                  >
                    <span className="inline-flex items-center">
                      Category
                      <SortIcon col="category" sortKey={sortKey} sortDir={sortDir} />
                    </span>
                  </th>
                  <th
                    className="h-10 cursor-pointer select-none px-4 font-medium hover:text-foreground"
                    onClick={() => handleSort("defaultRate")}
                  >
                    <span className="inline-flex items-center">
                      Default rate
                      <SortIcon col="defaultRate" sortKey={sortKey} sortDir={sortDir} />
                    </span>
                  </th>
                  <th className="h-10 px-4 font-medium">Custom rate</th>
                  <th
                    className="h-10 cursor-pointer select-none px-4 font-medium hover:text-foreground"
                    onClick={() => handleSort("rateType")}
                  >
                    <span className="inline-flex items-center">
                      Rate type
                      <SortIcon col="rateType" sortKey={sortKey} sortDir={sortDir} />
                    </span>
                  </th>
                  <th className="h-10 w-12 px-2 text-right">
                    <button
                      className="text-muted-foreground hover:text-foreground"
                      onClick={protoAction("Table settings")}
                    >
                      <IconSettings className="size-4" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((svc) => (
                  <tr key={svc.id} className="border-b last:border-0 hover:bg-muted/40 group">
                    <td className="px-4 py-2.5 font-medium">{svc.name}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{svc.description}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{svc.category}</td>
                    <td className="px-4 py-2.5">{formatRate(svc.defaultRate)}</td>
                    <td className="px-4 py-2.5">
                      {svc.customRates > 0 ? (
                        <button
                          className="text-primary hover:underline"
                          onClick={protoAction("View custom rates")}
                        >
                          {svc.customRates}
                        </button>
                      ) : null}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">{svc.rateType}</td>
                    <td className="w-12 px-2 py-2.5 text-right">
                      <button
                        className="invisible text-muted-foreground hover:text-foreground group-hover:visible"
                        onClick={protoAction("Service actions")}
                      >
                        <IconDotsVertical className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
    </PageLayout>
  )
}
