import * as React from "react"
import {
  IconArrowLeft,
  IconChevronDown,
  IconChevronRight,
  IconCirclePlus,
  IconCopy,
  IconReceiptDollar,
  IconStar,
  IconFilter,
  IconPrinter,
  IconSearch,
  IconDownload,
  IconInfoCircle,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { PageTabs } from "@/components/page/PageTabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTableBulkActionsBar, DataTableToolbarSlot, DataTableToolbarGroup, DataTableToolbarSpacer } from "@/components/data-table/DataTableToolbar"
import { DataTableSortIcon, type SortDir } from "@/components/data-table/DataTableSortIcon"
import { protoAction } from "@/lib/proto"
import {
  accountJobsMap,
  accounts,
  getAccountLeftPanel,
  teamMemberNames,
  type Job,
  type Task,
} from "@/mock/accounts"
import { invoices, type InvoiceStatus } from "@/mock/data/invoices"
import type { ServiceItem } from "@/mock/services"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { IconDotsVertical, IconEye, IconEyeOff, IconRotate, IconSettings, IconTableImport } from "@tabler/icons-react"
import { useQueryParam } from "@/hooks/useQueryParam"
import { rateGroups } from "@/mock/data/team-member-rates"
import { StatusTabs } from "@/components/page/StatusTabs"
import { ProtoPlaceholder } from "@/components/page/ProtoPlaceholder"
import { UpdateClientOverridesCsvPanel } from "@/features/billing/components/UpdateClientOverridesCsvPanel"
import { EditClientOverridesPanel } from "@/features/billing/components/EditClientOverridesPanel"

// ─── Types ───────────────────────────────────────────────────────────────────

type AccountDetailPageProps = {
  accountId: string
  onBack: () => void
  services: ServiceItem[]
  onServicesChange: (items: ServiceItem[]) => void
  followed: boolean
  onToggleFollow: () => void
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const TAB_BADGE_CLASS =
  "text-[10px] font-bold bg-[#24C875] text-white rounded-full h-4 min-w-4 px-1 inline-flex items-center justify-center ml-1"

function isPastDate(dateStr: string | null): boolean {
  if (!dateStr) return false
  const d = new Date(dateStr)
  return !isNaN(d.getTime()) && d < new Date()
}

const STATUS_STYLES: Record<string, string> = {
  "No status":
    "border border-border text-muted-foreground bg-transparent",
  "In progress": "bg-blue-100 text-blue-700 border border-blue-200",
  Completed: "bg-green-100 text-green-700 border border-green-200",
  Extended: "bg-orange-100 text-orange-700 border border-orange-200",
}

const PRIORITY_STYLES: Record<string, string> = {
  High: "border border-red-300 text-red-600",
  Medium: "border border-orange-300 text-orange-500",
  Low: "border border-green-300 text-green-600",
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status] ?? STATUS_STYLES["No status"]}`}
    >
      {status}
    </span>
  )
}

function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLES[priority] ?? ""}`}
    >
      {priority}
    </span>
  )
}

function AssigneeAvatar({ initials }: { initials: string }) {
  return (
    <span className="flex size-[26px] items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
      {initials}
    </span>
  )
}

// ─── Left panel ──────────────────────────────────────────────────────────────

type CollapsibleSectionProps = {
  title: string
  count?: number
  badge?: React.ReactNode
  actions: React.ReactNode
  defaultOpen?: boolean
  children?: React.ReactNode
}

function CollapsibleSection({
  title,
  count,
  badge,
  actions,
  defaultOpen = false,
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = React.useState(defaultOpen)

  return (
    <div className="border-t px-5 py-4">
      <div className="flex items-center gap-2">
        <button
          className="flex items-center gap-1.5 text-sm font-semibold"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <IconChevronDown className="size-4 text-muted-foreground" />
          ) : (
            <IconChevronRight className="size-4 text-muted-foreground" />
          )}
          {title}
          {count !== undefined && count > 0 && (
            <span className="ml-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1 text-[11px] font-semibold text-muted-foreground">
              {count}
            </span>
          )}
          {badge}
        </button>
        <div className="ml-auto flex items-center gap-3 text-sm text-primary">
          {actions}
        </div>
      </div>
      {open && (
        <div className="mt-3">
          {children ?? (
            <p className="text-sm text-muted-foreground">None yet</p>
          )}
        </div>
      )}
    </div>
  )
}

function LeftPanel({
  account,
  services,
  onViewClientOverrides,
  followed,
  onToggleFollow,
}: {
  account: NonNullable<ReturnType<typeof accounts.find>>
  services: ServiceItem[]
  onViewClientOverrides: () => void
  followed: boolean
  onToggleFollow: () => void
}) {
  const panelData = getAccountLeftPanel(account.id)

  const teamMembers = account.team.map(
    (initials) => teamMemberNames[initials] ?? initials
  )
  const overflowCount = Math.max(0, teamMembers.length - 3)
  const visibleMembers = teamMembers.slice(0, 3)

  return (
    <div className="w-80 shrink-0 rounded-xl border bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pb-4 pt-5">
        <span className="text-lg font-semibold">Account</span>
        <button
          className="text-sm text-primary hover:underline"
          onClick={onToggleFollow}
        >
          {followed ? "Unfollow account" : "Follow account"}
        </button>
      </div>

      {/* Notes */}
      <CollapsibleSection
        title="Notes"
        count={panelData.notes.length || undefined}
        defaultOpen={panelData.notes.length > 0}
        actions={
          <>
            <button
              className="flex items-center gap-1 hover:underline"
              onClick={protoAction("Create note")}
            >
              <IconCirclePlus className="size-4" />
              Create
            </button>
            <button className="hover:underline" onClick={protoAction("View all notes")}>
              View all
            </button>
          </>
        }
      >
        {panelData.notes.length > 0 ? (
          <div className="flex flex-col gap-2">
            {panelData.notes.map((note) => (
              <button
                key={note.id}
                className="w-full rounded-lg px-3 py-2.5 text-left hover:bg-muted/60"
                onClick={protoAction(note.title)}
              >
                <p className="truncate text-sm font-medium">{note.title}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{note.body}</p>
              </button>
            ))}
          </div>
        ) : undefined}
      </CollapsibleSection>

      {/* Tags & custom fields */}
      <CollapsibleSection
        title="Tags & custom fields"
        count={(account.tags.length + (account.team.length > 0 ? 1 : 0)) || undefined}
        actions={
          <button className="hover:underline" onClick={protoAction("View tags")}>
            View
          </button>
        }
      >
        <div className="space-y-3">
          {/* Tags */}
          <div>
            <p className="mb-1.5 text-xs text-muted-foreground">Tags</p>
            {account.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {account.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-[#1D6B43] px-2.5 py-1 text-xs font-medium text-white"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No tags</p>
            )}
          </div>

          {/* Team members */}
          <div>
            <p className="mb-1.5 text-xs text-muted-foreground">Team members</p>
            {teamMembers.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {visibleMembers.map((name) => (
                  <span
                    key={name}
                    className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
                  >
                    {name}
                  </span>
                ))}
                {overflowCount > 0 && (
                  <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    +{overflowCount}
                  </span>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No team members</p>
            )}
          </div>
        </div>
      </CollapsibleSection>

      {/* Account roles */}
      <CollapsibleSection
        title="Account roles"
        count={panelData.roles.length || undefined}
        actions={
          <button className="hover:underline" onClick={protoAction("View all roles")}>
            View all
          </button>
        }
      >
        {panelData.roles.length > 0 ? (
          <div className="space-y-3">
            {panelData.roles.map((role) => (
              <div key={role.roleName}>
                <p className="mb-1.5 text-xs uppercase tracking-wide text-muted-foreground">
                  {role.roleName}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {role.members.map((member) => (
                    <span
                      key={member}
                      className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
                    >
                      {member}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : undefined}
      </CollapsibleSection>

      {/* Contacts */}
      <CollapsibleSection
        title="Contacts"
        count={panelData.contacts.length || undefined}
        actions={
          <button className="hover:underline" onClick={protoAction("View all contacts")}>
            View all
          </button>
        }
      >
        {panelData.contacts.length > 0 ? (
          <div className="space-y-3 pr-1">
            {panelData.contacts.map((contact) => (
              <div
                key={contact.id}
                className="rounded-xl border bg-background p-3 shadow-sm"
              >
                <button
                  className="mb-2 text-sm font-semibold text-primary hover:underline"
                  onClick={protoAction(contact.name)}
                >
                  {contact.name}
                </button>

                {contact.phone && (
                  <div className="mb-1.5">
                    <p className="text-xs text-muted-foreground">Primary phone</p>
                    <div className="flex items-center gap-1.5">
                      <a className="text-sm text-primary hover:underline">
                        {contact.phone}
                      </a>
                      <button
                        className="text-muted-foreground hover:text-foreground"
                        onClick={protoAction("Copy phone")}
                      >
                        <IconCopy className="size-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {contact.email && (
                  <div className="mb-1.5">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <a className="text-sm text-primary hover:underline">
                      {contact.email}
                    </a>
                  </div>
                )}

                {contact.lastLogin && (
                  <div className="mb-1.5">
                    <p className="text-xs text-muted-foreground">Last login</p>
                    <p className="text-sm">{contact.lastLogin}</p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-muted-foreground">Permissions</p>
                  <p className="text-sm">{contact.permissions}</p>
                </div>
              </div>
            ))}
          </div>
        ) : undefined}
      </CollapsibleSection>

      {/* Client overrides */}
      {(() => {
        const overrides = services
          .filter((s) =>
            s.clientOverridesList.some((o) => o.accountId === account.id) &&
            !rateGroups.some((g) => !g.archived && g.services.some((sv) => sv.serviceId === s.id))
          )
          .map((s) => ({
            name: s.name,
            rate: s.clientOverridesList.find((o) => o.accountId === account.id)!.rate,
            defaultRate: s.defaultRate,
            rateType: s.rateType,
          }))
        return (
          <CollapsibleSection
            title="Client overrides"
            count={overrides.length || undefined}
            badge={<span className="inline-flex items-center rounded-full bg-[#7C3AED] px-2 py-0.5 text-[10px] font-bold text-white">New</span>}
            actions={
              <button className="hover:underline" onClick={onViewClientOverrides}>
                View all
              </button>
            }
          >
            {overrides.length > 0 ? (
              <table className="w-full text-sm">
                <tbody>
                  {overrides.map((o) => {
                    const pct = o.defaultRate > 0 ? Math.round(((o.rate - o.defaultRate) / o.defaultRate) * 100) : null
                    return (
                      <tr key={o.name} className="border-b last:border-0">
                        <td className="py-2.5 pr-4 truncate max-w-0 w-full">{o.name}</td>
                        <td className="py-2.5 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {pct !== null && pct !== 0 && (
                              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                                pct > 0
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              }`}>
                                {pct > 0 ? "+" : ""}{pct}%
                              </span>
                            )}
                            <span className="text-sm font-medium">
                              ${o.rate.toLocaleString("en-US", { minimumFractionDigits: 0 })}{o.rateType === "Hour" ? "/hr" : ""}
                            </span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center gap-2 py-4">
                <IconReceiptDollar className="size-10 text-muted-foreground/40" strokeWidth={1} />
                <p className="text-sm text-muted-foreground">Set client overrides for this client</p>
              </div>
            )}
          </CollapsibleSection>
        )
      })()}
    </div>
  )
}

// ─── Jobs table ──────────────────────────────────────────────────────────────

function JobsTable({ jobs }: { jobs: Job[] }) {
  if (jobs.length === 0) {
    return <p className="text-sm text-muted-foreground">No jobs yet</p>
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b text-left text-xs font-medium text-muted-foreground">
          <th className="pb-2 pr-4 font-medium">Name</th>
          <th className="pb-2 pr-4 font-medium">Pipeline</th>
          <th className="pb-2 pr-4 font-medium">Stage</th>
          <th className="pb-2 pr-4 font-medium whitespace-nowrap">Internal deadline</th>
          <th className="pb-2 font-medium whitespace-nowrap">Due date</th>
        </tr>
      </thead>
      <tbody>
        {jobs.map((job) => (
          <tr key={job.id} className="border-b last:border-0">
            <td className="py-2.5 pr-4">
              <button
                className="text-left text-primary hover:underline"
                onClick={protoAction(job.name)}
              >
                {job.name}
              </button>
            </td>
            <td className="py-2.5 pr-4 text-muted-foreground">
              <button
                className="text-left hover:underline hover:text-foreground transition-colors"
                onClick={protoAction(job.pipeline)}
              >
                {job.pipeline}
              </button>
            </td>
            <td className="py-2.5 pr-4 text-muted-foreground">{job.stage}</td>
            <td
              className={`py-2.5 pr-4 whitespace-nowrap ${isPastDate(job.internalDeadline) ? "text-red-500" : "text-muted-foreground"}`}
            >
              {job.internalDeadline ?? "—"}
            </td>
            <td
              className={`py-2.5 whitespace-nowrap ${isPastDate(job.dueDate) ? "text-red-500" : "text-muted-foreground"}`}
            >
              {job.dueDate ?? "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// ─── Tasks table ─────────────────────────────────────────────────────────────

function TasksTable({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return <p className="text-sm text-muted-foreground">No tasks yet</p>
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b text-left text-xs font-medium text-muted-foreground">
          <th className="pb-2 pr-4 font-medium">Name</th>
          <th className="pb-2 pr-4 font-medium">Job</th>
          <th className="pb-2 pr-4 font-medium">Assignee</th>
          <th className="pb-2 pr-4 font-medium">Status</th>
          <th className="pb-2 pr-4 font-medium">Priority</th>
          <th className="pb-2 font-medium whitespace-nowrap">Due date</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id} className="border-b last:border-0">
            <td className="py-2.5 pr-4">
              <button
                className="text-left text-primary hover:underline"
                onClick={protoAction(task.name)}
              >
                {task.name}
              </button>
            </td>
            <td className="py-2.5 pr-4 text-muted-foreground">
              <button
                className="text-left hover:underline hover:text-foreground transition-colors"
                onClick={protoAction(task.job)}
              >
                {task.job}
              </button>
            </td>
            <td className="py-2.5 pr-4">
              <AssigneeAvatar initials={task.assignee} />
            </td>
            <td className="py-2.5 pr-4">
              <StatusBadge status={task.status} />
            </td>
            <td className="py-2.5 pr-4">
              <PriorityBadge priority={task.priority} />
            </td>
            <td
              className={`py-2.5 whitespace-nowrap ${isPastDate(task.dueDate) ? "text-red-500" : "text-muted-foreground"}`}
            >
              {task.dueDate ?? "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// ─── Right panel ─────────────────────────────────────────────────────────────

type OverviewSubTab =
  | "jobs"
  | "client-todos"
  | "communication"
  | "docs"
  | "billing"
  | "activity"

function RightPanel({ accountId }: { accountId: string }) {
  const [activeSubTabSlug, setActiveSubTabSlug] = useQueryParam("overview_tab", "jobs")
  const activeSubTab = (activeSubTabSlug as OverviewSubTab) ?? "jobs"
  const setActiveSubTab = (tab: OverviewSubTab) => setActiveSubTabSlug(tab)

  const data = accountJobsMap[accountId] ?? { jobs: [], tasks: [] }
  const totalJobsAndTasks = data.jobs.length + data.tasks.length

  const subTabs: { id: OverviewSubTab; label: string; badge?: number }[] = [
    { id: "jobs", label: "Jobs & tasks", badge: totalJobsAndTasks },
    { id: "client-todos", label: "Client to-do's", badge: 25 },
    { id: "communication", label: "Communication" },
    { id: "docs", label: "Docs" },
    { id: "billing", label: "Billing" },
    { id: "activity", label: "Activity" },
  ]

  return (
    <div className="min-w-0 flex-1 rounded-xl border bg-background">
      {/* Header */}
      <div className="border-b px-5 pb-4 pt-5">
        <h2 className="text-lg font-semibold">Overview</h2>
      </div>

      {/* Sub-tabs */}
      <div className="flex border-b gap-0 px-5">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex items-center pb-3.5 pt-4 text-sm mr-5 font-medium border-b-2 transition-colors ${
              activeSubTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveSubTab(tab.id)}
          >
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className={TAB_BADGE_CLASS}>{tab.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-5 py-5">
        {activeSubTab === "jobs" ? (
          <div className="space-y-6">
            {/* Jobs section */}
            <div>
              <div className="mb-3 flex items-center">
                <span className="font-semibold">Jobs</span>
                <button
                  className="ml-auto text-sm text-primary hover:underline"
                  onClick={protoAction("View all jobs")}
                >
                  View all
                </button>
              </div>
              <JobsTable jobs={data.jobs} />
            </div>

            {/* Tasks section */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="font-semibold">Tasks</span>
                {data.tasks.length > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1 text-[11px] font-semibold text-muted-foreground">
                    {data.tasks.length}
                  </span>
                )}
                <button
                  className="ml-auto text-sm text-primary hover:underline"
                  onClick={protoAction("View all tasks")}
                >
                  View all
                </button>
              </div>
              <TasksTable tasks={data.tasks} />
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Coming soon</p>
        )}
      </div>
    </div>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────

// ─── Invoices tab ────────────────────────────────────────────────────────────

const INVOICE_STATUS_STYLES: Record<InvoiceStatus, string> = {
  Paid:    "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
  Unpaid:  "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  Overdue: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
  Draft:   "bg-muted text-muted-foreground",
}

type InvoicesSubTab = "Invoices" | "Recurring invoices" | "Payments" | "Time entries" | "Pricing"

const BILLING_TAB_SLUG: Record<InvoicesSubTab, string> = {
  "Invoices": "invoices",
  "Recurring invoices": "recurring",
  "Payments": "payments",
  "Time entries": "time_entries",
  "Pricing": "client_prices",
}
const BILLING_SLUG_TAB: Record<string, InvoicesSubTab> = Object.fromEntries(
  Object.entries(BILLING_TAB_SLUG).map(([k, v]) => [v, k as InvoicesSubTab])
)

function InvoicesTabContent({ accountId, services, onServicesChange }: { accountId: string; services: ServiceItem[]; onServicesChange: (items: ServiceItem[]) => void }) {
  const [billingSlug, setBillingSlug] = useQueryParam("billing_tab", "invoices")
  const subTab: InvoicesSubTab = BILLING_SLUG_TAB[billingSlug] ?? "Invoices"
  const setSubTab = (tab: InvoicesSubTab) => setBillingSlug(BILLING_TAB_SLUG[tab])

  const accountInvoices = invoices.filter((inv) => inv.accountId === accountId)
  const paid = accountInvoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amountPaid, 0)
  const unpaid = accountInvoices.filter((i) => i.status !== "Paid").reduce((s, i) => s + i.balanceDue, 0)

  const fmt = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  return (
    <div className="flex flex-col gap-4">
      {/* Sub-tabs */}
      <PageTabs
        tabs={[
          "Invoices",
          "Recurring invoices",
          "Payments",
          "Time entries",
          {
            label: "Pricing",
            badge: (
              <span className="inline-flex items-center rounded-full bg-[#7C3AED] px-2 py-0.5 text-[10px] font-bold text-white">
                New
              </span>
            ),
          },
        ]}
        active={subTab}
        onChange={setSubTab}
      />

      {subTab === "Invoices" ? (
        <>
          {/* Summary */}
          <DataTableToolbarSlot className="gap-4 text-sm text-muted-foreground">
            <span>Invoices: <strong className="text-foreground">{accountInvoices.length}</strong></span>
            <div className="h-4 w-px bg-border" />
            <span>Paid: <strong className="text-foreground">{fmt(paid)}</strong></span>
            <div className="h-4 w-px bg-border" />
            <span>Unpaid: <strong className="text-foreground">{fmt(unpaid)}</strong></span>
          </DataTableToolbarSlot>

          {/* Toolbar */}
          <DataTableToolbarSlot className="gap-2">
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
            <div className="flex-1" />
            <Button size="xl" onClick={protoAction("New invoice")}>New invoice</Button>
            <Button size="xl" variant="outline" onClick={protoAction("Export invoices")}>
              <IconDownload className="size-4" />
              Export invoices
            </Button>
            <Button size="icon-xl" variant="ghost" onClick={protoAction("Print")}>
              <IconPrinter className="size-4" />
            </Button>
            <div className="relative w-48">
              <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Search" />
            </div>
          </DataTableToolbarSlot>

          {accountInvoices.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No invoices yet</p>
          ) : (
            <div className="table-striped overflow-x-auto rounded-lg border bg-background">
              <Table>
                <TableHeader className="sticky top-0 z-40 bg-background">
                  <TableRow>
                    <TableHead className="w-12">
                      <input type="checkbox" className="table-checkbox" />
                    </TableHead>
                    <TableHead>Invoice number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Posted</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Amount paid</TableHead>
                    <TableHead className="text-right">Balance due</TableHead>
                    <TableHead>Last paid</TableHead>
                    <TableHead className="w-10 px-0">
                      <Button size="icon-xl" variant="ghost" onClick={protoAction("Table settings")}>
                        <IconSettings className="size-4" />
                      </Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accountInvoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="w-12">
                        <input type="checkbox" className="table-checkbox" />
                      </TableCell>
                      <TableCell>
                        <button className="font-medium text-primary hover:underline" onClick={protoAction("Open invoice")}>
                          {inv.number}
                        </button>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${INVOICE_STATUS_STYLES[inv.status]}`}>
                          {inv.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{inv.assignee}</TableCell>
                      <TableCell className="text-muted-foreground">{inv.postedAt ?? "—"}</TableCell>
                      <TableCell className="text-right font-medium">{fmt(inv.total)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{fmt(inv.amountPaid)}</TableCell>
                      <TableCell className="text-right font-medium">
                        {inv.balanceDue > 0 ? fmt(inv.balanceDue) : <span className="text-muted-foreground">{fmt(0)}</span>}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{inv.lastPaidAt ?? "—"}</TableCell>
                      <TableCell className="w-10 px-0">
                        <Button size="icon-xl" variant="ghost" onClick={protoAction("Invoice actions")}>
                          <IconDotsVertical className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      ) : subTab === "Pricing" ? (
        <CustomRatesTabContent accountId={accountId} services={services} onServicesChange={onServicesChange} />
      ) : (
        <ProtoPlaceholder title={subTab} />
      )}
    </div>
  )
}

function CustomRatesTabContent({ accountId, services, onServicesChange }: { accountId: string; services: ServiceItem[]; onServicesChange: (items: ServiceItem[]) => void }) {
  const account = accounts.find((a) => a.id === accountId)

  const [viewParam, setViewParam] = useQueryParam("pricing_view", "all")
  const view = viewParam === "custom" ? "custom" : "all"
  const setView = (v: "all" | "custom") => setViewParam(v)
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [setOverridesOpen, setSetOverridesOpen] = React.useState(false)
  const [csvImportOpen, setCsvImportOpen] = React.useState(false)
  const [resetConfirmOpen, setResetConfirmOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editingValue, setEditingValue] = React.useState("")
  const [search, setSearch] = React.useState("")
  const [sortKey, setSortKey] = React.useState<keyof Pick<ServiceItem, "name" | "category" | "defaultRate" | "rateType">>("name")
  const [sortDir, setSortDir] = React.useState<SortDir>("asc")

  const handleSort = (key: typeof sortKey) => {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    else { setSortKey(key); setSortDir("asc") }
  }

  const activeServices = services.filter((s) => !s.archived)
  const withOverride = activeServices.filter((s) =>
    s.clientOverridesList.some((o) => o.accountId === accountId) &&
    !rateGroups.some((g) => !g.archived && g.services.some((sv) => sv.serviceId === s.id))
  )
  const searchLower = search.toLowerCase()
  const displayed = (view === "all" ? activeServices : withOverride).filter((s) =>
    !searchLower || s.name.toLowerCase().includes(searchLower)
  ).slice().sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey]
    const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv))
    return sortDir === "asc" ? cmp : -cmp
  })

  const allSelected = displayed.length > 0 && selectedIds.length === displayed.length
  const toggleAll = () => setSelectedIds(allSelected ? [] : displayed.map((s) => s.id))
  const toggleOne = (id: string) => setSelectedIds((prev) =>
    prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
  )

  const fmt = (n: number, rateType?: string) => {
    const amount = `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    return rateType === "Hour" ? `${amount}/hr` : amount
  }

  const openEditing = (svc: ServiceItem) => {
    const override = svc.clientOverridesList.find((o) => o.accountId === accountId)
    setEditingId(svc.id)
    setEditingValue(override ? String(override.rate) : "")
  }

  const commitEditing = (svc: ServiceItem) => {
    const trimmed = editingValue.trim()
    if (trimmed === "") {
      onServicesChange(services.map((s) => {
        if (s.id !== svc.id) return s
        const newOverrides = s.clientOverridesList.filter((o) => o.accountId !== accountId)
        return { ...s, clientOverridesList: newOverrides, customRates: newOverrides.length }
      }))
    } else {
      const parsed = parseFloat(trimmed)
      if (!isNaN(parsed)) {
        onServicesChange(services.map((s) => {
          if (s.id !== svc.id) return s
          const existing = s.clientOverridesList.find((o) => o.accountId === accountId)
          const newOverrides = existing
            ? s.clientOverridesList.map((o) => o.accountId === accountId ? { ...o, rate: parsed } : o)
            : [...s.clientOverridesList, { accountId, accountName: account?.name ?? "", rate: parsed }]
          return { ...s, clientOverridesList: newOverrides, customRates: newOverrides.length }
        }))
      }
    }
    setEditingId(null)
    setEditingValue("")
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      {selectedIds.length > 0 ? (
        <DataTableBulkActionsBar
          selectedCount={selectedIds.length}
          onClearSelection={() => setSelectedIds([])}
          onSelectAll={() => setSelectedIds(displayed.map((s) => s.id))}
          selectAllLabel="Select all"
          actions={[
            {
              icon: IconReceiptDollar,
              label: "Update client overrides",
              onClick: () => setSetOverridesOpen(true),
            },
            {
              icon: IconTableImport,
              label: "Update client overrides via CSV",
              onClick: () => setCsvImportOpen(true),
            },
            {
              icon: IconRotate,
              label: "Reset override",
              disabled: !selectedIds.some((id) => {
                const svc = services.find((s) => s.id === id)
                if (!svc) return false
                const hasTeamRate = rateGroups.some((g) => !g.archived && g.services.some((sv) => sv.serviceId === id))
                return !hasTeamRate && svc.clientOverridesList.some((o) => o.accountId === accountId)
              }),
              disabledTooltip: "No overrides to reset",
              onClick: () => setResetConfirmOpen(true),
            },
          ]}
        />
      ) : (
        <DataTableToolbarSlot>
          <DataTableToolbarGroup className="shrink-0">
            <StatusTabs
              tabs={[
                { label: "All services", active: view === "all", onClick: () => { setView("all"); setSelectedIds([]) } },
                { label: "Client overrides only", active: view === "custom", onClick: () => { setView("custom"); setSelectedIds([]) } },
              ]}
            />
          </DataTableToolbarGroup>
          <DataTableToolbarSpacer />
          <DataTableToolbarGroup className="shrink-0">
            <div className="relative w-48">
              <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </DataTableToolbarGroup>
        </DataTableToolbarSlot>
      )}

      {displayed.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <IconReceiptDollar className="mb-4 size-12 text-muted-foreground/40" strokeWidth={1.25} />
          <h3 className="text-base font-semibold">Set client overrides for this client</h3>
          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
            Any service rate you customize here will be used instead of the default on invoices and proposals.
          </p>
          <button
            className="mt-4 text-sm font-medium text-primary hover:underline underline-offset-2"
            onClick={() => setView("all")}
          >
            Go to All services
          </button>
        </div>
      ) : (
      <div className="table-striped overflow-x-auto rounded-lg border bg-background">
        <Table className="table-fixed">
          <TableHeader className="sticky top-0 z-40 bg-background">
            <TableRow>
              <TableHead className="w-12">
                <input type="checkbox" className="table-checkbox" checked={allSelected} onChange={toggleAll} />
              </TableHead>
              <TableHead className="min-w-0 w-full cursor-pointer select-none hover:text-foreground" onClick={() => handleSort("name")}>
                <span className="inline-flex items-center">Name<DataTableSortIcon col="name" sortKey={sortKey} sortDir={sortDir} /></span>
              </TableHead>
              <TableHead className="w-32 cursor-pointer select-none hover:text-foreground" onClick={() => handleSort("category")}>
                <span className="inline-flex items-center">Category<DataTableSortIcon col="category" sortKey={sortKey} sortDir={sortDir} /></span>
              </TableHead>
              <TableHead className="w-20 cursor-pointer select-none hover:text-foreground" onClick={() => handleSort("rateType")}>
                <span className="inline-flex items-center">Type<DataTableSortIcon col="rateType" sortKey={sortKey} sortDir={sortDir} /></span>
              </TableHead>
              <TableHead className="w-36 cursor-pointer select-none text-right hover:text-foreground" onClick={() => handleSort("defaultRate")}>
                <span className="inline-flex items-center justify-end w-full">Default rate<DataTableSortIcon col="defaultRate" sortKey={sortKey} sortDir={sortDir} /></span>
              </TableHead>
              <TableHead className="w-44 text-right">Client override</TableHead>
              {/* <TableHead className="w-36">Team rate</TableHead> */}
              <TableHead className="w-10 px-0">
                <Button size="icon-xl" variant="ghost" onClick={protoAction("Table settings")}>
                  <IconSettings className="size-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayed.map((svc) => {
              const override = svc.clientOverridesList.find((o) => o.accountId === accountId)
              const teamRates = rateGroups
                .filter((g) => !g.archived)
                .flatMap((g) => {
                  const entry = g.services.find((s) => s.serviceId === svc.id)
                  return entry ? [entry.rate] : []
                })
              const hasTeamRate = teamRates.length > 0
              return (
                <TableRow key={svc.id} data-state={selectedIds.includes(svc.id) ? "selected" : undefined}>
                  <TableCell className="w-12">
                    <input type="checkbox" className="table-checkbox" checked={selectedIds.includes(svc.id)} onChange={() => toggleOne(svc.id)} />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{svc.name}</div>
                    {svc.description && <div className="text-xs text-muted-foreground">{svc.description}</div>}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{svc.category}</TableCell>
                  <TableCell className="text-muted-foreground">{svc.rateType}</TableCell>
                  <TableCell className="w-36 text-right text-muted-foreground">{fmt(svc.defaultRate, svc.rateType)}</TableCell>
                  <TableCell className="w-44">
                    {hasTeamRate ? (() => {
                      return (
                        <div className="flex items-center justify-end gap-1.5">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-default text-primary transition-colors">
                                  <IconInfoCircle className="size-4" />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent side="top" sideOffset={6} className="bg-background text-foreground text-xs border shadow-md" hideArrow>
                                This service uses team member rates — it can't be overridden per client. Default or team member rate will apply on invoices and proposals.
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <span className="text-sm text-muted-foreground">Unavailable</span>
                        </div>
                      )
                    })() : (() => {
                      const isEditing = editingId === svc.id
                      const liveParsed = parseFloat(editingValue)
                      const pct = isEditing
                        ? (!isNaN(liveParsed) && svc.defaultRate > 0 ? Math.round(((liveParsed - svc.defaultRate) / svc.defaultRate) * 100) : null)
                        : (override && svc.defaultRate > 0 ? Math.round(((override.rate - svc.defaultRate) / svc.defaultRate) * 100) : null)
                      const badgeColor = pct !== null && pct > 0
                        ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                      return (
                        <div className="flex items-center justify-end gap-2">
                          {pct !== null && pct !== 0 && (
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badgeColor}`}>
                              {pct > 0 ? "+" : ""}{pct}%
                            </span>
                          )}
                          <div className="relative">
                            {isEditing ? (
                              <div className="animate-in zoom-in-95 fade-in-0 duration-150 origin-right">
                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                                <Input
                                  autoFocus
                                  className={`w-24 pl-6 text-right text-sm ${svc.rateType === "Hour" ? "pr-8" : ""}`}
                                  value={editingValue}
                                  placeholder={svc.defaultRate > 0 ? svc.defaultRate.toFixed(2) : "0.00"}
                                  onChange={(e) => setEditingValue(e.target.value)}
                                  onFocus={(e) => { const t = e.target; requestAnimationFrame(() => { t.setSelectionRange(t.value.length, t.value.length) }) }}
                                  onBlur={() => commitEditing(svc)}
                                  onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); if (e.key === "Escape") { setEditingId(null); setEditingValue("") } }}
                                />
                                {svc.rateType === "Hour" && (
                                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">/hr</span>
                                )}
                              </div>
                            ) : (
                              <button
                                className={`flex h-8 items-center text-sm text-primary hover:underline decoration-dashed decoration-primary/50 underline-offset-4 ${override ? "font-medium" : ""}`}
                                onClick={() => openEditing(svc)}
                              >
                                {override ? fmt(override.rate, svc.rateType) : "Set override"}
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })()}
                  </TableCell>
                  {/* <TableCell className="w-36">
                    {(() => {
                      const rateCount = rateGroups
                        .filter((g) => !g.archived && g.services.some((s) => s.serviceId === svc.id))
                        .length
                      return rateCount > 0 ? (
                        <button
                          className="text-sm text-primary hover:underline underline-offset-2"
                          onClick={protoAction("View team rates")}
                        >
                          {rateCount} {rateCount === 1 ? "rate" : "rates"}
                        </button>
                      ) : null
                    })()}
                  </TableCell> */}
                  <TableCell className="w-10 px-0">
                    <Button size="icon-xl" variant="ghost" onClick={protoAction("Service price actions")}>
                      <IconDotsVertical className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
      )}

      {/* Reset override confirmation */}
      <Dialog open={resetConfirmOpen} onOpenChange={(o) => { if (!o) setResetConfirmOpen(false) }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Reset {selectedIds.length === 1 ? "override" : "overrides"}?</DialogTitle>
          </DialogHeader>
          <p className="text-sm">
            Client overrides for {selectedIds.length} selected {selectedIds.length === 1 ? "service" : "services"} will be removed. The default rate will apply instead.
          </p>
          <DialogFooter>
            <Button
              variant="destructive-solid"
              onClick={() => {
                onServicesChange(services.map((s) => {
                  if (!selectedIds.includes(s.id)) return s
                  const newOverrides = s.clientOverridesList.filter((o) => o.accountId !== accountId)
                  return { ...s, clientOverridesList: newOverrides, customRates: newOverrides.length }
                }))
                setSelectedIds([])
                setResetConfirmOpen(false)
              }}
            >
              Reset {selectedIds.length === 1 ? "override" : "overrides"}
            </Button>
            <Button variant="outline" onClick={() => setResetConfirmOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit client overrides panel */}
      {account && (
        <EditClientOverridesPanel
          open={setOverridesOpen}
          account={account}
          services={services}
          onClose={() => setSetOverridesOpen(false)}
          onSave={(updated) => { onServicesChange(updated); setSetOverridesOpen(false); setSelectedIds([]) }}
        />
      )}

      {/* CSV import panel */}
      <UpdateClientOverridesCsvPanel open={csvImportOpen} onClose={() => setCsvImportOpen(false)} />
    </div>
  )
}

// ─── Top tabs ─────────────────────────────────────────────────────────────────

const TOP_TABS = [
  { label: "Overview", badge: undefined },
  { label: "Info", badge: undefined },
  { label: "Docs", badge: undefined },
  { label: "Communication", badge: undefined },
  { label: "Organizers", badge: 3 },
  { label: "Requests", badge: 1 },
  { label: "Billing", badge: 4 },
  { label: "Transactions", badge: undefined },
  { label: "Proposals & ELs", badge: 1 },
  { label: "Notes", badge: undefined },
  { label: "Workflow", badge: undefined },
] as const

type TopTabLabel = (typeof TOP_TABS)[number]["label"]

const TOP_TAB_SLUG: Record<TopTabLabel, string> = {
  "Overview": "overview",
  "Info": "info",
  "Docs": "docs",
  "Communication": "communication",
  "Organizers": "organizers",
  "Requests": "requests",
  "Billing": "billing",
  "Transactions": "transactions",
  "Proposals & ELs": "proposals",
  "Notes": "notes",
  "Workflow": "workflow",
}
const TOP_SLUG_TAB: Record<string, TopTabLabel> = Object.fromEntries(
  Object.entries(TOP_TAB_SLUG).map(([k, v]) => [v, k as TopTabLabel])
)

export function AccountDetailPage({ accountId, onBack, services, onServicesChange, followed, onToggleFollow }: AccountDetailPageProps) {
  const [tabSlug, setTabSlug] = useQueryParam("tab", "overview")
  const [, setBillingTabSlug] = useQueryParam("billing_tab", "invoices")
  const activeTopTab: TopTabLabel = TOP_SLUG_TAB[tabSlug] ?? "Overview"
  const setActiveTopTab = (tab: TopTabLabel) => setTabSlug(TOP_TAB_SLUG[tab])

  const [, setPricingView] = useQueryParam("pricing_view", "all")

  const navigateToBillingPricing = () => {
    setTabSlug("billing")
    setBillingTabSlug("client_prices")
    setPricingView("custom")
  }

  const account = accounts.find((a) => a.id === accountId)

  if (!account) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Account not found</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Top tab bar */}
      <div className="flex shrink-0 items-center gap-0 border-b bg-background">
        {/* Back button */}
        <div className="flex shrink-0 items-center px-2">
          <Button size="icon" variant="ghost" onClick={onBack}>
            <IconArrowLeft className="size-4" />
          </Button>
        </div>

        {/* Divider */}
        <div className="h-5 w-px shrink-0 bg-border mr-3" />

        {/* Follow indicator */}
        {followed
          ? <IconEye className="mr-1.5 size-4 shrink-0 text-primary" />
          : <IconEyeOff className="mr-1.5 size-4 shrink-0 text-muted-foreground" />
        }

        {/* Account name */}
        <span className="shrink-0 pr-3 text-sm font-medium">{account.name}</span>

        {/* Divider */}
        <div className="h-5 w-px shrink-0 bg-border" />

        {/* Scrollable tabs */}
        <div className="flex min-w-0 overflow-x-auto pl-4">
          <ul className="flex">
            {TOP_TABS.map((tab) => (
              <li key={tab.label} className="shrink-0">
                <button
                  className={`flex h-[53px] items-center whitespace-nowrap mr-5 text-sm font-medium transition-colors border-b-2 ${
                    activeTopTab === tab.label
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setActiveTopTab(tab.label)}
                >
                  {tab.label}
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={TAB_BADGE_CLASS}>{tab.badge}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Page content */}
      <div className="flex-1 overflow-auto bg-workspace p-6">
        {activeTopTab === "Overview" ? (
          <div className="flex min-h-full items-start gap-5">
            <LeftPanel account={account} services={services} onViewClientOverrides={navigateToBillingPricing} followed={followed} onToggleFollow={onToggleFollow} />
            <RightPanel accountId={accountId} />
          </div>
        ) : activeTopTab === "Billing" ? (
          <InvoicesTabContent accountId={accountId} services={services} onServicesChange={onServicesChange} />
        ) : (
          <ProtoPlaceholder title={activeTopTab} />
        )}
      </div>
    </div>
  )
}
