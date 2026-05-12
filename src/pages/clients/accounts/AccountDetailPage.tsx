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
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { DataTableBulkActionsBar, DataTableToolbarSlot, DataTableToolbarGroup, DataTableToolbarSpacer } from "@/components/data-table/DataTableToolbar"
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
import { IconDotsVertical, IconSettings, IconTrash } from "@tabler/icons-react"

// ─── Types ───────────────────────────────────────────────────────────────────

type AccountDetailPageProps = {
  accountId: string
  onBack: () => void
  services: ServiceItem[]
  onServicesChange: (items: ServiceItem[]) => void
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const TAB_BADGE_CLASS =
  "text-[11px] font-bold bg-[#24C875] text-white rounded-full px-1.5 py-0.5 ml-1"

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
  actions: React.ReactNode
  defaultOpen?: boolean
  children?: React.ReactNode
}

function CollapsibleSection({
  title,
  count,
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
        </button>
        <div className="ml-auto flex items-center gap-3 text-sm text-primary">
          {actions}
        </div>
      </div>
      {open && (
        <div className="mt-3">
          {children ?? (
            <p className="pl-5 text-sm text-muted-foreground">None yet</p>
          )}
        </div>
      )}
    </div>
  )
}

function LeftPanel({
  account,
}: {
  account: NonNullable<ReturnType<typeof accounts.find>>
}) {
  const panelData = getAccountLeftPanel(account.id)

  const teamMembers = account.team.map(
    (initials) => teamMemberNames[initials] ?? initials
  )
  const overflowCount = Math.max(0, teamMembers.length - 3)
  const visibleMembers = teamMembers.slice(0, 3)

  return (
    <div className="w-72 shrink-0 rounded-xl border bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pb-4 pt-5">
        <span className="font-semibold">Account</span>
        <button
          className="text-sm text-primary hover:underline"
          onClick={protoAction("Unfollow account")}
        >
          Unfollow account
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
          <div className="-mx-5">
            {panelData.notes.map((note) => (
              <button
                key={note.id}
                className="w-full border-t px-5 py-3 text-left hover:bg-muted/50"
                onClick={protoAction(note.title)}
              >
                <p className="truncate text-sm font-medium">{note.title}</p>
                <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                  {note.body}
                </p>
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
        <div className="space-y-3 pl-5">
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
          <div className="space-y-3 pl-5">
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
          <div className="space-y-3 pl-5 pr-1">
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
  const [activeSubTab, setActiveSubTab] =
    React.useState<OverviewSubTab>("jobs")

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
      <div className="px-5 pb-0 pt-5">
        <h2 className="text-lg font-semibold">Overview</h2>
      </div>

      {/* Sub-tabs */}
      <div className="mt-3 flex border-b px-5 gap-0">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex items-center pb-2.5 pt-1 text-sm mr-5 border-b-2 transition-colors ${
              activeSubTab === tab.id
                ? "border-primary text-primary font-medium"
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

type InvoicesSubTab = "Invoices" | "Recurring invoices" | "Payments" | "Time entries" | "Custom rates"

function InvoicesTabContent({ accountId, services }: { accountId: string; services: ServiceItem[] }) {
  const [subTab, setSubTab] = React.useState<InvoicesSubTab>("Invoices")

  const accountInvoices = invoices.filter((inv) => inv.accountId === accountId)
  const paid = accountInvoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amountPaid, 0)
  const unpaid = accountInvoices.filter((i) => i.status !== "Paid").reduce((s, i) => s + i.balanceDue, 0)

  const fmt = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  return (
    <div className="flex flex-col gap-4">
      {/* Sub-tabs */}
      <div className="flex border-b">
        {(["Invoices", "Recurring invoices", "Payments", "Time entries", "Custom rates"] as InvoicesSubTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setSubTab(t)}
            className={`mr-6 shrink-0 whitespace-nowrap border-b-2 pb-2.5 pt-1 text-sm font-medium transition-colors ${
              subTab === t
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {subTab === "Invoices" ? (
        <>
          {/* Summary */}
          <div className="flex min-h-11 items-center gap-4 text-sm text-muted-foreground">
            <span>Invoices: <strong className="text-foreground">{accountInvoices.length}</strong></span>
            <div className="h-4 w-px bg-border" />
            <span>Paid: <strong className="text-foreground">{fmt(paid)}</strong></span>
            <div className="h-4 w-px bg-border" />
            <span>Unpaid: <strong className="text-foreground">{fmt(unpaid)}</strong></span>
          </div>

          {/* Toolbar */}
          <div className="flex min-h-11 items-center gap-2">
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
          </div>

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
      ) : subTab === "Custom rates" ? (
        <CustomRatesTabContent accountId={accountId} services={services} />
      ) : (
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">{subTab} — coming soon</p>
        </div>
      )}
    </div>
  )
}

function CustomRatesTabContent({ accountId, services }: { accountId: string; services: ServiceItem[] }) {
  const servicesWithOverride = services
    .filter((s) => s.clientOverridesList.some((o) => o.accountId === accountId))

  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const allSelected = servicesWithOverride.length > 0 && selectedIds.length === servicesWithOverride.length
  const toggleAll = () => setSelectedIds(allSelected ? [] : servicesWithOverride.map((s) => s.id))
  const toggleOne = (id: string) => setSelectedIds((prev) =>
    prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
  )

  const fmt = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  if (servicesWithOverride.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <IconReceiptDollar className="mb-5 size-14 text-muted-foreground/40" strokeWidth={1.25} />
        <h3 className="text-lg font-semibold">No custom rates yet</h3>
        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          This client uses your default service rates. Add a custom rate to override the price for any specific service.
        </p>
        <button
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          onClick={protoAction("Add custom rate")}
        >
          <IconCirclePlus className="size-4" />
          Add custom rate
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Toolbar */}
      {selectedIds.length > 0 ? (
        <DataTableBulkActionsBar
          selectedCount={selectedIds.length}
          onClearSelection={() => setSelectedIds([])}
          onSelectAll={() => setSelectedIds(servicesWithOverride.map((s) => s.id))}
          selectAllLabel="Select all custom rates"
          actions={[
            {
              icon: IconTrash,
              label: "Delete",
              onClick: protoAction("Custom rates deleted"),
            },
          ]}
        />
      ) : (
        <DataTableToolbarSlot>
          <DataTableToolbarGroup className="shrink-0">
            <Button size="xl" variant="ghost" onClick={protoAction("Filter")}>
              <IconFilter className="size-4" />
              Filter
              <IconChevronDown className="size-3.5" />
            </Button>
          </DataTableToolbarGroup>
          <DataTableToolbarSpacer />
          <DataTableToolbarGroup className="shrink-0">
            <Button size="xl" onClick={protoAction("Add custom rate")}>
              <IconCirclePlus className="size-4" />
              Add custom rate
            </Button>
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
              <TableHead>Service</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Rate type</TableHead>
              <TableHead className="text-right">Default rate</TableHead>
              <TableHead className="text-right">Custom rate</TableHead>
              <TableHead className="w-10 px-0" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {servicesWithOverride.map((svc) => {
              const override = svc.clientOverridesList.find((o) => o.accountId === accountId)!
              return (
                <TableRow key={svc.id} data-state={selectedIds.includes(svc.id) ? "selected" : undefined}>
                  <TableCell className="w-12">
                    <input type="checkbox" className="table-checkbox" checked={selectedIds.includes(svc.id)} onChange={() => toggleOne(svc.id)} />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{svc.name}</div>
                    {svc.description && (
                      <div className="text-xs text-muted-foreground">{svc.description}</div>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{svc.category}</TableCell>
                  <TableCell className="text-muted-foreground">{svc.rateType}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{fmt(svc.defaultRate)}</TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center justify-end gap-2">
                      <span className="font-medium text-primary">{fmt(override.rate)}</span>
                      {(() => {
                        const pct = ((override.rate - svc.defaultRate) / svc.defaultRate) * 100
                        const sign = pct > 0 ? "+" : ""
                        const color = pct > 0
                          ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                        return (
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${color}`}>
                            {sign}{Math.round(pct)}%
                          </span>
                        )
                      })()}
                    </div>
                  </TableCell>
                  <TableCell className="w-10 px-0">
                    <Button size="icon-xl" variant="ghost" onClick={protoAction("Custom rate actions")}>
                      <IconDotsVertical className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
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
  { label: "Invoices", badge: 4 },
  { label: "Transactions", badge: undefined },
  { label: "Proposals & ELs", badge: 1 },
  { label: "Notes", badge: undefined },
  { label: "Workflow", badge: undefined },
] as const

type TopTabLabel = (typeof TOP_TABS)[number]["label"]

export function AccountDetailPage({ accountId, onBack, services, onServicesChange }: AccountDetailPageProps) {
  const [activeTopTab, setActiveTopTab] =
    React.useState<TopTabLabel>("Overview")

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

        {/* Account name */}
        <span className="shrink-0 pr-3 text-sm font-medium">{account.name}</span>

        {/* Divider */}
        <div className="h-5 w-px shrink-0 bg-border" />

        {/* Scrollable tabs */}
        <div className="flex min-w-0 overflow-x-auto">
          <ul className="flex">
            {TOP_TABS.map((tab) => (
              <li key={tab.label} className="shrink-0">
                <button
                  className={`flex h-[49px] items-center whitespace-nowrap px-4 text-sm transition-colors ${
                    activeTopTab === tab.label
                      ? "border-b-2 border-primary font-medium text-primary"
                      : "text-muted-foreground hover:text-foreground"
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
            <LeftPanel account={account} />
            <RightPanel accountId={accountId} />
          </div>
        ) : activeTopTab === "Invoices" ? (
          <InvoicesTabContent accountId={accountId} services={services} />
        ) : (
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">
              {activeTopTab} — coming soon
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
